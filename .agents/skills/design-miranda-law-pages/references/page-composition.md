# Page Composition

## Source of truth

Read approved site copy from content/site.yml. Content flows through lib/content/load-content.ts and lib/content/schema.ts into the generated site-content module. Pages must not query a runtime CMS or duplicate marketing copy in Vue.

## Existing page families

- Homepage: dedicated composition in app/pages/index.vue. Use it as the visual reference, not as a component template to copy wholesale.
- Editorial pages: InteriorHero, typed page sections, optional FAQ, and CallToAction.
- Specialized resources: FAQ library, estate-planning checklist, and video library.
- Contact: specialized contact options and office section.
- Legal and questionnaire previews: preserve their specialized renderers and indexing rules.

## Typed section selection

- narrative: Use for one or more approved explanatory paragraphs.
- checklist: Use for a set of short criteria, benefits, risks, or items.
- cards: Use for distinct concepts, documents, services, resources, or linked destinations.
- steps: Use only for an ordered process or sequence.

Do not combine multiple section payload shapes. Use build-miranda-law-sections when the schema or renderer must change.

## Composition checks

- Give each page a clear hero, a coherent tone sequence, and one final action area.
- Preserve the supplied section order unless the user explicitly requests information-architecture changes.
- Avoid consecutive calls to action that compete with one another.
- Reuse the shared call/text actions and contact route rather than inventing form behavior.
- Keep all approved SEO titles, descriptions, canonical paths, breadcrumbs, and structured data aligned with visible content.
