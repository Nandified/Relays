"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { mockPros, getProById } from "@/lib/mock-data";
import {
  type ProServiceCategory,
  type JourneyPropertyType,
  JOURNEY_ROLE_CATEGORIES,
} from "@/lib/types";

const STEPS = [
  { id: 1, label: "Property", icon: "🏠" },
  { id: 2, label: "Client", icon: "👤" },
  { id: 3, label: "Team", icon: "👥" },
  { id: 4, label: "Review", icon: "✨" },
];

const roleMeta: Record<string, { icon: string }> = {
  Realtor: { icon: "🏠" },
  "Mortgage Lender": { icon: "💰" },
  Attorney: { icon: "⚖️" },
  "Home Inspector": { icon: "🔍" },
  "Insurance Agent": { icon: "🛡️" },
};

interface FormData {
  address: string;
  propertyType: JourneyPropertyType;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  recommendations: Record<string, string[]>;
}

export default function NewJourneyPage() {
  const [step, setStep] = React.useState(1);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [form, setForm] = React.useState<FormData>({
    address: "",
    propertyType: "buying",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    recommendations: {},
  });

  const currentPro = getProById("pro_9")!;
  const currentProCategory = currentPro.categories[0];
  const recommendableCategories = JOURNEY_ROLE_CATEGORIES.filter(
    (cat) => cat !== currentProCategory
  );

  function canProceed(): boolean {
    switch (step) {
      case 1: return form.address.trim().length >= 5;
      case 2: return form.clientName.trim().length >= 2 && form.clientEmail.includes("@") && form.clientPhone.trim().length >= 7;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  }

  function handleNext() {
    if (step < 4) setStep(step + 1);
    else setShowSuccess(true);
  }

  function toggleRecommendation(category: string, proId: string) {
    setForm((prev) => {
      const current = prev.recommendations[category] || [];
      let updated: string[];
      if (current.includes(proId)) {
        updated = current.filter((id) => id !== proId);
      } else if (current.length < 3) {
        updated = [...current, proId];
      } else {
        return prev;
      }
      return { ...prev, recommendations: { ...prev.recommendations, [category]: updated } };
    });
  }

  const totalRecommended = Object.values(form.recommendations).reduce((s, a) => s + a.length, 0);

  if (showSuccess) {
    const slug = form.address.split(",")[0]?.trim().toLowerCase().replace(/\s+/g, "-").slice(0, 20) || "new";
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
          <svg width="40" height="40" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Journey created!</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
          A link has been sent to <span className="text-slate-800 dark:text-slate-200">{form.clientName}</span> at{" "}
          <span className="text-slate-800 dark:text-slate-200">{form.clientEmail}</span>. They&apos;ll see your
          recommendations and can start building their team.
        </p>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 mb-6 max-w-sm mx-auto">
          <div className="text-xs text-slate-500 mb-1">Share link</div>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-xl bg-[var(--bg-elevated)] px-3 py-2 text-xs text-blue-400">
              relays.co/journey/j-{slug}
            </code>
            <Button size="sm" variant="secondary">Copy</Button>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/pro/journeys"><Button variant="secondary">View All Journeys</Button></Link>
          <Link href="/pro/journey/new"><Button>Create Another</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-20">
      {/* Header */}
      <div className="mb-8">
        <Link href="/pro/dashboard" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mb-4">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create a Journey</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Set up your client&apos;s home journey with recommended pros for every step.</p>
      </div>

      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <button
                onClick={() => s.id < step ? setStep(s.id) : undefined}
                className={`flex flex-col items-center gap-1.5 transition-all ${s.id <= step ? "opacity-100" : "opacity-40"} ${s.id < step ? "cursor-pointer" : ""}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm transition-all duration-300 ${
                  s.id === step
                    ? "bg-[var(--accent)] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-110"
                    : s.id < step
                    ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                    : "bg-black/5 dark:bg-white/5 border border-[var(--border)] text-slate-500"
                }`}>
                  {s.id < step ? (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  ) : s.icon}
                </div>
                <span className={`text-[11px] font-medium ${s.id === step ? "text-blue-400" : "text-slate-500"}`}>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 mt-[-18px] transition-colors duration-500 ${s.id < step ? "bg-emerald-500/30" : "bg-[var(--border)]"}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="animate-in">
        {step === 1 && <StepProperty form={form} onChange={(u) => setForm((p) => ({ ...p, ...u }))} />}
        {step === 2 && <StepClient form={form} onChange={(u) => setForm((p) => ({ ...p, ...u }))} />}
        {step === 3 && (
          <StepRecommendations
            form={form}
            categories={recommendableCategories}
            currentProCategory={currentProCategory}
            onToggle={toggleRecommendation}
          />
        )}
        {step === 4 && <StepReview form={form} currentPro={currentPro} totalRecommended={totalRecommended} />}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          {step > 1 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1"><path d="M15 19l-7-7 7-7" /></svg>
              Back
            </Button>
          )}
        </div>
        <Button onClick={handleNext} disabled={!canProceed()}>
          {step === 4 ? (
            <>Send to Client<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="ml-1"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg></>
          ) : (
            <>Continue<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="ml-1"><path d="M9 5l7 7-7 7" /></svg></>
          )}
        </Button>
      </div>
    </div>
  );
}

/* ── Step 1: Property ──────────────────────────────────────── */
function StepProperty({ form, onChange }: { form: FormData; onChange: (u: Partial<FormData>) => void }) {
  return (
    <Card padding="lg" className="liquid-glass">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-lg">🏠</div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Property Details</h2>
          <p className="text-xs text-slate-500">Where is your client&apos;s transaction?</p>
        </div>
      </div>
      <div className="space-y-4">
        <Input label="Property Address" placeholder="e.g. 742 Maple Ave, Oak Park, IL 60302" value={form.address} onChange={(e) => onChange({ address: e.target.value })} />
        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Transaction Type</span>
          <div className="grid grid-cols-2 gap-3">
            {(["buying", "selling"] as const).map((type) => (
              <button
                key={type}
                onClick={() => onChange({ propertyType: type })}
                className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                  form.propertyType === type
                    ? "border-[var(--accent)]/40 bg-[var(--accent-light)] ring-1 ring-[var(--accent)]/20 shadow-[var(--glow-accent)]"
                    : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-hover)]"
                }`}
              >
                <div className="text-xl mb-1">{type === "buying" ? "🏠" : "📤"}</div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 capitalize">{type}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{type === "buying" ? "Client is purchasing a home" : "Client is selling their home"}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ── Step 2: Client ────────────────────────────────────────── */
function StepClient({ form, onChange }: { form: FormData; onChange: (u: Partial<FormData>) => void }) {
  return (
    <Card padding="lg" className="liquid-glass">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-lg">👤</div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Client Information</h2>
          <p className="text-xs text-slate-500">Who is this journey for?</p>
        </div>
      </div>
      <div className="space-y-4">
        <Input label="Full Name" placeholder="e.g. Jamie Rodriguez" value={form.clientName} onChange={(e) => onChange({ clientName: e.target.value })} />
        <Input label="Email Address" type="email" placeholder="e.g. jamie.r@email.com" value={form.clientEmail} onChange={(e) => onChange({ clientEmail: e.target.value })} />
        <Input label="Phone Number" type="tel" placeholder="e.g. (312) 555-0142" value={form.clientPhone} onChange={(e) => onChange({ clientPhone: e.target.value })} />
      </div>
      <div className="mt-5 rounded-xl bg-blue-500/[0.04] border border-blue-500/10 p-3">
        <div className="flex items-start gap-2">
          <svg width="14" height="14" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5 flex-shrink-0"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Your client will receive a link to view their journey and select pros from your recommendations.</p>
        </div>
      </div>
    </Card>
  );
}

/* ── Step 3: Recommendations ─────────────────────────────────── */
function StepRecommendations({
  form, categories, currentProCategory, onToggle,
}: {
  form: FormData;
  categories: ProServiceCategory[];
  currentProCategory: ProServiceCategory;
  onToggle: (cat: string, proId: string) => void;
}) {
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(categories[0] || null);

  return (
    <div className="space-y-4">
      <Card padding="md" className="border-emerald-500/15 bg-emerald-500/[0.02]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <svg width="16" height="16" fill="#10b981" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-emerald-400">{currentProCategory}</div>
            <div className="text-xs text-slate-500">Auto-filled — that&apos;s you!</div>
          </div>
          <Badge variant="success" className="ml-auto">Filled</Badge>
        </div>
      </Card>

      {categories.map((category) => {
        const selected = form.recommendations[category] || [];
        const availablePros = mockPros.filter((p) => p.categories.includes(category));
        const isExpanded = expandedCategory === category;
        const meta = roleMeta[category];

        return (
          <Card key={category} padding="none" className="overflow-hidden">
            <button
              onClick={() => setExpandedCategory(isExpanded ? null : category)}
              className="flex w-full items-center justify-between p-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border)] text-sm">{meta.icon}</div>
                <div className="text-left">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{category}</div>
                  <div className="text-[11px] text-slate-500">{selected.length === 0 ? "Pick up to 3 to recommend" : `${selected.length} selected`}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selected.length > 0 && (
                  <div className="flex -space-x-1">
                    {selected.map((id) => {
                      const pro = getProById(id);
                      if (!pro) return null;
                      return (
                        <div key={id} className="h-6 w-6 overflow-hidden rounded-full border-2 border-[var(--bg-card)] bg-[var(--bg-elevated)]">
                          <Image src={pro.headshotUrl} alt={pro.name} width={24} height={24} />
                        </div>
                      );
                    })}
                  </div>
                )}
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`text-slate-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-[var(--border)] p-4 animate-in">
                <div className="grid gap-2">
                  {availablePros.map((pro) => {
                    const isSelected = selected.includes(pro.id);
                    return (
                      <button
                        key={pro.id}
                        onClick={() => onToggle(category, pro.id)}
                        disabled={!isSelected && selected.length >= 3}
                        className={`flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 ${
                          isSelected
                            ? "bg-[var(--accent-light)] border border-blue-500/20 ring-1 ring-blue-500/10"
                            : "border border-transparent hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
                        } ${!isSelected && selected.length >= 3 ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        <div className="relative flex-shrink-0">
                          <div className="h-10 w-10 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                            <Image src={pro.headshotUrl} alt={pro.name} width={40} height={40} />
                          </div>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                              <svg width="8" height="8" fill="white" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{pro.name}</span>
                            {pro.verified && (
                              <svg width="12" height="12" fill="#3b82f6" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                              </svg>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{pro.companyName}</div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0">
                          <svg width="10" height="10" fill="#f59e0b" viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" /></svg>
                          {pro.rating.toFixed(1)} ({pro.reviewCount})
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selected.length >= 3 && (
                  <p className="mt-2 text-center text-[11px] text-slate-500">Maximum 3 recommendations per category</p>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

/* ── Step 4: Review ──────────────────────────────────────────── */
function StepReview({
  form, currentPro, totalRecommended,
}: {
  form: FormData;
  currentPro: (typeof mockPros)[number];
  totalRecommended: number;
}) {
  const currentProCategory = currentPro.categories[0];

  return (
    <div className="space-y-4">
      <Card padding="lg" className="liquid-glass">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-lg">✨</div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Review &amp; Send</h2>
            <p className="text-xs text-slate-500">Everything look good? Let&apos;s send it to your client.</p>
          </div>
        </div>

        {/* Property */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {form.propertyType === "buying" ? "Buying" : "Selling"}
          </div>
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{form.address || "No address entered"}</div>
        </div>

        {/* Client */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 mb-4">
          <div className="text-xs text-slate-500 mb-1">Client</div>
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{form.clientName || "—"}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{form.clientEmail} • {form.clientPhone}</div>
        </div>

        {/* Team */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
          <div className="text-xs text-slate-500 mb-3">Team</div>
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[var(--border)]">
            <div className="h-8 w-8 overflow-hidden rounded-lg border border-emerald-500/20 bg-[var(--bg-elevated)]">
              <Image src={currentPro.headshotUrl} alt={currentPro.name} width={32} height={32} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm text-slate-800 dark:text-slate-200">{currentPro.name}</span>
              <span className="text-xs text-slate-500 ml-1">({currentProCategory})</span>
            </div>
            <Badge variant="success" className="text-[10px]">You</Badge>
          </div>

          {JOURNEY_ROLE_CATEGORIES.filter((c) => c !== currentProCategory).map((category) => {
            const selected = form.recommendations[category] || [];
            return (
              <div key={category} className="flex items-center justify-between py-1.5">
                <span className="text-xs text-slate-500 dark:text-slate-400">{category}</span>
                {selected.length > 0 ? (
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-1">
                      {selected.map((id) => {
                        const pro = getProById(id);
                        if (!pro) return null;
                        return (
                          <div key={id} className="h-5 w-5 overflow-hidden rounded-full border border-[var(--bg-card)] bg-[var(--bg-elevated)]">
                            <Image src={pro.headshotUrl} alt={pro.name} width={20} height={20} />
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-[11px] text-blue-400">{selected.length} rec&apos;d</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500 dark:text-slate-600">No recommendations</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="rounded-xl bg-blue-500/[0.04] border border-blue-500/10 p-4 text-center">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {totalRecommended > 0
            ? `${totalRecommended} total recommendation${totalRecommended !== 1 ? "s" : ""} across ${Object.values(form.recommendations).filter((a) => a.length > 0).length} categories`
            : "No recommendations yet — your client will need to find pros on their own"}
        </p>
      </div>
    </div>
  );
}
