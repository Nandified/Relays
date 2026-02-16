"use client";

import { useState, useCallback } from "react";

interface StarRatingProps {
  /** Current rating value (1-5) */
  rating: number;
  /** Interactive mode allows clicking/hovering to set rating */
  interactive?: boolean;
  /** Callback when rating changes (interactive mode) */
  onChange?: (rating: number) => void;
  /** Star size in pixels */
  size?: number;
  /** Show numeric value beside stars */
  showValue?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function StarRating({
  rating,
  interactive = false,
  onChange,
  size = 16,
  showValue = false,
  className = "",
}: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const displayRating = hoveredStar ?? rating;

  const handleClick = useCallback(
    (star: number) => {
      if (interactive && onChange) {
        onChange(star);
      }
    },
    [interactive, onChange]
  );

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => interactive && setHoveredStar(null)}
        role={interactive ? "radiogroup" : "img"}
        aria-label={`Rating: ${rating} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.round(displayRating);
          const isPartial =
            !isFilled && star === Math.ceil(displayRating) && displayRating % 1 > 0;

          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(star)}
              onMouseEnter={() => interactive && setHoveredStar(star)}
              className={`relative flex-shrink-0 ${
                interactive
                  ? "cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95"
                  : "cursor-default"
              }`}
              style={{ width: size, height: size }}
              aria-label={`${star} star${star !== 1 ? "s" : ""}`}
              role={interactive ? "radio" : undefined}
              aria-checked={interactive ? star === rating : undefined}
            >
              {/* Background (empty) star */}
              <svg
                width={size}
                height={size}
                fill="rgba(255,255,255,0.06)"
                viewBox="0 0 20 20"
                className="absolute inset-0"
              >
                <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
              </svg>
              {/* Filled star */}
              <svg
                width={size}
                height={size}
                viewBox="0 0 20 20"
                className={`absolute inset-0 transition-all duration-200 ${
                  isFilled || isPartial ? "opacity-100" : "opacity-0"
                } ${
                  interactive && hoveredStar !== null && star <= hoveredStar
                    ? "drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                    : isFilled
                      ? "drop-shadow-[0_0_3px_rgba(245,158,11,0.3)]"
                      : ""
                }`}
              >
                {isPartial ? (
                  <>
                    <defs>
                      <linearGradient id={`partial-${star}`}>
                        <stop
                          offset={`${(displayRating % 1) * 100}%`}
                          stopColor="#f59e0b"
                        />
                        <stop
                          offset={`${(displayRating % 1) * 100}%`}
                          stopColor="transparent"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z"
                      fill={`url(#partial-${star})`}
                    />
                  </>
                ) : (
                  <path
                    d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z"
                    fill="#f59e0b"
                  />
                )}
              </svg>
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-slate-300 tabular-nums ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
