import { loadContentCollections } from "~~/lib/content/collections";

export default defineNuxtPlugin(async () => {
  const { data, error } = await useAsyncData("repository-content", () =>
    loadContentCollections(name => queryCollection(name).all())
  );

  if (error.value) throw error.value;
  if (!data.value) throw new Error("Repository content failed to load");

  return {
    provide: {
      repositoryContent: data.value,
    },
  };
});
