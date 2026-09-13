package lk.sliit.nutricare.message;

import java.time.Instant;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

interface MessageRepository extends JpaRepository<SecureMessage, UUID> {
  List<SecureMessage> findByPatientIdOrderBySentAtAsc(String patientId);
}

interface NotificationRepository extends JpaRepository<Notification, UUID> {
  List<Notification> findByRecipientIdOrderByCreatedAtDesc(String id);

  List<Notification> findByStatusAndRetryAtBefore(String status, Instant now);
}
