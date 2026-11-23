import { Component } from '@angular/core';
import { LEGAL, SHOW_PENDING } from '../../../core/config';
import { ComplaintForm } from './complaint-form';

/**
 * Libro de Reclamaciones: datos del proveedor, Hoja de Reclamación virtual y notas literales del PDF.
 * No puede salir a producción hasta que la asesora confirme lo pendiente (LEGAL.complaints.beforeProduction).
 */
@Component({
  selector: 'app-libro-reclamaciones',
  imports: [ComplaintForm],
  templateUrl: './libro-reclamaciones.html',
  styleUrl: './libro-reclamaciones.css',
})
export class LibroReclamaciones {
  protected readonly provider = LEGAL.provider;
  protected readonly claims = LEGAL.complaints;
  protected readonly showPending = SHOW_PENDING;
}
