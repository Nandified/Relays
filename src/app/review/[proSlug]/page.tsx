"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProBySlug } from "@/lib/mock-data";
import { StarRating } from "@/components/reviews/StarRating";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type SubmitState = "idle" | "submitting" | "success";

export default function LeaveReviewPage({
  params,
}: {
  params: Promise<{ proSlug: string }>;
}) {
  const { proSlug } = use(params);
  const pro = getProBySlug(proSlug);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  // Mock: simulate whether the consumer had a journey with this pro
  const isVerifiedClient = true;

  const handleSubmit = useCallback(() => {
    if (rating === 0 || !body.trim()) return;
    setSubmitState("submitting");
    // Mock submission delay
    setTimeout(() => {
      setSubmitState("success");
    }, 1200);
  }, [rating, body]);

  if (!pro) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Professional not found
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This link may be expired or invalid.
          </p>
          <Link href="/marketplace">
            <Button className="mt-4">Go to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Success screen with celebration animation
  if (submitState === "success") {
    return (
      <main className="mx-auto max-w-lg px-4 py-8">
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.03] p-8 text-center animate-in">
          {/* Celebration particles */}
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-4 rounded-full bg-emerald-500/10 animate-ping-slow" />
            <div className="relative text-5xl">🎉</div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Thank you for your review!
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 max-w-sm mx-auto">
            Your feedback helps other homebuyers make confident decisions and
            helps {pro.name} continue providing great service.
          </p>

          {isVerifiedClient && (
            <Badge variant="success" className="mt-2 mb-4">
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
              Tagged as Verified Client
            </Badge>
          )}

          <div className="flex flex-col gap-3 mt-6">
            <Link href={`/pros/${pro.slug}`}>
              <Button className="w-full">
                View {pro.name}&apos;s Profile
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <Link
        href={`/pros/${pro.slug}`}
        className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mb-6"
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
        Back to Profile
      </Link>

      <div className="rounded-3xl border border-[var(--border)] liquid-glass p-6 sm:p-8">
        {/* Pro header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-14 w-14 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            <Image
              src={pro.headshotUrl}
              alt={pro.name}
              width={56}
              height={56}
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Review {pro.name}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">{pro.companyName}</p>
          </div>
        </div>

        {/* Verified client indicator */}
        {isVerifiedClient && (
          <div className="mb-6 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.03] p-3 flex items-center gap-2">
            <svg
              width="16"
              height="16"
              fill="#10b981"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs text-emerald-400 font-medium">
              Your review will be tagged as Verified Client
            </span>
          </div>
        )}

        {/* Star rating */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 block">
            Your Rating <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-4">
            <StarRating
              rating={rating}
              interactive
              onChange={setRating}
              size={32}
            />
            {rating > 0 && (
              <span className="text-sm text-slate-600 dark:text-slate-400 animate-in">
                {rating === 5
                  ? "Outstanding!"
                  : rating === 4
                    ? "Great!"
                    : rating === 3
                      ? "Good"
                      : rating === 2
                        ? "Fair"
                        : "Poor"}
              </span>
            )}
          </div>
        </div>

        {/* Title (optional) */}
        <div className="mb-4">
          <label
            htmlFor="review-title"
            className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 block"
          >
            Title{" "}
            <span className="text-slate-500 dark:text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            maxLength={100}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:text-slate-400 focus:border-blue-500/30 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors"
          />
        </div>

        {/* Body */}
        <div className="mb-4">
          <label
            htmlFor="review-body"
            className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 block"
          >
            Your Review <span className="text-red-400">*</span>
          </label>
          <textarea
            id="review-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share the details of your experience — what went well, what could improve, and anything future clients should know."
            rows={5}
            maxLength={2000}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:text-slate-400 focus:border-blue-500/30 focus:outline-none focus:ring-1 focus:ring-blue-500/20 resize-none transition-colors"
          />
          <div className="flex justify-end mt-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {body.length}/2000
            </span>
          </div>
        </div>

        {/* Service category (auto-filled) */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 block">
            Service Category
          </label>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{pro.categories[0]}</Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Auto-filled from journey context
            </span>
          </div>
        </div>

        {/* Photo upload (mock) */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 block">
            Photos{" "}
            <span className="text-slate-500 dark:text-slate-400 font-normal">(optional)</span>
          </label>
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-black/[0.02] dark:bg-white/[0.02] p-6 text-center hover:border-[var(--border-hover)] transition-colors cursor-pointer">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              className="mx-auto mb-2"
            >
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Drag & drop photos or click to upload
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              JPG, PNG up to 5MB
            </p>
          </div>
        </div>

        {/* Submit */}
        <Button
          size="lg"
          className="w-full"
          disabled={rating === 0 || !body.trim() || submitState === "submitting"}
          onClick={handleSubmit}
        >
          {submitState === "submitting" ? (
            <span className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="animate-spin"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="31.42"
                  strokeDashoffset="10"
                  strokeLinecap="round"
                />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Review"
          )}
        </Button>

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-4 leading-relaxed">
          Your review will be publicly visible. Reviews can be edited or deleted
          within 48 hours of submission. By posting, you agree to our review
          guidelines.
        </p>
      </div>
    </main>
  );
}
