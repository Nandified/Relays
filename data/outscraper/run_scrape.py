#!/usr/bin/env python3
"""
Outscraper Full Illinois Scrape
Searches Google Maps for real estate professionals across all IL zip codes.
Uses async API to batch queries efficiently.
"""

import json
import os
import sys
import time
import urllib.request
import urllib.parse
import urllib.error

API_KEY = ""
BASE_URL = "https://api.app.outscraper.com"
DATA_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(DATA_DIR, "scrape_log.txt")

# Categories to search
CATEGORIES = [
    "real estate agent",
    "mortgage lender", 
    "home inspector",
    "real estate appraiser",
    "real estate attorney",
    "homeowners insurance agent",
]

def log(msg):
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def api_request(endpoint, params=None):
    """Make a GET request to Outscraper API"""
    url = f"{BASE_URL}{endpoint}"
    if params:
        url += "?" + urllib.parse.urlencode(params, doseq=True)
    
    req = urllib.request.Request(url)
    req.add_header("X-API-KEY", API_KEY)
    
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        log(f"  HTTP Error {e.code}: {body[:300]}")
        return {"error": f"HTTP {e.code}", "detail": body[:300]}
    except Exception as e:
        log(f"  Request error: {e}")
        return {"error": str(e)}

def start_async_search(queries, enrichments=None):
    """Start an async search job with multiple queries"""
    params = {
        "query": queries,
        "limit": 500,  # max results per query
        "async": "true",
        "language": "en",
        "region": "US",
        "dropDuplicates": "true",
    }
    
    if enrichments:
        params["enrichments"] = enrichments
    
    return api_request("/maps/search-v3", params)

def check_job(request_id):
    """Check the status of an async job"""
    return api_request(f"/requests/{request_id}")

def save_results(results, filename):
    """Save results to JSON file"""
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, "w") as f:
        json.dump(results, f, indent=2)
    log(f"  Saved {len(results)} results to {filename}")

def build_queries_for_category(category):
    """Build search queries for a category across Illinois.
    Use major cities/regions instead of every zip code to avoid over-querying."""
    
    # Illinois regions - covers the whole state efficiently
    # Using city names instead of 1000+ zip codes = way fewer API calls
    il_regions = [
        # Chicago neighborhoods (biggest density)
        "Chicago Loop, IL",
        "Chicago Lincoln Park, IL", 
        "Chicago Lakeview, IL",
        "Chicago Logan Square, IL",
        "Chicago Wicker Park, IL",
        "Chicago Hyde Park, IL",
        "Chicago Pilsen, IL",
        "Chicago Bridgeport, IL",
        "Chicago Rogers Park, IL",
        "Chicago Edison Park, IL",
        "Chicago Beverly, IL",
        "Chicago Chatham, IL",
        "Chicago Austin, IL",
        "Chicago Humboldt Park, IL",
        "Chicago Portage Park, IL",
        # North suburbs
        "Evanston, IL",
        "Skokie, IL",
        "Wilmette, IL",
        "Highland Park, IL",
        "Lake Forest, IL",
        "Northbrook, IL",
        "Glenview, IL",
        "Deerfield, IL",
        "Buffalo Grove, IL",
        "Libertyville, IL",
        "Waukegan, IL",
        "Arlington Heights, IL",
        "Palatine, IL",
        "Schaumburg, IL",
        "Mount Prospect, IL",
        # West suburbs
        "Oak Park, IL",
        "Naperville, IL",
        "Aurora, IL",
        "Wheaton, IL",
        "Downers Grove, IL",
        "Elmhurst, IL",
        "Glen Ellyn, IL",
        "Hinsdale, IL",
        "La Grange, IL",
        "Lombard, IL",
        "Bolingbrook, IL",
        "Plainfield, IL",
        "Oswego, IL",
        "St Charles, IL",
        "Geneva, IL",
        "Batavia, IL",
        "Elgin, IL",
        # South suburbs
        "Orland Park, IL",
        "Tinley Park, IL",
        "Oak Lawn, IL",
        "Homewood, IL",
        "Frankfort, IL",
        "Mokena, IL",
        "New Lenox, IL",
        "Joliet, IL",
        "Homer Glen, IL",
        # NW Indiana border (still IL)
        "Park Ridge, IL",
        "Des Plaines, IL",
        "Niles, IL",
        # Downstate major cities
        "Springfield, IL",
        "Peoria, IL",
        "Rockford, IL",
        "Champaign, IL",
        "Bloomington, IL",
        "Decatur, IL",
        "Carbondale, IL",
        "DeKalb, IL",
        "Quincy, IL",
        "Belleville, IL",
        "Edwardsville, IL",
        "O'Fallon, IL",
        "Marion, IL",
        "Galesburg, IL",
        "Kankakee, IL",
        "Danville, IL",
        "Effingham, IL",
        "Mattoon, IL",
    ]
    
    queries = []
    for region in il_regions:
        queries.append(f"{category} in {region}")
    
    return queries

def run_category(category):
    """Run scrape for a single category across all IL regions"""
    queries = build_queries_for_category(category)
    safe_cat = category.replace(" ", "_")
    
    log(f"\n{'='*60}")
    log(f"Category: {category}")
    log(f"Total queries: {len(queries)}")
    log(f"{'='*60}")
    
    all_results = []
    seen_place_ids = set()
    
    # Batch queries in groups of 25 (API limit per request)
    batch_size = 25
    for batch_start in range(0, len(queries), batch_size):
        batch_end = min(batch_start + batch_size, len(queries))
        batch_queries = queries[batch_start:batch_end]
        batch_num = batch_start // batch_size + 1
        total_batches = (len(queries) + batch_size - 1) // batch_size
        
        log(f"\n  Batch {batch_num}/{total_batches}: {len(batch_queries)} queries")
        log(f"  Queries: {batch_queries[0]} ... {batch_queries[-1]}")
        
        # Start async job
        resp = start_async_search(batch_queries, enrichments=["emails_and_contacts"])
        
        if "error" in resp:
            log(f"  ❌ Error starting batch: {resp}")
            time.sleep(5)
            continue
        
        request_id = resp.get("id")
        if not request_id:
            log(f"  ❌ No request ID returned: {resp}")
            # If sync response with data
            if resp.get("data"):
                for query_results in resp["data"]:
                    if query_results:
                        for item in query_results:
                            pid = item.get("place_id", "")
                            if pid and pid not in seen_place_ids:
                                seen_place_ids.add(pid)
                                all_results.append(item)
                log(f"  Got {len(all_results)} unique results so far")
            continue
        
        log(f"  Job started: {request_id}")
        
        # Poll for completion
        max_polls = 120  # 10 minutes max
        for poll in range(max_polls):
            time.sleep(5)
            status = check_job(request_id)
            
            state = status.get("status", "unknown")
            if state == "Success":
                data = status.get("data", [])
                batch_count = 0
                for query_results in data:
                    if query_results:
                        for item in query_results:
                            pid = item.get("place_id", "")
                            if pid and pid not in seen_place_ids:
                                seen_place_ids.add(pid)
                                all_results.append(item)
                                batch_count += 1
                log(f"  ✅ Batch complete: +{batch_count} new records ({len(all_results)} total unique)")
                break
            elif state == "Error":
                log(f"  ❌ Job failed: {status.get('error', 'unknown')}")
                break
            elif state in ("Pending", "Running"):
                if poll % 6 == 0:
                    log(f"  ⏳ Still processing... (poll {poll+1})")
            else:
                log(f"  Status: {state}")
        else:
            log(f"  ⚠️ Timed out waiting for batch")
        
        # Save intermediate results after each batch
        save_results(all_results, f"il_{safe_cat}_results.json")
        
        # Small delay between batches
        time.sleep(2)
    
    # Final save
    save_results(all_results, f"il_{safe_cat}_results.json")
    log(f"\n  Category '{category}' complete: {len(all_results)} unique records")
    
    return all_results

def main():
    log("\n" + "=" * 60)
    log("OUTSCRAPER FULL ILLINOIS SCRAPE")
    log("=" * 60)
    
    # Check balance first
    profile = api_request("/profile")
    balance = profile.get("balance", 0)
    log(f"Account balance: ${balance:.2f}")
    
    if balance < 50:
        log("⚠️ Low balance! Proceeding carefully...")
    
    grand_total = 0
    
    for category in CATEGORIES:
        results = run_category(category)
        grand_total += len(results)
        
        # Check balance after each category
        profile = api_request("/profile")
        balance = profile.get("balance", 0)
        log(f"\nBalance remaining: ${balance:.2f}")
    
    log(f"\n{'=' * 60}")
    log(f"ALL CATEGORIES COMPLETE")
    log(f"Grand total unique records: {grand_total}")
    log(f"{'=' * 60}")
    
    # Merge all results into one master file
    master = []
    seen = set()
    for cat in CATEGORIES:
        safe_cat = cat.replace(" ", "_")
        filepath = os.path.join(DATA_DIR, f"il_{safe_cat}_results.json")
        if os.path.exists(filepath):
            with open(filepath) as f:
                data = json.load(f)
                for item in data:
                    pid = item.get("place_id", "")
                    if pid not in seen:
                        seen.add(pid)
                        master.append(item)
    
    save_results(master, "il_all_professionals_master.json")
    log(f"Master file: {len(master)} unique records across all categories")
    
    # Final balance
    profile = api_request("/profile")
    log(f"Final balance: ${profile.get('balance', 0):.2f}")

if __name__ == "__main__":
    main()
