import { useDeferredValue, useMemo, useState } from "react";
import { ArrowRight, BadgeInfo, ChevronDown, FileSearch, MapPinned, Search, X } from "lucide-react";
import { Link } from "wouter";
import { ExplorerFrame, ExplorerHero, useExplorerMetadata } from "@/components/explorer/ExplorerFrame";
import PsgcLocationCard from "@/components/geography/PsgcLocationCard";
import PsgcSourceNotice from "@/components/geography/PsgcSourceNotice";
import { usePsgcDataset } from "@/hooks/usePsgcDataset";
import { getPsgcTrail, indexPsgcRecords, psgcCodeSearchValue, psgcLevelLabel, psgcRouteFor, psgcSearchAliases } from "@/data/psgcUtils";
import type { PsgcRecord, PsgcRegionSummaryFile } from "@/data/psgcTypes";
import regionSummaryJson from "@/data/psgc-region-summary.json";

const summary = regionSummaryJson as unknown as PsgcRegionSummaryFile;
const levels: [keyof PsgcRegionSummaryFile["metadata"]["counts"], string][] = [
  ["regions", "Regions"], ["provinces", "Provinces"], ["cities", "Cities"], ["municipalities", "Municipalities"], ["barangays", "Barangays"],
];

function normalize(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en-PH").trim();
}

function recordRank(record: PsgcRecord, query: string, codeQuery: string) {
  const names = [record.name, ...psgcSearchAliases(record)].map(normalize);
  if (names.includes(query)) return 0;
  if (codeQuery && record.code === codeQuery) return 1;
  if (names.some((name) => name.startsWith(query))) return 2;
  if (codeQuery && record.code.startsWith(codeQuery)) {
    const parentFirstOrder: Record<string, number> = { Reg: 0, Prov: 1, SpecialGroup: 2, City: 3, Mun: 3, SubMun: 4, Bgy: 5 };
    return 3 + (parentFirstOrder[record.level] ?? 6);
  }
  if (names.some((name) => name.includes(query))) return 10;
  if (normalize(record.oldNames ?? "").includes(query)) return 11;
  return codeQuery && record.code.includes(codeQuery) ? 12 : 20;
}

function GeographicSearch({ data }: { data: NonNullable<ReturnType<typeof usePsgcDataset>["data"]> }) {
  const [query, setQuery] = useState("");
  const [regionCode, setRegionCode] = useState("");
  const [provinceCode, setProvinceCode] = useState("");
  const [localityCode, setLocalityCode] = useState("");
  const [subMunicipalityCode, setSubMunicipalityCode] = useState("");
  const [barangayCode, setBarangayCode] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalize(deferredQuery);
  const numericCodeQuery = psgcCodeSearchValue(deferredQuery);
  const byCode = useMemo(() => indexPsgcRecords(data), [data]);
  const allRecords = useMemo(() => [...data.regions, ...data.provinces, ...data.localities, ...data.specialGroups, ...data.barangays], [data]);
  const searchResultSet = useMemo(() => {
    if (!normalizedQuery) return { records: [] as PsgcRecord[], total: 0 };
    const matches = allRecords
      .filter((record) => [record.name, ...psgcSearchAliases(record)].some((name) => normalize(name).includes(normalizedQuery)) || (numericCodeQuery.length > 0 && record.code.includes(numericCodeQuery)) || normalize(record.oldNames ?? "").includes(normalizedQuery))
      .sort((left, right) => recordRank(left, normalizedQuery, numericCodeQuery) - recordRank(right, normalizedQuery, numericCodeQuery) || left.name.localeCompare(right.name, "en-PH") || left.code.localeCompare(right.code));
    return { records: matches.slice(0, 36), total: matches.length };
  }, [allRecords, normalizedQuery, numericCodeQuery]);
  const results = searchResultSet.records;
  const matchingCount = searchResultSet.total;
  const provinces = data.provinces.filter((record) => !regionCode || record.regionCode === regionCode);
  const localities = data.localities.filter((record) => (record.level === "City" || record.level === "Mun") && (!regionCode || record.regionCode === regionCode) && (!provinceCode || record.provinceCode === provinceCode));
  const selectedLocation = localities.find((record) => record.code === localityCode);
  const selectedRegion = data.regions.find((record) => record.code === regionCode);
  const subMunicipalities = useMemo(() => selectedLocation?.level === "City" ? data.localities.filter((record) => record.level === "SubMun" && record.parentCode === selectedLocation.code) : [], [data.localities, selectedLocation]);
  const selectedSubMunicipality = subMunicipalities.find((record) => record.code === subMunicipalityCode);
  const barangays = useMemo(() => {
    if (!selectedLocation) return [];
    const parentCodes = new Set([selectedLocation.code, ...subMunicipalities.map((record) => record.code)]);
    return data.barangays
      .filter((record) => record.parentCode && parentCodes.has(record.parentCode) && (!subMunicipalityCode || record.parentCode === subMunicipalityCode))
      .sort((left, right) => left.name.localeCompare(right.name, "en-PH") || left.code.localeCompare(right.code));
  }, [data.barangays, selectedLocation, subMunicipalities, subMunicipalityCode]);
  const selectedBarangay = barangays.find((record) => record.code === barangayCode);
  const selectedPlace = selectedBarangay ?? selectedSubMunicipality ?? selectedLocation;

  return (
    <section className="psgc-search-panel" aria-labelledby="psgc-search-title">
      <div className="psgc-search-panel__heading">
        <span className="psgc-search-panel__icon"><FileSearch size={20} aria-hidden="true" /></span>
        <div><span className="psgc-kicker">LOOK UP AN OFFICIAL PLACE</span><h2 id="psgc-search-title">Search names or PSGC codes</h2><p>Search across regions, provinces, cities, municipalities, Manila districts, special groupings, and barangays.</p></div>
      </div>
      <label className="psgc-searchbox">
        <Search size={19} aria-hidden="true" />
        <span className="sr-only">Search official geographic names or PSGC code</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Lucena City, Pateros, Barangay, or a PSGC code…" autoComplete="off" />
        {query && <button type="button" className="psgc-searchbox__clear" onClick={() => setQuery("")} aria-label="Clear location search"><X size={17} aria-hidden="true" /></button>}
      </label>
      <p className="psgc-search-note">Search uses official PSGC names, familiar city-name variants, recorded old names, and codes. Results keep the official source name and are not lost-and-found reports.</p>

      <div className="psgc-selector" aria-label="Browse the administrative hierarchy">
        <label><span>1. Region</span><span className="psgc-select-wrap"><select value={regionCode} onChange={(event) => { setRegionCode(event.target.value); setProvinceCode(""); setLocalityCode(""); setSubMunicipalityCode(""); setBarangayCode(""); }}><option value="">Choose a region</option>{data.regions.map((region) => <option key={region.code} value={region.code}>{region.name}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></span></label>
        <label><span>2. Province <small>(where applicable)</small></span><span className="psgc-select-wrap"><select value={provinceCode} disabled={!regionCode || provinces.length === 0} onChange={(event) => { setProvinceCode(event.target.value); setLocalityCode(""); setSubMunicipalityCode(""); setBarangayCode(""); }}><option value="">{!regionCode ? "Choose a region first" : provinces.length ? "All provinces in region" : "No province tier in this region"}</option>{provinces.map((province) => <option key={province.code} value={province.code}>{province.name}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></span></label>
        <label><span>3. City or municipality</span><span className="psgc-select-wrap"><select value={localityCode} disabled={!regionCode} onChange={(event) => { setLocalityCode(event.target.value); setSubMunicipalityCode(""); setBarangayCode(""); }}><option value="">{regionCode ? "Choose a city or municipality" : "Choose a region first"}</option>{localities.map((locality) => { const sourceParent = locality.parentCode ? byCode.get(locality.parentCode) : undefined; const assignedProvince = locality.provinceCode ? byCode.get(locality.provinceCode) : undefined; const parentName = assignedProvince?.name ?? (sourceParent?.level === "SpecialGroup" ? sourceParent.name : selectedRegion?.name); return <option key={locality.code} value={locality.code}>{locality.name} · {locality.cityClass ?? (locality.level === "Mun" ? "Municipality" : "City")} · {parentName}</option>; })}</select><ChevronDown size={16} aria-hidden="true" /></span></label>
        {subMunicipalities.length > 0 && <label><span>4. Manila district <small>(optional)</small></span><span className="psgc-select-wrap"><select value={subMunicipalityCode} onChange={(event) => { setSubMunicipalityCode(event.target.value); setBarangayCode(""); }}><option value="">All districts of {selectedLocation?.name}</option>{subMunicipalities.map((district) => <option key={district.code} value={district.code}>{district.name}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></span></label>}
        <label><span>{subMunicipalities.length > 0 ? "5." : "4."} Barangay</span><span className="psgc-select-wrap"><select value={barangayCode} disabled={!selectedLocation || barangays.length === 0} onChange={(event) => setBarangayCode(event.target.value)}><option value="">{!selectedLocation ? "Choose a city or municipality first" : barangays.length ? "Choose a barangay" : "No source-linked barangays"}</option>{barangays.map((barangay) => <option key={barangay.code} value={barangay.code}>{barangay.name} · {barangay.code}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></span></label>
        {selectedPlace && <Link className="button button--primary psgc-selector__open" href={psgcRouteFor(selectedPlace)}>Open selected place <ArrowRight size={16} aria-hidden="true" /></Link>}
      </div>

      {normalizedQuery && (
        <div className="psgc-search-results" aria-live="polite">
          <div className="psgc-search-results__heading"><h3>Matching official places</h3><span>{matchingCount.toLocaleString("en-PH")} {matchingCount === 1 ? "match" : "matches"}{matchingCount > results.length ? ` · showing ${results.length}` : ""}</span></div>
          {results.length ? <ul>{results.map((record) => {
            const trail = getPsgcTrail(record, byCode);
            return <li key={record.code}><Link href={psgcRouteFor(record)}><span className="psgc-result__kind">{psgcLevelLabel(record)}</span><b>{record.name}</b><small>{["Philippines", ...trail.map((place) => place.name)].join(" / ")}</small><code>PSGC {record.code}</code><ArrowRight size={15} aria-hidden="true" /></Link></li>;
          })}</ul> : <div className="psgc-empty-results"><Search size={21} aria-hidden="true" /><p>No official PSGC place matched “{query}”. Try a different name or code.</p></div>}
        </div>
      )}
    </section>
  );
}

function RegionSummaryCard({ region, index }: { region: PsgcRegionSummaryFile["regions"][number]; index: number }) {
  return (
    <article className="psgc-region-card">
      <div className="psgc-region-card__top"><span className="psgc-region-card__mark">{String(index + 1).padStart(2, "0")}</span><code>{region.code}</code></div>
      <h3>{region.name}</h3>
      <p>{region.introduction}</p>
      <div className="psgc-region-stats" aria-label={`${region.name} official PSGC counts`}>
        <span><b>{region.counts.provinces.toLocaleString("en-PH")}</b><small>provinces</small></span>
        <span><b>{region.counts.cities.toLocaleString("en-PH")}</b><small>cities</small></span>
        <span><b>{region.counts.municipalities.toLocaleString("en-PH")}</b><small>municipalities</small></span>
        <span><b>{region.counts.barangays.toLocaleString("en-PH")}</b><small>barangays</small></span>
      </div>
      <Link className="psgc-region-card__link" href={`/geography/region/${region.code}`}>Explore this region <ArrowRight size={15} aria-hidden="true" /></Link>
    </article>
  );
}

export default function GeographyExplorerPage() {
  const { data, error, retry } = usePsgcDataset();
  useExplorerMetadata(
    "Explore Philippine PSGC Geography | RECOVPH",
    "Browse the Philippine Statistics Authority's Q3 2026 Philippine Standard Geographic Code hierarchy, from 18 regions and provinces to cities, municipalities, and barangays.",
  );

  return (
    <ExplorerFrame>
      <ExplorerHero
        eyebrow="Official geographic reference · PSGC Q3 2026"
        title="Explore the Philippines"
        subtitle="Move from region to province, city or municipality, and barangay using official PSA names and ten-digit PSGC codes."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Geographic Explorer" }]}
        comingSoon={false}
      />
      <section className="psgc-page shell" aria-labelledby="psgc-page-title">
        <div className="psgc-intro-row">
          <div><span className="psgc-kicker">THE PHILIPPINE STANDARD GEOGRAPHIC CODE</span><h2 id="psgc-page-title">A reference from the national level down to local communities.</h2><p>Explore the official geographic hierarchy and verify each place against the PSA’s downloadable source file. The map is an archipelago illustration; region exploration is through the accurate selector and source-backed cards below, not drawn boundary shapes.</p></div>
          <figure className="psgc-map-figure"><img src="/philippines-map.svg" alt="Illustrative outline of the Philippine archipelago; it does not show administrative region boundaries" loading="lazy" /><figcaption><MapPinned size={14} aria-hidden="true" /> Archipelago outline only · no region boundaries implied</figcaption></figure>
        </div>
        <PsgcSourceNotice metadata={summary.metadata} />

        <div className="psgc-stat-row" aria-label="Official PSGC source-level totals">
          {levels.map(([key, label]) => <div className="psgc-stat" key={key}><b>{summary.metadata.counts[key].toLocaleString("en-PH")}</b><span>{label}</span></div>)}
        </div>
        <p className="psgc-stat-caveat"><BadgeInfo size={15} aria-hidden="true" /> PSGC source-level reference totals only. These do not represent RECOVPH coverage, cases, users, partners, or service activity.</p>

        {!data && !error && <div className="psgc-loading" role="status"><span className="psgc-loading__pulse" /><div><b>Loading the official hierarchy</b><span>A compact, read-only PSGC reference is being prepared in your browser.</span></div></div>}
        {error && <div className="psgc-load-error" role="alert"><p>{error}</p><button className="button button--secondary" type="button" onClick={retry}>Try again <ArrowRight size={15} aria-hidden="true" /></button></div>}
        {data && <GeographicSearch data={data} />}

        <section className="psgc-regions-section" aria-labelledby="psgc-regions-title">
          <div className="psgc-section-heading"><div><span className="psgc-kicker">18 PSA-CODED REGIONS</span><h2 id="psgc-regions-title">Choose a region to explore</h2><p>Region descriptions and counts are derived from the selected official source edition.</p></div><Link className="psgc-text-link" href="/#coverage">View the RECOVPH coverage plan <ArrowRight size={15} aria-hidden="true" /></Link></div>
          <div className="psgc-region-grid">{summary.regions.map((region, index) => <RegionSummaryCard key={region.code} region={region} index={index} />)}</div>
        </section>

        {data && <section className="psgc-special-section" aria-labelledby="psgc-special-title">
          <div className="psgc-section-heading"><div><span className="psgc-kicker">SOURCE-CODED SPECIAL GROUPINGS</span><h2 id="psgc-special-title">Administrative notes that matter</h2><p>These source records are shown separately from the official province and city totals.</p></div></div>
          <div className="psgc-special-grid">{data.specialGroups.map((record) => <PsgcLocationCard key={record.code} record={record} eyebrow="Special PSGC grouping" supportingText={record.specialNote} />)}</div>
          <div className="psgc-notes-grid">
            <article><span>01</span><h3>Lucena City and Quezon</h3><p>Lucena City (0431200000) retains its Q3 2026 PSGC assignment to Quezon (0405600000) while carrying the HUC statistical classification. PSA notes this is not a legal ruling on the city’s status.</p></article>
            <article><span>02</span><h3>Isabela City</h3><p>The special code grouping is not a province. The City of Isabela entry is kept under Region IX’s special grouping, not attached to Basilan or BARMM.</p></article>
            <article><span>03</span><h3>Manila districts</h3><p>The PSA workbook lists 14 SubMun municipal districts. They are shown as a distinct level and are not counted as municipalities.</p></article>
            <article><span>04</span><h3>City classes</h3><p>HUC, ICC, and CC are preserved as PSA city classifications. The classification label does not replace the source’s geographic parent assignment.</p></article>
          </div>
        </section>}

        <section className="psgc-hierarchy-note" aria-label="Hierarchy guide"><span className="psgc-hierarchy-note__icon"><BadgeInfo size={20} aria-hidden="true" /></span><div><h2>How to read the hierarchy</h2><p>Philippines → Region → Province (where applicable) → City or Municipality → Barangay. Manila’s SubMun districts and PSA-coded special groupings are identified separately where they occur. PSGC codes remain strings so their leading zeroes are retained.</p></div><a href={summary.metadata.sourcePageUrl} target="_blank" rel="noreferrer">PSA PSGC page <ArrowRight size={15} aria-hidden="true" /></a></section>
      </section>
    </ExplorerFrame>
  );
}
