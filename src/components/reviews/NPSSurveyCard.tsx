"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface NPSSurveyCardProps {
  onSubmit?: (score: number) => void;
  onDismiss?: () => void;
}

export function NPSSurveyCard({ onSubmit, onDismiss }: NPSSurveyCardProps) {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedScore !== null && onSubmit) {
      onSubmit(selectedScore);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-blue-500/15 bg-blue-500/[0.03] p-5 text-center animate-in">
        <div className="text-2xl mb-2">💙</div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Thanks for your feedback!
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Your input helps us improve Relays for everyone.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-500/15 bg-blue-500/[0.03] p-5">
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          How likely are you to recommend Relays?
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          On a scale of 1-10, how likely would you recommend Relays to a friend
          buying or selling a home?
        </p>
      </div>

      {/* NPS Scale */}
      <div className="flex items-center justify-center gap-1 mb-3">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
          <button
            key={score}
            onClick={() => setSelectedScore(score)}
            className={`h-9 w-9 rounded-lg text-xs font-semibold transition-all duration-200 ${
              selectedScore === score
                ? score >= 9
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : score >= 7
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                    : "bg-red-500 text-white shadow-lg shadow-red-500/30"
                : "bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-[var(--border)] hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {score}
          </button>
        ))}
      </div>

      {/* Scale labels */}
      <div className="flex justify-between px-1 mb-4">
        <span className="text-[10px] text-slate-500 dark:text-slate-400">Not likely</span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400">Very likely</span>
      </div>

      {/* Feedback label */}
      {selectedScore !== null && (
        <div className="text-center mb-4 animate-in">
          <span
            className={`text-xs font-medium ${
              selectedScore >= 9
                ? "text-emerald-400"
                : selectedScore >= 7
                  ? "text-amber-400"
                  : "text-red-400"
            }`}
          >
            {selectedScore >= 9
              ? "🎉 You're a promoter! Glad you love Relays."
              : selectedScore >= 7
                ? "We appreciate the feedback — we're always improving."
                : "We hear you. We'll work harder to earn your trust."}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <Button
          size="sm"
          disabled={selectedScore === null}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
