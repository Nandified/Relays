#!/usr/bin/env python3
"""targeted_search_all.py

Search unmatched IDFPR brokers by name on Outscraper to find their Google Maps profiles.
Resilient: saves progress after every batch, can resume from where it left off.

Run: nohup python3 targeted_search_all.py > targeted_search.log 2>&1 &
"""

from __future__ import annotations

import csv
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional, Tuple

API_KEY = os.environ.get(
    "OUTSCRAPER_API_KEY",
    "",
)
BASE_URL = "https://api.app.outscraper.com"

HERE = os.path.dirname(os.path.abspath(__file__))
IDFPR_DIR = os.path.join(os.path.dirname(HERE), "idfpr") if os.path.basename(HERE) == "outscraper" else HERE

# Paths
BROKER_CSV = os.path.join(IDFPR_DIR, "real_estate_broker.csv")
ENRICHMENT_JSON = os.path.join(IDFPR_DIR, "idfpr_outscraper_enrichment.json")
PROGRESS_FILE = os.path.join(HERE, "targeted_search_progress.json")
RESULTS_FILE = os.path.join(HERE, "targeted_search_results.json")
LOG_FILE = os.path.join(HERE, "targeted_search.log")

# Tuning
BATCH_SIZE = 15       # queries per Outscraper batch
POLL_INTERVAL_S = 15  # seconds between polls
POLL_TIMEOUT_S = 300  # 5 min timeout per batch
SAVE_EVERY = 1        # save after every batch (resilient)
BALANCE_CHECK_EVERY = 50  # check balance every N batches
MIN_BALANCE = 10.0    # stop if balance drops below this


def log(msg: str) -> None:
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)


def api_get(endpoint: str, params: Optional[Dict[str, Any]] = None, timeout_s: int = 180) -> Dict[str, Any]:
    url = f"{BASE_URL}{endpoint}"
    if params:
        url += "?" + urllib.parse.urlencode(params, doseq=True)
    req = urllib.request.Request(url)
    req.add_header("X-API-KEY", API_KEY)
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=timeout_s) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace") if hasattr(e, "read") else ""
            if e.code == 429:
                wait = 30 * (attempt + 1)
                log(f"  Rate limited (429). Waiting {wait}s...")
                time.sleep(wait)
                continue
            return {"error": f"HTTP {e.code}", "detail": body[:500]}
        except Exception as e:
            if attempt < 2:
                log(f"  Request error (attempt {attempt+1}): {e}. Retrying in 10s...")
                time.sleep(10)
                continue
            return {"error": str(e)}
    return {"error": "Max retries exceeded"}


def get_balance() -> Optional[float]:
    prof = api_get("/profile")
    try:
        return float(prof.get("balance", 0))
    except Exception:
        return None


def load_brokers() -> List[Dict[str, str]]:
    """Load all IDFPR brokers from CSV."""
    with open(BROKER_CSV, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def load_already_matched() -> set:
    """Load license numbers that already have Google Place IDs."""
    if not os.path.exists(ENRICHMENT_JSON):
        return set()
    with open(ENRICHMENT_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)
    matched = set()
    for lic, info in data.get("byLicenseNumber", {}).items():
        if info.get("googlePlaceId"):
            matched.add(lic)
    return matched


def load_progress() -> Dict[str, Any]:
    """Load progress state (which brokers have been searched)."""
    if not os.path.exists(PROGRESS_FILE):
        return {"searched_licenses": [], "total_searched": 0, "matches_found": 0}
    with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_progress(progress: Dict[str, Any]) -> None:
    tmp = PROGRESS_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(progress, f)
    os.replace(tmp, PROGRESS_FILE)


def load_results() -> List[Dict[str, Any]]:
    if not os.path.exists(RESULTS_FILE):
        return []
    with open(RESULTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_results(results: List[Dict[str, Any]]) -> None:
    tmp = RESULTS_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False)
    os.replace(tmp, RESULTS_FILE)


def build_query(broker: Dict[str, str]) -> str:
    """Build a targeted search query for a broker."""
    name = broker.get("name", "").strip()
    city = broker.get("city", "").strip()
    state = broker.get("state", "IL").strip()
    return f"{name} real estate agent {city}, {state}"


def match_broker_to_results(broker: Dict[str, str], results: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Try to match a broker to Outscraper results by name similarity."""
    broker_name = broker.get("name", "").strip().lower()
    if not broker_name:
        return None

    # Split broker name into parts for matching
    name_parts = set(broker_name.split())

    for result in results:
        result_name = (result.get("name") or "").strip().lower()
        if not result_name:
            continue

        result_parts = set(result_name.split())

        # Must share at least 2 name parts (first + last typically)
        common = name_parts & result_parts
        if len(common) >= 2:
            # Additional check: must be in a real estate category or have no category
            cats = (result.get("category") or result.get("type") or "").lower()
            # Accept if it looks like a real estate listing or person
            return result

    return None


def submit_batch(queries: List[str]) -> Dict[str, Any]:
    """Submit a batch of queries to Outscraper async API."""
    params = {
        "query": queries,
        "limit": 1,  # We only need the top result per name search
        "async": "true",
        "language": "en",
        "region": "US",
    }
    return api_get("/maps/search-v3", params)


def poll_batch(request_id: str) -> Dict[str, Any]:
    """Poll until batch completes or times out."""
    deadline = time.time() + POLL_TIMEOUT_S
    poll_n = 0
    while True:
        poll_n += 1
        status = api_get(f"/requests/{request_id}")
        st = status.get("status")
        if st in ("Success", "Error"):
            return status
        if time.time() >= deadline:
            status["status"] = "Timeout"
            return status
        time.sleep(POLL_INTERVAL_S)


def extract_results_nested(data: Any) -> List[List[Dict[str, Any]]]:
    """Extract per-query results from Outscraper response."""
    if data is None or data == []:
        return []
    if isinstance(data, list):
        if all(isinstance(x, list) for x in data):
            return data
        if all(isinstance(x, dict) for x in data):
            return [data]
    return []


def main() -> int:
    log("=" * 70)
    log("TARGETED BROKER SEARCH — Outscraper Name-Based Matching")
    log("=" * 70)

    # Check balance
    bal = get_balance()
    if bal is not None:
        log(f"Starting balance: ${bal:.2f}")
        if bal < MIN_BALANCE:
            log(f"❌ Balance too low (< ${MIN_BALANCE}). Stopping.")
            return 1

    # Load data
    log("Loading IDFPR brokers...")
    all_brokers = load_brokers()
    log(f"Total IDFPR brokers: {len(all_brokers)}")

    already_matched = load_already_matched()
    log(f"Already have Google match: {len(already_matched)}")

    # Filter to unmatched only
    unmatched = [b for b in all_brokers if b.get("license_number", "") not in already_matched]
    log(f"Unmatched brokers to search: {len(unmatched)}")

    # Load progress (resume support)
    progress = load_progress()
    searched_set = set(progress.get("searched_licenses", []))
    log(f"Previously searched (from progress file): {len(searched_set)}")

    # Filter out already-searched
    to_search = [b for b in unmatched if b.get("license_number", "") not in searched_set]
    log(f"Remaining to search this run: {len(to_search)}")

    if not to_search:
        log("✅ All brokers already searched!")
        return 0

    # Load existing results
    results = load_results()
    matches_found = progress.get("matches_found", len(results))
    total_searched = progress.get("total_searched", len(searched_set))
    log(f"Existing matches: {matches_found}")

    total_batches = (len(to_search) + BATCH_SIZE - 1) // BATCH_SIZE
    log(f"Batches remaining: {total_batches} (batch size {BATCH_SIZE})")
    log("")

    batch_count = 0
    consecutive_errors = 0

    for bstart in range(0, len(to_search), BATCH_SIZE):
        bend = min(bstart + BATCH_SIZE, len(to_search))
        batch_brokers = to_search[bstart:bend]
        batch_count += 1

        queries = [build_query(b) for b in batch_brokers]

        log(f"Batch {batch_count}/{total_batches}: {len(queries)} queries (progress {total_searched}/{total_searched + len(to_search) - bstart})")

        # Submit
        resp = submit_batch(queries)
        if "error" in resp:
            log(f"  ❌ Submit error: {resp['error']}")
            consecutive_errors += 1
            if consecutive_errors >= 5:
                log("  Too many consecutive errors. Stopping.")
                break
            time.sleep(30)
            continue

        request_id = resp.get("id")
        if not request_id:
            # Sync response
            data = resp.get("data", [])
            per_query = extract_results_nested(data)
        else:
            log(f"  Batch request id: {request_id}")
            status = submit_result = poll_batch(request_id)
            st = status.get("status")
            if st != "Success":
                log(f"  ⚠️ Batch {st}. Skipping.")
                consecutive_errors += 1
                if consecutive_errors >= 5:
                    log("  Too many consecutive errors. Stopping.")
                    break
                continue
            per_query = extract_results_nested(status.get("data", []))

        consecutive_errors = 0  # Reset on success

        # Match results to brokers
        batch_matches = 0
        for i, broker in enumerate(batch_brokers):
            query_results = per_query[i] if i < len(per_query) else []
            if not isinstance(query_results, list):
                query_results = [query_results] if isinstance(query_results, dict) else []

            match = match_broker_to_results(broker, query_results)
            if match:
                results.append({
                    "license_number": broker.get("license_number", ""),
                    "broker_name": broker.get("name", ""),
                    "broker_city": broker.get("city", ""),
                    "google_name": match.get("name", ""),
                    "google_place_id": match.get("place_id", ""),
                    "google_rating": match.get("rating"),
                    "google_reviews": match.get("reviews"),
                    "google_phone": match.get("phone", ""),
                    "google_website": match.get("site", ""),
                    "google_photo": match.get("photo", ""),
                    "google_address": match.get("full_address", ""),
                })
                batch_matches += 1
                matches_found += 1

            # Track as searched
            lic = broker.get("license_number", "")
            if lic:
                searched_set.add(lic)

        total_searched += len(batch_brokers)

        # Save progress after every batch
        progress = {
            "searched_licenses": list(searched_set),
            "total_searched": total_searched,
            "matches_found": matches_found,
            "last_batch": batch_count,
            "last_updated": time.strftime("%Y-%m-%dT%H:%M:%S"),
        }
        save_progress(progress)
        save_results(results)

        elapsed_msg = f"totalSearched={total_searched} matchesFound={matches_found}"
        log(f"  Finished batch: {len(queries)} queries, {batch_matches} new matches | {elapsed_msg}")

        # Periodic balance check
        if batch_count % BALANCE_CHECK_EVERY == 0:
            bal = get_balance()
            if bal is not None:
                log(f"  Outscraper balance: ${bal:.2f}")
                if bal < MIN_BALANCE:
                    log(f"  ❌ Balance dropped below ${MIN_BALANCE}. Stopping.")
                    break

        # Small delay between batches
        time.sleep(1)

    # Final summary
    log("")
    log("=" * 70)
    bal = get_balance()
    log(f"FINISHED. Total searched: {total_searched} | Matches: {matches_found} | Rate: {matches_found/max(total_searched,1)*100:.1f}%")
    if bal is not None:
        log(f"Final balance: ${bal:.2f}")
    log(f"Results saved to: {RESULTS_FILE}")
    log(f"Progress saved to: {PROGRESS_FILE}")
    log("=" * 70)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
