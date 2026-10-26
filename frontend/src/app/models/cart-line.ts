/** Línea del carrito: copia mínima del producto para mostrarlo sin esperar al catálogo. */
export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  categorySlug: string;
  imageUrl?: string;
  /** Precio unitario vigente (con la oferta de precio aplicada, si la hay). */
  finalPrice: number;
  /** Precio de lista, para mostrar el ahorro de una oferta. */
  price: number;
  promoBuy?: number;
  promoPay?: number;
  quantity: number;
  /** false si el producto ya no existe o se agotó al reconciliar con el catálogo. */
  available: boolean;
}
