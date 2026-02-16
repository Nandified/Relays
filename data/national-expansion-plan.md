# National Real Estate Database Expansion Plan

## Current State (Illinois / Chicago — COMPLETE)
- **61,757 Realtors** from IDFPR (state license database)
- **1,450 Home Inspectors** from IDFPR
- **2,764 Mortgage Lenders** (Outscraper/Google)
- **3,681 Insurance Agents** (Outscraper/Google)
- **2,696 Attorneys** (Outscraper/Google)
- **888 Home Inspectors** (Outscraper/Google, deduped)
- **4,429+ Google-enriched profiles** (targeted search still running — 58K/60K done)
- **Total: ~73,236 professionals** in the app

## Data Sources Per State

### Tier 1: FREE Bulk Downloads (CSV/Excel — immediate)
These states provide bulk licensee data files for free download:

| State | Source | Records (est.) | Format | URL |
|-------|--------|----------------|--------|-----|
| **Illinois** | IDFPR | 62K+ | JSON/CSV | ✅ DONE |
| **Texas** | TREC Open Data | 312K+ | CSV (daily) | data.texas.gov |
| **California** | DRE | 437K+ | CSV (daily) | secure.dre.ca.gov |
| **Florida** | DBPR | 454K+ | CSV (weekly) | myfloridalicense.com |
| **New York** | DOS Open Data | 120K+ (43K brokers + 77K sales) | CSV | data.ny.gov |

### Tier 2: States with likely bulk data (need to verify)
- **Pennsylvania** — DOS has license search, may have open data
- **Ohio** — Division of Real Estate, has public search
- **Georgia** — GREC, has public search
- **North Carolina** — NCREC, has public licensee lookup
- **Virginia** — DPOR, has licensee search
- **New Jersey** — NJ Real Estate Commission
- **Arizona** — ADRE, has license search
- **Colorado** — DORA, has license lookup
- **Washington** — DOL, has license lookup
- **Massachusetts** — Board of Registration, has lookup
- **Michigan** — LARA, has license search
- **Maryland** — DLLR, has license search
- **Tennessee** — TREC, has license search
- **Indiana** — PLA, has license lookup
- **Missouri** — Division of Professional Registration
- **Minnesota** — MN Commerce Dept
- **Wisconsin** — DSPS, has license search
- **Nevada** — NRED, has license search

## Target Markets — Top 30 Metro Areas by RE Agent Count

### Phase 1: Top 5 States (Bulk Data Available)
1. **Texas** (Houston, Dallas-FW, San Antonio, Austin) — 312K licensees
2. **California** (LA, SF, San Diego, Sacramento) — 437K licensees
3. **Florida** (Miami, Orlando, Tampa, Jacksonville) — 454K licensees
4. **New York** (NYC, Buffalo, Albany) — 120K licensees
5. **Illinois** — ✅ DONE

### Phase 2: Next 10 States
6. **Pennsylvania** (Philadelphia, Pittsburgh)
7. **Georgia** (Atlanta)
8. **Ohio** (Columbus, Cleveland, Cincinnati)
9. **North Carolina** (Charlotte, Raleigh)
10. **Virginia** (Northern VA/DC metro, Virginia Beach)
11. **Arizona** (Phoenix, Scottsdale)
12. **Colorado** (Denver)
13. **New Jersey** (statewide / NYC metro spillover)
14. **Washington** (Seattle)
15. **Massachusetts** (Boston)

### Phase 3: Remaining Top Markets
16. Michigan (Detroit)
17. Maryland (Baltimore / DC metro)
18. Tennessee (Nashville)
19. Indiana (Indianapolis)
20. Missouri (St. Louis, Kansas City)
21. Minnesota (Minneapolis)
22. Wisconsin (Milwaukee)
23. Nevada (Las Vegas)
24. Oregon (Portland)
25. South Carolina (Charleston)
26. Louisiana (New Orleans)
27. Alabama (Birmingham)
28. Kentucky (Louisville)
29. Connecticut (Hartford / NYC metro)
30. Utah (Salt Lake City)

## Implementation Plan

### Step 1: Download & Normalize Bulk Data (Tier 1)
For each state with free bulk downloads:
1. Download the CSV/Excel files
2. Parse and normalize to our standard schema
3. Import into the app's data layer

### Step 2: Google Enrichment via Outscraper
Same pattern as Illinois:
- Targeted name search for each licensee
- Match Google Place ID, rating, reviews, photos
- ~7-8% match rate expected (based on IL results)

### Step 3: Additional Professional Categories
Per state, also scrape via Outscraper:
- Mortgage lenders
- Home inspectors
- Real estate attorneys
- Insurance agents

### Cost Estimates
- Outscraper: ~$1 per 1,000 name searches
- Texas (312K): ~$312
- California (437K): ~$437
- Florida (454K): ~$454
- New York (120K): ~$120
- **Tier 1 total enrichment: ~$1,323**
- Additional categories (5 categories × ~20 cities per state): ~$200/state
- **Full national (30 states): ~$15,000-20,000 for complete enrichment**

Note: Bulk license data downloads are FREE — cost is only for Google enrichment.
