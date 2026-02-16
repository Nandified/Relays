/* ── Referral Moment Engine ─────────────────────────────────────
   Given a journey's current stage and filled roles, computes:
   - Active moments (what to do NOW)
   - Upcoming moments (what's next)
   - Completed moments (what's done)
   ─────────────────────────────────────────────────────────────── */

import {
  type Journey,
  type JourneyStage,
  type ReferralMoment,
  type ProServiceCategory,
  JOURNEY_STAGES,
} from "@/lib/types";

/* ── Stage → Moment Definitions ─────────────────────────────── */

interface MomentDefinition {
  stage: JourneyStage;
  category: ProServiceCategory;
  title: string;
  description: string;
  action: ReferralMoment["action"];
  triggerType: ReferralMoment["triggerType"];
  /** Whether this moment is optional (not required for journey completion) */
  optional?: boolean;
}

/**
 * P0 moment definitions — the canonical list from v19 research pack.
 * Each defines when a pro category is needed during the journey.
 */
const MOMENT_DEFINITIONS: MomentDefinition[] = [
  {
    stage: "pre_approval",
    category: "Mortgage Lender",
    title: "Get Pre-Approved",
    description: "Connect with a lender to get your pre-approval letter — it's the first step to making serious offers.",
    action: "send_top_3",
    triggerType: "stage_based",
  },
  {
    stage: "pre_approval",
    category: "Realtor",
    title: "Find Your Realtor",
    description: "Your realtor guides every step of the journey — from search to closing.",
    action: "send_top_3",
    triggerType: "stage_based",
  },
  {
    stage: "offer_made",
    category: "Attorney",
    title: "Engage a Real Estate Attorney",
    description: "An attorney will review your purchase contract and protect your interests during negotiations.",
    action: "send_top_3",
    triggerType: "stage_based",
  },
  {
    stage: "offer_accepted",
    category: "Home Inspector",
    title: "Schedule Home Inspection",
    description: "Your offer is accepted! Book a home inspector within 10 days to uncover any issues before closing.",
    action: "send_top_3",
    triggerType: "stage_based",
  },
  {
    stage: "under_contract",
    category: "Insurance Agent",
    title: "Get Homeowner's Insurance",
    description: "You'll need proof of insurance before closing. Get quotes now to lock in the best rate.",
    action: "send_top_3",
    triggerType: "stage_based",
  },
  {
    stage: "closing_scheduled",
    category: "Attorney",
    title: "Confirm Closing Attorney",
    description: "Ensure your attorney is confirmed for the closing date. Final walk-through and signing preparation.",
    action: "review",
    triggerType: "event_based",
    optional: true,
  },
  // Post-close moments are optional / upsell
  {
    stage: "post_close",
    category: "Home Inspector",
    title: "Find a Handyman / Contractor",
    description: "Now that you've moved in, connect with trusted contractors for repairs and renovations.",
    action: "send_top_3",
    triggerType: "stage_based",
    optional: true,
  },
  {
    stage: "post_close",
    category: "Insurance Agent",
    title: "Review Your Coverage",
    description: "It's a good time to review your insurance coverage and make sure everything is up to date.",
    action: "review",
    triggerType: "time_based",
    optional: true,
  },
];

/* ── Helpers ─────────────────────────────────────────────────── */

function getStageIndex(stage: JourneyStage): number {
  return JOURNEY_STAGES.indexOf(stage);
}

function isRoleFilled(journey: Journey, category: ProServiceCategory): boolean {
  const role = journey.roles.find((r) => r.category === category);
  return role?.status === "filled";
}

function generateMomentId(journeyId: string, def: MomentDefinition): string {
  return `moment_${journeyId}_${def.stage}_${def.category.toLowerCase().replace(/\s+/g, "_")}`;
}

/* ── Main Engine ─────────────────────────────────────────────── */

export interface ComputedMoments {
  active: ReferralMoment[];
  upcoming: ReferralMoment[];
  completed: ReferralMoment[];
  all: ReferralMoment[];
}

/**
 * Given a journey, compute all referral moments and their current status.
 * This is the "What's Next" engine — the heart of Relays.
 */
export function computeMoments(journey: Journey): ComputedMoments {
  const currentStageIdx = getStageIndex(journey.stage);

  const moments: ReferralMoment[] = MOMENT_DEFINITIONS.map((def) => {
    const defStageIdx = getStageIndex(def.stage);
    const filled = isRoleFilled(journey, def.category);

    // Determine status
    let status: ReferralMoment["status"];
    let priority: ReferralMoment["priority"];

    if (filled) {
      // Role already filled — moment is completed
      status = "completed";
      priority = "completed";
    } else if (defStageIdx < currentStageIdx) {
      // Past stage and role not filled — still active (overdue!)
      status = "active";
      priority = "urgent";
    } else if (defStageIdx === currentStageIdx) {
      // Current stage — this is THE active moment
      status = "active";
      priority = "urgent";
    } else if (defStageIdx === currentStageIdx + 1) {
      // Next stage — upcoming soon
      status = "pending";
      priority = "upcoming";
    } else {
      // Future stage — pending
      status = "pending";
      priority = "upcoming";
    }

    return {
      id: generateMomentId(journey.id, def),
      journeyId: journey.id,
      stage: def.stage,
      category: def.category,
      title: def.title,
      description: def.description,
      priority,
      triggerType: def.triggerType,
      triggerDate: def.triggerType === "time_based" && journey.closingDate
        ? journey.closingDate
        : undefined,
      completedAt: status === "completed" ? new Date().toISOString() : undefined,
      action: def.action,
      status,
    };
  });

  const active = moments.filter((m) => m.status === "active");
  const upcoming = moments.filter((m) => m.status === "pending");
  const completed = moments.filter((m) => m.status === "completed");

  // Sort active: urgent first, then by stage order
  active.sort((a, b) => {
    if (a.priority === "urgent" && b.priority !== "urgent") return -1;
    if (b.priority === "urgent" && a.priority !== "urgent") return 1;
    return getStageIndex(a.stage) - getStageIndex(b.stage);
  });

  // Sort upcoming by stage order
  upcoming.sort((a, b) => getStageIndex(a.stage) - getStageIndex(b.stage));

  return { active, upcoming, completed, all: moments };
}

/**
 * Get the single most important "What's Next" moment for a journey.
 * This is the hero card on the consumer dashboard.
 */
export function getHeroMoment(journey: Journey): ReferralMoment | null {
  const { active } = computeMoments(journey);
  return active[0] ?? null;
}

/**
 * Get all active moments across multiple journeys (for pro dashboard).
 * Groups by urgency.
 */
export function getProMoments(journeys: Journey[]): {
  urgent: (ReferralMoment & { journey: Journey })[];
  upcoming: (ReferralMoment & { journey: Journey })[];
  recent: (ReferralMoment & { journey: Journey })[];
} {
  const urgent: (ReferralMoment & { journey: Journey })[] = [];
  const upcoming: (ReferralMoment & { journey: Journey })[] = [];
  const recent: (ReferralMoment & { journey: Journey })[] = [];

  for (const journey of journeys) {
    const { active, upcoming: upcomingMoments, completed } = computeMoments(journey);

    for (const m of active) {
      urgent.push({ ...m, journey });
    }
    for (const m of upcomingMoments.slice(0, 2)) {
      upcoming.push({ ...m, journey });
    }
    for (const m of completed.slice(-2)) {
      recent.push({ ...m, journey });
    }
  }

  return { urgent, upcoming, recent };
}

/**
 * Simulate advancing a journey to the next stage.
 * Returns the updated journey with new stage and audit entry.
 */
export function advanceStage(
  journey: Journey,
  actorId: string = "pro_system"
): Journey {
  const currentIdx = getStageIndex(journey.stage);
  if (currentIdx >= JOURNEY_STAGES.length - 1) return journey;

  const newStage = JOURNEY_STAGES[currentIdx + 1];
  const now = new Date().toISOString();

  return {
    ...journey,
    stage: newStage,
    status: newStage === "closed" || newStage === "post_close" ? "completed" : "active",
    auditTrail: [
      ...journey.auditTrail,
      {
        id: `audit_${journey.id}_${Date.now()}`,
        journeyId: journey.id,
        timestamp: now,
        actor: "pro",
        actorId,
        type: "stage_change",
        fromStage: journey.stage,
        toStage: newStage,
        description: `Stage advanced from ${journey.stage} to ${newStage}`,
      },
    ],
  };
}

/**
 * Get the category-specific color scheme for moment cards.
 */
export function getMomentCategoryStyle(category: ProServiceCategory): {
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
} {
  const styles: Record<string, { icon: string; color: string; bgColor: string; borderColor: string; glowColor: string }> = {
    "Mortgage Lender": {
      icon: "💰",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      glowColor: "shadow-emerald-500/20",
    },
    Realtor: {
      icon: "🏠",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      glowColor: "shadow-blue-500/20",
    },
    Attorney: {
      icon: "⚖️",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      glowColor: "shadow-purple-500/20",
    },
    "Home Inspector": {
      icon: "🔍",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      glowColor: "shadow-amber-500/20",
    },
    "Insurance Agent": {
      icon: "🛡️",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      glowColor: "shadow-cyan-500/20",
    },
  };

  return styles[category] ?? styles["Realtor"];
}
