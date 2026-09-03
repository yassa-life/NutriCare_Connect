import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ClipboardList,
  HeartHandshake,
  LayoutDashboard,
  Leaf,
  Menu,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import { LoginScreen, PatientGuide, ProfileModal } from "./AccountExperience";
import { logout, Role, Session } from "./api";
const UserAccessFeature = lazy(() => import("@nutricare/user-access").then((module) => ({ default: module.UserAccessFeature })));
const AppointmentBillingFeature = lazy(() => import("@nutricare/appointment-billing").then((module) => ({ default: module.AppointmentBillingFeature })));
const HealthCheckFeature = lazy(() => import("@nutricare/health-check").then((module) => ({ default: module.HealthCheckFeature })));
const DietProgressFeature = lazy(() => import("@nutricare/diet-progress").then((module) => ({ default: module.DietProgressFeature })));
const MessagingRemindersFeature = lazy(() => import("@nutricare/messaging-reminders").then((module) => ({ default: module.MessagingRemindersFeature })));
const FeedbackAnalyticsFeature = lazy(() => import("@nutricare/feedback-analytics").then((module) => ({ default: module.FeedbackAnalyticsFeature })));

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

const roleLabels: Record<Role, string> = {
  DIETITIAN: "Dietitian",
  DOCTOR: "Doctor",
  RECEPTION_STAFF: "Reception Staff",
  SYSTEM_ADMIN: "System Administrator",
  OPERATIONS_MANAGER: "Operations Manager",
  FINANCE_EXECUTIVE: "Finance Executive",
  MEDICAL_CENTER_COORDINATOR: "Medical Center Coordinator",
  PATIENT_RELATIONS_OFFICER: "Patient Relations Officer",
  PATIENT: "Patient",
};

const rolePages: Record<Role, Page[]> = {
  DIETITIAN: ["overview", "appointments", "health", "diet", "messages", "analytics"],
  DOCTOR: ["overview", "appointments", "health", "messages"],
  RECEPTION_STAFF: ["overview", "users", "appointments", "messages"],
  SYSTEM_ADMIN: nav.map((item) => item.id),
  OPERATIONS_MANAGER: ["overview", "appointments", "analytics"],
  FINANCE_EXECUTIVE: ["overview", "appointments", "analytics"],
  MEDICAL_CENTER_COORDINATOR: ["overview", "appointments", "health", "analytics"],
  PATIENT_RELATIONS_OFFICER: ["overview", "messages", "analytics"],
  PATIENT: ["overview", "appointments", "health", "diet", "messages", "analytics"],
};

const quickStats = [
  ["Today's visits", "18", "+3 from yesterday", "sage"],
  ["Upcoming", "12", "Next at 10:30 AM", "eucalyptus"],
  ["Health alerts", "3", "1 high priority", "amber"],
  ["Plan adherence", "84%", "+6% this month", "fern"],
] as const;

function PatientOverview({ go }: { go: (page: Page) => void }) {
  return <div className="stack-xl">
    <section className="welcome"><div><span className="eyebrow">Thursday, 3 September</span><h1>Good morning, Amal.</h1><p>Your next check-up and today’s nutrition plan are ready.</p></div><div className="welcome-actions"><span className="live-pill"><i/> Personal care space</span><button className="primary" onClick={() => go("appointments")}><CalendarDays size={18}/> Book a check-up</button></div></section>
    <section className="stat-grid" aria-label="My care summary"><article className="stat-card sage"><span>Next appointment</span><strong>10:30</strong><small>Tomorrow · Diet follow-up</small></article><article className="stat-card eucalyptus"><span>Water today</span><strong>5 / 8</strong><small>Three glasses remaining</small></article><article className="stat-card amber"><span>Plan tasks</span><strong>2</strong><small>Lunch and dinner remaining</small></article><article className="stat-card fern"><span>My adherence</span><strong>84%</strong><small>+6% this month</small></article></section>
    <div className="dashboard-grid"><section className="panel span-2"><div className="panel-title"><div><span className="eyebrow">My next visit</span><h2>Diet follow-up with Ishara Jayasinghe</h2></div><span className="status confirmed">Confirmed</span></div><div className="appointment-focus"><span className="calendar-date"><b>04</b><small>SEP</small></span><div><strong>10:30 AM · NutriCare Colombo</strong><p>Bring your latest food log. You can reschedule from Appointments.</p></div><button className="secondary" onClick={() => go("appointments")}>View appointment</button></div></section><section className="panel tip-card"><Leaf size={22}/><div><span className="eyebrow">Today’s plan</span><h2>Low-sugar balanced plan</h2><p>Breakfast completed. Lunch is scheduled for 12:30.</p><button className="text-button" onClick={() => go("diet")}>Open my plan</button></div></section><section className="panel span-2"><div className="panel-title"><div><span className="eyebrow">My recent check</span><h2>Personal health summary</h2></div><button className="text-button" onClick={() => go("health")}>View my records</button></div><div className="metric-row"><article className="metric"><span>Weight</span><strong>74 kg</strong></article><article className="metric"><span>BMI</span><strong>26.4</strong></article><article className="metric"><span>Recorded</span><strong>31 Aug</strong></article></div><div className="patient-safety-note"><ShieldCheck size={16}/> Only you and authorized members of your care team can see these records.</div></section><section className="panel care-pulse"><div className="care-ring"><span><b>84%</b><small>on plan</small></span></div><div><span className="eyebrow">My progress</span><h2>Keep the momentum</h2><p>You completed ten weekly goals this month.</p></div></section></div>
  </div>;
}

function Overview({ go, role }: { go: (page: Page) => void; role: Role }) {
  const patientView = role === "PATIENT";
  if (patientView) return <PatientOverview go={go}/>;
  return (
    <div className="stack-xl">
      <section className="welcome">
        <div>
          <span className="eyebrow">Thursday, 3 September</span>
          <h1>{patientView ? "Good morning, Amal." : "Good morning, Ishara."}</h1>
          <p>{patientView ? "Your next check-up and today’s nutrition plan are ready." : "Your care list is steady. One health alert needs attention today."}</p>
        </div>
        <div className="welcome-actions">
          <span className="live-pill"><i /> Care workspace live</span>
          <button className="primary" onClick={() => go(patientView ? "appointments" : "diet")}><Leaf size={18} /> {patientView ? "Book a check-up" : "Create diet plan"}</button>
        </div>
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
        <section className="panel care-pulse" style={{ gridColumn: "1 / -1" }}>
          <div className="care-ring" aria-label="84 percent care-plan adherence"><span><b>84%</b><small>on plan</small></span></div>
          <div><span className="eyebrow">Care pulse</span><h2>Momentum is improving</h2><p>Ten patients reached a weekly goal today.</p><button className="text-button" onClick={() => go("analytics")}>Open progress report <ArrowUpRight size={13}/></button></div>
        </section>
      </div>
    </div>
  );
}

export function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [page, setPage] = useState<Page>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const role = session?.user.role ?? "PATIENT";
  const visibleNav = useMemo(() => nav.filter((item) => rolePages[role].includes(item.id)), [role]);
  const current = nav.find((item) => item.id === page) ?? nav[0];
  useEffect(() => {
    if (!rolePages[role].includes(page)) setPage("overview");
  }, [page, role]);
  if (!session) return <LoginScreen onLogin={setSession}/>;
  async function signOut() {
    await logout(session!);
    setAccountOpen(false);
    setSession(null);
    setPage("overview");
  }
  return (
    <div className="app-shell">
      <aside className={menuOpen ? "sidebar open" : "sidebar"}>
        <div className="brand"><span className="brand-mark"><Leaf size={22} /></span><span><b>NutriCare</b><small>CONNECT</small></span><button className="icon mobile-only" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button></div>
        <nav aria-label="Main navigation">
          <p>Workspace</p>
          {visibleNav.map((item) => <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => { setPage(item.id); setMenuOpen(false); }}><item.icon size={19} /><span>{item.label}</span>{item.id === "messages" && <em>2</em>}</button>)}
        </nav>
        <div className="sidebar-foot"><HeartHandshake size={18} /><span><b>Care with clarity</b><small>Demo records only</small></span></div>
      </aside>
      <main>
        <header className="topbar">
          <div className="topbar-title"><button className="icon mobile-only" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button><current.icon size={20} /><strong>{current.label}</strong></div>
          <div className="topbar-actions">
            <label className="search"><Search size={17} /><input aria-label="Search patients" placeholder="Search patients…" /></label>
            <button className="icon notify" aria-label="Notifications"><Bell size={19} /><span /></button>
            <div className="account-area"><button className="account-trigger" onClick={() => setAccountOpen((value) => !value)} aria-expanded={accountOpen}><span className="avatar">{session.user.fullName[0]}</span><span><strong>{session.user.fullName}</strong><small>{roleLabels[role]}</small></span></button>{accountOpen && <div className="account-menu"><button onClick={() => { setProfileOpen(true); setAccountOpen(false); }}><Settings size={16}/><span><strong>Edit profile</strong><small>Name, phone and contact details</small></span></button><button onClick={signOut}><X size={16}/><span><strong>Sign out</strong><small>End this session safely</small></span></button></div>}</div>
          </div>
        </header>
        <div className="content">
          <Suspense fallback={<section className="panel empty">Preparing your care workspace…</section>}>
            {page === "overview" && <Overview go={setPage} role={role} />}
            {page === "users" && <UserAccessFeature isAdmin={role === "SYSTEM_ADMIN"} />}
            {page === "appointments" && <AppointmentBillingFeature />}
            {page === "health" && <HealthCheckFeature />}
            {page === "diet" && <DietProgressFeature />}
            {page === "messages" && <MessagingRemindersFeature />}
            {page === "analytics" && <FeedbackAnalyticsFeature patientOnly={role === "PATIENT"} />}
          </Suspense>
        </div>
      </main>
      {profileOpen && <ProfileModal session={session} onClose={() => setProfileOpen(false)} onChange={setSession}/>} 
      {role === "PATIENT" && <PatientGuide session={session} go={setPage} editProfile={() => setProfileOpen(true)}/>} 
    </div>
  );
}
