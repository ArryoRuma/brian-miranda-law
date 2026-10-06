import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getPreviewRoutes, getPublicRoutes } from "../../lib/content/schema";
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

describe("generated static site", () => {
  it("configures Vercel to serve generated static output", () => {
    const vercelConfig = JSON.parse(
      readFileSync(join(process.cwd(), "vercel.json"), "utf8")
    ) as { buildCommand: string; outputDirectory: string };

    expect(vercelConfig).toMatchObject({
      buildCommand: "pnpm generate",
      outputDirectory: ".output/public",
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
