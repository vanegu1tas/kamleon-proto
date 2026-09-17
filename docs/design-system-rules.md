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
