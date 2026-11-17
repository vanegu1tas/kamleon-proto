# Scrapp — summary

**Estado de la scrapp** (la pantalla de 1280×800 sobre el urinal). El de la webapp está en
`docs/project-summary.md`. Si algo de la scrapp aparece en los dos, manda este.

Última revisión: 2026-11-17 (Look & feel: A, B, C y E montadas y publicadas; ajustes por dirección).

---

## Lo primero al retomar

**17/11: Look & feel — cuatro direcciones montadas y publicadas** (a274b3b) para que el manager de Daniel las vaya
validando: https://vanegu1tas.github.io/kamleon-proto/scrapp/#/look-and-feel/a (y /b, /c, /e). Ficha con todo lo
decidido y abierto por dirección → `docs/scrapp/look-and-feel.md` (manda sobre este resumen).
- **A · Kamleon evolucionado, B · Instrumento, C · Calma, E · Escenario**, cada una con Home, Elegir jugador, PIN,
  Score y Wizard. La D (movimiento) se deja como capa de animación de la que gane. Recommendation Engine fuera.
- **Microsite**: pestañas de pantalla abajo; botón **"Comparar con hoy"** (la scrapp actual a la izquierda);
  el **engranaje está escondido por defecto: "i" tres veces** para verlo (lo de la izquierda y las pestañas siempre).
- **Hecho hoy**: Score de todas con la curva y el puntero de la actual (animaba el número y saltaba entre zonas);
  "Or just urinate and see your score" en las cuatro Homes. A: tarjetas con relleno, 12 redes, momento de marca
  quitado. B y C: PIN automático. C: halo gris verdoso (y "Fondo y textos" como exploración aparte), Staff con QR
  arriba + buscar por número (botón abajo / buscador), electrolitos y volumen bajo el mensaje, % blanco en el gauge
  fino, puntos que se encienden. E: sin esfera ni nombres de marca, agua (ola / esfera) con ajustes, sin paneles
  grandes (solo el QR de la Home y las piezas), Elegir jugador con Tarjetas flotando / Círculos, Score solo gauge.

**Lo siguiente al retomar** (Daniel ajusta dirección por dirección, pantalla por pantalla, y va cerrando opciones):
1. **C**: falta el Wizard; revisar el "NO. 7" de las tarjetas (pequeño); cerrar opciones (Modo, Buscar por número,
   20/30 por página, Tarjetas, Gauge, Detrás del número, Halo, Fondo y textos).
2. **Animaciones de la C**: Daniel las notó a tirones; se arregló el halo (capa propia) y el glow invisible del
   Score. **Preguntarle si ya van fluidas**; si no, optimizar el Score mientras cuenta.
3. **E**: igualar con B y C si Daniel quiere (PIN automático, electrolitos en vez de media/mejor).
4. **A**: firma Kamleon débil, sigue abierta (descartados momento de marca, textura y puntos en componentes).
5. **Presentación a business**: plan en la ficha (puntos débiles, guion, comparación con hoy). Cuando estén
   ajustadas: congelar una configuración por dirección, vídeos y cuadrícula Hoy | A | B | C | E.
6. Preguntas para business: qué datos de la muestra se enseñan y en qué unidades (48 mmol/L y 320 mL son de ejemplo).
   Para el programador (cuando se sepa la dirección): redes ocultas, fondo animado en la máquina, vidrio en Qt.
7. **El repo es público**: la ficha y comentarios del código nombran marcas de referencia (la web no). Daniel decidió
   subirlo así el 17/11. `scrapp/explorations/look-and-feel/refs/` está en .gitignore (solo local).
8. Sobras en la raíz sin commitear (`.render.mjs`, `frames/`, `render-frames*/`): borrar solo con su ok.

0. **Wizard (set up)** — en pausa desde el 26/10: producción hará hot fixes y Daniel pasa a analytics de la
   webapp (cubre a su compañera de vacaciones). Wizard actual emulado entero en `scrapp/screens/wizard/` (Figma
   *Screen App* + Unit ID desde la foto del brief); pains del brief *Wizard v2* anotados, **nada de mejoras
   implementado**. Ficha y dudas abiertas → `docs/scrapp/wizard.md`. Publicado (fdad2ce).
1. **Fast Track**: exploraciones vivas → **07 "Avatars círculo (feedback Jordi)"** (`release/`) y
   **08 "Avatars cards"** (`ficha/`). Todo lo del 22–25/10 (logos, Celda con parche en la 07, Placa
   en la 08, fotos del Villarreal en Neutro, mandala del Tracking) → `docs/scrapp/fast-track.md`.
2. **Publicado** (26/10, 3843de4): logos 07/08, Placa, Celda/Parche de la 07, nombres en el hub, dorsal
   blanco por defecto en la 08 y las 31 fotos del Villarreal. Hacer push solo cuando Daniel lo pida.
3. Pendientes sueltos (sin pedir aún): ver en pantalla la Placa sobre fotos de fondo blanco; volver
   `TRACKING_DURATION` de la 08 a 3000; logo de Aston Villa en la 08; el anillo de Ready sigue
   turquesa; elegir esquina del parche en la 07.
4. Antiguo y sin revisar: el **panel de control de Score** queda medio tapado por el marco del
   dispositivo (se arregla con una línea, pendiente de su ok).

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
- **Tareas**: *Fast Track* (en curso) · *Wizard* (set up / instalación; en curso desde 26/10, ficha
  `docs/scrapp/wizard.md`) · *Recommendation Engine* (futuro, página aparte) ·
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
