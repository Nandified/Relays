import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  selected?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  className = "",
  hover = false,
  selected = false,
  padding = "md",
  children,
  ...props
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={`
        rounded-2xl border bg-white/90 shadow-[var(--shadow-card)]
        ${selected ? "border-[var(--accent)] ring-1 ring-[var(--accent)]" : "border-[var(--border)]"}
        ${hover ? "transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:border-slate-300" : ""}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
