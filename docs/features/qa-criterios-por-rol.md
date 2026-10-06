# QA final — criterios de aceptación por rol

Lista para revisar el prototipo V2 rol por rol, sin depender de que todos los flujos estén en
Figma. Daniel la pasa a una checklist en Figma.

**Fuentes** (5/10): el excel del programador (`~/Downloads/permissions-matrix.xlsx`, actualizado
el 14/7), `docs/permissions.md` —coincide con el excel en las 94 keys, comprobado una por una— y
las desviaciones nuestras, marcadas **[desv. N]** según `permissions-deviations.md`.

**Qué queda fuera**: las 13 keys ⚠️ que el propio programador marcó "sin efecto visible", porque
no hay nada que mirar en pantalla. End User, porque el programador aún no lo ha definido.

**Regla general del excel**: sin permiso, la acción **desaparece**. Las excepciones, donde el
control se ve pero **bloqueado en gris**, se indican en cada criterio.

Marcas: **⚠ CHOQUE** = el excel y el prototipo no coinciden · **⚠ SIN DECIDIR** = ninguna fuente
lo resuelve.

---

## Kamleon Owner / Kamleon Admin

Misma matriz (bypass total). Owner es la cuenta técnica; Admin, la del staff.

Entrada
- [ ] Entra a la lista de organizaciones, header normal con back
- [ ] Sidebar: Orgs · Units · Hydration · Usage

Organizaciones y centros
- [ ] Crea, edita y borra organizaciones (todos los campos, incluido Estado)
- [ ] Crea, edita y borra centros (incluido alias, Estado y "Link units")
- [ ] Ve el alias del centro y lo puede editar
- [ ] Navega org → centros de esa org; nunca una lista plana de todos los centros
- [ ] Invita y quita admins de los tres niveles (Org, Center, Team), pero no a sí mismo

Integraciones y API
- [ ] Activa y desactiva integraciones
- [ ] Ve y edita "Max tokens per month"; ve la tabla de consumo

Equipos y usuarios
- [ ] Todas las acciones de equipos y miembros
- [ ] "New user" ofrece todos los roles: Kamleon Staff Admin, Kamleon Staff Editor,
      Organization admin, Center admin, Team admin, User
- [ ] "Kamleon staff" y "Organization admin" solo aparecen al invitar desde un contexto
      general, no desde dentro de un centro o equipo
- [ ] "Kamleon Owner" NO aparece como rol invitable

Units
- [ ] Crea, edita y borra units; en Devices entra, edita y borra
- [ ] Panel de unit: todo editable salvo Unit ID; ve las estadísticas de uso

---

## Kamleon Editor

Global. Edita en Units; en lo demás, casi todo es solo lectura.

Entrada
- [ ] Entra a la lista de organizaciones, header con back
- [ ] Sidebar: Orgs · Units · Hydration · Usage · NO "API Test"

Organizaciones
- [ ] Ve "New Organization" y "New Center" en el menú "+"
- [ ] NO ve "Delete" en ninguna organización
- [ ] Abre el panel de la org (engranaje): los 7 campos bloqueados en gris, sin botón de imagen
- [ ] El campo Estado no aparece en el formulario [desv. 3, a futuro]
- [ ] Ve la lista de admins de la org, sin sección "Invite administrators" ni papelera
- [ ] Integrations: puede ENCENDER el interruptor, no apagarlo (lo ve, pero bloqueado)
- [ ] Ve el token y el botón de copiarlo; ve la tabla de consumo
- [ ] NO ve la sección "Max tokens per month"
- [ ] El botón "Run test" de Integrations está disponible

Centros
- [ ] Nombre, alias, email, teléfono y dirección bloqueados en gris
- [ ] Datos de contacto y "Link units" NO aparecen
- [ ] Sin botón de imagen; sin "Delete" del centro
- [ ] Ve el ALIAS del centro en lugar del nombre, en toda la app
- [ ] Invita Center Admins; reenvía y cancela invitaciones
- [ ] Ve los Center Admins, pero sin papelera

Equipos
- [ ] Ve la lista y el detalle de cada equipo; ningún botón de acción

Usuarios
- [ ] "New user" existe y solo ofrece **Center admin**
- [ ] Sin pestaña "Manually" (no crea usuarios a mano)
- [ ] En perfil y panel de edición: ve el nombre de la organización encima de las tarjetas de
      rol y el nombre del centro dentro de las de centro
- [ ] Ve los consentimientos de otros, con las casillas bloqueadas
- [ ] Panel de edición: datos personales bloqueados, interruptor de Estado bloqueado
- [ ] NO ve "Reset PIN", el interruptor de PIN ni "Visible on screen"
- [ ] NO ve "Delete User"

Units
- [ ] Columnas Display y Sensor; filtros por org, por centro y avanzados
- [ ] Crea units; NO las borra
- [ ] Entra a la pestaña Devices, pero no edita ni borra devices
- [ ] Panel — editable: Org/Center, Display/Sensor, Apariencia, Mensajes de hidratación
- [ ] Panel — bloqueado: Unit ID, Urinal model, Idioma, Estado, Descripción, Modo de login,
      Screen Roster, Score Screen/Waterflush, Conductividad
- [ ] Panel — ve las estadísticas de uso

Analítica
- [ ] Usage y Hydration con filtro por organización y por centro

---

## Org Admin

Toda su organización.

Entrada
- [ ] Entra directo al detalle de SU organización, header compacto sin back
- [ ] Sidebar: Orgs · Units · Hydration · Usage · API Test

Su organización
- [ ] Abre el panel (engranaje): solo puede cambiar la IMAGEN; los demás campos van bloqueados
- [ ] El campo Estado NO aparece en el formulario; sí el badge del header [desv. 3]
- [ ] No puede borrar la organización ni crear centros

Admins
- [ ] El tab Admins lista los 3 niveles: Organization, Center y Team admin [desv. 7]
- [ ] Papelera en Org Admins y Center Admins; nunca en su propia fila
- [ ] En las filas de Team admin la papelera NO está (oculta, no deshabilitada) [desv. 7]
- [ ] Invita Org Admins; reenvía y cancela invitaciones de la org

Integraciones y API
- [ ] Ve Integrations; edita los ajustes de Teamworks
- [ ] Ve el interruptor de la API, pero bloqueado: no enciende ni apaga
- [ ] Ve el token y lo copia; NO ve la tabla de consumo ni "Max tokens per month"
- [ ] La pantalla "API Test" del sidebar funciona

Centros
- [ ] Cambia la imagen del centro; datos bloqueados; contacto y "Link units" no aparecen
- [ ] Sin "Delete" del centro; ve el nombre real, nunca el alias
- [ ] Invita y quita Center Admins (no a sí mismo); reenvía y cancela invitaciones

Equipos
- [ ] Solo lectura: las filas de equipo NO tienen menú "⋯" y no hay "New team" [desv. 5]

Usuarios
- [ ] "New user" existe y solo ofrece **Organization admin** y **Center admin**
- [ ] NO ofrece Team admin ni User; sin pestaña "Manually"
- [ ] Filtro de centro solo si la org tiene más de un centro
- [ ] Ve el nombre del centro en las tarjetas de rol; NO el encabezado de organización
- [ ] NO ve los consentimientos de otros (los suyos sí, en su perfil)
- [ ] Fila de usuario: menú "⋯" con "Edit User"; sin "Delete User"
- [ ] Panel de edición: datos personales bloqueados; el interruptor de Estado SÍ funciona
- [ ] NO ve "Reset PIN", el interruptor de PIN ni "Visible on screen"

Units
- [ ] Lista con filtro por centro; sin columnas Display/Sensor ni filtros avanzados
- [ ] No crea ni borra units; no ve la pestaña Devices
- [ ] Panel — editable: Org/Center, Idioma, Descripción, Modo de login, Screen Roster
- [ ] Panel — bloqueado: Unit ID, Urinal model, Estado
- [ ] Panel — NO aparecen: Display/Sensor, Apariencia, Mensajes, Score Screen/Waterflush,
      Conductividad, Estadísticas

Analítica
- [ ] Usage y Hydration con filtro por centro, sin filtro por organización

---

## Center Admin

Uno o varios centros. **Versión cruzada con la lista del programador (6/10)**: donde decían lo
mismo manda su texto; lo nuestro que él no tenía se añadió; lo que choca con el excel va con
"⚠ A confirmar con el dev".

Control Panel
- [ ] Debe entrar directamente a su center y no ver ninguna otra sede.
- [ ] Si administra varios centers: ve la lista de SUS centers (master-detail) y una sola entrada
      "Center Admin" en el cambiador de rol. [desv. 1]
- [ ] Header compacto, sin botón de volver.
- [ ] Debe poder cambiar la imagen del center y gestionar sus contactos. ⚠ A confirmar con el dev:
      el Excel decía que editar contactos del center era solo para super roles.
- [ ] Debe poder invitar y quitar administradores del center, y reenviar/cancelar sus invitaciones.
- [ ] No puede quitarse a sí mismo como administrador.
- [ ] Debe poder crear, editar y eliminar equipos de su center.
- [ ] Ve el botón de crear equipo también en la pantalla vacía (sin equipos).
- [ ] Puede cambiar el estado del equipo (desplegable de Estado editable).
- [ ] En cada miembro del equipo: "Settings", "Delete User", "Turn on/off PIN" y "Regenerate PIN"
      (las de PIN solo en usuarios, no en admins).
- [ ] En cada invitación pendiente del equipo: "Resend invite" y "Cancel invitation".
- [ ] Debe poder ver la lista de usuarios, sus roles y permisos, con el encabezado de organización
      y center de cada rol; filtrar por equipo. ⚠ A confirmar con el dev: en el Excel Center Admin
      no ve ninguno de los dos encabezados.
- [ ] El filtro de equipo solo aparece si el center tiene más de un equipo.
- [ ] Debe poder cambiar el estado de un usuario y editar sus datos, PIN y visibilidad en pantalla.
- [ ] Puede eliminar usuarios ("Delete User" en el menú "⋯").
- [ ] No debe poder editar los datos del center (nombre, dirección, email, teléfono) ni eliminarlo.
- [ ] ⚠ Estado del center: no debe aparecer editable. El Excel avisa que el desplegable nunca se
      bloquea y, sin permiso, el cambio se descarta al guardar sin avisar.
- [ ] No debe ver nada a nivel de organización. ⚠ A confirmar con el dev: el Excel decía que sí
      entra al detalle de su organización, sin engranaje.
- [ ] No debe poder ver consentimientos ni identificadores externos de los usuarios.
- [ ] No debe poder filtrar los usuarios por organización o center (ya está acotado a su center).

Units
- [ ] Debe poder ver las unidades dentro del panel de su center, con columnas de tipo, fecha de
      alta y uso; editar idioma, descripción, modo de login y roster de pantalla.
- [ ] En el panel de la unidad, Unit ID, modelo y Estado aparecen bloqueados.
- [ ] No debe poder crear ni eliminar unidades, ni ver campos técnicos ni dispositivos.
- [ ] No debe ver "Units" como ítem propio del menú lateral. ⚠ A confirmar con el dev: el Excel
      decía que sí aparecía en su sidebar.

Analytics
- [ ] Debe poder ver las analíticas de uso e hidratación de su center, sin selector de
      organización ni center (ya acotado).
- [ ] No debe poder usar la pestaña de pruebas de API.

My Data
- [ ] No aplica como pantalla de inicio de este rol.

Profile
- [ ] Debe poder abrir "Account details" y editar sus propios datos.

Mails and invitations
- [ ] Debe poder invitar administradores de center, profesionales de equipo y usuarios.
- [ ] Nunca ve "Kamleon staff" ni "Organization admin" como opción al invitar.
- [ ] Debe poder crear usuarios manualmente uno a uno siempre, y por archivo solo si el center
      tiene activado el auto-registro.

---

## Team Admin

Uno o varios equipos asignados.

Entrada
- [ ] Entra al detalle de su equipo, header compacto sin back
- [ ] Sidebar: Orgs (etiquetado "Teams") · Hydration · My data; NO Units ni Usage
- [ ] Solo ve los equipos que tiene asignados [desv. 2]. En el excel ve todos los de su centro
- [ ] No sale de su centro: no ve otros centros ni organizaciones; sin engranaje de la org

Su equipo
- [ ] "Edit Team" (menú de la fila e icono de ajustes en la cabecera): nombre y descripción
- [ ] Desplegable de Estado del equipo, editable
- [ ] NO ve crear equipo ni "Delete Team"
- [ ] "Turn on/off PIN" y "Regenerate PIN" en cada usuario
- [ ] "Resend invite" y "Cancel invitation" en invitaciones pendientes
- [ ] Bulk actions de PIN pide confirmación y dice a cuántos afecta

Usuarios
- [ ] "New user" ofrece solo Team admin y User, para su equipo
- [ ] Puede invitar a otro Team Admin al mismo equipo
- [ ] Tiene la pestaña "Manually"
- [ ] Columna Status = membresía en el equipo (Pending/Active), de solo lectura
- [ ] NO ve ni cambia el estado de la CUENTA de nadie [desv. 6]. El excel sí se lo da
- [ ] En el tab Users no hay team admins (están en Admins) ni filtro de rol
- [ ] "Remove from team" deshabilitado sobre uno mismo, tooltip "You can't remove yourself"
- [ ] ⚠ CHOQUE: el excel le da "Settings", "Delete User", editar datos, "Reset PIN" y "Visible on
      screen"; el prototipo hoy no le deja editar ni quitar (`canManageUser` en
      `OrgDetailV2.jsx`). Decidir: alinear o documentar como desviación (pendiente 8)
- [ ] ⚠ SIN DECIDIR: ¿puede quitar a otro Team Admin? Regla propuesta: el último Team Admin no
      puede quitarse (pendiente 8)

Analítica
- [ ] Hydration: el selector de equipo muestra solo sus equipos; los datos no cargan hasta
      elegir uno

---

## End User

Sin criterios: el programador todavía no lo ha definido (`teamstaff_user` y `kamleon_user` usan
`allPermissions` de relleno).
