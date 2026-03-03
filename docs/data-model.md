# Modelo de datos

Referencia del modelo mental de la plataforma. Todo diseño debe seguir esta jerarquía.

## Jerarquía de entidades

```
ORGANIZACIÓN
│  id · nombre · logo · plan · activo/inactivo
│
└── CENTRO
    │  id · nombre · dirección · org_id · activo/inactivo
    │
    ├── EQUIPO
    │   │  id · nombre · centro_id · activo/inactivo
    │   │
    │   └── USUARIO (miembro)
    │          id · nombre · email · equipo_id · activo/inactivo
    │          (un usuario pertenece a exactamente un equipo)
    │
    └── ADMIN DE CENTRO  (puede haber N por centro)
           tiene dos cuentas: cuenta admin + cuenta usuario personal
           la cuenta usuario personal pertenece a un equipo como cualquier miembro
```

## Cardinalidad

| Relación | Tipo |
|---|---|
| Organización → Centro | 1 : N |
| Centro → Equipo | 1 : N |
| Centro → Admin de Centro | 1 : N |
| Equipo → Usuario | 1 : N |
| Usuario → Equipo | N : 1 (exactamente uno) |
| Admin de Centro → Cuentas | 1 : 2 (admin + usuario personal) |

## Estados

Todas las entidades tienen un único campo de estado: **activo / inactivo**.

No existe estado pendiente, suspendido ni ningún otro.

## Admin de Centro: doble cuenta

Un administrador de centro es un humano con dos cuentas distintas:

- **Cuenta admin**: accede al panel de administración del centro. Gestiona equipos, usuarios y configuración según sus permisos.
- **Cuenta usuario**: es un miembro normal de un equipo dentro del centro. Tiene la experiencia de usuario final.

Estas cuentas están vinculadas pero son entidades separadas en el sistema.

## Permisos del Admin de Centro

Los permisos de la cuenta admin son configurados por el staff (Admin o Super Admin) al momento de crear o editar el admin de centro. Hay dos modos:

- **Admin completo**: acceso total a la gestión del centro (crear/editar equipos, usuarios, ver reportes, etc.)
- **Admin restringido**: solo tiene activos los permisos que el staff le habilitó explícitamente.

La matriz de permisos detallada está en [permissions.md](./permissions.md).
