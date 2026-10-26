# Wizard (set up / instalación) — ficha de la tarea

**Qué es**: el flujo de set up de la scrapp, el que se recorre al instalar la pantalla. Internamente lo llaman *wizard*.
**Pide**: Operations → Product, brief *Wizard v2* del 21/10/2026 (`~/Downloads/Wizard v2.pdf`)
**Clientes**: Dallas Cowboys (4 unidades), Ipswich (3), Aston Villa (3), instalaciones del verano de 2026
**Objetivo**: que el cliente complete la activación **sin soporte**. Hoy ninguno lo ha logrado: 10 de 10 necesitaron
ayuda (2 las resolvió Aftersales y 8 se escalaron a Soporte Técnico). Wizard en 10 de 24 instalaciones del verano (42 %).
**Quién lo usa**: personal del cliente, normalmente no es técnico de IT.
**Prototipo**: microsite de la scrapp → Tareas → Wizard (también en Producción → Flujo actual)
**Wizard actual**: `scrapp/screens/wizard/` (referencia, no se toca) · exploraciones en `scrapp/explorations/wizard/daniel/`
**Fuente**: Figma *Screen App* `qr65pwQqo9hJT6MgfU2OLj`, página "-- Review document", fila y ≈ 4136 (no está en el DS ni en Web App 2.0)

## Plan
1. **Emular el wizard actual** tal como está hoy (de capturas o vídeo de producción), como hicimos con el flujo de end user. Es la referencia: no se toca.
2. Sobre esa emulación, listar los problemas y proponer mejoras.
3. Exploraciones como copia de la emulación, cada una en su carpeta.

## Wizard actual (emulado 26/10)
Marcos de 479 × 299 en Figma → × 2,673 para 1280 × 800.

| # | Pantalla | Nodo | Qué hay | Lleva a |
|---|---|---|---|---|
| 1 | Home screen | 2707:62074 | "Welcome to the S-Urinal installation wizard" · Get started | 2 |
| 2 | Language | 2707:62020 | Select the language · English, Español, Català, Deutsch, Português, 汉语 (3 visibles, scroll) | 3 |
| 3 | Network | 2707:62025 | Connect the S-Urinal · Ethernet / Wireless (Wifi) | Ethernet → 9 · Wifi → 4 |
| 4 | Searching for networks | 2707:61971 | Loader + "This may take a few seconds." | 5 (sola) |
| 5 | Wifi | 2707:61979 | Select the WIFI network · 6 redes (candado solo en las 3 últimas) | 6 |
| 6 | Contrassenya | 2707:61984 | Introduce the password · campo con la red + teclado en pantalla (iPad) | 7 |
| 7 | Contrassenya 18 | 2707:61991 | Teclado cerrado · contraseña en puntos · ojo · Continue | 8 |
| 8 | Contrassenya 17 | 2707:61992 | Continue en gris con spinner (conectando) | 9 (sola) |
| 9 | Network (IP) | 2707:62679 | Select your IP configuration · Manual IP / Automatic (DHCP) | Manual → 10 · DHCP → 11 |
| 10 | Manual IP configuration | 2707:62728 | Device IP Adress, Subnet Mask, Gateway (0.0.0.0) · Connect | 11 |
| 11 | Connecting | 2707:62003 | Loader + "The S-Urinal is connecting to the network." | 12 (sola) · si falla → 13 |
| 12 | Connected | 2707:62011 | Check turquesa + "Successfully connected to the network." | 12b (sola) |
| 12b | Unit ID | _(no está en Figma; foto del brief)_ | "Please input unit ID" · campo "Unit ID:" · teclado blanco de producción (números, Space, Delete, Close) | 14 |
| 13 | Not Connected | 2707:62662 | Triángulo rojo · "Connection error" · "Check network connection and try again." · Try again | 11 |
| 14 | Verifying (5 pasos) | 2707:61910 · 61917 · 61924 · 61931 · 61938 | Mismo loader, "Verifying"; cambia la frase: *ready in under a minute* → *Cartridge successfully detected* → *A water flush will be performed* → *Activating the waterflush* → *Ensuring proper functionality* | 17 · fallos → 15 / 16 |
| 15 | Cartridge not detected | 2707:62671 | Triángulo · "Install or check the cartridge connection." · sin botón | paso 2 de 14 |
| 16 | Installation failed | 2707:61954 (agua) · 2707:61945 (funcionamiento) | Triángulo · Try again | 14 desde el paso 1 |
| 17 | Installation Completed | 2707:61963 | Check · "The S-Urinal will restart and be ready for use." | _(fin)_ |

Supuestos de la emulación (no salen en Figma): atrás vuelve a la pantalla anterior (desde la 9, a la 3);
"return" del teclado lo cierra; tocar el campo lo vuelve a abrir; el ojo muestra la contraseña;
desde la 10, a la 9; los campos de la 10 no se editan (Figma no dice cómo);
tiempos de demo: búsqueda 2,5 s, conexión wifi 2 s, Connecting 4 s;
el fallo se fuerza con un botón SIM en Connecting; Try again vuelve a Connecting.
Verificación (26/10): Daniel pasó la 14, la 17 y que si no hay cartucho sale un error. **Deducido por la posición
en Figma, sin confirmar**: el error de cartucho (15) sale en el paso 1; los dos "Installation failed" (16) salen
en los pasos 4 (agua) y 5 (funcionamiento). La 15 no tiene botón: se supone que sigue sola al poner el cartucho.
Try again de la 16 reinicia la verificación. Cada paso dura 3 s en la demo; Connected se ve 2,5 s. El loader es el `RingLoader` de la scrapp (14 puntos; el de Figma tiene 16).

Unit ID (26/10, a petición de Daniel): reconstruida de la foto del brief, medidas aproximadas. **Supuestos**:
va después de Connected y antes de Verifying (el brief la pone tras IP configuration y dice que, una vez activada,
el resto funciona); "Close" cierra el teclado y sale Continue; atrás vuelve a IP; cualquier código vale (no se sabe
qué error sale si está mal). Las teclas que no se leen en la foto se rellenaron con "." y ",".

Pendiente en Figma, sin emular: "Verify Installation" (2707:61901, triángulo · "The S-Urinal will begin a test,
ensure everything is ready." · Continue), entre Connected y Verifying en la fila. Sin confirmar si va en el flujo.
Errata en producción: "Device IP Adress" (falta una d).

## Lo que falta
- Unit ID: confirmar posición en el flujo, qué hay al cerrar el teclado y qué error sale si el código está mal.
- ¿Va "Verify Installation" (2707:61901) entre Connected y Verifying?
- Si falla la contraseña de la wifi, ¿sale también la 13 o otra?
- Cómo se editan los campos de Manual IP.

## Pains del brief (26/10) — sin implementar todavía

Las tres fricciones principales del brief: **Welcome** (fila 1), **conexión a internet** (filas 2 y 3) y **Unit ID** (fila 4). El brief pide revisar el wizard entero, no solo parchear.

| # | Pantalla (brief) | Nuestra emulación | Pain | Propuesta del brief |
|---|---|---|---|---|
| G | Todas | todas | Texto muy pequeño y zonas táctiles difíciles de acertar. | Más tamaño de texto y de zonas táctiles en todo el wizard. |
| 1 | 01 Welcome · **fricción 1** | 1 | El cliente cree que la unidad ya está lista; no entiende que empieza la configuración y activación. | Rediseñar para que quede claro que es la configuración y activación, no una confirmación de que todo está bien. |
| — | 02 Language | 2 | Sin problemas propios (aplica G). | — |
| 2 | 03 Connection type · **fricción 2** · *opción que no funciona* | 3 | Ofrece Ethernet, Wi-Fi e "Install without internet", pero el modo sin internet no existe. Tampoco dice cuál se recomienda. | Quitar "Install without internet". Ethernet como recomendada; Wi-Fi como alternativa. |
| 3 | 04 IP configuration · **fricción 2** · *genera llamadas* | 9 | Ante "Manual IP" / "Automatic (DHCP)" llaman para preguntar qué elegir. | Indicar que la automática es la estándar (recomendada o preseleccionada). |
| 4 | 05 Unit ID · **fricción 3** · *genera llamadas* | 12b | Se les manda un código de activación, pero la pantalla pide "Unit ID" y no saben si va ahí (el email ya lo dice; la pantalla debe explicarlo sola). | Decir en la pantalla que ahí va el código de activación recibido por email (Unit ID). |
| 5 | 06 Errores y navegación · *sin salida* | 13, 15, 16 y el atrás | El camino feliz funciona. Con un error, al ir atrás o adelante, o si se queda colgado, no hay forma de cerrar ni reiniciar: solo apagar y encender. | Salida clara y opción de reiniciar el wizard desde cero en todas las pantallas. |

Otras propuestas del brief (fuera del rediseño): guía paso a paso en el manual mientras tanto (Product · Operations)
y guía visual simple sobre la activación y los códigos (Operations).

### Diferencias entre producción (fotos del brief) y nuestra emulación (Figma)
- **Connection type** en producción tiene tres opciones (Ethernet, Wi-Fi e "Install without internet"); el Figma tiene dos.
- **Unit ID**: no está en el Figma; emulada desde la foto (12b). Usa un teclado distinto al de la contraseña.
- En las fotos los textos salen en el idioma de cada unidad (italiano, etc.).

## Decidido
_(nada aún)_

## Abierto
_(nada aún)_
