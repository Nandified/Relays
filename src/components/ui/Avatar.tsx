"use client";

import * as React from "react";
import Image from "next/image";

interface AvatarProps {
  src: string;
  alt: string;
  /** Square size (px). Use width/height for non-square avatars. */
  size?: number;
  /** Width (px). Overrides size when provided. */
  width?: number;
  /** Height (px). Overrides size when provided. */
  height?: number;
  rounded?: "md" | "lg" | "xl" | "full";
  className?: string;
  /** Rendered when the image fails to load. */
  fallback?: React.ReactNode;
}

export function Avatar({
  src,
  alt,
  size = 44,
  width,
  height,
  rounded = "xl",
  className = "",
  fallback = null,
}: AvatarProps) {
  const [failed, setFailed] = React.useState(false);

  // Keep this aligned with Tailwind naming expectations.
  // (Previously these were much rounder than the label implied.)
  const roundedMap = {
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  } as const;

  const w = width ?? size;
  const h = height ?? size;

  return (
    <div
      className={`overflow-hidden border border-[var(--border)] bg-[var(--bg-elevated)] flex-shrink-0 ${roundedMap[rounded]} ${className}`}
      style={{ width: w, height: h }}
    >
      {failed ? (
        fallback
      ) : (
        <Image
          src={src}
          alt={alt}
          width={w}
          height={h}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
