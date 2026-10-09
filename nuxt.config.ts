import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineNuxtModule } from "nuxt/kit";
import type { ModuleOptions as SchemaOrgOptions } from "nuxt-schema-org";
import { localeDefinitions } from "./lib/content/localization";
import { loadRepositoryContent } from "./lib/content/load-repository";
import { getPreviewRoutes } from "./lib/content/schema";
import { buildLlmsTxt } from "./lib/seo/llms";
import { buildLegalServiceIdentity } from "./lib/seo/schema";

const rootDirectory = fileURLToPath(new URL(".", import.meta.url));
const previewRoutes = getPreviewRoutes();
const siteUrl = "https://bmirandalaw.com";
const repository = loadRepositoryContent(rootDirectory);
const curatedLlmsTxt = buildLlmsTxt(repository.siteCopy, repository.blogPosts);

const curatedLlmsTxtModule = defineNuxtModule({
  meta: { name: "curated-llms-txt" },
  setup(_options, nuxt) {
    nuxt.hook("modules:done", () => {
      nuxt.hook("nitro:init", nitro => {
        nitro.hooks.hook("prerender:done", () => {
          writeFileSync(
            join(nitro.options.output.publicDir, "llms.txt"),
            curatedLlmsTxt,
            "utf8"
          );
        });
      });
    });
  },
});

export default defineNuxtConfig({
  compatibilityDate: "2026-08-01",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      siteUrl,
    },
  },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxtjs/i18n",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "@nuxt/content",
    "nuxt-schema-org",
    "@nuxt/devtools",
    "nuxt-seo-utils",
    "@nuxt/hints",
    "nuxt-og-image",
    "nuxt-link-checker",
    "nuxt-skew-protection",
    "nuxt-ai-ready",
    curatedLlmsTxtModule,
  ],
  site: {
    url: siteUrl,
    name: "Miranda Law",
    defaultLocale: "en",
  },
  i18n: {
    baseUrl: siteUrl,
    defaultLocale: "en",
    strategy: "prefix_except_default",
    detectBrowserLanguage: false,
    customRoutes: "meta",
    locales: localeDefinitions,
  },
  app: {
    baseURL: "/",
    head: {
      meta: [
        { name: "theme-color", content: "#2c2c2c" },
        {
          name: "format-detection",
          content: "telephone=no, address=no, email=no",
        },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@400;500;600;700&display=swap",
        },
      ],
    },
  },
  image: {
    format: ["avif", "webp"],
    quality: 82,
    screens: {
      xs: 320,
      sm: 390,
      md: 768,
      lg: 1024,
      xl: 1440,
      xxl: 1920,
    },
  },
  robots: {
    robotsTxt: true,
    disallow: ["/start/"],
  },
  sitemap: {
    sources: ["/api/__sitemap__/urls"],
    excludeAppSources: true,
    zeroRuntime: true,
  },
  linkChecker: {
    excludeLinks: [/^sms:/],
  },
  aiReady: {
    llmsTxt: { markdownLinks: true },
  },
  schemaOrg: {
    identity: buildLegalServiceIdentity(
      repository.siteCopy
    ) as unknown as Exclude<SchemaOrgOptions["identity"], string | undefined>,
  },
  routeRules: {
    "/start/**": { prerender: true, robots: true, sitemap: false },
    "/api/**": { robots: false, sitemap: false },
    "/post/out-of-work-and-don-t-know-what-to-do": {
      redirect: {
        to: "/blog/out-of-work-and-don-t-know-what-to-do",
        statusCode: 301,
      },
    },
    "/post/are-your-bills-getting-out-of-hand": {
      redirect: {
        to: "/blog/are-your-bills-getting-out-of-hand",
        statusCode: 301,
      },
    },
    "/post/time-for-a-restart": {
      redirect: { to: "/blog/time-for-a-restart", statusCode: 301 },
    },
    "/post/what-is-the-paycheck-protection-program": {
      redirect: {
        to: "/blog/what-is-the-paycheck-protection-program",
        statusCode: 301,
      },
    },
    "/post/not-being-able-to-pay-your-mortgage-keeping-you-up-at-night": {
      redirect: {
        to: "/blog/not-being-able-to-pay-your-mortgage-keeping-you-up-at-night",
        statusCode: 301,
      },
    },
    "/post/have-you-ever-thought-of-a-tomorrow-without-you": {
      redirect: {
        to: "/blog/have-you-ever-thought-of-a-tomorrow-without-you",
        statusCode: 301,
      },
    },
    "/post/have-you-been-a-victim-and-have-no-immigration-status": {
      redirect: {
        to: "/blog/have-you-been-a-victim-and-have-no-immigration-status",
        statusCode: 301,
      },
    },
    "/post/unemployed-and-thinking-of-starting-your-own-business": {
      redirect: {
        to: "/blog/unemployed-and-thinking-of-starting-your-own-business",
        statusCode: 301,
      },
    },
    "/post/facing-eviction-know-your-rights": {
      redirect: {
        to: "/blog/facing-eviction-know-your-rights",
        statusCode: 301,
      },
    },
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      failOnError: true,
      ignore: [/^\/_vercel\/image/],
      routes: ["/", ...previewRoutes, "/agents.json", "/api/__sitemap__/urls"],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: [
        "@nuxtjs/mdc > remark-gfm",
        "@nuxtjs/mdc > remark-emoji",
        "@nuxtjs/mdc > remark-mdc",
        "@nuxtjs/mdc > remark-rehype",
        "@nuxtjs/mdc > rehype-raw",
        "@nuxtjs/mdc > parse5",
        "@nuxtjs/mdc > unist-util-visit",
        "@nuxtjs/mdc > unified",
        "@nuxtjs/mdc > debug",
        "@nuxtjs/mdc > extend",
      ],
    },
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
  hooks: {
    "ai-ready:page:markdown": context => {
      if (context.route.startsWith("/start/")) context.markdown = "";
    },
    "content:file:afterParse": context => {
      const inspectAssets = (value: unknown, trail: string[] = []) => {
        if (Array.isArray(value)) {
          value.forEach((item, index) =>
            inspectAssets(item, [...trail, String(index)])
          );
          return;
        }
        if (!value || typeof value !== "object") return;
        for (const [key, item] of Object.entries(value)) {
          const itemPath = [...trail, key];
          if (
            typeof item === "string" &&
            ["image", "heroImage", "logo"].includes(key) &&
            item.startsWith("/") &&
            !existsSync(join(rootDirectory, "public", item.slice(1)))
          ) {
            throw new Error(
              `Referenced public asset does not exist at ${itemPath.join(".")}: ${item}`
            );
          }
          inspectAssets(item, itemPath);
        }
      };
      inspectAssets(context.content);
    },
  },
});
