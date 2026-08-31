import { siteCopyByLocale } from "#site-content";
import { getRouteLocale } from "~~/lib/content/localization";

export function useSiteCopy() {
  const route = useRoute();
  return computed(() => siteCopyByLocale[getRouteLocale(route.path)]);
}
