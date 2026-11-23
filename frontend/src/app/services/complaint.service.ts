import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../core/config';

/** Cuerpo de `POST /complaints` (mismo orden que `CreateComplaintRequest`). */
export interface CreateComplaintRequest {
  consumerName: string;
  documentType: 'DNI' | 'CE';
  documentNumber: string;
  address: string;
  phone: string;
  email: string;
  guardianName: string | null;
  goodType: 'PRODUCT' | 'SERVICE';
  claimedAmount: number | null;
  goodDescription: string;
  complaintType: 'CLAIM' | 'COMPLAINT';
  detail: string;
  consumerRequest: string;
  privacyAccepted: boolean;
  website: string;
}

export interface CreatedComplaint {
  code: string;
  number: number;
  year: number;
  filedOn: string;
  copyToken: string;
  copyPath: string;
}

export interface ComplaintFailure {
  message: string;
  fields: Record<string, string>;
}

/** Respuesta que el servidor da a un bot (honeypot lleno): no se guardó nada. */
export function isRealComplaint(c: CreatedComplaint): boolean {
  return c.code !== 'LR-0000-000000' && c.number > 0 && c.copyToken !== '';
}

/** URL de la copia en PDF. Se arma con `API_URL` (en producción la API está en otro dominio). */
export function complaintCopyUrl(c: CreatedComplaint): string {
  return `${API_URL}/complaints/copy/${encodeURIComponent(c.copyToken)}`;
}

/** Traduce el error de `POST /complaints`. No incluye ni registra datos del consumidor. */
export function complaintFailure(error: unknown): ComplaintFailure {
  const res = error instanceof HttpErrorResponse ? error : null;
  const body = res?.error && typeof res.error === 'object' ? res.error : {};
  switch (res?.status) {
    case 400:
      return {
        message: 'Revisa los datos marcados e inténtalo de nuevo.',
        fields: typeof body.fields === 'object' && body.fields ? body.fields : {},
      };
    case 429:
      return {
        message: 'Hiciste demasiados intentos seguidos. Espera un minuto y vuelve a intentarlo.',
        fields: {},
      };
    case 0:
      return {
        message: 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
        fields: {},
      };
    default:
      return { message: NOT_REGISTERED, fields: {} };
  }
}

export const NOT_REGISTERED = 'No pudimos registrar tu reclamo, inténtalo de nuevo o escríbenos.';

/** Libro de Reclamaciones público. Los datos viajan una vez y no se guardan en el navegador. */
@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private readonly http = inject(HttpClient);

  create(request: CreateComplaintRequest): Promise<CreatedComplaint> {
    return firstValueFrom(this.http.post<CreatedComplaint>(`${API_URL}/complaints`, request));
  }
}
