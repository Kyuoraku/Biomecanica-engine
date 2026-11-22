# Biomecánica Lab — Visión y contexto

Actualizado: 21/11/2026

## Qué es

Una web basada en animaciones con modelos de personas en 3D que respetan la anatomía real. Cada modelo tiene "filtros anatómicos" (largo de fémur, tibia y torso, movilidad de tobillo y cadera, inclinación pélvica…) y se le pueden programar movimientos para explicar patrones de ejercicios puntuales.

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

| Usuario | Para qué la usa |
| --- | --- |
| Entrenador (usuario principal) | Explicar técnica, mostrar por qué cada cuerpo se mueve distinto, preparar material para alumnos |
| Alumno | Ver la explicación que le arma el entrenador, desde cualquier ángulo |

Si la app es solo para Nico o un producto para otros entrenadores está pendiente (D-06).

## Qué se aprobó del prototipo

- Prototipo 2D (vista sagital): aprobado por Nico ("me parece excelente").
- Pedido siguiente: poder rotar el modelo en 3D y verlo desde cualquier posición. Ya está en el prototipo v2.
- Próximo interés declarado: capas de vista, por ejemplo ver músculos en vez de huesos y marcar en rojo los músculos involucrados en el ejercicio. El prototipo v2 trae una primera versión.

Prototipo: `prototipo/index.html` · https://claude.ai/artifact/TuV7PaNVL7xhunw5dERqSb

## Fuera de alcance (por ahora)

- Análisis de video del alumno o captura de movimiento.
- Prescripción de rutinas, cargas o diagnóstico clínico. La app explica patrones; no reemplaza la evaluación de un profesional.
- Simulación dinámica con fuerzas musculares reales (EMG, optimización muscular). La activación muscular es cualitativa (ver SPEC funcional).

## Relación con otros proyectos de Nico

Comparte público con TrainingBook (clon de Strong para entrenadores). Integrarla con TrainingBook no está decidido (D-14).
