export type ProServiceCategory =
  | "Home Inspection"
  | "Mortgage Lender"
  | "Insurance"
  | "Attorney"
  | "Handyman";

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
}
