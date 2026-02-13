#!/usr/bin/env python3
"""Scrape Homes.com real estate agent directory pages for Illinois.

Why Playwright?
- Homes.com returns 403 (Akamai) to plain `requests` in this environment.
- A real browser session (non-headless Chromium) works reliably.

Outputs
- data/homes_com/il_agents.json
- data/homes_com/scrape_log.txt

Usage (recommended)
  source .venv/bin/activate
  python data/homes_com/scrape_agents.py --test

Full run
  python data/homes_com/scrape_agents.py

Optional: also visit each agent profile page to extract license # (slow)
  python data/homes_com/scrape_agents.py --fetch-profiles

Notes
- Rate-limited with a 2–3s delay between page navigations.
- Pagination URLs on Homes.com look like: /real-estate-agents/chicago-il/p2/
"""

from __future__ import annotations

import argparse
import json
import os
import random
import re
import sys
import time
from dataclasses import asdict, dataclass
from datetime import datetime
from typing import Any, Dict, Iterable, List, Optional
from urllib.parse import urljoin

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

BASE = "https://www.homes.com"
DATA_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_JSON = os.path.join(DATA_DIR, "il_agents.json")
LOG_FILE = os.path.join(DATA_DIR, "scrape_log.txt")


IL_REGIONS_77 = [
    # (Copied from data/outscraper/run_scrape.py build_queries_for_category)
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


@dataclass
class AgentRecord:
    agent_name: str
    city: str
    state: str
    brokerage: Optional[str]
    phone: Optional[str]
    photo_url: Optional[str]
    page_url: str
    license_number: Optional[str]
    source: str = "homes_com"
    scraped_at: str = ""


def log(msg: str) -> None:
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def slugify_city(region: str) -> str:
    """Turn 'Chicago Loop, IL' -> 'chicago-loop-il'."""
    city = region.split(",")[0].strip().lower()
    city = city.replace("'", "")
    city = re.sub(r"\s+", "-", city)
    city = re.sub(r"[^a-z0-9\-]", "", city)
    return f"{city}-il"


def city_display(region: str) -> str:
    return region.split(",")[0].strip()


def build_search_url(region: str, page: int = 1) -> str:
    slug = slugify_city(region)
    if page <= 1:
        return f"{BASE}/real-estate-agents/{slug}/"
    return f"{BASE}/real-estate-agents/{slug}/p{page}/"


def parse_agents_from_search_html(html: str, region: str) -> List[AgentRecord]:
    soup = BeautifulSoup(html, "lxml")

    agents: List[AgentRecord] = []

    # Cards contain .agent-name, .company, .phone, and link to /real-estate-agents/<slug>/<id>/
    for name_el in soup.select(".agent-name"):
        li = name_el.find_parent("li")
        if not li:
            continue

        a = li.select_one('a[href^="/real-estate-agents/"]')
        if not a or not a.get("href"):
            continue

        href = a.get("href")
        page_url = urljoin(BASE, href)

        name = name_el.get_text(" ", strip=True)
        company_el = li.select_one(".company")
        phone_el = li.select_one(".phone")
        img_el = li.select_one("img")

        brokerage = company_el.get_text(" ", strip=True) if company_el else None
        phone = phone_el.get_text(" ", strip=True) if phone_el else None

        photo_url = None
        if img_el:
            photo_url = img_el.get("src") or img_el.get("data-src")

        agents.append(
            AgentRecord(
                agent_name=name,
                city=city_display(region),
                state="IL",
                brokerage=brokerage,
                phone=phone,
                photo_url=photo_url,
                page_url=page_url,
                license_number=None,
                scraped_at=datetime.utcnow().isoformat() + "Z",
            )
        )

    # Deduplicate by page_url (multiple DOM fragments can reference same agent)
    uniq: Dict[str, AgentRecord] = {}
    for a in agents:
        uniq[a.page_url] = a
    return list(uniq.values())


LICENSE_PATTERNS = [
    re.compile(r"\bLicense\s*(?:#|No\.?|Number)?\s*[:#]?\s*([0-9]{6,12})\b", re.I),
    re.compile(r"\bIL\s*License\s*[:#]?\s*([0-9]{6,12})\b", re.I),
]


def parse_license_number_from_profile_html(html: str) -> Optional[str]:
    # Homes.com profile pages vary; as a fallback, regex over visible text.
    soup = BeautifulSoup(html, "lxml")
    text = soup.get_text("\n", strip=True)
    for pat in LICENSE_PATTERNS:
        m = pat.search(text)
        if m:
            return m.group(1)
    return None


def sleep_rl(min_s: float = 3.5, max_s: float = 6.5) -> None:
    """Rate-limit / add jitter. Homes.com is bot-sensitive."""
    time.sleep(random.uniform(min_s, max_s))


def run(
    regions: List[str],
    max_pages_per_city: int = 50,
    fetch_profiles: bool = False,
) -> List[Dict[str, Any]]:
    results: Dict[str, AgentRecord] = {}

    with sync_playwright() as p:
        # IMPORTANT: headless=True gets Access Denied. Use a real browser session.
        # Also: Homes.com/Akamai is sensitive to automation; using the installed Chrome
        # channel and hiding webdriver flags improves reliability.
        profile_dir = os.path.join(DATA_DIR, ".playwright-profile")
        os.makedirs(profile_dir, exist_ok=True)

        context = p.chromium.launch_persistent_context(
            user_data_dir=profile_dir,
            headless=False,
            channel="chrome",
            viewport={"width": 1280, "height": 720},
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-default-browser-check",
                "--no-first-run",
            ],
        )
        context.add_init_script(
            """
            // Basic webdriver stealth.
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
            """
        )
        page = context.new_page()

        for region in regions:
            log(f"City: {region}")
            for page_num in range(1, max_pages_per_city + 1):
                url = build_search_url(region, page=page_num)
                log(f"  Search page {page_num}: {url}")

                try:
                    page.goto(url, wait_until="domcontentloaded", timeout=60000)
                    page.wait_for_timeout(6000)
                except Exception as e:
                    log(f"    ERROR navigating: {e}")
                    break

                html = page.content()
                if "Access Denied" in html and "errors.edgesuite" in html:
                    log("    BLOCKED (Access Denied). Stopping.")
                    break

                agents = parse_agents_from_search_html(html, region)
                log(f"    Parsed agents: {len(agents)}")

                if not agents:
                    # likely end of pagination or failed load
                    break

                for a in agents:
                    results[a.page_url] = a

                sleep_rl()

            sleep_rl()

        if fetch_profiles and results:
            log(f"Fetching profiles for license numbers: {len(results)} agents")
            for i, a in enumerate(list(results.values()), start=1):
                if a.license_number:
                    continue
                if i % 50 == 0:
                    log(f"  Profile progress: {i}/{len(results)}")
                try:
                    page.goto(a.page_url, wait_until="domcontentloaded", timeout=60000)
                    page.wait_for_timeout(5000)
                    html = page.content()
                    a.license_number = parse_license_number_from_profile_html(html)
                except Exception as e:
                    log(f"  ERROR profile {a.page_url}: {e}")
                sleep_rl()

        context.close()

    return [asdict(a) for a in results.values()]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--test", action="store_true", help="Run a small test (1–2 cities).")
    ap.add_argument(
        "--max-pages-per-city",
        type=int,
        default=10,
        help="Safety cap on pagination per city (default: 10).",
    )
    ap.add_argument(
        "--fetch-profiles",
        action="store_true",
        help="Also visit each agent profile page to extract license numbers (slow).",
    )
    args = ap.parse_args()

    # reset log each run
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        f.write("")

    regions = IL_REGIONS_77
    if args.test:
        regions = ["Chicago, IL", "Naperville, IL"]

    log(f"Starting Homes.com scrape. Regions: {len(regions)}")
    log(f"max_pages_per_city={args.max_pages_per_city}, fetch_profiles={args.fetch_profiles}")

    items = run(
        regions=regions,
        max_pages_per_city=args.max_pages_per_city,
        fetch_profiles=args.fetch_profiles,
    )

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

    log(f"DONE. Wrote {len(items)} agents -> {OUT_JSON}")


if __name__ == "__main__":
    main()
