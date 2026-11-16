import { HttpClient } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../core/config';
import { apiError } from '../admin-auth.service';

interface Zone {
  id: number;
  name: string;
  fee: number;
  active: boolean;
}
interface District {
  id: number;
  name: string;
  zoneId: number;
  active: boolean;
}

const BASE = `${API_URL}/admin/delivery`;
const FEE = /^\d{1,3}(\.\d{1,2})?$/;

/** Zonas de reparto (tarifa) y sus distritos. Nada se borra: se activa o desactiva. */
@Component({
  selector: 'app-zonas',
  styleUrls: ['../admin-ui.css', '../reclamos/reclamo-detalle.css', '../productos/productos.css', './zonas.css'],
  templateUrl: './zonas.html',
})
export class Zonas implements OnInit {
  private readonly http = inject(HttpClient);

  protected readonly zones = signal<Zone[]>([]);
  protected readonly districts = signal<District[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly busy = signal(false);
  /** Error de la última acción, junto a la zona que lo produjo (0 = formulario de zona nueva). */
  protected readonly actionError = signal<{ zoneId: number; text: string } | null>(null);

  protected readonly view = computed(() =>
    this.zones().map((z) => ({
      z,
      districts: this.districts().filter((d) => d.zoneId === z.id),
    })),
  );
  /** Distritos a los que hoy se puede pedir: zona y distrito activos. */
  protected readonly deliverable = computed(() => {
    const active = new Set(this.zones().filter((z) => z.active).map((z) => z.id));
    return this.districts().filter((d) => d.active && active.has(d.zoneId)).length;
  });

  ngOnInit(): void {
    void this.load();
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const [zones, districts] = await Promise.all([
        firstValueFrom(this.http.get<Zone[]>(`${BASE}/zones`)),
        firstValueFrom(this.http.get<District[]>(`${BASE}/districts`)),
      ]);
      this.zones.set(zones);
      this.districts.set(districts);
    } catch (e) {
      this.error.set(apiError(e, 'No se pudieron cargar las zonas.'));
    } finally {
      this.loading.set(false);
    }
  }

  /** Crea (id 0) o actualiza una zona con los valores del formulario. */
  protected async saveZone(event: Event, id: number): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const fee = String(data.get('fee') ?? '').trim();
    if (!name) {
      return this.fail(id, 'Escribe el nombre de la zona.');
    }
    if (!FEE.test(fee)) {
      return this.fail(id, 'La tarifa debe ser un importe entre 0 y 999.99.');
    }
    const body = { name, fee: Number(fee), active: id ? data.get('active') === 'on' : true };
    await this.run(id, async () => {
      if (id) {
        await firstValueFrom(this.http.put(`${BASE}/zones/${id}`, body));
      } else {
        await firstValueFrom(this.http.post(`${BASE}/zones`, body));
        form.reset();
      }
    });
  }

  protected async addDistrict(event: Event, zoneId: number): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const name = String(new FormData(form).get('district') ?? '').trim();
    if (!name) {
      return this.fail(zoneId, 'Escribe el nombre del distrito.');
    }
    await this.run(zoneId, async () => {
      await firstValueFrom(this.http.post(`${BASE}/districts`, { zoneId, name, active: true }));
      form.reset();
    });
  }

  protected async toggleDistrict(d: District): Promise<void> {
    await this.run(d.zoneId, () =>
      firstValueFrom(
        this.http.put(`${BASE}/districts/${d.id}`, { zoneId: d.zoneId, name: d.name, active: !d.active }),
      ),
    );
  }

  private fail(zoneId: number, text: string): void {
    this.actionError.set({ zoneId, text });
  }

  private async run(zoneId: number, action: () => Promise<unknown>): Promise<void> {
    if (this.busy()) {
      return;
    }
    this.busy.set(true);
    this.actionError.set(null);
    try {
      await action();
      await this.load();
    } catch (e) {
      this.fail(zoneId, apiError(e, 'No se pudo guardar el cambio.'));
    } finally {
      this.busy.set(false);
    }
  }
}
