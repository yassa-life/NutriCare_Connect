package lk.sliit.nutricare.health.mail;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "email_delivery_attempts")
class EmailDeliveryAttempt {
  @Id
  @Column(length = 36, columnDefinition = "VARCHAR(36)")
  private UUID id;

  private String recipientEmail;
  private String template;
  private String status;
  private String messagePreview;
  private Instant createdAt;

  protected EmailDeliveryAttempt() {}

  EmailDeliveryAttempt(
      String recipientEmail, String template, String status, String messagePreview) {
    this.id = UUID.randomUUID();
    this.recipientEmail = recipientEmail;
    this.template = template;
    this.status = status;
    this.messagePreview = messagePreview;
    this.createdAt = Instant.now();
  }
}
