import { Page } from '../../models/page';

export type ComplaintStatus = 'RECEIVED' | 'ANSWERED';
export type ComplaintType = 'CLAIM' | 'COMPLAINT';
export type GoodType = 'PRODUCT' | 'SERVICE';
export type DeadlineLevel = 'ON_TIME' | 'SOON' | 'OVERDUE' | 'ANSWERED';
export type EmailState = 'PENDING' | 'SENT' | 'FAILED';

/** Plazo de respuesta calculado por el backend (15 días hábiles, lunes a viernes; feriados por confirmar con el asesor). */
export interface Deadline {
  dueOn: string;
  businessDaysLeft: number | null;
  level: DeadlineLevel;
  answeredLate: boolean;
}

export interface EmailInfo {
  status: EmailState;
  attempts: number;
  lastAttemptAt?: string;
  sentAt?: string;
}

/** Fila de la lista: el backend NO manda documento, teléfono, correo ni dirección. */
export interface ComplaintSummary {
  id: string;
  code: string;
  filedAt: string;
  consumerName: string;
  complaintType: ComplaintType;
  goodType: GoodType;
  status: ComplaintStatus;
  deadline: Deadline;
  consumerEmail: EmailInfo;
  ownerEmail: EmailInfo;
}

export interface ComplaintDetail extends ComplaintSummary {
  number: number;
  year: number;
  documentType: 'DNI' | 'CE';
  documentNumber: string;
  address: string;
  phone: string;
  email: string;
  guardianName?: string;
  claimedAmount?: number;
  goodDescription: string;
  detail: string;
  consumerRequest: string;
  privacyAcceptedAt: string;
  responseText?: string;
  responseDate?: string;
  respondedAt?: string;
}

export interface ComplaintCounts {
  pending: number;
  dueSoon: number;
  overdue: number;
}

export interface ComplaintFilters {
  status?: ComplaintStatus | '';
  type?: ComplaintType | '';
  deadline?: 'SOON' | 'OVERDUE' | '';
  q?: string;
  page: number;
}

export type ComplaintPage = Page<ComplaintSummary>;

const LIMA = 'America/Lima';

export const typeLabel = (t: ComplaintType) => (t === 'CLAIM' ? 'Reclamo' : 'Queja');
export const goodLabel = (g: GoodType) => (g === 'PRODUCT' ? 'Producto' : 'Servicio');
export const statusLabel = (s: ComplaintStatus) => (s === 'RECEIVED' ? 'Sin responder' : 'Respondido');
export const emailLabel = (e: EmailInfo) =>
  e.status === 'SENT' ? 'Enviado' : e.status === 'FAILED' ? `Falló (${e.attempts} intentos)` : 'Pendiente';

export function formatDate(iso: string): string {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T12:00:00-05:00`) : new Date(iso);
  return new Intl.DateTimeFormat('es-PE', { timeZone: LIMA, day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    timeZone: LIMA,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

/** Fecha de hoy en Lima como AAAA-MM-DD (valor de `<input type="date">`). */
export function limaToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: LIMA }).format(new Date());
}

const days = (n: number) => `${n} ${n === 1 ? 'día hábil' : 'días hábiles'}`;

export function deadlineText(d: Deadline): string {
  switch (d.level) {
    case 'ANSWERED':
      return d.answeredLate ? 'Respondido fuera de plazo' : 'Respondido en plazo';
    case 'OVERDUE':
      return `Vencido hace ${days(Math.abs(d.businessDaysLeft ?? 0))}`;
    case 'SOON':
      return d.businessDaysLeft === 0 ? 'Vence hoy' : `Vence en ${days(d.businessDaysLeft ?? 0)}`;
    default:
      return `Vence el ${formatDate(d.dueOn)} (${days(d.businessDaysLeft ?? 0)})`;
  }
}
