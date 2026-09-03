package lk.sliit.nutricare.access;
import jakarta.validation.Valid;import jakarta.validation.constraints.*;import java.util.*;import org.springframework.http.HttpStatus;import org.springframework.security.access.prepost.PreAuthorize;import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1") public class AuthController{
 private final AuthService auth;private final UserRepository users;public AuthController(AuthService auth,UserRepository users){this.auth=auth;this.users=users;}
 @PostMapping("/auth/register")@ResponseStatus(HttpStatus.CREATED)public UserView register(@Valid@RequestBody RegisterRequest r){return UserView.of(auth.register(r.fullName(),r.email(),r.password(),null));}
 @PostMapping("/auth/login")public Map<String,Object> login(@Valid@RequestBody LoginRequest r){UserAccount u=users.findByEmailIgnoreCase(r.email()).orElse(null);String token=auth.login(r.email(),r.password());u=users.findByEmailIgnoreCase(r.email()).orElseThrow();return Map.of("token",token,"user",UserView.of(u));}
 @GetMapping("/users")@PreAuthorize("hasRole('SYSTEM_ADMIN')")public List<UserView> users(){return users.findAll().stream().map(UserView::of).toList();}
 @PostMapping("/users/{id}/unlock")@PreAuthorize("hasRole('SYSTEM_ADMIN')")public UserView unlock(@PathVariable UUID id){UserAccount u=users.findById(id).orElseThrow();u.unlock();return UserView.of(users.save(u));}
 public record RegisterRequest(@NotBlank String fullName,@Email@NotBlank String email,@Size(min=8)String password,String role){}public record LoginRequest(@Email@NotBlank String email,@NotBlank String password){}public record UserView(UUID id,String fullName,String email,String role,boolean locked,int failedAttempts){static UserView of(UserAccount u){return new UserView(u.getId(),u.getFullName(),u.getEmail(),u.getRole(),u.isLocked(),u.getFailedAttempts());}}
}
