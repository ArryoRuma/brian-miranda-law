import { localeMetadata, type Locale } from "~~/lib/content/localization";

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
  const route = useRoute();
  const { locale: activeLocale } = useSiteLocale();
  const localeHead = useLocaleHead({ seo: !options.noIndex });
  const siteUrl = config.public.siteUrl;
  const canonicalPath = options.noIndex ? options.path : route.path;
  const canonical = `${siteUrl}${canonicalPath === "/" ? "/" : canonicalPath}`;
  const image = `${siteUrl}${options.image ?? "/images/brian-law-hero_7235d741.jpg.webp"}`;
  const locale = (options.locale ?? activeLocale.value) as Locale;

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

  useHead(() =>
    options.noIndex
      ? {
          htmlAttrs: { lang: localeMetadata[locale].language },
          link: [{ rel: "canonical", href: canonical }],
        }
      : localeHead.value
  );
}
