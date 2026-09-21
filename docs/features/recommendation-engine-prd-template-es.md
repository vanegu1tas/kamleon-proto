# Product Requirements Document

| | |
|---|---|
| **Producto** | Recommendation Engine — Fase 0 (prototipo interactivo) |
| **Versión** | v0.1 |
| **Autor** | Daniel Vanegas |
| **Fecha** | 18 de septiembre de 2026 |
| **Estado** | Borrador |

---

## 1. Overview

### Planteamiento del problema

Hoy el jugador usa una unidad de Kamleon, recibe un score de hidratación y el flujo termina ahí. El score le dice cómo está, pero no **qué hacer al respecto**.

### Visión de producto

Convertir el score de hidratación en una acción inmediata y personalizada: cuánto tomar y qué tomar, en la misma pantalla, en los segundos que el jugador ya está ahí parado. Para esto vamos a desarrollar un prototipo interactivo en el navegador, compartible mediante enlace, para que el CEO valide el piloto con el personal de rendimiento y nutrición de los Dallas Cowboys.

### Referencia: el motor de Gatorade

Gatorade ya tiene uno, hecho con Smart Design y dos años de pruebas con atletas.

Link: https://smartdesignworldwide.com/projects/gatorade-hydration-system-2/

### Métricas de éxito

La fase 0 es un prototipo de validación. **Propuesta para discutir en la reunión:** esto es lo que tendría que pasar para considerarla validada.

- **Comprensión:** 
  El jugador puede decir cuánto tiene que tomar dentro de los 5 segundos de aparecer la pantalla, sin explicación previa.
  
- **Recuerdo:** 
  El jugador puede nombrar el producto recomendado después de que la pantalla desaparece.


---

## 2. Usuarios

### Usuarios principales

**El jugador:** De pie frente a la pantalla de la unidad. Pocos segundos de atención, manos ocupadas y posiblemente alguien esperando detrás.

**Staff:** Son quienes validan en la fase 0 que la recomendación es clínicamente correcta.

### Objetivos del usuario

- **Jugador:** Saber cuánto tomar y qué tomar, sin hacer cuentas ni leer un párrafo.
- Confiar en que la recomendación es para él específicamente, no un mensaje genérico.

### Puntos de dolor

- El score deja al jugador con un número y ninguna acción que hacer con él.
- Un consejo genérico ignora el peso, el estado de hidratación y el clima de ese día.

---

## 3. Funcionalidades y requerimientos

### Imprescindible 

- **Recomendación de cuánto tomar** — personalizada para cada jugador: depende de su estado de hidratación, su peso y el clima del día. La pantalla lo comunica de forma que se entienda sin hacer cálculos; cómo se representa (número, envase, proporción) se define en la exploración de diseño. **(Por definir: en qué unidad se muestra — pregunta 1)**

- **Recomendación de producto** — catálogo Gatorade listo para tomar, según estado de hidratación.
  
- **A/B Testing:** **(Por definir: si se prueban las dos — pregunta 4)**
  Diseños para estructura secuencial: score y después recomendación.
  Diseño simultáneo: las dos en una pantalla.
  
- **Prototipo** — Corre en el navegador y se comparte por link para que pueda ser probado de manera fácil. 
  
  Si se quiere testear en una pantalla debemos tener en cuenta el tiempo de implementación.

---

## 4. Historias de usuario

- Como **jugador**, quiero ver cuánto tomar justo después de mi score, para saber qué hacer sin preguntarle a nadie.
- Como **jugador**, quiero ver la cantidad comparada con una botella que reconozco, para no tener que hacer cálculos.
- Como **jugador**, quiero que me digan qué producto de Gatorade corresponde a mi estado, para elegir el correcto.
- Como **miembro del staff**, quiero que mis jugadores estén siempre bien hidratados.
- Como **miembro del staff**, quiero que la recomendación use el peso del jugador y las condiciones del día, para poder confiar en ella como si fuera mi propio consejo.

---

## 5. Fuera de alcance

Lo siguiente **no** entra en esta versión:

- **Recomendación de timing** "¿cuándo tomar?" No entra porque para esto necesitaríamos la info de entreno o pre-entreno.
- **Pantallas de configuración del motor en la webapp.**
- **API de clima conectada:** el clima se simula con la lógica real.
- **Productos fuera del catálogo Gatorade** listo para tomar.
- **Lógica de backend e integraciones:** la fase 0 valida la interfaz primero, a propósito.
- **Botellas de producto en 3D:** evaluado y diferido a una prueba aparte después de la demo.

---

## 6. Cronograma


Trabajo de diseño e implementación, sobre el flujo de pantallas que ya existe.

| #   | Tarea                                                                                                                                   | Días                                         |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| 1   | Actualizar la pantalla de score en el prototipo (base para todo lo demás)                                                               | 2 – 3                                        |
| 2   | Exploraciones de la propuesta **secuencial**                                                                                            | 4 – 5                                        |
| 3   | Presentación a business (ellos la llevan al cliente) y correcciones) (iterativo)                                                        | 2-3 (por iteración)                          |
| 4   | Exploraciones de la propuesta **simultánea** <br>Presentación a business (ellos la llevan al cliente) y correcciones) (iterativo)       | 4 – 5<br>2 - 3 (por iteración)               |
| 5   | Implementar los diseños en el prototipo                                                                                                 | 4 – 5                                        |
| 6   | Presentación a business (ellos la llevan al cliente) y correcciones) (iterativo)<br><br>Afinar motion<br><br>QA - Por parte de business | 2 -3 (Por iteración)<br><br>2-3<br><br>(TBD) |
| 7   | Colchón para pulir el prototipo                                                                                                         | 2 – 3 (depende de feedback)                  |
|     | **Total**                                                                                                                               | **10,5 – 16,5 días**                         |


**Dependencias:**
- La tarea 1 bloquea todo lo demás: sin el score actualizado no hay base sobre la que construir.

---

## 7. Preguntas abiertas

**Bloquean la construcción**

1. **Unidades:** ¿onzas, mililitros o "botellas"? Propuesta: onzas como principal debido a que van a ser usuarios norte americanos y mililitros en la web para el staff. Las botellas son la opción más concreta para un jugador, pero solo funcionan si tienen un único tamaño de envase.
   
2. **API de clima** — ¿ya existe, y con qué precisión (estadio o ciudad)? ¿Debemos mostrar la info del clima o nombrarla o eso es un dato interno que usamos para la recomendación?
   

**Sobre la prueba A/B**

3. **Con quién se prueba** — ¿staff en una sala o jugadores en la instalación? Lo segundo da una respuesta mucho mejor y necesita la pantalla física, coordinación y permisos.
4. **Propuestas** — ¿Vamos a testear las dos? Es decir quieren que haga 2 propuestas de prototipo

**Sobre el producto, no sobre el prototipo**

5. **Stock** — ¿la bebida recomendada va a estar disponible cuando el jugador salga? Si no, la recomendación genera frustración.
6. **Configuración** — ¿quién activa y desactiva el recommendation engine? ¿Puede el staff editar el catálogo o los factores?

---

