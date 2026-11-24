# Flujo de trabajo

Reglas definidas por Nico, las mismas que en Etha Joyas, adaptadas a una app 3D.

## Decisiones

- Toda decisión de diseño o arquitectura la toma Nico. Claude solo ejecuta lo ya decidido.
- Si algo no está decidido, se agrega a `decisiones.md` como pendiente y se pregunta antes de avanzar.
- Las sugerencias o mejoras que aparezcan se le plantean a Nico; no se aplican sin aprobación.

## Features y PRs

- Las funcionalidades están en `feature_list.json`, ordenadas por prioridad. Cada una es atómica. Hay una sola versión: el producto se construye de principio a fin.
- Cada criterio de aceptación se identifica como `<feature>.<n>` (`B-05.2` = segundo criterio de B-05).
- Un PR por feature. El PR incluye:
  - los criterios de aceptación de la feature;
  - las capturas que demuestran cada criterio, en `screenshots/<id-de-feature>/`;
  - los tests de cada criterio (caso feliz y caso triste).
- Al abrir un PR, la feature pasa a `en_review` y se carga el número de PR en `feature_list.json`. Al mergear, pasa a `hecho`.
- Claude se suscribe a cada PR y lo mantiene actualizado: resuelve conflictos y responde las preguntas de Nico.

## Git

- Una rama por feature: `feature/<id>-<slug>` (ej.: `feature/B-05-squat-solver`).
- Commits con Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `chore:`, `refactor:`).

## Código

- Componentes modulares que respetan SOLID y las buenas prácticas (detalle en la SPEC técnica). Nada de código spaghetti, componentes enormes ni estilos mezclados. Carpetas organizadas por tipo.
- Tres capas que no se mezclan: motor biomecánico (TS puro), escena 3D y UI. Dependencias en un solo sentido: UI → escena → motor.
- Código en inglés. Ningún texto de interfaz en el código: todo en `es.json` y `en.json`, con las mismas claves en los dos.
- Mobile first: cada feature con UI se prueba en teléfono y en computadora.

## Evidencia

- Las capturas se generan con Playwright, una por criterio de aceptación como mínimo, en `screenshots/<id>/`.
- Cada captura se nombra con el número de criterio que demuestra (ej.: `B-05.2-fémur-largo-inclina-más.png`). Si el criterio tiene UI, hay captura en computadora y en teléfono.
- La escena se abre por URL con ejercicio, modelos, instante, cámara, capa e idioma fijos y la animación pausada (`S-04`). Sin esto, dos corridas dan capturas distintas.
- WebGL en Playwright corre por software (SwiftShader).

## Tests

- Los tests prueban los criterios de los SPEC; no se escriben tests genéricos.
- Cada criterio tiene al menos un test de **caso feliz** y uno de **caso triste**. El nombre empieza con el identificador y el caso: `[B-05.2][feliz] …`, `[B-05.2][triste] …`.
- Hay **tests de los tests**: trazabilidad (todo criterio tiene sus dos tests y todo test apunta a un criterio que existe), mutación (los tests fallan cuando se rompe el código) y sensibilidad de los helpers de aserción. Cada meta-test tiene también su caso feliz y su caso triste.
- El chequeo de trazabilidad lee esas etiquetas del nombre de cada test en `tests/criteria/` y `tests/evidence/` con la expresión `TEST_TAG_PATTERN` (`tests/constants/traceability.ts`). Reconoce `[<feature>.<n>][<caso>]`: el id de la feature (una letra mayúscula, guion y dos dígitos, como `B-05`), el número de criterio y el caso en minúsculas (`feliz`, `triste` o `evidencia`). De `[B-05.2][triste] …` saca el criterio `B-05.2` y el caso `triste`, y lo cruza con `feature_list.json`.
- El motor biomecánico se prueba con invariantes físicos, no con números mágicos.
