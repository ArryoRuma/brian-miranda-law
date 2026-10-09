import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getLocationPath,
  getPreviewRoutes,
  getPublicRoutes,
  locationHubPath,
} from "../../lib/content/schema";
import { loadRepositoryContent } from "../helpers/repository-content";

const outputDirectory = join(process.cwd(), ".output", "public");
const repository = loadRepositoryContent();
const publicRoutes = [
  ...getPublicRoutes(repository.siteCopy),
  ...(repository.blogPosts.length
    ? [
        repository.siteCopy.blog.path,
        ...repository.blogPosts.map(post => `/blog/${post.slug}`),
      ]
    : []),
];
const previewRoutes = getPreviewRoutes();
const deploymentBasePath = "";
const deploymentSiteUrl = `${repository.siteCopy.site.url}${deploymentBasePath}`;

const routeFile = (route: string) =>
  route === "/"
    ? join(outputDirectory, "index.html")
    : join(outputDirectory, route.slice(1), "index.html");

const collectFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  });

const readSchemaGraph = (route: string) => {
  const html = readFileSync(routeFile(route), "utf8");
  const script = html.match(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/
  )?.[1];
  if (!script) throw new Error(`Schema graph is missing for ${route}`);
  return JSON.parse(script) as {
    "@graph": Array<Record<string, unknown>>;
  };
};

describe("generated static site", () => {
  it("configures Vercel to serve generated static output", () => {
    const vercelConfig = JSON.parse(
      readFileSync(join(process.cwd(), "vercel.json"), "utf8")
    ) as { buildCommand: string; outputDirectory: string };

    expect(vercelConfig).toMatchObject({
      buildCommand: "NITRO_PRESET=vercel pnpm build",
      outputDirectory: ".vercel/output",
    });
  });

  it("renders every public and preview route", () => {
    for (const route of [...publicRoutes, ...previewRoutes]) {
      expect(existsSync(routeFile(route)), route).toBe(true);
    }
  });

  it("does not emit retired or server-only routes", () => {
    expect(existsSync(routeFile("/index-backup"))).toBe(false);
    expect(existsSync(routeFile("/api/health"))).toBe(false);
    expect(existsSync(routeFile("/api/contact"))).toBe(false);
    expect(existsSync(routeFile("/en"))).toBe(false);
    expect(existsSync(routeFile("/es/es/about"))).toBe(false);
    expect(existsSync(routeFile("/es/start/en"))).toBe(false);
    expect(existsSync(routeFile("/pt/start/pt"))).toBe(false);
  });

  it("publishes the migrated blog and its article routes", () => {
    expect(repository.blogPosts).toHaveLength(9);
    const blogHtml = readFileSync(routeFile("/blog"), "utf8");
    expect(blogHtml).toContain('<meta name="robots" content="index, follow">');
    expect(blogHtml).toContain('class="blog-index-section"');

    for (const post of repository.blogPosts) {
      const route = `/blog/${post.slug}`;
      const html = readFileSync(routeFile(route), "utf8");
      expect(html).toContain(`<h1>${post.title.replaceAll("'", "&#39;")}</h1>`);
      expect(blogHtml).toContain(`href="${route}"`);
    }
  });

  it("renders the attorney profile in every language without changing service layouts", () => {
    for (const prefix of ["", "/es", "/pt"]) {
      const html = readFileSync(routeFile(`${prefix}/about`), "utf8");
      expect(html).toContain('class="about-page"');
      expect(html).toContain("brian-old-headshot.jpg");
      expect(html).toContain('id="education"');
      expect(html).toContain('id="admissions"');
      expect(html).toContain("Seton Hall University");
      expect(html).toContain("New York Law School");
      expect(html).toContain("wa.me/19084241011");
      expect(html).not.toContain('data-section-type="steps"');
      expect(html.match(/<h1(?:\s|>)/g)).toHaveLength(1);
      const service = readFileSync(
        routeFile(`${prefix}/estate-planning`),
        "utf8"
      );
      expect(service).toContain('class="interior-hero"');
      expect(service).not.toContain('class="about-page"');
    }
  });

  it("renders the detailed contact experience", () => {
    const contactHtml = readFileSync(routeFile("/contact"), "utf8");
    expect(contactHtml).toContain("Choose the easiest way to reach the office");
    expect(contactHtml).toContain("Message on WhatsApp");
    expect(contactHtml).toContain("Tell the office how to reach you");
    expect(contactHtml).toContain("Do not include confidential");
  });

  it("renders the approved consultation offer wording", () => {
    const homeHtml = readFileSync(routeFile("/"), "utf8");
    const contactHtml = readFileSync(routeFile("/contact"), "utf8");

    expect(homeHtml).toContain("Schedule a Free Initial Consultation");
    expect(homeHtml).toContain("Schedule Your Free Initial Consultation");
    expect(contactHtml).toContain("A free initial consultation is available");
    expect(homeHtml).not.toMatch(/schedule (?:a|your) free consultation/i);
    expect(contactHtml).not.toMatch(
      /initial consultations? (?:are |is )?available at no charge/i
    );
  });

  it("keeps the sitemap and agents manifest aligned", () => {
    const sitemapIndex = readFileSync(
      join(outputDirectory, "sitemap_index.xml"),
      "utf8"
    );
    const sitemap = ["en-US", "es-US", "pt-BR"]
      .map(locale =>
        readFileSync(
          join(outputDirectory, "__sitemap__", `${locale}.xml`),
          "utf8"
        )
      )
      .join("\n");
    const agents = JSON.parse(
      readFileSync(join(outputDirectory, "agents.json"), "utf8")
    ) as { publicPages: string[] };

    for (const locale of ["en-US", "es-US", "pt-BR"]) {
      expect(sitemapIndex).toContain(
        `<loc>${deploymentSiteUrl}/__sitemap__/${locale}.xml</loc>`
      );
    }
    expect([...agents.publicPages].sort()).toEqual([...publicRoutes].sort());
    for (const route of publicRoutes) {
      const sitemapRoute = route === "/" && deploymentBasePath ? "" : route;
      const entry = `<loc>${deploymentSiteUrl}${sitemapRoute}</loc>`;
      expect(sitemap).toContain(entry);
    }
    expect(sitemap).not.toContain("/start/");
    expect(sitemap).toContain(`${deploymentSiteUrl}/blog`);
  });

  it("renders locale-aware metadata and same-page language switches", () => {
    const englishHtml = readFileSync(routeFile("/about"), "utf8");
    const spanishHtml = readFileSync(routeFile("/es/about"), "utf8");
    const portugueseHtml = readFileSync(routeFile("/pt/about"), "utf8");

    expect(englishHtml).toContain('lang="en-US"');
    expect(spanishHtml).toContain('lang="es-US"');
    expect(portugueseHtml).toContain('lang="pt-BR"');
    expect(spanishHtml).toContain(
      `<link id="i18n-can" rel="canonical" href="${deploymentSiteUrl}/es/about">`
    );
    expect(spanishHtml).toContain(
      `rel="alternate" href="${deploymentSiteUrl}/about" hreflang="x-default"`
    );
    expect(spanishHtml).toContain(
      `rel="alternate" href="${deploymentSiteUrl}/pt/about" hreflang="pt-BR"`
    );
    expect(spanishHtml).toContain(
      '<meta id="i18n-og" property="og:locale" content="es_US">'
    );
    expect(englishHtml).toContain(`href="${deploymentBasePath}/es/about"`);
    expect(englishHtml).toContain(`href="${deploymentBasePath}/pt/about"`);
    expect(spanishHtml).toContain(`href="${deploymentBasePath}/about"`);
    expect(spanishHtml).toContain(`href="${deploymentBasePath}/pt/about"`);
  });

  it("renders every location page with same-county links and localized metadata", () => {
    const counties = repository.siteCopy.locations.counties;
    for (const county of counties) {
      for (const municipality of county.municipalities) {
        const basePath = getLocationPath(municipality.slug);
        for (const prefix of ["", "/es", "/pt"]) {
          const locale = (prefix.slice(1) || "en") as "en" | "es" | "pt";
          const route = `${prefix}${basePath}`;
          const html = readFileSync(routeFile(route), "utf8");
          const countySection = html.match(
            /<section class="location-county-section">([\s\S]*?)<\/section>/
          )?.[1];
          expect(countySection, route).toBeDefined();
          expect(html.match(/<h1(?:\s|>)/g), route).toHaveLength(1);
          expect(html, route).toContain(
            `rel="canonical" href="${deploymentSiteUrl}${route}"`
          );
          expect(html, route).toContain(
            `href="${deploymentSiteUrl}${basePath}" hreflang="en-US"`
          );
          expect(html, route).toContain(
            `href="${deploymentSiteUrl}/es${basePath}" hreflang="es-US"`
          );
          expect(html, route).toContain(
            `href="${deploymentSiteUrl}/pt${basePath}" hreflang="pt-BR"`
          );
          expect(html, route).toContain(municipality.name);
          expect(html, route).toContain(`href="${prefix}${locationHubPath}"`);
          expect(html, route).toContain(
            repository.siteCopyByLocale[locale].home.hero.ctaLabel
          );
          expect(html, route).toContain("172 Washington Valley Road");
          expect(html.match(/PostalAddress/g), route).toHaveLength(1);

          const linkedMunicipalities = [
            ...countySection!.matchAll(
              /href="(?:\/es|\/pt)?\/estate-planning\/locations\/([a-z0-9-]+)"/g
            ),
          ].map(match => match[1]);
          expect(linkedMunicipalities, route).toEqual(
            county.municipalities
              .filter(peer => peer.slug !== municipality.slug)
              .map(peer => peer.slug)
          );
        }
      }
    }
  });

  it("emits a connected firm, attorney, service-area, and page graph", () => {
    const homeGraph = readSchemaGraph("/")["@graph"];
    const identity = homeGraph.find(
      node => node["@id"] === `${repository.siteCopy.site.url}/#legal-service`
    )!;
    const attorney = homeGraph.find(
      node => node["@id"] === `${repository.siteCopy.site.url}/#brian-miranda`
    )!;
    const serviceAreas = identity.areaServed as Array<{
      containsPlace: unknown[];
    }>;
    const catalog = identity.hasOfferCatalog as {
      itemListElement: unknown[];
    };

    expect(identity["@type"]).toEqual([
      "Organization",
      "LocalBusiness",
      "LegalService",
    ]);
    expect(serviceAreas).toHaveLength(9);
    expect(
      serviceAreas.reduce(
        (count, county) => count + county.containsPlace.length,
        0
      )
    ).toBe(45);
    expect(catalog.itemListElement).toHaveLength(10);
    expect(attorney.worksFor).toEqual({
      "@id": `${repository.siteCopy.site.url}/#legal-service`,
    });

    const locationGraph = readSchemaGraph(getLocationPath("hackensack-nj"))[
      "@graph"
    ];
    expect(
      locationGraph.some(
        node =>
          node["@id"] ===
            `${repository.siteCopy.site.url}${getLocationPath("hackensack-nj")}#service` &&
          node["@type"] === "Service"
      )
    ).toBe(true);
    expect(locationGraph.some(node => node["@type"] === "BreadcrumbList")).toBe(
      true
    );

    const directoryGraph = readSchemaGraph(locationHubPath)["@graph"];
    const directory = directoryGraph.find(node => node["@type"] === "ItemList");
    expect(directory?.numberOfItems).toBe(45);
  });

  it("publishes curated AI discovery files without preview-route leakage", () => {
    const llms = readFileSync(join(outputDirectory, "llms.txt"), "utf8");
    const llmsFull = readFileSync(
      join(outputDirectory, "llms-full.txt"),
      "utf8"
    );

    expect(llms).toContain("## Communities Served — Monmouth County");
    expect(llms).toContain(
      `${repository.siteCopy.site.url}/estate-planning/locations/long-branch-nj.md`
    );
    expect(llms).toContain(
      "Community pages identify service areas, not separate offices"
    );
    expect(llms).not.toContain("/start/");
    expect(llmsFull).not.toContain(
      "**Source:** https://bmirandalaw.com/start/"
    );
  });

  it("connects blog articles to the canonical attorney and firm nodes", () => {
    const articleRoute = `/blog/${repository.blogPosts[0]!.slug}`;
    const graph = readSchemaGraph(articleRoute)["@graph"];
    const article = graph.find(node => node["@type"] === "BlogPosting")!;

    expect(article.author).toEqual({
      "@id": `${repository.siteCopy.site.url}/#brian-miranda`,
    });
    expect(article.publisher).toEqual({
      "@id": `${repository.siteCopy.site.url}/#legal-service`,
    });
    expect(JSON.stringify(graph)).not.toContain(
      `${repository.siteCopy.site.url}/#identity`
    );
  });

  it("links all municipalities from the directory, estate page, and footer", () => {
    for (const prefix of ["", "/es", "/pt"]) {
      const hub = readFileSync(
        routeFile(`${prefix}${locationHubPath}`),
        "utf8"
      );
      const estatePlanning = readFileSync(
        routeFile(`${prefix}/estate-planning`),
        "utf8"
      );
      const home = readFileSync(routeFile(prefix || "/"), "utf8");
      expect(hub.match(/<h1(?:\s|>)/g)).toHaveLength(1);
      expect(hub.match(/class="locations-county-group"/g)).toHaveLength(9);
      for (const county of repository.siteCopy.locations.counties) {
        for (const municipality of county.municipalities) {
          expect(hub).toContain(
            `href="${prefix}${getLocationPath(municipality.slug)}"`
          );
        }
      }
      expect(estatePlanning).toContain(`href="${prefix}${locationHubPath}"`);
      expect(home).toContain(`href="${prefix}${locationHubPath}"`);
    }
    const longBranch = readFileSync(
      routeFile(getLocationPath("long-branch-nj")),
      "utf8"
    );
    expect(longBranch).toContain('class="location-county-section"');
    expect(longBranch).not.toContain('class="location-link-grid"');
  });

  it("keeps preview routes outside Nuxt i18n routing and search indexing", () => {
    for (const route of previewRoutes) {
      const html = readFileSync(routeFile(route), "utf8");
      expect(html).toContain(
        '<meta name="robots" content="noindex, nofollow">'
      );
      expect(html).toContain(
        `<link rel="canonical" href="${repository.siteCopy.site.url}${route}">`
      );
    }
  });

  it("ships Nuxt Content as static query data without an application server", () => {
    const files = collectFiles(outputDirectory).map(file =>
      file.slice(outputDirectory.length).toLowerCase()
    );
    expect(
      files.some(
        file =>
          file.includes("/__nuxt_content/") && file.endsWith("/sql_dump.txt")
      )
    ).toBe(true);
    expect(files.some(file => file.endsWith(".sqlite"))).toBe(false);
  });

  it("uses static image assets instead of the Vercel image function", () => {
    const htmlFiles = collectFiles(outputDirectory).filter(file =>
      file.endsWith(".html")
    );

    for (const file of htmlFiles) {
      expect(readFileSync(file, "utf8")).not.toContain("/_vercel/image");
    }
  });
});
