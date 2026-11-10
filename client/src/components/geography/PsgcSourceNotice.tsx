import type { PsgcMetadata } from "@/data/psgcTypes";
import { formatPsgcDate } from "@/data/psgcUtils";

export default function PsgcSourceNotice({ metadata, compact = false }: { metadata: PsgcMetadata; compact?: boolean }) {
  return (
    <aside className={`psgc-source ${compact ? "psgc-source--compact" : ""}`} aria-label="PSGC data source and version">
      <div className="psgc-source__mark" aria-hidden="true">PSA</div>
      <div className="psgc-source__copy">
        <p className="psgc-source__title">Official source: {metadata.edition} PSGC</p>
        <p className="psgc-source__dates">
          Data as of {formatPsgcDate(metadata.asOf)} · Released {formatPsgcDate(metadata.published)} · Last checked {formatPsgcDate(metadata.lastVerified)}.
        </p>
        <p className="psgc-source__links">
          <a href={metadata.sourceWorkbookUrl} target="_blank" rel="noreferrer">PSA masterlist workbook</a>
          <a href={metadata.releaseNotesUrl} target="_blank" rel="noreferrer">PSA release notes</a>
        </p>
        {!compact && <p className="psgc-source__scope">These names, codes, and counts describe the published PSGC hierarchy only. They do not indicate RECOVPH service coverage or activity.</p>}
      </div>
    </aside>
  );
}
