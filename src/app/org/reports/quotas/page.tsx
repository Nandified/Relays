"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";

/* ── Mock quota data ────────────────────────────────────────── */

interface PartnerQuota {
  id: string;
  partnerName: string;
  partnerCompany: string;
  category: string;
  targetCount: number;
  actualCount: number;
  trend: "up" | "down" | "flat";
  trendPct: number;
  agents: AgentQuota[];
}

interface AgentQuota {
  agentName: string;
  referrals: number;
  target: number;
}

const mockQuotas: PartnerQuota[] = [
  {
    id: "q1",
    partnerName: "Jordan Lee",
    partnerCompany: "Sunrise Mortgage",
    category: "Mortgage Lender",
    targetCount: 30,
    actualCount: 24,
    trend: "up",
    trendPct: 12,
    agents: [
      { agentName: "Lisa Hartwell", referrals: 14, target: 15 },
      { agentName: "Frank Johnson", referrals: 10, target: 15 },
    ],
  },
  {
    id: "q2",
    partnerName: "Alex Martinez",
    partnerCompany: "Blue Peak Inspections",
    category: "Home Inspector",
    targetCount: 25,
    actualCount: 22,
    trend: "up",
    trendPct: 8,
    agents: [
      { agentName: "Lisa Hartwell", referrals: 13, target: 13 },
      { agentName: "Frank Johnson", referrals: 9, target: 12 },
    ],
  },
  {
    id: "q3",
    partnerName: "Sarah Chen",
    partnerCompany: "Lakeside Insurance Group",
    category: "Insurance Agent",
    targetCount: 20,
    actualCount: 11,
    trend: "down",
    trendPct: 5,
    agents: [
      { agentName: "Lisa Hartwell", referrals: 7, target: 10 },
      { agentName: "Frank Johnson", referrals: 4, target: 10 },
    ],
  },
  {
    id: "q4",
    partnerName: "Marcus Williams",
    partnerCompany: "Greenfield & Associates",
    category: "Attorney",
    targetCount: 20,
    actualCount: 18,
    trend: "up",
    trendPct: 15,
    agents: [
      { agentName: "Lisa Hartwell", referrals: 10, target: 10 },
      { agentName: "Frank Johnson", referrals: 8, target: 10 },
    ],
  },
  {
    id: "q5",
    partnerName: "Derek Okafor",
    partnerCompany: "Keystone Lending",
    category: "Mortgage Lender",
    targetCount: 15,
    actualCount: 6,
    trend: "down",
    trendPct: 18,
    agents: [
      { agentName: "Lisa Hartwell", referrals: 3, target: 8 },
      { agentName: "Frank Johnson", referrals: 3, target: 7 },
    ],
  },
  {
    id: "q6",
    partnerName: "Nina Reyes",
    partnerCompany: "CoverRight Insurance",
    category: "Insurance Agent",
    targetCount: 15,
    actualCount: 13,
    trend: "up",
    trendPct: 20,
    agents: [
      { agentName: "Lisa Hartwell", referrals: 8, target: 8 },
      { agentName: "Frank Johnson", referrals: 5, target: 7 },
    ],
  },
];

function getAttainmentColor(pct: number): string {
  if (pct >= 90) return "text-emerald-400";
  if (pct >= 60) return "text-amber-400";
  return "text-red-400";
}

function getBarColor(pct: number): string {
  if (pct >= 90) return "bg-emerald-400";
  if (pct >= 60) return "bg-amber-400";
  return "bg-red-400";
}

function getBarGlow(pct: number): string {
  if (pct >= 90) return "shadow-[0_0_10px_rgba(16,185,129,0.3)]";
  if (pct >= 60) return "shadow-[0_0_10px_rgba(245,158,11,0.3)]";
  return "shadow-[0_0_10px_rgba(239,68,68,0.3)]";
}

export default function QuotaTrackingPage() {
  const [timePeriod, setTimePeriod] = React.useState("q1-2026");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [agentFilter, setAgentFilter] = React.useState("all");
  const [viewTab, setViewTab] = React.useState("aggregate");
  const [expandedQuota, setExpandedQuota] = React.useState<string | null>(null);

  const filtered = mockQuotas.filter((q) => {
    if (categoryFilter !== "all" && q.category !== categoryFilter) return false;
    if (agentFilter !== "all") {
      const hasAgent = q.agents.some((a) => a.agentName === agentFilter);
      if (!hasAgent) return false;
    }
    return true;
  });

  const totalTarget = filtered.reduce((s, q) => s + q.targetCount, 0);
  const totalActual = filtered.reduce((s, q) => s + q.actualCount, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalActual / totalTarget) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Quota Tracking</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Monitor partner agreement targets vs actual referrals.
        </p>
      </div>

      {/* Overall summary */}
      <Card padding="lg" className="mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-600 dark:text-slate-500 uppercase tracking-wider mb-1">Overall Attainment</div>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${getAttainmentColor(overallPct)}`}>{overallPct}%</span>
              <span className="text-sm text-slate-600 dark:text-slate-500">{totalActual} / {totalTarget} referrals</span>
            </div>
          </div>
          <div className="hidden sm:block w-48">
            <div className="h-3 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getBarColor(overallPct)} ${getBarGlow(overallPct)}`}
                style={{ width: `${Math.min(overallPct, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Select
          label="Time Period"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          options={[
            { value: "q1-2026", label: "Q1 2026 (Current)" },
            { value: "q4-2025", label: "Q4 2025" },
            { value: "q3-2025", label: "Q3 2025" },
            { value: "2025", label: "Full Year 2025" },
          ]}
        />
        <Select
          label="Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          options={[
            { value: "all", label: "All Categories" },
            { value: "Mortgage Lender", label: "Mortgage Lender" },
            { value: "Home Inspector", label: "Home Inspector" },
            { value: "Insurance Agent", label: "Insurance Agent" },
            { value: "Attorney", label: "Attorney" },
          ]}
        />
        <Select
          label="Agent"
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
          options={[
            { value: "all", label: "All Agents" },
            { value: "Lisa Hartwell", label: "Lisa Hartwell" },
            { value: "Frank Johnson", label: "Frank Johnson" },
          ]}
        />
      </div>

      {/* View toggle */}
      <div className="mb-4">
        <Tabs
          tabs={[
            { id: "aggregate", label: "Aggregate" },
            { id: "by-agent", label: "By Agent" },
          ]}
          activeId={viewTab}
          onChange={setViewTab}
        />
      </div>

      {/* Quota cards */}
      <div className="space-y-3">
        {filtered.map((quota) => {
          const pct = Math.round((quota.actualCount / quota.targetCount) * 100);
          const expanded = expandedQuota === quota.id;

          return (
            <Card
              key={quota.id}
              padding="none"
              hover
              className="overflow-hidden"
            >
              <button
                className="w-full text-left p-4 sm:p-5"
                onClick={() => setExpandedQuota(expanded ? null : quota.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{quota.partnerName}</h3>
                      <Badge variant="outline">{quota.category}</Badge>
                      {/* Trend indicator */}
                      <span className={`flex items-center gap-0.5 text-xs font-medium ${quota.trend === "up" ? "text-emerald-400" : quota.trend === "down" ? "text-red-400" : "text-slate-600 dark:text-slate-500"}`}>
                        {quota.trend === "up" ? "↑" : quota.trend === "down" ? "↓" : "→"}
                        {quota.trendPct}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-500">{quota.partnerCompany}</p>

                    {/* Progress bar */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${getBarColor(pct)}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold min-w-[3rem] text-right ${getAttainmentColor(pct)}`}>
                        {pct}%
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-4 text-xs text-slate-600 dark:text-slate-500">
                      <span><span className="text-slate-700 dark:text-slate-300 font-medium">{quota.actualCount}</span> actual</span>
                      <span><span className="text-slate-700 dark:text-slate-300 font-medium">{quota.targetCount}</span> target</span>
                      <span>{quota.targetCount - quota.actualCount} remaining</span>
                    </div>
                  </div>

                  <svg
                    width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    className={`text-slate-600 dark:text-slate-500 transition-transform duration-300 flex-shrink-0 mt-1 ${expanded ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* Agent drill-down */}
              <div
                className="grid transition-[grid-template-rows] duration-300"
                style={{ gridTemplateRows: expanded || viewTab === "by-agent" ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-[var(--border)] pt-3">
                    <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Per-Agent Breakdown</h4>
                    <div className="space-y-3">
                      {quota.agents.map((agent) => {
                        const agentPct = agent.target > 0 ? Math.round((agent.referrals / agent.target) * 100) : 0;
                        return (
                          <div key={agent.agentName} className="flex items-center gap-3">
                            <div className="w-28 text-sm text-slate-700 dark:text-slate-300 truncate">{agent.agentName}</div>
                            <div className="flex-1 h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${getBarColor(agentPct)}`}
                                style={{ width: `${Math.min(agentPct, 100)}%` }}
                              />
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-500 min-w-[4rem] text-right">
                              <span className="text-slate-700 dark:text-slate-300 font-medium">{agent.referrals}</span> / {agent.target}
                            </div>
                            <div className={`text-xs font-semibold min-w-[2.5rem] text-right ${getAttainmentColor(agentPct)}`}>
                              {agentPct}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <Card padding="lg" className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">No partner agreements match your filters.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
