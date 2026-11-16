/** Cuerpo de `POST /api/v1/orders` (`CreateOrderRequest`). Sin precios: los calcula el servidor. */
export interface CreateOrderRequest {
  items: { productId: string; quantity: number }[];
  firstName: string;
  lastName: string;
  phone: string;
  dni: string;
  address: string;
  reference: string;
  districtId: number;
  paymentMethod: 'YAPE' | 'PLIN';
  adultConfirmed: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

/** Forma de `CreatedOrderResponse`. */
export interface CreatedOrder {
  code: string;
  status: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  expiresAt: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    promoDiscount?: number | null;
    promo?: string | null;
    subtotal: number;
  }[];
  /** `number` es el Yape/Plin de BRINDA; null si el servidor aún no lo tiene configurado. */
  payment: { method: 'YAPE' | 'PLIN'; number: string | null; amount: number };
  /** null si el WhatsApp aún no está configurado en el servidor. */
  whatsappUrl: string | null;
}
