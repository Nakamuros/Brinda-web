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

/** Espacio reservado para los avisos legales de licor y tabaco (texto del asesor de Lucía). */
export const LEGAL = {
  noticesText: '',
  showPlaceholder: true,
} as const;
