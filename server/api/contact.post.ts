import { queryCollection as queryServerCollection } from "@nuxt/content/server";

export default defineEventHandler(async event => {
  const siteCopy = await queryServerCollection(event, "site").first();
  if (!siteCopy) throw createError("Website content is missing");

  setResponseStatus(event, 501);

  return siteCopy.api.contact;
});
