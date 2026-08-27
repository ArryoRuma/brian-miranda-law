---
name: design-miranda-law-pages
description: Design, restyle, or compose pages and reusable UI for the Brian Miranda Law Nuxt website while preserving its approved YAML copy, homepage visual system, responsive behavior, accessibility, legal-marketing guardrails, and existing assets. Use for Miranda Law page design, visual polish, layout changes, new page composition, or component styling; do not use for unrelated projects or copywriting-only requests.
---

# Design Miranda Law Pages

Design from the current homepage system and repository content rather than from generic legal-site conventions.

## Workflow

1. Read references/visual-system.md before making visual decisions.
2. Read references/page-composition.md when adding, reorganizing, or restyling a page or section.
3. Inspect content/site.yml, the relevant Vue components, app/assets/css/main.css, and the rendered homepage. Treat the current checkout as authoritative.
4. Preserve approved copy. Change words only when the user explicitly approves a wording change.
5. Compose with the existing semantic tokens, typography, section rhythms, section modules, contact actions, and approved public assets.
6. Keep graphite and paper dominant, use sand for support, use teal as a deliberate contrast section, and reserve gold for action and emphasis.
7. Reuse existing components before creating a new pattern. If a new reusable section is required, use the build-miranda-law-sections skill.
8. Verify the page at desktop, tablet, and mobile sizes. Check keyboard focus, heading order, contrast, readable line length, motion preferences, and image behavior.
9. Run pnpm verify with Node 24 before handoff.

## Guardrails

- Do not invent credentials, testimonials, results, services, fees, locations, availability, or legal claims.
- Do not publish placeholder reviews, videos, articles, or intake behavior as real.
- Do not duplicate website images or logos inside this skill. Reference the approved files under public/.
- Do not scatter raw brand colors through components. Use the semantic variables in app/assets/css/main.css.
- Do not create a second content source, route registry, or runtime content service.
- Keep “Free Initial Consultation” as the approved English offer phrase.

## Output

Deliver implemented, responsive page changes that preserve content architecture and pass the repository verification gate. State any missing approved copy, proof, or imagery instead of fabricating it.
