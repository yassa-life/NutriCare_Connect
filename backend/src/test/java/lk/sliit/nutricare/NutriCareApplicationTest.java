package lk.sliit.nutricare;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import static org.assertj.core.api.Assertions.assertThat;

class NutriCareApplicationTest {

    @Test
    void applicationEntryPointIsConfiguredForSpringBoot() {
        assertThat(NutriCareApplication.class)
                .hasAnnotation(SpringBootApplication.class);
    }
}
