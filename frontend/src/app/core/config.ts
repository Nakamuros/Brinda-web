import { isDevMode } from '@angular/core';

/**
 * Configuración editable de la landing.
 * Los valores marcados "por confirmar" los entrega Lucía o su asesor: no inventar datos.
 */
export const PENDING = 'Por confirmar';

/**
 * Los marcadores internos ("Por confirmar", "Espacio reservado") solo se ven en desarrollo.
 * En producción (ng build) las secciones sin datos se ocultan.
 */
export const SHOW_PENDING = isDevMode();

/** Base de la API. Relativa: en desarrollo la atiende el proxy de `proxy.conf.json` (→ localhost:8080). */
export const API_URL = '/api/v1';

/**
 * Catálogo de ejemplo (`core/catalog.mock.ts`), solo para trabajar el diseño sin backend:
 * en desarrollo, `localStorage.setItem('brinda.mock', '1')` y recargar. Nunca se activa en producción.
 */
export const USE_MOCK_CATALOG = isDevMode() && readFlag('brinda.mock');

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

export const SITE = {
  name: 'BRINDA',
  tagline: 'Licorería a domicilio en Lima',
  announcement: 'Delivery en Lima · Pide por WhatsApp · Paga con Yape o Plin',
  /** Versión de una sola línea para celular. */
  announcementShort: 'Delivery en Lima · Yape o Plin',
} as const;

/**
 * Hero. Para activar el video basta con poner aquí la URL del MP4 (almacenamiento externo, p. ej. R2).
 * Vacío = solo se muestra el poster. Reemplazar también los posters por los definitivos (WebP/AVIF).
 */
export const HERO = {
  videoUrl: '',
  videoMobileUrl: '',
  videoWebmUrl: '',
  posterUrl: 'media/hero-poster.svg',
  posterMobileUrl: 'media/hero-poster-mobile.svg',
} as const;

/** Imágenes configurables. Vacío o ausente = placeholder local. */
export const IMAGES = {
  introProduct: 'media/product-placeholder.svg',
  categories: {
    cervezas: '',
    vinos: '',
    destilados: '',
    licores: '',
    mezcladores: '',
    snacks: '',
  } as Record<string, string>,
} as const;

/** Sin cigarros hasta que el asesor lo confirme. */
export const CATEGORIES = [
  { id: 'cervezas', name: 'Cervezas' },
  { id: 'vinos', name: 'Vinos' },
  { id: 'destilados', name: 'Destilados' },
  { id: 'licores', name: 'Licores' },
  { id: 'mezcladores', name: 'Mezcladores' },
  { id: 'snacks', name: 'Snacks' },
] as const;

export const HOW_TO_ORDER = [
  { title: 'Elige', text: 'Arma tu carrito con cervezas, vinos, destilados y combos.' },
  {
    title: 'Envía por WhatsApp',
    text: 'Tu pedido recibe un código corto y se abre el chat con el mensaje listo.',
  },
  { title: 'Paga con Yape o Plin', text: 'Confirmamos tu pago y salimos a tu dirección.' },
] as const;

/** Datos de contacto. whatsappNumber en formato internacional sin "+" (p. ej. 51XXXXXXXXX). */
export const CONTACT = {
  whatsappNumber: '',
  whatsappMessage: 'Hola BRINDA, quisiera hacer un pedido.',
  /** Texto público de zonas mientras no haya la lista real de distritos. */
  zonesIntro: 'Lima. Distritos con cobertura, muy pronto.',
  /** Lista real de distritos (la entrega Lucía). Vacío = se muestra zonesIntro. */
  zones: '',
  hours: '',
} as const;

/**
 * Datos legales. Proveedor y notas literales de la Hoja de Reclamación (public/legal/hoja-reclamacion.pdf).
 * La redacción final la confirma el asesor de Lucía: no inventar ni parafrasear textos legales.
 */
export const LEGAL = {
  /** Espacio reservado para los avisos legales de licor y tabaco (texto del asesor de Lucía). */
  noticesText: '',
  showPlaceholder: true,
  /** Datos del proveedor tal como figuran en la hoja. El domicilio NO es zona de reparto ni punto de venta. */
  provider: {
    name: 'BRINDA PERU SAC',
    ruc: '20616579607',
    address: 'Av. Alfredo Benavides 707, 1403, Miraflores',
  },
  alcoholWarning: 'TOMAR BEBIDAS ALCOHÓLICAS EN EXCESO ES DAÑINO',
  minorsNotice:
    'No se entregan productos a menores de 18 años. El repartidor pedirá tu DNI físico al momento de la entrega.',
  complaints: {
    path: '/libro-de-reclamaciones',
    logo: 'legal/logo-libro-reclamaciones.png',
    sheetPdf: 'legal/hoja-reclamacion.pdf',
    responseDays: 15,
    definitions: [
      { term: 'Reclamo', text: 'Disconformidad relacionada a los productos o servicios.' },
      {
        term: 'Queja',
        text: 'Disconformidad no relacionada a los productos o servicios; o, malestar o descontento respecto a la atención al público.',
      },
    ],
    notes: [
      'La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.',
      'El proveedor debe dar respuesta al reclamo o queja en un plazo no mayor a quince (15) días hábiles, el cual es improrrogable.',
    ],
  },
} as const;

/**
 * Control de edad (+18) a la entrada. Solo un filtro: la validación real es `adultConfirmed` del checkout.
 * Rutas exentas: nunca se bloquea el Libro de Reclamaciones ni las páginas legales.
 * Decisión pendiente del asesor: confirmar que esta excepción es suficiente.
 */
export const AGE_GATE = {
  storageKey: 'brinda.age18.v1',
  exemptPaths: ['/libro-de-reclamaciones', '/terminos', '/privacidad'],
} as const;
