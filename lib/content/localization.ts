export const locales = ["en", "es", "pt"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeMetadata = {
  en: { label: "EN", name: "English", language: "en-US", og: "en_US" },
  es: { label: "ES", name: "Español", language: "es-US", og: "es_US" },
  pt: { label: "PT", name: "Português", language: "pt-BR", og: "pt_BR" },
} as const satisfies Record<
  Locale,
  { label: string; name: string; language: string; og: string }
>;

export const localeDefinitions = locales.map(code => ({
  code,
  name: localeMetadata[code].name,
  language: localeMetadata[code].language,
}));

export type TranslationReviewStatus = "approved" | "draft";

export type TranslationReview = {
  status: TranslationReviewStatus;
  variant: string;
  fluentReviewRequired: boolean;
  legalReviewRequired: boolean;
};

export type TranslationEntry = {
  source: string;
  value: string;
  file?: string;
};

export type TranslationOverlay = Record<string, TranslationEntry>;

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

export function collectTranslatableFields(value: unknown) {
  const entries = new Map<string, string>();

  function visit(item: unknown, path: string[] = []) {
    if (isTranslatableString(path, item)) {
      entries.set(path.join("."), item as string);
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

export function createLocalizedContent<T extends object>(
  source: T,
  locale: Locale,
  overlay: TranslationOverlay
): T {
  if (locale === defaultLocale) return source;

  const requiredFields = collectTranslatableFields(source);
  for (const [path, sourceValue] of requiredFields) {
    const entry = overlay[path];
    if (!entry) throw new Error(`Missing ${locale} translation for ${path}`);
    if (entry.source !== sourceValue) {
      throw new Error(
        `Stale ${locale} translation source for ${path} in ${entry.file ?? "translation overlay"}`
      );
    }
    if (!entry.value.trim()) {
      throw new Error(
        `Blank ${locale} translation for ${path} in ${entry.file ?? "translation overlay"}`
      );
    }
  }
  for (const [path, entry] of Object.entries(overlay)) {
    if (!requiredFields.has(path)) {
      throw new Error(
        `Unknown ${locale} translation path ${path} in ${entry.file ?? "translation overlay"}`
      );
    }
  }

  function visit(item: unknown, path: string[] = []): unknown {
    if (isTranslatableString(path, item)) {
      const fieldPath = path.join(".");
      const entry = overlay[fieldPath];
      if (!entry) {
        throw new Error(`Missing ${locale} translation for ${fieldPath}`);
      }
      return entry.value;
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
          ["href", "path", "secondaryHref"].includes(key) &&
          child.startsWith("/") &&
          !child.startsWith("/start/") &&
          !path.join(".").startsWith("site.navigation.languages.") &&
          !path.join(".").startsWith("home.languages.items.")
        ) {
          return [key, localizePublicPath(child, locale)];
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
  const languageHomes = locales.map(code => ({
    label: localeMetadata[code].label,
    language: localeMetadata[code].name,
    href: localizePublicPath("/", code),
  }));
  if (localized.site?.navigation) {
    localized.site.navigation.languages = languageHomes;
  }
  if (localized.home?.languages) {
    localized.home.languages.items = languageHomes;
    localized.home.languages.questionnaireHref = `/start/${locale}`;
  }

  return localized;
}

export function localizePublicPath(pathname: string, locale: Locale) {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return pathname;
  if (locale === defaultLocale) return pathname;
  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
}

export function normalizeContentRoutePath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

export function getLocalizedPublicRoutes(
  englishRoutes: string[],
  locale: Locale
) {
  return englishRoutes.map(route => localizePublicPath(route, locale));
}
