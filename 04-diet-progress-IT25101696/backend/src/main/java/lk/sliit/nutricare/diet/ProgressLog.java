package lk.sliit.nutricare.diet;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "progress_logs")
public class ProgressLog {
  @Id private UUID id;

  @Column(nullable = false, length = 16)
  private String patientId;

  private UUID dietPlanId;

  @Column(nullable = false)
  private LocalDate logDate;

  private BigDecimal weightKg;
  private BigDecimal bmi;
  private Integer waterGlasses;
  private Integer mealsCompleted;

  @Column(nullable = false)
  private Instant createdAt;

  protected ProgressLog() {}

  public ProgressLog(
      String patientId,
      UUID dietPlanId,
      LocalDate logDate,
      BigDecimal weightKg,
      BigDecimal bmi,
      Integer waterGlasses,
      Integer mealsCompleted) {
    id = UUID.randomUUID();
    this.patientId = patientId;
    this.dietPlanId = dietPlanId;
    this.logDate = logDate;
    this.weightKg = weightKg;
    this.bmi = bmi;
    this.waterGlasses = waterGlasses;
    this.mealsCompleted = mealsCompleted;
    createdAt = Instant.now();
  }

  public UUID getId() {
    return id;
  }

  public String getPatientId() {
    return patientId;
  }

  public UUID getDietPlanId() {
    return dietPlanId;
  }

  public LocalDate getLogDate() {
    return logDate;
  }

  public BigDecimal getWeightKg() {
    return weightKg;
  }

  public BigDecimal getBmi() {
    return bmi;
  }

  public Integer getWaterGlasses() {
    return waterGlasses;
  }

  public Integer getMealsCompleted() {
    return mealsCompleted;
  }
}
