package lk.sliit.nutricare.message;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Locale;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/assistant")
@PreAuthorize("hasRole('PATIENT')")
public class PatientGuideController {

    @PostMapping("/guide")
    public GuideResponse guide(@Valid @RequestBody GuideRequest request) {
        String question = request.question().toLowerCase(Locale.ROOT);
        if (contains(question, "book", "appointment", "check-up", "schedule")) {
            return response("Open Appointments, choose a practitioner and available time, then confirm the demo invoice.", "appointments");
        }
        if (contains(question, "diet", "meal", "water", "weight", "progress")) {
            return response("Open Diet & progress to view your published plan, mark meals, add water and review your trend.", "diet");
        }
        if (contains(question, "result", "health", "blood", "bmi", "vital")) {
            return response("Open Health checks to review your own recorded results. Contact your care professional for interpretation.", "health");
        }
        if (contains(question, "message", "dietitian", "doctor", "contact")) {
            return response("Open Messages to send a non-urgent note to your assigned care professional.", "messages");
        }
        if (contains(question, "profile", "name", "phone", "address", "email")) {
            return response("Use the account menu in the top-right corner, then choose Edit profile.", "profile");
        }
        return new GuideResponse(
                "I can guide you to appointments, health records, diet plans, progress, messages or profile settings. I cannot diagnose symptoms or replace a clinician.",
                List.of("appointments", "health", "diet", "messages", "profile"), true);
    }

    private GuideResponse response(String answer, String destination) {
        return new GuideResponse(answer, List.of(destination), true);
    }

    private boolean contains(String value, String... keywords) {
        for (String keyword : keywords) if (value.contains(keyword)) return true;
        return false;
    }

    public record GuideRequest(@NotBlank @Size(max = 500) String question) {}
    public record GuideResponse(String answer, List<String> suggestedDestinations, boolean nonDiagnostic) {}
}
