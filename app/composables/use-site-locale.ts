import {
  defaultLocale,
  localeMetadata,
  locales,
  type Locale,
} from "~~/lib/content/localization";

export function useSiteLocale() {
  const { locale: i18nLocale } = useI18n();
  const localePath = useLocalePath();
  const switchLocalePath = useSwitchLocalePath();
  const locale = computed<Locale>(() =>
    locales.includes(i18nLocale.value as Locale)
      ? (i18nLocale.value as Locale)
      : defaultLocale
  );

  const localizePath = (path: string, targetLocale = locale.value) => {
    if (
      !path.startsWith("/") ||
      path.startsWith("//") ||
      path.startsWith("/start/")
    ) {
      return path;
    }
    const sourcePath =
      path === "/es" || path === "/pt"
        ? "/"
        : path.replace(/^\/(?:es|pt)(?=\/)/, "") || "/";
    return localePath(sourcePath, targetLocale);
  };

  const getSwitchLocalePath = (targetLocale: Locale) =>
    switchLocalePath(targetLocale) || localizePath("/", targetLocale);

  const languageLinks = computed(() =>
    locales.map(code => ({
      code,
      label: localeMetadata[code].label,
      language: localeMetadata[code].name,
      href: getSwitchLocalePath(code),
    }))
  );

  return {
    locale,
    homePath: computed(() => localizePath("/")),
    languageLinks,
    localizePath,
    switchLocalePath: getSwitchLocalePath,
  };
}
