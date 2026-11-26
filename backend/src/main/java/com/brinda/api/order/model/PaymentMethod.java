package com.brinda.api.order.model;

public enum PaymentMethod {
    YAPE("Yape"),
    PLIN("Plin"),
    TRANSFER("Transferencia");

    private final String label;

    PaymentMethod(String label) {
        this.label = label;
    }

    /** Nombre para el cliente (mensaje de WhatsApp, textos del panel). */
    public String label() {
        return label;
    }
}
