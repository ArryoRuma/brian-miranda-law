---
name: build-miranda-law-sections
description: Add, migrate, or revise schema-backed page sections in the Brian Miranda Law Nuxt repository while preserving its YAML-to-Zod-to-generated-content flow, exhaustive Vue rendering, approved copy, internal routes, static output, and accessibility. Use when implementing Miranda Law narrative, checklist, card, or process sections, changing the section content contract, or creating a new reusable interior-page module.
---

# Build Miranda Law Sections

Build sections through the repository’s validated content architecture. Do not bypass it with hardcoded page copy.

## Workflow

1. Read references/section-contract.md before editing section data, types, or renderers.
2. Inspect the current content, schema, renderer, component, styles, and tests. Treat the checkout as authoritative because the section catalog can evolve.
3. Choose the existing section type that matches the content’s meaning. Do not choose a pattern only for visual variety.
4. Edit approved page content in content/site.yml and keep the section type explicit.
5. Keep type-specific validation strict. Reject missing payloads, mixed payloads, unknown types, and irrelevant fields.
6. Render through PageSectionRenderer and a focused component. Preserve an exhaustive TypeScript branch so a new type cannot silently fall through.
7. Style with semantic variables and the rules in the design-miranda-law-pages skill. Preserve responsive stacking and visible focus.
8. Add schema tests for valid and invalid payloads, then follow references/verification.md.

## Change boundaries

- Preserve all approved strings unless the user authorizes a copy change.
- Preserve section order, SEO, routes, FAQs, and specialized page renderers unless they are explicitly in scope.
- Do not invent content to demonstrate a component on a public page.
- Do not weaken Zod validation to make malformed YAML pass.
- Do not add a second route registry or runtime content source.
- Use the shared card, link, contact, eyebrow, and call-to-action conventions.

## New section types

Create a new section type only when approved content has behavior or structure that the four existing types cannot express. Define its schema, inferred type, renderer branch, focused component, semantic styling, invalid-payload tests, and at least one real approved consumer in the same change.

## Output

Deliver validated YAML, exhaustive typed rendering, responsive styling, focused tests, and a passing static verification gate.
