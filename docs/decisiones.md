# Decisiones

Toda decisión de diseño o arquitectura la toma Nico. Este archivo registra las tomadas, las pendientes y las descartadas. Una feature con una decisión pendiente en `bloqueado_por` (ver `feature_list.json`) no se empieza hasta que esa decisión esté tomada.

## Tomadas

| ID | Tema | Decisión |
| --- | --- | --- |
| — | Qué es | Web basada en animaciones con distintos modelos de personas, filtros anatómicos que respetan la anatomía real y movimientos programables para explicar patrones de ejercicios |
| — | Casos de partida | Sentadilla con fémur corto vs largo, retroversión pélvica, retracción escapular y "todo lo necesario para entrenar gente" |
| — | Vista | El modelo se rota en 3D y se ve desde cualquier posición |
| — | Prototipo | El prototipo es la base aprobada ("me parece excelente") |
| — | Capas | Ver músculos en vez de huesos y marcar en rojo los músculos involucrados en el ejercicio |
| — | Forma de trabajo | La misma metodología que Etha Joyas: `feature_list.json`, una feature atómica por PR, evidencia en `screenshots/<id>/`, tests. Ver `flujo-de-trabajo.md` |
| — | Ubicación | Carpeta propia en Documents (`Biomecanica Lab`) con repositorio de Git |
| — | Versiones | No hay v1, v1.5 ni v2: el producto se desarrolla de principio a fin en una sola versión |
| — | Tipo de sitio | Sitio público donde la gente lo usa para hacer demostraciones. Sin cuentas, perfiles de alumnos ni links compartibles |
| — | Base de datos | No hay: el sitio no guarda nada en un servidor |
| — | Idiomas | Español e inglés, con archivos `es.json` y `en.json`. Una librería detecta el idioma y un desplegable permite cambiarlo |
| D-07 | Librería de i18n | i18next + i18next-browser-languagedetector (elegida por Claude a pedido de Nico) |
| — | Diseño de código | Componentes de frontend y de backend (si lo hubiera) modulares, con principios SOLID y buenas prácticas |
| — | Tests | Prueban los criterios definidos en los SPEC, no tests genéricos. Caso feliz y caso triste por criterio. Además, tests que prueban que los demás tests funcionan |
| — | Responsive | Se usa en teléfono y en computadora, con una UI amigable y fácil de usar |
| D-16 | Nombre del repo | `Kyuoraku/Biomecanica-engine` (https://github.com/Kyuoraku/Biomecanica-engine) |
| D-17 | Visibilidad y licencia del repo | Público, con `main` protegida: todo entra por PR. Licencia MIT para el código; si más adelante se usa una malla CC BY-SA (D-03), esa malla va con su propia licencia |
| D-01 | Framework de frontend y manejo de estado | Vite + React + TypeScript; Zustand. Sin SSR |
| D-08 | Herramientas de calidad | pnpm, Vitest, Playwright, Biome y StrykerJS. CI en GitHub Actions como check obligatorio de `main` |
| D-05 | Hosting | Netlify, plan gratuito, deploy desde `main` |
| — | Contexto para continuar | Un proyecto en la web de Claude con todo el contexto para seguir el desarrollo en un hilo |

## Pendientes

| ID | Tema | Quién | Sugerencia de Claude | Bloquea |
| --- | --- | --- | --- | --- |
| D-02 | Motor 3D | Nico | Three.js directo, encapsulado en `src/scene/` (lo que usa el prototipo) | E-01 |
| D-03 | Representación del cuerpo | Nico | Arrancar con el esqueleto procedural del prototipo y evaluar después una malla anatómica con rig. Ojo con las licencias (las CC BY-SA obligan a liberar lo derivado) | M-07 |
| D-10 | Formato de ejercicio como datos | Nico | JSON con tipo de solver, recorrido, carga por defecto, vista de cámara, claves de texto y tabla de músculos | X-01 |
| D-11 | Tabla de activación muscular | Nico | Nico valida la tabla por ejercicio y fase del prototipo; decidir si se distingue concéntrico, excéntrico e isométrico | M-03, M-06 |
| D-12 | Movimientos fuera del plano sagital | Nico | Stance, valgo, rotaciones y ejercicios unilaterales necesitan ampliar el solver | X-06 |
| D-15 | Ejercicios adicionales y su orden | Nico | Peso muerto convencional, hip thrust, press banca, press militar, remo, dominada, zancada | X-02 a X-06 |
| D-19 | Librería de estilos | Nico | Tailwind, como en Etha Joyas | U-06 |

## Descartadas

| ID | Tema | Motivo |
| --- | --- | --- |
| D-04 | Backend, base de datos y auth | Sitio público sin cuentas ni datos guardados |
| D-06 | Alcance (herramienta propia o producto para entrenadores) | Resuelto: sitio público para demostraciones |
| D-09 | Perfiles de alumnos | Fuera de alcance |
| D-13 | Soporte en celular y tablet | Resuelto: responsive obligatorio |
| D-14 | Relación con TrainingBook | Proyectos independientes |
