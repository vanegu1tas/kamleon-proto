# Project Summary — Kamleon Design System

Estado del proyecto al 2026-03-08. Referencia rápida para retomar el trabajo.

---

## Qué es esto

Repositorio de diseño y documentación de la plataforma interna de staff de Kamleon. El objetivo es tener una **single source of truth** que conecte el diseño en Figma con los tokens y componentes del repo, para iterar y prototipar features rápidamente.

Stack: **React + CSS Modules**. Diseño en **Figma**. Catálogo de componentes en **Storybook**.

---

## Modelo de datos

```
ORGANIZACIÓN
└── CENTRO
    ├── EQUIPO
    │   └── USUARIO  (pertenece a exactamente un equipo)
    └── ADMIN DE CENTRO  (tiene 2 cuentas: admin + usuario personal)
```

**Cardinalidad:**
- Organización → Centro: 1:N
- Centro → Equipo: 1:N
- Centro → Admin de Centro: 1:N
- Equipo → Usuario: 1:N

**Estados:** solo activo / inactivo. Sin otros estados.

Referencia completa: [`docs/data-model.md`](./data-model.md)

---

## Roles

| Rol | Scope | Puede crear |
|---|---|---|
| **Super Admin** | Global | Todo, incluidos otros admins de staff |
| **Admin** (staff) | Global | Orgs, centros, equipos, usuarios, admins de centro |
| **Admin de Centro completo** | Su centro | Equipos y usuarios de su centro |
| **Admin de Centro restringido** | Su centro | Solo lo que el staff le habilitó |

Referencia completa: [`docs/permissions.md`](./permissions.md)

---

## Navegación

Dos paneles separados según rol:
- `/staff` — Panel de Staff (Super Admin + Admin)
- `/admin` — Panel de Admin de Centro

Referencia completa: [`docs/navigation.md`](./navigation.md)

---

## URLs públicas (GitHub Pages)

| | URL |
|---|---|
| **Landing** | https://vanegu1tas.github.io/kamleon-proto/ |
| **Prototipo** | https://vanegu1tas.github.io/kamleon-proto/prototype/ |
| **Storybook** | https://vanegu1tas.github.io/kamleon-proto/storybook/ |

## Comandos locales

| Comando | Descripción | URL |
|---|---|---|
| `npm run prototype` | Servidor Vite para prototipos | http://localhost:5173 |
| `npm run storybook` | Catálogo de componentes | http://localhost:6006 |

---

## Estructura del repo

```
kamleon/
├── .storybook/
│   ├── main.js             ✅ framework react-vite · addons: docs + a11y
│   └── preview.js          ✅ importa todos los tokens CSS globalmente
├── design-system/
│   ├── tokens/
│   │   ├── fonts.css           ✅ @font-face Circular Pro (Book/Medium/Bold)
│   │   ├── colors.css          ✅ paleta global (Global Colors 2 de Figma)
│   │   ├── semantic-colors.css ✅ tokens de intención (bg, text, border, status, etc.)
│   │   ├── typography.css      ✅ variables globales (font-family, font-size, font-weight)
│   │   ├── text-styles.css     ✅ 10 estilos de texto (equivalente a Text Styles de Figma)
│   │   └── tokens.css          ✅ tokens generales (border-radius)
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.jsx              ✅ variantes primary/secondary · tamaños s/m · estados
│   │   │   ├── Button.module.css
│   │   │   └── Button.stories.jsx      ✅
│   │   ├── Tag/
│   │   │   ├── Tag.jsx                 ✅ estados active/inactive · dot + label
│   │   │   ├── Tag.module.css
│   │   │   └── Tag.stories.jsx         ✅
│   │   ├── SidebarItem/
│   │   │   ├── SidebarItem.jsx         ✅ icon + label · default/selected · expanded/collapsed
│   │   │   ├── SidebarItem.module.css
│   │   │   └── SidebarItem.stories.jsx ✅
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.jsx             ✅ shell completo · header · toggle · secciones · nav
│   │   │   ├── Sidebar.module.css
│   │   │   └── Sidebar.stories.jsx     ✅
│   │   └── SearchBar/
│   │       ├── SearchBar.jsx           ✅ input de búsqueda · estados: default/hover/focus/error/disabled
│   │       ├── SearchBar.module.css
│   │       └── SearchBar.stories.jsx   ✅
│   └── icons/
│       ├── outline/
│       │   ├── IconCollapse.jsx      ✅ doble chevron izquierda (colapsar sidebar)
│       │   ├── IconExpand.jsx        ✅ doble chevron derecha (expandir sidebar)
│       │   ├── IconChevronRight.jsx  ✅ chevron simple derecha
│       │   ├── IconChevronDown.jsx   ✅ chevron simple abajo
│       │   ├── IconSearch.jsx        ✅ lupa
│       │   ├── IconClose.jsx         ✅ X (cerrar / limpiar)
│       │   ├── IconUser.jsx          ✅ persona
│       │   ├── IconTeams.jsx         ✅ dos personas
│       │   ├── IconBuilding.jsx      ✅ edificio / centro
│       │   ├── IconDevices.jsx       ✅ dispositivo
│       │   ├── IconAnalytics.jsx     ✅ gráfico de barras con línea de tendencia
│       │   ├── IconEye.jsx           ✅ ojo (mostrar)
│       │   ├── IconEyeClosed.jsx     ✅ ojo cerrado (ocultar)
│       │   ├── IconAddImage.jsx      ✅ añadir imagen
│       │   └── index.js              ✅
│       ├── filled/
│       │   ├── IconUserFilled.jsx    ✅ persona (filled)
│       │   ├── IconMailFilled.jsx    ✅ correo (filled)
│       │   ├── IconPhoneFilled.jsx   ✅ teléfono (filled)
│       │   ├── IconLocationFilled.jsx ✅ ubicación (filled)
│       │   └── index.js              ✅
│       ├── LogoKamleon.jsx     ✅ logotipo SVG (usado en header del Sidebar)
│       ├── IconSbCenter.jsx    ✅
│       ├── IconSbTeams.jsx     ✅
│       ├── IconSbDrop.jsx      ✅
│       ├── IconSbChart.jsx     ✅
│       ├── IconSbUnit.jsx      ✅
│       └── index.js            ✅
├── fonts/
│   ├── CircularPro-Book.otf    ✅
│   ├── CircularPro-Medium.otf  ✅
│   └── CircularPro-Bold.otf    ✅
├── prototypes/
│   ├── main.jsx                ✅ entry point · importa tokens · renderiza prototipo activo
│   └── StaffOrganizaciones/
│       ├── StaffOrganizaciones.jsx         ✅ OrgList + navegación por stack
│       ├── StaffOrganizaciones.module.css  ✅
│       └── screens/
│           ├── OrgDetail.jsx               ✅ tabs: Centers · Administrators · Monitoring
│           ├── OrgDetail.module.css        ✅
│           ├── CenterDetail.jsx            ✅ tabs: Teams · Administrators · Users · Monitoring
│           ├── CenterDetail.module.css     ✅
│           ├── TeamDetail.jsx              ✅ tabs: Users · Administrators
│           └── TeamDetail.module.css       ✅
├── docs/
│   ├── data-model.md           ✅
│   ├── navigation.md           ✅
│   ├── permissions.md          ✅ (con gaps marcados en Admin restringido)
│   ├── project-summary.md      ✅ este archivo
│   └── features/               🔲 pendiente (un doc por feature)
├── figma/
│   └── code-connect/           🔲 pendiente
├── index.html                  ✅ entry HTML del servidor de prototipos
└── vite.config.js              ✅ @vitejs/plugin-react
```

---

## Convención de tokens CSS

Los nombres de variables siguen estos prefijos exactos. **No usar nombres cortos.**

| Tipo | Prefijo | Ejemplo |
|---|---|---|
| Colores | `--color-*` | `var(--color-bg-page)` |
| Familia de fuente | `--font-family-*` | `var(--font-family-primary)` |
| Tamaño de fuente | `--font-size-*` | `var(--font-size-14)` |
| Peso de fuente | `--font-weight-*` | `var(--font-weight-medium)` |
| Radio | `--radius-*` | `var(--radius-m)` |

---

## Tipografía — estado actual

**Fuente:** Circular Pro. Fallback: Inter, sans-serif.

| Peso | Nombre | Token |
|---|---|---|
| 400 | Book | `var(--font-weight-book)` |
| 500 | Medium | `var(--font-weight-medium)` |
| 700 | Bold | `var(--font-weight-bold)` |

### Estilos de texto (text-styles.css)

| Estilo | Tamaño | Peso | Line Height |
|---|---|---|---|
| `text-heading-h1-bold` | 32px | Bold | normal |
| `text-heading-h1-medium` | 32px | Medium | normal |
| `text-heading-h2` | 24px | Medium | normal |
| `text-heading-h2-bold` | 24px | Bold | normal |
| `text-heading-h3` | 20px | Medium | normal |
| `text-body-l-medium` | 16px | Medium | normal |
| `text-body-l-book` | 16px | Book | normal |
| `text-body-m-medium` | 14px | Medium | 16px |
| `text-body-m-book` | 14px | Book | 16px |
| `text-label-section` | 12px | Medium | normal · ls:0.6px · uppercase |
| `text-label-table` | 12px | Medium | 16px · ls:0.24px · uppercase |

---

## Tokens generales

### Border Radius (tokens.css)

| Token | Valor |
|---|---|
| `--radius-xs` | 8px |
| `--radius-s` | 12px |
| `--radius-m` | 24px |
| `--radius-l` | 40px |

---

## Tokens de color

### Global Colors (colors.css)

| Categoría | Pasos |
|---|---|
| Black / White | 1 cada uno |
| Grey | 98 · 96 · 91 · 70 · 65 · 46 · 25 · 11 |
| Turquoise | 86 · 75 · 63 · 51 · 30 |
| Red | 91 · 83 · 75 · 65 · 58 · 48 · 29 |
| Yellow | 90 · 82 · 74 · 66 · 61 · 57 · 47 |
| Green | 88 · 79 · 70 · 62 · 50 · 41 · 30 |

### Semantic Colors (semantic-colors.css)

| Grupo | Tokens |
|---|---|
| Background | `bg-page` · `bg-surface` · `bg-surface-raised` · `bg-surface-subtle` · `bg-surface-disabled` · `bg-icon-hover` · `bg-sidebar` · `bg-nav-active` |
| Border | `border-default` · `border-strong` · `border-focus` · `border-error` |
| Text | `text-strong` · `text-subtle` · `text-disabled` · `text-placeholder` · `text-inverse` |
| Actions | `action-primary-bg/text` · `action-ghost-border/text` · `action-disabled-text` |
| Status | `status-active` · `status-inactive` · `status-error` · `status-error-subtle` |

---

## Iconos — colecciones

Dos colecciones con convenciones distintas:

| Colección | Carpeta | Color | Uso |
|---|---|---|---|
| Duotono (`IconSb*`) | `icons/` | Variables CSS `--icon-*` | Navegación del sidebar |
| Outline (`Icon*`) | `icons/outline/` | `currentColor` (hereda del padre) | UI general |

---

## Iconos — convención de color (duotono)

| Variable | Default | Selected | Uso |
|---|---|---|---|
| `--icon-primary` | `white` | `turquoise-51` | Formas principales |
| `--icon-secondary` | `grey-65` | `turquoise-30` | Formas secundarias (edificios de fondo) |
| `--icon-accent` | `black` | `bg-nav-active` | Detalles de contraste (ventanas, puertas) |

> En selected: `--icon-secondary` usa `turquoise-30` (#1a7f79) para los planos de fondo; `--icon-accent` usa `bg-nav-active` (#161d24) para que los detalles sean visibles sobre el relleno principal.

---

## Prototipos — convención

- Corren en servidor independiente (`npm run prototype`), **no en Storybook**
- Entry point: `prototypes/main.jsx` — importa tokens y renderiza el prototipo activo
- Para cambiar de prototipo: editar el import en `main.jsx`
- Cada prototipo en su propia carpeta: `prototypes/NombrePrototipo/`

### Prototipos disponibles

| Archivo | Descripción |
|---|---|
| `StaffOrganizaciones` | Panel staff — sidebar + KPI cards + tabla de organizaciones expandible + flujo OrgDetail → CenterDetail → TeamDetail |

---

## Storybook

- **Versión:** 10 + Vite (builder react-vite)
- **Addons:** `addon-docs` · `addon-a11y`
- **Stories:** junto a cada componente (`*.stories.jsx`)
- **Tokens:** cargados globalmente en `preview.js` (incluye fonts.css)
- **Backgrounds:** page · surface · sidebar
- **Comando:** `npm run storybook` → http://localhost:6006

---

## Archivos de Figma

| Archivo | File Key |
|---|---|
| Design System | `ozgwasF3ziQyznQS0z0dM1` |
| Web App | `sklnDzfw72Z1tDM46vkTGl` |

Nodos relevantes:
- `2138:367` — Frame "Color Global 2" (Design System)
- `2603:13148` — Pantalla principal analizada para semantic tokens (Web App)
- `2105:4013` — Componente Tag (Design System)
- `2155:1987` — Componente Sidebar (Design System)
- `2154:1394` — IconSbCenter · `2154:1392` — IconSbTeams
- `2154:1390` — IconSbDrop · `2154:1393` — IconSbChart · `2154:1391` — IconSbUnit
- `2754:15230` — Pantalla TeamDetail (Web App)
- `2769:15593` — Componente Back button (Web App)

---

## Plan de trabajo pendiente

### Design System — Componentes
- [x] Button — primary/secondary · s/m · default/hover/disabled
- [x] Tag — active/inactive · dot + label
- [x] SidebarItem — icon + label · default/selected · expanded/collapsed
- [x] Sidebar — shell completo con header (logo SVG), toggle, secciones y nav
- [x] SearchBar — lupa + placeholder + clear button · estados: default/hover/focus/error/disabled · focus ring para click y teclado
- [ ] Input — campo de texto base para formularios
- [ ] Toggle / Switch — para pantalla de permisos del Admin restringido
- [ ] Configurar Figma Code Connect

### Design System — Iconos
- [x] Duotono (`IconSb*`) — 5 iconos para sidebar
- [x] Outline (`Icon*`) — 14 iconos con SVG exacto de Figma · todos 24x24 · stroke + currentColor
- [x] Filled (`Icon*Filled`) — 4 iconos · fill + currentColor

### Storybook
- [x] Setup + stories para los 5 componentes
- [ ] Añadir story por cada componente nuevo

### Prototipos
- [x] StaffOrganizaciones — sidebar + KPI cards + tabla expandible
- [x] OrgDetail — header org + tabs: Centers (expandible → TeamDetail) · Administrators · Monitoring
- [x] CenterDetail — header centro + tabs: Teams (→ TeamDetail) · Administrators · Users · Monitoring
- [x] TeamDetail — header equipo + tabs: Users · Administrators
- [x] Refinado visual: KPI cards, hovers de tabla, SearchBar integrado, títulos H3

### Design System — Tokens
- [x] Tipografía, border radius, colores globales, colores semánticos, fuentes
- [x] Reset base: `box-sizing: border-box` + `body { margin: 0 }`  en tokens.css
- [ ] Sincronización Figma → tokens (pendiente de decisión: Tokens Studio o manual)

### Docs de features
- [ ] Definir lista de features a diseñar
- [ ] Crear primeros docs en `docs/features/`

### GitHub Pages
- [x] Repo en GitHub: https://github.com/vanegu1tas/kamleon-proto
- [x] GitHub Actions workflow (`.github/workflows/deploy.yml`)
- [x] Landing page (`landing.html`) — rediseñada (ver sección Landing)
- [x] `docs/README.md` para navegación contextual
- [x] README raíz con links públicos

### Pendientes abiertos en docs
- [ ] Lista completa de permisos del Admin de Centro restringido
- [ ] Qué campos puede editar el Admin CTR sobre su propio centro
- [ ] Dashboard/home o entrada directa a lista
- [ ] Flujo de onboarding de nueva organización
- [ ] Flujo de activación de cuenta de admin de centro recién creado

---

---

## Landing page — estado actual (2026-03-07)

Archivo: `landing.html` — HTML estático, sin build, se copia directamente a `gh-pages/index.html`.

### Diseño
- Layout centrado, `max-width: 480px`, fondo oscuro (#0c1016)
- Logo SVG real de Kamleon (`fill="currentColor"`, `role="img"`)
- Tagline + lista numerada 01/02/03 (Prototipo · Storybook · Documentación)
- Fuente: Circular Pro (rutas relativas `./fonts/`) con fallback Inter
- Tokens hardcodeados en el propio archivo (no usa tokens del design system — fondo oscuro vs fondo blanco de la plataforma)

### Shader de fondo
- Canvas WebGL con fragment shader de noise domain-warped (fbm sobre fbm)
- Tres capas de color: deep (#060912) · dark (#0c1016) · midteal
- Velocidad: `u_time * 0.08` — sutil, período ~25s
- Fallback: si WebGL no disponible o `prefers-reduced-motion`, fondo sólido
- Se pausa con `visibilitychange` cuando el tab está en background

### A11y
- Contraste: `--text-muted` ajustado a #5a7d96 (~4.6:1 sobre fondo oscuro)
- `:focus-visible` con outline turquesa en nav links
- `<main>` + `<nav aria-label="Accesos directos">` — landmarks semánticos
- `role="img"` en SVG logo
- `aria-label` con "(abre en nueva pestaña)" en links externos
- `<link rel="preload">` para CircularPro-Medium

### Responsive
- ≤ 600px: padding reducido, `align-items: flex-start`
- landscape + max-height 480px: espaciado comprimido al mínimo
- ≤ 360px: márgenes laterales mínimos

---

## Cómo retomar

1. Leer este archivo
2. `npm run prototype` para ver el estado visual actual
3. `npm run storybook` para inspeccionar componentes en aislamiento
4. Continuar con Input / Toggle, o documentar el primer feature
