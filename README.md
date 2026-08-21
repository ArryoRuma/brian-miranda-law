# Brian Miranda Law website

The production website for The Law Offices of Brian M. Miranda, Esq., LLC. This is a Nuxt 4 application built with Vue 3, strict TypeScript, Nuxt Content 3, Tailwind CSS 4, Nuxt Image, Nuxt i18n, and Nitro.

Most website wording and verified firm information live in one validated file: [`content/site.yml`](content/site.yml). Vue components own presentation and interaction; the YAML owns editable copy. The application can be deployed either as a prerendered static site or as a Nitro server.

> [!IMPORTANT]
> This is a legal-services website. Do not publish invented credentials, testimonials, results, services, fees, office details, or legal claims. Changes to firm facts, practice claims, policies, intake behavior, and multilingual copy require owner/legal review.

## Contents

- [Quick start](#quick-start)
- [Commands](#commands)
- [How the application works](#how-the-application-works)
- [Repository map](#repository-map)
- [Routing model](#routing-model)
- [Content and YAML](#content-and-yaml)
- [The two kinds of schema](#the-two-kinds-of-schema)
- [Common editing workflows](#common-editing-workflows)
  - [Edit existing copy](#edit-existing-copy)
  - [Change firm-wide information](#change-firm-wide-information)
  - [Add an image](#add-an-image)
  - [Create a reusable component](#create-a-reusable-component)
  - [Add a standard editorial page](#add-a-standard-editorial-page)
  - [Add a specialized page](#add-a-specialized-page)
  - [Add a real Markdown blog](#add-a-real-markdown-blog)
- [SEO, structured data, robots, and sitemap](#seo-structured-data-robots-and-sitemap)
- [Styling and design system](#styling-and-design-system)
- [Localization](#localization)
- [Server API boundaries](#server-api-boundaries)
- [Build and deployment](#build-and-deployment)
- [Verification checklist](#verification-checklist)
- [Known constraints and maintenance notes](#known-constraints-and-maintenance-notes)
- [Troubleshooting](#troubleshooting)
- [Project references](#project-references)

## Quick start

### Prerequisites

- Node.js. The repository does not currently pin a Node version, so use a maintained Node release supported by the installed Nuxt version.
- pnpm `10.4.1`. The exact package-manager version is pinned in `package.json`.

If Corepack is available in your Node installation, it can activate the pinned pnpm version. Otherwise, install pnpm `10.4.1` with your normal Node package-manager setup.

```bash
pnpm --version
pnpm install --frozen-lockfile
pnpm dev
```

The development server listens on all local interfaces and is normally available at [http://localhost:3000](http://localhost:3000).

There are currently no required environment variables. The public site URL and firm identity are read from `content/site.yml` at build/startup time.

## Commands

| Command             | Purpose                                                  | Important output or behavior                            |
| ------------------- | -------------------------------------------------------- | ------------------------------------------------------- |
| `pnpm dev`          | Start Nuxt development mode on `0.0.0.0`                 | Local server, normally port 3000                        |
| `pnpm typecheck`    | Generate Nuxt types and run strict Vue/TypeScript checks | Validates component types and the Nuxt Content model    |
| `pnpm check`        | Alias for `pnpm typecheck`                               | No separate lint task exists                            |
| `pnpm build`        | Build the SSR/Nitro application                          | `.output/server` and public assets                      |
| `pnpm generate`     | Prerender the static website                             | `.output/public`                                        |
| `pnpm preview`      | Preview the most recent Nuxt build                       | Local preview server on `0.0.0.0`                       |
| `pnpm start`        | Start the built Nitro server                             | Runs `.output/server/index.mjs`; run `pnpm build` first |
| `pnpm format`       | Format the repository with Prettier                      | Writes files; inspect the resulting diff                |
| `pnpm format:check` | Check Prettier formatting without writing                | Suitable for CI and final verification                  |

This repository has no automated unit-test, end-to-end-test, or ESLint script at present. The minimum acceptance checks are type checking, both production output modes, formatting, and route-level smoke testing.

## How the application works

The main data and rendering flow is:

```text
content/site.yml
      │
      ├── validated by content.config.ts
      │        └── generates Nuxt Content collection types
      │
      ├── loaded by useSiteCopy()
      │        ├── app.vue + shared layout/components
      │        ├── pages/index.vue
      │        ├── pages/[...slug].vue
      │        └── server/api/contact.post.ts
      │
      └── read directly by nuxt.config.ts at startup
               ├── site URL and identity
               ├── robots and sitemap configuration
               ├── route prerendering
               ├── global Organization JSON-LD identity
               └── image, i18n, and Tailwind modules
```

At request time, Nuxt selects a file-based page under `app/pages`. The homepage is a dedicated composition. All other current marketing, resource, legal, and questionnaire routes enter through the catch-all page, which resolves the URL to a content shape and selects a renderer component.

Shared components call `useSiteCopy()` with the same async-data key, `site-copy`, so site data is fetched consistently and reused. If the collection cannot be queried or `site.yml` is missing, the composable throws a server error instead of rendering partial content.

### Rendering boundaries

- [`app/app.vue`](app/app.vue) sets the global title template and social defaults, then renders the active layout and page.
- [`app/layouts/default.vue`](app/layouts/default.vue) supplies the site header, main landmark, and footer.
- [`app/pages/index.vue`](app/pages/index.vue) owns the image-led homepage layout and homepage Schema.org nodes.
- [`app/pages/[...slug].vue`](app/pages/%5B...slug%5D.vue) maps all other supported paths to the appropriate renderer.
- [`app/error.vue`](app/error.vue) renders the content-managed, non-indexed error page.
- [`app/composables/use-site-copy.ts`](app/composables/use-site-copy.ts) is the single client/application loader for the `site` data collection.
- [`app/composables/use-page-seo.ts`](app/composables/use-page-seo.ts) sets titles, descriptions, canonicals, robots directives, Open Graph data, Twitter card data, and page language.

## Repository map

```text
.
├── app/
│   ├── app.vue                   # Application root and global metadata
│   ├── assets/css/main.css       # Tailwind import, design tokens, and site CSS
│   ├── components/               # Auto-imported Vue components
│   ├── composables/              # Content loading and per-page SEO
│   ├── data/routes.ts            # Prerendered public route list + contact URL helpers
│   ├── error.vue                 # 404/error UI
│   ├── layouts/default.vue       # Header/main/footer shell
│   ├── pages/index.vue           # Current homepage
│   ├── pages/index-backup.vue    # Older homepage snapshot; also creates a live route
│   ├── pages/[...slug].vue       # Resolver for non-home routes
│   └── types/content.ts          # Handwritten prop types used by components
├── content/
│   └── site.yml                  # Single editable site-copy and firm-data document
├── public/                       # Files served from / without the public/ prefix
│   ├── agents.json               # Public machine-readable site description
│   ├── images/                   # Editorial photography
│   └── miranda-law-*             # Logo variants
├── server/api/
│   ├── contact.post.ts           # Intentional non-collecting 501 placeholder
│   └── health.get.ts             # Health check
├── content.config.ts             # Nuxt Content collections + Zod validation contract
├── i18n.config.ts                # Empty locale message registries and fallback
├── nuxt.config.ts                # Modules, site config, prerender, SEO, i18n, images
├── MIGRATION_PLAN.md             # React/Vite-to-Nuxt audit and migration decisions
├── ideas.md                      # Original visual direction; excluded from formatting
├── package.json                  # Scripts, dependencies, and pinned pnpm version
├── pnpm-lock.yaml                # Reproducible dependency graph
├── pnpm-workspace.yaml           # Keeps this repository as its own pnpm workspace
└── tsconfig.json                 # References Nuxt-generated TypeScript projects
```

Generated directories are intentionally ignored:

- `.nuxt/` contains generated Nuxt types and development artifacts.
- `.output/` contains the server or static production output.
- `.data/` and local SQLite files are runtime/build artifacts used by the content layer.

Do not edit generated files. Change source files and regenerate them with `pnpm typecheck`, `pnpm build`, or `pnpm generate`.

## Routing model

### Current routes

| URL or pattern                                | Source                       | Renderer                                              | Indexing/build behavior                                         |
| --------------------------------------------- | ---------------------------- | ----------------------------------------------------- | --------------------------------------------------------------- |
| `/`                                           | `home` in `site.yml`         | `app/pages/index.vue`                                 | Public, indexed, explicitly prerendered                         |
| `/estate-planning`                            | `pages.estatePlanning`       | `EditorialPage`                                       | Public, indexed, explicitly prerendered                         |
| `/estate-planning/{service}`                  | Four records under `pages`   | `EditorialPage`                                       | Public, indexed, explicitly prerendered                         |
| `/about`                                      | `pages.about`                | `EditorialPage`                                       | Public, indexed, explicitly prerendered                         |
| `/resources`                                  | `pages.resources`            | `EditorialPage`                                       | Public, indexed, explicitly prerendered                         |
| `/other-services`                             | `pages.otherServices`        | `EditorialPage`                                       | Public, indexed, explicitly prerendered                         |
| `/contact`                                    | `pages.contact`              | Currently `EditorialPage`; see the routing note below | Public, indexed, explicitly prerendered                         |
| `/resources/estate-planning-faqs`             | `resources.faq`              | `FaqResourcePage`                                     | Public, indexed, explicitly prerendered                         |
| `/resources/estate-planning-checklist`        | `resources.checklist`        | `ChecklistPageContent`                                | Public, indexed, explicitly prerendered                         |
| `/resources/video-blog`                       | `resources.video`            | `VideoLibraryPage`                                    | Public, indexed, explicitly prerendered; content is coming soon |
| `/{privacy,cookies,disclaimer,accessibility}` | Matching `legal` record      | `LegalPageContent`                                    | Public, indexed, explicitly prerendered                         |
| `/start/{en,es,pt}`                           | `questionnaire.locales`      | `QuestionnairePreview`                                | Prerendered, `noindex`, excluded from sitemap                   |
| `/start/{locale}/what-happens-next`           | `nextSteps.locales`          | `NextStepsPreview`                                    | Prerendered, `noindex`, excluded from sitemap                   |
| `/api/health`                                 | Server handler               | Nitro JSON endpoint                                   | Configured non-indexable; excluded from sitemap                 |
| `/api/contact`                                | Server handler               | Nitro JSON endpoint                                   | Returns 501; configured non-indexable; excluded from sitemap    |
| `/index-backup`                               | `app/pages/index-backup.vue` | Older homepage composition                            | Crawled, prerendered, and currently present in the sitemap      |
| Any unresolved path                           | `app/error.vue`              | Error page                                            | 404 and `noindex`                                               |

The authoritative explicit public-route list is [`PUBLIC_ROUTES`](app/data/routes.ts). It drives route rules and prerender inputs in `nuxt.config.ts`. The same public URLs are also duplicated in `public/agents.json`, so additions or removals must keep both files aligned.

### Catch-all resolution order

`app/pages/[...slug].vue` resolves URLs in this order:

1. Any item under `site.yml` → `pages`, indexed by its `path` field.
2. `/contact` as a specialized contact page.
3. Three specialized resource paths.
4. Four legal paths.
5. Questionnaire preview paths.
6. Questionnaire next-step paths.
7. A 404 error if no resolver matches.

Order matters. `pages.contact.path` is `/contact`, so it currently matches step 1 before the specialized `ContactPageContent` branch can run. As a result, the `contactPage` YAML block and richer contact renderer are not currently displayed at `/contact`. To enable the specialized page in a future code change, either check `/contact` before generic editorial pages or remove `pages.contact` from the generic lookup while retaining a separate source for its hero and metadata.

### Adding a URL safely

Creating a content record is only part of adding a public page. For each new indexed URL, check all of the following:

- A file-based route or catch-all resolver can render the URL.
- The URL has validated content and unique SEO metadata.
- The URL is added to `PUBLIC_ROUTES` if it should always be prerendered.
- Header/footer navigation is updated if the page should be discoverable there.
- `site.breadcrumbs.labels` contains every desired breadcrumb segment.
- `public/agents.json` is updated if the URL is part of the advertised public set.
- `robots` and `sitemap` rules reflect whether it should be indexed.
- `pnpm generate` produces the expected `.output/public/.../index.html` file.
- The generated sitemap contains the URL exactly once.

## Content and YAML

### Why the site uses one YAML document

The current marketing site is relatively small and highly interconnected. Keeping approved wording, contact details, accessibility labels, SEO descriptions, and page content in one document makes copy review possible without hunting through Vue templates. It also prevents components from becoming a second, inconsistent copy source.

The `site` Nuxt Content collection is declared as `type: "data"` because one YAML document supplies many routes; it is not a one-file-per-page collection. `useSiteCopy()` calls `queryCollection("site").first()` and returns that one validated object.

### Top-level YAML map

| Key             | What it controls                                                                                                            | Main consumers                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `site`          | Identity, canonical domain, firm/contact facts, navigation, actions, breadcrumbs, accessibility labels, footer, shared CTAs | `nuxt.config.ts`, app shell, most shared components        |
| `home`          | Homepage SEO and every homepage section                                                                                     | `app/pages/index.vue`                                      |
| `pages`         | Generic editorial pages, keyed by an internal name and located by each record's `path`                                      | `[...slug].vue` → `EditorialPage`                          |
| `resources`     | FAQ library, checklist, and video-library content                                                                           | Three specialized resource components                      |
| `contactPage`   | Detailed contact options and office copy                                                                                    | `ContactPageContent`; currently bypassed by resolver order |
| `legal`         | Privacy, cookies, disclaimer, and accessibility documents                                                                   | `LegalPageContent`                                         |
| `questionnaire` | Shared labels and English/Spanish/Portuguese preview content                                                                | `QuestionnairePreview`                                     |
| `nextSteps`     | English/Spanish/Portuguese follow-up previews                                                                               | `NextStepsPreview`                                         |
| `error404`      | Error-page title, metadata, copy, and action                                                                                | `app/error.vue`                                            |
| `api`           | Safe response copy for disabled server features                                                                             | `server/api/contact.post.ts`                               |

### The generic page shape

Every entry under `pages` must satisfy this conceptual structure:

```yaml
internalKey:
  path: /public-url
  title: Browser and social title
  metaDescription: Unique search and social description.
  hero:
    eyebrow: Short context label
    title: Main heading
    accent: Optional italic continuation
    lead: Introductory paragraph
    image: /images/example.webp # optional
    imageAlt: Meaningful image description # optional
    secondaryHref: /related-page # optional
    secondaryLabel: Related page # optional
  sections:
    - id: optional-anchor
      eyebrow: Optional context label
      title: Section heading
      tone: paper # optional: paper, sand, dark, or blue
      body: # optional
        - First paragraph.
        - Second paragraph.
      bullets: # optional
        - A checklist-style item.
      cards: # optional
        - title: Card title
          body: Card body.
          href: /optional-link
          linkLabel: Optional link label
      steps: # optional
        - title: Step title
          body: Step explanation.
      note: Optional emphasized note.
  faqs: # optional
    - question: A question?
      answer: A concise answer.
  finalCta: # optional; shared defaults are used when omitted
    title: Custom closing title
    body: Custom closing paragraph.
```

`ContentSection.vue` supports `body`, `bullets`, `cards`, `steps`, and `note` in the same section. Use only the fields the design needs. `id` becomes the section's HTML `id`, so it must be unique on the page and safe to use in a URL fragment.

When `faqs` are present, `EditorialPage` renders the accessible accordion and emits an FAQPage Schema.org node from the same questions and answers. Do not add FAQ structured data for content that is not visibly rendered.

### YAML editing rules

- Use spaces, never tabs.
- Preserve indentation; indentation defines the object/array structure.
- Quote values that YAML could reinterpret, including hex colors, postal codes with leading zeroes, values containing `: `, and purely numeric labels such as `"404"`.
- Use `-` for every array item, including paragraphs.
- Public asset paths start at `/`, for example `/images/photo.webp`; never include `public/` in a browser URL.
- Keep `phoneDisplay` human-readable and `phoneHref` in international `+1...` format. Contact helper functions add `tel:`, `sms:`, or the WhatsApp URL.
- Keep every page `path`, navigation `href`, breadcrumb key, canonical path, and prerender route byte-for-byte consistent.
- Restart the dev server after changing `site.url`, `site.name`, `site.description`, `site.defaultLocale`, `site.themeColor`, `site.logo`, or `site.contact.name`. Those fields are also read directly by `nuxt.config.ts` at startup.

## The two kinds of schema

“Schema” refers to two separate systems in this repository.

### 1. Authoring schema: Zod in `content.config.ts`

[`content.config.ts`](content.config.ts) defines what `content/site.yml` is allowed and required to contain. It uses the `z` helpers exported by Nuxt Content.

Examples of enforced rules include:

- Required strings must be non-empty.
- The office address must contain exactly two display lines.
- Contact action IDs are limited to `call`, `text`, `whatsapp`, and `email`.
- Contact priorities are limited to `primary` and `secondary`.
- Section tones are limited to `paper`, `sand`, `dark`, and `blue`.
- Service icons are limited to the icons mapped in `ServiceCard.vue`.
- Questionnaire and next-step copy must provide `en`, `es`, and `pt` records.
- Every generic page must provide a path, title, meta description, hero, and sections array.

Nuxt Content turns this schema into generated collection types under `.nuxt/content/`. Those files are build artifacts. If YAML and schema disagree, development/typecheck/build should fail rather than quietly publishing incomplete data.

The manual types in [`app/types/content.ts`](app/types/content.ts) describe the narrower prop shapes used by reusable components such as `EditorialPage`, `ContentSection`, and `ServiceCard`. If a schema change affects one of those component contracts, update the manual type too. The generated collection type and the component prop type solve different problems and can drift if only one is changed.

### 2. Search schema: Schema.org JSON-LD

Schema.org output describes the rendered business and page content to search engines. It does not validate authoring data.

Current structured-data sources are:

- `nuxt.config.ts`: global Organization identity using the firm name, URL, and logo from YAML.
- `app/pages/index.vue`: LegalService, Person, and homepage FAQPage nodes.
- `EditorialPage.vue`: FAQPage only when a generic page visibly contains FAQs.
- `FaqResourcePage.vue`: FAQPage generated from all visible FAQ groups.

`usePageSeo()` handles ordinary metadata but does not emit Schema.org nodes. Visual breadcrumbs are currently HTML navigation only; this repository does not explicitly emit BreadcrumbList JSON-LD.

When adding structured data, derive it from visible, reviewed content and reuse the canonical firm identity. Do not claim ratings, reviews, prices, outcomes, availability, or professional facts that are not visibly supported.

## Common editing workflows

### Edit existing copy

1. Find the visible phrase in `content/site.yml` with `rg`:

   ```bash
   rg -n "phrase to replace" content/site.yml
   ```

2. Edit the matching YAML value without changing its indentation or data type.
3. If you add or remove a field, update `content.config.ts`; if a component consumes that field through a handwritten prop type, update `app/types/content.ts` too.
4. Restart `pnpm dev` when a field read by `nuxt.config.ts` changes. Ordinary page copy should update through Nuxt Content development reload.
5. Run `pnpm typecheck` and `pnpm build`.
6. Review the affected page at narrow and wide viewport widths.

Do not put editorial copy directly into a `.vue` file merely because one page needs it. Add it to the appropriate validated YAML block, then pass or read it in the component.

### Change firm-wide information

Firm identity appears in metadata, contact links, visible UI, and structured data. For a phone, email, address, attorney, logo, or domain change:

1. Update `site.contact`, `site.structuredData`, and the top-level site identity fields in `content/site.yml` as applicable.
2. Search for the old value across tracked source files:

   ```bash
   rg -n "old value" . -g '!pnpm-lock.yaml'
   ```

3. Update `public/agents.json`, which is a separate public document and is not generated from YAML.
4. Check legal/policy copy for references that need review.
5. Restart the dev server and regenerate the site.
6. Inspect visible contact links, canonical tags, JSON-LD, `robots.txt`, and `sitemap.xml`.

### Add an image

1. Put the optimized source under `public/images/`.
2. Reference it as `/images/file-name.webp`, not `public/images/file-name.webp`.
3. Add meaningful `imageAlt` copy to YAML unless the image is truly decorative.
4. Use `<NuxtImg>` for rendered content images and provide intrinsic `width`/`height`, responsive `sizes`, and an appropriate loading strategy.
5. Reserve eager loading and `fetchpriority="high"` for the primary above-the-fold image. Let below-the-fold images load lazily.
6. Run a production build and request the final asset URL to confirm it is copied/optimized correctly.

The current photography is already WebP. Logo variants live directly under `public/` and are referenced as `/miranda-law-*.png` or `/miranda-law-gold.svg`.

### Create a reusable component

Nuxt auto-imports components placed under `app/components`, so most components do not need a manual import.

1. Create a focused PascalCase file such as `app/components/ArticleCard.vue`.
2. Define a typed public API. Prefer props for reusable data and slots for reusable layout regions.
3. Keep site wording in YAML. Hard-coded text is appropriate only for non-editorial implementation details.
4. Use existing primitives (`SectionEyebrow`, `ContactActions`, `InteriorHero`, `CallToAction`) before creating a near-duplicate.
5. Add semantic classes to `app/assets/css/main.css` or use the Tailwind tokens exposed by `@theme inline`.
6. Use `NuxtLink` for internal navigation and `<a>` for phone, email, or external destinations.
7. Preserve keyboard behavior, visible focus, semantic headings, unique IDs, and useful alt text. Decorative icons should use `aria-hidden="true"`.
8. Render the component from a page or another component, then run typecheck, build, and responsive review.

Minimal component example:

```vue
<script setup lang="ts">
defineProps<{
  title: string;
  summary: string;
  href: string;
}>();
</script>

<template>
  <article class="article-card">
    <h2>{{ title }}</h2>
    <p>{{ summary }}</p>
    <NuxtLink :to="href">Read the article</NuxtLink>
  </article>
</template>
```

If the label “Read the article” must be editable, localized, or reused widely, add it to the appropriate `site.shared` YAML block and its Zod schema instead of hard-coding it.

### Add a standard editorial page

Use this workflow when the new page can be expressed with the existing hero, sections, optional FAQ accordion, and closing CTA. No new Vue page or resolver branch is needed.

1. Add a unique record under `pages` in `content/site.yml`:

   ```yaml
   pages:
     probate:
       path: /probate
       title: Probate Guidance in New Jersey
       metaDescription: A reviewed, page-specific description.
       hero:
         eyebrow: Probate guidance
         title: Understand the process
         accent: before taking the next step.
         lead: Reviewed introductory copy goes here.
       sections:
         - id: what-to-expect
           eyebrow: What to expect
           title: A clear section heading.
           tone: paper
           body:
             - Reviewed paragraph copy goes here.
         - eyebrow: Practical steps
           title: Prepare for the first conversation.
           tone: sand
           steps:
             - title: Gather available documents
               body: Explain the step without implying a result or legal conclusion.
       finalCta:
         title: Discuss the next step with Miranda Law.
         body: Reviewed closing copy goes here.
   ```

2. Add `"/probate"` to `PUBLIC_ROUTES` in `app/data/routes.ts`.
3. Add it to the appropriate navigation list in `site.navigation` if it should be linked in the header/footer.
4. Add `/probate: Probate` under `site.breadcrumbs.labels`.
5. Add `/probate` to `public/agents.json` if it is an advertised public page.
6. Run `pnpm typecheck` and `pnpm generate`.
7. Verify the page HTML, canonical, description, heading order, sitemap entry, mobile layout, and 404 behavior for a misspelled URL.

The record key (`probate`) is internal. The catch-all route uses the `path` value (`/probate`) to resolve the page. Record keys and paths must each be unique; the current schema validates shape but does not explicitly enforce cross-record path uniqueness.

### Add a specialized page

Use a specialized renderer when the content needs a layout or interaction the generic `EditorialPage` cannot express, such as a directory, calculator, secure form, filterable library, or custom multi-step experience.

1. Design the content shape and add it to `content.config.ts`.
2. Add matching content to `content/site.yml` or define a new Nuxt Content collection if there will be many independent records.
3. Create the renderer under `app/components/` or a dedicated file under `app/pages/`.
4. If using the catch-all route, add a discriminated `PageKind`, URL check, and template branch in `app/pages/[...slug].vue`.
5. Put specialized URL checks before a generic `pages` match when both could use the same path. The current `/contact` precedence issue demonstrates why this matters.
6. Call `usePageSeo()` with a unique canonical path. Add only supported Schema.org data.
7. Add the public route, navigation, breadcrumb, robots, sitemap, and `agents.json` entries as appropriate.
8. Add styles and responsive/accessibility states.
9. Run the full verification checklist.

If the page maps directly to a Nuxt file such as `app/pages/team.vue`, Nuxt creates `/team` automatically. It still needs content, SEO, navigation, prerender, sitemap, and review decisions; file-based routing alone is not the complete publishing workflow.

### Add a real Markdown blog

The repository does **not** currently have a written-article blog. `/resources/video-blog` is a validated list of planned video topics, not a Markdown article system. Do not put a growing article library into the single `site.yml` document.

For a scalable blog, add a second Nuxt Content collection with one Markdown file per article. The following blueprint matches the Nuxt Content 3 collection/query pattern used by this project.

#### 1. Add a page collection

Define a reusable schema above `defineContentConfig`, then register the collection alongside `site`:

```ts
const blogPostSchema = z.object({
  title: text,
  description: text,
  publishedAt: text, // Use YYYY-MM-DD so lexical sorting is chronological.
  updatedAt: text.optional(),
  author: text,
  image: path.optional(),
  imageAlt: text.optional(),
  draft: z.boolean(),
});

// Add this property inside the existing `collections` object,
// immediately after the existing `site` collection.
blog: defineCollection({
  type: "page",
  source: "blog/**/*.md",
  schema: blogPostSchema,
}),
```

Do not replace or nest the current `site` collection when adding this property.

Nuxt Content page collections generate a URL path from each file path. With `source: "blog/**/*.md"`, `content/blog/choosing-an-executor.md` is queried at `/blog/choosing-an-executor`.

#### 2. Create an article

```markdown
---
title: Choosing an Executor for Your New Jersey Will
description: Reviewed summary used for the article listing and search metadata.
publishedAt: 2026-08-21
author: Brian M. Miranda, Esq.
image: /images/choosing-an-executor.webp
imageAlt: Reviewed description of the article image
draft: true
---

Reviewed article copy goes here.
```

Do not repeat the article title as a Markdown H1 when the article page template already renders `post.title` in an H1. Begin with body copy or an H2 section so the rendered page keeps one primary heading.

Keep new posts at `draft: true` until legal/editorial review is complete. A draft flag is useful only if every listing, article resolver, sitemap source, feed, and prerender source filters drafts consistently.

#### 3. Create the listing page

Add `app/pages/blog/index.vue` and query only published posts:

```vue
<script setup lang="ts">
const { data: posts } = await useAsyncData("blog-index", () =>
  queryCollection("blog")
    .where("draft", "=", false)
    .order("publishedAt", "DESC")
    .all()
);

usePageSeo({
  title: "Estate Planning Articles",
  description: "Reviewed description of the article library.",
  path: "/blog",
});
</script>

<template>
  <section class="article-index">
    <h1>Estate Planning Articles</h1>
    <article v-for="post in posts" :key="post.id">
      <h2>
        <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
      </h2>
      <p>{{ post.description }}</p>
      <time :datetime="post.publishedAt">{{ post.publishedAt }}</time>
    </article>
  </section>
</template>
```

#### 4. Create the article route

Add `app/pages/blog/[...slug].vue`:

```vue
<script setup lang="ts">
const route = useRoute();
const { data: post } = await useAsyncData(`blog:${route.path}`, () =>
  queryCollection("blog").path(route.path).first()
);

if (!post.value || post.value.draft) {
  throw createError({ statusCode: 404, statusMessage: "Article not found" });
}

usePageSeo({
  title: post.value.title,
  description: post.value.description,
  path: post.value.path,
  image: post.value.image,
});

useSchemaOrg([
  {
    "@type": "BlogPosting",
    headline: post.value.title,
    description: post.value.description,
    datePublished: post.value.publishedAt,
    dateModified: post.value.updatedAt ?? post.value.publishedAt,
    image: post.value.image,
    author: { "@type": "Person", name: post.value.author },
    mainEntityOfPage: post.value.path,
  },
]);
</script>

<template>
  <article v-if="post" class="article-page">
    <header>
      <h1>{{ post.title }}</h1>
      <time :datetime="post.publishedAt">{{ post.publishedAt }}</time>
    </header>
    <ContentRenderer :value="post" />
  </article>
</template>
```

Before using that BlogPosting data in production, resolve `mainEntityOfPage` to the full canonical URL and connect the author to the reviewed Person/Organization identity rather than creating ambiguous duplicates.

#### 5. Connect publishing infrastructure

- Add `/blog` to `PUBLIC_ROUTES`.
- Link every published article from the blog index so `nitro.prerender.crawlLinks` can discover it during `pnpm generate`.
- Add blog navigation and the `/blog` breadcrumb label.
- Decide how dynamic article labels should work in `Breadcrumbs.vue`; its current labels are a static YAML record.
- Add `/blog` to `public/agents.json`; list individual articles only if that file is intended to enumerate them.
- Add article styling, including typography for generated Markdown elements.
- Ensure draft posts are excluded from links, sitemap output, feeds, prerendering, and direct rendering.
- Confirm each published article appears in `.output/public/blog/.../index.html` and `sitemap.xml` after generation. Do not assume a dynamic route is included merely because development mode can render it.
- Add author, publication date, modified date, canonical URL, hero image, and visible article text before enabling BlogPosting structured data.
- Establish an editorial/legal review step for New Jersey-specific legal claims and time-sensitive law before changing `draft` to `false`.

Official Nuxt Content references: [define collections](https://content.nuxt.com/docs/collections/define), [collection sources and path prefixes](https://content.nuxt.com/docs/collections/sources), [Markdown files](https://content.nuxt.com/docs/files/markdown), and [ContentRenderer](https://content.nuxt.com/guide/displaying/rendering).

## SEO, structured data, robots, and sitemap

### Page metadata

`usePageSeo()` builds the canonical URL from `runtimeConfig.public.siteUrl`, which is populated from `site.url`. It sets:

- document title through the global title template;
- meta description and robots directive;
- canonical link;
- Open Graph title, description, URL, image, locale, and site name;
- Twitter summary-card title, description, and image;
- HTML language for English, Spanish, or Portuguese previews.

The default social image is `/images/brian-law-hero_7235d741.jpg.webp`. Pass an explicit `image` for pages that need a different preview.

### Structured data

Global identity is configured through `nuxt-schema-org`. Page components call `useSchemaOrg()` only when they have visible content for a supported node. Inspect generated HTML, not only Vue source, because the final JSON-LD graph is composed by the module.

### Robots and sitemap

- `/start/**` is disallowed, non-indexed, and excluded from sitemap output.
- `/api/**` is excluded from search and sitemap output.
- `/404` is excluded from the sitemap and rendered with `noindex`.
- The sitemap module uses zero-runtime generation.
- All paths in `PUBLIC_ROUTES`, all six preview paths, `robots.txt`, and `sitemap.xml` are explicit prerender inputs.
- `crawlLinks: true` discovers linked routes during static generation, but explicit route bookkeeping is still required for predictable output.
- The current generated sitemap also contains `/index-backup` because Nuxt discovers the file-based page. That URL should be treated as public/indexable until the page is removed, relocated, or explicitly excluded.

After any URL change, inspect both files directly:

```bash
pnpm generate
rg -n "new-or-old-path" .output/public/sitemap.xml
sed -n '1,200p' .output/public/robots.txt
```

Also search for the old URL across YAML, routes, components, `agents.json`, canonicals, and generated output before adding a redirect strategy.

## Styling and design system

[`app/assets/css/main.css`](app/assets/css/main.css) contains the entire current visual system. It imports Tailwind CSS 4, defines semantic custom properties, exposes core tokens through `@theme inline`, and contains the component/page styles and responsive rules.

Core semantic tokens include:

| Role                   | Variable                     | Current value |
| ---------------------- | ---------------------------- | ------------- |
| Primary/brass          | `--color-brand-primary`      | `#a98d3a`     |
| Dark surface/graphite  | `--color-surface-dark`       | `#2c2c2c`     |
| Alternate dark surface | `--color-surface-dark-alt`   | `#363636`     |
| Muted dark surface     | `--color-surface-dark-muted` | `#3f3f3f`     |
| Light paper surface    | `--color-surface-light`      | `#faf7f0`     |
| Warm sand surface      | `--color-surface-warm`       | `#e6ddc3`     |
| Teal accent            | `--color-brand-accent`       | `#265d69`     |
| Dark teal accent       | `--color-brand-accent-dark`  | `#29454b`     |
| Warm tertiary          | `--color-tertiary-warm`      | `#9c5923`     |
| Alert/brandy           | `--color-tertiary-alert`     | `#8f250c`     |

DM Serif Display is used for editorial headings and Manrope for body/interface text. They are loaded from Google Fonts in `nuxt.config.ts` with preconnect hints.

When adding styles:

- Prefer semantic tokens over repeating hex values.
- Preserve the square/no-radius visual language unless a new direction is approved.
- Reuse established page and component classes where the layout is genuinely the same.
- Add responsive behavior for 320, 390, 768, 1024, and 1440-pixel review widths.
- Respect `prefers-reduced-motion` for any new animation.
- Maintain visible keyboard focus and practical touch targets.
- Run `pnpm format:check`; there is no CSS linter configured.

The original “Quiet Authority” design rationale is preserved in [`ideas.md`](ideas.md), and the migration design constraints are recorded in [`MIGRATION_PLAN.md`](MIGRATION_PLAN.md).

## Localization

Nuxt i18n registers:

- `en` / `en-US` as the default;
- `es` / `es-US`;
- `pt` / `pt-BR`.

The current strategy is `no_prefix`, browser-language detection is disabled, and the message objects in `i18n.config.ts` are empty. This does **not** mean the public marketing site has three complete translations. English is the indexed site language; only the `/start/{locale}` questionnaire and next-step preview content has explicit locale-specific copy in YAML.

Do not switch to prefixed routes or publish translated marketing pages until complete human-reviewed copy, localized metadata, canonical/alternate-language behavior, navigation, legal notices, and sitemap entries are ready. Machine translation alone is not an approval step for legal-services content.

## Server API boundaries

### `GET /api/health`

Returns a small JSON response:

```json
{
  "status": "ok",
  "application": "brian-miranda-law"
}
```

Use it to verify that a Nitro deployment is running. A purely static host will serve `.output/public` and will not run this server endpoint unless the platform provides a server/function deployment for it.

### `POST /api/contact`

This is an intentional safety boundary, not a working form submission endpoint. It reads the response text from the server-side `site` content collection, sets HTTP status `501`, and explains that secure handling is not configured. It does not accept, store, email, or forward submitted information.

Before enabling any form:

- choose and approve the processor and hosting/data region;
- define validation, spam protection, rate limiting, logging, and failure behavior;
- add explicit consent and a non-engagement/confidentiality warning;
- confirm privacy policy, retention, deletion, access control, notification, and vendor terms;
- prevent sensitive details from reaching ordinary logs or analytics;
- test keyboard, screen-reader, mobile, error, and retry behavior;
- update the API schema, UI, legal copy, and deployment secrets together.

Do not place service credentials in YAML, source code, or `public/`. Local `.env*` files are ignored, but no environment contract has been defined yet. Add an `.env.example` containing names and safe descriptions—not secrets—when a real integration is introduced.

## Build and deployment

### Static deployment

```bash
pnpm install --frozen-lockfile
pnpm generate
```

Deploy `.output/public`. This is the preferred shape when the host only needs the prerendered marketing site. Confirm how the host handles clean URLs and custom 404 pages.

Static generation cannot execute `server/api/health.get.ts` or `server/api/contact.post.ts` on a plain file host. That is currently acceptable because the contact endpoint is intentionally disabled, but it matters when a real server feature is added.

### Nitro server deployment

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

Deploy the complete `.output` directory using the adapter/runtime required by the hosting platform. This mode serves prerendered assets and Nitro API handlers.

There is no committed provider-specific deployment configuration in this repository. Before first deployment, record the selected platform, build command, output mode, Node/runtime version, domain behavior, redirect policy, secrets, and health-check configuration here or in a dedicated operations document.

### Build-time domain behavior

The canonical base URL comes from `site.url` in `content/site.yml`, not from an environment variable. Preview builds will therefore emit production-domain canonicals unless this architecture is changed. That is often desirable for non-indexed previews but must be considered when deploying a public staging site.

## Verification checklist

### Before editing

```bash
git status --short --branch
git log -1 --oneline --decorate
```

Preserve unrelated user changes. An empty `git diff` does not describe untracked files, so always inspect `git status --short`.

### Required automated checks

```bash
pnpm typecheck
pnpm build
pnpm generate
pnpm format:check
git diff --check
```

### Content and route checks

- Every intended public route returns 200.
- A made-up route returns the custom 404 response.
- Every page has one clear H1 and a unique title/description/canonical.
- Internal links do not point to missing routes.
- Navigation, breadcrumb labels, `PUBLIC_ROUTES`, and `public/agents.json` agree.
- `sitemap.xml` includes all and only intended indexed URLs.
- `robots.txt` and page-level robots metadata exclude previews and APIs.
- YAML contact facts agree with visible footer/header links and JSON-LD.
- FAQPage JSON-LD exactly matches visible FAQs.
- No placeholder, draft, invented review, or unapproved legal claim is presented as final.
- Images return 200 and have appropriate dimensions and alt behavior.

### Browser review

Review at minimum at 320, 390, 768, 1024, and 1440 pixels:

- no horizontal overflow or clipped content;
- mobile menu opens, traps focus, closes with Escape/backdrop/navigation, and restores focus;
- dropdown and FAQ controls work with keyboard and pointer input;
- skip link and visible focus states work;
- heading order and landmarks are sensible;
- contact actions have correct `tel:`, `sms:`, `mailto:`, and WhatsApp targets;
- there are no console errors or hydration warnings;
- motion remains acceptable with reduced-motion enabled.

### Production smoke test

After `pnpm build`, start the server and inspect output from the built application rather than relying only on development mode:

```bash
pnpm start
```

In a second terminal:

```bash
curl -I http://localhost:3000/
curl -I http://localhost:3000/estate-planning/wills
curl -I http://localhost:3000/robots.txt
curl -I http://localhost:3000/sitemap.xml
curl http://localhost:3000/api/health
curl -i -X POST http://localhost:3000/api/contact
```

The contact request should remain `501` until the secure intake project is explicitly implemented and approved.

## Known constraints and maintenance notes

- **No written blog exists yet.** `/resources/video-blog` contains coming-soon video topics. Use the separate Markdown collection blueprint above for articles.
- **The detailed contact renderer is currently bypassed.** Generic page lookup resolves `/contact` before the specialized branch, so `contactPage` content is not currently visible.
- **`index-backup.vue` creates `/index-backup`.** It is more than a private source backup because every file under `app/pages` participates in routing. The current build crawls and prerenders it, and the generated sitemap includes it even though it is absent from `PUBLIC_ROUTES`. Move it outside `app/pages`, remove it, or explicitly exclude it if it must not be public, then regenerate and verify the sitemap.
- **Localization infrastructure is ahead of published localization.** Only questionnaire/next-step previews contain explicit Spanish and Portuguese content.
- **Questionnaires are previews.** They do not collect or transmit answers.
- **The contact API is disabled by design.** It returns 501 and must not be described as a functioning form.
- **Reviews and videos are placeholders.** Do not replace them with fabricated examples.
- **The canonical URL is build-time YAML data.** There is no environment-based preview-domain override.
- **Route bookkeeping is duplicated.** URLs can appear in YAML navigation/breadcrumbs, `PUBLIC_ROUTES`, `public/agents.json`, and specialized resolver code. Search globally whenever a route changes.
- **Component types are partly handwritten.** Keep `app/types/content.ts` aligned with the Zod content schema.
- **There is no test suite or linter.** Typecheck/build/generate/format and browser QA are required to compensate.
- **Policy text contains launch-review language.** Re-review privacy, cookie, disclaimer, and accessibility dates/copy when hosting, analytics, intake, scheduling, or other vendors change.

## Troubleshooting

### YAML or content validation fails

1. Read the first Nuxt Content/Zod error; later errors may be consequences.
2. Check indentation and whether an array/object was changed into a string.
3. Compare the failing block to its schema in `content.config.ts`.
4. Confirm required strings are not empty and enum values use exact spelling.
5. Restart Nuxt after schema changes so generated types and the content database refresh.
6. Run `pnpm typecheck` again.

### A page works in development but is missing from static output

- Add the index/static URL to `PUBLIC_ROUTES`.
- Ensure a generated page links to dynamic child routes so `crawlLinks` can discover them.
- Check `routeRules`, sitemap exclusions, and `nitro.prerender.routes`.
- Run `pnpm generate` and inspect `.output/public` directly.
- Treat development rendering and successful prerendering as separate checks.

### A new editorial page returns 404

- Confirm the `pages` record passed schema validation.
- Confirm its `path` begins with `/` and exactly matches the requested route.
- Search for duplicate `path` values under `pages`.
- Confirm `[...slug].vue` has not assigned the same URL to a higher-priority specialized branch.
- Restart development after structural content/schema changes.

### Copy changed but metadata, sitemap, or JSON-LD did not

Some site fields are parsed by `nuxt.config.ts` at process startup. Stop and restart development, then rebuild/regenerate. Inspect the final page source rather than only visible text.

### An image returns 404

- Confirm the file exists under `public/` with matching capitalization.
- Remove the `public` directory name from the URL.
- Use `/images/name.webp`, not a filesystem path.
- Confirm the path in YAML starts with `/`.

### Type checking reports missing generated Nuxt files

Install dependencies, then run `pnpm typecheck` again; Nuxt prepares `.nuxt` automatically. Do not hand-create or commit `.nuxt` type files.

### pnpm uses an unexpected workspace or version

The local `pnpm-workspace.yaml` deliberately declares this repository as its own workspace, and `package.json` pins pnpm `10.4.1`. Confirm the command is running from this repository root before changing lockfiles or dependencies.

### `better-sqlite3` was compiled for a different Node version

Nuxt Content uses a native `better-sqlite3` binary during production builds. If `node_modules` was installed under a different Node major/ABI, `pnpm build` can report that `better_sqlite3.node` was compiled against another `NODE_MODULE_VERSION`.

Confirm the active versions, then rebuild that installed dependency for the active Node runtime:

```bash
node --version
pnpm --version
pnpm rebuild better-sqlite3
pnpm build
```

A clean CI install should build/download the binary for its own runtime. Do not edit the lockfile merely to resolve a local native-binary mismatch.

### A server endpoint is missing on the deployed site

A plain static deployment of `.output/public` cannot run Nitro handlers. Use a server-capable deployment from `pnpm build`, or deliberately implement the feature as a host-supported function with an explicit security/privacy design.

## Project references

- [`MIGRATION_PLAN.md`](MIGRATION_PLAN.md): what was preserved, retired, and introduced during the Nuxt migration.
- [`ideas.md`](ideas.md): “Quiet Authority” design direction, brand voice, colors, typography, and interaction principles.
- [`content.config.ts`](content.config.ts): authoritative Nuxt Content structure and field validation.
- [`content/site.yml`](content/site.yml): editable site copy and verified firm data.
- [`nuxt.config.ts`](nuxt.config.ts): runtime/build/SEO/i18n/image/prerender configuration.
- [Nuxt documentation](https://nuxt.com/docs)
- [Nuxt Content documentation](https://content.nuxt.com/docs)
- [Nuxt SEO documentation](https://nuxtseo.com/)

## Pre-publication owner/legal review

Before a production launch or material content release, confirm:

- phone numbers, email address, firm/attorney naming, office address, and map destination;
- free-consultation language, service geography, practice areas, and availability;
- English, Spanish, and Portuguese service capability and translated wording;
- biography, education, experience, bar admission, and association statements;
- privacy, cookies, disclaimer, accessibility, analytics, hosting, and policy dates;
- any intake processor, consent copy, retention, secure handling, and breach process;
- all article/video legal statements and publication metadata;
- every testimonial/review and any result-related context;
- canonical production domain, sitemap contents, robots behavior, and deployment mode.

The website provides general information and does not itself create an attorney-client relationship. Preserve that boundary in content, UI, APIs, analytics, intake, and future automation.
