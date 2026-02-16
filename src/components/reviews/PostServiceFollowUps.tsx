"use client";

import { useState } from "react";
import { type PostServiceFollowUp, type Journey } from "@/lib/types";
import { ReviewPromptCard } from "./ReviewPromptCard";
import { JourneyCompleteCard } from "./JourneyCompleteCard";
import { NPSSurveyCard } from "./NPSSurveyCard";
import { getJourneyById } from "@/lib/mock-data";

interface PostServiceFollowUpsProps {
  followUps: PostServiceFollowUp[];
}

export function PostServiceFollowUps({ followUps }: PostServiceFollowUpsProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const visibleFollowUps = followUps.filter(
    (f) => f.status === "pending" && !dismissedIds.has(f.id)
  );

  if (visibleFollowUps.length === 0) return null;

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  // Group by type for ordering: journey_complete first, then review_prompts, then nps
  const journeyCompletes = visibleFollowUps.filter(
    (f) => f.type === "journey_complete"
  );
  const reviewPrompts = visibleFollowUps.filter(
    (f) => f.type === "review_prompt" || f.type === "review_reminder"
  );
  const npsSurveys = visibleFollowUps.filter((f) => f.type === "nps_survey");

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Share Your Feedback
      </h2>

      {/* Journey Complete cards */}
      {journeyCompletes.map((f) => {
        const journey = f.journeyId ? getJourneyById(f.journeyId) : null;
        if (!journey) return null;
        return (
          <JourneyCompleteCard
            key={f.id}
            journey={journey}
            onDismiss={() => handleDismiss(f.id)}
          />
        );
      })}

      {/* Review prompts */}
      {reviewPrompts.length > 0 && (
        <div className="space-y-3">
          {reviewPrompts.map((f) => (
            <ReviewPromptCard
              key={f.id}
              followUp={f}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      )}

      {/* NPS surveys */}
      {npsSurveys.map((f) => (
        <NPSSurveyCard
          key={f.id}
          onSubmit={() => handleDismiss(f.id)}
          onDismiss={() => handleDismiss(f.id)}
        />
      ))}
    </div>
  );
}
