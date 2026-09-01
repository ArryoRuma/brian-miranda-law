import {
  getRouteLocale,
  localeMetadata,
  locales,
  localizePath,
  stripLocalePrefix,
} from "~~/lib/content/localization";

type PageSeoOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  locale?: "en" | "es" | "pt";
  noIndex?: boolean;
  type?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
};

export function usePageSeo(options: PageSeoOptions) {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl;
  const canonical = `${siteUrl}${options.path === "/" ? "/" : options.path}`;
  const image = `${siteUrl}${options.image ?? "/images/brian-law-hero_7235d741.jpg.webp"}`;
  const locale = options.locale ?? getRouteLocale(options.path);

  useSeoMeta({
    title: options.title,
    description: options.description,
    robots: options.noIndex ? "noindex, nofollow" : "index, follow",
    ogTitle: options.title,
    ogDescription: options.description,
    ogUrl: canonical,
    ogImage: image,
    ogLocale: localeMetadata[locale].og,
    ogType: options.type ?? "website",
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: image,
    articlePublishedTime: options.publishedAt,
    articleModifiedTime: options.updatedAt,
  });

  useHead({
    htmlAttrs: { lang: locale },
    link: [
      { rel: "canonical", href: canonical },
      ...(!options.noIndex
        ? locales.map(alternateLocale => ({
            rel: "alternate" as const,
            hreflang: localeMetadata[alternateLocale].hreflang,
            href: `${siteUrl}${localizePath(
              stripLocalePrefix(options.path),
              alternateLocale
            )}`,
          }))
        : []),
      ...(!options.noIndex
        ? [
            {
              rel: "alternate" as const,
              hreflang: "x-default",
              href: `${siteUrl}${stripLocalePrefix(options.path)}`,
            },
          ]
        : []),
    ],
  });
}
