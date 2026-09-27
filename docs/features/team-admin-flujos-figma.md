# Flujos clave del Team Admin — guion para Figma y para QA

Guion de los flujos del rol **Team Admin**, con pantallas reales. Va por rol a propósito: así
una persona puede hacer QA de un rol completo de una sentada, sin saltar entre roles.

Cada flujo trae los frames en orden, los textos exactos del prototipo y **qué hay que
verificar**. Lo que dice "comprobar" es lo que se mira en QA.

Estado: **4 flujos**. El **flujo 2 ya está construido en Figma** (página `🧪 Flujos — prueba` de Web App 2.0,
frenes B1/B3/B4) con componentes, variables y estilos reales. Fecha: 2026-09-27.
Complementa a `center-admin-flujos-figma.md`, que no repite lo que ya está allí.

---

## Qué alcanza este rol (nota para el sidebar, no es un flujo)

- **No ve Units ni Unit usage**: no administra hardware.
- **Solo ve los equipos que tiene asignados**, ni siquiera el resto de su centro.
- **No crea ni borra equipos**: eso es del Center Admin. Sí puede editar los suyos.
- Sí puede **invitar a otro Team Admin para su equipo**.

*Comprobar en QA*: entrar como Team Admin y confirmar que el sidebar solo tiene Control panel
(etiquetado "Teams"), Hydration y My data.

---

## 1 · Gestionar los ajustes de un jugador

El pan de cada día del rol, y el que más caminos tiene: tres entradas distintas llevan a
cambiar lo mismo.

| # | Frame | Qué muestra |
|---|---|---|
| A1 | Tabla de Users | Columnas **Name · PIN · Screen · Status · acciones**, filas de 64px |
| A2 | Menú "⋯" de una fila | *Edit user · **Turn off PIN** / Turn on PIN · Hide from screen / Show on screen · Remove from team* (roja). Iconos: Edit · Power · Eye closed · Delete |
| A3 | Drawer **Edit user** | User info completo + **Permissions** (ver más abajo) |
| A4 | **Bulk actions** abierto | *Turn PIN on for all users · Turn PIN off for all users* |
| A5 | Confirmación de bulk | **Turn PIN off for all users?** · *This will turn PIN off for all 8 users in First team. They won't be able to log in with a PIN until it's turned back on.* |

**Permissions dentro del drawer** — una tarjeta por pertenencia. La regla completa y los dos
diagramas están en `center-admin-flujos-figma.md` § 4 bis; no se repiten acá.

*Comprobar en QA*:
- Que el interruptor del menú "⋯" y el del drawer cambian lo mismo y quedan sincronizados.
- Que **Bulk actions pide confirmación** y dice cuántos usuarios afecta.
- Que "Remove from team" está **deshabilitado sobre uno mismo**, con el tooltip *"You can't
  remove yourself"*.
- Que en el tab Users **no aparece ningún team admin** (viven en el tab Admins) y que **no hay
  filtro de rol**, porque ya no tendría nada que filtrar.

---

## 2 · Quitar a alguien del equipo

Dos entradas, una sola confirmación.

| # | Frame | Qué muestra |
|---|---|---|
| B1 | Entrada A | Menú "⋯" de la fila → *Remove from team*. **Construido**: pantalla completa del equipo con el menú anclado bajo el "⋯" de Carlos García |
| B2 | Entrada B | Drawer Edit user → botón **Remove from team** dentro de la tarjeta de permisos |
| B3 | Modal | **Remove from team** · *Are you sure you want to remove **Carlos García** from First team?* · Cancel · Remove (`Type=Danger`). **Construido**: sobre la pantalla con velo al 40% |
| B4 | Resultado | La fila desaparece de la tabla + toast `Mode=Success`, sin Undo: ***Carlos García removed from First team*** |

**Pregunta abierta para el programador** (la misma que en el borrado de equipos): ¿qué le pasa
a esa persona después? ¿Conserva su cuenta Kamleon y se queda sin equipo? El texto del modal
debería decirlo y hoy no lo dice.

*Comprobar en QA*: que quitar desde el drawer y desde el menú llevan al mismo modal, y que al
confirmar desde el drawer este se cierra.

**Datos correctos de esta pantalla** (contrastados con `mockData.js` y `rolePersonas.js`):
organización **Astonia FC** con el avatar = la inicial `A`; usuario logueado **Sam Alcaraz**
(`Team Admin - 3 teams · 2 centers`); equipo **First team**, Training Ground; la tabla lleva
marcus.oyelaran (Pending), Dr. Elena Navarro y Dra. Sarah Mitchell (Staff), y los usuarios
Carlos García, Tom Whitfield, Jordan Hobbs. El toast es negro (`#0b0f12`), no blanco.

**Detectado al construirlo (27/9)**: la cabecera del equipo lleva el contador de personas
(*"8 users"*), así que al quitar a alguien tiene que bajar a *"7 users"*. Sale de
`selectedEntry.team.users.length` (`TeamAdminHome.jsx:688`), o sea que en el prototipo ya
funciona — pero es fácil olvidarlo al dibujar la pantalla de resultado.

---

## 3 · Añadir personas a mi equipo

Es el flujo 1 del Center Admin **con el destino ya resuelto**: desde dentro del equipo no se
pregunta ni organización, ni centro, ni equipo. No hace falta volver a dibujarlo entero —
bastan las pantallas que cambian.

| # | Frame | Qué muestra |
|---|---|---|
| C1 | Menú "+" del equipo | *New Team Admin · New User/Member* |
| C2 | Add users · elegir método | **By invite** · *Or add directly (No email)* · **By hand** · **From file** |
| C3 | Cualquiera de los tres | **Sin selectores de destino** |
| C4 | Invitar team admin | Drawer con el correo; el equipo ya viene puesto |
| C5 | Resultado | Fila **Pending** en el tab correspondiente (Users o Admins) |

*Comprobar en QA*: que en ninguna de las tres ramas aparecen los desplegables de organización,
centro o equipo, y que la invitación de team admin cae en el tab **Admins**, no en Users.

---

## 4 · Editar el equipo

| # | Frame | Qué muestra |
|---|---|---|
| D1 | Punto de entrada | **Sin decidir** — ver abajo |
| D2 | Drawer **Edit team** | Nombre, descripción, estado |
| D3 | Resultado | Cabecera actualizada + toast *Changes saved* |

**Decisión pendiente**: hoy el drawer de editar equipo **no tiene un punto de entrada claro**
en este rol. Es uno de los pendientes que arrastramos desde agosto. Dibujar este flujo obliga
a resolverlo: ¿el engranaje de la cabecera del equipo?

*Comprobar en QA*: que **no existe** ninguna forma de crear ni de borrar un equipo desde este
rol.

---

## 5 · Estados vacíos

| Pantalla | Estado |
|---|---|
| Equipo recién asignado, sin miembros | *No members yet…* |
| Tab Admins sin team admins | *No team admins yet* · *Admins you invite will appear here.* |
| Búsqueda sin resultados | *No results* + el término buscado |
| Sin equipos asignados | *Select a team to view its details* / lista vacía |

El último es el que más se olvida: un Team Admin recién invitado que todavía no tiene equipos.
