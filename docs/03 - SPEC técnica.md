# Biomecánica Lab — SPEC técnica

Actualizado: 21/11/2026 · Estado: borrador para revisión de Nico

Cómo se construye. Las decisiones de stack están pendientes (ver `decisiones.md`); donde hace falta un nombre concreto se marca como **sugerencia** y no se aplica sin aprobación.

## Principios

1. **El motor biomecánico es puro.** Funciones de TypeScript sin dependencias de Three.js, del DOM ni de la UI: reciben un modelo, un ejercicio y un instante, y devuelven una postura. Se prueban en milisegundos y se pueden reusar (por ejemplo en un backend o en TrainingBook).
2. **La escena solo dibuja.** Recibe posturas y activaciones, y actualiza mallas. No calcula biomecánica.
3. **La UI solo orquesta.** Guarda el estado (ejercicio, modelos, instante, cámara, capa) y conecta las otras dos capas.
4. **Ejercicios y músculos como datos.** Agregar un ejercicio o un músculo no debería tocar la escena.
5. **Determinismo.** Mismo estado → misma imagen. Es lo que permite evidencia automática.

## Capas y dependencias

```
UI  ──▶  Escena 3D  ──▶  Motor biomecánico
 │                          ▲
 └──────────────────────────┘
```

La UI puede llamar al motor directamente (lecturas, resumen del punto más bajo). El motor nunca importa nada de las otras dos.

## Estructura de carpetas (sugerencia, por tipo)

```
src/
  biomechanics/        motor puro
    model/             buildModel, presets
    kinematics/        forwardKinematics, twoBoneIk
    mass/              centerOfMass
    solvers/           squat, hinge, pelvicTilt, scapula, bisection
    readouts/          momentArms, warnings, bottomSummary
    activation/        activación por ejercicio
  exercises/           definiciones de ejercicios (datos)
  muscles/             catálogo de músculos y sus inserciones (datos)
  scene/
    rig/               Rig: mallas del esqueleto y su update
    geometry/          perfiles de hueso, huso muscular, cápsula
    landmarks/         puntos anatómicos 3D a partir de una postura
    overlays/          mediopié, centro de masa, brazos de momento, trayectoria
    camera/            vistas rápidas y animación de cámara
    hud/               etiquetas proyectadas
  ui/
    components/        paneles, selectores, línea de tiempo
    state/             store de la app
    url/               leer y escribir el estado en la URL
  constants/           antropometría, masas, límites, colores, cámaras
  messages/            textos de la interfaz
tests/
  unit/                motor, readouts, url
  evidence/            specs de Playwright por feature
  constants/
```

## Contratos principales

```ts
type BodyParams = {
  heightCm: number; femurPct: number; tibiaPct: number; torsoPct: number; armPct: number;
  ankleDorsiflexionDeg: number; hipFlexionDeg: number; hamstringLimitDeg: number; pelvicTiltDeg: number;
};

type ExerciseId = 'squatHigh' | 'squatLow' | 'squatFront' | 'rdl' | 'pelvicTilt' | 'scapRetraction' | 'scapElevation';

type ExerciseInput = { exercise: ExerciseId; progress: number; range: number; loadFraction: number };

type Pose = {
  joints: { ankle: Vec2; knee: Vec2; hip: Vec2; shoulder: Vec2; headCenter: Vec2 };
  arms: { shoulder: Vec3; elbow: Vec3; wrist: Vec3 };
  angles: { shinRad: number; thighRad: number; torsoRad: number; pelvicTiltDeg: number };
  scapula: { medialDistance: number; vertical: number };
  bar: Vec2 | null;
  centerOfMass: Vec2;
  compensationDeg: number;
  solverStatus: 'ok' | 'fallsBackward' | 'fallsForward';
};

solvePose(model: BodyModel, input: ExerciseInput): Pose
activation(exercise: ExerciseId, pose: Pose, model: BodyModel): Partial<Record<MuscleId, number>>
```

`progress` va de 0 a 1 (arriba → punto más bajo). El ciclo de animación lo convierte con `p = ½ − ½·cos(2πt)`.

## Escena 3D

- **Motor**: Three.js (**pendiente D-02**). El prototipo usa Three.js r160 con OrbitControls.
- **Esqueleto procedural**: huesos hechos con un perfil de revolución (extremos más anchos) que se estira entre dos articulaciones; pelvis, caja torácica y cráneo como grupos rígidos que se ubican y rotan con la postura; escápulas con geometría dinámica; columna de 24 vértebras sobre tres curvas de Bézier (lumbar, dorsal, cervical).
- **Músculos**: husos (perfil de revolución) estirados entre dos puntos anatómicos. Cada músculo del catálogo declara origen, inserción y grosor en fracción de H. Material propio por músculo para pintarlo según su activación.
- **Puntos anatómicos**: se calculan en cada cuadro a partir de la postura, en tres marcos de referencia (pelvis, torso y cada segmento). Es lo que comparten huesos, músculos y etiquetas.
- **Malla realista** en vez de primitivas: **pendiente D-03**. Si se elige una malla con rig, la capa `scene/rig` se reemplaza y el motor no cambia.
- **Rendimiento**: unas 150 mallas por modelo; se actualizan transformaciones, no se recrea geometría por cuadro (salvo la de las escápulas, que tiene 10 vértices). Sombras con una luz direccional y mapa de 2048.
- **HUD**: las etiquetas se dibujan en un canvas 2D encima, proyectando puntos 3D a pantalla.

## Estado y URL

- Estado de la app: ejercicio, recorrido, carga, modelos (preset + parámetros), instante, play/pausa, velocidad, vista de cámara, capa y opciones.
- Librería de estado: **pendiente D-01** (sugerencia: un store chico como Zustand si se elige React).
- **Estado en la URL** (para evidencia y para los links compartibles de la v2): `?ex=squatHigh&t=0.5&cam=lateral&layer=muscles&a=femurCorto&b=femurLargo&anim=0`. Con `anim=0` la animación arranca pausada en `t`. Los modelos personalizados se serializan en compacto.

## Evidencia automática

- Playwright abre la app con la URL de la feature, espera a que la escena avise que está lista (un atributo `data-ready` en el canvas) y saca una captura por criterio en `screenshots/<id>/`.
- Chrome con WebGL por software (`--use-angle=swiftshader`), viewport fijo (1400×1000) y `t` fijo: las capturas son reproducibles en cualquier máquina.
- Además de la imagen, cada spec puede volcar las lecturas del instante (inclinación, brazos de momento) en un `.json` al lado de la captura, para que el PR muestre números junto a la imagen.

## Pruebas unitarias del motor

Invariantes que tienen que pasar siempre:

| Invariante | Ejemplo de test |
| --- | --- |
| Equilibrio | En los 7 ejercicios y en p ∈ {0, 0,25, 0,5, 0,75, 1}, el centro de masa está a menos de 1 mm del mediopié cuando `solverStatus = 'ok'` |
| Proporciones | A igual altura, cabeza+cuello = H − tobillo − tibia − fémur − torso |
| Fémur | Con todo igual, más fémur ⇒ más inclinación del torso en el punto más bajo |
| Barra baja | Con el mismo modelo, barra baja ⇒ más inclinación y más ratio cadera/rodilla que barra alta |
| Frontal | Barra frontal ⇒ menos inclinación que barra alta |
| Tobillo | Menos dorsiflexión ⇒ más inclinación |
| Retroversión | Bajar la flexión de cadera máxima hace aparecer compensación > 0; subirla la elimina |
| Isquios | En la bisagra, bajar el límite de isquios aumenta la compensación lumbar |
| Pelvis | En p = 0 la inclinación es reposo + amplitud; en p = 1, reposo − amplitud |
| Escápula | La distancia medial disminuye de forma monótona con p en retracción |
| IK | Los segmentos del brazo conservan su largo (error < 0,1 mm) |

## Herramientas (pendientes, sugerencia = mismas que Etha Joyas)

| Tema | Sugerencia | Decisión |
| --- | --- | --- |
| Framework | Vite + React + TypeScript (sin SSR: es una app de un solo canvas, el SEO pesa poco) | D-01 |
| Motor 3D | Three.js directo, encapsulado en `scene/` | D-02 |
| Gestor de paquetes | pnpm | D-08 |
| Tests unitarios | Vitest | D-08 |
| Evidencia | Playwright | D-08 |
| Lint y formato | Biome | D-08 |
| Textos | i18next o mensajes propios en `messages/es.json` | D-07 |
| Hosting | Netlify o Vercel, plan gratuito (sitio estático) | D-05 |
| Backend v2 | Supabase (Auth + Postgres + RLS), como Etha Joyas | D-04 |

## Riesgos técnicos

| Riesgo | Mitigación |
| --- | --- |
| Capturas WebGL distintas entre corridas | URL determinista, `t` fijo, sin animación de cámara en modo evidencia, SwiftShader |
| Malla anatómica realista pesada o con licencia incompatible | Mantener la escena procedural mientras se decide D-03; revisar licencias (por ejemplo, las CC BY-SA obligan a compartir igual) |
| Que el modelo cualitativo de músculos se lea como dato científico | Aviso visible y tabla validada por Nico (D-11) |
| Que el solver sagital no alcance para ejercicios unilaterales o con rotación | Documentado como simplificación; ampliar en la v2 (D-12) |
