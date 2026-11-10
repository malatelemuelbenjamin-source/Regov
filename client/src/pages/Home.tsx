import {
  ArrowRight, ArrowUpRight, BadgeCheck, Building2, Check, ChevronDown,
  CircleHelp, Eye, Globe2, HeartHandshake, LockKeyhole, MapPin, MapPinned,
  ShieldAlert, ShieldCheck, Sparkles, Target, UsersRound, Baby, FileCheck2,
} from "lucide-react";
import { useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "wouter";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { BrandMark } from "@/components/site/Brand";
import { ComingSoonBadge, Eyebrow, SectionIntro } from "@/components/site/siteComponents";
import PsgcSourceNotice from "@/components/geography/PsgcSourceNotice";
import { communities, directories, directoryCategories, faqs, features, flagshipFeatureTitles, type DirectoryCategory, type IconCard } from "@/data/siteContent";
import psgcRegionSummaryJson from "@/data/psgc-region-summary.json";
import type { PsgcRegionSummaryFile } from "@/data/psgcTypes";

const psgcRegionSummary = psgcRegionSummaryJson as unknown as PsgcRegionSummaryFile;

function IconCardView({ item, index, kind, featured = false }: { item: IconCard; index: number; kind: "directory" | "feature"; featured?: boolean }) {
  const Icon = item.icon;
  return (
    <article className={`info-card ${kind === "feature" ? "info-card--feature" : ""} ${featured ? "info-card--flagship" : ""}`} style={{ "--card-index": index } as CSSProperties}>
      <div className="info-card__top">
        <span className="info-card__icon"><Icon size={21} strokeWidth={1.8} aria-hidden="true" /></span>
        <span className="info-card__index">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <div className="info-card__foot"><ComingSoonBadge small /></div>
    </article>
  );
}

function Hero() {
  return (
    <section className="hero shell" id="home" aria-labelledby="hero-title">
      <div className="hero__copy">
        <div className="hero__brand-line"><BrandMark compact /></div>
        <div className="hero__status"><ComingSoonBadge /></div>
        <Eyebrow>Made for a more connected Philippines</Eyebrow>
        <h1 id="hero-title">Helping Every Filipino <span>Find What Matters.</span></h1>
        <p className="hero__lead">Building a planned nationwide recovery network to help people, families, and communities reconnect with lost belongings, documents, pets, vehicles, and other things that matter.</p>
        <div className="hero__actions">
          <a className="button button--primary" href="#features">Explore Features <ArrowRight size={17} aria-hidden="true" /></a>
          <a className="button button--secondary" href="#about">Learn About RECOVPH <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
        <a className="hero__mission-link" href="#about">Discover Our Mission <ArrowUpRight size={14} aria-hidden="true" /></a>
        <div className="hero__promise"><span className="hero__promise-icon"><HeartHandshake size={17} aria-hidden="true" /></span><span>Every lost item deserves a chance to be found.</span></div>
      </div>
      <div className="hero__visual" aria-label="Illustration of Filipino neighbors helping each other recover a lost belonging">
        <div className="hero__visual-backdrop" />
        <div className="hero__image-frame">
          <img src="/manus-storage/async-images/DePvTc4XyE6XZP6LnXgwpd/image-1.webp" alt="Filipino neighbors helping return a misplaced belonging" fetchPriority="high" />
          <div className="hero__image-caption"><span className="hero__caption-mark"><MapPin size={16} aria-hidden="true" /></span><span><b>Every community.</b><br />Every chance to reconnect.</span></div>
        </div>
        <div className="hero-float hero-float--top"><span className="hero-float__icon"><Sparkles size={17} aria-hidden="true" /></span><span><b>Built on bayanihan</b><small>People helping people</small></span></div>
        <div className="hero-float hero-float--bottom"><span className="hero-float__seal"><Check size={15} aria-hidden="true" /></span><span><b>Planned with care</b><small>Designed for a safer return</small></span></div>
        <span className="hero__decor-dot hero__decor-dot--one" aria-hidden="true" />
        <span className="hero__decor-dot hero__decor-dot--two" aria-hidden="true" />
      </div>
      <a href="#about" className="hero__scroll" aria-label="Scroll to learn about RECOVPH"><span />Scroll to discover</a>
    </section>
  );
}

function AboutSection() {
  const pillars = [
    { label: "Our mission", icon: HeartHandshake, text: "To help Filipinos recover lost belongings, documents, pets, vehicles, and other important things through a unified nationwide recovery network." },
    { label: "Our vision", icon: Globe2, text: "A future where people and communities across the Philippines can find trusted pathways to reconnect with what matters." },
    { label: "Our goals", icon: Target, text: "Bring recovery information together, make help easier to discover, and shape an approach that puts privacy and public safety first." },
  ];
  return (
    <section className="about-section section-pad" id="about" aria-labelledby="about-title">
      <div className="shell about-layout">
        <div className="about-story">
          <SectionIntro id="about-title" eyebrow="About RECOVPH" title="Recovery should feel closer." >
            <p className="about__original-position">A Nationwide Recovery Network Connecting Filipinos to Their Lost Belongings, Important Documents, Pets, Vehicles, and More.</p>
            <p>When something important goes missing, knowing where to turn can be hard. RECOVPH is being built around one hopeful idea: make recovery information easier to find, share, and act on—together.</p>
          </SectionIntro>
          <div className="story-note"><span className="story-note__quote">“</span><p>A connected recovery network—shaped for Filipino communities and the everyday things that matter.</p><span className="story-note__rule" /></div>
          <p className="about-story__detail"><b>Our story</b><br />RECOVPH begins with a simple observation: lost belongings affect people in every community, but information is often scattered. The platform’s long-term purpose is to bring individuals, families, communities, establishments, and authorized organizations into a shared recovery network.</p>
          <p className="about-story__detail"><b>How RECOVPH plans to help Filipinos</b><br />By bringing planned recovery directories, helpful information, and thoughtful safety principles together in one place—once the platform is ready.</p>
          <a className="text-link" href="#how-it-works">See the planned journey <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="about-pillars">
          {pillars.map(({ label, icon: Icon, text }, index) => (
            <article className="pillar-card" key={label}>
              <div className="pillar-card__top"><span className="pillar-card__icon"><Icon size={21} aria-hidden="true" /></span><span className="pillar-card__number">0{index + 1}</span></div>
              <h3>{label}</h3><p>{text}</p>
            </article>
          ))}
          <div className="about-note"><span><Eye size={17} aria-hidden="true" /></span><p><b>Our commitment</b> Privacy and public safety are part of the plan from the beginning—not an afterthought.</p></div>
        </div>
      </div>
      <div className="shell why-strip">
        <span className="why-strip__label">Why RECOVPH matters</span>
        <p>A lost item can be more than an object. It can hold a memory, a livelihood, a way home, or a sense of security.</p>
        <span className="why-strip__ornament" aria-hidden="true">✳</span>
      </div>
    </section>
  );
}

function DirectoriesSection() {
  const [activeCategory, setActiveCategory] = useState<DirectoryCategory | "All directories">("All directories");
  const visibleCategories = activeCategory === "All directories" ? directoryCategories : [activeCategory];

  return (
    <section className="directory-section section-pad" id="directories" aria-labelledby="directories-title">
      <div className="shell">
        <div className="section-heading-row">
          <SectionIntro id="directories-title" eyebrow="A place for what matters" title="One vision. Many ways to help." >
            <p>RECOVPH is planned to support many kinds of recovery—from the everyday essentials to the things that bring families and communities together.</p>
          </SectionIntro>
          <div className="planned-stamp"><span className="planned-stamp__ring">RECOVPH<br />PLANNED</span><span className="planned-stamp__spark">✳</span></div>
        </div>
        <div className="directory-filters" role="group" aria-label="Filter directories by category">
          {(["All directories", ...directoryCategories] as const).map((category) => (
            <button key={category} type="button" className={`directory-filter ${activeCategory === category ? "is-active" : ""}`} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>
              {category}
            </button>
          ))}
        </div>
        <div className="directory-groups">
          {visibleCategories.map((category) => (
            <section className="directory-group" key={category} aria-labelledby={`directory-group-${directoryCategories.indexOf(category)}`}>
              <h3 className="directory-group__title" id={`directory-group-${directoryCategories.indexOf(category)}`}>{category}</h3>
              <div className="directory-grid">
                {directories.filter((item) => item.category === category).map((item) => <IconCardView item={item} index={directories.indexOf(item)} kind="directory" key={item.title} />)}
              </div>
            </section>
          ))}
        </div>
        <p className="section-footnote"><span className="footnote-dot" />All directories are planned. Reporting and recovery services are not yet available.</p>
        <div className="home-explorer-links">
          <Link className="button button--primary" href="/directories">Open Directory Explorer <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const flagship = flagshipFeatureTitles.map((title) => features.find((item) => item.title === title)).filter((item): item is IconCard => Boolean(item));
  const moreFeatures = features.filter((item) => !flagshipFeatureTitles.includes(item.title as (typeof flagshipFeatureTitles)[number]));

  return (
    <section className="features-section section-pad" id="features" aria-labelledby="features-title">
      <div className="features-glow" aria-hidden="true" />
      <div className="shell features-section__inner">
        <div className="features-heading">
          <SectionIntro id="features-title" eyebrow="Designed for what's next" title="A thoughtful toolkit for recovery." light>
            <p>From smarter ways to match information to safer ways to return an item, these are future ideas for making a nationwide network more helpful and human.</p>
          </SectionIntro>
          <div className="features-callout"><Sparkles size={19} aria-hidden="true" /><p><b>Ideas in development</b><br />Every feature below is a concept for a future phase.</p></div>
        </div>
        <div className="feature-group-heading"><h3>Flagship concepts</h3><p>Five ideas shaping the future RECOVPH vision</p></div>
        <div className="flagship-grid">
          {flagship.map((item, index) => <IconCardView item={item} index={index} kind="feature" featured key={item.title} />)}
        </div>
        <div className="feature-group-heading feature-group-heading--more"><h3>More planned concepts</h3><p>Every idea is still in the planning stage</p></div>
        <div className="feature-grid">
          {moreFeatures.map((item, index) => <IconCardView item={item} index={index + flagship.length} kind="feature" key={item.title} />)}
        </div>
        <p className="features-footnote">These are planned concepts, not available tools or services.</p>
        <div className="home-explorer-links home-explorer-links--features">
          <Link className="button button--secondary" href="/features">Explore all planned innovations <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { number: "01", title: "Report", description: "A person reports a lost or found item.", icon: MapPin, tone: "blue" },
    { number: "02", title: "Discover", description: "RECOVPH helps identify potential matches.", icon: Sparkles, tone: "gold" },
    { number: "03", title: "Verify", description: "The rightful owner goes through verification.", icon: BadgeCheck, tone: "blue" },
    { number: "04", title: "Recover", description: "The item is safely returned to its rightful owner.", icon: HeartHandshake, tone: "gold" },
  ];
  return (
    <section className="journey-section section-pad" id="how-it-works" aria-labelledby="journey-title">
      <div className="shell">
        <SectionIntro id="journey-title" eyebrow="The recovery journey" title="Four steps. One meaningful return." centered>
          <p>A clear, considered path is part of RECOVPH’s vision for bringing lost things back to the people who need them.</p>
        </SectionIntro>
        <div className="workflow-label"><span className="workflow-label__mark"><MapPin size={15} aria-hidden="true" /></span><b>Planned Recovery Workflow</b><span aria-hidden="true">–</span><ComingSoonBadge small /></div>
        <div className="journey-track">
          {steps.map(({ number, title, description, icon: Icon, tone }, index) => (
            <article className="journey-step" key={number}>
              <div className={`journey-step__icon journey-step__icon--${tone}`}><Icon size={25} strokeWidth={1.8} aria-hidden="true" /></div>
              <div className="journey-step__content"><span className="journey-step__number">{number}</span><h3>{title}</h3><p>{description}</p></div>
              {index < steps.length - 1 && <span className="journey-step__arrow" aria-hidden="true"><ArrowRight size={18} /></span>}
            </article>
          ))}
        </div>
        <div className="journey-notice"><span className="journey-notice__icon"><CircleHelp size={18} aria-hidden="true" /></span><p><b>Coming soon.</b> This recovery process is planned and is not yet operational. RECOVPH does not accept reports today.</p></div>
      </div>
    </section>
  );
}

function CoverageSection() {
  return (
    <section className="coverage-section section-pad" id="coverage" aria-labelledby="coverage-title">
      <div className="shell">
        <div className="coverage-layout">
          <div className="coverage-copy">
            <Eyebrow>One archipelago. A shared ambition.</Eyebrow>
            <h2 id="coverage-title">RECOVPH Nationwide <span>Coverage</span></h2>
            <p className="coverage-lead">Designed to Connect Every Filipino Community – From Regions to Barangays.</p>
            <p className="coverage-explainer">A nationwide recovery network is the long-term vision. These official PSGC regions describe the geography RECOVPH hopes to serve—not active or current service coverage.</p>
            <div className="coverage-status"><span className="coverage-status__pin"><MapPin size={17} aria-hidden="true" /></span><div><b>Nationwide expansion: Planned</b><span>No active cases or participating municipalities are represented.</span></div><ComingSoonBadge small /></div>
            <Link className="button button--primary coverage-explorer-link" href="/geography">Explore the official geographic directory <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="coverage-map-card">
            <div className="coverage-map-card__head"><span><MapPinned size={18} aria-hidden="true" /> Planned reach</span><span className="map-label"><i />Illustrative outline</span></div>
            <div className="coverage-map-art"><img src="/philippines-map.svg" alt="Illustrative outline of the Philippine archipelago; no administrative region boundaries or active RECOVPH coverage are shown" loading="lazy" /></div>
            <div className="coverage-map-card__bottom"><span className="map-compass" aria-hidden="true">N<span>↑</span></span><p>Every island. Every community.<br /><b>A future we’re working toward.</b></p><span className="map-card-star" aria-hidden="true">✳</span></div>
          </div>
        </div>
        <div className="coverage-directory-heading"><div><span className="eyebrow"><i className="eyebrow__line" />PSA PSGC · THIRD QUARTER 2026</span><h3>Browse all 18 official regions</h3><p>Region codes and source-level counts below are computed from the linked PSA masterlist.</p></div><span className="coverage-reference-note">Geographic reference data only<br />Not operational RECOVPH coverage</span></div>
        <div className="coverage-region-grid" aria-label="All 18 official regions in the PSA PSGC dataset">
          {psgcRegionSummary.regions.map((region, index) => (
            <Link className="coverage-region-card" key={region.code} href={`/geography/region/${region.code}`} aria-label={`Explore ${region.name}, PSGC ${region.code}`}>
              <div className="coverage-region-card__top"><span>{String(index + 1).padStart(2, "0")}</span><code>{region.code}</code></div>
              <h4>{region.name}</h4>
              <p>{region.introduction}</p>
              <div className="coverage-region-card__stats"><span><b>{region.counts.provinces.toLocaleString("en-PH")}</b><small>Provinces</small></span><span><b>{region.counts.cities.toLocaleString("en-PH")}</b><small>Cities</small></span><span><b>{region.counts.municipalities.toLocaleString("en-PH")}</b><small>Municipalities</small></span><span><b>{region.counts.barangays.toLocaleString("en-PH")}</b><small>Barangays</small></span></div>
              <span className="coverage-region-card__link">Explore this region <ArrowRight size={15} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
        <PsgcSourceNotice metadata={psgcRegionSummary.metadata} compact />
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="community-section section-pad" id="community" aria-labelledby="community-title">
      <div className="shell community-layout">
        <div className="community-copy">
          <SectionIntro id="community-title" eyebrow="Built with community in mind" title="Recovery takes all of us." >
            <p>RECOVPH hopes to make room for people and organizations that want to help their communities reconnect with lost belongings.</p>
          </SectionIntro>
          <a className="button button--light" href="#faq">Learn more <ArrowRight size={16} aria-hidden="true" /></a>
          <p className="community-caveat">Participation is a future opportunity. No partner organizations are currently announced.</p>
        </div>
        <div className="community-card">
          <div className="community-card__head"><span className="community-card__icon"><UsersRound size={20} aria-hidden="true" /></span><div><h3>Who may be part of the vision</h3><p>Planned participation across the community</p></div></div>
          <div className="community-list">{communities.map((community) => <span className="community-item" key={community}><Check size={14} aria-hidden="true" />{community}</span>)}</div>
          <div className="partnership-cta"><span className="partnership-cta__mark"><Building2 size={18} aria-hidden="true" /></span><span><b>Partnership Opportunities</b><small>Coming soon — details will be shared later.</small></span><ArrowUpRight size={17} aria-hidden="true" /></div>
        </div>
      </div>
    </section>
  );
}

function SafetySection() {
  const commitments = [
    { icon: LockKeyhole, title: "Privacy Protection", text: "Personal details should be protected, with sensitive information visible only when appropriate." },
    { icon: FileCheck2, title: "Ownership Verification", text: "Ownership checks are planned to help rightful owners verify their claims securely." },
    { icon: ShieldAlert, title: "Fraud Prevention", text: "Planned safeguards aim to discourage fraudulent claims and protect people from suspicious recovery activity." },
    { icon: HeartHandshake, title: "Safe Recovery", text: "Safer item handover and thoughtful recovery guidance are part of the intended approach." },
    { icon: Baby, title: "Child Protection", text: "Missing-person cases and child-related information require careful, privacy-minded handling." },
    { icon: Eye, title: "Transparent Case Management", text: "Transparent reporting and responsible moderation are planned principles, not active case-management tools." },
  ];
  return (
    <section className="safety-section section-pad" id="safety" aria-labelledby="safety-title">
      <div className="shell">
        <div className="safety-top">
          <SectionIntro id="safety-title" eyebrow="Safety and privacy by design" title="Trust should be built into the plan." >
            <p>RECOVPH’s privacy and safety approach is still in development. These principles describe the intended direction—not certifications or established legal compliance.</p>
          </SectionIntro>
          <div className="safety-seal"><ShieldCheck size={31} strokeWidth={1.4} aria-hidden="true" /><span>Planned<br />commitment</span></div>
        </div>
        <div className="safety-grid">
          {commitments.map(({ icon: Icon, title, text }, i) => <article className="safety-card" key={title}><span className="safety-card__number">0{i + 1}</span><span className="safety-card__icon"><Icon size={22} aria-hidden="true" /></span><h3>{title}</h3><p>{text}</p><ComingSoonBadge small /></article>)}
        </div>
        <p className="safety-foot"><span className="safety-foot__dot" />Designed with responsibility in mind. Details will be published as the platform takes shape.</p>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="faq-section section-pad" id="faq" aria-labelledby="faq-title">
      <div className="shell faq-layout">
        <div className="faq-intro">
          <Eyebrow>Good questions, clear answers</Eyebrow>
          <h2 id="faq-title">What you may be wondering.</h2>
          <p>RECOVPH is still taking shape. Here’s what we can share about the vision and what is—and isn’t—available today.</p>
          <div className="faq-help"><CircleHelp size={20} aria-hidden="true" /><span>More details will be shared as development continues.</span></div>
        </div>
        <div className="faq-list">
          {faqs.map((faq, i) => <details className="faq-item" key={faq.question} name="recovph-faq" open={i === 0}>
            <summary><span className="faq-number">{String(i + 1).padStart(2, "0")}</span><span className="faq-question">{faq.question}</span><ChevronDown size={18} aria-hidden="true" /></summary>
            <div className="faq-answer"><p>{faq.answer}</p></div>
          </details>)}
        </div>
      </div>
    </section>
  );
}

function ContactCta() {
  return (
    <section className="contact-cta" aria-labelledby="contact-cta-title">
      <div className="shell contact-cta__inner">
        <div className="contact-cta__spark contact-cta__spark--one" aria-hidden="true">✳</div>
        <div><Eyebrow>Every return starts with a shared hope</Eyebrow><h2 id="contact-cta-title">A little more connected.<br /><span>A little closer to found.</span></h2></div>
        <a className="button button--primary" href="#home">Explore RECOVPH <ArrowRight size={17} aria-hidden="true" /></a>
        <div className="contact-cta__spark contact-cta__spark--two" aria-hidden="true">✳</div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <AboutSection />
        <DirectoriesSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CoverageSection />
        <CommunitySection />
        <SafetySection />
        <FaqSection />
        <ContactCta />
      </main>
      <SiteFooter />
    </div>
  );
}
