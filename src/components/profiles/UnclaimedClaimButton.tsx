"use client";

import * as React from "react";
import { type UnclaimedProfessional } from "@/lib/types";
import { ClaimProfileModal } from "@/components/claim-profile-modal";

export function UnclaimedClaimButton({ professional }: { professional: UnclaimedProfessional }) {
  const [showClaim, setShowClaim] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setShowClaim(true)}
        className="text-xs text-slate-500 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors cursor-pointer"
      >
        Is this your profile? <span className="underline underline-offset-2">Claim it</span> to manage your listing and receive referrals.
      </button>

      <ClaimProfileModal
        professional={professional}
        open={showClaim}
        onClose={() => setShowClaim(false)}
      />
    </>
  );
}
