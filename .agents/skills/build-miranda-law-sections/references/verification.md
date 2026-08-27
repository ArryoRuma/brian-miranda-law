# Section Verification

## Before editing

- Run git status --short and preserve unrelated work.
- Inspect the current section schema, content record, renderer, and applicable styles.
- Identify the routes and section types affected.

## Automated checks

Use the repository’s Node 24 runtime and pinned pnpm version.

1. Run pnpm lint.
2. Run pnpm typecheck.
3. Run pnpm test.
4. Run pnpm format:check.
5. Run pnpm generate.
6. Run pnpm test:static.
7. Run git diff --check.

pnpm verify runs the project gates in their intended order.

Add tests that prove:

- every supported type validates with its required payload;
- missing, mixed, and cross-type fields fail;
- the route counts and specialized pages remain intact;
- approved offer wording is emitted and retired variants are absent.

## Copy-preservation audit

Compare the current YAML against the version at HEAD. Treat new type discriminator values as structural changes. Every modified human-facing string must map to an explicit user-approved copy request.

## Visual checks

Check the homepage for regression and check at least one page that exercises every changed section type. Validate 1440×900, 768×1024, and 390×844. Inspect:

- section order and tone sequence;
- one h1 and ordered h2/h3 headings;
- body measure and responsive stacking;
- linked-card hover and keyboard focus;
- call-to-action contrast;
- FAQ interaction when present;
- reduced-motion behavior;
- console errors and broken internal links.

The current baseline derives 17 indexed routes and six non-indexed preview routes. Re-inspect those counts if the user explicitly changes information architecture.
