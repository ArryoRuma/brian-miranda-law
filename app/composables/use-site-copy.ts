import { siteCopyByLocale } from "#site-content";
import {
  defaultLocale,
  locales,
  type Locale,
} from "~~/lib/content/localization";

export function useSiteCopy(localeOverride?: Readonly<Ref<Locale>>) {
  const { locale } = useI18n();
  return computed(() => {
    const requestedLocale = localeOverride?.value ?? locale.value;
    const code = locales.includes(requestedLocale as Locale)
      ? (requestedLocale as Locale)
      : defaultLocale;
    return siteCopyByLocale[code];
  });
}
