# Biomecánica Lab — SPEC funcional

Actualizado: 21/11/2026 · Estado: borrador para revisión de Nico

Describe qué hace la app desde el punto de vista del usuario. Lo marcado **(pendiente D-xx)** depende de una decisión que todavía no está tomada (ver `decisiones.md`). El prototipo `prototipo/index.html` implementa casi todo lo de la v1 y sirve de referencia visual; no es el código final.

## Versiones

| Versión | Qué incluye | Condición para pasar a la siguiente |
| --- | --- | --- |
| v1: visualizador | Escena 3D, dos modelos comparables, presets y filtros anatómicos, 7 ejercicios, lecturas, advertencias, cámaras | Los 7 ejercicios se ven bien y los números tienen sentido para Nico |
| v1.5: músculos | Capa de músculos, activación por ejercicio y fase, resaltado en rojo, panel de músculos involucrados | La activación coincide con lo que Nico enseña |
| v2: contenido y compartir | Más ejercicios, ejercicios definidos como datos, links compartibles, cuentas, perfiles de alumnos **(pendiente D-04, D-06)** | — |

## 1. Pantalla principal

Una sola pantalla con tres zonas.

### 1.1 Escena 3D (centro)

- Muestra los modelos A y B y el piso con grilla de 10 cm.
- **Rotar**: arrastrar con el botón izquierdo (o un dedo en el celular). **Zoom**: rueda o pellizco. **Desplazar**: botón derecho o dos dedos.
- **Vistas rápidas**: Lateral, Frontal, Posterior, Superior y 3/4. La cámara viaja suave hasta la vista elegida. Cada ejercicio tiene una vista por defecto (lateral para sentadillas y bisagra, 3/4 para la pelvis, posterior para las escápulas) que se aplica al elegirlo.
- **Disposición**: "Lado a lado" (por defecto) separa los modelos en el eje que mejor se ve desde la vista elegida: uno al lado del otro en lateral, 3/4 y superior, y lado a lado en el ancho en frontal y posterior. Desactivado, los modelos se superponen y B se ve translúcido.
- Indicador de fase abajo a la izquierda en sentadillas y bisagra: "Fase excéntrica (bajando)" / "Fase concéntrica (subiendo)".
- Leyenda arriba a la izquierda con el color y el nombre de cada modelo (A verde azulado, B naranja).

### 1.2 Línea de tiempo (debajo de la escena)

- Play / Pausa, barra para moverse a cualquier instante (mover la barra pausa) y velocidad 0.5× / 1× / 1.5×.
- Un ciclo dura unos 3,4 s a 1×: arranca arriba, baja hasta el punto más bajo y vuelve.

### 1.3 Panel lateral (derecha)

- **Ejercicio**: selector, un parámetro de recorrido propio de cada ejercicio y la carga en % del peso corporal (solo en ejercicios con barra).
- **Capa**: Huesos / Músculos / Solo activos, y opciones: activos en rojo, silueta, lado a lado, trayectoria, brazos de momento, centro de masa, etiquetas, grilla, discos opacos.
- **Modelos**: por cada modelo, un selector de preset y "Ajustar anatomía" con los filtros (sección 3).

### 1.4 Paneles inferiores

- **Modelo A** y **Modelo B**: tabla de lecturas del instante actual y lista de advertencias (sección 5).
- **Músculos involucrados**: los músculos más activos con una barra por modelo (v1.5).
- **Qué mirar**: explicación del ejercicio y un resumen comparativo del punto más bajo ("A se inclina 27° y B 52° (+25°)…").

## 2. Representación del cuerpo

- Esqueleto con huesos reconocibles: pies, tibia y peroné, fémur, rótula, pelvis (ilíacos, sacro, ramas del pubis), columna con curvas (lumbar, dorsal, cervical), caja torácica y esternón, clavículas, escápulas, húmero, antebrazo, mano y cráneo.
- La pelvis marca con esferas del color del modelo las EIAS (adelante) y las EIPS (atrás), para leer la inclinación pélvica.
- La lordosis lumbar cambia con la inclinación pélvica relativa al torso: más anteversión, más curva; retroversión, se aplana o se invierte.
- **Silueta** opcional: volumen translúcido del cuerpo sobre el esqueleto.
- **Malla anatómica realista** (en vez de primitivas): **pendiente D-03**.

## 3. Modelos y filtros anatómicos

Cada modelo se define con estos parámetros. Las longitudes se expresan en % de la altura; la cabeza y el cuello toman lo que sobra, así dos modelos de igual altura se comparan sin que uno "crezca".

| Filtro | Rango | Por defecto (Winter) | Qué cambia |
| --- | --- | --- | --- |
| Altura | 145–205 cm | 175 cm | Escala todo |
| Fémur | 19–30 % | 24,5 % | Cuánto viaja la cadera hacia atrás |
| Tibia | 20–29 % | 24,6 % | Cuánto avanza la rodilla con la misma dorsiflexión |
| Torso (cadera → hombro) | 23–34 % | 28,8 % | Dónde queda el peso del torso y la barra |
| Brazo | 15–22 % | 18,6 % | Agarre y bisagra |
| Dorsiflexión máxima | 5–50° | 35° | Tope de avance de rodilla |
| Flexión de cadera máxima | 85–140° | 125° | Cuándo aparece la retroversión al fondo |
| Flexión de cadera con rodilla extendida (isquios) | 45–115° | 85° | Cuándo la bisagra pasa a redondear la lumbar |
| Inclinación pélvica en reposo | −12 a +22° | 0° | Postura de base y lordosis |

**Presets**: Promedio (Winter), Fémur corto / torso largo, Fémur largo / torso corto, Tibia larga, Tobillo rígido, Cadera / isquios limitados, Anteversión pélvica marcada. Tocar un filtro pasa el modelo a "Personalizado".

Por defecto: A = fémur corto, B = fémur largo (el ejemplo con el que nació la idea).

Guardar modelos con nombre (por ejemplo, el perfil de un alumno): v2, **pendiente D-04 y D-09**.

## 4. Ejercicios v1

Todos comparten la regla de equilibrio: el centro de masa del sistema (cuerpo + barra) queda sobre el mediopié en todo el recorrido. El detalle de cálculo está en `04 - Modelo biomecánico.md`.

| Ejercicio | Parámetro de recorrido | Carga por defecto | Qué tiene que mostrar |
| --- | --- | --- | --- |
| Sentadilla con barra alta | Profundidad, flexión de muslo 60–125° (100°) | 100 % | Fémur largo → más inclinación y más brazo de momento en cadera; retroversión al fondo si falta flexión de cadera |
| Sentadilla con barra baja | Igual | 100 % | Más inclinación y menos avance de rodilla que con barra alta; ratio cadera/rodilla más alto |
| Sentadilla frontal | Igual | 80 % | Torso más vertical, rodilla que avanza más; la dorsiflexión pasa a limitar |
| Bisagra de cadera / RDL | Inclinación máxima del torso 30–90° (75°) | 60 % | La cadera va hacia atrás para equilibrar; la barra baja pegada a las piernas sobre el mediopié; flexión lumbar si se pasa el límite de isquios |
| Anteversión ↔ retroversión pélvica | Amplitud 4–25° (14°) | — | La pelvis rota sobre las cabezas femorales, cambian las EIAS/EIPS y la lordosis |
| Retracción ↔ protracción escapular | Amplitud 20–100 % | — | El borde medial se acerca y se aleja de la columna; en protracción la escápula avanza sobre la parrilla |
| Elevación ↔ depresión escapular | Amplitud 20–100 % | — | La escápula sube y baja; el hombro acompaña |

Cada ejercicio tiene un texto de "Qué mirar" con 2–4 puntos clave.

Ejercicios de la v2 (a priorizar con Nico): peso muerto convencional, hip thrust, press banca, press militar, zancada, dominada, remo. Los que necesitan movimiento fuera del plano sagital (zancada con valgo, rotaciones) dependen de ampliar el solver (**pendiente D-12**).

## 5. Lecturas y advertencias

### Lecturas por modelo (sentadillas y bisagra)

Inclinación del torso, flexión de rodilla, flexión de cadera, dorsiflexión usada / máxima, brazo de momento en cadera y en rodilla (cm, distancia horizontal a la vertical del mediopié), ratio cadera/rodilla y profundidad (sobre / bajo el paralelo).

Pelvis: inclinación pélvica (con signo y "ante/retroversión"), índice de lordosis, inclinación en reposo.
Escápulas: distancia borde medial ↔ columna, desplazamiento vertical, estado.

### Advertencias

| Condición | Mensaje |
| --- | --- |
| Flexión de cadera necesaria > disponible (sentadilla) | Retroversión al fondo: faltan X° y lo compensa la pelvis/lumbar |
| Flexión de cadera > límite de isquios (bisagra) | Isquios al límite: X° del recorrido salen de flexión lumbar |
| Dorsiflexión al tope con tobillo limitado | La dorsiflexión limita el avance de rodilla → el torso se inclina más |
| Barra frontal y torso > 45° | La barra tiende a rodar de los hombros |
| Barra trasera y torso > 55° | Se parece más a un good morning |
| El solver no encuentra equilibrio | No puede mantener el centro de masa sobre el mediopié |

Sin advertencias se muestra "Sin compensaciones en este punto del recorrido". En la escena, la compensación se marca con un rótulo rojo junto a la pelvis.

### Ayudas visuales en la escena

Vertical del mediopié (punteada), centro de masa del sistema (esfera blanca y negra), brazos de momento de cadera y rodilla (líneas con su valor en cm), trayectoria de la barra (o de la cadera si no hay barra), etiquetas de ángulos y barra con discos (translúcidos por defecto, para no tapar el cuerpo).

## 6. Músculos (v1.5)

- **Capas**: Huesos (sin músculos), Músculos (todos, sobre los huesos) y Solo activos (solo los que superan el umbral, con huesos atenuados).
- **Activos en rojo**: los músculos se pintan de gris claro si están inactivos y de rosado a rojo intenso según su activación.
- **Activación**: estimación cualitativa de 0 a 1 por músculo según el ejercicio, la fase y la postura de cada modelo (por ejemplo, más glúteo con barra baja, más erectores cuanto más inclinado el torso). Se muestra el aviso "Estimación cualitativa. No es EMG". La tabla de activaciones la valida Nico (**pendiente D-11**).
- **Músculos v1.5**: cuádriceps, recto femoral, glúteo mayor y medio, isquiotibiales, aductor mayor, psoas ilíaco, gemelos, sóleo, tibial anterior, erectores espinales, recto abdominal, oblicuos, dorsal ancho, trapecio superior / medio / inferior, romboides, serrato anterior, deltoides, pectoral mayor, bíceps y tríceps.
- **Panel "Músculos involucrados"**: hasta 9 músculos ordenados por activación del modelo A, con una barra por modelo.
- Distinguir concéntrico, excéntrico e isométrico por músculo: a definir (**pendiente D-11**).

## 7. Compartir y cuentas (v2)

Todo pendiente de D-04, D-06 y D-09. Propuesta para discutir:

- **Link compartible**: guarda ejercicio, modelos, instante, cámara y capa, y abre la escena exactamente así. Sirve para mandarle a un alumno "mirá cómo se ve tu sentadilla".
- **Cuentas de entrenador**: guardar perfiles de alumnos (sus filtros anatómicos) y escenas.
- **Editor de ejercicios**: definir un ejercicio nuevo como datos (restricciones, recorrido, músculos) sin escribir código.

## 8. Requisitos no funcionales

| Tema | Requisito |
| --- | --- |
| Idioma | Español rioplatense. Preparado para sumar idiomas (**pendiente D-07**) |
| Dispositivos | Escritorio primero. Celular y tablet: **pendiente D-13** |
| Rendimiento | 60 fps con los dos modelos y todas las capas en una laptop media; el cálculo de postura de los dos modelos en menos de 2 ms por cuadro |
| Carga inicial | La escena visible en menos de 3 s con buena conexión |
| Exactitud | Las proporciones y masas salen de una fuente citada (Winter); las simplificaciones están documentadas y a la vista del usuario |
| Accesibilidad | Controles accesibles con teclado; información que no dependa solo del color (las advertencias tienen texto) |
