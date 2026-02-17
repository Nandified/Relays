"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  mockJourneys,
  getProById,
  getFilledRoleCount,
  getTotalRoleCount,
} from "@/lib/mock-data";
import { type Journey } from "@/lib/types";

function statusBadge(status: Journey["status"]) {
  switch (status) {
    case "active": return <Badge variant="accent">Active</Badge>;
    case "pending": return <Badge variant="warning">Pending</Badge>;
    case "completed": return <Badge variant="success">Complete</Badge>;
  }
}

function MiniProgressRing({ filled, total }: { filled: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((filled / total) * 100);
  return (
    <div className="relative h-10 w-10">
      <svg viewBox="0 0 36 36" className="h-10 w-10">
        <path
          d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
          fill="none"
          stroke="var(--border)"
          strokeWidth="3"
        />
        <path
          d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
          fill="none"
          stroke={filled === total ? "#10b981" : "#3b82f6"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${pct}, 100`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
        {filled}/{total}
      </div>
    </div>
  );
}

export default function ProJourneysPage() {
  // In production, filter by current pro's ID. For mock, show all journeys created by pro_9 (Lisa Hartwell)
  const proId = "pro_9";
  const journeys = mockJourneys.filter((j) => j.createdByProId === proId);
  const allJourneys = mockJourneys; // Show all for demo purposes
  const totalCount = getTotalRoleCount();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/pro/dashboard" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mb-3">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Journeys</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {allJourneys.length} journey{allJourneys.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <Link href="/pro/journey/new">
          <Button>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1.5"><path d="M12 4v16m8-8H4" /></svg>
            New Journey
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <Card padding="md">
          <div className="text-2xl font-bold text-blue-400">{allJourneys.filter((j) => j.status === "active").length}</div>
          <div className="text-xs text-slate-500 mt-1">Active</div>
        </Card>
        <Card padding="md">
          <div className="text-2xl font-bold text-amber-400">{allJourneys.filter((j) => j.status === "pending").length}</div>
          <div className="text-xs text-slate-500 mt-1">Pending</div>
        </Card>
        <Card padding="md">
          <div className="text-2xl font-bold text-emerald-400">{allJourneys.filter((j) => j.status === "completed").length}</div>
          <div className="text-xs text-slate-500 mt-1">Complete</div>
        </Card>
      </div>

      {/* Journey list */}
      <div className="space-y-3">
        {allJourneys.map((journey) => {
          const filled = getFilledRoleCount(journey);
          const createdBy = getProById(journey.createdByProId);

          return (
            <Link key={journey.id} href={`/journey/${journey.id}`}>
              <Card hover padding="lg" className="mb-3">
                <div className="flex items-start gap-4">
                  <MiniProgressRing filled={filled} total={totalCount} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{journey.title}</h3>
                      {statusBadge(journey.status)}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="flex-shrink-0">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {journey.address}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[11px] text-slate-500">
                        Client: <span className="text-slate-700 dark:text-slate-300">{journey.client.name}</span>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {journey.property.type === "buying" ? "Buying" : "Selling"}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-600">
                        {new Date(journey.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {/* Team member avatars */}
                  <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                    <div className="flex -space-x-2">
                      {journey.roles
                        .filter((r) => r.status === "filled" && r.assignedProId)
                        .slice(0, 4)
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
                    {filled > 4 && (
                      <span className="text-[11px] text-slate-500 ml-1">+{filled - 4}</span>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {allJourneys.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-16 w-16 rounded-2xl bg-black/5 dark:bg-white/5 border border-dashed border-[var(--border)] flex items-center justify-center mb-4">
            <svg width="24" height="24" fill="none" stroke="#475569" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
          </div>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">No journeys yet</h3>
          <p className="text-xs text-slate-500 mb-4">Create your first journey to get started</p>
          <Link href="/pro/journey/new"><Button>Create Journey</Button></Link>
        </div>
      )}
    </div>
  );
}
