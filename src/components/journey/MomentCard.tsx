"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  type ReferralMoment,
  JOURNEY_STAGE_LABELS,
} from "@/lib/types";
import { getMomentCategoryStyle } from "@/lib/moments-engine";

/* ── Hero Moment Card — the "What's Next" star ───────────────── */

interface HeroMomentCardProps {
  moment: ReferralMoment;
  journeyTitle?: string;
}

export function HeroMomentCard({ moment, journeyTitle }: HeroMomentCardProps) {
  const style = getMomentCategoryStyle(moment.category);
  const actionLabels: Record<ReferralMoment["action"], string> = {
    send_top_3: `Find a ${moment.category}`,
    request_booking: `Book a ${moment.category}`,
    upload_doc: "Upload Document",
    review: "Review Now",
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-500/15 bg-gradient-to-br from-blue-500/[0.06] via-transparent to-purple-500/[0.04] p-6 animate-moment-pulse-subtle">
      {/* Ambient glow */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-purple-500/8 blur-2xl pointer-events-none" />

      <div className="relative">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${style.bgColor} ${style.borderColor} text-xl`}>
              {style.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="danger" className="text-[10px] animate-gentle-pulse">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400 mr-1 animate-ping" />
                  Action Needed
                </Badge>
                {journeyTitle && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-600">{journeyTitle}</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{moment.title}</h3>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">{moment.description}</p>

        {/* Stage info */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-[11px] text-slate-500 dark:text-slate-600">Stage:</span>
          <Badge variant="outline" className="text-[10px]">
            {JOURNEY_STAGE_LABELS[moment.stage]}
          </Badge>
          {moment.triggerDate && (
            <>
              <span className="text-[11px] text-slate-500 dark:text-slate-600">Deadline:</span>
              <Badge variant="warning" className="text-[10px]">
                {new Date(moment.triggerDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </Badge>
            </>
          )}
        </div>

        {/* CTA */}
        <Link href={`/marketplace?category=${encodeURIComponent(moment.category)}`}>
          <Button size="lg" className="w-full sm:w-auto">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {actionLabels[moment.action]}
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ── Upcoming Moment Card — smaller, dimmed ──────────────────── */

interface UpcomingMomentCardProps {
  moment: ReferralMoment;
}

export function UpcomingMomentCard({ moment }: UpcomingMomentCardProps) {
  const style = getMomentCategoryStyle(moment.category);

  return (
    <div className="glass-card rounded-2xl p-4 opacity-70 hover:opacity-90 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${style.bgColor} ${style.borderColor} text-base flex-shrink-0`}>
          {style.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{moment.title}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-600">
              Triggers at: {JOURNEY_STAGE_LABELS[moment.stage]}
            </span>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] flex-shrink-0">
          Upcoming
        </Badge>
      </div>
    </div>
  );
}

/* ── Completed Moment Card — collapsed, expandable ───────────── */

interface CompletedMomentCardProps {
  moment: ReferralMoment;
}

export function CompletedMomentCard({ moment }: CompletedMomentCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const style = getMomentCategoryStyle(moment.category);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] p-3 hover:bg-emerald-500/[0.04] transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {/* Checkmark */}
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex-shrink-0">
          <svg width="12" height="12" fill="#10b981" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-sm text-slate-500 dark:text-slate-400 line-through decoration-emerald-500/40">{moment.title}</span>
        </div>
        {moment.completedAt && (
          <span className="text-[10px] text-slate-500 dark:text-slate-600 flex-shrink-0">
            {new Date(moment.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
        <svg
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className={`text-slate-500 dark:text-slate-600 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-emerald-500/10">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${style.color}`}>{style.icon}</span>
            <span className="text-xs text-slate-500">{moment.category}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{moment.description}</p>
        </div>
      )}
    </button>
  );
}

/* ── Pro Moment Card — for pro dashboard ─────────────────────── */

interface ProMomentCardProps {
  moment: ReferralMoment;
  clientName: string;
  propertyAddress: string;
  journeyId: string;
  urgency: "urgent" | "upcoming" | "recent";
}

export function ProMomentCard({ moment, clientName, propertyAddress, journeyId, urgency }: ProMomentCardProps) {
  const style = getMomentCategoryStyle(moment.category);
  
  const urgencyStyles = {
    urgent: "border-red-500/20 bg-red-500/[0.03] shadow-[0_0_20px_rgba(239,68,68,0.08)]",
    upcoming: "border-amber-500/15 bg-amber-500/[0.02]",
    recent: "border-emerald-500/15 bg-emerald-500/[0.02]",
  };

  const urgencyBadge = {
    urgent: <Badge variant="danger">Urgent</Badge>,
    upcoming: <Badge variant="warning">Upcoming</Badge>,
    recent: <Badge variant="success">Completed</Badge>,
  };

  return (
    <div className={`rounded-2xl border p-4 transition-all duration-300 ${urgencyStyles[urgency]}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${style.bgColor} ${style.borderColor} text-lg flex-shrink-0`}>
          {style.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{clientName}</span>
            {urgencyBadge[urgency]}
          </div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">{moment.title}</h4>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {propertyAddress}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      {urgency !== "recent" && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
          <Link href={`/journey/${journeyId}`} className="flex-1">
            <Button size="sm" className="w-full text-xs">
              {moment.action === "send_top_3" ? "Send Top 3" : "View Journey"}
            </Button>
          </Link>
          <Button size="sm" variant="secondary" className="text-xs">
            Remind Client
          </Button>
          <Button size="sm" variant="ghost" className="text-xs">
            Mark Complete
          </Button>
        </div>
      )}
    </div>
  );
}
