import { useSyncExternalStore } from 'react';
import SegmentedControl from '../../../design-system/components/SegmentedControl/SegmentedControl';
import styles from './exploreVersions.module.css';

// Selector de versiones para enseñar las exploraciones en vivo (reunión 2/11). Solo con explore=1,
// dentro del menú del avatar del topbar (Daniel, 2/11: el usuario ya está en el sidebar, ese avatar
// queda libre y no tapa el contenido).
// La elección va en la URL (&v=metrics:b,...) para poder mandar un link o capturar esa versión a
// Figma. Es una herramienta del proto, no del DS. Cada exploración nueva se añade aquí; la primera
// opción es la versión actual. En el menú se llaman A / B (Daniel, 2/11); qué es cada una, en el
// comentario de su fila y en la ficha.
export const VERSIONS = [
  // All samples | Last sample (10/11): a = segmented a la derecha; b = desplegable compacto junto a Filters (~130px).
  // Fuera de Filters a propósito: el estado tiene que verse siempre (Daniel). El toggle se descartó (responsive)
  { key: 'sampleMode', label: 'Sample mode', options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] },
  // Selector de equipo para todos los roles (10/11): a = Org Admin con la org de título y Center + Team en la
  // barra (Team Admin, como siempre); b = un selector "Equipo  Centro ▾" agrupado por centro; c = como b, con el centro debajo del equipo;
  // e2 = "Equipo · Centro ▾" en una caja de una línea de 36px, como la fecha (10/11). Solo Org Admin: Team Admin, sin centro;
  // f = solución con la compañera (Figma 713:37605): org de título + [Equipo (Centro)] [fecha] [modo] [Filters] a la derecha. Solo desktop; en tablet/móvil = E2
  { key: 'teamScope', label: 'Team scope', options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }, { label: 'C', value: 'c' }, { label: 'E2', value: 'e2' }, { label: 'F', value: 'f' }] },
  // Users Analytics, rankings (4/11): a = un bloque a todo el ancho con selector y título (la principal);
  // b = Days hydrated y Engagement a la vez, en dos cards lado a lado, sin título (como una fila de KPIs)
  // Users Analytics, filas del ranking (5/11): a = lista de tres filas iguales con el jugador en gris;
  // b = el jugador más grande y por encima, los vecinos desvaneciéndose hacia fuera (menos alto);
  // c = solo el jugador y su puesto en una fila (lo más bajo). Decidida C (11/11)
  // Users Analytics, "View full ranking" (5/11): a = despliega la lista en su sitio; b = la abre en un modal
  // Users Analytics, media del equipo en las gráficas del jugador (4/11): a = turquesa de la marca
  // (Turquoise/40, la elegida); b = azul (Blue/50); c = naranja (orange-65)
  // Users Analytics, apagar la media del equipo (5/11, pedido de business): a = el botón de cada gráfica
  // apaga el Optimal range (como Team History); b = apaga la media del equipo (Optimal range siempre visible)
];

// Exploraciones ya decididas (Daniel, 3/11): salen del menú y se quedan fijas en la versión elegida.
// El código de la otra versión sigue ahí hasta limpiarlo.
//   gaps: b = los días sin samples se unen con línea punteada (a = la línea se corta)
//   dates: b = número del día arriba y el mes abajo con una línea, la compañera (a = "6 Oct")
//   datePicker: b = primero la lista, el calendario solo en Custom range (a = desplegable dentro del
//     calendario · c = lista y calendario lado a lado)
//   metrics: b = Sample metrics separada, una gráfica por métrica (a = juntas con selector)
//   samplesCard (Users Analytics, 4/11): b = la card Samples sin media del equipo, con el reparto por
//     franjas en texto (a = "Team average")
//   rankingForm (Users Analytics, 4/11): a = lista (b = barras verticales de todo el equipo; Daniel:
//     "entiendo mejor así un ranking")
//   samplesLegend (Users Analytics, 5/11): b = cada franja con su color y su número (a = el reparto en texto)
//   touchTablet (6/11): b = en tablet táctil, el card flotante de desktop que sigue al dedo (a = el dato
//     en una franja fija encima de la gráfica, la de móvil). En móvil siempre la franja.
//   mobileAxis (6/11): b = en móvil (≤480) números encima de cada línea de la rejilla, a la izquierda;
//     rejilla desde el borde, datos desde 32; padding 16 (a = como desktop · c = números fuera, margen 36)
const DECIDED = { rankFocus: 'c' /* 11/11: solo el jugador y su puesto */, rankingCards: 'b' /* 10/11: Days hydrated y Engagement en dos cards lado a lado */, rankMore: 'b' /* 10/11: el ranking completo en un modal */, teamLine: 'a' /* 10/11: turquesa, Turquoise/40 */, teamToggle: 'b' /* 10/11: el botón de cada gráfica apaga la media del equipo */, mobileAxis: 'b', gaps: 'b', dates: 'b', datePicker: 'b', metrics: 'b', samplesCard: 'b', rankingForm: 'a', samplesLegend: 'b', touchTablet: 'b' };

function read() {
  const raw = new URLSearchParams(window.location.search).get('v') || '';
  return Object.fromEntries(raw.split(',').filter(Boolean).map(p => p.split(':')));
}

let current = read();
const listeners = new Set();

function setVersion(key, value) {
  current = { ...current, [key]: value };
  const params = new URLSearchParams(window.location.search);
  params.set('v', Object.entries(current).map(([k, v]) => `${k}:${v}`).join(','));
  window.history.replaceState(null, '', `${window.location.pathname}?${params.toString().replace(/%3A/g, ':').replace(/%2C/g, ',')}`);
  listeners.forEach(l => l());
}

const subscribe = l => { listeners.add(l); return () => listeners.delete(l); };

export function useVersion(key) {
  const decided = DECIDED[key];
  const def = decided ?? VERSIONS.find(v => v.key === key).options[0].value;
  return useSyncExternalStore(subscribe, () => decided ?? current[key] ?? def);
}

function Row({ version }) {
  const value = useVersion(version.key);
  return (
    <div className={styles.row}>
      <span className={styles.label}>{version.label}</span>
      <SegmentedControl size="xs" value={value} onChange={v => setVersion(version.key, v)} options={version.options} />
    </div>
  );
}

export default function VersionsMenu() {
  return (
    <div className={styles.list}>
      {VERSIONS.map(v => <Row key={v.key} version={v} />)}
    </div>
  );
}
