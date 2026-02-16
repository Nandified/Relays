"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  getJourneyById,
  getProById,
  getFilledRoleCount,
  getTotalRoleCount,
} from "@/lib/mock-data";
import { type JourneyRole, type Pro, JOURNEY_ROLE_CATEGORIES } from "@/lib/types";

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
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
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
        {/* Checkmark */}
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
        {/* Photo */}
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
        {/* Info */}
        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">{pro.name}</h4>
        <p className="text-[11px] text-slate-500 mt-0.5">{pro.companyName}</p>
        {/* Rating */}
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
        {/* CTA */}
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
function RolePanel({ role, index }: { role: JourneyRole; index: number }) {
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
      {/* Role header */}
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

      {/* Filled state: single pro card */}
      {role.status === "filled" && assignedPro && (
        <FilledProCard pro={assignedPro} category={role.category} />
      )}

      {/* Recommended state: up to 3 cards */}
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

      {/* Needed state: empty slot */}
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

/* ── Main Page ───────────────────────────────────────────────── */
export default function JourneyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const journey = getJourneyById(id);

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-20">
      {/* Property Hero */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-[var(--border)] liquid-glass">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500/8 blur-3xl" />
        </div>

        <div className="relative p-6 sm:p-8">
          {/* Property type badge */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={journey.property.type === "buying" ? "accent" : "success"}>
              {journey.property.type === "buying" ? "🏠 Buying" : "📤 Selling"}
            </Badge>
            {allFilled && (
              <Badge variant="success">✨ Team Complete</Badge>
            )}
          </div>

          {/* Address */}
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

          {/* Progress + Created by */}
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

      {/* What's next callout (if not complete) */}
      {!allFilled && (
        <div className="mb-6 rounded-2xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
              <svg width="16" height="16" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-300">What&apos;s next</h3>
              <p className="text-xs text-slate-400 mt-0.5">{journey.nextStep}</p>
            </div>
          </div>
        </div>
      )}

      {/* Role panels */}
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
          <Link href={`/pros/${createdByPro.slug}`}>
            <Button variant="secondary" size="sm">
              Contact {createdByPro.name}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
