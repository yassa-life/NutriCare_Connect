package lk.sliit.nutricare.access;import java.util.UUID;import org.springframework.data.jpa.repository.JpaRepository;public interface AuditEventRepository extends JpaRepository<AuditEvent,UUID>{}

