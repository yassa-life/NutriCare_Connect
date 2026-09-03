import { useState } from "react";
import {
  Activity,
  Bell,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  Leaf,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import { UserAccessFeature } from "@nutricare/user-access";
import { AppointmentBillingFeature } from "@nutricare/appointment-billing";
import { HealthCheckFeature } from "@nutricare/health-check";
import { DietProgressFeature } from "@nutricare/diet-progress";
import { MessagingRemindersFeature } from "@nutricare/messaging-reminders";
import { FeedbackAnalyticsFeature } from "@nutricare/feedback-analytics";

type Page = "overview" | "users" | "appointments" | "health" | "diet" | "messages" | "analytics";

const nav = [
  { id: "overview" as Page, label: "Overview", icon: LayoutDashboard },
  { id: "users" as Page, label: "Patients & access", icon: ShieldCheck },
  { id: "appointments" as Page, label: "Appointments", icon: CalendarDays },
  { id: "health" as Page, label: "Health checks", icon: ClipboardList },
  { id: "diet" as Page, label: "Diet & progress", icon: Leaf },
  { id: "messages" as Page, label: "Messages", icon: MessageCircle },
  { id: "analytics" as Page, label: "Reports & feedback", icon: Star },
];

const quickStats = [
  ["Today's visits", "18", "+3 from yesterday", "mint"],
  ["Upcoming", "12", "Next at 10:30 AM", "blue"],
  ["Health alerts", "3", "1 high priority", "amber"],
  ["Plan adherence", "84%", "+6% this month", "violet"],
] as const;

function Overview({ go }: { go: (page: Page) => void }) {
  return (
    <div className="stack-xl">
      <section className="welcome">
        <div>
          <span className="eyebrow">Thursday, 3 September</span>
          <h1>Good morning, Ishara.</h1>
          <p>Your patients are on track. One health alert needs your attention today.</p>
        </div>
        <button className="primary" onClick={() => go("diet")}><Leaf size={18} /> Create diet plan</button>
      </section>
      <section className="stat-grid" aria-label="Daily summary">
        {quickStats.map(([label, value, detail, tone]) => (
          <article className={`stat-card ${tone}`} key={label}>
            <span>{label}</span><strong>{value}</strong><small>{detail}</small>
          </article>
        ))}
      </section>
      <div className="dashboard-grid">
        <section className="panel span-2">
          <div className="panel-title"><div><span className="eyebrow">Schedule</span><h2>Today’s appointments</h2></div><button className="text-button" onClick={() => go("appointments")}>View calendar</button></div>
          <div className="timeline">
            {["10:30|Amal Perera|Diet follow-up|Confirmed", "11:45|Nadeesha Silva|Health check-up|Confirmed", "14:00|Ruwan Jayasuriya|Initial consultation|Pending"].map((row) => {
              const [time, name, type, status] = row.split("|");
              return <button className="timeline-row" key={time} onClick={() => go("appointments")}><time>{time}</time><span className="avatar">{name[0]}</span><span className="grow"><strong>{name}</strong><small>{type}</small></span><span className={`status ${status.toLowerCase()}`}>{status}</span></button>;
            })}
          </div>
        </section>
        <section className="panel alert-panel">
          <div className="panel-title"><div><span className="eyebrow">Clinical attention</span><h2>Health alerts</h2></div><span className="count">3</span></div>
          <button className="clinical-alert" onClick={() => go("health")}><span className="priority high">High</span><strong>Blood sugar increased</strong><small>Amal Perera · 145 mg/dL</small></button>
          <button className="clinical-alert" onClick={() => go("health")}><span className="priority medium">Medium</span><strong>Blood pressure above target</strong><small>Nadeesha Silva · 142/92</small></button>
        </section>
        <section className="panel span-2">
          <div className="panel-title"><div><span className="eyebrow">Care progress</span><h2>Patients to follow up</h2></div></div>
          <div className="patient-grid">
            {["Amal Perera|Diabetes care|72%", "Nadeesha Silva|Low sodium plan|89%", "Ruwan Jayasuriya|Weight management|64%"].map((row) => {
              const [name, plan, score] = row.split("|");
              return <button className="patient-card" key={name} onClick={() => go("diet")}><span className="avatar large">{name[0]}</span><span><strong>{name}</strong><small>{plan}</small></span><b>{score}</b></button>;
            })}
          </div>
        </section>
        <section className="panel tip-card">
          <Activity size={22} />
          <div><span className="eyebrow">Monthly insight</span><h2>Attendance improved 12%</h2><p>Automated reminders helped reduce missed visits this month.</p></div>
        </section>
      </div>
    </div>
  );
}

export function App() {
  const [page, setPage] = useState<Page>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState("Senior Dietitian");
  const current = nav.find((item) => item.id === page)!;
  return (
    <div className="app-shell">
      <aside className={menuOpen ? "sidebar open" : "sidebar"}>
        <div className="brand"><span className="brand-mark"><Leaf size={22} /></span><span><b>NutriCare</b><small>CONNECT</small></span><button className="icon mobile-only" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button></div>
        <nav aria-label="Main navigation">
          <p>Workspace</p>
          {nav.map((item) => <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => { setPage(item.id); setMenuOpen(false); }}><item.icon size={19} /><span>{item.label}</span>{item.id === "messages" && <em>2</em>}</button>)}
        </nav>
        <div className="sidebar-foot"><ShieldCheck size={18} /><span><b>Demo workspace</b><small>No real patient data</small></span></div>
      </aside>
      <main>
        <header className="topbar">
          <div className="topbar-title"><button className="icon mobile-only" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button><current.icon size={20} /><strong>{current.label}</strong></div>
          <div className="topbar-actions">
            <label className="search"><Search size={17} /><input aria-label="Search patients" placeholder="Search patients…" /></label>
            <button className="icon notify" aria-label="Notifications"><Bell size={19} /><span /></button>
            <label className="role-select"><span className="avatar">I</span><select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Demo role"><option>Senior Dietitian</option><option>Doctor</option><option>Reception Staff</option><option>System Admin</option><option>Operations Manager</option><option>Patient</option></select><ChevronDown size={14} /></label>
          </div>
        </header>
        <div className="content">
          {page === "overview" && <Overview go={setPage} />}
          {page === "users" && <UserAccessFeature />}
          {page === "appointments" && <AppointmentBillingFeature />}
          {page === "health" && <HealthCheckFeature />}
          {page === "diet" && <DietProgressFeature />}
          {page === "messages" && <MessagingRemindersFeature />}
          {page === "analytics" && <FeedbackAnalyticsFeature />}
        </div>
      </main>
    </div>
  );
}
