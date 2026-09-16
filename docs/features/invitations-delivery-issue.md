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
