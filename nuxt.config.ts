import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { localeDefinitions } from "./lib/content/localization";
import { getPreviewRoutes } from "./lib/content/schema";

const rootDirectory = fileURLToPath(new URL(".", import.meta.url));
const previewRoutes = getPreviewRoutes();
const siteUrl = "https://bmirandalaw.com";

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
    robotsTxt: false,
    disallow: ["/start/"],
  },
  sitemap: {
    sources: ["/api/__sitemap__/urls"],
    excludeAppSources: true,
    zeroRuntime: true,
  },
  schemaOrg: {
    identity: {
      type: "Organization",
      name: "The Law Offices of Brian M. Miranda, Esq., LLC",
      url: siteUrl,
      logo: `${siteUrl}/miranda-law-gold.png`,
    },
  },
  routeRules: {
    "/start/**": { prerender: true, robots: false, sitemap: false },
    "/api/**": { robots: false, sitemap: false },
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      failOnError: true,
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
