package lk.sliit.nutricare.appointment;

import jakarta.persistence.*;
import java.time.*;
import java.util.UUID;

@Entity
@Table(
    name = "availability_slots",
    uniqueConstraints =
        @UniqueConstraint(
            name = "uk_practitioner_slot",
            columnNames = {"practitioner_id", "start_time"}))
public class AvailabilitySlot {
  @Id private UUID id;

  @Column(name = "practitioner_id", nullable = false, length = 16)
  private String practitionerId;

  @Column(name = "start_time", nullable = false)
  private LocalDateTime startTime;

  @Column(nullable = false)
  private int durationMinutes;

  @Column(nullable = false)
  private String status;

  private Instant holdExpiresAt;
  @Version private long version;

  protected AvailabilitySlot() {}

  public AvailabilitySlot(String practitionerId, LocalDateTime start) {
    id = UUID.randomUUID();
    this.practitionerId = practitionerId;
    startTime = start;
    durationMinutes = 60;
    status = "AVAILABLE";
  }

  public UUID getId() {
    return id;
  }

  public String getPractitionerId() {
    return practitionerId;
  }

  public LocalDateTime getStartTime() {
    return startTime;
  }

  public String getStatus() {
    return status;
  }

  public Instant getHoldExpiresAt() {
    return holdExpiresAt;
  }

  public boolean canHold() {
    return "AVAILABLE".equals(status)
        || ("HELD".equals(status)
            && holdExpiresAt != null
            && holdExpiresAt.isBefore(Instant.now()));
  }

  public void hold() {
    if (!canHold()) throw new IllegalStateException("Slot is no longer available");
    status = "HELD";
    holdExpiresAt = Instant.now().plusSeconds(600);
  }

  public void book() {
    if (!"HELD".equals(status) || holdExpiresAt.isBefore(Instant.now()))
      throw new IllegalStateException("Slot hold expired");
    status = "BOOKED";
  }

  public void release() {
    status = "AVAILABLE";
    holdExpiresAt = null;
  }
}
