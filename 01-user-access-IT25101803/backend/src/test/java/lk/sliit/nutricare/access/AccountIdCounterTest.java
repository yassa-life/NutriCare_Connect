package lk.sliit.nutricare.access;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class AccountIdCounterTest {
  @Test
  void createsSimpleSequentialRoleIds() {
    AccountIdCounter patients = new AccountIdCounter("P", 1);
    AccountIdCounter doctors = new AccountIdCounter("D", 1);

    assertEquals("P001", patients.takeNextId());
    assertEquals("P002", patients.takeNextId());
    assertEquals("D001", doctors.takeNextId());
  }
}
