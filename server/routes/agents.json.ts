import { getPublicRoutes } from "../../lib/content/schema";

export default defineEventHandler(async event => {
  const { siteCopy, blogPosts } = await queryRepositoryContent(event);
  const publicPages = [
    ...getPublicRoutes(siteCopy),
    ...(blogPosts.length
      ? [siteCopy.blog.path, ...blogPosts.map(post => `/blog/${post.slug}`)]
      : []),
  ];

  return {
    version: "1.0",
    name: "Miranda Law Website",
    description: siteCopy.site.description,
    url: siteCopy.site.url,
    languages: ["en", "es", "pt"],
    contact: {
      telephone: siteCopy.site.contact.phoneHref,
      email: siteCopy.site.contact.email,
    },
    publicPages,
    tools: [],
    notice:
      "Website information is general and does not create an attorney-client relationship. No public agent or legal-advice API is offered.",
  };
});
