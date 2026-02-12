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
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<Variant, string> = {
    primary:
      "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] focus-visible:ring-[var(--accent)] shadow-sm",
    secondary:
      "bg-white text-slate-900 border border-[var(--border)] hover:bg-slate-50 focus-visible:ring-slate-300",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-300",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400",
  };

  const sizes: Record<Size, string> = {
    sm: "rounded-xl px-3 py-1.5 text-xs",
    md: "rounded-2xl px-4 py-2 text-sm",
    lg: "rounded-2xl px-6 py-3 text-base",
  };

  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
