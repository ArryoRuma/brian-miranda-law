import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
  join(process.cwd(), "app/assets/css/main.css"),
  "utf8"
);
const siteHeader = readFileSync(
  join(process.cwd(), "app/components/SiteHeader.vue"),
  "utf8"
);

describe("site header layout", () => {
  it("keeps the sticky header outside a scroll container", () => {
    expect(stylesheet).toMatch(/\.site-shell\s*\{[^}]*\boverflow:\s*clip;/s);
    expect(stylesheet).toMatch(
      /\.site-header\s*\{[^}]*\bposition:\s*sticky;[^}]*\btop:\s*0;/s
    );
  });

  it("keeps the mobile submenu collapsed until it is opened", () => {
    const mobileStart = stylesheet.indexOf("@media (max-width: 1120px) {");
    const mobileEnd = stylesheet.indexOf("\n@media", mobileStart + 1);
    const mobileStyles = stylesheet.slice(mobileStart, mobileEnd);

    expect(mobileStyles).toMatch(
      /\.main-nav\s*\{[^}]*position:\s*absolute;[^}]*top:\s*100%;/s
    );
    expect(mobileStyles).toMatch(
      /\.main-nav\s*>\s*a,\s*\.nav-parent-row\s*>\s*a\s*\{[^}]*flex:\s*none;/s
    );
    expect(mobileStyles).toMatch(/\.nav-submenu\s*\{[^}]*display:\s*none;/s);
    expect(mobileStyles).toMatch(
      /\.nav-submenu\.is-open\s*\{[^}]*display:\s*grid;/s
    );
  });

  it("does not render a sticky mobile contact bar", () => {
    expect(siteHeader).not.toContain("mobile-contact-bar");
    expect(stylesheet).not.toContain("mobile-contact-bar");
    expect(stylesheet).not.toMatch(/padding-bottom:\s*72px/);
  });
});
