import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarCheck, CircleDollarSign, Clock3, Plus } from "lucide-react";

type Appointment = { id: string; patientId: string; patientName: string; practitionerId: string; practitionerName: string; serviceType: string; status: string; startTime: string; invoiceNumber?: string; amount?: number; invoiceStatus?: string };
type Slot = { id: string; practitionerId: string; practitionerName: string; startTime: string; durationMinutes: number; status: string };
type Person = { id: string; fullName: string; role: string; enabled: boolean };

function today() { return new Date().toISOString().slice(0, 10); }
function money(value: number) { return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(value); }
function time(value: string) { return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }

export function AppointmentBillingFeature({ role, currentUserId, userName, loadAppointments, loadSlots, loadPeople, createBooking }: {
  role: string; currentUserId: string; userName: string;
  loadAppointments: () => Promise<Appointment[]>;
  loadSlots: (date: string) => Promise<Slot[]>;
  loadPeople: () => Promise<Person[]>;
  createBooking: (details: { slotId: string; patientId: string; serviceType: string; amount: number }) => Promise<unknown>;
}) {
  const canBook = role === "PATIENT" || role === "RECEPTION_STAFF";
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [chosen, setChosen] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true); setNotice("");
    try {
      const [appointmentRows, slotRows, personRows] = await Promise.all([
        loadAppointments(), loadSlots(today()), canBook && role !== "PATIENT" ? loadPeople() : Promise.resolve([]),
      ]);
      setAppointments(appointmentRows); setSlots(slotRows); setPeople(personRows);
      setChosen((current) => slotRows.some(slot => slot.id === current && slot.status === "AVAILABLE") ? current : (slotRows.find(slot => slot.status === "AVAILABLE")?.id ?? ""));
    } catch (reason) { setNotice(reason instanceof Error ? reason.message : "Appointments could not be loaded from the database."); }
    finally { setLoading(false); }
  }, [canBook, loadAppointments, loadPeople, loadSlots, role]);

  useEffect(() => { void refresh(); }, [refresh]);
  const selected = slots.find(slot => slot.id === chosen);
  const available = slots.filter(slot => slot.status === "AVAILABLE");
  const confirmed = appointments.filter(row => row.status === "CONFIRMED").length;
  const outstanding = appointments.filter(row => row.invoiceStatus && row.invoiceStatus !== "PAID").reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
  const patients = useMemo(() => people.filter(person => person.role === "PATIENT"), [people]);

  async function book(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) { setNotice("Select an available database slot first."); return; }
    const form = new FormData(event.currentTarget);
    try {
      await createBooking({ slotId: selected.id, patientId: role === "PATIENT" ? currentUserId : String(form.get("patientId")), serviceType: String(form.get("serviceType")), amount: Number(form.get("amount")) });
      setNotice("The database slot is held for 10 minutes and an invoice was generated.");
      await refresh();
    } catch (reason) { setNotice(reason instanceof Error ? reason.message : "The appointment could not be created."); }
  }

  return <div className="stack-xl"><div className="page-heading"><div><span className="eyebrow">Module 02 · IT25103681</span><h1>Appointments & billing</h1><p>{role === "DOCTOR" || role === "DIETITIAN" ? "Only appointments assigned to your account are shown." : "Conflict-free scheduling with invoices and safe simulated payments."}</p></div>{canBook && <button className="primary" onClick={() => document.getElementById("booking-form")?.scrollIntoView({behavior:"smooth"})}><Plus size={17}/> New booking</button>}</div>
    <section className="metric-row"><article className="metric"><span>Available today</span><strong>{loading ? "…" : `${available.length} slots`}</strong></article><article className="metric"><span>{role === "PATIENT" ? "My confirmed" : "Confirmed"}</span><strong>{loading ? "…" : confirmed}</strong></article><article className="metric"><span>Outstanding</span><strong>{loading ? "…" : money(outstanding)}</strong></article></section>
    {notice && <div className="success-note">{notice}</div>}
    <div className={canBook ? "feature-grid" : "stack-xl"}><section className="panel"><div className="panel-title"><div><span className="eyebrow">{new Date().toLocaleDateString([], { weekday:"long", day:"2-digit", month:"short" })}</span><h2>{role === "DOCTOR" || role === "DIETITIAN" ? "My consultation schedule" : "Available consultation times"}</h2></div><CalendarCheck size={20}/></div><div className="chip-row">{available.map(slot => <button key={slot.id} className={chosen===slot.id?"chip active":"chip"} onClick={()=>setChosen(slot.id)}><Clock3 size={12}/> {time(slot.startTime)} · {slot.practitionerName}</button>)}{!loading && available.length === 0 && <span className="chip">No available slots for this account today</span>}</div><div className="list" style={{marginTop:18}}>{appointments.map(appointment => <div className="list-item" key={appointment.id}><span className="avatar">{appointment.patientName[0]}</span><span className="grow"><strong>{appointment.patientName}</strong><small>{appointment.practitionerName} · {time(appointment.startTime)} · {appointment.serviceType}</small></span><span><span className={appointment.status === "CONFIRMED"?"status confirmed":"status pending"}>{appointment.status}</span><small style={{display:"block",marginTop:5}}>{appointment.amount == null ? "No invoice" : money(Number(appointment.amount))}</small></span></div>)}{!loading && appointments.length === 0 && <div className="list-item"><span className="grow"><strong>No appointments</strong><small>Nothing has been assigned to {userName} yet.</small></span></div>}</div></section>
    {canBook && <section className="panel" id="booking-form"><div className="panel-title"><div><span className="eyebrow">Reserve & invoice</span><h2>Create appointment</h2></div><CircleDollarSign size={20}/></div><form className="form-grid" onSubmit={book}>{role === "PATIENT" ? <div className="field full"><label>Patient</label><input value={`${userName} (${currentUserId})`} readOnly/></div> : <div className="field full"><label htmlFor="patientId">Patient</label><select id="patientId" name="patientId" required>{patients.map(patient => <option key={patient.id} value={patient.id}>{patient.fullName} ({patient.id})</option>)}</select></div>}<div className="field full"><label>Practitioner and time</label><input value={selected ? `${selected.practitionerName} · ${time(selected.startTime)}` : "No available slot selected"} readOnly/></div><div className="field full"><label htmlFor="serviceType">Service</label><input id="serviceType" name="serviceType" defaultValue="Health check-up" required/></div><div className="field full"><label htmlFor="amount">Invoice amount (LKR)</label><input id="amount" name="amount" type="number" min="0" defaultValue="3500" required/></div><button className="primary field full" type="submit" disabled={!selected}>Hold slot & generate invoice</button></form></section>}</div>
  </div>;
}
