import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse, stringify } from "yaml";
import {
  loadRepositoryContent,
  loadSiteContent,
  loadTranslationOverlay,
} from "../../lib/content/load-content";
import { createLocalizedContent } from "../../lib/content/localization";
import {
  getPreviewRoutes,
  getPublicRoutes,
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

type OverlayRecord = Record<string, { source: string; value: string }>;

function updateOverlayFixture(
  rootDirectory: string,
  locale: "es" | "pt",
  relativePath: string,
  update: (record: OverlayRecord) => void
) {
  const filePath = join(
    rootDirectory,
    "content/site/localization",
    locale,
    relativePath
  );
  const record = parse(readFileSync(filePath, "utf8")) as OverlayRecord;
  update(record);
  writeFileSync(filePath, stringify(record));
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
    expect(repository.siteCopyByLocale.es.pages.about.title).toBe(
      "Acerca de Brian Miranda"
    );
    expect(repository.siteCopyByLocale.pt.home.hero.title).not.toBe(
      repository.siteCopy.home.hero.title
    );
    const publicRoutes = getPublicRoutes(repository.siteCopy);
    expect(publicRoutes).toHaveLength(51);
    expect(publicRoutes.some(route => route.startsWith("/en"))).toBe(false);
    expect(
      publicRoutes.some(route => /\/(?:es|pt)\/(?:es|pt)(?:\/|$)/.test(route))
    ).toBe(false);
    expect(publicRoutes.some(route => route.startsWith("/start/"))).toBe(false);
    expect(getPreviewRoutes()).toEqual([
      "/start/en",
      "/start/en/what-happens-next",
      "/start/es",
      "/start/es/what-happens-next",
      "/start/pt",
      "/start/pt/what-happens-next",
    ]);
  });

  it("matches the pre-migration localized content snapshots", () => {
    const canonicalize = (value: unknown): unknown => {
      if (Array.isArray(value)) return value.map(canonicalize);
      if (!value || typeof value !== "object") return value;
      return Object.fromEntries(
        Object.entries(value)
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([key, child]) => [key, canonicalize(child)])
      );
    };
    const digest = (locale: "es" | "pt") =>
      createHash("sha256")
        .update(
          JSON.stringify(canonicalize(repository.siteCopyByLocale[locale]))
        )
        .digest("hex");

    expect({ es: digest("es"), pt: digest("pt") }).toEqual({
      es: "a8ca8d2b8b3d6bcd4ca2e886fbac458ca9f16283f70421e900f04c42f3aa3bec",
      pt: "32794f6ca3aefca9dadd04337635416c9bda4e2566bc13858896527a10d50301",
    });
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

  it("rejects a missing translation overlay field", () => {
    withContentFixture(rootDirectory => {
      updateOverlayFixture(rootDirectory, "es", "pages/about.yml", record => {
        delete record.title;
      });
      const source = loadSiteContent(rootDirectory);
      expect(() =>
        createLocalizedContent(
          source,
          "es",
          loadTranslationOverlay(rootDirectory, "es")
        )
      ).toThrow("Missing es translation for pages.about.title");
    });
  });

  it("rejects a stale translation source", () => {
    withContentFixture(rootDirectory => {
      updateOverlayFixture(rootDirectory, "es", "pages/about.yml", record => {
        record.title.source = "An outdated English title";
      });
      const source = loadSiteContent(rootDirectory);
      expect(() =>
        createLocalizedContent(
          source,
          "es",
          loadTranslationOverlay(rootDirectory, "es")
        )
      ).toThrow(
        /Stale es translation source for pages\.about\.title.*pages\/about\.yml/
      );
    });
  });

  it("rejects blank translation values", () => {
    withContentFixture(rootDirectory => {
      updateOverlayFixture(rootDirectory, "es", "pages/about.yml", record => {
        record.title.value = "   ";
      });
      expect(() => loadTranslationOverlay(rootDirectory, "es")).toThrow(
        /Invalid es translation overlay.*pages\/about\.yml/
      );
    });
  });

  it("rejects extra translation paths", () => {
    withContentFixture(rootDirectory => {
      updateOverlayFixture(rootDirectory, "es", "pages/about.yml", record => {
        record["unknown.field"] = {
          source: "Unknown source",
          value: "Valor desconocido",
        };
      });
      const source = loadSiteContent(rootDirectory);
      expect(() =>
        createLocalizedContent(
          source,
          "es",
          loadTranslationOverlay(rootDirectory, "es")
        )
      ).toThrow(
        /Unknown es translation path pages\.about\.unknown\.field.*pages\/about\.yml/
      );
    });
  });

  it("reports duplicate translation paths with their overlay file", () => {
    withContentFixture(rootDirectory => {
      writeFileSync(
        join(rootDirectory, "content/site/localization/es/pages/about.yml"),
        [
          "title:",
          "  source: About Brian Miranda",
          "  value: Acerca de Brian Miranda",
          "title:",
          "  source: About Brian Miranda",
          "  value: Acerca de Brian Miranda",
          "",
        ].join("\n")
      );
      expect(() => loadTranslationOverlay(rootDirectory, "es")).toThrow(
        /^Invalid YAML in content\/site\/localization\/es\/pages\/about\.yml:/
      );
    });
  });

  it("rejects overlay files with no matching English fragment", () => {
    withContentFixture(rootDirectory => {
      writeFileSync(
        join(rootDirectory, "content/site/localization/es/pages/unknown.yml"),
        "title:\n  source: Unknown\n  value: Desconocido\n"
      );
      expect(() => loadTranslationOverlay(rootDirectory, "es")).toThrow(
        "Unknown es translation overlay: content/site/localization/es/pages/unknown.yml"
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
