import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../core/config';
import { formatPrice } from '../../shared/format';
import { apiError } from '../admin-auth.service';
import { formatDate } from '../reclamos/reclamo.models';

/** Forma de `SalesReportResponse`: solo pedidos confirmados, por fecha de confirmación (Lima). */
interface SalesReport {
  from: string;
  to: string;
  orders: number;
  revenue: number;
  productsRevenue: number;
  deliveryRevenue: number;
  averageTicket: number;
  days: { date: string; orders: number; revenue: number }[];
  topProducts: { name: string; units: number; revenue: number }[];
  inventory: { units: number; valueAtSalePrice: number };
}

@Component({
  selector: 'app-ventas',
  styleUrls: ['../admin-ui.css', '../reclamos/reclamos-lista.css', './ventas.css'],
  templateUrl: './ventas.html',
})
export class Ventas implements OnInit {
  private readonly http = inject(HttpClient);
  private seq = 0;

  protected readonly from = signal('');
  protected readonly to = signal('');
  protected readonly report = signal<SalesReport | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  protected readonly view = computed(() => {
    const r = this.report();
    if (!r) {
      return null;
    }
    return {
      range: `${formatDate(r.from)} al ${formatDate(r.to)}`,
      tiles: [
        { label: 'Ventas', value: formatPrice(r.revenue), note: 'Total cobrado, con delivery' },
        { label: 'Pedidos confirmados', value: String(r.orders), note: '' },
        { label: 'Ticket promedio', value: formatPrice(r.averageTicket), note: 'Ventas entre pedidos' },
        { label: 'Productos', value: formatPrice(r.productsRevenue), note: 'Ventas sin delivery' },
        { label: 'Delivery', value: formatPrice(r.deliveryRevenue), note: 'Tarifas cobradas' },
      ],
      // Del día más reciente al más antiguo.
      days: [...r.days]
        .reverse()
        .map((d) => ({ date: formatDate(d.date), orders: d.orders, revenue: formatPrice(d.revenue) })),
      top: r.topProducts.map((p) => ({ ...p, revenue: formatPrice(p.revenue) })),
      stockUnits: r.inventory.units,
      stockValue: formatPrice(r.inventory.valueAtSalePrice),
    };
  });

  ngOnInit(): void {
    void this.load();
  }

  protected setRange(key: 'from' | 'to', value: string): void {
    this[key].set(value);
    void this.load();
  }

  protected async load(): Promise<void> {
    const mine = ++this.seq;
    this.loading.set(true);
    this.error.set('');
    let params = new HttpParams();
    if (this.from()) params = params.set('from', this.from());
    if (this.to()) params = params.set('to', this.to());
    try {
      const r = await firstValueFrom(
        this.http.get<SalesReport>(`${API_URL}/admin/reports/sales`, { params }),
      );
      if (mine === this.seq) {
        this.report.set(r);
        this.from.set(r.from);
        this.to.set(r.to);
      }
    } catch (e) {
      if (mine === this.seq) {
        this.error.set(apiError(e, 'No se pudieron cargar las ventas.'));
      }
    } finally {
      if (mine === this.seq) {
        this.loading.set(false);
      }
    }
  }
}
