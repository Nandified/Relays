"use client";

import { useState } from "react";
import Link from "next/link";
import { type Review } from "@/lib/types";
import { getProById } from "@/lib/mock-data";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface ConsumerReviewHistoryProps {
  reviews: Review[];
}

function timeAgo(dateStr: string): string {
  const now = new Date("2026-02-25T12:00:00Z");
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
}

function isEditable(dateStr: string): boolean {
  const now = new Date("2026-02-25T12:00:00Z");
  const date = new Date(dateStr);
  const diffHours =
    (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  return diffHours <= 48;
}

export function ConsumerReviewHistory({
  reviews,
}: ConsumerReviewHistoryProps) {
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const visibleReviews = reviews.filter((r) => !deletedIds.has(r.id));

  if (visibleReviews.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm p-6 text-center">
        <div className="text-3xl mb-2">📝</div>
        <p className="text-sm text-slate-500">
          You haven&apos;t written any reviews yet
        </p>
        <p className="text-xs text-slate-600 mt-1">
          After a booking or journey, you&apos;ll be prompted to review your
          pros
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visibleReviews.map((review) => {
        const pro = getProById(review.proId);
        const editable = isEditable(review.createdAt);

        return (
          <div
            key={review.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm p-4 sm:p-5 transition-all duration-300 hover:border-[var(--border-hover)]"
          >
            {/* Pro header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                {pro && (
                  <Link href={`/pros/${pro.slug}`}>
                    <div className="h-10 w-10 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] hover:border-blue-500/30 transition-colors">
                      <Image
                        src={pro.headshotUrl}
                        alt={pro.name}
                        width={40}
                        height={40}
                      />
                    </div>
                  </Link>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    {pro && (
                      <Link
                        href={`/pros/${pro.slug}`}
                        className="text-sm font-semibold text-slate-200 hover:text-white transition-colors"
                      >
                        {pro.name}
                      </Link>
                    )}
                    <Badge variant="outline" className="text-[10px]">
                      {review.serviceCategory}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating rating={review.rating} size={12} />
                    <span className="text-[11px] text-slate-600">
                      {timeAgo(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit/Delete actions */}
              {editable && (
                <div className="flex items-center gap-2">
                  <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setDeletedIds(
                        (prev) => new Set([...prev, review.id])
                      )
                    }
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
              {!editable && (
                <span className="text-[10px] text-slate-600 flex-shrink-0">
                  Edit window closed
                </span>
              )}
            </div>

            {/* Review content */}
            {review.title && (
              <h4 className="text-sm font-semibold text-slate-200 mb-1">
                {review.title}
              </h4>
            )}
            <p className="text-sm text-slate-400 leading-relaxed">
              {review.body}
            </p>

            {/* Verified badge */}
            <div className="flex items-center gap-2 mt-3">
              {review.verifiedClient && (
                <Badge variant="success" className="text-[10px]">
                  ✓ Verified Client
                </Badge>
              )}
              {review.helpful > 0 && (
                <span className="text-[11px] text-slate-600">
                  {review.helpful} people found this helpful
                </span>
              )}
            </div>

            {/* Pro response */}
            {review.proResponse && pro && (
              <div className="mt-3 ml-4 rounded-xl border border-blue-500/10 bg-blue-500/[0.03] p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-blue-400">
                    {pro.name} responded
                  </span>
                  <Badge variant="accent" className="text-[9px] py-0">
                    Pro
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  {review.proResponse.body}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
