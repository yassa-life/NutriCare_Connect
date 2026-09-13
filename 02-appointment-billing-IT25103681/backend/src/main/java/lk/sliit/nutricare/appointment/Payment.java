package lk.sliit.nutricare.appointment;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payments")
public class Payment {
  @Id private UUID id;

  @Column(nullable = false)
  private UUID invoiceId;

  @Column(nullable = false)
  private String reference;

  @Column(nullable = false)
  private BigDecimal amount;

  @Column(nullable = false)
  private String method;

  @Column(nullable = false)
  private String status;

  @Column(nullable = false)
  private Instant createdAt;

  protected Payment() {}

  public Payment(UUID invoiceId, BigDecimal amount, String method, String status) {
    id = UUID.randomUUID();
    this.invoiceId = invoiceId;
    this.amount = amount;
    this.method = method;
    this.status = status;
    reference = "DEMO-" + id.toString().substring(0, 8).toUpperCase();
    createdAt = Instant.now();
  }

  public UUID getId() {
    return id;
  }

  public UUID getInvoiceId() {
    return invoiceId;
  }

  public String getReference() {
    return reference;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public String getMethod() {
    return method;
  }

  public String getStatus() {
    return status;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
