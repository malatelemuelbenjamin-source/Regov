import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeInfo, Check, ChevronRight, Info, Search, ShieldCheck, X } from "lucide-react";
import { Link, useParams } from "wouter";
import { ExplorerBreadcrumbs, ExplorerFrame, ExplorerHero, useExplorerMetadata } from "@/components/explorer/ExplorerFrame";
import PlannedLocationServices from "@/components/geography/PlannedLocationServices";
import PsgcLocationCard from "@/components/geography/PsgcLocationCard";
import PsgcSourceNotice from "@/components/geography/PsgcSourceNotice";
import { usePsgcDataset } from "@/hooks/usePsgcDataset";
import { getPsgcTrail, indexPsgcRecords, psgcCodeSearchValue, psgcLevelLabel, psgcRouteFor } from "@/data/psgcUtils";
import type { PsgcDataset, PsgcLevel, PsgcRecord } from "@/data/psgcTypes";
import regionSummaryJson from "@/data/psgc-region-summary.json";

const metadata = (regionSummaryJson as { metadata: PsgcDataset["metadata"] }).metadata;
const routeLevel: Record<string, PsgcLevel[]> = {
  region: ["Reg"], province: ["Prov"], locality: ["City", "Mun", "SubMun"], "special-area": ["SpecialGroup"], barangay: ["Bgy"],
};
const countLabels: Record<string, string> = {
  regions: "Regions", provinces: "Provinces", cities: "Cities", municipalities: "Municipalities", barangays: "Barangays",
  subMunicipalities: "Manila SubMun districts", specialGroupings: "Special groupings", componentCities: "Component cities",
  sourceAssignedCities: "Source-assigned cities", highlyUrbanizedCities: "Highly urbanized cities", independentComponentCities: "Independent component cities",
};

function findRecord(data: PsgcDataset, level: string, code: string) {
  const allowed = routeLevel[level];
  if (!allowed) return undefined;
  return [...data.regions, ...data.provinces, ...data.localities, ...data.specialGroups, ...data.barangays]
    .find((record) => record.code === code && allowed.includes(record.level));
}

function StatisticsCard({ record }: { record: PsgcRecord }) {
  const entries = Object.entries(record.counts ?? {}).filter(([key, value]) => key in countLabels && typeof value === "number");
  if (!entries.length) return null;
  return <div className="psgc-detail-counts" aria-label={`Official PSGC counts for ${record.name}`}>
    {entries.map(([key, value]) => <div key={key}><b>{value?.toLocaleString("en-PH")}</b><span>{countLabels[key]}</span></div>)}
  </div>;
}

function SectionHeading({ overline, title, description }: { overline: string; title: string; description: string }) {
  return <div className="psgc-section-heading"><div><span className="psgc-kicker">{overline}</span><h2>{title}</h2><p>{description}</p></div></div>;
}

function RecordGrid({ records, emptyText }: { records: PsgcRecord[]; emptyText: string }) {
  if (!records.length) return <p className="psgc-no-children">{emptyText}</p>;
  return <div className="psgc-location-grid">{records.map((record) => <PsgcLocationCard key={record.code} record={record} />)}</div>;
}

function sortName(record: PsgcRecord) {
  return record.name.replace(/^Barangay\s+/i, "").trim();
}

function groupLetter(record: PsgcRecord) {
  const first = sortName(record).charAt(0).toLocaleUpperCase("en-PH");
  return /^[A-Z]$/.test(first) ? first : "#";
}

function BarangayDirectory({ records }: { records: PsgcRecord[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("en-PH");
    const codeTerm = psgcCodeSearchValue(term);
    return records
      .filter((record) => !term || record.name.toLocaleLowerCase("en-PH").includes(term) || (codeTerm.length > 0 && record.code.includes(codeTerm)))
      .sort((left, right) => sortName(left).localeCompare(sortName(right), "en-PH") || left.code.localeCompare(right.code));
  }, [records, query]);
  const groups = useMemo(() => {
    const grouped = new Map<string, PsgcRecord[]>();
    filtered.forEach((record) => {
      const letter = groupLetter(record);
      grouped.set(letter, [...(grouped.get(letter) ?? []), record]);
    });
    return [...grouped.entries()].sort(([left], [right]) => left === "#" ? -1 : right === "#" ? 1 : left.localeCompare(right));
  }, [filtered]);
  const letters = groups.map(([letter]) => letter);

  return (
    <section className="psgc-barangay-directory" aria-labelledby="barangay-directory-title">
      <div className="psgc-barangay-directory__heading"><div><span className="psgc-kicker">SOURCE-VERIFIED SUBLOCALITIES</span><h2 id="barangay-directory-title">Barangay directory</h2><p>Official names are displayed as published. The A–Z index sorts using the name after the standard “Barangay” prefix.</p></div><span className="psgc-count-pill">{filtered.length.toLocaleString("en-PH")} of {records.length.toLocaleString("en-PH")}</span></div>
      <label className="psgc-searchbox psgc-searchbox--compact"><Search size={17} aria-hidden="true" /><span className="sr-only">Search barangay name or PSGC code</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a barangay by name or code…" autoComplete="off" />{query && <button type="button" className="psgc-searchbox__clear" aria-label="Clear barangay search" onClick={() => setQuery("")}><X size={16} aria-hidden="true" /></button>}</label>
      {letters.length > 0 && <nav className="psgc-letter-nav" aria-label="Jump to barangay name letter">{letters.map((letter) => <button type="button" key={letter} onClick={() => { const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; document.getElementById(`barangay-letter-${letter === "#" ? "number" : letter}`)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); }}>{letter === "#" ? "0–9" : letter}</button>)}</nav>}
      {filtered.length ? <div className="psgc-barangay-groups">{groups.map(([letter, items]) => <section id={`barangay-letter-${letter === "#" ? "number" : letter}`} key={letter} className="psgc-barangay-group" aria-labelledby={`barangay-letter-heading-${letter === "#" ? "number" : letter}`}><h3 id={`barangay-letter-heading-${letter === "#" ? "number" : letter}`}>{letter === "#" ? "0–9" : letter}</h3><ul>{items.map((record) => <li key={record.code}><Link href={psgcRouteFor(record)}><span><b>{record.name}</b><code>PSGC {record.code}</code></span><ChevronRight size={16} aria-hidden="true" /></Link></li>)}</ul></section>)}</div> : <p className="psgc-no-children">No barangay matched “{query}”. Try a different search.</p>}
    </section>
  );
}

function TrailNavigation({ record, data }: { record: PsgcRecord; data: PsgcDataset }) {
  const byCode = useMemo(() => indexPsgcRecords(data), [data]);
  const trail = getPsgcTrail(record, byCode);
  return <ExplorerBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Philippines", href: "/geography" }, ...trail.map((place, index) => index === trail.length - 1 ? { label: place.name } : { label: place.name, href: psgcRouteFor(place) })]} />;
}

export default function GeographyDetailPage() {
  const params = useParams<{ level: string; code: string }>();
  const { data, error, retry } = usePsgcDataset();
  const record = data ? findRecord(data, params.level ?? "", params.code ?? "") : undefined;
  const byCode = useMemo(() => data ? indexPsgcRecords(data) : new Map<string, PsgcRecord>(), [data]);
  useExplorerMetadata(record ? `${record.name} · PSGC ${record.code} | RECOVPH` : "Geographic place | RECOVPH", record ? `${record.name}, PSGC ${record.code}. Browse its official parent hierarchy, children, and source classification. Static geographic reference only.` : "Official Philippine Standard Geographic Code place reference from RECOVPH.");

  if (!data) return <ExplorerFrame><section className="shell psgc-detail-state" aria-live="polite"><Link className="button button--secondary" href="/geography"><ArrowLeft size={16} aria-hidden="true" />Back to Geographic Explorer</Link>{error ? <div role="alert"><h1>PSGC reference unavailable</h1><p>{error}</p><button type="button" className="button button--primary" onClick={retry}>Try again <ArrowRight size={15} aria-hidden="true" /></button></div> : <div className="psgc-loading" role="status"><span className="psgc-loading__pulse" /><b>Loading the official place hierarchy…</b></div>}</section></ExplorerFrame>;

  if (!record) return <ExplorerFrame><section className="shell psgc-detail-state"><Link className="button button--secondary" href="/geography"><ArrowLeft size={16} aria-hidden="true" />Back to Geographic Explorer</Link><div><span className="psgc-kicker">NO MATCHING SOURCE RECORD</span><h1>This PSGC code is not in the current dataset.</h1><p>Check the ten-digit code or find the place using the official-name search.</p><Link className="button button--primary" href="/geography">Open the Geographic Explorer <ArrowRight size={15} aria-hidden="true" /></Link></div></section></ExplorerFrame>;

  const parent = record.parentCode ? byCode.get(record.parentCode) : undefined;
  const trail = getPsgcTrail(record, byCode);
  const region = data.regions.find((entry) => entry.code === record.regionCode);
  const sourceName = record.sourceName && record.sourceName !== record.name ? record.sourceName : undefined;
  const readableSourceName = sourceName === `${record.name}a/` ? `${record.name} (source footnote a/)` : sourceName;
  const province = record.provinceCode ? byCode.get(record.provinceCode) : undefined;

  const isRegion = record.level === "Reg";
  const isProvince = record.level === "Prov";
  const isLocality = ["City", "Mun", "SubMun"].includes(record.level);
  const isSpecial = record.level === "SpecialGroup";
  const isBarangay = record.level === "Bgy";
  const childProvinces = isRegion ? data.provinces.filter((entry) => entry.regionCode === record.code) : [];
  const directRegionalLocalities = isRegion ? data.localities.filter((entry) => entry.parentCode === record.code && (entry.level === "City" || entry.level === "Mun")) : [];
  const childSpecialGroups = isRegion ? data.specialGroups.filter((entry) => entry.regionCode === record.code) : [];
  const childProvinceLocalities = isProvince ? data.localities.filter((entry) => entry.parentCode === record.code && (entry.level === "City" || entry.level === "Mun")) : [];
  const groupLocalities = isSpecial ? data.localities.filter((entry) => entry.parentCode === record.code) : [];
  const childSubMunicipalities = isLocality ? data.localities.filter((entry) => entry.parentCode === record.code && entry.level === "SubMun") : [];
  const barangayParents = new Set([record.code, ...childSubMunicipalities.map((entry) => entry.code)]);
  const childBarangays = (isLocality || isSpecial) ? data.barangays.filter((entry) => entry.parentCode && barangayParents.has(entry.parentCode)) : [];
  const cityParent = isBarangay && parent?.level === "SubMun" ? byCode.get(parent.parentCode ?? "") : parent;

  return (
    <ExplorerFrame>
      <section className="psgc-detail-hero shell">
        <TrailNavigation record={record} data={data} />
        <div className="psgc-detail-hero__grid">
          <div><span className="psgc-kicker">{psgcLevelLabel(record)} · OFFICIAL PSGC RECORD</span><h1>{record.name}</h1><p>Browse the official geographic hierarchy and source-published classification for this place. This page is a reference directory only.</p></div>
          <div className="psgc-code-card"><span>PSGC code</span><code>{record.code}</code><span>{record.classification ?? psgcLevelLabel(record)}</span></div>
        </div>
        {record.specialNote && <aside className="psgc-special-note"><ShieldCheck size={19} aria-hidden="true" /><p><b>Source-specific administrative note</b>{record.specialNote}</p></aside>}
        <StatisticsCard record={record} />
      </section>

      <main className="shell psgc-detail-content">
        <PsgcSourceNotice metadata={data.metadata} compact />
        <div className="psgc-detail-columns">
          <div className="psgc-detail-main">
            {(parent || region || province) && <section className="psgc-detail-section"><SectionHeading overline="OFFICIAL ADMINISTRATIVE PATH" title="Place in the hierarchy" description="The parent links below follow the Q3 2026 PSA codes and source notes." />
              <div className="psgc-parent-stack">{parent && <PsgcLocationCard record={parent} eyebrow="Direct PSGC parent" />}{province && province.code !== parent?.code && <PsgcLocationCard record={province} eyebrow="Assigned province" />}{region && region.code !== parent?.code && region.code !== province?.code && <PsgcLocationCard record={region} eyebrow="Assigned region" />}</div>
            </section>}

            {isRegion && <>
              <section className="psgc-detail-section"><SectionHeading overline="PROVINCES IN THIS REGION" title={`Explore ${record.name} provinces`} description={`${childProvinces.length} source-coded ${childProvinces.length === 1 ? "province" : "provinces"} in this region.`} /><RecordGrid records={childProvinces} emptyText="The PSA PSGC source has no province-level entries in this region. This is intentional; direct regional city or municipality entries are shown separately." /></section>
              <section className="psgc-detail-section"><SectionHeading overline="DIRECT REGIONAL PLACES" title="Cities and municipalities at region level" description="Places assigned directly to the region by the PSGC source, rather than nested in a province." /><RecordGrid records={directRegionalLocalities} emptyText="No direct region-level city or municipality entries are recorded here." /></section>
              {childSpecialGroups.length > 0 && <section className="psgc-detail-section"><SectionHeading overline="SPECIAL CODE GROUPINGS" title="Distinct source groupings" description="These records are not provinces or separate regions; their official PSGC entries are maintained as special groupings." /><RecordGrid records={childSpecialGroups} emptyText="No special groupings." /></section>}
            </>}

            {isProvince && <section className="psgc-detail-section"><SectionHeading overline="CITY AND MUNICIPALITY DIRECTORY" title={`Places assigned to ${record.name}`} description="Component cities and municipalities follow the parent assignments in the PSA source. A city’s HUC/ICC/CC marker is shown as its source classification." /><RecordGrid records={childProvinceLocalities} emptyText="No city or municipality child entries were found for this province in the source file." /></section>}

            {isSpecial && <section className="psgc-detail-section"><SectionHeading overline="CHILD SOURCE RECORDS" title="Places within this special grouping" description="The special group retains its source code and does not become a province or region." /><RecordGrid records={groupLocalities} emptyText="No child locality records are listed for this special grouping." /></section>}

            {isLocality && <>
              {childSubMunicipalities.length > 0 && <section className="psgc-detail-section"><SectionHeading overline="MANILA SUBMUNICIPALITIES" title="Municipal districts" description="The PSA workbook identifies these as SubMun/Municipal District entries, not officially recognized municipalities." /><RecordGrid records={childSubMunicipalities} emptyText="No SubMun entries are recorded." /></section>}
              {childBarangays.length > 0 && <BarangayDirectory records={childBarangays} />}
              {!childBarangays.length && !childSubMunicipalities.length && <section className="psgc-detail-section"><SectionHeading overline="BARANGAY DIRECTORY" title="No barangay entries shown" description="No child barangay codes were linked to this locality in the source hierarchy." /></section>}
            </>}

            {isBarangay && <section className="psgc-detail-section"><SectionHeading overline="PARENT LOCAL GOVERNMENT UNIT" title="Where this barangay is assigned" description="This source-derived path preserves the PSA hierarchy, including Manila municipal districts where applicable." />{cityParent && <PsgcLocationCard record={cityParent} eyebrow="Parent city or municipality" />}{parent && parent.code !== cityParent?.code && <PsgcLocationCard record={parent} eyebrow="PSGC intermediate district" />}<div className="psgc-breadcrumb-summary"><b>Full hierarchy:</b> {["Philippines", ...trail.map((place) => place.name)].join(" / ")}</div></section>}

            {record.specialNote && <section className="psgc-detail-section psgc-detail-section--note"><div className="psgc-source-qualification"><Info size={18} aria-hidden="true" /><div><b>How to read this source note</b><p>The note describes the source’s administrative coding and geographic assignment. It is not a legal opinion and is not an operational RECOVPH service statement.</p></div></div></section>}
          </div>
          <aside className="psgc-detail-aside">
            <div className="psgc-record-card">
              <span className="psgc-kicker">REFERENCE RECORD</span>
              <h2>{record.name}</h2>
              <dl>
                <div><dt>PSGC code</dt><dd><code>{record.code}</code></dd></div>
                <div><dt>Source level</dt><dd>{record.sourceLevel ?? psgcLevelLabel(record)}</dd></div>
                {record.cityClass && <div><dt>City class</dt><dd>{record.cityClass}</dd></div>}
                {record.classification && <div><dt>Classification</dt><dd>{record.classification}</dd></div>}
                {readableSourceName && <div><dt>Source name</dt><dd>{readableSourceName}</dd></div>}
                {record.oldNames && <div><dt>Recorded former name</dt><dd>{record.oldNames}</dd></div>}
                {region && <div><dt>Region</dt><dd>{region.name} <code>{region.code}</code></dd></div>}
                {province && <div><dt>{province.level === "SpecialGroup" ? "Special PSGC grouping" : "Province assignment"}</dt><dd>{province.name} <code>{province.code}</code></dd></div>}
              </dl>
              <Link className="psgc-text-link" href="/geography"><ArrowLeft size={15} aria-hidden="true" />Back to Geographic Explorer</Link>
            </div>
            <div className="psgc-reference-safety"><BadgeInfo size={18} aria-hidden="true" /><div><b>Geographic information only</b><p>This page contains official names and administrative codes—not loss reports, incident records, population counts, or proof of RECOVPH coverage.</p></div></div>
          </aside>
        </div>
        <PlannedLocationServices />
        <div className="psgc-detail-bottom"><Link className="button button--secondary" href="/geography"><ArrowLeft size={16} aria-hidden="true" />Back to Geographic Explorer</Link><p><Check size={15} aria-hidden="true" />All RECOVPH recovery services in this location are ideas for future phases and are marked Coming Soon.</p></div>
      </main>
    </ExplorerFrame>
  );
}
