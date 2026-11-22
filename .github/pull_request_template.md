## Feature

<!-- ID y título de docs/feature_list.json, por ejemplo: B-05 · Solver de sentadilla -->

Rama: `feature/<id>-<slug>`

## Criterios de aceptación

<!-- Copiá los criterios de la feature. Cada uno con su test feliz, su test triste y su captura. -->

| Criterio | Test feliz | Test triste | Evidencia |
| --- | --- | --- | --- |
| `<id>.1` … | `[<id>.1][feliz] …` | `[<id>.1][triste] …` | `screenshots/<id>/<id>.1-….png` |

## Evidencia

<!-- Capturas en screenshots/<id>/, una por criterio como mínimo; computadora (1400×1000) y teléfono (390×844) si hay UI. URL determinista usada (?ex=&t=&cam=&layer=&a=&b=&lng=&anim=0). -->

## Checklist

- [ ] La feature no tiene nada en `bloqueado_por` y sus decisiones están tomadas en `docs/decisiones.md`
- [ ] Cada criterio tiene test `[feliz]` y `[triste]`, y los tests de trazabilidad pasan
- [ ] `src/biomechanics` no importa nada de la escena ni de la UI
- [ ] Sin comentarios en el código; constantes en carpetas `constants/`
- [ ] Textos en `src/locales/es.json` y `en.json` con las mismas claves
- [ ] Funciona en teléfono y en computadora
- [ ] `docs/feature_list.json`: estado `en_review` y número de PR cargado
