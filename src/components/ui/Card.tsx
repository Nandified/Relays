import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  selected?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  glow?: boolean;
}

export function Card({
  className = "",
  hover = false,
  selected = false,
  padding = "md",
  glow = false,
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
        rounded-2xl border bg-[var(--bg-card)]/90 backdrop-blur-sm shadow-[var(--shadow-card)]
        ${selected
          ? "border-[var(--accent)]/40 ring-1 ring-[var(--accent)]/20 shadow-[var(--glow-accent)]"
          : "border-[var(--border)]"
        }
        ${hover
          ? "transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]"
          : ""
        }
        ${glow ? "glow-hover" : ""}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
