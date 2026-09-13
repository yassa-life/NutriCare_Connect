package lk.sliit.nutricare.health;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
class PatientGuideService {
  private static final Logger LOGGER = LoggerFactory.getLogger(PatientGuideService.class);
  private static final String EMERGENCY_NUMBER = "1990";
  private static final String SYSTEM_INSTRUCTION =
      """
You are NutriGuide, a friendly health question-and-answer chatbot inside NutriCare Connect
and temporary AI care support when a care-team member is unavailable. Answer small health,
food, wellbeing and symptom questions directly in simple everyday language. You may help the patient
describe symptoms, understand how urgent it may be, choose an appropriate next step,
and provide conservative, widely accepted self-care information for mild situations.

Safety rules are mandatory: never diagnose, claim certainty, prescribe a medicine,
recommend changing a prescribed treatment, give medication dosages, or replace a doctor.
Do not interpret laboratory or vital-sign results as a diagnosis. Ask no more than two
short clarifying questions at a time. For any possible emergency, tell the patient to call
Sri Lanka's free 1990 Suwa Seriya ambulance service now and not wait for chat. For severe
breathing difficulty, chest pressure/pain, unconsciousness, stroke signs, seizure, severe
bleeding, poisoning/overdose, serious allergic reaction, or self-harm risk, prioritize the
emergency action over every other response. Encourage same-day professional care when the
condition is uncertain or worsening. Never claim that a NutriCare clinician is currently
monitoring the conversation. Do not request a name, address, ID, password, payment details,
or a full medical record. Keep replies under 120 words, calm, direct, and practical. End every
non-emergency health answer by reminding the patient that a doctor or registered dietitian
can provide better advice for their individual needs.

You may also navigate: Appointments for booking; Health checks for saved results;
Diet & progress for meal plans and logs; Messages for non-urgent care-team contact;
Reports & feedback for ratings; and the account menu for profile changes.
""";

  private final RestClient restClient;
  private final String apiKey;
  private final String model;

  PatientGuideService(
      RestClient.Builder builder,
      @Value("${nutricare.ai.gemini.api-key:}") String apiKey,
      @Value("${nutricare.ai.gemini.model:gemini-3.5-flash-lite}") String model) {
    SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
    requestFactory.setConnectTimeout(Duration.ofSeconds(3));
    requestFactory.setReadTimeout(Duration.ofSeconds(10));
    this.restClient =
        builder
            .baseUrl("https://generativelanguage.googleapis.com")
            .requestFactory(requestFactory)
            .build();
    this.apiKey = apiKey == null ? "" : apiKey.trim();
    this.model = model;
    LOGGER.info("NutriGuide model={} aiConfigured={}", model, !this.apiKey.isBlank());
  }

  PatientGuideController.GuideResponse answer(String question) {
    return answer(question, List.of());
  }

  PatientGuideController.GuideResponse answer(
      String question, List<PatientGuideController.GuideMessage> history) {
    List<String> destinations = destinations(question);
    if (isEmergency(question)) return emergencyResponse(question);
    String urgency = looksMedical(question) ? "URGENT" : "ROUTINE";

    if (!apiKey.isBlank()) {
      try {
        List<Content> contents = conversation(history, question);
        GeminiRequest payload =
            new GeminiRequest(
                new Instruction(List.of(new Part(SYSTEM_INSTRUCTION))),
                contents,
                new GenerationConfig(0.15, 420));
        JsonNode body =
            restClient
                .post()
                .uri("/v1beta/models/{model}:generateContent", model)
                .contentType(MediaType.APPLICATION_JSON)
                .header("x-goog-api-key", apiKey)
                .body(payload)
                .retrieve()
                .body(JsonNode.class);
        String text =
            body == null
                ? ""
                : body.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text")
                    .asText("")
                    .trim();
        if (!text.isBlank())
          return response(withCareReminder(text, question), destinations, "GEMINI", urgency);
      } catch (RuntimeException error) {
        LOGGER.warn(
            "Gemini response unavailable; using bounded local health guidance: {}",
            error.getMessage());
        // Emergency screening remains local; safe offline support is returned on API failure.
      }
    }
    return response(
        withCareReminder(localAnswer(question), question), destinations, "LOCAL", urgency);
  }

  private List<Content> conversation(
      List<PatientGuideController.GuideMessage> history, String question) {
    List<Content> contents = new ArrayList<>();
    int start = Math.max(0, history.size() - 6);
    for (int index = start; index < history.size(); index++) {
      PatientGuideController.GuideMessage message = history.get(index);
      if (message.text() == null || message.text().isBlank()) continue;
      String role = "patient".equalsIgnoreCase(message.from()) ? "user" : "model";
      contents.add(new Content(role, List.of(new Part(message.text().trim()))));
    }
    if (contents.isEmpty()
        || !contents.get(contents.size() - 1).parts().get(0).text().equals(question)) {
      contents.add(new Content("user", List.of(new Part(question))));
    }
    return contents;
  }

  private PatientGuideController.GuideResponse emergencyResponse(String question) {
    String lower = question.toLowerCase(Locale.ROOT);
    String immediate =
        "Call 1990 now. Put the phone on speaker, give the dispatcher your location, and follow"
            + " their instructions. Do not wait for this chat or drive yourself.";
    if (contains(lower, "bleeding", "blood won't stop", "blood wont stop"))
      immediate +=
          " While help is coming, apply firm direct pressure with a clean cloth if it is safe to do"
              + " so.";
    else if (contains(lower, "unconscious", "not breathing", "stopped breathing"))
      immediate += " Stay with the person; the dispatcher can guide immediate first aid or CPR.";
    else if (contains(lower, "suicide", "self harm", "kill myself", "hurt myself"))
      immediate +=
          " Move away from anything that could cause harm and stay with a trusted person while"
              + " calling.";
    return response(immediate, List.of(), "LOCAL", "EMERGENCY");
  }

  private PatientGuideController.GuideResponse response(
      String answer, List<String> destinations, String source, String urgency) {
    return new PatientGuideController.GuideResponse(
        answer, destinations, true, source, urgency, EMERGENCY_NUMBER);
  }

  private boolean isEmergency(String value) {
    String question = value.toLowerCase(Locale.ROOT);
    return contains(
        question,
        "emergency",
        "chest pain",
        "chest pressure",
        "cannot breathe",
        "can't breathe",
        "severe breathing",
        "not breathing",
        "unconscious",
        "passed out",
        "stroke",
        "face drooping",
        "seizure",
        "severe bleeding",
        "blood won't stop",
        "blood wont stop",
        "overdose",
        "poisoning",
        "anaphylaxis",
        "serious allergic",
        "suicide",
        "self harm",
        "kill myself",
        "hurt myself");
  }

  private boolean looksMedical(String value) {
    String question = value.toLowerCase(Locale.ROOT);
    return contains(
        question,
        "pain",
        "fever",
        "vomit",
        "dizzy",
        "faint",
        "rash",
        "swelling",
        "breath",
        "bleeding",
        "symptom",
        "sick",
        "headache",
        "diarrhea",
        "diarrhoea",
        "pregnant",
        "medicine",
        "blood",
        "pressure",
        "sugar",
        "bmi",
        "temperature",
        "allergy");
  }

  private List<String> destinations(String value) {
    String question = value.toLowerCase(Locale.ROOT);
    if (contains(question, "book", "appointment", "check-up", "schedule", "payment"))
      return List.of("appointments");
    if (contains(question, "diet", "meal", "water", "weight", "progress")) return List.of("diet");
    if (contains(question, "result", "health", "blood", "bmi", "vital")) return List.of("health");
    if (contains(question, "message", "dietitian", "doctor", "contact", "available"))
      return List.of("messages");
    if (contains(question, "feedback", "rating", "complaint")) return List.of("analytics");
    if (contains(question, "profile", "name", "phone", "address", "email", "logout", "sign out"))
      return List.of("profile");
    return List.of();
  }

  private String localAnswer(String value) {
    String question = value.toLowerCase(Locale.ROOT);
    if (contains(question, "diabetes", "diabetic")
        && contains(question, "eat", "food", "meal", "diet"))
      return "A simple diabetes-friendly plate is half non-starchy vegetables such as leafy greens,"
          + " beans or cucumber; one quarter lean protein such as fish, chicken, eggs or"
          + " tofu; and one quarter high-fibre carbohydrate such as brown rice, whole grains"
          + " or lentils. Choose water and limit sugary drinks and large portions of refined"
          + " carbohydrates.";
    if (contains(question, "blood pressure", "hypertension")
        && contains(question, "eat", "food", "meal", "diet"))
      return "Choose more vegetables, fruit, whole grains, beans, fish and unsalted nuts, and"
          + " reduce salty packaged foods, processed meats and excess alcohol. Do not stop"
          + " prescribed blood-pressure medicine because of diet changes.";
    if (contains(question, "healthy meal", "balanced meal", "what should i eat", "what to eat"))
      return "Build a balanced meal with plenty of vegetables, a source of protein, a moderate"
          + " portion of whole-grain or high-fibre carbohydrate, and water. Portions and"
          + " choices should match your health conditions, allergies and medicines.";
    if (looksMedical(question))
      return "AI care support is temporarily offline, so I cannot safely assess these symptoms. If"
          + " they are severe, sudden, worsening, or you feel unsafe, call 1990 now."
          + " Otherwise contact a qualified clinician today or leave a non-urgent message"
          + " for your care team.";
    if (contains(question, "book", "appointment", "check-up", "schedule", "payment"))
      return "Open Appointments to choose an available practitioner and time, then complete the"
          + " simulated payment step.";
    if (contains(question, "diet", "meal", "water", "weight", "progress"))
      return "Open Diet & progress to review your published plan and record meals, water, weight or"
          + " BMI. For symptoms or a sudden health concern, describe what is happening and I"
          + " will help you choose an urgent next step.";
    if (contains(question, "result", "health", "blood", "bmi", "vital"))
      return "Open Health checks to see your own records. A qualified clinician should interpret"
          + " results.";
    if (contains(question, "message", "dietitian", "doctor", "contact", "available"))
      return "Open Messages to leave a non-urgent note. If the situation is urgent or worsening,"
          + " call 1990 rather than waiting for a reply.";
    if (contains(question, "feedback", "rating", "complaint"))
      return "Open Reports & feedback to rate a consultation or submit a complaint.";
    if (contains(question, "profile", "name", "phone", "address", "email"))
      return "Open the account menu in the top-right corner and choose Edit profile.";
    if (contains(question, "logout", "sign out"))
      return "Open the account menu in the top-right corner and choose Sign out.";
    return "I can provide temporary AI care support when staff are unavailable, assess whether"
        + " symptoms may need urgent attention, and guide you through NutriCare. I cannot"
        + " replace a doctor. What is happening, and when did it start?";
  }

  private String withCareReminder(String answer, String question) {
    String lower = question.toLowerCase(Locale.ROOT);
    boolean healthQuestion =
        looksMedical(question)
            || contains(
                lower,
                "health",
                "diet",
                "eat",
                "food",
                "meal",
                "nutrition",
                "exercise",
                "sleep",
                "diabetes",
                "diabetic");
    if (!healthQuestion
        || answer.toLowerCase(Locale.ROOT).contains("doctor or registered dietitian"))
      return answer;
    return answer
        + "\n\n"
        + "For advice tailored to you, it is always better to speak with a doctor or registered"
        + " dietitian.";
  }

  private boolean contains(String value, String... keywords) {
    for (String keyword : keywords) if (value.contains(keyword)) return true;
    return false;
  }

  private record Part(String text) {}

  private record Instruction(List<Part> parts) {}

  private record Content(String role, List<Part> parts) {}

  private record GenerationConfig(double temperature, int maxOutputTokens) {}

  private record GeminiRequest(
      Instruction system_instruction, List<Content> contents, GenerationConfig generationConfig) {}
}
