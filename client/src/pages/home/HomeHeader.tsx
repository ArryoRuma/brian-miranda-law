import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { NAVIGATION_ITEMS, type PageSectionId } from "./content";
import { scrollToSection } from "./navigation";

export function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigateTo = (sectionId: PageSectionId) => {
    setMenuOpen(false);
    scrollToSection(sectionId);
  };

  return (
    <>
      <div className="desktop-rail" aria-hidden="true">
        <span className="rail-mark">BM</span>
        <span className="rail-line" />
        <span className="rail-label">Brian Miranda Law</span>
      </div>
      <header className="site-header">
        <a
          className="brand-lockup"
          href="#top"
          aria-label="Brian Miranda Law home"
          onClick={() => setMenuOpen(false)}
        >
          <img
            className="brand-logo"
            src="/miranda-law-gold.png"
            alt=""
            aria-hidden="true"
          />
        </a>
        <nav
          id="main-navigation"
          className={menuOpen ? "main-nav is-open" : "main-nav"}
          aria-label="Main navigation"
        >
          {NAVIGATION_ITEMS.map(({ label, sectionId }) => (
            <button
              key={sectionId}
              type="button"
              onClick={() => navigateTo(sectionId)}
            >
              {label}
            </button>
          ))}
          <button
            className="nav-cta"
            type="button"
            onClick={() => navigateTo("contact")}
          >
            Start a conversation <ArrowUpRight size={15} />
          </button>
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
