export type Role = "DIETITIAN" | "DOCTOR" | "RECEPTION_STAFF" | "SYSTEM_ADMIN" | "OPERATIONS_MANAGER" | "FINANCE_EXECUTIVE" | "MEDICAL_CENTER_COORDINATOR" | "PATIENT_RELATIONS_OFFICER" | "PATIENT";

export type SessionUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  role: Role;
  enabled: boolean;
};

export type Session = { token: string | null; user: SessionUser; demo: boolean };

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";
const demoAccounts: Record<string, { id: string; name: string; role: Role }> = {
  "patient@nutricare.demo": { id: "11111111-1111-1111-1111-111111111111", name: "Amal Perera", role: "PATIENT" },
  "dietitian@nutricare.demo": { id: "22222222-2222-2222-2222-222222222222", name: "Ishara Jayasinghe", role: "DIETITIAN" },
  "doctor@nutricare.demo": { id: "33333333-3333-3333-3333-333333333333", name: "Chamara Fernando", role: "DOCTOR" },
  "reception@nutricare.demo": { id: "44444444-4444-4444-4444-444444444444", name: "Dilki Ranatunga", role: "RECEPTION_STAFF" },
  "admin@nutricare.demo": { id: "55555555-5555-5555-5555-555555555555", name: "System Administrator", role: "SYSTEM_ADMIN" },
  "manager@nutricare.demo": { id: "66666666-6666-6666-6666-666666666666", name: "Nuwan Perera", role: "OPERATIONS_MANAGER" },
  "finance@nutricare.demo": { id: "77777777-7777-7777-7777-777777777777", name: "Sahan Wickramasinghe", role: "FINANCE_EXECUTIVE" },
  "coordinator@nutricare.demo": { id: "88888888-8888-8888-8888-888888888888", name: "Medical Center Coordinator", role: "MEDICAL_CENTER_COORDINATOR" },
  "relations@nutricare.demo": { id: "99999999-9999-9999-9999-999999999999", name: "Patient Relations Officer", role: "PATIENT_RELATIONS_OFFICER" },
};

export const demoEmails = Object.keys(demoAccounts);

export async function login(email: string, password: string): Promise<Session> {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(1800),
    });
    if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message ?? "Unable to sign in");
    const result = await response.json();
    return { token: result.token, user: result.user, demo: false };
  } catch (error) {
    const account = demoAccounts[email.toLowerCase()];
    if (account && password === "password") {
      return { token: null, demo: true, user: { id: account.id, fullName: account.name, email: email.toLowerCase(), role: account.role, enabled: true } };
    }
    throw error instanceof Error ? error : new Error("Unable to sign in");
  }
}

export async function updateProfile(session: Session, updates: Partial<SessionUser>): Promise<Session> {
  if (!session.token) return { ...session, user: { ...session.user, ...updates } };
  const response = await fetch(`${API_BASE}/users/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
    body: JSON.stringify({ ...session.user, ...updates }),
  });
  if (!response.ok) throw new Error("Profile could not be updated");
  return { ...session, user: await response.json() };
}

export async function logout(session: Session) {
  if (!session.token) return;
  await fetch(`${API_BASE}/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${session.token}` } }).catch(() => undefined);
}

export async function askPatientGuide(session: Session, question: string) {
  if (session.token) {
    const response = await fetch(`${API_BASE}/assistant/guide`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
      body: JSON.stringify({ question }),
    });
    if (response.ok) return response.json() as Promise<{ answer: string; suggestedDestinations: string[] }>;
  }
  const text = question.toLowerCase();
  if (/book|appointment|check.?up|schedule/.test(text)) return { answer: "Open Appointments to choose a practitioner and available time.", suggestedDestinations: ["appointments"] };
  if (/diet|meal|water|weight|progress/.test(text)) return { answer: "Open Diet & progress to review your plan and record daily progress.", suggestedDestinations: ["diet"] };
  if (/health|result|blood|bmi|vital/.test(text)) return { answer: "Open Health checks to view your own results. Ask your clinician to interpret medical values.", suggestedDestinations: ["health"] };
  if (/profile|name|phone|address|email/.test(text)) return { answer: "Open your account menu and select Edit profile.", suggestedDestinations: ["profile"] };
  return { answer: "I can guide you to appointments, health records, diet plans, messages or profile settings. I cannot diagnose symptoms.", suggestedDestinations: [] };
}
