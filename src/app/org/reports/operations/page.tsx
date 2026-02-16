"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";

/* ── Mock operations data ───────────────────────────────────── */

type Urgency = "red" | "amber" | "green";
type IssueType = "overdue_milestone" | "pending_booking" | "missing_document";

interface OperationsIssue {
  id: string;
  journey: string;
  client: string;
  agent: string;
  issueType: IssueType;
  issue: string;
  daysOverdue: number;
  urgency: Urgency;
}

const mockIssues: OperationsIssue[] = [
  { id: "op1", journey: "Oak Park Bungalow", client: "Jamie Rodriguez", agent: "Lisa Hartwell", issueType: "overdue_milestone", issue: "Attorney review not started — 8 days since match", daysOverdue: 8, urgency: "red" },
  { id: "op2", journey: "Lincoln Park Condo", client: "Sam Patel", agent: "Frank Johnson", issueType: "pending_booking", issue: "Home inspection booking awaiting confirmation", daysOverdue: 5, urgency: "red" },
  { id: "op3", journey: "Evanston Victorian", client: "Morgan Davis", agent: "Lisa Hartwell", issueType: "missing_document", issue: "Insurance binder not uploaded — closing in 4 days", daysOverdue: 4, urgency: "red" },
  { id: "op4", journey: "Wicker Park Townhome", client: "Casey Wilson", agent: "Lisa Hartwell", issueType: "overdue_milestone", issue: "Mortgage pre-approval stalled — 6 days in review", daysOverdue: 6, urgency: "amber" },
  { id: "op5", journey: "Naperville Colonial", client: "Alex Kim", agent: "Frank Johnson", issueType: "pending_booking", issue: "Attorney call not yet scheduled", daysOverdue: 3, urgency: "amber" },
  { id: "op6", journey: "Skokie Ranch", client: "Pat Okafor", agent: "Lisa Hartwell", issueType: "missing_document", issue: "Inspection report pending upload", daysOverdue: 2, urgency: "amber" },
  { id: "op7", journey: "Hyde Park Condo", client: "Robin Lee", agent: "Frank Johnson", issueType: "overdue_milestone", issue: "Insurance quote requested — awaiting agent response", daysOverdue: 1, urgency: "green" },
  { id: "op8", journey: "Bucktown Flat", client: "Drew Chen", agent: "Lisa Hartwell", issueType: "pending_booking", issue: "Radon test scheduling in progress", daysOverdue: 1, urgency: "green" },
];

const issueTypeLabels: Record<IssueType, string> = {
  overdue_milestone: "Overdue Milestone",
  pending_booking: "Pending Booking",
  missing_document: "Missing Document",
};

const urgencyConfig: Record<Urgency, { label: string; color: string; bg: string; dot: string }> = {
  red: { label: "Critical", color: "text-red-400", bg: "bg-red-500/10", dot: "bg-red-400" },
  amber: { label: "Warning", color: "text-amber-400", bg: "bg-amber-500/10", dot: "bg-amber-400" },
  green: { label: "On Track", color: "text-emerald-400", bg: "bg-emerald-500/10", dot: "bg-emerald-400" },
};

export default function OperationsDashboardPage() {
  const [activeTab, setActiveTab] = React.useState("all");
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);

  const tabs = [
    { id: "all", label: "All Issues", count: mockIssues.length },
    { id: "overdue_milestone", label: "Overdue", count: mockIssues.filter((i) => i.issueType === "overdue_milestone").length },
    { id: "pending_booking", label: "Pending", count: mockIssues.filter((i) => i.issueType === "pending_booking").length },
    { id: "missing_document", label: "Missing Docs", count: mockIssues.filter((i) => i.issueType === "missing_document").length },
  ];

  const filteredIssues = activeTab === "all" ? mockIssues : mockIssues.filter((i) => i.issueType === activeTab);

  const counts = {
    red: mockIssues.filter((i) => i.urgency === "red").length,
    amber: mockIssues.filter((i) => i.urgency === "amber").length,
    green: mockIssues.filter((i) => i.urgency === "green").length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Operations Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Track overdue milestones, pending bookings, and missing documents across all active journeys.
        </p>
      </div>

      {/* Summary metric cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {(["red", "amber", "green"] as const).map((urgency) => (
          <Card key={urgency} padding="md" className="relative overflow-hidden">
            <div className={`absolute inset-0 ${urgencyConfig[urgency].bg} opacity-40`} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${urgencyConfig[urgency].dot}`} />
                <span className={`text-xs font-medium ${urgencyConfig[urgency].color}`}>{urgencyConfig[urgency].label}</span>
              </div>
              <div className="text-3xl font-bold text-slate-100">{counts[urgency]}</div>
              <div className="text-xs text-slate-500 mt-0.5">
                {urgency === "red" ? "issues" : urgency === "amber" ? "warnings" : "on track"}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="mb-4">
        <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
      </div>

      {/* Operations table */}
      <Card padding="none" className="overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_140px_140px_1fr_80px_80px] gap-3 px-4 py-3 border-b border-[var(--border)] text-xs font-medium text-slate-500 uppercase tracking-wider">
          <div>Journey / Client</div>
          <div>Agent</div>
          <div>Type</div>
          <div>Issue</div>
          <div className="text-center">Days</div>
          <div className="text-right">Action</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[var(--border)]">
          {filteredIssues.map((item) => {
            const uc = urgencyConfig[item.urgency];
            return (
              <div
                key={item.id}
                className="group hover:bg-white/[0.02] transition-colors"
              >
                <div
                  className="grid grid-cols-1 sm:grid-cols-[1fr_140px_140px_1fr_80px_80px] gap-2 sm:gap-3 px-4 py-3 items-center cursor-pointer"
                  onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                >
                  {/* Journey/Client */}
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${uc.dot}`} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-200 truncate">{item.journey}</div>
                      <div className="text-xs text-slate-500 truncate">{item.client}</div>
                    </div>
                  </div>

                  {/* Agent */}
                  <div className="text-sm text-slate-400 truncate hidden sm:block">{item.agent}</div>

                  {/* Type */}
                  <div className="hidden sm:block">
                    <Badge variant={item.issueType === "overdue_milestone" ? "danger" : item.issueType === "pending_booking" ? "warning" : "accent"}>
                      {issueTypeLabels[item.issueType]}
                    </Badge>
                  </div>

                  {/* Issue */}
                  <div className="text-sm text-slate-400 line-clamp-1 hidden sm:block">{item.issue}</div>

                  {/* Days overdue */}
                  <div className={`text-center text-sm font-semibold hidden sm:block ${uc.color}`}>
                    {item.daysOverdue}d
                  </div>

                  {/* Action */}
                  <div className="text-right hidden sm:block">
                    <button className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                      View →
                    </button>
                  </div>
                </div>

                {/* Mobile expanded details */}
                <div
                  className="grid sm:hidden transition-[grid-template-rows] duration-300"
                  style={{ gridTemplateRows: expandedRow === item.id ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-3 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Agent: <span className="text-slate-300">{item.agent}</span></span>
                        <span>•</span>
                        <Badge variant={item.issueType === "overdue_milestone" ? "danger" : item.issueType === "pending_booking" ? "warning" : "accent"}>
                          {issueTypeLabels[item.issueType]}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400">{item.issue}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${uc.color}`}>{item.daysOverdue} days overdue</span>
                        <Button size="sm">View Journey</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredIssues.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-sm text-slate-400">No issues found</div>
            <div className="text-xs text-slate-600 mt-1">All journeys are on track 🎉</div>
          </div>
        )}
      </Card>
    </div>
  );
}
