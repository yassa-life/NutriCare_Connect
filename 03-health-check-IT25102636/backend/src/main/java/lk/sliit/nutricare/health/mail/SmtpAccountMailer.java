package lk.sliit.nutricare.health.mail;

import lk.sliit.nutricare.access.AccountMailer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
class SmtpAccountMailer implements AccountMailer {
  private final EmailDeliveryAttemptRepository deliveries;
  private final JavaMailSender mailSender;
  private final boolean liveEmail;
  private final String from;

  SmtpAccountMailer(
      EmailDeliveryAttemptRepository deliveries,
      JavaMailSender mailSender,
      @Value("${nutricare.mail.live-enabled:false}") boolean liveEmail,
      @Value("${nutricare.mail.from:}") String from,
      @Value("${spring.mail.username:}") String username,
      @Value("${spring.mail.password:}") String password) {
    this.deliveries = deliveries;
    this.mailSender = mailSender;
    this.liveEmail = liveEmail;
    this.from = from == null ? "" : from.trim();
    if (liveEmail && (this.from.isBlank() || username.isBlank() || password.isBlank()))
      throw new IllegalStateException(
          "Live email requires MAIL_FROM, MAIL_USERNAME and MAIL_PASSWORD.");
  }

  @Override
  @Transactional(
      propagation = Propagation.REQUIRES_NEW,
      noRollbackFor = IllegalStateException.class)
  public void sendPasswordResetOtp(String email, String otp) {
    send(
        email,
        "PASSWORD_RESET_OTP",
        "NutriCare password reset code",
        "Your NutriCare password reset code is " + otp + ". It expires in 10 minutes.",
        "A password reset code email was processed.");
  }

  @Override
  @Transactional(
      propagation = Propagation.REQUIRES_NEW,
      noRollbackFor = IllegalStateException.class)
  public void sendStaffWelcome(String email) {
    send(
        email,
        "STAFF_ACCOUNT_CREATED",
        "Your NutriCare staff account",
        "Your NutriCare staff account is ready. Obtain the one-time password from your"
            + " administrator, then change it immediately after signing in.",
        "A staff welcome email was processed.");
  }

  private void send(String email, String template, String subject, String body, String preview) {
    if (!liveEmail) {
      deliveries.save(new EmailDeliveryAttempt(email, template, "SIMULATED_DELIVERED", preview));
      return;
    }
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(from);
    message.setTo(email);
    message.setSubject(subject);
    message.setText(body);
    try {
      mailSender.send(message);
      deliveries.save(new EmailDeliveryAttempt(email, template, "SENT", preview));
    } catch (MailException exception) {
      deliveries.save(new EmailDeliveryAttempt(email, template, "FAILED", preview));
      throw new IllegalStateException(
          "Email could not be delivered. Check the SMTP configuration.", exception);
    }
  }
}
