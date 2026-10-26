/**
 * Configuración editable de la landing.
 * Los valores marcados "por confirmar" los entrega Lucía o su asesor: no inventar datos.
 */
export const PENDING = 'Por confirmar';

export const SITE = {
  name: 'BRINDA',
  tagline: 'Licorería a domicilio en Lima',
  announcement: 'Delivery en Lima · Pide por WhatsApp · Paga con Yape o Plin',
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

/** Ejemplos ilustrativos; las promociones reales vendrán del catálogo (API). */
export const PROMO_EXAMPLES = [
  {
    tag: 'Combo',
    title: 'Combos listos para la reunión',
    text: 'Botella y acompañantes en un solo pedido, armados por nosotros.',
    featured: true,
  },
  {
    tag: 'Oferta',
    title: 'Ofertas por tiempo limitado',
    text: 'Precio rebajado hasta una fecha y hora de fin.',
    featured: false,
  },
  {
    tag: 'Lleva 3 paga 2',
    title: 'Lleva más, paga menos',
    text: 'En productos seleccionados, el descuento se aplica al armar tu pedido.',
    featured: false,
  },
] as const;

export const HOW_TO_ORDER = [
  { title: 'Elige', text: 'Arma tu carrito con cervezas, vinos, destilados y combos.' },
  { title: 'Envía por WhatsApp', text: 'Tu pedido recibe un código corto y se abre el chat con el mensaje listo.' },
  { title: 'Paga con Yape o Plin', text: 'Confirmamos tu pago y salimos a tu dirección.' },
] as const;

/** Datos de contacto. whatsappNumber en formato internacional sin "+" (p. ej. 51XXXXXXXXX). */
export const CONTACT = {
  whatsappNumber: '',
  whatsappMessage: 'Hola BRINDA, quisiera hacer un pedido.',
  zones: PENDING,
  hours: PENDING,
} as const;

/** Espacio reservado para los avisos legales de licor y tabaco (texto del asesor de Lucía). */
export const LEGAL = {
  noticesText: '',
  showPlaceholder: true,
} as const;
