package lk.sliit.nutricare.access;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "password_reset_otps")
class PasswordResetOtp {
    @Id private UUID id;
    @Column(nullable = false, length = 16) private String userId;
    @Column(nullable = false) private String otpHash;
    @Column(nullable = false) private Instant expiresAt;
    @Column(nullable = false) private boolean used;
    @Column(nullable = false) private int attempts;
    @Column(nullable = false) private Instant createdAt;

    protected PasswordResetOtp() {}

    PasswordResetOtp(String userId, String otpHash) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.otpHash = otpHash;
        this.createdAt = Instant.now();
        this.expiresAt = createdAt.plusSeconds(600);
    }

    String getOtpHash() { return otpHash; }
    Instant getExpiresAt() { return expiresAt; }
    boolean isUsed() { return used; }
    int getAttempts() { return attempts; }
    void failedAttempt() { attempts++; }
    void consume() { used = true; }
}
