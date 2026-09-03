package lk.sliit.nutricare.message;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class MessageController {
    private final MessageRepository messages;
    private final NotificationRepository notifications;

    MessageController(MessageRepository messages, NotificationRepository notifications) { this.messages = messages; this.notifications = notifications; }

    @PostMapping("/messages")
    @PreAuthorize("hasRole('DIETITIAN') or (hasRole('PATIENT') and principal == #request.senderId.toString() and principal == #request.patientId.toString())")
    @ResponseStatus(HttpStatus.CREATED)
    SecureMessage send(@Valid @RequestBody MessageRequest request) { return messages.save(new SecureMessage(request.senderId(), request.recipientId(), request.patientId(), request.body())); }

    @GetMapping("/messages/patient/{id}")
    @PreAuthorize("hasRole('DIETITIAN') or (hasRole('PATIENT') and principal == #id.toString())")
    List<SecureMessage> conversation(@PathVariable UUID id) { return messages.findByPatientIdOrderBySentAtAsc(id); }

    @PostMapping("/notifications")
    @PreAuthorize("hasAnyRole('DIETITIAN','DOCTOR','RECEPTION_STAFF','SYSTEM_ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    Notification notify(@Valid @RequestBody NoticeRequest request) { return notifications.save(new Notification(request.recipientId(), request.type(), request.channel(), request.message(), request.simulateFailure() ? "FAILED" : "DELIVERED_SIMULATED")); }

    @GetMapping("/notifications/recipient/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or principal == #id.toString()")
    List<Notification> notices(@PathVariable UUID id) { return notifications.findByRecipientIdOrderByCreatedAtDesc(id); }

    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void retry() { notifications.findByStatusAndRetryAtBefore("FAILED", Instant.now()).forEach(Notification::retry); }

    record MessageRequest(@NotNull UUID senderId, @NotNull UUID recipientId, @NotNull UUID patientId,
                          @NotBlank @Size(max = 2000) String body) {}
    record NoticeRequest(@NotNull UUID recipientId, @NotBlank String type,
                         @Pattern(regexp = "IN_APP|EMAIL|SMS") String channel,
                         @NotBlank String message, boolean simulateFailure) {}
}
