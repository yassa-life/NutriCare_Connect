import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, HeartPulse, Save } from "lucide-react";
import type { HealthCheck, HealthCheckResult, WorkspacePerson } from "../../../frontend/src/api";

type CheckInput = { patientId: string; weightKg: number; bmi: number; systolic?: number; diastolic?: number; bloodSugar: number; temperature: number; notes?: string };
type Props = { patientOnly?: boolean; userName?: string; currentUserId: string; loadPeople: () => Promise<WorkspacePerson[]>; loadChecks: (patientId: string) => Promise<HealthCheck[]>; saveCheck: (check: CheckInput) => Promise<HealthCheckResult> };

export function HealthCheckFeature({ patientOnly = false, userName = "Patient", currentUserId, loadPeople, loadChecks, saveCheck }: Props) {
  const [patients, setPatients] = useState<WorkspacePerson[]>([]);
  const [patientId, setPatientId] = useState(patientOnly ? currentUserId : "");
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patientOnly) return;
    loadPeople().then(items => {
      const available = items.filter(item => item.role === "PATIENT");
      setPatients(available);
      setPatientId(current => current || available[0]?.id || "");
    }).catch(reason => setError(reason instanceof Error ? reason.message : "Patients could not be loaded."));
  }, [loadPeople, patientOnly]);

  useEffect(() => {
    if (!patientId) { setChecks([]); return; }
    setError("");
    loadChecks(patientId).then(setChecks).catch(reason => setError(reason instanceof Error ? reason.message : "Health records could not be loaded."));
  }, [loadChecks, patientId]);

  const selectedName = useMemo(() => patientOnly ? userName : patients.find(item => item.id === patientId)?.fullName ?? "Select a patient", [patientId, patientOnly, patients, userName]);
  const latest = checks[0];

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!patientId) { setError("Select a patient first."); return; }
    const form = event.currentTarget;
    const data = new FormData(form);
    setSaving(true); setError(""); setNotice("");
    try {
      const result = await saveCheck({ patientId, weightKg: Number(data.get("weight")), bmi: Number(data.get("bmi")), systolic: Number(data.get("systolic")) || undefined, diastolic: Number(data.get("diastolic")) || undefined, bloodSugar: Number(data.get("sugar")), temperature: Number(data.get("temperature")), notes: String(data.get("notes") ?? "") });
      setChecks(current => [result.check, ...current]);
      setNotice(result.alerts.length ? `${result.alerts.length} health alert${result.alerts.length === 1 ? "" : "s"} created. ${result.disclaimer}` : `Health check saved. ${result.disclaimer}`);
      form.reset();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Health check could not be saved."); }
    finally { setSaving(false); }
  }

  const summary = <section className="panel">
    <div className="panel-title"><div><span className="eyebrow">{patientOnly ? "My latest database record" : "Patient database record"}</span><h2>{selectedName}</h2></div><HeartPulse size={21}/></div>
    {latest ? <><div className="metric-row"><article className="metric"><span>BMI</span><strong>{latest.bmi ?? "—"}</strong></article><article className="metric"><span>Blood sugar</span><strong>{latest.bloodSugar ?? "—"}</strong><small>mg/dL</small></article><article className="metric"><span>Blood pressure</span><strong>{latest.systolic && latest.diastolic ? `${latest.systolic}/${latest.diastolic}` : "—"}</strong><small>mmHg</small></article></div><div className="list">{checks.map(check => <div className="list-item" key={check.id}><span className="avatar">{new Date(check.recordedAt).getDate()}</span><span className="grow"><strong>{new Date(check.recordedAt).toLocaleDateString()} · Health check</strong><small>Weight {check.weightKg ?? "—"} kg · BMI {check.bmi ?? "—"} · Blood sugar {check.bloodSugar ?? "—"} mg/dL</small></span></div>)}</div></> : <div className="list-item"><span className="grow"><strong>No health checks recorded</strong><small>This account has no health-check rows in the database yet.</small></span></div>}
  </section>;

  return <div className="stack-xl"><div className="page-heading"><div><span className="eyebrow">Module 03 · IT25102636</span><h1>{patientOnly ? "My health check-ups" : "Health check-ups"}</h1><p>{patientOnly ? "Review your own saved check-up history." : "Record clinical observations and highlight meaningful changes."}</p></div><span className="chip"><AlertTriangle size={13}/> Reference thresholds · non-diagnostic</span></div>{error && <div className="form-error">{error}</div>}
    {patientOnly ? <div className="feature-grid">{summary}<section className="panel tip-card"><HeartPulse/><div><span className="eyebrow">Private record</span><h2>Only your health history is available here</h2><p>Contact a qualified clinician for interpretation or medical advice.</p></div></section></div> : <div className="feature-grid">{summary}<section className="panel"><div className="panel-title"><div><span className="eyebrow">New database record</span><h2>Record vital signs</h2></div></div><form className="form-grid" onSubmit={save}>
      <div className="field full"><label htmlFor="health-patient">Patient</label><select id="health-patient" value={patientId} onChange={event => setPatientId(event.target.value)} required><option value="">Select patient</option>{patients.map(patient => <option value={patient.id} key={patient.id}>{patient.fullName} · {patient.id}</option>)}</select></div>
      <div className="field"><label htmlFor="weight">Weight (kg)</label><input id="weight" name="weight" type="number" min="1" step="0.1" required/></div><div className="field"><label htmlFor="bmi">BMI</label><input id="bmi" name="bmi" type="number" min="1" step="0.1" required/></div><div className="field"><label htmlFor="systolic">Systolic</label><input id="systolic" name="systolic" type="number" min="1"/></div><div className="field"><label htmlFor="diastolic">Diastolic</label><input id="diastolic" name="diastolic" type="number" min="1"/></div><div className="field"><label htmlFor="sugar">Blood sugar (mg/dL)</label><input id="sugar" name="sugar" type="number" min="1" step="0.1" required/></div><div className="field"><label htmlFor="temperature">Temperature (°C)</label><input id="temperature" name="temperature" type="number" min="1" step="0.1" required/></div><div className="field full"><label htmlFor="notes">Clinical notes</label><textarea id="notes" name="notes" rows={4} placeholder="Observations and recommendations"/></div><button className="primary field full" type="submit" disabled={saving || !patientId}><Save size={16}/> {saving ? "Saving…" : "Save & compare results"}</button>
    </form>{notice && <div className="success-note">{notice}</div>}</section></div>}
  </div>;
}
