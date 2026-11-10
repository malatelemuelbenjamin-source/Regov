import { ArrowLeft, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { Link, useParams } from "wouter";
import { ComingSoonBadge } from "@/components/site/Brand";
import { ExplorerFrame, ExplorerHero, PlannedNotice, useExplorerMetadata } from "@/components/explorer/ExplorerFrame";
import { directoryExplorerItems, featureExplorerItems } from "@/data/explorerContent";

export default function DirectoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = directoryExplorerItems.find((candidate) => candidate.slug === slug);

  useExplorerMetadata(item ? `${item.title} | RECOVPH` : "Directory topic | RECOVPH", item ? `${item.purpose} Planned, not operational.` : "Planned directory information from RECOVPH.");

  if (!item) {
    return (
      <ExplorerFrame>
        <section className="explorer-missing shell" aria-labelledby="missing-directory-title">
          <span className="explorer-control-label">RECOVPH directory explorer</span>
          <h1 id="missing-directory-title">That directory topic isn’t in this catalog.</h1>
          <p>This page only contains the planned informational topics currently listed on RECOVPH.</p>
          <Link className="button button--primary" href="/directories"><ArrowLeft size={16} aria-hidden="true" />Back to Directories</Link>
        </section>
      </ExplorerFrame>
    );
  }

  const Icon = item.icon;
  const relatedFeatures = item.relatedFeatures
    .map((title) => featureExplorerItems.find((feature) => feature.title === title))
    .filter((feature): feature is (typeof featureExplorerItems)[number] => Boolean(feature));

  return (
    <ExplorerFrame>
      <ExplorerHero
        eyebrow="Planned directory topic"
        title={item.title}
        subtitle={item.description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Directory Explorer", href: "/directories" }, { label: item.title }]}
      />
      <section className="explorer-detail shell" aria-labelledby="directory-detail-title">
        <div className="explorer-detail__toolbar">
          <Link className="button button--secondary detail-back" href="/directories"><ArrowLeft size={16} aria-hidden="true" />Back to Directories</Link>
        </div>
        <div className="detail-heading" id="directory-detail-title">
          <span className="detail-heading__icon"><Icon size={28} strokeWidth={1.8} aria-hidden="true" /></span>
          <div><span className="catalog-card__category">{item.explorerCategory}</span><p>{item.categoryDescription}</p></div>
        </div>
        <div className="directory-detail-grid">
          <div className="detail-main-column">
            <article className="detail-panel"><span className="detail-panel__overline">Purpose</span><h2>Why this topic is planned</h2><p>{item.purpose}</p></article>
            <article className="detail-panel"><span className="detail-panel__overline">Who may benefit</span><h2>People and communities</h2><p>{item.beneficiaries}</p></article>
            <article className="detail-panel"><span className="detail-panel__overline">Topic scope</span><h2>Information this directory may cover</h2><ul className="detail-list">{item.itemTypes.map((type) => <li key={type}><Check size={15} aria-hidden="true" />{type}</li>)}</ul></article>
            <article className="detail-panel"><span className="detail-panel__overline">A future pathway</span><h2>How a planned reporting process may work</h2><p>{item.plannedProcess}</p><div className="detail-process" aria-label="Illustrative, non-operational recovery steps"><span>Describe the topic</span><span>Review guidance</span><span>Verify safely</span><span>Plan a handover</span></div><p className="detail-caption">Illustrative steps only. This page has no report form and does not accept submissions.</p></article>
            <article className="detail-panel detail-panel--safety"><span className="detail-panel__overline"><ShieldCheck size={14} aria-hidden="true" /> Safety considerations</span><h2>Protect people and property</h2><p>{item.safetyConsiderations}</p></article>
          </div>
          <aside className="detail-aside">
            <div className="detail-status-card"><ComingSoonBadge /><h2>Planned for a future phase</h2><p>This directory is informational only. RECOVPH is not accepting item reports, missing-person information, or active recovery submissions today.</p><Link className="detail-aside__link" href="/directories">Browse every planned directory <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
            <div className="detail-related-card"><span className="detail-panel__overline">Related RECOVPH concepts</span><h2>Ideas that may connect</h2><div className="related-links">
              {relatedFeatures.map((feature) => {
                const FeatureIcon = feature.icon;
                return <Link className="related-link" key={feature.slug} href={`/features/${feature.slug}`}><span><FeatureIcon size={17} aria-hidden="true" /></span><span><b>{feature.title}</b><small>{feature.description}</small></span><ArrowUpRight size={14} aria-hidden="true" /></Link>;
              })}
            </div>{item.relatedGuidance?.length ? <div className="related-guidance"><span className="detail-panel__overline">Related safeguarding ideas</span><ul className="detail-list">{item.relatedGuidance.map((guidance) => <li key={guidance}><ShieldCheck size={14} aria-hidden="true" />{guidance}</li>)}</ul></div> : null}<p className="detail-caption">These are planned concepts, not currently available tools.</p></div>
          </aside>
        </div>
        <PlannedNotice>Directory details describe an idea for a future phase. Do not use RECOVPH to report an emergency or an active missing-person case.</PlannedNotice>
      </section>
    </ExplorerFrame>
  );
}
