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
    if (patientId == null || patientId.isBlank()) {
      throw new IllegalArgumentException("patientId is required");
    }
    if (practitionerId == null || practitionerId.isBlank()) {
      throw new IllegalArgumentException("practitionerId is required");
    }
    if (appointmentId == null) {
      throw new IllegalArgumentException("appointmentId is required");
    }
    id = UUID.randomUUID();
    this.patientId = patientId;
    this.practitionerId = practitionerId;
    this.appointmentId = appointmentId;
    apply(rating, comments);
    createdAt = Instant.now();
  }

  public void update(int rating, String comments) {
    apply(rating, comments);
  }

  private void apply(int rating, String comments) {
    if (rating < 1 || rating > 5) {
      throw new IllegalArgumentException("rating must be between 1 and 5");
    }
    if (comments != null && comments.length() > 1500) {
      throw new IllegalArgumentException("comments must be at most 1500 characters");
    }
    this.rating = rating;
    this.comments = comments == null || comments.isBlank() ? null : comments.trim();
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
