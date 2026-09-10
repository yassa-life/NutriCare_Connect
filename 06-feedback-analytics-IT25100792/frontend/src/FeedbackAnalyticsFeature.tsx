import { useState } from "react";
import { BarChart3, Download, Star } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const visits = [{ month: "May", completed: 72, missed: 12 }, { month: "Jun", completed: 85, missed: 10 }, { month: "Jul", completed: 91, missed: 9 }, { month: "Aug", completed: 104, missed: 7 }];

export function FeedbackAnalyticsFeature({ patientOnly = false }: { patientOnly?: boolean }) {
  const [rating, setRating] = useState(5);
  const [saved, setSaved] = useState("");
  function exportCSV() {
    const header = "Month,Completed Visits,Missed Visits\n";
    const rows = visits.map(v => `${v.month},${v.completed},${v.missed}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nutricare-summary.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  function submit(event: React.FormEvent) { event.preventDefault(); setSaved(rating <= 2 ? "Feedback saved and a complaint ticket was created for the patient-relations team." : "Thank you. Your feedback was submitted."); }
  const feedbackForm = <section className="panel"><div className="panel-title"><div><span className="eyebrow">Post-consultation</span><h2>Record feedback</h2></div></div><form onSubmit={submit}><div className="field"><label>Rating</label><div className="chip-row" style={{ margin: "8px 0 14px" }}>{[1, 2, 3, 4, 5].map((value) => <button type="button" aria-label={`${value} stars`} className={value <= rating ? "chip active" : "chip"} onClick={() => setRating(value)} key={value}><Star size={14} fill={value <= rating ? "currentColor" : "none"}/></button>)}</div></div><div className="field"><label htmlFor="feedback">Comments or complaint</label><textarea id="feedback" rows={4} placeholder="Tell us about the consultation"/></div><button className="primary" type="submit" style={{ marginTop: 12, width: "100%" }}>Submit feedback</button></form>{saved && <div className="success-note">{saved}</div>}</section>;
  if (patientOnly) return <div className="stack-xl"><div className="page-heading"><div><span className="eyebrow">My experience</span><h1>Feedback & support</h1><p>Rate a completed consultation or ask the patient-relations team for help.</p></div></div><div className="patient-feedback-layout">{feedbackForm}<section className="panel tip-card"><Star size={20}/><div><span className="eyebrow">Your privacy</span><h2>Only your own feedback is shown here</h2><p>Management revenue, workload and organization-wide reports are restricted to authorized staff.</p></div></section></div></div>;
  return <div className="stack-xl"><div className="page-heading"><div><span className="eyebrow">Module 06 · IT25100792</span><h1>Reports & feedback</h1><p>Service quality, business performance and complaint follow-up.</p></div><button className="secondary" onClick={exportCSV}><Download size={16}/> Export summary</button></div><section className="metric-row"><article className="metric"><span>Patients served</span><strong>104</strong><small>August</small></article><article className="metric"><span>Revenue</span><strong>LKR 364k</strong><small>Demo transactions</small></article><article className="metric"><span>Satisfaction</span><strong>4.6 / 5</strong><small>42 responses</small></article></section><div className="feature-grid"><section className="panel"><div className="panel-title"><div><span className="eyebrow">Monthly performance</span><h2>Visits and missed appointments</h2></div><BarChart3 size={20}/></div><div className="chart-box"><ResponsiveContainer width="100%" height="100%" minWidth={0}><BarChart data={visits}><CartesianGrid strokeDasharray="3 3" stroke="#d7e4dc"/><XAxis dataKey="month" stroke="#687e74" fontSize={11}/><YAxis stroke="#687e74" fontSize={11}/><Tooltip/><Bar dataKey="completed" fill="#2b795d" radius={[5, 5, 0, 0]}/><Bar dataKey="missed" fill="#d99b43" radius={[5, 5, 0, 0]}/></BarChart></ResponsiveContainer></div></section>{feedbackForm}</div></div>;
}
