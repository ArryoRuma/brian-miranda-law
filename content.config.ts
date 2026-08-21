import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const text = z.string().nonempty();
const path = text;

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
  image: path.optional(),
  imageAlt: text.optional(),
  secondaryHref: path.optional(),
  secondaryLabel: text.optional(),
});

const sectionSchema = z.object({
  id: text.optional(),
  eyebrow: text.optional(),
  title: text,
  body: z.array(text).optional(),
  bullets: z.array(text).optional(),
  cards: z.array(cardSchema).optional(),
  steps: z.array(cardSchema).optional(),
  note: text.optional(),
  tone: z.enum(["paper", "sand", "dark", "blue"]).optional(),
});

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

const introSchema = z.object({
  eyebrow: text,
  title: text,
  body: text,
});

const stepSchema = z.object({
  title: text,
  body: text,
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
  steps: z.array(stepSchema),
  cta: text,
});

const localeRecord = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({ en: schema, es: schema, pt: schema });

export default defineContentConfig({
  collections: {
    site: defineCollection({
      type: "data",
      source: "site.yml",
      schema: z.object({
        site: z.object({
          name: text,
          url: text,
          logo: path,
          defaultLocale: text,
          themeColor: text,
          defaultTitle: text,
          titleSuffix: text,
          description: text,
          contact: z.object({
            name: text,
            shortName: text,
            attorney: text,
            email: text,
            phoneDisplay: text,
            phoneHref: text,
            alternatePhoneDisplay: text,
            alternatePhoneHref: text,
            addressLines: z.array(text).length(2),
            mapUrl: text,
          }),
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
              linkSchema.extend({ children: z.array(linkSchema).optional() })
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
          seo: seoSchema,
          hero: z.object({
            eyebrow: text,
            title: text,
            accent: text,
            lead: text,
            supportingLead: text,
            ctaLabel: text,
            contactPrompt: text,
            contactLinkLabel: text,
            processLabel: text,
            note: text,
            image: path,
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
            items: z.array(
              z.object({
                icon: z.enum(["file", "landmark", "hand", "heart"]),
                number: text,
                title: text,
                description: text,
                linkLabel: text,
                href: path,
              })
            ),
          }),
          why: z.object({
            eyebrow: text,
            title: text,
            body: text,
            items: z.array(
              z.object({
                title: text,
                description: text,
              })
            ),
          }),
          process: z.object({
            eyebrow: text,
            title: text,
            accent: text,
            image: path,
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
            seo: seoSchema,
            hero: heroSchema,
            groupIntro: text,
            groups: z.array(
              z.object({ title: text, items: z.array(faqSchema) })
            ),
          }),
          checklist: z.object({
            seo: seoSchema,
            hero: heroSchema,
            intro: introSchema,
            groups: z.array(z.object({ title: text, items: z.array(text) })),
            finalCta: z.object({ title: text, body: text }),
          }),
          video: z.object({
            seo: seoSchema,
            hero: heroSchema,
            intro: introSchema,
            placeholder: text,
            topics: z.array(z.object({ title: text, summary: text })),
          }),
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
        api: z.object({
          contact: z.object({
            status: text,
            message: text,
          }),
        }),
      }),
    }),
  },
});
