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

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = now.getTime() - then.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const statusBadge: Record<VerificationRequest["status"], { variant: "warning" | "success" | "danger" | "accent"; label: string }> = {
  pending: { variant: "warning", label: "Pending Review" },
  approved: { variant: "success", label: "Approved" },
  rejected: { variant: "danger", label: "Rejected" },
  info_requested: { variant: "accent", label: "Info Requested" },
  auto_approved: { variant: "success", label: "AI Verified" },
};

function ConfidenceBar({ score }: { score: number }) {
  const color = score >= 90 ? "#10b981" : score >= 70 ? "#f59e0b" : "#ef4444";
  const label = score >= 90 ? "High" : score >= 70 ? "Medium" : "Low";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Confidence</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold tabular-nums" style={{ color }}>{score}%</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${color}18`, color }}>
            {label}
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color, boxShadow: `0 0 12px ${color}30` }}
        />
      </div>
    </div>
  );
}

export default function VerificationPage() {
  const [queue, setQueue] = React.useState(mockVerificationQueue);
  const [activeTab, setActiveTab] = React.useState("pending");
  const [rejectModalId, setRejectModalId] = React.useState<string | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [approvedToast, setApprovedToast] = React.useState<string | null>(null);

  const pending = queue.filter(v => v.status === "pending");
  const autoApproved = queue.filter(v => v.status === "auto_approved");
  const approved = queue.filter(v => v.status === "approved");
  const rejected = queue.filter(v => v.status === "rejected");

  const tabs = [
    { id: "pending", label: "Pending", count: pending.length },
    { id: "auto_approved", label: "AI Verified", count: autoApproved.length },
    { id: "approved", label: "Approved", count: approved.length },
    { id: "rejected", label: "Rejected", count: rejected.length },
    { id: "all", label: "All", count: queue.length },
  ];

  const filtered = activeTab === "all"
    ? queue
    : queue.filter(v => v.status === activeTab);

  const handleApprove = (id: string) => {
    const ver = queue.find(v => v.id === id);
    setQueue(prev => prev.map(v =>
      v.id === id ? { ...v, status: "approved" as const, reviewedBy: "Frank Johnson", reviewedAt: new Date().toISOString() } : v
    ));
    if (ver) {
      setApprovedToast(ver.proName);
      setTimeout(() => setApprovedToast(null), 3000);
    }
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
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">License Verification</h1>
        <p className="mt-1 text-sm text-slate-400">
          Review and approve professional license credentials. AI auto-verifies high-confidence submissions.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6 stagger-children">
        <div className="rounded-2xl border border-amber-500/10 bg-gradient-to-b from-amber-500/8 to-transparent p-4 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-amber-500/10 blur-xl" />
          <div className="relative">
            <div className="text-2xl font-bold text-amber-400 tabular-nums">{pending.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Pending Review</div>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-500/10 bg-gradient-to-b from-emerald-500/8 to-transparent p-4 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-emerald-500/10 blur-xl" />
          <div className="relative">
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">{autoApproved.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">AI Auto-Approved</div>
          </div>
        </div>
        <div className="rounded-2xl border border-violet-500/10 bg-gradient-to-b from-violet-500/8 to-transparent p-4 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-violet-500/10 blur-xl" />
          <div className="relative">
            <div className="text-2xl font-bold text-violet-400 tabular-nums">{approved.length + autoApproved.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Total Verified</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
      </div>

      {/* Queue */}
      <div className="space-y-3">
        {filtered.map((ver) => {
          const badge = statusBadge[ver.status];
          const isExpanded = expandedId === ver.id;

          return (
            <Card key={ver.id} padding="none" className="overflow-hidden glow-violet">
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold border transition-transform hover:scale-105 ${
                      ver.autoVerified
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
                        : "bg-violet-500/10 text-violet-400 border-violet-500/10"
                    }`}>
                      {ver.autoVerified ? (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-emerald-400">
                          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      ) : (
                        ver.proName.split(" ").map(n => n[0]).join("")
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-100">{ver.proName}</span>
                        {ver.autoVerified && (
                          <Badge variant="success" className="text-[9px] px-1.5 py-0 gap-0.5">
                            <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            AI Verified
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{ver.companyName}</div>
                    </div>
                  </div>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>

                {/* Details grid */}
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
                    <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Type</div>
                    <div className="mt-0.5 text-sm text-slate-300">{ver.licenseType}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Submitted</div>
                    <div className="mt-0.5 text-sm text-slate-300">{formatTimeAgo(ver.submittedAt)}</div>
                  </div>
                </div>

                {/* OCR Data Section */}
                {ver.ocrData && (
                  <div className="mt-4">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : ver.id)}
                      className="flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition-colors group"
                    >
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                        className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="group-hover:underline">OCR Verification Data</span>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 rounded-xl border border-[var(--border)] bg-white/[0.02] p-4 space-y-4 animate-in">
                        {/* Confidence Score */}
                        <ConfidenceBar score={ver.ocrData.confidenceScore} />

                        {/* Extracted fields */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Extracted Name</div>
                            <div className="mt-0.5 flex items-center gap-1.5">
                              <span className="text-sm text-slate-300">{ver.ocrData.extractedName}</span>
                              {ver.ocrData.nameMatch ? (
                                <div className="flex items-center gap-0.5 text-emerald-400">
                                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                                  <span className="text-[9px] font-medium">Match</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-0.5 text-red-400">
                                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                  <span className="text-[9px] font-medium">Mismatch</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Extracted License #</div>
                            <div className="mt-0.5 flex items-center gap-1.5">
                              <span className="text-sm text-slate-300 font-mono">{ver.ocrData.extractedLicenseNumber}</span>
                              {ver.ocrData.licenseMatch ? (
                                <div className="flex items-center gap-0.5 text-emerald-400">
                                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                                  <span className="text-[9px] font-medium">Match</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-0.5 text-red-400">
                                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                  <span className="text-[9px] font-medium">Mismatch</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Expiration</div>
                            <div className="mt-0.5 text-sm text-slate-300">{ver.ocrData.extractedExpiry ?? "Not found"}</div>
                          </div>
                          <div>
                            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">State</div>
                            <div className="mt-0.5 text-sm text-slate-300">{ver.ocrData.extractedState}</div>
                          </div>
                        </div>

                        {/* Document preview placeholder */}
                        <div className="rounded-xl border border-dashed border-[var(--border)] bg-white/[0.01] p-6 text-center">
                          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-slate-600">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-xs text-slate-500">
                            {ver.documentType === "pdf" ? "PDF Document" : "Image Document"} uploaded
                          </p>
                          <button className="mt-2 text-xs text-violet-400 hover:text-violet-300 transition-colors hover:underline">View document →</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Rejection reason */}
                {ver.rejectionReason && (
                  <div className="mt-3 rounded-xl bg-red-500/8 border border-red-500/15 px-4 py-2.5">
                    <p className="text-xs text-red-400">
                      <span className="font-medium">Rejection reason: </span>
                      {ver.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Reviewed info */}
                {ver.reviewedBy && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                    <div className="h-1 w-1 rounded-full bg-slate-700" />
                    {ver.autoVerified ? (
                      <>AI auto-verified in {Math.floor(Math.random() * 15 + 5)}s · {ver.reviewedAt ? formatDate(ver.reviewedAt) : ""}</>
                    ) : (
                      <>Reviewed by {ver.reviewedBy} · {ver.reviewedAt ? formatDate(ver.reviewedAt) : ""}</>
                    )}
                  </div>
                )}
              </div>

              {/* Actions (only for pending) */}
              {ver.status === "pending" && (
                <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] bg-white/[0.01] px-4 sm:px-5 py-3">
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
                  <div className="flex-1" />
                  {ver.ocrData && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span>Confidence:</span>
                      <span className={`font-semibold tabular-nums ${
                        ver.ocrData.confidenceScore >= 90 ? "text-emerald-400" : ver.ocrData.confidenceScore >= 70 ? "text-amber-400" : "text-red-400"
                      }`}>
                        {ver.ocrData.confidenceScore}%
                      </span>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <Card padding="lg" className="text-center py-16">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-600">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-400">No verification requests</p>
            <p className="text-xs text-slate-600 mt-1">There are no items in this category right now.</p>
          </Card>
        )}
      </div>

      {/* Approved toast */}
      {approvedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-xl px-4 py-3 shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-in">
          <svg width="16" height="16" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span className="text-sm font-medium text-emerald-400">{approvedToast} approved</span>
        </div>
      )}

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
