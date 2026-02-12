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
        {label && <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>}
        <input
          ref={ref}
          className={`
            w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-slate-900
            placeholder:text-slate-400 outline-none transition-all
            focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]
            ${error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
      </label>
    );
  }
);
