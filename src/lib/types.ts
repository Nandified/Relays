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

export interface ProSocialLinks {
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
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
  introVideoUrl?: string;
  badges: ProBadge[];
  verified: boolean;
  responseTimeMinutes: number | null;
  availability: "accepting" | "busy" | "paused";
  username: string; // for /u/[username] share links
  topThree: string[]; // IDs of curated top 3 for share page
  socialLinks?: ProSocialLinks;
  specialties?: string[];
  licenseNumber?: string;
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

// ── Journey Stages ──
export type JourneyStage =
  | "pre_approval"
  | "house_hunting"
  | "offer_made"
  | "offer_accepted"
  | "under_contract"
  | "inspection"
  | "appraisal"
  | "closing_scheduled"
  | "closed"
  | "post_close";

export const JOURNEY_STAGES: JourneyStage[] = [
  "pre_approval",
  "house_hunting",
  "offer_made",
  "offer_accepted",
  "under_contract",
  "inspection",
  "appraisal",
  "closing_scheduled",
  "closed",
  "post_close",
];

export const JOURNEY_STAGE_LABELS: Record<JourneyStage, string> = {
  pre_approval: "Pre-Approval",
  house_hunting: "House Hunting",
  offer_made: "Offer Made",
  offer_accepted: "Offer Accepted",
  under_contract: "Under Contract",
  inspection: "Inspection",
  appraisal: "Appraisal",
  closing_scheduled: "Closing Scheduled",
  closed: "Closed",
  post_close: "Post-Close",
};

export const JOURNEY_STAGE_ICONS: Record<JourneyStage, string> = {
  pre_approval: "💳",
  house_hunting: "🔍",
  offer_made: "📝",
  offer_accepted: "🤝",
  under_contract: "📋",
  inspection: "🔎",
  appraisal: "📊",
  closing_scheduled: "📅",
  closed: "🏠",
  post_close: "🎉",
};

// ── Referral Moments ──
export type ReferralMomentPriority = "urgent" | "upcoming" | "completed";
export type ReferralMomentTrigger = "stage_based" | "event_based" | "time_based";
export type ReferralMomentAction = "send_top_3" | "request_booking" | "upload_doc" | "review";
export type ReferralMomentStatus = "pending" | "active" | "snoozed" | "completed" | "skipped";

export interface ReferralMoment {
  id: string;
  journeyId: string;
  stage: JourneyStage;
  /** Which pro category is needed */
  category: ProServiceCategory;
  title: string;
  description: string;
  priority: ReferralMomentPriority;
  triggerType: ReferralMomentTrigger;
  triggerDate?: string; // ISO 8601
  completedAt?: string; // ISO 8601
  action: ReferralMomentAction;
  status: ReferralMomentStatus;
}

// ── Journey Audit Trail ──
export interface JourneyAuditEntry {
  id: string;
  journeyId: string;
  timestamp: string; // ISO 8601
  actor: "system" | "consumer" | "pro";
  actorId?: string;
  type: "stage_change" | "moment_triggered" | "moment_completed" | "role_filled" | "note";
  fromStage?: JourneyStage;
  toStage?: JourneyStage;
  description: string;
}

// ── Notification Preferences ──
export type NotificationChannel = "email" | "sms" | "push" | "in_app";
export type NotificationMomentType =
  | "stage_advancement"
  | "moment_triggered"
  | "top_3_sent"
  | "booking_requested"
  | "document_uploaded"
  | "review_requested"
  | "role_filled"
  | "reminder";

export interface NotificationPreference {
  momentType: NotificationMomentType;
  label: string;
  description: string;
  channels: Record<NotificationChannel, boolean>;
}

export interface NotificationHistoryEntry {
  id: string;
  momentType: NotificationMomentType;
  channel: NotificationChannel;
  title: string;
  body: string;
  sentAt: string; // ISO 8601
  read: boolean;
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
  /** Current journey stage */
  stage: JourneyStage;
  /** The 5 service roles */
  roles: JourneyRole[];
  /** Shareable link slug */
  shareSlug: string;
  /** Active curated group ID (determines partner recommendations) */
  groupId?: string;
  createdAt: string;
  /** Optional closing date for time-based triggers */
  closingDate?: string;
  /** Audit trail of stage changes and events */
  auditTrail: JourneyAuditEntry[];

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

// ── Curated Groups ──
export type CuratedGroupTag = "lead_source" | "language" | "scenario";

export interface CuratedGroupPartner {
  proId: string;
  category: ProServiceCategory;
  position: number; // 1-based ordering within category
  addedAt: string; // ISO 8601
}

export interface CuratedGroup {
  id: string;
  name: string;
  slug: string; // URL-safe slug for share links
  description?: string;
  tags: CuratedGroupTag[];
  proId: string; // owner
  partners: CuratedGroupPartner[];
  isDefault: boolean;
  createdAt: string; // ISO 8601
}

// ── Group audit log ──
export interface GroupAuditEntry {
  id: string;
  journeyId: string;
  fromGroupId: string | null;
  toGroupId: string;
  changedBy: string; // pro ID
  reason?: string;
  timestamp: string; // ISO 8601
}

// ── Organization / Brokerage Layer ──
export type OrgType = "brokerage" | "team" | "office" | "branch";
export type OrgTier = "team" | "office" | "enterprise";
export type OrgRole = "admin" | "manager" | "agent" | "transaction_coordinator" | "assistant";
export type OrgMemberStatus = "active" | "invited" | "deactivated";

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  logoUrl?: string;
  parentOrgId?: string;
  tier: OrgTier;
  maxSeats: number;
  currentSeats: number;
  address?: string;
  createdAt: string;
}

export interface OrgMember {
  id: string;
  orgId: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: OrgRole;
  status: OrgMemberStatus;
  invitedBy?: string;
  joinedAt?: string;
  deactivatedAt?: string;
  lastActiveAt?: string;
  journeyCount: number;
}

export type OrgAuditAction =
  | "member_invited"
  | "member_joined"
  | "member_deactivated"
  | "role_changed"
  | "journey_created"
  | "journey_reassigned"
  | "journey_updated"
  | "partner_recommended"
  | "partner_approved"
  | "verification_submitted"
  | "settings_updated"
  | "step_in_granted"
  | "step_in_used"
  | "report_exported";

export interface OrgAuditLog {
  id: string;
  orgId: string;
  action: OrgAuditAction;
  performedBy: string;
  performedByName: string;
  targetUserId?: string;
  targetUserName?: string;
  targetJourneyId?: string;
  targetJourneyTitle?: string;
  details: string;
  timestamp: string;
}

export interface OrgReferralData {
  id: string;
  orgId: string;
  agentId: string;
  agentName: string;
  partnerId: string;
  partnerName: string;
  partnerCategory: ProServiceCategory;
  referralCount: number;
  conversionRate: number;
  lastReferralAt: string;
}

export interface OrgPolicy {
  autoStepIn: boolean;
  requiredVerifications: boolean;
  partnerApprovalRequired: boolean;
  maxReferralsPerPartner?: number;
}

// ── Journey Documents ──
export type DocCategory =
  | "pre_approval_letter"
  | "inspection_report"
  | "appraisal"
  | "insurance_binder"
  | "title_commitment"
  | "closing_disclosure"
  | "purchase_agreement"
  | "amendment"
  | "other";

export type DocStatus = "needed" | "requested" | "uploaded" | "reviewed" | "approved";

export interface JourneyDocument {
  id: string;
  journeyId: string;
  category: DocCategory;
  title: string;
  description?: string;
  status: DocStatus;
  uploadedBy?: string;
  uploadedAt?: string; // ISO 8601
  fileUrl?: string;
  fileType?: string; // MIME type
  fileSize?: number; // bytes
  requestedBy?: string;
  requestedAt?: string; // ISO 8601
  reviewedBy?: string;
  reviewedAt?: string; // ISO 8601
  notes?: string;
}

/** Human-readable metadata for each doc category */
export const DOC_CATEGORY_META: Record<
  DocCategory,
  { label: string; description: string; icon: string }
> = {
  pre_approval_letter: {
    label: "Pre-Approval Letter",
    description: "Mortgage pre-approval from your lender",
    icon: "💰",
  },
  inspection_report: {
    label: "Inspection Report",
    description: "Home inspection findings and recommendations",
    icon: "🔍",
  },
  appraisal: {
    label: "Appraisal",
    description: "Property appraisal for lender requirements",
    icon: "📊",
  },
  insurance_binder: {
    label: "Insurance Binder",
    description: "Proof of homeowner's insurance coverage",
    icon: "🛡️",
  },
  title_commitment: {
    label: "Title Commitment",
    description: "Title search and commitment letter",
    icon: "📜",
  },
  closing_disclosure: {
    label: "Closing Disclosure",
    description: "Final loan terms and closing costs",
    icon: "📋",
  },
  purchase_agreement: {
    label: "Purchase Agreement",
    description: "Signed purchase contract",
    icon: "✍️",
  },
  amendment: {
    label: "Amendment",
    description: "Contract amendment or addendum",
    icon: "📝",
  },
  other: {
    label: "Other Document",
    description: "Additional supporting document",
    icon: "📄",
  },
};

/** Stage-linked document templates: which docs are expected at each stage */
export const STAGE_DOCUMENTS: Record<JourneyStage, DocCategory[]> = {
  pre_approval: ["pre_approval_letter"],
  house_hunting: [],
  offer_made: [],
  offer_accepted: ["purchase_agreement"],
  under_contract: ["inspection_report"],
  inspection: ["inspection_report"],
  appraisal: ["appraisal"],
  closing_scheduled: ["closing_disclosure", "title_commitment", "insurance_binder"],
  closed: [],
  post_close: [],
};

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

// ── Notifications ──
export type NotificationType =
  | "moment_triggered"
  | "booking_requested"
  | "booking_confirmed"
  | "booking_declined"
  | "doc_uploaded"
  | "doc_requested"
  | "message_received"
  | "profile_claimed"
  | "review_received"
  | "connect_request"
  | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    journeyId?: string;
    proId?: string;
    momentId?: string;
    bookingId?: string;
  };
}

// ── Messaging ──
export type MessageType = "text" | "system" | "doc_share" | "booking_update";
export type SenderRole = "consumer" | "pro" | "system";

export interface Conversation {
  id: string;
  journeyId: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: SenderRole;
  content: string;
  type: MessageType;
  createdAt: string;
  readBy: string[];
  /** For doc_share messages */
  docMeta?: {
    fileName: string;
    fileType: string;
    fileSize: string;
    uploadedAt: string;
  };
}

// ── Connect Request ──
export type ConnectRequestStatus = "pending" | "accepted" | "declined";

export interface ConnectRequest {
  id: string;
  consumerId: string;
  consumerName: string;
  consumerEmail: string;
  proId: string;
  proName: string;
  journeyId: string;
  message: string;
  preferredContact: "in_app" | "email" | "phone";
  status: ConnectRequestStatus;
  createdAt: string;
}
