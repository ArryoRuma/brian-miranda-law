import type { PublishedBlogPost } from "../content/blog";
import type { SiteContent } from "../content/schema";
import { getLocationPath, locationHubPath } from "../content/schema";

const oneLine = (value: string) => value.replace(/\s+/g, " ").trim();

const markdownUrl = (origin: string, path: string) =>
  path === "/" ? `${origin}/index.md` : `${origin}${path}.md`;

const link = (
  origin: string,
  path: string,
  title: string,
  description: string
) =>
  `- [${oneLine(title)}](${markdownUrl(origin, path)}): ${oneLine(description)}`;

export function buildLlmsTxt(
  siteCopy: SiteContent,
  blogPosts: PublishedBlogPost[]
) {
  const { site, home, locations, pages, resources, legal, blog } = siteCopy;
  const requiredPage = (key: string) => {
    const page = pages[key];
    if (!page) throw new Error(`Required llms.txt page is missing: ${key}`);
    return page;
  };
  const aboutPage = requiredPage("about");
  const contactPage = requiredPage("contact");
  const otherServicesPage = requiredPage("other-services");
  const resourcesPage = requiredPage("resources");
  const origin = site.url;
  const office = `${site.contact.addressLines[0]}, ${site.contact.addressLines[1]}`;
  const lines = [
    `# ${site.contact.shortName}`,
    "",
    `> ${oneLine(site.description)}`,
    "",
    `Canonical origin: ${origin}/`,
    "",
    `${site.contact.name} is a New Jersey law firm with its published office at ${office}. The firm provides estate-planning guidance and considers selected additional legal matters.`,
    "",
    `Service is available in English, Spanish, and Portuguese. Phone: ${site.contact.phoneDisplay}. Email: ${site.contact.email}.`,
    "",
    "Community pages identify service areas, not separate offices or branch locations. The Warren address above is the only office address represented by this website.",
    "",
    "Website content is general information, not legal advice, and using the website or contacting the firm does not by itself create an attorney-client relationship.",
    "",
    "## Start Here",
    "",
    link(origin, "/", home.seo.title, home.seo.description),
    link(origin, "/about", aboutPage.title, aboutPage.metaDescription),
    link(origin, "/contact", contactPage.title, contactPage.metaDescription),
    link(
      origin,
      locationHubPath,
      locations.hub.title,
      locations.hub.description
    ),
    "",
    "## Estate Planning Services",
    "",
    ...site.navigation.estatePlanning.map(item => {
      const page = Object.values(pages).find(
        candidate => candidate.path === item.href
      );
      return link(
        origin,
        item.href,
        page?.title ?? item.label,
        page?.metaDescription ?? item.label
      );
    }),
    "",
    "## Additional Legal Services",
    "",
    link(
      origin,
      otherServicesPage.path,
      otherServicesPage.title,
      otherServicesPage.metaDescription
    ),
    "",
    "This page describes selected real-estate, corporate, municipal, immigration, and landlord-tenant matters. Availability depends on the facts, timing, jurisdiction, and conflicts.",
    "",
    "## Client Resources",
    "",
    link(
      origin,
      resourcesPage.path,
      resourcesPage.title,
      resourcesPage.metaDescription
    ),
    link(
      origin,
      resources.faq.seo.path,
      resources.faq.seo.title,
      resources.faq.seo.description
    ),
    link(
      origin,
      resources.checklist.seo.path,
      resources.checklist.seo.title,
      resources.checklist.seo.description
    ),
    link(
      origin,
      resources.video.seo.path,
      resources.video.seo.title,
      resources.video.seo.description
    ),
    "",
  ];

  for (const county of locations.counties) {
    lines.push(`## Communities Served — ${county.name} County`, "");
    for (const municipality of county.municipalities) {
      const path = getLocationPath(municipality.slug);
      const title = locations.landing.title
        .replaceAll("{municipality}", municipality.name)
        .replaceAll("{county}", county.name);
      const description = locations.landing.description
        .replaceAll("{municipality}", municipality.name)
        .replaceAll("{county}", county.name);
      lines.push(link(origin, path, title, description));
    }
    lines.push("");
  }

  lines.push("## Language Editions", "");
  for (const language of site.navigation.languages) {
    lines.push(
      `- [${language.language}](${markdownUrl(origin, language.href)}): The ${language.language} edition of the Miranda Law website.`
    );
  }
  lines.push("");

  if (blogPosts.length) {
    lines.push("## Blog Articles", "");
    lines.push(link(origin, blog.path, blog.seo.title, blog.seo.description));
    for (const post of blogPosts) {
      lines.push(
        link(origin, `/blog/${post.slug}`, post.title, post.description)
      );
    }
    lines.push("");
  }

  lines.push("## Policies and Discovery", "");
  for (const [key, page] of Object.entries(legal)) {
    lines.push(link(origin, `/${key}`, page.title, page.description));
  }
  lines.push(
    `- [Complete site content](${origin}/llms-full.txt): Expanded Markdown content for public pages.`,
    `- [Public agent manifest](${origin}/agents.json): Machine-readable site identity, languages, contact details, and public route inventory.`,
    `- [XML sitemap](${origin}/sitemap_index.xml): Canonical index of localized public URLs.`,
    `- [Crawler policy](${origin}/robots.txt): Search and crawler directives.`,
    ""
  );

  return lines.join("\n");
}
