package lk.sliit.nutricare.analytics;

import static org.junit.jupiter.api.Assertions.*;

import java.util.UUID;
import org.junit.jupiter.api.Test;

class FeedbackTest {
  @Test
  void storesValidRating() {
    var f = new Feedback("P001", "D001", UUID.randomUUID(), 2, "Needs follow-up");
    assertEquals(2, f.getRating());
  }

  @Test
  void updatesRatingAndComments() {
    var f = new Feedback("P001", "D001", UUID.randomUUID(), 2, "Needs follow-up");
    f.update(5, "Much better after the review");
    assertEquals(5, f.getRating());
    assertEquals("Much better after the review", f.getComments());
  }

  @Test
  void rejectsOutOfRangeRating() {
    assertThrows(
        IllegalArgumentException.class,
        () -> new Feedback("P001", "D001", UUID.randomUUID(), 0, "bad"));
    var f = new Feedback("P001", "D001", UUID.randomUUID(), 3, "ok");
    assertThrows(IllegalArgumentException.class, () -> f.update(6, "too high"));
  }

  @Test
  void blanksCommentsBecomeNull() {
    var f = new Feedback("P001", "D001", UUID.randomUUID(), 4, "   ");
    assertNull(f.getComments());
  }
}
