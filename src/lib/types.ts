/* ── Relays — Shared Types ──────────────────────────────────────── */

// ── Service categories ──
export type ProServiceCategory =
  | "Home Inspector"
  | "Mortgage Lender"
  | "Insurance Agent"
  | "Attorney"
  | "Realtor";

// ── Pro (public profile) ──
export interface ProBadge {
  type: "licensed" | "insured" | "fast-response" | "partner" | "top-rated";
  label: string;
}

export interface Pro {
  id: string;
  slug: string;
  name: string;
  companyName: string;
  headshotUrl: string;
  companyLogoUrl: string;
  categories: ProServiceCategory[];
  serviceAreas: string[];
  rating: number;
  reviewCount: number;
  blurb: string;
  bio: string;
  videoUrl: string | null;
  badges: ProBadge[];
  verified: boolean;
  responseTimeMinutes: number | null;
  availability: "accepting" | "busy" | "paused";
  username: string; // for /u/[username] share links
  topThree: string[]; // IDs of curated top 3 for share page
}

// ── Auth / User ──
export type UserRole = "consumer" | "pro";

export interface ProOnboardingData {
  category: ProServiceCategory | null;
  companyName: string;
  fullName: string;
  serviceArea: string;
  headshotUploaded: boolean;
  logoUploaded: boolean;
  onboardingComplete: boolean;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
  proOnboarding?: ProOnboardingData;
}

// ── Requests ──
export type RequestStatus =
  | "submitted"
  | "reviewing"
  | "matched"
  | "scheduled"
  | "completed"
  | "cancelled";

export interface ServiceRequest {
  id: string;
  userId: string;
  category: ProServiceCategory;
  description: string;
  addressOrArea: string;
  notes: string;
  status: RequestStatus;
  assignedProId: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

// ── Timeline ──
export interface TimelineEvent {
  id: string;
  requestId: string;
  type: "submitted" | "reviewing" | "matched" | "scheduled" | "completed" | "note";
  label: string;
  description: string;
  timestamp: string;
  actor: "system" | "consumer" | "pro";
}

// ── Journey (consumer dashboard) ──
export type JourneyStatus = "active" | "pending" | "completed";

export interface Journey {
  id: string;
  title: string;
  address: string;
  status: JourneyStatus;
  pendingAction: string;
  nextStep: string;
  owner: string; // who owns the action
  teamMembers: JourneyTeamMember[];
  createdAt: string;
}

export interface JourneyTeamMember {
  proId: string;
  role: ProServiceCategory;
  status: "confirmed" | "pending" | "invited";
}

// ── Team roster ──
export interface TeamMember {
  proId: string;
  role: ProServiceCategory;
  addedAt: string;
}

// ── Booking ──
export interface TimeWindow {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  available: boolean;
}

// ── Unclaimed Professional (state license database data) ──
export interface UnclaimedProfessional {
  id: string; // generated from license_number
  slug: string;
  name: string;
  licenseNumber: string;
  licenseType: string; // "LICENSED REAL ESTATE BROKER", "LICENSED HOME INSPECTOR", etc.
  company: string;
  /**
   * Employing brokerage / office name (license database compliance).
   * Derived from license database business DBA and/or Google Maps listing name.
   */
  officeName: string | null;
  city: string;
  state: string;
  zip: string;
  county: string;
  licensedSince: string;
  expires: string;
  disciplined: boolean;
  category: ProServiceCategory; // mapped from licenseType
  claimed: boolean;
  claimedByProId: string | null;
  // Enrichment fields (from Outscraper)
  phone: string | null;
  email: string | null;
  website: string | null;
  rating: number | null;
  reviewCount: number | null;
  photoUrl: string | null;
}

// ── Pro-side request ──
export interface ProIncomingRequest {
  id: string;
  requestId: string;
  clientName: string;
  clientEmail: string;
  category: ProServiceCategory;
  description: string;
  addressOrArea: string;
  status: "pending" | "accepted" | "declined";
  receivedAt: string;
}
