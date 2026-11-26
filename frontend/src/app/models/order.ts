export type PaymentMethod = 'YAPE' | 'PLIN' | 'TRANSFER';
export type DocumentType = 'DNI' | 'CE' | 'PASSPORT';

/** Nombres para el cliente y el panel. */
export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  YAPE: 'Yape',
  PLIN: 'Plin',
  TRANSFER: 'Transferencia',
};
export const DOCUMENT_LABEL: Record<DocumentType, string> = {
  DNI: 'DNI',
  CE: 'Carné de extranjería',
  PASSPORT: 'Pasaporte',
};

/** Cuenta de BRINDA para transferencias (no es dato personal). */
export interface TransferAccount {
  bank: string;
  account: string;
  cci: string;
  holder: string;
}

/**
 * Datos para pagar. `number` es el Yape/Plin de BRINDA y `transfer` la cuenta; ambos null si el servidor aún no
 * los tiene configurados ("te enviaremos los datos por WhatsApp").
 */
export interface OrderPayment {
  method: PaymentMethod;
  number: string | null;
  transfer: TransferAccount | null;
  amount: number;
}

/** Cuerpo de `POST /api/v1/orders` (`CreateOrderRequest`). Sin precios: los calcula el servidor. */
export interface CreateOrderRequest {
  items: { productId: string; quantity: number }[];
  firstName: string;
  lastName: string;
  phone: string;
  documentType: DocumentType;
  documentNumber: string;
  address: string;
  reference: string;
  districtId: number;
  paymentMethod: PaymentMethod;
  adultConfirmed: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  /** Casilla opcional de promociones (sin marcar por defecto). */
  marketingConsent: boolean;
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
  payment: OrderPayment;
  /** null si el WhatsApp aún no está configurado en el servidor. */
  whatsappUrl: string | null;
}
