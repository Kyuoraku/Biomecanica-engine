# Biomecánica Lab

Antes de trabajar, leé lo que aplique de `docs/`: visión, SPEC funcional, SPEC técnica, modelo biomecánico, `feature_list.json`, `decisiones.md` y `flujo-de-trabajo.md`.

## Reglas

- Toda decisión de diseño o arquitectura la toma Nico. Claude ejecuta lo decidido; lo no decidido va a `decisiones.md` como pendiente y se pregunta.
- Una feature con algo en `bloqueado_por` no se empieza.
- Un PR por feature, con sus criterios, capturas en `screenshots/<id>/` y tests que prueban esos criterios.
- El motor biomecánico (`src/biomechanics/`) es TypeScript puro: no importa nada de la escena 3D ni de la UI.
- Una sola versión, sitio público, sin backend ni base de datos.
- Ningún número anatómico suelto en el código: proporciones, masas y límites viven en `src/constants/` y salen de `docs/04 - Modelo biomecánico.md`.

## Preferencias de código

- Sin comentarios en el código. El código se explica con buenos nombres; las explicaciones van en `docs/` o en el PR.
- Constantes en archivos propios dentro de carpetas `constants/`, nunca sueltas en el archivo que las usa.
- Componentes modulares con principios SOLID (detalle en la SPEC técnica).
- Código en inglés; todos los textos en `src/locales/es.json` y `en.json` (i18next), con las mismas claves.
- Mobile first: todo lo que tenga UI funciona en teléfono y en computadora.
- Componentes chicos y carpetas organizadas por tipo.

## Checks antes de cada PR

`pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm evidence` (lo mismo corre el CI, check obligatorio de `main`). Los tests de criterios se nombran `[<id>.<n>][feliz]` y `[<id>.<n>][triste]` y las capturas van en computadora y teléfono. A medida que lleguen sus features se suman los tests de los tests (trazabilidad y mutación, S-06) y el chequeo de claves de idiomas (S-05).
