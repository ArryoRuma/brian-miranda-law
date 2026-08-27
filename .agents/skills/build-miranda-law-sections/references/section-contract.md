# Section Contract

## Content flow

content/site.yml flows through lib/content/load-content.ts and the strict schemas in lib/content/schema.ts. modules/site-content.ts generates the typed build-time module consumed by Vue. Static generation must fail before rendering when section data is invalid.

## Shared fields

Every section requires:

- type
- title

Every section may also include:

- id
- eyebrow
- note
- tone: paper, sand, dark, or blue

## Section types

### narrative

Use for explanatory paragraphs. Require a nonempty body array and reject bullets, cards, or steps.

    - type: narrative
      eyebrow: Context
      title: Approved section heading
      body:
        - Approved explanatory paragraph.

Render with NarrativePageSection.

### checklist

Use for short related items that are not ordered steps. Require a nonempty bullets array and reject body, cards, or steps.

    - type: checklist
      eyebrow: Considerations
      title: Approved section heading
      tone: sand
      bullets:
        - Approved list item.

Render with ChecklistPageSection.

### cards

Use for distinct concepts or destinations. Require a nonempty cards array. A card requires title and body; href and linkLabel are optional together. Reject body, bullets, or steps.

    - type: cards
      eyebrow: Options
      title: Approved section heading
      cards:
        - title: Approved card title
          body: Approved card description.
          href: /known-route
          linkLabel: Approved link label

Render with CardGridPageSection. Apply linked styling only when href exists.

### steps

Use for an ordered process. Require a nonempty steps array of title and body records and reject body, bullets, or cards.

    - type: steps
      eyebrow: Process
      title: Approved section heading
      tone: sand
      steps:
        - title: Approved step title
          body: Approved step description.

Render with StepsPageSection.

## Renderer invariant

PageSectionRenderer must narrow on section.type and exhaust every inferred union member. Adding a schema type without a renderer branch must fail TypeScript checking.

## Route and copy invariants

- Validate every internal href against the known generated routes.
- Keep “Free Initial Consultation” as the English offer phrase.
- Keep approved Spanish and Portuguese wording unchanged unless separately approved.
- Keep specialized contact, resource, legal, and questionnaire renderers outside this generic section union.
