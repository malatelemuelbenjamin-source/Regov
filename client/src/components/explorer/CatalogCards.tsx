
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { ComingSoonBadge } from "@/components/site/Brand";
import type { DirectoryExplorerItem, FeatureExplorerItem } from "@/data/explorerContent";

type CardStyle = React.CSSProperties & { "--card-index"?: number };

export function DirectoryCatalogCard({ item, index }: { item: DirectoryExplorerItem; index: number }) {
  const Icon = item.icon;
  return (
    <article className="catalog-card" style={{ "--card-index": index } as CardStyle}>
      <div className="catalog-card__top">
        <span className="catalog-card__icon"><Icon size={23} strokeWidth={1.8} aria-hidden="true" /></span>
        <span className="catalog-card__category">{item.explorerCategory}</span>
      </div>
      <div className="catalog-card__heading"><h2>{item.title}</h2><ComingSoonBadge small /></div>
      <p className="catalog-card__description">{item.description}</p>
      <p className="catalog-card__detail"><b>Planned for:</b> {item.beneficiaries}</p>
      <Link className="catalog-card__link" href={`/directories/${item.slug}`} aria-label={`View planned directory details for ${item.title}`}>
        View planned directory details <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}

export function FeatureCatalogCard({ item, index }: { item: FeatureExplorerItem; index: number }) {
  const Icon = item.icon;
  return (
    <article className="catalog-card catalog-card--feature" style={{ "--card-index": index } as CardStyle}>
      <div className="catalog-card__top">
        <span className="catalog-card__icon"><Icon size={23} strokeWidth={1.8} aria-hidden="true" /></span>
        <span className="catalog-card__index">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <span className="catalog-card__category">{item.category}</span>
      <div className="catalog-card__heading"><h2>{item.title}</h2><ComingSoonBadge small /></div>
      <p className="catalog-card__description">{item.description}</p>
      <p className="catalog-card__detail"><b>Intended for:</b> {item.intendedUsers}</p>
      <p className="catalog-card__detail"><b>Potential benefit:</b> {item.potentialBenefit}</p>
      <Link className="catalog-card__link" href={`/features/${item.slug}`} aria-label={`View planned feature details for ${item.title}`}>
        Explore this concept <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}
