package lk.sliit.nutricare.access;

/** Mail-delivery boundary implemented by the infrastructure owner in Module 03. */
public interface AccountMailer {
    void sendPasswordResetOtp(String email, String otp);
    void sendStaffWelcome(String email);
}
