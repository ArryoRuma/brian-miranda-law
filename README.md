# Brian Miranda Law website

Static marketing website for The Law Offices of Brian M. Miranda, Esq., LLC. It uses Nuxt 4, Vue 3, Nuxt Content collections, strict TypeScript, Zod, Tailwind CSS 4, and Nuxt Image.

Git-tracked YAML and Markdown are the editing experience. There is no staff login, visual CMS, visitor database, or secure client portal. `pnpm generate` writes the static public output to `.output/public`; `pnpm build` also includes the Nitro intake endpoint for Vercel.

> [!IMPORTANT]
> This is a legal-services website. Do not invent or materially change credentials, testimonials, outcomes, services, fees, locations, policies, or legal claims. Firm facts and translated wording require owner/legal review.

## Quick start

Requirements:

- Node.js 24 (`.node-version`, `.nvmrc`, and `engines.node` agree on this)
- pnpm 11.24.0 through Corepack

```bash
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

No `.env` file is required. Development normally runs at `http://localhost:3000`.

## Commands

| Command               | Purpose                                                           |
| --------------------- | ----------------------------------------------------------------- |
| `pnpm dev`            | Start Nuxt development mode                                       |
| `pnpm prepare`        | Regenerate Nuxt and collection types                              |
| `pnpm lint`           | Run ESLint                                                        |
| `pnpm typecheck`      | Run strict Nuxt/Vue/TypeScript checks                             |
| `pnpm test`           | Run collection, domain-schema, translation, blog, and URL tests   |
| `pnpm format:check`   | Check Prettier formatting                                         |
| `pnpm check`          | Run lint, typecheck, unit tests, and formatting checks            |
| `pnpm generate`       | Generate`.output/public`                                          |
| `pnpm test:static`    | Inspect an existing generated site                                |
| `pnpm verify`         | Run all checks, generate, and inspect the output                  |
| `pnpm verify:release` | Run`verify`, then require every translation review to be approved |
| `pnpm preview`        | Serve the generated output locally                                |

### Runtime activation

The Vercel deployment keeps the public pages prerendered and adds the intake function only when deployed with the Vercel Nitro preset. Configure these deployment variables before production activation:

- Google Analytics 4 is installed directly in the Nuxt app with measurement ID `G-1Q7V5SLP5M`.
- `RESEND_API_KEY` authenticates the intake delivery request.
- `RESEND_FROM_EMAIL` must be a Resend-verified sender address.
- `RESEND_TO_EMAIL` is optional and defaults to `bmiranda@bmirandalaw.com`.

The intake endpoint returns an unavailable response until the Resend variables are configured; it does not store submissions locally.

`pnpm verify` is the required handoff command. `pnpm verify:release` is the release gate; it is expected to fail while a locale or page remains marked `draft` in `content/site/localization/review.yml`.

## Architecture

```text
content/site/**/*.yml       content/blog/*.md
          │                         │
          └──────────┬──────────────┘
                     ▼
             content.config.ts
        typed Nuxt Content collections
                     │
                     ▼
       lib/content/collections.ts
       one validated repository model
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
app/plugins/site-content.ts   server/utils/repository-content.ts
Vue pages and components      sitemap and agents.json generation
        │                         │
        └────────────┬────────────┘
                     ▼
                pnpm generate
                     ▼
               .output/public
```

Nuxt Content validates each file as a collection document. `assembleRepositoryContent()` then applies cross-document rules that collection schemas cannot express alone: singleton and key uniqueness, route uniqueness, internal-link validity, translation completeness and freshness, publication state, and legal-marketing constraints. Public asset references are checked during content parsing in `nuxt.config.ts`.

English is canonical. Spanish and Portuguese are complete `source`/`value` overlays assembled from the same English tree. UI code receives one typed `RepositoryContent` object; it does not know where individual YAML files live.

## Repository map

```text
content.config.ts                  # Collection definitions and per-file schemas
content/
  site/
    shared.yml                     # Firm identity, navigation, footer, shared labels
    home.yml                       # Homepage
    pages/*.yml                    # One editorial page per file
    resources/*.yml                # FAQ, checklist, and video records
    legal/*.yml                    # One policy per file
    blog.yml                       # Blog index UI and SEO
    contact-page.yml               # Specialized contact body
    questionnaire.yml              # Non-indexed workflow preview
    next-steps.yml                 # Non-indexed follow-up preview
    error-404.yml                  # Error page
    localization/
      review.yml                   # Translation release status
      es/**/*.yml                  # Spanish overlays
      pt/**/*.yml                  # Portuguese overlays
  blog/
    post-template.md.example       # Article template; not collected or published
lib/content/
  schema.ts                        # Domain schemas, legal rules, and route catalog
  localization.ts                  # Overlay rules and staleness checks
  blog.ts                          # Article front matter and publication rules
  collections.ts                   # Collection-to-domain assembler
app/
  plugins/site-content.ts          # One client/server collection query
  components/PageShell.vue         # Breadcrumbs, hero, SEO, FAQ schema, final CTA
  components/*Page*.vue            # Focused specialized page bodies
  pages/[...slug].vue              # Marketing/resource/legal resolver
  pages/blog/                      # English-only article routes
server/
  utils/repository-content.ts      # Server-side collection assembler
  routes/agents.json.ts            # Generated public route manifest
  api/__sitemap__/urls.ts          # Generated sitemap source
tests/
  helpers/repository-content.ts    # Test-only fixture reader
  unit/                            # Fast validation tests
  static/                          # Generated-output tests
```

Generated `.nuxt`, `.output`, and cache files are ignored. Never edit them directly.

## Editing site content

Every English YAML file is one document. Do not wrap it in a duplicate filename key: `content/site/pages/about.yml` contains the About page directly, not `about: { ... }`. Collection identity comes from the collection and file stem.

Routine workflow:

1. Find the focused English file under `content/site/`.
2. Change approved copy or structured content there.
3. Refresh the matching Spanish and Portuguese overlay entries.
4. Leave `review.yml` as `draft` until fluent/legal review is complete.
5. Run `pnpm verify`.

Keep presentation in Vue and design tokens in `app/assets/css/main.css`. Keep reusable words in content. Do not put HTML in YAML.

### Editorial and specialized pages

Generic editorial pages use the exhaustive section contract in `lib/content/schema.ts` and `EditorialPage.vue`. Unknown section types fail validation or rendering.

`PageShell.vue` owns repeated page behavior: breadcrumbs, hero, SEO, optional FAQ structured data, and final CTA. Contact, FAQ, checklist, video, legal, and About keep focused body components instead of being flattened into a universal renderer.

About is an explicit supported layout. Its YAML declares:

```yaml
layout:
  template: about
  biographySectionId: background
  credentialSectionIds:
    - education
    - admissions
```

Those IDs are validated against the same document. The catch-all selects the About component from `layout.template`, not from a path or magic section-name check.

### Assets

Put static assets under `public/` and reference them with root-relative URLs such as `/images/example.webp`. Missing `image`, `heroImage`, and `logo` files fail the content build.

## Publishing an article

Articles are English-only until translated article bodies have their own approved workflow.

1. Copy `content/blog/post-template.md.example` to `content/blog/<slug>.md`.
2. Keep the filename and front-matter `slug` identical.
3. Write Markdown below the front matter. Raw HTML is not the authoring path.
4. While drafting, keep `status: draft`, `reviewed: false`, and omit `publishedAt`.
5. After owner/legal review, set `status: published`, `reviewed: true`, and add `publishedAt: YYYY-MM-DD`.
6. Run `pnpm verify`.

A publishable article must have valid metadata, an existing hero image, a unique slug, a matching filename, and a review date no earlier than its update date. Invalid combinations fail the build. Only approved articles appear in navigation, the sitemap, article routes, and structured data.

When there are no approved articles, `/blog` is not linked or included in the sitemap. Nuxt's crawler may still emit an empty `/blog/index.html` because `/blog` exists in the typed content payload; that shell is `noindex, nofollow` and contains no Blog page body.

## Translations

Overlay documents use an explicit list so dotted field paths remain literal YAML strings:

```yaml
entries:
  - path: hero.title
    source: The approved English sentence
    value: La traducción aprobada
```

Rules enforced by tests and the assembler:

- every translatable English string has exactly one Spanish and Portuguese entry;
- `source` exactly matches the current English value, so English edits make old translations stale;
- `value` cannot be blank;
- duplicates and unknown paths fail;
- structural values, routes, contact details, asset paths, and About layout metadata are not translated;
- review status must be `approved` before `pnpm verify:release` succeeds.

Do not invent translations. An English change and its translation refresh should be treated as one content change, with release approval tracked separately.

## Routes, localization, and SEO

`getPublicRoutes()` in `lib/content/schema.ts` is the canonical route catalog. It derives routes from validated collection-backed content. The same catalog drives prerender discovery, sitemap records, `agents.json`, internal-link checks, and static tests.

- English uses unprefixed URLs.
- Spanish and Portuguese use `/es` and `/pt`.
- `/start/{en|es|pt}` and `/start/{en|es|pt}/what-happens-next` stay outside Nuxt i18n, are prerendered, and are `noindex`/excluded from the sitemap.
- Blog pages remain English-only.
- `usePageSeo()` owns canonical, hreflang, robots, Open Graph, and Twitter metadata.
- Page components add only their page-specific structured data.

Do not create a second route array or hand-edit `public/agents.json`; that file is generated by `server/routes/agents.json.ts`.

## Static deployment and Nuxt Content assets

Vercel runs `NITRO_PRESET=vercel pnpm build` and serves the `.vercel/output` deployment bundle according to `vercel.json`. Public pages remain prerendered, while the `/api/intake` endpoint forwards inquiries through Resend. The deployed site has no application database or secure client portal.

Nuxt Content ships generated static query assets under `__nuxt_content/` plus its browser-side SQLite WASM worker. These are immutable build artifacts used to query the generated content snapshot; they are not an application database, do not accept writes, and contain no visitor data. Static tests require the query dumps and reject emitted `.sqlite` files.

The sitemap source and `agents.json` are server routes only while generating. Their responses are written to static files. The deployed Nitro runtime also exposes only the intake endpoint; it does not provide a general application database or staff system.

## Verification

Run this before handoff:

```bash
pnpm verify
```

It proves:

- lint, strict types, tests, and formatting pass;
- every collection document and cross-document rule is valid;
- all English, Spanish, Portuguese, and `/start` routes generate;
- canonical/hreflang metadata is locale-correct;
- sitemap and `agents.json` match the canonical route catalog;
- `/start` and unpublished Blog content are not indexed;
- About and contact retain their specialized behavior;
- the result is static and uses static image output.

For a release candidate, also run:

```bash
pnpm verify:release
```

Finally preview the generated site at desktop, tablet, and mobile widths. Check the changed page, navigation, language switching, focus states, image crops, and the browser console.

## Troubleshooting

- **`better-sqlite3` ABI or binding error:** use Node 24, reinstall if the dependency tree was built under a different Node major, then run `pnpm prepare`.
- **Collection must contain exactly one document:** restore the missing singleton file or remove the duplicate matched by its collection source.
- **Unknown or stale translation path:** make the overlay path match the canonical document and refresh `source` from the current English string.
- **Article rejected:** check filename/slug equality, publication flags, dates, unique slug, and hero-image existence.
- **`verify:release` fails after `verify` succeeds:** the technical build is valid, but at least one translation review remains intentionally unapproved.
