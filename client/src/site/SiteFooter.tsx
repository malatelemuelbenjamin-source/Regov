import { ArrowUpRight, ArrowUp } from "lucide-react";
import { Brand, ComingSoonBadge } from "./siteComponents";

const footerGroups = [
  { title: "Discover", links: [
    { label: "About RECOVPH", href: "/#about" },
    { label: "Recovery directories", href: "/#directories" },
    { label: "Directory Explorer", href: "/directories" },
    { label: "Planned features", href: "/#features" },
    { label: "Feature Explorer", href: "/features" },
  ] },
  { title: "Our vision", links: [
    { label: "How it will work", href: "/#how-it-works" },
    { label: "Nationwide coverage", href: "/#coverage" },
    { label: "Geographic Explorer", href: "/geography" },
    { label: "Community & partners", href: "/#community" },
  ] },
  { title: "Learn more", links: [
    { label: "Privacy & safety", href: "/#safety" },
    { label: "Frequently asked questions", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ] },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-main shell">
        <div className="footer-brand-block">
          <Brand />
          <p className="footer-tagline">The Philippines' All-in-One Lost &amp; Found Recovery Platform</p>
          <div className="footer-status"><ComingSoonBadge small /></div>
          <p className="footer-note">A nationwide recovery network is being built for every Filipino.</p>
        </div>
        {footerGroups.map((group) => (
          <div className="footer-column" key={group.title}>
            <h3>{group.title}</h3>
            <ul>{group.links.map((link) => <li key={link.href}><a href={link.href}>{link.label}<ArrowUpRight size={13} aria-hidden="true" /></a></li>)}</ul>
          </div>
        ))}
        <div className="footer-contact">
          <span className="footer-overline">Contact &amp; social</span>
          <p>Contact details and official social channels will be shared here when available.</p>
          <span className="footer-placeholder" aria-label="Social media links to be announced">Official channels coming soon</span>
        </div>
      </div>
      <div className="footer-bottom shell">
        <p>© {new Date().getFullYear()} RECOVPH. A vision in development.</p>
        <a className="back-to-top" href="/#home">Back to top <ArrowUp size={14} aria-hidden="true" /></a>
      </div>
    </footer>
  );
}
