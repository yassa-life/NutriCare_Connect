package lk.sliit.nutricare.health;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

class PatientGuideServiceTest {
    private final PatientGuideService service = new PatientGuideService(RestClient.builder(), "", "gemini-3.5-flash-lite");

    @Test
    void usesLocalNavigationWhenNoApiKeyIsConfigured() {
        var response = service.answer("How can I book an appointment?", java.util.List.of());
        assertThat(response.source()).isEqualTo("LOCAL");
        assertThat(response.suggestedDestinations()).containsExactly("appointments");
        assertThat(response.nonDiagnostic()).isTrue();
    }

    @Test
    void urgentQuestionNeverReceivesMedicalAdvice() {
        var response = service.answer("I have chest pain and this is an emergency", java.util.List.of());
        assertThat(response.answer()).contains("1990");
        assertThat(response.urgency()).isEqualTo("EMERGENCY");
        assertThat(response.emergencyNumber()).isEqualTo("1990");
    }

    @Test
    void answersSmallDiabetesFoodQuestionWithProfessionalCareBoundary() {
        var response = service.answer("What should a patient with diabetes eat?");
        assertThat(response.answer()).containsIgnoringCase("vegetables");
        assertThat(response.answer()).containsIgnoringCase("doctor or registered dietitian");
        assertThat(response.urgency()).isEqualTo("ROUTINE");
    }

    @Test
    void emergencyScreeningWorksWithoutAnAiKey() {
        var response = service.answer("Someone is unconscious and not breathing", java.util.List.of());
        assertThat(response.source()).isEqualTo("LOCAL");
        assertThat(response.urgency()).isEqualTo("EMERGENCY");
        assertThat(response.answer()).containsIgnoringCase("call 1990 now");
    }
}
