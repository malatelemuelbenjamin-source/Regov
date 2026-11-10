import { Search, X } from "lucide-react";

type SearchFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export function SearchField({ id, label, value, onChange, placeholder }: SearchFieldProps) {
  return (
    <div className="explorer-search-field">
      <label htmlFor={id}>{label}</label>
      <div className="explorer-search-field__control">
        <Search size={20} aria-hidden="true" />
        <input id={id} type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete="off" />
        <button type="button" onClick={() => onChange("")} aria-label={`Clear ${label.toLowerCase()}`} disabled={!value}>
          <X size={15} aria-hidden="true" /><span>Clear search</span>
        </button>
      </div>
    </div>
  );
}

export function CategoryFilters({
  label,
  options,
  active,
  onChange,
  countFor,
}: {
  label: string;
  options: readonly string[];
  active: string;
  onChange: (value: string) => void;
  countFor?: (value: string) => number | undefined;
}) {
  return (
    <div className="explorer-filter-section">
      <span className="explorer-control-label">Browse by category</span>
      <div className="explorer-filter-row" role="group" aria-label={label}>
        {options.map((option) => {
          const count = countFor?.(option);
          return (
            <button key={option} type="button" className={`explorer-filter ${active === option ? "is-active" : ""}`} aria-pressed={active === option} onClick={() => onChange(option)}>
              <span>{option}</span>{count !== undefined && <span className="explorer-filter__count" aria-label={`${count} directories`}>{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ResultSummary({ children }: { children: string }) {
  return <p className="explorer-result-summary" aria-live="polite">{children}</p>;
}

export function EmptyResults({
  title,
  description,
  onClear,
}: {
  title: string;
  description: string;
  onClear: () => void;
}) {
  return (
    <div className="explorer-empty" role="status">
      <span className="explorer-empty__icon"><Search size={22} aria-hidden="true" /></span>
      <h2>{title}</h2>
      <p>{description}</p>
      <button className="button button--secondary explorer-clear-filters" type="button" onClick={onClear}>Clear filters</button>
    </div>
  );
}
