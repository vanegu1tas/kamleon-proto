# Navegación

Mapa de navegación de la plataforma por rol. Documento vivo — se actualiza al diseñar cada feature.

## Estructura general

La plataforma tiene dos mundos separados según el rol del usuario autenticado:

- **Panel de Staff** — para Super Admin y Admin
- **Panel de Admin de Centro** — para administradores de centro (completo o restringido)

---

## Panel de Staff

```
/staff
│
├── /organizaciones
│   ├── lista de organizaciones
│   ├── /nueva
│   └── /:org-id
│       ├── detalle / edición de organización
│       ├── /centros
│       │   ├── lista de centros
│       │   ├── /nuevo
│       │   └── /:centro-id
│       │       ├── detalle / edición de centro
│       │       ├── /equipos
│       │       │   ├── lista de equipos
│       │       │   ├── /nuevo
│       │       │   └── /:equipo-id  →  detalle + usuarios del equipo
│       │       └── /admins
│       │           ├── lista de admins del centro
│       │           ├── /nuevo
│       │           └── /:admin-id  →  detalle + configuración de permisos
│       └── /usuarios        (vista global de usuarios de la org)
│
└── /staff-admins            (solo Super Admin)
    ├── lista de admins de staff
    ├── /nuevo
    └── /:admin-id
```

## Panel de Admin de Centro

```
/admin
│
├── /equipos
│   ├── lista de equipos del centro
│   ├── /nuevo
│   └── /:equipo-id
│       ├── detalle del equipo
│       └── lista de usuarios
│
├── /usuarios
│   ├── vista global de usuarios del centro
│   ├── /nuevo
│   └── /:usuario-id  →  detalle + cambio de equipo
│
└── /configuracion          (pendiente de definir alcance)
```

---

## Pendientes

- Definir si hay dashboard/home con resumen o se entra directo a la lista principal.
- Definir flujo de onboarding para nueva organización.
- Definir flujo de activación de cuenta para admin de centro recién creado.
- Definir qué ve un Admin restringido cuando intenta acceder a algo que no tiene permiso.

---

> Cada sección se detalla en `docs/features/` cuando se diseña el feature correspondiente.
