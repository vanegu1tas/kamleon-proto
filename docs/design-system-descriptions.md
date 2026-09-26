# Descripciones de los componentes para Figma

Texto listo para pegar en el campo **Description** de cada componente de la librería
(panel derecho, con el component set seleccionado).

Están en inglés porque la librería y la interfaz están en inglés. Si el equipo las lee mejor
en español, se traducen.

Criterio: una descripción no repite lo que se ve en el dibujo. Dice **cuándo usarlo**,
**cuándo no**, y las **reglas que el dibujo no puede mostrar**. Si una descripción se puede
deducir mirando el componente, no aporta.

Estado: 2026-09-26.

---

## Listas para pegar

### IconButton

```
Icon-only action. Always needs a tooltip.

Default for neutral actions. Danger for destructive ones — red appears on hover
only. Critical for a problem that already exists and needs attention — red in its
resting state.

Critical is not a style, it is a status: if nothing is wrong, don't use it.
```

### Contextual menu

```
Actions for a row or an object, opened from a ⋯ button.

Below 390px it renders as a Bottom sheet. The component does this on its own —
there is no variant to pick and no separate mobile design to make.

Destructive actions go last, in red, separated from the rest.
```

### TabBar

```
Switches between sections of the same screen. For mutually exclusive views of the
same data, use Segmented control instead.

On touch devices it always renders at size M (56px) even when S is requested:
S is 36px and falls below the minimum touch target.

The Tabs property enumerates 1 to 5 for drawing purposes only. The implementation
accepts any number of tabs.
```

### Button

```
Standard action button. Primary for the single main action of a view, Secondary
for actions beside it, Tertiary inside cards and rows where a bordered button
would be too heavy.

Only one Primary per view.

Hover and Disabled are drawn here for reference. In code they are states the
browser resolves, not properties to set.
```

### Toast

```
Confirms an action that just completed. Enters from the top, 52px from the edge.

Success when the action worked, Critic when it failed.

Never use it for something the user has to act on — if a decision is needed,
that's a modal.
```

### Tooltip

```
Short clarification shown on hover or keyboard focus.

Never put information that is needed to complete the task here: on touch devices
it is effectively invisible.
```

### Segmented control

```
Switches between two or three mutually exclusive views of the same data.

For moving between sections of a screen, use TabBar. Beyond three options, use
a Dropdown.
```

### Checkbox

```
Independent yes/no choice, applied when the form is submitted.

For mutually exclusive options use Radio button. For a setting that takes effect
the moment it is switched, use Toggle.
```

### Text input

```
Single-line text field.

Error and Disabled correspond to properties in code. Hover, Focus and Active are
drawn here because Figma cannot execute them.

The field sits on a light grey fill by default. On a grey surface (inside a card
or a drawer) switch it to white so it stays readable.
```

### Dropdown

```
Single-choice selector.

Error and Disabled correspond to properties in code. Hover, Focus and Active are
drawn here because Figma cannot execute them.

The field sits on a light grey fill by default. On a grey surface (inside a card
or a drawer) switch it to white so it stays readable.
```

### Text area

```
Multi-line text field.

Error and Disabled correspond to properties in code. Hover, Focus and Active are
drawn here because Figma cannot execute them.
```

**Ojo con esta**: no lleva el párrafo del fondo blanco sobre superficie gris, porque ese
estado (`onSubtle`) es el que hoy le falta en código. Cuando se añada, se le pone la línea.

### Toggle

```
Setting that takes effect the moment it is switched, with no confirmation.

For a choice that is applied when a form is submitted, use Checkbox.

Size S (40×24) is the default. Size M (56×32) is for touch surfaces and for
settings that are the main subject of the screen.
```

Se puede pegar ya: el eje `Size` quedó nombrado el 26/9.

---

## Las que esperan, y por qué

Una descripción que describe una estructura a punto de cambiar acaba mintiendo, y una
descripción que miente es peor que ninguna, porque la gente se la cree.

| Componente | Espera a |
|---|---|
| `Tag status` / `Tag status - invitations` | Decidir cuántas propiedades y unificarlos |
| `.Sidebar-Item` / `.Sidebar-Item2` | Saber cuál de los dos es el vivo |
| `Search bar` | Borrar `State6` (duplicado exacto de `Active`) |
| `Radio button` | Existir en código |
| `Accordion` · `Calendar` | Tener algún uso; describirlos hoy sería inventar |
| `Table Cell` | Decidir si las tablas se componen con él; es la deuda grande del sistema |
| `Sidebar-v2` | Retirar `❌ Sidebar-v1` de la librería |

---

## Cuando toque escribir las que faltan

El patrón de las de arriba, por si lo escribes tú:

1. **Qué es**, en una línea. Sin adjetivos.
2. **Con qué se confunde** y cuál usar en su lugar. Es la línea que más tiempo ahorra.
3. **La regla invisible**: lo que el componente hace solo, o el límite que no se ve.

Lo que no va nunca: medidas que se leen en el panel, lista de variantes que ya está en el
desplegable, ni "componente reutilizable y flexible".
