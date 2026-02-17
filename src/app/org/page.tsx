"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ROLE_META } from "@/lib/rbac";
import {
  mockOrganizations,
  getOrgMembers,
  getOrgJourneys,
  getAuditLogs,
  getReferralData,
  MOCK_CURRENT_USER,
} from "@/lib/mock-org-data";

/* ── Metric Card ──────────────────────────────────────────────── */

function MetricCard({
  label,
  value,
  subtext,
  icon,
  accent = "blue",
}: {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  accent?: "blue" | "emerald" | "amber" | "purple";
}) {
  const accents = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", glow: "shadow-[0_0_20px_rgba(59,130,246,0.1)]" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", glow: "shadow-[0_0_20px_rgba(16,185,129,0.1)]" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", glow: "shadow-[0_0_20px_rgba(245,158,11,0.1)]" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400", glow: "shadow-[0_0_20px_rgba(139,92,246,0.1)]" },
  };
  const a = accents[accent];

  return (
    <Card hover className={`group ${a.glow}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{value}</p>
          {subtext && <p className="mt-1 text-xs text-slate-600 dark:text-slate-500">{subtext}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.bg} ${a.text}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

/* ── Audit Action Badge ──────────────────────────────────────── */

function AuditActionBadge({ action }: { action: string }) {
  const map: Record<string, { label: string; variant: "accent" | "success" | "warning" | "default" | "danger" }> = {
    member_invited: { label: "Invite", variant: "accent" },
    member_joined: { label: "Joined", variant: "success" },
    member_deactivated: { label: "Deactivated", variant: "danger" },
    role_changed: { label: "Role Change", variant: "warning" },
    journey_created: { label: "Journey", variant: "success" },
    journey_reassigned: { label: "Reassigned", variant: "warning" },
    journey_updated: { label: "Updated", variant: "accent" },
    partner_recommended: { label: "Referral", variant: "accent" },
    partner_approved: { label: "Approved", variant: "success" },
    verification_submitted: { label: "Verification", variant: "warning" },
    settings_updated: { label: "Settings", variant: "default" },
    step_in_granted: { label: "Step-In", variant: "warning" },
    step_in_used: { label: "Step-In", variant: "accent" },
    report_exported: { label: "Export", variant: "default" },
  };
  const info = map[action] ?? { label: action, variant: "default" as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
}

/* ── Quick Link Card ──────────────────────────────────────────── */

function QuickLinkCard({ href, label, description, icon }: { href: string; label: string; description: string; icon: React.ReactNode }) {
  return (
    <Link href={href}>
      <Card hover className="group cursor-pointer h-full">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 shrink-0 group-hover:bg-blue-500/15 transition-colors">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">{label}</p>
            <p className="text-xs text-slate-600 dark:text-slate-500 mt-0.5">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function OrgDashboard() {
  const org = mockOrganizations[0]; // Luxury Realty Chicago
  const members = getOrgMembers(org.id);
  const activeMembers = members.filter((m) => m.status === "active");
  const journeys = getOrgJourneys(org.id);
  const activeJourneys = journeys.filter((j) => j.status === "active");
  const completedJourneys = journeys.filter((j) => j.status === "completed");
  const auditLogs = getAuditLogs(org.id).slice(0, 8);
  const referrals = getReferralData(org.id);
  const totalReferrals = referrals.reduce((sum, r) => sum + r.referralCount, 0);
  const pendingVerifications = 2; // mock

  const seatPercentage = Math.round((org.currentSeats / org.maxSeats) * 100);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]">
              L
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{org.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="accent">{org.tier.charAt(0).toUpperCase() + org.tier.slice(1)}</Badge>
                <span className="text-xs text-slate-600 dark:text-slate-500">{org.type.charAt(0).toUpperCase() + org.type.slice(1)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-600 dark:text-slate-500">Seats Used</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{org.currentSeats} / {org.maxSeats}</p>
          </div>
          <div className="w-32 h-2 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${seatPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Active Agents"
          value={activeMembers.filter((m) => m.role === "agent").length}
          subtext={`${members.filter((m) => m.status === "invited").length} pending invite`}
          accent="blue"
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <MetricCard
          label="Active Journeys"
          value={activeJourneys.length}
          subtext={`${completedJourneys.length} completed`}
          accent="emerald"
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>}
        />
        <MetricCard
          label="Referrals Sent"
          value={totalReferrals}
          subtext="This quarter"
          accent="purple"
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}
        />
        <MetricCard
          label="Pending Verifications"
          value={pendingVerifications}
          subtext="Needs review"
          accent="amber"
          icon={<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Activity</h2>
            <Link href="/org/reports/compliance" className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              View full log →
            </Link>
          </div>
          <Card padding="none">
            <div className="divide-y divide-[var(--border)]">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 px-4 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 text-[11px] font-bold text-slate-600 dark:text-slate-400 shrink-0 mt-0.5">
                    {log.performedByName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{log.performedByName}</span>
                      <AuditActionBadge action={log.action} />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-500 mt-0.5 truncate">{log.details}</p>
                  </div>
                  <time className="text-[10px] text-slate-500 dark:text-slate-500 shrink-0 tabular-nums">
                    {formatRelativeTime(log.timestamp)}
                  </time>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Links</h2>
          <div className="space-y-3">
            <QuickLinkCard
              href="/org/members"
              label="Manage Members"
              description="Invite, assign roles, manage seats"
              icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            />
            <QuickLinkCard
              href="/org/journeys"
              label="Journey Overview"
              description="Track all agent journeys"
              icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>}
            />
            <QuickLinkCard
              href="/org/reports/referrals"
              label="Referral Report"
              description="Who referred whom, conversions"
              icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}
            />
            <QuickLinkCard
              href="/org/reports/compliance"
              label="Compliance & Audit"
              description="RESPA compliance trail"
              icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
            />
            <QuickLinkCard
              href="/org/settings"
              label="Settings"
              description="Org profile, policies, billing"
              icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Utils ─────────────────────────────────────────────────────── */

function formatRelativeTime(iso: string): string {
  const now = new Date("2026-02-11T17:00:00Z"); // mock "now"
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
