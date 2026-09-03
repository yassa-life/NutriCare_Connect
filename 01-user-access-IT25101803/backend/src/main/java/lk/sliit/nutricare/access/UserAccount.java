package lk.sliit.nutricare.access;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="user_accounts")
public class UserAccount {
    @Id private UUID id;
    @Column(nullable=false) private String fullName;
    @Column(nullable=false,unique=true) private String email;
    @Column(nullable=false) private String passwordHash;
    @Column(nullable=false) private String role;
    @Column(nullable=false) private boolean locked;
    @Column(nullable=false) private int failedAttempts;
    @Column(nullable=false) private Instant createdAt;
    protected UserAccount() {}
    public UserAccount(String fullName,String email,String passwordHash,String role){this.id=UUID.randomUUID();this.fullName=fullName;this.email=email.toLowerCase();this.passwordHash=passwordHash;this.role=role;this.createdAt=Instant.now();}
    public UUID getId(){return id;} public String getFullName(){return fullName;} public String getEmail(){return email;} public String getPasswordHash(){return passwordHash;} public String getRole(){return role;} public boolean isLocked(){return locked;} public int getFailedAttempts(){return failedAttempts;} public Instant getCreatedAt(){return createdAt;}
    public void failedLogin(){failedAttempts++;if(failedAttempts>=5)locked=true;} public void successfulLogin(){failedAttempts=0;} public void unlock(){locked=false;failedAttempts=0;} public void setRole(String role){this.role=role;}
}

