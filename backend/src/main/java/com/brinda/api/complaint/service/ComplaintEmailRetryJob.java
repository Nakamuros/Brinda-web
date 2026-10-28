package com.brinda.api.complaint.service;

import com.brinda.api.complaint.model.Complaint;
import com.brinda.api.complaint.repository.ComplaintRepository;
import com.brinda.api.shared.mail.EmailSender;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/** Reintenta los correos PENDING o FAILED. No hace nada mientras no haya un servicio de correo real. */
@Component
@RequiredArgsConstructor
public class ComplaintEmailRetryJob {

    private static final int BATCH = 50;

    private final ComplaintRepository repository;
    private final ComplaintNotifier notifier;
    private final EmailSender sender;

    @Scheduled(fixedDelayString = "PT5M", initialDelayString = "PT1M")
    public void retryUnsent() {
        if (!sender.enabled()) {
            return;
        }
        List<Complaint> candidates = repository.findWithUnsentEmail(PageRequest.of(0, BATCH));
        candidates.forEach(c -> notifier.dispatch(c.getId()));
    }
}
