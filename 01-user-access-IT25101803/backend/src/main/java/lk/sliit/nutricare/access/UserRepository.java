package lk.sliit.nutricare.access;
import java.util.Optional;import org.springframework.data.jpa.repository.JpaRepository;
public interface UserRepository extends JpaRepository<UserAccount,String>{Optional<UserAccount> findByEmailIgnoreCase(String email);boolean existsByEmailIgnoreCaseAndIdNot(String email,String id);}
