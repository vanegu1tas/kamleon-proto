# Fast Track login — ficha de la tarea

**Pide**: CS / Business (propuesta del 17/09/2026, JVB) · **Clientes**: Dallas Cowboys, Gil Vicente, Aston Villa, Arsenal
**Objetivo**: subir el registro de usos de ~20% a 30–35% quitando pantallas antes de orinar.
**Prototipo**: microsite de la scrapp → Tareas → Fast Track · código en `scrapp/explorations/fast-track/daniel/`

## Lo que pide la propuesta
- La pantalla de bienvenida se sustituye por la plantilla. Probaron 30; piden probar 20 y flecha si hay más.
- Mantener el logo de Kamleon y una entrada por QR (staff que no está en la plantilla).
- Pantalla "Ready" que confirme a quién se eligió.

## Decidido con Daniel (15/10)
- **Sin PIN**: estos equipos no lo usan. Riesgo aceptado: cualquiera puede registrarse a nombre de otro; "Ready" evita el error, no la suplantación.
- **Sin elegir equipo**: caso de un solo equipo.
- **Páginas de 20 con pestañas por rango de dorsales** (calculadas solas; un dorsal repetido nunca se parte entre páginas). Con ≤20 no hay rangos. Motivo: Dallas tiene hasta 90 → 5 páginas; con flecha sola, el 80 necesita 4 toques.
- **RFID: sin indicación en pantalla** (cambio del 15/10). Si el cliente compra las manillas, se le explica en la instalación; si no, cada uno se elige en la pantalla. **Invitado: tampoco se anuncia** (15/10): si alguien orina sin elegir perfil, arranca como invitado. El pie desaparece y ese espacio va a la cuadrícula (fotos 96px con 20, 78px con 30). Pendiente de confirmar con CS.
- **Ready**: foto, "Hi, <apellido>", dorsal, "Not you?" grande; vuelve sola a la plantilla a los 15 s.
- **QR, dos exploraciones**: (1) QR en la esquina, como la propuesta pero más grande · (3) "Staff" como pestaña aparte de los rangos: el QR grande sustituye a la cuadrícula; con ≤20 la barra queda "Players · Staff". La opción 2 (botón que abre otra pantalla) se descartó: la 3 es su versión mejorada.

## Abierto
- Confirmar con CS el comportamiento del invitado.
- Distancia de lectura de la pantalla (no hay dato): fotos de 84px y texto de 20px son un supuesto.
