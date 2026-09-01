import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  loadRepositoryContent,
  loadSiteContent,
} from "../../lib/content/load-content";
import {
  getPreviewRoutes,
  getStaticPageRoutes,
  siteContentSchema,
} from "../../lib/content/schema";

const repository = loadRepositoryContent(process.cwd());

function withContentFixture(run: (rootDirectory: string) => void) {
  const rootDirectory = mkdtempSync(join(tmpdir(), "miranda-site-content-"));
  mkdirSync(join(rootDirectory, "content"));
  cpSync("content/site", join(rootDirectory, "content", "site"), {
    recursive: true,
  });
  try {
    run(rootDirectory);
  } finally {
    rmSync(rootDirectory, { recursive: true, force: true });
  }
}

describe("site content schema", () => {
  it("validates the repository YAML and derives every route", () => {
    expect(repository.siteCopy.site.name).toBe("Miranda Law");
    expect(getStaticPageRoutes(repository.siteCopy)).toHaveLength(17);
    expect(Object.keys(repository.siteCopy.pages).sort()).toEqual([
      "about",
      "contact",
      "estatePlanning",
      "health-care-directives",
      "otherServices",
      "powers-of-attorney",
      "resources",
      "trusts",
      "wills",
    ]);
    expect(repository.siteCopy.localization.review.es.status).toBe("approved");
    expect(repository.siteCopy.localization.review.pt.status).toBe("draft");
    expect(getPreviewRoutes()).toEqual([
      "/start/en",
      "/start/en/what-happens-next",
      "/start/es",
      "/start/es/what-happens-next",
      "/start/pt",
      "/start/pt/what-happens-next",
    ]);
  });

  it("rejects a missing required content fragment", () => {
    withContentFixture(rootDirectory => {
      rmSync(join(rootDirectory, "content/site/shared.yml"));
      expect(() => loadSiteContent(rootDirectory)).toThrow(
        "Required content file is missing: content/site/shared.yml"
      );
    });
  });

  it("rejects a content fragment with more than one record", () => {
    withContentFixture(rootDirectory => {
      writeFileSync(
        join(rootDirectory, "content/site/pages/about.yml"),
        "about: {}\nextra: {}\n"
      );
      expect(() => loadSiteContent(rootDirectory)).toThrow(
        "content/site/pages/about.yml must contain exactly one content record"
      );
    });
  });

  it("reports malformed YAML with its fragment path", () => {
    withContentFixture(rootDirectory => {
      writeFileSync(join(rootDirectory, "content/site/home.yml"), "home: [\n");
      expect(() => loadSiteContent(rootDirectory)).toThrow(
        /^Invalid YAML in content\/site\/home\.yml:/
      );
    });
  });

  it("rejects duplicate records across page fragments", () => {
    withContentFixture(rootDirectory => {
      cpSync(
        join(rootDirectory, "content/site/pages/about.yml"),
        join(rootDirectory, "content/site/pages/about-copy.yml")
      );
      expect(() => loadSiteContent(rootDirectory)).toThrow(
        /Duplicate content record "about".*content\/site\/pages\/about-copy\.yml.*content\/site\/pages\/about\.yml/
      );
    });
  });

  it("rejects malformed contact data", () => {
    const content = structuredClone(repository.siteCopy);
    content.site.contact.phoneHref = "908-424-1011";
    expect(siteContentSchema.safeParse(content).success).toBe(false);
  });

  it("rejects a display number that does not match its contact URL", () => {
    const content = structuredClone(repository.siteCopy);
    content.site.contact.phoneDisplay = "908-424-9999";
    expect(siteContentSchema.safeParse(content).success).toBe(false);
  });

  it("rejects a non-origin or insecure canonical URL", () => {
    const content = structuredClone(repository.siteCopy);
    content.site.url = "http://bmirandalaw.com/example";
    expect(siteContentSchema.safeParse(content).success).toBe(false);
  });

  it("rejects duplicate page routes", () => {
    const content = structuredClone(repository.siteCopy);
    content.pages.about.path = content.pages.estatePlanning.path;
    expect(siteContentSchema.safeParse(content).success).toBe(false);
  });

  it("rejects navigation links without a known route", () => {
    const content = structuredClone(repository.siteCopy);
    const about = content.site.navigation.primary.find(
      item => item.id === "about"
    );
    if (!about) throw new Error("About navigation fixture is missing");
    about.href = "/missing-page";
    expect(siteContentSchema.safeParse(content).success).toBe(false);
  });

  it("rejects a missing required navigation record", () => {
    const content = structuredClone(repository.siteCopy);
    content.site.navigation.primary = content.site.navigation.primary.filter(
      item => item.id !== "contact"
    );
    expect(siteContentSchema.safeParse(content).success).toBe(false);
  });

  it("rejects positional content with the wrong cardinality", () => {
    const content = structuredClone(repository.siteCopy);
    content.home.why.items.pop();
    expect(siteContentSchema.safeParse(content).success).toBe(false);
  });

  it("uses an explicit type for every editorial section", () => {
    const sectionTypes = Object.values(repository.siteCopy.pages)
      .flatMap(page => page.sections)
      .reduce<Record<string, number>>((counts, section) => {
        counts[section.type] = (counts[section.type] ?? 0) + 1;
        return counts;
      }, {});

    expect(sectionTypes).toEqual({
      narrative: 17,
      checklist: 15,
      cards: 13,
      steps: 6,
    });
  });

  it("rejects a section discriminator with the wrong payload", () => {
    const content = structuredClone(repository.siteCopy);
    content.pages.about.sections[0].type = "checklist";
    expect(siteContentSchema.safeParse(content).success).toBe(false);
  });

  it("rejects mixed section payload fields", () => {
    const content = structuredClone(repository.siteCopy);
    Object.assign(content.pages.about.sections[0], {
      bullets: ["This field does not belong on a narrative section."],
    });
    expect(siteContentSchema.safeParse(content).success).toBe(false);
  });

  it("rejects a section with its required payload removed", () => {
    const content = structuredClone(repository.siteCopy);
    const section = content.pages.about.sections[0];
    if (section.type !== "narrative") {
      throw new Error("About-page narrative fixture is missing");
    }
    delete (section as { body?: string[] }).body;
    expect(siteContentSchema.safeParse(content).success).toBe(false);
  });

  it("locks the approved free initial consultation wording", () => {
    const source = JSON.stringify(repository.siteCopy);

    expect(source).toContain("Schedule a Free Initial Consultation");
    expect(source).toContain("Schedule Your Free Initial Consultation");
    expect(source).toContain("A free initial consultation is available");
    expect(source).not.toMatch(/schedule (?:a|your) free consultation/i);
    expect(source).not.toMatch(
      /initial consultations? (?:are |is )?available at no charge/i
    );
    expect(source).not.toContain(
      "provides an initial consultation at no charge"
    );

    expect(source).toContain("Consulta inicial gratuita");
    expect(source).toContain("consulta inicial gratuita");
  });
});
