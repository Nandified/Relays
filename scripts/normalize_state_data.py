#!/usr/bin/env python3
"""Normalize raw state license CSVs to Relays/IDFPR-compatible format.

Outputs CSVs with header:
name,license_number,type,company,city,state,zip,county,licensed_since,expires,disciplined

State inputs:
- Texas (TREC): data/texas/trec_active_brokers.csv
- California (DRE): data/california/dre_active_individuals.csv
- Florida (DBPR): data/florida/dbpr_active_licensees.csv (no header)
- New York (DOS): data/new_york/dos_all_active.csv

Run:
  python3 scripts/normalize_state_data.py
"""

from __future__ import annotations

import csv
import os
import re
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, Iterator, List, Optional, Tuple


OUT_HEADERS = [
    "name",
    "license_number",
    "type",
    "company",
    "city",
    "state",
    "zip",
    "county",
    "licensed_since",
    "expires",
    "disciplined",
]

REALTOR_TYPE = "LICENSED REAL ESTATE BROKER"


def norm_space(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip())


def safe_title(name: str) -> str:
    # Keep mostly readable; avoid lowercasing everything if already mixed.
    s = norm_space(name)
    if not s:
        return ""
    # If it's all-caps (common in exports), title-case it.
    letters = re.sub(r"[^A-Za-z]+", "", s)
    if letters and letters.upper() == letters:
        return s.title()
    return s


def fmt_date_yyyymmdd(s: str) -> str:
    s = norm_space(s)
    if not s:
        return ""
    try:
        dt = datetime.strptime(s, "%Y%m%d")
        return dt.strftime("%Y-%m-%d")
    except Exception:
        return s


def fmt_date_mdy(s: str) -> str:
    s = norm_space(s)
    if not s:
        return ""
    for fmt in ("%m/%d/%Y", "%m/%d/%y"):
        try:
            dt = datetime.strptime(s, fmt)
            return dt.strftime("%Y-%m-%d")
        except Exception:
            pass
    return s


def fmt_date_dd_mmm_yy(s: str) -> str:
    s = norm_space(s)
    if not s:
        return ""
    try:
        dt = datetime.strptime(s, "%d-%b-%y")
        return dt.strftime("%Y-%m-%d")
    except Exception:
        return s


def parse_last_comma_first(name: str) -> str:
    """"LAST, FIRST MIDDLE" -> "FIRST MIDDLE LAST""" 
    s = norm_space(name)
    if not s:
        return ""
    if "," not in s:
        return safe_title(s)
    last, rest = s.split(",", 1)
    last = norm_space(last)
    rest = norm_space(rest)
    combined = norm_space(f"{rest} {last}")
    return safe_title(combined)


def parse_last_first_no_comma(name: str) -> str:
    """"LAST FIRST" -> "FIRST LAST" (best-effort)"""
    s = norm_space(name)
    if not s:
        return ""
    parts = s.split(" ")
    if len(parts) < 2:
        return safe_title(s)
    last = parts[0]
    first_rest = " ".join(parts[1:])
    return safe_title(norm_space(f"{first_rest} {last}"))


@dataclass
class NormalizeResult:
    state_key: str
    input_path: Path
    output_path: Path
    rows_out: int


def write_normalized_csv(output_path: Path, rows: Iterable[Dict[str, str]]) -> int:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    with output_path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=OUT_HEADERS, extrasaction="ignore")
        w.writeheader()
        for row in rows:
            # Ensure all keys exist
            out_row = {k: (row.get(k) or "") for k in OUT_HEADERS}
            w.writerow(out_row)
            count += 1
    return count


def normalize_texas(input_path: Path) -> Iterator[Dict[str, str]]:
    with input_path.open(newline="", encoding="utf-8") as f:
        r = csv.DictReader(f)
        for row in r:
            status = (row.get("Status") or "").strip()
            if status not in ("Active", "Probation - Active"):
                continue

            lic_type = (row.get("License Type") or "").strip()
            if lic_type not in ("Sales Agent", "Broker"):
                continue

            license_number = norm_space(row.get("License Number") or "")
            if not license_number:
                continue

            yield {
                "name": safe_title(row.get("Full Name") or ""),
                "license_number": license_number,
                "type": REALTOR_TYPE,
                "company": safe_title(row.get("Related License Full Name") or ""),
                "city": "",
                "state": "TX",
                "zip": "",
                "county": "",
                "licensed_since": fmt_date_mdy(row.get("Original License Date") or ""),
                "expires": fmt_date_mdy(row.get("License Expiration Date") or ""),
                "disciplined": "N",
            }


def normalize_california(input_path: Path) -> Iterator[Dict[str, str]]:
    with input_path.open(newline="", encoding="utf-8") as f:
        r = csv.DictReader(f)
        for row in r:
            if (row.get("lic_status") or "").strip().lower() != "licensed":
                continue
            lic_type = (row.get("lic_type") or "").strip()
            if lic_type not in ("Salesperson", "Broker"):
                continue

            license_number = norm_space(row.get("lic_number") or "")
            if not license_number:
                continue

            first = row.get("firstname_secondary") or ""
            last = row.get("lastname_primary") or ""
            name = safe_title(norm_space(f"{first} {last}"))

            rel_first = row.get("related_firstname_secondary") or ""
            rel_last = row.get("related_lastname_primary") or ""
            company = safe_title(norm_space(f"{rel_first} {rel_last}"))

            yield {
                "name": name,
                "license_number": license_number,
                "type": REALTOR_TYPE,
                "company": company,
                "city": safe_title(row.get("city") or ""),
                "state": norm_space(row.get("state") or "CA") or "CA",
                "zip": norm_space(row.get("zip_code") or ""),
                "county": safe_title(row.get("county_name") or ""),
                "licensed_since": fmt_date_yyyymmdd(row.get("original_date_of_license") or ""),
                "expires": fmt_date_yyyymmdd(row.get("lic_expiration_date") or ""),
                "disciplined": "N",
            }


def normalize_florida(input_path: Path) -> Iterator[Dict[str, str]]:
    # No header row.
    cols = [
        "License Code",
        "Licensee Name",
        "DBA Name",
        "Rank",
        "Address 1",
        "Address 2",
        "Address 3",
        "City",
        "State",
        "Zip",
        "County Name",
        "License Number",
        "Primary Status",
        "Secondary Status",
        "Original License Date",
        "Status Effective Date",
        "License Expiration Date",
        "Alternate License Number",
        "Self Proprietor's Name",
        "Employer's Name",
        "Employer's License Number",
    ]

    realtor_ranks = {"BK Broker", "SL Sales Associate", "BL Broker Sales"}

    with input_path.open(newline="", encoding="utf-8") as f:
        r = csv.reader(f)
        for row in r:
            if not row:
                continue
            if len(row) < len(cols):
                # pad
                row = row + [""] * (len(cols) - len(row))
            d = {cols[i]: row[i] for i in range(len(cols))}

            if (d.get("Primary Status") or "").strip().lower() != "current":
                continue
            if (d.get("Secondary Status") or "").strip().lower() != "active":
                continue

            rank = (d.get("Rank") or "").strip()
            if rank not in realtor_ranks:
                continue

            license_number = norm_space(d.get("License Number") or "")
            if not license_number:
                continue

            yield {
                "name": parse_last_comma_first(d.get("Licensee Name") or ""),
                "license_number": license_number,
                "type": REALTOR_TYPE,
                "company": safe_title(d.get("Employer's Name") or ""),
                "city": safe_title(d.get("City") or ""),
                "state": norm_space(d.get("State") or "FL") or "FL",
                "zip": norm_space(d.get("Zip") or ""),
                "county": safe_title(d.get("County Name") or ""),
                "licensed_since": fmt_date_dd_mmm_yy(d.get("Original License Date") or ""),
                "expires": fmt_date_dd_mmm_yy(d.get("License Expiration Date") or ""),
                "disciplined": "N",
            }


def normalize_new_york(input_path: Path) -> Iterator[Dict[str, str]]:
    with input_path.open(newline="", encoding="utf-8") as f:
        r = csv.DictReader(f)
        for row in r:
            lic_type = (row.get("License Type") or "").strip().upper()
            if "OFFICE" in lic_type:
                continue
            # Keep to individual broker/salesperson-ish types. If unknown but not office, still include.

            license_number = norm_space(row.get("License Number") or "")
            if not license_number:
                continue

            yield {
                "name": parse_last_first_no_comma(row.get("License Holder Name") or ""),
                "license_number": license_number,
                "type": REALTOR_TYPE,
                "company": safe_title(row.get("Business Name") or ""),
                "city": safe_title(row.get("Business City") or ""),
                "state": norm_space(row.get("Business State") or "NY") or "NY",
                "zip": norm_space(row.get("Business Zip") or ""),
                "county": safe_title(row.get("County") or ""),
                "licensed_since": "",
                "expires": fmt_date_mdy(row.get("License Expiration Date") or ""),
                "disciplined": "N",
            }


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]

    jobs = [
        (
            "texas",
            repo_root / "data" / "texas" / "trec_active_brokers.csv",
            repo_root / "data" / "texas" / "normalized_brokers.csv",
            normalize_texas,
        ),
        (
            "california",
            repo_root / "data" / "california" / "dre_active_individuals.csv",
            repo_root / "data" / "california" / "normalized_brokers.csv",
            normalize_california,
        ),
        (
            "florida",
            repo_root / "data" / "florida" / "dbpr_active_licensees.csv",
            repo_root / "data" / "florida" / "normalized_brokers.csv",
            normalize_florida,
        ),
        (
            "new_york",
            repo_root / "data" / "new_york" / "dos_all_active.csv",
            repo_root / "data" / "new_york" / "normalized_brokers.csv",
            normalize_new_york,
        ),
    ]

    results: List[NormalizeResult] = []
    for state_key, in_path, out_path, fn in jobs:
        if not in_path.exists():
            raise SystemExit(f"Missing input file: {in_path}")
        rows_out = write_normalized_csv(out_path, fn(in_path))
        results.append(NormalizeResult(state_key, in_path, out_path, rows_out))

    print("Normalization complete:")
    for r in results:
        print(f"- {r.state_key}: {r.rows_out:,} -> {r.output_path.relative_to(repo_root)}")


if __name__ == "__main__":
    main()
