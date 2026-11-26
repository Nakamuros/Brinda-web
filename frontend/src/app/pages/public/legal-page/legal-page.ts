import { NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LEGAL } from '../../../core/config';
import { LegalDocument, PRIVACY, TERMS } from '../../../core/legal-texts';

const DOCS: Record<string, LegalDocument> = { terms: TERMS, privacy: PRIVACY };
const DATE = new Intl.DateTimeFormat('es-PE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "2026-12-01" → "1 de diciembre de 2026"; vacío o inválido → '' (no se muestra la línea). */
export function updatedLine(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return '';
  }
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? '' : `Última actualización: ${DATE.format(date)}`;
}

/** Divide `**negrita**` en partes; las de índice impar van en negrita. Sin innerHTML. */
export function segments(text: string): { text: string; bold: boolean }[] {
  return text
    .split('**')
    .map((t, i) => ({ text: t, bold: i % 2 === 1 }))
    .filter((s) => s.text);
}

/**
 * /terminos y /privacidad: texto literal de los documentos del asesor (`core/legal-texts.ts`).
 * La fecha sale de `LEGAL.documentsUpdatedAt`, la misma que el backend guarda como versión en cada pedido.
 */
@Component({
  selector: 'app-legal-page',
  imports: [NgTemplateOutlet],
  templateUrl: './legal-page.html',
  styleUrls: ['../libro-reclamaciones/libro-reclamaciones.css', './legal-page.css'],
})
export class LegalPage {
  protected readonly doc = DOCS[inject(ActivatedRoute).snapshot.data['doc'] as string];
  protected readonly updated = updatedLine(LEGAL.documentsUpdatedAt);
  protected readonly segments = segments;
}
