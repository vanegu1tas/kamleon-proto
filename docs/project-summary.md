# Project Summary — Kamleon Design System

Estado del proyecto al 2026-03-18. Referencia rápida para retomar el trabajo.

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
| **Prototipo V1** | https://vanegu1tas.github.io/kamleon-proto/prototype/ |
| **Prototipo V2** | https://vanegu1tas.github.io/kamleon-proto/prototype-v2/ |
| **Storybook** | https://vanegu1tas.github.io/kamleon-proto/storybook/ |

## Comandos locales

| Comando | Descripción | URL |
|---|---|---|
| `npm run prototype` | Servidor Vite para prototipos (V1 por defecto) | http://localhost:5173 |
| `npm run storybook` | Catálogo de componentes | http://localhost:6006 |

> Para desarrollo de V2: editar `index.html` para apuntar a `main-v2.jsx`, o usar `npx vite --config vite.config.v2.js`.

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
│   │   │   ├── Tag.jsx                 ✅ active/inactive/professional/user · dot + label
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
│   │   ├── SearchBar/
│   │   │   ├── SearchBar.jsx           ✅ input de búsqueda · estados: default/hover/focus/error/disabled
│   │   │   ├── SearchBar.module.css
│   │   │   └── SearchBar.stories.jsx   ✅
│   │   ├── TabBar/
│   │   │   ├── TabBar.jsx              ✅ indicador deslizante · glow animado · controlled · 2-4 tabs
│   │   │   ├── TabBar.module.css
│   │   │   └── TabBar.stories.jsx      ✅
│   │   ├── ContextMenu/
│   │   │   ├── ContextMenu.jsx         ✅ menú contextual · items con icon · variante danger
│   │   │   ├── ContextMenu.module.css
│   │   │   └── ContextMenu.stories.jsx ✅
│   │   ├── ToolbarButton/
│   │   │   ├── ToolbarButton.jsx       ✅ botón de toolbar · selected state · badge de filtros
│   │   │   └── ToolbarButton.module.css
│   │   ├── Toggle/
│   │   │   ├── Toggle.jsx              ✅ switch ON/OFF · tamaños S (40×24) y M (56×32) · label opcional
│   │   │   ├── Toggle.module.css
│   │   │   └── Toggle.stories.jsx      ✅
│   │   ├── SegmentedControl/
│   │   │   ├── SegmentedControl.jsx    ✅ control de selección exclusiva · pill activo negro
│   │   │   ├── SegmentedControl.module.css
│   │   │   └── SegmentedControl.stories.jsx ✅
│   │   ├── Input/
│   │   │   ├── Input.jsx               ✅ campo de texto · label/description/error/disabled · focus ring solo teclado · type="tel" filtra no numéricos
│   │   │   ├── Input.module.css
│   │   │   └── Input.stories.jsx       ✅
│   │   ├── Dropdown/
│   │   │   ├── Dropdown.jsx            ✅ select nativo estilizado · label/description/error/disabled · IconChevronDown
│   │   │   ├── Dropdown.module.css
│   │   │   └── Dropdown.stories.jsx    ✅
│   │   ├── Textarea/
│   │   │   ├── Textarea.jsx            ✅ textarea · label/description/error/disabled · focus ring solo teclado · min-height 120px · radius-s
│   │   │   ├── Textarea.module.css
│   │   │   └── Textarea.stories.jsx    ✅
│   │   └── Toast/
│   │       ├── Toast.jsx               ✅ notificación pill · modo success/critic · prop onUndo · auto-dismiss
│   │       ├── Toast.module.css
│   │       └── Toast.stories.jsx       ✅
│   └── icons/
│       ├── outline/
│       │   ├── IconCollapse.jsx        ✅ doble chevron izquierda (colapsar sidebar)
│       │   ├── IconExpand.jsx          ✅ doble chevron derecha (expandir sidebar)
│       │   ├── IconChevronMiniRight.jsx ✅ chevron mini derecha (navegación, breadcrumbs)
│       │   ├── IconChevronMiniDown.jsx  ✅ chevron mini abajo (accordions, integrations)
│       │   ├── IconChevronDown.jsx      ✅ chevron del Dropdown (más abierto, 14×8 en 24×24)
│       │   ├── IconSearch.jsx          ✅ lupa
│       │   ├── IconClose.jsx           ✅ X (cerrar / limpiar)
│       │   ├── IconUser.jsx            ✅ persona
│       │   ├── IconTeams.jsx           ✅ dos personas
│       │   ├── IconBuilding.jsx        ✅ edificio / centro
│       │   ├── IconDevices.jsx         ✅ dispositivo
│       │   ├── IconAnalytics.jsx       ✅ gráfico de barras con línea de tendencia
│       │   ├── IconEye.jsx             ✅ ojo (mostrar)
│       │   ├── IconEyeClosed.jsx       ✅ ojo cerrado (ocultar)
│       │   ├── IconAddImage.jsx        ✅ añadir imagen
│       │   ├── IconEdit.jsx            ✅ lápiz (editar)
│       │   ├── IconPlus.jsx            ✅ cruz / añadir
│       │   ├── IconTrash.jsx           ✅ papelera (eliminar)
│       │   ├── IconSettings.jsx        ✅ engranaje (configuración)
│       │   ├── IconFilter.jsx          ✅ embudo (filtros)
│       │   ├── IconBell.jsx            ✅ campana (notificaciones)
│       │   ├── IconMenu.jsx            ✅ hamburger (menú móvil)
│       │   ├── IconWarning2.jsx        ✅ círculo con signo de exclamación (alerta)
│       │   └── index.js               ✅
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
├── index-v1.html               ✅ entry HTML para build V1 (apunta a main-v1.jsx)
├── index-v2.html               ✅ entry HTML para build V2 (apunta a main-v2.jsx)
├── vite.config.v1.js           ✅ config build V1 (input: index-v1.html)
├── vite.config.v2.js           ✅ config build V2 (input: index-v2.html)
├── prototypes/
│   ├── main.jsx                ✅ entry point dev local (apunta a V1 o V2)
│   ├── main-v1.jsx             ✅ entry point build V1 — renderiza StaffOrganizaciones directamente
│   ├── main-v2.jsx             ✅ entry point build V2 — renderiza StaffOrganizacionesV2 directamente
│   ├── StaffOrganizaciones/    (V1)
│   │   ├── StaffOrganizaciones.jsx         ✅ OrgList + navegación por stack + ContextMenu en tabla
│   │   ├── StaffOrganizaciones.module.css  ✅ (compartido con V2)
│   │   ├── mockData.js                     ✅ datos mock centralizados · IDs únicos por org
│   │   └── screens/
│   │       ├── OrgDetail.jsx               ✅ tabs: Centers · Administrators · Monitoring
│   │       ├── CenterDetail.jsx            ✅ tabs: Teams · Administrators · Users · Monitoring
│   │       ├── TeamDetail.jsx              ✅ tabs: Users (filtro por role) · Administrators
│   │       ├── UserDetail.jsx              ✅ vista/edición · toggles de permisos
│   │       ├── NewCenterModal.jsx          ✅ drawer crear centro
│   │       ├── NewOrgDrawer.jsx            ✅ drawer crear org
│   │       ├── NewTeamDrawer.jsx           ✅ drawer crear equipo
│   │       ├── EditCenterDrawer.jsx        ✅ drawer edición centro
│   │       ├── EditTeamDrawer.jsx          ✅ drawer edición equipo · Reset PIN condicional
│   │       ├── EditOrgDrawer.jsx           ✅ drawer edición org · Status + Integrations
│   │       └── EditUserDrawer.jsx          ✅ drawer edición usuario · Name/Email/Phone/Birthday/Gender/Height/Weight · Status/RFID/PIN toggles
│   └── StaffOrganizacionesV2/  (V2 — master-detail)
│       ├── StaffOrganizacionesV2.jsx       ✅ shell V2 · SearchPalette (⌘K) · topbar con search pill (fondo blanco, sombra)
│       ├── components/
│       │   └── SearchPalette.jsx           ✅ paleta de búsqueda global · búsqueda por org/centro/equipo/usuario
│       └── screens/
│           └── OrgDetailV2.jsx             ✅ layout master-detail en dos paneles
│               ├── Panel izquierdo: lista de centros + botón "+" (New Center) con tooltip izquierda
│               └── Panel derecho (según selección):
│                   ├── CenterCard — tabs: Teams · Users · Monitoring
│                   │   ├── Tab Teams: lista de equipos · click → TeamCard
│                   │   ├── Tab Users: todos los usuarios del centro · búsqueda + filter pills por equipo · click → UserCard
│                   │   └── Botón "Create" dropdown: New Team / New User / New Unit
│                   ├── TeamCard — tabs: Users · Administrators
│                   └── UserCard — vista de usuario · botón Settings → EditUserDrawer
├── docs/
│   ├── data-model.md           ✅
│   ├── navigation.md           ✅
│   ├── permissions.md          ✅ (con gaps marcados en Admin restringido)
│   ├── project-summary.md      ✅ este archivo
│   └── features/
│       ├── user-test-script-navegacion.md  ✅ guión prueba V1 (8 tareas: orientación, navegación, filtros, creación)
│       └── user-test-script-v2.md          ✅ guión prueba V2 (3 tareas: master-detail, add user manually, ⌘K)
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

| Prototipo | Descripción |
|---|---|
| `StaffOrganizaciones` (V1) | Panel staff — sidebar + KPI cards + tabla de organizaciones expandible + flujo OrgDetail → CenterDetail → TeamDetail → UserDetail |
| `StaffOrganizacionesV2` (V2) | Panel staff — misma shell, navegación master-detail. Tab Centers en OrgDetail muestra ficha completa del centro seleccionado. Pensado para usuarios gestores (flujo Excel/Word). |

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
- [x] Tag — active/inactive/professional/user · dot + label
- [x] SidebarItem — icon + label · default/selected · expanded/collapsed · tooltips portal
- [x] Sidebar — shell completo con header (logo SVG), toggle, secciones y nav
- [x] SearchBar — lupa + placeholder + clear button · estados: default/hover/focus/error/disabled
- [x] TabBar — indicador deslizante + glow animado · variantes 2/3/4 tabs · controlled
- [x] ContextMenu — menú contextual flotante · items con icono · variante danger · click-outside
- [x] ToolbarButton — botón de toolbar con selected state y badge de filtros
- [x] IconButton — botón de icono con borde · variante danger · tooltip opcional
- [x] Toggle — switch ON/OFF · tamaños S/M · label opcional · usado en drawers
- [x] SegmentedControl — control de selección exclusiva · pill activo negro
- [x] Input — campo de texto base · label/description/error/disabled · focus ring solo teclado · tel filtra caracteres
- [x] Dropdown — select nativo estilizado · label/description/error/disabled · IconChevronDown
- [x] Textarea — campo multilínea · label/description/error/disabled · min-height 120px · radius-s
- [x] Toast — success/critic · prop onUndo · auto-dismiss · posición top 52px · animación desde arriba
- [ ] Configurar Figma Code Connect

### Design System — Iconos
- [x] Duotono (`IconSb*`) — 5 iconos para sidebar
- [x] Outline (`Icon*`) — 22 iconos · todos 24×24 · stroke + currentColor · ChevronMiniRight/Down renombrados · ChevronDown (Dropdown) · Bell · Menu · Warning2
- [x] Filled (`Icon*Filled`) — 4 iconos · fill + currentColor

### Storybook
- [x] Setup + stories para Button, Tag, SidebarItem, Sidebar, SearchBar, TabBar
- [x] ContextMenu — stories añadidas
- [x] Toast — stories añadidas (success, critic, with undo, all states)
- [x] Toggle — stories añadidas
- [x] SegmentedControl — stories añadidas
- [x] Input — stories añadidas
- [x] Dropdown — stories añadidas
- [x] Textarea — stories añadidas
- [ ] **IconButton** — falta story
- [ ] **ToolbarButton** — falta story

### Prototipos
- [x] StaffOrganizaciones (V1) — sidebar + KPI cards + tabla expandible + filtros + ContextMenu · todos los drawers CRUD
- [x] EditUserDrawer (V1) — drawer edición de usuario · Name/Email/Phone/Birthday/Gender/Height/Weight · Status/RFID/PIN toggles · wired al Settings button en UserDetail
- [x] OrgDetail — tabs: Centers · Administrators · Monitoring
- [x] CenterDetail — tabs: Teams · Administrators · Users · Monitoring
- [x] TeamDetail — tabs: Users (filtro por role) · Administrators
- [x] UserDetail — vista/edición · toggles de permisos
- [x] NewCenterModal, NewOrgDrawer, NewTeamDrawer — drawers de creación
- [x] EditCenterDrawer, EditTeamDrawer, EditOrgDrawer — drawers de edición
- [x] StaffOrganizacionesV2 (V2) — shell completa · SearchPalette ⌘K · search pill topbar (fondo blanco + sombra) · responsive 768px (slide lateral Opción C)
- [x] OrgDetailV2 — layout master-detail en dos paneles · responsive: listPanel/detailPanel con translateX + detailVisible state + botón "← Centers" en mobile
- [x] CenterCard (V2) — tabs: Details · Teams · Users · Monitoring · botón Create dropdown · Tab Teams: tabla con search + Filters + context menu por equipo (Edit Team → EditTeamDrawer, New User, Delete Team)
- [x] Tab Details CenterCard — sección Overview (stats clickables) + sección Contact (Center info + People con admins y contactos separados por dividers)
- [x] Tab Users en CenterCard — lista todos los usuarios del centro · búsqueda + filter pills por equipo · paginación · click navega a UserCard
- [x] TeamCard (V2) — tabla de miembros con search + Filters button + context menu por fila (Edit User → EditUserDrawer, Delete User stub) · back button "Back to Teams" vuelve al tab Teams del CenterCard
- [x] UserCard (V2) — vista de usuario · Settings button → EditUserDrawer
- [x] Panel izquierdo (V2) — botón "+" junto al overline "Centers" · tooltip "New Center" posicionado a la izquierda
- [x] Center rows expandidos (OrgList V2) — click navega a OrgDetailV2 con `initialCenter`
- [x] NewUserDrawer (V1) — rediseñado con segmented control "By invite / Manually" · modo Invite: email + rol + bulk (textarea libre de emails + CSV upload) · modo Manual: avatar + Name/Role/Email/Phone/Date of birth (Day/Month/Year) + Gender select + Height/Weight + Settings (RFID/PIN)
- [x] NewCenterGlobalDrawer — drawer global con selector de org · sección contactos con tarjetas de 4 campos (Name, Position, Email, Phone)
- [x] NewCenterDrawer — drawer con contexto de org (sin selector) · muestra "Creating center for [org]"
- [x] DeleteOrgModal — modal de confirmación centrado · conectado a OrgDetailV2 y context menu de lista
- [x] EditCenterDrawer — reescrito completo con estructura de NewCenter: todos los campos + contactos pre-rellenos + admins confirmados (read-only) + invitaciones pendientes
- [x] mockData.js Arsenal center 201 — contacts[] (James Wright/Director, Sarah Collins/Coordinator) + admins[] (Michael Porter/Center Admin)
- [x] mockData.js — IDs únicos y no solapantes por organización (1-12 Astonia, 19-31 Arsenal, 32-52 Baskonia, 53-63 CAR Sant Cugat, 64-70 Sierra Nevada, 71-74 CEAR, 75-87 CEM Joan Miró, 88-90 CNEA, 91-94 Dynatech)
- [x] Desplegado V2 en GitHub Pages (/prototype-v2/) · builds separados con vite.config.v1/v2.js · mv para renombrar index.html
- [x] Fix 404 en V2: mv del HTML de salida para que GitHub Pages sirva index.html correctamente

### Design System — Tokens
- [x] Tipografía, border radius, colores globales, colores semánticos, fuentes
- [x] Reset base: `box-sizing: border-box` + `body { margin: 0 }`  en tokens.css
- [ ] Sincronización Figma → tokens (pendiente de decisión: Tokens Studio o manual)

### Docs de features
- [x] Guión de prueba de usuario de navegación (`docs/features/user-test-script-navegacion.md`) — 8 tareas con mock data real, guías de observación y métricas

### GitHub Pages
- [x] Repo en GitHub: https://github.com/vanegu1tas/kamleon-proto
- [x] GitHub Actions workflow (`.github/workflows/deploy.yml`) — builds V1 + V2 + Storybook + landing
- [x] Landing page (`landing.html`) — 4 entradas: Prototipo V1 · Prototipo V2 · Storybook · Docs
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
2. `npm run prototype` → http://localhost:5173 (V1 por defecto; editar `index.html` para V2)
3. `npm run storybook` → http://localhost:6006 para inspeccionar componentes en aislamiento
4. V2 en producción: https://vanegu1tas.github.io/kamleon-proto/prototype-v2/

## Estado al 2026-03-18

### Design System — completo
Todos los componentes de formulario implementados. Drawers del prototipo migrados a DS Input/Dropdown. Toast actualizado a spec Figma (success/critic, undo).

### Responsive V2 — estado actual
- **768px**: implementado y funcionando. Pendiente: drawers (NewCenterDrawer, NewOrgDrawer, EditOrgDrawer, etc.)
- **390px**: implementado en CSS. Pendiente verificación visual en browser.

### Figma — capturas en Web App (`sklnDzfw72Z1tDM46vkTGl`)
- Nodo `3268:2` — Org list desktop (2026-03-18)
- Nodo `3271:2` — Org list 390px (2026-03-18)
- Nodo `3274:2` — Center Detail 390px / Training Ground · Astonia FC (2026-03-18)

## Próximos pasos sugeridos

### Design System
- [ ] **IconButton** — story pendiente
- [ ] **ToolbarButton** — story pendiente
- [ ] Code Connect mappings completos

### Pruebas de usuario
- [x] Guión V1 — 8 tareas (navegación, filtros, creación)
- [x] Guión V2 — 3 tareas (master-detail, add user manually, ⌘K)
- [ ] Ejecutar pruebas con participantes reales

### V2 — pendientes
- [ ] **Empty states** — CenterCard sin equipos · TeamCard sin usuarios
- [ ] **Drawers responsive 768px** — NewCenterDrawer, NewOrgDrawer, EditOrgDrawer, etc.
- [ ] **Panel Admin de Centro** — prototipo separado (no existe aún)

### Docs / definición
- [ ] Lista de permisos del Admin de Centro restringido
- [ ] Qué campos puede editar el Admin CTR sobre su propio centro
- [ ] Dashboard/home o entrada directa a lista
- [ ] Flujo de onboarding de nueva organización
- [ ] Flujo de activación de cuenta de admin de centro
