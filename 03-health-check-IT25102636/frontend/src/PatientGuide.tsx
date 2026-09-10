import { useRef, useState, useEffect } from "react";
import { Bot, PhoneCall, Send, ShieldAlert, X } from "lucide-react";

type GuideDestination = "appointments" | "health" | "diet" | "messages" | "analytics";
type GuideMessage = { from: string; text: string };
type GuideReply = { answer: string; suggestedDestinations: string[]; source: "GEMINI" | "LOCAL"; urgency?: "EMERGENCY" | "URGENT" | "ROUTINE"; emergencyNumber?: string };

/* Render simple markdown bold (**text**) and bullet points */
function renderGuideText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, li) => {
    const trimmed = line.trim();
    if (!trimmed) return <br key={li} />;
    /* Convert **bold** to <strong> */
    const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, pi) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={pi}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    /* Bullet point lines */
    if (trimmed.startsWith("•")) {
      return <div key={li} style={{ paddingLeft: 6 }}>{rendered}</div>;
    }
    return <div key={li}>{rendered}</div>;
  });
}

export function PatientGuide({ userName, ask, go, editProfile }: {
  userName: string;
  ask: (question: string, history?: GuideMessage[]) => Promise<GuideReply>;
  go: (page: GuideDestination) => void;
  editProfile: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [source, setSource] = useState<"GEMINI" | "LOCAL" | null>(null);
  const [urgency, setUrgency] = useState<"EMERGENCY" | "URGENT" | "ROUTINE">("ROUTINE");
  const [messages, setMessages] = useState<GuideMessage[]>([{ from: "guide", text: `Hi ${userName.split(" ")[0]} — I can provide temporary AI care support when staff are unavailable, help you judge urgency, and guide you through NutriCare. I do not replace a doctor.` }]);
  const messagesEnd = useRef<HTMLDivElement>(null);

  /* Auto-scroll to bottom when new messages arrive */
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!question.trim()) return;
    const current = question.trim();
    setQuestion("");
    const updatedMessages = [...messages, { from: "patient", text: current }];
    setMessages(updatedMessages);
    setBusy(true);
    try {
      const reply = await ask(current, updatedMessages);
      setSource(reply.source);
      setUrgency(reply.urgency ?? "ROUTINE");
      setMessages((items) => [...items, { from: "guide", text: reply.answer }]);
    } catch {
      setMessages((items) => [...items, { from: "guide", text: "Care support could not connect. If this may be an emergency, call 1990 now. Otherwise try again or contact your care team." }]);
      setUrgency("URGENT");
    } finally { setBusy(false); }
  }

  function shortcut(value: string) {
    if (value === "profile") {
      editProfile();
      setOpen(false);
    } else if (["appointments", "health", "diet", "messages", "analytics"].includes(value)) {
      go(value as GuideDestination);
      setOpen(false);
    }
  }

  function quickAsk(q: string) {
    setQuestion(q);
    /* Trigger submit programmatically */
    setTimeout(() => {
      const form = document.querySelector(".guide-panel form") as HTMLFormElement;
      form?.requestSubmit();
    }, 50);
  }

  return <>
    <button className="guide-launch" onClick={() => setOpen((value) => !value)} aria-label="Open NutriGuide"><Bot size={20}/><span>Ask NutriGuide</span></button>
    {open && <section className="guide-panel" aria-label="Patient navigation assistant">
      <div className="guide-head"><span><Bot size={18}/><strong>NutriGuide</strong></span><small>{urgency === "EMERGENCY" ? "Emergency action" : source === "GEMINI" ? "AI care support" : source === "LOCAL" ? "Safe offline support" : "Temporary care support"}</small><button className="icon" onClick={() => setOpen(false)} aria-label="Close guide"><X size={18}/></button></div>
      <p className="guide-disclaimer">Health information, not a diagnosis. A doctor or registered dietitian can give advice for you. <a href="tel:1990">Emergency? Call 1990.</a></p>
      {urgency === "EMERGENCY" && <a className="guide-emergency" href="tel:1990"><ShieldAlert size={16}/><span><strong>Critical situation</strong><small>Call the free 1990 ambulance service now</small></span><PhoneCall size={17}/></a>}
      <div className="guide-messages">
        {messages.map((message, index) => (
          <div className={`guide-message ${message.from === "guide" ? "guide" : "patient"}`} key={index}>
            {message.from === "guide" ? renderGuideText(message.text) : message.text}
          </div>
        ))}
        {busy && <div className="guide-message guide">Finding the best place…</div>}
        <div ref={messagesEnd} />
      </div>
      <div className="guide-shortcuts">
        <button onClick={() => quickAsk("This may be a medical emergency and I need urgent help")}>Urgent help</button>
        <button onClick={() => quickAsk("How do I book an appointment?")}>Appointments</button>
        <button onClick={() => quickAsk("How do I view my health records?")}>Health</button>
        <button onClick={() => quickAsk("How do I track my diet?")}>Diet</button>
        <button onClick={() => shortcut("messages")}>Messages</button>
        <button onClick={() => quickAsk("How do I update my profile?")}>Profile</button>
      </div>
      <form onSubmit={submit}><input value={question} onChange={(event) => setQuestion(event.target.value)} aria-label="Ask NutriGuide" placeholder="Ask me anything…" disabled={busy}/><button className="icon" aria-label="Send question" disabled={busy}><Send size={17}/></button></form>
    </section>}
  </>;
}
