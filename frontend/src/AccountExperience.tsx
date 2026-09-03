import { useState } from "react";
import { Bot, Leaf, LogIn, Send, ShieldCheck, UserRound, X } from "lucide-react";
import { askPatientGuide, demoEmails, login, Session, SessionUser, updateProfile } from "./api";

export function LoginScreen({ onLogin }: { onLogin: (session: Session) => void }) {
  const [email, setEmail] = useState("patient@nutricare.demo");
  const [password, setPassword] = useState("password");
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
      <div className="login-assurances"><span><ShieldCheck size={17}/> Role-protected access</span><span><UserRound size={17}/> Fictional demo records</span></div>
    </section>
    <section className="login-panel">
      <form className="login-card" onSubmit={submit}>
        <span className="eyebrow">Secure access</span><h2>Welcome back</h2><p>Sign in as one demo person to see the correct workspace for that account.</p>
        <div className="field"><label htmlFor="login-email">Email</label><input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required/></div>
        <div className="field"><label htmlFor="login-password">Password</label><input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required/></div>
        <div className="field"><label htmlFor="demo-account">Demo account</label><select id="demo-account" value={email} onChange={(event) => setEmail(event.target.value)}>{demoEmails.map((account) => <option value={account} key={account}>{account}</option>)}</select><small>Every fictional account uses the password “password”.</small></div>
        {error && <div className="form-error">{error}</div>}
        <button className="primary" disabled={busy} type="submit"><LogIn size={17}/>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </section>
  </main>;
}

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

type GuideDestination = "appointments" | "health" | "diet" | "messages";
export function PatientGuide({ session, go, editProfile }: { session: Session; go: (page: GuideDestination) => void; editProfile: () => void }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([{ from: "guide", text: "Hi Amal — I can help you find appointments, results, diet plans and profile settings." }]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!question.trim()) return;
    const current = question.trim();
    setQuestion("");
    setMessages((items) => [...items, { from: "patient", text: current }]);
    const reply = await askPatientGuide(session, current);
    setMessages((items) => [...items, { from: "guide", text: reply.answer }]);
  }
  function destination(value: string) {
    if (value === "profile") editProfile();
    else if (["appointments", "health", "diet", "messages"].includes(value)) go(value as GuideDestination);
    setOpen(false);
  }
  return <><button className="guide-launch" onClick={() => setOpen((value) => !value)} aria-label="Open NutriGuide"><Bot size={20}/><span>Ask NutriGuide</span></button>{open && <section className="guide-panel" aria-label="Patient navigation assistant"><div className="guide-head"><span><Bot size={18}/><strong>NutriGuide</strong></span><button className="icon" onClick={() => setOpen(false)} aria-label="Close guide"><X size={18}/></button></div><p className="guide-disclaimer">Site guidance only — not medical advice or diagnosis.</p><div className="guide-messages">{messages.map((message, index) => <div className={`guide-message ${message.from}`} key={index}>{message.text}</div>)}</div><div className="guide-shortcuts">{["appointments", "health", "diet", "profile"].map((item) => <button onClick={() => destination(item)} key={item}>{item}</button>)}</div><form onSubmit={submit}><input value={question} onChange={(event) => setQuestion(event.target.value)} aria-label="Ask NutriGuide" placeholder="How do I update my phone?"/><button className="icon" aria-label="Send question"><Send size={17}/></button></form></section>}</>;
}
