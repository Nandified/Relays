"use client";

import * as React from "react";

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      <div className="relative mx-auto mt-24 w-[92vw] max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-elevated)]">
          {title ? <div className="mb-3 text-base font-semibold text-slate-900">{title}</div> : null}
          {children}
        </div>
      </div>
    </div>
  );
}
