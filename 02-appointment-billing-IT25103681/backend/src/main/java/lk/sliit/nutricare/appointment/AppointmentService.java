package lk.sliit.nutricare.appointment;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppointmentService {
  private static final Set<String> PAYMENT_METHODS =
      Set.of("CARD", "CASH", "BANK_TRANSFER", "MOBILE_WALLET");
  private static final Set<String> PAYMENT_STATUSES =
      Set.of("PAID", "PENDING", "PARTIALLY_PAID", "FAILED", "REFUNDED");

  private final SlotRepository slots;
  private final AppointmentRepository appointments;
  private final InvoiceRepository invoices;
  private final PaymentRepository payments;

  AppointmentService(
      SlotRepository slots,
      AppointmentRepository appointments,
      InvoiceRepository invoices,
      PaymentRepository payments) {
    this.slots = slots;
    this.appointments = appointments;
    this.invoices = invoices;
    this.payments = payments;
  }

  @Transactional
  public Booking hold(UUID slotId, String patientId, String service, BigDecimal amount) {
    AvailabilitySlot slot =
        slots
            .findForUpdate(slotId)
            .orElseThrow(() -> new IllegalArgumentException("Slot not found"));
    slot.hold();
    Appointment appointment = appointments.save(new Appointment(slot, patientId, service));
    Invoice invoice = invoices.save(new Invoice(appointment.getId(), amount));
    return new Booking(appointment, invoice, slot);
  }

  @Transactional
  public Payment pay(UUID appointmentId, BigDecimal amount, String method, String status) {
    validatePayment(method, status);

    Appointment appointment = appointments.findById(appointmentId).orElseThrow();
    Invoice invoice = invoices.findByAppointmentId(appointmentId).orElseThrow();
    Payment payment = payments.save(new Payment(invoice.getId(), amount, method, status));

    if ("PAID".equals(status) || "PARTIALLY_PAID".equals(status)) {
      AvailabilitySlot slot = slots.findForUpdate(appointment.getSlotId()).orElseThrow();
      slot.book();
      appointment.confirm();
      invoice.setStatus(status);
    }
    return payment;
  }

  @Transactional
  public void cancel(UUID appointmentId) {
    Appointment appointment = appointments.findById(appointmentId).orElseThrow();
    appointment.cancel();
    slots.findForUpdate(appointment.getSlotId()).ifPresent(AvailabilitySlot::release);
  }

  @Scheduled(fixedDelay = 60000)
  @Transactional
  public void releaseExpired() {
    for (AvailabilitySlot slot : slots.findByStatusAndHoldExpiresAtBefore("HELD", Instant.now())) {
      appointments
          .findBySlotId(slot.getId())
          .filter(appointment -> "HELD".equals(appointment.getStatus()))
          .ifPresent(Appointment::expire);
      slot.release();
    }
  }

  private void validatePayment(String method, String status) {
    if (!PAYMENT_METHODS.contains(method)) {
      throw new IllegalArgumentException("Unsupported demo payment method");
    }
    if (!PAYMENT_STATUSES.contains(status)) {
      throw new IllegalArgumentException("Unsupported payment status");
    }
  }

  public record Booking(Appointment appointment, Invoice invoice, AvailabilitySlot slot) {}
}
