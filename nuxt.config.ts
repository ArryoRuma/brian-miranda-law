import tailwindcss from "@tailwindcss/vite";
import { PUBLIC_ROUTES } from "./app/data/site";

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
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "nuxt-schema-org",
  ],
  site: {
    url: "https://bmirandalaw.com",
    name: "Miranda Law",
    description:
      "Clear estate-planning guidance for North Jersey families in English, Spanish, and Portuguese.",
    defaultLocale: "en",
  },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
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
  i18n: {
    strategy: "no_prefix",
    defaultLocale: "en",
    baseUrl: "https://bmirandalaw.com",
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
      name: "The Law Offices of Brian M. Miranda, Esq., LLC",
      url: "https://bmirandalaw.com",
      logo: "https://bmirandalaw.com/miranda-law-gold.png",
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
