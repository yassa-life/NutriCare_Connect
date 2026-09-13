package lk.sliit.nutricare.access;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import org.junit.jupiter.api.Test;

class TokenServiceTest {
  @Test
  void issuedTokenExpiresInThirtyMinutes() throws Exception {
    TokenService tokens = new TokenService("unit-test-secret", 30);
    UserAccount user = new UserAccount("P001", "Test", "test@example.lk", "hash", "SYSTEM_ADMIN");
    long before = Instant.now().getEpochSecond();
    String token = tokens.issue(user);
    long after = Instant.now().getEpochSecond();

    String payloadJson = new String(Base64.getUrlDecoder().decode(token.split("\\.")[1]));
    @SuppressWarnings("unchecked")
    Map<String, Object> payload = new ObjectMapper().readValue(payloadJson, Map.class);
    long exp = ((Number) payload.get("exp")).longValue();

    assertTrue(exp >= before + 30 * 60 - 1);
    assertTrue(exp <= after + 30 * 60 + 1);
    assertDoesNotThrow(() -> tokens.verify(token));
  }

  @Test
  void expiredTokenIsRejected() throws Exception {
    TokenService tokens = new TokenService("unit-test-secret", 30);
    UserAccount user = new UserAccount("P001", "Test", "test@example.lk", "hash", "PATIENT");
    String token = tokens.issue(user);
    String[] parts = token.split("\\.");
    ObjectMapper mapper = new ObjectMapper();
    @SuppressWarnings("unchecked")
    Map<String, Object> payload = mapper.readValue(Base64.getUrlDecoder().decode(parts[1]), Map.class);
    payload.put("exp", Instant.now().getEpochSecond() - 10);
    String expiredPayload =
        Base64.getUrlEncoder().withoutPadding().encodeToString(mapper.writeValueAsBytes(payload));
    // Signature will no longer match — verify must fail either way
    String forged = parts[0] + "." + expiredPayload + "." + parts[2];
    assertThrows(IllegalArgumentException.class, () -> tokens.verify(forged));
  }
}
