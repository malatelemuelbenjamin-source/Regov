import { useEffect, type ReactNode } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { ComingSoonBadge, Eyebrow } from "@/components/site/Brand";

export function useExplorerMetadata(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    const descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const openGraphTitleTag = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const openGraphDescriptionTag = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    const previousDescription = descriptionTag?.content;
    const previousOpenGraphTitle = openGraphTitleTag?.content;
    const previousOpenGraphDescription = openGraphDescriptionTag?.content;
    document.title = title;
    if (descriptionTag) descriptionTag.content = description;
    if (openGraphTitleTag) openGraphTitleTag.content = title;
    if (openGraphDescriptionTag) openGraphDescriptionTag.content = description;
    return () => {
      document.title = previousTitle;
      if (descriptionTag && previousDescription !== undefined) descriptionTag.content = previousDescription;
      if (openGraphTitleTag && previousOpenGraphTitle !== undefined) openGraphTitleTag.content = previousOpenGraphTitle;
      if (openGraphDescriptionTag && previousOpenGraphDescription !== undefined) openGraphDescriptionTag.content = previousOpenGraphDescription;
    };
  }, [title, description]);
}

export function ExplorerFrame({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main-content" className="explorer-main">{children}</main>
      <SiteFooter />
    </div>
  );
}

export type BreadcrumbItem = { label: string; href?: string };

export function ExplorerBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="explorer-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {index > 0 && <ChevronRight size={14} aria-hidden="true" />}
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ExplorerHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  comingSoon = true,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  breadcrumbs: BreadcrumbItem[];
  comingSoon?: boolean;
}) {
  const geographyRoute = breadcrumbs.some((item) => item.label === "Geographic Explorer");
  return (
    <section className="explorer-hero">
      <div className="shell">
        <ExplorerBreadcrumbs items={breadcrumbs} />
        <div className="explorer-hero__body">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          {comingSoon && <div className="explorer-hero__status"><ComingSoonBadge /></div>}
        </div>
        <nav className="explorer-tabs" aria-label="RECOVPH explorers">
          <Link href="/directories" className={title.includes("Recovery Network") ? "is-active" : undefined} aria-current={title.includes("Recovery Network") ? "page" : undefined}>
            Directory Explorer <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link href="/features" className={title.includes("Innovations") ? "is-active" : undefined} aria-current={title.includes("Innovations") ? "page" : undefined}>
            Feature Explorer <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link href="/geography" className={geographyRoute ? "is-active" : undefined} aria-current={geographyRoute ? "page" : undefined}>
            Geographic Explorer <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </section>
  );
}

export function PlannedNotice({ children }: { children: ReactNode }) {
  return (
    <aside className="explorer-notice" role="note">
      <span className="explorer-notice__mark" aria-hidden="true">✳</span>
      <p><b>Informational preview.</b> {children}</p>
      <ComingSoonBadge small />
    </aside>
  );
}
