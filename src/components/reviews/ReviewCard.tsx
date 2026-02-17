"use client";

import { useState } from "react";
import Image from "next/image";
import { type Review } from "@/lib/types";
import { getProById } from "@/lib/mock-data";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/Badge";

interface ReviewCardProps {
  review: Review;
  /** Show respond button (pro management view) */
  showRespondButton?: boolean;
  /** Callback when responding */
  onRespond?: (reviewId: string, body: string) => void;
  /** Callback when flagging */
  onFlag?: (reviewId: string) => void;
  /** Compact mode for lists */
  compact?: boolean;
}

function timeAgo(dateStr: string): string {
  const now = new Date("2026-02-25T12:00:00Z"); // Mock "now"
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? "s" : ""} ago`;
}

export function ReviewCard({
  review,
  showRespondButton = false,
  onRespond,
  onFlag,
  compact = false,
}: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [hasVoted, setHasVoted] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [responseText, setResponseText] = useState("");

  const initials = review.consumerName
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  const pro = review.proResponse ? getProById(review.proId) : null;

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpfulCount((c) => c + 1);
      setHasVoted(true);
    }
  };

  const handleSubmitResponse = () => {
    if (responseText.trim() && onRespond) {
      onRespond(review.id, responseText.trim());
      setIsResponding(false);
      setResponseText("");
    }
  };

  return (
    <div className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm p-4 sm:p-5 transition-all duration-300 hover:border-[var(--border-hover)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-[var(--border)] flex items-center justify-center text-xs font-semibold text-slate-600 dark:text-slate-400 flex-shrink-0">
            {initials}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {review.consumerName}
              </span>
              {review.verifiedClient && (
                <Badge variant="success" className="text-[10px] py-0">
                  <svg
                    width="10"
                    height="10"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="mr-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified Client
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={review.rating} size={12} />
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{timeAgo(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Category tag */}
        {!compact && (
          <Badge variant="outline" className="text-[10px] hidden sm:inline-flex flex-shrink-0">
            {review.serviceCategory}
          </Badge>
        )}
      </div>

      {/* Title & Body */}
      <div className="mt-3">
        {review.title && (
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{review.title}</h4>
        )}
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{review.body}</p>
      </div>

      {/* Pro Response */}
      {review.proResponse && (
        <div className="mt-4 ml-4 sm:ml-6 rounded-xl border border-blue-500/10 bg-blue-500/[0.03] p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            {pro && (
              <div className="h-6 w-6 overflow-hidden rounded-lg border border-blue-500/20 bg-[var(--bg-elevated)] flex-shrink-0">
                <Image
                  src={pro.headshotUrl}
                  alt={pro.name}
                  width={24}
                  height={24}
                />
              </div>
            )}
            <span className="text-xs font-semibold text-blue-400">
              {pro?.name ?? "Pro"} responded
            </span>
            <Badge variant="accent" className="text-[9px] py-0">Pro</Badge>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {timeAgo(review.proResponse.respondedAt)}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {review.proResponse.body}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={handleHelpful}
          disabled={hasVoted}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs transition-all duration-200 ${
            hasVoted
              ? "bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
          }`}
        >
          <svg
            width="12"
            height="12"
            fill={hasVoted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
          </svg>
          Helpful{helpfulCount > 0 && ` (${helpfulCount})`}
        </button>

        <div className="flex items-center gap-2">
          {showRespondButton && !review.proResponse && !isResponding && (
            <button
              onClick={() => setIsResponding(true)}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Respond
            </button>
          )}
          {onFlag && (
            <button
              onClick={() => onFlag(review.id)}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              Flag
            </button>
          )}
        </div>
      </div>

      {/* Respond form */}
      {isResponding && (
        <div className="mt-3 ml-4 sm:ml-6 animate-in">
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Write your public response..."
            rows={3}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:text-slate-400 focus:border-blue-500/30 focus:outline-none focus:ring-1 focus:ring-blue-500/20 resize-none"
          />
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={() => {
                setIsResponding(false);
                setResponseText("");
              }}
              className="rounded-xl px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitResponse}
              disabled={!responseText.trim()}
              className="rounded-xl bg-blue-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Response
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
