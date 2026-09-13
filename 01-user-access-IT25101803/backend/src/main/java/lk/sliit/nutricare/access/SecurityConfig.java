package lk.sliit.nutricare.access;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  CorsConfigurationSource cors(
      @Value("${nutricare.web-origin:http://localhost:5173}") String origin) {
    CorsConfiguration configuration = new CorsConfiguration();
    List<String> configuredOrigins =
        Stream.of(origin.split(",")).map(String::trim).filter(value -> !value.isBlank()).toList();
    configuration.setAllowedOriginPatterns(
        Stream.concat(
                configuredOrigins.stream(),
                Stream.of("http://localhost:[*]", "http://127.0.0.1:[*]"))
            .distinct()
            .toList());
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  SecurityFilterChain chain(HttpSecurity http, BearerFilter bearer) throws Exception {
    return http.csrf(csrf -> csrf.disable())
        .cors(cors -> {})
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers(
                        "/api/v1/auth/register",
                        "/api/v1/auth/login",
                        "/api/v1/auth/forgot-password",
                        "/api/v1/auth/reset-password",
                        "/api/v1/demo/**",
                        "/error")
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .addFilterBefore(bearer, UsernamePasswordAuthenticationFilter.class)
        .build();
  }
}

@Component
class BearerFilter extends OncePerRequestFilter {
  private final TokenService tokens;
  private final UserRepository users;

  BearerFilter(TokenService tokens, UserRepository users) {
    this.tokens = tokens;
    this.users = users;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String header = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (header != null && header.startsWith("Bearer ")) {
      try {
        TokenService.Claims claims = tokens.verify(header.substring(7));
        Optional<UserAccount> authenticated =
            users
                .findById(claims.userId())
                .filter(UserAccount::isEnabled)
                .filter(user -> !user.isLocked());
        if (authenticated.isPresent()) {
          UserAccount user = authenticated.get();
          String path = request.getRequestURI();
          if (user.isMustChangePassword()
              && !path.equals("/api/v1/auth/change-password")
              && !path.equals("/api/v1/auth/logout")) {
            response.sendError(
                HttpServletResponse.SC_FORBIDDEN,
                "Temporary password must be changed before continuing");
            return;
          }
          SecurityContextHolder.getContext()
              .setAuthentication(
                  new UsernamePasswordAuthenticationToken(
                      user.getId().toString(),
                      null,
                      List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))));
        }
      } catch (RuntimeException ignored) {
        SecurityContextHolder.clearContext();
      }
    }
    chain.doFilter(request, response);
  }
}
