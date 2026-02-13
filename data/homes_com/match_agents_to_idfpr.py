#!/usr/bin/env python3
"""Fuzzy-match Homes.com agent directory results to IDFPR broker roster.

Inputs
- data/homes_com/il_agents.json (from scrape_agents.py)
- data/idfpr/real_estate_broker_raw.json

Output
- data/homes_com/idfpr_homes_com_enrichment.json

Output format: compatible with existing `data/idfpr/broker_affiliations.json`
(with extra optional fields like phone/city/page_url).

Usage
  source .venv/bin/activate
  python data/homes_com/match_agents_to_idfpr.py --test

  python data/homes_com/match_agents_to_idfpr.py --min-score 92
"""

from __future__ import annotations

import argparse
import json
import os
import re
from collections import defaultdict
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

from rapidfuzz import fuzz

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HOMES_JSON = os.path.join(BASE_DIR, "il_agents.json")
IDFPR_JSON = os.path.join(os.path.dirname(BASE_DIR), "idfpr", "real_estate_broker_raw.json")
OUT_JSON = os.path.join(BASE_DIR, "idfpr_homes_com_enrichment.json")


def norm(s: str) -> str:
    s = s or ""
    s = s.lower().strip()
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"[^a-z0-9\s]", "", s)
    return s


def full_name_idfpr(rec: dict) -> str:
    parts = [rec.get("first_name"), rec.get("middle"), rec.get("last_name")]
    parts = [p.strip() for p in parts if p and str(p).strip()]
    return " ".join(parts)


@dataclass
class Match:
    score: float
    idfpr_license: str
    idfpr_name: str
    idfpr_city: str


def best_match(agent_name: str, city: str, idfpr_by_city: Dict[str, List[dict]]) -> Optional[Match]:
    city_key = norm(city)
    pool = idfpr_by_city.get(city_key, [])

    if not pool:
        return None

    target = norm(agent_name)
    best: Optional[Match] = None

    for rec in pool:
        cand_name = norm(full_name_idfpr(rec))
        score = fuzz.token_sort_ratio(target, cand_name)
        if (best is None) or (score > best.score):
            best = Match(
                score=score,
                idfpr_license=str(rec.get("license_number")),
                idfpr_name=full_name_idfpr(rec),
                idfpr_city=rec.get("city") or "",
            )

    return best


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--min-score", type=float, default=92.0)
    ap.add_argument("--test", action="store_true", help="Only process first 200 Homes.com agents")
    args = ap.parse_args()

    homes_agents: List[dict] = json.load(open(HOMES_JSON, "r", encoding="utf-8"))
    idfpr: List[dict] = json.load(open(IDFPR_JSON, "r", encoding="utf-8"))

    idfpr_by_city: Dict[str, List[dict]] = defaultdict(list)
    for rec in idfpr:
        idfpr_by_city[norm(rec.get("city") or "")].append(rec)

    if args.test:
        homes_agents = homes_agents[:200]

    enrichments: List[dict] = []
    misses = 0

    for a in homes_agents:
        m = best_match(a.get("agent_name") or "", a.get("city") or "", idfpr_by_city)
        if not m or m.score < args.min_score:
            misses += 1
            continue

        enrichments.append(
            {
                "license_number": m.idfpr_license,
                "agent_name": a.get("agent_name"),
                "employing_broker": a.get("brokerage"),
                "photo_url": a.get("photo_url"),
                "phone": a.get("phone"),
                "source": "homes_com",
                "page_url": a.get("page_url"),
                "match_score": m.score,
                "match_city": a.get("city"),
                "matched_name": m.idfpr_name,
            }
        )

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(enrichments, f, indent=2, ensure_ascii=False)

    print(f"Homes agents considered: {len(homes_agents)}")
    print(f"Matches written: {len(enrichments)} -> {OUT_JSON}")
    print(f"Misses (below min-score or no candidates): {misses}")


if __name__ == "__main__":
    main()
