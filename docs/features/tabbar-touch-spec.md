# TabBar en touch — cómo documentarlo en Figma

Pendiente de Daniel (2026-09-16). La regla ya está aplicada en código (`design-system/components/TabBar/`) y explicada en `docs/design-system-rules.md` → "TabBar en touch". Este archivo es solo la guía para armar la documentación en el archivo del Design System.

## Decisión

**Regla, no componente ni variante.** Es comportamiento del mismo TabBar según el contexto. Figma no reproduce el scroll: si se dibujan variantes "con flecha", el diseñador la coloca a mano en cada pantalla, cuando en realidad la decide el componente según quepan o no las pestañas.

En Figma van dos cosas:
1. Un **frame de especificación** al lado del componente TabBar.
2. Una línea en la **descripción del componente** que remita al frame.

## Frame de especificación

```
┌───────────────────────────────────────────────────────────────────────┐
│  TabBar — comportamiento en touch (≤768px)                            │
│  Lo aplica el componente. No se configura por pantalla.               │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  1. TAMAÑO                                                            │
│  ┌─────────────────────────────┐   ┌─────────────────────────────┐    │
│  │ Desktop · S · 36px          │   │ Touch · M · 48px            │    │
│  │  Centers  Users  Details    │   │  Centers  Users  Details    │    │
│  │  ‾‾‾‾‾‾‾                    │   │  ‾‾‾‾‾‾‾                    │    │
│  └─────────────────────────────┘   └─────────────────────────────┘    │
│  → En touch siempre M: S queda por debajo del mínimo táctil (44px).   │
│                                                                       │
│  2. CUANDO LAS PESTAÑAS NO ENTRAN (390px)                             │
│                                                                       │
│  a) En reposo                                                         │
│  ┌─────────────────────────────────────┐                              │
│  │16│ Centers  Users  Details  Uni░░ › │   ← degradado + flecha       │
│  │  │ ‾‾‾‾‾‾‾                          │     del lado con pestañas    │
│  └─────────────────────────────────────┘     ocultas                  │
│   ↑ margen de 16px                                                    │
│                                                                       │
│  b) Desplazado a la mitad                                             │
│  ┌─────────────────────────────────────┐                              │
│  │ ‹ ░░ers  Details  Units  Adm░░ ›    │   ← flecha a ambos lados     │
│  └─────────────────────────────────────┘                              │
│                                                                       │
│  c) Al final                                                          │
│  ┌─────────────────────────────────────┐                              │
│  │ ‹ ░░ails  Units  Admins          16│   ← solo flecha izquierda    │
│  └─────────────────────────────────────┘                              │
│                                                                       │
│  3. CUANDO ENTRAN                                                     │
│  ┌─────────────────────────────────────┐                              │
│  │16│ Details  Teams  Admins           │   ← sin flecha ni degradado  │
│  └─────────────────────────────────────┘                              │
│                                                                       │
│  REGLAS                                                               │
│  • La flecha y el degradado aparecen solos según el scroll.           │
│  • Tocar la flecha avanza la fila.                                    │
│  • El margen va dentro del área que se desplaza: al moverse, las      │
│    pestañas pasan por debajo del borde, sin franja blanca.            │
│  • No se calcula el ancho para cortar a mitad de palabra: se rompe    │
│    con el idioma y con la cantidad de pestañas por rol.               │
└───────────────────────────────────────────────────────────────────────┘
```

Los estados **b** y **c** son los que más le sirven al programador: sin ellos es fácil implementar solo la flecha derecha, olvidar la izquierda, o dejar la derecha visible cuando ya se llegó al final.

## Medidas para dibujarlo

| Elemento | Valor |
|---|---|
| Alto en touch (M) | 48px, texto 16px (Body/L) |
| Alto en desktop (S) | 36px, texto 14px |
| Degradado | 56px de ancho, de `Background/Surface Default` al 35% → transparente |
| Flecha | Chevron mini 20px, color `Content/Subtle` (`Content/Strong` en hover), área de toque 32×32, a 4px del borde |
| Margen lateral | 16px, dentro del área de scroll |
| Avance al tocar la flecha | ~60% del ancho visible |

## Descripción del componente

> En touch (≤768px) pasa a tamaño M y, si las pestañas no entran, muestra scroll con flecha y degradado. Lo aplica el componente, no se configura por pantalla. Ver frame "TabBar — comportamiento en touch".
