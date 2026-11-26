import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreatedOrder, OrderPayment } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { PedidoCreado } from './pedido-creado';

const ORDER: CreatedOrder = {
  code: 'EQ12',
  status: 'PENDING',
  subtotal: 96,
  deliveryFee: 6,
  total: 102,
  expiresAt: '2026-11-15T20:20:00-05:00',
  items: [{ name: 'Pisco Quebranta 500 ml', quantity: 2, unitPrice: 48, subtotal: 96 }],
  payment: { method: 'YAPE', number: null, transfer: null, amount: 102 },
  whatsappUrl: 'https://wa.me/51999999999?text=Pedido%20EQ12',
};

function render(
  order: CreatedOrder | null,
  codigo = 'EQ12',
  recent = '',
  recentUrl: string | null = null,
  recentPayment: OrderPayment | null = null,
  districts: { fee: number }[] | null = [{ fee: 8 }, { fee: 6 }],
) {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [PedidoCreado],
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideHttpClientTesting(),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: convertToParamMap({ codigo }) } },
      },
    ],
  });
  TestBed.inject(OrderService).last.set(order);
  TestBed.inject(OrderService).recent.set(
    recent ? { code: recent, at: Date.now(), whatsappUrl: recentUrl, payment: recentPayment } : null,
  );
  const fixture = TestBed.createComponent(PedidoCreado);
  fixture.detectChanges();
  const req = TestBed.inject(HttpTestingController).expectOne('/api/v1/delivery/districts');
  if (districts) {
    req.flush(districts);
  } else {
    req.flush('error', { status: 500, statusText: 'Error' });
  }
  return { el: fixture.nativeElement as HTMLElement, fixture };
}

describe('PedidoCreado (/pedido/:codigo)', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('muestra código, resumen, aviso de 20 minutos y el botón de WhatsApp del servidor', () => {
    const { el } = render(ORDER);
    expect(el.querySelector('h1')?.textContent).toContain('EQ12');
    expect(el.querySelector('.deadline')?.textContent).toContain('20 minutos');
    expect(el.querySelector('.deadline')?.textContent).toMatch(/8:20/);
    expect(el.querySelector('.sum-total dd')?.textContent?.replace(/ /g, ' ')).toContain(
      'S/ 102.00',
    );
    const send = el.querySelector('a.send') as HTMLAnchorElement;
    expect(send.getAttribute('href')).toBe(ORDER.whatsappUrl);
    expect(send.target).toBe('_blank');
    expect(el.querySelector('.unavailable')).toBeNull();
  });

  it('el paso pendiente va primero: "Falta un paso", el código y el botón verde', () => {
    const { el } = render(ORDER);
    const pending = el.querySelector('.next > *') as HTMLElement;
    expect(pending.classList).toContain('pending');
    expect(pending.textContent).toContain('Falta un paso');
    expect(pending.textContent).toContain('EQ12');
    expect(pending.textContent).toContain('no avanza');
    expect(pending.textContent).toContain('No cierres esta página');
    expect(pending.querySelector('a.btn-whatsapp')).not.toBeNull();
    expect(pending.querySelector('a.btn-cta')).toBeNull();
  });

  it('sin WhatsApp configurado no hay botón: aviso honesto con el código', () => {
    const { el } = render({ ...ORDER, whatsappUrl: null });
    expect(el.querySelector('a.send')).toBeNull();
    expect(el.querySelector('.unavailable')?.textContent).toContain('aún no está disponible');
    expect(el.querySelector('.unavailable')?.textContent).toContain('EQ12');
  });

  it('no enlaza a nada que no sea wa.me', () => {
    const { el } = render({ ...ORDER, whatsappUrl: 'https://example.com/x' });
    expect(el.querySelector('a.send')).toBeNull();
  });

  it('tras recargar recupera el enlace de WhatsApp recordado (sin datos personales)', () => {
    const { el } = render(null, 'EQ12', 'EQ12', ORDER.whatsappUrl);
    expect(el.querySelector('.pending')?.textContent).toContain('Falta un paso');
    expect((el.querySelector('a.send') as HTMLAnchorElement).getAttribute('href')).toBe(
      ORDER.whatsappUrl,
    );
    expect(el.querySelector('.summary')).toBeNull();
  });

  it('tras recargar sin enlace recordado conserva solo el código', () => {
    const { el } = render(null, 'EQ12', 'EQ12');
    expect(el.querySelector('h1')?.textContent).toContain('EQ12');
    expect(el.textContent).toContain('Guarda tu código');
    expect(el.querySelector('.summary')).toBeNull();
    expect(el.querySelector('a.send')).toBeNull();
    expect(el.querySelector('.unavailable')?.textContent).toContain('EQ12');
  });

  it('sin pedido en memoria ni código recordado (u otro código) no muestra datos', () => {
    for (const { el } of [render(null), render(ORDER, 'ZZ99', 'EQ12')]) {
      expect(el.textContent).toContain('No podemos mostrar este pedido');
      expect(el.querySelector('.summary')).toBeNull();
    }
  });

  it('el total del resumen se llama "Total estimado" y el aviso de delivery trae la tarifa mínima', async () => {
    const { el, fixture } = render(ORDER);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelector('.sum-total dt')?.textContent).toContain('Total estimado');
    expect(el.querySelector('app-delivery-notice .title')?.textContent?.replace(/\u00a0/g, ' ')).toContain(
      'Delivery desde S/ 6.00.',
    );
  });

  it('sin tarifas de la API el aviso sale igual, sin la cifra', async () => {
    const { el, fixture } = render(ORDER, 'EQ12', '', null, null, null);
    await fixture.whenStable();
    fixture.detectChanges();
    const notice = el.querySelector('app-delivery-notice');
    expect(notice?.textContent).not.toContain('S/');
    expect(notice?.textContent).toContain('La tarifa puede aumentar');
  });

  it('transferencia con la cuenta configurada: banco, cuenta, CCI y titular', () => {
    const transfer = { bank: 'Banco X', account: '191-000', cci: '002-191-000', holder: 'Titular' };
    const { el } = render({ ...ORDER, payment: { method: 'TRANSFER', number: null, transfer, amount: 102 } });
    const pay = el.querySelector('.pay')?.textContent ?? '';
    for (const text of ['Transferencia', 'Banco X', '191-000', '002-191-000', 'Titular']) {
      expect(pay).toContain(text);
    }
  });

  it('transferencia sin cuenta configurada: la enviaremos por WhatsApp', () => {
    const { el } = render({ ...ORDER, payment: { method: 'TRANSFER', number: null, transfer: null, amount: 102 } });
    expect(el.querySelector('.pay')?.textContent).toContain('Te enviaremos los datos de la cuenta por WhatsApp');
  });

  it('tras recargar siguen visibles los datos para pagar (no son personales)', () => {
    const payment: OrderPayment = { method: 'YAPE', number: '999111222', transfer: null, amount: 102 };
    const { el } = render(null, 'EQ12', 'EQ12', ORDER.whatsappUrl, payment);
    expect(el.querySelector('.pay')?.textContent).toContain('Yape de BRINDA');
    expect(el.querySelector('.pay')?.textContent).toContain('999111222');
  });
});
