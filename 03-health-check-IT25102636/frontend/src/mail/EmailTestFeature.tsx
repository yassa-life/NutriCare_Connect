import { useCallback, useEffect, useState } from "react";
import { Mail, RefreshCw, Send } from "lucide-react";

type MailStatus = {
  liveEmailEnabled: boolean;
  fromAddress: string;
  mode: string;
};

type MailAttempt = {
  id: string;
  recipientEmail: string;
  template: string;
  status: string;
  messagePreview: string;
  createdAt: string;
};

export function EmailTestFeature({
  defaultEmail = "",
  loadStatus,
  loadAttempts,
  sendTest,
}: {
  defaultEmail?: string;
  loadStatus: () => Promise<MailStatus>;
  loadAttempts: () => Promise<MailAttempt[]>;
  sendTest: (to: string) => Promise<MailAttempt>;
}) {
  const [to, setTo] = useState(defaultEmail);
  const [status, setStatus] = useState<MailStatus | null>(null);
  const [attempts, setAttempts] = useState<MailAttempt[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setError("");
    try {
      const [mailStatus, rows] = await Promise.all([loadStatus(), loadAttempts()]);
      setStatus(mailStatus);
      setAttempts(rows);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Email status could not be loaded.");
    }
  }, [loadAttempts, loadStatus]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    setError("");
    try {
      const attempt = await sendTest(to.trim());
      setNotice(
        attempt.status === "SIMULATED_DELIVERED"
          ? "Test recorded in simulated mode. No inbox message was sent because live SMTP is off."
          : `Test email processed with status ${attempt.status}.`,
      );
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Test email could not be sent.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack-xl">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Module 03 · Admin only</span>
          <h1>Email delivery test</h1>
          <p>Send a one-off SMTP test and review recent delivery attempts.</p>
        </div>
        <button className="secondary" type="button" onClick={() => void refresh()}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <section className="metric-row">
        <article className="metric">
          <span>Mode</span>
          <strong>{status?.mode ?? "…"}</strong>
          <small>{status?.liveEmailEnabled ? "Live SMTP" : "Simulated local delivery"}</small>
        </article>
        <article className="metric">
          <span>From address</span>
          <strong style={{ fontSize: "1rem" }}>{status?.fromAddress ?? "…"}</strong>
          <small>Configured MAIL_FROM</small>
        </article>
      </section>

      <div className="feature-grid">
        <section className="panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">SMTP check</span>
              <h2>Send test email</h2>
            </div>
            <Mail size={20} />
          </div>
          <form className="form-grid" onSubmit={submit}>
            <div className="field full">
              <label htmlFor="mail-to">Recipient email</label>
              <input
                id="mail-to"
                type="email"
                required
                value={to}
                onChange={(event) => setTo(event.target.value)}
                placeholder="you@example.com"
              />
              <small>
                With <code>MAIL_LIVE_ENABLED=false</code>, delivery is only saved in the database. Turn live SMTP on to
                reach a real inbox.
              </small>
            </div>
            <button className="primary field full" type="submit" disabled={busy || !to.trim()}>
              <Send size={16} /> {busy ? "Sending…" : "Send test email"}
            </button>
          </form>
          {notice && <div className="success-note">{notice}</div>}
          {error && <div className="form-error">{error}</div>}
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">Delivery log</span>
              <h2>Recent attempts</h2>
            </div>
          </div>
          <div className="list">
            {attempts.length === 0 && (
              <div className="list-item">
                <span className="grow">
                  <strong>No attempts yet</strong>
                  <small>Send a test email to create the first log entry.</small>
                </span>
              </div>
            )}
            {attempts.map((item) => (
              <div className="list-item" key={item.id}>
                <span className="avatar">
                  <Mail size={15} />
                </span>
                <span className="grow">
                  <strong>{item.recipientEmail}</strong>
                  <small>
                    {item.template.replaceAll("_", " ")} · {item.messagePreview}
                  </small>
                  <small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</small>
                </span>
                <span className={item.status.includes("FAIL") ? "status pending" : "status confirmed"}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
