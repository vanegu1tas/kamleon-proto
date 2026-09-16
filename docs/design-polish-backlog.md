# Backlog de afinado visual — pendiente para después

Lista de cosas que vemos al pasar rápido por los roles pero que dejamos anotadas para resolver en una pasada de diseño aparte, sin frenar la revisión de permisos/roles que estamos haciendo ahora. No son bugs de permisos, son detalles de UI a pulir.

## Org Admin — `OrgDetailV2`

- [x] Header de la org: los tabs (Centers/Users/Details) quedaban con padding de sobra debajo, no pegados al borde inferior de la tarjeta — corregido (tab wrap movido fuera de `.headerInner`, padding propio).
- [ ] **Tab "Users" (a nivel de organización)** — refinar diseño, hoy es una tabla genérica reusada de `OrgUsersTab`, revisar si necesita un tratamiento distinto para el contexto de Org Admin.
- [ ] **Tab "Details" (a nivel de organización)** — refinar diseño de `OrgDetailsTab` (stats grid + Contact), construido rápido como primera pasada siguiendo el patrón del centro; falta pulir.

## Center Admin — `OrgDetailV2` (vía `center-admin-detail`)

Pase rápido hecho. Encontré y corregí 3 bugs de permisos (el `role` no se estaba pasando a esta pantalla, así que Center Admin veía cosas de más):
- [x] "New Center" aparecía en el sidebar de centros — corregido, `canCreateCenter` ahora también excluye `centerAdmin` (nadie del lado cliente puede crear centros).
- [x] Botón de eliminar centro aparecía en el header del centro — corregido, `canDeleteCenter` ahora también excluye `centerAdmin` (es exclusivo de Owner/Admin).
- [x] `EditCenterDrawer` dejaba editar Name/Email/Phone/Address — corregido, Center Admin ahora tiene el mismo bloqueo que Org Admin (solo imagen editable). Sección Administrators sigue funcionando (Center Admin sí puede invitar/quitar admins de su centro).

- [x] Header de la org (tarjeta chica arriba del listado de centros): le faltaba el badge de estado "● Active" debajo del nombre — corregido siguiendo el Figma (node 9477:7775), reutilizando `.orgSubtitle`/`.statusBadge`/`.statusDot` ya existentes. De paso el org sintético que arma `center-admin-detail` no traía `status`, se agregó.
- [x] `EditCenterDrawer` decía "Editing center for Astonia FC" — esa frase solo tiene sentido para staff de Kamleon (que administra centros de organizaciones ajenas); un rol cliente (Org Admin, Center Admin) ya sabe implícitamente a qué organización pertenece. Se oculta para roles cliente, sigue visible para Owner/Admin/Editor.

Pendiente de afinar (no corregido todavía, solo anotado):
- [ ] **Tab Units (dentro de un centro)**: se ven las columnas Display/K-POD con su status — según el excel eso es exclusivo de Kamleon Editor (`units.viewColumn.display`/`sensor`), Center Admin no debería verlas. El menú "⋯" por unidad también hay que revisar (no debería tener opción de eliminar, `units.delete` es "—" para todos los roles cliente).
- [ ] Confirmar si el bug pre-existente de `<button>` anidado (menú "⋯" de las filas) también afecta la tabla de Units, no solo Teams/Users — vino en la consola al probar Users, mismo bug ya reportado en `OrgUsersTab`, pero ahora también aparece en el `UsersTab` a nivel de centro (dos componentes distintos con el mismo patrón roto).

## Fix de permisos 2026-07-27 — "New Unit" en el menú "+"
Detectado al revisar el plan del onboarding tour: el ítem "New Unit" del menú "+" (`CenterCard`) estaba visible para todos los roles sin gating. Según `docs/permissions.md` (`units.create`), es exclusivo de Kamleon Editor (y Owner/Admin por bypass) — ni Org Admin ni Center Admin lo tienen. Corregido con `canCreateUnit`. Verificado: Org Admin y Center Admin ya no lo ven, Kamleon Admin/Editor sí.

## Team Admin — `TeamDetail` (V1, único punto de entrada real en V2)

Pase rápido hecho. Mismo patrón de bug que Center Admin: el `role` tampoco se pasaba a esta pantalla.
- [x] Botón "Back" aparecía aunque Team Admin no tiene ningún listado al que volver — corregido, oculto.
- [x] Botón eliminar equipo aparecía — corregido, oculto (`teams.delete` es exclusivo de Center Admin, Team Admin no lo tiene).
- [x] `EditTeamDrawer` decía "Editing Team for [center]" — mismo criterio que "Editing center for", oculto para roles cliente (Org Admin/Center Admin/Team Admin).
- [x] Confirmado que el resto del drawer (Name, Status, Set PIN, Regenerate PIN) queda editable para Team Admin, correcto según el excel (`teams.edit`/`teams.changeStatus`/`teams.users.togglePin`/`regeneratePin` todos ✓).

Pendiente de afinar (no corregido, solo anotado):
- [ ] Menú "⋯" de la tabla Users (dentro del equipo): revisar qué acciones ofrece y conectarlas — Team Admin sí tiene `users.delete` (confirmado en `permissions.md` línea 199, ✓ para Center Admin y Team Admin), así que si en algún momento anoté lo contrario fue un error de lectura. Team Admin puede borrar usuarios de su equipo.

### Rediseño 2026-07-27 — master-detail de equipos (Figma node 9477:7789)
Reemplazamos por completo la pantalla de entrada de Team Admin: ya no es un `TeamDetail` fijo a un solo equipo (sin listado), sino un master-detail de "sus equipos asignados" (`TeamAdminHome.jsx`, nuevo), igual en espíritu al que ya tiene Center Admin con sus centros. Esto reveló que un Team Admin puede estar asignado a **más de un equipo** (antes el mock solo soportaba uno) — se agregó `getAssignedTeams()`/`teamIds` en `rolePersonas.js`, mismo patrón que `getAssignedCenters()`/`centerIds`. El viejo `TeamDetail.jsx` (V1) queda sin uso en V2 (dead code, igual que ya pasaba con `CenterDetail.jsx`) — no se borró.

- [x] Header con chip de la org (avatar+nombre+Active), igual al de Center Admin.
- [x] Master-detail: lista de equipos asignados a la izquierda (sin "+" de crear, Team Admin no tiene `teams.create`), detalle del equipo seleccionado a la derecha con un único tab "Users".
- [x] Contenedor del master-detail con esquinas rectas (le faltaba envolver en `.contentCard`, que es lo que da el borde redondeado + sombra) — corregido, ahora es igual al de Center Admin.
- [x] Botón "+" del panel derecho conectado a `NewUserDrawer`, ya invita al equipo correcto.
- [ ] **No hay forma de editar el equipo** (nombre, estado, PIN) en este nuevo diseño — el Figma no muestra un gear/settings en el panel del equipo. El `EditTeamDrawer` que ya existe y funciona (con PIN/status/nombre editables para Team Admin) quedó sin punto de entrada. Preguntar a Daniel dónde debería vivir ese acceso antes de improvisar un botón.
- [ ] **Sección de administradores de equipo**: confirmado que no va en este diseño (Daniel lo dijo explícitamente) — falta definir dónde va a vivir.
- [x] Responsive 768px — corregido (2026-07-28): agregado el mismo patrón de slide lateral que ya tenía `OrgDetailV2` (`isMobile`/`detailVisible`, clases `listPanelHidden`/`detailPanelVisible`/`mobilePanelBack` ya existían en `OrgDetailV2.module.css`, no hizo falta CSS nuevo). Verificado: lista → seleccionar equipo → desliza al detalle con botón "‹ Teams" → vuelve a la lista. Desktop 1440 sin regresión (sigue side-by-side).
- [ ] Tabla de Users reutiliza estilos de `TeamDetail.module.css` importados directo (cross-file) en vez de tener su propio CSS — funciona pero el padding del `.tableWrap` (24px) se suma al padding del contenedor (`innerTabContent`, 16px), separación un poco más generosa de lo que muestra el Figma. Revisar espaciado fino más adelante.

## Onboarding tour — 2026-07-27
Construido: `components/OnboardingTour.jsx` + `OnboardingTour.module.css` + `components/tourSteps.js` (contenido por rol). Modal de bienvenida (una pantalla, sin stepper) + spotlight sobre elementos reales marcados con `data-tour-id`. Se dispara solo la primera vez por rol (`localStorage`), y hay un "Take a tour" en el menú del avatar para repetirlo (salta directo al spotlight, sin el modal de bienvenida). Verificado en Org Admin, Center Admin y Team Admin sin errores de consola — cutout se posiciona bien, la tarjeta se auto-ajusta si no entra abajo/a la derecha del viewport.

Pendiente/backlog:
- [ ] Owner/Admin/Editor/End User no tienen tour todavía (`hasTour()` devuelve false, el botón "Take a tour" no aparece) — falta definir si les corresponde.
- [x] Verificado en 768px (tablet) para los 3 roles — funciona correctamente (ver sección "Figma handoff" abajo).
- [x] Verificado en mobile 375px para los 3 roles — sin errores de consola.

### Bug real encontrado y corregido en 768px (2026-07-28)
Al revisar el Figma del Step 2 de Team Admin, Daniel notó que el hueco del spotlight no se entendía — parecía flotar sin relación a nada. Verificando el tour real (no solo el Figma) confirmé que era un bug genuino, no solo un problema de documentación:

1. **Target no visible sin navegar antes**: en mobile/tablet, la lista y el detalle no se ven a la vez — pasos que apuntan a algo *dentro* de un centro/equipo (`center-create-menu`, `center-tabs`, `team-new-user`) fallaban porque el usuario todavía no había tocado ningún item de la lista. Fix: cada step problemático ahora tiene un `beforeShow()` en `tourSteps.js` que hace click programático en el primer item de la lista antes de medir el target.
2. **Rect de tamaño cero aceptado como válido**: en `TeamAdminHome`, el panel de detalle existe siempre en el DOM (solo se oculta con `display:none` vía CSS), así que `getBoundingClientRect()` devolvía un rect de 0×0 que el polling aceptaba en el primer intento, sin esperar a que `beforeShow` hiciera efecto. Fix: `useTargetRect` ahora exige `width > 0 && height > 0`.
3. **Rect medido a mitad de la animación de entrada**: el panel de detalle entra con un `translateX` animado (220ms) — medir durante la transición daba una posición corrida. Fix: se espera a que el rect sea idéntico en dos frames seguidos antes de aceptarlo (layout ya asentado).
4. **Rect con coordenadas imposibles (fuera de pantalla)** en un frame transitorio de la animación de Center Admin — se agregó un chequeo de límites de viewport a la validación, para descartar mediciones absurdas y seguir esperando.

Los 4 fixes viven en `components/OnboardingTour.jsx` (`useTargetRect`) y `components/tourSteps.js` (`beforeShow` por step). Reverificado con Playwright en los 3 roles a 768px y en desktop (sin regresión) — sin errores de consola.

**Ajuste final (mismo día):** el fix de "esperar 2 frames iguales" no alcanzaba — había además una animación de entrada de **pantalla completa** (`screenSlide_forward` en `StaffOrganizacionesV2.jsx`) que a veces coincidía en 2 frames seguidos durante su propio estado inicial (antes de animar), aceptando una posición corrida (visto en Team Admin Step 1, sin `beforeShow`, así que no era solo el panel de detalle). Se simplificó el enfoque: en vez de heurísticas de "cuándo se estabilizó", se espera un tiempo fijo (350ms, por encima de todas las transiciones conocidas ~220-300ms) antes de medir una sola vez. Reverificado paso a paso (Welcome → Step 1 → Step 2 → Cierre) en Team Admin 768px con capturas — todo coincide exacto.

**Decisión de UX confirmada:** el tour avanza automáticamente entre pantallas (usa `beforeShow()` para "entrar" a un equipo/centro antes de señalar algo que vive adentro) en vez de esperar a que el usuario haga la acción real — es el patrón estándar para tours de orientación (Intercom/Appcues/Pendo lo usan así; el patrón "esperar la acción real" se reserva para una única acción crítica de activación, no para un recorrido de varios pasos).

**Reverificación final, paso por paso, con el fix del timer de 350ms** — Org Admin (4 pasos), Center Admin (4 pasos), Team Admin (welcome + 3 pasos), los 3 en 768px: cada captura confirmada visualmente contra lo que corresponde, sin errores de consola en ningún caso. 768px queda cerrado para los 3 roles.

**Bug adicional encontrado por Daniel (2026-07-28): texto y posición de la tarjeta cambiaban en momentos distintos.** Al tocar "Next", el título/body se actualizaban al instante (con el contenido del paso nuevo) pero la tarjeta se quedaba en la posición del paso anterior hasta que terminaba de medir (~350ms) — se veía como que "la información cambia antes de moverse". Causa raíz: el estado interno de `useTargetRect` no sabía a qué selector correspondía el rect que tenía guardado, así que durante la transición devolvía momentáneamente el rect del paso viejo. Fix: el hook ahora valida que el rect guardado corresponda exactamente al selector actual antes de devolverlo (si no, devuelve `null`), y `OnboardingTour` solo actualiza el contenido visible de la tarjeta (`displayed`) una vez que la posición del paso nuevo ya está lista — texto y posición cambian siempre juntos. Verificado con un MutationObserver midiendo el tiempo real hasta el cambio (antes: 21ms, con contenido desincronizado; ahora: ~378ms, sincronizado) y con regresión completa en los 3 roles × 2 breakpoints (768/1440) sin errores de consola.
- [ ] El modal de bienvenida en código todavía usa el círculo genérico como placeholder de ilustración (`.welcomeArtCircle` en `OnboardingTour.module.css`) — Daniel ya diseñó el arte real en Figma (banner de color turquesa con una mini-tarjeta blanca flotando, con filas abstractas de avatar+nombre+status, a partir de una prueba armada en Figma con shapes simples el 2026-07-28) y lo ajustó ahí. **Pendiente: Daniel me pasa el diseño final de Figma y lo implemento en código** (reemplazar `.welcomeArt`/`.welcomeArtCircle` en `OnboardingTour.jsx`/`.module.css` por el ilustración real, para los 3 roles con tour).

### Figma handoff — contenido del tour pasado a Figma (archivo Web App, página "-- Onboarding Tour")
Por pedido de Daniel: no se recrea la interfaz (sidebar/toolbar) en Figma, solo (a) las tarjetas de contenido (welcome/steps/cierre) con texto real vía `textStyleId` de los text styles del design system y botones reales del componente `Button`, y (b) el overlay de spotlight (rectángulo oscuro semi-transparente con un hueco recortado vía boolean subtract) del tamaño real del viewport, con la tarjeta ya posicionada correctamente al lado del hueco (misma lógica de flip que el código: abajo si entra, si no arriba).

- **Desktop 1440×900**: Org Admin (4 steps + welcome), Center Admin (4 steps + welcome), Team Admin (3 steps + welcome) — coordenadas medidas con Playwright contra `data-tour-id`. Overlay/hueco "abstracto" (sin fondo real detrás), igual que la primera pasada de 768px — **pendiente aplicar el fix de `result.fills` explícito tras el boolean subtract** (ver nota abajo), no urgente porque sin fondo detrás el gris opaco por defecto casi no se nota, pero es una inconsistencia frente a 768/375.
- **Tablet 768×1024 y Mobile 375×812 — rehechos en formato híbrido (2026-07-28):** Daniel notó que la primera pasada (screenshot plano de fondo+overlay+tarjeta ya todo aplastado en una sola imagen) no era editable. Se reconstruyeron los 6 sets (3 roles × 2 breakpoints, 5 frames cada uno: welcome + 3-4 steps) con: **fondo** = captura real de Playwright subida una vez por estado de pantalla único y luego clonada a los frames hermanos que necesitan el mismo fondo (reasignar el `imageHash` vía script directo no renderiza — hay que clonar el nodo que ya tiene el fill funcionando); **overlay/hueco y tarjetas** = capas 100% editables (boolean subtract para el hueco del spotlight, texto real vía `textStyleId`, instancia real del componente `Button`). Bug encontrado y corregido en el proceso: `figma.subtract()` no hereda el fill de sus rectángulos operandos — el resultado queda con un gris opaco por defecto que no se veía en la pasada "abstracta" (sin nada detrás) pero tapaba completamente la imagen de fondo una vez agregada; fix: asignar `result.fills = [DIM]` explícitamente después de cada subtract. Los 6 sets verificados visualmente vía screenshot (fondo real + hueco recortado en el lugar correcto + tarjeta con contenido correcto), incluyendo los steps con `beforeShow` (Center Admin step 2/3, Team Admin step 2) que requieren mostrar el estado ya navegado (dentro de un centro/equipo).

## Notas
Este documento se completa a medida que vamos haciendo el recorrido rápido por los 7 roles para el onboarding tour del lado del cliente. Cuando termine esa pasada, volvemos acá y resolvemos todo junto.
