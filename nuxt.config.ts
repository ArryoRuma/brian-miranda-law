import { readFileSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import { parse } from "yaml";
import { PUBLIC_ROUTES } from "./app/data/routes";

const websiteCopy = parse(
  readFileSync(new URL("./content/site.yml", import.meta.url), "utf8")
) as {
  site: {
    name: string;
    url: string;
    logo: string;
    defaultLocale: string;
    themeColor: string;
    description: string;
    contact: { name: string };
  };
};

const previewRoutes = [
  "/start/en",
  "/start/es",
  "/start/pt",
  "/start/en/what-happens-next",
  "/start/es/what-happens-next",
  "/start/pt/what-happens-next",
];

export default defineNuxtConfig({
  compatibilityDate: "2026-08-01",
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      siteUrl: websiteCopy.site.url,
    },
  },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/content",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "nuxt-schema-org",
  ],
  site: {
    url: websiteCopy.site.url,
    name: websiteCopy.site.name,
    description: websiteCopy.site.description,
    defaultLocale: websiteCopy.site.defaultLocale,
  },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      meta: [
        { name: "theme-color", content: websiteCopy.site.themeColor },
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
  i18n: {
    strategy: "no_prefix",
    defaultLocale: "en",
    baseUrl: websiteCopy.site.url,
    detectBrowserLanguage: false,
    locales: [
      { code: "en", language: "en-US", name: "English" },
      { code: "es", language: "es-US", name: "Español" },
      { code: "pt", language: "pt-BR", name: "Português" },
    ],
    vueI18n: "../i18n.config.ts",
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
    disallow: ["/start/"],
  },
  sitemap: {
    exclude: ["/start/**", "/api/**", "/404"],
    zeroRuntime: true,
  },
  schemaOrg: {
    identity: {
      type: "Organization",
      name: websiteCopy.site.contact.name,
      url: websiteCopy.site.url,
      logo: `${websiteCopy.site.url}${websiteCopy.site.logo}`,
    },
  },
  routeRules: {
    ...Object.fromEntries(
      PUBLIC_ROUTES.map(route => [route, { prerender: true }])
    ),
    "/start/**": { prerender: true, robots: false, sitemap: false },
    "/api/**": { robots: false, sitemap: false },
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: [
        ...PUBLIC_ROUTES,
        ...previewRoutes,
        "/robots.txt",
        "/sitemap.xml",
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
});
