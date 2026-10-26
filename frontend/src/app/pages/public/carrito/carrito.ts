import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService, lineTotals } from '../../../services/cart.service';
import { CatalogService } from '../../../services/catalog.service';
import { BottlePlaceholder } from '../../../shared/bottle-placeholder';
import { formatPrice } from '../../../shared/format';
import { QtyStepper } from '../../../shared/qty-stepper';
import { RevealDirective } from '../../../shared/reveal.directive';
import { RiseDirective } from '../../../shared/rise.directive';
import { StatePanel } from '../../../shared/state-panel';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink, BottlePlaceholder, QtyStepper, RevealDirective, RiseDirective, StatePanel],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  protected readonly cart = inject(CartService);
  private readonly catalog = inject(CatalogService);

  protected readonly rows = computed(() =>
    this.cart.lines().map((line) => {
      const t = lineTotals(line);
      return {
        line,
        total: formatPrice(t.net / 100),
        unit: formatPrice(line.finalPrice),
        was: line.price > line.finalPrice ? formatPrice(line.price) : '',
        free: t.free,
        promo:
          line.promoBuy && line.promoPay ? `Lleva ${line.promoBuy}, paga ${line.promoPay}` : '',
      };
    }),
  );
  protected readonly gross = computed(() => formatPrice(this.cart.totals().gross));
  protected readonly discount = computed(() => formatPrice(this.cart.totals().discount));
  protected readonly net = computed(() => formatPrice(this.cart.totals().net));

  constructor() {
    void this.catalog.load();
    // Precios y disponibilidad al día en cuanto carga el catálogo.
    effect(() => {
      if (this.catalog.status() === 'ready') {
        this.cart.sync(this.catalog.products());
      }
    });
  }
}
