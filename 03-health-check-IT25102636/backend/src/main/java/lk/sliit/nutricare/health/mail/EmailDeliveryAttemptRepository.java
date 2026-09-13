package lk.sliit.nutricare.health.mail;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface EmailDeliveryAttemptRepository extends JpaRepository<EmailDeliveryAttempt, UUID> {
  List<EmailDeliveryAttempt> findTop20ByOrderByCreatedAtDesc();
}
