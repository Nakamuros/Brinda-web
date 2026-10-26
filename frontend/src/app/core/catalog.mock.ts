import { CATEGORIES } from './config';
import { Category } from '../models/category';
import { Product, ProductLine } from '../models/product';

/**
 * DATOS DE EJEMPLO, SOLO DESARROLLO (ver USE_MOCK_CATALOG). Nombres, precios y promociones son
 * inventados para probar el diseño; no son del negocio. Se reemplazan por la API real.
 */

const COMBOS = { slug: 'combos-y-promociones', name: 'Combos y promociones' };

export const MOCK_CATEGORIES: Category[] = [
  ...CATEGORIES.map((c, i) => ({
    id: i + 1,
    name: c.name,
    slug: c.id,
    active: true,
    displayOrder: i + 1,
  })),
  { id: 99, name: COMBOS.name, slug: COMBOS.slug, active: true, displayOrder: 99 },
];

const DAY = 86_400_000;
const inDays = (d: number) => new Date(Date.now() + d * DAY).toISOString();

interface Seed {
  name: string;
  cat: string;
  price: number;
  description: string;
  stock?: boolean;
  featured?: boolean;
  offer?: { price: number; days: number };
  promo?: { buy: number; pay: number; days: number };
  items?: ProductLine[];
}

const SEEDS: Seed[] = [
  {
    name: 'Cerveza rubia lager, six pack 330 ml',
    cat: 'cervezas',
    price: 28,
    featured: true,
    description: 'Lager ligera y fresca, pensada para compartir. Sírvela bien fría.',
  },
  {
    name: 'Cerveza negra artesanal, 500 ml',
    cat: 'cervezas',
    price: 14.5,
    description: 'Notas de café y cacao, cuerpo medio y final seco.',
  },
  {
    name: 'Cerveza IPA artesanal, 330 ml',
    cat: 'cervezas',
    price: 11,
    offer: { price: 9, days: 5 },
    description: 'Amargor marcado y aroma cítrico. Para quienes buscan algo con carácter.',
  },
  {
    name: 'Cerveza de trigo, 330 ml',
    cat: 'cervezas',
    price: 10,
    stock: false,
    description: 'Suave y turbia, con un toque de naranja.',
  },
  {
    name: 'Vino tinto reserva, 750 ml',
    cat: 'vinos',
    price: 59,
    featured: true,
    description: 'Tinto de cuerpo medio, taninos redondos y final largo. Acompaña carnes y pastas.',
  },
  {
    name: 'Vino blanco seco, 750 ml',
    cat: 'vinos',
    price: 46,
    description: 'Fresco y floral, ideal para pescados, ceviche y quesos suaves.',
  },
  {
    name: 'Vino rosado, 750 ml',
    cat: 'vinos',
    price: 42,
    offer: { price: 35, days: 3 },
    description: 'Ligero, frutal y muy fácil de beber. Servir muy frío.',
  },
  {
    name: 'Espumante brut, 750 ml',
    cat: 'vinos',
    price: 68,
    featured: true,
    description: 'Burbuja fina y fresca para el brindis de la noche.',
  },
  {
    name: 'Vino tinto gran reserva, 750 ml',
    cat: 'vinos',
    price: 98,
    stock: false,
    description: 'Crianza larga en barrica, intenso y elegante.',
  },
  {
    name: 'Whisky 12 años, 750 ml',
    cat: 'destilados',
    price: 169,
    featured: true,
    description: 'Suave, con notas de miel y madera. Para tomar solo o con hielo.',
  },
  {
    name: 'Ron añejo, 750 ml',
    cat: 'destilados',
    price: 72,
    promo: { buy: 2, pay: 1, days: 6 },
    description: 'Dulzor de caña y vainilla, perfecto para un trago largo.',
  },
  {
    name: 'Vodka premium, 750 ml',
    cat: 'destilados',
    price: 64,
    description: 'Destilado limpio y neutro, base de todo coctel.',
  },
  {
    name: 'Pisco quebranta, 700 ml',
    cat: 'destilados',
    price: 54,
    featured: true,
    description: 'Pisco puro, de aroma intenso. Para el clásico de la casa.',
  },
  {
    name: 'Gin seco, 700 ml',
    cat: 'destilados',
    price: 89,
    description: 'Enebro y cítricos, listo para un buen gin tonic.',
  },
  {
    name: 'Tequila reposado, 750 ml',
    cat: 'destilados',
    price: 118,
    offer: { price: 99, days: 4 },
    description: 'Agave maduro con un paso corto por barrica.',
  },
  {
    name: 'Licor de café, 700 ml',
    cat: 'licores',
    price: 52,
    description: 'Dulce, cremoso y aromático. Va bien con hielo o con postre.',
  },
  {
    name: 'Licor de crema, 700 ml',
    cat: 'licores',
    price: 49,
    description: 'Suave y sedoso, con un final de vainilla.',
  },
  {
    name: 'Amaro de hierbas, 700 ml',
    cat: 'licores',
    price: 61,
    description: 'Agridulce y herbal, para la sobremesa.',
  },
  {
    name: 'Agua tónica, pack x6',
    cat: 'mezcladores',
    price: 21,
    description: 'Burbuja viva y amargor justo para tus tragos.',
  },
  {
    name: 'Ginger ale, pack x6',
    cat: 'mezcladores',
    price: 21,
    description: 'Jengibre picante y fresco. Para mulas y highballs.',
  },
  {
    name: 'Hielo en bolsa, 2 kg',
    cat: 'mezcladores',
    price: 8,
    description: 'Hielo cristalino de lenta dilución.',
  },
  {
    name: 'Mix de frutos secos, 200 g',
    cat: 'snacks',
    price: 15,
    description: 'Almendras, pecanas y pasas. Un picoteo sin culpa.',
  },
  {
    name: 'Papas fritas artesanales, 150 g',
    cat: 'snacks',
    price: 9,
    description: 'Crocantes y con sal de mar.',
  },
  {
    name: 'Maní salado, 250 g',
    cat: 'snacks',
    price: 7,
    stock: false,
    description: 'Tostado y salado, el compañero de la cerveza.',
  },
  {
    name: 'Combo cervecero',
    cat: COMBOS.slug,
    price: 79,
    featured: true,
    description: 'Todo para la previa: cervezas y algo para picar.',
    items: [
      { name: 'Cerveza rubia lager, six pack 330 ml', quantity: 2 },
      { name: 'Papas fritas artesanales, 150 g', quantity: 1 },
    ],
  },
  {
    name: 'Combo pisco sour',
    cat: COMBOS.slug,
    price: 74,
    offer: { price: 66, days: 5 },
    description: 'Lo necesario para preparar el clásico en casa.',
    items: [
      { name: 'Pisco quebranta, 700 ml', quantity: 1 },
      { name: 'Hielo en bolsa, 2 kg', quantity: 1 },
    ],
  },
  {
    name: 'Combo gin tonic',
    cat: COMBOS.slug,
    price: 105,
    description: 'Gin, tónica y hielo para armar la noche.',
    items: [
      { name: 'Gin seco, 700 ml', quantity: 1 },
      { name: 'Agua tónica, pack x6', quantity: 1 },
      { name: 'Hielo en bolsa, 2 kg', quantity: 1 },
    ],
  },
];

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function build(s: Seed, i: number): Product {
  const categoryName = MOCK_CATEGORIES.find((c) => c.slug === s.cat)?.name ?? '';
  const discount = s.offer?.price;
  const promoLabel = s.promo ? `Lleva ${s.promo.buy}, paga ${s.promo.pay}` : undefined;
  return {
    id: `mock-${String(i + 1).padStart(3, '0')}`,
    slug: slugify(s.name),
    name: s.name,
    description: s.description,
    price: s.price,
    discountPrice: discount,
    finalPrice: discount ?? s.price,
    onOffer: !!s.offer || !!s.promo,
    discountPercent: discount ? Math.round(((s.price - discount) / s.price) * 100) : undefined,
    offerEndsAt: s.offer ? inDays(s.offer.days) : undefined,
    promoBuy: s.promo?.buy,
    promoPay: s.promo?.pay,
    promoLabel,
    promoEndsAt: s.promo ? inDays(s.promo.days) : undefined,
    categorySlug: s.cat,
    categoryName,
    featured: s.featured ?? false,
    inStock: s.stock ?? true,
    productType: s.items ? 'COMBO' : 'PRODUCT',
    items: s.items,
  };
}

/** Orden del servidor: con stock, con promoción, combos, destacados y nombre. */
export function mockProducts(): Product[] {
  return SEEDS.map(build).sort(
    (a, b) =>
      Number(b.inStock) - Number(a.inStock) ||
      Number(b.onOffer) - Number(a.onOffer) ||
      Number(b.productType === 'COMBO') - Number(a.productType === 'COMBO') ||
      Number(b.featured) - Number(a.featured) ||
      a.name.localeCompare(b.name, 'es'),
  );
}
