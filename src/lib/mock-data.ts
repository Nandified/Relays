import { type Pro } from "@/lib/types";

export const mockPros: Pro[] = [
  {
    id: "pro_1",
    slug: "alex-martinez-inspections",
    name: "Alex Martinez",
    companyName: "Blue Peak Inspections",
    headshotUrl: "/demo/headshots/alex.svg",
    companyLogoUrl: "/demo/logos/blue-peak.svg",
    categories: ["Home Inspection"],
    serviceAreas: ["Chicago", "Evanston", "Oak Park"],
    rating: 4.9,
    reviewCount: 312,
    blurb: "Clear reports, fast turnaround, calm guidance for first-time buyers.",
  },
  {
    id: "pro_2",
    slug: "jordan-lee-mortgage",
    name: "Jordan Lee",
    companyName: "Sunrise Mortgage",
    headshotUrl: "/demo/headshots/jordan.svg",
    companyLogoUrl: "/demo/logos/sunrise.svg",
    categories: ["Mortgage Lender"],
    serviceAreas: ["Chicago", "Skokie", "Naperville"],
    rating: 4.8,
    reviewCount: 198,
    blurb: "Pre-approvals that don’t stall deals. Transparent options, no pressure.",
  },
];
