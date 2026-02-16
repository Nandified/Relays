/**
 * Mock Admin Data — Comprehensive
 *
 * All admin dashboard data lives here. Structured for easy replacement
 * with real Supabase API calls later.
 */

import { type ProServiceCategory } from "@/lib/types";

/* ── Types ─────────────────────────────────────────────────────── */

export interface AdminMetrics {
  totalPros: number;
  totalConsumers: number;
  teamsBuilt: number;
  pendingVerifications: number;
  activeJourneys: number;
  googlePlacesListings: number;
  claimedProfiles: number;
  weeklySignups: number;
  monthlyRevenue: number;
}

export interface VerificationRequest {
  id: string;
  proId: string;
  proName: string;
  companyName: string;
  category: ProServiceCategory;
  licenseNumber: string;
  licenseType: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected" | "info_requested" | "auto_approved";
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  /** OCR-extracted data from uploaded document */
  ocrData: {
    extractedName: string;
    extractedLicenseNumber: string;
    extractedExpiry: string | null;
    extractedState: string;
    nameMatch: boolean;
    licenseMatch: boolean;
    confidenceScore: number; // 0-100
  } | null;
  documentUrl: string | null; // mock preview URL
  documentType: "image" | "pdf";
  autoVerified: boolean;
}

export type AdminRole = "super_admin" | "admin" | "support" | "viewer";

export interface AdminTeamMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl: string | null;
  joinedAt: string;
  lastActiveAt: string;
  activityLog: TeamActivityEntry[];
}

export interface TeamActivityEntry {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface ActivityEvent {
  id: string;
  type: "pro_signup" | "consumer_signup" | "verification_submitted" | "verification_approved" | "verification_auto_approved" | "team_built" | "journey_started" | "profile_claimed" | "outreach_sent" | "data_import";
  description: string;
  timestamp: string;
  actor: string;
}

export interface ServiceCategoryConfig {
  id: string;
  name: ProServiceCategory;
  icon: string;
  description: string;
  requiredCredentials: string[];
  proCount: number;
  enabled: boolean;
  order: number;
}

export interface MetricDataPoint {
  label: string;
  value: number;
}

export interface DailyMetric {
  date: string; // YYYY-MM-DD
  signups: number;
  proSignups: number;
  consumerSignups: number;
  searches: number;
  journeysStarted: number;
}

export interface MetricsTimeline {
  signups: MetricDataPoint[];
  proClaims: MetricDataPoint[];
  consumerSearches: MetricDataPoint[];
  journeyStarts: MetricDataPoint[];
  categoryBreakdown: MetricDataPoint[];
  daily: DailyMetric[];
  topCities: MetricDataPoint[];
  requestsByStatus: MetricDataPoint[];
}

export interface ImportHistoryEntry {
  id: string;
  filename: string;
  state: string;
  category: string;
  recordCount: number;
  importedBy: string;
  importedAt: string;
  status: "completed" | "running" | "failed";
  duration: number; // seconds
}

export interface StateDataStats {
  state: string;
  stateCode: string;
  totalRecords: number;
  lastUpdated: string;
  categories: Record<string, number>;
}

/* ── Helper: generate 30 days of daily metrics ─────────────────── */
function generateDailyMetrics(): DailyMetric[] {
  const days: DailyMetric[] = [];
  const now = new Date("2026-02-12");
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    // Growth curve — accelerating
    const base = 30 - i;
    const signups = Math.max(1, Math.floor(base * 0.4 + Math.random() * 3));
    const proSignups = Math.max(0, Math.floor(signups * 0.3 + Math.random() * 1.5));
    const consumerSignups = signups - proSignups;
    const searches = Math.floor(base * 1.2 + Math.random() * 8);
    const journeysStarted = Math.max(0, Math.floor(Math.random() * 2.5));
    days.push({ date: dateStr, signups, proSignups, consumerSignups, searches, journeysStarted });
  }
  return days;
}

/* ── Mock Data ─────────────────────────────────────────────────── */

export const mockAdminMetrics: AdminMetrics = {
  totalPros: 148,
  totalConsumers: 423,
  teamsBuilt: 67,
  pendingVerifications: 7,
  activeJourneys: 34,
  googlePlacesListings: 1_247,
  claimedProfiles: 23,
  weeklySignups: 42,
  monthlyRevenue: 0, // pre-revenue
};

export const mockVerificationQueue: VerificationRequest[] = [
  {
    id: "ver_1",
    proId: "pro_3",
    proName: "Sarah Chen",
    companyName: "Lakeside Insurance Group",
    category: "Insurance Agent",
    licenseNumber: "IL-INS-2024-44821",
    licenseType: "IL Property & Casualty License",
    submittedAt: "2026-02-12T14:30:00Z",
    status: "pending",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    ocrData: {
      extractedName: "Sarah M. Chen",
      extractedLicenseNumber: "IL-INS-2024-44821",
      extractedExpiry: "2027-06-30",
      extractedState: "Illinois",
      nameMatch: true,
      licenseMatch: true,
      confidenceScore: 94,
    },
    documentUrl: null,
    documentType: "image",
    autoVerified: false,
  },
  {
    id: "ver_2",
    proId: "pro_5",
    proName: "Priya Kapoor",
    companyName: "Shield Law Group",
    category: "Attorney",
    licenseNumber: "IL-BAR-6290174",
    licenseType: "Illinois Bar License",
    submittedAt: "2026-02-11T11:00:00Z",
    status: "pending",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    ocrData: {
      extractedName: "Priya Kapoor",
      extractedLicenseNumber: "IL-BAR-6290174",
      extractedExpiry: null,
      extractedState: "Illinois",
      nameMatch: true,
      licenseMatch: true,
      confidenceScore: 97,
    },
    documentUrl: null,
    documentType: "pdf",
    autoVerified: false,
  },
  {
    id: "ver_3",
    proId: "pro_8",
    proName: "Mike Chen",
    companyName: "Safe Harbor Inspections",
    category: "Home Inspector",
    licenseNumber: "IL-HI-450-009283",
    licenseType: "IL Home Inspector License",
    submittedAt: "2026-02-10T09:15:00Z",
    status: "pending",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    ocrData: {
      extractedName: "Michael J. Chen",
      extractedLicenseNumber: "IL-HI-450-009283",
      extractedExpiry: "2026-12-31",
      extractedState: "Illinois",
      nameMatch: true,
      licenseMatch: true,
      confidenceScore: 88,
    },
    documentUrl: null,
    documentType: "image",
    autoVerified: false,
  },
  {
    id: "ver_4",
    proId: "pro_9",
    proName: "Lisa Hartwell",
    companyName: "Hartwell Realty",
    category: "Realtor",
    licenseNumber: "IL-RE-475-123456",
    licenseType: "Illinois Real Estate License",
    submittedAt: "2026-02-09T16:45:00Z",
    status: "pending",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    ocrData: {
      extractedName: "Lisa A. Hartwell",
      extractedLicenseNumber: "IL-RE-475-123456",
      extractedExpiry: "2027-04-30",
      extractedState: "Illinois",
      nameMatch: true,
      licenseMatch: true,
      confidenceScore: 92,
    },
    documentUrl: null,
    documentType: "pdf",
    autoVerified: false,
  },
  {
    id: "ver_5",
    proId: "pro_12",
    proName: "James O'Brien",
    companyName: "O'Brien Mortgage Services",
    category: "Mortgage Lender",
    licenseNumber: "NMLS-294817",
    licenseType: "NMLS Licensed Mortgage Originator",
    submittedAt: "2026-02-08T13:20:00Z",
    status: "pending",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    ocrData: {
      extractedName: "James Patrick O'Brien",
      extractedLicenseNumber: "NMLS-294817",
      extractedExpiry: "2026-12-31",
      extractedState: "Illinois",
      nameMatch: true,
      licenseMatch: true,
      confidenceScore: 96,
    },
    documentUrl: null,
    documentType: "image",
    autoVerified: false,
  },
  {
    id: "ver_6",
    proId: "pro_15",
    proName: "Diana Vasquez",
    companyName: "Vasquez Property Law",
    category: "Attorney",
    licenseNumber: "IL-BAR-7381920",
    licenseType: "Illinois Bar License",
    submittedAt: "2026-02-07T10:00:00Z",
    status: "pending",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    ocrData: {
      extractedName: "Diana R. Vasquez",
      extractedLicenseNumber: "IL-BAR-7381920",
      extractedExpiry: null,
      extractedState: "Illinois",
      nameMatch: true,
      licenseMatch: true,
      confidenceScore: 99,
    },
    documentUrl: null,
    documentType: "pdf",
    autoVerified: false,
  },
  {
    id: "ver_7",
    proId: "pro_20",
    proName: "Robert Kim",
    companyName: "KimCheck Inspections",
    category: "Home Inspector",
    licenseNumber: "IL-HI-450-018374",
    licenseType: "IL Home Inspector License",
    submittedAt: "2026-02-06T08:45:00Z",
    status: "pending",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    ocrData: {
      extractedName: "Robert Kim",
      extractedLicenseNumber: "IL-HI-450-018374",
      extractedExpiry: "2027-03-15",
      extractedState: "Illinois",
      nameMatch: true,
      licenseMatch: true,
      confidenceScore: 85,
    },
    documentUrl: null,
    documentType: "image",
    autoVerified: false,
  },
  // Auto-approved
  {
    id: "ver_8",
    proId: "pro_25",
    proName: "Amanda Torres",
    companyName: "Torres Realty Group",
    category: "Realtor",
    licenseNumber: "IL-RE-475-789012",
    licenseType: "Illinois Real Estate License",
    submittedAt: "2026-02-11T09:00:00Z",
    status: "auto_approved",
    reviewedBy: "AI Verification",
    reviewedAt: "2026-02-11T09:00:12Z",
    rejectionReason: null,
    ocrData: {
      extractedName: "Amanda Torres",
      extractedLicenseNumber: "IL-RE-475-789012",
      extractedExpiry: "2027-08-15",
      extractedState: "Illinois",
      nameMatch: true,
      licenseMatch: true,
      confidenceScore: 98,
    },
    documentUrl: null,
    documentType: "image",
    autoVerified: true,
  },
  {
    id: "ver_9",
    proId: "pro_26",
    proName: "Kevin Washington",
    companyName: "Washington Home Loans",
    category: "Mortgage Lender",
    licenseNumber: "NMLS-382901",
    licenseType: "NMLS Licensed Mortgage Originator",
    submittedAt: "2026-02-10T14:00:00Z",
    status: "auto_approved",
    reviewedBy: "AI Verification",
    reviewedAt: "2026-02-10T14:00:08Z",
    rejectionReason: null,
    ocrData: {
      extractedName: "Kevin T. Washington",
      extractedLicenseNumber: "NMLS-382901",
      extractedExpiry: "2027-01-31",
      extractedState: "Illinois",
      nameMatch: true,
      licenseMatch: true,
      confidenceScore: 99,
    },
    documentUrl: null,
    documentType: "pdf",
    autoVerified: true,
  },
  {
    id: "ver_10",
    proId: "pro_27",
    proName: "Grace Park",
    companyName: "Midwest Insurance Partners",
    category: "Insurance Agent",
    licenseNumber: "IL-INS-2024-55012",
    licenseType: "IL Property & Casualty License",
    submittedAt: "2026-02-09T11:30:00Z",
    status: "auto_approved",
    reviewedBy: "AI Verification",
    reviewedAt: "2026-02-09T11:30:15Z",
    rejectionReason: null,
    ocrData: {
      extractedName: "Grace Park",
      extractedLicenseNumber: "IL-INS-2024-55012",
      extractedExpiry: "2027-05-31",
      extractedState: "Illinois",
      nameMatch: true,
      licenseMatch: true,
      confidenceScore: 97,
    },
    documentUrl: null,
    documentType: "image",
    autoVerified: true,
  },
  // Previously approved
  {
    id: "ver_11",
    proId: "pro_1",
    proName: "Alex Martinez",
    companyName: "Blue Peak Inspections",
    category: "Home Inspector",
    licenseNumber: "IL-HI-450-007821",
    licenseType: "IL Home Inspector License",
    submittedAt: "2026-01-20T10:00:00Z",
    status: "approved",
    reviewedBy: "Frank Johnson",
    reviewedAt: "2026-01-20T14:30:00Z",
    rejectionReason: null,
    ocrData: {
      extractedName: "Alexander J. Martinez",
      extractedLicenseNumber: "IL-HI-450-007821",
      extractedExpiry: "2027-01-15",
      extractedState: "Illinois",
      nameMatch: true,
      licenseMatch: true,
      confidenceScore: 93,
    },
    documentUrl: null,
    documentType: "image",
    autoVerified: false,
  },
  {
    id: "ver_12",
    proId: "pro_2",
    proName: "Jordan Lee",
    companyName: "Sunrise Mortgage",
    category: "Mortgage Lender",
    licenseNumber: "NMLS-187294",
    licenseType: "NMLS Licensed Mortgage Originator",
    submittedAt: "2026-01-18T09:00:00Z",
    status: "approved",
    reviewedBy: "Frank Johnson",
    reviewedAt: "2026-01-18T11:00:00Z",
    rejectionReason: null,
    ocrData: {
      extractedName: "Jordan Lee",
      extractedLicenseNumber: "NMLS-187294",
      extractedExpiry: "2026-12-31",
      extractedState: "Illinois",
      nameMatch: true,
      licenseMatch: true,
      confidenceScore: 96,
    },
    documentUrl: null,
    documentType: "pdf",
    autoVerified: false,
  },
  // Rejected
  {
    id: "ver_13",
    proId: "pro_30",
    proName: "Brian Nakamura",
    companyName: "Nakamura & Associates",
    category: "Attorney",
    licenseNumber: "IL-BAR-INVALID",
    licenseType: "Illinois Bar License",
    submittedAt: "2026-02-05T15:00:00Z",
    status: "rejected",
    reviewedBy: "Taylor Kim",
    reviewedAt: "2026-02-05T17:30:00Z",
    rejectionReason: "License number does not match any active Illinois Bar record. Please upload a valid credential.",
    ocrData: {
      extractedName: "Brian Nakamura",
      extractedLicenseNumber: "IL-BAR-INVALID",
      extractedExpiry: null,
      extractedState: "Illinois",
      nameMatch: true,
      licenseMatch: false,
      confidenceScore: 42,
    },
    documentUrl: null,
    documentType: "image",
    autoVerified: false,
  },
  {
    id: "ver_14",
    proId: "pro_31",
    proName: "Steve Coleman",
    companyName: "Coleman Realty",
    category: "Realtor",
    licenseNumber: "IL-RE-475-000000",
    licenseType: "Illinois Real Estate License",
    submittedAt: "2026-02-03T12:00:00Z",
    status: "rejected",
    reviewedBy: "Frank Johnson",
    reviewedAt: "2026-02-04T09:00:00Z",
    rejectionReason: "Uploaded document is expired. Please provide a current license.",
    ocrData: {
      extractedName: "Steven Coleman",
      extractedLicenseNumber: "IL-RE-475-000000",
      extractedExpiry: "2024-12-31",
      extractedState: "Illinois",
      nameMatch: true,
      licenseMatch: true,
      confidenceScore: 71,
    },
    documentUrl: null,
    documentType: "pdf",
    autoVerified: false,
  },
  // Info requested
  {
    id: "ver_15",
    proId: "pro_32",
    proName: "Patricia Hernandez",
    companyName: "Hernandez Insurance Solutions",
    category: "Insurance Agent",
    licenseNumber: "IL-INS-2023-33190",
    licenseType: "IL Property & Casualty License",
    submittedAt: "2026-02-04T10:00:00Z",
    status: "info_requested",
    reviewedBy: "Taylor Kim",
    reviewedAt: "2026-02-04T16:00:00Z",
    rejectionReason: null,
    ocrData: {
      extractedName: "P. Hernandez",
      extractedLicenseNumber: "IL-INS-2023-33190",
      extractedExpiry: "2026-09-30",
      extractedState: "Illinois",
      nameMatch: false,
      licenseMatch: true,
      confidenceScore: 64,
    },
    documentUrl: null,
    documentType: "image",
    autoVerified: false,
  },
];

export const mockAdminTeam: AdminTeamMember[] = [
  {
    id: "admin_1",
    name: "Frank Johnson",
    email: "frank@relays.app",
    role: "super_admin",
    avatarUrl: null,
    joinedAt: "2025-11-01T00:00:00Z",
    lastActiveAt: "2026-02-12T10:30:00Z",
    activityLog: [
      { id: "al_1", action: "Approved verification", timestamp: "2026-02-12T10:30:00Z", details: "Approved Alex Martinez (Home Inspector)" },
      { id: "al_2", action: "Updated category", timestamp: "2026-02-11T14:00:00Z", details: "Edited Insurance Agent description" },
      { id: "al_3", action: "Triggered data import", timestamp: "2026-02-10T09:00:00Z", details: "Imported IL Realtor data (2,847 records)" },
      { id: "al_4", action: "Invited team member", timestamp: "2026-02-08T11:00:00Z", details: "Invited Morgan Davis as Viewer" },
    ],
  },
  {
    id: "admin_2",
    name: "Taylor Kim",
    email: "taylor@relays.app",
    role: "admin",
    avatarUrl: null,
    joinedAt: "2026-01-15T00:00:00Z",
    lastActiveAt: "2026-02-11T16:00:00Z",
    activityLog: [
      { id: "al_5", action: "Rejected verification", timestamp: "2026-02-11T16:00:00Z", details: "Rejected Brian Nakamura — invalid license" },
      { id: "al_6", action: "Requested info", timestamp: "2026-02-10T14:00:00Z", details: "Requested info from Patricia Hernandez" },
      { id: "al_7", action: "Approved verification", timestamp: "2026-02-09T11:00:00Z", details: "Approved Jordan Lee (Mortgage Lender)" },
    ],
  },
  {
    id: "admin_3",
    name: "Alex Rivera",
    email: "alex@relays.app",
    role: "support",
    avatarUrl: null,
    joinedAt: "2026-02-01T00:00:00Z",
    lastActiveAt: "2026-02-10T09:00:00Z",
    activityLog: [
      { id: "al_8", action: "Viewed metrics", timestamp: "2026-02-10T09:00:00Z", details: "Viewed platform metrics dashboard" },
      { id: "al_9", action: "Viewed verification queue", timestamp: "2026-02-09T14:00:00Z", details: "Reviewed pending verifications" },
    ],
  },
  {
    id: "admin_4",
    name: "Morgan Davis",
    email: "morgan@relays.app",
    role: "viewer",
    avatarUrl: null,
    joinedAt: "2026-02-08T00:00:00Z",
    lastActiveAt: "2026-02-12T08:00:00Z",
    activityLog: [
      { id: "al_10", action: "Viewed dashboard", timestamp: "2026-02-12T08:00:00Z", details: "Viewed admin dashboard" },
    ],
  },
  {
    id: "admin_5",
    name: "Casey Nguyen",
    email: "casey@relays.app",
    role: "support",
    avatarUrl: null,
    joinedAt: "2026-01-20T00:00:00Z",
    lastActiveAt: "2026-02-11T12:00:00Z",
    activityLog: [
      { id: "al_11", action: "Approved verification", timestamp: "2026-02-11T12:00:00Z", details: "Approved Sarah Chen (Insurance Agent)" },
      { id: "al_12", action: "Sent outreach email", timestamp: "2026-02-10T15:00:00Z", details: "Sent claim email to 5 Google Places listings" },
      { id: "al_13", action: "Viewed pro list", timestamp: "2026-02-09T10:00:00Z", details: "Filtered pros by Realtor category" },
    ],
  },
];

export const mockActivityFeed: ActivityEvent[] = [
  {
    id: "act_1",
    type: "verification_auto_approved",
    description: "Amanda Torres auto-verified as Licensed Realtor (98% confidence)",
    timestamp: "2026-02-12T14:00:00Z",
    actor: "AI Verification",
  },
  {
    id: "act_2",
    type: "pro_signup",
    description: "Sarah Chen signed up as Insurance Agent",
    timestamp: "2026-02-12T09:45:00Z",
    actor: "Sarah Chen",
  },
  {
    id: "act_3",
    type: "verification_submitted",
    description: "Lisa Hartwell submitted IL Real Estate License for verification",
    timestamp: "2026-02-12T08:30:00Z",
    actor: "Lisa Hartwell",
  },
  {
    id: "act_4",
    type: "consumer_signup",
    description: "New consumer signed up: jamie.r@email.com",
    timestamp: "2026-02-11T22:15:00Z",
    actor: "jamie.r@email.com",
  },
  {
    id: "act_5",
    type: "data_import",
    description: "Imported 2,847 IL Realtor records from IDFPR database",
    timestamp: "2026-02-11T20:00:00Z",
    actor: "Frank Johnson",
  },
  {
    id: "act_6",
    type: "team_built",
    description: "Consumer built a team with 4 professionals",
    timestamp: "2026-02-11T18:00:00Z",
    actor: "user_demo",
  },
  {
    id: "act_7",
    type: "journey_started",
    description: "New journey started: Oak Park Bungalow Purchase",
    timestamp: "2026-02-11T15:30:00Z",
    actor: "user_demo",
  },
  {
    id: "act_8",
    type: "profile_claimed",
    description: "Dr. Rachel Green claimed her Attorney profile",
    timestamp: "2026-02-11T14:00:00Z",
    actor: "Rachel Green",
  },
  {
    id: "act_9",
    type: "verification_approved",
    description: "Alex Martinez verified as ASHI Certified Home Inspector",
    timestamp: "2026-02-11T10:00:00Z",
    actor: "Frank Johnson",
  },
  {
    id: "act_10",
    type: "outreach_sent",
    description: "Claim email sent to 12 unclaimed Google Places listings in Naperville",
    timestamp: "2026-02-10T14:00:00Z",
    actor: "system",
  },
  {
    id: "act_11",
    type: "pro_signup",
    description: "Derek Okafor signed up as Mortgage Lender",
    timestamp: "2026-02-10T11:00:00Z",
    actor: "Derek Okafor",
  },
  {
    id: "act_12",
    type: "consumer_signup",
    description: "New consumer signed up: maria.k@gmail.com",
    timestamp: "2026-02-10T09:30:00Z",
    actor: "maria.k@gmail.com",
  },
  {
    id: "act_13",
    type: "verification_auto_approved",
    description: "Kevin Washington auto-verified as NMLS Mortgage Originator (99% confidence)",
    timestamp: "2026-02-10T14:00:00Z",
    actor: "AI Verification",
  },
  {
    id: "act_14",
    type: "journey_started",
    description: "New journey started: Lincoln Park Condo Purchase",
    timestamp: "2026-02-09T16:00:00Z",
    actor: "user_consumer_4",
  },
  {
    id: "act_15",
    type: "pro_signup",
    description: "Nina Patel signed up as Home Inspector",
    timestamp: "2026-02-09T08:00:00Z",
    actor: "Nina Patel",
  },
];

export const mockServiceCategories: ServiceCategoryConfig[] = [
  {
    id: "cat_1",
    name: "Realtor",
    icon: "🏠",
    description: "Licensed real estate agents helping buyers and sellers",
    requiredCredentials: ["State Real Estate License", "MLS ID (optional)"],
    proCount: 42,
    enabled: true,
    order: 1,
  },
  {
    id: "cat_2",
    name: "Mortgage Lender",
    icon: "🏦",
    description: "NMLS-licensed loan officers and mortgage brokers",
    requiredCredentials: ["NMLS License", "State MLO License"],
    proCount: 35,
    enabled: true,
    order: 2,
  },
  {
    id: "cat_3",
    name: "Attorney",
    icon: "⚖️",
    description: "Real estate attorneys for closings and contract review",
    requiredCredentials: ["State Bar License", "ARDC Number (IL)"],
    proCount: 28,
    enabled: true,
    order: 3,
  },
  {
    id: "cat_4",
    name: "Home Inspector",
    icon: "🔍",
    description: "Certified home inspectors for pre-purchase inspections",
    requiredCredentials: ["State Home Inspector License", "ASHI/InterNACHI Certification (optional)"],
    proCount: 24,
    enabled: true,
    order: 4,
  },
  {
    id: "cat_5",
    name: "Insurance Agent",
    icon: "🛡️",
    description: "Licensed agents for homeowner insurance policies",
    requiredCredentials: ["State P&C License", "NPN (National Producer Number)"],
    proCount: 19,
    enabled: true,
    order: 5,
  },
];

export const mockMetricsTimeline: MetricsTimeline = {
  signups: [
    { label: "Jan 1", value: 3 },
    { label: "Jan 8", value: 7 },
    { label: "Jan 15", value: 12 },
    { label: "Jan 22", value: 18 },
    { label: "Jan 29", value: 24 },
    { label: "Feb 5", value: 35 },
    { label: "Feb 12", value: 57 },
  ],
  proClaims: [
    { label: "Jan 1", value: 2 },
    { label: "Jan 8", value: 5 },
    { label: "Jan 15", value: 12 },
    { label: "Jan 22", value: 24 },
    { label: "Jan 29", value: 48 },
    { label: "Feb 5", value: 89 },
    { label: "Feb 12", value: 148 },
  ],
  consumerSearches: [
    { label: "Jan 1", value: 12 },
    { label: "Jan 8", value: 28 },
    { label: "Jan 15", value: 45 },
    { label: "Jan 22", value: 67 },
    { label: "Jan 29", value: 89 },
    { label: "Feb 5", value: 124 },
    { label: "Feb 12", value: 178 },
  ],
  journeyStarts: [
    { label: "Jan 1", value: 0 },
    { label: "Jan 8", value: 2 },
    { label: "Jan 15", value: 5 },
    { label: "Jan 22", value: 9 },
    { label: "Jan 29", value: 16 },
    { label: "Feb 5", value: 24 },
    { label: "Feb 12", value: 34 },
  ],
  categoryBreakdown: [
    { label: "Realtor", value: 42 },
    { label: "Mortgage Lender", value: 35 },
    { label: "Attorney", value: 28 },
    { label: "Home Inspector", value: 24 },
    { label: "Insurance Agent", value: 19 },
  ],
  daily: generateDailyMetrics(),
  topCities: [
    { label: "Chicago", value: 87 },
    { label: "Naperville", value: 23 },
    { label: "Evanston", value: 18 },
    { label: "Oak Park", value: 14 },
    { label: "Schaumburg", value: 12 },
    { label: "Skokie", value: 9 },
    { label: "Joliet", value: 8 },
    { label: "Aurora", value: 7 },
  ],
  requestsByStatus: [
    { label: "Submitted", value: 34 },
    { label: "Reviewing", value: 12 },
    { label: "Matched", value: 45 },
    { label: "Scheduled", value: 28 },
    { label: "Completed", value: 67 },
    { label: "Cancelled", value: 8 },
  ],
};

/* ── Import History ────────────────────────────────────────────── */

export const mockImportHistory: ImportHistoryEntry[] = [
  {
    id: "imp_1",
    filename: "il_realtors_2026.csv",
    state: "Illinois",
    category: "Realtor",
    recordCount: 2847,
    importedBy: "Frank Johnson",
    importedAt: "2026-02-10T09:00:00Z",
    status: "completed",
    duration: 45,
  },
  {
    id: "imp_2",
    filename: "il_home_inspectors_2026.csv",
    state: "Illinois",
    category: "Home Inspector",
    recordCount: 1203,
    importedBy: "Frank Johnson",
    importedAt: "2026-02-05T14:00:00Z",
    status: "completed",
    duration: 22,
  },
  {
    id: "imp_3",
    filename: "il_attorneys_2026.csv",
    state: "Illinois",
    category: "Attorney",
    recordCount: 1891,
    importedBy: "Taylor Kim",
    importedAt: "2026-01-28T10:00:00Z",
    status: "completed",
    duration: 38,
  },
  {
    id: "imp_4",
    filename: "il_mortgage_lenders_2026.csv",
    state: "Illinois",
    category: "Mortgage Lender",
    recordCount: 956,
    importedBy: "Frank Johnson",
    importedAt: "2026-01-20T16:00:00Z",
    status: "completed",
    duration: 18,
  },
  {
    id: "imp_5",
    filename: "il_insurance_agents_2026.csv",
    state: "Illinois",
    category: "Insurance Agent",
    recordCount: 2104,
    importedBy: "Casey Nguyen",
    importedAt: "2026-01-15T11:00:00Z",
    status: "completed",
    duration: 41,
  },
];

export const mockStateDataStats: StateDataStats[] = [
  {
    state: "Illinois",
    stateCode: "IL",
    totalRecords: 9001,
    lastUpdated: "2026-02-10T09:00:00Z",
    categories: {
      Realtor: 2847,
      "Home Inspector": 1203,
      Attorney: 1891,
      "Mortgage Lender": 956,
      "Insurance Agent": 2104,
    },
  },
];

/* ── Pro Management Mock Data ──────────────────────────────────── */

export interface AdminProListItem {
  id: string;
  name: string;
  category: ProServiceCategory;
  city: string;
  state: string;
  claimed: boolean;
  verified: boolean;
  joinedAt: string;
  rating: number;
  reviewCount: number;
  email: string;
  phone: string | null;
  companyName: string;
  status: "active" | "suspended" | "pending";
}

export const mockAdminProList: AdminProListItem[] = [
  { id: "p1", name: "Alex Martinez", category: "Home Inspector", city: "Chicago", state: "IL", claimed: true, verified: true, joinedAt: "2025-12-01T00:00:00Z", rating: 4.9, reviewCount: 312, email: "alex@bluepeakinspections.com", phone: "(312) 555-0101", companyName: "Blue Peak Inspections", status: "active" },
  { id: "p2", name: "Jordan Lee", category: "Mortgage Lender", city: "Chicago", state: "IL", claimed: true, verified: true, joinedAt: "2025-12-05T00:00:00Z", rating: 4.8, reviewCount: 287, email: "jordan@sunrisemortgage.com", phone: "(312) 555-0102", companyName: "Sunrise Mortgage", status: "active" },
  { id: "p3", name: "Sarah Chen", category: "Insurance Agent", city: "Evanston", state: "IL", claimed: true, verified: false, joinedAt: "2026-02-12T09:45:00Z", rating: 4.7, reviewCount: 156, email: "sarah@lakesideins.com", phone: "(847) 555-0103", companyName: "Lakeside Insurance Group", status: "active" },
  { id: "p4", name: "Marcus Thompson", category: "Realtor", city: "Oak Park", state: "IL", claimed: true, verified: true, joinedAt: "2026-01-10T00:00:00Z", rating: 4.9, reviewCount: 423, email: "marcus@thompsonrealty.com", phone: "(708) 555-0104", companyName: "Thompson Realty", status: "active" },
  { id: "p5", name: "Priya Kapoor", category: "Attorney", city: "Chicago", state: "IL", claimed: true, verified: false, joinedAt: "2026-01-20T00:00:00Z", rating: 4.6, reviewCount: 89, email: "priya@shieldlaw.com", phone: "(312) 555-0105", companyName: "Shield Law Group", status: "active" },
  { id: "p6", name: "Derek Okafor", category: "Mortgage Lender", city: "Naperville", state: "IL", claimed: true, verified: true, joinedAt: "2026-02-10T11:00:00Z", rating: 4.8, reviewCount: 201, email: "derek@premierloans.com", phone: "(630) 555-0106", companyName: "Premier Home Loans", status: "active" },
  { id: "p7", name: "Nina Patel", category: "Home Inspector", city: "Schaumburg", state: "IL", claimed: true, verified: false, joinedAt: "2026-02-09T08:00:00Z", rating: 4.5, reviewCount: 67, email: "nina@thoroughinspect.com", phone: "(847) 555-0107", companyName: "Thorough Inspect LLC", status: "active" },
  { id: "p8", name: "Mike Chen", category: "Home Inspector", city: "Skokie", state: "IL", claimed: true, verified: false, joinedAt: "2026-01-15T00:00:00Z", rating: 4.7, reviewCount: 134, email: "mike@safeharborinsp.com", phone: "(847) 555-0108", companyName: "Safe Harbor Inspections", status: "active" },
  { id: "p9", name: "Lisa Hartwell", category: "Realtor", city: "Chicago", state: "IL", claimed: true, verified: false, joinedAt: "2026-02-07T16:45:00Z", rating: 4.4, reviewCount: 45, email: "lisa@hartwellrealty.com", phone: "(312) 555-0109", companyName: "Hartwell Realty", status: "active" },
  { id: "p10", name: "James O'Brien", category: "Mortgage Lender", city: "Aurora", state: "IL", claimed: true, verified: false, joinedAt: "2026-02-08T13:20:00Z", rating: 4.6, reviewCount: 178, email: "james@obrienmortgage.com", phone: "(630) 555-0110", companyName: "O'Brien Mortgage Services", status: "active" },
  { id: "p11", name: "Amanda Torres", category: "Realtor", city: "Joliet", state: "IL", claimed: true, verified: true, joinedAt: "2026-02-11T09:00:00Z", rating: 4.8, reviewCount: 256, email: "amanda@torresrealty.com", phone: "(815) 555-0111", companyName: "Torres Realty Group", status: "active" },
  { id: "p12", name: "Kevin Washington", category: "Mortgage Lender", city: "Chicago", state: "IL", claimed: true, verified: true, joinedAt: "2026-02-10T14:00:00Z", rating: 4.9, reviewCount: 342, email: "kevin@washloans.com", phone: "(312) 555-0112", companyName: "Washington Home Loans", status: "active" },
  { id: "p13", name: "Grace Park", category: "Insurance Agent", city: "Naperville", state: "IL", claimed: true, verified: true, joinedAt: "2026-02-09T11:30:00Z", rating: 4.7, reviewCount: 198, email: "grace@midwestinsurance.com", phone: "(630) 555-0113", companyName: "Midwest Insurance Partners", status: "active" },
  { id: "p14", name: "Diana Vasquez", category: "Attorney", city: "Chicago", state: "IL", claimed: true, verified: false, joinedAt: "2026-02-07T10:00:00Z", rating: 4.5, reviewCount: 78, email: "diana@vasquezlaw.com", phone: "(312) 555-0114", companyName: "Vasquez Property Law", status: "active" },
  { id: "p15", name: "Robert Kim", category: "Home Inspector", city: "Evanston", state: "IL", claimed: true, verified: false, joinedAt: "2026-02-06T08:45:00Z", rating: 4.3, reviewCount: 34, email: "robert@kimcheck.com", phone: "(847) 555-0115", companyName: "KimCheck Inspections", status: "pending" },
  // Unclaimed IDFPR profiles
  { id: "p16", name: "William Turner", category: "Realtor", city: "Chicago", state: "IL", claimed: false, verified: false, joinedAt: "2026-01-15T00:00:00Z", rating: 0, reviewCount: 0, email: "", phone: null, companyName: "RE/MAX Premier", status: "active" },
  { id: "p17", name: "Jennifer Adams", category: "Realtor", city: "Naperville", state: "IL", claimed: false, verified: false, joinedAt: "2026-01-15T00:00:00Z", rating: 0, reviewCount: 0, email: "", phone: null, companyName: "Coldwell Banker", status: "active" },
  { id: "p18", name: "David Patel", category: "Attorney", city: "Schaumburg", state: "IL", claimed: false, verified: false, joinedAt: "2026-01-28T00:00:00Z", rating: 0, reviewCount: 0, email: "", phone: null, companyName: "Patel & Associates", status: "active" },
  { id: "p19", name: "Stephanie Cruz", category: "Insurance Agent", city: "Joliet", state: "IL", claimed: false, verified: false, joinedAt: "2026-01-15T00:00:00Z", rating: 0, reviewCount: 0, email: "", phone: null, companyName: "Allstate — Cruz Agency", status: "active" },
  { id: "p20", name: "Thomas Mitchell", category: "Home Inspector", city: "Aurora", state: "IL", claimed: false, verified: false, joinedAt: "2026-02-05T00:00:00Z", rating: 0, reviewCount: 0, email: "", phone: null, companyName: "Mitchell Home Inspections", status: "active" },
];