package lk.sliit.nutricare.diet;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

interface DietPlanRepository extends JpaRepository<DietPlan, UUID> {
  List<DietPlan> findByPatientIdOrderByCreatedAtDesc(String id);
}

interface ProgressLogRepository extends JpaRepository<ProgressLog, UUID> {
  List<ProgressLog> findByPatientIdOrderByLogDateAsc(String id);
}
