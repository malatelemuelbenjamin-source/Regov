import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { CategoryFilters, EmptyResults, ResultSummary, SearchField } from "@/components/explorer/ExplorerControls";
import { DirectoryCatalogCard } from "@/components/explorer/CatalogCards";
import { ExplorerFrame, ExplorerHero, PlannedNotice, useExplorerMetadata } from "@/components/explorer/ExplorerFrame";
import {
  directoryCategoryDescriptions,
  directoryExplorerCategories,
  directoryExplorerItems,
  directoryMatchesSearch,
  usedDirectoryExplorerCategories,
  type DirectoryCategoryFilter,
} from "@/data/explorerContent";

const directoryFilters: DirectoryCategoryFilter[] = ["All Categories", ...directoryExplorerCategories];

export default function DirectoryExplorerPage() {
  useExplorerMetadata("Explore the RECOVPH Recovery Network | RECOVPH", "Browse RECOVPH’s 24 planned informational directory topics across 13 categories. No lost-and-found reports or submissions are available.");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<DirectoryCategoryFilter>("All Categories");
  const trimmedSearch = search.trim().toLowerCase();
  const visibleDirectories = useMemo(() => directoryExplorerItems.filter((item) => {
    const matchesCategory = activeCategory === "All Categories" || item.explorerCategory === activeCategory;
    return matchesCategory && (!trimmedSearch || directoryMatchesSearch(item, trimmedSearch));
  }), [activeCategory, trimmedSearch]);

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("All Categories");
  };
  const countFor = (category: string) => category === "All Categories"
    ? directoryExplorerItems.length
    : directoryExplorerItems.filter((item) => item.explorerCategory === category).length;
  const categoryDescription = activeCategory === "All Categories"
    ? `Browse the ${directoryExplorerItems.length} planned informational topics currently listed across ${usedDirectoryExplorerCategories.length} categories.`
    : directoryCategoryDescriptions[activeCategory];

  return (
    <ExplorerFrame>
      <ExplorerHero
        eyebrow="Planned recovery information"
        title="Explore the RECOVPH Recovery Network"
        subtitle="Discover the planned services and recovery categories designed to help Filipinos nationwide."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Directory Explorer" }]}
      />
      <section className="explorer-content shell" aria-labelledby="directory-explorer-heading">
        <div className="explorer-stat-line">
          <div><b>{directoryExplorerItems.length}</b><span>planned directory topics</span></div>
          <span className="explorer-stat-line__divider" aria-hidden="true" />
          <div><b>{usedDirectoryExplorerCategories.length}</b><span>informational categories</span></div>
          <span className="explorer-stat-line__note">Counts reflect this static website catalog only — not reports or active cases.</span>
        </div>

        <div className="explorer-control-card">
          <SearchField
            id="directory-search"
            label="Search directory information"
            value={search}
            onChange={setSearch}
            placeholder="Try wallet, cellphone, national ID, passport, dog, motorcycle…"
          />
          <p className="explorer-search-helper">Search directory names, item types, categories, descriptions, and topic keywords. This does not search lost-and-found reports.</p>
          <CategoryFilters
            label="Filter directory topics by category"
            options={directoryFilters}
            active={activeCategory}
            onChange={(value) => setActiveCategory(value as DirectoryCategoryFilter)}
            countFor={countFor}
          />
          <div className="explorer-category-description">
            <div><span className="explorer-control-label">{activeCategory === "All Categories" ? "About this catalog" : activeCategory}</span><p>{categoryDescription}</p></div>
            <button className="explorer-clear-inline" type="button" onClick={resetFilters} disabled={!search && activeCategory === "All Categories"}>Clear filters</button>
          </div>
        </div>

        <div className="explorer-results-heading">
          <div><h2 id="directory-explorer-heading">Planned directory topics</h2><p>Every topic is informational and marked for a future phase.</p></div>
          <ResultSummary>{`Showing ${visibleDirectories.length} of ${directoryExplorerItems.length} informational topics`}</ResultSummary>
        </div>

        {visibleDirectories.length > 0 ? (
          <div className="catalog-grid catalog-grid--directories">
            {visibleDirectories.map((item, index) => <DirectoryCatalogCard key={item.slug} item={item} index={index} />)}
          </div>
        ) : (
          <EmptyResults
            title="No directory topics match that search."
            description="Try a different keyword or clear the category and search filters. This search only covers RECOVPH information, not actual lost-and-found submissions."
            onClear={resetFilters}
          />
        )}

        <PlannedNotice>
          RECOVPH is under development. No reports, live matches, listings, or recovery submissions are available through this explorer.
        </PlannedNotice>
        <div className="explorer-crosslink">
          <div><span className="explorer-control-label">Explore the wider vision</span><h2>See what RECOVPH may build next.</h2></div>
          <Link className="button button--primary" href="/features">Explore RECOVPH Innovations <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    </ExplorerFrame>
  );
}
