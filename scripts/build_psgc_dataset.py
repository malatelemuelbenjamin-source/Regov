#!/usr/bin/env python3
"""Normalize the PSA Q3 2026 PSGC workbook into static RECOVPH data.

Regenerate with:
  python3 scripts/build_psgc_dataset.py --input /path/to/PSGC-3Q-2026-Publication-Datafile.xlsx

Requires openpyxl in the local maintenance environment. This script is never run by the website.
"""

from __future__ import annotations

import argparse
import gzip
import json
import re
import sys
from collections import Counter
from pathlib import Path
from typing import Any

try:
    import openpyxl
except ImportError as error:  # maintenance environment only
    raise SystemExit("Install openpyxl in the maintenance environment before regenerating PSGC data.") from error

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = Path.home() / "Downloads/PSGC-3Q-2026-Publication-Datafile.xlsx"
FULL_OUTPUT = ROOT / "client/public/data/psgc-2026-q3.json"
GZIP_OUTPUT = ROOT / "client/public/data/psgc-2026-q3.json.gz"
SUMMARY_OUTPUT = ROOT / "client/src/data/psgc-region-summary.json"

SOURCE_URL = "https://psa.gov.ph/system/files/scd/PSGC-3Q-2026-Publication-Datafile.xlsx"
SOURCE_PAGE = "https://psa.gov.ph/classification/psgc"
RELEASE_URL = "https://psa.gov.ph/classification/psgc/node/1684084314"
PUBLICATIONS_URL = "https://psa.gov.ph/classification/psgc/barangays"
AS_OF = "2026-09-30"
PUBLISHED = "2026-10-12"
VERIFIED = "2026-11-09"

EXPECTED_LEVEL_COUNTS = {"Reg": 18, "Prov": 82, "City": 149, "Mun": 1493, "Bgy": 42010, "SubMun": 14}
EXPECTED_CITY_CLASSES = {"HUC": 33, "ICC": 5, "CC": 111}

# Display in the requested national sequence; codes/names themselves remain source-exact.
REGION_ORDER = [
    "1300000000", "1400000000", "0100000000", "0200000000", "0300000000",
    "0400000000", "1700000000", "0500000000", "0600000000", "1800000000",
    "0700000000", "0800000000", "0900000000", "1000000000", "1100000000",
    "1200000000", "1600000000", "1900000000",
]

REGION_INTRO = {
    "1300000000": "NCR has no province-level records in this PSGC release; its cities and Pateros appear directly under the region.",
    "0900000000": "The PSA places Isabela City in Region IX through a special province-code grouping, shown separately from the Province list.",
    "1900000000": "The BARMM hierarchy includes the separately coded Special Geographic Area, represented as a grouping rather than as a province.",
}

SPECIAL_GROUPS = {
    "0990100000": {
        "classification": "Special province-code grouping (not a province)",
        "note": "PSA assigns the City of Isabela to Region IX through this special province code. It is not the Province of Basilan and is not itself a city-level record.",
    },
    "1999900000": {
        "classification": "PSGC Special Geographic Area grouping",
        "note": "This coded aggregate groups eight PSA-listed municipalities and their barangays. It is not a province, city, or municipality.",
    },
}

CITY_NOTES = {
    "0431200000": "Lucena City retains its current PSGC geographic assignment to Quezon. PSA treats it as an HUC for statistical purposes, pending applicable requirements; this is not a legal ruling on HUC status.",
    "0990101000": "This City-level CC record is under Region IX’s special province-code grouping. It must not be attached to Basilan or BARMM.",
}


def clean_text(value: Any) -> str | None:
    if value is None:
        return None
    cleaned = str(value).strip()
    return cleaned or None


def psgc_code(value: Any) -> str | None:
    """Keep only numeric PSGC identifiers and preserve leading zeroes."""
    if value is None:
        return None
    raw = str(value).strip()
    if not re.fullmatch(r"\d{1,10}", raw):
        return None
    return raw.zfill(10)


def display_name(source_name: str) -> str:
    # Preserve the source value separately while removing Lucena's workbook footnote marker.
    if source_name.startswith("City of Lucena") and source_name.endswith("a/"):
        return source_name[:-2].rstrip()
    return source_name


def longest_prefix_parent(code: str, candidate_codes: set[str] | list[str]) -> str | None:
    """Choose the most-specific official code prefix, accommodating variable code widths."""
    candidates = [
        candidate
        for candidate in candidate_codes
        if candidate != code and candidate.rstrip("0") and code.startswith(candidate.rstrip("0"))
    ]
    if not candidates:
        return None
    return max(candidates, key=lambda candidate: (len(candidate.rstrip("0")), candidate))


def read_source(path: Path) -> dict[str, dict[str, Any]]:
    workbook = openpyxl.load_workbook(path, read_only=True, data_only=True)
    if "PSGC" not in workbook.sheetnames:
        raise ValueError("The workbook does not contain the expected PSGC worksheet.")
    source: dict[str, dict[str, Any]] = {}
    duplicates: list[str] = []

    for row in workbook["PSGC"].iter_rows(min_row=2, values_only=True):
        # Workbook columns begin with a blank index column, so PSGC is row[1].
        code = psgc_code(row[1] if len(row) > 1 else None)
        raw_name = clean_text(row[2] if len(row) > 2 else None)
        if not code or not raw_name:
            # Blank rows and the narrative Lucena footnote are not geographic records.
            continue
        if code in source:
            duplicates.append(code)
            continue
        normalized_name = display_name(raw_name)
        source[code] = {
            "code": code,
            "name": normalized_name,
            "sourceName": raw_name if normalized_name != raw_name else None,
            "sourceLevel": clean_text(row[4] if len(row) > 4 else None),
            "cityClass": clean_text(row[6] if len(row) > 6 else None),
            "oldNames": clean_text(row[5] if len(row) > 5 else None),
        }

    if duplicates:
        raise ValueError(f"Duplicate PSGC code(s) in source: {', '.join(duplicates[:10])}")
    return source


def build_records(source: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    region_codes = {code for code, row in source.items() if row["sourceLevel"] == "Reg"}
    province_codes = {code for code, row in source.items() if row["sourceLevel"] == "Prov"}
    city_codes = {code for code, row in source.items() if row["sourceLevel"] == "City"}
    locality_codes = {code for code, row in source.items() if row["sourceLevel"] in {"City", "Mun", "SubMun"}}
    special_group_codes = set(SPECIAL_GROUPS)
    by_code: dict[str, dict[str, Any]] = {}

    def region_parent(code: str) -> str:
        candidate = code[:2] + "00000000"
        if candidate not in region_codes:
            raise ValueError(f"No PSA Region parent for PSGC {code}; expected {candidate}.")
        return candidate

    for code, row in source.items():
        source_level = row["sourceLevel"]
        city_class = row["cityClass"]
        parent_code: str | None = None
        level: str
        classification: str | None = None
        special_note: str | None = None

        if source_level == "Reg":
            level = "Reg"
        elif source_level == "Prov":
            level = "Prov"
            parent_code = region_parent(code)
            classification = "Province"
        elif source_level == "City":
            level = "City"
            if code == "0431200000":  # PSA release note: the present assignment remains Quezon.
                parent_code = "0405600000"
                if parent_code not in province_codes or source[parent_code]["name"] != "Quezon":
                    raise ValueError("Lucena's explicit PSA-assigned Quezon parent 0405600000 is missing.")
            elif code == "0990101000":  # City of Isabela is inside its special code grouping.
                parent_code = "0990100000"
            elif city_class in {"HUC", "ICC"}:
                # Class is distinct from level: do not place HUC/ICC records under
                # a province simply because a prefix happens to match one.
                parent_code = region_parent(code)
            elif city_class == "CC":
                parent_code = longest_prefix_parent(code, province_codes)
                if parent_code is None:
                    parent_code = longest_prefix_parent(code, special_group_codes)
                if parent_code is None:
                    raise ValueError(f"No source province or special-code parent for component city {code}.")
            else:
                raise ValueError(f"Unrecognized PSA City Class for {code}: {city_class!r}")
            classification = {
                "HUC": "Highly Urbanized City (HUC)",
                "ICC": "Independent Component City (ICC)",
                "CC": "Component City (CC)",
            }[city_class]
            special_note = CITY_NOTES.get(code)
            if city_class in {"HUC", "ICC"} and special_note is None:
                special_note = "City class is preserved from the PSA workbook; this city is shown under its PSGC region parent, not reclassified as a province."
        elif source_level == "Mun":
            level = "Mun"
            parent_code = longest_prefix_parent(code, special_group_codes)
            if parent_code is None:
                parent_code = longest_prefix_parent(code, province_codes)
            if parent_code is None:
                parent_code = region_parent(code)  # Pateros is direct under NCR.
            classification = "Municipality"
        elif source_level == "SubMun":
            level = "SubMun"
            parent_code = longest_prefix_parent(code, city_codes)
            if parent_code is None:
                raise ValueError(f"No source City parent for Manila sub-municipality {code}.")
            classification = "Sub-municipality / Municipal District (not a municipality)"
        elif source_level == "Bgy":
            level = "Bgy"
            parent_code = longest_prefix_parent(code, locality_codes)
            if parent_code is None:
                raise ValueError(f"No source City, Municipality, or SubMun parent for barangay {code}.")
            classification = "Barangay"
        elif source_level is None and code in special_group_codes:
            level = "SpecialGroup"
            parent_code = region_parent(code)
            classification = SPECIAL_GROUPS[code]["classification"]
            special_note = SPECIAL_GROUPS[code]["note"]
        else:
            raise ValueError(f"Unrecognized or unsupported source row: {code} {row['name']!r} ({source_level!r})")

        if level != "Reg" and parent_code not in source:
            raise ValueError(f"Missing parent PSGC {parent_code} for {code} ({level}).")

        record: dict[str, Any] = {
            "code": code,
            "name": row["name"],
            "level": level,
            "parentCode": parent_code,
            "regionCode": None,
            "provinceCode": None,
        }
        if source_level is not None:
            record["sourceLevel"] = source_level
        if city_class is not None:
            record["cityClass"] = city_class
        if classification:
            record["classification"] = classification
        if row["sourceName"]:
            record["sourceName"] = row["sourceName"]
        if row["oldNames"]:
            record["oldNames"] = row["oldNames"]
        if special_note:
            record["specialNote"] = special_note
        by_code[code] = record

    def ancestry(record: dict[str, Any]) -> list[dict[str, Any]]:
        chain: list[dict[str, Any]] = []
        seen = {record["code"]}
        parent = record.get("parentCode")
        while parent:
            if parent in seen:
                raise ValueError(f"Parent cycle detected at PSGC {parent}.")
            seen.add(parent)
            parent_record = by_code.get(parent)
            if parent_record is None:
                raise ValueError(f"Parent code {parent} for {record['code']} is not in the dataset.")
            chain.append(parent_record)
            parent = parent_record.get("parentCode")
        return chain

    for code, record in by_code.items():
        if record["level"] == "Reg":
            record["regionCode"] = code
            continue
        chain = ancestry(record)
        region = next((item for item in chain if item["level"] == "Reg"), None)
        province = next((item for item in chain if item["level"] == "Prov"), None)
        if region is None:
            raise ValueError(f"No Region ancestor for PSGC {code}.")
        record["regionCode"] = region["code"]
        record["provinceCode"] = province["code"] if province else None
        if record["level"] == "Prov":
            record["provinceCode"] = record["code"]

    return list(by_code.values())


def add_counts(records: list[dict[str, Any]]) -> tuple[dict[str, Any], dict[str, Any]]:
    regions = [record for record in records if record["level"] == "Reg"]
    provinces = [record for record in records if record["level"] == "Prov"]
    localities = [record for record in records if record["level"] in {"City", "Mun", "SubMun"}]
    special_groups = [record for record in records if record["level"] == "SpecialGroup"]
    barangays = [record for record in records if record["level"] == "Bgy"]
    by_code = {record["code"]: record for record in records}

    level_counts = Counter(record["level"] for record in records)
    city_classes = Counter(record["cityClass"] for record in localities if record["level"] == "City")
    if {level: level_counts[level] for level in EXPECTED_LEVEL_COUNTS} != EXPECTED_LEVEL_COUNTS:
        raise ValueError(f"PSGC geographic-level totals do not match Q3 2026 expectations: {dict(level_counts)}")
    if {city_class: city_classes[city_class] for city_class in EXPECTED_CITY_CLASSES} != EXPECTED_CITY_CLASSES:
        raise ValueError(f"PSGC City Class totals do not match Q3 2026 expectations: {dict(city_classes)}")

    by_region_and_level = Counter((record["regionCode"], record["level"]) for record in records)
    by_province_and_level = Counter((record["provinceCode"], record["level"]) for record in records)
    by_province_and_city_class = Counter(
        (record["provinceCode"], record["cityClass"])
        for record in localities if record["level"] == "City"
    )
    direct_child_counts = Counter((record.get("parentCode"), record["level"]) for record in records)

    # Count all descendant barangays through the source-backed parent chain;
    # this includes Manila's children through its SubMun districts.
    descendant_barangays: Counter[str] = Counter()
    for barangay in barangays:
        parent = barangay.get("parentCode")
        seen: set[str] = set()
        while parent:
            if parent in seen or parent not in by_code:
                raise ValueError(f"Invalid parent chain from barangay {barangay['code']} at {parent}.")
            seen.add(parent)
            descendant_barangays[parent] += 1
            parent = by_code[parent].get("parentCode")

    for region in regions:
        code = region["code"]
        region["counts"] = {
            "provinces": by_region_and_level[(code, "Prov")],
            "cities": by_region_and_level[(code, "City")],
            "municipalities": by_region_and_level[(code, "Mun")],
            "barangays": by_region_and_level[(code, "Bgy")],
            "subMunicipalities": by_region_and_level[(code, "SubMun")],
            "specialGroupings": by_region_and_level[(code, "SpecialGroup")],
        }
        region["introduction"] = REGION_INTRO.get(
            code,
            "An official Philippine administrative region in the PSA’s PSGC. Browse its source-listed provinces and directly assigned locations below.",
        )

    for province in provinces:
        code = province["code"]
        province["counts"] = {
            "componentCities": by_province_and_city_class[(code, "CC")],
            "sourceAssignedCities": by_province_and_level[(code, "City")],
            "municipalities": by_province_and_level[(code, "Mun")],
            "barangays": by_province_and_level[(code, "Bgy")],
        }

    for record in localities + special_groups:
        code = record["code"]
        record["counts"] = {
            "barangays": descendant_barangays[code],
            "municipalities": direct_child_counts[(code, "Mun")],
            "cities": direct_child_counts[(code, "City")],
            "subMunicipalities": direct_child_counts[(code, "SubMun")],
        }

    # Ensure parent-derived region totals reconcile exactly with official level counts.
    for level, expected in EXPECTED_LEVEL_COUNTS.items():
        if level == "Reg":
            total = len(regions)
        else:
            total = sum(by_region_and_level[(region["code"], level)] for region in regions)
        if total != expected:
            raise ValueError(f"Region aggregate for {level} is {total}, expected {expected}.")

    counts = {
        "regions": len(regions),
        "provinces": len(provinces),
        "cities": level_counts["City"],
        "highlyUrbanizedCities": city_classes["HUC"],
        "independentComponentCities": city_classes["ICC"],
        "componentCities": city_classes["CC"],
        "municipalities": level_counts["Mun"],
        "barangays": len(barangays),
        "manilaSubMunicipalities": level_counts["SubMun"],
        "specialGroupings": len(special_groups),
    }
    metadata = {
        "dataset": "Philippine Standard Geographic Code (PSGC)",
        "edition": "Third Quarter 2026",
        "asOf": AS_OF,
        "published": PUBLISHED,
        "lastVerified": VERIFIED,
        "sourceWorkbookName": "PSGC-3Q-2026-Publication-Datafile.xlsx",
        "sourceWorkbookUrl": SOURCE_URL,
        "sourcePageUrl": SOURCE_PAGE,
        "releaseNotesUrl": RELEASE_URL,
        "publicationsPageUrl": PUBLICATIONS_URL,
        "codeFormat": "PSGC codes are 10-character numeric identifiers stored as strings; leading zeroes are significant.",
        "scopeNote": "Counts describe PSA source-level rows, not RECOVPH operations. Special grouping records and Manila SubMun records are reported separately from province, city, municipality, and barangay totals.",
        "counts": counts,
    }

    region_order = {code: index for index, code in enumerate(REGION_ORDER)}
    regions.sort(key=lambda record: region_order.get(record["code"], len(region_order)))
    provinces.sort(key=lambda record: (record["regionCode"], record["name"].casefold(), record["code"]))
    localities.sort(key=lambda record: (record["name"].casefold(), record["code"]))
    special_groups.sort(key=lambda record: record["code"])
    barangays.sort(key=lambda record: (record["name"].casefold(), record["code"]))

    full = {
        "metadata": metadata,
        "country": {"name": "Philippines", "code": None, "note": "Display-only root; the PSGC workbook does not assign a country-level geographic record."},
        "regions": regions,
        "provinces": provinces,
        "localities": localities,
        "specialGroups": special_groups,
        "barangays": barangays,
    }
    summary = {
        "metadata": metadata,
        "regions": [
            {"code": region["code"], "name": region["name"], "introduction": region["introduction"], "counts": region["counts"]}
            for region in regions
        ],
    }
    return full, summary


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT, help="Official PSA Q3 2026 workbook")
    args = parser.parse_args()
    input_path = args.input.expanduser().resolve()
    if not input_path.exists():
        parser.error(f"PSA workbook not found: {input_path}")

    source = read_source(input_path)
    expected_named_rows = sum(EXPECTED_LEVEL_COUNTS.values()) + len(SPECIAL_GROUPS)
    if len(source) != expected_named_rows:
        raise ValueError(f"Found {len(source)} numeric-code/name records; expected {expected_named_rows}.")
    records = build_records(source)
    full, summary = add_counts(records)
    FULL_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    SUMMARY_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    payload = (json.dumps(full, ensure_ascii=False, separators=(",", ":")) + "\n").encode("utf-8")
    FULL_OUTPUT.write_bytes(payload)
    GZIP_OUTPUT.write_bytes(gzip.compress(payload, compresslevel=9, mtime=0))
    SUMMARY_OUTPUT.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {FULL_OUTPUT} ({FULL_OUTPUT.stat().st_size:,} bytes)")
    print(f"Wrote {GZIP_OUTPUT} ({GZIP_OUTPUT.stat().st_size:,} bytes)")
    print(f"Wrote {SUMMARY_OUTPUT} ({SUMMARY_OUTPUT.stat().st_size:,} bytes)")
    print("Verified source counts:", json.dumps(full["metadata"]["counts"], ensure_ascii=False))
    print("Region totals:", json.dumps({region["name"]: region["counts"] for region in full["regions"]}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
