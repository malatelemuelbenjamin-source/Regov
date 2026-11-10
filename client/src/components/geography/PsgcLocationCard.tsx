import { ArrowUpRight, Building2, Grid2X2, Map, MapPin, Network } from "lucide-react";
import { Link } from "wouter";
import type { PsgcRecord } from "@/data/psgcTypes";
import { psgcLevelLabel, psgcRouteFor } from "@/data/psgcUtils";

const icons = { Reg: Map, Prov: MapPin, City: Building2, Mun: Building2, SubMun: Network, SpecialGroup: Network, Bgy: Grid2X2 };

export default function PsgcLocationCard({ record, eyebrow, supportingText }: { record: PsgcRecord; eyebrow?: string; supportingText?: string }) {
  const Icon = icons[record.level];
  const childCount = record.counts?.barangays;
  return (
    <Link href={psgcRouteFor(record)} className="psgc-location-card">
      <span className="psgc-location-card__icon"><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></span>
      <div className="psgc-location-card__body">
        <span className="psgc-location-card__eyebrow">{eyebrow ?? psgcLevelLabel(record)}</span>
        <h3>{record.name}</h3>
        {supportingText && <p>{supportingText}</p>}
        {record.classification && !supportingText && <p>{record.classification}</p>}
        <span className="psgc-location-card__code">PSGC {record.code}</span>
        {typeof childCount === "number" && record.level !== "Bgy" && (
          <span className="psgc-location-card__count">{childCount.toLocaleString("en-PH")} barangays in this hierarchy</span>
        )}
      </div>
      <ArrowUpRight size={17} className="psgc-location-card__arrow" aria-hidden="true" />
    </Link>
  );
}
