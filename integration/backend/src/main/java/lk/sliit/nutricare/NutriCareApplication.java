package lk.sliit.nutricare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class NutriCareApplication {
    public static void main(String[] args) { SpringApplication.run(NutriCareApplication.class, args); }
}

