import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { apiError } from '../admin-auth.service';
import {
  ComplaintDetail,
  deadlineText,
  emailLabel,
  formatDate,
  formatDateTime,
  goodLabel,
  limaToday,
  statusLabel,
  typeLabel,
} from './reclamo.models';
import { ComplaintsAdmin } from './reclamos.service';

const MAX_RESPONSE = 1000;

@Component({
  selector: 'app-reclamo-detalle',
  imports: [RouterLink],
  styleUrls: ['../admin-ui.css', './reclamo-detalle.css'],
  templateUrl: './reclamo-detalle.html',
})
export class ReclamoDetalle implements OnInit {
  private readonly api = inject(ComplaintsAdmin);
  private readonly route = inject(ActivatedRoute);
  private id = '';

  protected readonly c = signal<ComplaintDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  protected readonly text = signal('');
  protected readonly date = signal(limaToday());
  protected readonly confirming = signal(false);
  protected readonly saving = signal(false);
  protected readonly formError = signal('');

  protected readonly max = MAX_RESPONSE;
  protected readonly today = limaToday();

  protected readonly view = computed(() => {
    const c = this.c();
    if (!c) {
      return null;
    }
    return {
      filed: formatDateTime(c.filedAt),
      kind: typeLabel(c.complaintType),
      good: goodLabel(c.goodType),
      status: statusLabel(c.status),
      deadline: deadlineText(c.deadline),
      due: formatDate(c.deadline.dueOn),
      minDate: c.filedAt.slice(0, 10),
      responseDate: c.responseDate ? formatDate(c.responseDate) : '',
      consumerEmail: emailLabel(c.consumerEmail),
      ownerEmail: emailLabel(c.ownerEmail),
      amount: c.claimedAmount == null ? '' : `S/ ${c.claimedAmount.toFixed(2)}`,
      pdf: this.api.pdfUrl(c.id),
    };
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    void this.load();
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.c.set(await this.api.detail(this.id));
    } catch (e) {
      this.error.set(apiError(e, 'No se pudo cargar el reclamo.'));
    } finally {
      this.loading.set(false);
    }
  }

  protected ask(event: Event): void {
    event.preventDefault();
    const err = this.validate();
    this.formError.set(err);
    this.confirming.set(!err);
  }

  protected cancel(): void {
    this.confirming.set(false);
  }

  protected async save(): Promise<void> {
    if (this.saving()) {
      return;
    }
    this.saving.set(true);
    this.formError.set('');
    try {
      this.c.set(await this.api.respond(this.id, this.text().trim(), this.date()));
      this.confirming.set(false);
    } catch (e) {
      this.confirming.set(false);
      this.formError.set(apiError(e, 'No se pudo registrar la respuesta.'));
    } finally {
      this.saving.set(false);
    }
  }

  private validate(): string {
    if (!this.text().trim()) {
      return 'Escribe las observaciones y acciones adoptadas.';
    }
    if (this.text().length > MAX_RESPONSE) {
      return `Máximo ${MAX_RESPONSE} caracteres.`;
    }
    if (!this.date()) {
      return 'Indica la fecha de comunicación de la respuesta.';
    }
    if (this.date() > this.today) {
      return 'La fecha de comunicación no puede ser futura.';
    }
    const c = this.c();
    if (c && this.date() < c.filedAt.slice(0, 10)) {
      return 'La fecha no puede ser anterior a la del reclamo.';
    }
    return '';
  }
}
