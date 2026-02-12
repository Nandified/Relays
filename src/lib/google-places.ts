/**
 * Google Places Service Module
 *
 * Currently returns mock data structured to match Google Places API responses.
 * When we get a real API key, swap the implementations below — the types and
 * function signatures stay the same.
 *
 * TODO: Replace mock implementations with real Google Places API calls
 * TODO: Add API key management via env var GOOGLE_PLACES_API_KEY
 * TODO: Add rate limiting / caching layer
 */

import { type ProServiceCategory } from "@/lib/types";

/* ── Types ─────────────────────────────────────────────────────── */

export interface PlacesResult {
  placeId: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  phone: string | null;
  website: string | null;
  photoUrl: string | null;
  categories: ProServiceCategory[];
  claimed: boolean; // whether they've claimed their Relays profile
  email: string | null; // for outreach — extracted from Google listing
}

export interface PlaceDetails extends PlacesResult {
  description: string | null;
  hours: string | null;
  lat: number;
  lng: number;
  googleMapsUrl: string;
  photos: string[];
}

/* ── Mock Data ─────────────────────────────────────────────────── */

const mockPlacesData: PlacesResult[] = [
  {
    placeId: "gp_1",
    name: "Windy City Home Inspections",
    address: "2847 W Armitage Ave, Chicago, IL 60647",
    rating: 4.6,
    reviewCount: 89,
    phone: "(312) 555-0147",
    website: "https://windycityinspections.com",
    photoUrl: null,
    categories: ["Home Inspector"],
    claimed: false,
    email: "info@windycityinspections.com",
  },
  {
    placeId: "gp_2",
    name: "Prairie Mortgage Group",
    address: "120 S LaSalle St, Suite 1400, Chicago, IL 60603",
    rating: 4.8,
    reviewCount: 214,
    phone: "(312) 555-0293",
    website: "https://prairiemortgage.com",
    photoUrl: null,
    categories: ["Mortgage Lender"],
    claimed: false,
    email: "loans@prairiemortgage.com",
  },
  {
    placeId: "gp_3",
    name: "North Shore Realty Partners",
    address: "1640 Chicago Ave, Evanston, IL 60201",
    rating: 4.7,
    reviewCount: 156,
    phone: "(847) 555-0182",
    website: "https://northshorerealtypartners.com",
    photoUrl: null,
    categories: ["Realtor"],
    claimed: false,
    email: "hello@northshorerealtypartners.com",
  },
  {
    placeId: "gp_4",
    name: "Daley & Burke Real Estate Law",
    address: "77 W Wacker Dr, Suite 2100, Chicago, IL 60601",
    rating: 4.9,
    reviewCount: 67,
    phone: "(312) 555-0418",
    website: "https://daleyburkelaw.com",
    photoUrl: null,
    categories: ["Attorney"],
    claimed: false,
    email: "contact@daleyburkelaw.com",
  },
  {
    placeId: "gp_5",
    name: "HomeShield Insurance Agency",
    address: "5215 N Clark St, Chicago, IL 60640",
    rating: 4.5,
    reviewCount: 98,
    phone: "(773) 555-0371",
    website: "https://homeshieldins.com",
    photoUrl: null,
    categories: ["Insurance Agent"],
    claimed: false,
    email: "quotes@homeshieldins.com",
  },
  {
    placeId: "gp_6",
    name: "Pilsen Property Inspections",
    address: "1832 W 18th St, Chicago, IL 60608",
    rating: 4.4,
    reviewCount: 52,
    phone: "(312) 555-0539",
    website: null,
    photoUrl: null,
    categories: ["Home Inspector"],
    claimed: false,
    email: "pilseninspections@gmail.com",
  },
  {
    placeId: "gp_7",
    name: "Lakeview Lending Co.",
    address: "3422 N Southport Ave, Chicago, IL 60657",
    rating: 4.7,
    reviewCount: 131,
    phone: "(773) 555-0644",
    website: "https://lakeviewlending.com",
    photoUrl: null,
    categories: ["Mortgage Lender"],
    claimed: false,
    email: "apply@lakeviewlending.com",
  },
  {
    placeId: "gp_8",
    name: "Ravenswood Title & Closing",
    address: "4707 N Damen Ave, Chicago, IL 60625",
    rating: 4.3,
    reviewCount: 41,
    phone: "(773) 555-0782",
    website: "https://ravenswoodtitle.com",
    photoUrl: null,
    categories: ["Attorney"],
    claimed: false,
    email: "closings@ravenswoodtitle.com",
  },
];

/* ── Service Functions ─────────────────────────────────────────── */

/**
 * Search for places matching a query, category, and location.
 *
 * TODO: Replace with real Google Places Text Search API call:
 *   const response = await fetch(
 *     `https://places.googleapis.com/v1/places:searchText`,
 *     { method: 'POST', headers: { 'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY }, body: JSON.stringify({ textQuery, ... }) }
 *   );
 */
export async function searchPlaces(
  query: string,
  category: string,
  _location: string
): Promise<PlacesResult[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300));

  let results = [...mockPlacesData];

  // Filter by category if provided
  if (category && category !== "All") {
    results = results.filter((p) =>
      p.categories.some((c) => c.toLowerCase().includes(category.toLowerCase()))
    );
  }

  // Filter by query if provided
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.categories.join(" ").toLowerCase().includes(q)
    );
  }

  return results;
}

/**
 * Get detailed info about a specific place.
 *
 * TODO: Replace with real Google Places Details API call:
 *   const response = await fetch(
 *     `https://places.googleapis.com/v1/places/${placeId}`,
 *     { headers: { 'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY } }
 *   );
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  await new Promise((r) => setTimeout(r, 200));

  const place = mockPlacesData.find((p) => p.placeId === placeId);
  if (!place) return null;

  return {
    ...place,
    description: null, // Google Places doesn't always have a description
    hours: "Mon-Fri 9:00 AM – 5:00 PM",
    lat: 41.8781, // Chicago coords as default
    lng: -87.6298,
    googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${placeId}`,
    photos: [],
  };
}

/**
 * Get all mock places data (for marketplace display).
 */
export function getAllPlaces(): PlacesResult[] {
  return [...mockPlacesData];
}

/**
 * Find a place that might match a pro signing up (for claim flow).
 */
export function findMatchingPlace(
  name: string,
  category: ProServiceCategory
): PlacesResult | null {
  const lowerName = name.toLowerCase();
  return (
    mockPlacesData.find(
      (p) =>
        p.name.toLowerCase().includes(lowerName) &&
        p.categories.includes(category) &&
        !p.claimed
    ) ?? null
  );
}

/**
 * Mark a place as claimed (mock implementation).
 *
 * TODO: In production, this would update the database record linking
 * the Google Places listing to a Relays pro profile.
 */
export function claimPlace(placeId: string): boolean {
  const place = mockPlacesData.find((p) => p.placeId === placeId);
  if (place) {
    place.claimed = true;
    return true;
  }
  return false;
}
