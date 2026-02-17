"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DocumentUpload, formatFileSize } from "@/components/document-upload";
import { DocumentViewerModal } from "@/components/document-viewer-modal";
import { DocumentRequestModal } from "@/components/document-request-modal";
import {
  type JourneyDocument,
  type DocCategory,
  type DocStatus,
  DOC_CATEGORY_META,
} from "@/lib/types";
import { getDocumentsForJourney, getDocumentStats } from "@/lib/mock-data";

/* ── Status indicator icons ──────────────────────────────────── */
function StatusIndicator({ status }: { status: DocStatus }) {
  switch (status) {
    case "needed":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600/50 transition-colors">
          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600/50" />
        </div>
      );
    case "requested":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-amber-500/40 bg-amber-500/10 animate-doc-pulse-amber">
          <svg width="14" height="14" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" strokeLinecap="round" />
          </svg>
        </div>
      );
    case "uploaded":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-500/40 bg-blue-500/10">
          <svg width="14" height="14" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    case "reviewed":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-500/40 bg-blue-500/10">
          <svg width="14" height="14" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      );
    case "approved":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
          <svg width="14" height="14" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
  }
}

/* ── Status label for row ─────────────────────────────────────── */
function statusLabel(status: DocStatus): { text: string; color: string } {
  switch (status) {
    case "needed":
      return { text: "Needed", color: "text-slate-500" };
    case "requested":
      return { text: "Requested", color: "text-amber-400" };
    case "uploaded":
      return { text: "Uploaded", color: "text-blue-400" };
    case "reviewed":
      return { text: "Under Review", color: "text-blue-400" };
    case "approved":
      return { text: "Approved", color: "text-emerald-400" };
  }
}

/* ── File type icon (compact) ─────────────────────────────────── */
function FileTypeChip({ type }: { type?: string }) {
  if (!type) return null;
  const label = type.includes("pdf")
    ? "PDF"
    : type.startsWith("image/")
    ? type.split("/")[1]?.toUpperCase()
    : "DOC";
  const color = type.includes("pdf")
    ? "text-red-400 bg-red-500/10 border-red-500/15"
    : type.startsWith("image/")
    ? "text-blue-400 bg-blue-500/10 border-blue-500/15"
    : "text-slate-500 dark:text-slate-400 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10";
  return (
    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium border ${color}`}>
      {label}
    </span>
  );
}

/* ── Document Row ─────────────────────────────────────────────── */
function DocumentRow({
  doc,
  onView,
  onUpload,
}: {
  doc: JourneyDocument;
  onView: (doc: JourneyDocument) => void;
  onUpload: (doc: JourneyDocument) => void;
}) {
  const meta = DOC_CATEGORY_META[doc.category as keyof typeof DOC_CATEGORY_META];
  const { text: statusText, color: statusColor } = statusLabel(doc.status);
  const hasFile = !!doc.fileUrl;

  return (
    <div
      className={`
        group relative flex items-center gap-3 rounded-2xl border p-3.5 sm:p-4 transition-all duration-300
        ${
          doc.status === "approved"
            ? "border-emerald-500/10 bg-emerald-500/[0.02]"
            : doc.status === "requested"
            ? "border-amber-500/10 bg-amber-500/[0.02]"
            : doc.status === "uploaded" || doc.status === "reviewed"
            ? "border-blue-500/10 bg-blue-500/[0.02]"
            : "border-[var(--border)] bg-[var(--bg-card)]/60"
        }
        hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)]
      `}
    >
      {/* Status indicator */}
      <div className="flex-shrink-0">
        <StatusIndicator status={doc.status} />
      </div>

      {/* Document info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-base flex-shrink-0">{meta.icon}</span>
          <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{doc.title}</h4>
          <FileTypeChip type={doc.fileType} />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs ${statusColor}`}>{statusText}</span>
          {doc.uploadedBy && (
            <>
              <span className="text-[10px] text-slate-700">•</span>
              <span className="text-[11px] text-slate-500">by {doc.uploadedBy}</span>
            </>
          )}
          {doc.fileSize && (
            <>
              <span className="text-[10px] text-slate-700">•</span>
              <span className="text-[11px] text-slate-500">{formatFileSize(doc.fileSize)}</span>
            </>
          )}
          {doc.uploadedAt && (
            <>
              <span className="text-[10px] text-slate-700 hidden sm:inline">•</span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                {new Date(doc.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </>
          )}
        </div>
        {doc.notes && doc.status === "requested" && (
          <p className="text-[11px] text-amber-400/70 mt-1 truncate">
            📝 {doc.notes}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
        {hasFile && (
          <button
            onClick={() => onView(doc)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title="View document"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        )}
        {(doc.status === "needed" || doc.status === "requested") && (
          <Button size="sm" variant="secondary" onClick={() => onUpload(doc)} className="text-xs">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round"/>
            </svg>
            Upload
          </Button>
        )}
      </div>
    </div>
  );
}

/* ── Progress Bar ─────────────────────────────────────────────── */
function DocumentProgress({ journeyId }: { journeyId: string }) {
  const stats = getDocumentStats(journeyId);
  if (stats.total === 0) return null;

  const pct = Math.round((stats.approved / stats.total) * 100);
  const allDone = stats.approved === stats.total;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            allDone
              ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
              : "bg-gradient-to-r from-blue-500 to-blue-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
        {stats.approved}/{stats.total} approved
      </span>
    </div>
  );
}

/* ── Main Journey Documents Section ──────────────────────────── */
export function JourneyDocumentsSection({ journeyId }: { journeyId: string }) {
  const [viewerDoc, setViewerDoc] = React.useState<JourneyDocument | null>(null);
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [requestOpen, setRequestOpen] = React.useState(false);
  const [uploadDocId, setUploadDocId] = React.useState<string | null>(null);

  const documents = getDocumentsForJourney(journeyId);
  const stats = getDocumentStats(journeyId);

  const existingCategories = documents.map((d) => d.category);

  // Sort: requested first, then needed, then uploaded, then approved
  const sortOrder: Record<DocStatus, number> = {
    requested: 0,
    needed: 1,
    uploaded: 2,
    reviewed: 3,
    approved: 4,
  };
  const sortedDocs = [...documents].sort(
    (a, b) => (sortOrder[a.status as keyof typeof sortOrder] ?? 0) - (sortOrder[b.status as keyof typeof sortOrder] ?? 0)
  );

  const handleView = (doc: JourneyDocument) => {
    setViewerDoc(doc);
    setViewerOpen(true);
  };

  const handleUploadClick = (doc: JourneyDocument) => {
    setUploadDocId(uploadDocId === doc.id ? null : doc.id);
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-blue-400">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8M16 17H8M10 9H8" strokeLinecap="round"/>
            </svg>
            Documents
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-slate-500">
              {stats.approved} approved · {stats.uploaded} pending review · {stats.requested + stats.needed} outstanding
            </span>
          </div>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setRequestOpen(true)}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8m-4-4h8" strokeLinecap="round"/>
          </svg>
          Request
        </Button>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <DocumentProgress journeyId={journeyId} />
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {sortedDocs.map((doc) => (
          <div key={doc.id}>
            <DocumentRow doc={doc} onView={handleView} onUpload={handleUploadClick} />

            {/* Expandable upload zone */}
            {uploadDocId === doc.id && (doc.status === "needed" || doc.status === "requested") && (
              <div className="mt-2 ml-11 animate-in">
                <DocumentUpload
                  compact
                  label={`Upload ${DOC_CATEGORY_META[doc.category as keyof typeof DOC_CATEGORY_META].label}`}
                  description="Drag & drop or click to browse"
                  onFileSelect={(file) => {
                    // Mock: in real app, this would upload
                    console.log("File selected for", doc.id, file.name);
                    setUploadDocId(null);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {documents.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-black/[0.02] dark:bg-white/[0.02] p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
              <svg width="24" height="24" fill="none" stroke="#475569" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">No documents yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-600">
              Documents will appear here as your journey progresses
            </p>
            <Button size="sm" variant="secondary" onClick={() => setRequestOpen(true)} className="mt-2">
              Request a Document
            </Button>
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
      />

      {/* Request modal */}
      <DocumentRequestModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        onSubmit={(data) => {
          console.log("Request submitted:", data);
        }}
        existingCategories={existingCategories}
      />
    </div>
  );
}
