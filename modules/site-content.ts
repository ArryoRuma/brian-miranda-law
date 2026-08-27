import { resolve } from "node:path";
import { addTemplate, defineNuxtModule } from "nuxt/kit";
import { loadRepositoryContent } from "../lib/content/load-content";

export default defineNuxtModule({
  meta: {
    name: "site-content",
  },
  setup(_options, nuxt) {
    const template = addTemplate({
      filename: "site-content.mjs",
      write: true,
      getContents: () => {
        const content = loadRepositoryContent(nuxt.options.rootDir);
        return [
          `export const siteCopy = ${JSON.stringify(content.siteCopy)};`,
          `export const blogPosts = ${JSON.stringify(content.blogPosts)};`,
        ].join("\n");
      },
    });

    nuxt.options.alias["#site-content"] = template.dst;
    nuxt.options.watch.push(resolve(nuxt.options.rootDir, "content"));

    nuxt.hook("builder:watch", async (_event, changedPath) => {
      if (changedPath.includes("content/")) {
        await nuxt.callHook("restart", { hard: true });
      }
    });
  },
});
