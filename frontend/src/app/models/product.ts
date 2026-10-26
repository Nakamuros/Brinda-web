/** Contenido de un combo ("Incluye: 2 x ..."). */
export interface ProductLine {
  name: string;
  quantity: number;
}

/** Vista pública de un producto: forma de `PublicProductResponse` (backend/ENDPOINTS.md). */
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  finalPrice: number;
  onOffer: boolean;
  discountPercent?: number;
  offerEndsAt?: string;
  promoBuy?: number;
  promoPay?: number;
  promoLabel?: string;
  promoEndsAt?: string;
  /** Ausente = sin foto: se muestra la imagen genérica. */
  imageUrl?: string;
  categorySlug: string;
  categoryName: string;
  featured: boolean;
  inStock: boolean;
  productType: 'PRODUCT' | 'COMBO';
  items?: ProductLine[];
}
