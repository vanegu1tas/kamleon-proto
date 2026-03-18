# Guión de prueba de usuario — V2 (nuevas funcionalidades)
**Prototipo:** StaffOrganizacionesV2 (Panel Staff — master-detail)
**Duración estimada:** 20–25 min
**Perfil del participante:** Staff administrativo con experiencia básica en herramientas de gestión web

---

## Briefing (5 min)

Leer en voz alta al participante:

> "Hoy vamos a explorar una versión actualizada de la herramienta interna de gestión. No estamos evaluando tus habilidades — estamos evaluando si la herramienta es fácil de usar. No hay respuestas correctas ni incorrectas.
>
> Te pediré que pienses en voz alta mientras haces cada tarea: dime qué estás viendo, qué esperas que pase y qué te sorprende.
>
> Si en algún momento te sientes bloqueado, dímelo. No te daré la respuesta, pero sí puedo darte una pista si llevas más de dos minutos sin avanzar."

**Antes de empezar:**
- ¿Has usado antes herramientas de gestión de organizaciones o equipos? ¿Cuáles?
- ¿Cómo describirías tu comodidad general con herramientas web? (1–5)

---

## Tarea 1 — Creación de equipo desde el panel de detalle
**Tiempo máximo:** 4 min
**Objetivo:** Testear si el usuario entiende el layout master-detail de V2 y descubre el botón Create contextual dentro de un centro.

### Escenario
> "El centro **Training Ground** de **Astonia FC** va a incorporar un nuevo grupo de trabajo. Necesitas crear un equipo llamado **Reservas** dentro de ese centro. ¿Puedes hacerlo?"

**Ruta esperada:** click en Astonia FC en la lista → click en Training Ground en el panel izquierdo → panel derecho muestra CenterCard → tab Teams → botón Create → New Team → rellenar nombre "Reservas" → Create.

### Qué observar
- ¿Entiende que el panel izquierdo es la lista de centros y que hay que hacer click para ver el detalle?
- ¿Se queda esperando que el panel derecho aparezca o lo busca activamente?
- ¿Descubre el botón Create dentro del CenterCard o lo busca fuera (en el header global)?
- ¿El dropdown "New Team / New User / New Unit" es claro, o le genera dudas sobre qué opción elegir?
- ¿Entiende que los campos con asterisco (*) son obligatorios sin que se lo expliques?

---

## Tarea 2 — Añadir un usuario sin invitación por correo
**Tiempo máximo:** 5 min
**Objetivo:** Testear si el usuario descubre la opción manual en el drawer de creación y entiende la distinción entre los dos modos de alta.

### Escenario
> "Tienes en la mesa los datos de un nuevo atleta que acaba de firmar con **Astonia FC** y necesitas darle de alta hoy mismo en el equipo **First Team** del centro **Training Ground**. El atleta no tiene email corporativo aún, así que no puedes enviarle una invitación. Se llama **Jordan Mills**, su rol es **User** y su fecha de nacimiento es **12 / 03 / 1998**. ¿Puedes añadirlo?"

**Ruta esperada:** Astonia FC → Training Ground → tab Teams → First Team → botón Create → New User → segmented control "Manually" → rellenar Name, User role, Date of birth → Create user.

**Alternativa válida:** botón Create del CenterCard → New User → seleccionar equipo en el dropdown Team → Manually → rellenar.

### Qué observar
- ¿Entiende que "By invite" es el modo por defecto y que existe una alternativa sin necesidad de que se lo expliques?
- ¿El segmented control "By invite / Manually" comunica claramente la diferencia antes de hacer click?
- ¿Rellena los campos en el orden correcto o salta entre ellos sin criterio?
- ¿El campo Date of birth con tres inputs separados (Day / Month / Year) le genera confusión o lo completa sin fricción?
- ¿Intenta buscar un botón "Save" o entiende que el botón final se llama "Create user"?

---

## Tarea 3 — Búsqueda global con ⌘K
**Tiempo máximo:** 3 min
**Objetivo:** Testear si el usuario descubre la búsqueda global y la usa como atajo frente al drill-down manual.

### Escenario
> "Un compañero te pide que compruebes si **Michael Porter** tiene cuenta activa en la plataforma y a qué centro pertenece. Encuéntralo de la forma más rápida que puedas."

**Respuesta correcta:** Michael Porter es Admin de Centro del Arsenal FC (center 201). Accesible vía ⌘K escribiendo "Michael" o "Porter".

**Camino alternativo (más lento):** navegar manualmente por la lista hasta Arsenal → centro → tab Administrators.

### Qué observar
- ¿Descubre el atajo ⌘K o el search pill del topbar antes de intentar navegar manualmente?
- Si no lo descubre, ¿cuánto tarda en llegar por drill-down y en qué punto se frustra?
- Si usa ⌘K, ¿entiende los resultados a la primera? ¿Distingue entre resultados de tipo org / centro / usuario?
- ¿Después de usar ⌘K una vez, lo usaría de nuevo o vuelve a navegar manualmente?

---

## Cierre (5 min)

Preguntas post-test:

1. **En general, ¿cómo te ha parecido la nueva distribución en dos paneles frente a la versión anterior?**
2. **¿Hubo algún momento en que no sabías dónde estabas o qué hacer a continuación?**
3. **¿El hecho de ver el detalle del centro sin salir de la lista te parece útil o te genera confusión?**
4. **¿Sabías que existía el buscador global (⌘K) antes de que te lo dijera la tarea? ¿Lo usarías habitualmente?**
5. **Si pudieras cambiar una sola cosa de esta versión, ¿qué sería?**

---

## Guía de observación para el moderador

| Señal | Qué puede indicar |
|---|---|
| No hace click en el panel izquierdo | El panel izquierdo no comunica que es interactivo |
| Busca el botón Create en el header global | El Create contextual del CenterCard no tiene suficiente prominencia |
| No cambia de "By invite" a "Manually" | El segmented control no llama la atención o "By invite" parece la única opción |
| No descubre ⌘K y navega manualmente | El search pill del topbar no invita a usarlo como búsqueda global |
| Confusión con los 3 inputs de fecha | El patrón Day/Month/Year separado puede necesitar labels más claros |
| Busca confirmación de que el equipo/usuario fue creado | Falta feedback visual post-creación (toast de éxito) |

---

## Métricas a capturar por tarea

| Tarea | Éxito | Tiempo | Errores | Necesitó pista |
|---|---|---|---|---|
| T1 Crear equipo (master-detail) | ✓/✗ | | | |
| T2 Añadir usuario manualmente | ✓/✗ | | | |
| T3 Búsqueda global ⌘K | ✓/✗ | | | |
