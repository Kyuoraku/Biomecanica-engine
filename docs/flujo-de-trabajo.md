# Flujo de trabajo

Reglas definidas por Nico, las mismas que en Etha Joyas, adaptadas a una app 3D.

## Decisiones

- Toda decisión de diseño o arquitectura la toma Nico. Claude solo ejecuta lo ya decidido.
- Si algo no está decidido, se agrega a `decisiones.md` como pendiente y se pregunta antes de avanzar.
- Las sugerencias o mejoras que aparezcan se le plantean a Nico; no se aplican sin aprobación.

## Features y PRs

- Las funcionalidades están en `feature_list.json`, ordenadas por prioridad. Cada una es atómica.
- Un PR por feature. El PR incluye:
  - los criterios de aceptación de la feature;
  - las capturas que demuestran cada criterio, en `screenshots/<id-de-feature>/`;
  - tests unitarios.
- Al abrir un PR, la feature pasa a `en_review` y se carga el número de PR en `feature_list.json`. Al mergear, pasa a `hecho`.
- Claude se suscribe a cada PR y lo mantiene actualizado: resuelve conflictos y responde las preguntas de Nico.

## Git

- Una rama por feature: `feature/<id>-<slug>` (ej.: `feature/B-04-squat-solver`).
- Commits con Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `chore:`, `refactor:`).

## Código

- Nada de código spaghetti, componentes enormes ni estilos mezclados. Carpetas organizadas por tipo.
- Tres capas que no se mezclan: motor biomecánico (TS puro), escena 3D y UI. La dependencia va en un solo sentido: UI → escena → motor.
- Código en inglés; ningún texto de interfaz escrito en los componentes.

## Evidencia

- Las capturas se generan con Playwright, una por criterio de aceptación como mínimo, en `screenshots/<id>/`.
- Cada captura se nombra con el número de criterio que demuestra (ej.: `01-fémur-largo-inclina-más.png`).
- La escena tiene que ser determinista para capturar: se abre por URL con ejercicio, modelos, instante, cámara y capa fijos, y la animación pausada (ver `S-04` y la SPEC técnica). Sin esto, dos corridas dan capturas distintas.
- WebGL en Playwright corre por software (SwiftShader); las capturas no dependen de la GPU de la máquina.

## Tests

- Todo lleva tests unitarios, chicos y puntuales.
- El motor biomecánico se prueba con invariantes físicos, no con números mágicos: el centro de masa queda sobre el mediopié, un fémur más largo da más inclinación, bajar la flexión de cadera disponible hace aparecer la retroversión, etc.
- Siempre que se pueda, los tests prueban directamente los criterios de aceptación de la feature.
