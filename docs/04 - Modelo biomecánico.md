# Biomecánica Lab — Modelo biomecánico

Actualizado: 21/11/2026 · Estado: borrador para revisión de Nico

Cómo se calcula la postura. Es la parte del proyecto que más importa que sea correcta: todo lo que se ve en pantalla sale de acá. Los valores están tomados de las tablas antropométricas de Winter y conviene que Nico los verifique contra su edición antes de pasarlos a `src/constants/`.

## Convenciones

- Unidades internas: metros, kilogramos relativos (fracción del peso corporal) y radianes. En pantalla: cm y grados.
- Ejes: **x** hacia adelante (hacia donde mira el modelo), **y** hacia arriba, **z** lateral (+z = derecha del modelo).
- Origen: el piso, con el tobillo en x = 0.
- El solver trabaja en el **plano sagital** (x, y). La escena 3D lo extiende a los dos lados en z de forma simétrica.

## Segmentos

Longitudes como fracción de la altura H (Winter).

| Segmento | Fracción de H | Notas |
| --- | --- | --- |
| Alto del tobillo | 0,039 | Del piso al centro articular del tobillo |
| Pie (largo) | 0,152 | Talón en −0,22·pie y punta en +0,78·pie respecto del tobillo |
| Tibia (tobillo → rodilla) | 0,246 | Filtro "Tibia" |
| Fémur (rodilla → cadera) | 0,245 | Filtro "Fémur" |
| Torso (cadera → hombro) | 0,288 | Filtro "Torso" |
| Cabeza + cuello (hombro → vértice) | 0,182 | Toma lo que sobra: 1 − 0,039 − tibia − fémur − torso |
| Brazo | 0,186 | Filtro "Brazo" |
| Antebrazo + mano | brazo × 1,05 | Hasta el centro de la mano |

**Mediopié**: 0,2 × largo del pie por delante del tobillo. Es la vertical que el solver usa como línea de equilibrio.

## Filtros y presets

Rangos y valores por defecto de los filtros: SPEC funcional, sección 3. Un valor fuera de rango se ajusta al límite más cercano; un valor que no es un número usa el de Winter.

Valores de los presets (los del prototipo aprobado). Lo que no figura queda como en Promedio.

| Preset | Fémur | Tibia | Torso | Otros |
| --- | --- | --- | --- | --- |
| Promedio (Winter) | 24,5 % | 24,6 % | 28,8 % | Altura 175 cm, brazo 18,6 %, dorsiflexión 35°, flexión de cadera 125°, isquios 85°, pelvis 0° |
| Fémur corto / torso largo | 21,5 % | | 31,8 % | |
| Fémur largo / torso corto | 27,5 % | | 25,8 % | |
| Tibia larga | 23,3 % | 27,0 % | 27,6 % | |
| Tobillo rígido | | | | Dorsiflexión 20° |
| Cadera / isquios limitados | | | | Flexión de cadera 100°, isquios 65° |
| Anteversión pélvica marcada | | | | Pelvis +14° |


## Masas segmentarias

Fracción del peso corporal y posición del centro de masa en el segmento.

| Segmento | Masa (ambos lados) | Centro de masa |
| --- | --- | --- |
| Pies | 0,029 | Mitad del pie |
| Piernas (tibia) | 0,093 | 0,433 desde la rodilla |
| Muslos | 0,200 | 0,433 desde la cadera |
| Tronco | 0,497 | Mitad entre cadera y hombro |
| Cabeza y cuello | 0,081 | Centro de la cabeza |
| Brazos | 0,056 | 0,436 desde el hombro |
| Antebrazos y manos | 0,044 | 0,682 desde el codo |

Centro de masa del sistema: `(Σ masa·posición + carga·barra) / (1 + carga)`, con la carga como fracción del peso corporal.

## Grados de libertad

| Ángulo | Símbolo | Definición |
| --- | --- | --- |
| Tibia | α | Desde la vertical, positivo con la rodilla hacia adelante. Aproxima la dorsiflexión con el pie apoyado |
| Muslo | ψ | Desde la vertical, positivo con la cadera detrás de la rodilla. 90° = muslo horizontal |
| Torso | β | Inclinación desde la vertical, positivo hacia adelante |
| Pelvis | tilt | Relativa al torso, positivo = anteversión |

Derivados: flexión de rodilla = α + ψ; flexión de cadera = ψ + β.

## Solvers

En todos el resultado es una postura en la que el centro de masa del sistema cae sobre el mediopié. Se resuelve por bisección (40 iteraciones, error menor a 0,1 mm), porque la posición del centro de masa es monótona en la variable que se busca.

### Sentadilla (barra alta, baja y frontal)

1. El recorrido define ψ: `ψ = p · profundidad`, con p de 0 (arriba) a 1 (abajo). De pie, la cadera se adelanta un poco (hasta −10° al inicio) para que la postura de arranque sea natural.
2. La tibia avanza con la profundidad hasta el tope de dorsiflexión: `α = min(αmax, αmax · sen(s·π/2) · k)`, con `s = min(1, ψ/100°)` y k = 1 (alta), 0,8 (baja), 1,15 (frontal).
3. Se busca β ∈ [−15°, 88°] tal que el centro de masa quede sobre el mediopié.
4. Posición de la barra respecto del hombro (u = eje del torso, atrás = perpendicular):
   - Alta: +0,012·H sobre u y 0,045·H atrás.
   - Baja: −0,03·H sobre u y 0,05·H atrás.
   - Frontal: +0,005·H sobre u y 0,055·H adelante.
5. Compensación pélvica: si ψ + β supera la flexión de cadera máxima, el exceso (hasta 30°) se resta de la inclinación pélvica. Es la retroversión al fondo.

### Bisagra / RDL

1. El recorrido define β: `β = p · inclinación máxima`. La tibia casi no se mueve (α hasta 3°).
2. La barra baja pegada a las piernas sobre el mediopié: las manos van a la vertical del mediopié, a la distancia del largo del brazo desde el hombro.
3. Se busca ψ ∈ [−15°, 100°] (cuánto va la cadera hacia atrás) para equilibrar.
4. Compensación lumbar: si ψ + β supera el límite de isquios, el exceso (hasta 35°) se resta de la inclinación pélvica.

### Pelvis

De pie (ψ = 0, β = 0), se busca α para que el centro de masa caiga sobre el mediopié. La inclinación pélvica oscila: `tilt = reposo + amplitud · (1 − 2p)`.

### Escápulas

De pie. El borde medial está a d de la columna, 0,04·H en posición neutra (≈7 cm en 175 cm).

- Retracción/protracción: `d = 0,04·H + a · lerp(+0,02·H, −0,016·H, p)` (≈10,5 cm protraída, ≈4,2 cm retraída).
- Elevación/depresión: desplazamiento vertical `a · lerp(−0,015·H, +0,03·H, p)`.
- La articulación del hombro está a d + 0,07·H del centro; en protracción la escápula avanza sobre la parrilla en proporción a cuánto se separa.

### Brazos

Cinemática inversa de dos segmentos en 3D, con un vector de polo que decide hacia dónde apunta el codo: abajo y atrás con barra trasera, adelante y arriba con barra frontal, atrás en la bisagra y colgando. Agarre (mitad del ancho, en H): alta 0,24, baja 0,20, frontal 0,115, colgando 0,11.

## Lecturas

- **Brazo de momento** de cadera y rodilla: distancia horizontal entre la articulación y la vertical del mediopié. Es la simplificación de entrenador: con la barra sobre el mediopié, esa vertical es la línea de la carga.
- **Ratio cadera / rodilla**: cociente de los dos brazos de momento.
- **Profundidad**: bajo el paralelo cuando el centro de la cadera queda por debajo del de la rodilla.

## Simplificaciones conocidas

Están a la vista para que Nico decida cuáles hay que mejorar.

1. Todo el cálculo es sagital y simétrico: no hay stance ancho, rotación de cadera, valgo ni asimetrías.
2. El torso es rígido entre cadera y hombro. La curva lumbar se dibuja según la inclinación pélvica, pero no cambia el cálculo del equilibrio.
3. El avance de la rodilla sigue una curva fija hasta el tope de dorsiflexión. No sale de minimizar un costo (por ejemplo, esfuerzo o torque).
4. El equilibrio es estático (cuasiestático): no hay aceleraciones.
5. La compensación pélvica es solo geométrica: el exceso de flexión se pasa a la pelvis sin modelar la lumbar vértebra por vértebra.
6. La activación muscular es una tabla cualitativa por ejercicio, fase y postura, no un modelo de fuerzas.
7. La escápula tiene un modelo simple de deslizamiento sobre un elipsoide.

## Referencias

- Winter, D. A. *Biomechanics and Motor Control of Human Movement*, 4.ª ed. (2009), tablas de antropometría segmentaria (longitudes, masas y centros de masa).
- Dempster, W. T. (1955), estudios de segmentos corporales en los que se basan las tablas de Winter.
