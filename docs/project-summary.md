# Project Summary — Kamleon Design System

**Este documento es el estado del proyecto.** `MEMORY.md` es solo el índice —se carga en cada
sesión, así que se mantiene corto y sin nada que caduque— y apunta aquí para el detalle. Si algo
está en los dos sitios, manda este.

Última revisión: 2026-10-01.

---

## Lo primero al retomar (acordado el 1/10)

1. ~~**Limpiar `MEMORY.md`**~~ — **hecho el 2/10**: de 245 a 67 líneas, todo lo que cargaba se
   carga. Nada se borró: los pendientes y "hechos" están al final de este documento, el
   Recommendation Engine en `memory/recommendation-engine.md`, los roles en `memory/roles.md`.
   Regla para mantenerlo: **en `MEMORY.md` no entra nada que caduque.**

2. **Montar el repo aparte de la scrapp** para la compañera de Daniel — detalle y medidas en
   `docs/features/pendientes-01-10.md`.

3. Seguir por prioridad: Recommendation Engine (el único con fecha externa) o poner el prototipo
   al día con Figma (meta: lunes).

**Lista completa de pendientes abiertos → `docs/features/pendientes-01-10.md`.**

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
│   │   │   ├── ToolbarButton.module.css
│   │   │   └── ToolbarButton.stories.jsx ✅
│   │   ├── Toggle/
│   │   │   ├── Toggle.jsx              ✅ switch ON/OFF · tamaños S (40×24) y M (56×32) · label opcional
│   │   │   ├── Toggle.module.css
│   │   │   └── Toggle.stories.jsx      ✅
│   │   ├── SegmentedControl/
│   │   │   ├── SegmentedControl.jsx    ✅ control de selección exclusiva · pill activo negro
│   │   │   ├── SegmentedControl.module.css
│   │   │   └── SegmentedControl.stories.jsx ✅
│   │   ├── Input/
│   │   │   ├── Input.jsx               ✅ campo de texto · label/description/error/disabled · focus ring solo teclado · type="tel" filtra no numéricos · prop suffix (hug content, gap 0) · toggle password (IconEyeClosed por defecto)
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
│   │   ├── Toast/
│   │   │   ├── Toast.jsx               ✅ notificación pill · modo success/critic · prop onUndo · auto-dismiss · top:52px · animación desde arriba
│   │   │   ├── Toast.module.css
│   │   │   └── Toast.stories.jsx       ✅
│   │   ├── Checkbox/
│   │   │   ├── Checkbox.jsx            ✅ checkbox custom · label flexible · animación draw checkmark · align-items flex-start
│   │   │   ├── Checkbox.module.css
│   │   │   └── Checkbox.stories.jsx    ✅
│   │   └── FilterPanel/
│   │       ├── FilterPanel.jsx         ✅ ToolbarButton trigger + badge + dropdown + checkboxes + Clear filters · gestiona open/close + outside-click
│   │       ├── FilterPanel.module.css
│   │       └── FilterPanel.stories.jsx ✅
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
│       │   ├── IconCheckCircle.jsx     ✅ círculo con check (success Toast)
│       │   ├── IconPower.jsx           ✅ encendido (22×22 en 24×24)
│       │   ├── IconFile.jsx            ✅ documento (18×22 en 24×24)
│       │   ├── IconResend.jsx          ✅ reenviar (23×21 en 24×24)
│       │   ├── IconRecover.jsx         ✅ recuperar (20×20 en 24×24)
│       │   └── index.js               ✅
│       ├── filled/
│       │   ├── IconUserFilled.jsx    ✅ persona (filled)
│       │   ├── IconMailFilled.jsx    ✅ correo (filled)
│       │   ├── IconPhoneFilled.jsx   ✅ teléfono (filled)
│       │   ├── IconLocationFilled.jsx ✅ ubicación (filled)
│       │   └── index.js              ✅
│       ├── LogoKamleon.jsx     ✅ logotipo SVG · prop color (default 'white') · fill="currentColor"
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
│   │       ├── EditTeamDrawer.jsx          ✅ drawer edición equipo · estructura corregida vs Figma · Save con Toast "Changes saved" · onSave(patch) actualiza selectedTeam
│       └── EditAccountDrawer.jsx       ✅ drawer edición perfil · Email disabled · Date of birth DD/MM/YYYY (3 inputs) · Gender en sección Account · Height+Weight en sección Measurements · onChange con DS Input pasa string directo (no evento)
│   │       ├── EditOrgDrawer.jsx           ✅ drawer edición org · Status + Integrations · "Run Test" → ApiTestModal (drawer exit + modal enter + return)
│   │       ├── ApiTestModal.jsx            ✅ modal API Test · Select org/team/user · Enable API toggle · API Token + copy · Average toggle · Start/End date · Get measures
│   │       └── EditUserDrawer.jsx          ✅ drawer edición usuario · Name/Email/Phone/Birthday/Gender/Height/Weight · Status/RFID/PIN toggles
│   ├── Login/                  ✅ prototipo flujo de registro (URL: ?proto=login)
│   │   ├── Login.jsx           ✅ router interno · lifted state SignUp · animaciones slide+scale · logo fijo
│   │   ├── Login.module.css    ✅ background fijo · keyframes slideOut/slideIn (200/250ms)
│   │   └── screens/
│   │       ├── SignIn.jsx      ✅ layout 2 columnas (form 60% + imagen placeholder) · email + password + forgot + signup link
│   │       ├── SignIn.module.css
│   │       ├── SignUp.jsx      ✅ paso 1 · stepper fijo · campos animan · Name+Surname+Email+Password+Confirm · 2 checkboxes GDPR
│   │       ├── SignUp.module.css
│   │       ├── Profile.jsx     ✅ paso 2 · stepper fijo · campos animan · Gender+Height(cm)+Weight(kg)+consent
│   │       └── Profile.module.css
│   └── StaffOrganizacionesV2/  (V2 — master-detail)
│       ├── StaffOrganizacionesV2.jsx       ✅ shell V2 · SearchPalette (⌘K) · topbar con search pill (fondo blanco, sombra)
│       ├── components/
│       │   └── SearchPalette.jsx           ✅ paleta de búsqueda global · búsqueda por org/centro/equipo/usuario
│       └── screens/
│           ├── OrgDetailV2.jsx             ✅ layout master-detail en dos paneles · responsive 768px (slide lateral)
│           │   ├── Panel izquierdo: lista de centros + botón "+" con tooltip izquierda
│           │   └── Panel derecho (según selección):
│           │       ├── CenterCard — tabs: Detail · Teams · Users · Units
│           │       │   ├── Tab Detail: stats grid + sección Contact (admins/contacts con dividers)
│           │       │   ├── Tab Teams: tabla · SearchBar + FilterPanel(Status) · ContextMenu → EditTeamDrawer/DeleteTeam
│           │       │   ├── Tab Users: NAME|STATUS|DATE ADDED|ACTIONS · SearchBar + FilterPanel(Role+Status) · click → UserCard
│           │       │   ├── Tab Units: tabla de units · Tag status · FilterPanel(Status+K-POD) · click → UnitCard
│           │       │   └── Botón "Create" dropdown: New Team / New User / New Unit
│           │       ├── TeamCard — tabla miembros · SearchBar + FilterPanel(Role+Status) · ContextMenu · back "Back to Teams"
│           │       ├── UserCard — vista usuario · Settings → EditUserDrawer
│           │       └── UnitCard — tabs: Detail · Devices · Appearance · Parameters
│           ├── OrgDetailV2.jsx             ✅ layout master-detail en dos paneles · responsive 768px (slide lateral)
│           ├── UnitsGlobalView.jsx         ✅ vista global de todas las units · KPI cards · tabla expandible (Display+K-POD) · OrgPillSelect + CenterPillSelect + FilterPanel(Status+K-POD) · cascade org/center
│           └── AccountDetails.jsx          ✅ perfil del usuario logueado · view mode (Account/Measurements/Security) · surface centrada · close [×] + edit [⚙] en header · abre EditAccountDrawer
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

Una sola escala, sin variantes por dispositivo: un radio es una propiedad de la forma, no del
espacio disponible. En Figma, colección `Border Radius`, con los mismos cuatro nombres.

### Elevación y anillo de foco (tokens.css) — 26-27/09/2026

| Token | Para qué | Figma |
|---|---|---|
| `--elevation-1` | Cards, paneles y tablas | `Elevation/1` |
| `--elevation-2` | Menús, desplegables y tooltips | `Elevation/2` |
| `--elevation-3` | Lo que flota sobre el contenido sin taparlo: toast, paleta ⌘K, tooltips del tour | `Elevation/3` |
| `--shadow-drawer` | Panel anclado al borde derecho | `Shadow/Drawer` |
| `--shadow-sidebar` | El sidebar sobre el fondo de la página | `Shadow/Sidebar` |
| `--shadow-control-thumb` | La bolita del Toggle | `Shadow/Control thumb` |
| `--focus-ring` / `--focus-ring-error` | Indicador de teclado de los campos | — |

Drawer, sidebar y pulsador **no son niveles de elevación**: un nivel se define por cuánto flota
algo sobre el fondo, y esas tres sombras existen por otra razón (dirección, estructura, separar
dos piezas del mismo control). Falta el nivel 3, para lo que tapa el resto de la interfaz.

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

## Cerrado el 2026-09-27 — el primer flujo construido en Figma

Quince commits (`c82bc7c` → `bdb1a9b`). El guion del flujo, con textos y medidas exactas, en
`docs/features/team-admin-flujos-figma.md`; las reglas nuevas, en `docs/design-system-rules.md`.

**Qué se construyó.** El flujo 2 del Team Admin ("Quitar a alguien del equipo") en la página
`🧪 Flujos — prueba` de Web App 2.0, con instancias reales de la librería: B1 el menú "⋯" de la
fila, B2 la entrada desde el drawer *Edit user*, B3 el modal de confirmación y B4 el resultado con
toast. Más A4/A5, el menú de *Bulk actions* y su confirmación — la primera que no es destructiva.

**Lo valioso fueron los siete fallos que destapó**, ninguno visible mirando el componente:

- **Ocho variantes del Button con el color horneado en negro** pese a tener el enlace a la
  variable correcto. Un relleno guarda dos cosas —el color y la variable— y Figma pinta el
  horneado cuando el enlace no llega.
- **Dieciséis variantes con el texto sordo**: las 6 `Danger` del Button y 10 estados de
  `Text input` y `Text area`. La propiedad aparece en el panel, la cambias y no pasa nada. Solo
  el `State=Default` funcionaba en los tres casos.
- **`Secondary` y `Tertiary` significaban cosas distintas en cada lado.** Resuelto con tres
  nombres para tres tratamientos: `Secondary` blanco con borde, `Tertiary` transparente (el
  Cancel, 26 usos), `Subtle` gris (nombre nuevo, 2 usos). Ningún botón cambió de aspecto.
- **Nueve medidas mal en el modal**: 440 de ancho en vez de 530, radio 12 en vez de 24,
  `Elevation/3` en vez de la 1, título en H3 en vez de H2 Bold, velo al 40% en vez del 25%.
- **Datos caducados** en la pantalla base de Figma: "Atlético Nacional" y "Daniel Vanegas", que
  no existen en el mock. Lo correcto es Astonia FC y Sam Alcaraz.
- **Una pregunta abierta desde agosto ya estaba contestada en el código**: el modal tiene una
  segunda frase que el guion no recogía.
- **Tres botones dibujados a mano** en `DeleteOrgModal.module.css`, compartido por 4 pantallas, y
  los tres con variante en el sistema.

**`ds:compare` pasó de 6 a 8 pasadas.** Ahora vigila también las tres páginas de Foundations
(`-- Colors`, `-- Typography`, `-- Border radius`) y la salud interna de los componentes: textos
que no escuchan su propiedad y colores horneados que no coinciden con su variable. De los siete
fallos, cinco los habría cazado el comando solo.

**Foundations al día.** Página de colores con las 42 descripciones escritas desde el uso real en
el código, más `Grey/70` que faltaba. Radios corregidos (documentaban la colección muerta) y
enlazados a su variable, así que ya no pueden desfasarse. Frame `Text styles` nuevo con los 14
estilos reales: la página documentaba un vocabulario muerto (`Display 1`, `Title-H1…H5`,
`Size-160`, `font-weight/regular`).

**Dos lecciones de método**, ambas escritas en las reglas del DS: publicar la librería y
actualizarla en el archivo que la consume son **dos pasos en archivos distintos**; y al comprobar
algo hay que recorrer todos los casos y mirar **el valor que se pinta**, no el campo que debería
controlarlo — tres veces el mismo día un "está todo bien" fue el check mirando donde no era.

**Pendiente → `docs/features/ds-pendientes-28-09.md`**, con tiempos.

## Cerrado el 2026-09-26 — sincronización Design System ↔ código

Diez commits (`f6df952` → `69cdf27`). El detalle completo, con el razonamiento de cada decisión,
está en `docs/design-system-map.md`; las reglas que salieron, en `docs/design-system-rules.md`.

**En Figma:** las dos colecciones de color fusionadas en una (`Global Colors` quedó con 0 capas y
0 aliases, renombrada a deprecated) · página `-- Colors` completa, 35 de 35 variables con la
muestra enganchada al token · página `-- Elevation` nueva · 5 estilos de efecto · 7 variantes sin
nombre resueltas (`Toggle` Size, `Toolbar Button` Disabled, `Radio` Default, `Search bar` Focus,
`.Tab SC` Inactive) · errata `Turquose` → `Turquoise` y el `61` → `63` por luminosidad.

**En código:** `SegmentedControl` y `SearchBar` igualados al píxel · 33 sombras a mano → 5 tokens
· anillo de foco de 8 copias a 1 · `--color-text-placeholder` de `#9ca3af` a `#6b7280` (tenía el
mismo valor que el texto deshabilitado y no llegaba al mínimo AA) · `Textarea` gana `onSubtle` ·
familias `Content/Inverse/*` y `Background/Inverse/*` para la superficie oscura del sidebar.

**Lo que enseñó:** cinco de los diez commits arreglan cosas que nadie sabía que estaban mal —dos
variables llamadas `Black` con distinto valor, hex que mentían en la documentación, radios
responsive que nunca se usaron, un tag de rol muerto, la errata del turquesa—. Ninguna se
encuentra mirando; solo comparando.

**Siguiente (27/9):** decidir y escribir **quién manda en cada capa**. El 26/9 se decidió ocho
veces, unas ganó Figma y otras el código, con un motivo concreto cada vez, pero esos motivos
están dispersos en los mensajes de commit.

---

## Plan de trabajo pendiente

### Design System — Componentes
- [x] Button — primary/secondary · s/m · default/hover/disabled
- [x] Tag — ciclo de vida (active/inactive/pending/expired) + envío de correo (delay/delivered) · dot + label. La familia de rol se eliminó el 26/9: solo la usaba V1, congelada
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
- [x] FilterPanel — ToolbarButton + badge + dropdown + checkboxes + Clear · gestiona open/close · sin story
- [ ] Configurar Figma Code Connect *(bloqueado: pendiente de Personal Access Token con permisos de edición en DS `ozgwasF3ziQyznQS0z0dM1`)* · archivos .figma.jsx y figma.config.json listos

### Design System — Iconos
- [x] Duotono (`IconSb*`) — 5 iconos para sidebar
- [x] Outline (`Icon*`) — 28 iconos · todos 24×24 · stroke + currentColor · ChevronMiniRight/Down · ChevronDown (Dropdown) · Bell · Menu · Warning2 · CheckCircle · Power · File · Resend · Recover
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
- [x] IconButton — story añadida
- [x] ToolbarButton — story añadida
- [ ] **FilterPanel** — falta story

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
- [x] CenterCard (V2) — tabs: Detail · Teams · Users · Units · botón Create dropdown · Tab Teams: tabla con search + Filters + context menu por equipo (Edit Team → EditTeamDrawer, New User, Delete Team)
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
- [x] FilterPanel DS — usado en: StaffOrganizacionesV2 (Segment+Status), OrgDetailV2 TeamsTab (Status), UsersTab (Role+Status), UnitsGlobalView (Status+K-POD)
- [x] EditTeamDrawer (V1) — estructura corregida vs Figma · subtítulo fuera del header · avatar IconAddImage · footer padding 24px · Save refleja cambios en UI + Toast · onSave(patch) actualiza selectedTeam en CentersContent
- [x] UnitsGlobalView (V2) — tabla 15 units en 6 centros/4 orgs · filas expandibles (Display+K-POD) · OrgPillSelect + CenterPillSelect + FilterPanel · cascade center→org
- [x] Units tab en CenterCard (V2) — tabla por centro · Tag status · K-POD warning · click → UnitCard
- [x] UnitCard (V2) — tabs: Detail · Devices · Appearance · Parameters · innerTabBarInnerWide (max-width 420px)
- [x] Delete center modal — DeleteOrgModal con prop label="center" · Toast success + Undo al confirmar
- [x] TeamCard (V2) — scroll corregido · ContextMenu z-index con :hover y .menuOpen · FilterPanel Role+Status
- [x] SidebarItem — line-height: 24px unificado (fix salto de altura al cambiar pantalla)
- [x] NewUserDrawer (V2) — tooltips en toggles con data-tooltip (imagen en pantalla, RFID, PIN login)

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

### Pendientes abiertos
La lista actualizada de pendientes (revisada 2026-09-15) está al final de este documento, en **"Próximos pasos"**.

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

## Presentación Claude Code

Archivo: `personal/presentacion-claudecode.md`
**Título:** *From frame to commit. How Claude Code is changing my workflow.*
Duración: ~25 min + preguntas. **19 diapositivas principales.**

### Estructura
1. Portada
2. Pregunta al público *(por definir)*
3. Claude ≠ Claude Code — Para usar CC necesitas plan Pro
4. Empezando en VSCode — plugin Anthropic + MCP Figma
5. "Implementa este diseño" — primera prueba, resultado impreciso
6. Me sentí estafado — tokens agotados en 15 min
7. Perdido en el equipo — la metáfora del jugador
8. Fabio / "Start again with that in mind"
9. El proyecto: Kamleon
10. El camino: de cero a sistema *(intro sección)*
11. Lo que hice antes de escribir código *(12 bullets, expandibles en Figma)*
12. La landing
13. La primera estructura + user test + wireframe ASCII
14. El prototipo en vivo
15. El sistema de memoria
16. Aprendizajes
17. Consejos para empezar mañana
18. Cierre: volver al jugador
19. Preguntas

### Material extra
- **Slides extras A/B/C** — GitHub Actions, ASCII, Design System *(para fusionar)*
- **Respuestas auditoría** — 4 preguntas del auditor + 6 learnings/aprendizajes

---

## Cómo retomar

1. Leer este archivo
2. `npm run prototype` → http://localhost:5173 (V1 por defecto; editar `index.html` para V2)
3. `npm run storybook` → http://localhost:6006 para inspeccionar componentes en aislamiento
4. V2 en producción: https://vanegu1tas.github.io/kamleon-proto/prototype-v2/

## Estado al 2026-06-15

### Scrapp — Explorations 1, 2 y 3 completas ✅
Tres variantes de visualización del score de hidratación para la pantalla física 1280×800px.

**Arquitectura compartida (`scrapp/main.jsx`)**
- Selector de exploración (menú hamburger top-left) + panel de control (score slider + Play)
- RAF con `ease = Math.sin(p * Math.PI / 2)` para todas las exploraciones
- Estados: `animAngle` (E1), `animX` (E2), `animRot` (E3), `glowZoneIdx`, `textStage`
- textStage: `null` → `'you-are'` (solo E1) → `'full'`. En E2/E3 salta directo a `'full'` 400ms tras fin de animación
- A p=0.85 se dispara `glowZoneIdx` → resalta zona activa + glow de fondo crece y cambia de color

**Exploration 1** — Gauge semicircular SVG puro (`Exploration1.jsx`)
- Aguja animada con `scoreToAngle()` · 4 zonas de color · glow radial

**Exploration 2** — Barra horizontal de polígonos skewed (`Exploration2.jsx`)
- Barra con 4 segmentos trapezioidales + indicador triangular animado con `scoreToX()`
- `feGaussianBlur stdDeviation=16` para glow de zona activa (expandido: y="-500%" h="1100%")
- Fondo: radialGradient r=300 (más pequeño que el círculo r=487), cy=285 (subido), escala 1.35× al seleccionar zona
- Score grande sale hacia arriba con fade+scale(0.85) en 350ms/400ms · textos entran desde abajo con spring `cubic-bezier(0.34, 1.56, 0.64, 1)` · stagger YOU ARE (100ms) → zona (150ms)
- Gaps entre segmentos transparentes (sin fondo oscuro)
- "SEVERELY DEHYDRATED" → fontSize 88px (resto 111px)

**Exploration 3** — Semicírculo 180° con assets Figma (`Exploration3.jsx`)
- Assets: track housing, 4 zonas de rango, luces zona healthy, sombras, puntero
- Puntero: pivota desde centro `(CX=643, CY=629)` a radio R_PTR=490 · posición `(CX+R·sin θ, CY-R·cos θ)` · rota `θ` grados
- `scoreToRotation()`: mapea score a -90°..+90° proporcional a cada zona
- HEALTHY ZONE text: SVG `<textPath>` sobre arco a R_TXT=554
- Zona 3 (over-hydrated) = imagen de zona 0 con `scaleX(-1)`
- Glow de fondo: mismo patrón que E2 (radialGradient + scale 1.35×)
- Texto: mismas animaciones que E2
- **Pendiente**: ajustes de posición/tamaño del puntero y textos tras revisión visual

**Estructura de archivos scrapp**
```
scrapp/
  main.jsx                    ← controlador principal (RAF, estados, menú)
  tokens/typography.css       ← escala tipográfica para pantalla física
  components/DeviceFrame.jsx
  screens/
    Exploration1.jsx + .module.css
    Exploration2.jsx + .module.css
    Exploration3.jsx + .module.css   ← nuevo
```

## Estado al 2026-06-11

### Scrapp — estructura base ✅
Proyecto separado dentro del mismo repo para la pantalla física sobre el urinal.
- **Hardware**: 1280×800px · landscape · touch
- `scrapp/` en raíz del repo con su propio entry point Vite
- Comparte foundations con web: colors, semantic-colors, tokens (radius), fonts
- Tipografía propia: `scrapp/tokens/typography.css` (escala 16→120px para pantalla física)
- Comando: `npm run scrapp` → http://localhost:5174
- Pantalla inicial: `scrapp/screens/ScoreScreen.jsx` (placeholder)
- Config: `vite.config.scrapp.js` en raíz (root: scrapp, port: 5174)

---

## Estado al 2026-05-29

### ApiTestModal — completo ✅
- `ApiTestModal.jsx` — modal centrado (860px) lanzado desde el botón "Run Test" en EditOrgDrawer
- Campos: Select organization (pre-seleccionada) · Enable API toggle · API Token + copy · Select team + Select user (cascada) · Average toggle · Start/End date · Get measures
- Diseño desde Figma nodo `7008:41756` (Web App)
- Patrón de transición drawer→modal→drawer sin blink: overlay del drawer permanece montado, solo cambia el contenido
- Al volver: drawer reaparece con slideIn, acordeón Kamleon API abierto (`defaultOpen`), scroll instantáneo con `useLayoutEffect`
- `noOverlay` prop en ApiTestModal para usarlo dentro de un overlay existente

---

## Estado al 2026-04-13

### Account details — completo ✅
- `AccountDetails.jsx` — view mode con secciones Account / Security
- `EditAccountDrawer` — "Add picture" turquoise-30 · Delete account (rojo, 14px, alineado) · campos alineados con padding-left 12px
- `ChangePasswordDrawer` — 3 campos Current/New/Confirm · DS Input
- `ChangePinDrawer` — 4 dígitos · boxes 47×36px radius-s · Current PIN siempre visible · ojo sin borde · ancho 350px
- `DeleteOrgModal` reutilizado con `label="account"` para confirmar borrado
- Avatar menu en topbar V2 implementado (Staff vs Centro Admin)

### Responsive — estado actual ✅
- **≤768px**: todos los drawers full-screen (inset 0, sin border-radius) · body scrollable con header sticky · footer en flujo (no se tapa con teclado) · fieldRow apilado a 1 columna
- **≤390px**: topbar — logo pasa a la izquierda junto al hamburger (89px) · columnas de stats ocultas en tabla
- Footer de todos los drawers: `padding: 16px 24px` (simétrico)

### Login — build independiente ✅
- `prototypes/Login/` — flujo completo (SignIn → WorkspaceSelector, Forgot → CheckInbox → ResetPassword, SignUp paso 1+2)
- Build separado: `vite.config.login.js` + `index-login.html` + `main-login.jsx`
- Deploy: `gh-pages/prototype-login/` — entrada 03 en landing
- Landing reordenada: V1 · V2 · Login · Storybook · Docs

### Modelo de datos — nuevo concepto ⚠️
- **Free users**: usuarios sin org que usan Kamleon en instalaciones públicas. No estaban contemplados en el modelo.
- **Solución acordada**: perfil agnostico por usuario (identity-first). La persona existe independientemente de sus membresías (0..N).
- `SearchPalette` actual tiene 3 bugs pendientes: free users no aparecen, subtítulo muestra ruta al equipo, navegación apunta a org-detail en vez de perfil agnostico.
- **Pendiente**: wireframe Figma del perfil agnostico (Daniel lo pasa el 2026-04-14) → implementar pantalla + corregir búsqueda.

### Figma — capturas en Web App (`sklnDzfw72Z1tDM46vkTGl`)
- Nodo `3268:2` — Org list desktop
- Nodo `3271:2` — Org list 390px
- Nodo `3274:2` — Center Detail 390px / Training Ground · Astonia FC
- Nodo `3471:43434` — Units global view
- Nodo `3887:40882` — Edit account drawer
- Nodo `3887:41103` — Set new PIN drawer
- Nodo `3937:48981` — Topbar 390px (hamburger + logo izquierda)

## Próximos pasos

Checklist revisado el 2026-09-16.

**Al retomar (2026-09-17):** 1) commit de lo del 16/9 → 2) seguir actualizando el prototipo con las pantallas de Figma (objetivo: listo para el martes 22/9) → 3) responder las preguntas abiertas sobre abrir el perfil desde las filas activas.

### 🔴 Esperando algo de Daniel

- [ ] **Quitar el dropdown "Role" de New User** · *paso 2 del orden sugerido*
  Los flujos By invite (uno y varios) y By hand todavía piden elegir User o Professional. Ya no tiene sentido: los Team Admin se invitan desde su propio drawer (`InviteTeamAdminDrawer`). Quedó a medias el 26/8.
  → Espera: decidir si se quita o si hay Figma nuevo

- [ ] **Sección "Hydration" del sidebar** — *diseños ya hechos en Figma*
  El ítem está en la navegación (sección Analytics) pero **no hace nada al pulsarlo**: no tiene pantalla ni handler. Lo ven todos los roles, así que es el camino sin salida más visible del prototipo. Daniel pasa el Figma y se conecta.

- [ ] **Sección "My data"** — *diseños ya hechos en Figma*
  Hoy muestra un cartel provisional ("Esta sección mostrará tus datos de hidratación personales. Diseño pendiente.", además en español dentro de una interfaz en inglés). Está en el sidebar de todos los roles desde el cambio del 10/9. Wireframes previos en `memory/my-data-wireframes.md`; ahora hay Figma, Daniel lo pasa.

- [ ] **Conectar el flujo de "Set new PIN" hecho por staff**
  En el perfil de una persona (Figma 12579:275097) la sección Security tiene el enlace "Set new Pin"; hoy en el prototipo solo lanza un toast. **El flujo ya está diseñado en Figma** (Daniel lo busca y pasa el link). Ojo: el `ChangePinDrawer` que existe pide el PIN actual, o sea que sirve para la cuenta propia, no para que un admin le ponga el PIN a otra persona — probablemente haga falta una pantalla distinta, no reutilizar esa.

- [ ] **Formulario para crear una unit**
  Ya está definido el botón "+ Assign to organization" (expandible, con ×) y el tab "Sensor history". Faltan los campos.
  → Espera: los campos mínimos

- [ ] **Ilustración del modal de bienvenida del tour**
  En código sigue un círculo de placeholder (`.welcomeArtCircle` en `OnboardingTour.module.css`). El arte real (banner turquesa con una mini-tarjeta) ya está en Figma; va para los 3 roles con tour.
  → Espera: el diseño final de Figma

- [ ] **Dónde se edita un equipo**
  `EditTeamDrawer` (nombre, estado, PIN) funciona, pero en el diseño nuevo del panel del equipo no hay botón que lo abra.
  → Espera: decidir dónde va el acceso

- [ ] **Sección de administradores de equipo**
  Confirmado que no va en el panel del equipo. Falta definir dónde va.
  → Espera: decidir dónde va

- [ ] **Perfil agnóstico de usuario**
  Una persona con 0..N membresías en equipos, incluidos los free users sin organización: datos personales + membresías + terms consent + status. Wireframes en Figma (Web App, nodos 4369:4970 y 4369:4973). Jerarquía de la membership card: org (12px M subtle) → rol (14px M strong) → centro (12px M subtle) → equipo (12px Book subtle).
  → Espera: elegir el layout D, E o F

- [ ] **Selector de idioma**
  En el menú del avatar: "Language EN ›" abre English / Español / Français. Por defecto toma `navigator.language`.
  → Espera: diseño en Figma

### 🟡 Decidido 2026-09-15

- [x] **Documentar la decisión de tabs en dos niveles** · *hecha 2026-09-15*
  `docs/features/tabs-dos-niveles.md`: problema, base en Carbon, solución y alternativas descartadas.

- [ ] **Tabs del centro con estilo secundario** · *paso 3 del orden sugerido*
  Variante más liviana del TabBar (tipo píldora) para los tabs de la card del centro, y un título con contexto en cada tab: "Users in Madrid Centro (48)". Primero en Figma (Design System), después en `design-system/components/TabBar/` y `CenterCard`.

- [ ] **Breadcrumb o botón back**
  Propuesta: en desktop, breadcrumb completo (Organizations / Acme / Madrid Centro / Equipo A) sin botones back; en mobile, solo back. Hoy el breadcrumb no muestra los niveles internos de `OrgDetailV2`.
  → Espera: confirmar con el manager

### ▶️ Plan acordado para mañana (2026-09-22)

**Meta de la semana: dejar esta lista en cero.**

1. **Repasar el rol Team Admin igual que hicimos con Center Admin** (21/9): pantalla por pantalla contra Figma, permisos aplicados, y buscar caminos sin salida — ítems del sidebar que no llevan a nada, botones sin acción, menús que solo se cierran y código muerto. El método que funcionó: recorrer sidebar → tabs → filas → menús → drawers, y anotar cada hueco antes de arreglar nada.
2. **Implementar la sección "My data"** con el Figma (Daniel lo pasa).
3. **Implementar la sección "Hydration"** con el Figma (Daniel lo pasa).

### ✅ Cerrado el 2026-09-21

Repaso completo del rol **Center Admin** más una pasada al Sidebar. Cuatro commits: `bac7a90`, `b000180`, `3bd1681`, `f0c75bb`.

- **Perfil de usuario** reescrito con el perfil agnóstico del Figma (hero, Account, Permissions, Security, Remove from team), con permisos por rol. Se abre desde la tabla del equipo, desde Users y desde las filas de admins activos; una invitación pendiente no abre perfil, porque la fila es la invitación y no la persona.
- **Units del centro**: columnas del Figma (fuera "Date added", "Type" pasa a "Model"), el lápiz abre el drawer y la fila el detalle, el detalle alinea todo a 24px y avisa con un toast al guardar.
- **Edit unit**: Installation type, textos de ayuda, modos On-screen/QR/RFID con tooltip, lista de equipos con buscador y check, campos técnicos bloqueados salvo para Owner/Admin, y el bloque de equipos se deshabilita —explicando por qué— si el modo On-screen está apagado.
- **Borrados**: borrar un equipo no existía; ahora existe y pide escribir DELETE, igual que borrar organización, centro y la cuenta propia.
- **Caminos sin salida**: "New Unit" oculto hasta que haya formulario, `UnitCard` duplicado eliminado, y Center Admin deja de ver "Units" en el sidebar (con eso desaparecen también las columnas Display/Sensor que no le tocaban).
- **Animación**: los paneles entran y vuelven con un desplazamiento corto y direccional; el sidebar anima el ancho al colapsar y los textos se encogen en vez de desaparecer.
- **Sidebar al detalle del Figma**, incluido el carril colapsado completo, y las invitaciones pendientes unificadas: una sola lista alimenta el badge y el drawer de notificaciones.
- **Storybook**: BottomSheet (era el único componente sin historia), Tag con sus 8 estados agrupados, y Sidebar actualizado.

- [ ] **Validar con el programador los tabs Users | Admins dentro de un equipo** *(añadido 2026-09-26)*
  El panel del equipo (el que ven Center Admin y Kamleon staff) no tenía tabs: los team admins salían mezclados en la tabla de miembros, con columnas de PIN y Screen que no les aplican, y sus invitaciones pendientes aparecían como filas de miembro con guiones. Se separó en dos tabs, igual que el centro. **No estaba pedido ni está en Figma**: confirmar si se queda antes de dibujarlo.

- [ ] **Probar las dos vías de código → Figma y la sincronización del DS**
  Tras cerrar el barrido: generar el mismo frame (el perfil de usuario, que ya existe dibujado) con el **MCP oficial de Figma** y con **figma-console**, ponerlos al lado del original y juzgar fidelidad. Antes, comparar qué componentes hay en código y cuáles en Figma. El mapeo formal es Code Connect y sigue bloqueado por permisos, pero las herramientas de comparación (`figma_check_design_parity`, `figma_audit_design_system`, `figma_export_tokens`) no lo necesitan. Con tiempo limitado: si sale una maqueta de cajas grises, se descarta para pantallas y se deja solo para diagramas de flujo.

- [ ] **Montar en Figma los flujos clave, un documento por rol** — guiones listos en `docs/features/center-admin-flujos-figma.md` y `docs/features/team-admin-flujos-figma.md`
  Se separan por rol a propósito: así una persona hace QA de un rol completo de una sentada. Cada guion trae los frames en orden, los textos exactos y qué verificar.

- [ ] **(Center Admin) Los 5 flujos** — guion en `docs/features/center-admin-flujos-figma.md`
  Añadir personas · ciclo de vida de una invitación · crear y borrar un equipo · editar una unit · estados vacíos y de error. Con pantallas reales, no cajas: al construirlos se actualizan de paso los frames que estaban desfasados, así que sustituyen a la lista de arreglos sueltos. El guion tiene los frames en orden, qué estado es cada uno y los textos exactos.

### 🟢 Listo para hacer

- [x] **Vista mobile de la tabla de Admins** · *decidido con el programador el 2026-09-17*
  En 390px, vista **compact** por defecto: solo el destinatario, con el Tag de estado en la segunda línea ("● Pending · Invited 11/Aug/26"), y las acciones (botón de incidencia si existe y el rol puede verla, y "⋯", que en teléfono abre el bottom sheet). Motivo: en este tab lo importante es gestionar las invitaciones, y lo que dice si algo requiere atención es el estado. Tablet y desktop mantienen la tabla completa. **El easter egg se queda a propósito** (tres toques en el título "Admins"): alterna entre compact y la propuesta anterior en cards, para recordar cómo era. La vista con scroll horizontal se eliminó.

- [x] **Abrir el perfil agnóstico desde las filas activas de Admins** · *hecho 2026-09-21*
  Las filas de admins **activos** abren el perfil de esa persona (dentro del tab, con "Back to Admins"), tanto en el centro como en la organización. Criterio "un gesto, un dueño por fila": solo las activas son clickeables (cursor y teclado solo ahí) y los botones internos (⋯, incidencia, Manage) siguen haciendo lo suyo. Si la persona está en el pool se abre su ficha real; si no, el perfil muestra "—" en lo que falte.
  **Decidido:** una invitación **pendiente no abre perfil**, aunque esa persona ya tenga cuenta en Kamleon — la fila representa *esa invitación*, no a la persona; si ya hubiera aceptado, la fila se vería como aceptada (Daniel, 21/9).
  Queda abierto solo el detalle del tooltip en touch: al tocar un texto cortado se abre 28px más arriba para que no lo tape el dedo, en vez de "encima" como se acordó con el programador.

- [ ] **Igualar la tabla de Admins del centro con la de la organización**
  Mismo componente, pero todavía con el placeholder "Search by email..." y sin "Edit user" en las acciones: hay que pasarle el permiso, porque Center Admin sí tiene `users.editData`.

- [x] **Animación de entrada de los paneles de equipo y de usuario (desktop)** · *implementado 2026-09-21*
  En desktop los sub-paneles ya no aparecen de golpe: bajar un nivel (equipo/persona/unit) entra con fade + 10px desde la derecha en 180ms, el back entra desde la izquierda en 120ms (más rápido porque se recorre muchas más veces), y cambiar de centro en la lista —mismo nivel— es solo fade de 150ms. Los cambios de tab siguen siendo instantáneos. Mobile mantiene el slide completo del 100% en 0,28s. Con `prefers-reduced-motion` se quita el desplazamiento pero se conserva el fade, para no perder el aviso de que el panel cambió. Clases: `.subFadeIn` / `.subFadeBack` / `.subFade` en `OrgDetailV2.module.css`.

- [ ] **Pasarle al programador los specs de animación**
  Sus menús contextuales se animan distinto de los nuestros, así que hay que entregarle los valores y, sobre todo, **dónde aplica cada uno**. Inventario de lo que hay hoy en el prototipo:

  | Dónde | Qué hace | Valores |
  |---|---|---|
  | **Bajar de nivel en desktop**: entrar a un equipo desde Teams, a una persona desde la tabla del equipo o desde Users, a una unit desde Units | Fade + 10px desde la derecha | 180ms · `cubic-bezier(0.4, 0, 0.2, 1)` |
  | **Volver con el back** (mismos sitios, desktop) | Fade + 10px desde la izquierda | 120ms · misma curva |
  | **Cambiar de centro** en la lista de la izquierda (mismo nivel) | Solo fade | 150ms · `ease-out` |
  | **Cambiar de tab** dentro de un centro/org | Nada, instantáneo | — |
  | **Los mismos saltos en mobile** (la pantalla se reemplaza entera) | Slide completo del 100%, con dirección | 280ms · `cubic-bezier(0.4, 0, 0.2, 1)` |
  | **Menú "+"** de la cabecera (org, centro, equipo) y **menú "⋯"** de las filas (Teams, Users, Units, Admins) | Crece desde el botón: `transform-origin` en la esquina por la que sale (`top right`), `scale(0) → scale(1)` + opacidad | 220ms · `cubic-bezier(0.25, 1, 0.5, 1)` |
  | **El mismo menú en teléfono (≤390)** | No hay menú flotante: es un BottomSheet (overlay + hoja desde abajo) | overlay 180ms · hoja 240ms `cubic-bezier(0.25, 1, 0.5, 1)` |
  | **Dropdown de filtros** ("Filters") y la aparición de "Clear filters" | Despliegue corto | 180ms · `cubic-bezier(0.16, 1, 0.3, 1)` |
  | **Drawers laterales** (Edit user, Email history, Notifications, invitaciones…) | Overlay que aparece + panel desde la derecha | overlay 200ms · panel 280ms `ease-out` |
  | **Toast** | Entra desde arriba con un rebote pequeño, a 52px del borde | 280ms · `cubic-bezier(0.34, 1.25, 0.64, 1)` |
  | **TabBar** | Glow del tab activo | 300ms · `cubic-bezier(0.25, 1, 0.5, 1)` |
  | **Tooltips del sidebar** | Fade corto | 120–150ms · `ease-out` |
  | **Checkbox** | Se dibuja el trazo del check | 200ms · `ease-out` |
  | **⌘K (SearchPalette)** | Overlay + panel desde arriba | overlay 100ms · panel 150ms |

  **Dos reglas transversales que van con los valores:**
  · `prefers-reduced-motion` (ajuste del sistema operativo, no de la app) quita el desplazamiento y la escala pero **deja el fade**, para no perder el aviso de que algo cambió; y la regla vive en el componente, no en cada pantalla — como ya hacen TabBar, BottomSheet y FilterPanel.
  · Usar `backwards` y no `both` en cualquier animación con `transform`: con `both` el elemento se queda con el transform aplicado al terminar y pasa a ser el marco de los `position: fixed` que tenga dentro. Ese fue el bug que dejó los drawers sin cubrir toda la pantalla, así que le ahorra el rato de dar vueltas.

- [ ] **Tabs en mobile de centro, unit y Team Admin**
  Ahora heredan la regla touch del TabBar (tamaño M, scroll con flecha y degradado), pero sus contenedores tienen padding y ancho máximo propios (`innerTabBarInner` de 320/420px) y probablemente muestren franjas blancas a los costados, como pasaba en la cabecera de la organización. Ajustar al llegar a esas pantallas.

- [ ] **Tarjetas de "By hand" en Add users: rol y equipo por tarjeta**
  Al partir el flujo en dos ramas (23/9), "Add users" dejó de preguntar el rol: por ahí solo entran usuarios del equipo y los admins van por "Invite an admin". Las vistas de invitación ya están limpias, pero **las tarjetas de "By hand" siguen teniendo un selector de Role y uno de Team por cada usuario**. Dos decisiones: (1) quitar el Role, que sobra por el mismo motivo; (2) si el Team de cada tarjeta se reemplaza por el del bloque de destino — más simple y coherente con "estos usuarios pertenecen a este equipo", pero se pierde poder crear en una sola tanda gente de equipos distintos.

- [ ] **Corregir errores de "From file" tocando la celda**
  Tabla editable en lugar de descargar el reporte y volver a subir el archivo. Copy acordado: "Some rows need fixing" / "Click a cell to correct it — no need to re-upload the file." Después, un modal para agregar foto a cada jugador importado (buscador, contador "X of Y added", Skip).

- [ ] **Permisos de Kamleon Editor (#10)**
  Global, edita Units ampliamente y es casi solo lectura en Orgs/Centers/Teams/Users (`docs/permissions.md`). Después, la pasada mobile en 768 y 390.

- [x] **Units para Center Admin** · *resuelto 2026-09-21*
  El problema estaba en la **vista global** de Units (la del sidebar): mostraba Display y Sensor, que son de Editor y staff (`units.viewColumn.display`/`sensor`). Solución: quitarle el ítem "Units" del sidebar, igual que a Org Admin — ya ve las units de su centro en el tab "Units" del centro, con las columnas del Figma (Unit ID, Model, Sensor usage, Total usage) y sin opción de eliminar.

- [ ] **Botón dentro de otro botón en los menús "⋯"**
  Error de consola en las tablas de Users (org y centro). Revisar si también pasa en Teams y Units.

- [ ] **Menú "⋯" de Users dentro del equipo**
  Conectar sus acciones. Team Admin sí puede eliminar usuarios de su equipo.

- [ ] **Pulir los tabs Users y Details de la organización**
  Se hicieron rápido como primera pasada (ver `docs/design-polish-backlog.md`).

- [ ] **Buscador ⌘K con free users**
  Que aparezcan los free users, con el email de subtítulo, y que al elegir uno abra su perfil (`user-profile`).
  → Depende del perfil agnóstico

### 🎨 Design System

Todo lo que toca el design system, en Figma y en código. Relacionado: **Tabs del centro con estilo secundario**, en "Decidido 2026-09-15".

- [x] **IconButton `Mode=Critical` en Figma** · *hecho por Daniel el 2026-09-16*
  Rojo en reposo, para un problema que ya existe (incidencia). Distinto de Danger, que es una acción destructiva y solo se pone rojo en hover. En código: `variant="critical"`.

- [ ] **Documentar en Figma la regla del ContextMenu en teléfono**
  En ≤390px el ContextMenu se muestra como BottomSheet; lo aplica el componente, así que cubre los 21 menús del prototipo. Es comportamiento, no variante: va en la descripción del componente. Regla → `docs/design-system-rules.md`.

- [ ] **Documentar en Figma la regla del TabBar en touch**
  En código ya está aplicada: en ≤768px el TabBar pasa solo a tamaño M y, si las pestañas no entran, muestra scroll con flecha y degradado. Falta en el Design System: un frame de especificación al lado del componente (estados en reposo / desplazado / al final / cuando entran, con medidas) y una línea en la descripción. Es regla, no componente ni variante. Wireframe y medidas listos → `docs/features/tabbar-touch-spec.md`.

- [ ] **Grosor de trazo compartido para los iconos**
  Hoy cada icono tiene `strokeWidth="1.5"` escrito a mano en su propio archivo: si se decide cambiar el grosor del set, hay que editarlos uno por uno. Centralizarlo en un único valor compartido. Origen: `IconMailWarning` llegó primero con los trazos convertidos a relleno, que no acompañaría un cambio de grosor, y se reemplazó por la versión con trazo (2026-09-16). En Figma los iconos pueden seguir convertidos a vector para escalar; en código conviene trazo.

- [ ] **Unificar el componente Tag en el DS**
  En Figma conviven el `Tag` del design system (Active / Inactive) y "Tag status - invitations", hecho aparte con los mismos estilos. Absorber el segundo dentro del primero: agregar Pending y Expired a la propiedad Status, corregir el texto de Pending a Red/29 (contraste), documentar en la descripción qué estado se usa en qué contexto, cambiar las instancias y borrar el componente viejo. En código ya está hecho. Regla y criterio → `docs/design-system-rules.md`.
  → Los colores de Expired en código son provisorios hasta ver la variante de Figma

- [ ] **Variante `tertiary` del Button en el Design System de Figma**
  Botón con relleno gris suave (`Background/Page`), sin borde y en forma de píldora. En código existe desde el 2026-09-16 (`design-system/components/Button/`) para el "Manage invitation" / "Manage admin" de las cards mobile de la tabla de Admins. En el Figma (nodo `12852:129168`) está dibujado como un frame suelto, no como instancia del Button: agregarlo como variante del componente.

- [ ] **Estados de correo en Figma: Tag "Delay"/"Delivered" y Button "tertiaryDanger"**
  Creados en código el 2026-09-17 para el drawer Email history: Tag `delay` (punto naranja, `Content/Warning`) y `delivered` (punto turquesa); Button `tertiaryDanger` (relleno gris y texto rojo, "Cancel invitation"). Agregarlos como variantes en el Design System.

- [ ] **Llevar el BottomSheet al Design System de Figma**
  El diseño existe en el archivo Web App 2.0 (nodo `12847:128367`) y el código ya lo sigue (`design-system/components/BottomSheet/`, reescrito el 2026-09-16): manija 48×4, opciones de 56px con icono de 24 y texto 16 Medium, separador entre todas, destructiva en rojo. Falta publicarlo como componente en el archivo del Design System para reutilizarlo en Users y Units.

- [ ] **Detectar diferencias entre Figma y código automáticamente**
  Origen: el TabBar M estaba en 56px en código y 48px en Figma, y el texto del Tag Pending tenía otro color; las dos cosas se descubrieron midiendo a mano. Explorar el MCP **figma-console** (más profundo que el MCP oficial de Figma), que trae herramientas pensadas para esto: `figma_check_design_parity`, `figma_audit_design_system`, `figma_get_design_changes`, `figma_diff_versions` y `figma_export_tokens`.
  Objetivo: un comando que compare el DS de Figma contra `design-system/` y liste las diferencias, y evaluar dispararlo con cada publish de la librería (webhook `LIBRARY_PUBLISH` de la API de Figma).
  Distinto de Code Connect (que muestra el código real dentro de Figma, ya listo pero bloqueado por permisos) y de la sincronización de tokens (Tokens Studio o manual, sin decidir).

- [ ] **Huecos del design system**: componente Radio, story de FilterPanel y páginas MDX de tokens en Storybook (Colors, Typography, Radius).

- [ ] **Figma Code Connect**: archivos listos; bloqueado hasta tener rol Admin en el workspace del cliente.

### 📦 Guardar el trabajo

- [x] **Commit de todo lo acumulado** · *hecho 2026-09-16, `c091caf`*
  109 archivos: roles y permisos, Invitations, Units, Usage, tour, pasada mobile y docs.

- [x] **Commit de lo del 2026-09-16** · *hecho 2026-09-17, `6bead45`*
  24 archivos: tabla de Admins en 3 tamaños, BottomSheet, reglas touch del TabBar y del ContextMenu, variantes nuevas, iconos y arreglos de drawers.

- [ ] **Deploy a GitHub Pages**
  Publicar la versión actual del prototipo.
  → Después del commit

### ⚪ Más adelante

- [ ] **Pantalla My data (#14)**: ya está en el sidebar para todos los roles (#47), pero muestra un placeholder. Incluye resolver el ítem con el sidebar colapsado.
- [ ] **Pantalla de End User**: el rol todavía no está definido del lado real.
- [ ] **Tour para Owner, Admin, Editor y End User**: definir si les corresponde.
- [ ] **Reconciliar el modal Configure API**: lo hace el programador; no tocarlo hasta que esté listo.
- [ ] **Animación "morph" del botón Create**: que el menú crezca de verdad desde el botón.
- [ ] **Pruebas de usuario con participantes reales**: guiones listos en `docs/features/`.
- [ ] **Drawers largos en 390px**: verificar el scroll de NewCenterDrawer y EditCenterDrawer en el navegador.
- [ ] **Flujos sin definir**: onboarding de una organización nueva, activación de cuenta de un admin de centro y qué ve un rol cuando entra a algo sin permiso.

### Quitados de la lista anterior (ya no aplican)

- **Panel Admin de Centro como prototipo separado**: el modelo v2 es una sola app con navegación por rol (`docs/navigation.md`).
- **Permisos del Admin de Centro restringido** y **qué campos edita sobre su centro**: resueltos en `docs/permissions.md` (matriz de 94 keys) y en el backlog (solo la imagen es editable).
- **Dashboard/home o entrada directa**: definido por rol en `docs/navigation.md`.

---

## Pendientes heredados de MEMORY.md (movidos el 2/10, sin depurar)

> Copiados tal cual al vaciar MEMORY.md. Varios están cerrados o caducados; se depuran al poner el prototipo al día. La lista viva es `docs/features/pendientes-01-10.md`.

Misma lista (con descripciones largas) en `docs/project-summary.md` → "Próximos pasos". Mostrarla siempre en texto plano en la terminal.

**Próximo (2/10):** 1) **limpiar este archivo** — 232 líneas y el sistema lo está cortando; baja a ~60 de índice y el estado se consolida en `docs/project-summary.md`, que es el que manda · 2) montar el repo aparte de la scrapp · 3) Recommendation Engine o poner el proto al día. Lista completa → `docs/features/pendientes-01-10.md`

### ▶️ Plan para mañana (22/9) — **meta: dejar la lista en cero esta semana**
1. **Repaso completo del rol Team Admin**, igual que el de Center Admin del 21/9: pantalla por pantalla contra Figma, permisos y caminos sin salida (sidebar → tabs → filas → menús → drawers)
2. **Implementar My data** (Daniel pasa el Figma)
3. **Implementar Hydration** (Daniel pasa el Figma)

### ✅ Hecho el 21/9 (commits `bac7a90`, `b000180`, `3bd1681`, `f0c75bb`)
Repaso completo de **Center Admin** + pasada al Sidebar. Detalle largo en `docs/project-summary.md` → "Cerrado el 2026-09-21". Lo esencial:
- **Perfil agnóstico** implementado (Figma 12579:275097) y abierto desde equipo, Users y filas de admins activos. Decisión: una invitación pendiente NO abre perfil
- **Units del centro** y **Edit unit** alineados con Figma; campos técnicos solo los edita Owner/Admin
- **Borrar** org/centro/equipo/cuenta pide escribir DELETE (Figma 13073:137156); borrar equipo no existía
- **Center Admin ya no ve "Units" en el sidebar** (como Org Admin): eso resolvió también las columnas Display/Sensor que no le tocaban
- **Animaciones**: paneles con entrada direccional (180ms ida / 120ms vuelta) y sidebar con ancho animado al colapsar
- **Sidebar** al detalle del Figma (incluido carril colapsado) e **invitaciones pendientes unificadas**: `PENDING_INVITES` en `rolePersonas.js` alimenta el badge y el drawer de notificaciones
- **Storybook**: BottomSheet (nuevo), Tag (8 estados) y Sidebar actualizado

### 🔴 Esperando algo de Daniel
- [ ] **Dropdown "Role" (User/Professional) en NewUserDrawer** *(paso 2)* — sigue en By invite/By hand; ya no tiene sentido (Team Admin se invita desde `InviteTeamAdminDrawer`). Decidir si se quita o hay Figma nuevo. Detalle → `memory/prototypes.md` (26/8)
- [ ] **Sección "Hydration" del sidebar** — el ítem no hace nada al pulsarlo (sin pantalla ni handler), lo ven todos los roles. Diseños ya hechos en Figma, Daniel pasa el link
- [ ] **Sección "My data"** — hoy un cartel provisional en español ("Diseño pendiente"). Diseños ya hechos en Figma, Daniel pasa el link
- [ ] **Conectar el flujo de "Set new PIN" hecho por staff** — el flujo YA existe en Figma (Daniel pasa el link); hoy el enlace del perfil solo lanza un toast. `ChangePinDrawer` no sirve: pide el PIN actual (cuenta propia)
- [ ] **Formulario crear unit** — Daniel pasa los campos mínimos
- [ ] **Ilustración modal de bienvenida del tour** — Daniel pasa el Figma final
- [ ] **Acceso para editar un equipo** — `EditTeamDrawer` sin punto de entrada en el diseño nuevo; decidir dónde va
- [ ] **Sección de administradores de equipo** — no va en el panel del equipo; decidir dónde
- [ ] **Perfil agnóstico de usuario** — elegir layout D/E/F en Figma (ver `memory/account-details.md`)
- [ ] **Language selector** — Daniel hace Figma primero · menú del avatar · "Language EN ›" → English/Español/Français · default `navigator.language`

### 🟡 Decidido 2026-09-15
- [x] Documentar decisión de tabs en dos niveles → `docs/features/tabs-dos-niveles.md`
- [ ] **Tabs del centro con estilo secundario** *(paso 3)* — variante secundaria del TabBar + título con contexto ("Users in Madrid Centro (48)"), ver `memory/patterns.md` TabBar
- [ ] **Breadcrumb vs back** — propuesta: desktop solo breadcrumb completo, mobile solo back. Falta confirmar con el manager

- [ ] **Flujos clave en Figma, un doc por rol** (para poder hacer QA rol por rol): `docs/features/center-admin-flujos-figma.md` (5 flujos) y `docs/features/team-admin-flujos-figma.md` (4 + estados vacíos). Traen frames, textos exactos y qué verificar
- [ ] ~~5 flujos clave del Center Admin en Figma~~ — guion con frames y textos exactos en `docs/features/center-admin-flujos-figma.md` (añadir personas · invitación · crear/borrar equipo · editar unit · vacíos y errores). Con pantallas reales: sustituyen a la lista de arreglos sueltos
### 🟢 Listo para hacer
- [x] **Vista mobile tabla Admins** — decidido 17/9 con el programador: **compact** por defecto en 390 (Recipient con Tag de estado en 2ª línea + incidencia/⋯; sin Role/Center/Team/Status). Tablet/desktop tabla completa. Easter egg SE QUEDA a propósito (3 toques en el título: alterna compact ↔ cards, localStorage `kamleon-invitations-mobile-layout-v2`), para recordar la propuesta de cards. Vista scroll eliminada
- [x] **Filas activas de Admins abren el perfil agnóstico** — hecho 21/9: solo las filas activas (cursor/teclado solo ahí), los botones internos no navegan, el perfil se abre dentro del tab con "Back to Admins". **Una invitación pendiente NO abre perfil**: la fila es la invitación, no la persona. Sigue abierto el tooltip en touch (28px arriba vs "encima")
- [ ] **Tabla de Admins del centro** — igualar con la de la org: placeholder "Search..." y pasar `canEditUsers` (Center Admin tiene `users.editData`), hoy no muestra "Edit user"
- [x] **Animación de entrada de los paneles (desktop)** — hecho 21/9: bajar de nivel = fade + 10px desde la derecha 180ms; back = desde la izquierda 120ms; cambiar de centro = solo fade 150ms; tabs sin animación; reduced-motion deja solo el fade (`.subFadeIn`/`.subFadeBack`/`.subFade`)
- [ ] **Pasarle los specs de animación al programador** — sus menús contextuales se animan distinto. La tabla completa (qué se anima, DÓNDE aplica y con qué valores: paneles al bajar de nivel, menú +/⋯, BottomSheet, filtros, drawers, Toast, TabBar, tooltips, checkbox, ⌘K) está en `docs/project-summary.md` → Próximos pasos. Incluye las dos reglas transversales: `prefers-reduced-motion` en el componente, y `backwards` y no `both` con transform
- [ ] **Tabs en mobile de centro / unit / Team Admin** — ahora heredan la regla touch del TabBar, pero sus wrappers tienen padding/max-width (`innerTabBarInner` 320/420) y probablemente muestren franjas blancas como pasaba en la org; ajustar al llegar a esas pantallas
- [ ] **Tarjetas de "By hand" (Add users)** — todavía piden Role y Team por tarjeta; el rol sobra (por esa rama solo entran usuarios) y hay que decidir si el equipo lo fija el bloque de destino o sigue por tarjeta
- [ ] **"From file": corregir errores tocando la celda** + modal de fotos post-import (acordado 26/8, sin implementar)
- [ ] **Permisos Kamleon Editor (#10)** + pasada mobile 768/390
- [x] **Units para Center Admin** — resuelto 21/9: el fallo estaba en la vista global del sidebar (columnas Display/Sensor). Se le quita el ítem "Units" del sidebar, como a Org Admin; ve las units en el tab de su centro
- [ ] **Bug `<button>` anidado** en menús "⋯" (Users; revisar Teams/Units)
- [ ] **Menú "⋯" de Users en el equipo** — conectar acciones (Team Admin sí puede eliminar)
- [ ] **Pulir tabs Users y Details de la org** (ver `docs/design-polish-backlog.md`)
- [ ] **SearchPalette ⌘K** — free users, subtítulo → email, nav → `user-profile` · depende del perfil agnóstico

### ✅ Hecho el 27/9 — primer flujo construido en Figma (15 commits, `c82bc7c`→`bdb1a9b`)
Flujo 2 del Team Admin montado con componentes reales (6 pantallas en `🧪 Flujos — prueba` de Web
App 2.0). Lo valioso fueron los 7 fallos que destapó: 8 variantes del Button con el color horneado
en negro pese al enlace correcto, 16 variantes con el texto sordo (Button Danger, Text input, Text
area), `Secondary`/`Tertiary` con significados cruzados entre Figma y código, 9 medidas mal en el
modal y datos caducados en la pantalla base. `ds:compare` pasó de 6 a 8 pasadas y ahora vigila las
tres páginas de Foundations y la salud interna de los componentes. Detalle → `memory/design-system-sync.md`

### ✅ Hecho el 26/9 — sincronización del Design System (10 commits, `f6df952`→`69cdf27`)
Fusionadas las dos colecciones de color de Figma en una · 35 de 35 variables documentadas y
enganchadas al token en la página `-- Colors` · escala de elevación (33 sombras a mano → 5 tokens
con los mismos nombres en los dos lados) · familias `Content/Inverse` y `Background/Inverse` para
la superficie oscura del sidebar · el Tag pierde la familia de rol y gana `Status/*` · anillo de
foco unificado · radios sin variantes por dispositivo · 7 variantes sin nombre resueltas.
Detalle, decisiones y pendientes → `memory/design-system-sync.md`

### 🎨 Design System
- [x] **IconButton `Mode=Critical` en Figma** — hecho por Daniel 16/9 (rojo en reposo = problema existente; Danger = destructiva, rojo solo en hover). En código: `variant="critical"`
- [ ] **Documentar en Figma la regla del ContextMenu en teléfono** — ≤390 se muestra como BottomSheet (lo aplica el componente, 21 menús). Solo descripción del componente, no variantes. Regla → `docs/design-system-rules.md`
- [ ] **Documentar en Figma la regla del TabBar en touch** — frame de especificación + línea en la descripción del componente (regla, no componente/variante). Código ya aplicado. Wireframe ASCII y medidas → `docs/features/tabbar-touch-spec.md`
- [ ] **Grosor de trazo compartido para los iconos** — hoy cada icono tiene `strokeWidth="1.5"` a mano; centralizar en un único valor. Origen: `IconMailWarning` llegó con trazos convertidos a relleno y se cambió a la versión con trazo (16/9). En código conviene trazo; en Figma pueden seguir como vector para escalar
- [ ] **Unificar el componente Tag en el DS (Figma)** — absorber "Tag status - invitations" dentro del `Tag`: Pending/Expired como valores de Status, texto de Pending a Red/29, cambiar instancias y borrar el suelto. Código ya hecho (Expired con colores provisorios). Regla → `docs/design-system-rules.md`
- [x] ~~**Variante `tertiary` del Button en Figma**~~ — 26/9: ya existía como variante real — gris suave (`Background/Page`), sin borde, píldora; en código desde 16/9 para "Manage invitation/admin" de las cards mobile. En Figma (12852:129168) es un frame suelto, no instancia
- [ ] **Tag `delay`/`delivered` y Button `tertiaryDanger` en Figma** — creados en código 17/9 para Email history
- [ ] **Llevar el BottomSheet al DS de Figma** — diseño de referencia en Web App 2.0 nodo `12847:128367`; código reescrito según ese nodo (16/9): manija 48×4 placeholder, ítems 56px, icono 24, texto 16 Medium, separador entre todos, destructiva roja, sin título. Falta publicarlo como componente del DS
- [ ] **Detectar diferencias Figma ↔ código** *(26/9: hecho a mano, ver `memory/design-system-sync.md`; falta automatizarlo)* — probar MCP **figma-console** (`figma_check_design_parity`, `figma_audit_design_system`, `figma_get_design_changes`, `figma_diff_versions`, `figma_export_tokens`) + script/comando de comparación, idealmente disparado en cada publish de la librería (webhook `LIBRARY_PUBLISH`). Origen: TabBar M 56 vs 48 y color del Tag, detectados a mano. Distinto de Code Connect y de la sync de tokens
- [ ] Design System: Radio (existe en Figma, sin programar), story FilterPanel, Storybook Foundations
- [ ] Code Connect — BLOQUEADO: Daniel necesita rol Admin en workspace del cliente

### 📦 Guardar el trabajo
- [x] **Commit de todo lo acumulado** — hecho 16/9, `c091caf` (109 archivos)
- [x] **Commit de lo del 16/9** — hecho 17/9, `6bead45` (24 archivos)
- [ ] **Deploy a GitHub Pages** — después del commit

### ⚪ Más adelante
- [ ] Pantalla My data (#14) + ítem con sidebar colapsado · pantalla End User
- [ ] Tour para Owner/Admin/Editor/End User (definir si corresponde)
- [ ] Configure API modal — lo hace el programador, NO tocar (ver `memory/pending-configure-api-modal.md`)
- [ ] Animación morph del botón Create (ver `memory/animation-improvements.md`)
- [ ] Pruebas de usuario con participantes reales (guiones listos en `docs/features/`)
- [ ] Flujos sin definir: onboarding org nueva · activación admin de centro · pantalla "sin acceso"
