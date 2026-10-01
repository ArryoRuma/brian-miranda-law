import { getPublicRoutes } from "../../../lib/content/schema";

export default defineEventHandler(async event => {
  const { siteCopy, blogPosts } = await queryRepositoryContent(event);
  return [
    ...getPublicRoutes(siteCopy),
    ...(blogPosts.length
      ? [siteCopy.blog.path, ...blogPosts.map(post => `/blog/${post.slug}`)]
      : []),
  ].map(loc => ({ loc }));
});
