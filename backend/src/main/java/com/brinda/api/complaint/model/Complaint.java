package com.brinda.api.complaint.model;

import com.brinda.api.shared.model.Auditable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/** Hoja de Reclamación virtual: un campo por cada campo de la hoja oficial. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "complaints")
public class Complaint extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "complaint_year", nullable = false, updatable = false)
    private short complaintYear;

    @Column(name = "complaint_number", nullable = false, updatable = false)
    private int complaintNumber;

    @Column(nullable = false, unique = true, length = 20, updatable = false)
    private String code;

    @Column(name = "filed_at", nullable = false, updatable = false)
    private OffsetDateTime filedAt;

    /** SHA-256 (hex) del token de descarga; el token en claro no se guarda. */
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "copy_token_hash", nullable = false, unique = true, length = 64, updatable = false)
    private String copyTokenHash;

    @Column(name = "consumer_name", nullable = false, length = 160)
    private String consumerName;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 3)
    private DocumentType documentType;

    /** Cifrado AES-GCM (DniCipher); nunca se guarda ni se loguea en claro. */
    @Column(name = "document_encrypted", nullable = false, length = 255)
    private String documentEncrypted;

    @Column(name = "consumer_address", nullable = false, length = 255)
    private String consumerAddress;

    @Column(name = "consumer_phone", nullable = false, length = 20)
    private String consumerPhone;

    @Column(name = "consumer_email", nullable = false, length = 120)
    private String consumerEmail;

    @Column(name = "guardian_name", length = 160)
    private String guardianName;

    @Enumerated(EnumType.STRING)
    @Column(name = "good_type", nullable = false, length = 10)
    private GoodType goodType;

    @Column(name = "claimed_amount", precision = 10, scale = 2)
    private BigDecimal claimedAmount;

    @Column(name = "good_description", nullable = false, length = 500)
    private String goodDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "complaint_type", nullable = false, length = 10)
    private ComplaintType complaintType;

    @Column(nullable = false, columnDefinition = "text")
    private String detail;

    @Column(name = "consumer_request", nullable = false, columnDefinition = "text")
    private String consumerRequest;

    @Column(name = "privacy_accepted_at", nullable = false)
    private OffsetDateTime privacyAcceptedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ComplaintStatus status = ComplaintStatus.RECEIVED;

    @Column(name = "response_text", columnDefinition = "text")
    private String responseText;

    @Column(name = "response_date")
    private LocalDate responseDate;

    @Column(name = "responded_by")
    private UUID respondedBy;

    @Column(name = "responded_at")
    private OffsetDateTime respondedAt;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "status", column = @Column(name = "consumer_email_status", nullable = false, length = 10)),
            @AttributeOverride(name = "attempts", column = @Column(name = "consumer_email_attempts", nullable = false)),
            @AttributeOverride(name = "lastAttemptAt", column = @Column(name = "consumer_email_last_attempt_at")),
            @AttributeOverride(name = "sentAt", column = @Column(name = "consumer_email_sent_at"))})
    private EmailDelivery consumerEmailDelivery = new EmailDelivery();

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "status", column = @Column(name = "owner_email_status", nullable = false, length = 10)),
            @AttributeOverride(name = "attempts", column = @Column(name = "owner_email_attempts", nullable = false)),
            @AttributeOverride(name = "lastAttemptAt", column = @Column(name = "owner_email_last_attempt_at")),
            @AttributeOverride(name = "sentAt", column = @Column(name = "owner_email_sent_at"))})
    private EmailDelivery ownerEmailDelivery = new EmailDelivery();
}
