# Pendientes — 1 de octubre

Tres frentes abiertos. Solo el primero tiene fecha externa.

---

## 1 · Repo aparte para la scrapp  · lo primero

La compañera de Daniel va a **diseñar**, pero quiere probar directamente en el prototipo.
Git no esconde carpetas: quien clona el repo lo clona entero, con todo el historial. Así que
si no debe ver el prototipo web, hay que separar de verdad.

**Sale barato porque la scrapp casi no depende del DS**, medido el 1/10:

```
Del design system usa    4 archivos de tokens (CSS de variables) + el logo
NO usa                   ni un solo componente — ni Button, ni Tag, ni ninguno
Tamaño                   1,1 MB · 67 archivos
Tipografía               escala propia (16→120px), no la del web
```

No se duplica ningún componente, así que no hay dos versiones de nada que pueda divergir.

```
scrapp-dallas/
  scrapp/           tal cual está hoy
  tokens/           los 4 CSS + LogoKamleon, copiados
  package.json      vite + react
  README.md         cómo arrancarlo
```

**El único riesgo**: si se tocan los tokens aquí, ese repo no se entera. Dos salidas — copiar los
4 CSS cuando pase (un minuto), o extender `ds:compare` para que vigile también ese repo (una hora).

## 2 · Scrapp · Recommendation Engine (Dallas Cowboys)

El único con reloj: business lo presenta al cliente.

```
🔴 Actualizar la pantalla de Score al último Figma   ← Daniel pasa el link
                                                       bloquea cerrar la estimación
🟡 Las dos versiones: simultáneo y secuencial         sin decidir, se prueban ambas
🟡 La tercera configuración: solo score (motor off)   para el A/B
🟡 El envase que se llena, animado
🟡 El guion de la prueba A/B
```

Estimación: **5,75 – 9 días**. Construido: portada, score y recomendación (`ca031d7`).

## 3 · Poner el prototipo al día con Figma  · meta: lunes

**Método acordado**: pantalla por pantalla, no un barrido general. Daniel pasa un frame, Claude
devuelve una **tabla de diferencias** (Figma / proto / quién manda) y Daniel decide línea por
línea. Nada se interpreta por cuenta propia — el error de la semana pasada fue copiar de Figma un
botón "Filters" que el código no tenía a propósito.

Leer textos y medidas es barato; las capturas son lo caro. La tabla va en texto y Daniel mira el
Figma al lado.

Orden sugerido: **Org Admin** (el rol más nuevo) → **Configure API** → Center Admin → Team Admin.
Si una pantalla de Figma está obsoleta, decirlo antes y saltarla.

## 4 · Configure API — textos listos, pendiente de hablar con el programador

```
✓ Textos escritos para Configuration, Test API y External IDs
→ "Max tokens per month" debería ser "Max API calls per month"
  (token significa dos cosas en la misma pantalla: el contador y la clave)
→ ¿El botón de IDs genera códigos nuevos o importa los del sistema del cliente?
  Si ellos ya los tienen, el botón no puede generarlos — tendría que traerlos
→ "Proffesional" lleva una F de más
→ "1 External ID missing" informa de un problema sin dar la salida
```

**Pendiente de confirmar con el programador**: si al llegar al límite se pausa el acceso hasta el
mes siguiente (es lo único que los textos prometen y se dio por supuesto), y si el Org Admin ve
el límite o es solo de Owner/Admin.

## 5 · Web app · donde se quedó

```
Tabla de usuarios agrupada por persona    hecha, falta que Daniel la pruebe
  └ el menú "⋯" no distingue nivel         se puede quitar a alguien de 3 equipos
                                           creyendo que se quita de 1
Los dos frames de Figma de esa tabla      desactualizados respecto al código
Flujos del Team Admin                     parqueados por decisión de Daniel
```

## 6 · Esperando material de Daniel (de antes)

```
Figma de "My data" · "Hydration" · "Set new PIN"
Campos mínimos del formulario de crear unit
Dónde va el acceso a "Editar equipo"
```
