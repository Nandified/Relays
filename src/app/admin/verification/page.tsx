"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import { mockVerificationQueue, type VerificationRequest } from "@/lib/mock-admin-data";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const statusBadge: Record<VerificationRequest["status"], { variant: "warning" | "success" | "danger" | "accent"; label: string }> = {
  pending: { variant: "warning", label: "Pending" },
  approved: { variant: "success", label: "Approved" },
  rejected: { variant: "danger", label: "Rejected" },
  info_requested: { variant: "accent", label: "Info Requested" },
};

export default function VerificationPage() {
  const [queue, setQueue] = React.useState(mockVerificationQueue);
  const [activeTab, setActiveTab] = React.useState("pending");
  const [rejectModalId, setRejectModalId] = React.useState<string | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");

  const tabs = [
    { id: "pending", label: "Pending", count: queue.filter(v => v.status === "pending").length },
    { id: "approved", label: "Approved", count: queue.filter(v => v.status === "approved").length },
    { id: "rejected", label: "Rejected", count: queue.filter(v => v.status === "rejected").length },
    { id: "all", label: "All", count: queue.length },
  ];

  const filtered = activeTab === "all"
    ? queue
    : queue.filter(v => v.status === activeTab);

  const handleApprove = (id: string) => {
    setQueue(prev => prev.map(v =>
      v.id === id ? { ...v, status: "approved" as const, reviewedBy: "Frank Johnson", reviewedAt: new Date().toISOString() } : v
    ));
  };

  const handleReject = (id: string) => {
    setQueue(prev => prev.map(v =>
      v.id === id ? { ...v, status: "rejected" as const, reviewedBy: "Frank Johnson", reviewedAt: new Date().toISOString(), rejectionReason: rejectReason || "Does not meet requirements" } : v
    ));
    setRejectModalId(null);
    setRejectReason("");
  };

  const handleRequestInfo = (id: string) => {
    setQueue(prev => prev.map(v =>
      v.id === id ? { ...v, status: "info_requested" as const, reviewedBy: "Frank Johnson", reviewedAt: new Date().toISOString() } : v
    ));
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">License Verification</h1>
        <p className="mt-1 text-sm text-slate-400">
          Review and approve professional license credentials.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
      </div>

      {/* Queue */}
      <div className="space-y-3">
        {filtered.map((ver) => {
          const badge = statusBadge[ver.status];
          return (
            <Card key={ver.id} padding="none" className="overflow-hidden glow-violet">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/10 text-sm font-bold text-violet-400">
                      {ver.proName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{ver.proName}</div>
                      <div className="text-xs text-slate-500">{ver.companyName}</div>
                    </div>
                  </div>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Category</div>
                    <div className="mt-0.5 text-sm text-slate-300">{ver.category}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">License #</div>
                    <div className="mt-0.5 text-sm text-slate-300 font-mono">{ver.licenseNumber}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">License Type</div>
                    <div className="mt-0.5 text-sm text-slate-300">{ver.licenseType}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Submitted</div>
                    <div className="mt-0.5 text-sm text-slate-300">{formatDate(ver.submittedAt)}</div>
                  </div>
                </div>

                {/* Rejection reason */}
                {ver.rejectionReason && (
                  <div className="mt-3 rounded-xl bg-red-500/8 border border-red-500/15 px-3 py-2">
                    <p className="text-xs text-red-400">
                      <span className="font-medium">Rejection reason: </span>
                      {ver.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Reviewed info */}
                {ver.reviewedBy && (
                  <div className="mt-3 text-xs text-slate-600">
                    Reviewed by {ver.reviewedBy} · {ver.reviewedAt ? formatDate(ver.reviewedAt) : ""}
                  </div>
                )}
              </div>

              {/* Actions (only for pending) */}
              {ver.status === "pending" && (
                <div className="flex items-center gap-2 border-t border-[var(--border)] bg-white/[0.01] px-4 py-3">
                  <Button
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    onClick={() => handleApprove(ver.id)}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Approve
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setRejectModalId(ver.id)}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                    Reject
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleRequestInfo(ver.id)}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
                      <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Request Info
                  </Button>
                </div>
              )}
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <Card padding="lg" className="text-center">
            <div className="text-sm text-slate-400">No verification requests in this category.</div>
          </Card>
        )}
      </div>

      {/* Reject modal */}
      <Modal
        open={rejectModalId !== null}
        title="Reject Verification"
        onClose={() => { setRejectModalId(null); setRejectReason(""); }}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Provide a reason for rejecting this verification request. The pro will be notified.
          </p>
          <Input
            label="Rejection Reason"
            placeholder="e.g., License number not found in state database"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => { setRejectModalId(null); setRejectReason(""); }}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => rejectModalId && handleReject(rejectModalId)}>
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
