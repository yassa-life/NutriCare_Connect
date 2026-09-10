import { useState } from "react";
import { Eye, EyeOff, KeyRound, Leaf, LogIn, Mail, ShieldCheck, UserPlus, UserRound, X } from "lucide-react";
import { changePassword, login, register, requestPasswordReset, resetPassword, Session, SessionUser, updateProfile } from "./api";

type AuthView = "login" | "signup" | "forgot";

export function LoginScreen({ onLogin }: { onLogin: (session: Session) => void }) {
  const [view, setView] = useState<AuthView>("login");
  if (view === "signup") return <SignupForm onLogin={onLogin} goLogin={() => setView("login")} />;
  if (view === "forgot") return <ForgotPasswordForm goLogin={() => setView("login")} />;
  return <LoginForm onLogin={onLogin} goSignup={() => setView("signup")} goForgot={() => setView("forgot")} />;
}

/* ──────────────────────────── Sign In ──────────────────────────── */

function LoginForm({ onLogin, goSignup, goForgot }: { onLogin: (session: Session) => void; goSignup: () => void; goForgot: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try { onLogin(await login(email, password)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to sign in"); }
    finally { setBusy(false); }
  }

  return <main className="login-page">
    <section className="login-story">
      <div className="brand login-brand"><span className="brand-mark"><Leaf size={22}/></span><span><b>NutriCare</b><small>CONNECT</small></span></div>
      <div><span className="eyebrow">One connected care workspace</span><h1>Health plans that remain human.</h1><p>Appointments, health checks, nutrition plans and conversations stay connected around one patient record.</p></div>
      <div className="login-assurances"><span><ShieldCheck size={17}/> Role-protected access</span><span><UserRound size={17}/> Secure patient records</span></div>
    </section>
    <section className="login-panel">
      <form className="login-card" onSubmit={submit}>
        <span className="eyebrow">Secure access</span><h2>Welcome back</h2><p>Sign in to your NutriCare account to access your care workspace.</p>
        <div className="field"><label htmlFor="login-email">Email</label><input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required/></div>
        <div className="field"><label htmlFor="login-password">Password</label><div className="password-wrapper"><input id="login-password" type={showPw ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required/><button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)} aria-label={showPw ? "Hide password" : "Show password"}>{showPw ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div></div>
        <button type="button" className="forgot-link" onClick={goForgot}>Forgot password?</button>
        {error && <div className="form-error">{error}</div>}
        <button className="primary" disabled={busy} type="submit"><LogIn size={17}/>{busy ? "Signing in…" : "Sign in"}</button>
        <p className="auth-toggle">Don't have an account? <button type="button" className="text-button" onClick={goSignup}>Create one</button></p>
      </form>
    </section>
  </main>;
}

/* ──────────────────────────── Sign Up ──────────────────────────── */

function SignupForm({ onLogin, goLogin }: { onLogin: (session: Session) => void; goLogin: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setBusy(true);
    setError("");
    try {
      onLogin(await register(fullName, email, password, phone || undefined, dob || undefined));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Registration failed");
    } finally { setBusy(false); }
  }

  return <main className="login-page">
    <section className="login-story">
      <div className="brand login-brand"><span className="brand-mark"><Leaf size={22}/></span><span><b>NutriCare</b><small>CONNECT</small></span></div>
      <div><span className="eyebrow">Join your care team</span><h1>Your wellness journey starts here.</h1><p>Create a patient account to book appointments, track your nutrition plan and stay connected with your care team.</p></div>
      <div className="login-assurances"><span><ShieldCheck size={17}/> Encrypted & secure</span><span><UserRound size={17}/> Your data stays private</span></div>
    </section>
    <section className="login-panel">
      <form className="login-card signup-card" onSubmit={submit}>
        <span className="eyebrow">New patient</span><h2>Create your account</h2><p>Fill in your details below to register as a patient.</p>
        <div className="field"><label htmlFor="signup-name">Full name</label><input id="signup-name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Kavindi Silva" required/></div>
        <div className="field"><label htmlFor="signup-email">Email</label><input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required/></div>
        <div className="signup-row">
          <div className="field"><label htmlFor="signup-phone">Phone number</label><input id="signup-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94 77 123 4567"/></div>
          <div className="field"><label htmlFor="signup-dob">Date of birth</label><input id="signup-dob" type="date" value={dob} onChange={e => setDob(e.target.value)}/></div>
        </div>
        <div className="field"><label htmlFor="signup-password">Password</label><div className="password-wrapper"><input id="signup-password" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" required/><button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)} aria-label={showPw ? "Hide password" : "Show password"}>{showPw ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div></div>
        <div className="field"><label htmlFor="signup-confirm">Confirm password</label><input id="signup-confirm" type={showPw ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter your password" required/></div>
        {error && <div className="form-error">{error}</div>}
        <button className="primary" disabled={busy} type="submit"><UserPlus size={17}/>{busy ? "Creating account…" : "Create account"}</button>
        <p className="auth-toggle">Already have an account? <button type="button" className="text-button" onClick={goLogin}>Sign in</button></p>
      </form>
    </section>
  </main>;
}

function ForgotPasswordForm({ goLogin }: { goLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [requested, setRequested] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function requestCode(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const result = await requestPasswordReset(email);
      setRequested(true);
      setNotice(result.demoOtp ? `${result.message} Local development code: ${result.demoOtp}` : result.message);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to send reset code"); }
    finally { setBusy(false); }
  }

  async function completeReset(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try { await resetPassword(email, otp, password); setNotice("Password changed successfully. You can now sign in."); setRequested(false); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Password could not be changed"); }
    finally { setBusy(false); }
  }

  return <main className="login-page"><section className="login-story"><div className="brand login-brand"><span className="brand-mark"><Leaf size={22}/></span><span><b>NutriCare</b><small>CONNECT</small></span></div><div><span className="eyebrow">Account recovery</span><h1>Get safely back into your workspace.</h1><p>A six-digit code is sent to the email address registered with your account.</p></div><div className="login-assurances"><span><Mail size={17}/> Ten-minute code</span><span><ShieldCheck size={17}/> Five-attempt limit</span></div></section><section className="login-panel"><form className="login-card" onSubmit={requested ? completeReset : requestCode}><span className="eyebrow">Password help</span><h2>{requested ? "Enter your code" : "Forgot password"}</h2><p>{requested ? "Use the code from your email and choose a new password." : "Enter your account email to receive a reset code."}</p><div className="field"><label htmlFor="reset-email">Email</label><input id="reset-email" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={requested} required/></div>{requested && <><div className="field"><label htmlFor="reset-otp">Six-digit code</label><input id="reset-otp" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} required/></div><div className="field"><label htmlFor="reset-password">New password</label><input id="reset-password" type="password" minLength={8} maxLength={72} value={password} onChange={e => setPassword(e.target.value)} required/></div></>}{notice && <div className="success-note">{notice}</div>}{error && <div className="form-error">{error}</div>}<button className="primary" disabled={busy}>{requested ? <KeyRound size={17}/> : <Mail size={17}/>} {busy ? "Please wait…" : requested ? "Change password" : "Email reset code"}</button><p className="auth-toggle"><button type="button" className="text-button" onClick={goLogin}>Back to sign in</button></p></form></section></main>;
}

export function RequiredPasswordChange({ session, onChange, onLogout }: { session: Session; onChange: (session: Session) => void; onLogout: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (newPassword !== confirm) { setError("New passwords do not match"); return; }
    setBusy(true); setError("");
    try { onChange(await changePassword(session, currentPassword, newPassword)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Password could not be changed"); }
    finally { setBusy(false); }
  }
  return <main className="login-page"><section className="login-story"><div className="brand login-brand"><span className="brand-mark"><Leaf size={22}/></span><span><b>NutriCare</b><small>CONNECT</small></span></div><div><span className="eyebrow">First sign-in</span><h1>Choose your private password.</h1><p>Your administrator’s temporary password can be used only for initial access.</p></div><div className="login-assurances"><span><KeyRound size={17}/> Required before continuing</span></div></section><section className="login-panel"><form className="login-card" onSubmit={submit}><span className="eyebrow">Secure your account</span><h2>Change temporary password</h2><p>Welcome, {session.user.fullName}. Choose a password known only to you.</p><div className="field"><label>Temporary password</label><input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required/></div><div className="field"><label>New password</label><input type="password" minLength={8} maxLength={72} value={newPassword} onChange={e => setNewPassword(e.target.value)} required/></div><div className="field"><label>Confirm new password</label><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required/></div>{error && <div className="form-error">{error}</div>}<button className="primary" disabled={busy}><KeyRound size={17}/>{busy ? "Saving…" : "Set new password"}</button><button className="secondary" type="button" onClick={onLogout}>Sign out</button></form></section></main>;
}

/* ──────────────────────────── Profile Modal ──────────────────────────── */

export function ProfileModal({ session, onClose, onChange }: { session: Session; onClose: () => void; onChange: (session: Session) => void }) {
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const updates: Partial<SessionUser> = {
      fullName: String(form.get("fullName")), email: String(form.get("email")),
      phoneNumber: String(form.get("phoneNumber")), dateOfBirth: String(form.get("dateOfBirth")),
      address: String(form.get("address")),
    };
    try { onChange(await updateProfile(session, updates)); setNotice("Profile updated successfully."); }
    catch { setNotice("Profile could not be updated. Check the entered values."); }
    finally { setSaving(false); }
  }
  return <div className="modal-backdrop" role="presentation"><section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title"><button className="icon modal-close" onClick={onClose} aria-label="Close profile"><X/></button><span className="eyebrow">My account</span><h2 id="profile-title">Edit profile</h2><p>Your role and account status can only be changed by an administrator.</p><form className="form-grid" onSubmit={submit}><div className="field full"><label htmlFor="profile-name">Full name</label><input id="profile-name" name="fullName" defaultValue={session.user.fullName} required/></div><div className="field full"><label htmlFor="profile-email">Email</label><input id="profile-email" name="email" type="email" defaultValue={session.user.email} required/></div><div className="field"><label htmlFor="profile-phone">Phone number</label><input id="profile-phone" name="phoneNumber" defaultValue={session.user.phoneNumber ?? ""}/></div><div className="field"><label htmlFor="profile-birth">Date of birth</label><input id="profile-birth" name="dateOfBirth" type="date" defaultValue={session.user.dateOfBirth ?? ""}/></div><div className="field full"><label htmlFor="profile-address">Address</label><textarea id="profile-address" name="address" rows={3} defaultValue={session.user.address ?? ""}/></div><div className="account-readonly"><span>Assigned role</span><strong>{session.user.role.replaceAll("_", " ")}</strong></div><button className="primary field full" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button></form>{notice && <div className="success-note">{notice}</div>}</section></div>;
}
