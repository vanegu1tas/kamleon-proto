# Flujos clave del Center Admin — guion para Figma

Guion para montar en Figma los flujos del rol **Center Admin** con pantallas reales, no con
cajas de diagrama. Cada flujo lista los frames en orden, qué estado representa cada uno y el
texto exacto que va dentro, tal como está hoy en el prototipo.

**Para qué sirve**: hoy la fuente de verdad es el prototipo y Figma va por detrás. Estos
flujos son el camino de vuelta. Al construirlos se actualizan de paso los frames sueltos que
estaban desfasados, así que sustituyen a la lista de arreglos uno a uno.

Estado: **5 flujos**, ninguno construido todavía. Fecha: 2026-09-26.

---

## 1 · Añadir personas

El más importante de los cinco: es el que más se bifurca y donde un error sale caro (invitar
con el rol equivocado da acceso a datos de otros centros). Lo rediseñamos el 23/9.

**La regla que explica todo el flujo**: un admin **siempre** entra por correo, porque necesita
cuenta para entrar y la cuenta nace al aceptar la invitación. El único que se puede crear sin
invitación es el jugador, que a lo mejor nunca entra a la web. Por eso la pregunta "con o sin
invitación" vive solo en una de las dos ramas.

### Punto de entrada

Botón **Create** con dos grupos separados por un divider:

```
New organization          ← solo Kamleon staff
New center                ← solo Kamleon staff
New team
──────────────────────
Invite an admin
Add users
Invite Kamleon team       ← solo Owner / Admin
```

Desde dentro de un centro, el "+" de la cabecera ofrece: *New Team*, *New Team Admin*,
*New User/Member*, *New Center Admin*.

### Rama A — Invite an admin

Una sola pantalla. Frames:

| # | Frame | Qué muestra |
|---|---|---|
| A1 | Drawer vacío | Dropdown **Admin type** desplegado: *Organization admin · Center admin · Team admin* |
| A2 | Tipo = Center admin | Aparecen **Organization** y **Center** |
| A3 | Tipo = Team admin | Aparecen **Organization**, **Center** y **Teams** (selección múltiple, con chips) |
| A4 | Con correos | Varias filas de email + "Add another" |
| A5 | Resultado | La fila nueva en el tab **Admins** con Tag **Pending** |

Textos:
- Título: **Invite an admin**
- Descripción bajo "Email", según el tipo elegido:
  - Org admin: *An Org Admin manages this organization and all of its centers. They can invite and remove organization and center admins, see every user across centers, and view the organization's data and reports. They'll receive an email to accept the role.*
  - Center admin: *A Center Admin manages this center day-to-day. They can create teams, invite users and team admins, set up PIN and screen access, and view the center's data and reports. They'll receive an email to accept the role.*
  - Team admin: *A Team Admin manages this team day-to-day. They can invite and remove users, set up PIN and screen access, and view the team's data and reports. They'll receive an email to accept the role.*
- Botón: **Send invite**

**Anotación**: aquí no se pregunta "con o sin invitación". Al cambiar de tipo se limpia lo que
deja de aplicar (si pasas de Team admin a Org admin, los equipos elegidos desaparecen).

### Rama B — Add users

Dos pantallas: primero **cómo**, después **dónde y los datos**.

| # | Frame | Qué muestra |
|---|---|---|
| B1 | Elegir método | "Team Users are part of a team, they use the device and provide the samples that get tracked as hydration data." · **How do you want to add your Team User?** · tarjeta **By invite** · divider *Or add directly (No email)* · tarjetas **By hand** y **From file** |
| B2 | By invite | Texto + selectores de destino + email |
| B3 | By hand | Texto + selectores + tarjetas de usuario (nombre, dorsal, toggles) |
| B4 | From file | Selectores + pasos de la plantilla + zona de subida |
| B5 | From file con errores | Resultado de la validación, filas a corregir |

Textos de destino (solo aparecen cuando la pantalla no sabe dónde va la persona):
- By invite: *Send email invitations to your Team's users. Pick the organization, center and team they belong to.*
- By hand: *These users will be added immediately, without sending an invitation email or waiting for them to accept it. Pick the organization, center and team they belong to.*
- From file: *Everyone in the file will be added to the team you select here.*

**Anotación — qué se pregunta según desde dónde entres**:

| Entrada | Selectores que aparecen |
|---|---|
| Lista de organizaciones | Organization · Center · Team |
| Dentro de un centro | Solo Team |
| Dentro de un equipo | Ninguno |

**Pendiente**: las tarjetas de "By hand" todavía piden rol y equipo por tarjeta. El rol sobra
(por esta rama solo entran usuarios) y hay que decidir si el equipo lo fija el bloque de
destino o sigue por tarjeta.

---

## 2 · Ciclo de vida de una invitación

No es una pantalla, son estados de una fila — y por eso se olvida al diseñar: en Figma suele
estar solo el caso feliz. Además hay una capa que **solo ve Kamleon staff**.

El Center Admin **sí gestiona invitaciones**: tiene `centers.admins.invite`, `.remove`,
`invitations.resend` e `invitations.delete`, así que invita center admins y team admins de su
centro y los ve en el tab **Admins**. Lo que no ve es la capa del gestor de correo.

### Lo que ve el Center Admin

| # | Frame | Qué muestra |
|---|---|---|
| C1 | Fila **Pending** | Tag *Pending* · acciones: *Resend invite*, *Cancel invitation* |
| C2 | Fila **Active** | Tag *Active* · acciones: *Edit user*, *Remove permission* · la fila abre el perfil al hacer click |
| C3 | Fila **Expired** | Tag *Expired* |

### Solo Kamleon staff — no dibujar en el flujo del Center Admin

| # | Frame | Qué muestra |
|---|---|---|
| C4 | Fila con incidencia de correo | Icono crítico + tooltip **Delivery issue** |
| C5 | Drawer de historial | Filtros *All · Invitations · Other mails*, línea de tiempo Sent → Injection → Delay |

**Anotaciones**:
- El Tag es el ciclo de vida de la invitación; la incidencia es del gestor de correo. Son dos
  cosas distintas y por eso conviven en la misma fila cuando las mira el staff.
- Una fila **pendiente no abre perfil** aunque esa persona ya tenga cuenta: la fila representa
  esa invitación, no a la persona.
- En móvil (≤390) la fila se vuelve compact y las acciones pasan a un BottomSheet.

---

## 3 · Crear y borrar un equipo

Crear es simple; **borrar** obliga a responder algo que hoy nadie ha confirmado.

| # | Frame | Qué muestra |
|---|---|---|
| D1 | New team desde el centro | Nombre, imagen, ajustes |
| D2 | New team desde la lista de orgs | Lo mismo + selectores de Organization y Center |
| D3 | Menú "⋯" de la fila | *Edit Team · New User · Delete Team* |
| D4 | Modal de borrado, botón apagado | **Delete team** · *Are you sure to delete **First team**?* · **Type DELETE to confirm** · campo con placeholder *Write here* · Cancel · **Delete** (deshabilitado) |
| D5 | Modal con DELETE escrito | Botón activo |
| D6 | Resultado | El equipo desaparece de la lista + toast |

**Pregunta abierta para el programador**: ¿qué pasa con los miembros del equipo borrado?
¿Conservan su cuenta Kamleon y se quedan sin equipo, o pasa otra cosa? El texto del modal
depende de la respuesta y hoy no lo decimos.

---

## 4 · Editar una unit

Más que pantallas, este flujo documenta **reglas**: qué toca cada rol y una dependencia entre
campos que hoy solo vive en el código.

| # | Frame | Qué muestra |
|---|---|---|
| E1 | Tabla de Units | Columnas **Unit ID · Model · Sensor usage · Total usage** + lápiz |
| E2 | Drawer · Center Admin | Unit ID, Urinal model, Installation type y Status **bloqueados**; editables: Unit language, Description, Login mode, On-screen |
| E3 | Drawer · Kamleon staff | Los mismos campos, con los técnicos **editables** |
| E4 | On-screen desmarcado | El bloque de equipos **deshabilitado**, con los equipos elegidos a la vista |
| E5 | Desplegable de equipos | Buscador arriba, lista simple y **check** en los ya elegidos |
| E6 | Resultado | Toast **Unit 3001 updated** |

Textos:
- Título **Edit unit** · línea *Editing Unit 0001* · sección **Unit settings**
- **Login mode** · *How users can identify themselves at this unit.* · opciones **On-screen · QR · RFID**, cada una con ⓘ:
  - On-screen: *Users choose their name from a list of the team's members.*
  - QR: *Users scan a QR code to identify themselves.*
  - RFID: *Users tap an RFID badge to identify themselves.*
- **On-screen** (bloque de equipos) · *Members of the selected teams will be displayed on the unit screen.*
- Cuando el modo está apagado: *Turn on the On-screen login mode above to choose which teams appear.*

**Anotaciones**:
- Llevan asterisco: Unit ID, Urinal model, Installation type. **Status no** — para Center Admin
  no es un campo obligatorio, es información que no puede tocar.
- Status conserva el punto de color.
- Unit ID es un campo bloqueado, **no un dropdown**.
- Al drawer se llega por dos caminos: el lápiz de la tabla y el engranaje del detalle.

---

## 5 · Estados vacíos y de error

Transversal, y el que siempre falta: si no está en Figma, lo acaba inventando el programador.

| Pantalla | Estado a dibujar |
|---|---|
| Centro sin equipos | *No teams yet…* |
| Equipo sin miembros | *No members yet…* |
| Tabla sin resultados de búsqueda | *No results* + el término buscado |
| Admins sin invitaciones | *No admins yet* |
| Importación con filas malas | Resultado de la validación + corrección |
| Unidad sin datos de uso | Contadores en cero |

---

## Lo que queda fuera de estos flujos

- **Recorridos de consulta** (entrar al centro, mirar tabs, abrir un perfil): con pantallas
  sueltas basta, un diagrama no añade nada.
- **Reglas de componentes** que ya tienen su sitio: ContextMenu como BottomSheet en ≤390,
  TabBar en touch, y la unificación del Tag.
