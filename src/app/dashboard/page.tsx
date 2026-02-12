"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockJourneys, getProById } from "@/lib/mock-data";
import { type Journey } from "@/lib/types";

function statusBadge(status: Journey["status"]) {
  switch (status) {
    case "active": return <Badge variant="accent">Active</Badge>;
    case "pending": return <Badge variant="warning">Waiting</Badge>;
    case "completed": return <Badge variant="success">Complete</Badge>;
  }
}

export default function DashboardPage() {
  const journeys = mockJourneys;
  const activeCount = journeys.filter(j => j.status === "active").length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Your home journey at a glance — {activeCount} active {activeCount === 1 ? "journey" : "journeys"}
        </p>
      </div>

      {/* Quick actions */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link href="/marketplace">
          <Card hover padding="sm" className="text-center py-4">
            <div className="mx-auto h-10 w-10 rounded-xl bg-[var(--accent-light)] border border-blue-500/10 flex items-center justify-center mb-2">
              <svg width="18" height="18" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <div className="text-xs font-medium text-slate-300">Find Pros</div>
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
            <div className="text-xs font-medium text-slate-300">My Team</div>
          </Card>
        </Link>
        <Link href="/requests">
          <Card hover padding="sm" className="text-center py-4">
            <div className="mx-auto h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/10 flex items-center justify-center mb-2">
              <svg width="18" height="18" fill="none" stroke="#a855f7" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
              </svg>
            </div>
            <div className="text-xs font-medium text-slate-300">Requests</div>
          </Card>
        </Link>
        <Card hover padding="sm" className="text-center py-4 cursor-pointer">
          <div className="mx-auto h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/10 flex items-center justify-center mb-2">
            <svg width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-xs font-medium text-slate-300">New Journey</div>
        </Card>
      </div>

      {/* Journey cards */}
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Your Journeys</h2>
      <div className="space-y-4">
        {journeys.map((journey) => (
          <JourneyCard key={journey.id} journey={journey} />
        ))}
      </div>
    </div>
  );
}

function JourneyCard({ journey }: { journey: Journey }) {
  return (
    <Card padding="lg" hover>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-100">{journey.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{journey.address}</p>
        </div>
        {statusBadge(journey.status)}
      </div>

      {/* Pending action callout */}
      <div className="rounded-xl bg-[var(--accent-light)] border border-blue-500/10 p-3 mb-4">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-[var(--accent)] flex items-center justify-center">
            <svg width="10" height="10" fill="white" viewBox="0 0 20 20">
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-blue-400">{journey.pendingAction}</div>
            <div className="text-xs text-slate-400 mt-0.5">{journey.nextStep}</div>
          </div>
        </div>
      </div>

      {/* Owner */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500">
          Owner: <span className="font-medium text-slate-300">{journey.owner}</span>
        </span>
      </div>

      {/* Team thumbnails */}
      <div className="flex items-center gap-1">
        <div className="flex -space-x-2">
          {journey.teamMembers.slice(0, 5).map((tm) => {
            const pro = getProById(tm.proId);
            if (!pro) return null;
            return (
              <div
                key={tm.proId}
                className="h-7 w-7 overflow-hidden rounded-full border-2 border-[var(--bg-card)] bg-[var(--bg-elevated)]"
                title={`${pro.name} (${tm.role})`}
              >
                <Image src={pro.headshotUrl} alt={pro.name} width={28} height={28} />
              </div>
            );
          })}
        </div>
        <span className="text-xs text-slate-500 ml-2">
          {journey.teamMembers.length} team member{journey.teamMembers.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Primary CTA */}
      <div className="mt-4">
        <Button size="sm" className="w-full sm:w-auto">
          {journey.status === "active" ? journey.pendingAction : "View Details"}
        </Button>
      </div>
    </Card>
  );
}
