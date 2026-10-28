package com.brinda.api.complaint.dto;

import com.brinda.api.complaint.model.Complaint;
import com.brinda.api.complaint.model.ComplaintStatus;
import com.brinda.api.complaint.model.ComplaintType;
import com.brinda.api.complaint.model.DocumentType;
import com.brinda.api.complaint.model.GoodType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/** Detalle completo: único lugar donde sale el documento descifrado (cada lectura queda auditada). */
public record ComplaintDetailResponse(UUID id, String code, int number, int year, OffsetDateTime filedAt,
                                      String consumerName, DocumentType documentType, String documentNumber,
                                      String address, String phone, String email, String guardianName,
                                      GoodType goodType, BigDecimal claimedAmount, String goodDescription,
                                      ComplaintType complaintType, String detail, String consumerRequest,
                                      OffsetDateTime privacyAcceptedAt, ComplaintStatus status, String responseText,
                                      LocalDate responseDate, OffsetDateTime respondedAt, DeadlineInfo deadline,
                                      EmailInfo consumerEmail, EmailInfo ownerEmail) {

    public static ComplaintDetailResponse from(Complaint c, String documentNumber, DeadlineInfo deadline) {
        return new ComplaintDetailResponse(c.getId(), c.getCode(), c.getComplaintNumber(), c.getComplaintYear(),
                c.getFiledAt(), c.getConsumerName(), c.getDocumentType(), documentNumber, c.getConsumerAddress(),
                c.getConsumerPhone(), c.getConsumerEmail(), c.getGuardianName(), c.getGoodType(),
                c.getClaimedAmount(), c.getGoodDescription(), c.getComplaintType(), c.getDetail(),
                c.getConsumerRequest(), c.getPrivacyAcceptedAt(), c.getStatus(), c.getResponseText(),
                c.getResponseDate(), c.getRespondedAt(), deadline, EmailInfo.from(c.getConsumerEmailDelivery()),
                EmailInfo.from(c.getOwnerEmailDelivery()));
    }
}
