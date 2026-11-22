# Biomecánica Lab — SPEC funcional

Actualizado: 21/11/2026 · Estado: revisión 2, con los cambios de Nico del 21/11

Describe qué hace la app desde el punto de vista del usuario. Es un sitio público y se desarrolla entero en una sola versión: todo lo de este documento es parte del producto. Lo marcado **(pendiente D-xx)** depende de una decisión todavía abierta (ver `decisiones.md`). El prototipo `prototipo/index.html` sirve de referencia visual y de comportamiento; no es el código final.

## 1. Pantalla principal

Una sola pantalla. En computadora tiene tres zonas (escena, panel lateral y paneles inferiores); en el teléfono se reorganiza (sección 8).

### 1.1 Encabezado

- Nombre del sitio y una línea que explica qué es.
- **Selector de idioma** (desplegable): Español / English. Ver sección 7.

### 1.2 Escena 3D

- Muestra los modelos A y B y el piso con grilla de 10 cm.
- **Rotar**: arrastrar con el botón izquierdo o con un dedo. **Zoom**: rueda o pellizco. **Desplazar**: botón derecho o dos dedos.
- **Vistas rápidas**: Lateral, Frontal, Posterior, Superior y 3/4. La cámara viaja suave hasta la vista elegida. Cada ejercicio tiene una vista por defecto (lateral para sentadillas y bisagra, 3/4 para la pelvis, posterior para las escápulas) que se aplica al elegirlo. Después se puede seguir rotando libremente.
- **Disposición**: "Lado a lado" (por defecto) separa los modelos en el eje que mejor se ve desde la vista elegida: uno al lado del otro en lateral, 3/4 y superior, y lado a lado en el ancho en frontal y posterior. Desactivado, los modelos se superponen y B se ve translúcido.
- Indicador de fase en sentadillas y bisagra: "Fase excéntrica (bajando)" / "Fase concéntrica (subiendo)".
- Leyenda con el color y el nombre de cada modelo (A verde azulado, B naranja).

### 1.3 Línea de tiempo

- Play / Pausa, barra para ir a cualquier instante (moverla pausa) y velocidad 0.5× / 1× / 1.5×.
- Un ciclo dura unos 3,4 s a 1×: arranca arriba, baja hasta el punto más bajo y vuelve.

### 1.4 Controles

- **Ejercicio**: selector, un parámetro de recorrido propio de cada ejercicio y la carga en % del peso corporal (solo en ejercicios con barra).
- **Capa**: Huesos / Músculos / Solo activos, y opciones: activos en rojo, silueta, lado a lado, trayectoria, brazos de momento, centro de masa, etiquetas, grilla y discos opacos.
- **Modelos**: por cada modelo, un selector de preset y "Ajustar anatomía" con los filtros (sección 3).

### 1.5 Información

- **Modelo A** y **Modelo B**: lecturas del instante actual y advertencias (sección 5).
- **Músculos involucrados**: los músculos más activos con una barra por modelo (sección 6).
- **Qué mirar**: explicación del ejercicio y un resumen comparativo del punto más bajo ("A se inclina 27° y B 52° (+25°)…").

## 2. Representación del cuerpo

- Esqueleto con huesos reconocibles: pies, tibia y peroné, fémur, rótula, pelvis (ilíacos, sacro, ramas del pubis), columna con curvas (lumbar, dorsal, cervical), caja torácica y esternón, clavículas, escápulas, húmero, antebrazo, mano y cráneo.
- La pelvis marca con esferas del color del modelo las EIAS (adelante) y las EIPS (atrás), para leer la inclinación pélvica.
- La lordosis lumbar cambia con la inclinación pélvica relativa al torso: más anteversión, más curva; con retroversión se aplana o se invierte.
- **Silueta** opcional: volumen translúcido del cuerpo sobre el esqueleto.
- **Malla anatómica realista** en vez de primitivas: **pendiente D-03**.

## 3. Modelos y filtros anatómicos

Las longitudes se expresan en % de la altura; cabeza y cuello toman lo que sobra, así dos modelos de igual altura se comparan sin que uno "crezca".

| Filtro | Rango | Por defecto (Winter) | Qué cambia |
| --- | --- | --- | --- |
| Altura | 145–205 cm | 175 cm | Escala todo |
| Fémur | 19–30 % | 24,5 % | Cuánto viaja la cadera hacia atrás |
| Tibia | 20–29 % | 24,6 % | Cuánto avanza la rodilla con la misma dorsiflexión |
| Torso (cadera → hombro) | 23–34 % | 28,8 % | Dónde queda el peso del torso y la barra |
| Brazo | 15–22 % | 18,6 % | Agarre y bisagra |
| Dorsiflexión máxima | 5–50° | 35° | Tope de avance de la rodilla |
| Flexión de cadera máxima | 85–140° | 125° | Cuándo aparece la retroversión al fondo |
| Flexión de cadera con rodilla extendida (isquios) | 45–115° | 85° | Cuándo la bisagra pasa a redondear la lumbar |
| Inclinación pélvica en reposo | −12 a +22° | 0° | Postura de base y lordosis |

**Presets**: Promedio (Winter), Fémur corto / torso largo, Fémur largo / torso corto, Tibia larga, Tobillo rígido, Cadera / isquios limitados, Anteversión pélvica marcada. Tocar un filtro pasa el modelo a "Personalizado".

Por defecto: A = fémur corto, B = fémur largo.

Un valor fuera de rango (por ejemplo, escrito a mano o llegado por URL) se ajusta al límite más cercano y nunca rompe la escena.

## 4. Ejercicios

Todos comparten la regla de equilibrio: el centro de masa del sistema (cuerpo + barra) queda sobre el mediopié en todo el recorrido. El cálculo está en `04 - Modelo biomecánico.md`.

| Ejercicio | Parámetro de recorrido | Carga por defecto | Qué tiene que mostrar |
| --- | --- | --- | --- |
| Sentadilla con barra alta | Profundidad, flexión de muslo 60–125° (100°) | 100 % | Fémur largo → más inclinación y más brazo de momento en cadera; retroversión al fondo si falta flexión de cadera |
| Sentadilla con barra baja | Igual | 100 % | Más inclinación y menos avance de rodilla que con barra alta; ratio cadera/rodilla más alto |
| Sentadilla frontal | Igual | 80 % | Torso más vertical, rodilla que avanza más; la dorsiflexión pasa a limitar |
| Bisagra de cadera / RDL | Inclinación máxima del torso 30–90° (75°) | 60 % | La cadera va hacia atrás para equilibrar; la barra baja pegada a las piernas sobre el mediopié; flexión lumbar si se pasa el límite de isquios |
| Anteversión ↔ retroversión pélvica | Amplitud 4–25° (14°) | — | La pelvis rota sobre las cabezas femorales, cambian las EIAS/EIPS y la lordosis |
| Retracción ↔ protracción escapular | Amplitud 20–100 % | — | El borde medial se acerca y se aleja de la columna; en protracción la escápula avanza sobre la parrilla |
| Elevación ↔ depresión escapular | Amplitud 20–100 % | — | La escápula sube y baja; el hombro acompaña |

Cada ejercicio tiene un texto de "Qué mirar" con 2–4 puntos clave, en los dos idiomas.

**Ejercicios adicionales** (dentro del producto; cuáles y en qué orden: **pendiente D-15**): peso muerto convencional, hip thrust, press banca, press militar, remo, dominada y zancada. Los que necesitan movimiento fuera del plano sagital (zancada, valgo, rotaciones) dependen de ampliar el solver (**pendiente D-12**).

## 5. Lecturas y advertencias

### Lecturas por modelo

- Sentadillas y bisagra: inclinación del torso, flexión de rodilla, flexión de cadera, dorsiflexión usada / máxima, brazo de momento en cadera y en rodilla (cm, distancia horizontal a la vertical del mediopié), ratio cadera/rodilla y profundidad (sobre / bajo el paralelo).
- Pelvis: inclinación pélvica (con signo y "ante/retroversión"), índice de lordosis e inclinación en reposo.
- Escápulas: distancia borde medial ↔ columna, desplazamiento vertical y estado.

### Advertencias

| Condición | Mensaje |
| --- | --- |
| Flexión de cadera necesaria > disponible (sentadilla) | Retroversión al fondo: faltan X° y lo compensa la pelvis/lumbar |
| Flexión de cadera > límite de isquios (bisagra) | Isquios al límite: X° del recorrido salen de flexión lumbar |
| Dorsiflexión al tope con tobillo limitado (< 28°) | La dorsiflexión limita el avance de rodilla → el torso se inclina más |
| Barra frontal y torso > 45° | La barra tiende a rodar de los hombros |
| Barra trasera y torso > 55° | Se parece más a un good morning |
| El solver no encuentra equilibrio | No puede mantener el centro de masa sobre el mediopié |

Si ninguna condición se cumple, se muestra "Sin compensaciones en este punto del recorrido". En la escena, la compensación se marca con un rótulo rojo junto a la pelvis.

### Ayudas visuales en la escena

Vertical del mediopié (punteada), centro de masa del sistema (esfera blanca y negra), brazos de momento de cadera y rodilla (con su valor en cm), trayectoria de la barra (o de la cadera si no hay barra), etiquetas de ángulos y barra con discos (translúcidos por defecto, para no tapar el cuerpo).

## 6. Músculos

- **Capas**: Huesos (sin músculos), Músculos (todos, sobre los huesos) y Solo activos (solo los que superan el umbral, con los huesos atenuados).
- **Activos en rojo**: gris claro si el músculo está inactivo, de rosado a rojo intenso según su activación. Apagado, cada músculo vuelve al color anatómico.
- **Activación**: estimación cualitativa de 0 a 1 por músculo según el ejercicio, la fase y la postura de cada modelo (por ejemplo, más glúteo con barra baja, más erectores cuanto más inclinado el torso). Se muestra el aviso "Estimación cualitativa. No es EMG". La tabla la valida Nico (**pendiente D-11**).
- **Músculos**: cuádriceps, recto femoral, glúteo mayor y medio, isquiotibiales, aductor mayor, psoas ilíaco, gemelos, sóleo, tibial anterior, erectores espinales, recto abdominal, oblicuos, dorsal ancho, trapecio superior / medio / inferior, romboides, serrato anterior, deltoides, pectoral mayor, bíceps y tríceps.
- **Panel "Músculos involucrados"**: hasta 9 músculos ordenados por la activación del modelo A, con una barra por modelo.
- **Tipo de contracción** (concéntrica, excéntrica, isométrica) por músculo: **pendiente D-11**.

## 7. Idiomas

- La app funciona en **español** e **inglés**. Todos los textos (interfaz, ejercicios, "Qué mirar", advertencias, músculos, presets) salen de `es.json` y `en.json`; ninguno está escrito en el código.
- Al entrar, el idioma se detecta solo: primero el que el usuario eligió antes en ese navegador, después el idioma del navegador. Si no es español ni inglés, se usa español.
- El desplegable del encabezado cambia el idioma al instante, sin recargar y sin perder el estado de la escena (ejercicio, instante, cámara, modelos).
- La elección se recuerda en el navegador para la próxima visita.
- El atributo `lang` de la página acompaña al idioma elegido.
- Los números siguen el formato del idioma (coma decimal en español, punto en inglés).

## 8. Responsive y usabilidad

La app se usa igual de bien en un teléfono que en una computadora.

| Ancho | Distribución |
| --- | --- |
| ≥ 1024 px (computadora) | Escena a la izquierda con la línea de tiempo debajo; controles en una columna a la derecha; información debajo de la escena |
| 640–1023 px (tablet) | Escena arriba a todo el ancho; controles e información en dos columnas debajo |
| < 640 px (teléfono) | Escena arriba ocupando ~55 % del alto visible, con la línea de tiempo pegada debajo; el resto en pestañas: **Ejercicio**, **Modelos**, **Vista**, **Datos** |

Reglas de usabilidad:

- Gestos táctiles en la escena (un dedo rota, pellizco hace zoom, dos dedos desplazan) sin que la página haga scroll mientras se manipula el modelo.
- Áreas táctiles de al menos 44 × 44 px; nada depende de pasar el mouse por encima.
- Sin scroll horizontal en ningún ancho a partir de 320 px.
- En el teléfono, los modelos se ven superpuestos o lado a lado con un encuadre que los deja enteros en pantalla.
- Lo importante a la vista: ejercicio, play/pausa y vista de cámara se alcanzan sin abrir menús.
- Estados claros: botones activos marcados, valores al lado de cada slider, advertencias con texto (no solo color).
- Accesible con teclado y con etiquetas para lectores de pantalla en todos los controles.

## 9. Requisitos no funcionales

| Tema | Requisito |
| --- | --- |
| Acceso | Sitio público, sin registro. No guarda nada en un servidor; solo el idioma elegido en el navegador |
| Rendimiento | 60 fps con dos modelos y todas las capas en una laptop media; 30 fps o más en un teléfono de gama media. El cálculo de postura de los dos modelos en menos de 2 ms por cuadro |
| Carga inicial | Escena visible en menos de 3 s con buena conexión |
| Exactitud | Proporciones y masas de una fuente citada (Winter); las simplificaciones están documentadas |
| Calidad de código | Componentes modulares que respetan SOLID (ver SPEC técnica) |
| Pruebas | Cada criterio de aceptación tiene un test de caso feliz y uno de caso triste, y hay tests que verifican que esos tests detectan fallas (ver SPEC técnica) |
