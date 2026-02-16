/* ── Relays — Organization Mock Data ─────────────────────────── */

import type {
  Organization,
  OrgMember,
  OrgAuditLog,
  OrgReferralData,
  OrgPolicy,
  Journey,
} from "@/lib/types";

/* ── Organizations ────────────────────────────────────────────── */

export const mockOrganizations: Organization[] = [
  {
    id: "org_1",
    name: "Luxury Realty Chicago",
    type: "brokerage",
    logoUrl: "/demo/logos/luxury-realty.svg",
    tier: "enterprise",
    maxSeats: 25,
    currentSeats: 8,
    address: "875 N Michigan Ave, Suite 3100, Chicago, IL 60611",
    createdAt: "2025-06-15T10:00:00Z",
  },
  {
    id: "org_2",
    name: "The FRJ Group",
    type: "team",
    logoUrl: "/demo/logos/frj-group.svg",
    parentOrgId: "org_1",
    tier: "team",
    maxSeats: 6,
    currentSeats: 4,
    address: "875 N Michigan Ave, Suite 3100, Chicago, IL 60611",
    createdAt: "2025-09-01T10:00:00Z",
  },
];

/* ── Org Members ──────────────────────────────────────────────── */

export const mockOrgMembers: OrgMember[] = [
  // Luxury Realty Chicago (8 members)
  {
    id: "mem_1", orgId: "org_1", userId: "user_victoria",
    name: "Victoria Langford", email: "victoria@luxuryrealtychi.com",
    avatarUrl: "/demo/headshots/victoria.svg",
    role: "admin", status: "active",
    joinedAt: "2025-06-15T10:00:00Z", lastActiveAt: "2026-02-11T14:30:00Z", journeyCount: 0,
  },
  {
    id: "mem_2", orgId: "org_1", userId: "user_david",
    name: "David Chen", email: "david@luxuryrealtychi.com",
    avatarUrl: "/demo/headshots/david.svg",
    role: "manager", status: "active",
    joinedAt: "2025-07-01T10:00:00Z", lastActiveAt: "2026-02-11T11:15:00Z", journeyCount: 3,
  },
  {
    id: "mem_3", orgId: "org_1", userId: "user_lisa_h",
    name: "Lisa Hartwell", email: "lisa@luxuryrealtychi.com",
    avatarUrl: "/demo/headshots/lisa.svg",
    role: "agent", status: "active",
    joinedAt: "2025-07-15T10:00:00Z", lastActiveAt: "2026-02-11T16:45:00Z", journeyCount: 5,
  },
  {
    id: "mem_4", orgId: "org_1", userId: "user_frank_j",
    name: "Frank Johnson", email: "frank@luxuryrealtychi.com",
    avatarUrl: "/demo/headshots/frank.svg",
    role: "agent", status: "active",
    joinedAt: "2025-08-01T10:00:00Z", lastActiveAt: "2026-02-11T09:30:00Z", journeyCount: 4,
  },
  {
    id: "mem_5", orgId: "org_1", userId: "user_rachel",
    name: "Rachel Torres", email: "rachel@luxuryrealtychi.com",
    avatarUrl: "/demo/headshots/rachel.svg",
    role: "agent", status: "active",
    joinedAt: "2025-09-15T10:00:00Z", lastActiveAt: "2026-02-10T17:20:00Z", journeyCount: 3,
  },
  {
    id: "mem_6", orgId: "org_1", userId: "user_kevin",
    name: "Kevin Park", email: "kevin@luxuryrealtychi.com",
    avatarUrl: "/demo/headshots/kevin.svg",
    role: "transaction_coordinator", status: "active",
    joinedAt: "2025-10-01T10:00:00Z", lastActiveAt: "2026-02-11T15:00:00Z", journeyCount: 0,
  },
  {
    id: "mem_7", orgId: "org_1", userId: "user_maya",
    name: "Maya Singh", email: "maya@luxuryrealtychi.com",
    avatarUrl: "/demo/headshots/maya.svg",
    role: "assistant", status: "active",
    invitedBy: "user_victoria",
    joinedAt: "2025-11-01T10:00:00Z", lastActiveAt: "2026-02-11T13:10:00Z", journeyCount: 0,
  },
  {
    id: "mem_8", orgId: "org_1", userId: "user_james",
    name: "James Whitfield", email: "james@luxuryrealtychi.com",
    avatarUrl: "/demo/headshots/james.svg",
    role: "agent", status: "invited",
    invitedBy: "user_victoria", journeyCount: 0,
  },
  // The FRJ Group (4 members)
  {
    id: "mem_9", orgId: "org_2", userId: "user_frank_j",
    name: "Frank Johnson", email: "frank@frjgroup.com",
    avatarUrl: "/demo/headshots/frank.svg",
    role: "admin", status: "active",
    joinedAt: "2025-09-01T10:00:00Z", lastActiveAt: "2026-02-11T09:30:00Z", journeyCount: 4,
  },
  {
    id: "mem_10", orgId: "org_2", userId: "user_anna",
    name: "Anna Kowalski", email: "anna@frjgroup.com",
    avatarUrl: "/demo/headshots/anna.svg",
    role: "agent", status: "active",
    joinedAt: "2025-09-15T10:00:00Z", lastActiveAt: "2026-02-11T14:00:00Z", journeyCount: 2,
  },
  {
    id: "mem_11", orgId: "org_2", userId: "user_marcus_t",
    name: "Marcus Thompson", email: "marcus@frjgroup.com",
    avatarUrl: "/demo/headshots/marcus.svg",
    role: "agent", status: "active",
    joinedAt: "2025-10-01T10:00:00Z", lastActiveAt: "2026-02-10T16:45:00Z", journeyCount: 2,
  },
  {
    id: "mem_12", orgId: "org_2", userId: "user_sophie",
    name: "Sophie Reyes", email: "sophie@frjgroup.com",
    avatarUrl: "/demo/headshots/sophie.svg",
    role: "assistant", status: "active",
    invitedBy: "user_frank_j",
    joinedAt: "2025-11-15T10:00:00Z", lastActiveAt: "2026-02-11T10:30:00Z", journeyCount: 0,
  },
];

/* ── Org Journeys (16 distributed across agents) ──────────── */

function makeJ(
  id: string, title: string, address: string,
  type: "buying" | "selling", agent: string, agentName: string,
  client: { name: string; email: string; phone: string },
  status: "active" | "pending" | "completed",
  roles: Journey["roles"], slug: string, created: string,
  pending: string, next: string,
  tm: Journey["teamMembers"],
): Journey {
  return {
    id, title, address,
    property: { address, type },
    createdByProId: agent,
    client, status, roles,
    shareSlug: slug, createdAt: created,
    pendingAction: pending, nextStep: next,
    owner: agentName, teamMembers: tm,
    stage: "under_contract" as Journey["stage"],
    auditTrail: [],
  };
}

const R = (cat: "Realtor" | "Mortgage Lender" | "Attorney" | "Home Inspector" | "Insurance Agent", st: "filled" | "recommended" | "needed", pid: string | null, rec: string[] = []): Journey["roles"][0] => ({
  category: cat, status: st, assignedProId: pid, recommendedProIds: rec,
});

const TM = (pid: string, role: "Realtor" | "Mortgage Lender" | "Attorney" | "Home Inspector" | "Insurance Agent"): Journey["teamMembers"][0] => ({
  proId: pid, role, status: "confirmed",
});

export const mockOrgJourneys: Journey[] = [
  // Lisa Hartwell (5 journeys)
  makeJ("oj_1", "Gold Coast Penthouse", "1000 N Lake Shore Dr PH-1, Chicago, IL 60611", "buying",
    "user_lisa_h", "Lisa Hartwell",
    { name: "Richard Waverly", email: "r.waverly@email.com", phone: "(312) 555-0201" },
    "active",
    [R("Realtor","filled","pro_9"), R("Mortgage Lender","filled","pro_2"), R("Attorney","filled","pro_4"), R("Home Inspector","recommended",null,["pro_1","pro_8"]), R("Insurance Agent","needed",null)],
    "j-gold-coast-ph1", "2026-02-01T09:00:00Z",
    "Schedule home inspection", "Choose from 2 recommended inspectors",
    [TM("pro_9","Realtor"), TM("pro_2","Mortgage Lender"), TM("pro_4","Attorney")],
  ),
  makeJ("oj_2", "Lincoln Park Brownstone", "2245 N Halsted St, Chicago, IL 60614", "buying",
    "user_lisa_h", "Lisa Hartwell",
    { name: "Catherine Yoo", email: "c.yoo@email.com", phone: "(773) 555-0134" },
    "active",
    [R("Realtor","filled","pro_9"), R("Mortgage Lender","filled","pro_7"), R("Attorney","recommended",null,["pro_4","pro_5"]), R("Home Inspector","needed",null), R("Insurance Agent","needed",null)],
    "j-lincoln-park-2245", "2026-02-05T14:00:00Z",
    "Choose your attorney", "2 attorneys recommended — select one",
    [TM("pro_9","Realtor"), TM("pro_7","Mortgage Lender")],
  ),
  makeJ("oj_3", "Streeterville Condo", "505 N McClurg Ct #3401, Chicago, IL 60611", "buying",
    "user_lisa_h", "Lisa Hartwell",
    { name: "Priya Mehta", email: "p.mehta@email.com", phone: "(312) 555-0178" },
    "completed",
    [R("Realtor","filled","pro_9"), R("Mortgage Lender","filled","pro_2"), R("Attorney","filled","pro_5"), R("Home Inspector","filled","pro_1"), R("Insurance Agent","filled","pro_3")],
    "j-streeterville-505", "2025-12-10T10:00:00Z",
    "Complete!", "Transaction closed successfully",
    [TM("pro_9","Realtor"), TM("pro_2","Mortgage Lender"), TM("pro_5","Attorney"), TM("pro_1","Home Inspector"), TM("pro_3","Insurance Agent")],
  ),
  makeJ("oj_4", "Bucktown Duplex", "1847 N Damen Ave, Chicago, IL 60647", "buying",
    "user_lisa_h", "Lisa Hartwell",
    { name: "Derek Williams", email: "d.williams@email.com", phone: "(773) 555-0256" },
    "active",
    [R("Realtor","filled","pro_9"), R("Mortgage Lender","recommended",null,["pro_2","pro_7"]), R("Attorney","needed",null), R("Home Inspector","needed",null), R("Insurance Agent","needed",null)],
    "j-bucktown-1847", "2026-02-08T11:00:00Z",
    "Select mortgage lender", "Compare 2 recommended lenders",
    [TM("pro_9","Realtor")],
  ),
  makeJ("oj_5", "Lakeview Vintage 2-Flat", "3612 N Southport Ave, Chicago, IL 60613", "selling",
    "user_lisa_h", "Lisa Hartwell",
    { name: "Thomas Brennan", email: "t.brennan@email.com", phone: "(312) 555-0310" },
    "active",
    [R("Realtor","filled","pro_9"), R("Mortgage Lender","filled","pro_2"), R("Attorney","filled","pro_4"), R("Home Inspector","filled","pro_8"), R("Insurance Agent","recommended",null,["pro_3","pro_6"])],
    "j-lakeview-3612", "2026-01-20T09:00:00Z",
    "Choose insurance agent", "2 agents recommended",
    [TM("pro_9","Realtor"), TM("pro_2","Mortgage Lender"), TM("pro_4","Attorney"), TM("pro_8","Home Inspector")],
  ),
  // Frank Johnson (4 journeys)
  makeJ("oj_6", "West Loop Loft", "1001 W Madison St #4B, Chicago, IL 60607", "buying",
    "user_frank_j", "Frank Johnson",
    { name: "Amir Hassan", email: "a.hassan@email.com", phone: "(312) 555-0445" },
    "active",
    [R("Realtor","filled","pro_10"), R("Mortgage Lender","filled","pro_2"), R("Attorney","filled","pro_4"), R("Home Inspector","filled","pro_1"), R("Insurance Agent","recommended",null,["pro_3","pro_6"])],
    "j-west-loop-1001", "2026-01-25T10:00:00Z",
    "Choose insurance agent", "Almost done — pick your insurance agent",
    [TM("pro_10","Realtor"), TM("pro_2","Mortgage Lender"), TM("pro_4","Attorney"), TM("pro_1","Home Inspector")],
  ),
  makeJ("oj_7", "South Loop High-Rise", "1235 S Prairie Ave #2201, Chicago, IL 60605", "buying",
    "user_frank_j", "Frank Johnson",
    { name: "Nicole Kim", email: "n.kim@email.com", phone: "(773) 555-0512" },
    "active",
    [R("Realtor","filled","pro_10"), R("Mortgage Lender","filled","pro_7"), R("Attorney","recommended",null,["pro_4","pro_5"]), R("Home Inspector","needed",null), R("Insurance Agent","needed",null)],
    "j-south-loop-1235", "2026-02-03T14:00:00Z",
    "Choose your attorney", "2 attorneys recommended",
    [TM("pro_10","Realtor"), TM("pro_7","Mortgage Lender")],
  ),
  makeJ("oj_8", "Hyde Park Greystone", "5400 S Woodlawn Ave, Chicago, IL 60615", "buying",
    "user_frank_j", "Frank Johnson",
    { name: "Elena Vasquez", email: "e.vasquez@email.com", phone: "(312) 555-0623" },
    "completed",
    [R("Realtor","filled","pro_10"), R("Mortgage Lender","filled","pro_2"), R("Attorney","filled","pro_5"), R("Home Inspector","filled","pro_8"), R("Insurance Agent","filled","pro_6")],
    "j-hyde-park-5400", "2025-11-15T09:00:00Z",
    "Complete!", "Transaction closed",
    [TM("pro_10","Realtor"), TM("pro_2","Mortgage Lender"), TM("pro_5","Attorney"), TM("pro_8","Home Inspector"), TM("pro_6","Insurance Agent")],
  ),
  makeJ("oj_9", "Pilsen Artist Loft", "1823 S Halsted St #2A, Chicago, IL 60608", "buying",
    "user_frank_j", "Frank Johnson",
    { name: "Lucas Moretti", email: "l.moretti@email.com", phone: "(773) 555-0789" },
    "active",
    [R("Realtor","filled","pro_10"), R("Mortgage Lender","recommended",null,["pro_2","pro_7"]), R("Attorney","needed",null), R("Home Inspector","needed",null), R("Insurance Agent","needed",null)],
    "j-pilsen-1823", "2026-02-09T16:00:00Z",
    "Select mortgage lender", "2 lenders recommended — compare options",
    [TM("pro_10","Realtor")],
  ),
  // Rachel Torres (3 journeys)
  makeJ("oj_10", "Wicker Park Victorian", "1456 N Wicker Park Ave, Chicago, IL 60622", "buying",
    "user_rachel", "Rachel Torres",
    { name: "Samantha Nguyen", email: "s.nguyen@email.com", phone: "(312) 555-0834" },
    "active",
    [R("Realtor","filled","pro_9"), R("Mortgage Lender","filled","pro_2"), R("Attorney","filled","pro_4"), R("Home Inspector","filled","pro_1"), R("Insurance Agent","filled","pro_3")],
    "j-wicker-park-1456", "2026-01-15T10:00:00Z",
    "Awaiting closing", "All team members confirmed — closing scheduled",
    [TM("pro_9","Realtor"), TM("pro_2","Mortgage Lender"), TM("pro_4","Attorney"), TM("pro_1","Home Inspector"), TM("pro_3","Insurance Agent")],
  ),
  makeJ("oj_11", "Logan Square Bungalow", "2834 N Sacramento Ave, Chicago, IL 60618", "buying",
    "user_rachel", "Rachel Torres",
    { name: "Jason Park", email: "j.park@email.com", phone: "(773) 555-0901" },
    "active",
    [R("Realtor","filled","pro_9"), R("Mortgage Lender","filled","pro_7"), R("Attorney","recommended",null,["pro_5"]), R("Home Inspector","needed",null), R("Insurance Agent","needed",null)],
    "j-logan-sq-2834", "2026-02-06T11:00:00Z",
    "Choose your attorney", "1 attorney recommended",
    [TM("pro_9","Realtor"), TM("pro_7","Mortgage Lender")],
  ),
  makeJ("oj_12", "Ravenswood Manor", "4520 N Francisco Ave, Chicago, IL 60625", "selling",
    "user_rachel", "Rachel Torres",
    { name: "Michelle Grant", email: "m.grant@email.com", phone: "(312) 555-0967" },
    "completed",
    [R("Realtor","filled","pro_9"), R("Mortgage Lender","filled","pro_2"), R("Attorney","filled","pro_4"), R("Home Inspector","filled","pro_1"), R("Insurance Agent","filled","pro_6")],
    "j-ravenswood-4520", "2025-10-05T09:00:00Z",
    "Complete!", "Sale closed — congratulations!",
    [TM("pro_9","Realtor"), TM("pro_2","Mortgage Lender"), TM("pro_4","Attorney"), TM("pro_1","Home Inspector"), TM("pro_6","Insurance Agent")],
  ),
  // David Chen (3 journeys, manager who also sells)
  makeJ("oj_13", "River North Penthouse", "300 W Huron St PH-A, Chicago, IL 60654", "buying",
    "user_david", "David Chen",
    { name: "Robert Sterling", email: "r.sterling@email.com", phone: "(312) 555-1045" },
    "active",
    [R("Realtor","filled","pro_10"), R("Mortgage Lender","filled","pro_2"), R("Attorney","filled","pro_4"), R("Home Inspector","recommended",null,["pro_1","pro_8"]), R("Insurance Agent","needed",null)],
    "j-river-north-300", "2026-01-28T10:00:00Z",
    "Schedule inspection", "2 inspectors recommended",
    [TM("pro_10","Realtor"), TM("pro_2","Mortgage Lender"), TM("pro_4","Attorney")],
  ),
  makeJ("oj_14", "Magnificent Mile Condo", "900 N Michigan Ave #1801, Chicago, IL 60611", "buying",
    "user_david", "David Chen",
    { name: "Sarah Blackwell", email: "s.blackwell@email.com", phone: "(312) 555-1100" },
    "active",
    [R("Realtor","filled","pro_10"), R("Mortgage Lender","filled","pro_7"), R("Attorney","recommended",null,["pro_4","pro_5"]), R("Home Inspector","needed",null), R("Insurance Agent","needed",null)],
    "j-mag-mile-900", "2026-02-07T09:00:00Z",
    "Choose attorney", "2 attorneys recommended",
    [TM("pro_10","Realtor"), TM("pro_7","Mortgage Lender")],
  ),
  makeJ("oj_15", "Old Town Townhome", "1521 N Wells St, Chicago, IL 60610", "selling",
    "user_david", "David Chen",
    { name: "Marcus Allen", email: "m.allen@email.com", phone: "(773) 555-1200" },
    "completed",
    [R("Realtor","filled","pro_10"), R("Mortgage Lender","filled","pro_2"), R("Attorney","filled","pro_5"), R("Home Inspector","filled","pro_8"), R("Insurance Agent","filled","pro_3")],
    "j-old-town-1521", "2025-09-20T09:00:00Z",
    "Complete!", "Sale closed",
    [TM("pro_10","Realtor"), TM("pro_2","Mortgage Lender"), TM("pro_5","Attorney"), TM("pro_8","Home Inspector"), TM("pro_3","Insurance Agent")],
  ),
  // Anna Kowalski (FRJ Group sub-team, 1 journey)
  makeJ("oj_16", "Andersonville Walk-Up", "5247 N Clark St #3, Chicago, IL 60640", "buying",
    "user_anna", "Anna Kowalski",
    { name: "Lily Chen", email: "l.chen@email.com", phone: "(773) 555-1345" },
    "active",
    [R("Realtor","filled","pro_9"), R("Mortgage Lender","filled","pro_2"), R("Attorney","recommended",null,["pro_4"]), R("Home Inspector","needed",null), R("Insurance Agent","needed",null)],
    "j-andersonville-5247", "2026-02-10T10:00:00Z",
    "Choose your attorney", "1 attorney recommended",
    [TM("pro_9","Realtor"), TM("pro_2","Mortgage Lender")],
  ),
];

/* ── Audit Log (25+ entries) ─────────────────────────────────── */

export const mockAuditLogs: OrgAuditLog[] = [
  { id: "al_1", orgId: "org_1", action: "member_invited", performedBy: "user_victoria", performedByName: "Victoria Langford", targetUserId: "user_james", targetUserName: "James Whitfield", details: "Invited as Agent", timestamp: "2026-02-11T10:00:00Z" },
  { id: "al_2", orgId: "org_1", action: "journey_created", performedBy: "user_lisa_h", performedByName: "Lisa Hartwell", targetJourneyId: "oj_4", targetJourneyTitle: "Bucktown Duplex", details: "New buying journey created for Derek Williams", timestamp: "2026-02-08T11:00:00Z" },
  { id: "al_3", orgId: "org_1", action: "partner_recommended", performedBy: "user_frank_j", performedByName: "Frank Johnson", targetJourneyId: "oj_9", targetJourneyTitle: "Pilsen Artist Loft", details: "Recommended Jordan Lee & Derek Okafor (Mortgage Lender)", timestamp: "2026-02-09T16:30:00Z" },
  { id: "al_4", orgId: "org_1", action: "journey_updated", performedBy: "user_rachel", performedByName: "Rachel Torres", targetJourneyId: "oj_10", targetJourneyTitle: "Wicker Park Victorian", details: "All 5 roles now filled — ready for closing", timestamp: "2026-02-09T14:00:00Z" },
  { id: "al_5", orgId: "org_1", action: "verification_submitted", performedBy: "user_lisa_h", performedByName: "Lisa Hartwell", details: "License verification submitted for IL Real Estate Broker", timestamp: "2026-02-08T09:15:00Z" },
  { id: "al_6", orgId: "org_1", action: "partner_approved", performedBy: "user_victoria", performedByName: "Victoria Langford", details: "Approved Jordan Lee (Sunrise Mortgage) as preferred lender partner", timestamp: "2026-02-07T16:00:00Z" },
  { id: "al_7", orgId: "org_1", action: "role_changed", performedBy: "user_victoria", performedByName: "Victoria Langford", targetUserId: "user_kevin", targetUserName: "Kevin Park", details: "Role changed from Assistant to Transaction Coordinator", timestamp: "2026-02-07T11:30:00Z" },
  { id: "al_8", orgId: "org_1", action: "journey_created", performedBy: "user_frank_j", performedByName: "Frank Johnson", targetJourneyId: "oj_7", targetJourneyTitle: "South Loop High-Rise", details: "New buying journey created for Nicole Kim", timestamp: "2026-02-03T14:00:00Z" },
  { id: "al_9", orgId: "org_1", action: "step_in_granted", performedBy: "user_lisa_h", performedByName: "Lisa Hartwell", targetUserId: "user_kevin", targetUserName: "Kevin Park", targetJourneyId: "oj_1", targetJourneyTitle: "Gold Coast Penthouse", details: "Step-in access granted to TC for closing coordination", timestamp: "2026-02-06T10:00:00Z" },
  { id: "al_10", orgId: "org_1", action: "step_in_used", performedBy: "user_kevin", performedByName: "Kevin Park", targetJourneyId: "oj_1", targetJourneyTitle: "Gold Coast Penthouse", details: "TC stepped in to coordinate inspector scheduling", timestamp: "2026-02-06T14:30:00Z" },
  { id: "al_11", orgId: "org_1", action: "settings_updated", performedBy: "user_victoria", performedByName: "Victoria Langford", details: "Updated org policies: required verifications enabled", timestamp: "2026-02-05T09:00:00Z" },
  { id: "al_12", orgId: "org_1", action: "journey_created", performedBy: "user_lisa_h", performedByName: "Lisa Hartwell", targetJourneyId: "oj_2", targetJourneyTitle: "Lincoln Park Brownstone", details: "New buying journey for Catherine Yoo", timestamp: "2026-02-05T14:00:00Z" },
  { id: "al_13", orgId: "org_1", action: "partner_recommended", performedBy: "user_lisa_h", performedByName: "Lisa Hartwell", targetJourneyId: "oj_5", targetJourneyTitle: "Lakeview Vintage 2-Flat", details: "Recommended Sarah Chen & Nina Reyes (Insurance Agent)", timestamp: "2026-02-04T11:00:00Z" },
  { id: "al_14", orgId: "org_1", action: "member_joined", performedBy: "user_maya", performedByName: "Maya Singh", details: "Accepted invite and joined as Assistant", timestamp: "2025-11-01T10:00:00Z" },
  { id: "al_15", orgId: "org_1", action: "journey_created", performedBy: "user_david", performedByName: "David Chen", targetJourneyId: "oj_14", targetJourneyTitle: "Magnificent Mile Condo", details: "New buying journey for Sarah Blackwell", timestamp: "2026-02-07T09:00:00Z" },
  { id: "al_16", orgId: "org_1", action: "partner_recommended", performedBy: "user_david", performedByName: "David Chen", targetJourneyId: "oj_13", targetJourneyTitle: "River North Penthouse", details: "Recommended Alex Martinez & Mike Chen (Home Inspector)", timestamp: "2026-02-01T15:00:00Z" },
  { id: "al_17", orgId: "org_1", action: "journey_created", performedBy: "user_rachel", performedByName: "Rachel Torres", targetJourneyId: "oj_11", targetJourneyTitle: "Logan Square Bungalow", details: "New buying journey for Jason Park", timestamp: "2026-02-06T11:00:00Z" },
  { id: "al_18", orgId: "org_1", action: "report_exported", performedBy: "user_david", performedByName: "David Chen", details: "Exported referral routing report (Jan 2026)", timestamp: "2026-02-01T08:30:00Z" },
  { id: "al_19", orgId: "org_1", action: "verification_submitted", performedBy: "user_frank_j", performedByName: "Frank Johnson", details: "License verification submitted for IL Real Estate Broker", timestamp: "2026-01-28T10:00:00Z" },
  { id: "al_20", orgId: "org_1", action: "journey_created", performedBy: "user_frank_j", performedByName: "Frank Johnson", targetJourneyId: "oj_6", targetJourneyTitle: "West Loop Loft", details: "New buying journey for Amir Hassan", timestamp: "2026-01-25T10:00:00Z" },
  { id: "al_21", orgId: "org_1", action: "journey_created", performedBy: "user_lisa_h", performedByName: "Lisa Hartwell", targetJourneyId: "oj_1", targetJourneyTitle: "Gold Coast Penthouse", details: "New buying journey for Richard Waverly", timestamp: "2026-02-01T09:00:00Z" },
  { id: "al_22", orgId: "org_1", action: "partner_recommended", performedBy: "user_rachel", performedByName: "Rachel Torres", targetJourneyId: "oj_11", targetJourneyTitle: "Logan Square Bungalow", details: "Recommended Priya Kapoor (Attorney)", timestamp: "2026-02-06T15:00:00Z" },
  { id: "al_23", orgId: "org_1", action: "member_invited", performedBy: "user_victoria", performedByName: "Victoria Langford", targetUserId: "user_maya", targetUserName: "Maya Singh", details: "Invited as Assistant", timestamp: "2025-10-28T10:00:00Z" },
  { id: "al_24", orgId: "org_1", action: "settings_updated", performedBy: "user_victoria", performedByName: "Victoria Langford", details: "Partner approval rules updated: require admin approval for new partners", timestamp: "2026-01-15T14:00:00Z" },
  { id: "al_25", orgId: "org_1", action: "journey_reassigned", performedBy: "user_victoria", performedByName: "Victoria Langford", targetUserId: "user_rachel", targetUserName: "Rachel Torres", targetJourneyId: "oj_12", targetJourneyTitle: "Ravenswood Manor", details: "Journey reassigned from departing agent to Rachel Torres", timestamp: "2025-10-01T09:00:00Z" },
];

/* ── Referral Routing Data ───────────────────────────────────── */

export const mockReferralData: OrgReferralData[] = [
  { id: "ref_1", orgId: "org_1", agentId: "user_lisa_h", agentName: "Lisa Hartwell", partnerId: "pro_2", partnerName: "Jordan Lee", partnerCategory: "Mortgage Lender", referralCount: 12, conversionRate: 0.83, lastReferralAt: "2026-02-05T14:00:00Z" },
  { id: "ref_2", orgId: "org_1", agentId: "user_lisa_h", agentName: "Lisa Hartwell", partnerId: "pro_4", partnerName: "Marcus Williams", partnerCategory: "Attorney", referralCount: 9, conversionRate: 0.89, lastReferralAt: "2026-02-01T09:00:00Z" },
  { id: "ref_3", orgId: "org_1", agentId: "user_lisa_h", agentName: "Lisa Hartwell", partnerId: "pro_1", partnerName: "Alex Martinez", partnerCategory: "Home Inspector", referralCount: 8, conversionRate: 0.75, lastReferralAt: "2026-01-20T10:00:00Z" },
  { id: "ref_4", orgId: "org_1", agentId: "user_lisa_h", agentName: "Lisa Hartwell", partnerId: "pro_3", partnerName: "Sarah Chen", partnerCategory: "Insurance Agent", referralCount: 6, conversionRate: 0.67, lastReferralAt: "2025-12-10T10:00:00Z" },
  { id: "ref_5", orgId: "org_1", agentId: "user_frank_j", agentName: "Frank Johnson", partnerId: "pro_2", partnerName: "Jordan Lee", partnerCategory: "Mortgage Lender", referralCount: 10, conversionRate: 0.80, lastReferralAt: "2026-01-25T10:00:00Z" },
  { id: "ref_6", orgId: "org_1", agentId: "user_frank_j", agentName: "Frank Johnson", partnerId: "pro_4", partnerName: "Marcus Williams", partnerCategory: "Attorney", referralCount: 7, conversionRate: 0.86, lastReferralAt: "2026-01-25T10:00:00Z" },
  { id: "ref_7", orgId: "org_1", agentId: "user_frank_j", agentName: "Frank Johnson", partnerId: "pro_7", partnerName: "Derek Okafor", partnerCategory: "Mortgage Lender", referralCount: 5, conversionRate: 0.60, lastReferralAt: "2026-02-03T14:00:00Z" },
  { id: "ref_8", orgId: "org_1", agentId: "user_frank_j", agentName: "Frank Johnson", partnerId: "pro_8", partnerName: "Mike Chen", partnerCategory: "Home Inspector", referralCount: 4, conversionRate: 0.75, lastReferralAt: "2025-11-15T09:00:00Z" },
  { id: "ref_9", orgId: "org_1", agentId: "user_rachel", agentName: "Rachel Torres", partnerId: "pro_2", partnerName: "Jordan Lee", partnerCategory: "Mortgage Lender", referralCount: 7, conversionRate: 0.71, lastReferralAt: "2026-01-15T10:00:00Z" },
  { id: "ref_10", orgId: "org_1", agentId: "user_rachel", agentName: "Rachel Torres", partnerId: "pro_4", partnerName: "Marcus Williams", partnerCategory: "Attorney", referralCount: 5, conversionRate: 0.80, lastReferralAt: "2026-01-15T10:00:00Z" },
  { id: "ref_11", orgId: "org_1", agentId: "user_rachel", agentName: "Rachel Torres", partnerId: "pro_1", partnerName: "Alex Martinez", partnerCategory: "Home Inspector", referralCount: 4, conversionRate: 1.0, lastReferralAt: "2026-01-15T10:00:00Z" },
  { id: "ref_12", orgId: "org_1", agentId: "user_rachel", agentName: "Rachel Torres", partnerId: "pro_6", partnerName: "Nina Reyes", partnerCategory: "Insurance Agent", referralCount: 3, conversionRate: 0.67, lastReferralAt: "2025-10-05T09:00:00Z" },
  { id: "ref_13", orgId: "org_1", agentId: "user_david", agentName: "David Chen", partnerId: "pro_2", partnerName: "Jordan Lee", partnerCategory: "Mortgage Lender", referralCount: 8, conversionRate: 0.88, lastReferralAt: "2026-01-28T10:00:00Z" },
  { id: "ref_14", orgId: "org_1", agentId: "user_david", agentName: "David Chen", partnerId: "pro_4", partnerName: "Marcus Williams", partnerCategory: "Attorney", referralCount: 6, conversionRate: 0.83, lastReferralAt: "2026-01-28T10:00:00Z" },
  { id: "ref_15", orgId: "org_1", agentId: "user_david", agentName: "David Chen", partnerId: "pro_5", partnerName: "Priya Kapoor", partnerCategory: "Attorney", referralCount: 3, conversionRate: 0.67, lastReferralAt: "2025-09-20T09:00:00Z" },
];

/* ── Org Policies ─────────────────────────────────────────────── */

export const mockOrgPolicy: OrgPolicy = {
  autoStepIn: false,
  requiredVerifications: true,
  partnerApprovalRequired: true,
  maxReferralsPerPartner: undefined,
};

/* ── Helpers ──────────────────────────────────────────────────── */

export function getOrgById(id: string): Organization | undefined {
  return mockOrganizations.find((o) => o.id === id);
}

export function getOrgMembers(orgId: string): OrgMember[] {
  return mockOrgMembers.filter((m) => m.orgId === orgId);
}

export function getActiveOrgMembers(orgId: string): OrgMember[] {
  return mockOrgMembers.filter((m) => m.orgId === orgId && m.status === "active");
}

export function getOrgJourneys(orgId: string): Journey[] {
  const memberIds = getOrgMembers(orgId).map((m) => m.userId);
  return mockOrgJourneys.filter((j) => memberIds.includes(j.createdByProId));
}

export function getJourneysForAgent(agentUserId: string): Journey[] {
  return mockOrgJourneys.filter((j) => j.createdByProId === agentUserId);
}

export function getAuditLogs(orgId: string): OrgAuditLog[] {
  return mockAuditLogs
    .filter((l) => l.orgId === orgId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getReferralData(orgId: string): OrgReferralData[] {
  return mockReferralData.filter((r) => r.orgId === orgId);
}

/** Current mock user for the org context — simulates logged-in admin */
export const MOCK_CURRENT_USER = mockOrgMembers[0]; // Victoria Langford, admin