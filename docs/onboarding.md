# Kamleon — Contexto del proyecto

## Qué es Kamleon

Kamleon es un dispositivo físico que se instala sobre el urinal en vestuarios/instalaciones deportivas: mide datos (hidratación, uso, etc.) y muestra información en una pantalla táctil integrada.

Este repo cubre dos productos distintos:

- **Web app de staff** — la plataforma donde el personal de Kamleon y sus clientes (organizaciones deportivas) administran centros, equipos, usuarios y dispositivos.
- **Scrapp** — la interfaz de la pantalla física sobre el urinal (ver más abajo).

Stack: **React + CSS Modules**. Diseño en **Figma**, con Code Connect para conectar componentes.

---

## Modelo de datos (web app)

```
ORGANIZACIÓN
└── CENTRO
    ├── EQUIPO
    │   └── USUARIO          (pertenece a exactamente un equipo)
    ├── ADMIN DE CENTRO       (puede haber varios por centro)
    └── UNIT (hardware instalado)
        └── DISPLAY + K-POD (sensor, reemplazable)
```

- Una organización tiene varios centros; un centro tiene varios equipos; un equipo tiene varios usuarios.
- Un usuario pertenece a **exactamente un** equipo.
- Un Admin de Centro tiene dos cuentas vinculadas: una cuenta de administración y una cuenta de usuario normal (es miembro de un equipo como cualquier otro).
- Una Unit (unidad física instalada) tiene un Display y un K-POD activo.
- Todas las entidades tienen un único estado: **activo / inactivo** (no hay "pendiente" ni otros estados intermedios).

---

## Roles

Es **una sola app**, no paneles separados — lo que cambia según el rol es la navegación, el punto de entrada al iniciar sesión, y qué acciones están disponibles.

### Staff de Kamleon (acceso interno)
- **Kamleon Owner / Admin** — acceso total a toda la plataforma, todas las organizaciones.
- **Kamleon Editor** — acceso amplio para editar Units (hardware); en el resto (Organizaciones, Centros, Equipos, Usuarios) es mayormente de solo lectura.

### Roles de cliente (organizaciones que usan Kamleon)
- **Org Admin** — administra toda su organización (todos sus centros a la vez).
- **Center Admin** — administra uno o más centros puntuales: equipos, usuarios y otros administradores de ese centro.
- **Team Admin** — administra uno o más equipos asignados: sus usuarios, PIN de acceso, visibilidad en pantalla.
- **End User** — usuario final, ve su propio perfil y datos.

**Kamleon Owner y Kamleon Admin tienen acceso total a todo** (bypass completo) — no aparecen en las tablas de abajo porque no tienen restricciones. Las tablas muestran qué puede hacer cada uno de los otros 4 roles.

---

## Matriz de permisos

✓ = puede hacerlo · — = no puede

### Organizaciones
| Acción | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| Crear organización | ✓ | — | — | — |
| Eliminar organización | — | — | — | — |
| Editar datos básicos (nombre, dirección, email, etc.) | — | — | — | — |
| Editar imagen | — | ✓ | — | — |
| Invitar / eliminar administradores de la org | — | ✓ | — | — |
| Ver / editar integraciones | ✓ ver | ✓ ver + editar config | — | — |
| Ver API Token | ✓ | ✓ | — | — |

### Centros
| Acción | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| Eliminar centro | — | — | — | — |
| Editar datos básicos | — | — | — | — |
| Editar imagen | — | ✓ | ✓ | — |
| Invitar administradores de centro | ✓ | ✓ | ✓ | — |
| Eliminar administradores de centro | — | ✓ | ✓ | — |

### Equipos
| Acción | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| Crear equipo | — | — | ✓ | — |
| Editar / cambiar estado | — | — | ✓ | ✓ |
| Eliminar equipo | — | — | ✓ | — |
| Gestionar miembros (editar, remover, PIN) | — | — | ✓ | ✓ |

### Usuarios
| Acción | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| Invitar usuarios | — | — | ✓ | ✓ |
| Editar datos de un usuario | — | — | ✓ | ✓ |
| Eliminar usuario | — | — | ✓ | ✓ |
| Cambiar estado (activo/inactivo) | — | ✓ | ✓ | ✓ |
| Activar/desactivar PIN, regenerar PIN | — | — | ✓ | ✓ |
| Mostrar/ocultar en pantalla del dispositivo | — | — | ✓ | ✓ |

A quién puede invitar cada rol: Org Admin invita Org Admin y Center Admin · Center Admin invita Center Admin, Team Admin y usuarios de su centro · Team Admin invita Team Admin y usuarios, limitado a su propio equipo.

### Units (hardware)
| Acción | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| Ver lista de units | ✓ | ✓ | ✓ | — |
| Crear unit | ✓ | — | — | — |
| Editar unit (campos generales) | ✓ | ✓ | ✓ | — |
| Ver/editar campos técnicos | ✓ | — | — | — |
| Eliminar unit | — | — | — | — |

Team Admin no tiene acceso a Units en absoluto.

### Analytics
| Acción | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| Usage Analytics | ✓ | ✓ | ✓ | — |
| Hydration Analytics | ✓ | ✓ | ✓ | ✓ |

La matriz completa y más detallada (94 permission keys exactos, con las notas de por qué cada decisión) vive en `docs/permissions.md`, por si hace falta ir al detalle fino.

---

## Design System

Vive en `design-system/` dentro del repo, con catálogo navegable en Storybook (`npm run storybook`).

**Colores** — tokens semánticos, no valores hardcodeados (ej. `--color-bg-page`, `--color-text-strong`, `--color-status-active`). Paleta base: negro/blanco + grises + turquesa (color de marca, usado en focus/estados activos) + rojo (errores/inactivo). Nunca se usan nombres cortos sin prefijo — siempre `--color-*`.

**Tipografía**: familia **Circular Pro** (`--font-family-primary`), con una escala de tamaños (`--font-size-*`) y pesos (`--font-weight-*`) propios.

**Componentes ya construidos**: Button, Input, Textarea, Dropdown (= "Select"), Checkbox, Toggle, SegmentedControl, Tag, Toast, SearchBar, TabBar, Sidebar, ContextMenu, FilterPanel, IconButton, ToolbarButton. Falta: Radio.

**Iconos**: dos sets, `outline` y `filled`, más algunos íconos de marca específicos (logo, íconos de sidebar).

---

## Scrapp

Proyecto aparte dentro del mismo repo: la interfaz de la pantalla física instalada sobre el urinal (1280×800, orientación horizontal, uso táctil). Muestra información al usuario final en el momento (score, hidratación, etc.). Tiene su propio set de tokens y pantallas, independiente de la web app de staff.

---

## Dónde está todo

- **Figma — Design System**: `ozgwasF3ziQyznQS0z0dM1`
- **Figma — Web App**: `sklnDzfw72Z1tDM46vkTGl`
- `npm run prototype` → prototipos web de staff (`localhost:5173`)
- `npm run scrapp` → prototipo de Scrapp (`localhost:5174`)
- `npm run storybook` → catálogo de componentes del design system (`localhost:6006`)
