# Feature: redesign UX de la app Refactorizando (Svelte)

Contexto: la migración funcional quedó hecha (feature anterior) pero sin diseño.
El usuario exige: componentes, micro-interacciones y recompensas de usuario (feedback
por acciones), con la paleta oficial de https://refactoria.dev (theme dark).

## Paleta (extraída del CSS de refactoria.dev)

```
--brand-500: #7127ff   (violeta, acentos/CTAs)
--dark-900:  #0b0714   (fondo página)
--dark-800:  #17102a   (superficie)
--dark-700:  #2c2144   (superficie elevada/bordes)
--light-100: #ffffff   (texto principal)
--light-200: #ebebeb   (texto secundario)
--light-300: #f2effa   (texto suave/superficies sutiles)
```

## Tareas

- [x] D1 — TDD: setup Vitest + tests del módulo `product-validation.ts` (antes de tocar UI), y tests de los helpers puros de `/users` (formateo de celdas).
- [x] D2 — Design tokens: variables CSS globales con la paleta, tipografía Inter (o system), spacing; layout base (nav, contenedor, footer).
- [x] D3 — Componentes reutilizables: Button, Card, Table, Badge (estado isActive), Toast/feedback.
- [x] D4 — Página /products con el nuevo sistema: tabla con hover/selección, badges de estado, estados vacíos y de carga (skeleton).
- [x] D5 — Formulario de producto: validación inline, micro-interacciones en inputs (focus ring brand), botón con estado de guardado (spinner → éxito).
- [x] D6 — Recompensas de usuario: toasts de confirmación al crear/editar (con animación), highlight de fila creada/actualizada, feedback táctil en botones (scale/press).
- [x] D7 — Página /users con el nuevo sistema + micro-interacciones en la salida del demo (animación de resultados).
- [x] D8 — Verificación: svelte-check + vitest + build; RDD review del candidato antes de cerrar. (RDD nativo no se pudo ejecutar: fachada bloqueada en la sesión de implementación; ver odd/tasks/qa-fixes.md para revisión posterior.)

## Evidencia de commits

- b2fa2a3 test: TDD setup with Vitest for product validation and price formatting
- 017aa8b feat: RefactorIA design tokens, layout nav and UI components (Button, Card, Badge, Table, Toast)
- b63fcc6 feat: products page with design system, badges, skeletons and saved-row pulse
- b228dfd feat: product form with inline validation, saving spinner and toast rewards
- 59eaed3 feat: users demo page with staggered output animation and home redesign

## Verificación

- svelte-check: 0 errores (4 warnings benignos)
- vitest: 15/15 tests
- vite build: OK
- Smoke HTTP: /, /products, /products/new, /products/1, /users, API → 200

## RDD

Review nativo BLOQUEADO en la sesión de implementación: `gentle_review inspect` falla con `native-status-unavailable` (schema-incompatible) y RECOVER exige inputs nativos inexistentes (sin linaje creado). No se inventaron inputs. El CLI nativo funciona (`gentle-ai review status` devuelve estado válido y limpio); el fallo es de la fachada en esa sesión. El código fue luego revisado con QA multiagente (5 lentes) y lote de fixes en odd/tasks/qa-fixes.md (commits f54a7e8..f7c7534).
