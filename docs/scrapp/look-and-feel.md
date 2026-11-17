# Look & feel de la scrapp

Desde el 12/11/2026. Lo pide business: el Recommendation Engine tiene que ser **neutro**, y eso obliga a pensar el
look and feel nuevo de la scrapp. Ver todo el sistema de diseño sin ver todos los flujos es difícil, así que se
exploran 2–3 looks sobre unas pantallas clave, el equipo elige dirección y la elegida pasa a los flujos completos.
Sin fecha de business.

Card en el microsite: Tareas → **Look & feel**. Código: `scrapp/explorations/look-and-feel/<persona>/`.
Referencias: `scrapp/explorations/look-and-feel/refs/` (cómo pasarlas, en su README).

## Decidido

- **Neutra** (Daniel, 12/11): sirve para cualquier cliente y se sigue sintiendo Kamleon. **Prioridad: una sola paleta
  que valga para muchos clientes sin tocarla; el cliente solo pone su logo.** Lo custom (color del cliente) se verá
  después.
- El color lo llevan los estados de hidratación; el resto de la paleta, en segundo plano, para no competir con el
  score ni con ningún club.
- **Tokens propios**: las exploraciones pueden separarse de los tokens de la webapp. En el rediseño los componentes
  (botones, teclado…) pueden cambiar de estilo.
- **Escudo del club en blanco** (Daniel, 17/11): no se pondrán a color; la prueba de neutralidad se hace con el
  escudo blanco.
- **Revisión por exploración** (Daniel, 17/11): tamaños como "Tap your card below" se ajustan dentro de cada
  dirección, no en común. Las preguntas al programador (redes ocultas, fondo animado, blur) se hacen cuando se sepa
  qué dirección gusta más.
- **Animación del Score como la actual** (Daniel, 17/11), en todas las direcciones: el puntero y el número
  cuentan con la curva de la scrapp de hoy (seno, 2,2 s) en vez de la cúbica de 1,4 s, que arrancaba de golpe y se
  arrastraba al final.
- **Entrar sin cuenta** (Daniel, 17/11): "Or just urinate and see your score" en vez de "Or just go, no account
  needed" ("go" no dice que basta con orinar). Registro clínico, no "pee": business quiere que se vea serio.
- **Volver** (Daniel, 17/11): Elegir jugador lleva un botón redondo de volver a la izquierda del escudo, en todas las
  direcciones (p. ej. antes hay una pantalla de equipos y se entró en el que no era). Con 30 por página, el título se
  corre a la derecha para dejarle sitio.
- **Pantallas de la ronda (5)**: Home / reposo · Elegir jugador (Fast Track, exploración 07) · PIN · Score ·
  Wizard (un paso con formulario y teclado; el teclado actual es feo y el cambio ayuda a mejorarlo).
  **Recommendation fuera** (Daniel, 17/11): con la dirección elegida se trabajará específicamente en el RE.
- **Fuera de la primera ronda**: Tracking (casi todo animación; va solo en la dirección elegida), aviso/error y
  entrada de staff por QR.
- **Dirección A · Kamleon evolucionado, opción A1** (Daniel, 12/11): interfaz monocroma (negro, grises, blanco) y el
  **turquesa solo para Hydrated**. Motivo: hoy `turquoise-51` (#2FD5CB) es a la vez el acento de la scrapp (botones,
  selección, anillo de Ready) y el color de Hydrated del gauge; en una paleta neutra "botón de Kamleon" y "estás bien"
  no pueden pintarse igual. Lo Kamleon lo ponen Circular, las formas, el movimiento y el logo. Se descartaron A2
  (turquesa de acento y Hydrated en otro color: arrastra webapp, analytics y Figma) y A3 (como hoy).
- **Muy Kamleon, que no digan "eso es Oura"** (Daniel, 16/11): de las referencias se toma el principio, nunca su
  firma (Oura: serif + fotos de paisaje + botón crema; Whoop: tres anillos + morado + negritas; Nothing: fuente de
  puntos). Prueba: tapar el logo y enseñarlo; si alguien nombra otra marca, no vale.
- **Direcciones de partida (Daniel, 16/11)**, cada una con su propio juego de estilos (misma ficha para todas: fondo,
  superficies, color, tipografía, forma, botones, teclado, datos, movimiento y firma Kamleon):
  - **A · Kamleon evolucionado**: Analogue (monocromo, negro, Circular con interletrado cerrado, píldora blanca).
  - **B · Instrumento**: Whoop (oscuro tintado, números en negrita, mayúsculas con interletrado, datos que se llenan).
  - **C · Calma**: Oura (atmósfera, vidrio mate, número fino, mucho aire).
  - **D · Wealthsimple** (nombre por poner): Daniel la ve distinta de Analogue → exploración propia.
  - **E · Escenario**: Peloton (contenido a pantalla completa y la interfaz en paneles negros translúcidos, sin blur,
    encima). Detrás va **una animación de Kamleon** (agua / ondas / mandala de puntos), no material del cliente.
  - **Más adelante**: con lo que vayamos viendo, puede salir una opción "random", muy diferente, que mezcle cosas que
    nos gustan de las demás.
  - **Para todas**: Peloton (soluciones funcionales: PIN, chips en vez de teclado, número + AVG/BEST, elegir perfil).
- **Direcciones B y C**: se definen con las referencias de Daniel. **No hay límite de tres** (Daniel, 16/11): la idea es explorar; si unas referencias dan para otra dirección, se abre otra.

## Ficha A · Kamleon evolucionado (17/11, montada)
- **Tarjetas con relleno** (Daniel, 17/11): ya no es opción (Elegir jugador y Wizard).
- **Wizard con 12 redes** (Daniel, 17/11): ya no es opción; con 12 ya se ve el scroll.

Microsite: Tareas → Look & feel → **A · Kamleon evolucionado** (`explorations/look-and-feel/daniel/a/`). Pestañas de
pantallas debajo del dispositivo; el engranaje enseña solo las opciones de la pantalla abierta y, al final y plegadas,
las comunes (Fondo, Intensidad, Club).

- **Frase**: "La interfaz se calla; solo habla el resultado."
- **Fondo**: grises de analogue.co, sin negro puro (Daniel). Fondo #121212. *Abierto*: liso / luz desde arriba /
  foco central, con intensidad suave (#1D1D1D) o marcada (#2E2E2E). El halo detrás del contenido se reserva para la C.
- **Escala**: #121212 fondo · #1D1D1D superficie · #282828 activa · #2E2E2E borde · #606060 terciario · #9E9E9E
  secundario · #FFFFFF texto y botón · #2FD5CB solo Hydrated.
- **Tipografía**: Circular Pro 400/500, interletrado −3 % en titulares y −5 % en el número del score.
- **Botones**: principal en píldora blanca (una por pantalla); secundario solo texto subrayado. Chips (de Peloton)
  con el elegido en blanco.
- **Tarjetas**: radio 18. *Abierto* (solo Elegir jugador y Wizard): borde fino #2E2E2E o relleno #1D1D1D.
- **Movimiento**: 0,3 s, cubic-bezier(0, 0, 0.2, 1); entradas = fundido + 10 px; nada rebota salvo el PIN incorrecto.
- **Pantallas**:
  - Home: titular grande centrado, Log in, entrar sin cuenta, QR y "Tap your card". *Abierto*: luz que recorre el
    borde del Log in (sin luz / blanca / turquesa, 1 o 2 luces). El turquesa rompe la regla "solo Hydrated": si se
    elige, la regla pasa a "Hydrated + momento de marca en la Home". Ajustes posibles después: velocidad, estela,
    pausa, halo.
  - Elegir jugador: plantilla de Fast Track, 20 por página, tarjetas con foto redonda, rangos en chips, Staff.
  - PIN: foto + saludo, 4 casillas, teclado con teclas #1D1D1D. *Abierto*: Continue con botón o automático.
    Incorrecto: tiemblan y se vacían.
  - Score: *abierto* gauge actual o fino; comparación "Your average / Best" (pregunta abierta); contador con anillo.
    Firma Kamleon débil (17/11): probados y descartados el **momento de marca** (el mandala hace una ola detrás del
    número; Daniel: "hace ruido"), la textura de puntos en el fondo (no se nota) y los puntos dentro de los
    componentes (demasiados puntos). Sigue abierto.
  - Wizard: lista de redes (ordenadas por señal, "Other network…" fija debajo; pregunta abierta) → contraseña con
    teclado rediseñado. *Abierto*: 6 o 20 redes, scroll con difuminado o con barra.
- **Pendiente de la A**: firma Kamleon débil (casi no hay agua ni puntos: es muy Analogue); verla en la pantalla real.

## Ficha B · Instrumento (17/11, montada)

Microsite: Tareas → Look & feel → **B · Instrumento** (`explorations/look-and-feel/daniel/b/`). Mismo esqueleto que la
C (copia de sus pantallas con `B.module.css`).

- **Frase**: "Cada dato llega y se llena."
- **Fondo**: gris muy oscuro tintado de azul petróleo (#0D1417), más claro arriba (#16242A). Sin el morado de Whoop.
- **Superficies**: tarjetas sin borde separadas por tono (#18242A), radio 16. *Abierto* (Elegir jugador y Wizard):
  tono o tinte turquesa.
- **Tipografía**: números y titulares en negrita (Circular Bold); etiquetas, botones y enlaces en MAYÚSCULAS con
  interletrado (aire de instrumento). Enlaces de acción con flecha turquesa.
- **Color**: el estado manda y se usa más que en A y C (anillos, rayitas, selección en turquesa).
- **PIN automático** (Daniel, 17/11): al meter el cuarto número entra solo, sin botón (ya no es opción). El botón
  redondo con anillo de 4 tramos queda en el código por si se recupera.
- **Movimiento**: 0,25 s, cubic-bezier(0.2, 0, 0, 1); entradas escalonadas; los datos se llenan (número que cuenta,
  rayitas que se encienden una a una).
- **Elegir jugador**: 30 en 6×5 (o 20) con el **dorsal como protagonista** (número grande en negrita, foto pequeña,
  nombre en mayúsculas). Sin modo dorsal y, en vez de "Staff", una tarjeta "Staff · Scan QR" con icono
  (Daniel, 17/11: el staff entra por QR); es una tarjeta más, la última de cada página (29 + QR o 19 + QR).
- **Score**: *abierto* disposición Centrado (la de siempre) o Instrumento (gauge a la izquierda; estado, mensaje y
  tres métricas con rayitas a la derecha: media, mejor y racha, inventadas, pendiente de si el RE tiene el dato);
  gauge actual (por defecto) o fino. Daniel, 17/11: lo importante es el estilo.

## Ficha C · Calma (17/11, montada)
- **PIN automático** (Daniel, 17/11): al meter el cuarto número entra solo, sin botón (ya no es opción).
- **Volver**: el botón de volver se queda como está (Daniel, 17/11).
- **Debajo del mensaje del Score** (Daniel, 17/11): **electrolitos y volumen** de la muestra (48 mmol/L,
  320 mL: valores de ejemplo) o nada; media y mejor quitado (Daniel, 17/11). Pregunta para business: ¿qué datos de la muestra
  se pueden enseñar y en qué unidades?
- **Staff y buscar por número** (Daniel, 17/11, con 30 por página): Staff es un botón con icono de QR arriba a la
  derecha, junto a KAMLEON® (como en Fast Track); al tocarlo, la plantilla se cambia por el QR. *Abierto*, buscar
  por número: botón ancho abajo ("Can't find yourself? Find me by number", abre el teclado de dorsal) o buscador
  en la línea del título (sale un teclado y la plantilla se filtra al teclear).
- **Halo** (Daniel, 17/11): el tono verdoso es **solo del halo** del centro; el fondo y los textos quedan como el
  original. *Abierto*: gris verdoso (por defecto) · verde Kamleon · cálido (original) · color del club · agua.
- **Fondo y textos** (exploración de tonos, se conserva aparte): *abierto*. Original (por defecto) · gris verdoso
  (#111413) · verde Kamleon (#0D1312); cambia fondo, textos y blanco del botón. El Score sigue en gris neutro.
- **Frase**: "Aquí no hay prisa."
- **Fondo**: #121110 con un halo grande que respira (9 s) y los puntos del mandala muy tenues dentro (firma Kamleon).
  *Abierto*: halo gris cálido / color del club / agua.
- **Superficies**: vidrio mate sin blur (velo translúcido + canto claro arriba + borde finísimo + grano), radio 24.
  *Abierto* (Elegir jugador y Wizard): vidrio o relleno.
- **Tipografía**: Circular Book (400) en titulares y números: fino y grande. Etiquetas pequeñas en mayúsculas. Sin
  serif (es la firma de Oura).
- **Color**: grises cálidos (#A39E97, #6B6660, texto #F5F2EE); botón en píldora blanco cálido #F2EEE8.
- **Movimiento**: 0,6 s, cubic-bezier(0.4, 0, 0.2, 1); entradas = fundido + 16 px.
- **Elegir jugador**: *abierto* Plantilla (Fast Track con fotos, lo que pide business para escoger rápido) o Dorsal
  ("What's your number?": teclea el dorsal, sale su foto, confirma; "Browse all players" vuelve a la plantilla).
- **Score**: entra con el gauge fino (el actual sigue como opción). **Fondo siempre neutro y oscuro** (#111111, halo
  #262626, sin opción Halo): un fondo cálido o del club se confunde con los colores de las zonas (Daniel, 17/11).
  *Abierto* (experimento, 17/11): detrás del número, los **mismos puntos grises del fondo se encienden en el color
  del rango** al salir el resultado, del número hacia fuera hasta el borde interior del gauge (por defecto) o por todo el fondo (1,1 s, con el estado), y sustituyen al glow, glow suave (45 %) o glow de siempre.

## Ficha E · Escenario (17/11, montada)
- **Sin paneles** (Daniel, 17/11): los paneles negros de Peloton existen porque detrás hay vídeo; nuestro fondo lo
  controlamos. Fuera las cajas grandes (Home, PIN, Score, Wizard): el texto va sobre el negro. Lo negro translúcido
  queda solo en las piezas que se tocan (tarjetas, teclas, redes). "Con paneles" queda como opción común.
- **Elegir jugador sin panel** (Daniel, 17/11: el panel lateral desperdicia espacio): *abierto*, tarjetas flotando
  (cada una su panel negro, 6 columnas a todo lo ancho; por defecto) o círculos (fotos grandes sin tarjeta, 8
  columnas, como Avatars círculo de Fast Track). Panel lateral y completo siguen como opción.
- **Score solo con gauge** (Daniel, 17/11): la disposición Escenario (número grande a la izquierda + barra) sale
  del menú; queda en el código.

Microsite: Tareas → Look & feel → **E · Escenario** (`explorations/look-and-feel/daniel/e/`).

- **Frase**: "Kamleon está vivo detrás; la interfaz es una capa encima."
- **Fondo (Stage.jsx)**: agua de semitono en todas las pantallas (Daniel, 17/11: fuera el mandala animado, que
  confundía en el PIN, y fuera la esfera). Puntitos diminutos (rejilla de 8 px, el tamaño sigue a la luz) que forman
  olas abajo; al entrar en la pantalla el agua sube, y luego dos olas viajan en sentidos contrarios y unos destellos
  recorren la superficie. Turquesa → azul. Resolución completa (puntos de 2–3 px). *Abierto* (engranaje): forma (ola abajo / esfera
  que se esparce desde el centro como una gota, con anillos hacia fuera), altura o tamaño, intensidad, velocidad, y
  movimiento lento / quieto. La Home lleva el panel centrado. Más apagado en el PIN y gris en el Score. **Nunca nombrar las
  referencias de marca** fuera de `refs/` (Daniel: que no digan que copiamos).
- **Superficies**: paneles negros translúcidos (66 %) sin blur, borde finísimo, radio 24. Solo opacidad: lo más
  barato en Qt. Dentro, piezas con velo blanco al 7 %.
- **Tipografía**: números grandes y finos sin caja (Book 400), etiquetas en mayúsculas.
- **Movimiento**: los paneles entran deslizándose desde su borde (0,6 s, cubic-bezier(0.22, 1, 0.36, 1)).
- **Pantallas**: Home con el escenario de protagonista y la interfaz en un panel abajo a la izquierda · Elegir
  jugador en panel lateral (4 columnas, toda la plantilla con scroll; KAMLEON® baja a la izquierda) o completo (6×5),
  con volver y la tarjeta de QR del staff · PIN en panel centrado (como la Tread de Peloton) · Score *abierto*:
  Escenario (número enorme sin caja, estado al lado, barra de zonas con punto y banda inferior con AVG / BEST y
  contador) o Gauge (el de siempre) · Wizard con la lista y el teclado en paneles.
- **Pregunta (programador)**: ¿la máquina puede mover un fondo a pantalla completa todo el rato? Opciones de más
  ligera a más pesada: animación vectorial (el mandala), shader, vídeo (barato si hay decodificador por hardware).

## Presentación a business (plan, 17/11)

Se prepara cuando las direcciones estén ajustadas. Material: cuadrícula de capturas y un vídeo por dirección.

**Puntos débiles de cada dirección** (para resolver antes o tener respuesta preparada)
- A: la más parecida a hoy ("¿qué ha cambiado?": enseñarla al lado de la actual); firma Kamleon débil (depende del
  momento de marca); gris sobre gris (volver, tarjetas) a un metro; Elegir jugador con 20 por página.
- B: mayúsculas con interletrado leen peor a distancia; fría, "app de wearable"; el QR como tarjeta puede tocarse
  por error; sin botón en el PIN pierde su firma (el anillo).
- C: el gris cálido puede parecer apagado frente al lenguaje deportivo; muchas variantes abiertas; cristal sin
  blur no comprobado en la máquina.
- E: depende entera de que la máquina mueva un shader a pantalla completa; paneles negros pesan y tapan el fondo;
  leer sobre fondo en movimiento cansa; forma del agua sin decidir.
- Todas: todas oscuras (preparar el argumento para un vestuario muy iluminado); el engranaje no se enseña.

**Guion**
0. Antes: congelar una configuración por dirección y enseñarla sin engranaje (`?bare=1`); vídeo corto por
   dirección (Home → jugador → PIN → Score; Wizard aparte); si se puede, en una pantalla de 1280×800 a un metro o en
   la máquina.
1. Hoy (2 min): la scrapp actual y sus problemas concretos (wizard con los pains del brief, legibilidad a
   distancia, no es neutra). La pregunta pasa a ser "¿cuál resuelve mejor esto?".
2. Criterios antes de enseñar nada: se lee a un metro · elegir jugador rápido (30 en una pantalla) · sirve para
   cualquier club · se siente Kamleon · viable en la máquina.
3. Cada dirección en una frase + su vídeo (1 min): A "lo de hoy, bien hecho" · B "un instrumento de rendimiento" ·
   C "calma y cuidado" · E "el agua de Kamleon de escenario".
4. Comparación pantalla por pantalla: filas = pantallas, columnas Hoy | A | B | C | E (empezar por Score y Elegir
   jugador). En el microsite, el botón "Comparar con hoy" de las pestañas pone la actual al lado.
5. Decisión acotada: una dirección y como mucho un préstamo concreto de otra (evitar el Frankenstein); hoja con los
   5 criterios × 4 direcciones (1–3). La E se presenta "condicionada a la máquina".
6. Recomendación de Daniel al final, con su porqué.

**Abierto**: ¿en vivo o la ven por su cuenta? En vivo pesan vídeo y pantalla real; por su cuenta, cuadrícula y hoja.

## Método

1. Referencias en `refs/`, con una línea de qué gusta de cada una.
2. Una lámina por dirección (paleta, tipografía, 3–4 referencias, una frase). Daniel la elige o ajusta antes de construir.
3. Cada dirección = un juego de tokens aplicado a las mismas pantallas en código, con selector A | B | C en el
   microsite, a 1280×800 (y en la pantalla real si se puede).
4. Prueba de neutralidad: las pantallas con 3–4 logos de clubes inventados de colores muy distintos (rojo, azul,
   amarillo, blanco y negro). Cada look necesita un sitio para el logo que aguante todos.
5. Criterios para el equipo: no se confunde con otra marca con el logo tapado · se lee a distancia · el score se entiende en <12 s · funciona sin la marca de ningún
   cliente · se puede programar.

## Abierto

- **Pregunta (programador)**: ¿el urinal puede conectarse a una red wifi oculta (que no aparece en la lista)? En la
  A, el Wizard lleva "Other network…" fija debajo de la lista para escribirla a mano; el wizard actual no lo tiene
  (Daniel, 17/11: se deja como pregunta).

- **Pregunta (programador / business)**: ¿el Score puede enseñar la comparación con el historial del jugador ("Your
  average" / "Best")? Hace falta que la scrapp o el RE tengan el historial en ese momento. En la exploración va como
  opción que se enciende y se apaga (Daniel, 17/11).
- **A · opciones abiertas en el engranaje** (Daniel, 17/11): fondo (liso / luz arriba / foco, suave o marcada) y
  tarjetas (borde fino o relleno). Se deciden viéndolas.

- Lámina de la dirección A (siguiente paso).
- Referencias para B y C. Ya hay (16/11): `a-kamleon/` con Wealthsimple (vídeo, lo que gusta es la animación), Analogue home y Analogue 3D (página oscura); `Whoop/` sin dirección, posible exploración propia (lo que gusta es la animación de los datos); `Oura/` sin dirección, parecida a Whoop pero en "calma editorial" (comparación en sus notas).
- Animación: cuando se construya, medir duraciones y curvas reales de los vídeos de referencia (Wealthsimple ya está; de Whoop hará falta uno).
