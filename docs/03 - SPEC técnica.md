# Biomecánica Lab — SPEC técnica

Actualizado: 21/11/2026 · Estado: revisión 2, con los cambios de Nico del 21/11

Cómo se construye. Lo que todavía no está decidido se marca como **sugerencia** y no se aplica sin aprobación (ver `decisiones.md`).

## Forma del producto

- Sitio estático público. **No hay backend ni base de datos**: todo corre en el navegador. Lo único que se guarda es el idioma elegido, en `localStorage`.
- Una sola versión: se construye de principio a fin según `feature_list.json`.
- Si en algún momento aparece código de servidor (por ejemplo, una función serverless), sigue las mismas reglas de diseño y pruebas que el frontend.

## Principios de diseño

### SOLID aplicado

| Principio | Cómo se aplica acá |
| --- | --- |
| **S** — Responsabilidad única | Cada módulo hace una cosa: `buildModel` arma longitudes, `centerOfMass` calcula el centro de masa, `SquatSolver` resuelve sentadillas, `Rig` dibuja un esqueleto, `LanguageSelector` solo cambia el idioma. Un componente de UI no calcula biomecánica ni toca Three.js |
| **O** — Abierto/cerrado | Ejercicios, músculos, presets y vistas de cámara se registran como datos o como implementaciones de una interfaz. Agregar un ejercicio es sumar una definición (y un solver nuevo solo si el patrón es nuevo), sin tocar los existentes ni la escena |
| **L** — Sustitución de Liskov | Todo solver cumple el mismo contrato (`PoseSolver`): misma entrada, misma salida, mismas garantías (centro de masa sobre el mediopié o un `solverStatus` que dice por qué no). La escena y los tests tratan a cualquier solver igual |
| **I** — Segregación de interfaces | Interfaces chicas: `PoseSolver`, `ActivationModel`, `ReadoutCalculator`, `WarningRule`, `SceneLayer`, `Translator`. Nadie depende de métodos que no usa |
| **D** — Inversión de dependencias | La UI y la escena dependen de interfaces, no de implementaciones: el registro de ejercicios, el traductor y el reloj de animación se inyectan. Esto permite probar con dobles (por ejemplo, un reloj fijo para las capturas) |

### Otras reglas

1. **Tres capas que no se mezclan**: motor biomecánico (TS puro), escena 3D y UI. Dependencias en un solo sentido: UI → escena → motor. Una regla de lint verifica que `src/biomechanics` no importe nada de `scene` ni de `ui`.
2. **Funciones puras en el motor**: sin estado global, sin `Date`, sin `Math.random`. Mismo input, mismo output.
3. **Sin números mágicos**: proporciones, masas, rangos, umbrales de advertencia, colores y tamaños viven en `src/constants/`.
4. **Componentes chicos**: un componente por archivo, sin componentes de cientos de líneas; lógica de presentación separada de la lógica de estado (hooks o controladores).
5. **Sin textos en el código**: todo sale de `es.json` / `en.json`.
6. **Determinismo**: mismo estado → misma imagen. Es lo que permite evidencia automática.

## Capas y módulos

```
UI  ──▶  Escena 3D  ──▶  Motor biomecánico
 │                          ▲
 └──────────────────────────┘
```

Estructura sugerida (carpetas por tipo):

```
src/
  biomechanics/        motor puro
    model/             buildModel, presets, clampParams
    kinematics/        forwardKinematics, twoBoneIk
    mass/              centerOfMass
    solvers/           PoseSolver (interfaz), squat, hinge, pelvicTilt, scapula, bisection
    readouts/          momentArms, depth, bottomSummary
    warnings/          WarningRule (interfaz) y una regla por archivo
    activation/        ActivationModel (interfaz) y modelo por ejercicio
  exercises/           definiciones de ejercicios (datos) y registro
  muscles/             catálogo de músculos e inserciones (datos)
  scene/
    rig/               Rig: mallas del esqueleto y su update
    geometry/          perfiles de hueso, huso muscular, cápsula
    landmarks/         puntos anatómicos 3D a partir de una postura
    layers/            SceneLayer (interfaz): huesos, músculos, silueta
    overlays/          mediopié, centro de masa, brazos de momento, trayectoria
    camera/            vistas rápidas, encuadre por tamaño de pantalla
    hud/               etiquetas proyectadas
  ui/
    components/        un componente por archivo
    layout/            distribución por breakpoint (computadora, tablet, teléfono)
    state/             store de la app
    url/               estado de la escena en la URL (modo evidencia)
  i18n/                configuración de i18next, detector y formato de números
  constants/
  locales/             es.json, en.json
tests/
  criteria/            un archivo por feature: tests de los criterios (feliz y triste)
  meta/                tests de los tests (sección "Pruebas")
  evidence/            specs de Playwright por feature
  helpers/  constants/
```

## Contratos principales

```ts
type BodyParams = {
  heightCm: number; femurPct: number; tibiaPct: number; torsoPct: number; armPct: number;
  ankleDorsiflexionDeg: number; hipFlexionDeg: number; hamstringLimitDeg: number; pelvicTiltDeg: number;
};

type ExerciseInput = { progress: number; range: number; loadFraction: number };

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

interface PoseSolver { solve(model: BodyModel, input: ExerciseInput): Pose }
interface ActivationModel { activation(pose: Pose, model: BodyModel, input: ExerciseInput): Partial<Record<MuscleId, number>> }
interface WarningRule { id: WarningId; applies(pose: Pose, model: BodyModel, exercise: ExerciseDefinition): boolean }
interface Translator { t(key: string, params?: Record<string, unknown>): string; formatNumber(value: number, digits: number): string }
```

`progress` va de 0 a 1 (arriba → punto más bajo). La animación lo convierte con `p = ½ − ½·cos(2πt)`.

## Escena 3D

- **Motor**: Three.js (**pendiente D-02**). El prototipo usa Three.js r160 con OrbitControls.
- **Esqueleto procedural**: huesos con un perfil de revolución que se estira entre dos articulaciones; pelvis, caja torácica y cráneo como grupos rígidos; escápulas con geometría dinámica; columna de 24 vértebras sobre tres curvas de Bézier.
- **Músculos**: husos estirados entre dos puntos anatómicos; cada músculo del catálogo declara origen, inserción y grosor en fracción de la altura. Material propio por músculo para pintarlo según su activación.
- **Puntos anatómicos**: se calculan en cada cuadro a partir de la postura. Los comparten huesos, músculos y etiquetas.
- **Malla realista**: **pendiente D-03**. Si se adopta, solo cambia `scene/rig`.
- **Rendimiento**: se actualizan transformaciones, no se recrea geometría por cuadro. En pantallas chicas o de alta densidad se limita el pixel ratio a 2 y el mapa de sombras a 1024.
- **Encuadre responsive**: la distancia de la cámara se ajusta a la relación de aspecto del contenedor para que los dos modelos entren enteros, también en vertical (teléfono).
- **Táctil**: el canvas usa `touch-action: none` para que los gestos no hagan scroll de la página.

## Idiomas (i18n)

- Decidido: archivos `es.json` y `en.json`, detección automática y desplegable.
- Librería: **i18next** + **i18next-browser-languagedetector** (+ el binding del framework que se elija en D-01, por ejemplo `react-i18next`). Elegida por Claude a pedido de Nico; se puede cambiar si prefiere otra.
- Orden de detección: `localStorage` (elección previa) → `navigator` (idioma del navegador). Idiomas soportados: `es`, `en`; fallback: `es`.
- Cambiar de idioma no recarga la página ni reinicia la escena; actualiza `<html lang>`.
- Números con `Intl.NumberFormat` según el idioma activo.
- **Chequeo de claves**: un test compara `es.json` y `en.json` (mismas claves) y otro busca en el código las claves usadas: ninguna clave sin usar, ninguna usada que falte. Una clave faltante en tiempo de ejecución tira error en desarrollo y en tests.

## Responsive

- Breakpoints: 640 px y 1024 px (ver SPEC funcional, sección 8). Mobile first: el CSS base es el del teléfono y se agregan reglas hacia arriba.
- La escena ocupa un contenedor que se redimensiona con `ResizeObserver`; la cámara se reencuadra al cambiar el tamaño o la orientación.
- Librería de estilos: **pendiente D-19** (sugerencia: Tailwind, como en Etha Joyas).

## Estado y URL

- Estado: ejercicio, recorrido, carga, modelos (preset + parámetros), instante, play/pausa, velocidad, vista de cámara, capa, opciones e idioma.
- Librería de estado: **pendiente D-01** (sugerencia: Zustand si se elige React).
- **Estado en la URL para evidencia**: `?ex=squatHigh&t=0.5&cam=lateral&layer=muscles&a=femurCorto&b=femurLargo&anim=0&lng=en`. Con `anim=0` la animación arranca pausada en `t` y sin transición de cámara. No es una función para el usuario final (no hay links compartibles); es la base del modo evidencia.

## Pruebas

### 1. Tests de criterios (no genéricos)

- Cada criterio de aceptación de `feature_list.json` tiene un identificador: `<feature>.<n>` (por ejemplo, `B-05.2` es el segundo criterio de B-05).
- Por cada criterio hay **al menos dos tests**:
  - **Caso feliz**: la condición del criterio se cumple como dice la SPEC.
  - **Caso triste**: la entrada inválida, el borde o la condición opuesta se comporta como corresponde (se rechaza, se ajusta al límite, la advertencia no aparece, el solver informa que no hay equilibrio, etc.).
- El nombre del test empieza con el identificador y el caso: `[B-05.2][feliz] el fémur largo se inclina más que el corto en el punto más bajo` y `[B-05.2][triste] con fémures iguales la inclinación es la misma`.
- No se escriben tests que no estén atados a un criterio (nada de "renderiza sin romper" sueltos). Si hace falta probar algo que no está en un criterio, primero se agrega el criterio a la SPEC y a `feature_list.json`.

### 2. Tests de los tests

Para asegurar que los tests de criterios realmente detectan fallas:

| Meta-test | Qué verifica | Caso feliz | Caso triste |
| --- | --- | --- | --- |
| **Trazabilidad** | Cada criterio de cada feature en estado `en_progreso`, `en_review` o `hecho` tiene al menos un test `[feliz]` y uno `[triste]`, y cada test apunta a un criterio que existe | Una feature con sus dos tests pasa el chequeo | Un fixture de feature sin test `[triste]` (o con un test que apunta a `X-99.1`, que no existe) hace fallar el chequeo |
| **Mutación** | Se introducen cambios automáticos en el código (invertir una comparación, cambiar un `+` por `-`, borrar una línea) y los tests tienen que fallar. Umbral mínimo de mutantes eliminados en `src/biomechanics`: 80 % | El código real con sus tests supera el umbral | Un fixture con un test vacío (que no comprueba nada) queda por debajo del umbral y el chequeo falla |
| **Sensibilidad de los helpers** | Los helpers de aserción propios (por ejemplo, `expectCenterOfMassOverMidfoot`) fallan cuando deben | El helper pasa con una postura equilibrada | El helper falla con una postura corrida 5 mm |

- Herramienta de mutación: **pendiente D-08** (sugerencia: StrykerJS con el runner de Vitest).
- Los meta-tests corren en el chequeo previo a cada PR.

### 3. Invariantes del motor (ejemplos de criterios)

| Invariante | Feliz | Triste |
| --- | --- | --- |
| Equilibrio | En los 7 ejercicios y en p ∈ {0, 0,25, 0,5, 0,75, 1}, el centro de masa está a menos de 1 mm del mediopié | Con una carga imposible (o un rango fuera de límites) el solver devuelve `solverStatus` distinto de `ok` en vez de una postura inventada |
| Fémur | Más fémur ⇒ más inclinación en el punto más bajo | Fémures iguales ⇒ misma inclinación |
| Retroversión | Bajar la flexión de cadera máxima hace aparecer compensación > 0 | Con flexión suficiente la compensación es exactamente 0 |
| IK | Los segmentos del brazo conservan su largo (error < 0,1 mm) | Un objetivo fuera de alcance deja el brazo extendido hacia el objetivo, sin estirar los segmentos |
| Parámetros | Valores dentro de rango se usan tal cual | Valores fuera de rango se ajustan al límite |

### 4. Evidencia

- Playwright abre la URL de la feature, espera a que el canvas tenga `data-ready="true"` y saca una captura por criterio en `screenshots/<id>/`, nombrada con el número de criterio.
- Viewports: computadora (1400×1000) y teléfono (390×844) para todo lo que tenga UI.
- WebGL por software (`--use-angle=swiftshader`) para que las capturas sean reproducibles.
- Junto a cada captura se puede volcar un `.json` con las lecturas del instante, para que el PR muestre números al lado de la imagen.

## Herramientas

| Tema | Estado | Sugerencia |
| --- | --- | --- |
| Framework y estado | Pendiente D-01 | Vite + React + TypeScript; Zustand |
| Motor 3D | Pendiente D-02 | Three.js directo, encapsulado en `src/scene/` |
| i18n | Decidido | i18next + i18next-browser-languagedetector |
| Gestor de paquetes, tests, evidencia, lint, mutación | Pendiente D-08 | pnpm, Vitest, Playwright, Biome, StrykerJS |
| Estilos | Pendiente D-19 | Tailwind |
| Hosting | Pendiente D-05 | Netlify, plan gratuito (sitio estático) |

## Riesgos técnicos

| Riesgo | Mitigación |
| --- | --- |
| Capturas WebGL distintas entre corridas | URL determinista, `t` fijo, sin transición de cámara en modo evidencia, SwiftShader |
| Rendimiento en teléfonos | Pixel ratio limitado, sombras más chicas, menos segmentos por malla en pantallas chicas |
| Malla anatómica realista pesada o con licencia incompatible | Mantener la escena procedural mientras se decide D-03; revisar licencias |
| Que la activación muscular se lea como dato científico | Aviso visible y tabla validada por Nico (D-11) |
| Que el solver sagital no alcance para ejercicios unilaterales o con rotación | Documentado como simplificación; ampliarlo (D-12) |
| Mutation testing lento | Correrlo sobre los archivos cambiados en cada PR y completo antes de cerrar una fase |
