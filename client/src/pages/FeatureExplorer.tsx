import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { CategoryFilters, EmptyResults, ResultSummary, SearchField } from "@/components/explorer/ExplorerControls";
import { FeatureCatalogCard } from "@/components/explorer/CatalogCards";
import { ExplorerFrame, ExplorerHero, PlannedNotice, useExplorerMetadata } from "@/components/explorer/ExplorerFrame";
import {
  featureCategoryDescriptions,
  featureExplorerCategories,
  featureExplorerItems,
  featureSearchText,
  usedFeatureExplorerCategories,
  type FeatureCategoryFilter,
} from "@/data/explorerContent";

const featureFilters: FeatureCategoryFilter[] = ["All Features", ...featureExplorerCategories];

export default function FeatureExplorerPage() {
  useExplorerMetadata("Explore RECOVPH Innovations | RECOVPH", "Explore 25 planned RECOVPH feature concepts across seven categories. No tools, reports, alerts, or active cases are available.");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FeatureCategoryFilter>("All Features");
  const trimmedSearch = search.trim().toLowerCase();
  const visibleFeatures = useMemo(() => featureExplorerItems.filter((item) => {
    const matchesCategory = activeCategory === "All Features" || item.category === activeCategory;
    return matchesCategory && (!trimmedSearch || featureSearchText(item).includes(trimmedSearch));
  }), [activeCategory, trimmedSearch]);

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("All Features");
  };
  const categoryDescription = activeCategory === "All Features"
    ? `Browse all ${featureExplorerItems.length} informational concepts across ${usedFeatureExplorerCategories.length} feature categories.`
    : featureCategoryDescriptions[activeCategory];

  return (
    <ExplorerFrame>
      <ExplorerHero
        eyebrow="Concepts for a connected recovery network"
        title="Explore RECOVPH Innovations"
        subtitle="Discover planned RECOVPH ideas designed to make recovery information more connected, safe, and accessible."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Feature Explorer" }]}
      />
      <section className="explorer-content shell" aria-labelledby="feature-explorer-heading">
        <div className="explorer-stat-line">
          <div><b>{featureExplorerItems.length}</b><span>planned feature concepts</span></div>
          <span className="explorer-stat-line__divider" aria-hidden="true" />
          <div><b>{usedFeatureExplorerCategories.length}</b><span>informational categories</span></div>
          <span className="explorer-stat-line__note">Counts reflect planned ideas on this site — not active tools or results.</span>
        </div>

        <div className="explorer-control-card">
          <SearchField
            id="feature-search"
            label="Search feature information"
            value={search}
            onChange={setSearch}
            placeholder="Search AI, safety, tracking, transport, accessibility…"
          />
          <p className="explorer-search-helper">Search the planned feature names, descriptions, categories, and intended users.</p>
          <CategoryFilters
            label="Filter planned features by category"
            options={featureFilters}
            active={activeCategory}
            onChange={(value) => setActiveCategory(value as FeatureCategoryFilter)}
            countFor={(category) => category === "All Features" ? featureExplorerItems.length : featureExplorerItems.filter((item) => item.category === category).length}
          />
          <div className="explorer-category-description">
            <div><span className="explorer-control-label">{activeCategory === "All Features" ? "About these ideas" : activeCategory}</span><p>{categoryDescription}</p></div>
            <button className="explorer-clear-inline" type="button" onClick={resetFilters} disabled={!search && activeCategory === "All Features"}>Clear filters</button>
          </div>
        </div>

        <div className="explorer-results-heading">
          <div><h2 id="feature-explorer-heading">Planned innovation concepts</h2><p>Each idea is informational and not yet available for use.</p></div>
          <ResultSummary>{`Showing ${visibleFeatures.length} of ${featureExplorerItems.length} planned concepts`}</ResultSummary>
        </div>

        {visibleFeatures.length > 0 ? (
          <div className="catalog-grid catalog-grid--features">
            {visibleFeatures.map((item, index) => <FeatureCatalogCard key={item.slug} item={item} index={index} />)}
          </div>
        ) : (
          <EmptyResults
            title="No planned features match that search."
            description="Try another phrase or clear the category and search filters. This page describes concepts only; no RECOVPH tools are currently operational."
            onClear={resetFilters}
          />
        )}

        <PlannedNotice>
          Every item here is a future concept. No alerts, reports, dashboards, volunteer network, or organization portal is active.
        </PlannedNotice>
        <div className="explorer-crosslink">
          <div><span className="explorer-control-label">Explore recovery topics</span><h2>Browse the planned directory.</h2></div>
          <Link className="button button--primary" href="/directories">Explore the RECOVPH Recovery Network <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    </ExplorerFrame>
  );
}
