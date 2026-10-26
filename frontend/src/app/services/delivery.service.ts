import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../core/config';
import { District } from '../models/district';

export type DeliveryStatus = 'idle' | 'loading' | 'ready' | 'error';

/** Distritos con reparto y su tarifa estimada. La tarifa final la fija el servidor al crear el pedido. */
@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private readonly http = inject(HttpClient);

  readonly status = signal<DeliveryStatus>('idle');
  readonly districts = signal<District[]>([]);

  async load(): Promise<void> {
    if (this.status() === 'loading' || this.status() === 'ready') {
      return;
    }
    this.status.set('loading');
    try {
      this.districts.set(
        await firstValueFrom(this.http.get<District[]>(`${API_URL}/delivery/districts`)),
      );
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  retry(): Promise<void> {
    this.status.set('idle');
    return this.load();
  }
}
