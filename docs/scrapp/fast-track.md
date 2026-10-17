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

## Regla de los rangos (confirmada por Daniel, 16/10)
- **No son rangos fijos** (0–19, 20–39…): los jugadores se ordenan por dorsal y se reparten de N en N (20, 30 o 32). La etiqueta es el primer y el último dorsal de la página. Así los saltos en la numeración nunca dejan páginas medio vacías.
- Consecuencias aceptadas: los rangos no son redondos (21–42), cambian si cambia la plantilla, y el último puede ser muy ancho (64–99).
- **La última página puede quedar casi vacía** (82 → 20-20-20-20-2): decidido dejarlo así (Daniel, 16/10), no se reparte por igual.
- **Dorsales repetidos: no aplica** (Daniel, 16/10): la webapp no los permite. La plantilla de prueba NFL ya no los tiene; el código igual nunca parte un dorsal entre páginas.
- **Jugadores sin dorsal: no aplica** (Daniel, 16/10): el dorsal es obligatorio y se configura antes de usar Fast Track. Dato para la webapp: en orgs con Fast Track, el dorsal debe ser requerido al dar de alta un jugador.

## Versión pulida (16/10) — `explorations/fast-track/daniel/pulida/`
Parte de la exploración 4 (pestañas + Staff arriba). Las otras tres se quedan como estaban, de referencia.

**Tema del equipo** (`pulida/theme.js`): el equipo solo da su color principal.
- Fondo = color del equipo × 0,32 (el resto negro) → siempre oscuro. Contraste del blanco: 13–19:1; del turquesa: 7–10:1 (Dallas, Arsenal, Aston Villa, Gil Vicente).
- Superficies, bordes y textos secundarios en blanco translúcido; anillo fino en las fotos.
- Fondo vivo con shader ligero (3 capas de ruido, media resolución, lento); sin WebGL o con reducir movimiento, color plano (= la reserva si Qt no da).
- El Score **no** lleva el color del equipo.
- Acento sin decidir: turquesa (Kamleon) o blanco; selector en el panel. Con blanco, el dorsal deja de destacar sobre el apellido.

**Transiciones** (solo posición, escala y opacidad; ≤ 400 ms; desaceleración sin rebote; con reducir movimiento, solo fundidos):
- T1 entrar a la plantilla: cascada de caras · T2 cambiar de rango: el resaltado se desliza y la cuadrícula entra por el lado del cambio · T3 tocar una cara: la foto vuela al centro y crece, el resto se apaga, después los textos · T4 "Not you?"/timeout: la foto vuelve a su sitio · T5 Staff: el QR entra creciendo · T6 Ready → análisis: el flujo entra fundiéndose y el fondo del equipo se apaga · al tocar: se hunde a 0,96.
- Pendiente de Qt (programador): Qt Quick o Widgets, versión, hardware. Si no da, se recorta (primero el shader).

**Logo fijo** (16/10): hay un solo logo, en el escenario (`pulida/FlowRunner.jsx`), compartido por plantilla y Ready. Antes cada pantalla tenía el suyo y brincaba en T3/T4, porque la cabecera se encoge al apagarse. Lo que deba quedarse quieto entre pantallas va fuera de ellas.

## Critique de impeccable (16/10) — respuestas de Daniel
Informe guardado en `.impeccable/critique/2026-10-16T12-28-18Z__scrapp-explorations-fast-track-daniel-pulida.md` (26/36). P1: acento mal repartido y dorsal sin peso · tema ×0,32 falla con colores muy oscuros o claros · Staff/QR sin vuelta sola ni estado de espera.
- **Por qué rangos y no "equipos de 30"**: hoy un equipo NFL de 90 está partido en 3 equipos de 30 en la scrapp y a los jugadores les molesta porque no recuerdan en cuál están. Quieren encontrarse rápido sin cambiar de pantalla ni de equipo; las pestañas por rango de dorsal resuelven eso (su número sí lo saben).
- **La cara importa** (vanidad de los jugadores): no se sacrifica por el dorsal. Falta explorar la celda: dorsal sobre la foto u otro diseño.
- **Celda, dos variantes para comparar** (selector "Celda" en el panel de la pulida, o `?cell=parche|camiseta`): **A · Parche** (dorsal en un parche con el acento, abajo a la derecha de la foto; 40 px, 36 con 30 por página) y **B · Camiseta** (dorsal grande y translúcido a la izquierda, por detrás de la foto). En B el dorsal no va centrado detrás: así la foto tapaba la segunda cifra (27 se leía "2") y entera las de una. En las dos, debajo solo va el apellido, con todo el ancho de la celda.
- **El fondo del equipo era una primera prueba conceptual**, no una decisión. Daniel está de acuerdo con probar fondo neutro oscuro con el color del equipo en un solo sitio fuerte.

## Staff → "‹ Players" (17/10, pulida y Dorsal grande)
Resuelve lo que señaló la critique (pestañas sin pastilla que parecían desactivadas, salida poco descubrible, Staff que se quedaba abierto para el siguiente).
- Al entrar en Staff, las pestañas se apagan (siguen ocupando su sitio para que el QR no salte) y el botón pasa a **"‹ Players"**, en el mismo sitio: se sale tocando donde se entró.
- Vuelve al rango en el que estaba, no al primero.
- **Vuelta automática a los 20 s** si nadie escanea.
- Pendiente: estado "Check your phone…" tras escanear y QR caducado (depende de cómo inicia sesión el staff en el móvil).

## Exploración 5 · Dorsal grande (17/10) — `explorations/fast-track/daniel/dorsal/`
Copia de la pulida (mismo tema, Staff, Ready y transiciones) con la celda que Daniel exploró en Figma (`Scrapp explorations` 2029:2815). Va aparte, y no como opción del selector Celda de la pulida, porque está pensada para **20 por página en 7 columnas** (7 × 3): no tiene selector de página ni de columnas.
- Apellido en arco arriba (elipse de 138 × 26, como la espalda de la camiseta). Tamaño por medición (17/10), no por letras: 20 px si cabe en el arco (144 px, se usan 140), si no 16, y si ni a 16 cabe se juntan las letras (solo tokens). Lewandowski, Smith-Njigba, Ward-Prowse → 20 · Hernández-Ruiz, Alexander-Arnold → 16 · Oxlade-Chamberlain → 16 juntado. Plantilla de prueba "Apellidos largos" en el panel.
- Foto que no carga (URL rota, sin red) → iniciales, en plantilla y Ready (pulida y Dorsal grande).
- Dorsal de 108 px con degradado blanco → gris y opacidad 0,7 (108 no es token: la escala salta de 80 a 120).
- Foto de 40 px (~7 mm) en la esquina inferior derecha del dorsal. Choca con lo de la vanidad: probar más grande.
- **Logo del equipo** (17/10, solo en esta exploración): el club da su SVG en blanco con fondo transparente (`dorsal/logos/`, campo `logo` en `theme.js`). Del SVG solo cuenta la forma (máscara); el tratamiento es igual para todos: blanco con degradado en diagonal (blanco → 10 %), conjunto al 10 %, caja de 352 px abajo a la derecha sangrando 76 px a la derecha y 30 abajo, el logo cabe sin deformarse y se apoya abajo. Va en la capa del fondo: quieto entre plantilla y Ready, fuera en el Score. Sin logo no se pinta nada. Hecho: Dallas. Falta: Arsenal (SVG pendiente de Daniel).
- Ajustada a Figma medida a medida (17/10): bloque del apellido de 25 px con las letras centradas sobre la curva, degradado sobre una caja de 128 px, dorsal 9 px por encima de su bloque, espaciado −4 %, columnas a 22 px y cuadrícula desde y=262. Pestañas 12 px más abajo, como en Figma (centro en y=140). Los rangos se quedan los reales (con 20 por página salen 5); los de Figma eran de 30 por página y no se copian (Daniel, 17/10).

## Ready — pendiente de explorar (17/10)
Aún no se ha trabajado. Plan de Daniel: explorar primero (Figma) y luego implementar. Lo que tiene que resolver, sacado de la critique:
- "Not you?" mide 64 px: es el único control y la única corrección de error; mínimo 76–80.
- "Start to pee whenever you're ready" es coloquial: hace falta variante neutra (el tono depende del cliente).
- La cuenta atrás cambia cada segundo y mete prisa: ¿texto fijo, anillo fino?
- Saludo: apellido para jugadores pero nombre completo para staff ("Hi, Alex Rivera").
- Con la celda de Dorsal grande, la foto que vuela a Ready sale de 40 px: ver si el vuelo sigue funcionando a esa escala.

## Reglas para el programador (se juntan aquí para el handoff)
Daniel pidió (17/10) que al dejarle la documentación al programador vayan todas estas reglas. Ir añadiendo cada regla nueva.
- **Rangos**: jugadores ordenados por dorsal, de N en N; la etiqueta es el primer y el último dorsal de la página; un dorsal nunca se parte entre páginas; la última página queda como caiga. Con ≤20 no hay pestañas.
- **Dorsal obligatorio** en orgs con Fast Track (webapp); no se repiten.
- **Apellido en arco**: 20 px si cabe (arco de 144 px, se usan 140); si no 16; si ni a 16, juntar letras hasta que quepa. Medir, no contar letras.
- **Foto**: si no hay o la URL falla → iniciales (plantilla y Ready).
- **Grilla fija**: 7 columnas, siempre en la misma posición; se llena de izquierda a derecha.
- **Zonas táctiles**: pestañas y Staff se ven de 56/48 px pero responden en 80 px.
- **Staff**: al entrar, pestañas apagadas y botón "‹ Players" en el mismo sitio; vuelve al rango anterior; vuelta sola a los 20 s.
- **Ready**: vuelve sola a la plantilla a los 15 s (Ready aún por explorar).
- **Pestaña activa**: el texto se oscurece con 0,13 s de retraso (0,12 s) para llegar a la vez que la pastilla (0,25 s).
- **Tema del equipo**: el equipo solo da su color principal (regla ×0,32 aparcada: falla con colores muy oscuros o claros).
- **Logo del equipo**: SVG en blanco con fondo transparente; solo la forma (máscara), blanco con degradado diagonal, 10 %, caja de 352 px abajo a la derecha sangrando 76/30 px; sin logo, nada.

## Abierto
- Confirmar con CS el comportamiento del invitado.
- **Acento**: turquesa o blanco (si es blanco, bajar el apellido para que el dorsal destaque).
- ¿El vuelo de la foto (T3) debería sentirse más uniforme? Pendiente de que Daniel lo pruebe.
- Unicidad del dorsal: ¿por equipo o por organización? (programador; anotarlo en `data-model.md`).
- Probar la pulida con los comandos nuevos de impeccable (Daniel lo actualizó el 16/10; hace falta reiniciar Claude Code para tenerlos).
- **Figma** (`Scrapp explorations` → página "-- Fast track"): la sección **"Pulida 16/10 · celdas (editable)"** (nodo 2029:1300, capturada el 16/10) tiene NFL · 30 · 8 col en Actual, A · Parche y B · Camiseta, con capas editables y Circular Pro. Todavía sin estilos de texto ni variables del DS (falta la pasada por tabla). Los frames antiguos (2024:5, 2025:1145, 2023:217) son de antes de las pestañas de 56 px, el Staff arriba y el tema.
