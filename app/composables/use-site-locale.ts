import {
  getLocaleHomePath,
  getRouteLocale,
  localizePath,
} from "~~/lib/content/localization";

export function useSiteLocale() {
  const route = useRoute();
  const locale = computed(() => getRouteLocale(route.path));

  return {
    locale,
    homePath: computed(() => getLocaleHomePath(locale.value)),
    localizePath: (path: string) => localizePath(path, locale.value),
  };
}
