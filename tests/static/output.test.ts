import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadRepositoryContent } from "../../lib/content/load-content";
import {
  getPreviewRoutes,
  getStaticPageRoutes,
} from "../../lib/content/schema";

const outputDirectory = join(process.cwd(), ".output", "public");
const repository = loadRepositoryContent(process.cwd());
const publicRoutes = getStaticPageRoutes(repository.siteCopy);
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
    const sitemap = readFileSync(join(outputDirectory, "sitemap.xml"), "utf8");
    const agents = JSON.parse(
      readFileSync(join(outputDirectory, "agents.json"), "utf8")
    ) as { publicPages: string[] };

    expect([...agents.publicPages].sort()).toEqual([...publicRoutes].sort());
    for (const route of publicRoutes) {
      const entry = `<loc>${repository.siteCopy.site.url}${route === "/" ? "/" : route}</loc>`;
      expect(sitemap.split(entry)).toHaveLength(2);
    }
    expect(sitemap).not.toContain("/start/");
    expect(sitemap).not.toContain("/blog");
  });

  it("ships no SQLite database runtime", () => {
    const files = collectFiles(outputDirectory).map(file => file.toLowerCase());
    expect(files.some(file => file.includes("sqlite"))).toBe(false);
    expect(files.some(file => file.endsWith(".wasm"))).toBe(false);
  });
});
