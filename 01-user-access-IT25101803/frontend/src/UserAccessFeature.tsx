import { useEffect, useState } from "react";
import { KeyRound, Plus, ShieldCheck, UserRoundCheck, Users } from "lucide-react";

type DemoUser = { id: string; fullName: string; email: string; role: string; enabled: boolean };
type StaffRole = "DIETITIAN" | "DOCTOR" | "RECEPTION_STAFF" | "SYSTEM_ADMIN" | "OPERATIONS_MANAGER" | "FINANCE_EXECUTIVE" | "MEDICAL_CENTER_COORDINATOR" | "PATIENT_RELATIONS_OFFICER";
type ProvisionResult = { user: DemoUser; temporaryPassword: string };

export function UserAccessFeature({ isAdmin = false, onProvision, onLoadUsers, onToggleUser }: {
  isAdmin?: boolean;
  onProvision?: (details: { fullName: string; email: string; role: StaffRole }) => Promise<ProvisionResult>;
  onLoadUsers?: () => Promise<DemoUser[]>;
  onToggleUser?: (id: string, enabled: boolean) => Promise<DemoUser>;
}) {
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [message, setMessage] = useState("");

  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!onLoadUsers) return;
    onLoadUsers().then(setUsers).catch((reason) => setMessage(reason instanceof Error ? reason.message : "Users could not be loaded."));
  }, [onLoadUsers]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const fullName = String(form.get("name"));
    const email = String(form.get("email"));
    if (isAdmin && onProvision) {
      setBusy(true); setMessage(""); setTemporaryPassword("");
      try {
        const result = await onProvision({ fullName, email, role: String(form.get("role")) as StaffRole });
        setUsers((items) => [result.user, ...items]);
        setTemporaryPassword(result.temporaryPassword);
        setMessage("Staff account created. Give the temporary login details to the staff member securely.");
        formElement.reset();
      } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Staff account could not be created."); }
      finally { setBusy(false); }
      return;
    }
    setUsers((items) => [{ id: "Pending", fullName, email, role: "PATIENT", enabled: true }, ...items]);
    setMessage("Patient account created. A welcome notification was queued.");
    formElement.reset();
  }

  async function toggleUser(user: DemoUser) {
    if (!onToggleUser) return;
    try {
      const updated = await onToggleUser(user.id, !user.enabled);
      setUsers((items) => items.map((item) => item.id === updated.id ? updated : item));
      setMessage("Account status changed. Historical and linked clinical records were preserved.");
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Account status could not be changed."); }
  }

  return <div className="stack-xl">
    <div className="page-heading"><div><span className="eyebrow">Module 01 · IT25101803</span><h1>Patients & access</h1><p>Manage registration, profiles, roles and secure account status.</p></div><div className="chip-row"><span className="chip active"><ShieldCheck size={12}/> Role protection active</span><span className="chip"><Users size={12}/> {users.length} database users</span></div></div>
    <div className="feature-grid">
      <section className="panel"><div className="panel-title"><div><span className="eyebrow">Directory</span><h2>Registered users</h2></div></div><table className="data-table"><thead><tr><th>User</th><th>Role</th><th>Status</th>{isAdmin && <th>Admin action</th>}</tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><strong>{user.fullName}</strong><br/><small>{user.id} · {user.email}</small></td><td>{user.role.replaceAll("_", " ")}</td><td><span className={user.enabled ? "status confirmed" : "status disabled"}>{user.enabled ? "Active" : "Disabled"}</span></td>{isAdmin && <td><button className="text-button" onClick={() => toggleUser(user)}>{user.enabled ? "Disable" : "Enable"}</button></td>}</tr>)}</tbody></table><div className="record-policy"><ShieldCheck size={16}/><span><strong>No delete action</strong><small>Accounts are disabled so appointments, health records, invoices and audit history remain valid.</small></span></div></section>
      <section className="panel"><div className="panel-title"><div><span className="eyebrow">{isAdmin ? "Staff onboarding" : "New patient"}</span><h2>{isAdmin ? "Create staff login" : "Register an account"}</h2></div>{isAdmin ? <KeyRound size={20}/> : <UserRoundCheck size={20}/>}</div><form className="form-grid" onSubmit={submit}><div className="field full"><label htmlFor="name">Full name</label><input id="name" name="name" required placeholder="e.g. Kavindi Silva"/></div><div className="field full"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required placeholder="name@example.lk"/></div>{isAdmin ? <div className="field full"><label htmlFor="staff-role">Staff role</label><select id="staff-role" name="role" required><option value="DOCTOR">Doctor</option><option value="DIETITIAN">Dietitian</option><option value="RECEPTION_STAFF">Reception staff</option><option value="MEDICAL_CENTER_COORDINATOR">Medical center coordinator</option><option value="PATIENT_RELATIONS_OFFICER">Patient relations officer</option><option value="OPERATIONS_MANAGER">Operations manager</option><option value="FINANCE_EXECUTIVE">Finance executive</option><option value="SYSTEM_ADMIN">System administrator</option></select><small>Public sign-up cannot create staff accounts.</small></div> : <div className="field full"><label>Starting role</label><input value="Patient" readOnly aria-label="Starting role"/><small>Only an administrator can assign a staff role.</small></div>}<button className="primary field full" type="submit" disabled={busy}><Plus size={17}/> {busy ? "Creating…" : isAdmin ? "Create staff account" : "Create patient account"}</button></form>{message && <div className="success-note">{message}</div>}{temporaryPassword && <div className="temporary-password"><span>One-time temporary password</span><strong>{temporaryPassword}</strong><small>This is shown once. The staff member must replace it after first login.</small></div>}</section>
    </div>
  </div>;
}
