# Brian Miranda Law website

This repository is the Nuxt 4 rebuild of the Miranda Law marketing website. It uses Vue 3, strict TypeScript, Nuxt Content, Tailwind CSS 4, Nuxt Image, Nuxt i18n, prerendered public pages, and Nitro API boundaries.

## Development

```bash
pnpm install
pnpm dev
```

The local site runs at `http://localhost:3000` by default.

## Verification

```bash
pnpm typecheck
pnpm build
pnpm generate
pnpm format:check
```

`pnpm generate` writes the static deployment output to `.output/public`. `pnpm build` also produces a Nitro server in `.output/server` for hosts that use server rendering.

## Architecture

- `app/pages/index.vue` owns the image-led homepage composition.
- `app/pages/[...slug].vue` resolves the preserved public, legal, resource, and non-indexed preview routes from the content collection.
- `app/components` contains the reusable site shell and editorial building blocks.
- `content/site.yml` is the single copywriting source for sitewide labels, verified firm details, the homepage, interior pages, resources, legal copy, and questionnaire previews.
- `content.config.ts` defines and validates the complete Nuxt Content schema and generates collection types.
- `app/data/routes.ts` contains only operational route and contact-link helpers; it does not contain editorial copy.
- `app/composables/use-site-copy.ts` provides the validated content collection to pages and shared components.
- `app/composables/use-page-seo.ts` centralizes canonical, social, and structured-data metadata.
- `server/api/health.get.ts` is a deployment health check.
- `server/api/contact.post.ts` deliberately returns `501` until an approved form processor and privacy flow exist; it does not collect submissions.
- `nuxt.config.ts` owns prerendering, image behavior, robots, sitemap, Schema.org, i18n, and Tailwind integration.

The pre-implementation audit and migration decisions are recorded in `MIGRATION_PLAN.md`.

## Editing website copy

Edit `content/site.yml`. It intentionally keeps the full website copy in one file so wording can be reviewed without moving between Vue templates or TypeScript modules. The major top-level sections are:

- `site`: firm identity, contact details, navigation, shell labels, and shared calls to action;
- `home`: every homepage heading, paragraph, link label, service, process step, and FAQ;
- `pages`: estate planning, about, resources, other services, contact, and the four core service pages;
- `resources`, `contactPage`, and `legal`: supporting page copy;
- `questionnaire` and `nextSteps`: English, Spanish, and Portuguese preview copy;
- `error404`: public not-found-page copy.

After editing, run `pnpm typecheck` and `pnpm build`. Nuxt Content validates the YAML against `content.config.ts`; missing required copy or an invalid structure fails the checks rather than silently rendering incomplete content.

## Content review before launch

The rebuild preserves the facts and language already present in the approved source website; it does not add testimonials, credentials, or outcomes. A final owner/legal review should still confirm:

- phone numbers, email, Warren office address, map destination, and firm/attorney naming;
- the free-consultation statement, North Jersey service geography, and the list of secondary services;
- English, Spanish, and Portuguese service capability;
- privacy, cookie, disclaimer, and accessibility copy and dates;
- every biography, experience, education, bar-admission, and association statement;
- contact-form provider, consent language, retention policy, and secure intake process before enabling submission.

Client reviews and video resources remain honest placeholders. The `/start/{locale}` questionnaire and next-step previews are prerendered but excluded from search indexing and the sitemap; they do not transmit data.

## Localization

English is the indexed default. Nuxt i18n registers English, Spanish, and Portuguese without URL prefixes so the architecture is ready for reviewed translations without publishing placeholder duplicate pages. Existing locale-specific `/start/{locale}` previews are retained as non-indexed content. Switch to a prefixed i18n routing strategy only when full translated page sets and locale-specific metadata are approved.
