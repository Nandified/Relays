"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { VerifiedBadge } from "@/components/verified-badge";
import { ProMomentCard } from "@/components/journey/MomentCard";
import { StageTimeline } from "@/components/journey/StageTimeline";
import {
  mockProIncomingRequests,
  mockJourneys,
  getProById,
  getFilledRoleCount,
  getTotalRoleCount,
} from "@/lib/mock-data";
import { getVerificationStatus, getVerificationDate } from "@/lib/mock-verification-data";
import { getProMoments } from "@/lib/moments-engine";
import { JOURNEY_STAGE_LABELS, JOURNEY_STAGE_ICONS } from "@/lib/types";

export default function ProDashboardPage() {
  const pending = mockProIncomingRequests.filter((r) => r.status === "pending");
  const accepted = mockProIncomingRequests.filter((r) => r.status === "accepted");

  // Journeys created by this pro (Lisa Hartwell for demo)
  const proId = "pro_9";
  const myJourneys = mockJourneys.filter((j) => j.createdByProId === proId);
  const totalRoles = getTotalRoleCount();

  // Compute moments across all journeys
  const proMoments = getProMoments(myJourneys);

  // Verification status (demo using pro_1 = Alex Martinez = verified)
  const [demoVerifiedProId, setDemoVerifiedProId] = React.useState("pro_1");
  const vStatus = getVerificationStatus(demoVerifiedProId);
  const vDate = getVerificationDate(demoVerifiedProId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Pro Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Welcome back! Here&apos;s what needs your attention.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
        <Card padding="md">
          <div className="text-2xl font-bold text-blue-400">{pending.length}</div>
          <div className="text-xs text-slate-500 mt-1">New Leads</div>
        </Card>
        <Card padding="md">
          <div className="text-2xl font-bold text-purple-400">{myJourneys.length}</div>
          <div className="text-xs text-slate-500 mt-1">Journeys</div>
        </Card>
        <Card padding="md">
          <div className="text-2xl font-bold text-red-400">{proMoments.urgent.length}</div>
          <div className="text-xs text-slate-500 mt-1">Actions Needed</div>
        </Card>
        <Card padding="md">
          <div className="text-2xl font-bold text-slate-300">4.9</div>
          <div className="text-xs text-slate-500 mt-1">Rating</div>
        </Card>
      </div>

      {/* ── Action Needed — Moments Section ──────────────────── */}
      {(proMoments.urgent.length > 0 || proMoments.upcoming.length > 0) && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/15 border border-red-500/20">
                <svg width="14" height="14" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-100">Action Needed</h2>
              {proMoments.urgent.length > 0 && (
                <Badge variant="danger" className="text-[10px] animate-gentle-pulse">
                  {proMoments.urgent.length} urgent
                </Badge>
              )}
            </div>
          </div>

          {/* Urgent moments */}
          {proMoments.urgent.length > 0 && (
            <div className="space-y-3 mb-4">
              <h3 className="text-[11px] text-red-400/80 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400 animate-ping-slow" />
                Urgent
              </h3>
              {proMoments.urgent.map((m) => (
                <ProMomentCard
                  key={m.id}
                  moment={m}
                  clientName={m.journey.client.name}
                  propertyAddress={m.journey.address}
                  journeyId={m.journey.id}
                  urgency="urgent"
                />
              ))}
            </div>
          )}

          {/* Upcoming moments */}
          {proMoments.upcoming.length > 0 && (
            <div className="space-y-3 mb-4">
              <h3 className="text-[11px] text-amber-400/80 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                Upcoming
              </h3>
              {proMoments.upcoming.map((m) => (
                <ProMomentCard
                  key={m.id}
                  moment={m}
                  clientName={m.journey.client.name}
                  propertyAddress={m.journey.address}
                  journeyId={m.journey.id}
                  urgency="upcoming"
                />
              ))}
            </div>
          )}

          {/* Recent completions */}
          {proMoments.recent.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[11px] text-emerald-400/80 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Recently Completed
              </h3>
              {proMoments.recent.map((m) => (
                <ProMomentCard
                  key={m.id}
                  moment={m}
                  clientName={m.journey.client.name}
                  propertyAddress={m.journey.address}
                  journeyId={m.journey.id}
                  urgency="recent"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Journey management section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Your Journeys</h2>
          <div className="flex items-center gap-2">
            <Link href="/pro/journeys" className="text-xs text-blue-400 hover:underline">View all →</Link>
          </div>
        </div>

        {myJourneys.length > 0 ? (
          <div className="space-y-3">
            {myJourneys.slice(0, 3).map((journey) => {
              const filled = getFilledRoleCount(journey);
              const pct = Math.round((filled / totalRoles) * 100);

              return (
                <Link key={journey.id} href={`/journey/${journey.id}`}>
                  <Card hover padding="none" className="mb-3 overflow-hidden">
                    <div className={`h-0.5 ${filled === totalRoles ? "bg-gradient-to-r from-emerald-500/60 to-emerald-500/0" : "bg-gradient-to-r from-blue-500/60 to-purple-500/0"}`} />
                    <div className="p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="relative h-10 w-10 flex-shrink-0">
                          <svg viewBox="0 0 36 36" className="h-10 w-10">
                            <path d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                            <path d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831" fill="none" stroke={filled === totalRoles ? "#10b981" : "#3b82f6"} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${pct}, 100`} />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-slate-200 tabular-nums">{filled}/{totalRoles}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-100 truncate">{journey.title}</h3>
                            <Badge variant={journey.status === "completed" ? "success" : journey.status === "active" ? "accent" : "warning"}>
                              {journey.status === "completed" ? "Complete" : journey.status === "active" ? "Active" : "Pending"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-slate-500">
                              {journey.client.name} • {journey.address}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px]">
                              {JOURNEY_STAGE_ICONS[journey.stage]} {JOURNEY_STAGE_LABELS[journey.stage]}
                            </Badge>
                          </div>
                        </div>

                        {/* Filled member avatars */}
                        <div className="hidden sm:flex -space-x-2">
                          {journey.roles
                            .filter((r) => r.status === "filled" && r.assignedProId)
                            .slice(0, 3)
                            .map((r) => {
                              const pro = getProById(r.assignedProId!);
                              if (!pro) return null;
                              return (
                                <div key={r.category} className="h-6 w-6 overflow-hidden rounded-full border-2 border-[var(--bg-card)] bg-[var(--bg-elevated)]">
                                  <Image src={pro.headshotUrl} alt={pro.name} width={24} height={24} />
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      {/* Inline stage timeline */}
                      <StageTimeline currentStage={journey.stage} compact />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card padding="lg" className="text-center">
            <p className="text-sm text-slate-400 mb-3">Create your first journey to guide clients through the home buying process</p>
            <Link href="/pro/journey/new"><Button>Create Journey</Button></Link>
          </Card>
        )}

        <div className="mt-3">
          <Link href="/pro/journey/new">
            <Card hover padding="md" className="border-dashed text-center">
              <div className="flex items-center justify-center gap-2">
                <svg width="14" height="14" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                <span className="text-sm font-medium text-blue-400">Create New Journey</span>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Incoming leads */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Incoming Leads</h2>
          <Link href="/pro/requests" className="text-xs text-blue-400 hover:underline">View all →</Link>
        </div>
        <div className="space-y-3">
          {pending.slice(0, 3).map((req) => (
            <Link key={req.id} href={`/pro/requests/${req.id}`}>
              <Card hover padding="none" className="p-4 mb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-100">{req.clientName}</span>
                      <Badge variant="warning">New</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">{req.description}</p>
                    <div className="mt-1 text-xs text-slate-500">{req.addressOrArea} • {new Date(req.receivedAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Button size="sm">Accept</Button>
                    <Button size="sm" variant="ghost">Decline</Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Verification Status */}
      <div className="mb-8">
        {/* Demo toggle */}
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span className="text-slate-600">Demo status:</span>
          {[
            { id: "pro_1", label: "Verified", color: "emerald" },
            { id: "pro_2", label: "Pending", color: "amber" },
            { id: "pro_3", label: "Not Verified", color: "slate" },
          ].map((opt) => (
            <button
              key={opt.id}
              className={`px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                demoVerifiedProId === opt.id
                  ? `border-${opt.color}-500/30 bg-${opt.color}-500/10 text-${opt.color}-400`
                  : "border-[var(--border)] text-slate-500 hover:text-slate-400"
              }`}
              onClick={() => setDemoVerifiedProId(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {vStatus === "verified" && (
          <Card padding="lg" className="border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center flex-shrink-0">
                <VerifiedBadge status="verified" size="lg" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-emerald-400">License Verified</h3>
                  <VerifiedBadge status="verified" size="sm" showLabel />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Verified since {vDate ? new Date(vDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "recently"}. Your badge is live on your profile.
                </p>
              </div>
            </div>
          </Card>
        )}

        {vStatus === "pending" && (
          <Card padding="lg" className="border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center flex-shrink-0">
                <VerifiedBadge status="pending" size="lg" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-amber-400">Verification Under Review</h3>
                  <VerifiedBadge status="pending" size="sm" showLabel />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Your license is being reviewed by our team. This usually takes 1-2 business days.
                </p>
              </div>
            </div>
          </Card>
        )}

        {vStatus === "not_verified" && (
          <Card padding="lg" className="border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-[var(--accent-light)] border border-blue-500/10 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-100">Get Verified — Upload Your License</h3>
                <p className="text-xs text-slate-400 mt-1">Verified pros get more leads and rank higher in search results. Most are verified instantly.</p>
                <Link href="/pro/verification">
                  <Button size="sm" className="mt-3">Upload License</Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Recent Activity</h2>
        <Card padding="none">
          {[
            { icon: "✅", text: "Morgan Davis — inspection accepted", time: "2 hours ago" },
            { icon: "📋", text: "New review from Michael T. (5 stars)", time: "Yesterday" },
            { icon: "📅", text: "Inspection scheduled for 742 Maple Ave", time: "2 days ago" },
            { icon: "🔔", text: "Casey Wilson declined — outside service area", time: "3 days ago" },
          ].map((activity, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-[var(--border)]" : ""}`}>
              <span className="text-base">{activity.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-slate-300 truncate">{activity.text}</div>
              </div>
              <span className="text-xs text-slate-600 flex-shrink-0">{activity.time}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
