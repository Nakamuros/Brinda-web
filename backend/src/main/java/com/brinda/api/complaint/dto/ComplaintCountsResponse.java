package com.brinda.api.complaint.dto;

/** Para el aviso del panel: reclamos sin responder, por vencer y vencidos. */
public record ComplaintCountsResponse(long pending, long dueSoon, long overdue) {
}
