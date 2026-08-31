# Brian Miranda Law website

Static marketing website for The Law Offices of Brian M. Miranda, Esq., LLC. It is built with Nuxt 4, Vue 3, strict TypeScript, Tailwind CSS 4, Nuxt Image, and build-time validated YAML and Markdown.

The application has no production server, database, form handler, or required environment variables. `pnpm generate` produces the complete deployable website in `.output/public`.

> [!IMPORTANT]
> This is a legal-services website. Do not publish invented credentials, testimonials, results, services, fees, locations, or legal claims. Firm facts, practice descriptions, policies, multilingual wording, and article content require owner/legal review.

## Contents

- [Quick start](#quick-start)
- [Commands](#commands)
- [Architecture](#architecture)
- [Repository map](#repository-map)
- [Routing](#routing)
- [The YAML content source](#the-yaml-content-source)
- [Schema and generated types](#schema-and-generated-types)
- [Common editing workflows](#common-editing-workflows)
  - [Edit existing copy](#edit-existing-copy)
  - [Change firm-wide information](#change-firm-wide-information)
  - [Add an image](#add-an-image)
  - [Create a reusable component](#create-a-reusable-component)
  - [Add a standard editorial page](#add-a-standard-editorial-page)
  - [Add a specialized page](#add-a-specialized-page)
  - [Publish a blog article](#publish-a-blog-article)
- [Blog publication gate](#blog-publication-gate)
- [SEO, sitemap, robots, and structured data](#seo-sitemap-robots-and-structured-data)
- [Multilingual questionnaire previews](#multilingual-questionnaire-previews)
- [Styling](#styling)
- [Static deployment](#static-deployment)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## Quick start

### Requirements

- Node.js 24 LTS. Both `.node-version` and `.nvmrc` select major version 24; `package.json` declares only that major version supported through `engines.node`.
- pnpm 11.24.0. The exact pnpm release and integrity hash are pinned by `packageManager` in `package.json`.

With a Node version manager and Corepack:

```bash
nvm use
corepack enable
pnpm --version
pnpm install --frozen-lockfile
pnpm dev
```

The development server normally runs at <http://localhost:3000>. It listens on all local interfaces so another device on the same network can be used for responsive testing.

No `.env` file is required. The canonical URL, public identity, contact details, navigation, and interface copy come from `content/site.yml`.

## Commands

| Command             | Purpose                                                         |
| ------------------- | --------------------------------------------------------------- |
| `pnpm dev`          | Start Nuxt development mode on `0.0.0.0`                        |
| `pnpm prepare`      | Regenerate Nuxt types and the internal content module           |
| `pnpm lint`         | Run ESLint without rewriting files                              |
| `pnpm typecheck`    | Run strict Nuxt/Vue/TypeScript checking                         |
| `pnpm test`         | Run fast schema, blog-gate, and URL-helper tests                |
| `pnpm format`       | Rewrite supported files with Prettier                           |
| `pnpm format:check` | Check formatting without writing                                |
| `pnpm check`        | Run lint, typecheck, unit tests, and formatting checks          |
| `pnpm generate`     | Generate the deployable static site in `.output/public`         |
| `pnpm build`        | Alias for the static generation command                         |
| `pnpm test:static`  | Verify a previously generated `.output/public` directory        |
| `pnpm verify`       | Run every check, regenerate the site, and inspect static output |
| `pnpm preview`      | Preview the latest generated output locally                     |

Use `pnpm verify` before handing off or deploying a change.

## Architecture

The repository deliberately separates editable content from presentation:

```text
content/site.yml                  content/blog/*.md
        │                                │
        └──────────────┬─────────────────┘
                       ▼
            lib/content/load-content.ts
                       │
          YAML + front matter validation
          Markdown rendering (raw HTML off)
          publication and asset checks
                       │
          ┌────────────┴─────────────┐
          ▼                          ▼
nuxt.config.ts derives       modules/site-content.ts
routes and site config       generates .nuxt/site-content.mjs
          │                          │
          └────────────┬─────────────┘
                       ▼
      Vue pages, layouts, components, SEO, and sitemap
                       │
                       ▼
               pnpm generate
                       │
                       ▼
               .output/public
```

`lib/content/schema.ts` is the content contract. The build fails before rendering if the YAML, article front matter, internal routes, public asset references, or publication state are invalid.

`modules/site-content.ts` creates `.nuxt/site-content.mjs`. This generated module contains the validated site data and the approved, pre-rendered blog posts. Vue imports those constants through `#site-content`; it does not query a runtime content service.

This design has three useful consequences:

- Editors retain a single YAML source for website copy and Markdown files for articles.
- Types are inferred from the validation schema instead of being maintained by hand.
- Static visitors receive no SQLite database, WASM worker, content API, or Markdown parser.

Generated `.nuxt`, `.output`, and cache files are ignored. Never edit them directly.

## Repository map

```text
.
├── .agents/skills/                     # Repository-scoped design and section-building skills
├── app/
│   ├── app.vue                         # Global title and social defaults
│   ├── assets/css/main.css             # Tokens and all site/page styles
│   ├── components/                     # Reusable auto-imported Vue renderers
│   ├── composables/
│   │   ├── use-blog-posts.ts           # Approved generated blog records
│   │   ├── use-page-seo.ts             # Canonical, robots, Open Graph, language
│   │   └── use-site-copy.ts            # Typed generated YAML accessor
│   ├── data/routes.ts                  # Phone, SMS, and WhatsApp URL helpers
│   ├── error.vue                       # Content-managed 404/error page
│   ├── layouts/default.vue             # Header, main landmark, footer
│   ├── pages/
│   │   ├── index.vue                   # Dedicated homepage composition
│   │   ├── [...slug].vue               # Marketing/resource/legal/preview resolver
│   │   └── blog/                       # Conditional blog index and article page
│   └── types/                          # Generated-module declaration and re-exports
├── content/
│   ├── site.yml                        # Site identity, UI copy, and page records
│   └── blog/post-template.md.example   # Non-published article template
├── lib/content/
│   ├── load-content.ts                 # File loading, Markdown, gate, asset checks
│   └── schema.ts                       # Zod schema, inferred types, route derivation
├── modules/site-content.ts             # Build-time generated content module
├── public/
│   ├── agents.json                     # Public machine-readable site description
│   ├── images/                         # Approved editorial images
│   └── miranda-law-gold.png            # Active logo
├── tests/
│   ├── unit/                           # Fast content and helper tests
│   └── static/                         # Generated-output assertions
├── eslint.config.mjs
├── nuxt.config.ts
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

## Routing

### Current public routes

The current YAML and specialized resource records derive these 17 indexed routes:

```text
/
/estate-planning
/estate-planning/wills
/estate-planning/trusts
/estate-planning/powers-of-attorney
/estate-planning/health-care-directives
/about
/resources
/resources/estate-planning-faqs
/resources/estate-planning-checklist
/resources/video-blog
/other-services
/contact
/privacy
/cookies
/disclaimer
/accessibility
```

`getStaticPageRoutes()` in `lib/content/schema.ts` derives this list from:

- The homepage SEO path.
- Every `pages.*.path` value.
- The three specialized resource SEO paths.
- Every key under `legal`.

Do not add a second hardcoded public-route array. Route uniqueness is validated, and static-output tests keep `public/agents.json` aligned with the derived list.

### Non-indexed preview routes

Six `/start` routes are explicitly prerendered but excluded from the sitemap and marked `noindex`:

```text
/start/{en|es|pt}
/start/{en|es|pt}/what-happens-next
```

They are informational previews. They do not collect or transmit user data.

### Resolver order

`app/pages/[...slug].vue` selects renderers in this order:

1. The detailed `/contact` page.
2. FAQ, checklist, and video resource pages.
3. Legal pages.
4. Questionnaire previews and next-step previews.
5. Generic editorial records indexed by `pages.*.path`.
6. A 404 for anything unresolved.

Specialized paths must stay before the generic lookup. For example, `pages.contact` supplies the contact hero and metadata, while `ContactPageContent` supplies the detailed contact layout.

### Blog routes

The source includes file-based `/blog` and `/blog/:slug` pages, but the build exposes none of them until at least one Markdown file passes the publication gate. With no approved posts:

- No Blog link appears in the header or footer.
- `/blog` is excluded from prerendering and the sitemap.
- Direct application access receives the normal non-indexed 404.

When an approved post exists, the build automatically adds `/blog`, each approved article URL, navigation links, sitemap entries, and structured data.

## The YAML content source

`content/site.yml` is the editing source for every non-article word displayed by the site. Components should not introduce duplicate marketing copy when a reusable YAML field is appropriate.

### Top-level keys

| Key             | Responsibility                                                                               | Primary consumers                      |
| --------------- | -------------------------------------------------------------------------------------------- | -------------------------------------- |
| `site`          | Identity, canonical URL, contact facts, navigation, labels, breadcrumbs, footer, shared copy | App shell and most shared components   |
| `home`          | Homepage SEO and sections                                                                    | `app/pages/index.vue`                  |
| `pages`         | Generic marketing/editorial pages                                                            | Catch-all resolver and `EditorialPage` |
| `resources`     | FAQ library, checklist, and video library                                                    | Specialized resource components        |
| `blog`          | Blog path, index SEO, hero, dates, labels, and article UI copy                               | Blog index/detail pages                |
| `contactPage`   | Detailed contact options, warning, and office content                                        | `ContactPageContent`                   |
| `legal`         | Privacy, cookies, disclaimer, accessibility                                                  | `LegalPageContent`                     |
| `questionnaire` | Three questionnaire-preview translations                                                     | `QuestionnairePreview`                 |
| `nextSteps`     | Three translated follow-up previews                                                          | `NextStepsPreview`                     |
| `error404`      | Error title, metadata, and action                                                            | `app/error.vue`                        |

### Generic editorial page shape

Every entry under `pages` follows this model:

```yaml
internalName:
  path: /normalized-public-path
  title: Browser and social title
  metaDescription: A unique description of this page.
  hero:
    eyebrow: Short context label
    title: Main visible heading
    accent: Optional italic continuation
    lead: Introductory paragraph
    image: /images/approved-image.webp # optional
    imageAlt: Accurate alternative text # required when adding an image
    secondaryHref: /related-page # optional
    secondaryLabel: Related page # optional
  sections:
    - type: narrative # required: narrative, checklist, cards, or steps
      id: optional-anchor
      eyebrow: Optional context label
      title: Section heading
      tone: paper # optional: paper, sand, dark, or blue
      body:
        - First paragraph.
        - Second paragraph.
  faqs:
    - question: Optional question?
      answer: Reviewed answer.
  finalCta:
    title: Optional closing heading
    body: Optional closing text.
```

Each section is one strict, discriminated shape:

- `narrative` requires a nonempty `body` array.
- `checklist` requires a nonempty `bullets` array.
- `cards` requires a nonempty `cards` array; cards may include an internal `href` and `linkLabel`.
- `steps` requires a nonempty ordered `steps` array.

All four shapes share `id`, `eyebrow`, `title`, `tone`, and `note`. `PageSectionRenderer.vue` exhaustively dispatches them to focused components. Mixed or irrelevant payload fields fail validation.

### Stable IDs instead of array positions

Some visual choices use explicit IDs:

- Primary navigation entries have IDs such as `estate-planning`.
- Homepage value cards use `shield`, `person`, `message`, or `languages` icons.
- All translated next-step arrays use `documents`, `schedule`, and `communicate`.

Components map these IDs to icons and behavior. Reordering YAML no longer silently changes the icon meaning.

## Schema and generated types

`lib/content/schema.ts` uses Zod to validate and infer the site model. It checks more than whether a field exists:

- Required text cannot be empty or whitespace.
- Public routes are normalized absolute paths.
- Contact email, public URL, map URL, and E.164 phone values have valid formats.
- Public page paths and primary navigation IDs are unique.
- The Estate Planning navigation record and child menu exist.
- Internal `href` and `secondaryHref` values resolve to known routes.
- Fixed visual groups have the expected size and stable IDs.
- Referenced public images and the logo exist during repository loading.

Types such as `SiteContent`, `SitePageContent`, and `HomeService` are inferred from that schema and re-exported from `app/types/content.ts`. Do not recreate those interfaces manually.

The schema is intentionally fail-closed: an invalid edit stops development preparation, type checking, testing, and deployment rather than producing a partially populated page.

## Common editing workflows

### Edit existing copy

1. Find the visible wording in `content/site.yml`.
2. Edit the existing value without changing its indentation or key unless the schema also changes.
3. Run:

   ```bash
   pnpm check
   pnpm generate
   pnpm test:static
   ```

4. Inspect the affected route at mobile and desktop widths.

If the build reports a Zod error, its `path` identifies the YAML key that failed validation.

### Change firm-wide information

Firm-wide facts live under `site`:

- `site.contact` controls the firm name, attorney, email, primary phone, address, and map link.
- `site.structuredData` controls postal and service-area facts used by Schema.org markup.
- `site.navigation` controls menus and preview-language links.
- `site.contactActions` controls call, text, WhatsApp, and email labels and priority.

`phoneHref` must be an E.164 value such as `+19084241011`. Components normalize that one source into `tel:`, `sms:`, and `https://wa.me/` URLs.

After changing an address or contact fact, search for the old value to make sure legal copy and `public/agents.json` do not contradict it.

### Add an image

1. Put the approved image under `public/images/`.
2. Use a root-relative YAML path such as `/images/article-example.webp`.
3. Add accurate alternative text that describes the actual image.
4. Supply the intrinsic `width` and `height` where `NuxtImg` is used.
5. Choose responsive `sizes`, eager loading only for the primary above-the-fold image, and lazy loading elsewhere.
6. Run `pnpm generate`; missing YAML or approved-blog assets fail content loading.

Do not reference a filesystem path beginning with `public/`. The browser path omits that directory name.

### Create a reusable component

Create a PascalCase `.vue` file under `app/components`. Nuxt auto-imports components, so a manual import is usually unnecessary.

Keep responsibilities clear:

- Props describe presentation inputs.
- Reusable wording comes from `useSiteCopy()` when it is truly site-wide.
- Links use `NuxtLink` for internal navigation and `<a>` for phone, SMS, mail, maps, and WhatsApp.
- Icon-only controls need an accessible label; decorative icons use `aria-hidden="true"`.
- Visible state must work with keyboard navigation and focus styles.

Example:

```vue
<script setup lang="ts">
defineProps<{
  title: string;
  body: string;
  href: string;
}>();
</script>

<template>
  <article class="resource-card">
    <h2>{{ title }}</h2>
    <p>{{ body }}</p>
    <NuxtLink :to="href">Learn more</NuxtLink>
  </article>
</template>
```

Add styling to `app/assets/css/main.css`, run the full checks, and test the component at narrow and wide widths.

For site-specific visual work, invoke `$design-miranda-law-pages`. For a new or changed generic page-section contract, invoke `$build-miranda-law-sections`. Both versioned skills live under `.agents/skills`.

### Add a standard editorial page

Use this path when the page fits the shared hero, content-section, FAQ, and closing-CTA design.

1. Add a unique record under `pages` in `content/site.yml` using the generic page shape.
2. Use a normalized unique `path`.
3. Add the route label under `site.breadcrumbs.labels`.
4. Add navigation entries only where users should discover the page.
5. Add the route to `public/agents.json` because it is a new advertised public page.
6. Run `pnpm verify`.

No Vue page file and no prerender-list edit are needed. The catch-all resolver and `getStaticPageRoutes()` discover the record automatically.

### Add a specialized page

Use a specialized renderer when the generic section model cannot express the required interaction or layout.

1. Decide which YAML fields own the page SEO, hero, and specialized copy.
2. Extend `lib/content/schema.ts` before writing the component.
3. Add the corresponding YAML record.
4. Create the renderer under `app/components` or a dedicated file under `app/pages`.
5. If using the catch-all route, add a `PageKind` case and resolve it before generic editorial pages.
6. Ensure `usePageSeo()` sets a unique title, description, canonical URL, and indexing state.
7. Add applicable Schema.org nodes with `useSchemaOrg()`.
8. Update breadcrumbs, navigation, and `public/agents.json` as needed.
9. Add a unit or static-output assertion for the behavior that made the page specialized.
10. Run `pnpm verify` and inspect the rendered page.

The detailed contact page is the main reference for a specialized route that reuses generic page hero metadata.

### Publish a blog article

1. Copy `content/blog/post-template.md.example` to `content/blog/<slug>.md`.
2. Make the filename exactly match the front-matter `slug`.
3. Complete every metadata field and write the reviewed Markdown body.
4. Keep the post private while drafting:

   ```yaml
   status: draft
   reviewed: false
   ```

5. When approval is documented, set:

   ```yaml
   status: published
   reviewed: true
   publishedAt: 2026-08-21
   # updatedAt: 2026-09-15
   ```

6. Run `pnpm verify`.
7. Confirm the blog navigation, index card, article URL, canonical, social image, dates, byline, tags, and structured data.

Do not use the example file as a published article. Files ending in `.md.example` and Markdown files beginning with `_` are not processed.

## Blog publication gate

Every processed article requires:

```yaml
title: Reviewed article title
description: Unique search and social description.
slug: reviewed-article-slug
author: Approved public byline
heroImage: /images/approved-image.webp
heroImageAlt: Accurate description of that image
tags:
  - Estate planning
status: draft # draft or published
reviewed: false
```

Publication adds a real `publishedAt` date and requires `reviewed: true`. An optional `updatedAt` must not be earlier than `publishedAt`.

The loader rejects:

- Missing or malformed fields.
- Invalid calendar dates.
- Duplicate tags or slugs.
- Filename/slug mismatches.
- Empty article bodies.
- A published post without `reviewed: true`.
- Missing public hero images.

Only qualifying posts enter the generated module. Markdown is converted to HTML at build time with raw HTML disabled. The article component may use `v-html` because the value is generated from repository-controlled Markdown after this gate; do not replace it with untrusted runtime input.

## SEO, sitemap, robots, and structured data

`usePageSeo()` provides:

- Page title and description.
- Canonical URL based on `site.url`.
- Index/follow or noindex/nofollow directives.
- Open Graph and Twitter metadata.
- Correct `lang` and social locale values for previews.
- Article publication and modification dates when applicable.

Global Organization identity is configured in `nuxt.config.ts`. The homepage adds LegalService, Person, and FAQPage data. Published articles add BlogPosting data, and the blog index adds Blog data.

The sitemap module runs at generation time. It excludes `/start/**`, `/404`, and an empty blog. Static tests assert that all 17 current public routes appear exactly once and that `public/agents.json` advertises the same set.

`robots.txt` disallows `/start/`. Preview pages also set page-level noindex metadata, so the restriction does not depend on a single mechanism.

## Multilingual questionnaire previews

The site does not use a translation runtime. English, Spanish, and Portuguese preview content is explicitly stored under:

```text
questionnaire.locales.{en,es,pt}
nextSteps.locales.{en,es,pt}
```

The locale is taken from the URL and passed to `usePageSeo()`, which sets the document language and locale-aware metadata. Keep all three locale shapes aligned. Stable next-step IDs must remain `documents`, `schedule`, and `communicate` in that order.

These are non-submitting previews. Adding a secure intake system is a separate legal, privacy, hosting, validation, spam-prevention, and data-retention project.

## Styling

`app/assets/css/main.css` contains:

- Semantic color and surface variables.
- Tailwind theme aliases.
- Base typography, focus treatment, and layout rules.
- Shared header, footer, contact, breadcrumb, and editorial styles.
- Homepage, specialized resource, preview, legal, and blog styles.
- Responsive and reduced-motion behavior.

The visual palette begins with variables such as `--color-brand-primary`, `--color-surface-light`, `--color-surface-dark`, and `--color-brand-accent`. Prefer semantic variables over literal colors in new styles.

This project intentionally keeps one stylesheet. Remove a selector only after confirming it is absent from Vue templates, dynamically constructed class names, and generated Markdown output.

## Static deployment

Generate production files:

```bash
pnpm verify
```

Deploy the contents of:

```text
.output/public
```

The host needs only static-file and HTTPS support. No Node process, API route, SQLite file, secret, or runtime environment variable is required.

Configure the hosting platform to:

- Serve generated files directly.
- Preserve normal directory-index behavior (`/about` → `/about/index.html`).
- Return a real 404 status for missing files rather than rewriting every unknown path to the homepage.
- Redirect the host-level HTTP and `www` variants to the canonical HTTPS domain as appropriate.
- Deploy only after `pnpm verify` succeeds under Node 24.

## Verification

### Automated checks

`pnpm check` covers:

- ESLint.
- Strict Vue/TypeScript checking.
- Real YAML validation.
- Invalid contact, duplicate route, missing navigation, and cardinality fixtures.
- Draft/reviewed/published Markdown behavior.
- Invalid dates and filename/slug mismatches.
- Phone, SMS, and WhatsApp normalization.
- Prettier consistency.

After generation, `pnpm test:static` checks:

- Every public and preview route produced HTML.
- `/index-backup` and `/api/**` do not exist.
- An empty blog is not emitted.
- `/contact` contains the detailed contact experience.
- Sitemap and `agents.json` route sets agree.
- Preview routes are absent from the sitemap.
- No SQLite or WASM runtime is shipped.

### Manual smoke test

After `pnpm generate`, preview the output and inspect:

- `/`
- `/contact`
- One estate-planning detail page
- FAQ, checklist, and video resource pages
- One legal page
- All three `/start/{locale}` previews and their next-step pages
- A deliberately invalid URL
- `/blog` before and after adding an approved local fixture

At desktop and mobile widths, verify navigation, submenu keyboard behavior, focus visibility, call/text/WhatsApp/email links, image cropping, headings, breadcrumbs, FAQ controls, and footer layout.

## Troubleshooting

### Content validation fails

Read the error's `path` from left to right. For example:

```text
site → navigation → primary → 0 → href
```

That points to the first primary navigation item's `href` in `content/site.yml`. Correct the source rather than weakening the schema unless the content contract is intentionally changing.

### A new page is missing

Check that:

- Its YAML `path` is unique and normalized.
- It is under the correct top-level collection.
- A generic or specialized resolver can render it.
- Internal links target the exact path.
- The route was added to `public/agents.json` if it is public.
- `pnpm generate` created the expected `index.html`.

### A blog post is missing

Check that:

- The file ends with `.md`, not `.md.example`.
- The filename equals `<slug>.md`.
- `status` is `published`.
- `reviewed` is the boolean `true`.
- `publishedAt` is a real `YYYY-MM-DD` date.
- The body is nonempty.
- The hero image exists under `public`.

Drafts are intentionally invisible in production output.

### Content edits do not appear in development

The local content module watches `content/` and requests a hard Nuxt restart because route discovery occurs at configuration time. If a tool misses that restart, stop and rerun `pnpm dev`; do not edit `.nuxt/site-content.mjs`.

### pnpm reports an unexpected store

This repository has its own `pnpm-workspace.yaml` so an ancestor workspace cannot claim it. If an existing `node_modules` was linked from another store, use the store path reported by pnpm or perform a clean install under Node 24. Do not modify the lockfile by hand.

### Native package or engine warnings appear

Confirm `node --version` reports major version 24 and `pnpm --version` reports 11.24.0. The pnpm build allowlist is deliberately limited to the native build dependencies still required by Nuxt, Tailwind, image processing, and the file watcher.

### Generated output still contains SQLite

Run `pnpm install --frozen-lockfile` and `pnpm generate` from the current lockfile, then run `pnpm test:static`. Old files in a previously generated `.output` directory are not source; a successful generation recreates the deployable directory.
