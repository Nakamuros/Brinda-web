import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { apiError } from '../admin-auth.service';
import { amount, wholeNumber } from './producto-form';
import { AdminProduct, ProductsAdmin } from './productos.service';

interface Line {
  productId: string;
  quantity: string;
}

const MAX_ITEMS = 10;

/**
 * Crear un combo: producto con stock propio y composición fija. Al crearlo se arman sus primeras
 * unidades (se descuentan del stock de sus productos). La foto y las ofertas se ponen luego en su ficha.
 */
@Component({
  selector: 'app-combo-nuevo',
  imports: [RouterLink],
  styleUrls: ['../admin-ui.css', '../reclamos/reclamo-detalle.css', './productos.css'],
  templateUrl: './combo-nuevo.html',
})
export class ComboNuevo implements OnInit {
  private readonly api = inject(ProductsAdmin);
  private readonly router = inject(Router);

  protected readonly products = signal<AdminProduct[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  protected readonly name = signal('');
  protected readonly description = signal('');
  protected readonly price = signal('');
  protected readonly units = signal('1');
  protected readonly available = signal(true);
  protected readonly lines = signal<Line[]>([{ productId: '', quantity: '1' }]);
  protected readonly maxItems = MAX_ITEMS;

  protected readonly saving = signal(false);
  protected readonly formError = signal('');

  ngOnInit(): void {
    void this.load();
  }

  /** Productos que pueden componer un combo (no otros combos). La API entrega hasta 50 por página. */
  protected async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const page = await this.api.list(
        { q: '', categoryId: null, visibility: 'ALL', lowStock: false, page: 0 },
        50,
      );
      this.products.set(page.content.filter((p) => p.productType === 'PRODUCT'));
    } catch (e) {
      this.error.set(apiError(e, 'No se pudieron cargar los productos.'));
    } finally {
      this.loading.set(false);
    }
  }

  protected setLine(index: number, key: keyof Line, value: string): void {
    this.lines.update((ls) => ls.map((l, i) => (i === index ? { ...l, [key]: value } : l)));
  }

  protected addLine(): void {
    this.lines.update((ls) => [...ls, { productId: '', quantity: '1' }]);
  }

  protected removeLine(index: number): void {
    this.lines.update((ls) => ls.filter((_, i) => i !== index));
  }

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    if (this.saving()) {
      return;
    }
    const price = amount(this.price());
    const unitsToBuild = wholeNumber(this.units(), 1, 1000);
    const items = this.lines().map((l) => ({
      productId: l.productId,
      quantity: wholeNumber(l.quantity, 1, 100),
    }));
    const error = !this.name().trim()
      ? 'Escribe el nombre del combo.'
      : price === null
        ? 'El precio debe ser mayor que cero, con hasta dos decimales.'
        : items.some((i) => !i.productId || i.quantity === null)
          ? 'Cada línea necesita un producto y una cantidad entre 1 y 100.'
          : new Set(items.map((i) => i.productId)).size !== items.length
            ? 'Hay un producto repetido: súmalo en una sola línea.'
            : unitsToBuild === null
              ? 'Indica cuántos combos armar ahora (de 1 a 1000).'
              : '';
    if (error || price === null || unitsToBuild === null) {
      this.formError.set(error);
      return;
    }
    this.saving.set(true);
    this.formError.set('');
    try {
      const created = await this.api.createCombo({
        name: this.name().trim(),
        description: this.description().trim() || null,
        imageUrl: null,
        price,
        minStock: 0,
        maxStock: 0,
        featured: false,
        available: this.available(),
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity! })),
        unitsToBuild,
      });
      await this.router.navigate(['/admin/productos', created.combo.id]);
    } catch (e) {
      this.formError.set(apiError(e, 'No se pudo crear el combo.'));
    } finally {
      this.saving.set(false);
    }
  }
}
