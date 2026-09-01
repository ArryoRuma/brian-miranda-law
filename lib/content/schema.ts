import { z } from "zod";
import {
  collectTranslatableStrings,
  getLocalizedPublicRoutes,
  localizePath,
  locales,
  type Locale,
} from "./localization";

const text = z.string().trim().min(1);
const path = text.regex(
  /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*$|^\/$/,
  {
    message: "Expected an absolute, normalized site path",
  }
);
const assetPath = text.refine(
  value => /^\/[a-zA-Z0-9._/-]+$/.test(value) && !value.includes(".."),
  "Expected a safe absolute asset path"
);
const absoluteUrl = z.string().trim().url();
const siteUrl = absoluteUrl.refine(value => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.origin === value;
  } catch {
    return false;
  }
}, "Expected an HTTPS origin without a trailing slash, path, query, or hash");
const phone = text.regex(/^\+[1-9]\d{9,14}$/, {
  message: "Expected an E.164 phone number",
});
const phoneDisplay = text.regex(/^\+?[\d\s().-]{10,20}$/, {
  message: "Expected a readable phone number",
});

const linkSchema = z.object({
  label: text,
  href: path,
});

const languageLinkSchema = linkSchema.extend({
  language: text,
});

const faqSchema = z.object({
  question: text,
  answer: text,
});

const cardSchema = z.object({
  title: text,
  body: text,
  href: path.optional(),
  linkLabel: text.optional(),
});

const heroSchema = z.object({
  eyebrow: text,
  title: text,
  accent: text.optional(),
  lead: text,
  image: assetPath.optional(),
  imageAlt: text.optional(),
  secondaryHref: path.optional(),
  secondaryLabel: text.optional(),
});

const sectionBaseShape = {
  id: text.optional(),
  eyebrow: text.optional(),
  title: text,
  note: text.optional(),
  tone: z.enum(["paper", "sand", "dark", "blue"]).optional(),
};

const sectionSchema = z.discriminatedUnion("type", [
  z
    .object({
      ...sectionBaseShape,
      type: z.literal("narrative"),
      body: z.array(text).min(1),
    })
    .strict(),
  z
    .object({
      ...sectionBaseShape,
      type: z.literal("checklist"),
      bullets: z.array(text).min(1),
    })
    .strict(),
  z
    .object({
      ...sectionBaseShape,
      type: z.literal("cards"),
      cards: z.array(cardSchema).min(1),
    })
    .strict(),
  z
    .object({
      ...sectionBaseShape,
      type: z.literal("steps"),
      steps: z.array(cardSchema).min(1),
    })
    .strict(),
]);

const pageSchema = z.object({
  path,
  title: text,
  metaDescription: text,
  hero: heroSchema,
  sections: z.array(sectionSchema),
  faqs: z.array(faqSchema).optional(),
  finalCta: z
    .object({
      title: text,
      body: text,
    })
    .optional(),
});

const seoSchema = z.object({
  title: text,
  description: text,
  path: path.optional(),
});
const routedSeoSchema = seoSchema.extend({ path });

const introSchema = z.object({
  eyebrow: text,
  title: text,
  body: text,
});

const stepSchema = z.object({
  title: text,
  body: text,
});

const identifiedStepSchema = stepSchema.extend({
  id: z.enum(["documents", "schedule", "communicate"]),
});

const legalPageSchema = z.object({
  title: text,
  description: text,
  updated: text,
  intro: text,
  sections: z.array(
    z.object({
      title: text,
      paragraphs: z.array(text),
      bullets: z.array(text).optional(),
    })
  ),
});

const questionnaireLocaleSchema = z.object({
  title: text,
  meta: text,
  eyebrow: text,
  heading: text,
  lead: text,
  trust: z.array(text),
  statusTitle: text,
  statusBody: text,
  groups: z.array(stepSchema),
  cta: text,
});

const nextStepsLocaleSchema = z.object({
  title: text,
  eyebrow: text,
  heading: text,
  lead: text,
  steps: z.array(identifiedStepSchema),
  cta: text,
});

const localeRecord = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({ en: schema, es: schema, pt: schema });

const translationReviewStatusSchema = z.enum(["approved", "draft"]);

const translationReviewSchema = z.object({
  status: translationReviewStatusSchema,
  variant: text,
  fluentReviewRequired: z.boolean(),
  legalReviewRequired: z.boolean(),
  pages: z.record(path, translationReviewStatusSchema),
});

const contactSchema = z
  .object({
    name: text,
    shortName: text,
    attorney: text,
    email: z.string().trim().email(),
    phoneDisplay,
    phoneHref: phone,
    addressLines: z.array(text).length(2),
    mapUrl: absoluteUrl,
  })
  .superRefine((contact, context) => {
    const displayedDigits = contact.phoneDisplay.replace(/\D/g, "");
    const linkedDigits = contact.phoneHref.replace(/\D/g, "");
    if (displayedDigits !== linkedDigits.slice(-displayedDigits.length)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phoneDisplay"],
        message: "Displayed and linked phone numbers must match",
      });
    }
  });

const rawSiteContentSchema = z.object({
  site: z.object({
    name: text,
    url: siteUrl,
    logo: assetPath,
    defaultLocale: text,
    themeColor: text,
    defaultTitle: text,
    titleSuffix: text,
    description: text,
    contact: contactSchema,
    structuredData: z.object({
      streetAddress: text,
      addressLocality: text,
      addressRegion: text,
      postalCode: text,
      addressCountry: text,
      areaServed: text,
      knowsLanguage: z.array(text),
      attorneyJobTitle: text,
    }),
    navigation: z.object({
      primary: z.array(
        linkSchema.extend({
          id: text,
          children: z.array(linkSchema).optional(),
        })
      ),
      estatePlanning: z.array(linkSchema),
      resources: z.array(linkSchema),
      languages: z.array(languageLinkSchema),
    }),
    contactActions: z.array(
      z.object({
        id: z.enum(["call", "text", "whatsapp", "email"]),
        label: text,
        shortLabel: text,
        priority: z.enum(["primary", "secondary"]),
        external: z.boolean(),
      })
    ),
    breadcrumbs: z.object({
      home: text,
      ariaLabel: text,
      labels: z.record(z.string(), text),
    }),
    header: z.object({
      skipLink: text,
      railMark: text,
      railLabel: text,
      homeAriaLabel: text,
      logoAlt: text,
      openMenuAriaLabel: text,
      closeMenuAriaLabel: text,
      navigationAriaLabel: text,
      estateMenuAriaLabel: text,
      questionnairesAriaLabel: text,
      questionnaireLinkAriaLabel: text,
      backdropAriaLabel: text,
      quickContactAriaLabel: text,
    }),
    footer: z.object({
      description: text,
      estatePlanningHeading: text,
      resourcesHeading: text,
      aboutLabel: text,
      otherServicesLabel: text,
      contactHeading: text,
      privacyLabel: text,
      cookiesLabel: text,
      disclaimerLabel: text,
      accessibilityLabel: text,
      attorneyAdvertising: text,
    }),
    shared: z.object({
      contactActionsAriaLabel: text,
      serviceLinkAriaLabel: text,
      viewContactOptions: text,
      learnMore: text,
      interiorHeroDefaultImageAlt: text,
      editorialFaq: introSchema,
      finalCta: introSchema,
      legal: z.object({
        eyebrow: text,
        updatedLabel: text,
      }),
    }),
  }),
  home: z.object({
    seo: routedSeoSchema,
    hero: z.object({
      eyebrow: text,
      title: text,
      accent: text,
      lead: text,
      supportingLead: text,
      ctaLabel: text,
      contactPrompt: text,
      callLabel: text,
      textLabel: text,
      whatsAppLabel: text,
      contactSeparator: text,
      contactFinalSeparator: text,
      note: text,
      image: assetPath,
      imageAlt: text,
      captionPrimary: text,
      captionSecondary: text,
      indexCurrent: text,
      indexSeparator: text,
      indexTotal: text,
    }),
    trustStripAriaLabel: text,
    trustStrip: z.array(text),
    intro: z.object({
      eyebrow: text,
      title: text,
      paragraphs: z.array(text),
      ctaLabel: text,
      href: path,
    }),
    services: z.object({
      eyebrow: text,
      title: text,
      aside: text,
      items: z
        .array(
          z.object({
            icon: z.enum(["file", "landmark", "hand", "heart"]),
            number: text,
            title: text,
            description: text,
            linkLabel: text,
            href: path,
          })
        )
        .length(4),
    }),
    why: z.object({
      eyebrow: text,
      title: text,
      body: text,
      items: z
        .array(
          z.object({
            icon: z.enum(["shield", "person", "message", "languages"]),
            title: text,
            description: text,
          })
        )
        .length(4),
    }),
    process: z.object({
      eyebrow: text,
      title: text,
      accent: text,
      image: assetPath,
      imageAlt: text,
      steps: z.array(
        z.object({
          number: text,
          title: text,
          description: text,
        })
      ),
      ctaLabel: text,
      href: path,
    }),
    about: z.object({
      mark: text,
      eyebrow: text,
      title: text,
      body: text,
      linkLabel: text,
      href: path,
    }),
    languages: z.object({
      eyebrow: text,
      title: text,
      body: text,
      availability: text,
      prompt: text,
      items: z.array(languageLinkSchema),
      questionnaireLabel: text,
      questionnaireHref: path,
    }),
    otherServices: z.object({
      eyebrow: text,
      title: text,
      body: text,
      items: z.array(text),
      linkLabel: text,
      href: path,
    }),
    reviews: z.object({
      eyebrow: text,
      title: text,
      body: text,
      status: text,
    }),
    faq: z.object({
      eyebrow: text,
      title: text,
      body: text,
      linkLabel: text,
      href: path,
      items: z.array(faqSchema),
    }),
    contact: z.object({
      eyebrow: text,
      title: text,
      body: text,
      ctaLabel: text,
      cardLabel: text,
      preferencePrompt: text,
      optionsLabel: text,
    }),
  }),
  pages: z.record(z.string(), pageSchema),
  resources: z.object({
    faq: z.object({
      seo: routedSeoSchema,
      hero: heroSchema,
      groupIntro: text,
      groups: z.array(z.object({ title: text, items: z.array(faqSchema) })),
    }),
    checklist: z.object({
      seo: routedSeoSchema,
      hero: heroSchema,
      intro: introSchema,
      groups: z.array(z.object({ title: text, items: z.array(text) })),
      finalCta: z.object({ title: text, body: text }),
    }),
    video: z.object({
      seo: routedSeoSchema,
      hero: heroSchema,
      intro: introSchema,
      placeholder: text,
      topics: z.array(z.object({ title: text, summary: text })),
    }),
  }),
  blog: z.object({
    path,
    label: text,
    seo: routedSeoSchema,
    hero: heroSchema,
    articleLabel: text,
    publishedLabel: text,
    updatedLabel: text,
    backLabel: text,
    topicsLabel: text,
  }),
  contactPage: z.object({
    intro: introSchema.extend({ note: text }),
    optionValues: z.object({
      call: text,
      text: text,
      whatsapp: text,
      email: text,
    }),
    office: introSchema,
  }),
  legal: z.record(z.string(), legalPageSchema),
  questionnaire: z.object({
    common: z.object({
      previewEyebrow: text,
      confidentiality: text,
    }),
    locales: localeRecord(questionnaireLocaleSchema),
  }),
  nextSteps: z.object({
    locales: localeRecord(nextStepsLocaleSchema),
    whatsAppLabel: text,
  }),
  error404: z.object({
    title: text,
    description: text,
    eyebrow: text,
    heading: text,
    body: text,
    actionLabel: text,
  }),
  localization: z.object({
    review: localeRecord(translationReviewSchema),
    translations: z.object({
      es: z.record(z.string(), text),
      pt: z.record(z.string(), text),
    }),
  }),
});

function addIssue(
  context: z.RefinementCtx,
  path: Array<string | number>,
  message: string
) {
  context.addIssue({ code: z.ZodIssueCode.custom, path, message });
}

export const getStaticPageRoutes = (
  content: z.infer<typeof rawSiteContentSchema>
) =>
  [
    content.home.seo.path,
    ...Object.values(content.pages).map(page => page.path),
    content.resources.faq.seo.path,
    content.resources.checklist.seo.path,
    content.resources.video.seo.path,
    ...Object.keys(content.legal).map(key => `/${key}`),
  ].filter((route): route is string => Boolean(route));

export const getPreviewRoutes = () =>
  (["en", "es", "pt"] as const).flatMap(locale => [
    `/start/${locale}`,
    `/start/${locale}/what-happens-next`,
  ]);

export const getPublicRoutes = (
  content: z.infer<typeof rawSiteContentSchema>
) => {
  const englishRoutes = getStaticPageRoutes(content);
  return locales.flatMap(locale =>
    getLocalizedPublicRoutes(englishRoutes, locale)
  );
};

export const siteContentSchema = rawSiteContentSchema.superRefine(
  (content, context) => {
    const staticRoutes = getStaticPageRoutes(content);
    const publicRoutes = getPublicRoutes(content);
    const localizedBlogRoutes = locales.map(locale =>
      localizePath(content.blog.path, locale)
    );
    const allRoutes = [
      ...publicRoutes,
      ...localizedBlogRoutes,
      ...getPreviewRoutes(),
    ];
    if (new Set(allRoutes).size !== allRoutes.length) {
      addIssue(context, ["pages"], "Every public page path must be unique");
    }

    if (content.blog.path !== content.blog.seo.path) {
      addIssue(
        context,
        ["blog", "seo", "path"],
        "Blog route and SEO path must match"
      );
    }

    const navigationIds = content.site.navigation.primary.map(item => item.id);
    if (new Set(navigationIds).size !== navigationIds.length) {
      addIssue(
        context,
        ["site", "navigation", "primary"],
        "Primary navigation IDs must be unique"
      );
    }

    const requiredNavigation = new Map([
      ["estate-planning", "/estate-planning"],
      ["about", "/about"],
      ["resources", "/resources"],
      ["other-services", "/other-services"],
      ["contact", "/contact"],
    ]);
    for (const [id, href] of requiredNavigation) {
      const item = content.site.navigation.primary.find(
        entry => entry.id === id
      );
      if (!item || item.href !== href) {
        addIssue(
          context,
          ["site", "navigation", "primary"],
          `Primary navigation requires ${id} at ${href}`
        );
      }
    }
    if (navigationIds.length !== requiredNavigation.size) {
      addIssue(
        context,
        ["site", "navigation", "primary"],
        "Primary navigation must contain exactly the required records"
      );
    }

    const estateItem = content.site.navigation.primary.find(
      item => item.id === "estate-planning"
    );
    if (!estateItem?.children?.length) {
      addIssue(
        context,
        ["site", "navigation", "primary"],
        "Primary navigation requires an estate-planning item with children"
      );
    }
    if (
      estateItem?.children &&
      JSON.stringify([
        { label: estateItem.label, href: estateItem.href },
        ...estateItem.children,
      ]) !== JSON.stringify(content.site.navigation.estatePlanning)
    ) {
      addIssue(
        context,
        ["site", "navigation", "estatePlanning"],
        "Estate-planning header and footer links must match"
      );
    }

    const languageHrefs = content.site.navigation.languages.map(
      item => item.href
    );
    const requiredLanguageHrefs = ["/", "/es", "/pt"];
    if (
      languageHrefs.length !== requiredLanguageHrefs.length ||
      requiredLanguageHrefs.some(href => !languageHrefs.includes(href))
    ) {
      addIssue(
        context,
        ["site", "navigation", "languages"],
        "Language navigation must link to the three localized homepages"
      );
    }

    const homeLanguageHrefs = content.home.languages.items.map(
      item => item.href
    );
    if (
      JSON.stringify(homeLanguageHrefs) !==
      JSON.stringify(requiredLanguageHrefs)
    ) {
      addIssue(
        context,
        ["home", "languages", "items"],
        "Homepage language navigation must link to the localized homepages"
      );
    }

    const translatableStrings = collectTranslatableStrings(content);
    for (const locale of ["es", "pt"] as const) {
      const translations = content.localization.translations[locale];
      const requiredSources = new Set(translatableStrings.keys());
      const suppliedSources = new Set(Object.keys(translations));

      for (const source of requiredSources) {
        if (!suppliedSources.has(source)) {
          addIssue(
            context,
            ["localization", "translations", locale, source],
            `Missing ${locale} translation for: ${source}`
          );
        }
      }

      for (const source of suppliedSources) {
        if (!requiredSources.has(source)) {
          addIssue(
            context,
            ["localization", "translations", locale, source],
            `Translation source is no longer used: ${source}`
          );
        }
      }
    }

    const expectedVariants: Record<Locale, string> = {
      en: "en-US",
      es: "es-US",
      pt: "pt-BR",
    };
    for (const locale of locales) {
      if (
        content.localization.review[locale].variant !== expectedVariants[locale]
      ) {
        addIssue(
          context,
          ["localization", "review", locale, "variant"],
          `Expected ${expectedVariants[locale]} translation variant`
        );
      }

      const review = content.localization.review[locale];
      const reviewedRoutes = Object.keys(review.pages);
      if (
        reviewedRoutes.length !== staticRoutes.length ||
        staticRoutes.some(route => !reviewedRoutes.includes(route))
      ) {
        addIssue(
          context,
          ["localization", "review", locale, "pages"],
          "Translation review must track every public page"
        );
      }
      const allPagesApproved = Object.values(review.pages).every(
        status => status === "approved"
      );
      if ((review.status === "approved") !== allPagesApproved) {
        addIssue(
          context,
          ["localization", "review", locale, "status"],
          "Overall translation status must match the page review statuses"
        );
      }
    }

    const contactActionIds = content.site.contactActions.map(
      action => action.id
    );
    if (contactActionIds.length !== 4 || new Set(contactActionIds).size !== 4) {
      addIssue(
        context,
        ["site", "contactActions"],
        "Contact actions must contain call, text, WhatsApp, and email exactly once"
      );
    }

    const serviceIcons = content.home.services.items.map(item => item.icon);
    if (new Set(serviceIcons).size !== serviceIcons.length) {
      addIssue(
        context,
        ["home", "services", "items"],
        "Service icon IDs must be unique"
      );
    }

    const whyIcons = content.home.why.items.map(item => item.icon);
    if (new Set(whyIcons).size !== whyIcons.length) {
      addIssue(
        context,
        ["home", "why", "items"],
        "Why-card icon IDs must be unique"
      );
    }

    const knownRoutes = new Set([
      ...publicRoutes,
      ...getPreviewRoutes(),
      ...localizedBlogRoutes,
    ]);

    const inspectLinks = (
      value: unknown,
      trail: Array<string | number> = []
    ) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => inspectLinks(item, [...trail, index]));
        return;
      }
      if (!value || typeof value !== "object") return;

      Object.entries(value).forEach(([key, item]) => {
        const itemPath = [...trail, key];
        if (
          typeof item === "string" &&
          (key === "href" || key === "secondaryHref") &&
          item.startsWith("/") &&
          !knownRoutes.has(item)
        ) {
          addIssue(
            context,
            itemPath,
            `Internal link does not resolve: ${item}`
          );
        }
        inspectLinks(item, itemPath);
      });
    };

    inspectLinks(content);

    for (const route of [...staticRoutes, content.blog.path]) {
      if (route !== "/" && !content.site.breadcrumbs.labels[route]) {
        addIssue(
          context,
          ["site", "breadcrumbs", "labels", route],
          `Missing breadcrumb label for ${route}`
        );
      }
    }

    Object.entries(content.nextSteps.locales).forEach(([locale, value]) => {
      const ids = value.steps.map(step => step.id);
      if (ids.join(",") !== "documents,schedule,communicate") {
        addIssue(
          context,
          ["nextSteps", "locales", locale, "steps"],
          "Next-step IDs must be documents, schedule, communicate in that order"
        );
      }
    });
  }
);

export type SiteContent = z.infer<typeof siteContentSchema>;
export type SitePageContent = SiteContent["pages"][string];
export type HomeService = SiteContent["home"]["services"]["items"][number];
export type PageSectionContent = SitePageContent["sections"][number];
export type PageCard = Extract<
  PageSectionContent,
  { type: "cards" }
>["cards"][number];
export type FaqContent = NonNullable<SitePageContent["faqs"]>[number];
