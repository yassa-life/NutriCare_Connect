package lk.sliit.nutricare.health;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/assistant")
@PreAuthorize("hasRole('PATIENT')")
public class PatientGuideController {
    private final PatientGuideService guideService;

    PatientGuideController(PatientGuideService guideService) {
        this.guideService = guideService;
    }

    @PostMapping("/guide")
    public GuideResponse guide(@Valid @RequestBody GuideRequest request) {
        return guideService.answer(request.question(), request.history() == null ? List.of() : request.history());
    }

    public record GuideMessage(@NotBlank String from, @NotBlank @Size(max = 500) String text) {}
    public record GuideRequest(@NotBlank @Size(max = 500) String question, List<GuideMessage> history) {}
    public record GuideResponse(String answer, List<String> suggestedDestinations,
                                boolean nonDiagnostic, String source, String urgency,
                                String emergencyNumber) {}
}
