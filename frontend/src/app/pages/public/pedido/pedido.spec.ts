import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Product } from '../../../models/product';
import { CartService } from '../../../services/cart.service';
import { Pedido } from './pedido';

// GSAP/ScrollTrigger necesitan un navegador real: en jsdom se sustituyen (la animación no se prueba aquí).
vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: () => undefined,
    context: (fn: () => void) => {
      fn();
      return { revert: () => undefined };
    },
    from: () => undefined,
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));

const product: Product = {
  id: 'p1',
  slug: 'p1',
  name: 'Pisco Quebranta 500 ml',
  description: '',
  price: 48,
  finalPrice: 48,
  onOffer: false,
  categorySlug: 'piscos-y-whiskys',
  categoryName: 'Piscos y Whiskys',
  featured: false,
  inStock: true,
  productType: 'PRODUCT',
};

const DISTRICTS = [
  { id: 4, name: 'Barranco', zoneName: 'Zona 1 - Cercanos', fee: 6 },
  { id: 20, name: 'Callao', zoneName: 'Zona 3 - Lejanos', fee: 13 },
];

async function render(withItems = true, districts = DISTRICTS) {
  localStorage.clear();
  TestBed.configureTestingModule({
    imports: [Pedido],
    providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
  });
  const http = TestBed.inject(HttpTestingController);
  if (withItems) {
    TestBed.inject(CartService).add(product);
    TestBed.inject(CartService).add(product);
  }
  const fixture = TestBed.createComponent(Pedido);
  fixture.detectChanges();
  http.expectOne('/api/v1/delivery/districts').flush(districts);
  await fixture.whenStable();
  fixture.detectChanges();
  return { fixture, http, el: fixture.nativeElement as HTMLElement };
}

/** Texto sin el espacio de no separación que pone Intl entre "S/" y el importe. */
const money = (el: Element | null) => el?.textContent?.replace(/\u00a0/g, ' ').trim();

function select(el: HTMLElement, value: string, id = 'districtId') {
  const s = el.querySelector(`#${id}`) as HTMLSelectElement;
  s.value = s.options[[...s.options].findIndex((o) => o.textContent?.trim() === value)].value;
  s.dispatchEvent(new Event('change'));
}

function type(el: HTMLElement, id: string, value: string) {
  const input = el.querySelector(`#${id}`) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

function fill(el: HTMLElement) {
  type(el, 'firstName', 'Ana María');
  type(el, 'lastName', "Pérez O'Brien");
  type(el, 'phone', '987654321');
  type(el, 'documentNumber', '12345678');
  type(el, 'address', 'Av. Larco 123');
  select(el, 'Barranco');
  el.querySelectorAll<HTMLInputElement>('input[type=radio], input[type=checkbox]').forEach((i) => {
    // Yape, "Sí" a la edad y las dos casillas obligatorias; la de promociones queda sin marcar.
    if (!['PLIN', 'TRANSFER'].includes(i.value) && i.id !== 'adult-no' && i.id !== 'marketing') {
      i.click();
    }
  });
}

const CREATED = {
  code: 'EQ12',
  status: 'PENDING',
  subtotal: 96,
  deliveryFee: 6,
  total: 102,
  expiresAt: '2026-11-15T20:20:00-05:00',
  items: [{ name: 'Pisco Quebranta 500 ml', quantity: 2, unitPrice: 48, subtotal: 96 }],
  payment: { method: 'YAPE', number: '999111222', transfer: null, amount: 102 },
  whatsappUrl: null,
};

/** Llena el formulario, pulsa "Finalizar compra" y devuelve la petición POST pendiente. */
async function submit() {
  const view = await render();
  const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  fill(view.el);
  view.fixture.detectChanges();
  (view.el.querySelector('.finish') as HTMLButtonElement).click();
  const req = view.http.expectOne({ method: 'POST', url: '/api/v1/orders' });
  const settle = async () => {
    await new Promise((r) => setTimeout(r));
    await view.fixture.whenStable();
    view.fixture.detectChanges();
  };
  return { ...view, navigate, req, settle, cart: TestBed.inject(CartService) };
}

describe('Pedido (checkout)', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('sin productos muestra el carrito vacío y no el formulario', async () => {
    const { el } = await render(false);
    expect(el.querySelector('form')).toBeNull();
    expect(el.textContent).toContain('Tu carrito está vacío');
  });

  it('el distrito se elige de una lista agrupada por zona', async () => {
    const { el } = await render();
    const groups = [...el.querySelectorAll('optgroup')].map((g) => g.label);
    expect(groups).toEqual(['Zona 1 - Cercanos', 'Zona 3 - Lejanos']);
  });

  it('al elegir distrito suma la tarifa al total', async () => {
    const { fixture, el } = await render();
    expect(money(el.querySelector('.sum-total dd'))).toBe('S/ 96.00');
    expect(el.textContent).toContain('Elige tu distrito');

    select(el, 'Callao');
    fixture.detectChanges();
    expect(money(el.querySelector('.sum-total dd'))).toBe('S/ 109.00');

    select(el, 'Barranco');
    fixture.detectChanges();
    expect(money(el.querySelector('.sum-total dd'))).toBe('S/ 102.00');
  });

  it('celular y DNI aceptan solo dígitos y respetan el largo', async () => {
    const { fixture, el } = await render();
    const dni = el.querySelector('#documentNumber') as HTMLInputElement;
    dni.value = '12a3-4567890';
    dni.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(dni.value).toBe('12345678');
    const phone = el.querySelector('#phone') as HTMLInputElement;
    phone.value = '98 765 4321 99';
    phone.dispatchEvent(new Event('input'));
    expect(phone.value).toBe('987654321');
  });

  it('muestra el error de un campo solo después de tocarlo', async () => {
    const { fixture, el } = await render();
    expect(el.querySelector('#documentNumber-msg')?.getAttribute('role')).toBeNull();
    const dni = el.querySelector('#documentNumber') as HTMLInputElement;
    dni.value = '123';
    dni.dispatchEvent(new Event('input'));
    dni.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(el.querySelector('#documentNumber-msg')?.textContent).toContain('El DNI debe tener 8 dígitos.');
    expect(dni.getAttribute('aria-invalid')).toBe('true');
  });

  it('carné de extranjería y pasaporte: letras y números en mayúsculas, con su propio largo', async () => {
    const { fixture, el } = await render();
    const number = el.querySelector('#documentNumber') as HTMLInputElement;
    select(el, 'Pasaporte', 'documentType');
    type(el, 'documentNumber', 'ab-12 3');
    number.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(number.value).toBe('AB123');
    expect(number.getAttribute('maxlength')).toBe('12');
    expect(el.querySelector('#documentNumber-msg')?.textContent).toContain(
      'El pasaporte debe tener entre 6 y 12 letras o números.',
    );
    type(el, 'documentNumber', 'ab1234');
    fixture.detectChanges();
    expect(number.getAttribute('aria-invalid')).toBe('false');

    select(el, 'Carné de extranjería', 'documentType');
    fixture.detectChanges();
    expect(el.querySelector('#documentNumber-msg')?.textContent).toContain('entre 8 y 12');
    // Al volver a DNI el número se limpia a solo dígitos.
    select(el, 'DNI', 'documentType');
    fixture.detectChanges();
    expect(number.value).toBe('1234');
  });

  it('el aviso de delivery muestra la tarifa mínima que da la API', async () => {
    const { el } = await render();
    const notice = el.querySelector('app-delivery-notice');
    expect(money(notice?.querySelector('.title') ?? null)).toBe('Delivery desde S/ 6.00.');
    expect(notice?.textContent).toContain('El monto final te lo confirmamos por WhatsApp antes de pagar.');
    expect(money(el.querySelector('.sum-total dt'))).toBe('Total estimado');
  });

  it('paga con Yape, Plin o transferencia y la casilla de promociones empieza sin marcar', async () => {
    const { el } = await render();
    const methods = [...el.querySelectorAll<HTMLInputElement>('input[formcontrolname=paymentMethod]')];
    expect(methods.map((m) => m.value)).toEqual(['YAPE', 'PLIN', 'TRANSFER']);
    expect((el.querySelector('#marketing') as HTMLInputElement).checked).toBe(false);
  });

  it('con el formulario incompleto no envía nada y muestra los errores', async () => {
    const { fixture, http, el } = await render();
    (el.querySelector('.finish') as HTMLButtonElement).click();
    fixture.detectChanges();
    http.verify(); // sin POST /orders
    expect(el.querySelector('#documentNumber-msg')?.textContent).toContain(
      'Ingresa el número de tu documento.',
    );
    expect(el.textContent).toContain('Debes aceptar los términos y condiciones.');
    expect(el.textContent).toContain('Indica si eres mayor de 18 años.');
  });

  it('"No soy mayor de 18 años": avisa al momento y al finalizar vuelve al inicio sin pedir', async () => {
    const { fixture, http, el } = await render();
    const cart = TestBed.inject(CartService);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fill(el);
    (el.querySelector('#adult-no') as HTMLInputElement).click();
    fixture.detectChanges();
    expect(el.textContent).toContain('Lo sentimos, solo vendemos a mayores de 18 años.');
    const finish = el.querySelector('.finish') as HTMLButtonElement;
    expect(finish.disabled).toBe(false);
    finish.click();
    await fixture.whenStable();
    http.verify(); // sin POST /orders
    expect(navigate).toHaveBeenCalledWith(['/']);
    expect(cart.itemCount()).toBe(2);
  });

  it('envía solo productId y cantidad; al crearse vacía el carrito y va a /pedido/:codigo', async () => {
    const { req, settle, navigate, cart } = await submit();
    expect(req.request.body).toEqual({
      items: [{ productId: 'p1', quantity: 2 }],
      firstName: 'Ana María',
      lastName: "Pérez O'Brien",
      phone: '987654321',
      documentType: 'DNI',
      documentNumber: '12345678',
      districtId: 4,
      address: 'Av. Larco 123',
      reference: '',
      paymentMethod: 'YAPE',
      adultConfirmed: true,
      termsAccepted: true,
      privacyAccepted: true,
      marketingConsent: false,
    });
    expect(cart.itemCount()).toBe(2); // todavía no se vacía
    req.flush(CREATED, { status: 201, statusText: 'Created' });
    await settle();
    expect(navigate).toHaveBeenCalledWith(['/pedido', 'EQ12']);
    expect(cart.itemCount()).toBe(0);
    // El DNI y los datos personales no quedan en el navegador.
    const stored = JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage });
    expect(stored).not.toContain('12345678');
    expect(stored).not.toContain('987654321');
    // Se recuerdan el código y el enlace de WhatsApp del servidor (sin datos personales, 1 h 30 min).
    const recent = JSON.parse(localStorage.getItem('brinda.order.v1') ?? '{}');
    expect(recent.code).toBe('EQ12');
    expect(recent.whatsappUrl).toBe(CREATED.whatsappUrl);
    // Y los datos para pagar (de BRINDA), para verlos tras recargar.
    expect(recent.payment).toEqual(CREATED.payment);
  });

  it('429: pide esperar un minuto y conserva el carrito', async () => {
    const { req, settle, navigate, cart, el } = await submit();
    req.flush(
      { status: 429, code: 'TOO_MANY_REQUESTS', message: 'Demasiados intentos.' },
      { status: 429, statusText: 'Too Many Requests' },
    );
    await settle();
    expect(el.querySelector('.alert')?.textContent).toContain('Espera un minuto');
    expect(navigate).not.toHaveBeenCalled();
    expect(cart.itemCount()).toBe(2);
    expect((el.querySelector('.finish') as HTMLButtonElement).disabled).toBe(false);
  });

  it('stock insuficiente (422/409): muestra el mensaje del servidor y enlaza al carrito', async () => {
    const { req, settle, cart, el } = await submit();
    req.flush(
      {
        status: 422,
        code: 'BUSINESS_RULE',
        message: 'Sin stock suficiente o no disponible: Pisco Quebranta 500 ml',
      },
      { status: 422, statusText: 'Unprocessable Entity' },
    );
    await settle();
    const alert = el.querySelector('.alert');
    expect(alert?.textContent).toContain('Sin stock suficiente o no disponible: Pisco Quebranta');
    expect(alert?.querySelector('a')?.getAttribute('href')).toBe('/carrito');
    expect(cart.itemCount()).toBe(2);
  });

  it('400: marca el campo con el mensaje del servidor', async () => {
    const { req, settle, cart, el } = await submit();
    req.flush(
      {
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Datos inválidos',
        fields: { documentNumber: 'El DNI debe tener 8 dígitos' },
      },
      { status: 400, statusText: 'Bad Request' },
    );
    await settle();
    expect(el.querySelector('#documentNumber-msg')?.textContent).toContain('El DNI debe tener 8 dígitos');
    expect(el.querySelector('.alert')?.textContent).toContain('Revisa los datos marcados');
    expect(cart.itemCount()).toBe(2);
  });

  it('sin distritos entregables muestra "sin zonas de reparto" y no el formulario', async () => {
    const { el } = await render(true, []);
    expect(el.querySelector('form')).toBeNull();
    expect(el.querySelector('.finish')).toBeNull();
    expect(el.textContent).toContain('Aún no tenemos zonas de reparto');
  });

  it('las casillas enlazan a /terminos y /privacidad en otra pestaña', async () => {
    const { el } = await render();
    const links = [...el.querySelectorAll<HTMLAnchorElement>('a.doc')];
    // Términos, privacidad y, en la casilla de promociones, otra vez privacidad.
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/terminos', '/privacidad', '/privacidad']);
    expect(links.every((a) => a.target === '_blank')).toBe(true);
  });
});
