import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category } from '../../models/category';
import { BottlePlaceholder } from '../../shared/bottle-placeholder';
import { formatPrice } from '../../shared/format';
import { apiError } from '../admin-auth.service';
import { formatDateTime } from '../reclamos/reclamo.models';
import {
  AdminProduct,
  ComboDetail,
  MOVEMENT_LABEL,
  Movement,
  ProductRequest,
  ProductsAdmin,
  stockLabel,
} from './productos.service';

interface Draft {
  name: string;
  categoryId: string;
  sku: string;
  description: string;
  price: string;
  imageUrl: string;
  minStock: string;
  maxStock: string;
  available: boolean;
  featured: boolean;
}

const EMPTY: Draft = {
  name: '',
  categoryId: '',
  sku: '',
  description: '',
  price: '',
  imageUrl: '',
  minStock: '0',
  maxStock: '0',
  available: true,
  featured: false,
};

/** Los mismos límites que el backend (`ImageStore`). */
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

/** Entero dentro de un rango, o null si el texto no es un entero válido. */
export function wholeNumber(text: string, min: number, max: number): number | null {
  const n = Number(text);
  return /^-?\d+$/.test(text.trim()) && n >= min && n <= max ? n : null;
}

/** Importe en soles con hasta 2 decimales y mayor que cero, o null. */
export function amount(text: string): number | null {
  const n = Number(text);
  return /^\d{1,8}(\.\d{1,2})?$/.test(text.trim()) && n >= 0.01 ? n : null;
}

/** Crear o editar un producto. Al editar se suman el stock (reponer, ajustar) y la oferta. */
@Component({
  selector: 'app-producto-form',
  imports: [RouterLink, BottlePlaceholder],
  styleUrls: ['../admin-ui.css', '../reclamos/reclamo-detalle.css', './productos.css'],
  templateUrl: './producto-form.html',
})
export class ProductoForm implements OnInit {
  private readonly api = inject(ProductsAdmin);
  private readonly router = inject(Router);
  protected readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id');

  protected readonly categories = signal<Category[]>([]);
  protected readonly p = signal<AdminProduct | null>(null);
  protected readonly loading = signal(!!this.id);
  protected readonly error = signal('');

  protected readonly d = signal<Draft>(EMPTY);
  protected readonly saving = signal(false);
  protected readonly formError = signal('');
  protected readonly saved = signal(false);

  // Foto
  protected readonly uploading = signal(false);
  protected readonly uploadError = signal('');
  /** Foto recién subida, aún sin guardar en el producto. */
  protected readonly uploaded = signal<string | null>(null);
  protected readonly photo = computed(() => this.uploaded() ?? this.p()?.imageUrl ?? null);

  // Stock
  protected readonly restockQty = signal('');
  protected readonly restockReason = signal('');
  protected readonly adjustQty = signal('');
  protected readonly adjustReason = signal('');
  protected readonly stockError = signal('');
  protected readonly stockBusy = signal(false);

  // Combo (solo si el producto es un combo) e historial de stock
  protected readonly combo = signal<ComboDetail | null>(null);
  protected readonly buildQty = signal('');
  protected readonly movements = signal<Movement[]>([]);
  protected readonly history = computed(() =>
    this.movements().map((m) => ({
      id: m.id,
      label: MOVEMENT_LABEL[m.type] ?? m.type,
      change: `${m.quantityChange > 0 ? '+' : ''}${m.quantityChange}`,
      after: m.stockAfter,
      reason: m.reason ?? '',
      date: formatDateTime(m.createdAt),
    })),
  );

  // Promoción "lleva N, paga M"
  protected readonly promoBuy = signal('');
  protected readonly promoPay = signal('');
  protected readonly promoEnds = signal('');

  // Oferta
  protected readonly offerPrice = signal('');
  protected readonly offerEnds = signal('');
  protected readonly offerError = signal('');
  protected readonly offerBusy = signal(false);

  protected readonly view = computed(() => {
    const p = this.p();
    if (!p) {
      return null;
    }
    return {
      stock: stockLabel(p),
      price: formatPrice(p.price),
      offer: p.discountPrice == null ? '' : formatPrice(p.discountPrice),
      offerEnds: p.offerEndsAt ? formatDateTime(p.offerEndsAt) : '',
      promo: p.promoBuy && p.promoPay ? `Lleva ${p.promoBuy}, paga ${p.promoPay}` : '',
      promoEnds: p.promoEndsAt ? formatDateTime(p.promoEndsAt) : '',
      isCombo: p.productType === 'COMBO',
    };
  });

  ngOnInit(): void {
    this.api.categories().then(
      (c) => this.categories.set(c),
      () => this.error.set('No se pudieron cargar las categorías.'),
    );
    if (this.id) {
      void this.load();
    }
  }

  protected set<K extends keyof Draft>(key: K, value: Draft[K]): void {
    this.d.update((d) => ({ ...d, [key]: value }));
    this.saved.set(false);
  }

  protected setImage(value: string): void {
    this.uploaded.set(null);
    this.set('imageUrl', value);
  }

  protected async upload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || this.uploading()) {
      return;
    }
    if (!IMAGE_TYPES.includes(file.type)) {
      this.uploadError.set('La foto debe ser PNG, JPG o WebP.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      this.uploadError.set('La foto no puede pesar más de 3 MB.');
      return;
    }
    this.uploading.set(true);
    this.uploadError.set('');
    try {
      const image = await this.api.uploadImage(file);
      this.set('imageUrl', image.key);
      this.uploaded.set(image.url);
    } catch (e) {
      this.uploadError.set(apiError(e, 'No se pudo subir la foto.'));
    } finally {
      this.uploading.set(false);
    }
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const p = await this.api.get(this.id!);
      this.show(p);
      void this.loadExtras(p);
    } catch (e) {
      this.error.set(apiError(e, 'No se pudo cargar el producto.'));
    } finally {
      this.loading.set(false);
    }
  }

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    if (this.saving()) {
      return;
    }
    const request = this.request();
    if (typeof request === 'string') {
      this.formError.set(request);
      return;
    }
    this.saving.set(true);
    this.formError.set('');
    try {
      if (this.id && this.p()?.productType === 'COMBO') {
        // Los combos tienen su propia edición: sin categoría, SKU ni composición.
        const { categoryId: _c, sku: _s, ...combo } = request;
        const detail = await this.api.updateCombo(this.id, combo);
        this.combo.set(detail);
        this.show(detail.combo);
        this.saved.set(true);
      } else if (this.id) {
        this.show(await this.api.update(this.id, request));
        this.saved.set(true);
      } else {
        const created = await this.api.create(request);
        await this.router.navigate(['/admin/productos', created.id]);
      }
    } catch (e) {
      this.formError.set(apiError(e, 'No se pudo guardar el producto.'));
    } finally {
      this.saving.set(false);
    }
  }

  protected async restock(event: Event): Promise<void> {
    event.preventDefault();
    const qty = wholeNumber(this.restockQty(), 1, 100000);
    if (qty === null) {
      this.stockError.set('La cantidad a reponer debe ser un número entero mayor que cero.');
      return;
    }
    await this.stock(() => this.api.restock(this.id!, qty, this.restockReason()));
  }

  protected async adjust(event: Event): Promise<void> {
    event.preventDefault();
    const change = wholeNumber(this.adjustQty(), -100000, 100000);
    if (change === null || change === 0) {
      this.stockError.set('El ajuste debe ser un número entero distinto de cero (negativo para restar).');
      return;
    }
    if (!this.adjustReason().trim()) {
      this.stockError.set('Escribe el motivo del ajuste.');
      return;
    }
    await this.stock(() => this.api.adjust(this.id!, change, this.adjustReason()));
  }

  protected async build(event: Event): Promise<void> {
    event.preventDefault();
    const units = wholeNumber(this.buildQty(), 1, 1000);
    if (units === null) {
      this.stockError.set('Indica cuántos combos armar (un número entero mayor que cero).');
      return;
    }
    await this.stock(async () => {
      this.combo.set(await this.api.buildCombo(this.id!, units, this.restockReason()));
      this.buildQty.set('');
    });
  }

  protected async setPromo(event: Event): Promise<void> {
    event.preventDefault();
    const buy = wholeNumber(this.promoBuy(), 2, 20);
    const pay = wholeNumber(this.promoPay(), 1, 19);
    if (buy === null || pay === null || pay >= buy) {
      this.offerError.set('En "lleva N, paga M", N va de 2 a 20 y M debe ser menor que N.');
      return;
    }
    if (!this.promoEnds()) {
      this.offerError.set('Indica hasta cuándo dura la promoción.');
      return;
    }
    await this.offer(async () => {
      const p = await this.api.setPromo(this.id!, buy, pay, `${this.promoEnds()}:00-05:00`);
      this.promoBuy.set('');
      this.promoPay.set('');
      this.promoEnds.set('');
      return p;
    });
  }

  protected async clearPromo(): Promise<void> {
    await this.offer(() => this.api.clearPromo(this.id!));
  }

  protected async setOffer(event: Event): Promise<void> {
    event.preventDefault();
    const price = amount(this.offerPrice());
    const p = this.p();
    if (price === null || (p && price >= p.price)) {
      this.offerError.set('El precio de oferta debe ser menor que el precio normal.');
      return;
    }
    if (!this.offerEnds()) {
      this.offerError.set('Indica hasta cuándo dura la oferta.');
      return;
    }
    // `datetime-local` no lleva zona: la hora es de Lima (UTC−5, sin horario de verano).
    await this.offer(() => this.api.setOffer(this.id!, price, `${this.offerEnds()}:00-05:00`));
  }

  protected async clearOffer(): Promise<void> {
    await this.offer(() => this.api.clearOffer(this.id!));
  }

  /** Historial de stock y, si es un combo, su composición. Si fallan, la ficha sigue siendo usable. */
  private async loadExtras(p: AdminProduct): Promise<void> {
    this.api.movements(p.id).then(
      (page) => this.movements.set(page.content),
      () => this.movements.set([]),
    );
    if (p.productType === 'COMBO') {
      this.api.combo(p.id).then(
        (c) => this.combo.set(c),
        () => this.combo.set(null),
      );
    }
  }

  private show(p: AdminProduct): void {
    this.p.set(p);
    this.uploaded.set(null);
    this.d.set({
      name: p.name,
      categoryId: String(p.categoryId),
      sku: p.sku ?? '',
      description: p.description ?? '',
      price: String(p.price),
      imageUrl: p.imageKey ?? '',
      minStock: String(p.minStock),
      maxStock: String(p.maxStock),
      available: p.available,
      featured: p.featured,
    });
  }

  /** El cuerpo a enviar, o el mensaje del primer error. */
  private request(): ProductRequest | string {
    const d = this.d();
    const price = amount(d.price);
    const minStock = wholeNumber(d.minStock, 0, 1000000);
    const maxStock = wholeNumber(d.maxStock, 0, 1000000);
    if (!d.name.trim()) return 'Escribe el nombre del producto.';
    if (!d.categoryId) return 'Elige una categoría.';
    if (price === null) return 'El precio debe ser mayor que cero, con hasta dos decimales.';
    if (minStock === null || maxStock === null) return 'Los stocks mínimo y máximo deben ser números enteros.';
    const p = this.p();
    return {
      categoryId: Number(d.categoryId),
      sku: d.sku.trim() || null,
      name: d.name.trim(),
      description: d.description.trim() || null,
      price,
      // La oferta se gestiona en su propio bloque: aquí se reenvía tal cual está guardada.
      discountPrice: p?.discountPrice ?? null,
      offerEndsAt: p?.offerEndsAt ?? null,
      imageUrl: d.imageUrl.trim() || null,
      minStock,
      maxStock,
      available: d.available,
      featured: d.featured,
    };
  }

  private async stock(action: () => Promise<unknown>): Promise<void> {
    if (this.stockBusy()) {
      return;
    }
    this.stockBusy.set(true);
    this.stockError.set('');
    try {
      await action();
      const p = await this.api.get(this.id!);
      this.p.set(p);
      void this.loadExtras(p);
      this.restockQty.set('');
      this.restockReason.set('');
      this.adjustQty.set('');
      this.adjustReason.set('');
    } catch (e) {
      this.stockError.set(apiError(e, 'No se pudo actualizar el stock.'));
    } finally {
      this.stockBusy.set(false);
    }
  }

  private async offer(action: () => Promise<AdminProduct>): Promise<void> {
    if (this.offerBusy()) {
      return;
    }
    this.offerBusy.set(true);
    this.offerError.set('');
    try {
      this.p.set(await action());
      this.offerPrice.set('');
      this.offerEnds.set('');
    } catch (e) {
      this.offerError.set(apiError(e, 'No se pudo actualizar la oferta.'));
    } finally {
      this.offerBusy.set(false);
    }
  }
}
