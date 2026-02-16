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
export type UserRole = "consumer" | "pro" | "admin";

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

/**
 * Extended profile stored in the `profiles` table (Supabase).
 * Extends the Supabase auth.users record with app-specific fields.
 */
export interface UserProfile {
  id: string; // matches auth.users.id
  email: string;
  role: UserRole;
  displayName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
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

// ── Journey (consumer dashboard — legacy compat) ──
export type JourneyStatus = "active" | "pending" | "completed";

export interface JourneyTeamMember {
  proId: string;
  role: ProServiceCategory;
  status: "confirmed" | "pending" | "invited";
}

// ── Journey Flow (THE core product) ──
export type JourneyPropertyType = "buying" | "selling";

export type JourneyRoleStatus = "needed" | "recommended" | "filled";

/** A single service role within a Journey */
export interface JourneyRole {
  category: ProServiceCategory;
  status: JourneyRoleStatus;
  /** Pro ID if role is filled */
  assignedProId: string | null;
  /** Up to 3 recommended Pro IDs when status is 'recommended' */
  recommendedProIds: string[];
}

/** The 5 role categories in every Journey */
export const JOURNEY_ROLE_CATEGORIES: ProServiceCategory[] = [
  "Realtor",
  "Mortgage Lender",
  "Attorney",
  "Home Inspector",
  "Insurance Agent",
];

export interface JourneyProperty {
  address: string;
  type: JourneyPropertyType;
}

export interface JourneyClient {
  name: string;
  email: string;
  phone: string;
}

/** Full Journey object — the core data model */
export interface Journey {
  id: string;
  /** Display title (auto-generated from address or custom) */
  title: string;
  /** Full street address */
  address: string;
  property: JourneyProperty;
  /** Pro who created this journey */
  createdByProId: string;
  /** Consumer / client info */
  client: JourneyClient;
  /** Overall status */
  status: JourneyStatus;
  /** The 5 service roles */
  roles: JourneyRole[];
  /** Shareable link slug */
  shareSlug: string;
  createdAt: string;

  // ── Legacy compat fields (used by dashboard cards) ──
  pendingAction: string;
  nextStep: string;
  owner: string;
  teamMembers: JourneyTeamMember[];
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

// ── Verification ──
export type VerificationType = "license_upload" | "claim_verification";
export type VerificationStatus = "pending" | "auto_approved" | "manual_review" | "approved" | "rejected";

export interface VerificationOCR {
  extractedName: string;
  extractedLicenseNumber: string;
  extractedExpiration: string;
  nameMatch: boolean;
  licenseMatch: boolean;
  expirationValid: boolean;
  confidence: number; // 0-1
}

export interface VerificationRequest {
  id: string;
  proId: string;
  proName: string;
  type: VerificationType;
  documentUrl: string | null;
  status: VerificationStatus;
  ocrResult: VerificationOCR | null;
  confidence: number; // 0-1
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

export type ProfessionalIdType = "mls" | "nmls" | "ardc" | "internachi" | "ashi" | "npn";

export interface ClaimAttempt {
  id: string;
  professionalId: string;
  licenseNumberEntered: string;
  matched: boolean;
  professionalIdType: ProfessionalIdType | null;
  professionalIdValue: string | null;
  timestamp: string;
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
