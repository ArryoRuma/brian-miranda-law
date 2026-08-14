import { useEffect } from "react";
import { SITE_URL } from "@/site/siteConfig";

type PageMetaProps = {
  title: string;
  description: string;
  path: string;
  language?: "en" | "es" | "pt";
  noIndex?: boolean;
};

function upsertMeta(name: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`
  );

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  element.content = content;
}

function upsertProperty(property: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }

  element.content = content;
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = href;
}

export function PageMeta({
  title,
  description,
  path,
  language = "en",
  noIndex = false,
}: PageMetaProps) {
  useEffect(() => {
    const pageTitle = `${title} | Miranda Law`;
    const canonicalUrl = `${SITE_URL}${path}`;
    const locale =
      language === "es" ? "es_US" : language === "pt" ? "pt_BR" : "en_US";

    document.title = pageTitle;
    document.documentElement.lang = language;
    upsertMeta("description", description);
    upsertMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");
    upsertProperty("og:title", pageTitle);
    upsertProperty("og:description", description);
    upsertProperty("og:url", canonicalUrl);
    upsertProperty("og:locale", locale);
    upsertCanonical(canonicalUrl);
  }, [description, language, noIndex, path, title]);

  return null;
}
