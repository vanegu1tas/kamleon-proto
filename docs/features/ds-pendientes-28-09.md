# Pendientes del Design System — para el 28/9

Salidos de construir los flujos del Team Admin el 27/9. Ordenados por lo que desbloquea a lo
demás, no por tamaño.

---

## 0 · REHACER LOS FLUJOS CONSTRUYENDO, NO CALCANDO  · lo primero después del punto 1

Decisión de Daniel al cerrar el 27/9. Lo de hoy **no vale como método**: se clonó una pantalla
existente y se fue corrigiendo hasta que se pareciera al código, **sin juzgar si lo que había
estaba bien**. El resultado se ve correcto y no está conectado a nada.

**La medida del problema, en la página de pruebas:**

```
Textos con estilo aplicado      29
Textos sin estilo              521      ← el 95%
Valores de color/radio crudos  833      (unos 30 eran míos, ya corregidos)
```

Y una prueba de que calcar arrastra errores: el atajo **`⌘K` está a 10px**, un tamaño que no
existe en la escala del sistema (12·14·16·20·24·32). Venía en la pantalla clonada y se copió sin
mirarlo.

**El método que quiere Daniel:**

1. Partir de lo que renderiza el **código** —esa es la referencia de contenido y comportamiento—
   pero **construir la pantalla con los componentes**, no duplicar una existente.
2. Aplicar **estilos de texto** de verdad (`Headings/*`, `Body/*`, `Label/*`), no valores sueltos
   que coincidan de casualidad.
3. Enlazar colores y radios a **variables**, nunca a números o hex.
4. Cuando lo que hay en código esté mal (un tamaño fuera de escala, un color crudo), **decirlo y
   decidir**, no replicarlo.
5. **Solo cuando haya pantallas clave bien construidas** tiene sentido duplicarlas para hacer
   variantes de un flujo. Duplicar antes de eso propaga la deuda.

Aplica a las 6 pantallas ya montadas (B1–B4, A4–A5) y a todos los flujos que vengan.

**Depende de**: el componente `Table Cell` (punto del trabajo largo) para las filas, que es donde
está el grueso de los 521 textos sueltos.

## 1 · Poner nombre a los colores que se usan sin él  · ~30 min

Tres colores se pintan a pelo en los dos lados. Sin nombre, nadie puede usarlos bien.

| Color | Dónde se usa hoy | Falta |
|---|---|---|
| `#1a7f79` (`--color-turquoise-30`) | 8 sitios: flechas de ordenación activas, check del dropdown de equipos, y el texto de los botones `Subtle` en las tarjetas de permisos | nombre semántico en los dos lados |
| `rgba(0,0,0,0.25)` | el velo de todos los modales (`DeleteOrgModal.module.css`) y los velos que monté en Figma | nombre semántico en los dos lados |
| `#22aaa2` (`Turquoise/40`) | existe en la paleta de Figma | **no existe en código** |

Es requisito del punto 2: sin nombre para el turquesa no se puede definir el tono.

## 2 · El eje `Tone` del botón `Subtle`  · decisión + ~1 h

En los diseños el `Subtle` aparece con tres colores de texto. El caso real está en la tarjeta de
permisos del drawer *Edit user*: **"Set new PIN"** en turquesa oscuro y **"Remove from team"** en
crítico, uno al lado del otro.

En código existen dos de los tres (`subtle`, `subtleDanger`).

**Decisión pendiente**: añadir `subtleBrand` junto a `subtleDanger` multiplica nombres por cada
tono. Lo natural es un eje aparte —`Tone = Default | Brand | Critic`— igual que `Size` y `State`:
el tono no cambia el tipo de botón, solo lo que comunica. Cambia la estructura del component set,
así que se decide antes de tocar Figma.

## 3 · Los tres botones a mano del modal  · ~1 h

`DeleteOrgModal.module.css` lo comparten 4 pantallas y tiene tres botones dibujados a mano. Los
tres tienen hoy su variante en el sistema:

```
.cancelBtn    transparente, hover gris      →  Button tertiary
.deleteBtn    rojo, pinta --color-red-48    →  Button danger   (color de la paleta cruda)
.confirmBtn   negro, pinta --color-text-strong →  Button primary (token de TEXTO como fondo)
```

Mismas medidas que `Button M` en los tres. **No cambia el aspecto**, quita el último sitio del
código donde se pinta al margen del sistema.

## 4 · La tercera pata de `ds:compare`  · ~1 h

Hoy el comando cubre **DS ↔ código**. No cubre **DS → Web App 2.0**: si publicas y se te olvida
actualizar, las pantallas siguen con la versión vieja y nadie avisa. Pasó dos veces el 27/9.

Un check que recorra las instancias de las páginas de flujos y diga qué variante usa cada una y
si su componente maestro está al día.

## 5 · El avatar del Sidebar  · ~20 min

En Figma el componente `.User menu` lleva una **foto**; en código es un círculo con degradado
`linear-gradient(45deg, #00c9a7, #60a5fa)` y las **iniciales** encima. Las iniciales no existen
como nodo en el componente, así que hay que añadirlas en el DS.

---

## Trabajo largo (no es sincronización, es construcción)

- **Las filas de tabla con el componente `Table Cell`.** Ahí está el 80% de los ~800 valores
  crudos de la página de pruebas. Arregla también la pantalla original, no solo la copia.
  Regla ya acordada: el contrato es la celda; el andamio (filas en Figma, columnas en código)
  puede diferir.
- **Flujos que faltan**: 3 del Team Admin (ajustes de un jugador completo, añadir personas,
  editar el equipo —este bloqueado por su punto de entrada sin decidir—) y los 5 del Center Admin.
- **Documentación de Figma**: `-- Elevation` está vacía y la escala existe desde el 26/9;
  0 de 21 componentes tienen descripción (12 ya redactadas en `docs/design-system-descriptions.md`);
  `-- Avatar` y `-- Topbar` vacías, decidir si sobran.

---

## Recordatorio de método

Cada vez que se toque el DS: **publicar en el Design System** y **Update en Web App 2.0**. Son dos
pasos en archivos distintos. Y al comprobar algo, recorrer todos los casos y mirar el valor que se
pinta, no el campo que debería controlarlo (ver `design-system-rules.md`).
