# Scrapp — summary

**Estado de la scrapp** (la pantalla de 1280×800 sobre el urinal). El de la webapp está en
`docs/project-summary.md`. Si algo de la scrapp aparece en los dos, manda este.

Última revisión: 2026-10-16.

---

## Lo primero al retomar

1. **Fast Track**: seguir iterando en las dos exploraciones (QR en la esquina / Staff como pestaña).
   Decisiones, motivos y pendientes → `docs/scrapp/fast-track.md`.
2. **Nada está publicado.** Hay ~100 commits sin push (microsite, journey map, Fast Track, y también
   el QA de la webapp). Al hacer push se publica todo en GitHub Pages: antes, que Daniel lo revise
   con `npm run scrapp`.
3. Pendiente de su ok: el **panel de control de Score** queda medio tapado por el marco del
   dispositivo (ya pasaba antes del microsite). Se arregla con una línea.

---

## Microsite (15/10)

`npm run scrapp` ya no abre un flujo: abre un índice con el mismo estilo que la landing del
proyecto (`landing.html`: fondo con shader, logo, lista numerada).

```
Índice (#/)                 01 Producción · 02 Tareas · 03 Journey map
Sección (#/production, #/tasks)   cards con estado (eyebrow) · "‹ Scrapp" fijo arriba
Visor (#/<entrada>/<item>)  la pantalla en el marco del dispositivo
                            "‹ Tareas" redondo arriba · menú ☰ debajo · flechas ‹ n/m › abajo
Journey map (#/journey/<id>)
```

- **Producción**: *Flujo actual* (referencia, no se toca) · *Scrapp nueva* (= actual + lo aprobado;
  hoy igual al actual).
- **Tareas**: *Fast Track* (en curso) · *Recommendation Engine* (futuro, página aparte) ·
  *Audit UX del flujo (julio)* (copia del flujo con los cambios del audit, solo cambia la Home) ·
  *Score* (exploraciones 1, 2, 4, 5).
- **Registrar algo nuevo**: un item en `scrapp/hub/entries.jsx` (con `author`); un journey en
  `scrapp/hub/journeys.js`. Al principio de cada archivo está explicado cada campo.
- **Recommendation Engine** sigue siendo `recommendation.html` (el link que tiene business). El
  botón "‹ Tareas" solo aparece si se llega desde el microsite (`?from=tasks`).
- **Journey map**: plantilla tipo dna-microsite.vercel.app. Columnas por etapa; filas *Qué pasa*,
  *Cómo se siente* (línea) y *Evidencia* (plegada). Cada journey declara su `source`
  (example / hypothesis / research) y sale como aviso: **las emociones sin investigación no se
  presentan como dato**. Hoy solo hay un ejemplo; los reales los pone Daniel.

Estilo: cards y textos a la escala de la landing (títulos de 15px, descripciones de 12px). El
estado va como eyebrow de color: En curso y Referencia en turquesa, Exploración en amarillo,
Futuro en gris.

## Cómo se trabaja

- **Exploraciones por persona**: `scrapp/explorations/<tarea>/<persona>/`. Cada una arranca como
  copia de lo que haya en Producción y no toca el original.
- Lo compartido entre exploraciones (`components/`, `data/mockFlowData.js`, `Exploration5`): si una
  iteración necesita cambiarlo, se copia a la carpeta de la exploración, no se edita.
- **Ficha por tarea** en `docs/scrapp/<tarea>.md`: quién la pide, qué decidimos y por qué, qué
  queda abierto.
- La scrapp solo depende del design system por 4 CSS de tokens y el logo; nada de `prototypes/`.
  Así se puede sacar de aquí sin arrastrar la webapp.

## Compañera de Daniel

Explorará más adelante, empezando por Recommendation Engine. **No debe ver la webapp** (no está al
día). Cuando entre:
- la scrapp **se muda** a un repo propio; no se mantienen dos a la vez;
- cada uno en su carpeta dentro de la tarea, branches cortas;
- un `CLAUDE.md` con las reglas de la scrapp, porque su Claude no ve la memoria de Daniel.

Hasta entonces, todo en este repo y en el mismo sitio publicado.

## Restricciones que no tenemos

Distancia de lectura, tiempo frente a la pantalla, luz, quién la usa. Los tamaños de Fast Track
son un supuesto.

**Tamaño físico de la pantalla: pendiente (16/10, se lo van a pasar a Daniel).** Hace falta el
ancho de la zona iluminada en cm → `ppi = 1280 ÷ (cm ÷ 2,54)` · `mm = px ÷ ppi × 25,4`. Objetivo
para pantalla pública: ~15 mm por zona táctil. Hoy: pestañas 52 px, Staff 60 px, fotos 84–96 px
(≈ 9 / 10 / 14–16 mm si fuera de 10,1"). Si no llega el dato: pestañas y Staff a 72 px.
