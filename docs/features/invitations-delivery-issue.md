# Invitaciones — icono de incidencia de correo

Decisión de copy 2026-09-16 (Daniel + el programador). Feature del programador, no del prototipo: seguimiento de correos para que ventas pueda ver qué pasó con una invitación sin preguntarle a él.

## Cómo es la fila

```
(M) marcus.oyelaran@astoni…   ( First team )   ( ● Pending )   [✉!]  [⋯]
    Invited 12/Aug/26
```

Dos ejes independientes, no hay que mezclarlos:

- **Tag** = ciclo de vida de la invitación: `Pending` (no contestaron) · `Active` (aceptaron) · `Expired` (caducó). Depende de la persona.
- **Icono ✉!** = incidencia del correo en el gestor de emails. Solo aparece cuando hay una. Al click, abre el historial de ese correo (rebote, delay, etc.). Depende del servidor.

Una invitación que rebotó sigue siendo `Pending`: el Tag no cambia por una incidencia.

## Copy decidido

Tooltip del icono: **"Delivery issue"**

Un único string para todos los casos (rebote y delay). Es verdadero para los dos: un rebote no se entregó y un delay todavía no se entregó.

`aria-label` del botón (lectores de pantalla), más explícito que el tooltip: **"Email delivery issue — open email history"**

## Por qué no otras opciones

- ~~"Ver estado de envío"~~ (copy original del programador): describe el click, no la novedad. El icono aparece **solo** cuando hay un problema, así que el tooltip es el lugar para dar esa noticia.
- ~~"Ver incidencia"~~: "incidencia" es vocabulario de soporte, no de ventas, y no aclara que es del envío del correo.
- ~~"Not delivered"~~: falso para un delay, que puede entregarse minutos después.
- ~~Cambiar el Tag a "Not delivered"~~: mezclaría el estado de la invitación con el del correo. Descartado.

## Anotado para más adelante (no bloquea)

- **Tooltip por estado**: mismo icono, string variable — "Delivery issue — bounced" / "Delivery issue — delayed". Responde en el hover la pregunta "¿es grave o se resuelve solo?" y evita entrar al historial. Requiere que la fila conozca el último estado.
- **Color por gravedad**: rojo para rebote/bloqueo/spam (hay que actuar), ámbar para delay (esperar). Mismo componente.
- **Resend**: verificar que siga disponible en el menú "⋯". En una invitación que rebotó es justo cuando más se necesita, después de corregir la dirección.

---

## Actualización 2026-09-17 — Email history (caso delay)

**Quién lo ve:** solo Kamleon staff (Owner y Admin). Org Admin no ve el botón de incidencia, ni la línea "Email — Delivery issue" en mobile, ni la opción "View email history". Es una iniciativa del programador; en el prototipo el gestor de correos **no está conectado**: todo el historial es emulado (`prototypes/StaffOrganizacionesV2/screens/emailHistoryMock.js`).

**Drawer "Email history"** — Figma: Web App 2.0, nodo `12800:135260`. Se abre desde el botón de incidencia y desde "View email history".
- Email de la persona arriba, filtros **All · Invitations · Other mails**.
- Una card por correo (desplegable): tipo, Tag de estado, *Last update*, *Mail ID* y la línea de tiempo del envío.
- Caso **delay**: Sent → Injection → Delay (punto naranja) con la descripción *"The recipient's mail server is temporarily not accepting messages. Kamleon will keep retrying automatically."*
- Pie de la invitación pendiente: *"The invitation cannot be resent because the previous one has not yet been received."* + **Resend invitation deshabilitado** + **Cancel invitation**.

**Decisiones de copy (17/9):**
- Tipo de correo de la invitación: **"Admin invitation"** (en Figma decía "[Email type]").
- Formato de fecha único: **"12/Aug/26 · 14:00"**, el del resto del prototipo (Figma tenía dos formatos distintos).
- La opción del menú pasa a **"View email history"**, igual que el título del drawer.
- **"Other mails"** son correos transaccionales de la cuenta, por ejemplo **restablecer contraseña** (la lista exacta la define el programador). En el mock: los admins activos tienen un "Password reset" entregado; las invitaciones pendientes no tienen otros correos (la persona todavía no tiene acceso), así que ese filtro muestra un estado vacío.

**Pendiente:** el caso **rebote** (bounce).
