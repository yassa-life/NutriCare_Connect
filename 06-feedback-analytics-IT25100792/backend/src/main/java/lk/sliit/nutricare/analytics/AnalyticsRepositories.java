package lk.sliit.nutricare.analytics;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface FeedbackRepository extends JpaRepository<Feedback, UUID> {
  List<Feedback> findByPatientIdOrderByCreatedAtDesc(String patientId);
}

interface ComplaintRepository extends JpaRepository<Complaint, UUID> {
  Optional<Complaint> findByFeedbackId(UUID feedbackId);

  void deleteByFeedbackId(UUID feedbackId);
}
