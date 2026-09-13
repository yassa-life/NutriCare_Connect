package lk.sliit.nutricare;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.SpringBootApplication;

class NutriCareApplicationTest {

  @Test
  void applicationEntryPointIsConfiguredForSpringBoot() {
    assertThat(NutriCareApplication.class).hasAnnotation(SpringBootApplication.class);
  }
}
