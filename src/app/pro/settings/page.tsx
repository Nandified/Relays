"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { getCalendarConnectionsForPro, getAvailabilityRulesForPro } from "@/lib/mock-data";

/* ── Toggle Component ────────────────────────────────────────── */

function Toggle({ enabled, onChange, label }: { enabled: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button role="switch" aria-checked={enabled} aria-label={label} onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${enabled ? "bg-blue-500" : "bg-white/10 border border-white/10"}`}>
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

/* ── Slider Component ────────────────────────────────────────── */

function Slider({ value, options, onChange, labels }: { value: number; options: number[]; onChange: (v: number) => void; labels?: Record<number, string> }) {
  const idx = options.indexOf(value);
  return (
    <div className="flex items-center gap-1">
      {options.map((opt, i) => {
        const isActive = i <= idx;
        const isCurrent = opt === value;
        return (
          <button key={opt} onClick={() => onChange(opt)}
            className={`flex-1 h-2 rounded-full transition-all ${isActive ? "bg-blue-500" : "bg-white/10"} ${isCurrent ? "ring-2 ring-blue-500/30" : ""}`}
            title={labels?.[opt] ?? String(opt)} />
        );
      })}
      <span className="ml-2 text-xs text-slate-300 font-medium min-w-[50px] text-right">{labels?.[value] ?? value}</span>
    </div>
  );
}

/* ── Section Component ───────────────────────────────────────── */

function SettingsSection({ title, description, children, accent }: { title: string; description?: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <Card padding="lg" className={`mb-4 ${accent ? "border-emerald-500/10" : ""}`}>
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
          {accent && <Badge variant="success">Pro</Badge>}
        </div>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      {children}
    </Card>
  );
}

/* ── Calendar Provider Card ───────────────────────────────────── */

const CALENDAR_PROVIDERS = [
  {
    id: "google",
    name: "Google Calendar",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    desc: "Sync your free/busy data and auto-create booking events",
  },
  {
    id: "outlook",
    name: "Outlook Calendar",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#0078D4" d="M24 7.387v10.478c0 .23-.08.424-.238.583a.793.793 0 01-.583.238h-8.765v-12.5h8.765c.23 0 .424.08.583.238A.793.793 0 0124 7.387z"/>
        <path fill="#0364B8" d="M14.414 6.188v12.5L0 16.5V3.75a.793.793 0 01.238-.583A.793.793 0 01.82 2.93l12.773 2.437c.478.091.82.402.82.82z"/>
        <ellipse fill="#fff" cx="7.5" cy="12" rx="3.5" ry="4"/>
      </svg>
    ),
    desc: "Connect Microsoft Outlook for seamless scheduling",
  },
  {
    id: "apple",
    name: "Apple Calendar",
    icon: (
      <svg width="18" height="18" fill="#999" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    desc: "Sync availability with your Apple Calendar",
  },
];

/* ── Main Pro Settings Page ──────────────────────────────────── */

export default function ProSettingsPage() {
  const proId = "pro_1";
  const calendarConnections = getCalendarConnectionsForPro(proId);
  const availabilityRules = getAvailabilityRulesForPro(proId);

  // Profile state
  const [name, setName] = React.useState("Alex Martinez");
  const [email, setEmail] = React.useState("alex@bluepeakinspections.com");
  const [phone, setPhone] = React.useState("(312) 555-0198");
  const [saved, setSaved] = React.useState(false);

  // Business info
  const [companyName, setCompanyName] = React.useState("Blue Peak Inspections");
  const [licenseNumber, setLicenseNumber] = React.useState("HI-2019-045832");
  const [serviceArea, setServiceArea] = React.useState("Chicago, Evanston, Oak Park");

  // Calendar availability
  const [businessHours, setBusinessHours] = React.useState(
    availabilityRules?.businessHours ?? {
      monday: { start: "08:00", end: "17:00", enabled: true },
      tuesday: { start: "08:00", end: "17:00", enabled: true },
      wednesday: { start: "08:00", end: "17:00", enabled: true },
      thursday: { start: "08:00", end: "17:00", enabled: true },
      friday: { start: "08:00", end: "16:00", enabled: true },
      saturday: { start: "09:00", end: "14:00", enabled: true },
      sunday: { start: "09:00", end: "14:00", enabled: false },
    }
  );
  const [bufferTime, setBufferTime] = React.useState(availabilityRules?.bufferMinutes ?? 30);
  const [minNotice, setMinNotice] = React.useState(availabilityRules?.minNoticeHours ?? 2);
  const [maxAdvance, setMaxAdvance] = React.useState(availabilityRules?.maxAdvanceDays ?? 30);
  const [blockedDates, setBlockedDates] = React.useState<string[]>(availabilityRules?.blockedDates ?? []);
  const [newBlockDate, setNewBlockDate] = React.useState("");

  // Auto-responses
  const [awayMessage, setAwayMessage] = React.useState("Thanks for reaching out! I typically respond within 1 hour during business hours.");
  const [responseCommitment, setResponseCommitment] = React.useState("1hr");

  // Notifications
  const [channels, setChannels] = React.useState({ email: true, sms: true, push: true, inApp: true });
  const [types, setTypes] = React.useState({ moments: true, bookings: true, messages: true, documents: true, marketing: false, newRequests: true, journeyUpdates: true });
  const [frequency, setFrequency] = React.useState<"realtime" | "daily" | "weekly">("realtime");

  // Privacy
  const [profileVisibility, setProfileVisibility] = React.useState<"public" | "team-only" | "private">("public");
  const [dataSharing, setDataSharing] = React.useState(true);

  // Calendar connect modal
  const [connectModal, setConnectModal] = React.useState<string | null>(null);
  const [connectStep, setConnectStep] = React.useState<"auth" | "success">("auth");

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = React.useState("");

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handleConnect = () => {
    setConnectStep("success");
    setTimeout(() => { setConnectModal(null); setConnectStep("auth"); }, 2000);
  };

  const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
  const DAY_LABELS: Record<string, string> = { monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun" };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Pro Settings</h1>
          <p className="mt-1 text-sm text-slate-400">Manage your professional account and preferences</p>
        </div>
        <Button onClick={handleSave}>{saved ? "✓ Saved!" : "Save Changes"}</Button>
      </div>

      {/* ── Profile ── */}
      <SettingsSection title="Profile" description="Your personal information">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-[var(--border)] flex items-center justify-center text-xl font-bold text-slate-300">AM</div>
            <div>
              <Button size="sm" variant="secondary">Change Photo</Button>
              <p className="mt-1 text-xs text-slate-600">JPG, PNG. Max 2MB.</p>
            </div>
          </div>
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </SettingsSection>

      {/* ── Business Info ── */}
      <SettingsSection title="Business Information" description="Your professional details" accent>
        <div className="space-y-4">
          <Input label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <Input label="License Number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
          <Input label="Service Areas" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} placeholder="Chicago, Evanston, Oak Park..." />
          <div className="flex flex-wrap gap-1.5">
            {serviceArea.split(",").map((a) => a.trim()).filter(Boolean).map((area) => (
              <Badge key={area} variant="outline">{area}</Badge>
            ))}
          </div>
        </div>
      </SettingsSection>

      {/* ── Calendar Connections ── */}
      <SettingsSection title="Calendar Connections" description="Connect your calendars for automatic availability sync" accent>
        <div className="space-y-3">
          {CALENDAR_PROVIDERS.map((provider) => {
            const connection = calendarConnections.find((c) => c.provider === provider.id);
            const isConnected = connection?.status === "connected";
            const isExpired = connection?.status === "expired";

            return (
              <div key={provider.id} className={`flex items-center justify-between rounded-xl border p-3 transition-all ${isConnected ? "border-emerald-500/15 bg-emerald-500/[0.03]" : isExpired ? "border-amber-500/15 bg-amber-500/[0.03]" : "border-[var(--border)] bg-[var(--bg-elevated)]"}`}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-[var(--border)] flex items-center justify-center">{provider.icon}</div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">{provider.name}</div>
                    {isConnected ? (
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-xs text-emerald-400">{connection.email}</span>
                        {connection.lastSyncAt && <span className="text-[10px] text-slate-600">• Synced {new Date(connection.lastSyncAt).toLocaleDateString()}</span>}
                      </div>
                    ) : isExpired ? (
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <span className="text-xs text-amber-400">Connection expired — re-authorize</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">{provider.desc}</span>
                    )}
                  </div>
                </div>
                <Button size="sm" variant={isConnected ? "secondary" : isExpired ? "primary" : "secondary"} onClick={() => { setConnectModal(provider.id); setConnectStep("auth"); }}>
                  {isConnected ? "Manage" : isExpired ? "Reconnect" : "Connect"}
                </Button>
              </div>
            );
          })}
        </div>
      </SettingsSection>

      {/* ── Availability Rules ── */}
      <SettingsSection title="Availability Rules" description="Set your business hours and booking constraints" accent>
        <div className="space-y-6">
          {/* Business hours per day */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Business Hours</h3>
            <div className="space-y-2">
              {DAYS.map((day) => {
                const hours = businessHours[day] as { start: string; end: string; enabled: boolean };
                return (
                  <div key={day} className="flex items-center gap-3">
                    <Toggle enabled={hours.enabled} onChange={(v) => setBusinessHours((prev) => ({ ...prev, [day]: { ...prev[day], enabled: v } }))} label={day} />
                    <span className={`text-xs font-medium w-8 ${hours.enabled ? "text-slate-300" : "text-slate-600"}`}>{DAY_LABELS[day]}</span>
                    {hours.enabled ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input type="time" value={hours.start} onChange={(e) => setBusinessHours((prev) => ({ ...prev, [day]: { ...prev[day], start: e.target.value } }))}
                          className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1 text-xs text-slate-200 outline-none w-24" />
                        <span className="text-xs text-slate-600">to</span>
                        <input type="time" value={hours.end} onChange={(e) => setBusinessHours((prev) => ({ ...prev, [day]: { ...prev[day], end: e.target.value } }))}
                          className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1 text-xs text-slate-200 outline-none w-24" />
                      </div>
                    ) : (
                      <span className="text-xs text-slate-600 flex-1">Unavailable</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buffer time */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Buffer Between Appointments</h3>
            <Slider value={bufferTime} options={[0, 15, 30, 60]} onChange={setBufferTime}
              labels={{ 0: "None", 15: "15 min", 30: "30 min", 60: "1 hour" }} />
          </div>

          {/* Minimum notice */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Minimum Notice Period</h3>
            <Slider value={minNotice} options={[1, 2, 24, 48]} onChange={setMinNotice}
              labels={{ 1: "1 hour", 2: "2 hours", 24: "24 hours", 48: "48 hours" }} />
          </div>

          {/* Maximum advance booking */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Maximum Advance Booking</h3>
            <Slider value={maxAdvance} options={[7, 14, 30, 60]} onChange={setMaxAdvance}
              labels={{ 7: "1 week", 14: "2 weeks", 30: "1 month", 60: "2 months" }} />
          </div>

          {/* Blocked dates */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Blocked Dates</h3>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {blockedDates.map((date) => (
                <div key={date} className="flex items-center gap-1 rounded-lg bg-red-500/[0.06] border border-red-500/15 px-2 py-1">
                  <span className="text-xs text-red-400">{new Date(date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  <button onClick={() => setBlockedDates((prev) => prev.filter((d) => d !== date))} className="text-red-500/50 hover:text-red-400">
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              {blockedDates.length === 0 && <span className="text-xs text-slate-600">No blocked dates</span>}
            </div>
            <div className="flex gap-2">
              <input type="date" value={newBlockDate} onChange={(e) => setNewBlockDate(e.target.value)}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs text-slate-200 outline-none" />
              <Button size="sm" variant="secondary" onClick={() => { if (newBlockDate && !blockedDates.includes(newBlockDate)) { setBlockedDates((prev) => [...prev, newBlockDate]); setNewBlockDate(""); } }}>
                Block Date
              </Button>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* ── Auto-Responses ── */}
      <SettingsSection title="Auto-Responses" description="Set automatic replies and response commitments" accent>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Away Message</label>
            <textarea className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent-light)] min-h-[80px] resize-y" value={awayMessage} onChange={(e) => setAwayMessage(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Response Time Commitment</label>
            <div className="flex gap-2">
              {["30min", "1hr", "2hr", "4hr", "24hr"].map((time) => (
                <button key={time} onClick={() => setResponseCommitment(time)}
                  className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-all border ${responseCommitment === time ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-[var(--bg-card)] text-slate-400 border-[var(--border)] hover:border-[var(--border-hover)]"}`}>
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* ── Booking Reminders ── */}
      <SettingsSection title="Booking Reminders" description="Set when you and clients receive appointment reminders" accent>
        <div className="space-y-3">
          {[
            { label: "24 hours before", desc: "Email + push notification", defaultOn: true },
            { label: "1 hour before", desc: "Push notification only", defaultOn: true },
            { label: "Custom reminder", desc: "Set a custom time before the appointment", defaultOn: false },
          ].map((reminder) => (
            <div key={reminder.label} className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-200">{reminder.label}</div>
                <div className="text-xs text-slate-500">{reminder.desc}</div>
              </div>
              <Toggle enabled={reminder.defaultOn} onChange={() => {}} label={reminder.label} />
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* ── Integrations ── */}
      <SettingsSection title="Other Integrations" description="Connect your favorite tools" accent>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-[var(--border)] flex items-center justify-center">
                <svg width="18" height="18" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">CRM Integration</div>
                <div className="text-xs text-slate-500">Connect Follow Up Boss, kvCORE, or other CRMs</div>
              </div>
            </div>
            <Button size="sm" variant="secondary">Connect</Button>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-[var(--border)] flex items-center justify-center text-lg">⚡</div>
              <div>
                <div className="text-sm font-medium text-slate-200">Zapier / Make</div>
                <div className="text-xs text-slate-500">Custom automations via webhooks</div>
              </div>
            </div>
            <Button size="sm" variant="secondary">Connect</Button>
          </div>
        </div>
      </SettingsSection>

      {/* ── Subscription ── */}
      <SettingsSection title="Subscription & Billing" description="Your current plan and usage" accent>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2"><h3 className="text-sm font-semibold text-emerald-400">Pro Plan</h3><Badge variant="success">Active</Badge></div>
              <p className="text-xs text-slate-500 mt-0.5">Includes marketplace presence, unlimited journeys, and booking management</p>
            </div>
            <div className="text-right"><div className="text-2xl font-bold text-slate-100">$0</div><div className="text-xs text-slate-500">/ month</div></div>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Active Journeys</span><span className="text-slate-200 font-medium">12 / Unlimited</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Referrals This Month</span><span className="text-slate-200 font-medium">8</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Profile Views (30d)</span><span className="text-slate-200 font-medium">147</span></div>
        </div>
      </SettingsSection>

      {/* ── Notifications ── */}
      <SettingsSection title="Notification Preferences" description="Choose how and when you want to hear from us">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Channels</h3>
          <div className="space-y-3">
            {([["email", "Email", "Receive email notifications"], ["sms", "SMS", "Text message alerts"], ["push", "Push Notifications", "Browser and mobile push"], ["inApp", "In-App", "Notifications inside Relays"]] as const).map(([key, label, desc]) => (
              <div key={key} className="flex items-center justify-between">
                <div><div className="text-sm text-slate-200">{label}</div><div className="text-xs text-slate-500">{desc}</div></div>
                <Toggle enabled={channels[key]} onChange={(v) => setChannels((prev) => ({ ...prev, [key]: v }))} label={label} />
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Types</h3>
          <div className="space-y-3">
            {([["newRequests", "New Requests", "Incoming referral and booking requests"], ["journeyUpdates", "Journey Updates", "Status changes on your active journeys"], ["bookings", "Bookings", "Appointment confirmations and reminders"], ["messages", "Messages", "New messages from clients"], ["documents", "Documents", "Document requests and uploads"]] as const).map(([key, label, desc]) => (
              <div key={key} className="flex items-center justify-between">
                <div><div className="text-sm text-slate-200">{label}</div><div className="text-xs text-slate-500">{desc}</div></div>
                <Toggle enabled={types[key as keyof typeof types]} onChange={(v) => setTypes((prev) => ({ ...prev, [key]: v }))} label={label} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Frequency</h3>
          <div className="flex gap-2">
            {([["realtime", "Real-time"], ["daily", "Daily Digest"], ["weekly", "Weekly Digest"]] as const).map(([val, label]) => (
              <button key={val} onClick={() => setFrequency(val)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all border ${frequency === val ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "bg-[var(--bg-card)] text-slate-400 border-[var(--border)] hover:border-[var(--border-hover)]"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </SettingsSection>

      {/* ── Privacy ── */}
      <SettingsSection title="Privacy" description="Control who can see your information">
        <div className="space-y-5">
          <div>
            <h3 className="text-sm text-slate-200 mb-2">Profile Visibility</h3>
            <div className="flex gap-2">
              {([["public", "Public"], ["team-only", "Clients Only"], ["private", "Private"]] as const).map(([val, label]) => (
                <button key={val} onClick={() => setProfileVisibility(val)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all border ${profileVisibility === val ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "bg-[var(--bg-card)] text-slate-400 border-[var(--border)] hover:border-[var(--border-hover)]"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div><div className="text-sm text-slate-200">Data Sharing</div><div className="text-xs text-slate-500">Allow Relays to use anonymized data to improve recommendations</div></div>
            <Toggle enabled={dataSharing} onChange={setDataSharing} label="Data sharing" />
          </div>
        </div>
      </SettingsSection>

      {/* ── Danger Zone ── */}
      <Card padding="lg" className="border-red-500/10 bg-red-500/[0.02]">
        <h2 className="text-sm font-semibold text-red-400 mb-1">Danger Zone</h2>
        <p className="text-xs text-slate-500 mb-4">Permanently delete your professional account and all associated data.</p>
        <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>Delete Account</Button>
      </Card>

      {/* Calendar connect modal */}
      <Modal open={!!connectModal} title={connectStep === "success" ? "Connected!" : `Connect ${CALENDAR_PROVIDERS.find((p) => p.id === connectModal)?.name ?? "Calendar"}`} onClose={() => { setConnectModal(null); setConnectStep("auth"); }}>
        {connectStep === "auth" ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-white/[0.03] border border-[var(--border)] p-4 text-center">
              <div className="h-12 w-12 rounded-xl bg-white/5 border border-[var(--border)] flex items-center justify-center mx-auto mb-3">
                {CALENDAR_PROVIDERS.find((p) => p.id === connectModal)?.icon}
              </div>
              <p className="text-sm text-slate-300">You&apos;ll be redirected to authorize access to your calendar.</p>
              <p className="text-xs text-slate-500 mt-1">We only read free/busy data and create booking events.</p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => { setConnectModal(null); setConnectStep("auth"); }}>Cancel</Button>
              <Button onClick={handleConnect}>Authorize Access</Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <svg width="28" height="28" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <p className="text-sm text-emerald-400 font-medium">Calendar connected successfully!</p>
            <p className="text-xs text-slate-500 mt-1">Your availability will sync automatically.</p>
          </div>
        )}
      </Modal>

      {/* Delete modal */}
      <Modal open={showDeleteModal} title="Delete Account" onClose={() => setShowDeleteModal(false)}>
        <div className="space-y-4">
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
            <p className="text-sm text-red-400 font-medium">⚠️ This action is permanent</p>
            <p className="text-xs text-slate-400 mt-1">Your profile, all active journeys, partner connections, and client data will be permanently deleted.</p>
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Type <span className="font-mono text-red-400">DELETE</span> to confirm</label>
            <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-slate-200 outline-none" placeholder="DELETE" />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }}>Cancel</Button>
            <Button variant="danger" disabled={deleteConfirmText !== "DELETE"}>Delete My Account</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}