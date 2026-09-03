package lk.sliit.nutricare.analytics;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class AnalyticsController {
    private final FeedbackRepository feedback;
    private final ComplaintRepository complaints;
    private final JdbcTemplate jdbc;

    AnalyticsController(FeedbackRepository feedback, ComplaintRepository complaints, JdbcTemplate jdbc) { this.feedback = feedback; this.complaints = complaints; this.jdbc = jdbc; }

    @PostMapping("/feedback")
    @PreAuthorize("hasRole('PATIENT') and principal == #request.patientId.toString()")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    Result submit(@Valid @RequestBody FeedbackRequest request) {
        Feedback saved = feedback.save(new Feedback(request.patientId(), request.practitionerId(), request.appointmentId(), request.rating(), request.comments()));
        Complaint complaint = request.rating() <= 2 ? complaints.save(new Complaint(saved.getId())) : null;
        return new Result(saved, complaint);
    }

    @GetMapping("/complaints")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN','OPERATIONS_MANAGER','PATIENT_RELATIONS_OFFICER')")
    List<Complaint> complaints() { return complaints.findAll(); }

    @GetMapping("/reports/summary")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN','OPERATIONS_MANAGER','FINANCE_EXECUTIVE')")
    Map<String, Object> summary(@RequestParam LocalDate from, @RequestParam LocalDate to) {
        return Map.of("from", from, "to", to, "users", count("user_accounts"), "appointments", count("appointments"),
                "completedPayments", countWhere("payments", "status='PAID'"), "openAlerts", countWhere("health_alerts", "status='OPEN'"),
                "publishedPlans", countWhere("diet_plans", "status='PUBLISHED'"), "feedback", count("feedback"),
                "averageRating", decimal("SELECT COALESCE(AVG(rating),0) FROM feedback"));
    }

    private long count(String table) { return jdbc.queryForObject("SELECT COUNT(*) FROM " + table, Long.class); }
    private long countWhere(String table, String where) { return jdbc.queryForObject("SELECT COUNT(*) FROM " + table + " WHERE " + where, Long.class); }
    private BigDecimal decimal(String sql) { return jdbc.queryForObject(sql, BigDecimal.class); }

    record FeedbackRequest(@NotNull UUID patientId, @NotNull UUID practitionerId, @NotNull UUID appointmentId,
                           @Min(1) @Max(5) int rating, @Size(max = 1500) String comments) {}
    record Result(Feedback feedback, Complaint complaint) {}
}
