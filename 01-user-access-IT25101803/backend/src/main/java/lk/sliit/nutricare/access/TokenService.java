package lk.sliit.nutricare.access;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
  private final byte[] secret;
  private final long hours;
  private final ObjectMapper mapper = new ObjectMapper();

  public TokenService(
      @Value("${nutricare.jwt-secret}") String secret,
      @Value("${nutricare.jwt-hours:8}") long hours) {
    this.secret = secret.getBytes(StandardCharsets.UTF_8);
    this.hours = hours;
  }

  public String issue(UserAccount user) {
    try {
      String header = encode("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
      String payload =
          encode(
              mapper.writeValueAsBytes(
                  Map.of(
                      "sub",
                      user.getId().toString(),
                      "email",
                      user.getEmail(),
                      "role",
                      user.getRole(),
                      "exp",
                      Instant.now().plusSeconds(hours * 3600).getEpochSecond())));
      String unsignedToken = header + "." + payload;
      return unsignedToken + "." + sign(unsignedToken);
    } catch (Exception error) {
      throw new IllegalStateException("Could not issue token");
    }
  }

  public Claims verify(String token) {
    try {
      String[] parts = token.split("\\.");
      if (parts.length != 3 || !hasValidSignature(parts)) {
        throw new IllegalArgumentException("Invalid token");
      }

      Map<?, ?> payload = mapper.readValue(Base64.getUrlDecoder().decode(parts[1]), Map.class);
      long expiresAt = ((Number) payload.get("exp")).longValue();
      if (expiresAt < Instant.now().getEpochSecond()) {
        throw new IllegalArgumentException("Token expired");
      }
      return new Claims(
          (String) payload.get("sub"), (String) payload.get("email"), (String) payload.get("role"));
    } catch (RuntimeException error) {
      throw error;
    } catch (Exception error) {
      throw new IllegalArgumentException("Invalid token");
    }
  }

  private boolean hasValidSignature(String[] parts) throws Exception {
    String unsignedToken = parts[0] + "." + parts[1];
    byte[] expected = sign(unsignedToken).getBytes(StandardCharsets.UTF_8);
    byte[] actual = parts[2].getBytes(StandardCharsets.UTF_8);
    return MessageDigest.isEqual(expected, actual);
  }

  private String sign(String value) throws Exception {
    Mac mac = Mac.getInstance("HmacSHA256");
    mac.init(new SecretKeySpec(secret, "HmacSHA256"));
    return encode(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
  }

  private String encode(String value) {
    return encode(value.getBytes(StandardCharsets.UTF_8));
  }

  private String encode(byte[] bytes) {
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }

  public record Claims(String userId, String email, String role) {}
}
