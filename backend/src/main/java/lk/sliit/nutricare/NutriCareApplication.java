package lk.sliit.nutricare;

import jakarta.annotation.PostConstruct;
import java.util.TimeZone;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class NutriCareApplication {
  @PostConstruct
  void initTimeZone() {
    TimeZone.setDefault(TimeZone.getTimeZone("Asia/Colombo"));
  }

  public static void main(String[] args) {
    TimeZone.setDefault(TimeZone.getTimeZone("Asia/Colombo"));
    SpringApplication.run(NutriCareApplication.class, args);
  }
}
