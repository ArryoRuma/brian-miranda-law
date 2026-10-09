import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  assembleRepositoryContent,
  translationDocumentSchema,
} from "../../lib/content/collections";
import { createLocalizedContent } from "../../lib/content/localization";
import {
  getPreviewRoutes,
  getPublicRoutes,
  getStaticPageRoutes,
  siteContentSchema,
} from "../../lib/content/schema";
import {
  loadRepositoryContent,
  loadRepositoryDocuments,
} from "../helpers/repository-content";

const repository = loadRepositoryContent();

describe("site content collections and domain schema", () => {
  it("assembles the Nuxt Content documents and derives every route", () => {
    expect(repository.siteCopy.site.name).toBe("Miranda Law");
    expect(getStaticPageRoutes(repository.siteCopy)).toHaveLength(17);
    expect(Object.keys(repository.siteCopy.pages).sort()).toEqual([
      "about",
      "contact",
      "estate-planning",
      "health-care-directives",
      "other-services",
      "powers-of-attorney",
      "resources",
      "trusts",
      "wills",
    ]);
    expect(repository.siteCopy.pages.about.layout).toEqual({
      template: "about",
      biographySectionId: "background",
      credentialSectionIds: ["education", "admissions"],
    });
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

  it("matches the localized content snapshots", () => {
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
      es: "fc16f86b5c2252f5ab0f1370f9caece232f7dd5cc4273b5dbe3d6e9d30a7083d",
      pt: "b8e66c43ba85b7b04196446236e49800295456bd61c88ec3a62ced4cfaa85b98",
    });
  });

  it("requires every singleton collection", () => {
    const documents = loadRepositoryDocuments();
    documents.site = [];
    expect(() => assembleRepositoryContent(documents)).toThrow(
      "Site collection must contain exactly one document"
    );
  });

  it("rejects duplicate document identities", () => {
    const documents = loadRepositoryDocuments();
    documents.pages.push(structuredClone(documents.pages[0]!));
    expect(() => assembleRepositoryContent(documents)).toThrow(
      "Pages collection contains duplicate document keys"
    );
  });

  it("rejects missing, stale, blank, and unknown translations", () => {
    const source = { heading: "Canonical English" };
    expect(() => createLocalizedContent(source, "es", {})).toThrow(
      "Missing es translation for heading"
    );
    expect(() =>
      createLocalizedContent(source, "es", {
        heading: { source: "Old English", value: "Español" },
      })
    ).toThrow("Stale es translation source for heading");
    expect(
      translationDocumentSchema.safeParse({
        entries: [
          { path: "heading", source: "Canonical English", value: "   " },
        ],
      }).success
    ).toBe(false);
    expect(() =>
      createLocalizedContent(source, "es", {
        heading: { source: "Canonical English", value: "Español" },
        unknown: { source: "Unknown", value: "Desconocido" },
      })
    ).toThrow("Unknown es translation path unknown");
  });

  it("rejects duplicate translation paths across documents", () => {
    const documents = loadRepositoryDocuments();
    documents.translationsEs.push(
      structuredClone(documents.translationsEs[0]!)
    );
    expect(() => assembleRepositoryContent(documents)).toThrow(
      /Duplicate es translation path/
    );
  });

  it("rejects malformed contact, URL, route, and navigation data", () => {
    const invalidPhone = structuredClone(repository.siteCopy);
    invalidPhone.site.contact.phoneHref = "908-424-1011";
    expect(siteContentSchema.safeParse(invalidPhone).success).toBe(false);

    const mismatchedPhone = structuredClone(repository.siteCopy);
    mismatchedPhone.site.contact.phoneDisplay = "908-424-9999";
    expect(siteContentSchema.safeParse(mismatchedPhone).success).toBe(false);

    const invalidUrl = structuredClone(repository.siteCopy);
    invalidUrl.site.url = "http://bmirandalaw.com/example";
    expect(siteContentSchema.safeParse(invalidUrl).success).toBe(false);

    const duplicateRoute = structuredClone(repository.siteCopy);
    duplicateRoute.pages.about.path =
      duplicateRoute.pages["estate-planning"].path;
    expect(siteContentSchema.safeParse(duplicateRoute).success).toBe(false);

    const missingRoute = structuredClone(repository.siteCopy);
    const about = missingRoute.site.navigation.primary.find(
      item => item.id === "about"
    );
    if (!about) throw new Error("About navigation fixture is missing");
    about.href = "/missing-page";
    expect(siteContentSchema.safeParse(missingRoute).success).toBe(false);

    const missingNavigation = structuredClone(repository.siteCopy);
    missingNavigation.site.navigation.primary =
      missingNavigation.site.navigation.primary.filter(
        item => item.id !== "contact"
      );
    expect(siteContentSchema.safeParse(missingNavigation).success).toBe(false);
  });

  it("keeps typed sections exhaustive and strict", () => {
    const sectionTypes = Object.values(repository.siteCopy.pages)
      .flatMap(page => page.sections)
      .reduce<Record<string, number>>((counts, section) => {
        counts[section.type] = (counts[section.type] ?? 0) + 1;
        return counts;
      }, {});
    expect(sectionTypes).toEqual({
      narrative: 17,
      checklist: 17,
      cards: 13,
      steps: 5,
    });

    const wrongType = structuredClone(repository.siteCopy);
    Object.assign(wrongType.pages.about.sections[0]!, { type: "checklist" });
    expect(siteContentSchema.safeParse(wrongType).success).toBe(false);

    const mixedPayload = structuredClone(repository.siteCopy);
    Object.assign(mixedPayload.pages.about.sections[0]!, {
      bullets: ["This field does not belong on a narrative section."],
    });
    expect(siteContentSchema.safeParse(mixedPayload).success).toBe(false);
  });

  it("rejects invalid About layout references", () => {
    const content = structuredClone(repository.siteCopy);
    content.pages.about.layout!.biographySectionId = "missing";
    expect(siteContentSchema.safeParse(content).success).toBe(false);
  });

  it("locks the approved free initial consultation wording", () => {
    const source = JSON.stringify(repository.siteCopyByLocale);
    expect(source).toContain("Schedule a Free Initial Consultation");
    expect(source).toContain("Schedule Your Free Initial Consultation");
    expect(source).toContain("A free initial consultation is available");
    expect(source).not.toMatch(/schedule (?:a|your) free consultation/i);
    expect(source).not.toMatch(
      /initial consultations? (?:are |is )?available at no charge/i
    );
    expect(source).toContain("Consulta inicial gratuita");
    expect(source).toContain("consulta inicial gratuita");
  });
});
