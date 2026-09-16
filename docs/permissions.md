# Matriz de permisos

Qué puede hacer cada rol sobre cada entidad de la plataforma.

**Fuente:** cruzada 2026-07-25 contra el excel de permisos que compartió el programador (`lib/permissions-v2/permission-keys.ts`, `role-permissions.ts`, `role-experience.ts` del proyecto real). Cubre 7 roles y 94 permission keys en 6 bloques. Roles pendientes de definir del lado real (End User) se mantienen con nuestra documentación anterior.

---

## Arquitectura — CRÍTICO

**Una sola app, comportamiento condicional por rol.** No hay un panel de cliente separado del panel de staff — es el mismo shell (`StaffOrganizacionesV2` en el prototipo), donde cambian según el rol: el punto de entrada (a qué pantalla saltás al iniciar sesión), si se muestra el botón "back", la variante de header, y qué items del sidebar aparecen.

| Rol | Entry point | Header | Sidebar |
|---|---|---|---|
| Kamleon Owner / Admin / Editor | Lista de organizaciones | Normal, con back | Orgs, Units, Hydration, Usage |
| Org Admin | Detalle de su organización | Compacto, sin back | Orgs, Units, Hydration, Usage |
| Center Admin | Detalle de su centro (o selector si tiene varios — ver más abajo) | Compacto, sin back | Orgs, Units, Hydration, Usage |
| Team Admin | Detalle de su equipo | Compacto, sin back | Orgs, Hydration *(sin Units ni Usage)* |
| End User | `/my-data` | — | — |

---

## Roles

| Rol | Scope | Notas |
|---|---|---|
| **Kamleon Owner** | Global | Acceso total. Cuenta técnica/de sistema — la usa el programador (setup, debugging, soporte de emergencia), no es una persona haciendo trabajo de negocio día a día. |
| **Kamleon Admin** | Global | Acceso total. Mismos permisos que Owner — es la cuenta que sí usan de verdad los trabajadores de Kamleon en su trabajo diario. Sin diseño diferenciado entre los dos: misma matriz de permisos, distinta persona/propósito. |
| **Kamleon Editor** | Global | Sin variante con scope de una sola org (confirmado — no aparece como fila propia en `role-experience.ts`). Acceso amplio de edición en Units (parámetros técnicos, campos, devices); en Organizations/Centers/Teams/Users es mayormente solo-lectura. |
| **Org Admin** | Toda su organización (todos sus centros) | Rol nuevo — no existía en nuestra documentación anterior. Es un nivel por encima de Center Admin: dueño de la org completa, no de un centro puntual. |
| **Center Admin** | Uno o más centros | Equivale a nuestro antiguo "Admin Center". **Decisión de diseño nuestra, distinta a la referencia**: en el sistema real, cada centro que administra es una membership separada, lo que hace que el selector de rol muestre una entrada duplicada de "Center Admin" por cada centro (molesto). En nuestro prototipo es **un solo rol en el switcher**, con un selector interno de los centros asignados cuando administra más de uno. |
| **Team Admin** | Uno o más equipos asignados | Equivale a nuestro antiguo "Team Admin". **Decisión de diseño nuestra, distinta a la referencia**: en el sistema real puede ver y abrir el detalle de *todos* los equipos de su centro, no solo el suyo (aunque su capacidad de edición no está clara fuera del suyo — ver Notas). En nuestro prototipo, **solo ve los equipos a los que fue asignado**, nada más. |
| **End User** | Su perfil | Del lado real todavía no está definido (`teamstaff_user` / `kamleon_user` usan `allPermissions` como placeholder). Mantenemos nuestra documentación anterior sin cambios hasta que el programador lo defina. |

---

## Notas generales sobre la matriz

- **⚡ = bypass total.** Kamleon Owner y Kamleon Admin no están en la matriz estática — tienen automáticamente cualquier permiso nuevo que se agregue. Por eso las tablas de abajo solo tienen columnas para Kamleon Editor, Org Admin, Center Admin y Team Admin.
- **Permission keys sin efecto visible detectado**: el propio programador marcó 13 claves que existen en el sistema pero no cambian nada en pantalla hoy (puede ser código para una función futura, o redundante con otro permiso). Estas se marcan con ⚠️ en las tablas de abajo — no las estamos inventando nosotros, ya venían así señaladas.
- **Dos inconsistencias reales de UX detectadas por el programador**, no son bugs nuestros: (1) al crear una organización, la sección "Invite administrators" siempre aparece sin chequear permiso — al editar sí se chequea; (2) el dropdown de Estado de un Center nunca se ve bloqueado visualmente para nadie, pero si guardás sin el permiso, el cambio se descarta en silencio.

---

## Bloque: Organizations

### Acceso y navegación
| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `organizations.viewOwn` ⚠️ | ✓ | ✓ | — | — |
| `organizations.viewDetails` ⚠️ | ✓ | ✓ | — | — |
| `organizations.openDetails` ⚠️ | ✓ | ✓ | — | — |

### Creación / eliminación
| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `organizations.create` | ✓ | — | — | — |
| `organizations.delete` | — | — | — | — |
| `organizations.centers.create` | ✓ | — | — | — |

### Edición de datos
Los 7 campos básicos (Nombre, Descripción, Dirección, Email, Teléfono, Segmento, Estado) siempre se muestran a quien puede abrir el panel — lo que cambia es si se pueden editar o quedan bloqueados en gris.

**Desviación nuestra respecto a la referencia**: el campo **Estado** no lo mostramos ni siquiera bloqueado para roles que no pueden cambiarlo (Editor, Org Admin, Center Admin, Team Admin) — decisión de Daniel: es información que le corresponde decidir a Kamleon, no al cliente, y mostrarla como un campo de formulario (aunque sea gris) sugiere una relación de control que no existe. El estado sigue visible igual en el badge del header ("Active"/"Inactive"), así que no se pierde la información, solo se saca del formulario de edición.

| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `organizations.editName` | — | — | — | — |
| `organizations.editDescription` | — | — | — | — |
| `organizations.editAddress` | — | — | — | — |
| `organizations.editEmail` | — | — | — | — |
| `organizations.editPhone` | — | — | — | — |
| `organizations.editImage` | — | **✓** | — | — |
| `organizations.editSegment` | — | — | — | — |
| `organizations.changeStatus` | — | — | — | — |

**Por qué es así (confirmado, no es un hueco)**: la info de contacto/estado de la organización la configura el staff de Kamleon (Owner/Admin) al dar de alta o mantener la cuenta del cliente — Org Admin solo la consulta, no la edita a su gusto. El único campo que sí puede tocar es la imagen. Mismo criterio aplica en Centers más abajo.

### Administradores
| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `organizations.admins.view` ⚠️ | ✓ | ✓ | — | — |
| `organizations.admins.invite` | — | ✓ | — | — |
| `organizations.admins.remove` | — | ✓ | — | — |
| `organizations.invitations.resend` | — | ✓ | — | — |
| `organizations.invitations.delete` | — | ✓ | — | — |

### Integraciones
| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `organizations.integrations.view` | ✓ | ✓ | — | — |
| `organizations.integrations.enable` | ✓ | — | — | — |
| `organizations.integrations.disable` | — | — | — | — |
| `organizations.integrations.editSettings` (Teamworks) | — | ✓ | — | — |

Nota: Editor puede *activar* integraciones pero no desactivarlas. Org Admin puede editar la config de Teamworks pero no activar/desactivar nada.

### API Token y API Test
| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `organizations.apiToken.view` | ✓ | ✓ | — | — |
| `organizations.apiToken.copy` | ✓ | ✓ | — | — |
| `organizations.apiToken.generate` ⚠️ | — | — | — | — |
| `organizations.apiToken.delete` ⚠️ | — | — | — | — |
| `organizations.apiToken.editLimits` (Max tokens) | — | — | — | — |
| `organizations.viewConsumption` | ✓ | — | — | — |
| `organizations.apiToken.viewHistory` ⚠️ | ✓ | — | — | — |
| `apiTest.access` (pantalla "API Test" en el sidebar) | — | ✓ | — | — |

---

## Bloque: Centers

Los campos básicos (nombre, alias, email, teléfono, dirección) siempre se muestran a quien puede abrir el panel de edición. El botón de eliminar centro es independiente de todo lo demás — depende únicamente de `centers.delete`.

| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `centers.delete` | — | — | — | — |
| `centers.editImage` | — | ✓ | ✓ | — |
| `centers.editData` (nombre, alias, email, tel, dirección + sección "Link units") | — | — | — | — |
| `centers.changeStatus` | — | — | — | — |
| `centers.admins.invite` | ✓ | ✓ | ✓ | — |
| `centers.admins.remove` | — | ✓ | ✓ | — |
| `centers.invitations.resend` | ✓ | ✓ | ✓ | — |
| `centers.invitations.delete` | ✓ | ✓ | ✓ | — |

Igual que en Organizations: **ninguno de estos 4 roles puede editar los datos básicos del centro** (`centers.editData`) ni cambiar su estado — solo pueden gestionar admins/invitaciones e imagen. Es el mismo criterio: esos datos los configura Kamleon al mantener la cuenta, Center Admin solo los consulta. `centers.delete` es exclusivo de Owner/Admin, ni Editor lo tiene.

**Alias del centro**: nombre interno alternativo, comparte permiso con `editData` (no tiene uno propio). Solo lo ven/editan Kamleon Owner y Kamleon Admin; Kamleon Editor lo ve mostrado en vez del nombre real pero no puede editarlo; el resto de roles nunca lo ve, siempre ve el nombre real.

---

## Bloque: Teams

Ver equipos **no depende de ningún permiso** — a diferencia de Organizations/Centers/Units, cualquier rol que entra al detalle de un centro ve la lista completa de equipos y, al abrir uno, todos sus datos (miembros, estado, PIN, invitaciones). Lo único que cambia por rol son los botones de acción.

| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `teams.create` | — | — | ✓ | — |
| `teams.edit` (nombre, descripción) | — | — | ✓ | ✓ |
| `teams.changeStatus` | — | — | ✓ | ✓ |
| `teams.delete` | — | — | ✓ | — |
| `teams.users.edit` | — | — | ✓ | ✓ |
| `teams.users.remove` | — | — | ✓ | ✓ |
| `teams.users.togglePin` | — | — | ✓ | ✓ |
| `teams.users.regeneratePin` | — | — | ✓ | ✓ |
| `teams.invitations.resend` | — | — | ✓ | ✓ |
| `teams.invitations.delete` | — | — | ✓ | ✓ |

Kamleon Editor y Org Admin: solo lectura en este bloque, sin ninguna acción. La única diferencia entre Center Admin y Team Admin acá es que **solo Center Admin puede crear y eliminar equipos** — Team Admin gestiona el equipo (edita, cambia estado, gestiona miembros) pero no lo crea ni lo borra.

**Nuestra desviación de la referencia** (ver tabla de Roles): Team Admin en nuestro prototipo solo ve los equipos a los que fue asignado, no el resto del centro.

---

## Bloque: Users

### Acceso e invitación
| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `users.access` | ✓ | ✓ | ✓ | ✓ |
| `users.invite` | — | — | ✓ | ✓ |
| `users.createManually` (requiere `users.invite`) | — | — | ✓ | ✓ |

**Quién puede invitar a quién** (son permisos independientes, no uno solo de "invitar"). Es el mismo botón "New user" para todo — no hay una pantalla separada para gestionar staff de Kamleon:
- Owner / Admin → cualquier rol, **incluido Kamleon Admin y Kamleon Editor**. No incluye la opción de invitar como "Kamleon Owner" — esa cuenta no se crea por este flujo, probablemente la provisiona el equipo técnico directo.
  - ⚠️ **Secuencia del flujo sin confirmar del todo**: el excel solo dice qué roles son alcanzables, no el orden exacto de las preguntas. Daniel recuerda (sin estar seguro) que no es una lista plana con todas las opciones juntas — sería un flujo de dos pasos: invitás "un admin" dentro de la org de Kamleon, y ahí adentro una segunda pregunta distingue si es un admin normal o específicamente Kamleon Staff. Confirmar con el programador antes de dar por definitivo el wireframe de esta pantalla.
- Kamleon Editor → solo Center Admin
- Org Admin → Org Admin y Center Admin (no Team Admin ni End User)
- Center Admin → Center Admin, Team Admin y End User de su centro
- Team Admin → Team Admin y End User, limitado a su propio equipo (**sí puede invitar a otro Team Admin para el mismo equipo** — puede haber más de un Team Admin por equipo)

Invitar un "Org Admin"/"Center Admin" desde el botón "New user" es la misma acción que invitar desde la sección "Invite administrators" del panel de edición — mismo permiso, mismo resultado, dos sitios distintos para lo mismo.

### Columnas y filtros
| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `users.viewStatus` ⚠️ | ✓ | ✓ | ✓ | ✓ |
| `users.viewRoles` ⚠️ | ✓ | ✓ | ✓ | ✓ |
| `users.viewPermissions` (sección "ROLE" en el panel) | ✓ | ✓ | ✓ | ✓ |
| `users.viewConsents` | ✓ | — | — | — |
| `users.editConsents` | — | — | — | — |
| `users.viewColumn.organization` | ✓ | — | — | — |
| `users.viewColumn.center` | ✓ | ✓ | — | — |
| `users.viewColumn.team` ⚠️ | ✓ | ✓ | ✓ | ✓ |
| `users.filter.byOrganization` ⚠️ | ✓ | — | — | — |
| `users.filter.byCenter` (solo si el centro tiene >1) | ✓ | ✓ | — | — |
| `users.filter.byTeam` (solo si el equipo tiene >1) | ✓ | ✓ | ✓ | ✓ |

Al ver tu **propio** perfil, la sección de consentimientos siempre se muestra, sin depender de `viewConsents`.

### Integraciones y acciones
| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `users.viewIntegrationsIDs` ⚠️ | ✓ | ✓ | — | — |
| `users.editIntegrationsIDs` ⚠️ | — | ✓ | — | — |
| `users.createMultiple` ⚠️ (import CSV usa otra ruta, no depende de esto) | — | ✓ | ✓ | — |
| `users.changeStatus` | — | ✓ | ✓ | ✓ |
| `users.delete` | — | — | ✓ | ✓ |
| `users.editData` (nombre, RFID, dorsal, etc.) | — | — | ✓ | ✓ |
| `users.editPIN` | — | — | ✓ | ✓ |
| `users.togglePIN` | — | — | ✓ | ✓ |
| `users.configScreen` ("Visible on screen" / roster) | — | — | ✓ | ✓ |

**Jersey Number (dorsal)**: campo opcional, solo en orgs tipo deporte, solo para End User dentro de un equipo. No tiene permiso propio — sigue las reglas de `users.editData`. Un mismo usuario tiene un número por organización deportiva (puede pertenecer a varias); si edita Owner/Admin o el propio usuario, se ve una lista con un número por org en vez de un solo campo.

---

## Bloque: Units

⚠️ Los roles de cliente **sí tienen acceso a Units** (contradice lo que documentábamos antes) — lo que no tienen es acceso a la pestaña Devices ni a los campos técnicos. Son dos niveles de acceso distintos dentro del mismo bloque.

### Acceso y lista
| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `units.access` | ✓ | ✓ | ✓ | — |
| `units.viewColumn.display` | ✓ | — | — | — |
| `units.viewColumn.sensor` | ✓ | — | — | — |
| `units.filter.byOrganization` | ✓ | — | — | — |
| `units.filter.byCenter` | ✓ | ✓ | — | — |
| `units.filter.advanced` | ✓ | — | — | — |

Team Admin no tiene acceso a Units en absoluto — ni siquiera ver la lista.

### CRUD
| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `units.create` | ✓ | — | — | — |
| `units.edit` (abrir panel de edición) | ✓ | ✓ | ✓ | — |
| `units.delete` | — | — | — | — |

### Campos técnicos
| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `units.viewTechnicalFields` | ✓ | — | — | — |
| `units.editAllFields` | — | — | — | — |
| `units.changeStatus` | — | — | — | — |
| `units.editParameters` | — | — | — | — |

`editAllFields`, `changeStatus` y `editParameters` hoy son exclusivos de Owner/Admin — ni Kamleon Editor los tiene.

**Enlazar Display/Sensor a una unidad** depende únicamente de `units.viewTechnicalFields` (quien lo tiene puede ver *y* cambiar esos desplegables directamente, sin estado intermedio de "bloqueado"). Es distinto de `units.devices.edit`, que es para editar/enlazar el dispositivo desde la pestaña Devices.

### Devices
| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `units.devices.access` | ✓ | — | — | — |
| `units.devices.edit` | — | — | — | — |
| `units.devices.delete` | — | — | — | — |

### Campos del panel de edición de unidad
Solo aplica a roles con `units.edit` (Team Admin no entra acá, no tiene acceso).

| Campo | Owner / Admin | Kamleon Editor | Org Admin | Center Admin |
|---|---|---|---|---|
| Unit ID | Bloqueado | Bloqueado | Bloqueado | Bloqueado |
| Urinal model | Editable | Bloqueado | Bloqueado | Bloqueado |
| Organización / Center* | Editable | Editable | Editable | Editable |
| Idioma | Editable | Bloqueado | Editable | Editable |
| Estado | Editable | Bloqueado | Bloqueado | Bloqueado |
| Descripción | Editable | Bloqueado | Editable | Editable |
| Modo de login | Editable | Bloqueado | Editable | Editable |
| Screen Roster | Editable | Bloqueado | Editable | Editable |
| Display / Sensor (enlazar) | Editable | Editable | Oculto | Oculto |
| Apariencia (imágenes personalizadas) | Editable | Editable | Oculto | Oculto |
| Mensajes de hidratación | Editable | Editable | Oculto | Oculto |
| Score Screen / Waterflush | Editable | Bloqueado | Oculto | Oculto |
| Conductividad | Editable | Bloqueado | Oculto | Oculto |
| Estadísticas de uso (solo lectura) | Visible | Visible | Oculto | Oculto |

\* El selector de Organización/Center solo aparece si el panel se abre desde la pantalla general de Units; si se abre desde dentro de un centro, ya viene fijado.

---

## Bloque: Analytics

### Usage Analytics
| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `usageAnalytics.access` | ✓ | ✓ | ✓ | — |
| `usageAnalytics.scopeFilter.organization` | ✓ | — | — | — |
| `usageAnalytics.scopeFilter.center` | ✓ | ✓ | — | — |

Team Admin no tiene acceso a Usage Analytics. No existe filtro por equipo en esta pantalla — es a nivel de centro, no baja al detalle de equipo.

### Hydration Analytics
| Permission key | Editor | Org Admin | Center Admin | Team Admin |
|---|:---:|:---:|:---:|:---:|
| `hydrationAnalytics.access` | ✓ | ✓ | ✓ | ✓ |
| `hydrationAnalytics.scopeFilter.organization` | ✓ | — | — | — |
| `hydrationAnalytics.scopeFilter.center` | ✓ | ✓ | — | — |

Es el único permiso de analítica que tiene Team Admin. El selector de Equipo **no depende de ningún permiso** — cualquiera que llegue a esta pantalla lo ve (sujeto a nuestra desviación: Team Admin solo ve sus equipos asignados). Los datos no cargan hasta elegir un equipo concreto.

---

## End User

*(sin cambios — pendiente de definición del lado real, `teamstaff_user`/`kamleon_user` siguen como placeholder)*

- Ve y edita su propio perfil.
- Ve sus propios datos de hidratación (`/my-data`, cuenta personal sin org) o entra directo a su equipo (si es miembro de un equipo, aún sin definir del lado real).
- No gestiona nada de otros usuarios ni entidades.

---

## Sistema de memberships

Confirmado por el excel: una persona puede tener múltiples roles/contextos (ej. varios centros como Center Admin, o pertenecer a varias organizaciones deportivas con un dorsal distinto en cada una). Nuestro modelo propuesto sigue aplicando:

```
usuario (una cuenta, un email)
  └── memberships[]
        ├── { rol: Center Admin, centro: Training Ground }
        ├── { rol: Center Admin, centro: City Campus }
        └── { rol: Team Admin, equipo: North Campus U16 }
```

Una cuenta, múltiples contextos visibles. **Decisión nuestra**: aunque el sistema real modele esto como memberships separadas por centro/equipo, el switcher de rol en nuestro prototipo agrupa por rol (una sola entrada "Center Admin", con selector interno de centros) en vez de duplicar la entrada por cada membership — ver bloque Teams/Centers arriba.

**Cómo se resuelve en UI**: reutilizamos el layout master-detail que ya existe en `OrgDetailV2` — panel izquierdo con la lista de los centros asignados a ese Center Admin, panel derecho con el detalle del centro seleccionado. Mismo patrón, sin construir nada nuevo.

⚠️ **Esto es exclusivo de Center Admin — no aplica a Kamleon Admin/Owner/Editor.** Un Kamleon Admin entra por la lista de organizaciones, elige una org, y ahí ve los centros **de esa org únicamente** (navegación jerárquica org → centros). Nunca debe ver "todos los centros del sistema" en una sola lista plana — sería inmanejable. El master-detail de centros-asignados es un patrón que solo tiene sentido para el subconjunto acotado que ve un Center Admin.

---

## Notas y pendientes

- **Owner vs Admin**: misma matriz de permisos, distinta cuenta/propósito (Owner = técnica/programador, Admin = staff real). Sin diseño diferenciado.
- **Editor**: confirmado global, sin variante de scope por org.
- **Org Admin / Center Admin no editan los datos básicos de su org/centro** (solo la imagen) — confirmado, es intencional: esos datos los configura Kamleon al mantener la cuenta del cliente, no el cliente mismo.
- **Team Admin — comportamiento fuera de su equipo asignado**: en el sistema real puede ver/abrir cualquier equipo de su centro, no solo el suyo; no está claro si puede *editarlos* igual o queda en solo-lectura fuera del suyo. No nos afecta — decidimos limitarlo a sus equipos asignados, y esa decisión no cambia.
- **Puede haber más de un Team Admin por equipo** — confirmado, un Team Admin puede invitar a otro Team Admin para el mismo equipo.
- **Selector de centros para Center Admin**: resuelto con el patrón master-detail que ya existe (ver sección "Sistema de memberships" arriba). Importante: es exclusivo de Center Admin, un Kamleon Admin nunca ve una lista plana de todos los centros del sistema — siempre navega org → centros de esa org.
- **Staff de Kamleon gestionando otros admins de staff** — resuelto: no es una pantalla separada, es el mismo flujo "New user" (`users.invite`) que se usa para todo. Owner y Admin pueden invitar nuevos Kamleon Admin/Editor desde ahí. Único punto sin confirmar del todo: cómo se crea una cuenta "Kamleon Owner" — no aparece como opción invitable, probablemente la provisiona el equipo técnico directamente fuera de este flujo.
- **13 permission keys sin efecto visible detectado** en el sistema real (marcadas ⚠️ arriba): puede que sean para funciones futuras, o redundantes con otro permiso. No las estamos inventando, ya venían señaladas así por el programador.
