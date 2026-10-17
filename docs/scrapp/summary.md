# Scrapp — summary

**Estado de la scrapp** (la pantalla de 1280×800 sobre el urinal). El de la webapp está en
`docs/project-summary.md`. Si algo de la scrapp aparece en los dos, manda este.

Última revisión: 2026-10-16 (cierre del día).

---

## Lo primero al retomar

1. **Fast Track**: hay 6 exploraciones. La de referencia es **"Pulida: equipo + transiciones"**
   (16/10, con selector de Celda: Actual · A Parche · B Camiseta); la nueva es **"Dorsal grande
   (7 columnas)"** (17/10, la celda que Daniel exploró en Figma). Decisiones, motivos y pendientes →
   `docs/scrapp/fast-track.md`. Preguntas al programador sobre Qt (Quick o Widgets, versión, hardware).
   Hecho en la pulida: tema por equipo (fondo = color × 0,32 con shader ligero), transiciones T1–T6 y
   un solo logo fijo (ya no brinca). Sin decidir: acento turquesa o blanco.
   **impeccable** se actualizó el 16/10: tras reiniciar Claude Code, revisar la pulida con sus comandos
   nuevos (comprobar antes cuáles existen, no suponerlos).
2. **Nada está publicado.** Hay 114 commits sin push (al 16/10) (microsite, journey map, Fast Track, y también
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

**Controles del microsite (17/10)** — andamiaje, no producto. Estética neo-skeuomórfica con
referencias de Teenage Engineering; mecánicas de DialKit. Más adelante saldrá un proyecto aparte
con nuestro propio sistema de "dialkits".
- `components/KeyButton`: tecla tipo OP-1 (base + círculo en relieve + icono). Valores del frame de
  Daniel *Tecla menú / apagada* (Figma `Ae9SVr0hiDSbQSSqAU5AsT` 2040:8); el trazo de luz de 0,2 px
  al 30 % va como 1 px al 7 %. Opciones: `wide` (rectangular, píldora; la luz sigue solo el borde
  de arriba), `momentary` (se hunde entera y vuelve; lo elegido lo dice el LED), `flat` (lisa),
  `ledColor`. Iconos como tinta: degradado de luz de arriba + sombra de 1 px.
- `components/Morph`: la tecla se convierte en panel (misma superficie, esquinas de 7 px siempre).
  La usan el ☰ (izquierda, `ItemMenu`: lista de exploraciones con LED como radio button) y el
  engranaje (derecha, `TweakPanel`; cambia a X con fundido y desenfoque). Probado y descartado:
  hundir la tecla entera al presionar el ☰/engranaje, y una pantallita LCD con el nombre.
- `components/TweakPanel`: grupos por configuración. `control: 'keycaps'` con `columns` (2 =
  rectangulares sueltas; 3+ = cuadradas en un mismo hueco oscuro), `wide`, `labelInCap`, `flat`,
  `keyHeight`, `led`. Ancho 256–280 px (puede pisar un poco la pantalla del dispositivo). Hoy solo
  en *Dorsal grande*: Equipo (Neutro arriba, 2 y 2, lisas de 36 px, LED del color del equipo),
  Acento (punto turquesa / blanco), Plantilla (16 · 28 · 90 = Small · Medium · Big + Apellidos).
- Pendiente: LED de Dallas y Aston Villa casi no se ve (aclarar solo el LED); flechas ‹ n/m › de
  abajo con las teclas nuevas; título del panel (blanco) vs. del ☰ (gris en mayúsculas).

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

## Contexto de uso (lo que sabemos nosotros)

Contexto para cualquier revisión de diseño (impeccable incluido): **no hay `PRODUCT.md` ni
`DESIGN.md` a propósito** (16/10): el contexto vive aquí y en las fichas, sin duplicarlo.

- **Qué es**: una pantalla táctil sobre el urinal que analiza la orina y le enseña a la persona su
  resultado (score, hidratación). Kamleon es una marca de hidratación y salud.
- **Clientes**: equipos profesionales (Dallas Cowboys, Gil Vicente, Aston Villa, Arsenal). Un
  equipo por instalación en el caso de Fast Track.
- **Quién la usa**: jugadores de la plantilla (eligen su perfil o entran por RFID si el club compra
  las manillas), staff que no está en la plantilla (entra por QR) e invitados (si orinan sin elegir
  perfil, cuenta como invitado).
- **Dónde** (Daniel, 16/10): en el vestuario del equipo, en centros de entrenamiento o en estadios.
- **En qué momento**: de pie, frente al urinal, antes de orinar. Cada pantalla antes de orinar es
  fricción: hoy solo se registra ~20 % de los usos y el objetivo de Fast Track es llegar al 30–35 %.
- **Tiempo frente a la pantalla** (Daniel, 16/10): lo único que no controlamos es lo que dura
  orinando; todos los demás tiempos (Ready, score, vuelta a la plantilla) los marcamos nosotros.
- **Distancia de lectura** (Daniel, 16/10): **20–30 cm**. Muy cerca: a esa distancia los tamaños
  de Fast Track (texto de 20 px ≈ 3,4 mm, fotos de 84 px ≈ 14 mm) van holgados; lo que manda es el
  dedo (zonas táctiles de ~80 px), no la lectura.
- **Lo que el equipo no quiere**: PIN (no lo usan). Se acepta que alguien se registre a nombre de
  otro; "Ready" evita el error, no la suplantación.
- **Idioma**: todo en inglés, sin selector.
- **Tono** (Daniel, 16/10): deportivo por defecto, pero depende de cómo se haya cerrado el negocio
  con cada cliente; puede tener que ser neutro. El diseño tiene que aguantar los dos.
- **Identidad visual**: Circular Pro, fondo oscuro, teal como acento. El audit de julio
  (`docs/features/scrapp-end-user-audit.md`) señaló que el teal sobre negro se lee genérico y que el
  color decora más de lo que comunica; en Fast Track el fondo ya toma el color del equipo.

**Sin dato**: la luz del vestuario y si suele haber cola.

**Pantalla real (confirmado 16/10): 10,1", zona activa 218 × 136,5 mm, 1280 × 800 → 149 ppi,
1 px = 0,17 mm.** `mm = px × 0,17`. Objetivo para zona táctil en pantalla pública: ~15 mm (~88 px);
mínimo aceptable ~13 mm (~76 px). Texto de 20 px ≈ 3,4 mm de cuerpo.
