# Feature: migración WinDev "Refactorizando" → SvelteKit + SQLite

Fuente: `respaldo/Refactorizando/` (análisis en memoria Engram, topic `windev-refactorizando-analysis`).
Alcance decidido: **tal cual** — 5 tablas, 3 ventanas, webservice CRUD, demo Map/Filter/Reduce.

## Tareas

- [ ] T1 — Scaffold SvelteKit + better-sqlite3, esquema SQLite con las 5 tablas (entity, entityPhones, product, product_2023, registros) + seed de ejemplo.
- [ ] T2 — API CRUD `/api/product` y `/api/product/[id]` (GET/POST/PUT, errores 404/422/500 equivalentes al webservice Mproduct).
- [ ] T3 — Tipos TS (csUser + DTOs anidados, csProduct) y clientes HTTP equivalentes.
- [ ] T4 — Página `/products` (tabla + crear/modificar, equivale WIN_Products).
- [ ] T5 — Página/ventana de alta/edición de producto (equivale WIN_Product).
- [ ] T6 — Página `/users`: consumo dummyjson.com/users, tabla de columnas y demo Map/Filter/Reduce/Combine con versiones clásica y lambda (equivale WIN_JSONS).
- [ ] T7 — Verificación: build + smoke test de CRUD y páginas.

## Evidencia de commits

Sin commits: la sesión no recibió autorización explícita para commitear. Cambios verificados con svelte-check (0 errores) y smoke test HTTP (páginas 200, CRUD 200/404/422).
