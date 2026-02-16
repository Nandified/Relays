"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DocumentUpload, formatFileSize } from "@/components/document-upload";
import { DocumentViewerModal } from "@/components/document-viewer-modal";
import {
  type JourneyDocument,
  type DocCategory,
  type DocStatus,
  DOC_CATEGORY_META,
} from "@/lib/types";
import {
  getPendingDocumentsForPro,
  getConsumerActionableDocuments,
  getDocumentsForJourney,
  mockJourneys,
  getDocumentStats,
} from "@/lib/mock-data";

/* ── Shared status indicator ─────────────────────────────────── */
function StatusDot({ status }: { status: DocStatus }) {
  const colors: Record<DocStatus, string> = {
    needed: "bg-slate-600",
    requested: "bg-amber-500 animate-doc-pulse-amber-dot",
    uploaded: "bg-blue-500",
    reviewed: "bg-blue-400",
    approved: "bg-emerald-500",
  };
  return <div className={`h-2 w-2 rounded-full ${colors[status]}`} />;
}

function StatusBadgeSmall({ status }: { status: DocStatus }) {
  const config: Record<DocStatus, { variant: "default" | "accent" | "success" | "warning"; label: string }> = {
    needed: { variant: "default", label: "Needed" },
    requested: { variant: "warning", label: "Requested" },
    uploaded: { variant: "accent", label: "Uploaded" },
    reviewed: { variant: "accent", label: "In Review" },
    approved: { variant: "success", label: "Approved" },
  };
  const c = config[status];
  return <Badge variant={c.variant} className="text-[10px]">{c.label}</Badge>;
}

/* ── Consumer View ────────────────────────────────────────────── */
function ConsumerDocumentsView() {
  const [viewerDoc, setViewerDoc] = useState<JourneyDocument | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [expandedUpload, setExpandedUpload] = useState<string | null>(null);

  // Group by journey
  const journeyDocs = mockJourneys
    .filter((j) => j.status === "active")
    .map((j) => ({
      journey: j,
      docs: getDocumentsForJourney(j.id),
      stats: getDocumentStats(j.id),
    }))
    .filter((g) => g.docs.length > 0);

  const actionableDocs = getConsumerActionableDocuments();

  return (
    <div>
      {/* Action required callout */}
      {actionableDocs.length > 0 && (
        <div className="mb-6 rounded-2xl border border-amber-500/10 bg-amber-500/[0.04] p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
              <svg width="16" height="16" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-amber-300">
                {actionableDocs.length} document{actionableDocs.length !== 1 ? "s" : ""} need your attention
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Your pro team is waiting for these documents to keep your journey on track.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Journey groups */}
      <div className="space-y-6">
        {journeyDocs.map(({ journey, docs, stats }) => {
          const pct = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

          return (
            <div key={journey.id} className="rounded-2xl border border-[var(--border)] overflow-hidden">
              {/* Journey header */}
              <div className="flex items-center justify-between px-5 py-4 bg-[var(--bg-card)]/80 border-b border-[var(--border)]">
                <div className="min-w-0">
                  <Link
                    href={`/journey/${journey.id}`}
                    className="text-sm font-semibold text-slate-100 hover:text-white transition-colors"
                  >
                    {journey.title}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">{journey.address}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-slate-400 tabular-nums">{stats.approved}/{stats.total}</span>
                    <div className="h-1.5 w-20 rounded-full bg-white/5 mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <Link href={`/journey/${journey.id}`}>
                    <Button size="sm" variant="ghost" className="text-xs">
                      View Journey →
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Document rows */}
              <div className="divide-y divide-[var(--border)]">
                {docs.map((doc: JourneyDocument) => {
                  const meta = DOC_CATEGORY_META[doc.category as DocCategory];
                  const isActionable = doc.status === "needed" || doc.status === "requested";

                  return (
                    <div key={doc.id}>
                      <div
                        className={`
                          flex items-center gap-3 px-5 py-3 transition-colors
                          ${isActionable ? "bg-amber-500/[0.02]" : ""}
                          hover:bg-white/[0.02]
                        `}
                      >
                        <StatusDot status={doc.status} />
                        <span className="text-base flex-shrink-0">{meta.icon}</span>
                        <div className="min-w-0 flex-1">
                          <span className="text-sm text-slate-200">{doc.title}</span>
                          {doc.notes && isActionable && (
                            <p className="text-[11px] text-amber-400/70 truncate mt-0.5">📝 {doc.notes}</p>
                          )}
                        </div>
                        <StatusBadgeSmall status={doc.status} />
                        <div className="flex items-center gap-1.5">
                          {doc.fileUrl && (
                            <button
                              onClick={() => {
                                setViewerDoc(doc);
                                setViewerOpen(true);
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-colors"
                            >
                              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round"/>
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>
                          )}
                          {isActionable && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="text-[11px] px-2.5 py-1"
                              onClick={() => setExpandedUpload(expandedUpload === doc.id ? null : doc.id)}
                            >
                              Upload
                            </Button>
                          )}
                        </div>
                      </div>
                      {/* Expanded upload zone */}
                      {expandedUpload === doc.id && isActionable && (
                        <div className="px-5 pb-4 pt-1 animate-in">
                          <DocumentUpload
                            compact
                            label={`Upload ${meta.label}`}
                            description="Drag & drop or click to browse"
                            onFileSelect={(file) => {
                              console.log("Upload:", doc.id, file.name);
                              setExpandedUpload(null);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Viewer modal */}
      <DocumentViewerModal
        document={viewerDoc}
        open={viewerOpen}
        onClose={() => {
          setViewerOpen(false);
          setViewerDoc(null);
        }}
        showProActions={false}
      />
    </div>
  );
}

/* ── Pro View ─────────────────────────────────────────────────── */
function ProDocumentsView() {
  const [viewerDoc, setViewerDoc] = useState<JourneyDocument | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const pendingDocs = getPendingDocumentsForPro();

  // Group by journey
  const grouped: Record<string, typeof pendingDocs> = {};
  for (const doc of pendingDocs) {
    if (!grouped[doc.journeyId]) grouped[doc.journeyId] = [];
    grouped[doc.journeyId].push(doc);
  }

  const journeyGroups = Object.entries(grouped);
  const needsReview = pendingDocs.filter((d) => d.status === "uploaded").length;
  const awaiting = pendingDocs.filter((d) => d.status === "requested").length;

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-6 w-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg width="12" height="12" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-slate-100 tabular-nums">{needsReview}</span>
          </div>
          <span className="text-xs text-slate-500">Needs review</span>
        </div>
        <div className="rounded-2xl border border-amber-500/10 bg-amber-500/[0.04] p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-6 w-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg width="12" height="12" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-slate-100 tabular-nums">{awaiting}</span>
          </div>
          <span className="text-xs text-slate-500">Awaiting upload</span>
        </div>
      </div>

      {/* Journey groups */}
      <div className="space-y-4">
        {journeyGroups.map(([journeyId, docs]) => {
          const first = docs[0];
          return (
            <div key={journeyId} className="rounded-2xl border border-[var(--border)] overflow-hidden">
              {/* Group header */}
              <div className="flex items-center justify-between px-5 py-3 bg-[var(--bg-card)]/80 border-b border-[var(--border)]">
                <div>
                  <Link
                    href={`/journey/${journeyId}`}
                    className="text-sm font-semibold text-slate-100 hover:text-white transition-colors"
                  >
                    {first.journeyTitle}
                  </Link>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Client: {first.clientName} · {docs.length} pending
                  </p>
                </div>
                <Link href={`/journey/${journeyId}`}>
                  <Button size="sm" variant="ghost" className="text-xs">
                    Open →
                  </Button>
                </Link>
              </div>

              {/* Document rows */}
              <div className="divide-y divide-[var(--border)]">
                {docs.map((doc) => {
                  const meta = DOC_CATEGORY_META[doc.category as DocCategory];
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors"
                    >
                      <StatusDot status={doc.status} />
                      <span className="text-base flex-shrink-0">{meta.icon}</span>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm text-slate-200">{doc.title}</span>
                        {doc.uploadedBy && (
                          <p className="text-[11px] text-slate-500">
                            Uploaded by {doc.uploadedBy}
                            {doc.uploadedAt && (
                              <> · {new Date(doc.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</>
                            )}
                          </p>
                        )}
                      </div>
                      <StatusBadgeSmall status={doc.status} />
                      <div className="flex items-center gap-1.5">
                        {doc.status === "uploaded" && (
                          <Button
                            size="sm"
                            className="text-[11px] px-2.5 py-1 bg-emerald-500/90 hover:bg-emerald-500"
                            onClick={() => {
                              setViewerDoc(doc);
                              setViewerOpen(true);
                            }}
                          >
                            Review
                          </Button>
                        )}
                        {doc.status === "requested" && (
                          <span className="text-[11px] text-amber-400/70 italic">Waiting...</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {journeyGroups.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/[0.02] p-12 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <svg width="28" height="28" fill="none" stroke="#10b981" strokeWidth="1.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-sm font-medium text-slate-300">All caught up!</h3>
            <p className="text-xs text-slate-500">No pending documents to review.</p>
          </div>
        </div>
      )}

      {/* Viewer modal */}
      <DocumentViewerModal
        document={viewerDoc}
        open={viewerOpen}
        onClose={() => {
          setViewerOpen(false);
          setViewerDoc(null);
        }}
        onApprove={(id) => {
          console.log("Approve:", id);
          setViewerOpen(false);
        }}
        onRequestRevision={(id) => {
          console.log("Request revision:", id);
          setViewerOpen(false);
        }}
        onDelete={(id) => {
          console.log("Delete:", id);
          setViewerOpen(false);
        }}
        showProActions={true}
      />
    </div>
  );
}

/* ── Main Documents Page ──────────────────────────────────────── */
export default function DocumentsPage() {
  const [view, setView] = useState("consumer");

  const tabs = [
    { id: "consumer", label: "My Documents" },
    { id: "pro", label: "Client Documents" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-20">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
            <svg width="18" height="18" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8M16 17H8M10 9H8" strokeLinecap="round"/>
            </svg>
          </div>
          Documents
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track, upload, and manage documents across your journeys
        </p>
      </div>

      {/* View toggle */}
      <div className="mb-6">
        <Tabs tabs={tabs} activeId={view} onChange={setView} />
      </div>

      {/* Content */}
      {view === "consumer" ? <ConsumerDocumentsView /> : <ProDocumentsView />}
    </div>
  );
}
