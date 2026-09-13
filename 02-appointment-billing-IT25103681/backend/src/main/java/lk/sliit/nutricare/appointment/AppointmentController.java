package lk.sliit.nutricare.appointment;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class AppointmentController {
  private final SlotRepository slots;
  private final AppointmentRepository appointments;
  private final AppointmentService service;

  AppointmentController(
      SlotRepository slots, AppointmentRepository appointments, AppointmentService service) {
    this.slots = slots;
    this.appointments = appointments;
    this.service = service;
  }

  @GetMapping("/schedules/slots")
  List<AvailabilitySlot> slots(@RequestParam LocalDate date) {
    return slots.findByStartTimeBetweenOrderByStartTime(
        date.atStartOfDay(), date.plusDays(1).atStartOfDay());
  }

  @PostMapping("/appointments/hold")
  @PreAuthorize(
      "hasRole('RECEPTION_STAFF') or (hasRole('PATIENT') and principal =="
          + " #request.patientId.toString())")
  @ResponseStatus(HttpStatus.CREATED)
  AppointmentService.Booking hold(@Valid @RequestBody HoldRequest request) {
    return service.hold(
        request.slotId(), request.patientId(), request.serviceType(), request.amount());
  }

  @PostMapping("/appointments/{id}/payments")
  @PreAuthorize("hasAnyRole('PATIENT','RECEPTION_STAFF','FINANCE_EXECUTIVE')")
  @ResponseStatus(HttpStatus.CREATED)
  Payment pay(
      Authentication authentication,
      @PathVariable UUID id,
      @Valid @RequestBody PaymentRequest request) {
    requirePatientOwnership(authentication, id);
    return service.pay(id, request.amount(), request.method(), request.status());
  }

  @PostMapping("/appointments/{id}/cancel")
  @PreAuthorize("hasAnyRole('PATIENT','RECEPTION_STAFF')")
  void cancel(Authentication authentication, @PathVariable UUID id) {
    requirePatientOwnership(authentication, id);
    service.cancel(id);
  }

  @GetMapping("/appointments/patient/{patientId}")
  @PreAuthorize(
      "hasRole('RECEPTION_STAFF') or (hasRole('PATIENT') and principal == #patientId.toString())")
  List<Appointment> patient(@PathVariable String patientId) {
    return appointments.findByPatientId(patientId);
  }

  private void requirePatientOwnership(Authentication authentication, UUID appointmentId) {
    boolean patient =
        authentication.getAuthorities().stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_PATIENT"));
    if (patient) {
      Appointment appointment = appointments.findById(appointmentId).orElseThrow();
      if (!appointment.getPatientId().equals(authentication.getName()))
        throw new AccessDeniedException("Patient record is not owned by this account");
    }
  }

  record HoldRequest(
      @NotNull UUID slotId,
      @NotBlank String patientId,
      @NotBlank String serviceType,
      @NotNull @DecimalMin("0.00") BigDecimal amount) {}

  record PaymentRequest(
      @NotNull @DecimalMin("0.00") BigDecimal amount,
      @NotBlank String method,
      @NotBlank String status) {}
}
