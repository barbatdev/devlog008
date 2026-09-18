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

- [ ] D1 — TDD: setup Vitest + tests del módulo `product-validation.ts` (antes de tocar UI), y tests de los helpers puros de `/users` (formateo de celdas).
- [ ] D2 — Design tokens: variables CSS globales con la paleta, tipografía Inter (o system), spacing; layout base (nav, contenedor, footer).
- [ ] D3 — Componentes reutilizables: Button, Card, Table, Badge (estado isActive), Toast/feedback.
- [ ] D4 — Página /products con el nuevo sistema: tabla con hover/selección, badges de estado, estados vacíos y de carga (skeleton).
- [ ] D5 — Formulario de producto: validación inline, micro-interacciones en inputs (focus ring brand), botón con estado de guardado (spinner → éxito).
- [ ] D6 — Recompensas de usuario: toasts de confirmación al crear/editar (con animación), highlight de fila creada/actualizada, feedback táctil en botones (scale/press).
- [ ] D7 — Página /users con el nuevo sistema + micro-interacciones en la salida del demo (animación de resultados).
- [ ] D8 — Verificación: svelte-check + vitest + build; RDD review del candidato antes de cerrar.

## Evidencia de commits

(registrar commit por tarea)
