import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../core/config';
import { Category } from '../../models/category';
import { apiError } from '../admin-auth.service';

const BASE = `${API_URL}/admin/categories`;

/** Categorías del catálogo. No se borran: se desactivan (sus productos dejan de verse en la tienda). */
@Component({
  selector: 'app-categorias',
  styleUrls: ['../admin-ui.css', '../reclamos/reclamo-detalle.css', '../productos/productos.css', '../zonas/zonas.css'],
  templateUrl: './categorias.html',
})
export class Categorias implements OnInit {
  private readonly http = inject(HttpClient);

  protected readonly categories = signal<Category[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly busy = signal(false);
  /** Error de la última acción, junto a la categoría que lo produjo (0 = formulario de alta). */
  protected readonly actionError = signal<{ id: number; text: string } | null>(null);

  ngOnInit(): void {
    void this.load();
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.categories.set(await firstValueFrom(this.http.get<Category[]>(BASE)));
    } catch (e) {
      this.error.set(apiError(e, 'No se pudieron cargar las categorías.'));
    } finally {
      this.loading.set(false);
    }
  }

  /** Crea (id 0) o actualiza con los valores del formulario; conserva descripción e ícono. */
  protected async save(event: Event, current: Category | null): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const id = current?.id ?? 0;
    const name = String(data.get('name') ?? '').trim();
    const order = String(data.get('order') ?? '').trim();
    if (!name) {
      this.actionError.set({ id, text: 'Escribe el nombre de la categoría.' });
      return;
    }
    if (!/^\d{1,4}$/.test(order)) {
      this.actionError.set({ id, text: 'El orden debe ser un número de 0 a 9999.' });
      return;
    }
    if (this.busy()) {
      return;
    }
    const body = {
      name,
      description: current?.description ?? null,
      iconUrl: current?.iconUrl ?? null,
      active: current ? data.get('active') === 'on' : true,
      displayOrder: Number(order),
    };
    this.busy.set(true);
    this.actionError.set(null);
    try {
      if (current) {
        await firstValueFrom(this.http.put(`${BASE}/${current.id}`, body));
      } else {
        await firstValueFrom(this.http.post(BASE, body));
        form.reset();
      }
      await this.load();
    } catch (e) {
      this.actionError.set({ id, text: apiError(e, 'No se pudo guardar la categoría.') });
    } finally {
      this.busy.set(false);
    }
  }
}
