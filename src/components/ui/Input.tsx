"use client";

import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className = "", label, error, ...props }, ref) {
    return (
      <label className="block">
        {label && <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>}
        <input
          ref={ref}
          className={`
            w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200
            placeholder:text-slate-500 outline-none transition-all
            focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent-light)]
            ${error ? "border-red-500/30 focus:border-red-400/50 focus:ring-red-500/10" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
      </label>
    );
  }
);
