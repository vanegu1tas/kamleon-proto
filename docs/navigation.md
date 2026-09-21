# Navegación

Mapa de navegación de la plataforma por rol. Documento vivo — se actualiza al diseñar cada feature.

Verificado contra el código el 2026-09-15 (`prototypes/StaffOrganizacionesV2/`).

## Estructura general

Modelo v2: **una sola app**, con navegación condicional por rol — no hay paneles separados (el modelo viejo de "Panel de Staff" vs "Panel de Admin de Centro" quedó obsoleto). El sidebar y las pantallas se adaptan según cuál de los 7 roles esté logueado.

### Roles

**Kamleon Staff** (interno)
- Kamleon Owner — acceso total (cuenta técnica del programador)
- Kamleon Admin — acceso total (la cuenta que usa el staff real de Kamleon)
- Kamleon Editor — global, sin scope de org · edita Units ampliamente, resto solo-lectura

**Cliente**
- Org Admin — dueño de toda su organización, todos sus centros a la vez
- Center Admin — administra uno o varios centros
- Team Admin — administra los equipos a los que fue asignado

**Otro**
- End User — sin acceso al panel de staff (pantalla propia todavía sin diseñar, ver `docs/project-summary.md`)

Matriz completa de 94 permission keys → `docs/permissions.md`.

---

## Sidebar

```
MANAGEMENT
 ├── Center control   → entry point principal (drill-down por rol, ver abajo)
 └── Units            → vista global de units de la org/centro

ANALYTICS
 ├── Hydration         (ítem en el sidebar, sin pantalla conectada — click no hace nada)
 └── Usage             → reportes de uso/performance de units, descarga mensual

(footer del sidebar, encima de la tarjeta de usuario)
 └── My data           → todos los roles (placeholder, pantalla sin diseñar)
```

**My data para todos los roles** (cambio 2026-09-10, tarea #47): antes era exclusivo de End User. Ahora cualquier rol ve sus propios datos personales sin tener que hacer "Switch role" a End User.
- Roles de staff/cliente: ítem en el footer del sidebar (`personalItem` del componente `Sidebar`). Funciona como toggle: al abrirlo se oculta la pantalla actual, y al clickear cualquier ítem de MANAGEMENT/ANALYTICS o "Account details" se vuelve.
- End User: My data es su única pantalla, así que va como sección principal del sidebar (sin toggle).
- Con el sidebar colapsado (desktop) el footer no se muestra, así que My data no es accesible en ese estado. Pasa lo mismo con la tarjeta de usuario.

Ítems ocultos por rol (`rolePersonas.js`, `HIDDEN_NAV_ITEMS`):
- **Team Admin**: no ve "Units" ni "Usage" (no administra hardware).
- **Org Admin**: no ve "Units" en el sidebar — ya tiene ese mismo contenido dentro del tab "Units" a nivel organización, sería redundante.
- **Center Admin**: tampoco ve "Units" en el sidebar (21/9), por el mismo motivo: las units de su centro están en el tab "Units" del centro. De paso evita la vista global, que muestra columnas Display y Sensor reservadas a Editor y staff de Kamleon.

---

## Drill-down de "Center control" (por rol)

```
Center control
 │
 ├─ [Org Admin] entra en el nivel Organización
 │   Organización
 │    ├─ tab Centers    → lista de centros
 │    ├─ tab Users      → vista agregada de usuarios de toda la org
 │    ├─ tab Details    → info de la org, integraciones, API token
 │    ├─ tab Units       (si tiene permiso — reemplaza el ítem de sidebar)
 │    └─ tab Admins      (Org Admins + Center Admins pendientes, consolidado)
 │        │
 │        └─ click en un Centro →
 │            Centro
 │             ├─ tab Details
 │             ├─ tab Teams     → lista de equipos
 │             │    └─ click en un Team → roster (Member/Status/PIN/Screen)
 │             ├─ tab Users     → vista agregada de usuarios del centro
 │             ├─ tab Units
 │             └─ tab Admins    (Center Admins + Team Admins pendientes)
 │
 ├─ [Center Admin] entra directo en el nivel Centro (sin org arriba)
 │   Mismo árbol que el Centro de arriba (Details/Teams/Users/Units/Admins),
 │   pero puede tener más de un centro asignado — selector de centros en vez
 │   de la lista de la organización.
 │
 └─ [Team Admin] entra directo en el nivel Team (solo sus equipos asignados)
     Lista de sus equipos → click en uno →
     Team → tab Users (roster: Member/Status/PIN/Screen)
```

---

## Pendientes

- **Hydration**: ítem de sidebar sin pantalla conectada — clickear no hace nada.
- **My data**: muestra un placeholder para todos los roles. La pantalla real está sin diseñar (tarea #14, "Diseñar pantalla: End User").
- **Kamleon Editor**: permisos todavía sin aplicar sobre este árbol (tarea #10).
- Definir flujo de onboarding para nueva organización.
- Definir flujo de activación de cuenta para admin de centro recién creado.
- Definir qué ve un rol cuando intenta acceder a algo que no tiene permiso (hoy se oculta directamente del sidebar/tabs, no hay pantalla de "sin acceso").

---

> Cada sección se detalla en `docs/features/` cuando se diseña el feature correspondiente. Matriz de permisos completa → `docs/permissions.md`.
