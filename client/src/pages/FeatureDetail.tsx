import { ArrowLeft, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { Link, useParams } from "wouter";
import { ComingSoonBadge } from "@/components/site/Brand";
import { ExplorerFrame, ExplorerHero, PlannedNotice, useExplorerMetadata } from "@/components/explorer/ExplorerFrame";
import { directoryExplorerItems, featureExplorerItems } from "@/data/explorerContent";

export default function FeatureDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = featureExplorerItems.find((candidate) => candidate.slug === slug);

  useExplorerMetadata(item ? `${item.title} | RECOVPH Innovations` : "RECOVPH Innovation | RECOVPH", item ? `${item.overview} Planned concept; not currently operational.` : "Planned RECOVPH innovation information.");

  if (!item) {
    return (
      <ExplorerFrame>
        <section className="explorer-missing shell" aria-labelledby="missing-feature-title">
          <span className="explorer-control-label">RECOVPH feature explorer</span>
          <h1 id="missing-feature-title">That innovation isn’t in this catalog.</h1>
          <p>This page only contains the planned RECOVPH concepts currently listed on the website.</p>
          <Link className="button button--primary" href="/features"><ArrowLeft size={16} aria-hidden="true" />Back to Feature Explorer</Link>
        </section>
      </ExplorerFrame>
    );
  }

  const Icon = item.icon;
  const relatedDirectories = item.relatedDirectories
    .map((title) => directoryExplorerItems.find((directory) => directory.title === title))
    .filter((directory): directory is (typeof directoryExplorerItems)[number] => Boolean(directory));

  return (
    <ExplorerFrame>
      <ExplorerHero
        eyebrow="Planned RECOVPH innovation"
        title={item.title}
        subtitle={item.description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Feature Explorer", href: "/features" }, { label: item.title }]}
      />
      <section className="explorer-detail shell" aria-label={`Planned details for ${item.title}`}>
        <div className="explorer-detail__toolbar">
          <Link className="button button--secondary detail-back" href="/features"><ArrowLeft size={16} aria-hidden="true" />Back to Feature Explorer</Link>
        </div>
        <div className="detail-heading">
          <span className="detail-heading__icon"><Icon size={28} strokeWidth={1.8} aria-hidden="true" /></span>
          <div><span className="catalog-card__category">{item.category}</span></div>
        </div>
        <div className="directory-detail-grid">
          <div className="detail-main-column">
            <article className="detail-panel"><span className="detail-panel__overline">The intended problem</span><h2>Why this concept is being explored</h2><p>{item.problem}</p></article>
            <article className="detail-panel"><span className="detail-panel__overline">A future approach</span><h2>How it is planned to work</h2><p>{item.plannedApproach}</p></article>
            <article className="detail-panel"><span className="detail-panel__overline">Intended users</span><h2>People it may be designed to help</h2><p>{item.intendedUsers}</p><div className="detail-benefit"><span>Potential benefit if developed</span><p>{item.potentialBenefit}</p></div></article>
            <article className="detail-panel detail-panel--safety"><span className="detail-panel__overline"><ShieldCheck size={14} aria-hidden="true" /> Privacy and safety</span><h2>Responsible design comes first</h2><p>{item.privacySafety}</p></article>
          </div>
          <aside className="detail-aside">
            <div className="detail-status-card"><ComingSoonBadge /><h2>Concept only</h2><p>This idea is in the RECOVPH roadmap. It is not operational and does not provide active reporting, data matching, notifications, case tracking, statistics, or user accounts.</p><Link className="detail-aside__link" href="/features">Browse all planned features <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
            <div className="detail-related-card"><span className="detail-panel__overline">Related directory topics</span><h2>Where this idea may fit</h2><div className="related-links">
              {relatedDirectories.map((directory) => {
                const DirectoryIcon = directory.icon;
                return <Link className="related-link" key={directory.slug} href={`/directories/${directory.slug}`}><span><DirectoryIcon size={17} aria-hidden="true" /></span><span><b>{directory.title}</b><small>{directory.description}</small></span><ArrowUpRight size={14} aria-hidden="true" /></Link>;
              })}
            </div><p className="detail-caption">Each related directory is also a planned informational concept.</p></div>
          </aside>
        </div>
        <PlannedNotice>Feature descriptions are future-facing. No innovation, tool, or service on this page is currently available for use.</PlannedNotice>
      </section>
    </ExplorerFrame>
  );
}
