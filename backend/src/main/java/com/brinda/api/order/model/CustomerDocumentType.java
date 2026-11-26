package com.brinda.api.order.model;

/** Documento del cliente en el pedido (Política de Privacidad, punto 2). El número se guarda cifrado. */
public enum CustomerDocumentType {
    DNI("DNI"),
    CE("Carné de extranjería"),
    PASSPORT("Pasaporte");

    private final String label;

    CustomerDocumentType(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }
}
