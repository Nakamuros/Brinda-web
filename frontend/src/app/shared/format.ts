const PEN = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });
const DAY_MONTH = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long' });

export const formatPrice = (value: number): string => PEN.format(value);

/** "26 de octubre": para la fecha de fin de una oferta. */
export const formatDay = (iso: string): string => DAY_MONTH.format(new Date(iso));

/** Minúsculas y sin tildes, para buscar sin importar acentos. */
export const normalize = (text: string): string =>
  text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
