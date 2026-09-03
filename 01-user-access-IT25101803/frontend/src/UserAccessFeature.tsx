import { useState } from "react";
import { Plus, ShieldCheck, UserRoundCheck, Users } from "lucide-react";

type DemoUser = { name: string; email: string; role: string; enabled: boolean };

const initialUsers: DemoUser[] = [
  { name: "Amal Perera", email: "patient@nutricare.demo", role: "Patient", enabled: true },
  { name: "Dr. Chamara Fernando", email: "doctor@nutricare.demo", role: "Doctor", enabled: true },
  { name: "Nuwan Perera", email: "manager@nutricare.demo", role: "Operations Manager", enabled: true },
];

export function UserAccessFeature({ isAdmin = false }: { isAdmin?: boolean }) {
  const [users, setUsers] = useState(initialUsers);
  const [message, setMessage] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setUsers((items) => [{ name: String(form.get("name")), email: String(form.get("email")), role: "Patient", enabled: true }, ...items]);
    setMessage("Patient account created. A welcome notification was queued.");
    event.currentTarget.reset();
  }

  function toggleUser(email: string) {
    setUsers((items) => items.map((user) => user.email === email ? { ...user, enabled: !user.enabled } : user));
    setMessage("Account status changed. Historical and linked clinical records were preserved.");
  }

  return <div className="stack-xl">
    <div className="page-heading"><div><span className="eyebrow">Module 01 · IT25101803</span><h1>Patients & access</h1><p>Manage registration, profiles, roles and secure account status.</p></div><div className="chip-row"><span className="chip active"><ShieldCheck size={12}/> Role protection active</span><span className="chip"><Users size={12}/> {users.length} demo users</span></div></div>
    <div className="feature-grid">
      <section className="panel"><div className="panel-title"><div><span className="eyebrow">Directory</span><h2>Registered users</h2></div></div><table className="data-table"><thead><tr><th>User</th><th>Role</th><th>Status</th>{isAdmin && <th>Admin action</th>}</tr></thead><tbody>{users.map((user) => <tr key={user.email}><td><strong>{user.name}</strong><br/><small>{user.email}</small></td><td>{user.role}</td><td><span className={user.enabled ? "status confirmed" : "status disabled"}>{user.enabled ? "Active" : "Disabled"}</span></td>{isAdmin && <td><button className="text-button" onClick={() => toggleUser(user.email)}>{user.enabled ? "Disable" : "Enable"}</button></td>}</tr>)}</tbody></table><div className="record-policy"><ShieldCheck size={16}/><span><strong>No delete action</strong><small>Accounts are disabled so appointments, health records, invoices and audit history remain valid.</small></span></div></section>
      <section className="panel"><div className="panel-title"><div><span className="eyebrow">New patient</span><h2>Register an account</h2></div><UserRoundCheck size={20}/></div><form className="form-grid" onSubmit={submit}><div className="field full"><label htmlFor="name">Full name</label><input id="name" name="name" required placeholder="e.g. Kavindi Silva"/></div><div className="field full"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required placeholder="name@example.lk"/></div><div className="field full"><label>Starting role</label><input value="Patient" readOnly aria-label="Starting role"/><small>Only an administrator can assign a different role after registration.</small></div><button className="primary field full" type="submit"><Plus size={17}/> Create patient account</button></form>{message && <div className="success-note">{message}</div>}</section>
    </div>
  </div>;
}
