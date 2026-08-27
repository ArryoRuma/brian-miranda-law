import { describe, expect, it } from "vitest";
import { loadRepositoryContent } from "../../lib/content/load-content";
import {
  getPreviewRoutes,
  getStaticPageRoutes,
  siteContentSchema,
} from "../../lib/content/schema";

const repository = loadRepositoryContent(process.cwd());

describe("site content schema", () => {
  it("validates the repository YAML and derives every route", () => {
    expect(repository.siteCopy.site.name).toBe("Miranda Law");
    expect(getStaticPageRoutes(repository.siteCopy)).toHaveLength(17);
    expect(getPreviewRoutes()).toEqual([
      "/start/en",
      "/start/en/what-happens-next",
      "/start/es",
      "/start/es/what-happens-next",
      "/start/pt",
      "/start/pt/what-happens-next",
    ]);
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
});
