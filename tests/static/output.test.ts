import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadRepositoryContent } from "../../lib/content/load-content";
import { getPreviewRoutes, getPublicRoutes } from "../../lib/content/schema";

const outputDirectory = join(process.cwd(), ".output", "public");
const repository = loadRepositoryContent(process.cwd());
const publicRoutes = getPublicRoutes(repository.siteCopy);
const previewRoutes = getPreviewRoutes();

const routeFile = (route: string) =>
  route === "/"
    ? join(outputDirectory, "index.html")
    : join(outputDirectory, route.slice(1), "index.html");

const collectFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  });

describe("generated static site", () => {
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

  it("keeps the empty blog private", () => {
    expect(repository.blogPosts).toHaveLength(0);
    expect(existsSync(routeFile("/blog"))).toBe(false);
  });

  it("renders the detailed contact experience", () => {
    const contactHtml = readFileSync(routeFile("/contact"), "utf8");
    expect(contactHtml).toContain("Choose the easiest way to reach the office");
    expect(contactHtml).toContain("Message on WhatsApp");
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
        `<loc>${repository.siteCopy.site.url}/__sitemap__/${locale}.xml</loc>`
      );
    }
    expect([...agents.publicPages].sort()).toEqual([...publicRoutes].sort());
    for (const route of publicRoutes) {
      const entry = `<loc>${repository.siteCopy.site.url}${route === "/" ? "/" : route}</loc>`;
      expect(sitemap.split(entry)).toHaveLength(2);
    }
    expect(sitemap).not.toContain("/start/");
    expect(sitemap).not.toContain("/blog");
  });

  it("renders locale-aware metadata and same-page language switches", () => {
    const englishHtml = readFileSync(routeFile("/about"), "utf8");
    const spanishHtml = readFileSync(routeFile("/es/about"), "utf8");
    const portugueseHtml = readFileSync(routeFile("/pt/about"), "utf8");

    expect(englishHtml).toContain('lang="en-US"');
    expect(spanishHtml).toContain('lang="es-US"');
    expect(portugueseHtml).toContain('lang="pt-BR"');
    expect(spanishHtml).toContain(
      '<link id="i18n-can" rel="canonical" href="https://bmirandalaw.com/es/about">'
    );
    expect(spanishHtml).toContain(
      'rel="alternate" href="https://bmirandalaw.com/about" hreflang="x-default"'
    );
    expect(spanishHtml).toContain(
      'rel="alternate" href="https://bmirandalaw.com/pt/about" hreflang="pt-BR"'
    );
    expect(spanishHtml).toContain(
      '<meta id="i18n-og" property="og:locale" content="es_US">'
    );
    expect(englishHtml).toContain('href="/es/about"');
    expect(englishHtml).toContain('href="/pt/about"');
    expect(spanishHtml).toContain('href="/about"');
    expect(spanishHtml).toContain('href="/pt/about"');
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

  it("ships no SQLite database runtime", () => {
    const files = collectFiles(outputDirectory).map(file => file.toLowerCase());
    expect(files.some(file => file.includes("sqlite"))).toBe(false);
    expect(files.some(file => file.endsWith(".wasm"))).toBe(false);
  });
});
