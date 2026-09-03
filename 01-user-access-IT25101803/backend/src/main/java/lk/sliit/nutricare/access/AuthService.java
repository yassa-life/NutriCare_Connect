package lk.sliit.nutricare.access;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    public static final Set<String> ROLES = Set.of(
            "PATIENT", "DIETITIAN", "DOCTOR", "RECEPTION_STAFF", "SYSTEM_ADMIN",
            "OPERATIONS_MANAGER", "FINANCE_EXECUTIVE", "MEDICAL_CENTER_COORDINATOR",
            "PATIENT_RELATIONS_OFFICER");

    private final UserRepository users;
    private final PasswordEncoder passwords;
    private final TokenService tokens;
    private final AuditEventRepository audit;

    public AuthService(UserRepository users, PasswordEncoder passwords, TokenService tokens, AuditEventRepository audit) {
        this.users = users;
        this.passwords = passwords;
        this.tokens = tokens;
        this.audit = audit;
    }

    @Transactional
    public UserAccount register(String name, String email, String password) {
        if (users.findByEmailIgnoreCase(email).isPresent()) throw new IllegalArgumentException("Email already registered");
        UserAccount user = users.save(new UserAccount(name, email, passwords.encode(password), "PATIENT"));
        audit.save(new AuditEvent(user.getId(), "REGISTER", "USER", user.getId().toString()));
        return user;
    }

    @Transactional
    public String login(String email, String password) {
        UserAccount user = users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!user.isEnabled()) throw new IllegalStateException("Account is disabled. Contact an administrator.");
        if (user.isLocked()) throw new IllegalStateException("Account locked after five failed attempts");
        if (!passwords.matches(password, user.getPasswordHash())) {
            user.failedLogin();
            users.save(user);
            throw new IllegalArgumentException(user.isLocked() ? "Account locked after five failed attempts" : "Invalid credentials");
        }
        user.successfulLogin();
        users.save(user);
        audit.save(new AuditEvent(user.getId(), "LOGIN", "USER", user.getId().toString()));
        return tokens.issue(user);
    }

    @Transactional
    public UserAccount updateProfile(UUID userId, String name, String email, String phone, LocalDate dateOfBirth, String address) {
        UserAccount user = users.findById(userId).orElseThrow();
        if (users.existsByEmailIgnoreCaseAndIdNot(email, userId)) throw new IllegalArgumentException("Email already registered");
        user.updateProfile(name, email, phone, dateOfBirth, address);
        audit.save(new AuditEvent(userId, "UPDATE_PROFILE", "USER", userId.toString()));
        return users.save(user);
    }

    @Transactional
    public UserAccount setAccountStatus(UUID actorId, UUID userId, boolean enabled) {
        if (actorId.equals(userId) && !enabled) throw new IllegalArgumentException("Administrators cannot disable their own account");
        UserAccount user = users.findById(userId).orElseThrow();
        user.setEnabled(enabled);
        audit.save(new AuditEvent(actorId, enabled ? "ENABLE_USER" : "DISABLE_USER", "USER", userId.toString()));
        return users.save(user);
    }

    @Transactional
    public UserAccount setRole(UUID actorId, UUID userId, String role) {
        String normalized = role.toUpperCase();
        if (!ROLES.contains(normalized)) throw new IllegalArgumentException("Unknown role");
        UserAccount user = users.findById(userId).orElseThrow();
        user.setRole(normalized);
        audit.save(new AuditEvent(actorId, "CHANGE_ROLE", "USER", userId.toString()));
        return users.save(user);
    }

    @Transactional
    public void logout(UUID userId) {
        audit.save(new AuditEvent(userId, "LOGOUT", "USER", userId.toString()));
    }
}
