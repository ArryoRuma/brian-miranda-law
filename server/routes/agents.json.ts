import { getPublicPageRoutes } from "../../lib/content/page-routes";

export default defineEventHandler(async event => {
  const repository = await queryRepositoryContent(event);
  const { siteCopy } = repository;

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
    publicPages: getPublicPageRoutes(repository),
    tools: [],
    notice:
      "Website information is general and does not create an attorney-client relationship. No public agent or legal-advice API is offered.",
  };
});
