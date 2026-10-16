# Fast Track login — ficha de la tarea

**Pide**: CS / Business (propuesta del 17/09/2026, JVB) · **Clientes**: Dallas Cowboys, Gil Vicente, Aston Villa, Arsenal
**Objetivo**: subir el registro de usos de ~20% a 30–35% quitando pantallas antes de orinar.
**Prototipo**: microsite de la scrapp → Tareas → Fast Track · código en `scrapp/explorations/fast-track/daniel/`

## Lo que pide la propuesta
- La pantalla de bienvenida se sustituye por la plantilla. Probaron 30; piden probar 20 y flecha si hay más.
- Mantener el logo de Kamleon y una entrada por QR (staff que no está en la plantilla).
- Pantalla "Ready" que confirme a quién se eligió.

## Decidido con Daniel (15/10)
- **Sin PIN**: estos equipos no lo usan. Riesgo aceptado: cualquiera puede registrarse a nombre de otro; "Ready" evita el error, no la suplantación.
- **Sin elegir equipo**: caso de un solo equipo.
- **Páginas con pestañas por rango de dorsales** (calculadas solas; un dorsal repetido nunca se parte entre páginas). Con ≤20 no hay rangos. Motivo: Dallas tiene hasta 90 → 5 páginas; con flecha sola, el 80 necesita 4 toques.
- **RFID: sin indicación en pantalla** (cambio del 15/10). Si el cliente compra las manillas, se le explica en la instalación; si no, cada uno se elige en la pantalla. **Invitado: tampoco se anuncia** (15/10): si alguien orina sin elegir perfil, arranca como invitado. El pie desaparece y ese espacio va a la cuadrícula (fotos 96px con 20, 78px con 30). Pendiente de confirmar con CS.
- **Ready**: foto, "Hi, <apellido>", dorsal, "Not you?" grande; vuelve sola a la plantilla a los 15 s.
- **QR, dos exploraciones**: (1) QR en la esquina, como la propuesta pero más grande · (3) "Staff" como pestaña aparte de los rangos: el QR grande sustituye a la cuadrícula; con ≤20 la barra queda "Players · Staff". La opción 2 (botón que abre otra pantalla) se descartó: la 3 es su versión mejorada.

## Cambios del 15–16/10
- **Sin pie**: ni RFID ni invitado se anuncian (si orinan sin elegir perfil, arranca como invitado). El espacio va a la cuadrícula.
- **Tocar el QR = escanearlo** (en las dos exploraciones). Sin simuladores de RFID ni invitado en esta exploración; queda "Simulate flow detected" en Ready.
- **20 o 30 por página** (selector en el panel de la demo). Con 30: fútbol (28) cabe en una página; NFL (90) pasa a 3 pestañas.
- **Con 30: 6 u 8 columnas** (selector). 8 × 4 es el defecto: Daniel lo ve más equilibrado en la pantalla apaisada. Riesgo: columnas de 140px, los nombres largos se recortan.
- **Equipo pequeño o última página**: columnas equilibradas (16 → 4 × 4) y el alto sobrante se reparte entre filas.
- Fotos: 96px (20) · 78px (30, 6 col) · 84px (30, 8 col).

## Con la medida de la pantalla (16/10: 10,1", 149 ppi)
- Pestañas: **se ven de 56 px pero responden en 80 px (13,6 mm)** — área táctil extendida e invisible (80 px visibles pesaban demasiado). Staff se ve de 64 px, responde en 80.
- Dorsal y apellido con 30 por página 18 → **20 px** (H3 Bold / H3 del DS; 18 no era token).
- Con 30 × 6 columnas, filas de 112 → 108 px para que quepan las 5 filas.
- Jugadores ya estaban bien: el bloque entero mide 20–23 mm; fotos 13–16 mm.

## Exploración 3 · Flechas entre rangos (16/10)
- Sin pestañas: flechas ‹ › a los lados (se ven de 56 px, responden en 80). Solo aparece la que tiene destino.
- El rango como **subtítulo pegado al título**: "Numbers 21–42" (16/10; suelto entre título y cuadrícula quedaba flotando). Sin puntos (quitados el 16/10): el rango y las flechas ya dicen dónde estás; los puntos medían 1,4 mm e invitaban a tocarlos.
- "Staff" como botón suelto arriba a la derecha: abre el QR grande; al tocarlo otra vez vuelve a la plantilla.
- Con 30 × 8, columnas de 132 px (antes 140) para dejar sitio a las flechas.
- Con 30 × 8, la página se llena entera: **32 por página** (8 × 4), y la que queda corta es la última. Solo en esta exploración.
- Contra: para llegar al rango 5 hacen falta 4 toques (con pestañas, 1). Es lo que se compara.

## Exploración 4 · Pestañas + Staff arriba (16/10)
- Como "Staff como pestaña", pero Staff sale de la barra y va como botón suelto arriba a la derecha (igual que en la de flechas). La barra solo lleva los rangos.
- Con ≤20 jugadores no hay barra: queda la cuadrícula sola y Staff arriba.

## Abierto
- Confirmar con CS el comportamiento del invitado.
- Distancia de lectura de la pantalla (no hay dato): fotos de 84px y texto de 20px son un supuesto.
- **Figma** (`Scrapp explorations`, nodo 2024:5): capturado NFL · 30 · 8 col con estilos H1 Bold / H3 Bold / H3 asignados; los dorsales y apellidos (18 px) y los colores siguen sin estilo ni variable.
