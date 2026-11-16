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
  dni: '12345678',
  address: 'Av. Larco 123',
  reference: null,
  districtName: 'Barranco',
  zoneName: 'Zona 1',
  subtotal: 96,
  deliveryFee: 6,
  total: 102,
  paymentMethod: 'YAPE',
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
  const click = async (text: string) => {
    [...el.querySelectorAll('button')].find((b) => b.textContent?.trim() === text)?.click();
    await settle();
  };
  return { http, el, click, settle };
}

describe('PedidoDetalle (panel)', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('confirmar pide un segundo paso y luego llama a /confirm', async () => {
    const { http, el, click, settle } = await render();
    await click('Confirmar pago');
    http.expectNone('/api/v1/admin/orders/o1/confirm');
    await click('Sí, confirmar');
    http
      .expectOne({ method: 'POST', url: '/api/v1/admin/orders/o1/confirm' })
      .flush({ ...ORDER, status: 'CONFIRMED', confirmedAt: '2026-11-15T20:05:00-05:00' });
    await settle();
    http.expectOne('/api/v1/admin/orders/pending-count').flush({ pending: 0 });
    await settle();
    expect(el.querySelector('.head .badge')?.textContent).toContain('Confirmado');
    expect(el.textContent).not.toContain('Confirmar pago');
  });

  it('anular exige motivo y envía el motivo', async () => {
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
    const { http, el, click, settle } = await render();
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
