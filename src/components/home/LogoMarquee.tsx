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
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-20 bg-gradient-to-r from-[var(--bg-card)]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-20 bg-gradient-to-l from-[var(--bg-card)]/60 to-transparent" />

        <div className="marqueeTrack py-2" aria-label="Company logos">
          <div className="marqueeGroup">
            {items.map((item) => (
              <div
                key={`a-${item.name}`}
                className="chip"
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

          {/* Duplicate for seamless loop */}
          <div className="marqueeGroup" aria-hidden="true">
            {items.map((item) => (
              <div
                key={`b-${item.name}`}
                className="chip"
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
      </div>

      {showDisclaimer && (
        <div className="mt-3 text-center text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-500">
          Logos are trademarks of their respective owners. Display does not imply partnership or endorsement.
        </div>
      )}

      <style jsx>{`
        .marqueeTrack {
          display: flex;
          width: max-content;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          animation: marquee 26s linear infinite;
        }
        .marqueeGroup {
          display: flex;
          gap: 16px;
          flex: 0 0 auto;
          padding-right: 16px;
        }
        .chip {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 16px;
          border-radius: 9999px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: rgba(0, 0, 0, 0.02);
          font-size: 12px;
          color: rgb(71, 85, 105);
          opacity: 0.8;
          filter: grayscale(1);
          transition: border-color 150ms ease;
          white-space: nowrap;
        }
        :global(.dark) .chip {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          color: rgb(148, 163, 184);
        }
        .chip:hover {
          border-color: rgba(59, 130, 246, 0.3);
        }
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marqueeTrack {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
