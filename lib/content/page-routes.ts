import type { RepositoryContent } from "./collections";
import { getLocalizedPublicRoutes, locales } from "./localization";
import { getPreviewRoutes, getPublicRoutes } from "./schema";

export function getSitePageRoutes({ siteCopy, blogPosts }: RepositoryContent) {
  return [
    ...new Set([
      ...getPublicRoutes(siteCopy),
      ...locales.flatMap(locale =>
        getLocalizedPublicRoutes(["/contact"], locale)
      ),
      siteCopy.blog.path,
      ...blogPosts.map(post => `/blog/${post.slug}`),
      ...getPreviewRoutes(),
    ]),
  ];
}
