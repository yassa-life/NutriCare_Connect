import { useState } from "react";
import { Plus, ShieldCheck, UserRoundCheck, Users } from "lucide-react";

const initialUsers = [
  { name: "Amal Perera", email: "amal@example.lk", role: "Patient", status: "Active" },
  { name: "Dr. Chamara Fernando", email: "chamara@nutricare.lk", role: "Doctor", status: "Active" },
  { name: "Nuwan Perera", email: "nuwan@nutricare.lk", role: "Operations Manager", status: "Active" },
];

export function UserAccessFeature() {
  const [users, setUsers] = useState(initialUsers);
  const [message, setMessage] = useState("");
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setUsers((items) => [{ name: String(form.get("name")), email: String(form.get("email")), role: String(form.get("role")), status: "Active" }, ...items]);
    setMessage("Account created with the selected role. A welcome notification was queued.");
    event.currentTarget.reset();
  }
  return <div className="stack-xl">
    <div className="page-heading"><div><span className="eyebrow">Module 01 · IT25101803</span><h1>Patients & access</h1><p>Manage registration, profiles, roles and secure access.</p></div><div className="chip-row"><span className="chip active"><ShieldCheck size={12}/> RBAC active</span><span className="chip"><Users size={12}/> {users.length} demo users</span></div></div>
    <div className="feature-grid">
      <section className="panel"><div className="panel-title"><div><span className="eyebrow">Directory</span><h2>Registered users</h2></div></div><table className="data-table"><thead><tr><th>User</th><th>Role</th><th>Status</th></tr></thead><tbody>{users.map((user) => <tr key={user.email}><td><strong>{user.name}</strong><br/><small>{user.email}</small></td><td>{user.role}</td><td><span className="status confirmed">{user.status}</span></td></tr>)}</tbody></table></section>
      <section className="panel"><div className="panel-title"><div><span className="eyebrow">New account</span><h2>Register a user</h2></div><UserRoundCheck size={20}/></div><form className="form-grid" onSubmit={submit}><div className="field full"><label htmlFor="name">Full name</label><input id="name" name="name" required placeholder="e.g. Kavindi Silva"/></div><div className="field full"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required placeholder="name@example.lk"/></div><div className="field full"><label htmlFor="role">Role</label><select id="role" name="role"><option>Patient</option><option>Doctor</option><option>Dietitian</option><option>Reception Staff</option><option>System Admin</option><option>Operations Manager</option></select></div><button className="primary field full" type="submit"><Plus size={17}/> Create demo account</button></form>{message && <div className="success-note">{message}</div>}</section>
    </div>
  </div>;
}

