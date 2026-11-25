import { getPublicPageRoutes } from "../../../lib/content/page-routes";

export default defineEventHandler(async event => {
  const repository = await queryRepositoryContent(event);
  return getPublicPageRoutes(repository).map(loc => ({ loc }));
});
