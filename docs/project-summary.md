# Project Summary — Kamleon Design System

Estado del proyecto al 2026-04-02. Referencia rápida para retomar el trabajo.

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
│   │       ├── EditOrgDrawer.jsx           ✅ drawer edición org · Status + Integrations
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

### Pendientes abiertos en docs
- [ ] Lista completa de permisos del Admin de Centro restringido
- [ ] Qué campos puede editar el Admin CTR sobre su propio centro
- [ ] Dashboard/home o entrada directa a lista
- [ ] Flujo de onboarding de nueva organización
- [ ] Flujo de activación de cuenta de admin de centro recién creado

### Pendientes de diseño / prototipo (2026-04-22)
- [ ] **Perfil agnóstico de usuario** — wireframes Figma listos (explorations en nodos 4369:4970 y 4369:4973 · Web App). Implementar prototipo cuando Daniel confirme layout final. Jerarquía membership card: org(12px M subtle) → rol(14px M strong) → centro(12px M subtle) → equipo(12px Book subtle). Opciones D/E/F de layout pendientes de decidir en Figma.
- [ ] **Units — crear unit** — botón "+ Assign to organization" en formulario · expandible con × · campos mínimos pendientes de confirmar · tab historial: "Sensor history"
- [ ] **SearchPalette** — corregir tras perfil agnóstico: free users visibles, subtítulo → email, nav → user-profile

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

### Inmediatos
- [ ] **Perfil agnostico de usuario** — wireframe Figma pendiente · incluye: datos personales + membresías (0..N) + terms consent + status · free users sin membresías
- [ ] **SearchPalette** — corregir tras implementar perfil agnostico: incluir free users, subtítulo → email, navegación → `user-profile`

### Design System
- [ ] **FilterPanel** — story pendiente
- [ ] Code Connect mappings *(bloqueado: permisos en workspace del cliente)*
- [ ] Storybook Foundations: páginas MDX para tokens (Colors, Typography, Radius)

### V2 — pendientes
- [ ] **Panel Admin de Centro** — prototipo separado (no existe aún)
- [ ] Drawers responsive 390px — verificación visual en browser
- [ ] Responsive drawers con contenido largo (NewCenterDrawer, EditCenterDrawer) — revisar scroll en mobile

### Docs / definición
- [ ] Lista de permisos del Admin de Centro restringido
- [ ] Qué campos puede editar el Admin CTR sobre su propio centro
- [ ] Dashboard/home o entrada directa a lista
- [ ] Flujo de onboarding de nueva organización
- [ ] Flujo de activación de cuenta de admin de centro recién creado
