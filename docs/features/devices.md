# Devices — inventario para Kamleon staff (29/10)

Requisito de última hora (business, confirmado con Arnau: lo usan en development y producción):
1. En Edit unit se puede quitar el sensor y/o la pantalla asignados.
2. Si el device no existe, se puede crear desde Edit unit.
3. Al crear un device, "assign unit" no es obligatorio.
4. Lista de devices en el side menu.

## Modelo (aclarado por Daniel)
El device **sigue siendo parte de la unit**: cada unit tiene un Display y un Sensor (K-POD).
La lista es un **inventario**: lo que está en stock y lo que está puesto. Staff entra, busca un
device y decide si lo pone en una unit o lo deja disponible.

## Decisiones (29/10)
- Sidebar › Management: Control panel · Units · **Devices** · Unit usage. **Solo Kamleon staff**
  (Owner, Admin, Editor = `units.devices.access`). Oculto a Org/Center/Team Admin y End User.
- Editor ve la lista en solo lectura (`units.devices.edit/.delete` solo Owner/Admin, excel).
- Menú ⋯: Unassigned → Assign to unit · Delete. Assigned → Edit · Remove from unit.
  Sin "Go to unit". Unassigned: solo Assign to unit + Delete (Edit hacía lo mismo, quitado 29/10).
- New device y Edit device: **drawer** (patrón de la webapp para crear/editar), no modal.
  "Assign to unit" abre el mismo drawer de Edit. Unit opcional ("No unit — keep in stock").
- Units: **lo único que cambia** es que el botón New ▾ pasa a ser **New unit** directo (sin
  "New device"). El resto de Units, incluido el drawer de Edit unit, queda igual (Daniel, 29/10).
- Edit unit puesto al día con Figma 12500:413631 (solo staff): Appearance, Messages, Parameters
  (Screen / Usage / Software). **Install info no** (Daniel). Asignar device en Edit unit: Daniel pasa
  dónde va. Los requisitos 1 y 2 siguen pendientes hasta entonces.
- Si la unit ya tiene un device de ese tipo, el anterior vuelve a stock (aviso en el drawer).

- Units puesto al día con Figma (12533:25374), solo la página, no el tab embebido de la org:
  título y KPIs fuera de la tarjeta, Organization/Centers como campos dropdown de 180, búsqueda
  223, páginas de 10. El proto iba por detrás desde que se creó (c091caf). Devices usa la misma
  estructura con KPIs Total / Unassigned / Assigned. Filtros: buscador + botón Filters (Type, Unit).

- Edit unit › Devices: el device **guardado** queda fijo con la ✕ **dentro** del campo, en el sitio del chevron (Daniel, 29/10: fuera encogía el campo y descuadraba Display/Sensor). Pendiente: pasar "Link a unit" de New center a la misma regla.
  Lo elegido sin guardar se cambia con el chevron; la ✕ aparece solo tras guardar (Daniel, 29/10).
  Crear: "+ Create new …" → panel "‹ Create new …" con ID y Create (flujo de New center 15002:105408).
- Abierto: ¿Edit en el menú de los Assigned? Choca con "quitar primero" (Daniel lo piensa).

## Proto
`DevicesTab.jsx` (lista) · `DeviceDrawer.jsx` (new/edit) ·
`devicesStore.js` (stock + lo asignado en `unit.display/kpod`) · icono provisional `IconSbDevices`.

## Qué documentar en Figma (lista final, 29/10)
Devices resuelto en el proto. Frames reducidos; crear un device lleva cada paso y error.

A. Sidebar
 1. Ítem Devices en Management (entre Units y Unit usage), solo staff. Icono de Daniel.

B. Lista de Devices (1 frame + piezas al lado)
 2. Página: título "Devices" + New device fuera de la tarjeta; KPIs Total · Unassigned · Assigned;
    tarjeta con buscador + Filters; tabla Device ID (+ "Added fecha") · Type · Unit · Daily use ·
    Total use · ⋯. Unit = número o tag gris "Unassigned". Paginación de 10.
 3. Al lado: Filters abierto (Type: Display/Sensor · Unit: Assigned/Unassigned).
 4. Al lado: menú ⋯ Unassigned (Assign to unit · Delete) y menú ⋯ Assigned (Edit · Remove from unit en rojo).
 Notas: estado vacío "No devices found"; Editor sin New ni ⋯; Delete solo sin unit; uso "—" sin unit.

C. Crear desde Devices: New device (5 frames)
 5. Vacío: Type sin elegir ("Select type"), unit deshabilitada ("Select the type of device first."), Create deshabilitado.
 6. Type + ID rellenos, sin unit: Create activo.
 7. Error: "This ID already exists".
 8. Desplegable de unit abierto: solo units sin ese tipo de device ("Only units without a … are listed.").
 9. Resultado: toast "Sensor 2970 created" + fila nueva (Unassigned o con su unit).
 Notas: Assign to unit / Edit usan este drawer con Type e ID bloqueados; sin Date of installation.

D. Asignar o quitar desde Devices (notas sobre B, sin frames nuevos)
 10. Assign to unit → drawer con la unit → la fila pasa a mostrar la unit.
 11. Remove from unit → toast "… removed from unit …" → la fila pasa a Unassigned.
 12. Delete → modal de confirmación del DS.

E. Edit unit › grupo Devices (2 frames)
 13. Display guardado: campo fijo + ✕ dentro, en lugar del chevron (tooltip "Remove display"); Sensor vacío con chevron.
 14. Tras ✕ sin guardar: campo vacío con chevron, sin aviso (Daniel, 29/10: el campo vacío ya lo dice; como el resto del drawer, no se aplica hasta Save).
 Nota: lo elegido en esta edición sin guardar sigue con chevron para cambiarlo; la ✕ solo con lo guardado.

F. Asignar uno existente desde Edit unit (2 frames)
 15. Desplegable abierto: buscador, "+ Create new sensor" primero, lista de Unassigned.
 16. Elegido sin guardar: ID en el campo con chevron.
 Nota: sin resultados → "No sensors match …"; ninguno libre → "No unassigned sensors".

G. Crear desde Edit unit (4 frames, sobre los de New center 15002:105408)
 17. Panel "‹ Create new sensor": ID vacío, Create deshabilitado.
 18. ID escrito: Create activo.
 19. Error: "This ID already exists", Create deshabilitado.
 20. Resultado en el campo: ID con chevron + "New sensor. It will be created when you save."

H. Units
 21. Nota en el frame actual: el botón New ▾ pasa a "New unit" (los devices ya no se crean aquí).

I. Sticky de reglas y flujos
 - Solo Kamleon staff; Editor en solo lectura.
 - Un Display y un Sensor por unit; para poner otro, primero se quita.
 - Nada se crea, asigna ni quita hasta Save; Cancel lo deshace.
 - Sin Status (Active/Disabled): la unit dice si está puesto.
 - Sensor replacement automático: el viejo queda Unassigned y el nuevo se linka solo; el nuevo
   tiene que existir antes en la webapp sin unit.
 - Solo se borra lo que no tiene unit (pendiente Xavi: delete/deactivate con histórico).
 - La fecha de alta es la de creación y viaja con el device.
 - Flujos: alta sin unit · alta + asignar · asignar desde inventario · quitar desde inventario ·
   quitar desde la unit · poner uno existente en la unit · crear desde la unit · replacement automático.

## Unit en vez de Status (29/10, tras las respuestas)
Sin columna Status. La columna **Unit** muestra el número de unit o un tag gris **"Unassigned"**
(`mixed`). KPIs: Total devices · Unassigned · Assigned. Filters: Type + Unit (Assigned / Unassigned).
"Available" pasa a "Unassigned" en todo: un device sin unit puede ser nuevo, viejo o roto.

## Respuestas de Arnau / business (29/10)
1. **Sensor replacement:** al instalar uno nuevo, el sistema deslinka el viejo y linka solo el nuevo
   a la unit. Para eso el nuevo **tiene que existir antes en la webapp sin unit**. El viejo queda en
   la lista sin unit.
2. **Se reutilizan a veces** (sobre todo en la oficina, o se guardan para reintentar un replacement).
3. **Los retirados vuelven a la lista sin unit.** No cambiarlo si no lo piden (histórico en BD).
4. **Staff también debe poder quitar a mano**: ayuda a resolver incidencias si la unit no lo detecta.
5. **El Status de devices (Active/Disabled de V1) no se usa: se puede sacar.** Confirmar con Xavi
   (definió con Vea y Elena qué pasa con delete/deactivate).

Consecuencias: no hay estado Retired; Remove → sin unit es correcto; el alta en stock (flujo A)
es imprescindible para el replacement automático. "Available" engaña: un device sin unit puede ser
uno viejo o roto.

## Preguntas abiertas
("Development y producción" del requisito 4 = solo por qué quieren la lista en el sidebar, no un campo. Descartado 29/10.)
- Xavi: ¿qué pasa con delete/deactivate de devices? (¿se puede borrar uno con histórico?)
- ¿Mueven un device de una unit a otra sin pasar por "sin unit"? (decide si queda Edit en Assigned)

## Supuestos / por confirmar
- Campos de un device además de ID y tipo (modelo, firmware…).
- Asignar a una unit ocupada: ¿reemplaza con aviso (como está) o se bloquea?
- Al editar, Type e ID bloqueados.
- Tag "Unassigned" con `mixed` (gris, sin punto): falta una variante de tag propia en el DS.
- Icono del sidebar provisional, falta el de Figma.

## Confirmación al quitar / borrar (revisión 30/10)
- Quitar un device de su unit y borrarlo del inventario piden **escribir el ID** del device, con la mecánica del modal de eliminar (`DeleteOrgModal`, ahora con `confirmWord` / `verb` / `message` opcionales).
- **Devices:** ⋯ Remove from unit → modal "Remove sensor from unit" + "Type 2836 to confirm" → Remove (rojo). ⋯ Delete (solo sin unit) → modal de eliminar de la plataforma, escribiendo **DELETE** (Daniel, 30/10: borrar es borrar en todas partes; el ID solo para Remove).
- **Edit unit:** la ✕ abre un panel bajo el campo, como "Create new": "‹ Remove display", "Type 767409 to confirm", Remove (danger S). Solo **marca** el device: se quita al pulsar Save, como el resto del drawer (Daniel, 30/10).
