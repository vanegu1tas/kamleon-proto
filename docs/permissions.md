# Matriz de permisos

Qué puede hacer cada rol sobre cada entidad de la plataforma.

## Roles

| Rol | Scope | Descripción |
|---|---|---|
| **Super Admin** | Global | Acceso total. Gestiona admins de staff. |
| **Admin** | Global | Crea y configura organizaciones, centros, equipos y usuarios. Puede restringir permisos de admins de centro. |
| **Admin de Centro (completo)** | Su centro | Gestiona su centro: equipos, usuarios. No puede crear otros admins de centro. |
| **Admin de Centro (restringido)** | Su centro | Solo tiene los permisos que el staff le habilitó. |

---

## Capacidades por entidad

### Organizaciones

| Acción | Super Admin | Admin | Admin CTR | Admin CTR restringido |
|---|:---:|:---:|:---:|:---:|
| Ver lista | ✓ | ✓ | — | — |
| Crear | ✓ | ✓ | — | — |
| Editar | ✓ | ✓ | — | — |
| Activar / Inactivar | ✓ | ✓ | — | — |

### Centros

| Acción | Super Admin | Admin | Admin CTR | Admin CTR restringido |
|---|:---:|:---:|:---:|:---:|
| Ver lista (su org) | ✓ | ✓ | ✓ (solo el suyo) | ✓ (solo el suyo) |
| Crear | ✓ | ✓ | — | — |
| Editar | ✓ | ✓ | ✓* | ? |
| Activar / Inactivar | ✓ | ✓ | — | — |

*Pendiente definir qué campos puede editar el Admin CTR sobre su propio centro.

### Equipos

| Acción | Super Admin | Admin | Admin CTR | Admin CTR restringido |
|---|:---:|:---:|:---:|:---:|
| Ver lista | ✓ | ✓ | ✓ | ? |
| Crear | ✓ | ✓ | ✓ | ? |
| Editar | ✓ | ✓ | ✓ | ? |
| Activar / Inactivar | ✓ | ✓ | ✓ | ? |

### Usuarios (miembros)

| Acción | Super Admin | Admin | Admin CTR | Admin CTR restringido |
|---|:---:|:---:|:---:|:---:|
| Ver lista | ✓ | ✓ | ✓ | ? |
| Crear | ✓ | ✓ | ✓ | ? |
| Editar | ✓ | ✓ | ✓ | ? |
| Activar / Inactivar | ✓ | ✓ | ✓ | ? |
| Cambiar de equipo | ✓ | ✓ | ✓ | ? |

### Admins de Centro

| Acción | Super Admin | Admin | Admin CTR | Admin CTR restringido |
|---|:---:|:---:|:---:|:---:|
| Ver lista | ✓ | ✓ | — | — |
| Crear | ✓ | ✓ | — | — |
| Editar | ✓ | ✓ | — | — |
| Configurar permisos | ✓ | ✓ | — | — |
| Activar / Inactivar | ✓ | ✓ | — | — |

### Admins de Staff

| Acción | Super Admin | Admin |
|---|:---:|:---:|
| Ver lista | ✓ | — |
| Crear Admin | ✓ | — |
| Editar Admin | ✓ | — |
| Activar / Inactivar | ✓ | — |

---

## Permisos configurables del Admin de Centro restringido

Los siguientes permisos pueden activarse o desactivarse individualmente desde el staff:

> Pendiente de definir la lista completa. Se irá completando al diseñar el feature de configuración de admins.

- [ ] Crear equipos
- [ ] Editar equipos
- [ ] Crear usuarios
- [ ] Editar usuarios
- [ ] Ver reportes
- [ ] ...

---

> Las celdas marcadas con `?` están pendientes de definición. Ver issues abiertos en el directorio `docs/features/`.
