"use client";

import * as React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ className = "", label, options, ...props }: SelectProps) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>}
      <select
        className={`
          w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-slate-900
          outline-none transition-all appearance-none
          focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}
