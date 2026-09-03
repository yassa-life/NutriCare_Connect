package lk.sliit.nutricare.access;
import java.util.Optional;import java.util.UUID;import org.springframework.data.jpa.repository.JpaRepository;
public interface UserRepository extends JpaRepository<UserAccount,UUID>{Optional<UserAccount> findByEmailIgnoreCase(String email);boolean existsByEmailIgnoreCaseAndIdNot(String email,UUID id);}
