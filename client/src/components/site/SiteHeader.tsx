import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  CONSULTATION_HREF,
  ESTATE_PLANNING_NAVIGATION,
  LANGUAGE_LINKS,
  PRIMARY_NAVIGATION,
} from "@/site/siteConfig";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <div className="desktop-rail" aria-hidden="true">
        <span className="rail-mark">BM</span>
        <span className="rail-line" />
        <span className="rail-label">Brian Miranda Law</span>
      </div>
      <header className="site-header">
        <Link className="brand-lockup" href="/" aria-label="Miranda Law home">
          <img
            className="brand-logo"
            src="/miranda-law-gold.png"
            alt="Miranda Law, Attorneys at Law"
          />
        </Link>

        <nav
          id="main-navigation"
          className={menuOpen ? "main-nav is-open" : "main-nav"}
          aria-label="Main navigation"
        >
          <div className="nav-item-with-menu">
            <Link
              className={
                location.startsWith("/estate-planning") ? "is-active" : ""
              }
              href="/estate-planning"
            >
              Estate Planning <ChevronDown size={13} />
            </Link>
            <div className="nav-submenu">
              {ESTATE_PLANNING_NAVIGATION.slice(1).map(item => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {PRIMARY_NAVIGATION.slice(1).map(item => (
            <Link
              key={item.href}
              className={location === item.href ? "is-active" : ""}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}

          <div className="nav-languages" aria-label="Questionnaire languages">
            {LANGUAGE_LINKS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                title={`Start in ${item.language}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link className="nav-cta" href={CONSULTATION_HREF}>
            Schedule a free consultation
          </Link>
        </nav>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-controls="main-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(current => !current)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
    </>
  );
}
