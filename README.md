# Biomecánica Lab

Sitio público con modelos humanos en 3D con proporciones anatómicas reales para explicar patrones de movimiento de ejercicios: comparar cuerpos distintos (fémur corto vs largo, tobillo rígido, anteversión pélvica…), ver compensaciones y qué músculos trabajan. Funciona en español e inglés, en teléfono y computadora. Sin cuentas ni base de datos.

Prototipo publicado: https://claude.ai/artifact/TuV7PaNVL7xhunw5dERqSb (copia en `prototipo/index.html`).

## Documentación

| Archivo | Contenido |
| --- | --- |
| `docs/01 - Visión y contexto.md` | Para qué existe, para quién y qué problema resuelve |
| `docs/02 - SPEC funcional.md` | Qué hace la app: pantallas, ejercicios, capas, lecturas y advertencias |
| `docs/03 - SPEC técnica.md` | Arquitectura, módulos, flujo de datos, pruebas y evidencia |
| `docs/04 - Modelo biomecánico.md` | Proporciones, masas, solver de equilibrio y simplificaciones |
| `docs/feature_list.json` | Funcionalidades atómicas, priorizadas, con criterios de aceptación y estado |
| `docs/decisiones.md` | Decisiones tomadas y pendientes |
| `docs/flujo-de-trabajo.md` | Reglas de trabajo: PRs, evidencia, tests |
| `prototipo/` | Prototipo de referencia (un solo HTML) y capturas |
| `screenshots/<id>/` | Evidencia de cada PR |

## Cómo contribuir

Las reglas de trabajo están en `docs/flujo-de-trabajo.md`: una feature de `docs/feature_list.json` por PR, rama `feature/<id>-<slug>`, Conventional Commits, tests por criterio (caso feliz y triste) y capturas en `screenshots/<id>/`. La rama `main` está protegida: todo entra por PR.

## Estado

Proyecto base (S-01) en curso. El avance de cada feature está en `docs/feature_list.json`.

## Desarrollo

Requiere Node 24 y pnpm (Vite + React + TypeScript; ver `docs/decisiones.md`).

```
pnpm install
pnpm dev          # servidor local
pnpm lint        # Biome
pnpm typecheck   # TypeScript estricto
pnpm test        # tests de criterios (Vitest)
pnpm evidence    # capturas con Playwright en screenshots/<id>/
```

El CI de GitHub Actions corre lint, typecheck, tests, build y capturas en cada PR.

## Licencia

MIT (ver `LICENSE`).
