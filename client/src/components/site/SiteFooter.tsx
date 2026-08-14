import { Link } from "wouter";
import {
  CONTACT,
  ESTATE_PLANNING_NAVIGATION,
  LANGUAGE_LINKS,
  RESOURCE_NAVIGATION,
  getPhoneHref,
} from "@/site/siteConfig";

export function SiteFooter() {
  return (
    <footer className="site-footer site-footer-expanded">
      <div className="footer-brand-column">
        <Link className="footer-logo-link" href="/">
          <img
            className="footer-logo"
            src="/miranda-law-gold.png"
            alt="Miranda Law, Attorneys at Law"
            width="2434"
            height="2401"
            loading="lazy"
            decoding="async"
          />
        </Link>
        <p>
          Clear estate-planning guidance for North Jersey families, available in
          English, Spanish, and Portuguese.
        </p>
      </div>

      <div className="footer-link-column">
        <h2>Estate planning</h2>
        {ESTATE_PLANNING_NAVIGATION.map(item => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="footer-link-column">
        <h2>Resources</h2>
        {RESOURCE_NAVIGATION.map(item => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <Link href="/about">About Brian</Link>
        <Link href="/other-services">Other legal services</Link>
      </div>

      <div className="footer-contact-column">
        <h2>Start a conversation</h2>
        <a href={getPhoneHref()}>{CONTACT.phoneDisplay}</a>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <a href={CONTACT.mapUrl} target="_blank" rel="noreferrer">
          {CONTACT.addressLines[0]}
          <br />
          {CONTACT.addressLines[1]}
        </a>
        <div className="footer-language-links">
          {LANGUAGE_LINKS.map(item => (
            <Link key={item.href} href={item.href}>
              {item.language}
            </Link>
          ))}
        </div>
      </div>

      <div className="footer-legal-row">
        <span>© 2026 {CONTACT.name}</span>
        <Link href="/privacy">Privacy</Link>
        <Link href="/cookies">Cookies</Link>
        <Link href="/disclaimer">Website disclaimer</Link>
        <Link href="/accessibility">Accessibility</Link>
        <span>
          Attorney advertising. Prior results do not guarantee a similar
          outcome.
        </span>
      </div>
    </footer>
  );
}
