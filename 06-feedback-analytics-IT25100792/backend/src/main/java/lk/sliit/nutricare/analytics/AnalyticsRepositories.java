package lk.sliit.nutricare.analytics;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface FeedbackRepository extends JpaRepository<Feedback, UUID> {}

interface ComplaintRepository extends JpaRepository<Complaint, UUID> {}
