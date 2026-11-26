import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { PRIVACY, TERMS } from '../../../core/legal-texts';
import { LegalPage, segments, updatedLine } from './legal-page';

function render(doc: 'terms' | 'privacy') {
  TestBed.configureTestingModule({
    imports: [LegalPage],
    providers: [{ provide: ActivatedRoute, useValue: { snapshot: { data: { doc } } } }],
  });
  const fixture = TestBed.createComponent(LegalPage);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

const flat = (doc: typeof TERMS) => JSON.stringify(doc).replace(/\*\*/g, '');
const ADDRESS = 'Av. Alfredo Benavides 707, int. 1403, Miraflores';

describe('Páginas legales', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('Términos: título, 13 secciones y negritas del documento, sin línea de fecha mientras esté vacía', () => {
    const el = render('terms');
    expect(el.querySelector('h1')?.textContent).toBe('Términos y Condiciones de Uso y Compra');
    expect(el.querySelectorAll('h2').length).toBe(13);
    expect(el.querySelector('strong')?.textContent).toBe('Brinda Perú S.A.C.');
    // Sin espacio extra entre la negrita y la puntuación.
    expect(el.querySelector('p')?.textContent).toContain('operado por Brinda Perú S.A.C., con RUC');
    expect(el.textContent).toContain('no entregaremos los productos. En ese caso');
    expect(el.textContent).not.toContain('Última actualización');
    expect(el.textContent).not.toContain('**');
  });

  it('Privacidad: 13 secciones y listas', () => {
    const el = render('privacy');
    expect(el.querySelector('h1')?.textContent).toBe('Política de Privacidad y Protección de Datos Personales');
    expect(el.querySelectorAll('h2').length).toBe(13);
    expect(el.querySelectorAll('ul.list li').length).toBeGreaterThan(10);
  });

  it('correcciones aprobadas y nada de marcadores pendientes', () => {
    const terms = flat(TERMS);
    const privacy = flat(PRIVACY);
    expect(terms).toContain('confirmamos contigo');
    expect(terms).toContain('Pueblo Libre, San Borja');
    expect(terms).toContain('De martes a domingo');
    expect(terms).toContain('al correo brindalicoreria@gmail.com dentro de 6 horas');
    expect(privacy).toContain('WhatsApp 939448967.');
    expect(privacy).not.toContain('Meta Pixel');
    expect(privacy).toContain('algunas funciones podrían no operar correctamente.');
    for (const text of [terms, privacy]) {
      expect(text).not.toMatch(/\[(correo|fecha)/);
      expect(text.split(ADDRESS).length - 1).toBe(2); // §1 y §13
    }
  });

  it('fecha: "Última actualización" solo con una fecha AAAA-MM-DD válida', () => {
    expect(updatedLine('')).toBe('');
    expect(updatedLine('[fecha]')).toBe('');
    expect(updatedLine('2026-12-01')).toBe('Última actualización: 1 de diciembre de 2026');
  });

  it('negritas sin innerHTML', () => {
    expect(segments('a **b** c')).toEqual([
      { text: 'a ', bold: false },
      { text: 'b', bold: true },
      { text: ' c', bold: false },
    ]);
  });
});
