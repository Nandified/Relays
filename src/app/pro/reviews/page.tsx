"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { type ProServiceCategory } from "@/lib/types";
import { mockReviews } from "@/lib/mock-reviews";
import { getReviewStatsForPro } from "@/lib/mock-reviews";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewStatsHeader } from "@/components/reviews/ReviewStatsHeader";
import { Badge } from "@/components/ui/Badge";

type RatingFilter = "all" | "5" | "4" | "3" | "2" | "1";
type ResponseFilter = "all" | "responded" | "unresponded";

// Mock: current pro is Alex Martinez (pro_1)
const CURRENT_PRO_ID = "pro_1";

export default function ProReviewManagementPage() {
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [responseFilter, setResponseFilter] = useState<ResponseFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [respondedReviews, setRespondedReviews] = useState<
    Record<string, string>
  >({});

  const stats = getReviewStatsForPro(CURRENT_PRO_ID);
  const allReviews = mockReviews.filter((r) => r.proId === CURRENT_PRO_ID);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(allReviews.map((r) => r.serviceCategory));
    return Array.from(cats);
  }, [allReviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return allReviews.filter((r) => {
      if (ratingFilter !== "all" && r.rating !== parseInt(ratingFilter)) {
        return false;
      }
      if (responseFilter === "responded" && !r.proResponse && !respondedReviews[r.id]) {
        return false;
      }
      if (responseFilter === "unresponded" && (r.proResponse || respondedReviews[r.id])) {
        return false;
      }
      if (categoryFilter !== "all" && r.serviceCategory !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [allReviews, ratingFilter, responseFilter, categoryFilter, respondedReviews]);

  // Mock trend data
  const last30Days = allReviews.filter(
    (r) => new Date(r.createdAt) > new Date("2026-01-26T00:00:00Z")
  ).length;
  const previous30Days = allReviews.filter(
    (r) =>
      new Date(r.createdAt) > new Date("2025-12-27T00:00:00Z") &&
      new Date(r.createdAt) <= new Date("2026-01-26T00:00:00Z")
  ).length;
  const trendDirection =
    last30Days > previous30Days
      ? "up"
      : last30Days < previous30Days
        ? "down"
        : "flat";

  const handleRespond = (reviewId: string, body: string) => {
    setRespondedReviews((prev) => ({ ...prev, [reviewId]: body }));
  };

  const handleFlag = (reviewId: string) => {
    // Mock flag action
    alert(
      `Review ${reviewId} has been flagged for platform review. Our team will investigate.`
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reviews</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and respond to client reviews
          </p>
        </div>
        <Link
          href="/pro"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>
      </div>

      {/* Stats */}
      {stats && <ReviewStatsHeader stats={stats} className="mb-6" />}

      {/* Trend card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Last 30 Days
              </div>
              <div className="text-xs text-slate-500">
                {last30Days} new review{last30Days !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-sm font-semibold ${
                trendDirection === "up"
                  ? "text-emerald-400"
                  : trendDirection === "down"
                    ? "text-red-400"
                    : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {trendDirection === "up"
                ? `↑ ${last30Days - previous30Days} more`
                : trendDirection === "down"
                  ? `↓ ${previous30Days - last30Days} fewer`
                  : "Same as last period"}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-600">
              vs previous 30 days ({previous30Days})
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Rating filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 dark:text-slate-600 mr-1">Rating:</span>
          {(
            [
              { key: "all", label: "All" },
              { key: "5", label: "5★" },
              { key: "4", label: "4★" },
              { key: "3", label: "3★" },
              { key: "2", label: "2★" },
              { key: "1", label: "1★" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setRatingFilter(key)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                ratingFilter === key
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-transparent hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Response filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 dark:text-slate-600 mr-1">Status:</span>
          {(
            [
              { key: "all", label: "All" },
              { key: "responded", label: "Responded" },
              { key: "unresponded", label: "Needs Response" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setResponseFilter(key)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                responseFilter === key
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-transparent hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        {categories.length > 1 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-600 mr-1">Category:</span>
            <button
              onClick={() => setCategoryFilter("all")}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                categoryFilter === "all"
                  ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-transparent hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  categoryFilter === cat
                    ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-transparent hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-slate-500 dark:text-slate-600">
          {filteredReviews.length} review
          {filteredReviews.length !== 1 ? "s" : ""}
          {ratingFilter !== "all" || responseFilter !== "all" || categoryFilter !== "all"
            ? " (filtered)"
            : ""}
        </span>
        {(ratingFilter !== "all" || responseFilter !== "all" || categoryFilter !== "all") && (
          <button
            onClick={() => {
              setRatingFilter("all");
              setResponseFilter("all");
              setCategoryFilter("all");
            }}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Review list */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={
                respondedReviews[review.id]
                  ? {
                      ...review,
                      proResponse: {
                        body: respondedReviews[review.id],
                        respondedAt: new Date().toISOString(),
                      },
                    }
                  : review
              }
              showRespondButton
              onRespond={handleRespond}
              onFlag={handleFlag}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 p-8 text-center">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-sm text-slate-500">
            No reviews match your current filters
          </p>
          <button
            onClick={() => {
              setRatingFilter("all");
              setResponseFilter("all");
              setCategoryFilter("all");
            }}
            className="text-xs text-blue-400 hover:text-blue-300 mt-2 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
