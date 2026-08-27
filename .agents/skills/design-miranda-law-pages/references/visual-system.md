# Miranda Law Visual System

## Foundation

- Preserve the “Quiet Authority” identity: editorial, restrained, personal, and clear.
- Keep DM Serif Display for display headings and Manrope for interface and body text.
- Use square corners unless the existing component establishes otherwise.
- Build hierarchy through scale, whitespace, rules, contrast, and typography rather than decoration.

## Semantic palette

- Primary action and emphasis: --color-brand-primary, #a98d3a.
- Primary hover: --color-brand-primary-hover, #b89b46.
- Light paper: --color-surface-light, #faf7f0.
- Warm sand: --color-surface-warm, #e6ddc3.
- Main graphite: --color-surface-dark, #2c2c2c.
- Alternate graphite: --color-surface-dark-alt, #363636.
- Teal contrast: --color-brand-accent, #265d69.
- Use --color-border-brand and --color-focus-ring for borders and focus treatment.

Apply a 60/30/10 hierarchy: neutral paper and graphite lead, supporting sand and alternate graphite structure the page, and gold or teal provide restrained emphasis. Do not use gold for long body text.

## Page language

- Use oversized serif headings with italic accent lines where supplied by approved content.
- Use uppercase, letter-spaced eyebrow labels with the short gold rule provided by SectionEyebrow.
- Keep body copy near 60–70 characters per line and use generous line height.
- Alternate section tones deliberately. Avoid repeating many visually identical paper sections without a sand, teal, or dark interruption already supported by the content.
- Use numbered cards and steps, bordered lists, split heading/body grids, and visible internal links to echo the homepage.
- Keep primary buttons gold with dark text. Keep secondary actions as bordered buttons or clear text links.

## Images and motion

- Use only approved assets under public/ unless the user supplies and approves another asset.
- Preserve the muted, warm, editorial treatment and meaningful alt text.
- Use eager loading only for the page hero; lazy-load below-fold imagery.
- Keep motion restrained and respect prefers-reduced-motion. Never require animation to understand content.

## Responsive and accessible behavior

- Validate 1440×900, 768×1024, and 390×844.
- Collapse two-column sections to one column without changing content order.
- Keep tap targets at least 44 pixels high and make keyboard focus clearly visible.
- Maintain one h1, ordered h2/h3 structure, descriptive links, accessible accordions, and sufficient contrast.
- Check linked cards with hover and focus-within; do not apply interactive styling to non-linked cards.
