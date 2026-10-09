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
  getLocationPath,
  locationHubPath,
  locationsSchema,
  siteContentSchema,
} from "../../lib/content/schema";
import { buildLlmsTxt } from "../../lib/seo/llms";
import {
  buildAttorneyNode,
  buildLegalServiceIdentity,
  buildLocationDirectorySchema,
  buildOfferCatalog,
  getSchemaIds,
} from "../../lib/seo/schema";
import {
  loadRepositoryContent,
  loadRepositoryDocuments,
} from "../helpers/repository-content";

const repository = loadRepositoryContent();

describe("site content collections and domain schema", () => {
  it("builds a connected legal-service graph from canonical content", () => {
    const identity = buildLegalServiceIdentity(repository.siteCopy);
    const areas = identity.areaServed as Array<{
      containsPlace: unknown[];
      name: string;
    }>;
    const catalog = buildOfferCatalog(repository.siteCopy);
    const offers = catalog.itemListElement as unknown[];
    const attorney = buildAttorneyNode(repository.siteCopy);
    const directory = buildLocationDirectorySchema(repository.siteCopy);
    const itemList = directory.find(node => node["@type"] === "ItemList")!;

    expect(identity["@type"]).toBe("LegalService");
    expect(identity["@id"]).toBe(
      getSchemaIds(repository.siteCopy.site.url).legalService
    );
    expect(areas).toHaveLength(9);
    expect(
      areas.reduce((count, county) => count + county.containsPlace.length, 0)
    ).toBe(45);
    expect(offers).toHaveLength(10);
    expect(attorney.worksFor).toEqual({
      "@id": getSchemaIds(repository.siteCopy.site.url).legalService,
    });
    expect(attorney.alumniOf).toHaveLength(2);
    expect(attorney.hasCredential).toHaveLength(3);
    expect(itemList.numberOfItems).toBe(45);
  });

  it("publishes a source-driven llms.txt without private preview routes", () => {
    const llms = buildLlmsTxt(repository.siteCopy, repository.blogPosts);

    expect(llms).toContain("# Miranda Law");
    expect(llms).toContain(
      "Community pages identify service areas, not separate offices"
    );
    expect(llms).toContain("## Estate Planning Services");
    expect(llms).toContain("## Communities Served — Bergen County");
    expect(llms).toContain(
      "https://bmirandalaw.com/estate-planning/locations/hackensack-nj.md"
    );
    expect(llms).toContain("https://bmirandalaw.com/es.md");
    expect(llms).toContain("https://bmirandalaw.com/pt.md");
    expect(llms).toContain("https://bmirandalaw.com/llms-full.txt");
    expect(llms).not.toContain("/start/");
  });

  it("assembles the Nuxt Content documents and derives every route", () => {
    expect(repository.siteCopy.site.name).toBe("Miranda Law");
    expect(getStaticPageRoutes(repository.siteCopy)).toHaveLength(63);
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
    expect(publicRoutes).toHaveLength(189);
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
      es: "5cf85ee3081f2ea1fced40d009519871981e8d5217de6580481957503bd1a112",
      pt: "3ef1bbbb7b41fc09f8fda5c166fec045fbbafe9dea4f3acdb332ce7c4d38df53",
    });
  });

  it("publishes the approved municipality roster in every language", () => {
    const locations = repository.siteCopy.locations;
    expect(locations.counties.map(county => county.name)).toEqual([
      "Bergen",
      "Hudson",
      "Essex",
      "Passaic",
      "Union",
      "Middlesex",
      "Mercer",
      "Morris",
      "Monmouth",
    ]);
    expect(
      locations.counties.map(county => county.municipalities.length)
    ).toEqual([8, 9, 5, 5, 6, 7, 2, 2, 1]);
    const municipalities = locations.counties.flatMap(
      county => county.municipalities
    );
    expect(municipalities).toHaveLength(45);
    expect(
      locations.counties
        .find(county => county.name === "Bergen")
        ?.municipalities.find(
          municipality => municipality.name === "North Arlington"
        )?.type
    ).toBe("borough");
    expect(
      locations.counties
        .find(county => county.name === "Hudson")
        ?.municipalities.some(
          municipality => municipality.name === "North Bergen"
        )
    ).toBe(true);
    expect(
      municipalities.some(municipality => municipality.name === "Camden")
    ).toBe(false);

    const locationRoutes = [
      locationHubPath,
      ...municipalities.map(municipality => getLocationPath(municipality.slug)),
    ];
    const publicRoutes = getPublicRoutes(repository.siteCopy);
    for (const prefix of ["", "/es", "/pt"]) {
      for (const route of locationRoutes) {
        expect(publicRoutes).toContain(`${prefix}${route}`);
      }
    }
    for (const locale of ["en", "es", "pt"] as const) {
      expect(
        locationRoutes.every(
          route =>
            repository.siteCopy.localization.review[locale].pages[route] ===
            (locale === "en" ? "approved" : "draft")
        )
      ).toBe(true);
    }
  });

  it("rejects duplicate and malformed municipality data", () => {
    const duplicateSlug = structuredClone(repository.siteCopy.locations);
    duplicateSlug.counties[0]!.municipalities[1]!.slug =
      duplicateSlug.counties[0]!.municipalities[0]!.slug;
    expect(locationsSchema.safeParse(duplicateSlug).success).toBe(false);

    const duplicateName = structuredClone(repository.siteCopy.locations);
    duplicateName.counties[1]!.municipalities[0]!.name =
      duplicateName.counties[0]!.municipalities[0]!.name;
    expect(locationsSchema.safeParse(duplicateName).success).toBe(false);

    const unknownField = structuredClone(
      repository.siteCopy.locations
    ) as typeof repository.siteCopy.locations & { fakeOffice?: string };
    unknownField.fakeOffice = "Hackensack";
    expect(locationsSchema.safeParse(unknownField).success).toBe(false);
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
      cards: 14,
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
