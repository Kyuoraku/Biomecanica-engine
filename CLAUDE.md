# Biomecánica Lab

Antes de trabajar, leé lo que aplique de `docs/`: visión, SPEC funcional, SPEC técnica, modelo biomecánico, `feature_list.json`, `decisiones.md`, `flujo-de-trabajo.md` y `base-de-datos/`.

## Reglas

- Toda decisión de diseño o arquitectura la toma Nico. Claude ejecuta lo decidido; lo no decidido va a `decisiones.md` como pendiente y se pregunta.
- Una feature con algo en `bloqueado_por` no se empieza.
- Un PR por feature, con sus criterios, capturas en `screenshots/<id>/` y tests que prueban esos criterios.
- El motor biomecánico (`src/biomechanics/`) es TypeScript puro: no importa nada de la escena 3D ni de la UI.
- Ningún número anatómico suelto en el código: proporciones, masas y límites viven en `src/constants/` y salen de `docs/04 - Modelo biomecánico.md`.

## Preferencias de código

- Sin comentarios en el código. El código se explica con buenos nombres; las explicaciones van en `docs/` o en el PR.
- Constantes en archivos propios dentro de carpetas `constants/`, nunca sueltas en el archivo que las usa.
- Código en inglés; textos de la app en español en un archivo de mensajes (herramienta según D-07).
- Componentes chicos y carpetas organizadas por tipo.

## Checks antes de cada PR

Se completan cuando se decidan D-01 y D-08. Como mínimo: lint, typecheck, tests unitarios y capturas de evidencia de la feature.
