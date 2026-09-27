# Mapa del Design System — Figma ↔ código

Qué componente de Figma se corresponde con qué componente de código, con qué ejes, y dónde
los dos lados se han separado.

Sirve para tres cosas: saber qué existe antes de dibujar o programar algo nuevo, saber qué
hay que tocar en los dos sitios cuando algo cambia, y ser la referencia contra la que se
comparan las dos partes de forma automática más adelante.

Archivos: Figma `ozgwasF3ziQyznQS0z0dM1` (Design system) · código `design-system/`
Levantado el 2026-09-26. **Es una foto, no se actualiza solo** — ver "Cómo mantener esto vivo".

---

## Cómo leer el mapa

Lo primero que hay que entender es que **este mapa no puede ser una tabla uno a uno**, y no
porque el trabajo esté mal hecho: es que los dos medios modelan los estados de forma
distinta, y los dos tienen razón.

En Figma, casi todos los componentes tienen un eje `State` con un valor `Hover`. Tiene que
tenerlo: Figma no puede ejecutar un `:hover`, así que si quieres ver cómo queda el botón
cuando pasas el ratón, no hay otra que dibujarlo como una variante aparte.

En código ese valor **no existe y no debe existir**. No hay ningún `<Button state="hover">`:
hay una regla CSS `:hover` que el navegador aplica sola. Si añadiéramos la propiedad,
estaríamos pidiéndole al programador que gestione a mano algo que el navegador ya hace.

Por eso cada fila del mapa separa tres cosas:

- **Ejes que se corresponden** — las propiedades que significan lo mismo en los dos lados y
  que por tanto tienen que tener los mismos valores. Aquí es donde una diferencia es un error.
- **Solo en Figma** — normalmente `State=Hover/Focus`. Es correcto que no esté en código.
- **Solo en código** — props de comportamiento (`onClick`, `tooltip`) o estados que Figma no
  dibujó. Hay que mirar caso por caso si falta en Figma o si no hace falta.

Si no separamos esto, cualquier comparación automática va a reportar decenas de diferencias
falsas para siempre, y nadie va a volver a mirarla. Es el error clásico.

---

## El mapa

### Botones

| Figma | Código | Ejes que se corresponden | Solo en Figma | Solo en código |
|---|---|---|---|---|
| `Button` | `Button` | `Type` ↔ `variant` (Primary·Secondary·Tertiary) · `Size` ↔ `size` (S·M) | `State=Hover` | `variant=tertiaryDanger` · `leftIcon` |
| `Icon Button` | `IconButton` | `Mode` ↔ `variant` (Default·Danger·Critical) ✅ completo | `State=Hover` | `tooltip` · `tooltipPosition` |
| `Toolbar Button` | `ToolbarButton` | `State=Selected` ↔ `selected` · `State=Disabled` ↔ `disabled` ✅ | `State=Hover` | — |

`tertiaryDanger` existe en código desde el 17/9 (Email history) y no está en Figma.

### Formularios

| Figma | Código | Ejes que se corresponden | Solo en Figma | Solo en código |
|---|---|---|---|---|
| `Text input` | `Input` | `State=Error` ↔ `error` · `State=Disabled` ↔ `disabled` | `Hover` · `Focus` · `Active` | `onSubtle` · `suffix` · `type` · `required` · `description` |
| `Text area` | `Textarea` | ídem | ídem | `rows` — **le falta `onSubtle`**, que sí tienen sus hermanos |
| `Dropdown` | `Dropdown` | ídem | ídem | `onSubtle` · `required` · `description` |
| `Search bar` | `SearchBar` | `State=Error` ↔ `error` · `Disabled` ↔ `disabled` | `Hover` · `Active` · `Focus` (**era `State6`; renombrado el 26/9, pero su dibujo sigue siendo idéntico a `Active`: no tiene anillo de foco**) | `onClear` |
| `Checkbox` | `Checkbox` | `Checked` ↔ `checked` ✅ | — | `disabled` · `label` |
| `Toggle` | `Toggle` | `State=On/Off` ↔ `checked` · `Size` ↔ `size` (S 40×24 · M 56×32) ✅ | — | `disabled` · `label` |
| `Radio button` | **no existe** | — | todo | — |

El **`Radio button` está dibujado en Figma y no programado** — es el hueco conocido del DS.

Y una lección del 26/9 que conviene no olvidar: el Toggle parecía no tener eje `Size` en
Figma, y tenía dos variantes llamadas `State3` y `State4` que parecían basura. Medían 32px de
alto contra 24 de las otras dos: **eran el tamaño M sin nombrar**. Borrarlas habría destruido
justo el eje que el código sí tiene. Una variante mal nombrada no es una variante vacía — hay
que mirar dentro antes de borrar.

### Navegación

| Figma | Código | Ejes que se corresponden | Solo en Figma | Solo en código |
|---|---|---|---|---|
| `TabBar` | `TabBar` | `Size` ↔ `size` (S·M) | `Tabs`=1·2·3·4·5 · `State=Hover` | `tabs` (array sin límite) · `scrollable` · `inset` · punto de aviso |
| `.Tab` | (interno) | — | — | — |
| `Sidebar-v2` | `Sidebar` | `Collapse` ↔ `collapsed` | `Role` = 5 roles · `State=Hover` | `sections` (datos) · 9 props más |
| `Segmented control` | `SegmentedControl` | `Size` ↔ `size` (M·S) ✅ | — | — |
| `.Tab SC` | (interno, `.option`) | `Mode=Active` ↔ `.active` · `State=Hover` ↔ `:hover` · `Size` | — | — |
| `.Sidebar-Item` **y** `.Sidebar-Item2` | `SidebarItem` | `State=Selected` ↔ `state` · `Collapse` ↔ `collapsed` | `State=Hover` | `state=expanded` |
| `.User menu` | (dentro de `Sidebar.jsx`) | — | — | no es componente propio |

Aquí están dos diferencias estructurales que conviene tener claras:

**El TabBar de Figma fija el número de pestañas como variante** (1 a 5) y el de código recibe
una lista de cualquier longitud. Consecuencia práctica: el día que una pantalla necesite 6
pestañas, el código ya funciona y en Figma no se puede dibujar. Es la diferencia entre
*enumerar* y *parametrizar*, y no tiene arreglo limpio en Figma — lo que hay que hacer es
dejarlo escrito para que nadie piense que 5 es un máximo del sistema.

**El Sidebar de Figma tiene el rol como variante** (Team admin, Center admin, Organization
admin, Kamleon Staff, End user) y el de código recibe los ítems como datos. La consecuencia
buena: el renombrado a "Team admin" ya está hecho en Figma. La mala: cada rol nuevo obliga a
dibujar una variante más.

**Y hay dos `.Sidebar-Item` distintos** (`.Sidebar-Item` y `.Sidebar-Item2`) con casi los
mismos ejes. Uno de los dos es el vivo; hay que decidir cuál y llevarse el otro al cementerio.

### Estados y avisos

| Figma | Código | Ejes que se corresponden | Solo en Figma | Solo en código |
|---|---|---|---|---|
| `Tag status` | `Tag` | `Active` ↔ `active` | `Disabled` (= `inactive` en código, **otro nombre**) | — |
| `Tag status - invitations` | el **mismo** `Tag` | `Expired`·`Pending` ↔ `expired`·`pending` | — | `delay` · `delivered` · **`user`** · **`professional`** |
| `Toast` | `Toast` | `Mode` ↔ `mode` (Success·Critic) ✅ completo | — | `onUndo` · `duration` · `delay` |
| `Tooltip` | (dentro de `IconButton` y `SidebarItem`) | — | es componente propio | no es componente propio |

El caso del `Tag` es el más desalineado de la librería y merece su apartado:

- En Figma son **dos componentes**; en código es **uno con 8 valores**.
- `Active` aparece en los dos componentes de Figma a la vez.
- `Expired` está en el de invitaciones, pero también es un estado que se le puede poner a una
  persona: la frontera entre los dos componentes no está limpia.
- Figma dice `Disabled` donde el código dice `inactive`. Es el mismo estado con dos nombres,
  y eso es lo peor que puede pasarle a un sistema: nadie sabe cuál es el término oficial.
- **El tag de rol no existe en Figma.** `user` y `professional` son valores de código con su
  propio color (turquesa y gris). En Figma se está poniendo cambiando el texto a mano, así que
  el color sale el que toque. Es divergencia de las caras: en código el color viene solo.

Los 8 valores del código son en realidad **tres familias distintas**:

```
ciclo de vida     active · inactive · pending · expired
envío de correo   delay · delivered
rol               user · professional
```

Por eso la pregunta al unificar **no es "¿uno o dos componentes?" sino "¿cuántas
propiedades?"**. Con un solo `Status` de 8 valores, cualquiera puede poner "Delivered" donde
va un rol, y el sistema no lo impide. Decisión pendiente.

### Menús

| Figma | Código | Ejes que se corresponden | Solo en Figma | Solo en código |
|---|---|---|---|---|
| `Contextual menu` + `.c-menu Item` | `ContextMenu` | `Variant=Critic` ↔ `danger` del ítem | `State=Hover` | `separator` · `disabled` por ítem |
| **no existe** | `BottomSheet` | — | — | todo |

`BottomSheet` ya estaba en pendientes. Y ojo: no es un componente independiente, es **lo que
el `ContextMenu` se convierte por debajo de 390px**. Cuando se lleve a Figma hay que
documentar esa regla o parecerán dos componentes sin relación.

### Sin pareja

**Solo en Figma (7)** — dibujados, no programados:

| Componente | Estado |
|---|---|
| `Table Cell` (9 tipos) | Las tablas del prototipo se montan a mano en cada pantalla. Es la deuda más grande de las dos listas |
| `Calendar` + `.Day` (8 estados) | Sin uso en el prototipo |
| `Accordion` | Sin uso |
| `Radio button` | Hueco conocido |
| `Tooltip` | En código vive dentro de otros componentes |
| `Logo` (4 tipos) | En código es un icono, `LogoKamleon` |
| `Urine color` (8 niveles) | Es de la scrapp, no de la web |

**Solo en código (2)**: `BottomSheet` · `FilterPanel`.

Que la lista de "solo en código" tenga dos elementos es buena señal: significa que casi nada
se ha programado sin pasar por diseño.

### Nombres que no coinciden

Ninguno es grave por separado; juntos son la razón por la que nadie encuentra las cosas.

```
Figma                       Código
────────────────────────────────────────────
Text input              →   Input
Text area               →   Textarea
Contextual menu         →   ContextMenu
Search bar              →   SearchBar
Segmented control       →   SegmentedControl
Icon Button             →   IconButton
Toolbar Button          →   ToolbarButton
Tag status              →   Tag
Sidebar-v2              →   Sidebar
Radio button            →   (sin programar)
```

El patrón: Figma usa espacios y frases naturales, el código usa PascalCase pegado. Eso es
normal y no hay que forzarlo — lo que hace falta es que **esta tabla exista**, que es lo que
convierte "no encuentro el componente" en una búsqueda de diez segundos.

El caso distinto es `Tag status` ↔ `Tag`: ahí no es una convención de escritura, es que en
Figma el nombre ya afirma que el componente es de *estado*, y en código se usa también para
rol. El nombre está prometiendo algo que no cumple.

---

## Tokens

| Capa | Figma | Código | Estado |
|---|---|---|---|
| Colores base | `Global Colors` 35 + **`Global Colors 2` 39** | `colors.css` 36 | dos colecciones en Figma contra una en código |
| Colores semánticos | `Semantic Colors` 25 | `semantic-colors.css` 26 | muy cerca, comparar valor por valor |
| Tipografía | `Global Typography` 10 | `typography.css` 10 | cuadran en número |
| Estilos de texto | 14 text styles | clases en `text-styles.css` | comparar |
| Radios | `Border Radius` 7 | `tokens.css` **4** (xs 8 · s 12 · m 24 · l 40) | 3 radios de Figma sin token en código |
| Números | `Global Numbers` 5 | — | sin equivalente |
| Sombras | **0 effect styles** | **0 tokens, 33 sombras distintas a mano** | no existe la capa en ningún lado |

Dos cosas que hay que mirar de frente:

**`Global Colors 2`.** Ese "2" es la huella de haber duplicado una colección en vez de
ampliar la que había. Ahora hay 74 variables de color repartidas en dos sitios y nada dice
cuál manda. Cuando alguien busque un gris, va a encontrar dos candidatos.

**Las sombras.** No hay ni un token de sombra en ninguno de los dos lados, y en el código hay
**33 sombras distintas escritas a mano**. Eso quiere decir que el sistema no tiene opinión
sobre la elevación, y que cada panel flotante inventó la suya. Es de las cosas más visibles
para alguien que sepa mirar un DS: si abres dos drawers y las sombras no son iguales, se ve.

Y una inconsistencia concreta: el anillo de foco está escrito de dos formas. `Input`,
`Dropdown` y `Textarea` usan `#fff` a pelo; `SearchBar` usa `var(--color-bg-surface)`. Es el
mismo color hoy, así que no se nota — hasta el día que ese token cambie y tres componentes se
queden atrás.

---

## Estado de salud de la librería

Esto no es contenido, es construcción, y es lo primero que revisa alguien con criterio.

| Qué | Cómo está |
|---|---|
| **Descripciones de componente** | **0 de 39.** Ninguno tiene descripción ni enlace a documentación |
| Variantes sin nombrar | todas renombradas el 26/9 (`Toggle`, `Toolbar Button`, `Radio button`, `Search bar`) |
| Nombres que prometen más que el dibujo | `Search bar · State=Focus` se llama Focus pero está dibujado igual que `Active` |
| Erratas en valores | ~~`Radio button` → `DEfault`~~ corregido el 26/9 |
| Component sets roto | `.Tab SC` (2226:397) tiene errores de variantes |
| Duplicados vivos | ~~`Global Colors 2`~~ fusionada el 26/9 · ~~`.Sidebar-Item`~~ (estaba dentro de `❌ Deprecated`, no era duplicado) · los dos `Tag` |
| Deprecados sin retirar | `❌ Sidebar-v1` sigue publicado |
| Componentes fuera de sitio | 8 iconos `vuesax/bulk/*` sueltos en la página Sidebar |
| Modos de variables | todas las colecciones en un único modo llamado `Mode 1` |
| Cementerio | `🪦 Graveyard` con 49 sets — bien, eso es hacerlo como se debe |

**Las descripciones son lo más importante de esta tabla.** Un componente sin descripción
obliga a adivinar cuándo usarlo y cuándo no, y esa es exactamente la información que no está
en el dibujo. Además tú ya tienes reglas decididas que hoy no viven en ninguna parte visible:
que el `ContextMenu` se convierte en `BottomSheet` por debajo de 390px, que el `TabBar` en
táctil fuerza el tamaño M, que el rojo en reposo del `IconButton` significa "problema que ya
existe" y el `Danger` significa "esta acción destruye algo". Todo eso está en documentos del
repo, donde solo lo lee quien programa. El sitio donde sirve es el panel de la derecha de
Figma, cuando alguien selecciona el componente.

Las variantes sin nombrar (`State3`, `Variant4`, `State6`) son el segundo problema real: están
publicadas en la librería, cualquiera puede elegirlas desde el desplegable, y no significan
nada. Son también lo que más va a ensuciar cualquier intento de generación automática.

---

## Reglas ya decididas y dónde viven

Que un DS sea profesional no es tener más componentes: es que las decisiones estén escritas y
se puedan encontrar. Lo que ya está decidido:

| Regla | Documento |
|---|---|
| Cuándo es variante y cuándo componente nuevo (caso Tag) | `docs/design-system-rules.md` |
| `ContextMenu` → `BottomSheet` por debajo de 390px | `docs/design-system-rules.md` |
| `TabBar` en táctil: medidas y por qué | `docs/features/tabbar-touch-spec.md` |
| Tabs en dos niveles | `docs/features/tabs-dos-niveles.md` |
| Animaciones: qué se anima, dónde y con qué valores | `docs/project-summary.md` |
| Trampas de Figma → CSS (stroke Outside, bordes dobles) | `MEMORY.md` |

Ninguna de estas reglas está en Figma. Ese es el trabajo pendiente: **no reescribirlas, sino
llevar cada una a la descripción del componente al que afecta.**

---

## Qué NO está en este mapa

Para que nadie lo busque aquí:

- **Iconos**: 61 en Figma (página `-- Icons`), en código en `design-system/icons/`. Merecen su
  propio mapa; el pendiente conocido es centralizar el grosor de trazo, hoy `1.5` a mano en
  cada uno.
- **Pantallas**: viven en el archivo Web App (`sklnDzfw72Z1tDM46vkTGl`) y en `prototypes/`.
  Los flujos por rol están en `docs/features/center-admin-flujos-figma.md` y
  `team-admin-flujos-figma.md`.
- **Valores concretos** de cada token: aquí solo están los recuentos. La comparación valor por
  valor es el paso siguiente.

---

## Componentes ya igualados

Cuando un componente se compara a fondo y se resuelven sus diferencias, se anota aquí con lo
que hubo que tocar. Es el registro de lo que ya no hay que volver a mirar.

### `Segmented control` / `.Tab SC` — 26/09/2026

Figma quedó como fuente en todo. Cambios aplicados al código:

| Qué | Antes (código) | Ahora | Por qué |
|---|---|---|---|
| Fondo del hover en la opción inactiva | ninguno | `--color-bg-surface-raised` (#f4f5f5) | Solo oscurecer el texto es una señal débil; el fondo es lo que dice "esta vas a pulsar" |
| Padding del contenedor, tamaño M | 5px | 4px | El control medía 46px en vez de 44 |
| Padding del contenedor, tamaño S | 4px | 2px | Medía 33px en vez de 29 |
| Blanco del estado activo | `#fff` a mano | `--color-text-inverse` | El día que cambie el blanco del sistema, este componente no se queda atrás |
| Transición del hover | solo `color` | `background` y `color` | Al añadir el fondo, aparecía de golpe mientras el texto se atenuaba |

Ya coincidían y no se tocaron: las pastillas (8/16 en M, 4/12 en S), el radio 40, los colores del
estado activo (`#0b0f12` sobre borde `#32404d`), la tipografía (14/12, Book → Medium al activarse)
y **el hover sobre una opción ya activa, que en los dos lados no hace nada** — decisión correcta:
un elemento seleccionado no reacciona al ratón.

Queda en Figma: `Mode=Unactive` → `Inactive` (errata). La estructura de dos ejes (`Mode` = si está
elegido, `State` = qué hace el ratón) **está bien y no hay que cambiarla**.

---

### `Search bar` — 26/09/2026

| Qué | Antes | Ahora | Quién mandaba |
|---|---|---|---|
| Color del placeholder | `#9ca3af` | `#6b7280` | Figma |
| Alto total | 37,5px | 36px | Figma |
| Icono desde el borde | 14px | 12px | Figma |

El placeholder no era cosa del Search bar: en Figma los **cuatro** campos (Text input, Dropdown,
Text area, Search bar) usan la misma escala —`#6b7280` vacío · `#0b0f12` escrito · `#9ca3af`
bloqueado— y el código tenía el placeholder en `#9ca3af`, **el mismo valor que el texto
deshabilitado**. Un campo vacío se veía igual que uno bloqueado. Además `#9ca3af` sobre `#fafafa`
da 2,44:1 de contraste y no llega al mínimo AA de 4,5:1; `#6b7280` da 4,64:1. Se cambió el token
`--color-text-placeholder`, así que se arregla en los cuatro componentes y en los ~25 sitios de
los prototipos que lo usan.

Efecto colateral: el `BottomSheet` usaba ese token como **fondo** de la manija de arrastre. Se
desacopló para que no se oscureciera sin motivo; le falta un token propio.

Ya coincidían: fondo, borde, radio 40, gap 8, tipografía, hover, error, disabled y **el anillo de
foco, exacto hasta el grosor de las dos capas** (blanco 2px + turquesa 4px).

### La trampa del trazo, matizada — 26/09/2026

`MEMORY.md` dice que en Figma el trazo `INSIDE` se come el padding y el radio, y que hay que
restarlo al pasar a CSS. **Eso solo es cierto si "Strokes included in layout" está desactivado.**

Cuando ese ajuste está activo —como en el `Search bar`— Figma suma el trazo por fuera del
padding, igual que hace el `border` de CSS, y las medidas se copian tal cual:

```
Figma   trazo 1 + pad 8 + contenido 18 + pad 8 + trazo 1 = 36
CSS     border 1 + pad 8 + line-height 18 + pad 8 + border 1 = 36
```

Antes de copiar medidas de un componente hay que mirar ese ajuste. Copiar restando cuando está
activo deja el componente 2px estrecho — que es justo el error que se cometió y se corrigió aquí.

### Dos negros llamados `Black` — 26/09/2026

```
Global Colors    / Black  =  #221e1e     ← viejo
Global Colors 2  / Black  =  #0b0f12     ← el del código (`--color-text-strong`)
```

Dos colecciones, dos variables con el mismo nombre y distinto valor: quien elige "Black" en el
panel no puede saber cuál coge. Había **31 capas de componentes reales** enganchadas a la vieja
(Inputs 12, Dropdown 6, Buttons 6, Sidebar 6, Tab Bar 1) — incluido el texto de los botones
secundarios. Reenlazadas a `Semantic Colors / Content/Strong` el 26/9.

Es invisible a simple vista: `#221e1e` y `#0b0f12` no se distinguen en pantalla. Por eso sobrevivió.

Quedan a propósito 5 en la página `-- Colors` (documenta la paleta) y 1 en `Calendar`.

**Esto dio pie a la fusión de las dos colecciones**, que ocupó el resto del día — ver la sección
siguiente. Y una corrección de registro: aquí se escribió que borrar `Global Colors` sería
"limpio porque lo único que aporta es un negro equivocado". **Era falso**: tenía 10 variables
propias y 783 capas enganchadas.

---

### Fusión de las dos colecciones de color — 26/09/2026

Punto de partida: `Global Colors` (35 variables) y `Global Colors 2` (39), las dos publicadas, sin
que nada dijera cuál manda. No eran "vieja y nueva": cada una tenía cosas que la otra no, y dos
nombres coincidían con distinto valor.

**Resultado: `Global Colors` quedó con 0 capas y 0 aliases.** Falta comprobar el archivo Web App
antes de borrarla.

| Grupo | Qué se hizo | Capas |
|---|---|---|
| Valor idéntico | `Turquoise/51`→`Turquose/51` · `White` · `Red/65` · `Grey/98` · `Red/58` | 167 |
| Mismo nombre, otro valor | `Black` `#221e1e`→`#0b0f12` (fuera de la página `-- Colors`) | 17 |
| Sin equivalente | `Grey/70` `#b1b2b4` y `Grey/15` `#232727` **creadas** en `Global Colors 2` | 162 |
| Huérfano | `Grey/50` del `Toggle` → `Content/Subtle`, que es lo que usa el código | 4 |
| Archivo | `Green/50` y `Yellow/61` del Graveyard **desvinculadas** (hex fijo) | 10 |
| Aliases | 5 variables de `Semantic Colors` que tiraban de la vieja, reapuntadas | 5 |

Colores que cambiaron en todo el proceso: el `Black` viejo (17 capas, hacia el valor del código),
el `Grey/50` del Toggle (4) y `Data Colors/Usage` (`#414042`→`#32404d`, también el del código).
Todo lo demás fue cambiar de dónde cuelga cada capa, sin mover un píxel.

**Las dos lecciones que costaron tiempo:**

1. **Mirar solo capas no basta.** Se dio por terminada la migración con 0 capas enganchadas, y
   quedaban **5 variables de `Semantic Colors` que hacían alias a la vieja** — invisibles desde la
   capa, porque la capa apunta a `Content/Success` y es `Content/Success` quien tira de la vieja.
   Una de ellas, `Data Colors/Usage`, servía el valor equivocado de `Grey/25`.
2. **Los enlaces también viven en los trazos**, no solo en los rellenos. El primer recuento solo
   miraba `fills` y dejaba fuera decenas de `strokes`.

**Lo que no se puede tocar y por qué:**

- `Grey/70` `#b1b2b4` **no es sustituible por `Grey/65`**. Es el gris de las etiquetas de
  navegación del sidebar; `Grey/65` es el de las cabeceras de sección. Sobre el fondo oscuro del
  sidebar forman una escala de tres niveles con el blanco: blanco = ítem seleccionado, `#b1b2b4` =
  ítems navegables, `#9ca3af` = cabeceras e iconos. Aplastarla deja el sidebar plano.
- La página `-- Colors` se excluyó del reenlace de `Black`: documenta la paleta, y reenlazarla
  haría que el muestrario enseñara un color distinto del que dice su etiqueta.

**Pendiente para cerrarlo:**

1. Abrir el archivo Web App con el Desktop Bridge y contar qué cuelga de `Global Colors`
2. Marcar la colección como **oculta al publicar** (deja de sangrar, no rompe nada existente)
3. Borrarla

El paso 1 es obligatorio: la colección **está publicada**, así que las pantallas pueden depender
de ella. Si se borra con dependencias fuera, esas capas no se ven rotas — **se ven bien y dejan de
seguir al sistema**, que es peor.

### Cosas que quedaron nombradas — 26/09/2026

| Antes | Ahora |
|---|---|
| `Toggle` `State3` / `State4` | `Size=S` / `Size=M` — era el tamaño M sin nombrar |
| `Toolbar Button` `Variant4` | `State=Disabled` |
| `Radio button` `DEfault` | `Default` |
| `Search bar` `State6` | `Focus` — y Daniel le dibujó el anillo de foco, que no tenía |

Y el `Button` pasó a estar 100% sobre tokens semánticos: 10 capas que colgaban de colores base
(`White`, `Grey/65`, `Black`) ahora usan `Content/Inverse`, `Content/Disabled` y `Content/Strong`.

### Divergencias cerradas — 26/09/2026

Las cuatro que quedaban abiertas al acabar la fusión de colecciones, resueltas el mismo día.

**1 · Asterisco de campo obligatorio.** Figma `Red/65` `#fc664e` (colgado de un color base) contra
`--color-status-error` `#e04f4a` del código. **Ganó el código**: el contexto ya distingue un
asterisco de un error (el asterisco está en la etiqueta, el error es borde rojo y mensaje), es la
convención, y `#e04f4a` tiene mejor contraste (4,0:1 contra 3,4:1). 18 capas a `Content/Critic`,
que además quita uno de los últimos enganches a color base de los formularios.

Se descartó crear un `Content/Required`: era separar dos cosas que nadie confunde.

**2 · Hover del ítem de sidebar.** Figma usaba un sólido `#232727`; el código, `rgba(255,255,255,0.05)`.
**Ganó el código**, y se puede demostrar: el fondo del sidebar es un degradado `#0b0f12` → `#161d24`,
y el velo al 5% da `#171b1e` arriba y `#22282f` abajo. Un sólido encaja en un sitio y no en el otro
— `#232727` iluminaba de más los ítems de arriba.

Se creó la pareja que faltaba en los dos lados: `Background/Nav Hover` (con el alfa dentro del
token) y `Background/Nav Active`, que además dejó de colgar de `Grey/11`. En código,
`--color-bg-nav-hover` junto al `--color-bg-nav-active` que ya existía.

**3 y 4 · La escala de texto sobre fondo oscuro.** Eran el mismo problema. El sidebar tiene tres
niveles y solo uno tenía nombre:

```
#ffffff   ítem seleccionado          Content/Inverse/Strong   (antes Content/Inverse)
#b1b2b4   ítems navegables           Content/Inverse/Subtle   nuevo
#9ca3af   cabeceras, iconos, roles   Content/Inverse/Muted    nuevo
```

El `/` agrupa la familia en una carpeta, así que en el selector de Figma aparecen los tres juntos
y en orden. En código: `--color-text-inverse-strong` (renombrado, 56 apariciones en 17 archivos),
`-subtle` y `-muted`. El Sidebar deja de usar `--color-grey-65` y `--color-grey-70` a pelo.

Con eso `Content/Placeholder` quedó libre y **pasa a ser alias de `Content/Subtle`** — alias, no
copia del valor, para que no puedan separarse por descuido. Los cuatro campos se enganchan ahí:
mismo color que antes, pero el token dice dónde va.

**Ámbitos configurados** (lo único que *impide* el error, en vez de solo avisarlo): los tres
`Content/Inverse/*` quedan restringidos a texto, formas y trazos, y los dos `Background/Nav *` a
fondos. Un token de fondo ya no aparece al elegir el color de un texto.

**Lo que costó dos pasadas:** en el sidebar había dos caminos distintos para llegar al mismo
`#9ca3af` —unas capas por `Grey/65` y otras por `Content/Placeholder`— y la primera pasada solo
cubrió las primeras. Y tres enlaces vivían en `textRangeFills`: el color estaba en *un trozo* del
texto, no en el nodo entero, así que no aparecían mirando `fills`.

### Cómo sabe un diseñador qué color usar

Cuatro mecanismos, de menos a más fiable. Los tres primeros avisan; solo el tercero impide.

1. **El nombre lleva la superficie dentro.** `Content/Inverse/Subtle` ya dice para qué sirve.
   `Grey/70` no dice nada y `Sidebar Label` dice demasiado (¿y en un modal oscuro?). Se nombra la
   superficie y el nivel, que es lo que no cambia.
2. **La carpeta los agrupa.** La barra `/` crea carpetas reales en el selector: se ve la escala
   entera en vez de un color suelto.
3. **Los ámbitos.** Restringir cada variable a las propiedades donde tiene sentido. Es el único
   mecanismo que hace imposible el error.
4. **La documentación, en contexto.** Un muestrario de cuadraditos no enseña nada: sobre blanco
   todos los grises se parecen. Hay que pintar la superficie oscura y poner los tres niveles
   encima, con su nombre al lado.

---

### El Tag — 26/09/2026

Era el componente más desalineado de la librería: dos componentes en Figma, uno con 8 valores en
código, y tres familias de significado mezcladas en una sola lista de opciones.

**Se eliminó la familia de rol.** `user` y `professional` solo se usaban en `TeamDetail` de V1
—que está congelada desde el 21/9— y en su propia página de Storybook. La columna "Role" con
píldora no sobrevivió al rediseño de V2: hoy el rol se muestra como texto plano en la segunda
línea. En V1 se sustituyó por texto plano para que no quedara un tag sin estilo.

Con eso el Tag se queda en **dos familias**:

```
ciclo de vida     active · inactive · pending · expired
envío de correo   delay · delivered
```

**Decisiones tomadas donde los dos lados discrepaban:**

| Qué | Figma decía | Código decía | Gana |
|---|---|---|---|
| Nombre del estado | `Disabled` | `inactive` | **inactive** — "disabled" ya significa otra cosa en un DS (un control que no se puede pulsar); aquí es el estado de una organización o un equipo |
| Fondo del tag | `#f4f5f5` | `#fafafa` | **código** (`Background/Surface Subtle`) |
| Punto del Expired | naranja `#fda650` | gris `#9ca3af` | **Figma** |
| Texto del Expired | `#0b0f12` | `#6b7280` | **Figma** |

El naranja no existía en la paleta del código: se añadió `--color-orange-65`.

**El punto del Expired estaba cogido del sitio equivocado.** Colgaba de
`Semantic Colors / Hydration ranges / Over hydrated` — el naranja del gráfico de hidratación,
usado para una invitación caducada. El día que se ajuste la escala de hidratación, el tag habría
cambiado de color sin que nadie relacionara las dos cosas.

Se creó la familia `Status/*` que faltaba, en los dos lados:

```
Status/Active           Turquose/51    --color-status-active      (ya existía)
Status/Inactive         Red/75         --color-status-inactive    (ya existía)
Status/Pending          Red/58         --color-status-pending     nuevo
Status/Expired          Orange/65      --color-status-expired     nuevo
Status/Pending Surface  Red/91         --color-status-pending-surface
Status/Pending Text     Red/29         --color-status-pending-text
                        Yellow/47      --color-status-delay       nuevo
```

Los dos component sets quedan **al 100% sobre tokens semánticos**: ni un solo relleno colgando
de un color base.

**Pendiente:** partirlos en `Tag / Status` y `Tag / Delivery` usando la carpeta, para que no se
pueda elegir "Delivered" donde va un estado de entidad. Y `Tag / Delivery` todavía no existe en
Figma: `delay` y `delivered` solo están en código desde el 17/9.

**Tres veces me equivoqué al informar sobre este componente**, todas por describir sin mirar:
dije que el tag de rol tenía punto de color (no lo tiene, `NO_DOT` lo excluye), que el `Pending`
de Figma no tenía punto (sí lo tiene: es un `FRAME` de 8×8 llamado "Text", y mi búsqueda solo
miraba elipses) y que la familia de rol había que diseñarla en Figma (había que borrarla del
código). El patrón es siempre el mismo: **buscar por la forma que espero en vez de mirar lo que
hay.**

---

### Radios y anillo de foco — 26/09/2026

**Los radios ya estaban bien, y avisé de un problema que no existía.** Comparé el código contra
`Global Numbers`, que es la paleta cruda (8·12·16·24·40) y **no la usa ningún componente: 0 usos
directos**, que es justo lo que debe pasar con una paleta. Lo que los componentes usan es
`Border Radius`, la capa semántica, y esa cuadraba exacta con el código desde el principio.

Lección: antes de comparar dos listas, mirar **cuál de las dos se usa**. Había dos colecciones de
radios y elegí la que no era.

Lo que sí se limpió: `Border Radius` tenía los radios partidos por dispositivo
(`Desktop/*` y `Mobile/*`), y **las tres variantes Mobile tenían cero usos**. La escala responsive
se montó y no se usó nunca. Se borraron y se quitó el prefijo `Desktop/`, que prometía una
distinción que no existe.

```
Figma · Border Radius      Código
radius-xs   8        →     --radius-xs   8
radius-s    12       →     --radius-s    12
radius-m    24       →     --radius-m    24
radius-l    40       →     --radius-l    40
```

**Por qué una sola escala y no una por breakpoint:** un radio es una propiedad de la forma, no del
espacio disponible. El espaciado y la tipografía sí escalan con el ancho; un botón mide 36-40px de
alto en escritorio y en móvil, así que su esquina no tiene motivo para cambiar. Lo que sí cambia
en móvil no es el valor del radio sino si el componente lo tiene — una card que va de borde a
borde pierde las esquinas — y eso se resuelve en el componente, no en el token. Material 3,
Polaris, Carbon y Primer tienen todos una sola escala de forma.

### El anillo de foco

Estaba copiado ocho veces y no idéntico: `Input`, `Dropdown` y `Textarea` usaban `#fff` a pelo
mientras `SearchBar` usaba `var(--color-bg-surface)`. Ahora la receta vive en `--focus-ring` y
`--focus-ring-error`.

**Queda abierto y necesita decisión: el sistema tiene dos anillos de foco distintos.**

```
box-shadow con hueco blanco    Input · Dropdown · Textarea · SearchBar
outline simple                 Checkbox · SegmentedControl · Toggle · BottomSheet
```

Tabulando por un formulario que mezcle un campo y un checkbox, el indicador cambia de forma a
mitad de camino. Y en Figma solo los cuatro campos tienen variante `Focus` dibujada: `Checkbox`,
`Toggle` y `Segmented control` tienen estado de foco en código y no está diseñado.

---

### Sombras: de 33 valores sueltos a una escala — 26/09/2026

Antes: **0 estilos de efecto en Figma y 33 sombras escritas a mano en el código**. Al normalizar
notación (`0` vs `0px`, `0.10` vs `.1`, espacios) resultaron ser **20 sombras de elevación reales
en 65 sitios**, y muy mal repartidas: tres hacían el 60% del trabajo y el desorden estaba
concentrado en los menús, con **cinco sombras distintas para el mismo trabajo** — cuatro de ellas
en elementos llamados `filterDropdown` en pantallas diferentes.

Para elegir la de los menús se montó la página **`-- Elevation`** con los cinco candidatos
aplicados al mismo menú, sobre el mismo fondo, con su origen y su número de usos debajo. Ganó la
que ya usaba el `FilterPanel`: es la única con dos capas.

**La escala, idéntica en los dos lados:**

| Figma (Effect Style) | Código | Para qué |
|---|---|---|
| `Elevation/1` | `--elevation-1` | Cards, paneles y tablas. Lo que reposa sobre la página |
| `Elevation/2` | `--elevation-2` | Menús, desplegables y tooltips |
| `Shadow/Drawer` | `--shadow-drawer` | Panel anclado al borde derecho |
| `Shadow/Sidebar` | `--shadow-sidebar` | El sidebar sobre el fondo de la página |
| — | `--shadow-control-thumb` | La bolita del Toggle |

**Por qué el nivel 2 tiene dos capas** y los demás una: una sombra real tiene una parte oscura
pegada al objeto (el contacto) y otra que se difumina con la distancia. Con una sola capa hay que
elegir entre las dos, y el resultado se ve plano. Es el detalle que separaba la opción ganadora de
las otras cuatro.

**Tres cosas no entraron en la escala, a propósito:**

- El **drawer** tiene desplazamiento horizontal (`-8px 0`) porque está anclado al borde derecho.
  Eso no es un nivel de elevación, es la sombra de una pieza pegada a un borde.
- El **sidebar** igual: es estructura fija, no algo que flote.
- El **pulsador del Toggle** es una pieza que se mueve dentro de un control; su sombra solo lo
  separa del carril.

Un nivel se define por **cuánto flota algo sobre el fondo**. Si una sombra existe por otra razón
—dirección, estructura, separar dos piezas del mismo control— no pertenece a la escala aunque
visualmente se parezca.

**Pendiente:** falta el nivel 3, para lo que tapa el resto de la interfaz (modal, paleta ⌘K, tour,
Toast). Hoy son siete sombras sueltas, una por pantalla. Y en Figma queda una sombra de menú
usada 38 veces en `Calendar` que debería pasar a `Elevation/2` cuando ese componente se programe.

**Divergencia detectada de paso:** el pulsador del Toggle no coincide. Figma usa
`0 2 4 a0.14 + 0 0 1 a0.10`, el código `0 1px 3px rgba(0,0,0,.2)`.

---

### Tipografía — 27/09/2026

**Las primitivas coincidían exactamente.** `Font Size/12…32`, `Font Weight/book·medium·bold` y
`Font Family/Primary` en Figma = `--font-size-*`, `--font-weight-*` y `--font-family-primary` en
código. Seis tamaños, tres pesos, una familia, mismos valores.

Y eso confirmó que `--font-size-13` (6 usos) y `--font-size-15` (2 usos) **son un error**: no
existen en ninguno de los dos lados, así que el navegador descarta la declaración entera y el
texto hereda el tamaño del padre. Las ocho están en drawers de V1, congelada.

**Lo que no coincidía era el mecanismo.** En Figma la tipografía se *compone*: un estilo empaqueta
familia + tamaño + peso + interlineado y se aplica de una. En código se *descompone*: cada
componente elige tamaño y peso por separado, en 617 sitios.

Existía el equivalente —`text-styles.css`, 11 clases— pero **no lo usaba nadie**, y además decía
`line-height: normal` donde Figma dice valores explícitos.

Buena noticia al medir lo que se renderiza de verdad en V2: **49 de 72 interlineados siguen la
proporción de Figma** (el tamaño × 1,25 exacto). El desorden era menor de lo que parecía.

**Decisión: `text-styles.css` es la referencia, no se adopta.** Con 617 sitios declarando
tipografía, media adopción dejaría dos mecanismos conviviendo — peor que uno solo imperfecto. El
archivo se reescribió para que diga la verdad: los 14 estilos (faltaban `Headings/H3 Bold`,
`Body/S Book` y `Body/S Medium`), los interlineados reales, y una tabla que mapea cada clase con
su estilo de Figma. Sirve para responder "¿qué es exactamente un Body/M Medium?" sin abrir Figma.

### Los estilos de texto de Figma no usaban sus propias variables

Mismo caso que los radios y que las muestras de color: la capa de arriba no tiraba de la de
abajo. **Los 14 estilos tenían tamaño, peso y familia escritos dentro**, así que la colección
`Global Typography` no la usaba nadie y cambiar `Font Size/14` no movía nada.

Se ligaron los 14 a sus primitivas. Y faltaba una primitiva entera: **el interlineado**. Se
crearon seis, nombradas **por el tamaño con el que van** —`Line Height/14` = 17,5— para que se
vea que son pareja de `Font Size/14`. Las mismas seis existen ahora en código como
`--line-height-*`.

Los dos `Label/*` quedan con tres de cuatro: su interlineado es `auto` y Figma no permite ligar
una variable a `auto`. Es correcto: son textos de una sola línea.

**Aviso para quien repita esto:** `Line Height/17.5` **no es un nombre válido** — Figma no admite
puntos en el nombre de una variable. Y la referencia a una colección **caduca en cuanto creas una
variable**: hay que volver a pedirla en cada vuelta del bucle o la siguiente llamada falla.

### La variable que llevaba meses rota

`Font Family/Primary` tenía dentro el texto de relleno que Figma pone al crear una variable de
texto: literalmente **`"String value"`**. Nunca se rellenó.

No se notaba porque no la usaba nadie. Al ligarla a los estilos, los 14 pasaron a pedir una
fuente llamada "String value" y se rompieron a la vez. Se corrigió a `Circular Pro`.

El error de método fue ligar sin comprobar qué valía la variable — el mismo patrón que el rótulo
de `Content/Critic Strong` el día anterior: **actuar sobre el nombre sin verificar el contenido**.

---

### La familia `critic` — 27/09/2026

Tres tokens de código decían `status` o `error` para hablar del mismo rojo con tres papeles
distintos. Figma ya los tenía bien separados: `Content/Critic`, `Border/Critic` y `Status/Pending`
son tres nombres para `#e04f4a` **porque son tres papeles**, no una duplicación.

Lo que estaba mal era el vocabulario del código:

```
--color-status-error         →  --color-text-critic       Figma: Content/Critic
--color-border-error         →  --color-border-critic     Figma: Border/Critic
--color-status-error-subtle  →  borrado
```

59 apariciones en 30 archivos. Ningún color cambió.

**Lo que gana:** `--color-status-*` pasa a significar solo una cosa, el estado de una entidad
—active, inactive, pending, expired, delay— igual que el `Status/*` de Figma. Los dos intrusos
decían "status" y hablaban de errores: el prefijo prometía una familia a la que no pertenecían,
la misma confusión que tenía `Content/Placeholder`.

Y el vocabulario queda igual en los dos lados: `critic` aquí y `critic` allí, en vez de `Critic`
contra `error`.

**`--color-status-error-subtle` resultó ser código muerto.** Su único uso era `.unitReplaceAlert`,
el fondo de un aviso de "este K-POD necesita reemplazo" dentro del detalle de una unit — 29 líneas
de CSS que **ningún JSX renderizaba**. Alguien empezó la pantalla, escribió los estilos y no la
terminó. Se borró todo.

La primera propuesta fue renombrarlo a `--color-bg-critic` y crear `Background/Critic` en Figma.
Se descartó al ver que no lo usaba nadie: **habría sido construir un token para una pantalla que
no existe**, e inventarse una decisión de diseño para un caso hipotético. Si algún día se hace ese
aviso, ya está `--color-bg-critic-subtle` para probarlo.

**Y el comando cazó el renombrado en el acto**, porque el mapa seguía apuntando a los nombres
viejos. Primera vez que `ds:compare` atrapa algo en caliente en vez de en una auditoría.

---

### El nivel 3 de elevación — 27/09/2026

Quedaban 13 sombras sueltas, pero **solo 4 eran candidatas a nivel 3**. Las demás eran otra cosa:
el borde horizontal de un panel, un tooltip pequeño (nivel 2), una ilustración decorativa, el menú
de la scrapp (pantalla oscura, otro contexto) y cuatro de V1, congelada.

Las cuatro reales —Toast, paleta ⌘K y los dos del tour— se montaron en la página `-- Elevation`
flotando sobre contenido real, no sobre gris liso.

```
--elevation-3   0 12px 32px rgba(0,0,0,.22)  +  0 4px 10px rgba(0,0,0,.08)
```

**Dos decisiones que salieron de mirarlo, no de razonarlo:**

Primero recomendé la opción de dos capas más suave, por coherencia con `elevation-2`. Al ponerla
en fila con los otros niveles se vio que **no se distinguía del nivel 2**: un nivel que no se
separa del anterior no es un nivel. Ganó la más marcada.

Después Daniel propuso mantener esa fuerza pero añadirle la capa de contacto. Acertó: sin ella la
tarjeta **parece recortada y pegada encima** en vez de flotar apoyada. Se bajó la capa principal
de `.25` a `.22` porque al sumar la corta el conjunto se oscurecía de más.

La escala queda con una construcción única:

```
elevation-1   una capa    reposa sobre la página, no flota
elevation-2   dos capas   distancia + contacto
elevation-3   dos capas   distancia + contacto, un escalón más
```

El argumento de que "a mucha distancia no existe sombra de contacto" es físico y se descartó: un
sistema de diseño no es física, y la coherencia de construcción pesa más.

---

## Cómo mantener esto vivo

Este documento es una foto del 2026-09-26 y **se va a quedar viejo**, que es exactamente lo que
le pasa a todos los mapas de DS escritos a mano. Dos formas de evitarlo, y hay que elegir:

1. **Revisarlo a mano** cada vez que se publica la librería. Funciona hasta que alguien tiene
   prisa, o sea, funciona unas tres veces.
2. **Generarlo.** Las dos columnas de este mapa salen de leer los dos lados, y las dos
   lecturas son automatizables: el código con un script, Figma con el MCP. Lo que se escribe a
   mano es solo la interpretación — los ejes que se corresponden y por qué una diferencia es
   correcta.

La opción 2 es la que hay que montar, y es la tarea 9. Hasta entonces, la fecha de arriba es
la que dice cuánto hay que desconfiar de este documento.
