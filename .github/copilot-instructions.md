# Brian Miranda Law Project Guidelines

## Stack and Commands

- Build with Nuxt 4, Vue 3 Composition API, strict TypeScript, Tailwind CSS 4, and pnpm.
- Use Node.js 24 and pnpm 11.24.0 as pinned in `package.json`.
- Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` for focused changes. Run `pnpm verify` before handoff or deployment; it validates content, generates the static site, and tests the generated output.
- This is a static site. `pnpm generate` produces the deployable site in `.output/public`; do not introduce runtime content services, databases, or environment-variable dependencies without an explicit requirement.

## Content Architecture

- Treat `content/site/**/*.yml` as the source of truth for non-article site copy and `content/blog/*.md` as the source for blog posts. Keep presentation components free of duplicated marketing copy.
- Preserve the YAML-to-Zod-to-generated-content flow: update `lib/content/schema.ts` before adding a new content shape, and consume validated content through `#site-content` and existing composables.
- Do not edit generated `.nuxt/` or `.output/` files, generated content declarations, or cache output.
- Keep public routes derived from validated content. Do not add competing hardcoded route lists.
- Use `NuxtLink` for internal routes and `<a>` for external, phone, SMS, email, map, and WhatsApp links.

## Localization and Legal Content

- English content under `content/site/` is canonical. For translatable English changes, update the matching Spanish and Portuguese overlay `source` fields and preserve reviewed `value` fields; update the truthful review status in `content/site/localization/review.yml`.
- Do not invent attorney credentials, testimonials, client results, fees, locations, legal claims, services, contact information, or translation approvals. Customer-facing copy must follow `BRAND.md` and requires owner/legal review where applicable.
- Keep `/start/{locale}` preview routes non-indexed and non-submitting. Do not turn them into intake forms without explicit privacy, security, and retention requirements.
- Keep the blog English-only unless a reviewed translated publication model is explicitly added. Published posts must satisfy the existing publication gate.

## UI and Accessibility

- Follow the existing design system in `app/assets/css/main.css`; add site styles there and retain responsive and reduced-motion behavior.
- Use auto-imported PascalCase components from `app/components/`; use typed `script setup` props and existing composables before creating new abstractions.
- Preserve semantic landmarks, keyboard operation, visible focus states, accurate image alt text, and accessible names for icon-only controls. Decorative icons must be hidden from assistive technology.
- Use `@lucide/vue` icons where an icon is needed instead of custom SVGs.

## Repository References

- Follow `README.md` for detailed route, content, localization, SEO, blog-publication, and verification workflows.
- Use the repository skills for site work: `$design-miranda-law-pages` for visual/page composition and `$build-miranda-law-sections` for schema-backed reusable page sections.
