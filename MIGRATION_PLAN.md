# Miranda Law Nuxt 4 Migration Plan

## Repository audit

The migration starts from commit `e0a0117` on the `nuxt-migration` branch. The working tree was clean before implementation.

### Worth preserving

- Brand assets: five Miranda Law logo variants, including the scalable gold SVG.
- Photography: the 1920 × 1280 editorial desk hero and 1536 × 1920 planning-book detail image.
- Brand system: graphite `#2c2c2c`, secondary graphite `#363636`, gunmetal `#3f3f3f`, slate `#29454b`, teal `#265d69`, paper `#faf7f0`, sand `#e6ddc3`, brass `#a98d3a`, brown `#9c5923`, and brandy `#8f250c`.
- Typography direction: DM Serif Display for editorial headings and Manrope for interface/body copy.
- Verified site configuration: firm name, Brian M. Miranda, Esq., phone, alternate phone, email, Warren office address, map link, consultation links, and English/Spanish/Portuguese contact paths.
- Homepage language and the attached “Quiet Authority” composition: dark split hero, trust strip, four service columns, image-led process, attorney introduction, multilingual panel, other-services/reviews split, FAQ, consultation CTA, and structured footer.
- Existing crawlable information architecture and reviewed content for estate planning, four core services, about, resources, contact, legal notices, and non-submitting questionnaire previews.
- Existing safety boundaries: no invented testimonials, video content remains “coming soon,” questionnaire previews do not transmit information, and legal copy distinguishes general information from legal advice.

### Architecture to retire

- React 19, React DOM, Wouter, Express, Vite's React entry point, and the client-side metadata mutation layer.
- The large unused Radix/shadcn component library and React-only form/chart/carousel/theme dependencies.
- Manus-specific debug/runtime plugins, the Wouter patch, static hand-maintained sitemap/schema output, and the SPA catch-all server.
- React-only CSS imports and component assumptions. The proven visual stylesheet will move into Nuxt first to protect screenshot fidelity, with its exact brand tokens exposed to Tailwind; further stylesheet consolidation can happen separately after cross-browser approval.

## Target architecture

- Nuxt 4, Vue 3, strict TypeScript, and Nitro.
- Tailwind CSS 4 through the Vite integration, with all Miranda Law tokens exposed to Tailwind and regular CSS.
- Nuxt Image for correctly sized responsive images and below-the-fold lazy loading.
- Focused Nuxt SEO modules for site configuration, sitemap, robots, and Schema.org output, without unused OG-image rendering dependencies.
- Nuxt i18n with English as the default and clean Spanish/Portuguese route infrastructure. Only reviewed translations are published as translated content; existing `/start/{locale}` previews remain non-indexed.
- File-based routing and server-rendered/prerendered HTML. Public marketing and legal routes are prerendered; a small Nitro health/form placeholder route demonstrates the future server boundary without collecting data.
- Shared data/config modules for verified firm facts, navigation, homepage content, and interior-page content.
- Reusable Vue components only where they reduce repetition: header, footer, eyebrow, contact actions, service cards, process steps, language links, FAQ accordion, CTA, interior page sections, and breadcrumbs.

## Route and content plan

1. Preserve the homepage and all existing public navigation destinations as Nuxt pages so migration does not discard useful content.
2. Use a shared editorial page renderer for `/estate-planning`, `/about`, `/resources`, `/other-services`, and the four service-detail routes.
3. Preserve resource, contact, questionnaire-preview, next-step, and legal-notice pages with Vue/Nuxt semantics.
4. Keep questionnaire previews under `/start/` non-indexed and excluded from the sitemap until real intake/privacy requirements are approved.
5. Generate canonical URLs, OpenGraph metadata, breadcrumbs, LegalService/Organization/Person/FAQ schema, robots rules, and the XML sitemap from Nuxt configuration and page data rather than static duplicated files.

## Verification and cleanup

1. Install the new dependency graph and inspect the resulting lockfile.
2. Run Nuxt type checking and production generation/build.
3. Start the dev server and verify rendered HTML, primary routes, assets, metadata, sitemap, robots, and Nitro health response.
4. Inspect the homepage at 320, 390, 768, 1024, and 1440 pixel widths; verify menu and FAQ interactions, keyboard focus, no horizontal overflow, and no browser-console errors.
5. Remove the React client, Express server, Vite config, Wouter patch, old dist output, static duplicate SEO files, and obsolete dependency metadata.
6. Confirm there is one Nuxt application architecture, then document preserved material, added/removed dependencies, and content-review flags.
