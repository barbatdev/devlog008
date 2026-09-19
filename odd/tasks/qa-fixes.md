# Feature: QA fix batch (validation, error states, a11y high)

Source: five consolidated QA lenses (technical verify, functional, security, test plan, accessibility). Scope authorized by user: API validation limits, client/server drift, error states, route error handling consistency, and the three high accessibility findings. Explicitly out of scope: DELETE endpoint decision (product decision pending), contrast/reduced-motion mediums, refactor of $state/$derived warnings.

## TDD
Mode: on (project precedent, red-green-refactor). Runner: `npm test` (vitest) in app/.

## Tasks

- [x] F1 — TDD: API validation — name max 50 chars (422 on longer), price must be finite and > 0, and enforce NUMERIC(24,6) scale (reject > 6 decimals). Update `validateProductBody` + tests first (RED), then implement (GREEN).
- [x] F2 — Align client validation with server rules (trim, max 50, price > 0 with same messages); form must not submit what API rejects.
- [x] F3 — Route error consistency: wrap single-product GET and PUT pre-lookup in try/catch returning 500 JSON like sibling handlers.
- [x] F4 — Error states UI: products list shows error state with retry instead of eternal skeleton on non-OK/failed fetch; edit page distinguishes 404 from other failures; ProductForm handles fetch rejection (try/catch/finally, saving reset, error alert).
- [x] F5 — A11y high: associate inline validation errors via stable ids + `aria-invalid` + `aria-describedby`; replace anchor-wrapped Cancel with single interactive element; product rows support Space activation and expose selected state (`aria-selected` with grid/option semantics or real control).
- [x] F6 — Verification: vitest 34/34, svelte-check 0 errores, build OK; work-unit commits f54a7e8, 8ca0b32, f5c033b (rama master). RDD review del candidato pendiente: bloqueado en esta sesión (schema-incompatible); probar en sesión nueva.

## Notes
- Parity oracle: name limit 50 and price scale from migrated WinDev schema (VARCHAR(50), NUMERIC(24,6)).
- Do not alter DB seed rows or app/data/refactorizando.db; tests use in-memory/temp DB per cortex plan (vi.doMock $lib/server/db).
- Keep change bounded; no unrelated refactors.
