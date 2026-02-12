/**
 * Mock Admin Data
 *
 * All admin dashboard data lives here. Structured for easy replacement
 * with real API/DB calls later.
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
  status: "pending" | "approved" | "rejected" | "info_requested";
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
}

export interface AdminTeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "support" | "viewer";
  avatarUrl: string | null;
  joinedAt: string;
  lastActiveAt: string;
}

export interface ActivityEvent {
  id: string;
  type: "pro_signup" | "consumer_signup" | "verification_submitted" | "verification_approved" | "team_built" | "journey_started" | "profile_claimed" | "outreach_sent";
  description: string;
  timestamp: string;
  actor: string;
}

export interface ServiceCategoryConfig {
  id: string;
  name: ProServiceCategory;
  icon: string;
  description: string;
  proCount: number;
  enabled: boolean;
  order: number;
}

export interface MetricDataPoint {
  label: string;
  value: number;
}

export interface MetricsTimeline {
  signups: MetricDataPoint[];
  proClaims: MetricDataPoint[];
  consumerSearches: MetricDataPoint[];
  journeyStarts: MetricDataPoint[];
  categoryBreakdown: MetricDataPoint[];
}

/* ── Mock Data ─────────────────────────────────────────────────── */

export const mockAdminMetrics: AdminMetrics = {
  totalPros: 10,
  totalConsumers: 47,
  teamsBuilt: 12,
  pendingVerifications: 4,
  activeJourneys: 8,
  googlePlacesListings: 8,
  claimedProfiles: 0,
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
    submittedAt: "2026-02-10T14:30:00Z",
    status: "pending",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
  },
  {
    id: "ver_2",
    proId: "pro_5",
    proName: "Priya Kapoor",
    companyName: "Shield Law Group",
    category: "Attorney",
    licenseNumber: "IL-BAR-6290174",
    licenseType: "Illinois Bar License",
    submittedAt: "2026-02-09T11:00:00Z",
    status: "pending",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
  },
  {
    id: "ver_3",
    proId: "pro_8",
    proName: "Mike Chen",
    companyName: "Safe Harbor Inspections",
    category: "Home Inspector",
    licenseNumber: "IL-HI-450-009283",
    licenseType: "IL Home Inspector License",
    submittedAt: "2026-02-08T09:15:00Z",
    status: "pending",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
  },
  {
    id: "ver_4",
    proId: "pro_9",
    proName: "Lisa Hartwell",
    companyName: "Hartwell Realty",
    category: "Realtor",
    licenseNumber: "IL-RE-475-123456",
    licenseType: "Illinois Real Estate License",
    submittedAt: "2026-02-07T16:45:00Z",
    status: "pending",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
  },
];

export const mockAdminTeam: AdminTeamMember[] = [
  {
    id: "admin_1",
    name: "Frank Johnson",
    email: "frank@relays.app",
    role: "admin",
    avatarUrl: null,
    joinedAt: "2025-11-01T00:00:00Z",
    lastActiveAt: "2026-02-12T10:30:00Z",
  },
  {
    id: "admin_2",
    name: "Taylor Kim",
    email: "taylor@relays.app",
    role: "support",
    avatarUrl: null,
    joinedAt: "2026-01-15T00:00:00Z",
    lastActiveAt: "2026-02-11T16:00:00Z",
  },
  {
    id: "admin_3",
    name: "Alex Rivera",
    email: "alex@relays.app",
    role: "viewer",
    avatarUrl: null,
    joinedAt: "2026-02-01T00:00:00Z",
    lastActiveAt: "2026-02-10T09:00:00Z",
  },
];

export const mockActivityFeed: ActivityEvent[] = [
  {
    id: "act_1",
    type: "pro_signup",
    description: "Sarah Chen signed up as Insurance Agent",
    timestamp: "2026-02-12T09:45:00Z",
    actor: "Sarah Chen",
  },
  {
    id: "act_2",
    type: "verification_submitted",
    description: "Lisa Hartwell submitted IL Real Estate License for verification",
    timestamp: "2026-02-12T08:30:00Z",
    actor: "Lisa Hartwell",
  },
  {
    id: "act_3",
    type: "consumer_signup",
    description: "New consumer signed up: jamie.r@email.com",
    timestamp: "2026-02-11T22:15:00Z",
    actor: "jamie.r@email.com",
  },
  {
    id: "act_4",
    type: "team_built",
    description: "Consumer built a team with 4 professionals",
    timestamp: "2026-02-11T18:00:00Z",
    actor: "user_demo",
  },
  {
    id: "act_5",
    type: "journey_started",
    description: "New journey started: Oak Park Bungalow Purchase",
    timestamp: "2026-02-11T15:30:00Z",
    actor: "user_demo",
  },
  {
    id: "act_6",
    type: "verification_approved",
    description: "Alex Martinez verified as ASHI Certified Home Inspector",
    timestamp: "2026-02-11T10:00:00Z",
    actor: "Frank Johnson",
  },
  {
    id: "act_7",
    type: "outreach_sent",
    description: "Claim email sent to Windy City Home Inspections",
    timestamp: "2026-02-10T14:00:00Z",
    actor: "system",
  },
  {
    id: "act_8",
    type: "pro_signup",
    description: "Derek Okafor signed up as Mortgage Lender",
    timestamp: "2026-02-10T11:00:00Z",
    actor: "Derek Okafor",
  },
];

export const mockServiceCategories: ServiceCategoryConfig[] = [
  {
    id: "cat_1",
    name: "Realtor",
    icon: "🏠",
    description: "Licensed real estate agents helping buyers and sellers",
    proCount: 2,
    enabled: true,
    order: 1,
  },
  {
    id: "cat_2",
    name: "Mortgage Lender",
    icon: "🏦",
    description: "NMLS-licensed loan officers and mortgage brokers",
    proCount: 2,
    enabled: true,
    order: 2,
  },
  {
    id: "cat_3",
    name: "Attorney",
    icon: "⚖️",
    description: "Real estate attorneys for closings and contract review",
    proCount: 2,
    enabled: true,
    order: 3,
  },
  {
    id: "cat_4",
    name: "Home Inspector",
    icon: "🔍",
    description: "Certified home inspectors for pre-purchase inspections",
    proCount: 2,
    enabled: true,
    order: 4,
  },
  {
    id: "cat_5",
    name: "Insurance Agent",
    icon: "🛡️",
    description: "Licensed agents for homeowner insurance policies",
    proCount: 2,
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
    { label: "Jan 1", value: 0 },
    { label: "Jan 8", value: 0 },
    { label: "Jan 15", value: 1 },
    { label: "Jan 22", value: 2 },
    { label: "Jan 29", value: 4 },
    { label: "Feb 5", value: 6 },
    { label: "Feb 12", value: 10 },
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
    { label: "Jan 8", value: 1 },
    { label: "Jan 15", value: 2 },
    { label: "Jan 22", value: 3 },
    { label: "Jan 29", value: 5 },
    { label: "Feb 5", value: 6 },
    { label: "Feb 12", value: 8 },
  ],
  categoryBreakdown: [
    { label: "Realtor", value: 2 },
    { label: "Mortgage Lender", value: 2 },
    { label: "Attorney", value: 2 },
    { label: "Home Inspector", value: 2 },
    { label: "Insurance Agent", value: 2 },
  ],
};
