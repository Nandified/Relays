import * as React from "react";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "danger" | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-black/5 dark:border-white/5",
    accent: "bg-[var(--accent-light)] text-blue-500 dark:text-blue-400 border border-blue-500/10",
    success: "bg-[var(--success-light)] text-emerald-400 border border-emerald-500/10",
    warning: "bg-[var(--warning-light)] text-amber-400 border border-amber-500/10",
    danger: "bg-[var(--danger-light)] text-red-400 border border-red-500/10",
    outline: "bg-transparent border border-[var(--border)] text-slate-600 dark:text-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
