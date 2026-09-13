package lk.sliit.nutricare.access;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class UserAccountTest {
  @Test
  void locksAfterFiveFailures() {
    UserAccount user = new UserAccount("P001", "Test", "test@example.lk", "hash", "PATIENT");
    for (int attempt = 0; attempt < 5; attempt++) user.failedLogin();
    assertTrue(user.isLocked());
    assertEquals(5, user.getFailedAttempts());
  }

  @Test
  void disablesWithoutDeletingIdentity() {
    UserAccount user = new UserAccount("P001", "Test", "test@example.lk", "hash", "PATIENT");
    user.setEnabled(false);
    assertFalse(user.isEnabled());
    assertEquals("test@example.lk", user.getEmail());
  }

  @Test
  void updatesChangeableProfileFieldsWithoutChangingRole() {
    UserAccount user = new UserAccount("P001", "Old Name", "old@example.lk", "hash", "PATIENT");
    user.updateProfile(
        "New Name", "new@example.lk", "+94 77 123 4567", LocalDate.of(1998, 4, 12), "Colombo");
    assertEquals("New Name", user.getFullName());
    assertEquals("+94 77 123 4567", user.getPhoneNumber());
    assertEquals("PATIENT", user.getRole());
  }

  @Test
  void staffTemporaryPasswordMustBeReplaced() {
    UserAccount user =
        new UserAccount("D001", "Doctor", "doctor@example.lk", "temporary-hash", "DOCTOR");
    user.requirePasswordChange();
    assertTrue(user.isMustChangePassword());
    user.changePassword("private-hash");
    assertFalse(user.isMustChangePassword());
    assertEquals("private-hash", user.getPasswordHash());
  }
}
