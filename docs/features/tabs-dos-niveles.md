# Tabs en dos niveles (Organización → Centro)

Decisión 2026-09-15. Aplica a Kamleon Staff (Owner/Admin/Editor) y Org Admin en `OrgDetailV2`.

## Problema

Staff y Org Admin ven dos filas de tabs a la vez: los de la organización (Centers · Users · Details · Units · Admins) y, dentro del tab Centers, los del centro seleccionado (Details · Teams · Users · Units · Admins). Usan el mismo componente (`TabBar size="s"`), tienen el mismo tamaño y nombres repetidos, así que no se distingue a qué nivel pertenece cada uno.

La repetición **no es un error**: son los mismos datos en dos alcances distintos (toda la organización / un centro) y los dos roles necesitan ambos.

El manager planteó la regla "no tabs dentro de tabs".

## Base en Carbon Design System (Tabs, v10)

- Las variantes line y contained *"are hierarchically the same and should never be nested within each other"*: lo que Carbon prohíbe es anidar tabs del **mismo nivel jerárquico**.
- El line tab *"can also be nested within components. It is commonly used with smaller content areas"*: **sí se permiten tabs dentro de un componente acotado**.
- Nuestro caso: los tabs de la organización son de página; los del centro viven dentro de la card del centro, que es un componente acotado.
- Es una **interpretación** de la guía, no un ejemplo literal de Carbon. Por eso la jerarquía entre los dos niveles tiene que verse con claridad.

Fuente: https://v10.carbondesignsystem.com/components/tabs/usage/

## Solución

### 1. Estilo distinto por nivel

```
Acme
 Centers   Users   Details   Units   Admins      ← nivel 1: TabBar actual (línea)
 ‾‾‾‾‾‾‾
 ┌────────────────────────────────────────────┐
 │ (M) Madrid Centro                  [Edit]  │
 │                                            │
 │ (Details)(▐Teams▌)(Users)(Units)(Admins)   │  ← nivel 2: variante secundaria (píldoras)
 └────────────────────────────────────────────┘
```

- Nivel 1 (organización): TabBar actual, con línea/subrayado.
- Nivel 2 (centro): variante secundaria, visiblemente más liviana (por ejemplo, píldoras).
- Crear una variante "secondary" del TabBar en el design system. **No reutilizar SegmentedControl**, que sirve para cambiar vistas de un mismo contenido.
- Revisar que 5 opciones funcionen a 390px (scroll horizontal, igual que el patrón de overflow actual).

### 2. Título con contexto dentro del tab (no en el label del tab)

```
 (Details)(Teams)(▐Users▌)(Units)(Admins)

 Users in Madrid Centro (48)          🔍  [Filters]
 ─────────────────────────────────────────────────
```

- Labels de tabs cortos e iguales para todos los roles: Details · Teams · Users · Units · Admins.
- El alcance se indica en el título del contenido: "Users in Madrid Centro (48)".

## Alternativas descartadas

- **"Center users" / "Center admins" como label**: labels largos (ya hay scroll en 768), prefijo inconsistente si no va en todos los tabs, redundante dentro de la card del centro y sin sentido para Center Admin.
- **Solo el número en el tab, "Users (48)"**: no indica el alcance. Sirve como complemento, no como solución.
- **Sacar Users del centro y reemplazarlo por un acceso directo a Users de la organización filtrado**: te saca de contexto (salta de tab) y hace que la card del centro sea distinta según el rol. Center Admin igual necesita el tab Users en el centro, porque es su nivel más alto.
- **Drill-down (ocultar los tabs de la organización al entrar a un centro)**: cumple la regla estricta de una sola fila de tabs, pero se pierde el master-detail (lista de centros al lado). Queda como **plan B** si el manager insiste.

## Pendiente

- [ ] Diseñar el tab secundario en Figma (Design System) antes de implementarlo.
- [ ] Agregar la variante secundaria a `design-system/components/TabBar/`.
- [ ] Aplicarla en `CenterCard` (`prototypes/StaffOrganizacionesV2/screens/OrgDetailV2.jsx`) y agregar el título con contexto en cada tab del centro.
