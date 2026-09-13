import { useEffect, useMemo, useState } from "react";
import { BarChart3, Download, Star } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  practitionerId: string;
  practitionerName: string;
  serviceType: string;
  status: string;
};
type Person = { id: string; fullName: string; role: string; enabled: boolean };
type FeedbackResult = {
  feedback: { id: string; rating: number };
  complaint?: { id: string; priority: string; status: string } | null;
};
type Complaint = { id: string; feedbackId: string; priority: string; status: string; createdAt?: string };
type ReportSummary = {
  from: string; to: string; users: number; appointments: number; completedPayments: number;
  openAlerts: number; publishedPlans: number; feedback: number; averageRating: number;
};

export function FeedbackAnalyticsFeature({
  patientOnly = false,
  currentUserId,
  loadAppointments,
  loadPeople,
  submitFeedback,
  loadComplaints,
  loadReport,
}: {
  patientOnly?: boolean;
  currentUserId: string;
  loadAppointments: () => Promise<Appointment[]>;
  loadPeople: () => Promise<Person[]>;
  submitFeedback: (details: {
    patientId: string; practitionerId: string; appointmentId: string; rating: number; comments?: string;
  }) => Promise<FeedbackResult>;
  loadComplaints: () => Promise<Complaint[]>;
  loadReport: (from: string, to: string) => Promise<ReportSummary>;
}) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [practitioners, setPractitioners] = useState<Person[]>([]);
  const [appointmentId, setAppointmentId] = useState("");
  const [practitionerId, setPractitionerId] = useState("");
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);

  const range = useMemo(() => {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 3);
    return {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
    };
  }, []);

  useEffect(() => {
    loadAppointments()
      .then((rows) => {
        const eligible = patientOnly
          ? rows.filter((row) => row.patientId === currentUserId)
          : rows;
        setAppointments(eligible);
        setAppointmentId((current) => current || eligible[0]?.id || "");
        if (!patientOnly) return;
        const first = eligible[0];
        if (first) setPractitionerId((current) => current || first.practitionerId);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Appointments could not be loaded."));
  }, [currentUserId, loadAppointments, patientOnly]);

  useEffect(() => {
    if (patientOnly) return;
    loadPeople()
      .then((rows) => {
        const staff = rows.filter((person) => person.role === "DOCTOR" || person.role === "DIETITIAN");
        setPractitioners(staff);
        setPractitionerId((current) => current || staff[0]?.id || "");
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Staff directory could not be loaded."));
  }, [loadPeople, patientOnly]);

  useEffect(() => {
    if (patientOnly) return;
    Promise.all([loadComplaints(), loadReport(range.from, range.to)])
      .then(([complaintRows, report]) => {
        setComplaints(complaintRows);
        setSummary(report);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Analytics could not be loaded."));
  }, [loadComplaints, loadReport, patientOnly, range.from, range.to]);

  useEffect(() => {
    const selected = appointments.find((row) => row.id === appointmentId);
    if (selected) setPractitionerId(selected.practitionerId);
  }, [appointmentId, appointments]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSaved("");
    if (!appointmentId || !practitionerId) {
      setError("Choose an appointment before submitting feedback.");
      return;
    }
    try {
      const result = await submitFeedback({
        patientId: currentUserId,
        practitionerId,
        appointmentId,
        rating,
        comments: comments.trim() || undefined,
      });
      setSaved(
        result.complaint
          ? `Feedback saved and complaint ${result.complaint.id} was opened for the patient-relations team.`
          : "Thank you. Your feedback was saved to the database.",
      );
      setComments("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Feedback could not be saved.");
    }
  }

  function exportCSV() {
    const header = "Metric,Value\n";
    const rows = summary
      ? [
          ["From", summary.from],
          ["To", summary.to],
          ["Users", summary.users],
          ["Appointments", summary.appointments],
          ["Completed payments", summary.completedPayments],
          ["Open alerts", summary.openAlerts],
          ["Published plans", summary.publishedPlans],
          ["Feedback responses", summary.feedback],
          ["Average rating", summary.averageRating],
        ]
      : [];
    const blob = new Blob([header + rows.map((row) => row.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nutricare-summary.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const chartData = summary
    ? [
        { label: "Users", value: Number(summary.users) },
        { label: "Visits", value: Number(summary.appointments) },
        { label: "Paid", value: Number(summary.completedPayments) },
        { label: "Alerts", value: Number(summary.openAlerts) },
        { label: "Plans", value: Number(summary.publishedPlans) },
        { label: "Feedback", value: Number(summary.feedback) },
      ]
    : [];

  const feedbackForm = (
    <section className="panel">
      <div className="panel-title">
        <div>
          <span className="eyebrow">Post-consultation</span>
          <h2>Record feedback</h2>
        </div>
      </div>
      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="feedback-appointment">Appointment</label>
          <select id="feedback-appointment" value={appointmentId} onChange={(event) => setAppointmentId(event.target.value)} required>
            {appointments.length === 0 && <option value="">No appointments available</option>}
            {appointments.map((item) => (
              <option key={item.id} value={item.id}>
                {item.serviceType} · {item.practitionerName} · {item.status}
              </option>
            ))}
          </select>
        </div>
        {!patientOnly && (
          <div className="field">
            <label htmlFor="feedback-practitioner">Practitioner</label>
            <select id="feedback-practitioner" value={practitionerId} onChange={(event) => setPractitionerId(event.target.value)} required>
              {practitioners.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.fullName}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="field">
          <label>Rating</label>
          <div className="chip-row" style={{ margin: "8px 0 14px" }}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                type="button"
                aria-label={`${value} stars`}
                className={value <= rating ? "chip active" : "chip"}
                onClick={() => setRating(value)}
                key={value}
              >
                <Star size={14} fill={value <= rating ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor="feedback">Comments or complaint</label>
          <textarea id="feedback" rows={4} value={comments} onChange={(event) => setComments(event.target.value)} placeholder="Tell us about the consultation" />
        </div>
        <button className="primary" type="submit" style={{ marginTop: 12, width: "100%" }} disabled={!appointmentId}>
          Submit feedback
        </button>
      </form>
      {saved && <div className="success-note">{saved}</div>}
      {error && <div className="form-error">{error}</div>}
    </section>
  );

  if (patientOnly) {
    return (
      <div className="stack-xl">
        <div className="page-heading">
          <div>
            <span className="eyebrow">My experience</span>
            <h1>Feedback & support</h1>
            <p>Rate a completed consultation or ask the patient-relations team for help.</p>
          </div>
        </div>
        <div className="patient-feedback-layout">
          {feedbackForm}
          <section className="panel tip-card">
            <Star size={20} />
            <div>
              <span className="eyebrow">Your privacy</span>
              <h2>Only your own feedback is shown here</h2>
              <p>Management revenue, workload and organization-wide reports are restricted to authorized staff.</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="stack-xl">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Module 06 · IT25100792</span>
          <h1>Reports & feedback</h1>
          <p>Service quality, business performance and complaint follow-up.</p>
        </div>
        <button className="secondary" onClick={exportCSV} disabled={!summary}>
          <Download size={16} /> Export summary
        </button>
      </div>
      {error && <div className="form-error">{error}</div>}
      <section className="metric-row">
        <article className="metric">
          <span>Appointments</span>
          <strong>{summary?.appointments ?? "—"}</strong>
          <small>
            {range.from} → {range.to}
          </small>
        </article>
        <article className="metric">
          <span>Payments</span>
          <strong>{summary?.completedPayments ?? "—"}</strong>
          <small>Completed</small>
        </article>
        <article className="metric">
          <span>Satisfaction</span>
          <strong>{summary ? `${Number(summary.averageRating).toFixed(1)} / 5` : "—"}</strong>
          <small>{summary?.feedback ?? 0} responses</small>
        </article>
      </section>
      <div className="feature-grid">
        <section className="panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">Live database summary</span>
              <h2>Operational counts</h2>
            </div>
            <BarChart3 size={20} />
          </div>
          {chartData.length > 0 ? (
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d7e4dc" />
                  <XAxis dataKey="label" stroke="#687e74" fontSize={11} />
                  <YAxis stroke="#687e74" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2b795d" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="list-item">
              <span className="grow">
                <strong>Summary unavailable</strong>
                <small>Sign in with a management role to load the report.</small>
              </span>
            </div>
          )}
          <div className="list" style={{ marginTop: 14 }}>
            <div className="list-item">
              <span className="grow">
                <strong>Open complaints</strong>
                <small>{complaints.filter((item) => item.status === "OPEN").length} currently open</small>
              </span>
            </div>
            {complaints.slice(0, 4).map((item) => (
              <div className="list-item" key={item.id}>
                <span className="grow">
                  <strong>{item.priority} · {item.status}</strong>
                  <small>{item.id}</small>
                </span>
              </div>
            ))}
          </div>
        </section>
        {feedbackForm}
      </div>
    </div>
  );
}
