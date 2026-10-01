import type { H3Event } from "h3";
import { queryCollection as queryServerCollection } from "@nuxt/content/server";
import {
  assembleRepositoryContent,
  type RepositoryCollectionDocuments,
} from "../../lib/content/collections";

export async function queryRepositoryContent(event: H3Event) {
  const [
    site,
    home,
    pages,
    resourceFaq,
    resourceChecklist,
    resourceVideo,
    blogSettings,
    contactPage,
    legal,
    questionnaire,
    nextSteps,
    error404,
    translationReview,
    translationsEs,
    translationsPt,
    articles,
  ] = await Promise.all([
    queryServerCollection(event, "site").all(),
    queryServerCollection(event, "home").all(),
    queryServerCollection(event, "pages").all(),
    queryServerCollection(event, "resourceFaq").all(),
    queryServerCollection(event, "resourceChecklist").all(),
    queryServerCollection(event, "resourceVideo").all(),
    queryServerCollection(event, "blogSettings").all(),
    queryServerCollection(event, "contactPage").all(),
    queryServerCollection(event, "legal").all(),
    queryServerCollection(event, "questionnaire").all(),
    queryServerCollection(event, "nextSteps").all(),
    queryServerCollection(event, "error404").all(),
    queryServerCollection(event, "translationReview").all(),
    queryServerCollection(event, "translationsEs").all(),
    queryServerCollection(event, "translationsPt").all(),
    queryServerCollection(event, "articles").all(),
  ]);

  return assembleRepositoryContent({
    site,
    home,
    pages,
    resourceFaq,
    resourceChecklist,
    resourceVideo,
    blogSettings,
    contactPage,
    legal,
    questionnaire,
    nextSteps,
    error404,
    translationReview,
    translationsEs,
    translationsPt,
    articles,
  } as unknown as RepositoryCollectionDocuments);
}
