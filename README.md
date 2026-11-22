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

## Estado

Solo documentación y prototipo. El proyecto base no se crea hasta que estén tomadas las decisiones que bloquean `S-01` (ver `docs/decisiones.md`).
