"use client";

import * as React from "react";

export type LogoMarqueeItem = {
  name: string;
  src?: string; // optional until provided
};

export function LogoMarquee({
  title = "Find professionals from companies like:",
  items,
  showDisclaimer = true,
}: {
  title?: string;
  items: LogoMarqueeItem[];
  showDisclaimer?: boolean;
}) {
  // Duplicate items for seamless loop
  const loop = React.useMemo(() => [...items, ...items], [items]);

  if (!items?.length) return null;

  return (
    <div className="mx-auto max-w-6xl px-2 sm:px-4">
      <div className="text-center">
        <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </div>
        <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
      </div>

      <div className="relative mt-5 overflow-hidden">
        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[var(--bg-card)]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[var(--bg-card)]/60 to-transparent" />

        <div className="flex gap-4 py-2 marquee">
          {loop.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className="flex h-10 items-center justify-center rounded-full border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.03] px-4 text-xs text-slate-600 dark:text-slate-400 hover:border-blue-400/30 dark:hover:border-blue-400/25 transition-colors"
              style={{ filter: "grayscale(1)", opacity: 0.8 }}
              title={item.name}
            >
              {item.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.src}
                  alt={item.name}
                  className="h-5 w-auto object-contain"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="whitespace-nowrap">{item.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {showDisclaimer && (
        <div className="mt-3 text-center text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-500">
          Logos are trademarks of their respective owners. Display does not imply partnership or endorsement.
        </div>
      )}

      <style jsx>{`
        .marquee {
          width: max-content;
          animation: marquee 28s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
