import { isDevMode } from '@angular/core';
import { environment } from '../../environments/environment';

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

/** Base de la API por entorno (src/environments): relativa en desarrollo, subdominio propio en producción. */
export const API_URL = environment.apiUrl;

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
} as const;

/** Minutos que un pedido espera confirmación; igual que la expiración del backend (`OrderProperties`). */
export const ORDER = { expiryMinutes: 20 } as const;

/** Cómo pedir: el paso 3 deja claro que sin el mensaje de WhatsApp el pedido no avanza. */
export const HOW_TO_ORDER = [
  { title: 'Elige', text: 'Arma tu carrito desde el catálogo.' },
  { title: 'Deja tus datos', text: 'Tu pedido recibe un código corto.' },
  {
    title: 'Envíalo por WhatsApp',
    text: 'Pulsa «Enviar por WhatsApp». Sin ese mensaje, tu pedido no avanza.',
  },
  {
    title: 'Paga con Yape o Plin',
    // Misma redacción que el aviso de /pedido/:codigo; no promete reserva de stock.
    text: `Verificamos tu pago y salimos a tu dirección. Tu pedido se mantiene ${ORDER.expiryMinutes} minutos: si no se confirma antes, vence.`,
  },
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
  /** Avisos legales de licor y tabaco (texto del asesor de Lucía). Vacío = no se muestra. */
  noticesText: '',
  /** Datos del proveedor tal como figuran en la hoja. El domicilio NO es zona de reparto ni punto de venta. */
  provider: {
    name: 'BRINDA PERU SAC',
    ruc: '20616579607',
    /** Literal de la hoja oficial (txtDomicilio). */
    address: 'AV ALFREDO BENAVIDES 707. 1403, MIRAFLORES',
  },
  alcoholWarning: 'TOMAR BEBIDAS ALCOHÓLICAS EN EXCESO ES DAÑINO',
  minorsNotice:
    'No se entregan productos a menores de 18 años. El repartidor pedirá tu DNI físico al momento de la entrega.',
  complaints: {
    path: '/libro-de-reclamaciones',
    logo: 'legal/logo-libro-reclamaciones.png',
    sheetPdf: 'legal/hoja-reclamacion.pdf',
    responseDays: 15,
    /** Tipo de hoja tal como figura en la plantilla (txtTipoHoja). */
    sheetType: 'HOJA DE RECLAMACIÓN VIRTUAL',
    /** Días que vale el enlace de la copia; igual que `ComplaintService` del backend. */
    copyDays: 30,
    /** Firma del consumidor: el mecanismo lo define la asesora. Solo se muestra en desarrollo. */
    signature: PENDING,
    /** Lo que la asesora debe confirmar antes de publicar la ruta (aviso solo en desarrollo). */
    beforeProduction:
      'Esta ruta no puede salir a producción hasta que la asesora confirme: correo, conservación de al menos 2 años, firma, validez de la copia digital y feriados en el plazo.',
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
