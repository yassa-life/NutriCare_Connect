import { useState } from "react";
import { BellRing, Mail, MessageCircle, Send } from "lucide-react";

export function MessagingRemindersFeature({ patientOnly = false, userName = "Patient" }: { patientOnly?: boolean; userName?: string }) {
  const firstName = userName.split(" ")[0];
  const [messages, setMessages] = useState(patientOnly
    ? [{ from: "Dietitian", text: "Your care team can answer non-urgent questions here.", mine: false }]
    : [{ from: firstName, text: "Can I replace brown rice with red rice?", mine: false }, { from: "You", text: "Yes, keep the same portion size and log it with lunch.", mine: true }]);
  const [message, setMessage] = useState("");
  function send(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    setMessages((items) => [...items, { from: "You", text: message.trim(), mine: true }]);
    setMessage("");
  }

  const conversation = <section className="panel"><div className="panel-title"><div><span className="eyebrow">{patientOnly ? "My care team" : firstName}</span><h2>Care conversation</h2></div><MessageCircle size={20}/></div><div className="list">{messages.map((item, index) => <div className="list-item" key={index} style={{marginLeft:item.mine ? "14%" : 0, background:item.mine ? "#e8f3ed" : "white"}}><span className="avatar">{item.from[0]}</span><span className="grow"><strong>{item.from}</strong><p>{item.text}</p><small>10:{32 + index * 4} AM · Delivered</small></span></div>)}</div><form onSubmit={send} style={{display:"flex", gap:8, marginTop:14}}><input aria-label="Message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a non-urgent message…" style={{flex:1, border:"1px solid #d9e3dd", borderRadius:10, padding:11}}/><button className="primary" aria-label="Send message"><Send size={17}/></button></form></section>;

  return <div className="stack-xl"><div className="page-heading"><div><span className="eyebrow">Module 05 · IT25103601</span><h1>Messages & reminders</h1><p>Secure, non-urgent conversations with reliable notifications.</p></div>{!patientOnly && <span className="chip active"><BellRing size={13}/> Reminder scheduler active</span>}</div><div className="feature-grid">{conversation}{patientOnly ? <section className="panel tip-card"><BellRing/><div><span className="eyebrow">My reminders</span><h2>Appointments and plan updates</h2><p>Your personal notifications appear in the bell menu. Delivery administration is restricted to staff.</p></div></section> : <section className="panel"><div className="panel-title"><div><span className="eyebrow">Delivery queue</span><h2>Automated reminders</h2></div><Mail size={20}/></div><div className="list">{[["Appointment tomorrow","SMS + email","Scheduled"],["Diet plan updated","In-app + email","Delivered"],["Follow-up overdue","SMS","Retry in 5 min"]].map(([title, channel, status]) => <div className="list-item" key={title}><span className="avatar"><BellRing size={15}/></span><span className="grow"><strong>{title}</strong><small>{channel} · simulated delivery</small></span><span className={status === "Delivered" ? "status confirmed" : "status pending"}>{status}</span></div>)}</div><div className="success-note">Email and SMS delivery attempts and retry statuses are saved locally.</div></section>}</div></div>;
}
