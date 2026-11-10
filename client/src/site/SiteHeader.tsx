import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "wouter";
import { BrandMark } from "./Brand";
import { ComingSoonBadge } from "./siteComponents";

const sectionLinks = [
  { label: "Home", section: "home" },
  { label: "About", section: "about" },
  { label: "Directories", section: "directories" },
  { label: "Features", section: "features" },
  { label: "How it works", section: "how-it-works" },
  { label: "Coverage", section: "coverage" },
  { label: "FAQ", section: "faq" },
  { label: "Contact", section: "contact" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [location] = useLocation();
  const isHome = location === "/";
  const isGeographyRoute = location.startsWith("/geography");
  const closeMenu = () => setMenuOpen(false);
  const sectionHref = (section: string) => isHome ? `#${section}` : `/#${section}`;

  useEffect(() => {
    if (!isHome) return;
    const sections = sectionLinks
      .map(({ section }) => document.getElementById(section))
      .filter((section): section is HTMLElement => section !== null);
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (current) setActiveSection(current.target.id);
    }, { rootMargin: "-18% 0px -70% 0px", threshold: 0 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;
    const sectionId = window.location.hash.slice(1);
    if (!sectionId) return;
    const frame = window.requestAnimationFrame(() => {
      const section = document.getElementById(decodeURIComponent(sectionId));
      if (!section) return;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isHome, location]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="announcement-bar" role="status">
        <span className="announcement-bar__spark" aria-hidden="true">✳</span>
        <span className="announcement-bar__message">RECOVPH IS COMING SOON – Building a Nationwide Recovery Network for Every Filipino.</span>
        <a href={sectionHref("about")} className="announcement-bar__link">Our mission <span aria-hidden="true">→</span></a>
      </div>
      <header className="site-header">
        <div className="site-header__inner">
          <BrandMark />
          <nav className={`primary-nav ${menuOpen ? "primary-nav--open" : ""}`} aria-label="Main navigation" id="primary-navigation">
            {sectionLinks.map((link) => {
              const active = isHome && activeSection === link.section;
              return (
                <a
                  key={link.section}
                  href={sectionHref(link.section)}
                  onClick={closeMenu}
                  className={active ? "is-active" : undefined}
                  aria-current={active ? "location" : undefined}
                >
                  {link.label}
                </a>
              );
            })}
            <a href="/geography" onClick={closeMenu} className={isGeographyRoute ? "is-active" : undefined} aria-current={isGeographyRoute ? "page" : undefined} title="Explore official Philippine PSGC locations">Geography</a>
            <a className="mobile-nav-status" href={sectionHref("contact")} onClick={closeMenu}><ComingSoonBadge small /></a>
          </nav>
          <div className="site-header__actions">
            <span className="desktop-status"><ComingSoonBadge small /></span>
            <a className="header-cta" href="/directories">Explore <span aria-hidden="true">↗</span></a>
            <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
              {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
