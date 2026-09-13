package lk.sliit.nutricare.appointment;

import jakarta.persistence.LockModeType;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

interface SlotRepository extends JpaRepository<AvailabilitySlot, UUID> {
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select s from AvailabilitySlot s where s.id=:id")
  Optional<AvailabilitySlot> findForUpdate(@Param("id") UUID id);

  List<AvailabilitySlot> findByStartTimeBetweenOrderByStartTime(
      LocalDateTime from, LocalDateTime to);

  List<AvailabilitySlot> findByStatusAndHoldExpiresAtBefore(String status, Instant now);
}

interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
  List<Appointment> findByPatientId(String patientId);

  List<Appointment> findByPractitionerId(String practitionerId);

  Optional<Appointment> findBySlotId(UUID slotId);
}

interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
  Optional<Invoice> findByAppointmentId(UUID appointmentId);
}

interface PaymentRepository extends JpaRepository<Payment, UUID> {}
