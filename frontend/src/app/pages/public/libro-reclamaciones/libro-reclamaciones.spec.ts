import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { LibroReclamaciones } from './libro-reclamaciones';

describe('LibroReclamaciones', () => {
  it('muestra el proveedor literal de la hoja, el formulario y las notas', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    const f = TestBed.createComponent(LibroReclamaciones);
    f.detectChanges();
    const el: HTMLElement = f.nativeElement;
    const text = el.textContent ?? '';
    expect(text).toContain('BRINDA PERU SAC');
    expect(text).toContain('20616579607');
    expect(text).toContain('AV ALFREDO BENAVIDES 707. 1403, MIRAFLORES');
    expect(text).toContain('HOJA DE RECLAMACIÓN VIRTUAL');
    expect(text).toContain('quince (15) días hábiles');
    expect(text).toContain('INDECOPI');
    expect(el.querySelector('app-complaint-form form')).not.toBeNull();
  });
});
