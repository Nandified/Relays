"use client";

import * as React from "react";

type Variant = "primary" | "secondary" | "ghost";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ className = "", variant = "primary", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<Variant, string> = {
    primary: "bg-[var(--accent)] text-white hover:opacity-95 focus:ring-[var(--accent)]",
    secondary:
      "bg-white/70 text-slate-900 border border-slate-200 hover:bg-white focus:ring-slate-300",
    ghost: "bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-slate-300",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
