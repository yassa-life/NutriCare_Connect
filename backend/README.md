# NutriCare Java application

This is the runnable Spring Boot composition module. Import the repository root `pom.xml` into IntelliJ IDEA so Maven also loads the six feature modules.

## Standard source layout

- `src/main/java/lk/sliit/nutricare` — application entry point and shared configuration
- `src/main/resources` — Spring configuration and integration Flyway migration
- `src/test/java/lk/sliit/nutricare` — application-module tests

Run `NutriCareApplication` with Java 21. MySQL must be available using the values in `application.yml` or the `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` environment variables.
