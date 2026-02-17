"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { type PostServiceFollowUp } from "@/lib/types";
import { getProById } from "@/lib/mock-data";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface ReviewPromptCardProps {
  followUp: PostServiceFollowUp;
  onDismiss?: (id: string) => void;
}

export function ReviewPromptCard({ followUp, onDismiss }: ReviewPromptCardProps) {
  const pro = followUp.proId ? getProById(followUp.proId) : null;

  return (
    <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.03] p-4 sm:p-5 transition-all duration-300 hover:border-amber-500/25">
      <div className="flex items-start gap-3">
        {pro && (
          <div className="h-12 w-12 overflow-hidden rounded-2xl border border-amber-500/20 bg-[var(--bg-elevated)] flex-shrink-0">
            <Image
              src={pro.headshotUrl}
              alt={pro.name}
              width={48}
              height={48}
            />
          </div>
        )}
        {!pro && (
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-xl">
            ⭐
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {followUp.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{followUp.body}</p>

          <div className="flex items-center gap-2 mt-3">
            {pro ? (
              <Link href={`/review/${pro.slug}`}>
                <Button size="sm">
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
                  Write Review
                </Button>
              </Link>
            ) : (
              <Button size="sm" variant="secondary">
                Get Started
              </Button>
            )}
            {onDismiss && (
              <button
                onClick={() => onDismiss(followUp.id)}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                Maybe later
              </button>
            )}
          </div>
        </div>

        {followUp.type === "review_reminder" && (
          <Badge variant="warning" className="text-[10px] flex-shrink-0">
            Reminder
          </Badge>
        )}
      </div>
    </div>
  );
}
