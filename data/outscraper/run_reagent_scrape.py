#!/usr/bin/env python3
"""run_reagent_scrape.py

Outscraper async Google Maps scrape for Illinois "real estate agent" across the same 78 IL cities.

Key requirements:
- Batch size: 5 queries max (dense category)
- Timeout: 60 minutes per batch
- Poll interval: 15 seconds
- Queries: "real estate agent in [City], IL"
- Deduplicate by place_id across batches
- Append results (never discard existing file contents)
- Log to data/outscraper/scrape_log_reagent.txt
- Print balance before and after
- Handle both Outscraper response shapes:
    - flat list: [{...}, {...}]
    - nested per query: [[{...}], [{...}], ...]
- Stdlib only

API:
- Start:  POST/GET https://api.app.outscraper.com/maps/search-v3?query=...&limit=500&async=true&language=en&region=US&dropDuplicates=true
- Poll:       GET https://api.app.outscraper.com/requests/{request_id}

"""

from __future__ import annotations

import json
import os
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

HERE = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(HERE, "scrape_log_reagent.txt")

CATEGORY = "real estate agent"
BATCH_SIZE = 5
POLL_INTERVAL_S = 15
POLL_TIMEOUT_S = 60 * 60

# Same list as run_fixed_scrape.py
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


def log(msg: str) -> None:
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def api_get(endpoint: str, params: Optional[Dict[str, Any]] = None, timeout_s: int = 180) -> Dict[str, Any]:
    url = f"{BASE_URL}{endpoint}"
    if params:
        url += "?" + urllib.parse.urlencode(params, doseq=True)

    req = urllib.request.Request(url)
    req.add_header("X-API-KEY", API_KEY)

    try:
        with urllib.request.urlopen(req, timeout=timeout_s) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace") if getattr(e, "fp", None) else ""
        return {"error": f"HTTP {e.code}", "detail": body[:2000]}
    except Exception as e:
        return {"error": str(e)}


def get_balance() -> Optional[float]:
    prof = api_get("/profile")
    if "error" in prof:
        log(f"⚠️ Could not fetch profile: {prof}")
        return None
    bal = prof.get("balance")
    try:
        return float(bal)
    except Exception:
        return None


def out_path() -> str:
    return os.path.join(HERE, "il_real_estate_agent_results.json")


def load_existing(path: str) -> List[Dict[str, Any]]:
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


def build_queries(cities: Iterable[str]) -> List[str]:
    return [f"{CATEGORY} in {city}, IL" for city in cities]


def city_from_query(q: str) -> str:
    if " in " in q:
        city = q.split(" in ", 1)[1].strip()
    else:
        city = q.strip()
    if city.endswith(", IL"):
        city = city[: -len(", IL")]
    return city.strip()


def start_async_job(batch_queries: List[str]) -> Dict[str, Any]:
    params: Dict[str, Any] = {
        "query": batch_queries,
        "limit": 500,
        "async": "true",
        "language": "en",
        "region": "US",
        "dropDuplicates": "true",
    }
    return api_get("/maps/search-v3", params)


def check_job(request_id: str) -> Dict[str, Any]:
    return api_get(f"/requests/{request_id}")


def normalize_data_shape(data: Any) -> Tuple[str, List[List[Dict[str, Any]]]]:
    if data is None:
        return ("none", [])

    if data == []:
        return ("empty", [])

    if isinstance(data, list) and data:
        if all(isinstance(x, dict) for x in data):
            return ("flat", [data])
        if all(isinstance(x, list) for x in data):
            nested: List[List[Dict[str, Any]]] = []
            for sub in data:
                if isinstance(sub, list):
                    nested.append([x for x in sub if isinstance(x, dict)])
            return ("nested", nested)

    return ("unknown", [])


def poll_until_complete(request_id: str) -> Dict[str, Any]:
    deadline = time.time() + POLL_TIMEOUT_S
    poll_n = 0
    while True:
        poll_n += 1
        status = check_job(request_id)
        st = status.get("status")

        if st in ("Success", "Error"):
            return status

        if time.time() >= deadline:
            status["status"] = "Timeout"
            return status

        if poll_n == 1 or poll_n % 10 == 0:
            log(f"  ⏳ Job {request_id} status={st} (poll {poll_n})")

        time.sleep(POLL_INTERVAL_S)


def extract_items(status_or_resp: Dict[str, Any], batch_queries: List[str]) -> List[Dict[str, Any]]:
    data = status_or_resp.get("data")
    shape, nested = normalize_data_shape(data)

    out: List[Dict[str, Any]] = []

    if shape == "flat":
        flat_items = nested[0] if nested else []
        for it in flat_items:
            it2 = dict(it)
            it2.setdefault("_category", CATEGORY)
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
                it2.setdefault("_category", CATEGORY)
                if q:
                    it2.setdefault("_query", q)
                    it2.setdefault("_il_city", city_from_query(q))
                out.append(it2)
        return out

    if shape in ("empty", "none"):
        return []

    # unknown shape -> best effort
    if isinstance(data, dict):
        it2 = dict(data)
        it2.setdefault("_category", CATEGORY)
        out.append(it2)
    return out


def main() -> int:
    os.makedirs(HERE, exist_ok=True)

    log("\n" + "=" * 70)
    log("OUTSCRAPER IL SCRAPER — REAL ESTATE AGENT")
    log(f"Batch size: {BATCH_SIZE} | Poll interval: {POLL_INTERVAL_S}s | Timeout: {POLL_TIMEOUT_S/60:.0f}m")
    log(f"Output: {out_path()}")
    log("=" * 70)

    bal0 = get_balance()
    if bal0 is not None:
        log(f"Starting balance: ${bal0:.2f}")

    path = out_path()
    existing = load_existing(path)
    log(f"Existing records on disk: {len(existing)}")

    queries = build_queries(CITIES_IL)
    log(f"Total queries: {len(queries)}")

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

        if not request_id:
            log("  ⚠️ No request id returned (sync response?). Parsing immediate data.")
            items = extract_items({"data": resp.get("data")}, batch)
            total_unique, added = save_appending_dedup(path, existing, items)
            existing = load_existing(path)
            total_new_unique += added
            log(f"  ✅ Saved immediate response: added {added} new unique (total {total_unique}).")
            continue

        log(f"  Job started: {request_id}")
        status = poll_until_complete(request_id)
        st = status.get("status")

        if st == "Success":
            items = extract_items(status, batch)
            total_unique, added = save_appending_dedup(path, existing, items)
            existing = load_existing(path)
            total_new_unique += added
            shape, _ = normalize_data_shape(status.get("data"))
            log(f"  ✅ Batch complete. Data shape={shape}. Added {added} new unique. Total unique now {total_unique}.")
        elif st == "Timeout":
            log(f"  ⚠️ Batch timed out after {POLL_TIMEOUT_S/60:.0f} minutes. Saving nothing for this batch.")
        else:
            log(f"  ❌ Batch failed. Status: {st}. Error: {status.get('error') or status.get('detail')}")

        time.sleep(1)

    log("\n" + "=" * 70)
    log(f"DONE. Newly added unique this run: {total_new_unique}")
    log(f"Total unique on disk: {len(load_existing(path))}")

    bal1 = get_balance()
    if bal1 is not None:
        log(f"Final balance: ${bal1:.2f}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
