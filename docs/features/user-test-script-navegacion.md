# Guión de prueba de usuario — Navegación
**Prototipo:** StaffOrganizaciones (Panel Staff)
**Duración estimada:** 30–40 min
**Perfil del participante:** Staff administrativo con experiencia básica en herramientas de gestión web

---

## Briefing (5 min)

Leer en voz alta al participante:

> "Hoy vamos a explorar una herramienta interna de gestión. No estamos evaluando tus habilidades — estamos evaluando si la herramienta es fácil de usar. No hay respuestas correctas ni incorrectas.
>
> Te pediré que pienses en voz alta mientras haces cada tarea: dime qué estás viendo, qué esperas que pase y qué te sorprende.
>
> Si en algún momento te sientes bloqueado, dímelo. No te daré la respuesta, pero sí puedo darte una pista si llevas más de dos minutos sin avanzar."

**Antes de empezar:**
- ¿Usas habitualmente herramientas de gestión de organizaciones o equipos? ¿Cuáles?
- ¿Cómo describirías tu comodidad general con herramientas web? (1–5)

---

## Tarea 1 — Orientación inicial
**Tiempo máximo:** 3 min
**Objetivo:** Ver cómo el usuario lee la pantalla principal y qué información llama su atención primero.

### Escenario
> "Acabas de acceder a la plataforma por primera vez. Tómate un momento para explorar la pantalla. No hagas click aún — solo descríbeme qué ves y qué crees que puedes hacer desde aquí."

### Qué observar
- ¿Identifica las KPI cards y entiende qué representan?
- ¿Lee el sidebar? ¿Entiende la estructura de navegación?
- ¿Nota el botón "Create"? ¿Sabe para qué sirve antes de hacer click?
- ¿Mira la tabla de organizaciones y entiende que es clickable?

---

## Tarea 2 — Exploración de una organización
**Tiempo máximo:** 4 min
**Objetivo:** Testear la navegación de primer nivel (OrgList → OrgDetail) y la lectura de tabs.

### Escenario
> "Necesitas revisar los centros que tiene actualmente **Arsenal Football Club**. ¿Puedes encontrar esa información?"

### Respuesta esperada
OrgList → click en fila de Arsenal → OrgDetail → tab Centers (activo por defecto).

### Qué observar
- ¿Hace click en la fila o busca un botón específico?
- ¿Descubre el chevron de expansión inline o entra al detalle directamente?
- ¿Entiende las tabs sin explicación?
- Si expande inline, ¿navega al detalle del centro o se queda en la vista expandida?

---

## Tarea 3 — Navegación en profundidad
**Tiempo máximo:** 5 min
**Objetivo:** Testear la navegación completa hasta el nivel de usuario.

### Escenario
> "Un colega te pide que compruebes el email de **Laia Ferrer**, que pertenece al equipo **Team Alpha** de **Arsenal Football Club**. ¿Puedes encontrarlo?"

**Ruta esperada:** OrgList → Arsenal → CenterDetail (Sede Guarne) → TeamDetail (Team Alpha) → UserDetail (Laia Ferrer)
**Email correcto:** `laia.ferrer@kamleon.com`

### Qué observar
- ¿Sabe que tiene que entrar al centro para llegar al equipo?
- ¿El breadcrumb le ayuda a saber dónde está?
- ¿Usa el back button o intenta usar el sidebar/breadcrumb para retroceder en algún punto?
- ¿Encuentra el email en UserDetail sin dificultad?

---

## Tarea 4 — Tabs con información oculta
**Tiempo máximo:** 3 min
**Objetivo:** Testear si el usuario descubre información detrás de una tab no activa por defecto.

### Escenario
> "Estás revisando el equipo **Women's Team** de **Astonia FC** (centro City Campus). ¿Hay algún profesional asignado a ese equipo?"

**Respuesta correcta:** Sí — **Dra. Aina Puig**. Está en la tab Users, filtrando por "Professional".

### Qué observar
- ¿Encuentra el filtro por role en la tab Users?
- ¿Intenta buscar en la tab Administrators primero?
- ¿El label "Professional" en el tag es suficientemente claro?
- ¿Cuánto tarda en entender que el filtro sirve para diferenciar roles?

---

## Tarea 5 — Filtros en la lista principal
**Tiempo máximo:** 3 min
**Objetivo:** Testear el descubrimiento del filtro y su uso.

### Escenario
> "El equipo directivo quiere revisar solo las organizaciones del segmento **Fitness**. ¿Puedes mostrar solo esas?"

**Respuesta esperada:** Botón Filters → sección Segment → seleccionar Fitness.
**Resultado:** Quedan visibles AnyósPark, CAR Sant Cugat, CEAR La Cartuja, Dynatech.

### Qué observar
- ¿Encuentra el botón Filters sin ayuda?
- ¿Entiende el dropdown del filtro a la primera?
- ¿Después de aplicar el filtro, sabe cómo quitarlo?
- ¿El badge con el número de filtros activos le resulta útil?

---

## Tarea 6 — Organizaciones inactivas
**Tiempo máximo:** 2 min
**Objetivo:** Testear la lectura del estado en la tabla y el filtro por status.

### Escenario
> "¿Cuántas organizaciones están inactivas en este momento? ¿Cuáles son?"

**Respuesta correcta:** 2 — CEAR La Cartuja y Dynatech.

### Qué observar
- ¿Lee el tag de estado directamente en la tabla o usa el filtro?
- ¿El color/label del tag "Inactive" es suficientemente claro?
- Si usa el filtro, ¿lo encuentra fácilmente la segunda vez?

---

## Tarea 7 — Creación desde el menú global
**Tiempo máximo:** 3 min
**Objetivo:** Testear el descubrimiento del botón Create y sus opciones.

### Escenario
> "Necesitas añadir un nuevo centro para la organización **Baskonia-Alavés Group**. ¿Cómo lo harías?"

**Hay tres caminos válidos:**
1. Botón Create (header) → New Center
2. Context menu (···) en la fila de Baskonia → New Center
3. Entrar a Baskonia → botón New Center dentro de OrgDetail

### Qué observar
- ¿Cuál de los tres caminos descubren primero?
- ¿El menú desplegable del botón Create es intuitivo?
- ¿Les sorprende que haya varias formas de hacer lo mismo?
- Una vez abierto el drawer de creación, ¿entienden qué campos son obligatorios?

---

## Tarea 8 — Navegación hacia atrás
**Tiempo máximo:** 3 min
**Objetivo:** Testear si el back button encadenado y el breadcrumb son suficientes para orientarse.

### Escenario
> "Estás viendo el detalle de **Sara Vidal**, que está en el equipo **Equip Atletisme** del centro **Nou Barris** de **CEM Joan Miró**. Vuelve a la lista principal de organizaciones sin usar el botón Atrás del navegador."

**Ruta de regreso:** UserDetail → back → TeamDetail → back → CenterDetail → back → OrgDetail → back → OrgList (4 pasos).

### Qué observar
- ¿Usa el back button o intenta usar el sidebar?
- ¿Se pierde en algún nivel intermedio?
- ¿El breadcrumb del topbar le ayuda a saber cuántos pasos tiene que dar?
- ¿En algún punto siente que "se ha perdido" dentro de la aplicación?

---

## Cierre (5 min)

Preguntas post-test:

1. **En general, ¿cómo describirías la experiencia de navegar por la plataforma?**
2. **¿Hubo algún momento en que no sabías dónde estabas o cómo volver?**
3. **¿Encontraste alguna funcionalidad que no esperabas? ¿Cuál?**
4. **¿Faltó algo que esperabas encontrar?**
5. **Si pudieras cambiar una sola cosa de la navegación, ¿qué sería?**

---

## Guía de observación para el moderador

| Señal | Qué puede indicar |
|---|---|
| Pausa larga antes de hacer click | El elemento no comunica su función claramente |
| Hover repetido sin click | Inseguridad — el usuario no confía en que sea clickable |
| Uso del sidebar para navegar hacia atrás | El back button no es suficientemente visible o confiable |
| No descubre las tabs | Las tabs necesitan más peso visual o indicación de que hay contenido |
| No descubre el context menu (···) | El patrón de los tres puntos no es obvio sin haberlo visto antes |
| Busca un buscador global | El flujo de búsqueda por profundidad puede no ser suficiente |

---

## Métricas a capturar por tarea

| Tarea | Éxito | Tiempo | Errores | Necesitó pista |
|---|---|---|---|---|
| T1 Orientación | — | — | — | — |
| T2 Exploración org | ✓/✗ | | | |
| T3 Navegación profunda | ✓/✗ | | | |
| T4 Tabs ocultas | ✓/✗ | | | |
| T5 Filtros | ✓/✗ | | | |
| T6 Estados inactivos | ✓/✗ | | | |
| T7 Creación | ✓/✗ | | | |
| T8 Navegación atrás | ✓/✗ | | | |
