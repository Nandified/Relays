"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  getProBySlug,
  generateAvailabilitySlots,
  getDateAvailability,
  getBookingDuration,
  getBookingTypeLabel,
} from "@/lib/mock-data";
import type { BookingType, AvailabilitySlot } from "@/lib/types";

function getNextDays(count: number) {
  const days: { date: string; label: string; dayName: string; monthLabel: string; dayNum: number }[] = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      monthLabel: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      dayNum: d.getDate(),
    });
  }
  return days;
}

function formatDate(date: string) {
  return new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

const SERVICE_TYPES: { type: BookingType; label: string; icon: string; description: string; duration: string }[] = [
  { type: "inspection", label: "Home Inspection", icon: "🔍", description: "Full property inspection with detailed report", duration: "2 hours" },
  { type: "consultation", label: "Consultation", icon: "💬", description: "One-on-one meeting to discuss your needs", duration: "30–60 min" },
  { type: "closing", label: "Closing", icon: "🏠", description: "Final closing meeting and document signing", duration: "1.5 hours" },
  { type: "walkthrough", label: "Walkthrough", icon: "🚶", description: "Pre-closing property walkthrough", duration: "1 hour" },
  { type: "general", label: "General Meeting", icon: "📋", description: "General consultation or follow-up", duration: "1 hour" },
];

type Step = "service" | "date" | "time" | "details" | "confirm";
const STEPS: Step[] = ["service", "date", "time", "details", "confirm"];
const STEP_LABELS: Record<Step, string> = { service: "Service", date: "Date", time: "Times", details: "Details", confirm: "Confirm" };

function WindowPill({ window: w, rank, onRemove }: { window: { id: string; date: string; startTime: string; endTime: string }; rank: number; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/[0.08] px-3 py-2 group transition-all hover:border-blue-500/30">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-400">{rank}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-blue-300">{formatDate(w.date)}</div>
        <div className="text-[11px] text-blue-400/70">{formatTime(w.startTime)} – {formatTime(w.endTime)}</div>
      </div>
      <button onClick={onRemove} className="rounded-full p-0.5 text-blue-500/50 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
    </div>
  );
}

function SuccessCheck() {
  return (
    <div className="flex flex-col items-center justify-center py-8 animate-in">
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <svg width="40" height="40" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div className="absolute inset-0 rounded-full animate-ping bg-emerald-500/5" style={{ animationDuration: "2s" }} />
      </div>
      <h2 className="text-xl font-bold text-slate-100 mb-2">Booking Request Sent!</h2>
      <p className="text-sm text-slate-400 text-center max-w-sm">Your request has been sent. You&apos;ll receive a confirmation once the professional reviews your preferred times.</p>
    </div>
  );
}

export default function BookingPage() {
  const params = useParams<{ proSlug: string }>();
  const pro = getProBySlug(params.proSlug);
  const [step, setStep] = React.useState<Step>("service");
  const [serviceType, setServiceType] = React.useState<BookingType | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedWindows, setSelectedWindows] = React.useState<{ id: string; date: string; startTime: string; endTime: string; duration: number }[]>([]);
  const [propertyAddress, setPropertyAddress] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [contactName, setContactName] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [availableSlots, setAvailableSlots] = React.useState<AvailabilitySlot[]>([]);

  if (!pro) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-slate-100">Professional not found</h1>
        <Link href="/marketplace" className="mt-4 inline-block text-sm text-blue-400 hover:underline">← Back to Marketplace</Link>
      </main>
    );
  }

  const days = getNextDays(28);
  const currentStepIndex = STEPS.indexOf(step);
  const duration = serviceType ? getBookingDuration(serviceType) : 60;
  const monthGroups = days.reduce<Record<string, typeof days>>((acc, day) => { if (!acc[day.monthLabel]) acc[day.monthLabel] = []; acc[day.monthLabel].push(day); return acc; }, {});

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setAvailableSlots(generateAvailabilitySlots(pro.id, date));
    setStep("time");
  };

  const handleWindowToggle = (slot: AvailabilitySlot) => {
    if (!slot.available) return;
    const windowId = `sw_${slot.date}_${slot.startTime}`;
    const exists = selectedWindows.find((w) => w.id === windowId);
    if (exists) { setSelectedWindows((prev) => prev.filter((w) => w.id !== windowId)); return; }
    if (selectedWindows.length >= 3) return;
    const [h, m] = slot.startTime.split(":").map(Number);
    const endMinutes = h * 60 + m + duration;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
    setSelectedWindows((prev) => [...prev, { id: windowId, date: slot.date, startTime: slot.startTime, endTime, duration }]);
  };

  const goToStep = (s: Step) => { if (STEPS.indexOf(s) <= currentStepIndex) setStep(s); };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <Card padding="lg">
          <SuccessCheck />
          <div className="flex flex-col gap-3 mt-6">
            <Link href="/dashboard"><Button className="w-full">Go to Dashboard</Button></Link>
            <Link href={`/pros/${pro.slug}`}><Button variant="secondary" className="w-full">Back to Profile</Button></Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link href={`/pros/${pro.slug}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 mb-6 transition-colors">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back to profile
      </Link>

      <h1 className="text-2xl font-bold text-slate-100 mb-2">Request Booking</h1>
      <p className="text-sm text-slate-400 mb-6">Choose a service and suggest your preferred times</p>

      {/* Pro summary */}
      <Card padding="md" className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            <Image src={pro.headshotUrl} alt={pro.name} width={48} height={48} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-100">{pro.name}</div>
            <div className="text-xs text-slate-500">{pro.companyName} • {pro.categories[0]}</div>
          </div>
          {pro.responseTimeMinutes && (
            <Badge variant="success" className="text-[10px]">⚡ {pro.responseTimeMinutes < 60 ? `${pro.responseTimeMinutes}min` : `${Math.round(pro.responseTimeMinutes / 60)}hr`} response</Badge>
          )}
        </div>
      </Card>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <button onClick={() => goToStep(s)} disabled={i > currentStepIndex} className="flex items-center gap-1.5 flex-shrink-0">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${step === s ? "bg-[var(--accent)] text-white shadow-[0_0_12px_rgba(59,130,246,0.35)]" : i < currentStepIndex ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-600"}`}>
                {i < currentStepIndex ? <svg width="12" height="12" fill="white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg> : i + 1}
              </div>
              <span className={`text-xs transition-colors hidden sm:inline ${step === s ? "text-blue-400 font-medium" : i < currentStepIndex ? "text-emerald-400" : "text-slate-600"}`}>{STEP_LABELS[s]}</span>
            </button>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px min-w-[16px] ${i < currentStepIndex ? "bg-emerald-500/40" : "bg-[var(--border)]"}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Selected windows pills */}
      {selectedWindows.length > 0 && step === "time" && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Selected times ({selectedWindows.length}/3)</span>
            {selectedWindows.length >= 2 && <Badge variant="success" className="text-[10px]">✓ Minimum met</Badge>}
          </div>
          {selectedWindows.map((w, i) => (
            <WindowPill key={w.id} window={w} rank={i + 1} onRemove={() => setSelectedWindows((prev) => prev.filter((pw) => pw.id !== w.id))} />
          ))}
        </div>
      )}

      {/* Step 1: Service Type */}
      {step === "service" && (
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-slate-200 mb-1">What do you need?</h2>
          <p className="text-xs text-slate-500 mb-4">Select the type of service</p>
          <div className="space-y-2">
            {SERVICE_TYPES.map((st) => (
              <button key={st.type} onClick={() => { setServiceType(st.type); setStep("date"); }}
                className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all group ${serviceType === st.type ? "border-[var(--accent)]/40 bg-[var(--accent-light)]" : "border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-white/[0.02]"}`}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 border border-[var(--border)] text-lg">{st.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-200">{st.label}</div>
                  <div className="text-xs text-slate-500">{st.description}</div>
                </div>
                <Badge variant="outline" className="text-[10px] flex-shrink-0">{st.duration}</Badge>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Step 2: Date Picker */}
      {step === "date" && (
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">Pick a Date</h2>
              <p className="text-xs text-slate-500 mt-0.5">{serviceType && getBookingTypeLabel(serviceType)} • {duration >= 120 ? "2 hour hold" : `${duration} min`}</p>
            </div>
            <button onClick={() => setStep("service")} className="text-xs text-blue-400 hover:underline">Change service</button>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" /><span className="text-[10px] text-slate-500">Available</span></div>
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-amber-500/40" /><span className="text-[10px] text-slate-500">Limited</span></div>
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-slate-600/40" /><span className="text-[10px] text-slate-500">Unavailable</span></div>
          </div>
          {Object.entries(monthGroups).map(([month, monthDays]) => (
            <div key={month} className="mb-5 last:mb-0">
              <h3 className="text-xs font-medium text-slate-500 mb-2">{month}</h3>
              <div className="grid grid-cols-7 gap-1.5">
                {monthDays.map((day) => {
                  const availability = getDateAvailability(pro.id, day.date);
                  const isUnavailable = availability === "unavailable";
                  const isBusy = availability === "busy";
                  return (
                    <button key={day.date} onClick={() => !isUnavailable && handleDateSelect(day.date)} disabled={isUnavailable}
                      className={`rounded-xl border p-2 text-center transition-all ${isUnavailable ? "border-transparent bg-white/[0.01] text-slate-700 cursor-not-allowed" : selectedDate === day.date ? "border-[var(--accent)]/40 bg-[var(--accent-light)] text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.2)]" : isBusy ? "border-[var(--border)] bg-amber-500/[0.04] text-slate-400 hover:border-amber-500/20" : "border-[var(--border)] text-slate-300 hover:border-emerald-500/30 hover:bg-emerald-500/[0.04] hover:shadow-[0_0_8px_rgba(16,185,129,0.1)]"}`}>
                      <div className="text-[10px] text-slate-600">{day.dayName}</div>
                      <div className="text-sm font-semibold mt-0.5">{day.dayNum}</div>
                      {!isUnavailable && <div className={`mx-auto mt-1 h-1 w-1 rounded-full ${isBusy ? "bg-amber-500/50" : "bg-emerald-500/50"}`} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Step 3: Time Windows */}
      {step === "time" && selectedDate && (
        <Card padding="lg">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-slate-200">Pick Your Preferred Times</h2>
            <button onClick={() => setStep("date")} className="text-xs text-blue-400 hover:underline">Change date</button>
          </div>
          <p className="text-xs text-slate-500 mb-4">Select 2–3 preferred {duration >= 120 ? "2-hour windows" : "time slots"} — ranked by preference</p>
          <div className="rounded-xl bg-white/[0.02] border border-[var(--border)] p-3 mb-4">
            <div className="text-xs font-medium text-slate-400 mb-0.5">{formatDate(selectedDate)}</div>
            <div className="text-[10px] text-slate-600">{availableSlots.filter((s) => s.available).length} of {availableSlots.length} slots available</div>
          </div>
          {availableSlots.length === 0 ? (
            <div className="py-8 text-center">
              <div className="text-3xl mb-2">📅</div>
              <p className="text-sm text-slate-400">No available slots on this date</p>
              <button onClick={() => setStep("date")} className="mt-2 text-xs text-blue-400 hover:underline">Pick a different date</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {availableSlots.map((slot) => {
                const [h, m] = slot.startTime.split(":").map(Number);
                const em = h * 60 + m + duration;
                const endTime = `${String(Math.floor(em / 60)).padStart(2, "0")}:${String(em % 60).padStart(2, "0")}`;
                const windowId = `sw_${slot.date}_${slot.startTime}`;
                const isSelected = selectedWindows.some((w) => w.id === windowId);
                const rank = selectedWindows.findIndex((w) => w.id === windowId) + 1;
                const canSelect = slot.available && (isSelected || selectedWindows.length < 3);
                return (
                  <button key={windowId} onClick={() => canSelect && handleWindowToggle(slot)} disabled={!canSelect}
                    className={`relative rounded-xl border p-3 text-center transition-all ${!slot.available ? "border-[var(--border)] bg-white/[0.01] text-slate-700 cursor-not-allowed opacity-40" : isSelected ? "border-blue-500/30 bg-blue-500/[0.08] text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]" : !canSelect ? "border-[var(--border)] text-slate-500 cursor-not-allowed opacity-60" : "border-[var(--border)] text-slate-300 hover:border-blue-500/20 hover:bg-blue-500/[0.03]"}`}>
                    {isSelected && <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(59,130,246,0.4)]">{rank}</div>}
                    <div className="text-sm font-medium">{formatTime(slot.startTime)}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">to {formatTime(endTime)}</div>
                    {!slot.available && <div className="text-[10px] text-slate-700 mt-0.5">Unavailable</div>}
                  </button>
                );
              })}
            </div>
          )}
          <div className="mt-6 flex gap-3">
            <Button className="flex-1" disabled={selectedWindows.length < 1} onClick={() => setStep("details")}>Continue with {selectedWindows.length} time{selectedWindows.length !== 1 ? "s" : ""}</Button>
            <Button variant="ghost" onClick={() => setStep("date")}>← Back</Button>
          </div>
          {selectedWindows.length > 0 && selectedWindows.length < 2 && (
            <p className="mt-2 text-center text-[10px] text-amber-400/60">Tip: selecting 2–3 windows increases your chances of a quick confirmation</p>
          )}
        </Card>
      )}

      {/* Step 4: Details */}
      {step === "details" && (
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-slate-200 mb-1">Add Details</h2>
          <p className="text-xs text-slate-500 mb-5">Help the professional prepare for your appointment</p>
          <div className="space-y-4">
            <Input label="Property Address" placeholder="123 Main St, Chicago, IL 60614" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Your Name" placeholder="Jamie Rodriguez" value={contactName} onChange={(e) => setContactName(e.target.value)} />
              <Input label="Email" type="email" placeholder="jamie@email.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Notes</label>
              <textarea className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent-light)] min-h-[100px] resize-y" placeholder="Anything the professional should know?..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button className="flex-1" onClick={() => setStep("confirm")}>Review &amp; Confirm</Button>
            <Button variant="ghost" onClick={() => setStep("time")}>← Back</Button>
          </div>
        </Card>
      )}

      {/* Step 5: Confirmation */}
      {step === "confirm" && (
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-slate-200 mb-4">Review Your Booking Request</h2>
          <div className="rounded-xl bg-white/[0.03] border border-[var(--border)] p-4 mb-4 space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Professional</span><span className="text-slate-200 font-medium">{pro.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Service</span><span className="text-slate-200 font-medium">{serviceType && getBookingTypeLabel(serviceType)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Duration</span><span className="text-slate-200 font-medium">{duration >= 120 ? `${duration / 60} hours` : `${duration} minutes`}</span></div>
            {propertyAddress && <div className="flex justify-between text-sm"><span className="text-slate-500">Property</span><span className="text-slate-200 font-medium text-right max-w-[60%]">{propertyAddress}</span></div>}
            {contactName && <div className="flex justify-between text-sm"><span className="text-slate-500">Contact</span><span className="text-slate-200 font-medium">{contactName}</span></div>}
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Proposed Times (ranked)</h3>
            <div className="space-y-2">
              {selectedWindows.map((w, i) => (
                <div key={w.id} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-white/[0.02] p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/15 text-[10px] font-bold text-blue-400">{i + 1}</div>
                  <div><div className="text-sm text-slate-200">{formatDate(w.date)}</div><div className="text-xs text-slate-500">{formatTime(w.startTime)} – {formatTime(w.endTime)}</div></div>
                </div>
              ))}
            </div>
          </div>

          {notes && (
            <div className="mb-4 rounded-xl bg-white/[0.02] border border-[var(--border)] p-3">
              <div className="text-xs text-slate-500 mb-1">Notes</div>
              <div className="text-sm text-slate-300">{notes}</div>
            </div>
          )}

          <Badge variant="accent" className="mb-4">This is a hold request — {pro.name} will confirm or suggest alternatives</Badge>

          <div className="flex gap-3">
            <Button className="flex-1" onClick={() => setSubmitted(true)}>Submit Booking Request</Button>
            <Button variant="secondary" onClick={() => setStep("details")}>← Edit</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
