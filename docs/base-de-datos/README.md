# Base de datos — propuesta para revisar

**Estado: propuesta.** La v1 y la v1.5 no necesitan base de datos: todo el estado vive en la app y en la URL. La base aparece en la v2, con las cuentas de entrenador, los perfiles de alumnos y los links compartibles. Nada de esto se implementa hasta que Nico decida D-04 (backend), D-06 (alcance) y D-09 (perfiles de alumnos).

La propuesta asume Supabase (Postgres + Auth + RLS), como en Etha Joyas. [`esquema.dbml`](esquema.dbml) tiene el diagrama.

## Cómo ver el diagrama

1. Abrí [dbdiagram.io/d](https://dbdiagram.io/d).
2. Borrá el ejemplo y pegá el contenido de [`esquema.dbml`](esquema.dbml).
3. Las notas de cada tabla y columna se ven pasando el mouse.

## Tablas

| Grupo | Tabla | Para qué |
| --- | --- | --- |
| Cuentas | `trainer` | Perfil del entrenador, 1 a 1 con `auth.users` |
| Alumnos | `athlete` | Alumnos de cada entrenador (nombre y notas) |
| Alumnos | `body_profile` | Filtros anatómicos guardados con nombre; pueden ser de un alumno o plantillas propias |
| Contenido | `exercise` | Ejercicios definidos como datos (D-10). Los del sistema no tienen dueño; los del entrenador sí |
| Compartir | `shared_scene` | Escena guardada (ejercicio, modelos, instante, cámara, capa) con un código público para el link |

## Qué no va a la base

- Proporciones de Winter, presets y catálogo de músculos: son constantes del código, versionadas con el motor.
- La activación muscular: se calcula en el momento.

## Preguntas para Nico

1. ¿El alumno tiene cuenta propia o solo recibe links? La propuesta asume solo links (`shared_scene` pública por código).
2. ¿Los links vencen? La propuesta deja `expires_at` opcional.
3. ¿Un entrenador puede publicar ejercicios para que los usen otros? La propuesta solo distingue sistema y privados.
4. ¿Hace falta guardar la versión del motor con cada escena compartida, para que un cambio de fórmula no cambie una escena vieja? La propuesta la guarda (`engine_version`).

## Reglas que impondría la base

- Los porcentajes de segmentos y los límites de movilidad respetan los rangos de la SPEC funcional (checks).
- Borrar un alumno borra sus perfiles anatómicos; sus escenas compartidas quedan, con `athlete_id` en nulo.
- El código público de una escena es único, de 8 letras o números.
- Los ejercicios del sistema (`owner_id` nulo) no se pueden editar desde la app.

## Seguridad (RLS)

| Tabla | Lectura | Escritura |
| --- | --- | --- |
| `trainer` | El propio entrenador | El propio entrenador |
| `athlete`, `body_profile` | Solo su entrenador | Solo su entrenador |
| `exercise` | Los del sistema son públicos; los privados, solo su dueño | Solo su dueño (los del sistema, nadie desde la app) |
| `shared_scene` | Pública por código, vía función del servidor, sin listar | Solo su entrenador |
