# Biomecánica Lab — Visión y contexto

Actualizado: 21/11/2026

## Qué es

Un sitio web público, basado en animaciones, con modelos de personas en 3D que respetan la anatomía real. Cada modelo tiene "filtros anatómicos" (largo de fémur, tibia y torso, movilidad de tobillo y cadera, inclinación pélvica…) y se le pueden programar movimientos para explicar patrones de ejercicios puntuales.

Cualquier persona entra y lo usa para hacer demostraciones: no hay cuentas, perfiles ni contenido guardado.

Ejemplos que la motivaron (palabras de Nico):

- Explicar una sentadilla con un modelo de fémur corto y uno de fémur largo.
- Mostrar una retroversión pélvica.
- Mostrar una retracción escapular.
- "Todo lo necesario para entrenar gente".

## El problema

Cuando un entrenador explica técnica, el alumno escucha reglas genéricas ("pecho arriba", "rodillas que no pasen la punta del pie") que no aplican igual a todos los cuerpos. Las proporciones cambian cuánto se inclina el torso, cuánto avanza la rodilla y dónde aparecen las compensaciones. Hoy eso se explica con dibujos, videos de otra gente o gestos, y cuesta que el alumno entienda por qué su sentadilla se ve distinta y no está "mal".

## La idea central

La postura no se anima a mano: se calcula. Para cada instante del movimiento, un solver busca la postura que mantiene el centro de masa del sistema (cuerpo + carga) sobre el mediopié, respetando las proporciones y los límites de movilidad del modelo. Por eso las diferencias entre cuerpos aparecen solas y son explicables con números (inclinación, brazos de momento, flexión de cadera usada vs disponible).

## Para quién

Cualquiera que quiera mostrar o entender un patrón de movimiento: entrenadores en una clase o una consulta, alumnos, estudiantes de educación física o kinesiología. Se usa desde la computadora o desde el teléfono, en español o en inglés.

## Alcance

Se desarrolla de principio a fin en una sola versión: todo lo de la SPEC funcional forma parte del producto.

Fuera de alcance:

- Cuentas, perfiles de alumnos, links compartibles o cualquier contenido guardado en un servidor.
- Análisis de video del alumno o captura de movimiento.
- Prescripción de rutinas, cargas o diagnóstico clínico. La app explica patrones; no reemplaza la evaluación de un profesional.
- Simulación dinámica con fuerzas musculares reales (EMG, optimización muscular). La activación muscular es cualitativa (ver SPEC funcional).

## Qué se aprobó del prototipo

- Prototipo 2D (vista sagital): aprobado por Nico ("me parece excelente").
- Rotar el modelo en 3D y verlo desde cualquier posición: implementado en el prototipo v2.
- Capas de vista (músculos en vez de huesos, músculos involucrados en rojo): primera versión en el prototipo v2.

Prototipo: `prototipo/index.html` · https://claude.ai/artifact/TuV7PaNVL7xhunw5dERqSb
