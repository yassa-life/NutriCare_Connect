package lk.sliit.nutricare.access;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "account_id_counters")
class AccountIdCounter {
    @Id
    @Column(length = 3)
    private String prefix;

    @Column(nullable = false)
    private int nextValue;

    protected AccountIdCounter() {}

    AccountIdCounter(String prefix, int nextValue) {
        this.prefix = prefix;
        this.nextValue = nextValue;
    }

    String takeNextId() {
        if (nextValue > 999) throw new IllegalStateException("Account ID limit reached for " + prefix);
        return prefix + String.format("%03d", nextValue++);
    }
}
