# Recommendation Engine — PRD de la fase cero

Prototipo interactivo para validar la recomendación de bebida después del score de hidratación, con el portfolio de Gatorade, para un equipo de la NFL.

**Estado:** borrador para revisar · **Fecha:** 2026-09-18
**Fuente:** documento "Recommendation Engine V1" (Kamleon, científico) + decisiones tomadas con Daniel el 18/9.

---

## 1. Contexto y objetivo

Kamleon quiere sumar un motor de recomendación a la experiencia existente: hoy el jugador orina, la scrapp le muestra su **score de hidratación** y termina el flujo. La propuesta agrega una respuesta a dos preguntas: **cuánto tomar** y **qué tomar**, con productos Gatorade listos para consumir.

**Objetivo de la fase cero:** un prototipo interactivo, navegable en el navegador y compartible por link, que el CEO use para **validar la idea con el equipo de la NFL** (staff de rendimiento y nutrición).

**Precisión (18/9, correo del equipo):** no alcanza con una sola propuesta bien hecha. Lo que se quiere es **probar la interfaz antes de construir la lógica del backend**, comparando las formas de presentar la información. Eso convierte la exploración en el objetivo de la fase, no en un extra: hay que construir las configuraciones posibles y poder alternarlas durante la prueba.

**No es** una venta a Gatorade, ni una integración real, ni código de producción.

**Restricción del documento:** *very fast implementation*. La fase cero prioriza recorrer el flujo completo por encima de cubrir todos los casos.

---

## 2. Qué entra y qué no

| | Fase 0 (este PRD) | Más adelante |
|---|---|---|
| Superficie | Scrapp (pantalla 1280×800 sobre el urinal) | Web de staff (configuración), app móvil del jugador |
| Salidas | **Cuánto tomar** y **qué tomar** | **Cuándo tomar** (timing) |
| Lógica de producto | Paso 1: por estado de hidratación | Paso 2: afinado por intensidad y duración |
| Clima | Simulado en la demo, con la lógica de la API real | API conectada de verdad |
| Peso del jugador | Dato del perfil (simulado) | Dato real desde la web |
| Intensidad y duración de la sesión | **No disponible** | Carga del staff o integración |
| Configuración del motor | Las **tres configuraciones** navegables para la prueba (ver 5.1) | Pantalla de configuración en la web |
| Prueba con usuarios | Guion de prueba A/B y modo de alternar configuraciones | Test con jugadores en la instalación real |

---

## 3. Usuarios y escenario

**Quien usa la demo:** el CEO, presentándola al staff del equipo.

**Quien usa el producto:** el jugador, de pie frente a la pantalla, pocos segundos, sin teclado y con las manos ocupadas. Es el mismo contexto que ya validamos para el score: lectura a distancia, texto grande, nada de párrafos.

**Quien lo configura (fases siguientes):** el staff de rendimiento, desde la web.

---

## 4. La lógica, resumida

### 4.1 Cuánto tomar

```
Volumen = factor base (mL/kg)  ×  factor de clima  ×  peso del jugador (kg)
```

**Factor base según el estado de hidratación** (USG predicho):

| Estado | USG | Factor |
|---|---|---|
| Overhydrated | < 1003 | 0–1 mL/kg (enjuague bucal) |
| Hydrated | 1003–1006 · 1007–1011 · 1012–1015 | 2 · 3 · 4 mL/kg |
| Dehydrated | 1016–1019 · 1019–1022 · 1023–1025 | 5 · 6 · 7 mL/kg |
| Severely dehydrated | 1026–1028 · 1029–1031 · 1032–1034 · ≥1035 | 8 · 9 · 10 · 11 mL/kg |

**Factor de clima:** 1 (interior o <22°C) · 1,1 (22–27°C) · 1,2 (28–31°C) · 1,3 (28–31°C con >70% humedad) · 1,35 (32–35°C) · 1,45 (32–35°C con >70%) · 1,5 (>35°C) · 1,6 (>35°C con humedad).

### 4.2 Qué tomar (paso 1, el que aplica en esta fase)

| Estado | Objetivo | Producto |
|---|---|---|
| Overhydrated | Restringir líquido, priorizar electrolitos | Gatorlyte Zero / Gatorlyte |
| Hydrated | Mantener | Gatorade Water / G Zero / Propel |
| Dehydrated | Reponer antes de entrenar | Gatorade Thirst Quencher / Gatorlyte |
| Severely dehydrated | Corregir déficit severo | Gatorlyte primero, después Thirst Quencher |

### 4.3 Errores del documento a confirmar con el equipo científico

1. **Ejemplo "severely dehydrated / 1027 USG":** el texto dice factor 6 mL/kg, pero la tabla indica 8 para ese valor, y el resultado del propio ejemplo (640 mL para 80 kg) corresponde a 8. Asumimos **8**.
2. **Ejemplo "dehydrated":** "480 mL en sorbos de 12 mL cada 15 min" darían 40 sorbos. Asumimos **120 mL**.
3. **Rango solapado:** 1019 aparece en dos tramos (1016–1019 y 1019–1022). Asumimos que el segundo arranca en 1020.
4. **Nombres de producto:** el documento alterna "Lower Sugar"/"Low Sugar" y "G Zero"/"Gatorade Zero". El prototipo usa una única lista (ver 4.4).
5. **Estado de electrolitos** (diluted / balanced / tonic): es la segunda entrada de la tabla del paso 2 y el documento no dice de dónde sale. Queda pendiente para cuando se implemente ese paso.

### 4.4 Catálogo (9 productos, listos para tomar)

Thirst Quencher · G Zero · Propel · Propel Energy Boost · Propel Immune Support · Gatorade Water · Gatorlyte Zero · Gatorade Lower Sugar · Gatorlyte.

---

## 5. Decisiones de diseño

### 5.1 Las tres configuraciones a comparar

El motor se puede activar o desactivar por decisión del staff, así que las formas de ver la pantalla son tres, no dos:

1. **Solo score** (motor desactivado) — ya existe en el prototipo.
2. **Secuencial:** primero el score, después la recomendación. Más claro, más tiempo.
3. **Simultáneo:** score y recomendación juntos. Más rápido, más carga cognitiva.

**En la scrapp el contexto es distinto del de los conceptos del documento**, que están dibujados como app de móvil: acá es una pantalla apaisada de 1280×800, de pie, con segundos disponibles y sin posibilidad de "volver después". Los conceptos se rediseñan para esta pantalla, no se adaptan.

**Para la prueba hay que poder alternar entre las tres** sin tocar código, igual que los botones que ya simulan el hardware.

### 5.1.1 Benchmark: el motor de recomendación de Gatorade

Gatorade ya tiene un sistema propio (Gx), desarrollado con Smart Design y **dos años de pruebas con atletas de élite**: botella con sensor y luz en la tapa que marca el ritmo de consumo, parche de sudor que mide sodio y tasa de sudoración, y recomendación de producto según las necesidades de electrolitos del atleta.

Qué tomamos de ahí:

- **El volumen se muestra, no solo se escribe.** En su interfaz usan un envase que se va llenando para que "200 mL" deje de ser un número abstracto. Refuerza la tercera opción de unidades (expresar el volumen en botellas): si Gatorade ya validó esa metáfora, hay antecedente.
- **El ritmo importa tanto como el total.** Su botella marca el paso del consumo; nuestro documento también habla de sorbos cada 15 minutos. Conviene mostrar las dos cosas: cuánto en total y a qué ritmo.
- **A tener en cuenta:** si el equipo ya usa la app de Gatorade, nuestra recomendación va a convivir con la de ellos. Si dicen cosas distintas, el jugador no sabe a cuál hacer caso (ver preguntas).

### 5.2 Decidido

- **Todos los jugadores están identificados**: en este contexto no hay uso como invitado, así que siempre hay peso y la recomendación siempre puede ser personalizada.

Las unidades (onzas o mililitros) y el criterio de éxito de la validación son **preguntas abiertas** para el PM — ver sección 11.

## 6. Flujo y pantallas

Flujo actual de la scrapp: `Home → Login → Start → Tracking → Score → Flush → Home`.

Fase cero: se agrega un paso entre **Score** y **Flush**.

### Concepto secuencial (pantalla nueva después del score)

```
┌────────────────────────────────────────────────────────────────┐
│  YOUR RECOMMENDATION                                    ●●○    │
│                                                                │
│   HOW MUCH                    │   WHAT TO DRINK                │
│                               │                                │
│      20 oz                    │      [botella]                 │
│      600 mL                   │                                │
│                               │    Gatorade Thirst Quencher    │
│   7 oz every 15 min           │    Carbs + Electrolytes        │
│                               │                                │
│   Warm day · 24°C             │    Best for your hydration     │
│                               │    level today                 │
│                                                                │
│                          [ Done ]                              │
└────────────────────────────────────────────────────────────────┘
```

### Concepto simultáneo (todo en la pantalla de score)

```
┌────────────────────────────────────────────────────────────────┐
│   YOUR HYDRATION SCORE        │   YOUR RECOMMENDATION          │
│                               │                                │
│        ╭─────╮                │   20 oz · 600 mL               │
│        │ 72  │  HYDRATED      │   7 oz every 15 min            │
│        ╰─────╯                │                                │
│         /100                  │   [botella]  Thirst Quencher   │
│                               │              Carbs+Electrolytes│
│   Good job! Keep hydrating    │                                │
│   during exercise.            │                                │
│                                                                │
│                          [ Done ]                              │
└────────────────────────────────────────────────────────────────┘
```

**Regla de contenido para las dos:** el jugador tiene que poder responder "¿cuánto?" y "¿qué?" **sin leer un párrafo**. El porqué va en una línea corta; el detalle clínico, si hace falta, es para la web del staff.

---

## 7. Datos simulados

Se necesitan escenarios que cubran los cuatro estados de hidratación, para que la demo pueda mostrar casos distintos sin depender del sensor:

| Escenario | Estado | Peso | Clima | Volumen | Producto |
|---|---|---|---|---|---|
| 1 | Hydrated (1012) | 98 kg | Interior, 20°C | 392 mL (13 oz) | Gatorade Water / G Zero |
| 2 | Dehydrated (1021) | 110 kg | 30°C, 73% | 858 mL (29 oz) | Thirst Quencher |
| 3 | Severely dehydrated (1027) | 102 kg | 33°C, 60% | 1.101 mL (37 oz) | Gatorlyte, después Thirst Quencher |
| 4 | Overhydrated (1002) | 95 kg | Interior | Enjuague bucal, máx. 50–75 mL/h | Gatorlyte Zero |

Pesos elegidos con rangos reales de jugadores de la NFL. Los productos usan las fotos del catálogo del documento.

**Todos los casos asumen jugador identificado** (no hay uso como invitado en este escenario).

**Cómo se eligen en la demo:** botones de simulación, del mismo tipo que los que ya existen para el hardware ("Simulate RFID", "Simulate flow"), para que el CEO pueda mostrar cualquier caso sin tocar código.

---

## 8. Cómo se valida

Dos cosas distintas, que conviene no mezclar.

**A. La lógica es correcta** — con el staff, por cada escenario: ¿el volumen y el producto son los que ellos indicarían?

**B. La interfaz comunica** — prueba A/B comparando las configuraciones de 5.1. Se le muestra una configuración a cada persona (o las dos en orden alternado) y se observa, sin explicar nada antes:

1. **¿Cuánto tarda en decir cuánto tiene que tomar?**
2. **¿Puede nombrar el producto recomendado** después de que la pantalla se apaga?
3. **¿Le alcanzó el tiempo**, o se quedó leyendo cuando la pantalla ya había cambiado?
4. **¿Qué haría a continuación?**

"Cuál te gusta más" no es una medida: la pregunta se responde observando, no preguntando.

**Y una pregunta de fondo, para el staff:** ¿qué falta para que esto sirva de verdad en su día a día? Lista abierta que alimenta la fase siguiente.

Y una pregunta de fondo: **¿el jugador va a tener esa bebida a mano al salir?** Si no, la recomendación se vuelve frustración, y eso cambia el producto, no el diseño.

---

## 9. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| La lógica del documento tiene errores sin resolver (4.3) | Que el staff detecte un número mal y se pierda credibilidad | Confirmar los cinco puntos antes de la reunión |
| Sin intensidad ni duración, la recomendación es menos precisa de lo que promete el documento | El staff pregunta por algo que no está | Decirlo de entrada: fase cero usa el paso 1 |
| Marca Gatorade en una demo | Uso de imágenes de producto | Es una demo interna de validación; confirmar antes de publicar el link |
| La pantalla es de paso | Mucha información y poco tiempo | Es justamente lo que mide la validación |

---

## 10. Fuera de alcance

Timing ("cuándo tomar"), tabla de intensidad y duración, configuración en la web, API de clima conectada, app móvil, productos fuera del catálogo Gatorade, histórico de recomendaciones.

---

## 11. Preguntas para el PM

Ordenadas por cuánto bloquean el trabajo.

### Bloquean la construcción

1. **¿En qué unidad se muestra el volumen?** Cambia todas las pantallas. Llevamos una propuesta, no una pregunta abierta:

   **Propuesta:** onzas como unidad principal y mililitros como secundaria en la scrapp; mililitros en la web del staff.
   - **Onzas para el jugador**, porque es la unidad de los envases (Thirst Quencher 28 oz, Propel 20 fl oz, Gatorade Water 33.8 oz): si la pantalla dice "20 oz" y la botella dice "20 fl oz", no hay que hacer ninguna cuenta.
   - **Mililitros para el staff**, porque toda la ciencia está en mL (los factores son mL/kg y los ejemplos del documento también).

   **Tercera opción a evaluar en la reunión: expresarlo en botellas** ("about ¾ of a bottle", "1 bottle + a bit"). Es la forma más concreta para alguien de pie y apurado, y elimina cualquier conversión. Depende de una condición: que el equipo tenga **un formato único de envase** en el vestuario. Si conviven varios tamaños, la referencia se vuelve ambigua y hay que descartarla.

   **Lo que hay que preguntar:** ¿hay alguna convención de unidades ya usada en la app? ¿El equipo tiene un formato único de botella en el vestuario?
2. **¿Qué tiene que pasar para que la validación sea un éxito?** ¿Que el staff confirme que la recomendación es clínicamente correcta? ¿Que digan que un jugador la entendería sin explicación? ¿Que quieran seguir a la fase 1? Define qué pantallas hacen falta y cuáles sobran.
3. **¿Cuándo es la presentación?** El documento dice "very fast implementation", pero sin fecha no se puede decidir qué queda afuera.

### Bloquean la lógica

4. **Los cinco errores del documento** (sección 4.3): factor 6 vs 8, sorbos de 12 vs 120 mL, el rango 1019 solapado, los nombres de producto y, sobre todo, **de dónde sale el estado de electrolitos**. ¿Quién los confirma y para cuándo?
5. **¿La API de clima ya existe o hay que elegirla?** En la demo se simula, pero conviene saber si el dato va a estar disponible y con qué precisión (¿del estadio, de la ciudad?).
6. **¿Cómo se va a capturar la intensidad y la duración de la sesión** en las fases siguientes? ¿La carga el staff a mano, sale de un calendario de entrenamientos, o se integra con lo que ya usa el equipo? Define si el paso 2 es viable.

### Sobre la prueba A/B

7. **¿Con quién se prueba?** No es lo mismo el staff en una sala que jugadores reales frente al urinal. Lo segundo da una respuesta mucho mejor y necesita pantalla física, coordinación y permisos.
8. **¿Qué se mide?** Propuesta en la sección 8. Hay que acordarlo antes de construir, porque define qué pantallas hacen falta.
9. **¿El equipo ya usa la app de Gatorade (Gx)?** Si sí, nuestra recomendación convive con la de ellos y hay que decidir qué pasa si no coinciden.

### Sobre el producto, no sobre la demo

10. **¿El jugador tiene esa bebida a mano al salir?** Si la pantalla recomienda Gatorlyte y en el vestuario no hay, la recomendación genera frustración. ¿Hay un acuerdo de stock con el equipo?
11. **¿Qué pasa si el jugador tiene preferencias o restricciones?** El documento menciona preferencias de sabor en el perfil del atleta, pero el motor de esta fase no las usa. ¿Es aceptable para el piloto?
12. **¿Podemos mostrar la marca Gatorade en un link compartible?** La demo usa fotos reales de producto. Para una reunión interna no debería haber problema, pero el link se puede reenviar.
13. **¿Alguien más que el jugador ve la pantalla?** Es una pantalla física en un vestuario: el estado de hidratación es un dato personal y puede haber otra persona detrás. Ya pasa hoy con el score, pero la recomendación lo hace más explícito.

### Para las fases siguientes

14. **¿Quién configura el motor en la web y qué puede cambiar?** ¿Activarlo y desactivarlo por organización, por centro o por equipo? ¿Puede el staff editar el catálogo de productos o los factores?
15. **¿Esto es solo para este equipo de la NFL o el piloto se replica?** Si se replica, el catálogo de productos deja de poder estar fijo en el código.

---

## 12. Draft de estimación

Trabajo de diseño e implementación del prototipo, con el flujo de la scrapp ya existente como base.

| Tarea | Estimación |
|---|---|
| Lógica de cálculo (factores, clima, peso) y catálogo de productos | 0,5 – 1 día |
| Pantalla de recomendación, concepto **secuencial** | 1 – 1,5 días |
| Variante **simultánea** (score + recomendación juntos) | 0,5 – 1 día |
| Escenarios simulados y botones para cambiar de caso en la demo | 0,5 día |
| Preparación de las imágenes de producto | 0,5 día |
| Ajuste fino en la pantalla real (1280×800) y pulido | 0,5 – 1 día |
| Publicación del link compartible | 0,25 día |
| Ajustes después de la revisión interna | 0,5 – 1 día |
| Tercera configuración (solo score) y modo de alternar entre las tres en la prueba | 0,5 día |
| Visualización del volumen tipo envase que se llena, animada | 0,5 – 1 día |
| Guion de la prueba A/B (qué se pide, en qué orden, qué se observa) | 0,5 día |
| **Total** | **5,75 – 9 días de trabajo** |

En días de calendario, contando idas y vueltas de revisión: **entre una semana y media y dos semanas**. (Antes del correo del 18/9 eran 4,25–6,75 días: la prueba A/B y el envase que se llena agregaron entre 1,5 y 2 días.)

**La estimación asume:**
- Que las preguntas 1, 2 y 4 se responden antes de empezar. Si llegan a mitad de camino, hay que rehacer pantallas.
- Datos simulados, sin ninguna integración real.
- Sin configuración en la web, sin timing y sin la tabla de intensidad y duración.
- Que las fotos de producto están disponibles en la carpeta del documento y se pueden usar.

**Animaciones (incluidas arriba, para tenerlas en cuenta al negociar el alcance):**

| Nivel | Qué incluye | Tiempo |
|---|---|---|
| Mínimo | Las transiciones que ya usa la scrapp | Base |
| **Cuidado (recomendado)** | Entrada escalonada: primero el volumen, después la botella; número que cuenta hasta su valor | +0,5 a 1 día |
| Calibrado | Ajustar los tiempos probando en la pantalla física, incluido cuántos segundos queda la recomendación antes de Flush | +0,5 día |

La animación no es decoración acá: es lo que define **qué se mira primero** en una pantalla donde el volumen y el producto compiten, y la demo se presenta en vivo, así que una transición mal calibrada se lee como "está a medio hacer".

**Fuera de esta fase: botellas en 3D.** Se evaluó y se descartó para la fase cero. Los modelos no existen (Gatorade entrega fotos, no modelos), aparecen al menos cuatro productos distintos en los escenarios, no sabemos cómo rinde el 3D en el equipo físico, y sobre todo no ayuda a responder las dos preguntas que la demo tiene que responder. Una foto con movimiento sutil da casi el mismo efecto dentro del presupuesto de animación ya previsto. **Queda como prueba acotada después de la demo:** un día de tiempo máximo, una sola botella, fuera del prototipo, para poder estimarlo con datos reales si se quiere en la fase uno.

**Lo que más puede estirarlo:** que el equipo científico corrija la lógica después de que las pantallas estén hechas, o que aparezca la necesidad de mostrar el "cuándo tomar", que hoy está fuera de alcance.
