# Decisiones

Toda decisión de diseño o arquitectura la toma Nico. Este archivo registra las tomadas y las pendientes. Una feature con una decisión pendiente en `bloqueado_por` (ver `feature_list.json`) no se empieza hasta que esa decisión esté tomada.

## Tomadas

| ID | Tema | Decisión |
| --- | --- | --- |
| — | Qué es | Web basada en animaciones con distintos modelos de personas, filtros anatómicos que respetan la anatomía real y movimientos programables para explicar patrones de ejercicios |
| — | Casos de partida | Sentadilla con fémur corto vs largo, retroversión pélvica, retracción escapular y "todo lo necesario para entrenar gente" |
| — | Vista | El modelo se rota en 3D y se ve desde cualquier posición |
| — | Prototipo | El prototipo es la base aprobada ("me parece excelente") |
| — | Capas a futuro | Ver músculos en vez de huesos y marcar en rojo los músculos involucrados en el ejercicio |
| — | Forma de trabajo | La misma metodología que Etha Joyas: `feature_list.json`, una feature atómica por PR, evidencia en `screenshots/<id>/`, tests. Ver `flujo-de-trabajo.md` |
| — | Ubicación | Carpeta propia en Documents con repositorio de Git |

## Pendientes

| ID | Tema | Quién | Sugerencia de Claude | Bloquea |
| --- | --- | --- | --- | --- |
| D-01 | Framework de frontend y manejo de estado | Nico | Vite + React + TypeScript; store chico (Zustand). Sin SSR: es una app de un canvas | S-01 |
| D-02 | Motor 3D | Nico | Three.js directo, encapsulado en `src/scene/` (lo que usa el prototipo). React Three Fiber es la alternativa si se prefiere todo declarativo | E-01 |
| D-03 | Representación del cuerpo | Nico | Arrancar con el esqueleto procedural del prototipo y evaluar después una malla anatómica con rig. Ojo con las licencias (las CC BY-SA obligan a liberar lo derivado) | M-07 |
| D-04 | Backend, base de datos y auth | Nico | Supabase, como en Etha Joyas. Solo hace falta en la v2 | C-01, C-02, C-03 |
| D-05 | Hosting | Nico | Netlify, plan gratuito (sitio estático) | S-03 |
| D-06 | Alcance del producto | Nico | Definir si es una herramienta para Nico o un producto para otros entrenadores: cambia cuentas, permisos y costos | C-01 |
| D-07 | Idioma e i18n | Nico | Español rioplatense con todos los textos en `messages/es.json`, preparado para sumar inglés | S-01 |
| D-08 | Herramientas de calidad | Nico | Las mismas que Etha Joyas: pnpm, Vitest, Playwright, Biome | S-01, S-02 |
| D-09 | Perfiles de alumnos | Nico | Guardar los filtros anatómicos de cada alumno con un nombre; ¿el alumno tiene cuenta propia o solo recibe links? | C-02 |
| D-10 | Formato de ejercicio como datos | Nico | JSON con tipo de solver, recorrido, carga por defecto, vista de cámara, textos y tabla de músculos | X-01 |
| D-11 | Tabla de activación muscular | Nico | Nico valida la tabla por ejercicio y fase del prototipo; decidir si se distingue concéntrico, excéntrico e isométrico | M-03 |
| D-12 | Movimientos fuera del plano sagital | Nico | Dejarlo para la v2: stance, valgo, rotaciones y ejercicios unilaterales necesitan ampliar el solver | X-06 |
| D-13 | Soporte en celular y tablet | Nico | Escritorio primero; en celular, escena arriba y paneles abajo, con controles táctiles | U-06 |
| D-14 | Relación con TrainingBook | Nico | Mantenerlos separados; el motor puro se puede reusar después | — |
| D-15 | Ejercicios de la v2 y su orden | Nico | Peso muerto convencional, hip thrust, press banca, press militar, remo, dominada, zancada | X-02 a X-06 |
| D-16 | Nombre del proyecto y del repo | Nico | "Biomecánica Lab" es provisorio | S-03 |
| D-17 | Licencia y visibilidad del repo | Nico | Repo privado en GitHub | S-03 |
