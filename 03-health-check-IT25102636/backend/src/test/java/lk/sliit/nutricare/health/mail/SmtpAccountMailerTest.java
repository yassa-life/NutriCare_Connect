package lk.sliit.nutricare.health.mail;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

class SmtpAccountMailerTest {
    private final EmailDeliveryAttemptRepository deliveries = mock(EmailDeliveryAttemptRepository.class);
    private final JavaMailSender mailSender = mock(JavaMailSender.class);

    @Test
    void simulatedModeRecordsDeliveryWithoutContactingSmtp() {
        SmtpAccountMailer mailer = new SmtpAccountMailer(deliveries, mailSender, false, "", "", "");

        mailer.sendPasswordResetOtp("patient@example.com", "123456");

        verify(deliveries).save(any(EmailDeliveryAttempt.class));
        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }

    @Test
    void liveModeRequiresAllSenderCredentials() {
        assertThrows(IllegalStateException.class,
                () -> new SmtpAccountMailer(deliveries, mailSender, true, "", "", ""));
    }

    @Test
    void liveModeSendsAndRecordsSuccessfulAttempt() {
        SmtpAccountMailer mailer = new SmtpAccountMailer(
                deliveries, mailSender, true, "sender@example.com", "sender@example.com", "app-password");

        mailer.sendPasswordResetOtp("patient@example.com", "123456");

        verify(mailSender).send(any(SimpleMailMessage.class));
        verify(deliveries).save(any(EmailDeliveryAttempt.class));
    }
}
