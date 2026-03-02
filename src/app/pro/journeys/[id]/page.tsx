"use client";

// Pro-specific route wrapper.
// For now, reuse the existing Journey page implementation so notification links don't 404.
// We'll iterate the UI to a true "pro lens" in the next pass.

import JourneyPage from "@/app/journey/[id]/page";

export default function ProJourneyPage(props: any) {
  return <JourneyPage {...props} />;
}
