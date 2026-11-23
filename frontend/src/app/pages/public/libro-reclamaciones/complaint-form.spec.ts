import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { ComplaintForm } from './complaint-form';

const URL = '/api/v1/complaints';
const CREATED = {
  code: 'LR-2026-000007',
  number: 7,
  year: 2026,
  filedOn: '2026-11-22',
  copyToken: 'tok_abc-123',
  copyPath: '/api/v1/complaints/copy/tok_abc-123',
};

function render() {
  localStorage.clear();
  TestBed.configureTestingModule({
    imports: [ComplaintForm],
    providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
  });
  const http = TestBed.inject(HttpTestingController);
  const fixture = TestBed.createComponent(ComplaintForm);
  fixture.detectChanges();
  return { fixture, http, el: fixture.nativeElement as HTMLElement };
}

function type(el: HTMLElement, id: string, value: string) {
  const input = el.querySelector(`#${id}`) as HTMLInputElement | HTMLTextAreaElement;
  input.value = value;
  input.dispatchEvent(new Event('input'));
  input.dispatchEvent(new Event('blur'));
}

function pick(el: HTMLElement, name: string, value: string) {
  const radio = el.querySelector(
    `input[formcontrolname="${name}"][value="${value}"]`,
  ) as HTMLInputElement;
  radio.click();
}

function check(el: HTMLElement, name: string) {
  (el.querySelector(`input[formcontrolname="${name}"]`) as HTMLInputElement).click();
}

function fill(el: HTMLElement) {
  type(el, 'consumerName', 'Ana Núñez');
  pick(el, 'documentType', 'DNI');
  type(el, 'documentNumber', '12345678');
  type(el, 'address', 'Av. Larco 123');
  type(el, 'phone', '987654321');
  type(el, 'email', 'ana@correo.pe');
  pick(el, 'goodType', 'PRODUCT');
  type(el, 'claimedAmount', '45,50');
  type(el, 'goodDescription', 'Whisky');
  pick(el, 'complaintType', 'CLAIM');
  type(el, 'detail', 'Llegó abierto.');
  type(el, 'consumerRequest', 'Cambio del producto.');
  check(el, 'privacyAccepted');
}

const submit = (el: HTMLElement) =>
  (el.querySelector('button[type="submit"]') as HTMLButtonElement).click();

async function settle(f: { whenStable(): Promise<unknown>; detectChanges(): void }) {
  await f.whenStable();
  f.detectChanges();
}

describe('ComplaintForm', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('reproduce las secciones de la hoja, sin firma ni N° de pedido', () => {
    const { el } = render();
    const legends = [...el.querySelectorAll('legend.legend')].map((l) => l.textContent?.trim());
    expect(legends).toEqual([
      '1. Identificación del consumidor reclamante',
      '2. Identificación del bien contratado',
      '3. Detalle de la reclamación y pedido del consumidor',
    ]);
    expect(el.querySelector('#signature, [formcontrolname="orderCode"]')).toBeNull();
  });

  it('no envía si falta algo y muestra errores en los campos', () => {
    const { el, http, fixture } = render();
    submit(el);
    fixture.detectChanges();
    http.expectNone(URL);
    expect(el.textContent).toContain('Ingresa tu nombre.');
    expect(el.textContent).toContain('Debes aceptar la política de privacidad.');
  });

  it('valida DNI de 8 dígitos y CE de 8 a 12 letras o números', () => {
    const { el, fixture } = render();
    pick(el, 'documentType', 'DNI');
    type(el, 'documentNumber', '1234');
    fixture.detectChanges();
    expect(el.textContent).toContain('El DNI debe tener 8 dígitos.');
    pick(el, 'documentType', 'CE');
    type(el, 'documentNumber', 'AB12-3456');
    fixture.detectChanges();
    expect((el.querySelector('#documentNumber') as HTMLInputElement).value).toBe('AB123456');
    expect(el.textContent).not.toContain('El CE debe tener');
  });

  it('exige el nombre del apoderado si es menor de edad', () => {
    const { el, http, fixture } = render();
    fill(el);
    check(el, 'minor');
    fixture.detectChanges();
    submit(el);
    fixture.detectChanges();
    http.expectNone(URL);
    expect(el.textContent).toContain('Ingresa el nombre del padre, madre o apoderado.');
  });

  it('envía, muestra el N° y el enlace de la copia, y borra los datos', async () => {
    const { el, http, fixture } = render();
    fill(el);
    fixture.detectChanges();
    submit(el);
    const req = http.expectOne(URL);
    expect(req.request.body).toMatchObject({
      consumerName: 'Ana Núñez',
      documentType: 'DNI',
      documentNumber: '12345678',
      claimedAmount: 45.5,
      guardianName: null,
      privacyAccepted: true,
      website: '',
    });
    req.flush(CREATED, { status: 201, statusText: 'Created' });
    await settle(fixture);
    expect(el.textContent).toContain('LR-2026-000007');
    expect(el.textContent).toContain('22/11/2026');
    expect(el.querySelector('a[download]')?.getAttribute('href')).toBe(
      '/api/v1/complaints/copy/tok_abc-123',
    );
    expect(el.querySelector('form')).toBeNull();
    expect(localStorage.length).toBe(0);
  });

  it('respuesta de honeypot: nunca dice "registrado"', async () => {
    const { el, http, fixture } = render();
    fill(el);
    submit(el);
    http
      .expectOne(URL)
      .flush({ ...CREATED, code: 'LR-0000-000000', number: 0, copyToken: '', copyPath: '' });
    await settle(fixture);
    expect(el.textContent).not.toContain('registrado');
    expect(el.textContent).toContain(
      'No pudimos registrar tu reclamo, inténtalo de nuevo o escríbenos.',
    );
  });

  it('el honeypot no se ve, no se tabula ni se autocompleta', () => {
    const { el } = render();
    const hp = el.querySelector('#website') as HTMLInputElement;
    expect(hp.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(hp.getAttribute('tabindex')).toBe('-1');
    expect(hp.getAttribute('autocomplete')).toBe('off');
  });

  it('400: marca los campos que devuelve el servidor', async () => {
    const { el, http, fixture } = render();
    fill(el);
    submit(el);
    http
      .expectOne(URL)
      .flush(
        { status: 400, code: 'VALIDATION_ERROR', fields: { email: 'Correo no válido' } },
        { status: 400, statusText: 'Bad Request' },
      );
    await settle(fixture);
    expect(el.textContent).toContain('Correo no válido');
    expect(el.textContent).toContain('Revisa los datos marcados');
  });

  it('429: pide esperar un minuto y conserva lo escrito', async () => {
    const { el, http, fixture } = render();
    fill(el);
    submit(el);
    http.expectOne(URL).flush({}, { status: 429, statusText: 'Too Many Requests' });
    await settle(fixture);
    expect(el.textContent).toContain('Espera un minuto');
    expect((el.querySelector('#consumerName') as HTMLInputElement).value).toBe('Ana Núñez');
  });

  it('error de red: mensaje de conexión', async () => {
    const { el, http, fixture } = render();
    fill(el);
    submit(el);
    http.expectOne(URL).error(new ProgressEvent('error'), { status: 0 });
    await settle(fixture);
    expect(el.textContent).toContain('No pudimos conectar con el servidor');
  });

  it('el enlace a la privacidad abre en otra pestaña', () => {
    const { el } = render();
    const a = el.querySelector('a[href="/privacidad"]') as HTMLAnchorElement;
    expect(a.target).toBe('_blank');
  });
});
