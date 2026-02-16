"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { type JourneyDocument, DOC_CATEGORY_META } from "@/lib/types";
import { formatFileSize } from "@/components/document-upload";

interface DocumentViewerModalProps {
  document: JourneyDocument | null;
  open: boolean;
  onClose: () => void;
  onApprove?: (docId: string) => void;
  onRequestRevision?: (docId: string) => void;
  onDelete?: (docId: string) => void;
  /** Show pro actions (approve/revision/delete) */
  showProActions?: boolean;
}

function StatusBadge({ status }: { status: JourneyDocument["status"] }) {
  const config: Record<string, { variant: "default" | "accent" | "success" | "warning" | "danger"; label: string }> = {
    needed: { variant: "default", label: "Needed" },
    requested: { variant: "warning", label: "Requested" },
    uploaded: { variant: "accent", label: "Uploaded" },
    reviewed: { variant: "accent", label: "Under Review" },
    approved: { variant: "success", label: "Approved" },
  };
  const c = config[status] ?? config.needed;
  return <Badge variant={c.variant}>{c.label}</Badge>;
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function DocumentViewerModal({
  document: doc,
  open,
  onClose,
  onApprove,
  onRequestRevision,
  onDelete,
  showProActions = true,
}: DocumentViewerModalProps) {
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !doc) return null;

  const meta = DOC_CATEGORY_META[doc.category];
  const isImage = doc.fileType?.startsWith("image/");
  const isPdf = doc.fileType === "application/pdf";
  const hasFile = !!doc.fileUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] sm:pt-[12vh]">
      {/* Backdrop */}
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-lg animate-in">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-modal)] backdrop-blur-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-lg">
                {meta.icon}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-100 truncate">{doc.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{meta.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-full p-1.5 text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-colors ml-3"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Status + File Preview */}
          <div className="p-6">
            {/* Status row */}
            <div className="flex items-center gap-2 mb-5">
              <StatusBadge status={doc.status} />
              {doc.fileType && (
                <Badge variant="outline">
                  {doc.fileType.split("/")[1]?.toUpperCase() || "FILE"}
                </Badge>
              )}
              {doc.fileSize && (
                <span className="text-xs text-slate-500">{formatFileSize(doc.fileSize)}</span>
              )}
            </div>

            {/* File preview */}
            {hasFile && (
              <div className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
                {isImage ? (
                  <div className="relative aspect-[4/3] flex items-center justify-center bg-slate-900/50">
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-blue-400/50">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-xs">Image preview</span>
                    </div>
                  </div>
                ) : isPdf ? (
                  <div className="flex items-center justify-center py-12 bg-slate-900/30">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-red-400">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <text x="8" y="18" fill="currentColor" fontSize="6" fontWeight="bold">PDF</text>
                        </svg>
                      </div>
                      <span className="text-xs text-slate-500">PDF Document</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12 bg-slate-900/30">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-blue-400">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-xs text-slate-500">Document</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No file yet */}
            {!hasFile && (
              <div className="mb-5 rounded-2xl border border-dashed border-[var(--border)] bg-white/[0.02] p-8 text-center">
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-slate-600">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round"/>
                  </svg>
                  <span className="text-sm">No file uploaded yet</span>
                </div>
              </div>
            )}

            {/* Document details */}
            <div className="space-y-3 text-sm">
              {doc.description && (
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Description</span>
                  <span className="text-slate-300">{doc.description}</span>
                </div>
              )}

              {doc.notes && (
                <div className="rounded-xl bg-amber-500/[0.06] border border-amber-500/10 p-3">
                  <div className="flex items-start gap-2">
                    <svg width="14" height="14" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5">
                      <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round"/>
                    </svg>
                    <span className="text-xs text-amber-300/80">{doc.notes}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]">
                {doc.uploadedBy && (
                  <div>
                    <span className="text-[11px] text-slate-600 block">Uploaded by</span>
                    <span className="text-xs text-slate-300">{doc.uploadedBy}</span>
                  </div>
                )}
                {doc.uploadedAt && (
                  <div>
                    <span className="text-[11px] text-slate-600 block">Uploaded</span>
                    <span className="text-xs text-slate-300">{formatDate(doc.uploadedAt)}</span>
                  </div>
                )}
                {doc.requestedBy && (
                  <div>
                    <span className="text-[11px] text-slate-600 block">Requested by</span>
                    <span className="text-xs text-slate-300">{doc.requestedBy}</span>
                  </div>
                )}
                {doc.requestedAt && (
                  <div>
                    <span className="text-[11px] text-slate-600 block">Requested</span>
                    <span className="text-xs text-slate-300">{formatDate(doc.requestedAt)}</span>
                  </div>
                )}
                {doc.reviewedBy && (
                  <div>
                    <span className="text-[11px] text-slate-600 block">Reviewed by</span>
                    <span className="text-xs text-slate-300">{doc.reviewedBy}</span>
                  </div>
                )}
                {doc.reviewedAt && (
                  <div>
                    <span className="text-[11px] text-slate-600 block">Reviewed</span>
                    <span className="text-xs text-slate-300">{formatDate(doc.reviewedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions footer */}
          <div className="flex items-center gap-2 border-t border-[var(--border)] px-6 py-4">
            {hasFile && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  /* mock download */
                }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round"/>
                </svg>
                Download
              </Button>
            )}

            {showProActions && hasFile && (doc.status === "uploaded" || doc.status === "reviewed") && (
              <>
                <Button
                  size="sm"
                  onClick={() => onApprove?.(doc.id)}
                  className="bg-emerald-500/90 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onRequestRevision?.(doc.id)}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
                    <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Request Revision
                </Button>
              </>
            )}

            {showProActions && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete?.(doc.id)}
                className="ml-auto text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
