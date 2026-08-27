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
  const locale =
    options.locale === "es"
      ? "es_US"
      : options.locale === "pt"
        ? "pt_BR"
        : "en_US";

  useSeoMeta({
    title: options.title,
    description: options.description,
    robots: options.noIndex ? "noindex, nofollow" : "index, follow",
    ogTitle: options.title,
    ogDescription: options.description,
    ogUrl: canonical,
    ogImage: image,
    ogLocale: locale,
    ogType: options.type ?? "website",
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: image,
    articlePublishedTime: options.publishedAt,
    articleModifiedTime: options.updatedAt,
  });

  useHead({
    htmlAttrs: { lang: options.locale ?? "en" },
    link: [{ rel: "canonical", href: canonical }],
  });
}
