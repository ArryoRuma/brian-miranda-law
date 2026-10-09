import type {
  LocationCounty,
  LocationMunicipality,
  SiteContent,
  SitePageContent,
} from "../content/schema";
import { getLocationPath, locationHubPath } from "../content/schema";

type SchemaNode = Record<string, unknown>;

export const getSchemaIds = (siteUrl: string) => ({
  attorney: `${siteUrl}/#brian-miranda`,
  legalService: `${siteUrl}/#legal-service`,
  offerCatalog: `${siteUrl}/#legal-services`,
  state: `${siteUrl}/#new-jersey`,
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getCountySchemaId = (siteUrl: string, countyName: string) =>
  `${siteUrl}/#service-area-${slugify(countyName)}-county`;

export const getMunicipalitySchemaId = (
  siteUrl: string,
  municipality: LocationMunicipality
) => `${siteUrl}${getLocationPath(municipality.slug)}#place`;

const municipalityType = (municipality: LocationMunicipality) =>
  municipality.type === "city" ? "City" : "AdministrativeArea";

export function buildServiceAreaNodes(
  siteUrl: string,
  counties: LocationCounty[]
): SchemaNode[] {
  const ids = getSchemaIds(siteUrl);
  return counties.map(county => ({
    "@type": "AdministrativeArea",
    "@id": getCountySchemaId(siteUrl, county.name),
    name: `${county.name} County`,
    containedInPlace: {
      "@type": "AdministrativeArea",
      "@id": ids.state,
      name: "New Jersey",
    },
    containsPlace: county.municipalities.map(municipality => ({
      "@type": municipalityType(municipality),
      "@id": getMunicipalitySchemaId(siteUrl, municipality),
      name: municipality.name,
      url: `${siteUrl}${getLocationPath(municipality.slug)}`,
      containedInPlace: {
        "@id": getCountySchemaId(siteUrl, county.name),
      },
    })),
  }));
}

const getOtherServiceCards = (pages: SiteContent["pages"]) =>
  pages["other-services"]?.sections
    .filter(section => section.type === "cards")
    .flatMap(section => section.cards) ?? [];

export function buildOfferCatalog(content: SiteContent): SchemaNode {
  const { site, home, locations, pages } = content;
  const ids = getSchemaIds(site.url);
  const areaServed = locations.counties.map(county => ({
    "@id": getCountySchemaId(site.url, county.name),
  }));
  const services = [
    ...home.services.items.map(service => ({
      id: `${site.url}${service.href}#service`,
      name: service.title,
      description: service.description,
      url: `${site.url}${service.href}`,
    })),
    ...getOtherServiceCards(pages).map(service => ({
      id: `${site.url}/other-services#service-${slugify(service.title)}`,
      name: service.title,
      description: service.body,
      url: `${site.url}/other-services`,
    })),
  ];

  return {
    "@type": "OfferCatalog",
    "@id": ids.offerCatalog,
    name: "Legal services",
    itemListElement: services.map(service => ({
      "@type": "Offer",
      url: service.url,
      itemOffered: {
        "@type": "Service",
        "@id": service.id,
        name: service.name,
        description: service.description,
        url: service.url,
        provider: { "@id": ids.legalService },
        areaServed,
      },
    })),
  };
}

export function buildLegalServiceIdentity(
  content: SiteContent
): SchemaNode & { type: "LocalBusiness"; "@type": "LegalService" } {
  const { site, locations } = content;
  const ids = getSchemaIds(site.url);
  return {
    type: "LocalBusiness",
    "@type": "LegalService",
    "@id": ids.legalService,
    name: site.contact.name,
    legalName: site.contact.name,
    alternateName: site.contact.shortName,
    description: site.description,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      "@id": `${site.url}/#logo`,
      url: `${site.url}${site.logo}`,
      contentUrl: `${site.url}${site.logo}`,
      caption: site.contact.shortName,
    },
    image: [
      `${site.url}/images/brian-law-hero_7235d741.jpg.webp`,
      `${site.url}/images/brian-old-headshot.jpg`,
    ],
    telephone: site.contact.phoneHref,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.structuredData.streetAddress,
      addressLocality: site.structuredData.addressLocality,
      addressRegion: site.structuredData.addressRegion,
      postalCode: site.structuredData.postalCode,
      addressCountry: site.structuredData.addressCountry,
    },
    hasMap: site.contact.mapUrl,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:00",
    },
    areaServed: buildServiceAreaNodes(site.url, locations.counties),
    knowsLanguage: site.structuredData.knowsLanguage,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "legal services",
      telephone: site.contact.phoneHref,
      email: site.contact.email,
      availableLanguage: site.structuredData.knowsLanguage,
      url: `${site.url}/contact`,
    },
    employee: { "@id": ids.attorney },
    hasOfferCatalog: buildOfferCatalog(content),
  };
}

export function buildAttorneyNode(content: SiteContent): SchemaNode {
  const { site, home, pages } = content;
  const ids = getSchemaIds(site.url);
  const about = pages.about;
  const educationSection = about?.sections.find(
    section => section.id === "education"
  );
  const admissionsSection = about?.sections.find(
    section => section.id === "admissions"
  );
  const education =
    educationSection?.type === "checklist" ? educationSection.bullets : [];
  const admissions =
    admissionsSection?.type === "checklist" ? admissionsSection.bullets : [];
  const otherServices = getOtherServiceCards(pages);

  return {
    "@type": "Person",
    "@id": ids.attorney,
    name: site.contact.attorney,
    description: about?.hero.lead,
    url: `${site.url}/about`,
    image: {
      "@type": "ImageObject",
      "@id": `${site.url}/about#portrait`,
      url: `${site.url}/images/brian-old-headshot.jpg`,
      contentUrl: `${site.url}/images/brian-old-headshot.jpg`,
      caption: site.contact.attorney,
    },
    jobTitle: site.structuredData.attorneyJobTitle,
    worksFor: { "@id": ids.legalService },
    knowsLanguage: site.structuredData.knowsLanguage,
    knowsAbout: [
      "Estate planning",
      ...home.services.items.map(service => service.title),
      ...otherServices.map(service => service.title),
    ],
    alumniOf: education.map(item => ({
      "@type": "EducationalOrganization",
      name: item.split("—").at(-1)?.trim() ?? item,
    })),
    hasCredential: admissions.map(name => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Bar admission",
      name,
    })),
  };
}

export function buildEditorialPageSchema(
  content: SiteContent,
  page: SitePageContent
): SchemaNode[] {
  const { site, locations } = content;
  const ids = getSchemaIds(site.url);
  const canonical = `${site.url}${page.path}`;
  const areaServed = locations.counties.map(county => ({
    "@id": getCountySchemaId(site.url, county.name),
  }));

  if (page.path === "/about") {
    return [
      {
        "@type": "ProfilePage",
        "@id": `${canonical}#webpage`,
        mainEntity: { "@id": ids.attorney },
        about: { "@id": ids.attorney },
      },
    ];
  }
  if (page.path === "/contact") {
    return [
      {
        "@type": "ContactPage",
        "@id": `${canonical}#webpage`,
        mainEntity: { "@id": ids.legalService },
        about: { "@id": ids.legalService },
      },
    ];
  }
  if (
    page.path === "/estate-planning" ||
    page.path.startsWith("/estate-planning/")
  ) {
    const serviceId = `${canonical}#service`;
    return [
      {
        "@type": "Service",
        "@id": serviceId,
        name: page.title,
        description: page.metaDescription,
        serviceType: page.title.replace(/ in North Jersey$/, ""),
        url: canonical,
        provider: { "@id": ids.legalService },
        areaServed,
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        mainEntity: { "@id": serviceId },
        about: { "@id": serviceId },
      },
    ];
  }
  if (page.path === "/other-services") {
    return [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        mainEntity: { "@id": ids.offerCatalog },
        about: { "@id": ids.offerCatalog },
      },
    ];
  }
  return [];
}

export function buildLocationPageSchema(
  content: SiteContent,
  county: LocationCounty,
  municipality: LocationMunicipality,
  title: string,
  description: string,
  pagePath = getLocationPath(municipality.slug)
): SchemaNode[] {
  const { site } = content;
  const ids = getSchemaIds(site.url);
  const canonical = `${site.url}${pagePath}`;
  const placeId = getMunicipalitySchemaId(site.url, municipality);
  const serviceId = `${canonical}#service`;
  return [
    {
      "@type": municipalityType(municipality),
      "@id": placeId,
      name: municipality.name,
      url: canonical,
      containedInPlace: {
        "@id": getCountySchemaId(site.url, county.name),
      },
    },
    {
      "@type": "Service",
      "@id": serviceId,
      name: title,
      description,
      serviceType: "Estate planning legal services",
      url: canonical,
      provider: { "@id": ids.legalService },
      areaServed: { "@id": placeId },
    },
    {
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      mainEntity: { "@id": serviceId },
      about: [{ "@id": serviceId }, { "@id": placeId }],
    },
  ];
}

export function buildLocationDirectorySchema(
  content: SiteContent,
  pagePath = locationHubPath
): SchemaNode[] {
  const { site, locations } = content;
  const canonical = `${site.url}${pagePath}`;
  const localePrefix = pagePath.endsWith(locationHubPath)
    ? pagePath.slice(0, -locationHubPath.length)
    : "";
  const municipalities = locations.counties.flatMap(county =>
    county.municipalities.map(municipality => ({ county, municipality }))
  );
  const listId = `${canonical}#communities`;
  return [
    {
      "@type": "ItemList",
      "@id": listId,
      name: locations.hub.heading,
      numberOfItems: municipalities.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: municipalities.map(({ municipality }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: municipality.name,
        url: `${site.url}${localePrefix}${getLocationPath(municipality.slug)}`,
        item: {
          "@id": getMunicipalitySchemaId(site.url, municipality),
        },
      })),
    },
    {
      "@type": "CollectionPage",
      "@id": `${canonical}#webpage`,
      mainEntity: { "@id": listId },
      about: { "@id": getSchemaIds(site.url).legalService },
    },
  ];
}
