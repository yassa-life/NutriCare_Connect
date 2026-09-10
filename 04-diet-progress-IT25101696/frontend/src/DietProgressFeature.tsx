import { useCallback, useEffect, useMemo, useState } from "react";
import { Droplets, Leaf, Plus } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Person = { id: string; fullName: string; role: string; enabled: boolean };
type Plan = { id: string; patientId: string; dietitianId: string; title: string; calorieTarget?: number; exclusions?: string; mealSchedule: string; status: string; createdAt: string };
type Progress = { id: string; patientId: string; logDate: string; weightKg?: number; bmi?: number; waterGlasses?: number; mealsCompleted?: number };

export function DietProgressFeature({ canManagePlans, currentUserId, loadPeople, loadPlans, loadProgress, savePlan }: {
  canManagePlans: boolean; currentUserId: string;
  loadPeople: () => Promise<Person[]>;
  loadPlans: (patientId: string) => Promise<Plan[]>;
  loadProgress: (patientId: string) => Promise<Progress[]>;
  savePlan: (plan: { patientId: string; title: string; calorieTarget: number; exclusions?: string; mealSchedule: string }) => Promise<Plan>;
}) {
  const [people, setPeople] = useState<Person[]>([]);
  const [patientId, setPatientId] = useState(canManagePlans ? "" : currentUserId);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canManagePlans) return;
    loadPeople().then(rows => {
      const patients = rows.filter(person => person.role === "PATIENT");
      setPeople(patients);
      setPatientId(current => current || patients[0]?.id || "");
    }).catch(reason => setNotice(reason instanceof Error ? reason.message : "Patients could not be loaded."));
  }, [canManagePlans, loadPeople]);

  const refresh = useCallback(async () => {
    if (!patientId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [planRows, progressRows] = await Promise.all([loadPlans(patientId), loadProgress(patientId)]);
      setPlans(planRows); setProgress(progressRows);
    } catch (reason) { setNotice(reason instanceof Error ? reason.message : "Diet records could not be loaded."); }
    finally { setLoading(false); }
  }, [loadPlans, loadProgress, patientId]);

  useEffect(() => { void refresh(); }, [refresh]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await savePlan({ patientId, title: String(form.get("title")), calorieTarget: Number(form.get("calories")), exclusions: String(form.get("exclusions")), mealSchedule: String(form.get("schedule")) });
      setNotice("Diet plan saved to the database for this patient."); setShowForm(false); await refresh();
    } catch (reason) { setNotice(reason instanceof Error ? reason.message : "Diet plan could not be saved."); }
  }

  const activePlan = plans.find(plan => plan.status === "PUBLISHED") ?? plans[0];
  const selectedPatient = people.find(person => person.id === patientId);
  const chartData = useMemo(() => progress.filter(row => row.weightKg != null).map(row => ({ date: row.logDate.slice(5), weight: Number(row.weightKg) })), [progress]);
  const latest = progress.at(-1);

  return <div className="stack-xl"><div className="page-heading"><div><span className="eyebrow">Module 04 · IT25101696</span><h1>Diet plans & progress</h1><p>Personalized nutrition records loaded from the NutriCare database.</p></div>{canManagePlans && <button className="primary" onClick={() => setShowForm(value => !value)}><Plus size={16}/> Create plan</button>}</div>
    {canManagePlans && <section className="panel"><div className="field"><label htmlFor="diet-patient">Patient</label><select id="diet-patient" value={patientId} onChange={event => setPatientId(event.target.value)}>{people.map(patient => <option value={patient.id} key={patient.id}>{patient.fullName} ({patient.id})</option>)}</select></div></section>}
    {notice && <div className="success-note">{notice}</div>}
    {canManagePlans && showForm && <section className="panel"><div className="panel-title"><div><span className="eyebrow">New plan</span><h2>Create diet plan for {selectedPatient?.fullName ?? patientId}</h2></div></div><form className="form-grid" onSubmit={submit}><div className="field full"><label htmlFor="plan-title">Plan title</label><input id="plan-title" name="title" required placeholder="e.g. High-protein recovery plan"/></div><div className="field"><label htmlFor="plan-calories">Calorie target</label><input id="plan-calories" name="calories" type="number" min="1" required placeholder="1850"/></div><div className="field"><label htmlFor="plan-exclusions">Exclusions</label><input id="plan-exclusions" name="exclusions" placeholder="e.g. Gluten, dairy"/></div><div className="field full"><label htmlFor="plan-notes">Meal schedule</label><textarea id="plan-notes" name="schedule" required rows={4} placeholder="Breakfast 07:30 - oats and fruit..."/></div><button className="primary field full" type="submit" disabled={!patientId}><Plus size={16}/> Save diet plan</button></form></section>}
    <div className="feature-grid equal"><section className="panel"><div className="panel-title"><div><span className="eyebrow">{activePlan?.status ?? "Database record"}</span><h2>{loading ? "Loading…" : activePlan?.title ?? "No diet plan yet"}</h2></div>{activePlan && <span className={activePlan.status === "PUBLISHED" ? "status confirmed" : "status pending"}>{activePlan.status}</span>}</div>{activePlan ? <><div className="chip-row"><span className="chip active"><Leaf size={12}/> {activePlan.calorieTarget ?? "—"} kcal</span>{activePlan.exclusions && <span className="chip">Avoid: {activePlan.exclusions}</span>}</div><div className="list" style={{marginTop:16}}><div className="list-item"><span className="avatar"><Leaf size={15}/></span><span className="grow"><strong>Meal schedule</strong><small>{activePlan.mealSchedule}</small></span></div></div></> : !loading && <div className="list-item"><span className="grow"><strong>No plan stored</strong><small>A doctor or dietitian can create the first plan.</small></span></div>}<div className="tip-card" style={{marginTop:14,padding:14,borderRadius:12}}><Droplets/><div><h2>{latest?.waterGlasses ?? 0} glasses</h2><p>Latest stored water log.</p></div></div></section><section className="panel"><div className="panel-title"><div><span className="eyebrow">Recorded measurements</span><h2>Weight progress</h2></div><strong style={{color:"var(--green)"}}>{progress.length} logs</strong></div>{chartData.length > 0 ? <div className="chart-box"><ResponsiveContainer width="100%" height="100%" minWidth={0}><AreaChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#d7e4dc"/><XAxis dataKey="date" stroke="#687e74" fontSize={11}/><YAxis domain={["dataMin - 2", "dataMax + 2"]} stroke="#687e74" fontSize={11}/><Tooltip/><Area type="monotone" dataKey="weight" stroke="#2b795d" strokeWidth={3} fill="#dcefe5"/></AreaChart></ResponsiveContainer></div> : <div className="list-item"><span className="grow"><strong>No weight logs</strong><small>The chart will appear after progress is saved.</small></span></div>}</section></div>
  </div>;
}
