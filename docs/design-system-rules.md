# Reglas del Design System

Decisiones transversales sobre cómo crecen los componentes. Se aplican tanto en Figma como en código.

---

## Variante o componente nuevo

**Regla:** si dos elementos se ven casi iguales y se comportan igual, son **el mismo componente con otra variante**, no dos componentes.

Se crea un componente nuevo solo si se cumple alguna de estas condiciones:

- **Cambia el comportamiento** — uno es interactivo y el otro no, uno tiene acciones o iconos propios.
- **Cambia la estructura** — no alcanza con cambiar colores o textos para pasar de uno al otro.
- **La API se llenaría de condicionales** — hay tantas props que solo aplican a un caso que el componente se vuelve difícil de usar.

Si lo único que cambia son **colores o estados**, es una variante.

**Por qué:** dos componentes que hacen lo mismo se desincronizan. Alguien ajusta el radio o el tamaño del punto en uno y se olvida del otro, y con el tiempo nadie sabe cuál usar. Además obliga a decidir en cada pantalla, con una regla que vive en la cabeza de alguien y no en el código.

### Cómo se estructuran las variantes en Figma

**Una sola propiedad con todos los valores**, en lista plana:

```
Tag
└─ Status:  Active · Inactive · Pending · Expired · Professional · User
```

**No** dos propiedades donde una depende de la otra:

```
Tag
├─ Status: Active · Inactive              ← ✗ no hacer esto
└─ Invitation status: Pending · Expired
```

Figma cruza cada valor de una propiedad con cada valor de la otra, así que aparecen combinaciones que no existen ("Active" + "Expired") y quien usa el componente tiene que saber cuáles son válidas.

Una segunda propiedad se agrega solo cuando es **ortogonal**: cuando aplica a todos los valores de la primera sin dejar huecos. Por ejemplo, un tratamiento visual que exista para todos los estados:

```
Tag
├─ Status: Active · Inactive · Pending · Expired
└─ Tone:   Subtle · Solid          ← aplica a los cuatro, la matriz se llena entera
```

### Que un estado se use en un solo contexto no lo convierte en otro componente

Es una **regla de uso**, y va escrita en la descripción del componente:

> Estados de invitación: Pending, Expired. Estados de entidad: Active, Inactive.

### Los nombres de las variantes son los mismos que en código

`active`, `inactive`, `pending`, `expired`. Permite mirar un diseño y saber qué escribir, y es condición para Code Connect.

---

## Caso que originó la regla — Tag (2026-09-16)

Existían dos componentes: el `Tag` del design system (Active / Inactive) y otro hecho aparte para los estados de invitación, con las mismas características visuales.

Al compararlos, la única diferencia real era el color del texto del estado Pending. Active se veía igual en los dos, que es la señal de que eran el mismo objeto.

**Resuelto en código:** los estados de invitación son valores de `status` en el `Tag` existente. Se corrigió además el texto de Pending, que pasó de Red/58 a **Red/29**: sobre el fondo Red/91, el rojo anterior daba 2.9:1 de contraste, por debajo del mínimo AA de 4.5:1. Red/29 da 7.22:1.

**Pendiente en Figma:** absorber el componente suelto dentro del `Tag` del design system (ver "Unificar el componente Tag en el DS" en `docs/project-summary.md`).

---

## TabBar en touch (≤768px)

**Regla:** en pantallas táctiles el TabBar se comporta distinto que en desktop, y **lo decide el componente**, no cada pantalla.

| | Las pestañas entran | No entran |
|---|---|---|
| Tamaño M (48px de alto, texto 16) | ✅ | ✅ |
| Margen lateral (`inset`, si el contenedor no tiene padding) | ✅ | ✅ se desplaza con las pestañas |
| Scroll horizontal | — | ✅ |
| Flecha + degradado en el borde | — | ✅ del lado donde quedan pestañas ocultas |

### Por qué cada punto

- **Tamaño M aunque la pantalla pida S.** S mide 36px de alto, por debajo del mínimo táctil (44-48px). No puede depender de que alguien se acuerde de cambiarlo.
- **Flecha + degradado.** Una pestaña que no se ve, para el usuario no existe. Sobre fondo blanco un degradado solo no alcanza (se lee como que la fila termina ahí), y la flecha sola se ve pegada; juntos, el texto se desvanece y la flecha queda apoyada encima, sin fondo propio. Aparecen y desaparecen solos según el scroll: flecha derecha si hay pestañas a la derecha, izquierda si ya te desplazaste. Al tocarla, la fila avanza.
- **El margen va dentro del área que se desplaza**, no en el contenedor. En reposo se ve como un margen normal; al desplazarse, las pestañas pasan por debajo del borde de la tarjeta. Con el margen en el contenedor quedaban franjas blancas fijas a los costados que hacían parecer que la fila terminaba.

### Descartado

- **Calcular anchos para que una pestaña quede cortada a mitad de palabra.** Se rompe con el selector de idioma ("Users" / "Usuarios" / "Utilisateurs" miden distinto) y con la cantidad de pestañas, que cambia según el rol.
- **Ensanchar las pestañas en mobile.** Solo servía para el punto anterior, y empeora el problema: más pestañas fuera de pantalla.
- **Solo degradado, sin flecha.** Invisible sobre blanco.

### En código

`<TabBar tabs={…} activeTab={…} onChange={…} size="s" inset={16} />`

- `size` aplica en desktop; en touch siempre es M.
- `inset` (px): usarlo cuando el contenedor **no** tiene padding lateral. No es automático porque la mayoría de las pantallas ya envuelve los tabs en un contenedor con padding, y se duplicaría.
- `scrollable` quedó solo por compatibilidad: en touch el scroll está siempre activo.

### En Figma

No es un componente nuevo ni una variante: es **comportamiento** del mismo TabBar. Se documenta en la descripción del componente y en un frame de especificación al lado. Figma no puede reproducir el scroll, así que dibujar variantes con flecha invita a colocarla a mano en cada pantalla, cuando la decide el componente.

---

## Menús contextuales en teléfono (≤390px)

**Regla:** en teléfono, el `ContextMenu` se muestra como `BottomSheet` en vez de menú flotante. **Lo decide el componente**: ninguna pantalla lo tiene que pedir, así que aplica a los 21 menús del prototipo (los "⋯" de las tablas, los "+" de organización, centro y equipo, etc.).

**Por qué:**
- **Tamaño de toque.** Las opciones del menú flotante miden ~36px de alto; las del bottom sheet, 56px.
- **Un solo patrón en mobile.** Las cards de la tabla de Admins ya abren sus acciones en un bottom sheet; con esta regla, la cabecera y el resto de las tablas hacen lo mismo.
- **Acciones destructivas.** En un menú chico, "Delete organization" queda a un dedo de "Org settings". En el sheet tiene su propia fila.

**En tablet no aplica:** hay espacio y el menú flotante no queda apretado contra el borde.

**En código:** `ContextMenu` acepta un `onClose` opcional (cerrar con Escape o arrastrando la manija). Si no se pasa, simula un toque afuera, que es como todas las pantallas ya cierran sus menús. El `BottomSheet` bloquea que los toques dentro del panel lleguen al documento: sin eso, tocar una opción cerraba el menú antes de registrar la elección.

**En Figma:** es comportamiento, igual que la regla del TabBar en touch. Se documenta en la descripción del ContextMenu, no con variantes.

---

## Las tres capas de color, y qué va en cada una (2026-09-26)

```
Paleta       Global Colors 2      Grey/11 · White · Red/58        el color, sin significado
Semántica    Semantic Colors      Background/Nav Active           el papel que juega
Componente   Button, Sidebar…     usa SIEMPRE la capa semántica
```

**Un componente nunca apunta a la paleta.** Si `Button` cuelga de `Grey/65` en vez de
`Content/Disabled`, el día que cambie el gris del texto deshabilitado hay que ir capa por capa,
y nadie se entera de que se quedó atrás. El 26/9 se encontraron 31 capas así, todas colgando de
un `Black` que valía `#221e1e` mientras el resto del sistema usaba `#0b0f12`. La diferencia es
invisible a simple vista: por eso sobrevivió meses.

### Las transparencias van en la capa semántica, no en la paleta

**La paleta solo tiene colores sólidos.** Una variable con alfa —`rgba(255,255,255,0.05)`— se
define directamente en `Semantic Colors`, sin apuntar a ningún color base.

El motivo: un 5% de blanco **no es un color, es un comportamiento** — "aclara un 5% lo que tengas
debajo". Eso describe el papel, no el pigmento. Si las opacidades entran en la paleta, acaba
llenándose de `White 10%`, `White 20%`, `Black 40%`… y deja de ser una escala.

Aplica a los velos de hover, al fondo oscuro detrás de un modal, a las sombras (negro con alfa) y
a los degradados de desvanecido.

**Caso que originó la regla:** el hover del ítem del sidebar. El fondo del sidebar es un degradado
(`#0b0f12` arriba → `#161d24` abajo). Figma lo resolvía con un sólido `#232727`, que encaja abajo
pero arriba queda demasiado claro; el código ya usaba `rgba(255,255,255,0.05)`, que aclara lo que
tenga debajo sea lo que sea. Se creó `Background/Nav Hover` en la capa semántica con el alfa
dentro, y su pareja `Background/Nav Active`, que sí es un alias de `Grey/11` porque es sólido.

### Un token semántico se nombra por el trabajo, nunca por el color ni por el sitio

`Content/Subtle`, no `Grey Medium` ni `Sidebar Header`. Por el color, porque el color cambia.
Por el sitio, porque mañana lo usarás en otro.

**Dos tokens con el mismo valor se justifican solo si puedes contar una situación realista en la
que uno cambiaría y el otro no.** Si no se te ocurre ninguna, sobra uno.

Ejemplo de que sí: `Content/Disabled` y el gris apagado del sidebar valen los dos `#9ca3af`, pero
el texto deshabilitado está exento de los mínimos de contraste y una cabecera de sección no. El
día que se revise accesibilidad, uno se mueve y el otro no.

Ejemplo de que no: un `Content/Placeholder` distinto de `Content/Subtle` cuando el placeholder y
la descripción del campo están a tres píxeles el uno del otro. Salvo que ya existan cientos de
capas usándolo, en cuyo caso el coste de fusionarlos supera al de mantenerlos.

### Cuidado con los nombres que mienten

Un token puede estar bien cableado y aun así ser un problema si su nombre no describe lo que hace.
`Content/Placeholder` no la usa ningún placeholder: la usa el sidebar para sus cabeceras de
sección. Quien busque el color de un placeholder la encuentra y la usa, y quien cambie su valor
repinta el sidebar sin saberlo.

Antes de renombrar una variable así, mirar **quién la usa de verdad**. Cambiarle el valor porque
el nombre sugiere una cosa, sin comprobar la otra, repinta lo que no tocaba.

---

## Cómo se nombra un token (2026-09-26)

### La prueba: ¿puedo decir para qué sirve sin nombrar un componente?

Si la respuesta es sí, es un token semántico. Si es no, o describe una pieza concreta y hay que
subirlo de nivel, o le falta un nombre mejor.

```
"el color que significa activo"                     ✓  Status/Active
"texto secundario sobre superficie oscura"          ✓  Content/Inverse/Subtle
"un fondo rojo pálido para avisos"                  ✓  Background/Critic Subtle
"el fondo del tag cuando está pendiente"            ✗  describe una pieza
```

El último caso ocurrió de verdad: `Status/Pending Surface` y `Status/Pending Text` nacieron
describiendo la anatomía de un tag. Renombrados a `Background/Critic Subtle` y
`Content/Critic Strong`, valen también para un banner de error o una fila marcada — el tag deja
de ser el dueño del color y pasa a ser solo el primer sitio donde se usó.

**No se monta una tercera capa de tokens de componente** (`Tag/background/pending`). Esa capa
compensa cuando hay varias marcas, varios temas o equipos que no se hablan, porque permite
cambiar un componente sin tocar los demás. Con un diseñador y un programador solo añade un sitio
más donde algo se puede desincronizar. Dos capas bien nombradas valen más que tres a medias.

### Una superficie oscura no es el modo oscuro

Son cosas distintas y se confunden constantemente:

- **Modo oscuro**: toda la aplicación cambia y *los mismos tokens pasan a valer otra cosa*. Se
  resuelve con **modos** en la colección de variables y, en CSS, con un bloque que redefine los
  tokens. No existe en este sistema y no hace falta todavía.
- **Una zona oscura**: el sidebar es oscuro siempre, mientras el resto de la app es clara. No es
  un modo: es una superficie con su propia escala de contenido.

El sidebar seguiría siendo oscuro aunque mañana se implemente el modo oscuro. Por eso la familia
`Inverse` no se toca el día que eso ocurra: seguirá significando "sobre superficie oscura".

```
Content/Inverse/Strong · Subtle · Muted      el texto
Background/Inverse/Hover · Selected          los fondos
```

El nombre dice **sobre qué** vive el color, no **dónde** se usa hoy. Estos dos fondos se llamaron
primero `Background/Nav *`, y "nav" describe el patrón pero se queda corto: el hover es blanco al
5% precisamente porque el fondo es oscuro; sobre blanco no funcionaría.

**`Selected`, no `Active`**: en un design system "active" suele significar *pulsado en este
instante*. El ítem en el que estás es `Selected`.

### Tokens que van en pareja: superficie teñida + su texto

Un fondo de color obliga a un texto pensado para ese fondo, porque el texto normal deja de
cumplir contraste:

```
Content/Critic        #e04f4a  sobre  #fad6d4   →  2,91:1   ✗
Content/Critic Strong #8b0e0a  sobre  #fad6d4   →  7,22:1   ✓
```

Los dos se documentan como pareja y la descripción de cada uno nombra al otro. Es el patrón que
Material llama `errorContainer` / `onErrorContainer`.

**El nombre no siempre alcanza**, y para eso está el campo de descripción de la variable.
"Strong" suena a énfasis cuando la razón real es "va encima del fondo teñido": eso se escribe en
la descripción, no se resuelve alargando el nombre.

### Lo que no puede ser una variable de color

Una variable guarda un color, **no un degradado**. El fondo del sidebar
(`#0b0f12` → `#161d24`) vive dentro del componente. Si hace falta tokenizarlo, se hace con un
estilo de relleno, que es otro mecanismo.

---

## Cuando el rótulo y el enganche no coinciden (2026-09-26)

En una página de documentación, una muestra de color puede tener el rótulo diciendo una cosa y el
relleno enganchado a otra. **Hay dos historias posibles y llevan a arreglos opuestos:**

1. Alguien cambió el color y no actualizó el texto → **el enganche es la verdad**, hay que
   reescribir el rótulo.
2. Alguien escribió el nombre de lo que iba a hacer y todavía no lo hizo → **el rótulo es la
   intención**, hay que reenganchar la muestra.

La segunda es lo normal cuando el trabajo está a medias, y es fácil de distinguir: **si el nombre
del rótulo corresponde a una variable que existe, es la intención.** Si no corresponde a nada, es
basura y se reescribe.

Se descubrió a base de equivocarse: al ver `Content/Critic Strong` con la muestra enganchada a
`Content/Critic`, se corrigió el rótulo — y el resultado fue duplicar la fila anterior y borrar
la intención de quien la había creado.

### Y las muestras se enganchan al token, nunca al color base

Una muestra que apunta a `Grey/46` en vez de a `Content/Subtle` **deja de seguir al sistema**: el
día que el token se repunte, la página sigue enseñando el color viejo y nadie lo nota, porque el
cuadrado se ve igual de bien. Pasó con el negro: `Content/Strong` cambió de `#221e1e` a `#0b0f12`
y la documentación no se movió.

---

# Quién manda en cada capa (2026-09-27)

Este sistema no nació antes que el producto: se fue destilando de pantallas que ya existían,
trabajando unas veces primero en Figma y otras primero en código. Eso es normal y va a seguir
siendo así, porque poder empezar por donde convenga es más rápido que obligarse a un único
origen.

Por eso **"quién manda" no se decide de una vez para todo el sistema**. Se decide por capa, y hay
una cosa que no se decide nunca porque no admite excepción.

## La regla corta

```
TOKENS Y NOMBRES     se emparejan SIEMPRE, el mismo día, con el mismo nombre
COMPONENTES          Figma manda en la intención visual
                     el código manda en el comportamiento
                     un número les gana a los dos
PANTALLAS            manda el código: el prototipo es lo que se prueba
                     Figma documenta los flujos, no los persigue
VOCABULARIO          manda el significado, no el lado
```

Y la que resuelve el problema de raíz:

> **La implementación puede ir por detrás. El nombre, no.**

Si se dibuja algo hoy y el código tarda dos semanas, no pasa nada. Pero el nombre tiene que
existir en los dos sitios desde el primer día, aunque de un lado sea solo un token declarado y
sin usar todavía. **Un nombre inventado dos veces son dos nombres.**

---

## Por qué esa y no otra

El 26/9 se resolvieron trece divergencias. Seis las ganó Figma, cinco el código, y dos no eran
conflicto sino errata. Lo revelador es que **el criterio no fue el tipo de propiedad**: hay
colores y medidas en los dos grupos.

### Figma manda en la intención visual

| Caso | Figma | Código |
|---|---|---|
| Color del placeholder | `#6b7280` | `#9ca3af` |
| Alto del Search bar | 36px | 37,5px |
| Icono desde el borde | 12px | 14px |
| Punto y texto del Expired | naranja y negro | gris y gris |
| Sombra del pulsador del Toggle | dos capas | una |
| Sombra de los menús | la del FilterPanel | cinco valores distintos |
| Paddings del Segmented control | 4 y 2 | 5 y 4 |

Qué color, qué tamaño, cuánta sombra: eso se decide mirando, y mirar es lo que se hace en Figma.
La sombra de los menús se eligió montando la página `-- Elevation` con los cinco candidatos
aplicados al mismo menú. Ningún argumento escrito habría sustituido a verlos juntos.

### El código manda en el comportamiento

**El hover del ítem de sidebar.** Figma lo tenía como un sólido `#232727`; el código, como blanco
al 5%. Ganó el código, y no por ser código: el fondo del sidebar es un degradado `#0b0f12` →
`#161d24`, y un velo translúcido aclara lo que tenga debajo sea lo que sea, mientras que un
sólido solo encaja a una altura. `#232727` iluminaba de más los ítems de arriba.

Figma solo puede dibujar un fotograma. Cuando la diferencia está en **cómo algo se adapta** —a un
fondo, a un estado, a un tamaño de pantalla— el código es el único que puede demostrarlo.

Corolario: los ejes que existen solo en un lado **no son divergencias**. `State=Hover` en Figma
es un `:hover` en CSS; que el código no tenga la propiedad es correcto, no un fallo. El mapa
distingue los ejes que se corresponden de los que son propios del medio.

### Un número les gana a los dos

**El asterisco de campo obligatorio.** Figma tenía `Red/65` `#fc664e`, el código
`#e04f4a`. La intención de Figma era legítima —un rojo más claro para no confundirlo con un
error— pero sobre blanco da 3,4:1 contra 4,0:1. Ganó el número.

Cuando hay una medida objetiva —contraste, tamaño mínimo táctil, un mínimo de accesibilidad— no
es una discusión de criterio. Se mide y se acata.

Y al revés: cuando el número apunta al mismo sitio que la intención, no hay conflicto. El
placeholder lo ganó Figma **y** lo ganaba el contraste (2,44:1 → 4,64:1).

### En el vocabulario manda el significado

`Disabled` (Figma) contra `inactive` (código), para el estado de una organización o un equipo.
Ganó `inactive`, no por venir del código, sino porque **"disabled" ya significa otra cosa** en un
design system: un control que no se puede pulsar. Dos conceptos distintos no pueden compartir
nombre.

Lo mismo con `Selected` en vez de `Active` para el ítem del sidebar: "active" suele significar
*pulsado en este instante*.

---

## De dónde vino de verdad el desorden

Casi ninguna divergencia del 26/9 era "este color está mal". El color solía coincidir. Lo que se
había separado era **el vocabulario**:

```
dos variables llamadas Black con distinto valor          #221e1e y #0b0f12
Content-strong en la página · Content/Strong en la variable
Background/Nav en Figma · sin equivalente en código
Turquose con errata, y el 61 sacado del hex en vez de la luminosidad
--color-status-error sin equivalente en Figma
Status/Pending Surface describiendo una pieza, no un papel
```

Ninguna se separó por ir a distinta velocidad. **Se separaron porque cada lado bautizó lo mismo
por su cuenta.** De ahí la regla del nombre.

---

## Qué hace falta para que esto aguante

La regla del nombre solo funciona si **algo avisa cuando se rompe**, porque nadie se acuerda a
los seis meses. Por eso la detección automática de diferencias no es un capricho técnico: es lo
que convierte ordenar la casa en algo que se hace una vez.

Dos de los hallazgos del 26/9 lo dejan claro:

- `#221e1e` y `#0b0f12` son **indistinguibles en pantalla**. El negro equivocado sobrevivió meses
  en 31 capas de componentes publicados porque no hay forma humana de verlo.
- La documentación decía `#E04F4A` (rojo) donde el token valía `#75cc6e` (verde). Nadie lo notó
  porque nadie compara un rótulo con su variable a mano.

Cinco de los diez commits de ese día arreglan cosas que nadie sabía que estaban mal. Ninguna se
encuentra mirando: solo comparando.
