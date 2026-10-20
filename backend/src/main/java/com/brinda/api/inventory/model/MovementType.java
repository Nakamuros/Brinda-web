package com.brinda.api.inventory.model;

public enum MovementType {
    SALE,
    RESTOCK,
    ADJUSTMENT,
    CANCEL_RETURN,
    /** Armado de combos: no son ventas. DISASSEMBLE y RETURN están permitidos en la base pero aún no se usan. */
    COMBO_BUILD,
    COMBO_CONSUME,
    COMBO_DISASSEMBLE,
    COMBO_RETURN
}
