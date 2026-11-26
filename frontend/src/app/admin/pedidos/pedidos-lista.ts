import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PAYMENT_LABEL } from '../../models/order';
import { Page } from '../../models/page';
import { formatPrice } from '../../shared/format';
import { apiError } from '../admin-auth.service';
import { formatDateTime } from '../reclamos/reclamo.models';
import { ORDER_STATUS, OrderStatus, OrderSummary, OrdersAdmin } from './pedidos.service';

@Component({
  selector: 'app-pedidos-lista',
  imports: [RouterLink],
  styleUrls: ['../admin-ui.css', '../reclamos/reclamos-lista.css'],
  templateUrl: './pedidos-lista.html',
})
export class PedidosLista implements OnInit {
  private readonly api = inject(OrdersAdmin);
  private seq = 0;

  protected readonly statuses = Object.entries(ORDER_STATUS) as [OrderStatus, string][];
  protected readonly pending = this.api.pending;

  /** Por defecto, lo que hay que atender. */
  protected readonly status = signal<OrderStatus | ''>('PENDING');
  protected readonly code = signal('');
  /** Promociones: '' todos, 'yes' aceptaron, 'no' no aceptaron. */
  protected readonly marketing = signal<'' | 'yes' | 'no'>('');
  protected readonly pageIndex = signal(0);
  protected readonly result = signal<Page<OrderSummary> | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  /** El código se filtra dentro de la página cargada (la API aún no busca por código). */
  protected readonly rows = computed(() => {
    const code = this.code().trim().toUpperCase();
    return (this.result()?.content ?? [])
      .filter((o) => !code || o.code.includes(code))
      .map((o) => ({
        o,
        status: ORDER_STATUS[o.status],
        meta: `${formatDateTime(o.createdAt)} · ${o.districtName} · ${PAYMENT_LABEL[o.paymentMethod]}`,
        total: formatPrice(o.total),
      }));
  });

  ngOnInit(): void {
    void this.load();
  }

  protected setStatus(v: string): void {
    this.status.set(v as OrderStatus | '');
    this.pageIndex.set(0);
    void this.load();
  }

  protected setMarketing(v: string): void {
    this.marketing.set(v as '' | 'yes' | 'no');
    this.pageIndex.set(0);
    void this.load();
  }

  protected go(delta: number): void {
    this.pageIndex.update((p) => Math.max(0, p + delta));
    void this.load();
  }

  protected async load(): Promise<void> {
    const mine = ++this.seq;
    this.loading.set(true);
    this.error.set('');
    void this.api.refreshPending();
    try {
      const m = this.marketing();
      const page = await this.api.list(this.status(), this.pageIndex(), 20, m === '' ? null : m === 'yes');
      if (mine === this.seq) {
        this.result.set(page);
      }
    } catch (e) {
      if (mine === this.seq) {
        this.error.set(apiError(e, 'No se pudieron cargar los pedidos.'));
      }
    } finally {
      if (mine === this.seq) {
        this.loading.set(false);
      }
    }
  }
}
