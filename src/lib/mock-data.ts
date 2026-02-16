import { type Pro, type ProServiceCategory, type ServiceRequest, type TimelineEvent, type Journey, type TeamMember, type ProIncomingRequest, type TimeWindow, type CuratedGroup, type CuratedGroupPartner, type GroupAuditEntry, type ReferralMoment, type JourneyAuditEntry, type NotificationPreference, type NotificationHistoryEntry, type JourneyDocument, type CalendarConnection, type Booking, type BookingTimeWindow, type AvailabilitySlot, type AvailabilityRules } from "@/lib/types";

/* ── Pros (10 across categories) ──────────────────────────────── */

export const mockPros: Pro[] = [
  {
    id: "pro_1",
    slug: "alex-martinez-inspections",
    name: "Alex Martinez",
    companyName: "Blue Peak Inspections",
    headshotUrl: "/demo/headshots/alex.svg",
    companyLogoUrl: "/demo/logos/blue-peak.svg",
    categories: ["Home Inspector"],
    serviceAreas: ["Chicago", "Evanston", "Oak Park"],
    rating: 4.9,
    reviewCount: 312,
    blurb: "Clear reports, fast turnaround, calm guidance for first-time buyers.",
    bio: "Alex Martinez has inspected over 2,000 homes across the Chicagoland area. Specializing in older construction and new builds alike, Alex delivers crystal-clear reports within 24 hours. Known for walking clients through every finding in plain English — no jargon, no scare tactics. Licensed, insured, and ASHI-certified.",
    videoUrl: null,
    introVideoUrl: "https://placeholder.video/alex-intro.mp4",
    badges: [
      { type: "licensed", label: "ASHI Certified" },
      { type: "insured", label: "Fully Insured" },
      { type: "fast-response", label: "< 2hr response" },
    ],
    verified: true, // submitted credentials
    responseTimeMinutes: 45,
    availability: "accepting",
    username: "alexmartinez",
    topThree: ["pro_2", "pro_5", "pro_7"],
    socialLinks: { instagram: "alexmartinez_inspections", linkedin: "alexmartinez" },
    specialties: ["First-time Buyers", "Older Construction", "New Builds", "Radon Testing"],
    licenseNumber: "HI-2019-045832",
  },
  {
    id: "pro_2",
    slug: "jordan-lee-mortgage",
    name: "Jordan Lee",
    companyName: "Sunrise Mortgage",
    headshotUrl: "/demo/headshots/jordan.svg",
    companyLogoUrl: "/demo/logos/sunrise.svg",
    categories: ["Mortgage Lender"],
    serviceAreas: ["Chicago", "Skokie", "Naperville", "Schaumburg"],
    rating: 4.8,
    reviewCount: 198,
    blurb: "Pre-approvals that don't stall deals. Transparent options, no pressure.",
    bio: "Jordan Lee helps first-time buyers and seasoned investors navigate the mortgage process with confidence. Over 15 years in lending, Jordan has closed more than 4,000 loans across Chicagoland. Offers same-day pre-approval letters and keeps clients updated at every milestone. NMLS #123456.",
    videoUrl: null,
    introVideoUrl: "https://placeholder.video/jordan-intro.mp4",
    badges: [
      { type: "licensed", label: "NMLS Licensed" },
      { type: "top-rated", label: "Top Rated 2025" },
    ],
    verified: true, // submitted credentials
    responseTimeMinutes: 30,
    availability: "accepting",
    username: "jordanlee",
    topThree: ["pro_1", "pro_4", "pro_8"],
    socialLinks: { linkedin: "jordanlee-mortgage", youtube: "jordanleelending" },
    specialties: ["First-time Buyers", "FHA Loans", "Conventional", "Refinancing"],
    licenseNumber: "NMLS-123456",
  },
  {
    id: "pro_3",
    slug: "sarah-chen-insurance",
    name: "Sarah Chen",
    companyName: "Lakeside Insurance Group",
    headshotUrl: "/demo/headshots/sarah.svg",
    companyLogoUrl: "/demo/logos/lakeside.svg",
    categories: ["Insurance Agent"],
    serviceAreas: ["Chicago", "Lincoln Park", "Wicker Park", "Logan Square"],
    rating: 4.7,
    reviewCount: 156,
    blurb: "Homeowner policies that actually make sense. Fast quotes, real coverage.",
    bio: "Sarah Chen founded Lakeside Insurance Group to bring clarity to a confusing industry. She works with 12+ carriers to find the best rates for homeowners, and her team processes quotes in under 30 minutes. Sarah is passionate about making sure clients understand exactly what they're covered for — and what they're not.",
    videoUrl: null,
    badges: [
      { type: "licensed", label: "IL Licensed Agent" },
      { type: "partner", label: "Relays Partner" },
    ],
    verified: false,
    responseTimeMinutes: 60,
    availability: "accepting",
    username: "sarahchen",
    topThree: ["pro_2", "pro_1", "pro_5"],
  },
  {
    id: "pro_4",
    slug: "marcus-williams-attorney",
    name: "Marcus Williams",
    companyName: "Greenfield & Associates",
    headshotUrl: "/demo/headshots/marcus.svg",
    companyLogoUrl: "/demo/logos/greenfield.svg",
    categories: ["Attorney"],
    serviceAreas: ["Chicago", "Oakbrook", "Naperville", "Wheaton"],
    rating: 4.9,
    reviewCount: 89,
    blurb: "Real estate closings made smooth. Contract review in 48 hours.",
    bio: "Marcus Williams has practiced real estate law in Illinois for over 20 years. His firm handles everything from contract review to closing representation. Marcus is known for catching issues before they become problems and explaining complex legal terms in everyday language. His team handles 200+ closings per year.",
    videoUrl: null,
    badges: [
      { type: "licensed", label: "IL Bar Member" },
      { type: "fast-response", label: "48hr Contract Review" },
    ],
    verified: true, // submitted credentials
    responseTimeMinutes: 120,
    availability: "accepting",
    username: "marcuswilliams",
    topThree: ["pro_1", "pro_2", "pro_3"],
  },
  {
    id: "pro_5",
    slug: "priya-kapoor-attorney",
    name: "Priya Kapoor",
    companyName: "Shield Law Group",
    headshotUrl: "/demo/headshots/priya.svg",
    companyLogoUrl: "/demo/logos/shield-law.svg",
    categories: ["Attorney"],
    serviceAreas: ["Chicago", "Evanston", "Skokie", "Des Plaines"],
    rating: 4.6,
    reviewCount: 72,
    blurb: "Protecting buyers with sharp contract review and smooth closings.",
    bio: "Priya Kapoor leads the real estate practice at Shield Law Group. Her approach is proactive — she identifies potential contract pitfalls early and communicates directly with all parties to keep deals on track. Priya's background in commercial real estate gives her an edge in complex residential transactions.",
    videoUrl: null,
    badges: [
      { type: "licensed", label: "IL Bar Member" },
      { type: "insured", label: "E&O Insured" },
    ],
    verified: false,
    responseTimeMinutes: 90,
    availability: "accepting",
    username: "priyakapoor",
    topThree: ["pro_2", "pro_3", "pro_7"],
  },
  {
    id: "pro_6",
    slug: "nina-reyes-insurance",
    name: "Nina Reyes",
    companyName: "CoverRight Insurance",
    headshotUrl: "/demo/headshots/nina.svg",
    companyLogoUrl: "/demo/logos/coverright.svg",
    categories: ["Insurance Agent"],
    serviceAreas: ["Chicago", "Cicero", "Berwyn", "Oak Park"],
    rating: 4.8,
    reviewCount: 112,
    blurb: "Bilingual agent specializing in condo and new-build policies. Fast turnaround.",
    bio: "Nina Reyes started CoverRight Insurance to serve the diverse Chicagoland community with transparent, affordable homeowner policies. Fluent in English and Spanish, Nina works with 15+ carriers to compare rates and coverage. Known for same-day quotes and clear explanations of policy fine print.",
    videoUrl: null,
    badges: [
      { type: "licensed", label: "IL Licensed Agent" },
      { type: "fast-response", label: "Same-Day Quotes" },
    ],
    verified: false,
    responseTimeMinutes: 40,
    availability: "accepting",
    username: "ninareyes",
    topThree: ["pro_1", "pro_3", "pro_8"],
  },
  {
    id: "pro_7",
    slug: "derek-okafor-lender",
    name: "Derek Okafor",
    companyName: "Keystone Lending",
    headshotUrl: "/demo/headshots/derek.svg",
    companyLogoUrl: "/demo/logos/keystone.svg",
    categories: ["Mortgage Lender"],
    serviceAreas: ["Chicago", "Naperville", "Aurora", "Joliet"],
    rating: 4.7,
    reviewCount: 134,
    blurb: "First-time buyer specialist. Competitive rates and hands-on guidance.",
    bio: "Derek Okafor brings 12 years of lending experience to every transaction. Specializing in first-time buyer programs, FHA, VA, and conventional loans. Derek is known for walking clients through the entire process step by step and keeping closings on schedule. NMLS #654321.",
    videoUrl: null,
    badges: [
      { type: "licensed", label: "NMLS Licensed" },
      { type: "partner", label: "Relays Partner" },
    ],
    verified: false,
    responseTimeMinutes: 45,
    availability: "accepting",
    username: "derekokafor",
    topThree: ["pro_4", "pro_2", "pro_1"],
  },
  {
    id: "pro_8",
    slug: "mike-chen-inspector",
    name: "Mike Chen",
    companyName: "Safe Harbor Inspections",
    headshotUrl: "/demo/headshots/mike.svg",
    companyLogoUrl: "/demo/logos/safe-harbor.svg",
    categories: ["Home Inspector"],
    serviceAreas: ["Chicago", "Wilmette", "Winnetka", "Highland Park"],
    rating: 4.8,
    reviewCount: 187,
    blurb: "North Shore specialist. Radon, mold, and structural — all in one visit.",
    bio: "Mike Chen specializes in high-end residential inspections on Chicago's North Shore. With dual certifications in structural engineering and home inspection, Mike catches what others miss. Every inspection includes radon, mold screening, and a detailed thermal scan. Reports delivered within 12 hours.",
    videoUrl: null,
    badges: [
      { type: "licensed", label: "IL HI License" },
      { type: "insured", label: "Fully Insured" },
      { type: "top-rated", label: "5-Star Average" },
    ],
    verified: false,
    responseTimeMinutes: 30,
    availability: "accepting",
    username: "mikechen",
    topThree: ["pro_4", "pro_2", "pro_3"],
  },
  {
    id: "pro_9",
    slug: "lisa-hartwell-realtor",
    name: "Lisa Hartwell",
    companyName: "Hartwell Realty",
    headshotUrl: "/demo/headshots/lisa.svg",
    companyLogoUrl: "/demo/logos/hartwell.svg",
    categories: ["Realtor"],
    serviceAreas: ["Chicago", "Lincoln Park", "Lakeview", "Bucktown"],
    rating: 4.9,
    reviewCount: 278,
    blurb: "Chicago's north side expert. Guiding buyers from search to keys.",
    bio: "Lisa Hartwell has helped over 500 families find their dream home in Chicago. Specializing in the north side neighborhoods — Lincoln Park, Lakeview, Bucktown, and Wicker Park — Lisa brings deep market knowledge and fierce negotiation skills. Named a Top Producer for 8 consecutive years.",
    videoUrl: null,
    badges: [
      { type: "licensed", label: "Licensed Realtor" },
      { type: "top-rated", label: "Top Producer" },
      { type: "partner", label: "Relays Partner" },
    ],
    verified: false,
    responseTimeMinutes: 20,
    availability: "accepting",
    username: "lisahartwell",
    topThree: ["pro_2", "pro_1", "pro_3"],
    introVideoUrl: "https://placeholder.video/lisa-intro.mp4",
    socialLinks: { instagram: "lisahartwell_realty", facebook: "hartwellrealty", tiktok: "lisahartwell" },
    specialties: ["Luxury Homes", "North Side Expert", "First-time Buyers", "Investment Properties"],
  },
  {
    id: "pro_10",
    slug: "frank-johnson-realtor",
    name: "Frank Johnson",
    companyName: "Realty One Chicago",
    headshotUrl: "/demo/headshots/frank.svg",
    companyLogoUrl: "/demo/logos/realty-one.svg",
    categories: ["Realtor"],
    serviceAreas: ["Chicago", "West Loop", "South Loop", "Hyde Park"],
    rating: 4.8,
    reviewCount: 195,
    blurb: "Downtown & south side specialist. Data-driven decisions, personal touch.",
    bio: "Frank Johnson brings an analytical approach to real estate, combining market data with genuine care for his clients. Specializing in downtown condos and south side gems, Frank helps buyers find value where others overlook it. His team provides end-to-end support from search through closing and beyond.",
    videoUrl: null,
    badges: [
      { type: "licensed", label: "Licensed Realtor" },
      { type: "fast-response", label: "< 30min Response" },
    ],
    verified: false,
    responseTimeMinutes: 25,
    availability: "accepting",
    username: "frankjohnson",
    topThree: ["pro_2", "pro_1", "pro_7"],
  },
];

/* ── Consumer requests ────────────────────────────────────────── */

export const mockRequests: ServiceRequest[] = [
  {
    id: "req_1",
    userId: "user_demo",
    category: "Home Inspector",
    description: "Need a home inspection for a 3BR bungalow in Oak Park. Built in 1928.",
    addressOrArea: "Oak Park, IL",
    notes: "Concerned about foundation and electrical. Offer accepted, need within 10 days.",
    status: "matched",
    assignedProId: "pro_1",
    createdAt: "2026-02-08T14:30:00Z",
    updatedAt: "2026-02-09T10:15:00Z",
  },
  {
    id: "req_2",
    userId: "user_demo",
    category: "Insurance Agent",
    description: "Need homeowner's insurance quote for closing on Feb 28.",
    addressOrArea: "Lincoln Park, Chicago, IL",
    notes: "Condo with 2BR/2BA. Need HO-6 policy. Closing in 3 weeks.",
    status: "submitted",
    assignedProId: null,
    createdAt: "2026-02-10T09:00:00Z",
    updatedAt: "2026-02-10T09:00:00Z",
  },
  {
    id: "req_3",
    userId: "user_demo",
    category: "Attorney",
    description: "Contract review for home purchase. First-time buyer.",
    addressOrArea: "Evanston, IL",
    notes: "Under contract, attorney review period ends Feb 15.",
    status: "scheduled",
    assignedProId: "pro_4",
    createdAt: "2026-02-05T11:00:00Z",
    updatedAt: "2026-02-10T16:30:00Z",
  },
];

/* ── Timelines ────────────────────────────────────────────────── */

export const mockTimelines: Record<string, TimelineEvent[]> = {
  req_1: [
    { id: "tl_1a", requestId: "req_1", type: "submitted", label: "Request Submitted", description: "You submitted a request for home inspection.", timestamp: "2026-02-08T14:30:00Z", actor: "consumer" },
    { id: "tl_1b", requestId: "req_1", type: "reviewing", label: "Under Review", description: "Your request is being matched with available inspectors.", timestamp: "2026-02-08T15:00:00Z", actor: "system" },
    { id: "tl_1c", requestId: "req_1", type: "matched", label: "Matched", description: "Alex Martinez from Blue Peak Inspections has been assigned.", timestamp: "2026-02-09T10:15:00Z", actor: "system" },
  ],
  req_2: [
    { id: "tl_2a", requestId: "req_2", type: "submitted", label: "Request Submitted", description: "You submitted a request for homeowner's insurance.", timestamp: "2026-02-10T09:00:00Z", actor: "consumer" },
  ],
  req_3: [
    { id: "tl_3a", requestId: "req_3", type: "submitted", label: "Request Submitted", description: "You requested an attorney for contract review.", timestamp: "2026-02-05T11:00:00Z", actor: "consumer" },
    { id: "tl_3b", requestId: "req_3", type: "reviewing", label: "Under Review", description: "Matching with available attorneys in your area.", timestamp: "2026-02-05T12:00:00Z", actor: "system" },
    { id: "tl_3c", requestId: "req_3", type: "matched", label: "Matched", description: "Marcus Williams from Greenfield & Associates assigned.", timestamp: "2026-02-06T09:30:00Z", actor: "system" },
    { id: "tl_3d", requestId: "req_3", type: "scheduled", label: "Review Scheduled", description: "Contract review call scheduled for Feb 12 at 2:00 PM.", timestamp: "2026-02-10T16:30:00Z", actor: "pro" },
  ],
};

/* ── Journeys (full Journey Flow data) ────────────────────────── */

export const mockJourneys: Journey[] = [
  {
    id: "journey_1",
    title: "Oak Park Bungalow",
    address: "742 Maple Ave, Oak Park, IL 60302",
    property: { address: "742 Maple Ave, Oak Park, IL 60302", type: "buying" },
    createdByProId: "pro_9", // Lisa Hartwell (Realtor)
    client: { name: "Jamie Rodriguez", email: "jamie.r@email.com", phone: "(312) 555-0142" },
    status: "active",
    stage: "under_contract",
    roles: [
      { category: "Realtor", status: "filled", assignedProId: "pro_9", recommendedProIds: [] },
      { category: "Mortgage Lender", status: "filled", assignedProId: "pro_2", recommendedProIds: [] },
      { category: "Attorney", status: "recommended", assignedProId: null, recommendedProIds: ["pro_4", "pro_5"] },
      { category: "Home Inspector", status: "recommended", assignedProId: null, recommendedProIds: ["pro_1", "pro_8"] },
      { category: "Insurance Agent", status: "needed", assignedProId: null, recommendedProIds: [] },
    ],
    shareSlug: "j-oak-park-742",
    groupId: "group_lisa_core",
    createdAt: "2026-02-01T10:00:00Z",
    closingDate: "2026-03-15T10:00:00Z",
    auditTrail: [
      { id: "audit_j1_1", journeyId: "journey_1", timestamp: "2026-02-01T10:00:00Z", actor: "pro", actorId: "pro_9", type: "stage_change", toStage: "pre_approval", description: "Journey created at pre-approval stage" },
      { id: "audit_j1_2", journeyId: "journey_1", timestamp: "2026-02-03T14:00:00Z", actor: "pro", actorId: "pro_9", type: "role_filled", description: "Mortgage Lender filled: Jordan Lee" },
      { id: "audit_j1_3", journeyId: "journey_1", timestamp: "2026-02-05T09:00:00Z", actor: "pro", actorId: "pro_9", type: "stage_change", fromStage: "pre_approval", toStage: "house_hunting", description: "Stage advanced to House Hunting" },
      { id: "audit_j1_4", journeyId: "journey_1", timestamp: "2026-02-08T11:00:00Z", actor: "pro", actorId: "pro_9", type: "stage_change", fromStage: "house_hunting", toStage: "offer_made", description: "Stage advanced to Offer Made" },
      { id: "audit_j1_5", journeyId: "journey_1", timestamp: "2026-02-10T16:30:00Z", actor: "system", type: "moment_triggered", description: "Attorney moment triggered — Offer Made" },
      { id: "audit_j1_6", journeyId: "journey_1", timestamp: "2026-02-12T09:00:00Z", actor: "pro", actorId: "pro_9", type: "stage_change", fromStage: "offer_made", toStage: "offer_accepted", description: "Stage advanced to Offer Accepted" },
      { id: "audit_j1_7", journeyId: "journey_1", timestamp: "2026-02-12T09:05:00Z", actor: "system", type: "moment_triggered", description: "Home Inspector moment triggered — schedule within 10 days" },
      { id: "audit_j1_8", journeyId: "journey_1", timestamp: "2026-02-14T14:00:00Z", actor: "pro", actorId: "pro_9", type: "stage_change", fromStage: "offer_accepted", toStage: "under_contract", description: "Stage advanced to Under Contract" },
      { id: "audit_j1_9", journeyId: "journey_1", timestamp: "2026-02-14T14:05:00Z", actor: "system", type: "moment_triggered", description: "Insurance Agent moment triggered — get quotes before closing" },
    ],
    // Legacy compat
    pendingAction: "Choose your attorney",
    nextStep: "Lisa recommended 2 attorneys — pick the one that fits",
    owner: "You",
    teamMembers: [
      { proId: "pro_9", role: "Realtor", status: "confirmed" },
      { proId: "pro_2", role: "Mortgage Lender", status: "confirmed" },
    ],
  },
  {
    id: "journey_2",
    title: "Lincoln Park Condo",
    address: "1455 N Wells St, Chicago, IL 60614",
    property: { address: "1455 N Wells St, Chicago, IL 60614", type: "selling" },
    createdByProId: "pro_10", // Frank Johnson (Realtor)
    client: { name: "Sam Patel", email: "sam.patel@email.com", phone: "(773) 555-0198" },
    status: "active",
    stage: "offer_made",
    roles: [
      { category: "Realtor", status: "filled", assignedProId: "pro_10", recommendedProIds: [] },
      { category: "Mortgage Lender", status: "filled", assignedProId: "pro_2", recommendedProIds: [] },
      { category: "Attorney", status: "filled", assignedProId: "pro_5", recommendedProIds: [] },
      { category: "Home Inspector", status: "recommended", assignedProId: null, recommendedProIds: ["pro_1", "pro_8"] },
      { category: "Insurance Agent", status: "recommended", assignedProId: null, recommendedProIds: ["pro_3", "pro_6"] },
    ],
    shareSlug: "j-lincoln-park-1455",
    groupId: "group_frank_zillow",
    createdAt: "2026-01-28T14:00:00Z",
    auditTrail: [
      { id: "audit_j2_1", journeyId: "journey_2", timestamp: "2026-01-28T14:00:00Z", actor: "pro", actorId: "pro_10", type: "stage_change", toStage: "pre_approval", description: "Journey created at pre-approval stage" },
      { id: "audit_j2_2", journeyId: "journey_2", timestamp: "2026-01-30T10:00:00Z", actor: "pro", actorId: "pro_10", type: "stage_change", fromStage: "pre_approval", toStage: "house_hunting", description: "Stage advanced to House Hunting" },
      { id: "audit_j2_3", journeyId: "journey_2", timestamp: "2026-02-05T15:00:00Z", actor: "pro", actorId: "pro_10", type: "stage_change", fromStage: "house_hunting", toStage: "offer_made", description: "Stage advanced to Offer Made" },
      { id: "audit_j2_4", journeyId: "journey_2", timestamp: "2026-02-05T15:05:00Z", actor: "system", type: "moment_triggered", description: "Attorney moment triggered — review contract" },
    ],
    // Legacy compat
    pendingAction: "Book a home inspector",
    nextStep: "Frank recommended 2 inspectors — schedule yours",
    owner: "You",
    teamMembers: [
      { proId: "pro_10", role: "Realtor", status: "confirmed" },
      { proId: "pro_2", role: "Mortgage Lender", status: "confirmed" },
      { proId: "pro_5", role: "Attorney", status: "confirmed" },
    ],
  },
  {
    id: "journey_3",
    title: "Evanston Victorian",
    address: "824 Davis St, Evanston, IL 60201",
    property: { address: "824 Davis St, Evanston, IL 60201", type: "buying" },
    createdByProId: "pro_9", // Lisa Hartwell (Realtor)
    client: { name: "Morgan Davis", email: "morgan.d@email.com", phone: "(847) 555-0267" },
    status: "completed",
    stage: "closed",
    closingDate: "2026-02-20T10:00:00Z",
    roles: [
      { category: "Realtor", status: "filled", assignedProId: "pro_9", recommendedProIds: [] },
      { category: "Mortgage Lender", status: "filled", assignedProId: "pro_2", recommendedProIds: [] },
      { category: "Attorney", status: "filled", assignedProId: "pro_4", recommendedProIds: [] },
      { category: "Home Inspector", status: "filled", assignedProId: "pro_8", recommendedProIds: [] },
      { category: "Insurance Agent", status: "filled", assignedProId: "pro_3", recommendedProIds: [] },
    ],
    shareSlug: "j-evanston-824",
    groupId: "group_lisa_core",
    createdAt: "2026-01-15T09:00:00Z",
    auditTrail: [
      { id: "audit_j3_1", journeyId: "journey_3", timestamp: "2026-01-15T09:00:00Z", actor: "pro", actorId: "pro_9", type: "stage_change", toStage: "pre_approval", description: "Journey created" },
      { id: "audit_j3_2", journeyId: "journey_3", timestamp: "2026-01-16T10:00:00Z", actor: "pro", actorId: "pro_9", type: "role_filled", description: "Mortgage Lender filled: Jordan Lee" },
      { id: "audit_j3_3", journeyId: "journey_3", timestamp: "2026-01-18T09:00:00Z", actor: "pro", actorId: "pro_9", type: "stage_change", fromStage: "pre_approval", toStage: "house_hunting", description: "Stage advanced to House Hunting" },
      { id: "audit_j3_4", journeyId: "journey_3", timestamp: "2026-01-22T14:00:00Z", actor: "pro", actorId: "pro_9", type: "stage_change", fromStage: "house_hunting", toStage: "offer_made", description: "Stage advanced to Offer Made" },
      { id: "audit_j3_5", journeyId: "journey_3", timestamp: "2026-01-22T14:05:00Z", actor: "pro", actorId: "pro_9", type: "role_filled", description: "Attorney filled: Marcus Williams" },
      { id: "audit_j3_6", journeyId: "journey_3", timestamp: "2026-01-25T11:00:00Z", actor: "pro", actorId: "pro_9", type: "stage_change", fromStage: "offer_made", toStage: "offer_accepted", description: "Offer accepted!" },
      { id: "audit_j3_7", journeyId: "journey_3", timestamp: "2026-01-26T09:00:00Z", actor: "pro", actorId: "pro_9", type: "role_filled", description: "Home Inspector filled: Mike Chen" },
      { id: "audit_j3_8", journeyId: "journey_3", timestamp: "2026-01-30T14:00:00Z", actor: "pro", actorId: "pro_9", type: "stage_change", fromStage: "offer_accepted", toStage: "under_contract", description: "Under contract" },
      { id: "audit_j3_9", journeyId: "journey_3", timestamp: "2026-02-02T10:00:00Z", actor: "pro", actorId: "pro_9", type: "role_filled", description: "Insurance Agent filled: Sarah Chen" },
      { id: "audit_j3_10", journeyId: "journey_3", timestamp: "2026-02-10T09:00:00Z", actor: "pro", actorId: "pro_9", type: "stage_change", fromStage: "under_contract", toStage: "closing_scheduled", description: "Closing scheduled for Feb 20" },
      { id: "audit_j3_11", journeyId: "journey_3", timestamp: "2026-02-20T10:00:00Z", actor: "system", type: "stage_change", fromStage: "closing_scheduled", toStage: "closed", description: "Closed! Congratulations!" },
      { id: "audit_j3_12", journeyId: "journey_3", timestamp: "2026-02-20T10:05:00Z", actor: "system", type: "moment_triggered", description: "Post-close moments: handyman, insurance review" },
    ],
    // Legacy compat
    pendingAction: "All set!",
    nextStep: "Your team is complete — you're ready for closing",
    owner: "You",
    teamMembers: [
      { proId: "pro_9", role: "Realtor", status: "confirmed" },
      { proId: "pro_2", role: "Mortgage Lender", status: "confirmed" },
      { proId: "pro_4", role: "Attorney", status: "confirmed" },
      { proId: "pro_8", role: "Home Inspector", status: "confirmed" },
      { proId: "pro_3", role: "Insurance Agent", status: "confirmed" },
    ],
  },
];

/* ── Team roster (consumer) ───────────────────────────────────── */

export const mockTeam: TeamMember[] = [
  { proId: "pro_9", role: "Realtor", addedAt: "2026-01-10T10:00:00Z" },
  { proId: "pro_2", role: "Mortgage Lender", addedAt: "2026-01-12T14:00:00Z" },
  { proId: "pro_1", role: "Home Inspector", addedAt: "2026-01-15T09:00:00Z" },
  { proId: "pro_4", role: "Attorney", addedAt: "2026-01-18T11:00:00Z" },
  { proId: "pro_3", role: "Insurance Agent", addedAt: "2026-01-20T16:00:00Z" },
];

/* ── Pro incoming requests ────────────────────────────────────── */

export const mockProIncomingRequests: ProIncomingRequest[] = [
  {
    id: "pir_1",
    requestId: "req_new_1",
    clientName: "Jamie Rodriguez",
    clientEmail: "jamie.r@email.com",
    category: "Home Inspector",
    description: "Need inspection for a 4BR colonial in Naperville. Built 1995.",
    addressOrArea: "Naperville, IL",
    status: "pending",
    receivedAt: "2026-02-10T08:00:00Z",
  },
  {
    id: "pir_2",
    requestId: "req_new_2",
    clientName: "Sam Patel",
    clientEmail: "sam.patel@email.com",
    category: "Home Inspector",
    description: "Pre-listing inspection for a townhome in Evanston.",
    addressOrArea: "Evanston, IL",
    status: "pending",
    receivedAt: "2026-02-09T16:30:00Z",
  },
  {
    id: "pir_3",
    requestId: "req_new_3",
    clientName: "Morgan Davis",
    clientEmail: "morgan.d@email.com",
    category: "Home Inspector",
    description: "Inspection needed ASAP — closing in 2 weeks. 2BR condo, Oak Park.",
    addressOrArea: "Oak Park, IL",
    status: "accepted",
    receivedAt: "2026-02-08T10:00:00Z",
  },
  {
    id: "pir_4",
    requestId: "req_new_4",
    clientName: "Casey Wilson",
    clientEmail: "casey.w@email.com",
    category: "Home Inspector",
    description: "Radon + mold inspection for basement in Skokie ranch.",
    addressOrArea: "Skokie, IL",
    status: "declined",
    receivedAt: "2026-02-07T12:00:00Z",
  },
];

/* ── Booking time windows ─────────────────────────────────────── */

export function generateTimeWindows(date: string, category: "inspector" | "trades"): TimeWindow[] {
  const duration = category === "inspector" ? 2 : 1; // hours
  const slots: TimeWindow[] = [];
  const starts = category === "inspector"
    ? ["08:00", "10:30", "13:00", "15:30"]
    : ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

  starts.forEach((start, i) => {
    const [h, m] = start.split(":").map(Number);
    const endH = h + duration;
    const endTime = `${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    slots.push({
      id: `tw_${date}_${i}`,
      date,
      startTime: start,
      endTime,
      available: Math.random() > 0.3, // ~70% availability
    });
  });

  return slots;
}

/* ── Helpers ──────────────────────────────────────────────────── */

export function getProById(id: string): Pro | undefined {
  return mockPros.find((p) => p.id === id);
}

export function getProBySlug(slug: string): Pro | undefined {
  return mockPros.find((p) => p.slug === slug);
}

export function getProByUsername(username: string): Pro | undefined {
  return mockPros.find((p) => p.username === username);
}

export function getRequestById(id: string): ServiceRequest | undefined {
  return mockRequests.find((r) => r.id === id);
}

export function getTimelineForRequest(requestId: string): TimelineEvent[] {
  return mockTimelines[requestId] ?? [];
}

export const serviceCategories = [
  "Realtor",
  "Mortgage Lender",
  "Attorney",
  "Home Inspector",
  "Insurance Agent",
] as const;

/* ── Journey helpers ──────────────────────────────────────────── */

export function getJourneyById(id: string): Journey | undefined {
  return mockJourneys.find((j) => j.id === id);
}

export function getJourneyBySlug(slug: string): Journey | undefined {
  return mockJourneys.find((j) => j.shareSlug === slug);
}

export function getFilledRoleCount(journey: Journey): number {
  return journey.roles.filter((r) => r.status === "filled").length;
}

export function getTotalRoleCount(): number {
  return 5; // always 5 categories
}

export function getJourneysForPro(proId: string): Journey[] {
  return mockJourneys.filter((j) => j.createdByProId === proId);
}

export function getProsByCategory(category: string): Pro[] {
  return mockPros.filter((p) => p.categories.includes(category as ProServiceCategory));
}

/* ── Curated Groups (mock data) ───────────────────────────────── */

export const mockCuratedGroups: CuratedGroup[] = [
  // ── Lisa Hartwell (pro_9, Realtor) groups ──
  {
    id: "group_lisa_core",
    name: "Core Team",
    slug: "core",
    description: "My go-to referral partners for standard buyer transactions in Chicago.",
    tags: ["scenario"],
    proId: "pro_9",
    isDefault: true,
    createdAt: "2026-01-05T10:00:00Z",
    partners: [
      { proId: "pro_2", category: "Mortgage Lender", position: 1, addedAt: "2026-01-05T10:00:00Z" },
      { proId: "pro_7", category: "Mortgage Lender", position: 2, addedAt: "2026-01-06T10:00:00Z" },
      { proId: "pro_4", category: "Attorney", position: 1, addedAt: "2026-01-05T10:00:00Z" },
      { proId: "pro_5", category: "Attorney", position: 2, addedAt: "2026-01-05T10:00:00Z" },
      { proId: "pro_1", category: "Home Inspector", position: 1, addedAt: "2026-01-05T10:00:00Z" },
      { proId: "pro_8", category: "Home Inspector", position: 2, addedAt: "2026-01-06T10:00:00Z" },
      { proId: "pro_3", category: "Insurance Agent", position: 1, addedAt: "2026-01-05T10:00:00Z" },
      { proId: "pro_6", category: "Insurance Agent", position: 2, addedAt: "2026-01-07T10:00:00Z" },
    ],
  },
  {
    id: "group_lisa_zillow",
    name: "Zillow Leads",
    slug: "zillow",
    description: "Optimized partner set for Zillow buyer leads — fast responders only.",
    tags: ["lead_source"],
    proId: "pro_9",
    isDefault: false,
    createdAt: "2026-01-12T14:00:00Z",
    partners: [
      { proId: "pro_7", category: "Mortgage Lender", position: 1, addedAt: "2026-01-12T14:00:00Z" },
      { proId: "pro_2", category: "Mortgage Lender", position: 2, addedAt: "2026-01-12T14:00:00Z" },
      { proId: "pro_5", category: "Attorney", position: 1, addedAt: "2026-01-12T14:00:00Z" },
      { proId: "pro_1", category: "Home Inspector", position: 1, addedAt: "2026-01-12T14:00:00Z" },
      { proId: "pro_8", category: "Home Inspector", position: 2, addedAt: "2026-01-12T14:00:00Z" },
      { proId: "pro_6", category: "Insurance Agent", position: 1, addedAt: "2026-01-12T14:00:00Z" },
      { proId: "pro_3", category: "Insurance Agent", position: 2, addedAt: "2026-01-12T14:00:00Z" },
    ],
  },
  {
    id: "group_lisa_spanish",
    name: "Spanish",
    slug: "spanish",
    description: "Spanish-speaking referral partners for bilingual clients.",
    tags: ["language"],
    proId: "pro_9",
    isDefault: false,
    createdAt: "2026-01-18T09:00:00Z",
    partners: [
      { proId: "pro_7", category: "Mortgage Lender", position: 1, addedAt: "2026-01-18T09:00:00Z" },
      { proId: "pro_5", category: "Attorney", position: 1, addedAt: "2026-01-18T09:00:00Z" },
      { proId: "pro_1", category: "Home Inspector", position: 1, addedAt: "2026-01-18T09:00:00Z" },
      { proId: "pro_6", category: "Insurance Agent", position: 1, addedAt: "2026-01-18T09:00:00Z" },
    ],
  },
  {
    id: "group_lisa_luxury",
    name: "Luxury",
    slug: "luxury",
    description: "Premium partners for luxury ($1M+) transactions. White-glove service.",
    tags: ["scenario"],
    proId: "pro_9",
    isDefault: false,
    createdAt: "2026-01-22T11:00:00Z",
    partners: [
      { proId: "pro_2", category: "Mortgage Lender", position: 1, addedAt: "2026-01-22T11:00:00Z" },
      { proId: "pro_4", category: "Attorney", position: 1, addedAt: "2026-01-22T11:00:00Z" },
      { proId: "pro_5", category: "Attorney", position: 2, addedAt: "2026-01-22T11:00:00Z" },
      { proId: "pro_8", category: "Home Inspector", position: 1, addedAt: "2026-01-22T11:00:00Z" },
      { proId: "pro_1", category: "Home Inspector", position: 2, addedAt: "2026-01-22T11:00:00Z" },
      { proId: "pro_3", category: "Insurance Agent", position: 1, addedAt: "2026-01-22T11:00:00Z" },
    ],
  },
  // ── Frank Johnson (pro_10, Realtor) groups ──
  {
    id: "group_frank_core",
    name: "Core Team",
    slug: "core",
    description: "Standard referral partners for downtown and south side transactions.",
    tags: ["scenario"],
    proId: "pro_10",
    isDefault: true,
    createdAt: "2026-01-08T10:00:00Z",
    partners: [
      { proId: "pro_2", category: "Mortgage Lender", position: 1, addedAt: "2026-01-08T10:00:00Z" },
      { proId: "pro_7", category: "Mortgage Lender", position: 2, addedAt: "2026-01-09T10:00:00Z" },
      { proId: "pro_4", category: "Attorney", position: 1, addedAt: "2026-01-08T10:00:00Z" },
      { proId: "pro_1", category: "Home Inspector", position: 1, addedAt: "2026-01-08T10:00:00Z" },
      { proId: "pro_8", category: "Home Inspector", position: 2, addedAt: "2026-01-08T10:00:00Z" },
      { proId: "pro_3", category: "Insurance Agent", position: 1, addedAt: "2026-01-08T10:00:00Z" },
      { proId: "pro_6", category: "Insurance Agent", position: 2, addedAt: "2026-01-08T10:00:00Z" },
    ],
  },
  {
    id: "group_frank_zillow",
    name: "Zillow Leads",
    slug: "zillow",
    description: "Zillow buyer leads — fast close partners.",
    tags: ["lead_source"],
    proId: "pro_10",
    isDefault: false,
    createdAt: "2026-01-14T14:00:00Z",
    partners: [
      { proId: "pro_2", category: "Mortgage Lender", position: 1, addedAt: "2026-01-14T14:00:00Z" },
      { proId: "pro_5", category: "Attorney", position: 1, addedAt: "2026-01-14T14:00:00Z" },
      { proId: "pro_1", category: "Home Inspector", position: 1, addedAt: "2026-01-14T14:00:00Z" },
      { proId: "pro_6", category: "Insurance Agent", position: 1, addedAt: "2026-01-14T14:00:00Z" },
      { proId: "pro_3", category: "Insurance Agent", position: 2, addedAt: "2026-01-14T14:00:00Z" },
    ],
  },
  {
    id: "group_frank_facebook",
    name: "Facebook Leads",
    slug: "facebook",
    description: "Optimized for Facebook ad leads — nurture flow partners.",
    tags: ["lead_source"],
    proId: "pro_10",
    isDefault: false,
    createdAt: "2026-01-20T16:00:00Z",
    partners: [
      { proId: "pro_7", category: "Mortgage Lender", position: 1, addedAt: "2026-01-20T16:00:00Z" },
      { proId: "pro_2", category: "Mortgage Lender", position: 2, addedAt: "2026-01-20T16:00:00Z" },
      { proId: "pro_4", category: "Attorney", position: 1, addedAt: "2026-01-20T16:00:00Z" },
      { proId: "pro_8", category: "Home Inspector", position: 1, addedAt: "2026-01-20T16:00:00Z" },
      { proId: "pro_3", category: "Insurance Agent", position: 1, addedAt: "2026-01-20T16:00:00Z" },
    ],
  },
  {
    id: "group_frank_investor",
    name: "Investor",
    slug: "investor",
    description: "Partners experienced with investment properties and multi-units.",
    tags: ["scenario"],
    proId: "pro_10",
    isDefault: false,
    createdAt: "2026-01-25T09:00:00Z",
    partners: [
      { proId: "pro_7", category: "Mortgage Lender", position: 1, addedAt: "2026-01-25T09:00:00Z" },
      { proId: "pro_4", category: "Attorney", position: 1, addedAt: "2026-01-25T09:00:00Z" },
      { proId: "pro_5", category: "Attorney", position: 2, addedAt: "2026-01-25T09:00:00Z" },
      { proId: "pro_1", category: "Home Inspector", position: 1, addedAt: "2026-01-25T09:00:00Z" },
      { proId: "pro_6", category: "Insurance Agent", position: 1, addedAt: "2026-01-25T09:00:00Z" },
    ],
  },
];

/* ── Group audit log entries ──────────────────────────────────── */

export const mockGroupAuditLog: GroupAuditEntry[] = [
  {
    id: "audit_1",
    journeyId: "journey_2",
    fromGroupId: "group_frank_core",
    toGroupId: "group_frank_zillow",
    changedBy: "pro_10",
    reason: "Client came from Zillow ad — switching to Zillow partners",
    timestamp: "2026-01-28T14:30:00Z",
  },
  {
    id: "audit_2",
    journeyId: "journey_1",
    fromGroupId: null,
    toGroupId: "group_lisa_core",
    changedBy: "pro_9",
    reason: "Journey created with Core group",
    timestamp: "2026-02-01T10:00:00Z",
  },
  {
    id: "audit_3",
    journeyId: "journey_3",
    fromGroupId: null,
    toGroupId: "group_lisa_core",
    changedBy: "pro_9",
    reason: "Journey created with Core group",
    timestamp: "2026-01-15T09:00:00Z",
  },
];

/* ── Curated Group helpers ────────────────────────────────────── */

export function getGroupById(id: string): CuratedGroup | undefined {
  return mockCuratedGroups.find((g) => g.id === id);
}

export function getGroupsForPro(proId: string): CuratedGroup[] {
  return mockCuratedGroups.filter((g) => g.proId === proId);
}

export function getDefaultGroupForPro(proId: string): CuratedGroup | undefined {
  return mockCuratedGroups.find((g) => g.proId === proId && g.isDefault);
}

export function getGroupBySlug(proId: string, slug: string): CuratedGroup | undefined {
  return mockCuratedGroups.find((g) => g.proId === proId && g.slug === slug);
}

export function getGroupPartnersByCategory(group: CuratedGroup, category: string): CuratedGroupPartner[] {
  return group.partners
    .filter((p) => p.category === category)
    .sort((a, b) => a.position - b.position);
}

export function getAuditLogForJourney(journeyId: string): GroupAuditEntry[] {
  return mockGroupAuditLog.filter((e) => e.journeyId === journeyId);
}

/** Get unique categories present in a group */
export function getGroupCategories(group: CuratedGroup): ProServiceCategory[] {
  const cats = new Set(group.partners.map((p) => p.category));
  return Array.from(cats) as ProServiceCategory[];
}

/** Count partners in a group */
export function getGroupPartnerCount(group: CuratedGroup): number {
  return group.partners.length;
}

/* ── Journey Documents (mock data) ────────────────────────────── */

export const mockDocuments: JourneyDocument[] = [
  // Journey 1: Oak Park Bungalow — early stage (pre-approval + offer)
  {
    id: "doc_1",
    journeyId: "journey_1",
    category: "pre_approval_letter",
    title: "Pre-Approval Letter",
    description: "Mortgage pre-approval from Sunrise Mortgage",
    status: "approved",
    uploadedBy: "Jordan Lee",
    uploadedAt: "2026-02-02T14:30:00Z",
    fileUrl: "/mock/docs/pre-approval-letter.pdf",
    fileType: "application/pdf",
    fileSize: 245_000,
    requestedBy: "Lisa Hartwell",
    requestedAt: "2026-02-01T16:00:00Z",
    reviewedBy: "Lisa Hartwell",
    reviewedAt: "2026-02-02T16:00:00Z",
    notes: "Approved for $425,000. Valid through March 15.",
  },
  {
    id: "doc_2",
    journeyId: "journey_1",
    category: "purchase_agreement",
    title: "Purchase Agreement",
    description: "Signed purchase contract for 742 Maple Ave",
    status: "uploaded",
    uploadedBy: "Jamie Rodriguez",
    uploadedAt: "2026-02-05T10:15:00Z",
    fileUrl: "/mock/docs/purchase-agreement.pdf",
    fileType: "application/pdf",
    fileSize: 892_000,
    requestedBy: "Lisa Hartwell",
    requestedAt: "2026-02-04T09:00:00Z",
  },
  {
    id: "doc_3",
    journeyId: "journey_1",
    category: "inspection_report",
    title: "Home Inspection Report",
    description: "Full property inspection for 742 Maple Ave",
    status: "requested",
    requestedBy: "Lisa Hartwell",
    requestedAt: "2026-02-08T11:00:00Z",
    notes: "Please upload once the inspection is completed this week.",
  },
  {
    id: "doc_4",
    journeyId: "journey_1",
    category: "insurance_binder",
    title: "Insurance Binder",
    status: "needed",
  },
  {
    id: "doc_5",
    journeyId: "journey_1",
    category: "closing_disclosure",
    title: "Closing Disclosure",
    status: "needed",
  },

  // Journey 2: Lincoln Park Condo — further along
  {
    id: "doc_6",
    journeyId: "journey_2",
    category: "pre_approval_letter",
    title: "Pre-Approval Letter",
    description: "Mortgage pre-approval from Sunrise Mortgage",
    status: "approved",
    uploadedBy: "Jordan Lee",
    uploadedAt: "2026-01-29T10:00:00Z",
    fileUrl: "/mock/docs/pre-approval-sam.pdf",
    fileType: "application/pdf",
    fileSize: 198_000,
    reviewedBy: "Frank Johnson",
    reviewedAt: "2026-01-29T14:00:00Z",
  },
  {
    id: "doc_7",
    journeyId: "journey_2",
    category: "purchase_agreement",
    title: "Purchase Agreement",
    description: "Signed condo purchase contract",
    status: "approved",
    uploadedBy: "Sam Patel",
    uploadedAt: "2026-02-01T09:30:00Z",
    fileUrl: "/mock/docs/purchase-agreement-condo.pdf",
    fileType: "application/pdf",
    fileSize: 1_245_000,
    reviewedBy: "Frank Johnson",
    reviewedAt: "2026-02-01T15:00:00Z",
    notes: "Contract reviewed and approved by attorney.",
  },
  {
    id: "doc_8",
    journeyId: "journey_2",
    category: "inspection_report",
    title: "Home Inspection Report",
    status: "requested",
    requestedBy: "Frank Johnson",
    requestedAt: "2026-02-09T08:00:00Z",
    notes: "Inspection scheduled for Feb 12. Please upload the report after.",
  },
  {
    id: "doc_9",
    journeyId: "journey_2",
    category: "amendment",
    title: "Inspection Contingency Amendment",
    description: "Amendment extending inspection deadline",
    status: "uploaded",
    uploadedBy: "Priya Kapoor",
    uploadedAt: "2026-02-07T16:45:00Z",
    fileUrl: "/mock/docs/amendment-inspection.pdf",
    fileType: "application/pdf",
    fileSize: 156_000,
  },
  {
    id: "doc_10",
    journeyId: "journey_2",
    category: "insurance_binder",
    title: "Insurance Binder",
    status: "needed",
  },
  {
    id: "doc_11",
    journeyId: "journey_2",
    category: "title_commitment",
    title: "Title Commitment",
    status: "needed",
  },
  {
    id: "doc_12",
    journeyId: "journey_2",
    category: "closing_disclosure",
    title: "Closing Disclosure",
    status: "needed",
  },

  // Journey 3: Evanston Victorian — completed, all approved
  {
    id: "doc_13",
    journeyId: "journey_3",
    category: "pre_approval_letter",
    title: "Pre-Approval Letter",
    status: "approved",
    uploadedBy: "Jordan Lee",
    uploadedAt: "2026-01-16T10:00:00Z",
    fileUrl: "/mock/docs/pre-approval-morgan.pdf",
    fileType: "application/pdf",
    fileSize: 210_000,
    reviewedBy: "Lisa Hartwell",
    reviewedAt: "2026-01-16T14:00:00Z",
  },
  {
    id: "doc_14",
    journeyId: "journey_3",
    category: "purchase_agreement",
    title: "Purchase Agreement",
    status: "approved",
    uploadedBy: "Morgan Davis",
    uploadedAt: "2026-01-18T11:30:00Z",
    fileUrl: "/mock/docs/purchase-evanston.pdf",
    fileType: "application/pdf",
    fileSize: 934_000,
    reviewedBy: "Lisa Hartwell",
    reviewedAt: "2026-01-18T16:00:00Z",
  },
  {
    id: "doc_15",
    journeyId: "journey_3",
    category: "inspection_report",
    title: "Home Inspection Report",
    status: "approved",
    uploadedBy: "Mike Chen",
    uploadedAt: "2026-01-22T09:00:00Z",
    fileUrl: "/mock/docs/inspection-evanston.pdf",
    fileType: "application/pdf",
    fileSize: 3_456_000,
    reviewedBy: "Lisa Hartwell",
    reviewedAt: "2026-01-22T17:00:00Z",
    notes: "Minor roof repairs recommended. See page 12.",
  },
  {
    id: "doc_16",
    journeyId: "journey_3",
    category: "insurance_binder",
    title: "Insurance Binder",
    status: "approved",
    uploadedBy: "Sarah Chen",
    uploadedAt: "2026-01-25T14:00:00Z",
    fileUrl: "/mock/docs/insurance-evanston.pdf",
    fileType: "application/pdf",
    fileSize: 178_000,
    reviewedBy: "Lisa Hartwell",
    reviewedAt: "2026-01-25T16:30:00Z",
  },
  {
    id: "doc_17",
    journeyId: "journey_3",
    category: "closing_disclosure",
    title: "Closing Disclosure",
    status: "approved",
    uploadedBy: "Jordan Lee",
    uploadedAt: "2026-01-28T10:00:00Z",
    fileUrl: "/mock/docs/closing-disclosure-evanston.pdf",
    fileType: "application/pdf",
    fileSize: 567_000,
    reviewedBy: "Lisa Hartwell",
    reviewedAt: "2026-01-28T15:00:00Z",
  },
  {
    id: "doc_18",
    journeyId: "journey_3",
    category: "title_commitment",
    title: "Title Commitment",
    status: "approved",
    uploadedBy: "Marcus Williams",
    uploadedAt: "2026-01-26T11:00:00Z",
    fileUrl: "/mock/docs/title-commitment-evanston.pdf",
    fileType: "application/pdf",
    fileSize: 412_000,
    reviewedBy: "Lisa Hartwell",
    reviewedAt: "2026-01-26T14:00:00Z",
  },
];

/* ── Document helpers ─────────────────────────────────────────── */

export function getDocumentsForJourney(journeyId: string): JourneyDocument[] {
  return mockDocuments.filter((d) => d.journeyId === journeyId);
}

export function getDocumentById(docId: string): JourneyDocument | undefined {
  return mockDocuments.find((d) => d.id === docId);
}

export function getDocumentsByStatus(status: JourneyDocument["status"]): JourneyDocument[] {
  return mockDocuments.filter((d) => d.status === status);
}

export function getDocumentStats(journeyId: string) {
  const docs = getDocumentsForJourney(journeyId);
  const total = docs.length;
  const approved = docs.filter((d) => d.status === "approved").length;
  const uploaded = docs.filter((d) => d.status === "uploaded" || d.status === "reviewed").length;
  const requested = docs.filter((d) => d.status === "requested").length;
  const needed = docs.filter((d) => d.status === "needed").length;
  return { total, approved, uploaded, requested, needed };
}

/** All docs across all journeys that need attention (for pro dashboard) */
export function getPendingDocumentsForPro(): (JourneyDocument & { journeyTitle: string; clientName: string })[] {
  const pending: (JourneyDocument & { journeyTitle: string; clientName: string })[] = [];
  for (const doc of mockDocuments) {
    if (doc.status === "uploaded" || doc.status === "requested") {
      const journey = getJourneyById(doc.journeyId);
      if (journey) {
        pending.push({
          ...doc,
          journeyTitle: journey.title,
          clientName: journey.client.name,
        });
      }
    }
  }
  return pending;
}

/** All docs that a consumer needs to act on */
export function getConsumerActionableDocuments(): (JourneyDocument & { journeyTitle: string })[] {
  const actionable: (JourneyDocument & { journeyTitle: string })[] = [];
  for (const doc of mockDocuments) {
    if (doc.status === "requested" || doc.status === "needed") {
      const journey = getJourneyById(doc.journeyId);
      if (journey) {
        actionable.push({
          ...doc,
          journeyTitle: journey.title,
        });
      }
    }
  }
  return actionable;
}

/* ── Mock Referral Moments ────────────────────────────────────── */

export const mockReferralMoments: ReferralMoment[] = [
  // Journey 1 — Oak Park Bungalow (under_contract)
  {
    id: "moment_j1_lender",
    journeyId: "journey_1",
    stage: "pre_approval",
    category: "Mortgage Lender",
    title: "Get Pre-Approved",
    description: "Connect with a lender to get your pre-approval letter.",
    priority: "completed",
    triggerType: "stage_based",
    completedAt: "2026-02-03T14:00:00Z",
    action: "send_top_3",
    status: "completed",
  },
  {
    id: "moment_j1_realtor",
    journeyId: "journey_1",
    stage: "pre_approval",
    category: "Realtor",
    title: "Find Your Realtor",
    description: "Your realtor guides every step of the journey.",
    priority: "completed",
    triggerType: "stage_based",
    completedAt: "2026-02-01T10:00:00Z",
    action: "send_top_3",
    status: "completed",
  },
  {
    id: "moment_j1_attorney",
    journeyId: "journey_1",
    stage: "offer_made",
    category: "Attorney",
    title: "Engage a Real Estate Attorney",
    description: "An attorney will review your purchase contract and protect your interests.",
    priority: "urgent",
    triggerType: "stage_based",
    action: "send_top_3",
    status: "active",
  },
  {
    id: "moment_j1_inspector",
    journeyId: "journey_1",
    stage: "offer_accepted",
    category: "Home Inspector",
    title: "Schedule Home Inspection",
    description: "Book a home inspector within 10 days to uncover any issues before closing.",
    priority: "urgent",
    triggerType: "stage_based",
    action: "send_top_3",
    status: "active",
  },
  {
    id: "moment_j1_insurance",
    journeyId: "journey_1",
    stage: "under_contract",
    category: "Insurance Agent",
    title: "Get Homeowner's Insurance",
    description: "You'll need proof of insurance before closing. Get quotes now.",
    priority: "urgent",
    triggerType: "stage_based",
    action: "send_top_3",
    status: "active",
  },
  // Journey 2 — Lincoln Park Condo (offer_made, selling)
  {
    id: "moment_j2_lender",
    journeyId: "journey_2",
    stage: "pre_approval",
    category: "Mortgage Lender",
    title: "Get Pre-Approved",
    description: "Connect with a lender for financing.",
    priority: "completed",
    triggerType: "stage_based",
    completedAt: "2026-01-29T10:00:00Z",
    action: "send_top_3",
    status: "completed",
  },
  {
    id: "moment_j2_realtor",
    journeyId: "journey_2",
    stage: "pre_approval",
    category: "Realtor",
    title: "Find Your Realtor",
    description: "Your realtor guides the selling process.",
    priority: "completed",
    triggerType: "stage_based",
    completedAt: "2026-01-28T14:00:00Z",
    action: "send_top_3",
    status: "completed",
  },
  {
    id: "moment_j2_attorney",
    journeyId: "journey_2",
    stage: "offer_made",
    category: "Attorney",
    title: "Engage a Real Estate Attorney",
    description: "Review the offer contract with an attorney before accepting.",
    priority: "urgent",
    triggerType: "stage_based",
    completedAt: "2026-02-05T15:30:00Z",
    action: "send_top_3",
    status: "completed",
  },
  {
    id: "moment_j2_inspector",
    journeyId: "journey_2",
    stage: "offer_accepted",
    category: "Home Inspector",
    title: "Schedule Home Inspection",
    description: "Buyer may request inspection — be prepared.",
    priority: "upcoming",
    triggerType: "stage_based",
    action: "send_top_3",
    status: "pending",
  },
  // Journey 3 — Evanston Victorian (closed)
  {
    id: "moment_j3_lender",
    journeyId: "journey_3",
    stage: "pre_approval",
    category: "Mortgage Lender",
    title: "Get Pre-Approved",
    description: "Pre-approval secured.",
    priority: "completed",
    triggerType: "stage_based",
    completedAt: "2026-01-16T10:00:00Z",
    action: "send_top_3",
    status: "completed",
  },
  {
    id: "moment_j3_realtor",
    journeyId: "journey_3",
    stage: "pre_approval",
    category: "Realtor",
    title: "Find Your Realtor",
    description: "Realtor assigned.",
    priority: "completed",
    triggerType: "stage_based",
    completedAt: "2026-01-15T09:00:00Z",
    action: "send_top_3",
    status: "completed",
  },
  {
    id: "moment_j3_attorney",
    journeyId: "journey_3",
    stage: "offer_made",
    category: "Attorney",
    title: "Engage a Real Estate Attorney",
    description: "Contract reviewed and approved.",
    priority: "completed",
    triggerType: "stage_based",
    completedAt: "2026-01-22T14:05:00Z",
    action: "send_top_3",
    status: "completed",
  },
  {
    id: "moment_j3_inspector",
    journeyId: "journey_3",
    stage: "offer_accepted",
    category: "Home Inspector",
    title: "Schedule Home Inspection",
    description: "Inspection completed — no major issues found.",
    priority: "completed",
    triggerType: "stage_based",
    completedAt: "2026-01-28T16:00:00Z",
    action: "send_top_3",
    status: "completed",
  },
  {
    id: "moment_j3_insurance",
    journeyId: "journey_3",
    stage: "under_contract",
    category: "Insurance Agent",
    title: "Get Homeowner's Insurance",
    description: "Policy secured before closing.",
    priority: "completed",
    triggerType: "stage_based",
    completedAt: "2026-02-04T11:00:00Z",
    action: "send_top_3",
    status: "completed",
  },
  {
    id: "moment_j3_postclose_handyman",
    journeyId: "journey_3",
    stage: "post_close",
    category: "Home Inspector",
    title: "Find a Handyman / Contractor",
    description: "Now that you've moved in, connect with trusted contractors.",
    priority: "upcoming",
    triggerType: "stage_based",
    action: "send_top_3",
    status: "pending",
  },
];

export function getMomentsForJourney(journeyId: string): ReferralMoment[] {
  return mockReferralMoments.filter((m) => m.journeyId === journeyId);
}

/* ── Mock Notification Preferences ────────────────────────────── */

export const mockNotificationPreferences: NotificationPreference[] = [
  {
    momentType: "stage_advancement",
    label: "Stage Advancement",
    description: "When your journey moves to a new stage",
    channels: { email: true, sms: true, push: true, in_app: true },
  },
  {
    momentType: "moment_triggered",
    label: "New Action Needed",
    description: "When a new referral moment is triggered for your journey",
    channels: { email: true, sms: false, push: true, in_app: true },
  },
  {
    momentType: "top_3_sent",
    label: "Top 3 Recommendations",
    description: "When your agent sends you a top 3 recommendation list",
    channels: { email: true, sms: true, push: true, in_app: true },
  },
  {
    momentType: "booking_requested",
    label: "Booking Requests",
    description: "When a booking is requested or confirmed",
    channels: { email: true, sms: true, push: true, in_app: true },
  },
  {
    momentType: "document_uploaded",
    label: "Document Uploads",
    description: "When documents are uploaded to your journey",
    channels: { email: true, sms: false, push: false, in_app: true },
  },
  {
    momentType: "review_requested",
    label: "Review Requests",
    description: "When you're asked to review something",
    channels: { email: true, sms: false, push: true, in_app: true },
  },
  {
    momentType: "role_filled",
    label: "Team Updates",
    description: "When a team member is added to your journey",
    channels: { email: true, sms: false, push: true, in_app: true },
  },
  {
    momentType: "reminder",
    label: "Reminders",
    description: "Gentle nudges about upcoming deadlines and actions",
    channels: { email: false, sms: false, push: true, in_app: true },
  },
];

export const mockNotificationHistory: NotificationHistoryEntry[] = [
  {
    id: "notif_1",
    momentType: "stage_advancement",
    channel: "in_app",
    title: "Journey advanced to Under Contract",
    body: "Oak Park Bungalow is now Under Contract. Time to get insurance quotes!",
    sentAt: "2026-02-14T14:00:00Z",
    read: true,
  },
  {
    id: "notif_2",
    momentType: "moment_triggered",
    channel: "push",
    title: "Action needed: Get Homeowner's Insurance",
    body: "You'll need proof of insurance before closing on 742 Maple Ave.",
    sentAt: "2026-02-14T14:05:00Z",
    read: false,
  },
  {
    id: "notif_3",
    momentType: "top_3_sent",
    channel: "email",
    title: "Lisa sent you 3 Attorney recommendations",
    body: "Lisa Hartwell recommended Marcus Williams, Priya Kapoor, and one more.",
    sentAt: "2026-02-10T16:30:00Z",
    read: true,
  },
  {
    id: "notif_4",
    momentType: "role_filled",
    channel: "in_app",
    title: "Jordan Lee joined your team",
    body: "Jordan Lee (Sunrise Mortgage) is now your Mortgage Lender for Oak Park Bungalow.",
    sentAt: "2026-02-03T14:00:00Z",
    read: true,
  },
  {
    id: "notif_5",
    momentType: "booking_requested",
    channel: "sms",
    title: "Inspection booking confirmed",
    body: "Mike Chen confirmed inspection for 824 Davis St on Jan 28 at 10:00 AM.",
    sentAt: "2026-01-27T09:00:00Z",
    read: true,
  },
  {
    id: "notif_6",
    momentType: "reminder",
    channel: "push",
    title: "Insurance deadline approaching",
    body: "Your closing is in 4 weeks. Don't forget to secure homeowner's insurance.",
    sentAt: "2026-02-15T09:00:00Z",
    read: false,
  },
  {
    id: "notif_7",
    momentType: "document_uploaded",
    channel: "in_app",
    title: "Inspection report uploaded",
    body: "Mike Chen uploaded the inspection report for Evanston Victorian.",
    sentAt: "2026-01-29T16:00:00Z",
    read: true,
  },
  {
    id: "notif_8",
    momentType: "stage_advancement",
    channel: "in_app",
    title: "Congratulations — Evanston Victorian is closed!",
    body: "The journey is complete. Welcome home, Morgan!",
    sentAt: "2026-02-20T10:00:00Z",
    read: true,
  },
];

/* ── Calendar Connections (mock) ──────────────────────────────── */

export const mockCalendarConnections: CalendarConnection[] = [
  {
    id: "cal_1",
    proId: "pro_1",
    provider: "google",
    email: "alex@bluepeakinspections.com",
    status: "connected",
    syncEnabled: true,
    lastSyncAt: "2026-02-15T14:30:00Z",
    calendarId: "primary",
  },
  {
    id: "cal_2",
    proId: "pro_1",
    provider: "outlook",
    email: "alex.martinez@outlook.com",
    status: "disconnected",
    syncEnabled: false,
  },
  {
    id: "cal_3",
    proId: "pro_2",
    provider: "google",
    email: "jordan@sunrisemortgage.com",
    status: "connected",
    syncEnabled: true,
    lastSyncAt: "2026-02-15T12:00:00Z",
    calendarId: "primary",
  },
  {
    id: "cal_4",
    proId: "pro_9",
    provider: "google",
    email: "lisa@hartwellrealty.com",
    status: "connected",
    syncEnabled: true,
    lastSyncAt: "2026-02-15T10:00:00Z",
    calendarId: "primary",
  },
  {
    id: "cal_5",
    proId: "pro_9",
    provider: "apple",
    email: "lisa.hartwell@icloud.com",
    status: "expired",
    syncEnabled: false,
    lastSyncAt: "2026-01-20T08:00:00Z",
  },
];

/* ── Availability Rules (mock) ────────────────────────────────── */

export const mockAvailabilityRules: AvailabilityRules[] = [
  {
    proId: "pro_1",
    businessHours: {
      monday: { start: "08:00", end: "17:00", enabled: true },
      tuesday: { start: "08:00", end: "17:00", enabled: true },
      wednesday: { start: "08:00", end: "17:00", enabled: true },
      thursday: { start: "08:00", end: "17:00", enabled: true },
      friday: { start: "08:00", end: "16:00", enabled: true },
      saturday: { start: "09:00", end: "14:00", enabled: true },
      sunday: { start: "09:00", end: "14:00", enabled: false },
    },
    bufferMinutes: 30,
    minNoticeHours: 2,
    maxAdvanceDays: 30,
    blockedDates: ["2026-02-20", "2026-02-25", "2026-03-04"],
  },
  {
    proId: "pro_2",
    businessHours: {
      monday: { start: "09:00", end: "18:00", enabled: true },
      tuesday: { start: "09:00", end: "18:00", enabled: true },
      wednesday: { start: "09:00", end: "18:00", enabled: true },
      thursday: { start: "09:00", end: "18:00", enabled: true },
      friday: { start: "09:00", end: "17:00", enabled: true },
      saturday: { start: "10:00", end: "14:00", enabled: true },
      sunday: { start: "10:00", end: "14:00", enabled: false },
    },
    bufferMinutes: 15,
    minNoticeHours: 1,
    maxAdvanceDays: 14,
    blockedDates: ["2026-02-22"],
  },
  {
    proId: "pro_9",
    businessHours: {
      monday: { start: "08:00", end: "19:00", enabled: true },
      tuesday: { start: "08:00", end: "19:00", enabled: true },
      wednesday: { start: "08:00", end: "19:00", enabled: true },
      thursday: { start: "08:00", end: "19:00", enabled: true },
      friday: { start: "08:00", end: "18:00", enabled: true },
      saturday: { start: "09:00", end: "16:00", enabled: true },
      sunday: { start: "10:00", end: "14:00", enabled: true },
    },
    bufferMinutes: 30,
    minNoticeHours: 24,
    maxAdvanceDays: 30,
    blockedDates: [],
  },
];

/* ── Bookings (mock) ──────────────────────────────────────────── */

export const mockBookings: Booking[] = [
  {
    id: "booking_1",
    journeyId: "journey_1",
    proId: "pro_1",
    consumerId: "user_demo",
    consumerName: "Jamie Rodriguez",
    consumerEmail: "jamie.r@email.com",
    type: "inspection",
    status: "pending",
    proposedWindows: [
      { id: "bw_1a", date: "2026-02-18", startTime: "09:00", endTime: "11:00", duration: 120 },
      { id: "bw_1b", date: "2026-02-18", startTime: "13:00", endTime: "15:00", duration: 120 },
      { id: "bw_1c", date: "2026-02-19", startTime: "09:00", endTime: "11:00", duration: 120 },
    ],
    property: { address: "742 Maple Ave, Oak Park, IL 60302" },
    notes: "Foundation and electrical are primary concerns. Built 1928.",
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "booking_2",
    journeyId: "journey_1",
    proId: "pro_4",
    consumerId: "user_demo",
    consumerName: "Jamie Rodriguez",
    consumerEmail: "jamie.r@email.com",
    type: "consultation",
    status: "confirmed",
    proposedWindows: [
      { id: "bw_2a", date: "2026-02-17", startTime: "14:00", endTime: "15:00", duration: 60 },
      { id: "bw_2b", date: "2026-02-17", startTime: "16:00", endTime: "17:00", duration: 60 },
    ],
    confirmedWindow: { id: "bw_2a", date: "2026-02-17", startTime: "14:00", endTime: "15:00", duration: 60 },
    property: { address: "742 Maple Ave, Oak Park, IL 60302" },
    notes: "Contract review for purchase agreement.",
    createdAt: "2026-02-13T09:00:00Z",
    updatedAt: "2026-02-13T16:00:00Z",
  },
  {
    id: "booking_3",
    journeyId: "journey_2",
    proId: "pro_1",
    consumerId: "user_sam",
    consumerName: "Sam Patel",
    consumerEmail: "sam.patel@email.com",
    type: "inspection",
    status: "confirmed",
    proposedWindows: [
      { id: "bw_3a", date: "2026-02-20", startTime: "08:00", endTime: "10:00", duration: 120 },
      { id: "bw_3b", date: "2026-02-20", startTime: "13:00", endTime: "15:00", duration: 120 },
    ],
    confirmedWindow: { id: "bw_3a", date: "2026-02-20", startTime: "08:00", endTime: "10:00", duration: 120 },
    property: { address: "1455 N Wells St, Chicago, IL 60614" },
    notes: "Pre-listing inspection for condo unit.",
    createdAt: "2026-02-11T14:00:00Z",
    updatedAt: "2026-02-12T09:00:00Z",
  },
  {
    id: "booking_4",
    proId: "pro_1",
    consumerId: "user_morgan",
    consumerName: "Morgan Davis",
    consumerEmail: "morgan.d@email.com",
    type: "inspection",
    status: "completed",
    proposedWindows: [
      { id: "bw_4a", date: "2026-01-28", startTime: "10:00", endTime: "12:00", duration: 120 },
    ],
    confirmedWindow: { id: "bw_4a", date: "2026-01-28", startTime: "10:00", endTime: "12:00", duration: 120 },
    property: { address: "824 Davis St, Evanston, IL 60201" },
    notes: "Full inspection with radon and mold screening.",
    createdAt: "2026-01-25T11:00:00Z",
    updatedAt: "2026-01-28T14:00:00Z",
  },
  {
    id: "booking_5",
    proId: "pro_1",
    consumerId: "user_casey",
    consumerName: "Casey Wilson",
    consumerEmail: "casey.w@email.com",
    type: "inspection",
    status: "declined",
    proposedWindows: [
      { id: "bw_5a", date: "2026-02-22", startTime: "08:00", endTime: "10:00", duration: 120 },
      { id: "bw_5b", date: "2026-02-22", startTime: "13:00", endTime: "15:00", duration: 120 },
    ],
    property: { address: "1820 Oakton St, Skokie, IL 60076" },
    notes: "Radon + mold only, no full inspection needed.",
    declineReason: "Outside service area for specialty inspections. Recommend a local specialist.",
    createdAt: "2026-02-10T08:00:00Z",
    updatedAt: "2026-02-10T12:00:00Z",
  },
  {
    id: "booking_6",
    journeyId: "journey_1",
    proId: "pro_3",
    consumerId: "user_demo",
    consumerName: "Jamie Rodriguez",
    consumerEmail: "jamie.r@email.com",
    type: "consultation",
    status: "rescheduled",
    proposedWindows: [
      { id: "bw_6a", date: "2026-02-16", startTime: "10:00", endTime: "10:30", duration: 30 },
      { id: "bw_6b", date: "2026-02-16", startTime: "14:00", endTime: "14:30", duration: 30 },
    ],
    proSuggestedWindow: { id: "bw_6c", date: "2026-02-19", startTime: "11:00", endTime: "11:30", duration: 30 },
    property: { address: "742 Maple Ave, Oak Park, IL 60302" },
    notes: "Insurance quote discussion before closing.",
    createdAt: "2026-02-14T09:00:00Z",
    updatedAt: "2026-02-14T16:00:00Z",
  },
  {
    id: "booking_7",
    proId: "pro_2",
    consumerId: "user_demo",
    consumerName: "Jamie Rodriguez",
    consumerEmail: "jamie.r@email.com",
    type: "consultation",
    status: "confirmed",
    proposedWindows: [
      { id: "bw_7a", date: "2026-02-21", startTime: "10:00", endTime: "11:00", duration: 60 },
    ],
    confirmedWindow: { id: "bw_7a", date: "2026-02-21", startTime: "10:00", endTime: "11:00", duration: 60 },
    notes: "Final rate lock discussion before closing.",
    createdAt: "2026-02-15T08:00:00Z",
    updatedAt: "2026-02-15T11:00:00Z",
  },
  {
    id: "booking_8",
    proId: "pro_1",
    consumerId: "user_taylor",
    consumerName: "Taylor Brooks",
    consumerEmail: "taylor.b@email.com",
    type: "walkthrough",
    status: "pending",
    proposedWindows: [
      { id: "bw_8a", date: "2026-02-24", startTime: "09:00", endTime: "10:00", duration: 60 },
      { id: "bw_8b", date: "2026-02-24", startTime: "14:00", endTime: "15:00", duration: 60 },
    ],
    property: { address: "3540 N Halsted St, Chicago, IL 60657" },
    notes: "Pre-closing walkthrough to verify repairs.",
    createdAt: "2026-02-16T07:30:00Z",
    updatedAt: "2026-02-16T07:30:00Z",
  },
];

/* ── Mock Availability Slots (per date) ───────────────────────── */

export function generateAvailabilitySlots(proId: string, date: string): AvailabilitySlot[] {
  const dayOfWeek = new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const rules = mockAvailabilityRules.find((r) => r.proId === proId);

  if (!rules) {
    // Default slots for pros without rules
    return [
      { date, startTime: "09:00", endTime: "10:00", available: true },
      { date, startTime: "10:00", endTime: "11:00", available: Math.random() > 0.3 },
      { date, startTime: "11:00", endTime: "12:00", available: true },
      { date, startTime: "13:00", endTime: "14:00", available: Math.random() > 0.4 },
      { date, startTime: "14:00", endTime: "15:00", available: true },
      { date, startTime: "15:00", endTime: "16:00", available: Math.random() > 0.3 },
    ];
  }

  const hours = rules.businessHours[dayOfWeek];
  if (!hours || !hours.enabled) return [];
  if (rules.blockedDates.includes(date)) return [];

  const startH = parseInt(hours.start.split(":")[0]);
  const endH = parseInt(hours.end.split(":")[0]);
  const slots: AvailabilitySlot[] = [];

  // Deterministic "random" based on date string hash
  const hash = date.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  for (let h = startH; h < endH; h++) {
    const slotAvailable = ((hash + h * 7) % 10) > 3; // ~60% available
    slots.push({
      date,
      startTime: `${String(h).padStart(2, "0")}:00`,
      endTime: `${String(h + 1).padStart(2, "0")}:00`,
      available: slotAvailable,
    });
  }

  return slots;
}

/** Get date availability status: 'available' | 'busy' | 'unavailable' */
export function getDateAvailability(proId: string, date: string): "available" | "busy" | "unavailable" {
  const dayOfWeek = new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const rules = mockAvailabilityRules.find((r) => r.proId === proId);

  if (rules) {
    if (rules.blockedDates.includes(date)) return "unavailable";
    const hours = rules.businessHours[dayOfWeek];
    if (!hours || !hours.enabled) return "unavailable";
  }

  // Check if any existing bookings fill the day
  const dayBookings = mockBookings.filter(
    (b) => b.proId === proId && b.status === "confirmed" && b.confirmedWindow?.date === date
  );
  if (dayBookings.length >= 3) return "busy";

  // Use hash for deterministic "busyness"
  const hash = date.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  if (hash % 7 === 0) return "busy";

  return "available";
}

/* ── Booking helpers ──────────────────────────────────────────── */

export function getBookingsForPro(proId: string): Booking[] {
  return mockBookings.filter((b) => b.proId === proId);
}

export function getBookingsForConsumer(consumerId: string): Booking[] {
  return mockBookings.filter((b) => b.consumerId === consumerId);
}

export function getBookingById(bookingId: string): Booking | undefined {
  return mockBookings.find((b) => b.id === bookingId);
}

export function getCalendarConnectionsForPro(proId: string): CalendarConnection[] {
  return mockCalendarConnections.filter((c) => c.proId === proId);
}

export function getAvailabilityRulesForPro(proId: string): AvailabilityRules | undefined {
  return mockAvailabilityRules.find((r) => r.proId === proId);
}

/** Get booking duration based on type */
export function getBookingDuration(type: Booking["type"]): number {
  switch (type) {
    case "inspection": return 120;
    case "consultation": return 60;
    case "closing": return 90;
    case "walkthrough": return 60;
    case "general": return 60;
  }
}

/** Format booking type label */
export function getBookingTypeLabel(type: Booking["type"]): string {
  switch (type) {
    case "inspection": return "Home Inspection";
    case "consultation": return "Consultation";
    case "closing": return "Closing";
    case "walkthrough": return "Walkthrough";
    case "general": return "General Meeting";
  }
}

/** Format booking status */
export function getBookingStatusInfo(status: Booking["status"]): { label: string; color: string; variant: "accent" | "success" | "warning" | "danger" | "default" | "outline" } {
  switch (status) {
    case "pending": return { label: "Pending", color: "amber", variant: "warning" };
    case "confirmed": return { label: "Confirmed", color: "emerald", variant: "success" };
    case "declined": return { label: "Declined", color: "red", variant: "danger" };
    case "rescheduled": return { label: "Rescheduled", color: "blue", variant: "accent" };
    case "cancelled": return { label: "Cancelled", color: "slate", variant: "default" };
    case "completed": return { label: "Completed", color: "emerald", variant: "success" };
  }
}
