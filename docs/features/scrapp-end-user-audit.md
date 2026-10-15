# Audit UX — Flujo End User (Scrapp)

**Alcance:** flujo end user reconstruido en `scrapp/flow/` (Home → Login/QR/RFID/Guest → Start → Tracking → Score → Flush → Home), fiel a las capturas de producción, sin mejoras aplicadas aún.
**Objetivo:** este documento junta el audit manual + el resultado de `/critique`, para decidir juntos qué se implementa y cuándo. Se puede volver a consultar en cualquier momento — no implica que algo ya esté decidido o hecho.

---

## Backlog consolidado

| # | Hallazgo | Fuente | Comando sugerido | Estado |
|---|----------|--------|-------------------|--------|
| 1 | Score screen usa la plantilla genérica de "hero metric" (número grande + gradiente + label chico) para el momento más importante del flujo | critique | `/delight` | Pendiente |
| 2 | El color no comunica nada, solo decora — mismo teal repetido en CTA, loader, círculos de equipo, sin diferenciar significado | critique | `/colorize` | En progreso — botón Log in pasó de outline a fill sólido en `flow-v2` (ver abajo) |
| 3 | Dos motivos de loading sin sistema (mandala en Start/Tracking vs. anillo simple en Flush), sin justificación aparente | critique + audit propio | `/normalize` | Pendiente |
| 4 | QR/RFID no dan ningún reconocimiento personal (sin "Welcome back") a diferencia del login — se siente anónimo justo cuando debería sentirse más mágico | critique + audit propio | `/delight` | Pendiente |
| 5 | Grids de Choose Team / Choose Avatar son pura repetición sin jerarquía — círculos idénticos, cero diferenciación visual más allá del texto | critique | `/bolder` | Pendiente |
| 6 | Sin timeout de inactividad en pantallas intermedias (Team/Avatar/Pin) — si alguien abandona a mitad de flujo, el kiosko queda bloqueado para el siguiente usuario | audit propio | — | Pendiente |
| 7 | Sin estado de error en el PIN (PIN incorrecto siempre avanza) | audit propio | — | Pendiente |
| 8 | `‹` volver y `×` cancelar tienen el mismo peso visual sin comunicar que hacen cosas muy distintas (un paso atrás vs. perder todo el contexto) | audit propio + critique (observación menor) | — | Pendiente |
| 9 | Guest ("Urinate to start") no aclara que esa sesión no queda asociada a ningún perfil/histórico | audit propio | — | Pendiente |
| 10 | Sin manejo de "muestra insuficiente" si el sensor detecta flujo pero no llega a analizar | audit propio | — | Pendiente |
| 11 | Bajo contraste en "Choose your team" (`#9a9a9a` sobre `#141414`) — poco legible a distancia con luz de baño típica | audit propio | — | Pendiente |
| 12 | Textos secundarios (guest, hint RFID) en 20px, muy chico para un dispositivo que se mira de pie a distancia | audit propio | — | Pendiente |
| 13 | Nombres largos de equipo/usuario sin manejo de truncado | audit propio | — | Pendiente |
| 14 | Botones `‹`/`×` de 48px, al límite del mínimo táctil recomendado | audit propio | — | Pendiente |
| 15 | Countdown del Score (15s fijos) es puramente pasivo — no se puede saltar ni extender | audit propio | — | Pendiente |
| 16 | Paginación de avatares (chevrons + dots) es decorativa, no funcional todavía | audit propio | — | Pendiente |
| 17 | Score number usa gradiente de texto puramente decorativo — anti-patrón "gradient text for impact on metrics" | critique (observación menor) | — | Pendiente |
| 18 | Salto tipográfico grande entre título (64px) y subtítulo (32px) en Home sin nivel intermedio | critique (observación menor) | — | Pendiente |
| 19 | Sin selector de idioma visible en el dispositivo físico (todo el flujo está en inglés) | audit propio | — | Pendiente |

---

## Veredicto de `/critique`: anti-patrones

No pasa limpio — no fue generado por IA (es diseño real de producción), pero cae en varios de los patrones que delatan diseño genérico:
- Teal-on-black en las 8 pantallas — el "AI color palette" clásico (acentos cian/neón sobre negro puro, sin matiz de marca en los neutros).
- Negro puro (`#000000`) sin tintar en todas las pantallas.
- Score screen = "hero metric layout" de manual.
- Grids de Team/Avatar = "identical card grids" (círculos idénticos repetidos).

## Lo que sí funciona (según `/critique`)
- Tipografía Circular Pro — distintiva, no cae en Inter/Roboto genéricos.
- Tamaños táctiles de las acciones principales (círculos 96px, teclas de PIN 90px).
- Coreografía del reveal del score (glow, texto escalonado) — motion con craft real.

## Preguntas abiertas para pensar (de `/critique`)
- Si alguien viera solo una pantalla de este flujo sin el logo, ¿sabría que es una marca de hidratación/salud, o podría ser cualquier fintech?
- ¿El reveal del score necesita verse como un KPI de dashboard, o podría verse como algo que solo Kamleon haría?
- ¿Cuál es el mínimo "momento personal" para QR/RFID que lo haría sentir tan cálido como el saludo del login?
- Si el teal desapareciera de todo lo que no es la marca en sí (logo, arco de score), ¿qué tomaría su lugar para comunicar acción vs. espera vs. estado?

---

## Comparación en curso: v1 vs v2

Para no perder el original como referencia, las mejoras se están probando en una **copia paralela**, no sobre el flujo original:
- `scrapp/screens/flow/` + `scrapp/flow/FlowRunner.jsx` — original, tal cual las capturas de producción (hallazgo #2 = pendiente aquí).
- `scrapp/screens/flow-v2/` + `scrapp/flow/FlowRunnerV2.jsx` — copia donde se van aplicando los cambios en discusión.

En el microsite de la scrapp: "Flujo actual" (original) y "Audit UX del flujo (julio)" (copia), para comparar en vivo.

**Cambio aplicado en v2 hasta ahora:** botón "Log in" de Home pasó de outline teal a fill sólido teal con texto oscuro — concentra el color de marca en la acción principal en vez de repetirlo como línea decorativa (relacionado a hallazgo #2).

## Cómo usar este documento
La columna **Estado** se actualiza a medida que se decide qué hacer con cada hallazgo (Pendiente → Descartado / Priorizado / Hecho). Los comandos de la columna "Comando sugerido" son los que propuso `/critique` — quedan documentados para aplicarlos más adelante, no implican que ya se haya decidido usarlos.
