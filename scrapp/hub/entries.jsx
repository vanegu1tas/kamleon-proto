import ExplorationsApp from '../ExplorationsApp';
import FlowRunner from '../flow/FlowRunner';
import FlowRunnerV2 from '../flow/FlowRunnerV2';
import WizardRunner from '../screens/wizard/WizardRunner';
import FastTrackDaniel from '../explorations/fast-track/daniel/FlowRunner';
import FastTrackPolished from '../explorations/fast-track/daniel/pulida/FlowRunner';
import FastTrackDorsal from '../explorations/fast-track/daniel/dorsal/FlowRunner';
import FastTrackRelease from '../explorations/fast-track/daniel/release/FlowRunner';
import FastTrackFicha from '../explorations/fast-track/daniel/ficha/FlowRunner';
import LookA from '../explorations/look-and-feel/daniel/a/DirectionA';
import LookB from '../explorations/look-and-feel/daniel/b/DirectionB';
import LookC from '../explorations/look-and-feel/daniel/c/DirectionC';
import LookE from '../explorations/look-and-feel/daniel/e/DirectionE';
import VideoFlow from '../explorations/video/daniel/FlowRunner';
import VideoDallas08 from '../explorations/video/daniel/dallas-08/FlowRunner';
import VideoDallasDorsal from '../explorations/video/daniel/dallas-dorsal/FlowRunner';

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
        description: 'Cómo funciona hoy la pantalla, reconstruido de capturas de producción y de Figma. No se toca en ninguna tarea.',
        items: [
          { id: 'end-user', label: 'End user', render: () => <FlowRunner /> },
          { id: 'wizard',   label: 'Wizard (set up)', render: () => <WizardRunner /> },
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
        // Desde el 12/11: direcciones de look and feel para la scrapp neutra. Ficha: docs/scrapp/look-and-feel.md.
        // Cada dirección será un item (A, B, C) con las 6 pantallas clave; el código va en
        // explorations/look-and-feel/<persona>/ y las referencias en explorations/look-and-feel/refs/.
        id: 'look-and-feel',
        title: 'Look & feel',
        status: 'progress',
        description: 'Direcciones para la scrapp neutra: una paleta para cualquier cliente que se sienta Kamleon. Home, Elegir jugador, PIN, Score y Wizard.',
        items: [
          { id: 'a', label: 'A · Kamleon evolucionado', author: 'Daniel', render: () => <LookA /> },
          { id: 'b', label: 'B · Instrumento', author: 'Daniel', render: () => <LookB /> },
          { id: 'c', label: 'C · Calma', author: 'Daniel', render: () => <LookC /> },
          { id: 'e', label: 'E · Escenario', author: 'Daniel', render: () => <LookE /> },
        ],
      },
      {
        // 13/11: vídeo corto de la scrapp para una presentación. Combina piezas de Fast Track y de Score en un
        // flujo propio que se graba con ?bare=1. Temporal: seguramente se borra después.
        id: 'video',
        title: 'Video',
        status: 'progress',
        description: 'Vídeos de la presentación: Tracking → Score final, y dos exploraciones de Fast Track con Dallas.',
        items: [
          { id: 'tracking-score', label: 'Tracking → Score', author: 'Daniel', render: () => <VideoFlow /> },
          { id: 'dallas-08',     label: 'Dallas · Avatars cards (08)', author: 'Daniel', render: () => <VideoDallas08 /> },
          { id: 'dallas-dorsal', label: 'Dallas · Dorsal grande',        author: 'Daniel', render: () => <VideoDallasDorsal /> },
        ],
      },
      {
        id: 'fast-track',
        title: 'Fast Track',
        status: 'progress',
        description: 'Todos los jugadores en la pantalla de inicio.',
        items: [
          { id: 'qr-esquina',     label: 'QR en la esquina',   author: 'Daniel', render: () => <FastTrackDaniel qrMode="corner" /> },
          { id: 'staff-pestana',  label: 'Staff como pestaña', author: 'Daniel', render: () => <FastTrackDaniel qrMode="tab" /> },
          { id: 'flechas',        label: 'Flechas entre rangos', author: 'Daniel', render: () => <FastTrackDaniel nav="arrows" /> },
          { id: 'staff-boton',    label: 'Pestañas + Staff arriba', author: 'Daniel', render: () => <FastTrackDaniel qrMode="button" /> },
          { id: 'pulida',         label: 'Pulida: equipo + transiciones', author: 'Daniel', render: () => <FastTrackPolished /> },
          { id: 'dorsal',         label: 'Dorsal grande (7 columnas)', author: 'Daniel', render: () => <FastTrackDorsal /> },
          { id: 'release',        label: 'Avatars círculo (feedback Jordi)', author: 'Daniel', render: () => <FastTrackRelease /> },
          { id: 'ficha',          label: 'Avatars cards', author: 'Daniel', render: () => <FastTrackFicha /> },
        ],
      },
      {
        id: 'wizard',
        title: 'Wizard (set up)',
        status: 'progress',
        description: 'El flujo de instalación de la pantalla. Primero se emula el actual; luego, las mejoras.',
        items: [
          { id: 'actual', label: 'Wizard actual (referencia)', author: 'Daniel', render: () => <WizardRunner /> },
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
