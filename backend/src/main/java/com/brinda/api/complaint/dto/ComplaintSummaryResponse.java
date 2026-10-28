package com.brinda.api.complaint.dto;

import com.brinda.api.complaint.model.Complaint;
import com.brinda.api.complaint.model.ComplaintStatus;
import com.brinda.api.complaint.model.ComplaintType;
import com.brinda.api.complaint.model.GoodType;

import java.time.OffsetDateTime;
import java.util.UUID;

/** Fila de la lista del panel: NUNCA lleva el documento (DNI/CE) ni teléfono, correo o dirección. */
public record ComplaintSummaryResponse(UUID id, String code, OffsetDateTime filedAt, String consumerName,
                                       ComplaintType complaintType, GoodType goodType, ComplaintStatus status,
                                       DeadlineInfo deadline, EmailInfo consumerEmail, EmailInfo ownerEmail) {

    public static ComplaintSummaryResponse from(Complaint c, DeadlineInfo deadline) {
        return new ComplaintSummaryResponse(c.getId(), c.getCode(), c.getFiledAt(), c.getConsumerName(),
                c.getComplaintType(), c.getGoodType(), c.getStatus(), deadline,
                EmailInfo.from(c.getConsumerEmailDelivery()), EmailInfo.from(c.getOwnerEmailDelivery()));
    }
}
