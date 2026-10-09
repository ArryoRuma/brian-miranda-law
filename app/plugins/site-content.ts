import {
  assembleRepositoryContent,
  type RepositoryCollectionDocuments,
} from "~~/lib/content/collections";

export default defineNuxtPlugin(async () => {
  const { data, error } = await useAsyncData("repository-content", async () => {
    const [
      site,
      home,
      locations,
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
      queryCollection("site").all(),
      queryCollection("home").all(),
      queryCollection("locations").all(),
      queryCollection("pages").all(),
      queryCollection("resourceFaq").all(),
      queryCollection("resourceChecklist").all(),
      queryCollection("resourceVideo").all(),
      queryCollection("blogSettings").all(),
      queryCollection("contactPage").all(),
      queryCollection("legal").all(),
      queryCollection("questionnaire").all(),
      queryCollection("nextSteps").all(),
      queryCollection("error404").all(),
      queryCollection("translationReview").all(),
      queryCollection("translationsEs").all(),
      queryCollection("translationsPt").all(),
      queryCollection("articles").all(),
    ]);

    return assembleRepositoryContent({
      site,
      home,
      locations,
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
  });

  if (error.value) throw error.value;
  if (!data.value) throw new Error("Repository content failed to load");

  return {
    provide: {
      repositoryContent: data.value,
    },
  };
});
