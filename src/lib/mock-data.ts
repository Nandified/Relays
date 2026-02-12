import { type Pro, type ServiceRequest, type TimelineEvent, type Journey, type TeamMember, type ProIncomingRequest, type TimeWindow } from "@/lib/types";

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
    badges: [
      { type: "licensed", label: "ASHI Certified" },
      { type: "insured", label: "Fully Insured" },
      { type: "fast-response", label: "< 2hr response" },
    ],
    verified: true,
    responseTimeMinutes: 45,
    availability: "accepting",
    username: "alexmartinez",
    topThree: ["pro_2", "pro_5", "pro_7"],
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
    badges: [
      { type: "licensed", label: "NMLS Licensed" },
      { type: "top-rated", label: "Top Rated 2025" },
    ],
    verified: true,
    responseTimeMinutes: 30,
    availability: "accepting",
    username: "jordanlee",
    topThree: ["pro_1", "pro_4", "pro_8"],
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
    verified: true,
    responseTimeMinutes: 60,
    availability: "accepting",
    username: "sarahchen",
    topThree: ["pro_2", "pro_1", "pro_6"],
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
    verified: true,
    responseTimeMinutes: 120,
    availability: "accepting",
    username: "marcuswilliams",
    topThree: ["pro_1", "pro_2", "pro_3"],
  },
  {
    id: "pro_5",
    slug: "priya-kapoor-lender",
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
    verified: true,
    responseTimeMinutes: 90,
    availability: "accepting",
    username: "priyakapoor",
    topThree: ["pro_2", "pro_3", "pro_7"],
  },
  {
    id: "pro_6",
    slug: "tom-russo-handyman",
    name: "Tom Russo",
    companyName: "HandyPro Chicago",
    headshotUrl: "/demo/headshots/tom.svg",
    companyLogoUrl: "/demo/logos/handypro.svg",
    categories: ["Handyman", "Contractor"],
    serviceAreas: ["Chicago", "Cicero", "Berwyn", "Oak Park"],
    rating: 4.8,
    reviewCount: 241,
    blurb: "Fix-it lists, remodels, and move-in repairs. Honest quotes, quality work.",
    bio: "Tom Russo has been a licensed contractor in the Chicagoland area for 18 years. From small fix-it lists to full kitchen remodels, Tom and his crew deliver reliable, quality work on schedule. Specializes in post-inspection repairs and move-in punch lists. Fully insured with a 2-year workmanship guarantee.",
    videoUrl: null,
    badges: [
      { type: "licensed", label: "Licensed Contractor" },
      { type: "insured", label: "Fully Insured" },
      { type: "top-rated", label: "Top Rated" },
    ],
    verified: true,
    responseTimeMinutes: 60,
    availability: "accepting",
    username: "tomrusso",
    topThree: ["pro_1", "pro_3", "pro_8"],
  },
  {
    id: "pro_7",
    slug: "diana-vasquez-title",
    name: "Diana Vasquez",
    companyName: "Premier Title Services",
    headshotUrl: "/demo/headshots/diana.svg",
    companyLogoUrl: "/demo/logos/premier-title.svg",
    categories: ["Title Company"],
    serviceAreas: ["Chicago", "Naperville", "Aurora", "Joliet"],
    rating: 4.7,
    reviewCount: 134,
    blurb: "Clear title searches, smooth closings. Bilingual service available.",
    bio: "Diana Vasquez leads Premier Title Services, one of the fastest-growing title companies in the Chicago metro. Her team handles title searches, insurance, escrow, and closing coordination with precision and speed. Bilingual (English/Spanish) service is available for all transactions. Diana's team closes 500+ transactions per year.",
    videoUrl: null,
    badges: [
      { type: "licensed", label: "ALTA Member" },
      { type: "partner", label: "Relays Partner" },
      { type: "fast-response", label: "Same-day Searches" },
    ],
    verified: true,
    responseTimeMinutes: 45,
    availability: "accepting",
    username: "dianavasquez",
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
    verified: true,
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
    verified: true,
    responseTimeMinutes: 20,
    availability: "accepting",
    username: "lisahartwell",
    topThree: ["pro_2", "pro_1", "pro_3"],
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
    verified: true,
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
  {
    id: "req_4",
    userId: "user_demo",
    category: "Handyman",
    description: "Post-inspection repair list: fix leaky faucet, patch drywall, replace outlet covers.",
    addressOrArea: "Oak Park, IL",
    notes: "Need completed before closing on March 15.",
    status: "completed",
    assignedProId: "pro_6",
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-02-01T15:00:00Z",
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
  req_4: [
    { id: "tl_4a", requestId: "req_4", type: "submitted", label: "Request Submitted", description: "You submitted a repair request.", timestamp: "2026-01-20T10:00:00Z", actor: "consumer" },
    { id: "tl_4b", requestId: "req_4", type: "reviewing", label: "Under Review", description: "Finding available contractors.", timestamp: "2026-01-20T11:00:00Z", actor: "system" },
    { id: "tl_4c", requestId: "req_4", type: "matched", label: "Matched", description: "Tom Russo from HandyPro Chicago accepted.", timestamp: "2026-01-21T09:00:00Z", actor: "system" },
    { id: "tl_4d", requestId: "req_4", type: "scheduled", label: "Work Scheduled", description: "Repairs scheduled for Jan 28–29.", timestamp: "2026-01-22T14:00:00Z", actor: "pro" },
    { id: "tl_4e", requestId: "req_4", type: "completed", label: "Completed", description: "All repairs completed. Invoice sent.", timestamp: "2026-02-01T15:00:00Z", actor: "pro" },
  ],
};

/* ── Journeys (consumer dashboard) ────────────────────────────── */

export const mockJourneys: Journey[] = [
  {
    id: "journey_1",
    title: "Oak Park Bungalow Purchase",
    address: "742 Maple Ave, Oak Park, IL 60302",
    status: "active",
    pendingAction: "Schedule home inspection",
    nextStep: "Alex Martinez is ready — pick a date & time window",
    owner: "You",
    teamMembers: [
      { proId: "pro_9", role: "Realtor", status: "confirmed" },
      { proId: "pro_2", role: "Mortgage Lender", status: "confirmed" },
      { proId: "pro_1", role: "Home Inspector", status: "pending" },
      { proId: "pro_4", role: "Attorney", status: "invited" },
    ],
    createdAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "journey_2",
    title: "Lincoln Park Condo",
    address: "1455 N Wells St, Chicago, IL 60614",
    status: "active",
    pendingAction: "Get insurance quotes",
    nextStep: "Submit your insurance request — closing is in 3 weeks",
    owner: "You",
    teamMembers: [
      { proId: "pro_10", role: "Realtor", status: "confirmed" },
      { proId: "pro_2", role: "Mortgage Lender", status: "confirmed" },
      { proId: "pro_5", role: "Attorney", status: "confirmed" },
    ],
    createdAt: "2026-01-28T14:00:00Z",
  },
  {
    id: "journey_3",
    title: "Evanston Victorian Rehab",
    address: "824 Davis St, Evanston, IL 60201",
    status: "pending",
    pendingAction: "Waiting for attorney review",
    nextStep: "Marcus Williams is reviewing your contract — expect update by Feb 15",
    owner: "Marcus Williams",
    teamMembers: [
      { proId: "pro_9", role: "Realtor", status: "confirmed" },
      { proId: "pro_2", role: "Mortgage Lender", status: "confirmed" },
      { proId: "pro_4", role: "Attorney", status: "confirmed" },
      { proId: "pro_8", role: "Home Inspector", status: "confirmed" },
      { proId: "pro_3", role: "Insurance Agent", status: "pending" },
      { proId: "pro_7", role: "Title Company", status: "invited" },
    ],
    createdAt: "2026-01-15T09:00:00Z",
  },
];

/* ── Team roster (consumer) ───────────────────────────────────── */

export const mockTeam: TeamMember[] = [
  { proId: "pro_9", role: "Realtor", addedAt: "2026-01-10T10:00:00Z" },
  { proId: "pro_2", role: "Mortgage Lender", addedAt: "2026-01-12T14:00:00Z" },
  { proId: "pro_1", role: "Home Inspector", addedAt: "2026-01-15T09:00:00Z" },
  { proId: "pro_4", role: "Attorney", addedAt: "2026-01-18T11:00:00Z" },
  { proId: "pro_3", role: "Insurance Agent", addedAt: "2026-01-20T16:00:00Z" },
  { proId: "pro_6", role: "Handyman", addedAt: "2026-01-25T10:00:00Z" },
  { proId: "pro_7", role: "Title Company", addedAt: "2026-02-01T13:00:00Z" },
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
  "Home Inspector",
  "Mortgage Lender",
  "Insurance Agent",
  "Attorney",
  "Handyman",
  "Title Company",
  "Realtor",
  "Contractor",
] as const;
