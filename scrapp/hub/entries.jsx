import ExplorationsApp from '../ExplorationsApp';
import FlowRunner from '../flow/FlowRunner';
import FlowRunnerV2 from '../flow/FlowRunnerV2';
import FastTrackDaniel from '../explorations/fast-track/daniel/FlowRunner';

/**
 * Índice del microsite de la scrapp.
 *
 * Cada entrada es una sección del índice. Sus `items` son lo que se puede abrir dentro
 * (un flujo, una exploración). Para añadir una exploración nueva a una tarea, se añade un
 * item aquí con su `author`, y aparece sola en el índice y en el menú del visor.
 *
 * El código de cada exploración vive en explorations/<tarea>/<persona>/ (p. ej.
 * explorations/fast-track/daniel/), así dos personas pueden explorar la misma tarea sin pisarse.
 *
 * Una entrada con `href` abre otra página (la demo del Recommendation Engine tiene la suya,
 * porque se comparte con business por su propio link).
 *
 * Estados: 'reference' | 'progress' | 'exploration' | 'future'
 */

export const STATUS_LABEL = {
  reference:   'Referencia',
  progress:    'En curso',
  exploration: 'Exploración',
  future:      'Futuro',
};

export const SECTIONS = [
  {
    id: 'production',
    title: 'Producción',
    description: 'Cómo es la pantalla hoy y cómo va quedando con lo aprobado',
    entries: [
      {
        id: 'actual',
        title: 'Flujo actual',
        status: 'reference',
        description: 'Cómo funciona hoy la pantalla, reconstruido de capturas de producción. No se toca en ninguna tarea.',
        items: [
          { id: 'end-user', label: 'End user', render: () => <FlowRunner /> },
        ],
      },
      {
        id: 'nueva',
        title: 'Scrapp nueva',
        status: 'progress',
        description: 'El flujo actual más lo que ya se ha aprobado en cada tarea. Hoy es igual al actual: todavía no hay nada aprobado.',
        items: [
          { id: 'end-user', label: 'End user', render: () => <FlowRunner /> },
        ],
      },
    ],
  },
  {
    id: 'tasks',
    title: 'Tareas',
    description: 'Exploraciones de cada tarea, de una o varias personas',
    entries: [
      {
        id: 'fast-track',
        title: 'Fast Track',
        status: 'progress',
        description: 'Todos los jugadores en la pantalla de inicio.',
        items: [
          { id: 'qr-esquina',     label: 'QR en la esquina',   author: 'Daniel', render: () => <FastTrackDaniel qrMode="corner" /> },
          { id: 'staff-pestana',  label: 'Staff como pestaña', author: 'Daniel', render: () => <FastTrackDaniel qrMode="tab" /> },
          { id: 'flechas',        label: 'Flechas entre rangos', author: 'Daniel', render: () => <FastTrackDaniel nav="arrows" /> },
        ],
      },
      {
        id: 'recommendation',
        title: 'Recommendation Engine',
        status: 'future',
        description: 'Piloto Dallas Cowboys. Bocetos rápidos: portada, score y recomendación.',
        href: 'recommendation.html?from=tasks',
      },
      {
        id: 'audit',
        title: 'Audit UX del flujo (julio)',
        status: 'exploration',
        description: 'Copia del flujo actual para probar los 19 hallazgos del audit. Hoy solo cambia la pantalla de inicio. Detalle en docs/features/scrapp-end-user-audit.md.',
        items: [
          { id: 'v2', label: 'Flujo con cambios', author: 'Daniel', render: () => <FlowRunnerV2 /> },
        ],
      },
      {
        id: 'score',
        title: 'Score',
        status: 'exploration',
        description: 'Exploraciones de la pantalla de score. La 5 es la que usa el flujo.',
        items: [1, 2, 4, 5].map(n => ({
          id: String(n),
          label: `Exploration ${n}`,
          author: 'Daniel',
          render: () => <ExplorationsApp exploration={n} />,
        })),
      },
    ],
  },
];

export function findSection(sectionId) {
  return SECTIONS.find(s => s.id === sectionId) ?? null;
}

export function findEntry(entryId) {
  for (const section of SECTIONS) {
    const entry = section.entries.find(e => e.id === entryId);
    if (entry) return { section, entry };
  }
  return null;
}
