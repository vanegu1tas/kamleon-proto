/**
 * Journey maps de la scrapp.
 *
 * Para registrar un journey, se añade un objeto a JOURNEYS y aparece solo en el selector.
 *
 *   id        → va en la URL: #/journey/<id>
 *   name      → el nombre en el selector
 *   source    → 'example' | 'hypothesis' | 'research'. Sale como aviso encima del mapa: así nadie
 *               presenta como dato una emoción supuesta.
 *   stages    → una columna por etapa:
 *     title     la etapa
 *     text      qué pasa. [+…+] = algo que va bien (verde) · [-…-] = algo que va mal (rojo)
 *     mood      0 a 1, la altura de la línea
 *     tone      'high' | 'mid' | 'low', el color del punto y de la línea
 *     emoji, feel, quote   cómo se siente y qué diría
 *     evidence  lista de viñetas; **…** en negrita. Al final, la fuente entre paréntesis
 *     link      opcional: '#/<entrada>/<item>' abre ese flujo o exploración del microsite
 */

export const JOURNEY_ROW = {
  id: 'journey',
  title: 'Journey map',
  description: 'El recorrido de cada tipo de usuario frente a la pantalla',
};

export const SOURCE_LABEL = {
  example:    'Ejemplo de la plantilla: etapas reales, emociones y citas inventadas. Sustituir.',
  hypothesis: 'Hipótesis: las emociones y las citas son supuestas, todavía sin validar con usuarios.',
  research:   'Basado en investigación con usuarios.',
};

export const JOURNEYS = [
  {
    id: 'ejemplo',
    name: 'Ejemplo · jugador con login',
    source: 'example',
    stages: [
      {
        title: 'Home',
        text: 'Elige cómo entrar entre login, RFID, QR o invitado. [+Las cuatro opciones están a la vista+].',
        mood: 0.7, tone: 'high', emoji: '🙂', feel: 'Tranquilo',
        quote: '“Vale, le doy a login.”',
        evidence: ['El texto del invitado **no dice que no se guarda nada**. (audit julio, #9)'],
        link: '#/actual/end-user',
      },
      {
        title: 'Elige su equipo',
        text: 'Busca su equipo en una cuadrícula de círculos iguales.',
        mood: 0.5, tone: 'mid', emoji: '😐', feel: 'Buscando',
        quote: '“¿Dónde está el mío?”',
        evidence: [
          'Los círculos son **todos iguales, sin jerarquía**. (audit julio, #5)',
          '"Choose your team" tiene **poco contraste** a distancia. (audit julio, #11)',
        ],
      },
      {
        title: 'Elige su avatar',
        text: 'Busca su cara en una cuadrícula paginada. [-La paginación no funciona todavía-].',
        mood: 0.3, tone: 'low', emoji: '😕', feel: 'Perdido',
        quote: '“¿Cuál soy yo?”',
        evidence: [
          'La paginación de avatares es **solo decorativa**. (audit julio, #16)',
          'Los nombres largos **no se recortan**. (audit julio, #13)',
        ],
      },
      {
        title: 'PIN',
        text: 'Teclea 4 dígitos. [-Si se equivoca, la pantalla no avisa-].',
        mood: 0.15, tone: 'low', emoji: '😣', feel: 'Inseguro',
        quote: '“¿Lo puse bien?”',
        evidence: ['**No hay estado de error**: un PIN incorrecto también avanza. (audit julio, #7)'],
      },
      {
        title: 'Análisis',
        text: 'Orina mientras la pantalla analiza. [+La animación de espera es clara+].',
        mood: 0.55, tone: 'mid', emoji: '😌', feel: 'Esperando',
        quote: '“Bien, está midiendo.”',
        evidence: ['**Sin mensaje** si la muestra no es suficiente para analizar. (audit julio, #10)'],
      },
      {
        title: 'Score',
        text: 'Ve su puntuación de hidratación. [+El momento con más cuidado del flujo+].',
        mood: 0.9, tone: 'high', emoji: '😄', feel: 'Satisfecho',
        quote: '“¡Un 82! Mejor que ayer.”',
        evidence: ['El countdown de 15 s **no se puede saltar ni alargar**. (audit julio, #15)'],
        link: '#/score/5',
      },
    ],
  },
];

export function findJourney(id) {
  return JOURNEYS.find(j => j.id === id) ?? JOURNEYS[0];
}
