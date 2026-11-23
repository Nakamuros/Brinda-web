import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreatedOrder } from '../../../models/order';
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
  payment: { method: 'YAPE', number: null, amount: 102 },
  whatsappUrl: 'https://wa.me/51999999999?text=Pedido%20EQ12',
};

function render(
  order: CreatedOrder | null,
  codigo = 'EQ12',
  recent = '',
  recentUrl: string | null = null,
) {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [PedidoCreado],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: convertToParamMap({ codigo }) } },
      },
    ],
  });
  TestBed.inject(OrderService).last.set(order);
  TestBed.inject(OrderService).recent.set(
    recent ? { code: recent, at: Date.now(), whatsappUrl: recentUrl } : null,
  );
  const fixture = TestBed.createComponent(PedidoCreado);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('PedidoCreado (/pedido/:codigo)', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('muestra código, resumen, aviso de 20 minutos y el botón de WhatsApp del servidor', () => {
    const el = render(ORDER);
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
    const el = render(ORDER);
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
    const el = render({ ...ORDER, whatsappUrl: null });
    expect(el.querySelector('a.send')).toBeNull();
    expect(el.querySelector('.unavailable')?.textContent).toContain('aún no está disponible');
    expect(el.querySelector('.unavailable')?.textContent).toContain('EQ12');
  });

  it('no enlaza a nada que no sea wa.me', () => {
    const el = render({ ...ORDER, whatsappUrl: 'https://example.com/x' });
    expect(el.querySelector('a.send')).toBeNull();
  });

  it('tras recargar recupera el enlace de WhatsApp recordado (sin datos personales)', () => {
    const el = render(null, 'EQ12', 'EQ12', ORDER.whatsappUrl);
    expect(el.querySelector('.pending')?.textContent).toContain('Falta un paso');
    expect((el.querySelector('a.send') as HTMLAnchorElement).getAttribute('href')).toBe(
      ORDER.whatsappUrl,
    );
    expect(el.querySelector('.summary')).toBeNull();
  });

  it('tras recargar sin enlace recordado conserva solo el código', () => {
    const el = render(null, 'EQ12', 'EQ12');
    expect(el.querySelector('h1')?.textContent).toContain('EQ12');
    expect(el.textContent).toContain('Guarda tu código');
    expect(el.querySelector('.summary')).toBeNull();
    expect(el.querySelector('a.send')).toBeNull();
    expect(el.querySelector('.unavailable')?.textContent).toContain('EQ12');
  });

  it('sin pedido en memoria ni código recordado (u otro código) no muestra datos', () => {
    for (const el of [render(null), render(ORDER, 'ZZ99', 'EQ12')]) {
      expect(el.textContent).toContain('No podemos mostrar este pedido');
      expect(el.querySelector('.summary')).toBeNull();
    }
  });
});
