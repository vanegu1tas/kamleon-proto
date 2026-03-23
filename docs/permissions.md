# Matriz de permisos

Qué puede hacer cada rol sobre cada entidad de la plataforma.

---

## Roles

### Kamleon Staff

| Rol | Scope | Descripción |
|---|---|---|
| **Super Admin** | Global | Acceso total. Único que puede gestionar otros admins de staff. |
| **Admin** | Global | Igual que Super Admin por ahora. |
| **Editor** | Global o una org | Ve todo. Solo puede editar Units y Devices. Puede restringirse a una organización concreta (`scope: all \| org`). |
| **Viewer** | Global | Solo lectura. No puede editar nada. |

### Cliente

| Rol | Scope | Descripción |
|---|---|---|
| **Admin Center** | Su org · Centros asignados | Ve su organización y los centros que tiene asignados. Puede editar datos básicos de su centro y gestionar Team Admins. |
| **Team Admin** | Su centro (pendiente: ¿varios centros?) | Crea y edita equipos. Crea, invita y configura usuarios. |
| **End User** | Su perfil | Ve sus propios datos de hidratación y su perfil. No gestiona nada. |

---

## Capacidades por entidad

### Organizaciones

| Acción | Super Admin | Admin | Editor | Viewer |
|---|:---:|:---:|:---:|:---:|
| Ver lista | ✓ | ✓ | ✓ | ✓ |
| Crear | ✓ | ✓ | — | — |
| Editar | ✓ | ✓ | — | — |
| Activar / Inactivar | ✓ | ✓ | — | — |

*Los roles de cliente no tienen acceso a la vista de organizaciones.*

---

### Centros

| Acción | Super Admin | Admin | Editor | Viewer | Admin Center | Team Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Ver lista | ✓ | ✓ | ✓ | ✓ | ✓ (solo asignados) | ✓ (solo el suyo) |
| Crear | ✓ | ✓ | — | — | — | — |
| Editar | ✓ | ✓ | — | — | ✓* | — |
| Activar / Inactivar | ✓ | ✓ | — | — | — | — |

*Pendiente definir qué campos puede editar el Admin Center (email, asignar Team Admin, etc.).*

---

### Equipos

| Acción | Super Admin | Admin | Editor | Viewer | Admin Center | Team Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Ver lista | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Crear | ✓ | ✓ | — | — | ✓ | ✓ |
| Editar | ✓ | ✓ | — | — | ✓ | ✓ |
| Activar / Inactivar | ✓ | ✓ | — | — | ✓ | ? |

---

### Usuarios (miembros)

| Acción | Super Admin | Admin | Editor | Viewer | Admin Center | Team Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Ver lista | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Crear / Invitar | ✓ | ✓ | — | — | ✓ | ✓ |
| Editar | ✓ | ✓ | — | — | ✓ | ✓ |
| Activar / Inactivar | ✓ | ✓ | — | — | ✓ | ? |
| Cambiar de equipo | ✓ | ✓ | — | — | ✓ | ? |
| Ver propio perfil | — | — | — | — | — | — |

*El End User solo puede ver y editar su propio perfil. No gestiona otros usuarios.*

---

### Units

| Acción | Super Admin | Admin | Editor | Viewer |
|---|:---:|:---:|:---:|:---:|
| Ver lista | ✓ | ✓ | ✓ | ✓ |
| Crear | ✓ | ✓ | ✓ | — |
| Editar configuración | ✓ | ✓ | ✓ | — |
| Editar parámetros técnicos | ✓ | ✓ | ✓ | — |
| Activar / Inactivar | ✓ | ✓ | ✓ | — |

*Los roles de cliente no tienen acceso a Units. Es gestión exclusiva de staff.*

---

### Devices (Display y K-POD)

| Acción | Super Admin | Admin | Editor | Viewer |
|---|:---:|:---:|:---:|:---:|
| Ver | ✓ | ✓ | ✓ | ✓ |
| Asignar a unit | ✓ | ✓ | ✓ | — |
| Editar parámetros | ✓ | ✓ | ✓ | — |
| Reemplazar (K-POD) | ✓ | ✓ | ✓ | — |

*Los roles de cliente no tienen acceso a Devices.*

---

### Staff de Kamleon

| Acción | Super Admin | Admin |
|---|:---:|:---:|
| Ver lista de staff | ✓ | — |
| Crear Admin / Editor / Viewer | ✓ | — |
| Editar staff | ✓ | — |
| Activar / Inactivar staff | ✓ | — |
| Configurar scope de Editor | ✓ | — |

---

## Sistema de memberships (pendiente de diseñar)

Actualmente el sistema crea una cuenta por cada rol/org asignada, lo que provoca que un mismo usuario aparezca repetido N veces. La solución propuesta es un modelo de memberships:

```
usuario (una cuenta, un email)
  └── memberships[]
        ├── { rol: Editor, scope: org, org_id: Astonia FC }
        ├── { rol: Admin Center, org: City FC, centros: [Training Ground] }
        └── { rol: Team Admin, org: City FC, centro: North Campus }
```

Una cuenta, múltiples contextos visibles. El usuario ve sus roles al entrar y puede cambiar de contexto sin re-login. Aplicable tanto a staff de Kamleon que actúa como Admin Center/Team Admin en orgs concretas, como a usuarios cliente con roles en varios centros.

**Pendiente:** diseñar el flujo de selección de contexto y el switcher en el header. No bloquea el desarrollo actual.

---

## Notas y pendientes

- **Editor con scope de org**: se modela como atributo del usuario (`scope: all | org` + `org_id`), no como rol separado.
- **Team Admin multi-centro**: pendiente confirmar si puede estar asignado a varios centros simultáneamente.
- **Admin Center — campos editables**: pendiente definir la lista exacta (email, teléfono, asignar Team Admin, etc.). Se irá completando al diseñar el feature.
- **Activar/Inactivar por Team Admin**: pendiente confirmar si tiene este permiso sobre equipos y usuarios.
- **End User en web**: puede consultar sus datos de hidratación y editar su perfil. No tiene acceso a ninguna vista de gestión.
- **Panel de cliente**: Admin Center y Team Admin tendrán su propio panel separado del panel de staff (prototipo pendiente).
