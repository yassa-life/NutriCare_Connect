package lk.sliit.nutricare.access;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, UUID> {
  Optional<PasswordResetOtp> findFirstByUserIdAndUsedFalseOrderByCreatedAtDesc(String userId);
}
