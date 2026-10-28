import { Component } from '@angular/core';
import { LEGAL, SHOW_PENDING } from '../../../core/config';

/**
 * Libro de Reclamaciones: por ahora solo estructura (encabezado y notas literales de la hoja).
 * SIN formulario funcional: no puede salir a producción hasta implementarlo (ver avances.md).
 */
@Component({
  selector: 'app-libro-reclamaciones',
  templateUrl: './libro-reclamaciones.html',
  styleUrl: './libro-reclamaciones.css',
})
export class LibroReclamaciones {
  protected readonly provider = LEGAL.provider;
  protected readonly claims = LEGAL.complaints;
  protected readonly showPending = SHOW_PENDING;
}
