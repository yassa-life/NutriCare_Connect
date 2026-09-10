package lk.sliit.nutricare.integration;

import java.math.BigDecimal;
import java.security.Principal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/workspace")
public class WorkspaceController {
    private final JdbcTemplate jdbc;

    public WorkspaceController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/people")
    @PreAuthorize("hasAnyRole('DIETITIAN','DOCTOR','RECEPTION_STAFF','SYSTEM_ADMIN','MEDICAL_CENTER_COORDINATOR')")
    public List<PersonView> people(Authentication authentication) {
        String role = authentication.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        String sql = """
                SELECT id, full_name, role, enabled
                FROM user_accounts
                WHERE enabled = TRUE
                """;
        Object[] parameters = new Object[0];
        if ("DOCTOR".equals(role) || "DIETITIAN".equals(role) || "RECEPTION_STAFF".equals(role)) {
            sql += " AND role = ?";
            parameters = new Object[]{"PATIENT"};
        }
        sql += " ORDER BY role, full_name";
        return jdbc.query(sql, (row, ignored) -> new PersonView(
                row.getString("id"), row.getString("full_name"), row.getString("role"), row.getBoolean("enabled")), parameters);
    }

    @GetMapping("/appointments")
    public List<AppointmentView> appointments(Authentication authentication) {
        String role = authentication.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        String sql = """
                SELECT a.id, a.patient_id, patient.full_name patient_name,
                       a.practitioner_id, practitioner.full_name practitioner_name,
                       a.service_type, a.status, a.created_at, s.start_time,
                       i.invoice_number, i.amount, i.status invoice_status
                FROM appointments a
                JOIN availability_slots s ON s.id = a.slot_id
                JOIN user_accounts patient ON patient.id = a.patient_id
                JOIN user_accounts practitioner ON practitioner.id = a.practitioner_id
                LEFT JOIN invoices i ON i.appointment_id = a.id
                """;
        Object[] parameters = new Object[0];
        if ("PATIENT".equals(role)) {
            sql += " WHERE a.patient_id = ?";
            parameters = new Object[]{authentication.getName()};
        } else if ("DOCTOR".equals(role) || "DIETITIAN".equals(role)) {
            sql += " WHERE a.practitioner_id = ?";
            parameters = new Object[]{authentication.getName()};
        }
        sql += " ORDER BY s.start_time DESC";
        return jdbc.query(sql, (row, ignored) -> new AppointmentView(
                row.getString("id"), row.getString("patient_id"), row.getString("patient_name"),
                row.getString("practitioner_id"), row.getString("practitioner_name"),
                row.getString("service_type"), row.getString("status"),
                toDateTime(row.getTimestamp("start_time")), row.getString("invoice_number"),
                row.getBigDecimal("amount"), row.getString("invoice_status")), parameters);
    }

    @GetMapping("/slots")
    public List<SlotView> slots(Authentication authentication, @RequestParam LocalDate date) {
        String role = authentication.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        String sql = """
                SELECT s.id, s.practitioner_id, u.full_name practitioner_name,
                       s.start_time, s.duration_minutes, s.status
                FROM availability_slots s
                JOIN user_accounts u ON u.id = s.practitioner_id
                WHERE s.start_time >= ? AND s.start_time < ?
                """;
        Object[] parameters;
        if ("DOCTOR".equals(role) || "DIETITIAN".equals(role)) {
            sql += " AND s.practitioner_id = ?";
            parameters = new Object[]{date.atStartOfDay(), date.plusDays(1).atStartOfDay(), authentication.getName()};
        } else {
            parameters = new Object[]{date.atStartOfDay(), date.plusDays(1).atStartOfDay()};
        }
        sql += " ORDER BY s.start_time";
        return jdbc.query(sql, (row, ignored) -> new SlotView(
                row.getString("id"), row.getString("practitioner_id"), row.getString("practitioner_name"),
                toDateTime(row.getTimestamp("start_time")), row.getInt("duration_minutes"), row.getString("status")), parameters);
    }

    @GetMapping("/summary")
    public Map<String, Object> summary(Principal principal, Authentication authentication) {
        List<AppointmentView> visibleAppointments = appointments(authentication);
        long confirmed = visibleAppointments.stream().filter(item -> "CONFIRMED".equals(item.status())).count();
        BigDecimal outstanding = visibleAppointments.stream()
                .filter(item -> item.invoiceStatus() != null && !"PAID".equals(item.invoiceStatus()))
                .map(AppointmentView::amount).filter(amount -> amount != null).reduce(BigDecimal.ZERO, BigDecimal::add);
        return Map.of(
                "accountId", principal.getName(),
                "appointments", visibleAppointments.size(),
                "confirmed", confirmed,
                "outstanding", outstanding);
    }

    private LocalDateTime toDateTime(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }

    public record PersonView(String id, String fullName, String role, boolean enabled) {}
    public record AppointmentView(String id, String patientId, String patientName, String practitionerId,
                                  String practitionerName, String serviceType, String status,
                                  LocalDateTime startTime, String invoiceNumber, BigDecimal amount,
                                  String invoiceStatus) {}
    public record SlotView(String id, String practitionerId, String practitionerName, LocalDateTime startTime,
                           int durationMinutes, String status) {}
}
