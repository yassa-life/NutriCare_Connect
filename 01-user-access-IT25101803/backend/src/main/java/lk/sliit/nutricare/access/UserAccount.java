package lk.sliit.nutricare.access;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "user_accounts")
public class UserAccount {
    @Id
    @Column(length = 16)
    private String id;
    @Column(nullable = false)
    private String fullName;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(length = 30)
    private String phoneNumber;
    private LocalDate dateOfBirth;
    @Column(length = 500)
    private String address;
    @Column(nullable = false)
    private String passwordHash;
    @Column(nullable = false)
    private String role;
    @Column(nullable = false)
    private boolean enabled = true;
    @Column(nullable = false)
    private boolean mustChangePassword;
    @Column(nullable = false)
    private boolean locked;
    @Column(nullable = false)
    private int failedAttempts;
    @Column(nullable = false)
    private Instant createdAt;
    @Column(nullable = false)
    private Instant updatedAt;

    protected UserAccount() {}

    public UserAccount(String id, String fullName, String email, String passwordHash, String role) {
        this.id = id;
        this.fullName = fullName.trim();
        this.email = email.trim().toLowerCase();
        this.passwordHash = passwordHash;
        this.role = role;
        this.createdAt = Instant.now();
        this.updatedAt = createdAt;
    }

    public String getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPhoneNumber() { return phoneNumber; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public String getAddress() { return address; }
    public String getPasswordHash() { return passwordHash; }
    public String getRole() { return role; }
    public boolean isEnabled() { return enabled; }
    public boolean isMustChangePassword() { return mustChangePassword; }
    public boolean isLocked() { return locked; }
    public int getFailedAttempts() { return failedAttempts; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void failedLogin() {
        failedAttempts++;
        if (failedAttempts >= 5) locked = true;
        touch();
    }

    public void successfulLogin() {
        failedAttempts = 0;
        touch();
    }

    public void unlock() {
        locked = false;
        failedAttempts = 0;
        touch();
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
        if (!enabled) this.failedAttempts = 0;
        touch();
    }

    public void setRole(String role) {
        this.role = role;
        touch();
    }

    public void requirePasswordChange() {
        mustChangePassword = true;
        touch();
    }

    public void changePassword(String passwordHash) {
        this.passwordHash = passwordHash;
        this.mustChangePassword = false;
        this.locked = false;
        this.failedAttempts = 0;
        touch();
    }

    public void updateProfile(String fullName, String email, String phoneNumber, LocalDate dateOfBirth, String address) {
        this.fullName = fullName.trim();
        this.email = email.trim().toLowerCase();
        this.phoneNumber = blankToNull(phoneNumber);
        this.dateOfBirth = dateOfBirth;
        this.address = blankToNull(address);
        touch();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private void touch() {
        updatedAt = Instant.now();
    }
}
