import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { PedidoDetalle } from './pedido-detalle';

const ORDER = {
  id: 'o1',
  code: 'EQ12',
  status: 'PENDING',
  firstName: 'Ana',
  lastName: 'Pérez',
  phone: '987654321',
  documentType: 'DNI',
  documentNumber: '12345678',
  address: 'Av. Larco 123',
  reference: null,
  districtName: 'Barranco',
  zoneName: 'Zona 1',
  subtotal: 96,
  deliveryFee: 6,
  total: 102,
  finalDeliveryFee: null,
  finalTotal: null,
  paymentMethod: 'YAPE',
  marketingConsent: false,
  marketingConsentAt: null,
  createdAt: '2026-11-15T20:00:00-05:00',
  expiresAt: '2026-11-15T20:20:00-05:00',
  confirmedAt: null,
  cancelReason: null,
  items: [],
};

async function render(order: object = ORDER) {
  TestBed.configureTestingModule({
    imports: [PedidoDetalle],
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideHttpClientTesting(),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: convertToParamMap({ id: 'o1' }) } },
      },
    ],
  });
  const http = TestBed.inject(HttpTestingController);
  const fixture = TestBed.createComponent(PedidoDetalle);
  fixture.detectChanges();
  http.expectOne('/api/v1/admin/orders/o1').flush(order);
  const settle = async () => {
    await new Promise((r) => setTimeout(r));
    await fixture.whenStable();
    fixture.detectChanges();
  };
  await settle();
  const el = fixture.nativeElement as HTMLElement;
  const button = (text: string) =>
    [...el.querySelectorAll('button')].find((b) => b.textContent?.trim() === text) as HTMLButtonElement;
  const click = async (text: string) => {
    button(text)?.click();
    await settle();
  };
  const typeFee = async (value: string) => {
    const input = el.querySelector('#fee') as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await settle();
  };
  return { http, el, click, settle, button, typeFee };
}

describe('PedidoDetalle (panel)', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('el delivery cobrado empieza vacío y "Confirmar pago" sigue desactivado hasta que es válido', async () => {
    const { el, button, typeFee } = await render();
    const fee = el.querySelector('#fee') as HTMLInputElement;
    expect(fee.value).toBe('');
    expect(el.textContent?.replace(/\u00a0/g, ' ')).toContain('Tarifa base: S/ 6.00 (Zona 1)');
    expect(button('Confirmar pago').disabled).toBe(true);
    await typeFee('12.345');
    expect(button('Confirmar pago').disabled).toBe(true);
    expect(el.textContent).toContain('con hasta 2 decimales');
    await typeFee('12,5');
    expect(button('Confirmar pago').disabled).toBe(false);
    expect(el.querySelector('#fee-total')?.textContent?.replace(/\u00a0/g, ' ')).toContain('S/ 108.50');
  });

  it('confirmar pregunta "¿Recibiste S/ X por <pago>?" y envía el delivery cobrado', async () => {
    const { http, el, click, settle, typeFee } = await render();
    await typeFee('12.50');
    await click('Confirmar pago');
    http.expectNone('/api/v1/admin/orders/o1/confirm');
    expect(el.querySelector('.ask')?.textContent?.replace(/\u00a0/g, ' ')).toContain(
      '¿Recibiste S/ 108.50 por Yape?',
    );
    await click('Sí, confirmar');
    const req = http.expectOne({ method: 'POST', url: '/api/v1/admin/orders/o1/confirm' });
    expect(req.request.body).toEqual({ deliveryFee: 12.5, zeroFeeConfirmed: false });
    req.flush({
      ...ORDER,
      status: 'CONFIRMED',
      confirmedAt: '2026-11-15T20:05:00-05:00',
      finalDeliveryFee: 12.5,
      finalTotal: 108.5,
    });
    await settle();
    http.expectOne('/api/v1/admin/orders/pending-count').flush({ pending: 0 });
    await settle();
    expect(el.querySelector('.head .badge')?.textContent).toContain('Confirmado');
    expect(el.textContent).not.toContain('Confirmar pago');
    expect(el.querySelector('.totals .total')?.textContent?.replace(/\u00a0/g, ' ')).toContain(
      'Total cobrado',
    );
    expect(el.querySelector('.totals .total')?.textContent?.replace(/\u00a0/g, ' ')).toContain('S/ 108.50');
  });

  it('S/ 0 solo con la casilla "El delivery fue gratis"', async () => {
    const { http, el, click, button, typeFee, settle } = await render();
    await typeFee('0');
    expect(button('Confirmar pago').disabled).toBe(true);
    (el.querySelector('#free') as HTMLInputElement).click();
    await settle();
    expect(button('Confirmar pago').disabled).toBe(false);
    await click('Confirmar pago');
    await click('Sí, confirmar');
    const req = http.expectOne({ method: 'POST', url: '/api/v1/admin/orders/o1/confirm' });
    expect(req.request.body).toEqual({ deliveryFee: 0, zeroFeeConfirmed: true });
  });

  it('un confirmado se puede corregir (delivery-fee) y muestra tipo de documento y promociones', async () => {
    const confirmed = {
      ...ORDER,
      status: 'CONFIRMED',
      confirmedAt: '2026-11-15T20:05:00-05:00',
      documentType: 'PASSPORT',
      documentNumber: 'AB1234',
      marketingConsent: true,
      marketingConsentAt: '2026-11-15T20:00:00-05:00',
      finalDeliveryFee: 12.5,
      finalTotal: 108.5,
    };
    const { http, el, click, typeFee, settle } = await render(confirmed);
    expect(el.textContent).toContain('Pasaporte');
    expect(el.textContent).toContain('AB1234');
    expect(el.textContent).toContain('Aceptó el');
    expect(el.querySelector('#fee')).toBeNull(); // confirmado: sin campo hasta pedir corregir
    await click('Corregir delivery');
    await typeFee('15');
    await click('Guardar delivery');
    const req = http.expectOne({ method: 'POST', url: '/api/v1/admin/orders/o1/delivery-fee' });
    expect(req.request.body).toEqual({ deliveryFee: 15, zeroFeeConfirmed: false });
    req.flush({ ...confirmed, finalDeliveryFee: 15, finalTotal: 111 });
    await settle();
    http.expectOne('/api/v1/admin/orders/pending-count').flush({ pending: 0 });
    await settle();
    expect(el.querySelector('.totals .total')?.textContent?.replace(/\u00a0/g, ' ')).toContain('S/ 111.00');
  });

  it('pendiente tal como lo envía la API (omite los nulos): total estimado, sin NaN', async () => {
    const { finalDeliveryFee, finalTotal, marketingConsentAt, ...omitted } = ORDER;
    void [finalDeliveryFee, finalTotal, marketingConsentAt];
    const { el } = await render(omitted);
    expect(el.textContent).not.toContain('NaN');
    expect(el.textContent).not.toContain('Total cobrado');
    expect(el.querySelector('.totals .total')?.textContent).toContain('Total estimado');
  });

  it('confirmado antes de V11 (sin delivery final): usa la tarifa base como total', async () => {
    const { el } = await render({ ...ORDER, status: 'CONFIRMED', confirmedAt: '2026-11-15T20:05:00-05:00' });
    expect(el.textContent).toContain('se usa la tarifa base');
    expect(el.querySelector('.totals .total')?.textContent?.replace(/\u00a0/g, ' ')).toContain('S/ 102.00');
  });

  it('anular no pide el delivery: exige motivo y envía el motivo', async () => {
    const { http, el, click, settle } = await render();
    await click('Anular');
    await click('Anular pedido');
    expect(el.textContent).toContain('Escribe el motivo de la anulación.');
    const reason = el.querySelector('#reason') as HTMLTextAreaElement;
    reason.value = 'Cliente no pagó';
    reason.dispatchEvent(new Event('input'));
    await click('Anular pedido');
    const req = http.expectOne({ method: 'POST', url: '/api/v1/admin/orders/o1/cancel' });
    expect(req.request.body).toEqual({ reason: 'Cliente no pagó' });
    req.flush({ ...ORDER, status: 'CANCELLED', cancelReason: 'Cliente no pagó' });
    await settle();
    http.expectOne('/api/v1/admin/orders/pending-count').flush({ pending: 0 });
    await settle();
    expect(el.textContent).toContain('Motivo: Cliente no pagó');
    expect(el.textContent).not.toContain('Confirmar pago');
  });

  it('si el stock no alcanza muestra el mensaje del servidor y el pedido sigue pendiente', async () => {
    const { http, el, click, settle, typeFee } = await render();
    await typeFee('6');
    await click('Confirmar pago');
    await click('Sí, confirmar');
    http
      .expectOne({ method: 'POST', url: '/api/v1/admin/orders/o1/confirm' })
      .flush(
        { status: 422, code: 'BUSINESS_RULE', message: 'Stock insuficiente: Pisco' },
        { status: 422, statusText: 'Unprocessable Entity' },
      );
    await settle();
    expect(el.querySelector('.error')?.textContent).toContain('Stock insuficiente: Pisco');
    expect(el.querySelector('.head .badge')?.textContent).toContain('Pendiente');
  });
});
