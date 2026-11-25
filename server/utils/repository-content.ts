import type { H3Event } from "h3";
import { queryCollection as queryServerCollection } from "@nuxt/content/server";
import { loadContentCollections } from "../../lib/content/collections";

export function queryRepositoryContent(event: H3Event) {
  return loadContentCollections(name =>
    queryServerCollection(event, name).all()
  );
}
