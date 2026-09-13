package lk.sliit.nutricare.analytics;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "feedback")
public class Feedback {
  @Id private UUID id;

  @Column(nullable = false, length = 16)
  private String patientId;

  @Column(nullable = false, length = 16)
  private String practitionerId;

  @Column(nullable = false)
  private UUID appointmentId;

  @Column(nullable = false)
  private int rating;

  @Column(length = 1500)
  private String comments;

  @Column(nullable = false)
  private Instant createdAt;

  protected Feedback() {}

  public Feedback(
      String patientId, String practitionerId, UUID appointmentId, int rating, String comments) {
    id = UUID.randomUUID();
    this.patientId = patientId;
    this.practitionerId = practitionerId;
    this.appointmentId = appointmentId;
    this.rating = rating;
    this.comments = comments;
    createdAt = Instant.now();
  }

  public UUID getId() {
    return id;
  }

  public String getPatientId() {
    return patientId;
  }

  public String getPractitionerId() {
    return practitionerId;
  }

  public UUID getAppointmentId() {
    return appointmentId;
  }

  public int getRating() {
    return rating;
  }

  public String getComments() {
    return comments;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
