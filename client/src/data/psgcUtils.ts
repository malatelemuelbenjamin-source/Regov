import type { PsgcDataset, PsgcRecord } from "@/data/psgcTypes";

export function psgcLevelLabel(record: PsgcRecord): string {
  if (record.level === "Reg") return "Region";
  if (record.level === "Prov") return "Province";
  if (record.level === "City") return record.cityClass ? `${record.cityClass} city` : "City";
  if (record.level === "Mun") return "Municipality";
  if (record.level === "SubMun") return "Municipal District";
  if (record.level === "Bgy") return "Barangay";
  return "Special geographic grouping";
}

export function psgcRouteFor(record: PsgcRecord): string {
  const code = encodeURIComponent(record.code);
  if (record.level === "Reg") return `/geography/region/${code}`;
  if (record.level === "Prov") return `/geography/province/${code}`;
  if (record.level === "City" || record.level === "Mun" || record.level === "SubMun") return `/geography/locality/${code}`;
  if (record.level === "Bgy") return `/geography/barangay/${code}`;
  return `/geography/special-area/${code}`;
}

export function indexPsgcRecords(data: PsgcDataset): Map<string, PsgcRecord> {
  return new Map([
    ...data.regions,
    ...data.provinces,
    ...data.localities,
    ...data.specialGroups,
    ...data.barangays,
  ].map((record) => [record.code, record]));
}

export function getPsgcTrail(record: PsgcRecord, byCode: Map<string, PsgcRecord>): PsgcRecord[] {
  const trail = [record];
  let current: PsgcRecord | undefined = record;
  const seen = new Set([record.code]);
  while (current?.parentCode) {
    if (seen.has(current.parentCode)) break;
    seen.add(current.parentCode);
    current = byCode.get(current.parentCode);
    if (!current) break;
    trail.push(current);
  }
  return trail.reverse();
}

export function formatPsgcDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-PH", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
}

export function psgcCodeSearchValue(query: string): string {
  const value = query.trim();
  if (!/^(?:PSGC\s*)?[\d\s-]+$/i.test(value)) return "";
  const digits = value.replace(/\D/g, "");
  return digits.length >= 2 && digits.length <= 10 ? digits : "";
}

export function psgcSearchAliases(record: PsgcRecord): string[] {
  if (record.level !== "City") return [];
  const match = record.name.match(/^City of (.+)$/i);
  return match ? [`${match[1]} City`] : [];
}
