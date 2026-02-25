"use client";

import * as React from "react";

type ModalSize = "sm" | "md" | "lg" | "xl";

export function Modal({
  open,
  title,
  children,
  onClose,
  size = "md",
  className = "",
}: {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: ModalSize;
  className?: string;
}) {
  const titleId = React.useId();
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const lastActiveElementRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (open) {
      lastActiveElementRef.current = document.activeElement as HTMLElement | null;
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";

      // Focus the close button when the modal opens for keyboard users.
      // (A full focus trap is out-of-scope for this lightweight modal.)
      queueMicrotask(() => closeButtonRef.current?.focus());
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      // Restore focus to the previously focused element.
      if (open) lastActiveElementRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeMap: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`relative mx-4 w-full ${sizeMap[size]} animate-in ${className}`}
      >
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-modal)] backdrop-blur-xl">
          {title && (
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id={titleId} className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
