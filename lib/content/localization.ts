export const locales = ["en", "es", "pt"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeMetadata = {
  en: { label: "EN", language: "English", hreflang: "en-US", og: "en_US" },
  es: { label: "ES", language: "Español", hreflang: "es-US", og: "es_US" },
  pt: { label: "PT", language: "Português", hreflang: "pt-BR", og: "pt_BR" },
} as const satisfies Record<
  Locale,
  { label: string; language: string; hreflang: string; og: string }
>;

export type TranslationReviewStatus = "approved" | "draft";

export type TranslationReview = {
  status: TranslationReviewStatus;
  variant: string;
  fluentReviewRequired: boolean;
  legalReviewRequired: boolean;
};

export type LocalizationConfig = {
  review: Record<Locale, TranslationReview>;
  translations: Record<"es" | "pt", Record<string, string>>;
};

const questionnaireRoutePattern = /^\/start\/(en|es|pt)(?:\/|$)/;
const publicLocalePattern = /^\/(es|pt)(?:\/|$)/;

export function getRouteLocale(pathname: string): Locale {
  const questionnaireLocale = pathname.match(questionnaireRoutePattern)?.[1];
  if (questionnaireLocale && locales.includes(questionnaireLocale as Locale)) {
    return questionnaireLocale as Locale;
  }

  const publicLocale = pathname.match(publicLocalePattern)?.[1];
  return publicLocale === "es" || publicLocale === "pt" ? publicLocale : "en";
}

export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/es" || pathname === "/pt") return "/";
  return pathname.replace(/^\/(?:es|pt)(?=\/)/, "") || "/";
}

export function getLocaleHomePath(locale: Locale): string {
  return locale === defaultLocale ? "/" : `/${locale}`;
}

export function localizePath(pathname: string, locale: Locale): string {
  if (
    !pathname.startsWith("/") ||
    pathname.startsWith("//") ||
    pathname.startsWith("/start/")
  ) {
    return pathname;
  }

  const basePath = stripLocalePrefix(pathname);
  if (locale === defaultLocale) return basePath;
  return basePath === "/" ? `/${locale}` : `/${locale}${basePath}`;
}

const nonTranslatableKeys = new Set([
  "url",
  "logo",
  "defaultLocale",
  "themeColor",
  "email",
  "phoneDisplay",
  "phoneHref",
  "mapUrl",
  "streetAddress",
  "addressLocality",
  "addressRegion",
  "postalCode",
  "addressCountry",
  "id",
  "href",
  "path",
  "image",
  "type",
  "tone",
  "icon",
  "priority",
  "external",
  "number",
  "indexCurrent",
  "indexSeparator",
  "indexTotal",
]);

const nonTranslatablePrefixes = [
  "site.contact.",
  "site.structuredData.knowsLanguage",
  "site.navigation.languages.",
  "home.languages.items.",
  "questionnaire.locales.",
  "nextSteps.locales.",
  "localization.",
];

const sharedStructuredDataKeys = new Set([
  "site.structuredData.streetAddress",
  "site.structuredData.addressLocality",
  "site.structuredData.addressRegion",
  "site.structuredData.postalCode",
  "site.structuredData.addressCountry",
]);

export function isTranslatableString(path: string[], value: unknown) {
  if (typeof value !== "string") return false;
  const joinedPath = path.join(".");
  const key = path.at(-1) ?? "";

  return (
    !nonTranslatableKeys.has(key) &&
    !/(?:Href|Path|Url)$/.test(key) &&
    !sharedStructuredDataKeys.has(joinedPath) &&
    !nonTranslatablePrefixes.some(prefix => joinedPath.startsWith(prefix))
  );
}

export function collectTranslatableStrings(value: unknown) {
  const entries = new Map<string, string[]>();

  function visit(item: unknown, path: string[] = []) {
    if (isTranslatableString(path, item)) {
      const source = item as string;
      entries.set(source, [...(entries.get(source) ?? []), path.join(".")]);
      return;
    }

    if (Array.isArray(item)) {
      item.forEach((child, index) => visit(child, [...path, String(index)]));
      return;
    }

    if (!item || typeof item !== "object") return;
    Object.entries(item).forEach(([key, child]) =>
      visit(child, [...path, key])
    );
  }

  visit(value);
  return entries;
}

function shouldLocalizeRoute(path: string[], key: string, value: string) {
  if (!["href", "path", "secondaryHref"].includes(key)) return false;
  if (!value.startsWith("/") || value.startsWith("/start/")) return false;
  const joinedPath = path.join(".");
  return !(
    joinedPath.startsWith("site.navigation.languages.") ||
    joinedPath.startsWith("home.languages.items.")
  );
}

export function createLocalizedContent<T extends object>(
  source: T,
  locale: Locale,
  translations: Record<string, string>
): T {
  function visit(item: unknown, path: string[] = []): unknown {
    if (isTranslatableString(path, item)) {
      return locale === defaultLocale ? item : translations[item as string];
    }

    if (Array.isArray(item)) {
      return item.map((child, index) => visit(child, [...path, String(index)]));
    }

    if (!item || typeof item !== "object") return item;

    return Object.fromEntries(
      Object.entries(item).map(([key, child]) => {
        const childPath = [...path, key];
        if (
          typeof child === "string" &&
          shouldLocalizeRoute(path, key, child)
        ) {
          return [key, localizePath(child, locale)];
        }
        return [key, visit(child, childPath)];
      })
    );
  }

  const localized = visit(source) as T & {
    site?: { navigation?: { languages?: Array<{ href: string }> } };
    home?: {
      languages?: {
        items?: Array<{ href: string }>;
        questionnaireHref?: string;
      };
    };
  };

  const languageHomes = locales.map(language => ({
    ...localeMetadata[language],
    href: getLocaleHomePath(language),
  }));
  if (localized.site?.navigation) {
    localized.site.navigation.languages = languageHomes.map(item => ({
      label: item.label,
      language: item.language,
      href: item.href,
    }));
  }
  if (localized.home?.languages) {
    localized.home.languages.items = languageHomes.map(item => ({
      label: item.label,
      language: item.language,
      href: item.href,
    }));
    localized.home.languages.questionnaireHref = `/start/${locale}`;
  }

  return localized;
}

export function getLocalizedPublicRoutes(
  englishRoutes: string[],
  locale: Locale
) {
  return englishRoutes.map(route => localizePath(route, locale));
}
