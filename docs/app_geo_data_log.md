# Geo Data (Counties, Cities, Areas) — App Build Log

Last updated: 2026-02-25 (America/Chicago)

## Goal
Create a defensible, source-attributed geo reference layer for the app:
- **Counties** (nationwide, canonical IDs)
- **Top US Cities** (for coverage/scoping)
- **Areas**: an umbrella term that can represent official district/tabulation-style units (community areas, planning areas, neighborhood councils, NTAs, wards, etc.), depending on what the locality publishes.

## Decisions (from Frank)
- Counties sheet **approved**.
- Use **“Areas”** as the app’s umbrella term (covers neighborhoods, suburbs, districts, counties, etc.).
- For city-level area breakdowns: use **official district/tabulation-style** definitions for every city/state that does it differently (no invented neighborhood names).
- Scope: start with **top 1,000 US cities**; prioritize **current platform states** first.

Current platform states (licensed_professionals pipeline): **IL, TX, CA, FL, NY, AZ, CO, CT, UT, NV, DE, OR, WV**.

---

## Counties (ALL US)
**Primary source:** US Census Bureau Gazetteer — National Counties.
- Download: https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip
- Key ID: `GEOID` (5-digit county FIPS = state FIPS (2) + county FIPS (3))

**Google Sheet (approved):**
- https://docs.google.com/spreadsheets/d/1oJRDvoxPA1tPEbZOD_HUc_HPPJZ9q7gkZIqr2IHcogA/edit

---

## Top US Cities (population-ranked)
**Source:** US Census Bureau Population Estimates — *Annual Estimates of the Resident Population for Incorporated Places in the United States: 2020–2024* (Vintage 2024).
- https://www2.census.gov/programs-surveys/popest/tables/2020-2024/cities/totals/SUB-IP-EST2024-POP.xlsx

**Notes:** The workbook’s “Geographic Area” column includes the place type (e.g., “city”, “town”). We keep `city_full` and also derive a `city` (cleaned) for matching.

---

## Neighborhood/District Sources (official-style)
### Chicago, IL
- Official 77 **Community Areas** (stable IDs)
- Chicago Data Portal (Socrata): “Boundaries – Community Areas”
  - Dataset id: `igwz-8jzy`
  - Stable ID field: `AREA_NUMBE` (1–77)
  - Metadata: https://data.cityofchicago.org/api/views/igwz-8jzy

### New York City, NY
- NYC Planning: **Neighborhood Tabulation Areas (NTA)** (2010 & 2020)
  - Landing page: https://www.nyc.gov/content/planning/pages/resources/neighborhood-tabulation-areas
  - 2020 FeatureServer: https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/NYC_Neighborhood_Tabulation_Areas_2020/FeatureServer/0
  - 2020 zip: https://s-media.nyc.gov/agencies/dcp/assets/files/zip/data-tools/bytes/neighborhood-tabulation-areas/nynta2020_25d.zip
  - 2010 zip: https://s-media.nyc.gov/agencies/dcp/assets/files/zip/data-tools/bytes/neighborhood-tabulation-areas/nynta2010_25d.zip

### Los Angeles, CA
- City of LA GeoHub: **Neighborhood Council Boundaries (2018)**
  - FeatureServer: https://services5.arcgis.com/7nsPwEMP38bSkCjy/arcgis/rest/services/Neighborhood_Council_Boundaries_(2018)/FeatureServer

### Houston, TX
- Not locked yet (ArcGIS Hub search endpoint tested returned 0 datasets). Need the correct Houston GIS/open-data portal URL for authoritative “Super Neighborhoods” or equivalent.

---

## Google Sheets (working)
### Neighborhoods / Cities working sheet
- https://docs.google.com/spreadsheets/d/152Xg4gghxN-tG_zhRxdkEhJemQW5VNC6IaBiesau7sI/edit

Tabs:
- `Areas_Cities` (cities list)
- `Areas_Layers` (area layer registry)
- `Areas` (flattened area/district list)
- `Raw_Sheet1_Backup` (snapshot backup)
- `Areas_ZCTAs`
- `City_ZCTA_Map`
- `City_ZCTA_Map_All`
- `us_zipcodes_zcta_2025` (US Census Gazetteer 2025 ZCTA list; added 2026-02-26)

---

## Progress update (2026-02-25)
- Frank increased the working sheet to **20,000 rows**.
- Added a district-layer registry + began loading flattened districts.
- Flattened districts loaded so far:
  - Chicago — 77 Community Areas
  - San Francisco — Analysis Neighborhoods
  - Denver — Statistical Neighborhoods
  - NYC — 262 Neighborhood Tabulation Areas (2020)
  - Los Angeles — 99 Neighborhood Councils (2018)
