import { CONTACT, PENDING, SHOW_PENDING } from './config';

export interface InfoColumn {
  id?: string;
  title: string;
  text: string;
  pending: boolean;
  href?: string;
}

/**
 * Columnas de zonas, horario y contacto. En producción solo se incluyen las que tienen datos reales;
 * los marcadores "Por confirmar" aparecen únicamente en desarrollo (SHOW_PENDING).
 */
export function buildColumns(): InfoColumn[] {
  const whatsapp = CONTACT.whatsappNumber
    ? `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`
    : '';
  const all: InfoColumn[] = [
    { title: 'Zonas de entrega', text: CONTACT.zones || CONTACT.zonesIntro, pending: false },
    { title: 'Horario', text: CONTACT.hours || PENDING, pending: !CONTACT.hours },
    {
      id: 'contacto',
      title: 'Contacto',
      text: whatsapp ? 'Escríbenos por WhatsApp' : PENDING,
      pending: !whatsapp,
      href: whatsapp || undefined,
    },
  ];
  return all.filter((c) => !c.pending || SHOW_PENDING);
}

/** Con más de la columna de zonas hay sección propia; si no, las zonas van en la franja "Próximamente". */
export const HAS_INFO_SECTION = buildColumns().length > 1;
