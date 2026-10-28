import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { LibroReclamaciones } from './libro-reclamaciones';

describe('LibroReclamaciones', () => {
  it('muestra proveedor, RUC, notas literales y ningún formulario', () => {
    const f = TestBed.createComponent(LibroReclamaciones);
    f.detectChanges();
    const el: HTMLElement = f.nativeElement;
    const text = el.textContent ?? '';
    expect(text).toContain('BRINDA PERU SAC');
    expect(text).toContain('20616579607');
    expect(text).toContain('quince (15) días hábiles');
    expect(text).toContain('INDECOPI');
    expect(el.querySelector('form, input, textarea')).toBeNull();
  });
});
