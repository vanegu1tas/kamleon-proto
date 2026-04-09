# Historial del proyecto — Kamleon

Contenido de referencia histórica. No es necesario leer esto en sesiones normales.

---

## Estructura del repo

```
design-system/
  tokens/         fonts.css · colors.css · semantic-colors.css · typography.css · text-styles.css · tokens.css
  components/     Button · Tag · SearchBar · Input · Dropdown · Textarea · Toggle · SegmentedControl
                  TabBar · ContextMenu · ToolbarButton · IconButton · Sidebar · SidebarItem · Toast · FilterPanel
  icons/          outline/ (23 iconos) · filled/ (4 iconos) · duotono IconSb* (5) · LogoKamleon
fonts/            CircularPro-Book/Medium/Bold.otf
prototypes/
  main.jsx                          entry point dev local
  StaffOrganizaciones/              V1: sidebar + lista + drill-down
    mockData.js                     datos mock centralizados (compartido con V2)
    screens/                        OrgDetail · CenterDetail · TeamDetail · UserDetail + todos los drawers
  StaffOrganizacionesV2/            V2: master-detail
    StaffOrganizacionesV2.jsx       shell · SearchPalette · topbar
    screens/
      OrgDetailV2.jsx               layout master-detail · CenterCard · TeamCard · UserCard
      UnitsGlobalView.jsx           vista global de units
docs/             data-model.md · navigation.md · permissions.md · project-summary.md · history.md
                  features/user-test-script-navegacion.md · user-test-script-v2.md
landing.html      HTML estático · shader WebGL · fondo oscuro
personal/         presentacion-claudecode.md
```

---

## Tokens CSS — referencia completa

### Tipografía

| Estilo | Tamaño | Peso |
|---|---|---|
| text-heading-h1-bold | 32px | Bold |
| text-heading-h2 | 24px | Medium |
| text-heading-h3 | 20px | Medium |
| text-body-l-medium | 16px | Medium |
| text-body-m-medium | 14px | Medium |
| text-body-m-book | 14px | Book |
| text-label-section | 12px | Medium · uppercase · ls:0.6px |
| text-label-table | 12px | Medium · uppercase · ls:0.24px |

### Colores semánticos (semantic-colors.css)

| Grupo | Tokens |
|---|---|
| Background | bg-page · bg-surface · bg-surface-raised · bg-surface-subtle · bg-surface-disabled · bg-icon-hover · bg-sidebar · bg-nav-active |
| Border | border-default · border-strong · border-focus · border-error |
| Text | text-strong · text-subtle · text-disabled · text-placeholder · text-inverse |
| Status | status-active · status-inactive · status-error · status-error-subtle |

### Iconos duotono — variables CSS

| Variable | Default | Selected |
|---|---|---|
| `--icon-primary` | white | turquoise-51 |
| `--icon-secondary` | grey-65 | turquoise-30 |
| `--icon-accent` | black | bg-nav-active |

---

## Checklist completado — Design System

- [x] Button primary/secondary · s/m
- [x] Tag active/inactive/professional/user
- [x] SidebarItem icon+label · default/selected · tooltips portal
- [x] Sidebar shell · header · toggle · secciones
- [x] SearchBar · estados default/hover/focus/error/disabled
- [x] TabBar · indicador deslizante + glow · 2-4 tabs · controlled
- [x] ContextMenu · items con icono · variante danger
- [x] ToolbarButton · selected state
- [x] IconButton · variante danger · tooltip opcional
- [x] Toggle · S/M · label opcional
- [x] SegmentedControl · pill activo negro
- [x] Input · label/description/error/disabled · focus ring solo teclado · tel filtra caracteres
- [x] Dropdown · select nativo estilizado
- [x] Textarea · label/description/error/disabled · min-height 120px
- [x] Toast · success/critic · onUndo · auto-dismiss · top 52px · animación desde arriba
- [x] FilterPanel · ToolbarButton + badge + checkboxes + Clear · gestiona open/close

---

## Checklist completado — Prototipos

- [x] V1 completo: OrgList + OrgDetail + CenterDetail + TeamDetail + UserDetail + todos los drawers CRUD
- [x] V2 shell: SearchPalette ⌘K · topbar · responsive 768px (slide lateral)
- [x] OrgDetailV2: master-detail · listPanel/detailPanel · botón ← Centers mobile
- [x] CenterCard tabs: Detail · Teams · Users · Units
- [x] TeamCard: tabla miembros · search + FilterPanel · context menu · back button
- [x] UserCard: Settings → EditUserDrawer
- [x] UnitsGlobalView: KPI cards · tabla expandible · OrgPillSelect + CenterPillSelect + FilterPanel
- [x] NewUserDrawer: SegmentedControl "By invite / Manually" · todos los campos
- [x] NewCenterGlobalDrawer: selector de org · tarjetas de contactos
- [x] NewCenterDrawer: con contexto de org
- [x] DeleteOrgModal: acepta prop `label` para reutilizar con centers
- [x] EditCenterDrawer: todos los campos + contactos + admins read-only
- [x] SidebarItem: line-height 24px unificado (fix salto de altura al cambiar pantalla)
- [x] GitHub Pages: V1 + V2 + Storybook + landing · GitHub Actions deploy

---

## Landing page (`landing.html`)

HTML estático · fondo oscuro #0c1016 · max-width 480px
Shader: Canvas WebGL · noise domain-warped (fbm sobre fbm) · velocidad u_time * 0.08
Fuente: Circular Pro con fallback Inter · tokens hardcodeados (no usa DS tokens)
A11y: contraste #5a7d96 · focus-visible turquesa · landmarks semánticos

---

## Presentación Claude Code

Archivo: `personal/presentacion-claudecode.md`
Título: *From frame to commit. How Claude Code is changing my workflow.*
19 diapositivas + slides extras A/B/C + respuestas auditoría
Pendiente: diapositiva 2 (pregunta al público por definir)

---

## Figma — nodos relevantes (Web App `sklnDzfw72Z1tDM46vkTGl`)

- `3268:2` — Org list desktop (2026-03-18)
- `3271:2` — Org list 390px (2026-03-18)
- `3274:2` — Center Detail 390px / Training Ground · Astonia FC (2026-03-18)
- `3471:43434` — Units global view

---

## Mock data — IDs por organización

- Astonia FC (1): users 1-12 · centers 101-102
- Arsenal (2): users 19-31 · centers 201
- Baskonia (3): users 32-52 · centers 301-302
- CAR Sant Cugat (4): users 53-63 · centers 401
- Sierra Nevada (5): users 64-70 · centers 501
- CEAR (6): users 71-74 · centers 601
- CEM Joan Miró (7): users 75-87
- CNEA (8): users 88-90
- Dynatech (9): users 91-94
