import { Component, ElementRef, Injector, afterNextRender, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LEGAL, SHOW_PENDING } from '../../../core/config';
import {
  ComplaintService,
  CreatedComplaint,
  NOT_REGISTERED,
  complaintCopyUrl,
  complaintFailure,
  isRealComplaint,
} from '../../../services/complaint.service';
import { FormField } from '../../../shared/form-field';

/** Mismas reglas que `CreateComplaintRequest` y `ValidDocument` del backend. */
const NAME = /^[\p{L} .'-]+$/u;
const PHONE = /^[0-9+() -]{6,20}$/;
const AMOUNT = /^\d{1,8}([.,]\d{1,2})?$/;
const DOC = { DNI: /^\d{8}$/, CE: /^[A-Za-z0-9]{8,12}$/ } as const;

export const LIMITS = {
  consumerName: 160,
  address: 255,
  email: 120,
  guardianName: 160,
  goodDescription: 500,
  detail: 2000,
  consumerRequest: 1000,
} as const;

/** Obligatorio y con algo más que espacios (`@NotBlank`). */
function notBlank(c: AbstractControl<string>): ValidationErrors | null {
  return c.value.trim() ? null : { required: true };
}

/** El documento depende del tipo elegido (DNI o CE). */
function documentValid(c: AbstractControl<string>): ValidationErrors | null {
  const type = c.parent?.get('documentType')?.value as 'DNI' | 'CE' | undefined;
  if (!c.value || !type) {
    return null;
  }
  return DOC[type].test(c.value) ? null : { document: type };
}

/** El nombre del padre, madre o apoderado es obligatorio si el consumidor es menor de edad. */
function guardianRequired(c: AbstractControl<string>): ValidationErrors | null {
  return c.parent?.get('minor')?.value && !c.value.trim() ? { required: true } : null;
}

const MESSAGES: Record<string, Record<string, string>> = {
  consumerName: {
    required: 'Ingresa tu nombre.',
    pattern: 'Usa solo letras, espacios, punto, guion o apóstrofe.',
  },
  documentType: { required: 'Elige DNI o CE.' },
  documentNumber: {
    required: 'Ingresa tu documento.',
    document: '',
  },
  address: { required: 'Ingresa tu domicilio.' },
  phone: { required: 'Ingresa tu teléfono.', pattern: 'Usa de 6 a 20 dígitos (puedes usar + ( ) -).' },
  email: { required: 'Ingresa tu e-mail.', email: 'Revisa el formato del e-mail.' },
  guardianName: {
    required: 'Ingresa el nombre del padre, madre o apoderado.',
    pattern: 'Usa solo letras, espacios, punto, guion o apóstrofe.',
  },
  goodType: { required: 'Elige producto o servicio.' },
  claimedAmount: { pattern: 'Usa un monto como 45.50 (hasta 8 cifras y 2 decimales).' },
  goodDescription: { required: 'Describe el producto o servicio.' },
  complaintType: { required: 'Elige reclamo o queja.' },
  detail: { required: 'Escribe el detalle.' },
  consumerRequest: { required: 'Escribe tu pedido.' },
  privacyAccepted: { required: 'Debes aceptar la política de privacidad.' },
};

type FieldName = keyof typeof MESSAGES;

const DATE = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * Hoja de Reclamación virtual: mismas secciones, campos y orden que el PDF oficial.
 * Los datos viven solo en memoria (nada en localStorage ni en la consola) y se borran al enviar.
 */
@Component({
  selector: 'app-complaint-form',
  imports: [ReactiveFormsModule, RouterLink, FormField],
  templateUrl: './complaint-form.html',
  styleUrls: ['../pedido/pedido.css', './complaint-form.css'],
})
export class ComplaintForm {
  private readonly complaints = inject(ComplaintService);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly injector = inject(Injector);

  protected readonly sheet = LEGAL.complaints;
  protected readonly showPending = SHOW_PENDING;
  protected readonly limits = LIMITS;

  protected readonly sending = signal(false);
  protected readonly failure = signal('');
  protected readonly created = signal<{ code: string; date: string; copyUrl: string } | null>(
    null,
  );

  protected readonly form = this.fb.group({
    consumerName: ['', [notBlank, Validators.maxLength(LIMITS.consumerName), Validators.pattern(NAME)]],
    documentType: this.fb.control<'DNI' | 'CE' | null>(null, Validators.required),
    documentNumber: ['', [notBlank, documentValid]],
    address: ['', [notBlank, Validators.maxLength(LIMITS.address)]],
    phone: ['', [notBlank, Validators.pattern(PHONE)]],
    email: ['', [notBlank, Validators.email, Validators.maxLength(LIMITS.email)]],
    minor: [false],
    guardianName: [
      '',
      [guardianRequired, Validators.maxLength(LIMITS.guardianName), Validators.pattern(NAME)],
    ],
    goodType: this.fb.control<'PRODUCT' | 'SERVICE' | null>(null, Validators.required),
    claimedAmount: ['', Validators.pattern(AMOUNT)],
    goodDescription: ['', [notBlank, Validators.maxLength(LIMITS.goodDescription)]],
    complaintType: this.fb.control<'CLAIM' | 'COMPLAINT' | null>(null, Validators.required),
    detail: ['', [notBlank, Validators.maxLength(LIMITS.detail)]],
    consumerRequest: ['', [notBlank, Validators.maxLength(LIMITS.consumerRequest)]],
    privacyAccepted: [false, Validators.requiredTrue],
    /** Honeypot: oculto para personas y lectores de pantalla. */
    website: [''],
  });

  /** Cambia con cada evento del formulario para refrescar errores y contadores. */
  private readonly formEvent = toSignal(this.form.events, { initialValue: null });
  protected readonly isMinor = toSignal(this.form.controls.minor.valueChanges, {
    initialValue: false,
  });

  constructor() {
    const c = this.form.controls;
    c.documentType.valueChanges.subscribe(() => c.documentNumber.updateValueAndValidity());
    c.minor.valueChanges.subscribe((minor) => {
      if (!minor) {
        c.guardianName.setValue('');
        c.guardianName.markAsUntouched();
      }
      c.guardianName.updateValueAndValidity();
    });
  }

  /** Mensaje de error de un campo, solo después de tocarlo. */
  protected error(name: FieldName): string {
    this.formEvent();
    const control = this.form.get(name);
    if (!control?.touched || !control.errors) {
      return '';
    }
    const key = Object.keys(control.errors)[0];
    if (key === 'server') {
      return control.errors['server'];
    }
    if (key === 'document') {
      return control.errors['document'] === 'DNI'
        ? 'El DNI debe tener 8 dígitos.'
        : 'El CE debe tener entre 8 y 12 letras o números.';
    }
    if (key === 'maxlength') {
      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres.`;
    }
    return MESSAGES[name][key] || MESSAGES[name]['required'] || 'Revisa este campo.';
  }

  protected invalid(name: FieldName): boolean {
    return this.error(name) !== '';
  }

  /** Contador de caracteres de los textos largos. */
  protected count(name: 'goodDescription' | 'detail' | 'consumerRequest'): string {
    this.formEvent();
    return `${this.form.controls[name].value.length} / ${LIMITS[name]}`;
  }

  /** DNI: solo dígitos (8). CE: solo letras y números (12). */
  protected cleanDocument(event: Event): void {
    const input = event.target as HTMLInputElement;
    const dni = this.form.controls.documentType.value !== 'CE';
    const clean = input.value.replace(dni ? /\D/g : /[^A-Za-z0-9]/g, '').slice(0, dni ? 8 : 12);
    if (clean !== input.value) {
      input.value = clean;
    }
    this.form.controls.documentNumber.setValue(clean);
  }

  protected async submit(): Promise<void> {
    if (this.sending()) {
      return;
    }
    this.failure.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }
    const v = this.form.getRawValue();
    if (!v.documentType || !v.goodType || !v.complaintType) {
      return;
    }
    this.sending.set(true);
    try {
      const res = await this.complaints.create({
        consumerName: v.consumerName.trim(),
        documentType: v.documentType,
        documentNumber: v.documentNumber.trim(),
        address: v.address.trim(),
        phone: v.phone.trim(),
        email: v.email.trim(),
        guardianName: v.minor ? v.guardianName.trim() : null,
        goodType: v.goodType,
        claimedAmount: v.claimedAmount ? Number(v.claimedAmount.replace(',', '.')) : null,
        goodDescription: v.goodDescription.trim(),
        complaintType: v.complaintType,
        detail: v.detail.trim(),
        consumerRequest: v.consumerRequest.trim(),
        privacyAccepted: v.privacyAccepted,
        website: v.website,
      });
      if (!isRealComplaint(res)) {
        // El servidor no guardó nada (honeypot): nunca decir "registrado".
        this.failure.set(NOT_REGISTERED);
        return;
      }
      this.done(res);
    } catch (error) {
      const failure = complaintFailure(error);
      const controls: Record<string, AbstractControl> = this.form.controls;
      const other: string[] = [];
      for (const [field, message] of Object.entries(failure.fields)) {
        const control = controls[field];
        if (control) {
          control.setErrors({ server: message });
          control.markAsTouched();
        } else {
          other.push(message);
        }
      }
      this.failure.set([failure.message, ...other].join(' '));
      this.focusFirstInvalid();
    } finally {
      this.sending.set(false);
    }
  }

  /** Muestra el N° y la copia; los datos personales se borran de la memoria. */
  private done(res: CreatedComplaint): void {
    this.created.set({
      code: res.code,
      date: DATE.format(new Date(`${res.filedOn}T00:00:00Z`)),
      copyUrl: complaintCopyUrl(res),
    });
    this.form.reset();
    afterNextRender(
      () => this.host.nativeElement.querySelector<HTMLElement>('#claim-done-title')?.focus(),
      { injector: this.injector },
    );
  }

  private focusFirstInvalid(): void {
    this.host.nativeElement
      .querySelector<HTMLElement>(
        'input.ng-invalid:not([name="website"]), textarea.ng-invalid, .alert',
      )
      ?.focus();
  }
}
