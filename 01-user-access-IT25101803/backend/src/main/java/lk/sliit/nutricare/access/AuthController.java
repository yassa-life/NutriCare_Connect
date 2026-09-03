package lk.sliit.nutricare.access;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class AuthController {
    private final AuthService auth;
    private final UserRepository users;

    public AuthController(AuthService auth, UserRepository users) {
        this.auth = auth;
        this.users = users;
    }

    @PostMapping("/auth/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserView register(@Valid @RequestBody RegisterRequest request) {
        return UserView.of(auth.register(request.fullName(), request.email(), request.password()));
    }

    @PostMapping("/auth/login")
    public Map<String, Object> login(@Valid @RequestBody LoginRequest request) {
        String token = auth.login(request.email(), request.password());
        UserAccount user = users.findByEmailIgnoreCase(request.email()).orElseThrow();
        return Map.of("token", token, "user", UserView.of(user));
    }

    @PostMapping("/auth/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(Principal principal) {
        auth.logout(currentUserId(principal));
    }

    @GetMapping("/users/me")
    public UserView me(Principal principal) {
        return UserView.of(users.findById(currentUserId(principal)).orElseThrow());
    }

    @PatchMapping("/users/me")
    public UserView updateMe(Principal principal, @Valid @RequestBody ProfileRequest request) {
        return UserView.of(auth.updateProfile(currentUserId(principal), request.fullName(), request.email(),
                request.phoneNumber(), request.dateOfBirth(), request.address()));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public List<UserView> users() {
        return users.findAll().stream().map(UserView::of).toList();
    }

    @PatchMapping("/users/{id}/status")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public UserView status(Principal principal, @PathVariable UUID id, @RequestBody StatusRequest request) {
        return UserView.of(auth.setAccountStatus(currentUserId(principal), id, request.enabled()));
    }

    @PatchMapping("/users/{id}/role")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public UserView role(Principal principal, @PathVariable UUID id, @RequestBody RoleRequest request) {
        return UserView.of(auth.setRole(currentUserId(principal), id, request.role()));
    }

    @PostMapping("/users/{id}/unlock")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public UserView unlock(@PathVariable UUID id) {
        UserAccount user = users.findById(id).orElseThrow();
        user.unlock();
        return UserView.of(users.save(user));
    }

    private UUID currentUserId(Principal principal) {
        return UUID.fromString(principal.getName());
    }

    public record RegisterRequest(@NotBlank String fullName, @Email @NotBlank String email, @Size(min = 8) String password) {}
    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
    public record ProfileRequest(@NotBlank String fullName, @Email @NotBlank String email,
                                 @Pattern(regexp = "^[+0-9 ()-]{0,30}$") String phoneNumber,
                                 LocalDate dateOfBirth, @Size(max = 500) String address) {}
    public record StatusRequest(boolean enabled) {}
    public record RoleRequest(@NotBlank String role) {}
    public record UserView(UUID id, String fullName, String email, String phoneNumber, LocalDate dateOfBirth,
                           String address, String role, boolean enabled, boolean locked, int failedAttempts) {
        static UserView of(UserAccount user) {
            return new UserView(user.getId(), user.getFullName(), user.getEmail(), user.getPhoneNumber(),
                    user.getDateOfBirth(), user.getAddress(), user.getRole(), user.isEnabled(), user.isLocked(),
                    user.getFailedAttempts());
        }
    }
}
