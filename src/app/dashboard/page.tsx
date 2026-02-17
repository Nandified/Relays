"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StageTimeline } from "@/components/journey/StageTimeline";
import { HeroMomentCard, UpcomingMomentCard, CompletedMomentCard } from "@/components/journey/MomentCard";
import { PostServiceFollowUps } from "@/components/reviews/PostServiceFollowUps";
import {
  mockJourneys,
  getProById,
  getFilledRoleCount,
  getTotalRoleCount,
} from "@/lib/mock-data";
import { getPendingFollowUps } from "@/lib/mock-reviews";
import { type Journey, JOURNEY_STAGE_LABELS, JOURNEY_STAGE_ICONS } from "@/lib/types";
import { computeMoments, getHeroMoment } from "@/lib/moments-engine";

function statusBadge(status: Journey["status"]) {
  switch (status) {
    case "active": return <Badge variant="accent">Active</Badge>;
    case "pending": return <Badge variant="warning">Waiting</Badge>;
    case "completed": return <Badge variant="success">Complete</Badge>;
  }
}

/* ── Progress Ring ───────────────────────────────────────────── */
function ProgressRing({ filled, total, size = 56 }: { filled: number; total: number; size?: number }) {
  const pct = total === 0 ? 0 : Math.round((filled / total) * 100);
  const strokeW = 3.5;
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const done = filled === total;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={strokeW} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={done ? "#10b981" : "#3b82f6"}
          strokeWidth={strokeW} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          className="animate-progress"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">{filled}/{total}</span>
      </div>
    </div>
  );
}

/* ── Journey Card ────────────────────────────────────────────── */
function JourneyCard({ journey }: { journey: Journey }) {
  const filled = getFilledRoleCount(journey);
  const total = getTotalRoleCount();
  const allFilled = filled === total;
  const createdBy = getProById(journey.createdByProId);
  const nextUnfilled = journey.roles.find((r) => r.status !== "filled");

  return (
    <Link href={`/journey/${journey.id}`}>
      <Card padding="none" hover className="overflow-hidden">
        <div className={`h-0.5 ${allFilled ? "bg-gradient-to-r from-emerald-500/60 to-emerald-500/0" : "bg-gradient-to-r from-blue-500/60 to-purple-500/0"}`} />

        <div className="p-5">
          {/* Top row */}
          <div className="flex items-start gap-4 mb-4">
            <ProgressRing filled={filled} total={total} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">{journey.title}</h3>
                {statusBadge(journey.status)}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-500 flex items-center gap-1">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="flex-shrink-0">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {journey.address}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant={journey.property.type === "buying" ? "accent" : "success"} className="text-[10px]">
                  {journey.property.type === "buying" ? "Buying" : "Selling"}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {JOURNEY_STAGE_ICONS[journey.stage]} {JOURNEY_STAGE_LABELS[journey.stage]}
                </Badge>
                {createdBy && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-500">
                    via {createdBy.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mini Stage Timeline */}
          <div className="mb-4">
            <StageTimeline currentStage={journey.stage} compact />
          </div>

          {/* What's next callout */}
          {!allFilled && nextUnfilled && (
            <div className="rounded-xl bg-[var(--accent-light)] border border-blue-500/10 p-3 mb-4">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-[var(--accent)] flex items-center justify-center">
                  <svg width="10" height="10" fill="white" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-400">{journey.pendingAction}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{journey.nextStep}</div>
                </div>
              </div>
            </div>
          )}

          {allFilled && (
            <div className="rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10 p-3 mb-4">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" fill="#10b981" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span className="text-sm font-medium text-emerald-400">Team complete — you&apos;re all set!</span>
              </div>
            </div>
          )}

          {/* Team thumbnails */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {journey.roles
                  .filter((r) => r.status === "filled" && r.assignedProId)
                  .map((r) => {
                    const pro = getProById(r.assignedProId!);
                    if (!pro) return null;
                    return (
                      <div
                        key={r.category}
                        className="h-7 w-7 overflow-hidden rounded-full border-2 border-[var(--bg-card)] bg-[var(--bg-elevated)]"
                        title={`${pro.name} (${r.category})`}
                      >
                        <Image src={pro.headshotUrl} alt={pro.name} width={28} height={28} />
                      </div>
                    );
                  })}
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-500">
                {filled} team member{filled !== 1 ? "s" : ""}
              </span>
            </div>
            <Button size="sm" variant={allFilled ? "secondary" : "primary"}>
              {allFilled ? "View Journey" : journey.pendingAction}
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}

/* ── Dashboard Page ──────────────────────────────────────────── */
export default function DashboardPage() {
  const journeys = mockJourneys;
  const activeCount = journeys.filter((j) => j.status === "active").length;

  // Gather all moments across active journeys for the hero section
  const activeJourneys = journeys.filter((j) => j.status === "active");
  const allActiveMoments = activeJourneys.flatMap((j) => {
    const moments = computeMoments(j);
    return moments.active.map((m) => ({ moment: m, journey: j }));
  });
  const allUpcomingMoments = activeJourneys.flatMap((j) => {
    const moments = computeMoments(j);
    return moments.upcoming.slice(0, 2).map((m) => ({ moment: m, journey: j }));
  });
  const allCompletedMoments = activeJourneys.flatMap((j) => {
    const moments = computeMoments(j);
    return moments.completed.map((m) => ({ moment: m, journey: j }));
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Your home journey at a glance — {activeCount} active {activeCount === 1 ? "journey" : "journeys"}
        </p>
      </div>

      {/* ── What's Next Hero Section ──────────────────────────── */}
      {allActiveMoments.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 border border-blue-500/20">
              <svg width="14" height="14" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">What&apos;s Next</h2>
            <Badge variant="danger" className="text-[10px]">
              {allActiveMoments.length} action{allActiveMoments.length > 1 ? "s" : ""}
            </Badge>
          </div>
          <div className="space-y-3">
            {allActiveMoments.slice(0, 3).map(({ moment, journey }) => (
              <HeroMomentCard
                key={moment.id}
                moment={moment}
                journeyTitle={journey.title}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming moments */}
      {allUpcomingMoments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-500 dark:text-slate-500">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Coming Up
          </h2>
          <div className="space-y-2">
            {allUpcomingMoments.slice(0, 4).map(({ moment }) => (
              <UpcomingMomentCard key={moment.id} moment={moment} />
            ))}
          </div>
        </div>
      )}

      {/* Completed moments (collapsed) */}
      {allCompletedMoments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg width="12" height="12" fill="#10b981" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            Completed
          </h2>
          <div className="space-y-2">
            {allCompletedMoments.slice(0, 5).map(({ moment }) => (
              <CompletedMomentCard key={moment.id} moment={moment} />
            ))}
          </div>
        </div>
      )}

      {/* Post-Service Follow-ups */}
      <PostServiceFollowUps followUps={getPendingFollowUps("user_jamie")} />

      {/* Quick actions */}
      <div className="mb-8 mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link href="/marketplace">
          <Card hover padding="sm" className="text-center py-4">
            <div className="mx-auto h-10 w-10 rounded-xl bg-[var(--accent-light)] border border-blue-500/10 flex items-center justify-center mb-2">
              <svg width="18" height="18" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Find Pros</div>
          </Card>
        </Link>
        <Link href="/team">
          <Card hover padding="sm" className="text-center py-4">
            <div className="mx-auto h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center mb-2">
              <svg width="18" height="18" fill="none" stroke="#10b981" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">My Team</div>
          </Card>
        </Link>
        <Link href="/requests">
          <Card hover padding="sm" className="text-center py-4">
            <div className="mx-auto h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/10 flex items-center justify-center mb-2">
              <svg width="18" height="18" fill="none" stroke="#a855f7" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
              </svg>
            </div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Requests</div>
          </Card>
        </Link>
        <Link href="/settings/notifications">
          <Card hover padding="sm" className="text-center py-4">
            <div className="mx-auto h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/10 flex items-center justify-center mb-2">
              <svg width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Notifications</div>
          </Card>
        </Link>
      </div>

      {/* Journey cards */}
      <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-500 uppercase tracking-wider mb-4">Your Journeys</h2>
      <div className="space-y-4 stagger-children">
        {journeys.map((journey) => (
          <JourneyCard key={journey.id} journey={journey} />
        ))}
      </div>
    </div>
  );
}
