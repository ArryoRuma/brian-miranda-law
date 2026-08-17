import { SITE_URL } from "~/data/site";

type PageSeoOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  locale?: "en" | "es" | "pt";
  noIndex?: boolean;
};

export function usePageSeo(options: PageSeoOptions) {
  const canonical = `${SITE_URL}${options.path === "/" ? "/" : options.path}`;
  const image = `${SITE_URL}${options.image ?? "/images/brian-law-hero_7235d741.jpg.webp"}`;
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
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: image,
  });

  useHead({
    htmlAttrs: { lang: options.locale ?? "en" },
    link: [{ rel: "canonical", href: canonical }],
  });
}
