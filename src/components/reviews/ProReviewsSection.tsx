"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { type Review, type ReviewStats } from "@/lib/types";
import { ReviewCard } from "./ReviewCard";
import { ReviewStatsHeader } from "./ReviewStatsHeader";
import { Button } from "@/components/ui/Button";

type SortOption = "recent" | "highest" | "lowest" | "helpful";

interface ProReviewsSectionProps {
  reviews: Review[];
  stats: ReviewStats | undefined;
  proSlug: string;
}

export function ProReviewsSection({
  reviews,
  stats,
  proSlug,
}: ProReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [showAll, setShowAll] = useState(false);

  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case "recent":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "highest":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating);
      case "helpful":
        return sorted.sort((a, b) => b.helpful - a.helpful);
      default:
        return sorted;
    }
  }, [reviews, sortBy]);

  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 5);

  if (!stats && reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm p-6">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">Reviews</h2>
        <div className="text-center py-8">
          <div className="text-3xl mb-2">⭐</div>
          <p className="text-sm text-slate-500">No reviews yet</p>
          <p className="text-xs text-slate-500 dark:text-slate-600 mt-1">
            Be the first to share your experience
          </p>
          <Link href={`/review/${proSlug}`}>
            <Button size="sm" className="mt-4">
              Write a Review
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats header */}
      {stats && <ReviewStatsHeader stats={stats} />}

      {/* Sort controls + Write Review CTA */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              { key: "recent", label: "Most Recent" },
              { key: "highest", label: "Highest" },
              { key: "lowest", label: "Lowest" },
              { key: "helpful", label: "Most Helpful" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                sortBy === key
                  ? "bg-black/5 dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-black/10 dark:border-white/10"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <Link href={`/review/${proSlug}`}>
          <Button size="sm" variant="secondary">
            <svg
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="mr-1"
            >
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Write a Review
          </Button>
        </Link>
      </div>

      {/* Review list */}
      <div className="space-y-3 stagger-children">
        {displayedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Show more */}
      {!showAll && sortedReviews.length > 5 && (
        <div className="text-center pt-2">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Show all {sortedReviews.length} reviews
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
