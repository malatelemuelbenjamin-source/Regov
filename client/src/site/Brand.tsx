import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`brand ${compact ? "brand--compact" : ""}`} href="/#home" aria-label="RECOVPH home">
      <span className="brand__symbol" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="presentation">
          <path d="M24 4.7c-8.1 0-14.7 6.4-14.7 14.3 0 10.1 14.7 24.1 14.7 24.1S38.7 29.1 38.7 19C38.7 11.1 32.1 4.7 24 4.7Z" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="19" r="6.4" fill="#ffb900" />
          <path d="m20.8 19.2 2.1 2.1 4.5-4.7" fill="none" stroke="#102b4e" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="brand__wordmark">RECOV<span>PH</span></span>
      {!compact && <span className="brand__descriptor">A nationwide recovery network</span>}
    </a>
  );
}

export function ComingSoonBadge({ small = false }: { small?: boolean }) {
  return <span className={`status-badge ${small ? "status-badge--small" : ""}`}><span className="status-badge__dot" />Coming Soon</span>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow"><span className="eyebrow__line" />{children}</p>;
}

export function SectionIntro({
  eyebrow,
  title,
  children,
  id,
  centered = false,
  light = false,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  id?: string;
  centered?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`section-intro ${centered ? "section-intro--centered" : ""} ${light ? "section-intro--light" : ""}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id}>{title}</h2>
      {children && <div className="section-intro__copy">{children}</div>}
    </div>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className="text-link" href={href}>{children}<ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" /></a>;
}
