import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { District } from '../../../models/district';
import { CartService, lineTotals } from '../../../services/cart.service';
import { DeliveryService } from '../../../services/delivery.service';
import { FormField } from '../../../shared/form-field';
import { formatPrice } from '../../../shared/format';
import { LegalNotice } from '../../../shared/legal-notice';
import { RevealDirective } from '../../../shared/reveal.directive';
import { StatePanel } from '../../../shared/state-panel';

/** Mismas reglas que `CreateOrderRequest` del backend. */
const NAME = /^[\p{L} .'-]{1,80}$/u;

const MESSAGES = {
  firstName: {
    required: 'Ingresa tus nombres.',
    pattern: 'Usa solo letras, espacios, punto, guion o apóstrofe.',
  },
  lastName: {
    required: 'Ingresa tus apellidos.',
    pattern: 'Usa solo letras, espacios, punto, guion o apóstrofe.',
  },
  phone: { required: 'Ingresa tu celular.', pattern: 'El celular debe tener 9 dígitos.' },
  dni: { required: 'Ingresa tu DNI.', pattern: 'El DNI debe tener 8 dígitos.' },
  districtId: { required: 'Elige tu distrito.' },
  address: { required: 'Ingresa tu dirección.', maxlength: 'Máximo 255 caracteres.' },
  reference: { maxlength: 'Máximo 255 caracteres.' },
  paymentMethod: { required: 'Elige cómo pagarás.' },
  adultConfirmed: { required: 'Debes confirmar que eres mayor de 18 años.' },
  termsAccepted: { required: 'Debes aceptar los términos y condiciones.' },
  privacyAccepted: { required: 'Debes aceptar la política de privacidad.' },
} as const;

type FieldName = keyof typeof MESSAGES;

@Component({
  selector: 'app-pedido',
  imports: [LegalNotice, ReactiveFormsModule, RouterLink, FormField, RevealDirective, StatePanel],
  templateUrl: './pedido.html',
  styleUrl: './pedido.css',
})
export class Pedido {
  protected readonly cart = inject(CartService);
  protected readonly delivery = inject(DeliveryService);
  private readonly fb = inject(NonNullableFormBuilder);

  // El DNI no se guarda en el navegador: el formulario vive solo en memoria.
  protected readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(NAME)]],
    lastName: ['', [Validators.required, Validators.pattern(NAME)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    districtId: this.fb.control<number | null>(null, Validators.required),
    address: ['', [Validators.required, Validators.maxLength(255)]],
    reference: ['', Validators.maxLength(255)],
    paymentMethod: this.fb.control<'YAPE' | 'PLIN' | null>(null, Validators.required),
    adultConfirmed: [false, Validators.requiredTrue],
    termsAccepted: [false, Validators.requiredTrue],
    privacyAccepted: [false, Validators.requiredTrue],
  });

  /** Cambia con cada evento del formulario (valor, toque, estado) para refrescar errores. */
  private readonly formEvent = toSignal(this.form.events, { initialValue: null });
  private readonly districtId = toSignal(this.form.controls.districtId.valueChanges, {
    initialValue: null,
  });

  /** Distritos agrupados por zona, de la tarifa menor a la mayor. */
  protected readonly zones = computed(() => {
    const byZone = new Map<string, { name: string; fee: number; districts: District[] }>();
    for (const d of this.delivery.districts()) {
      const zone = byZone.get(d.zoneName) ?? { name: d.zoneName, fee: d.fee, districts: [] };
      zone.districts.push(d);
      byZone.set(d.zoneName, zone);
    }
    return [...byZone.values()].sort((a, b) => a.fee - b.fee);
  });
  protected readonly district = computed(
    () => this.delivery.districts().find((d) => d.id === this.districtId()) ?? null,
  );

  protected readonly rows = computed(() =>
    this.cart
      .lines()
      .filter((l) => l.available)
      .map((l) => ({
        id: l.productId,
        name: l.name,
        qty: l.quantity,
        total: formatPrice(lineTotals(l).net / 100),
      })),
  );
  protected readonly hasUnavailable = computed(() => this.cart.lines().some((l) => !l.available));
  protected readonly subtotal = computed(() => formatPrice(this.cart.totals().gross));
  protected readonly discount = computed(() => formatPrice(this.cart.totals().discount));
  protected readonly fee = computed(() => {
    const d = this.district();
    return d ? formatPrice(d.fee) : '';
  });
  protected readonly total = computed(() => {
    const fee = this.district()?.fee ?? 0;
    return formatPrice(Math.round((this.cart.totals().net + fee) * 100) / 100);
  });

  constructor() {
    void this.delivery.load();
  }

  /** Mensaje de error de un campo, solo después de tocarlo. */
  protected error(name: FieldName): string {
    this.formEvent();
    const control = this.form.controls[name];
    if (!control.touched || !control.errors) {
      return '';
    }
    const messages: Record<string, string> = MESSAGES[name];
    const key = Object.keys(control.errors)[0];
    return messages[key] ?? messages['required'] ?? 'Revisa este campo.';
  }

  protected invalid(name: FieldName): boolean {
    return this.error(name) !== '';
  }

  /** Solo dígitos y largo máximo, para celular y DNI. */
  protected digits(name: 'phone' | 'dni', max: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const clean = input.value.replace(/\D/g, '').slice(0, max);
    if (clean !== input.value) {
      input.value = clean;
    }
    this.form.controls[name].setValue(clean);
  }
}
