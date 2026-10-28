package com.brinda.api.complaint.service;

import com.brinda.api.complaint.dto.DeadlineInfo;
import com.brinda.api.complaint.model.Complaint;
import com.brinda.api.complaint.model.ComplaintStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.LocalDate;

/** Calcula en el servidor el vencimiento y el aviso de plazo de cada reclamo. */
@Component
@RequiredArgsConstructor
public class ComplaintDeadlines {

    /** Con este número de días hábiles o menos (y sin vencer) el reclamo se marca "por vencer". */
    public static final int SOON_BUSINESS_DAYS = 3;

    private final ComplaintProperties props;
    private final Clock clock;

    public LocalDate today() {
        return LocalDate.now(clock.withZone(ComplaintPdfService.LIMA));
    }

    public DeadlineInfo of(Complaint c) {
        LocalDate filed = c.getFiledAt().atZoneSameInstant(ComplaintPdfService.LIMA).toLocalDate();
        LocalDate due = BusinessDays.add(filed, props.responseBusinessDays());
        if (c.getStatus() == ComplaintStatus.ANSWERED) {
            boolean late = c.getResponseDate() != null && c.getResponseDate().isAfter(due);
            return new DeadlineInfo(due, null, DeadlineInfo.Level.ANSWERED, late);
        }
        int left = BusinessDays.between(today(), due);
        DeadlineInfo.Level level = left < 0 ? DeadlineInfo.Level.OVERDUE
                : left <= SOON_BUSINESS_DAYS ? DeadlineInfo.Level.SOON : DeadlineInfo.Level.ON_TIME;
        return new DeadlineInfo(due, left, level, false);
    }
}
