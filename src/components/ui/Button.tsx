"use client";

import * as React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ className = "", variant = "primary", size = "md", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center font-medium transition-all duration-200 transform-gpu focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants: Record<Variant, string> = {
    primary:
      "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] hover:brightness-[1.06] active:brightness-[0.98] focus-visible:ring-[var(--accent)] shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_34px_rgba(59,130,246,0.32)] active:scale-[0.98]",
    secondary:
      "bg-[var(--bg-card)] text-slate-800 dark:text-slate-200 border border-[var(--border)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.10)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.45)] active:scale-[0.99] focus-visible:ring-slate-500",
    ghost:
      "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 focus-visible:ring-slate-500",
    danger:
      "bg-red-500/90 text-white hover:bg-red-500 hover:brightness-[1.04] active:brightness-[0.98] focus-visible:ring-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)] active:scale-[0.98]",
  };

  const sizes: Record<Size, string> = {
    sm: "rounded-xl px-3 py-1.5 text-xs",
    md: "rounded-2xl px-4 py-2 text-sm",
    lg: "rounded-2xl px-6 py-3 text-base",
  };

  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
