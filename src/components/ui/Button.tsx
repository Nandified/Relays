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
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants: Record<Variant, string> = {
    primary:
      "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] focus-visible:ring-[var(--accent)] shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    secondary:
      "bg-[var(--bg-card)] text-slate-800 dark:text-slate-200 border border-[var(--border)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] focus-visible:ring-slate-500",
    ghost:
      "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 focus-visible:ring-slate-500",
    danger:
      "bg-red-500/90 text-white hover:bg-red-500 focus-visible:ring-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]",
  };

  const sizes: Record<Size, string> = {
    sm: "rounded-xl px-3 py-1.5 text-xs",
    md: "rounded-2xl px-4 py-2 text-sm",
    lg: "rounded-2xl px-6 py-3 text-base",
  };

  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
