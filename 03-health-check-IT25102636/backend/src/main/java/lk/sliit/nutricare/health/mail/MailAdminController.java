package lk.sliit.nutricare.health.mail;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/mail")
@PreAuthorize("hasRole('SYSTEM_ADMIN')")
public class MailAdminController {
  private final SmtpAccountMailer mailer;
  private final EmailDeliveryAttemptRepository deliveries;

  MailAdminController(SmtpAccountMailer mailer, EmailDeliveryAttemptRepository deliveries) {
    this.mailer = mailer;
    this.deliveries = deliveries;
  }

  @GetMapping("/status")
  Map<String, Object> status() {
    return Map.of(
        "liveEmailEnabled",
        mailer.isLiveEmail(),
        "fromAddress",
        mailer.getFromAddress().isBlank() ? "(not configured)" : mailer.getFromAddress(),
        "mode",
        mailer.isLiveEmail() ? "LIVE_SMTP" : "SIMULATED");
  }

  @PostMapping("/test")
  @ResponseStatus(HttpStatus.CREATED)
  AttemptView sendTest(@Valid @RequestBody TestMailRequest request) {
    return AttemptView.of(mailer.sendAdminTest(request.to()));
  }

  @GetMapping("/attempts")
  List<AttemptView> attempts() {
    return deliveries.findTop20ByOrderByCreatedAtDesc().stream().map(AttemptView::of).toList();
  }

  public record TestMailRequest(@Email @NotBlank String to) {}

  public record AttemptView(
      UUID id,
      String recipientEmail,
      String template,
      String status,
      String messagePreview,
      Instant createdAt) {
    static AttemptView of(EmailDeliveryAttempt attempt) {
      return new AttemptView(
          attempt.getId(),
          attempt.getRecipientEmail(),
          attempt.getTemplate(),
          attempt.getStatus(),
          attempt.getMessagePreview(),
          attempt.getCreatedAt());
    }
  }
}
