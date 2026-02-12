import * as React from "react";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "danger" | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-slate-100 text-slate-700",
    accent: "bg-[var(--accent-light)] text-[var(--accent)]",
    success: "bg-[var(--success-light)] text-emerald-700",
    warning: "bg-[var(--warning-light)] text-amber-700",
    danger: "bg-[var(--danger-light)] text-red-700",
    outline: "bg-white border border-[var(--border)] text-slate-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
