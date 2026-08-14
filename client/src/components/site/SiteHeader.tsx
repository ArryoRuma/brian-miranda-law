import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { LANGUAGE_LINKS, SITE_NAVIGATION } from "@/site/siteConfig";
import { MobileContactBar, PrimaryContactActions } from "./ContactActions";

export function SiteHeader() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [estateMenuOpen, setEstateMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const estateItemRef = useRef<HTMLDivElement>(null);
  const estateToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setEstateMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const firstNavigationLink =
      navigationRef.current?.querySelector<HTMLElement>("a, button");
    firstNavigationLink?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        estateMenuOpen &&
        !estateItemRef.current?.contains(event.target as Node)
      ) {
        setEstateMenuOpen(false);
      }
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (menuOpen) {
        setMenuOpen(false);
        setEstateMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (estateMenuOpen) {
        setEstateMenuOpen(false);
        estateToggleRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [estateMenuOpen, menuOpen]);

  const closeMobileMenu = (restoreFocus = true) => {
    setMenuOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  };

  const handleHeaderKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!menuOpen || event.key !== "Tab" || !headerRef.current) return;

    const focusable = Array.from(
      headerRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])"
      )
    ).filter(element => element.getClientRects().length > 0);

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const estateItem = SITE_NAVIGATION[0];

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="desktop-rail" aria-hidden="true">
        <span className="rail-mark">BM</span>
        <span className="rail-line" />
        <span className="rail-label">Brian Miranda Law</span>
      </div>
      <header
        className="site-header"
        ref={headerRef}
        onKeyDown={handleHeaderKeyDown}
      >
        <Link className="brand-lockup" href="/" aria-label="Miranda Law home">
          <img
            className="brand-logo"
            src="/miranda-law-gold.png"
            alt="Miranda Law, Attorneys at Law"
            width="2434"
            height="2401"
          />
        </Link>

        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-controls="main-navigation"
          aria-expanded={menuOpen}
          onClick={() => {
            if (menuOpen) closeMobileMenu();
            else setMenuOpen(true);
          }}
        >
          {menuOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </button>

        <nav
          ref={navigationRef}
          id="main-navigation"
          className={menuOpen ? "main-nav is-open" : "main-nav"}
          aria-label="Main navigation"
        >
          <div
            ref={estateItemRef}
            className="nav-item-with-menu"
            onPointerEnter={() => setEstateMenuOpen(true)}
            onPointerLeave={() => setEstateMenuOpen(false)}
            onFocusCapture={() => setEstateMenuOpen(true)}
            onBlurCapture={event => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setEstateMenuOpen(false);
              }
            }}
          >
            <div className="nav-parent-row">
              <Link
                className={
                  location.startsWith(estateItem.href) ? "is-active" : ""
                }
                href={estateItem.href}
                aria-current={location === estateItem.href ? "page" : undefined}
              >
                {estateItem.label}
              </Link>
              <button
                ref={estateToggleRef}
                className="nav-submenu-toggle"
                type="button"
                aria-label="Toggle Estate Planning pages"
                aria-expanded={estateMenuOpen}
                aria-controls="estate-planning-submenu"
                onClick={event => {
                  if (event.detail > 0) setEstateMenuOpen(true);
                  else setEstateMenuOpen(current => !current);
                }}
              >
                <ChevronDown size={16} aria-hidden="true" />
              </button>
            </div>
            <div
              id="estate-planning-submenu"
              className={estateMenuOpen ? "nav-submenu is-open" : "nav-submenu"}
            >
              {estateItem.children?.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={location === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {SITE_NAVIGATION.slice(1).map(item => (
            <Link
              key={item.href}
              className={location === item.href ? "is-active" : ""}
              href={item.href}
              aria-current={location === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}

          <div className="nav-languages" aria-label="Questionnaire previews">
            {LANGUAGE_LINKS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                aria-label={`Open the ${item.language} questionnaire preview`}
                aria-current={location === item.href ? "page" : undefined}
              >
                <span className="language-short" aria-hidden="true">
                  {item.label}
                </span>
                <span className="language-full">{item.language}</span>
              </Link>
            ))}
          </div>

          <PrimaryContactActions className="nav-contact-actions" compact />
        </nav>

        {menuOpen ? (
          <button
            className="nav-backdrop"
            type="button"
            aria-label="Close navigation menu"
            tabIndex={-1}
            onClick={() => closeMobileMenu()}
          />
        ) : null}
      </header>
      <MobileContactBar />
    </>
  );
}
