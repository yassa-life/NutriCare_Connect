package lk.sliit.nutricare.access;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Instant;
import org.junit.jupiter.api.Test;

class PasswordResetOtpTest {
  @Test
  void resetCodeExpiresInTenMinutesAndCanBeConsumed() {
    Instant before = Instant.now();
    PasswordResetOtp reset = new PasswordResetOtp("P001", "bcrypt-hash");
    assertTrue(reset.getExpiresAt().isAfter(before.plusSeconds(590)));
    assertFalse(reset.isUsed());
    reset.consume();
    assertTrue(reset.isUsed());
  }

  @Test
  void failedAttemptsAreCounted() {
    PasswordResetOtp reset = new PasswordResetOtp("P001", "bcrypt-hash");
    reset.failedAttempt();
    reset.failedAttempt();
    assertEquals(2, reset.getAttempts());
  }
}
