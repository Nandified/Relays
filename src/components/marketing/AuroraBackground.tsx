"use client";

import * as React from "react";

/**
 * Lightweight animated aurora/mesh background.
 * - Pure CSS animations (GPU-friendly transforms)
 * - Honors prefers-reduced-motion
 */
export function AuroraBackground({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Base gradient wash */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_10%_-10%,rgba(59,130,246,0.18),transparent_60%),radial-gradient(900px_600px_at_90%_10%,rgba(99,102,241,0.14),transparent_55%),radial-gradient(900px_700px_at_50%_110%,rgba(16,185,129,0.10),transparent_55%)] dark:bg-[radial-gradient(1200px_700px_at_10%_-10%,rgba(59,130,246,0.28),transparent_60%),radial-gradient(900px_600px_at_90%_10%,rgba(99,102,241,0.22),transparent_55%),radial-gradient(900px_700px_at_50%_110%,rgba(16,185,129,0.12),transparent_55%)]" />

      {/* Moving aurora blobs */}
      <div className="absolute -left-24 top-[-160px] h-[520px] w-[520px] rounded-full aurora-blob aurora-blob-a" />
      <div className="absolute -right-40 top-[-120px] h-[560px] w-[560px] rounded-full aurora-blob aurora-blob-b" />
      <div className="absolute left-1/2 bottom-[-220px] h-[620px] w-[620px] -translate-x-1/2 rounded-full aurora-blob aurora-blob-c" />

      {/* Subtle grain to keep glass from feeling flat */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22120%22%20height=%22120%22%3E%3Cfilter%20id=%22n%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.8%22%20numOctaves=%222%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22120%22%20height=%22120%22%20filter=%22url(%23n)%22%20opacity=%220.45%22/%3E%3C/svg%3E')]" />
    </div>
  );
}
