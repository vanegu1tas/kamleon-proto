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
