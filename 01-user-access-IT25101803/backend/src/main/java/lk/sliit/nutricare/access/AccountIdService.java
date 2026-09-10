package lk.sliit.nutricare.access;

import java.util.Map;
import org.springframework.stereotype.Service;

@Service
class AccountIdService {
    private static final Map<String, String> PREFIXES = Map.ofEntries(
            Map.entry("PATIENT", "P"),
            Map.entry("DOCTOR", "D"),
            Map.entry("DIETITIAN", "DT"),
            Map.entry("RECEPTION_STAFF", "R"),
            Map.entry("SYSTEM_ADMIN", "A"),
            Map.entry("OPERATIONS_MANAGER", "O"),
            Map.entry("FINANCE_EXECUTIVE", "F"),
            Map.entry("MEDICAL_CENTER_COORDINATOR", "C"),
            Map.entry("PATIENT_RELATIONS_OFFICER", "PR"));

    private final AccountIdCounterRepository counters;

    AccountIdService(AccountIdCounterRepository counters) {
        this.counters = counters;
    }

    String nextId(String role) {
        String prefix = PREFIXES.get(role);
        if (prefix == null) throw new IllegalArgumentException("Unknown role");
        AccountIdCounter counter = counters.findForUpdate(prefix)
                .orElseThrow(() -> new IllegalStateException("Missing account ID counter for " + prefix));
        String id = counter.takeNextId();
        counters.save(counter);
        return id;
    }
}
