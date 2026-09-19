# Feature: Braille beard branding integration (home hero + nav mark)

Source: design exploration (nan/qwen3.6) over the extracted refactoria.dev brand mark.
Art source: 36-row Braille beard saved at /tmp/beard-art.txt (worker must embed rows as a TS constant, e.g. app/src/lib/assets/beard-art.ts — not a ?raw txt import).

## Scope (user decision: options 1 + 2)

- [x] B1 — BeardHero component (app/src/lib/components/BeardHero.svelte): rows rendered as block divs, all rows pre-laid-out and revealed by opacity via a $effect-driven counter (~40ms/row, timers cleared on cleanup); full art `aria-hidden` + sr-only label "Refactoriza Braille beard logo"; prefers-reduced-motion shows all rows instantly, runtime matchMedia listener with cleanup; mounted at the top of the home main, above the card grid (app/src/routes/+page.svelte).
- [x] B2 — Nav mark (app/src/routes/+layout.svelte): compact cropped left horn from BEARD_NAV_ROWS in app/src/lib/assets/beard-art.ts; static, `aria-hidden`, font-size 0.5rem / line-height 1, fixed metrics.
- [x] B3 — Typography & tokens: IBM Plex Mono imported via Google Fonts in app/src/app.css (no Braille-capable font was loaded before); monospace stack 'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace; line-height 1.15 hero / 1 nav; palette tokens only (--light-300 rows on --dark-900 surfaces); hero font ~0.55rem, shrinks to 0.4rem <=480px; no brand-purple adjacent text.
- [x] B4 — Verification: vitest, svelte-check, build (results recorded in worker handoff). Work-unit commit deferred to the parent session per delegation instructions (no commit made by worker).

## Notes
- Rows are static data: plain const, no reactivity. Nav mark fixed size, line-height 1 to not break nav.
- No role="img" on the aria-hidden element. Do not use #7127ff for adjacent text on dark.
- Keep diffs bounded: BeardHero.svelte (new), beard-art.ts (new), +page.svelte, +layout.svelte, app.css (font import only).
