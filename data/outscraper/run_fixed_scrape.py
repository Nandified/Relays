#!/usr/bin/env python3
"""run_fixed_scrape.py

Outscraper async Google Maps scrape for select Illinois categories.

Fixes prior parsing bug by handling BOTH Outscraper response shapes:
- flat list: [{...}, {...}]
- nested list per query: [[{...}], [{...}], ...]

Requirements from main task:
- async API
- batch size <= 15
- poll interval 15s
- timeout 45 minutes per batch
- append to per-category result files; never overwrite
- deduplicate by place_id
- skip already-covered cities for mortgage lender + home inspector based on existing saved results
- log to data/outscraper/scrape_log_fixed.txt
- print balance after each category

Only stdlib is used.
"""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, Iterable, List, Optional, Tuple

API_KEY = os.environ.get(
    "OUTSCRAPER_API_KEY",
    "",
)
BASE_URL = "https://api.app.outscraper.com"

HERE = os.path.dirname(os.path.abspath(__file__))  # data/outscraper
LOG_FILE = os.path.join(HERE, "scrape_log_fixed.txt")

BATCH_SIZE = 15
POLL_INTERVAL_S = 15
POLL_TIMEOUT_S = 45 * 60

CITIES_IL = [
    "Chicago Loop",
    "Lincoln Park",
    "Lakeview",
    "Hyde Park",
    "Wicker Park",
    "Logan Square",
    "Pilsen",
    "Bridgeport",
    "Rogers Park",
    "Edgewater",
    "Uptown",
    "Ravenswood",
    "Evanston",
    "Oak Park",
    "Naperville",
    "Aurora",
    "Joliet",
    "Rockford",
    "Springfield",
    "Champaign",
    "Peoria",
    "Elgin",
    "Schaumburg",
    "Arlington Heights",
    "Skokie",
    "Des Plaines",
    "Bolingbrook",
    "Palatine",
    "Orland Park",
    "Tinley Park",
    "Downers Grove",
    "Wheaton",
    "Glen Ellyn",
    "Lombard",
    "Plainfield",
    "Hoffman Estates",
    "Buffalo Grove",
    "Crystal Lake",
    "Glenview",
    "Normal",
    "Bloomington",
    "DeKalb",
    "Decatur",
    "Belleville",
    "Carbondale",
    "Quincy",
    "Waukegan",
    "Lake Forest",
    "Highland Park",
    "Wilmette",
    "Northbrook",
    "Hinsdale",
    "La Grange",
    "Winnetka",
    "Park Ridge",
    "Mount Prospect",
    "Libertyville",
    "Barrington",
    "Lake Zurich",
    "Mundelein",
    "Wheeling",
    "Niles",
    "Berwyn",
    "Cicero",
    "Oak Lawn",
    "Homewood",
    "Frankfort",
    "New Lenox",
    "Oswego",
    "Mokena",
    "Shorewood",
    "Woodridge",
    "Lisle",
    "Westmont",
    "Clarendon Hills",
    "Elmhurst",
    "Galesburg",
    "Mattoon",
]

CATEGORIES_TO_RUN = [
    "mortgage lender",
    "home inspector",
    "real estate attorney",
    "homeowners insurance agent",
]


def log(msg: str) -> None:
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def api_request(endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    url = f"{BASE_URL}{endpoint}"
    if params:
        url += "?" + urllib.parse.urlencode(params, doseq=True)

    req = urllib.request.Request(url)
    req.add_header("X-API-KEY", API_KEY)

    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace") if getattr(e, "fp", None) else ""
        return {"error": f"HTTP {e.code}", "detail": body[:2000]}
    except Exception as e:
        return {"error": str(e)}


def get_balance() -> Optional[float]:
    prof = api_request("/profile")
    if "error" in prof:
        log(f"⚠️ Could not fetch profile: {prof}")
        return None
    bal = prof.get("balance")
    try:
        return float(bal)
    except Exception:
        return None


def category_to_filename(category: str) -> str:
    safe = category.replace(" ", "_")
    return os.path.join(HERE, f"il_{safe}_results.json")


def load_existing_results(path: str) -> List[Dict[str, Any]]:
    if not os.path.exists(path):
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, list):
            return [x for x in data if isinstance(x, dict)]
        return []
    except Exception as e:
        log(f"⚠️ Failed reading existing results {path}: {e}")
        return []


def save_appending_dedup(path: str, existing: List[Dict[str, Any]], new_items: List[Dict[str, Any]]) -> Tuple[int, int]:
    """Append new_items to existing, dedup by place_id, write full list.

    Returns: (total_unique, newly_added_unique)
    """
    seen: set[str] = set()
    out: List[Dict[str, Any]] = []

    def add(item: Dict[str, Any]) -> bool:
        pid = (item.get("place_id") or "").strip()
        if not pid:
            return False
        if pid in seen:
            return False
        seen.add(pid)
        out.append(item)
        return True

    for it in existing:
        add(it)

    added = 0
    for it in new_items:
        if add(it):
            added += 1

    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False)
    os.replace(tmp, path)

    return (len(out), added)


def build_queries(category: str, cities: Iterable[str]) -> List[str]:
    return [f"{category} in {city}, IL" for city in cities]


def city_from_query(q: str) -> str:
    # "<cat> in <city>, IL"
    if " in " in q:
        city = q.split(" in ", 1)[1].strip()
    else:
        city = q.strip()
    city = city.removesuffix(", IL").strip()
    return city


def covered_cities_from_results(items: List[Dict[str, Any]]) -> set[str]:
    cities: set[str] = set()
    for it in items:
        # Prefer our explicit fields
        c = (it.get("_il_city") or "").strip()
        if c:
            cities.add(c)
            continue
        q = (it.get("_query") or it.get("query") or "").strip()
        if q:
            cities.add(city_from_query(q))
    return cities


def start_async_job(batch_queries: List[str]) -> Dict[str, Any]:
    params: Dict[str, Any] = {
        "query": batch_queries,
        "limit": 500,
        "async": "true",
        "language": "en",
        "region": "US",
        "dropDuplicates": "true",
        # keep enrichments off by default to reduce cost; enable only if needed
        # "enrichments": ["emails_and_contacts"],
    }
    return api_request("/maps/search-v3", params)


def check_job(request_id: str) -> Dict[str, Any]:
    return api_request(f"/requests/{request_id}")


def normalize_data_shape(data: Any) -> Tuple[str, List[List[Dict[str, Any]]]]:
    """Returns (shape, nested_per_query).

    - If flat list of dicts: returns ("flat", [flat_items])
    - If nested list per query: returns ("nested", nested)
    - Else: ("unknown", [])
    """
    if data is None:
        return ("none", [])

    if isinstance(data, list) and data:
        if all(isinstance(x, dict) for x in data):
            return ("flat", [data])
        if all(isinstance(x, list) for x in data):
            nested: List[List[Dict[str, Any]]] = []
            for sub in data:
                if not isinstance(sub, list):
                    continue
                nested.append([x for x in sub if isinstance(x, dict)])
            return ("nested", nested)

    # Some responses may be empty list
    if data == []:
        return ("empty", [])

    return ("unknown", [])


def poll_until_complete(request_id: str, batch_queries: List[str]) -> Dict[str, Any]:
    deadline = time.time() + POLL_TIMEOUT_S
    poll_n = 0
    while True:
        poll_n += 1
        status = check_job(request_id)
        if "error" in status:
            log(f"  ❌ Poll error (poll {poll_n}): {status}")
        st = status.get("status")

        if st == "Success":
            return status
        if st == "Error":
            return status

        if time.time() >= deadline:
            status["status"] = "Timeout"
            return status

        if poll_n == 1 or poll_n % 10 == 0:
            log(f"  ⏳ Job {request_id} status={st} (poll {poll_n})")

        time.sleep(POLL_INTERVAL_S)


def extract_items_from_status(status: Dict[str, Any], batch_queries: List[str], category: str) -> List[Dict[str, Any]]:
    data = status.get("data")
    shape, nested = normalize_data_shape(data)

    out: List[Dict[str, Any]] = []

    if shape == "flat":
        # Can't map to query reliably unless item includes 'query' field.
        flat_items = nested[0] if nested else []
        for it in flat_items:
            it2 = dict(it)
            it2.setdefault("_category", category)
            # Preserve Outscraper-provided query if present
            q = it2.get("query") or it2.get("_query")
            if q:
                it2.setdefault("_query", q)
                it2.setdefault("_il_city", city_from_query(str(q)))
            out.append(it2)
        return out

    if shape == "nested":
        for i, sub in enumerate(nested):
            q = batch_queries[i] if i < len(batch_queries) else None
            for it in sub:
                it2 = dict(it)
                it2.setdefault("_category", category)
                if q:
                    it2.setdefault("_query", q)
                    it2.setdefault("_il_city", city_from_query(q))
                out.append(it2)
        return out

    if shape in ("empty", "none"):
        return []

    # Unknown shape: best-effort flatten if possible
    if isinstance(data, dict):
        it2 = dict(data)
        it2.setdefault("_category", category)
        out.append(it2)
    return out


def run_category(category: str) -> None:
    path = category_to_filename(category)
    existing = load_existing_results(path)

    # Determine cities to run
    all_cities = list(CITIES_IL)

    if category in ("mortgage lender", "home inspector"):
        covered = covered_cities_from_results(existing)
        if covered:
            all_cities = [c for c in all_cities if c not in covered]
            log(f"Skipping {len(covered)} already-covered cities for '{category}'. Remaining: {len(all_cities)}")
        else:
            log(f"No covered cities detected for '{category}' (existing file empty or missing fields). Running all {len(all_cities)} cities.")

    queries = build_queries(category, all_cities)

    log("\n" + "=" * 70)
    log(f"CATEGORY: {category}")
    log(f"Existing records: {len(existing)}")
    log(f"Total queries to run now: {len(queries)}")
    log("=" * 70)

    if not queries:
        log(f"✅ Nothing to do for category '{category}'.")
        return

    total_new_unique = 0

    for bstart in range(0, len(queries), BATCH_SIZE):
        bend = min(bstart + BATCH_SIZE, len(queries))
        batch = queries[bstart:bend]
        bnum = bstart // BATCH_SIZE + 1
        btot = (len(queries) + BATCH_SIZE - 1) // BATCH_SIZE

        log(f"\nBatch {bnum}/{btot}: {len(batch)} queries")
        log(f"  First: {batch[0]}")
        log(f"  Last:  {batch[-1]}")

        resp = start_async_job(batch)
        if "error" in resp:
            log(f"  ❌ Error starting job: {resp}")
            time.sleep(5)
            continue

        request_id = resp.get("id")

        # Sometimes Outscraper returns sync data
        if not request_id:
            log(f"  ⚠️ No request id returned. Attempting to parse immediate data.")
            status_like = {"status": "Success", "data": resp.get("data")}
            items = extract_items_from_status(status_like, batch, category)
            total_before = len(existing)
            total_unique, added = save_appending_dedup(path, existing, items)
            existing = load_existing_results(path)  # reload to maintain consistent state
            total_new_unique += added
            log(f"  ✅ Saved after immediate response: added {added} new unique (total {total_unique}).")
            continue

        log(f"  Job started: {request_id}")
        status = poll_until_complete(request_id, batch)

        st = status.get("status")
        if st == "Success":
            items = extract_items_from_status(status, batch, category)
            total_unique, added = save_appending_dedup(path, existing, items)
            existing = load_existing_results(path)
            total_new_unique += added
            shape, _ = normalize_data_shape(status.get("data"))
            log(f"  ✅ Batch complete. Data shape={shape}. Added {added} new unique. Total unique now {total_unique}.")
        elif st == "Timeout":
            log(f"  ⚠️ Batch timed out after {POLL_TIMEOUT_S/60:.0f} minutes. Saving nothing for this batch.")
        else:
            log(f"  ❌ Batch failed. Status: {st}. Error: {status.get('error') or status.get('detail')}")

        time.sleep(1)

    log(f"\n✅ Category finished: {category}. Newly added unique this run: {total_new_unique}. Total on disk: {len(load_existing_results(path))}")


def main() -> int:
    os.makedirs(HERE, exist_ok=True)

    log("\n" + "=" * 70)
    log("OUTSCRAPER FIXED IL SCRAPER")
    log(f"Batch size: {BATCH_SIZE} | Poll interval: {POLL_INTERVAL_S}s | Timeout: {POLL_TIMEOUT_S/60:.0f}m")
    log("=" * 70)

    bal = get_balance()
    if bal is not None:
        log(f"Starting balance: ${bal:.2f}")

    for cat in CATEGORIES_TO_RUN:
        run_category(cat)
        bal = get_balance()
        if bal is not None:
            log(f"Balance after '{cat}': ${bal:.2f}")

    log("\nAll requested categories complete.")
    bal = get_balance()
    if bal is not None:
        log(f"Final balance: ${bal:.2f}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
