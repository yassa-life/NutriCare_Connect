package lk.sliit.nutricare.access;
import java.util.Set;import org.springframework.security.crypto.password.PasswordEncoder;import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;
@Service public class AuthService{
 public static final Set<String> ROLES=Set.of("PATIENT","DIETITIAN","DOCTOR","RECEPTION_STAFF","SYSTEM_ADMIN","OPERATIONS_MANAGER","FINANCE_EXECUTIVE","MEDICAL_CENTER_COORDINATOR","PATIENT_RELATIONS_OFFICER");
 private final UserRepository users;private final PasswordEncoder passwords;private final TokenService tokens;private final AuditEventRepository audit;
 public AuthService(UserRepository users,PasswordEncoder passwords,TokenService tokens,AuditEventRepository audit){this.users=users;this.passwords=passwords;this.tokens=tokens;this.audit=audit;}
 @Transactional public UserAccount register(String name,String email,String password,String requestedRole){String role=requestedRole==null?"PATIENT":requestedRole.toUpperCase();if(!ROLES.contains(role))throw new IllegalArgumentException("Unknown role");if(users.findByEmailIgnoreCase(email).isPresent())throw new IllegalArgumentException("Email already registered");UserAccount u=users.save(new UserAccount(name,email,passwords.encode(password),role));audit.save(new AuditEvent(u.getId(),"REGISTER","USER",u.getId().toString()));return u;}
 @Transactional public String login(String email,String password){UserAccount u=users.findByEmailIgnoreCase(email).orElseThrow(()->new IllegalArgumentException("Invalid credentials"));if(u.isLocked())throw new IllegalStateException("Account locked after five failed attempts");if(!passwords.matches(password,u.getPasswordHash())){u.failedLogin();users.save(u);throw new IllegalArgumentException(u.isLocked()?"Account locked after five failed attempts":"Invalid credentials");}u.successfulLogin();users.save(u);audit.save(new AuditEvent(u.getId(),"LOGIN","USER",u.getId().toString()));return tokens.issue(u);}
}

