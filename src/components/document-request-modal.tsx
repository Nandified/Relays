"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { type DocCategory, DOC_CATEGORY_META } from "@/lib/types";

interface DocumentRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: { category: DocCategory; note: string }) => void;
  /** Already-added doc categories to exclude from the list */
  existingCategories?: DocCategory[];
}

const ALL_CATEGORIES: DocCategory[] = [
  "pre_approval_letter",
  "inspection_report",
  "appraisal",
  "insurance_binder",
  "title_commitment",
  "closing_disclosure",
  "purchase_agreement",
  "amendment",
  "other",
];

export function DocumentRequestModal({
  open,
  onClose,
  onSubmit,
  existingCategories = [],
}: DocumentRequestModalProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<DocCategory | null>(null);
  const [note, setNote] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

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

  React.useEffect(() => {
    if (open) {
      setSelectedCategory(null);
      setNote("");
      setSubmitted(false);
    }
  }, [open]);

  const handleSubmit = () => {
    if (!selectedCategory) return;
    setSubmitted(true);
    onSubmit?.({ category: selectedCategory, note });
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!open) return null;

  const availableCategories = ALL_CATEGORIES.filter(
    (cat) => !existingCategories.includes(cat)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-md animate-in">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-modal)] backdrop-blur-xl">
          {submitted ? (
            /* Success state */
            <div className="flex flex-col items-center py-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <svg width="28" height="28" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-100">Document Requested</h3>
              <p className="text-sm text-slate-500 mt-1">
                Your client will be notified to upload the document.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">Request Document</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select a document type and add an optional note
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 text-slate-500 hover:bg-white/5 hover:text-slate-300"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Category selection */}
              <div className="mb-4">
                <span className="mb-2 block text-sm font-medium text-slate-300">Document Type</span>
                <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
                  {availableCategories.map((cat) => {
                    const meta = DOC_CATEGORY_META[cat];
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`
                          w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200
                          ${
                            isSelected
                              ? "bg-blue-500/10 border border-blue-500/20 ring-1 ring-blue-500/10"
                              : "border border-transparent hover:bg-white/[0.03]"
                          }
                        `}
                      >
                        <span className="text-base flex-shrink-0">{meta.icon}</span>
                        <div className="min-w-0 flex-1">
                          <span className={`text-sm font-medium ${isSelected ? "text-blue-300" : "text-slate-300"}`}>
                            {meta.label}
                          </span>
                          <span className="text-[11px] text-slate-600 block">{meta.description}</span>
                        </div>
                        {isSelected && (
                          <svg width="16" height="16" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0">
                            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    );
                  })}
                  {availableCategories.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">
                      All document types have been added to this journey.
                    </p>
                  )}
                </div>
              </div>

              {/* Note input */}
              <div className="mb-5">
                <Input
                  label="Note to client (optional)"
                  placeholder="e.g., Please upload your pre-approval letter from your lender"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!selectedCategory}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Send Request
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
