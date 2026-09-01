import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { loadRepositoryContent } from "./lib/content/load-content";
import { localeDefinitions } from "./lib/content/localization";
import { getPreviewRoutes, getPublicRoutes } from "./lib/content/schema";

const rootDirectory = fileURLToPath(new URL(".", import.meta.url));
const { siteCopy: websiteCopy, blogPosts } =
  loadRepositoryContent(rootDirectory);
const previewRoutes = getPreviewRoutes();
const publicRoutes = [
  ...getPublicRoutes(websiteCopy),
  ...(blogPosts.length
    ? [websiteCopy.blog.path, ...blogPosts.map(post => `/blog/${post.slug}`)]
    : []),
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
    "./modules/site-content",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxtjs/i18n",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "nuxt-schema-org",
    "@nuxt/devtools",
    "nuxt-seo-utils",
  ],
  site: {
    url: websiteCopy.site.url,
    name: websiteCopy.site.name,
    description: websiteCopy.site.description,
    defaultLocale: websiteCopy.site.defaultLocale,
  },
  i18n: {
    baseUrl: websiteCopy.site.url,
    defaultLocale: "en",
    strategy: "prefix_except_default",
    detectBrowserLanguage: false,
    customRoutes: "meta",
    locales: localeDefinitions,
  },
  app: {
    head: {
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
    exclude: [
      "/start/**",
      "/404",
      ...(blogPosts.length ? [] : ["/blog", "/blog/**"]),
    ],
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
      publicRoutes.map(route => [route, { prerender: true }])
    ),
    "/start/**": { prerender: true, robots: false, sitemap: false },
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      failOnError: true,
      ignore: blogPosts.length ? [] : ["/blog", "/blog/**"],
      routes: [
        ...publicRoutes,
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