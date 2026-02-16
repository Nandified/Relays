"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StageTimeline } from "@/components/journey/StageTimeline";
import { HeroMomentCard, UpcomingMomentCard, CompletedMomentCard } from "@/components/journey/MomentCard";
import { StageAdvancement } from "@/components/journey/StageAdvancement";
import {
  getJourneyById,
  getProById,
  getFilledRoleCount,
  getTotalRoleCount,
  mockJourneys,
} from "@/lib/mock-data";
import {
  type JourneyRole,
  type Pro,
  type JourneyStage,
  type Journey,
  JOURNEY_ROLE_CATEGORIES,
  JOURNEY_STAGES,
  JOURNEY_STAGE_LABELS,
  JOURNEY_STAGE_ICONS,
} from "@/lib/types";
import { computeMoments, advanceStage } from "@/lib/moments-engine";
import { useAuth } from "@/lib/auth/provider";
import { PostCloseBanner } from "@/components/journey/PostCloseBanner";

/* ── Role category metadata ──────────────────────────────────── */
const roleMeta: Record<string, { icon: string; color: string; colorBg: string; description: string }> = {
  Realtor: {
    icon: "🏠",
    color: "text-blue-400",
    colorBg: "bg-blue-500/10 border-blue-500/20",
    description: "Your guide through the buying or selling process",
  },
  "Mortgage Lender": {
    icon: "💰",
    color: "text-emerald-400",
    colorBg: "bg-emerald-500/10 border-emerald-500/20",
    description: "Financing your home purchase",
  },
  Attorney: {
    icon: "⚖️",
    color: "text-purple-400",
    colorBg: "bg-purple-500/10 border-purple-500/20",
    description: "Protecting your interests at closing",
  },
  "Home Inspector": {
    icon: "🔍",
    color: "text-amber-400",
    colorBg: "bg-amber-500/10 border-amber-500/20",
    description: "Know exactly what you're buying",
  },
  "Insurance Agent": {
    icon: "🛡️",
    color: "text-cyan-400",
    colorBg: "bg-cyan-500/10 border-cyan-500/20",
    description: "Protect your investment from day one",
  },
};

/* ── Progress Ring component ─────────────────────────────────── */
function ProgressRing({ filled, total, size = 80 }: { filled: number; total: number; size?: number }) {
  const progress = total === 0 ? 0 : Math.round((filled / total) * 100);
  const strokeWidth = 4;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={filled === total ? "#10b981" : "#3b82f6"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="animate-progress"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-slate-100 tabular-nums">{filled}/{total}</span>
        <span className="text-[10px] text-slate-500">filled</span>
      </div>
    </div>
  );
}

/* ── Filled Pro Card ─────────────────────────────────────────── */
function FilledProCard({ pro, category }: { pro: Pro; category: string }) {
  return (
    <div className="glow-success rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.03] p-4 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div className="h-12 w-12 overflow-hidden rounded-2xl border border-emerald-500/20 bg-[var(--bg-elevated)]">
            <Image src={pro.headshotUrl} alt={pro.name} width={48} height={48} />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30">
            <svg width="10" height="10" fill="white" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-100">{pro.name}</span>
            {pro.verified && (
              <Badge variant="success" className="text-[10px] py-0">✓ Verified</Badge>
            )}
          </div>
          <div className="text-xs text-slate-500">{pro.companyName}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-0.5 text-xs text-amber-400">
              <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
              </svg>
              {pro.rating.toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-600">{pro.reviewCount} reviews</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Badge variant="success">Your {category === "Mortgage Lender" ? "Lender" : category === "Home Inspector" ? "Inspector" : category === "Insurance Agent" ? "Insurer" : category}</Badge>
        </div>
      </div>
    </div>
  );
}

/* ── Recommended Pro Card ────────────────────────────────────── */
function RecommendedProCard({ pro }: { pro: Pro }) {
  return (
    <div className="glass-card rounded-2xl p-4 hover-lift cursor-pointer group">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <div className="h-16 w-16 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] group-hover:border-blue-500/30 transition-colors">
            <Image src={pro.headshotUrl} alt={pro.name} width={64} height={64} />
          </div>
          {pro.verified && (
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 shadow-lg shadow-blue-500/30">
              <svg width="10" height="10" fill="white" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            </div>
          )}
        </div>
        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">{pro.name}</h4>
        <p className="text-[11px] text-slate-500 mt-0.5">{pro.companyName}</p>
        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="12"
                height="12"
                fill={i < Math.round(pro.rating) ? "#f59e0b" : "rgba(255,255,255,0.08)"}
                viewBox="0 0 20 20"
              >
                <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
              </svg>
            ))}
          </div>
          <span className="text-[11px] text-slate-500 tabular-nums">({pro.reviewCount})</span>
        </div>
        <div className="flex gap-2 mt-3 w-full">
          <Button size="sm" className="flex-1 text-xs">Select</Button>
          <Link href={`/pros/${pro.slug}`} className="flex-1">
            <Button size="sm" variant="secondary" className="w-full text-xs">View</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Role Panel ──────────────────────────────────────────────── */
function RolePanel({ role, index, journeyId }: { role: JourneyRole; index: number; journeyId?: string }) {
  const meta = roleMeta[role.category];
  const assignedPro = role.assignedProId ? getProById(role.assignedProId) : null;
  const recommendedPros = role.recommendedProIds
    .map((id) => getProById(id))
    .filter(Boolean) as Pro[];

  return (
    <div
      className={`rounded-3xl border ${
        role.status === "filled"
          ? "border-emerald-500/10 bg-emerald-500/[0.02]"
          : "border-[var(--border)]"
      } p-5 sm:p-6 transition-all duration-500`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${meta.colorBg} text-lg`}>
            {meta.icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">{role.category}</h3>
            <p className="text-[11px] text-slate-500">{meta.description}</p>
          </div>
        </div>
        <div>
          {role.status === "filled" && (
            <Badge variant="success">
              <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20" className="mr-0.5">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
              Filled
            </Badge>
          )}
          {role.status === "recommended" && (
            <Badge variant="accent">
              <span className="animate-gentle-pulse">Recommended</span>
            </Badge>
          )}
          {role.status === "needed" && (
            <Badge variant="warning">Needed</Badge>
          )}
        </div>
      </div>

      {role.status === "filled" && assignedPro && (
        <FilledProCard pro={assignedPro} category={role.category} />
      )}

      {role.status === "recommended" && recommendedPros.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 mb-3">
            Recommended by your {role.category === "Realtor" ? "team" : "Realtor"} — pick the best fit
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {recommendedPros.map((pro) => (
              <RecommendedProCard key={pro.id} pro={pro} />
            ))}
          </div>
          <div className="mt-3 text-center">
            <Link
              href={`/marketplace?category=${encodeURIComponent(role.category)}`}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-400 transition-colors"
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              Find your own
            </Link>
          </div>
        </div>
      )}

      {role.status === "needed" && (
        <div className="flex flex-col items-center py-6">
          <div className="h-14 w-14 rounded-2xl border border-dashed border-[var(--border)] bg-white/[0.02] flex items-center justify-center mb-3 animate-gentle-pulse">
            <svg width="20" height="20" fill="none" stroke="#475569" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-sm text-slate-400 mb-1">No one assigned yet</p>
          <p className="text-xs text-slate-600 mb-3">Your pro will recommend someone, or find your own</p>
          <Link href={`/marketplace?category=${encodeURIComponent(role.category)}`}>
            <Button size="sm" variant="secondary">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              Browse {role.category}s
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

/* ── Stage Info Panel ────────────────────────────────────────── */
function StageInfoPanel({ stage }: { stage: JourneyStage }) {
  const stageInfo: Record<JourneyStage, { title: string; description: string; tips: string[] }> = {
    pre_approval: {
      title: "Pre-Approval",
      description: "Getting your finances in order before the search begins.",
      tips: ["Get pre-approved with a lender", "Find your realtor", "Set your budget range"],
    },
    house_hunting: {
      title: "House Hunting",
      description: "The exciting part — finding your perfect home.",
      tips: ["Tour homes with your realtor", "Research neighborhoods", "Keep notes on favorites"],
    },
    offer_made: {
      title: "Offer Made",
      description: "You've found the one! Now to secure it.",
      tips: ["Engage an attorney for contract review", "Be ready for counter-offers", "Stay patient"],
    },
    offer_accepted: {
      title: "Offer Accepted",
      description: "Congratulations! Now the real work begins.",
      tips: ["Schedule home inspection within 10 days", "Start insurance quotes", "Begin document gathering"],
    },
    under_contract: {
      title: "Under Contract",
      description: "You're locked in. Time to complete due diligence.",
      tips: ["Get homeowner's insurance quotes", "Complete attorney review", "Prepare for appraisal"],
    },
    inspection: {
      title: "Inspection",
      description: "Understanding exactly what you're buying.",
      tips: ["Attend the inspection if possible", "Review the report carefully", "Negotiate repairs if needed"],
    },
    appraisal: {
      title: "Appraisal",
      description: "The lender confirms the property value.",
      tips: ["Wait for appraisal results", "Be prepared for adjustments", "Keep your finances stable"],
    },
    closing_scheduled: {
      title: "Closing Scheduled",
      description: "The finish line is in sight!",
      tips: ["Confirm your attorney for closing", "Do final walk-through", "Arrange movers and utilities"],
    },
    closed: {
      title: "Closed!",
      description: "Welcome home! The keys are yours.",
      tips: ["Move in and celebrate!", "Set up utilities", "Consider a home warranty"],
    },
    post_close: {
      title: "Post-Close",
      description: "Settling in and making it your own.",
      tips: ["Find a handyman for repairs", "Review insurance coverage", "Leave reviews for your team"],
    },
  };

  const info = stageInfo[stage];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm p-5 animate-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{JOURNEY_STAGE_ICONS[stage]}</span>
        <h3 className="text-sm font-semibold text-slate-200">{info.title}</h3>
      </div>
      <p className="text-xs text-slate-400 mb-3">{info.description}</p>
      <div className="space-y-1.5">
        {info.tips.map((tip, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
            <div className="h-1 w-1 rounded-full bg-blue-400/60 flex-shrink-0" />
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────── */
export default function JourneyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state: authState } = useAuth();
  const isPro = authState.status === "authed" && authState.user.role === "pro";

  // Use local state for journey so stage advancement works in demo
  const initialJourney = getJourneyById(id);
  const [journey, setJourney] = useState<Journey | undefined>(initialJourney);
  const [selectedStage, setSelectedStage] = useState<JourneyStage | null>(null);

  const currentUserId = authState.status === "authed" ? authState.user.id : "pro_9";

  const handleAdvanceStage = useCallback((j: Journey) => {
    const updated = advanceStage(j, currentUserId);
    setJourney(updated);
  }, [currentUserId]);

  const handleSetStage = useCallback((j: Journey, stage: JourneyStage) => {
    const now = new Date().toISOString();
    setJourney({
      ...j,
      stage,
      status: stage === "closed" || stage === "post_close" ? "completed" : "active",
      auditTrail: [
        ...j.auditTrail,
        {
          id: `audit_${j.id}_${Date.now()}`,
          journeyId: j.id,
          timestamp: now,
          actor: "pro",
          actorId: currentUserId,
          type: "stage_change",
          fromStage: j.stage,
          toStage: stage,
          description: `Stage set to ${JOURNEY_STAGE_LABELS[stage]}`,
        },
      ],
    });
  }, [currentUserId]);

  if (!journey) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h1 className="text-xl font-semibold text-slate-100 mb-1">Journey not found</h1>
          <p className="text-sm text-slate-500">This link may be expired or invalid.</p>
          <Link href="/dashboard">
            <Button className="mt-4">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const filledCount = getFilledRoleCount(journey);
  const totalCount = getTotalRoleCount();
  const createdByPro = getProById(journey.createdByProId);
  const allFilled = filledCount === totalCount;
  const moments = computeMoments(journey);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-20">
      {/* Stage Timeline */}
      <div className="mb-6 rounded-3xl border border-[var(--border)] liquid-glass p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-blue-400">
              <path d="M9 5l7 7-7 7" />
            </svg>
            Journey Progress
          </h2>
          <Badge variant="accent" className="text-[10px]">
            {JOURNEY_STAGE_ICONS[journey.stage]} {JOURNEY_STAGE_LABELS[journey.stage]}
          </Badge>
        </div>
        <StageTimeline
          currentStage={journey.stage}
          onStageClick={(stage) => setSelectedStage(stage === selectedStage ? null : stage)}
        />
        {/* Stage info panel on click */}
        {selectedStage && (
          <div className="mt-5 pt-4 border-t border-[var(--border)]">
            <StageInfoPanel stage={selectedStage} />
          </div>
        )}
      </div>

      {/* Property Hero */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-[var(--border)] liquid-glass">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500/8 blur-3xl" />
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={journey.property.type === "buying" ? "accent" : "success"}>
              {journey.property.type === "buying" ? "🏠 Buying" : "📤 Selling"}
            </Badge>
            {allFilled && (
              <Badge variant="success">✨ Team Complete</Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
            {journey.title}
          </h1>
          <p className="text-sm text-slate-400 flex items-center gap-1.5">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="flex-shrink-0">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {journey.property.address}
          </p>

          <div className="flex items-center justify-between mt-6 pt-5 border-t border-[var(--border)]">
            <div className="flex items-center gap-4">
              <ProgressRing filled={filledCount} total={totalCount} size={64} />
              <div>
                <div className="text-sm font-medium text-slate-200">
                  {allFilled ? "Your team is complete!" : `${filledCount} of ${totalCount} roles filled`}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {allFilled
                    ? "You're ready for every step of your journey"
                    : `${totalCount - filledCount} more to go — you're making great progress`}
                </div>
              </div>
            </div>
            {createdByPro && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                <div className="h-7 w-7 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
                  <Image src={createdByPro.headshotUrl} alt={createdByPro.name} width={28} height={28} />
                </div>
                <span>Created by <span className="text-slate-300">{createdByPro.name}</span></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* What's Next Moments Section */}
      {moments.active.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg width="14" height="14" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            What&apos;s Next
          </h2>
          <div className="space-y-3">
            {moments.active.map((moment) => (
              <HeroMomentCard key={moment.id} moment={moment} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Moments */}
      {moments.upcoming.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-600">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Coming Up
          </h2>
          <div className="space-y-2">
            {moments.upcoming.map((moment) => (
              <UpcomingMomentCard key={moment.id} moment={moment} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Moments */}
      {moments.completed.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg width="12" height="12" fill="#10b981" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            Completed
          </h2>
          <div className="space-y-2">
            {moments.completed.map((moment) => (
              <CompletedMomentCard key={moment.id} moment={moment} />
            ))}
          </div>
        </div>
      )}

      {/* Post-Close Section */}
      {(journey.stage === "closed" || journey.stage === "post_close") && (
        <div className="mb-8">
          <PostCloseBanner clientName={journey.client.name.split(" ")[0]} />
        </div>
      )}

      {/* Pro: Stage Advancement Controls */}
      {isPro && (
        <div className="mb-8">
          <StageAdvancement
            journey={journey}
            onAdvanceStage={handleAdvanceStage}
            onSetStage={handleSetStage}
          />
        </div>
      )}

      {/* Role panels */}
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Your Team</h2>
      <div className="space-y-4 stagger-children">
        {JOURNEY_ROLE_CATEGORIES.map((cat, i) => {
          const role = journey.roles.find((r) => r.category === cat);
          if (!role) return null;
          return <RolePanel key={cat} role={role} index={i} />;
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-600 mb-3">
          Need help? Your {createdByPro?.categories[0] || "pro"} is just a message away.
        </p>
        {createdByPro && (
          <Link href={`/messages/conv_1`}>
            <Button variant="secondary" size="sm">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mr-1.5">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Message {createdByPro.name}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}