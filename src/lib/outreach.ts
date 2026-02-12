/**
 * Outreach Module — Growth hack email loop
 *
 * When a consumer interacts with a Google Places-sourced pro (views profile,
 * clicks "Invite to Relays"), we queue an outreach email to that business.
 *
 * TODO: Integrate with real email service (SendGrid, Resend, Postmark)
 * TODO: Add rate limiting (max 1 email per business per week)
 * TODO: Add unsubscribe/opt-out handling
 * TODO: Track email opens and click-through rates
 */

import { type PlacesResult } from "@/lib/google-places";

/* ── Types ─────────────────────────────────────────────────────── */

export interface OutreachEvent {
  id: string;
  placeId: string;
  businessName: string;
  businessEmail: string;
  type: "profile_view" | "invite_sent" | "claim_email";
  timestamp: string;
  status: "queued" | "sent" | "opened" | "clicked" | "bounced";
}

/* ── In-memory log (mock) ──────────────────────────────────────── */

const outreachLog: OutreachEvent[] = [];

/* ── Email Template ────────────────────────────────────────────── */

function generateClaimEmailBody(businessName: string): string {
  return `
Hi ${businessName} team,

Clients in your area are discovering your business on Relays — the referral network for real estate professionals.

People are viewing your profile and looking for professionals just like you. Right now, your listing is based on public data, but you can claim it to:

✅ Customize your profile with photos, bio, and credentials
✅ See who's viewing your profile
✅ Receive direct referrals from other pros
✅ Get verified and stand out in the marketplace

It's completely free to claim your profile.

→ Claim your Relays profile: https://relays.app/claim

Questions? Reply to this email — we're happy to help.

Best,
The Relays Team
  `.trim();
}

/* ── Service Functions ─────────────────────────────────────────── */

/**
 * Send a claim email to a business found via Google Places.
 *
 * TODO: Replace with real email API call:
 *   await resend.emails.send({
 *     from: 'Relays <hello@relays.app>',
 *     to: businessEmail,
 *     subject: `Clients are viewing ${businessName} on Relays`,
 *     text: generateClaimEmailBody(businessName),
 *   });
 */
export async function sendClaimEmail(
  placeId: string,
  businessEmail: string,
  businessName: string
): Promise<void> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 500));

  const event: OutreachEvent = {
    id: `outreach_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    placeId,
    businessName,
    businessEmail,
    type: "claim_email",
    timestamp: new Date().toISOString(),
    status: "sent",
  };

  outreachLog.push(event);

  // eslint-disable-next-line no-console
  console.log("[outreach] Claim email sent:", {
    to: businessEmail,
    business: businessName,
    subject: `Clients are viewing ${businessName} on Relays`,
    body: generateClaimEmailBody(businessName),
  });
}

/**
 * Log a profile view interaction (triggers outreach after threshold).
 *
 * TODO: In production, aggregate views and trigger email after N views
 * or first interaction (whichever comes first).
 */
export function logProfileView(place: PlacesResult): void {
  const event: OutreachEvent = {
    id: `outreach_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    placeId: place.placeId,
    businessName: place.name,
    businessEmail: place.email ?? "",
    type: "profile_view",
    timestamp: new Date().toISOString(),
    status: "queued",
  };

  outreachLog.push(event);

  // eslint-disable-next-line no-console
  console.log("[outreach] Profile view logged:", place.name);
}

/**
 * Get the outreach log (for admin dashboard).
 */
export function getOutreachLog(): OutreachEvent[] {
  return [...outreachLog];
}
