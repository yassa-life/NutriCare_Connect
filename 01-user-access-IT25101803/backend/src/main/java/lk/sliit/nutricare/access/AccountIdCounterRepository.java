package lk.sliit.nutricare.access;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface AccountIdCounterRepository extends JpaRepository<AccountIdCounter, String> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select counter from AccountIdCounter counter where counter.prefix = :prefix")
    Optional<AccountIdCounter> findForUpdate(@Param("prefix") String prefix);
}
