import { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react';
import Button from '../../../design-system/components/Button/Button';
import ContextMenu from '../../../design-system/components/ContextMenu/ContextMenu';
import SegmentedControl from '../../../design-system/components/SegmentedControl/SegmentedControl';
import Calendar, { presetRange, CALENDAR_PRESETS } from '../../../design-system/components/Calendar/Calendar';
import { useVersion } from './exploreVersions';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import BottomSheet from '../../../design-system/components/BottomSheet/BottomSheet';
import FilterPanel from '../../../design-system/components/FilterPanel/FilterPanel';
import TabBar from '../../../design-system/components/TabBar/TabBar';
import HydrationHistory from './HydrationHistory';
import UsersAnalytics from './UsersAnalytics';
import { IconDownload, IconChevronDown, IconSort, IconClose, IconCheckCircle, IconSearch } from '../../../design-system/icons/outline';
import { HYDRATION_STATUSES, TODAY, getStatus, getTeamHydration, formatUsg, urineStyle } from './hydrationMock';
import styles from './HydrationAnalytics.module.css';
import TableScroll from './TableScroll';

// Analytics > Hydration del Team Admin. Fuente: Figma "Explorations / Web App 3.0", nodo 329:14820.
// Para Team Admin sobran los filtros de centro y equipo del diseño: el equipo se elige en el
// título de la tarjeta (decidido con Daniel, 26/10).

const AVATAR = 32;
const AVATAR_GAP = 36;   // distancia mínima entre centros (36 px en Figma)
const SWARM_CENTER = 142; // altura de la fila central de avatares en Figma (126 + 16)
const BAND_GAP = 4;

const COLUMNS = [
  { key: 'name',         label: 'Name',         className: 'colName' },
  { key: 'score',        label: 'Score',        className: 'colScore' },
  { key: 'usg',          label: 'USG',          className: 'colUsg' },
  { key: 'electrolytes', label: 'Electrolytes', className: 'colElectrolytes' },
  { key: 'color',        label: 'Color',        className: 'colColor' },
  { key: 'volume',       label: 'Volume',       className: 'colVolume' },
  { key: 'total',        label: 'Total usage',  className: 'colTotal' },
  { key: 'last',         label: 'Last samples', className: 'colLast', sortable: false },
];


function sortValue(p, key) {
  switch (key) {
    case 'name':  return p.name.toLowerCase();
    case 'score': return p.average;
    case 'total': return p.samples.length;
    default:      return p[key] ?? null;
  }
}

function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

// Foto si la hay (First Team, 4/11), si no las iniciales
function face(p) {
  return p.photo ? <img className={styles.avatarPhoto} src={p.photo} alt="" /> : initials(p.name);
}

function IconCalendar({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2.25" y="2.75" width="11.5" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 6.5H13.5M5.5 1.5V4M10.5 1.5V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconQuestion({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.3 6.2C6.5 5.4 7.2 4.9 8 4.9C9 4.9 9.7 5.6 9.7 6.4C9.7 7.6 8 7.7 8 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.2" r="0.85" fill="currentColor" />
    </svg>
  );
}

function IconDrop({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.75C8 1.75 3.5 6.2 3.5 9.5C3.5 12 5.5 14 8 14C10.5 14 12.5 12 12.5 9.5C12.5 6.2 8 1.75 8 1.75Z" fill="currentColor" />
    </svg>
  );
}

// El score se escribe en % (decidido con Daniel, 27/10)
function useScoreFmt() {
  return score => `${score}%`;
}

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Texto del campo de fecha: "Today" o el día elegido. Este analytics no usa rangos (26/10).
function dayLabel({ preset, start }) {
  if (preset === 'today') return 'Today';
  return `${start.getDate()} ${SHORT_MONTHS[start.getMonth()]} ${start.getFullYear()}`;
}

function rangeLabel(r) {
  if (r.preset !== 'custom') return CALENDAR_PRESETS.find(p => p.key === r.preset).label;
  if (r.start.getTime() === r.end.getTime()) return dayLabel({ start: r.start }); // un solo día: como en Daily
  return `${dayLabel({ start: r.start })} – ${dayLabel({ start: r.end })}`;
}

// Móvil (6/11): la fecha va al lado del equipo y tiene que caber entera. "5–18 Oct", "28 Sep – 5 Oct";
// el año solo si no es el de hoy
function rangeLabelShort(r) {
  if (r.preset !== 'custom') return rangeLabel(r);
  const s = r.start, e = r.end;
  const year = d => d.getFullYear() !== TODAY.getFullYear() ? ` ${d.getFullYear()}` : '';
  const day = d => `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}${year(d)}`;
  if (s.getTime() === e.getTime()) return day(s);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) return `${s.getDate()}–${day(e)}`;
  return `${day(s)} – ${day(e)}`;
}

function Dot({ color }) {
  return <span className={styles.dot} style={{ background: color }} />;
}

// Menú desplegable anclado a su botón; se cierra al tocar afuera.
// Barra de equipo y fecha fija al hacer scroll (Daniel, 1/11), en Day y History, con el mismo aspecto
// que en reposo (se probó compactarla con sombra y se descartó). En móvil (≤480) se esconde al bajar
// y vuelve al subir para no comerse la pantalla. En tablet se queda fija (Daniel, 6/11: antes se
// escondía hasta 768 y se veía subir por debajo del menú negro; solo se mueve el contenido).
// Ya fija, se ve igual que en reposo y el contenido pasa por detrás, también por las esquinas (1/11).
function useStickyBar(scrollRef) {
  const sentinelRef = useRef(null);
  const [stuck, setStuck] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [down, setDown] = useState(false); // bajando (cualquier ancho): la F pliega la fila de la org (10/11)
  useEffect(() => {
    const root = scrollRef.current, sentinel = sentinelRef.current;
    if (!root || !sentinel) return;
    // La barra se para a la altura del padding de arriba (sticky top: 0 cuenta desde ahí): la marca
    // tiene que dar "fija" en ese mismo punto, no al llegar al borde (si no, durante esos 24–32px de
    // scroll se veía el blanco de la tarjeta encima de la barra; 6/11). El padding cambia con el ancho.
    let io;
    const observe = () => {
      io?.disconnect();
      io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting),
        { root, rootMargin: `-${parseFloat(getComputedStyle(root).paddingTop) + 1}px 0px 0px 0px` });
      io.observe(sentinel);
    };
    observe();
    window.addEventListener('resize', observe);
    const mq = window.matchMedia('(max-width: 480px)');
    let last = root.scrollTop, isDown = false, lockUntil = 0;
    const onScroll = () => {
      const y = root.scrollTop, dy = y - last;
      // Al plegarse/desplegarse la fila de la org la barra cambia de alto y el scroll se mueve solo: esos
      // 250ms no cuentan como "subir" o "bajar" (si no, entraba en bucle; 10/11)
      if (performance.now() < lockUntil) { last = y; return; }
      if (Math.abs(dy) < 8) return;
      setHidden(mq.matches && dy > 0 && y > 120);
      const next = dy > 0 && y > 120;
      if (next !== isDown) { isDown = next; lockUntil = performance.now() + 250; setDown(next); }
      last = y;
    };
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('resize', observe); root.removeEventListener('scroll', onScroll); };
  }, [scrollRef]);
  return { sentinelRef, stuck, hidden, down };
}

function useOutsideClose(open, setOpen) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    function onDown(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, setOpen]);
  return ref;
}

// Posición x de un score dentro de su franja. Las franjas no son proporcionales a su rango,
// así que cada una reparte su propio ancho.
function scoreToX(score, width) {
  const totalFlex = HYDRATION_STATUSES.reduce((s, b) => s + b.flex, 0);
  const usable = width - BAND_GAP * (HYDRATION_STATUSES.length - 1);
  let start = 0;
  for (const band of HYDRATION_STATUSES) {
    const w = usable * band.flex / totalFlex;
    if (score <= band.max) {
      const t = (score - band.min + 0.5) / (band.max - band.min + 1);
      return start + t * w;
    }
    start += w + BAND_GAP;
  }
  return width;
}

// Beeswarm: cada punto conserva su x (su score) y busca la y libre más cercana al centro.
// Las y candidatas salen de "apoyarse" en cada vecino ya colocado (justo tangente a él),
// así los valores cercanos se empaquetan como un panal y nunca se pisan.
function layoutSwarm(points, width) {
  const placed = [];
  const sorted = [...points].sort((a, b) => a.score - b.score);
  for (const p of sorted) {
    const x = Math.max(AVATAR / 2, Math.min(width - AVATAR / 2, scoreToX(p.score, width)));
    const near = placed.filter(q => Math.abs(q.x - x) < AVATAR_GAP);
    const candidates = [SWARM_CENTER];
    for (const q of near) {
      const dy = Math.sqrt(AVATAR_GAP ** 2 - (q.x - x) ** 2);
      candidates.push(q.y - dy, q.y + dy);
    }
    candidates.sort((a, b) => Math.abs(a - SWARM_CENTER) - Math.abs(b - SWARM_CENTER));
    const y = candidates.find(cy => near.every(q => Math.hypot(q.x - x, q.y - cy) >= AVATAR_GAP - 0.01));
    placed.push({ ...p, x, y });
  }
  return placed;
}

// El tooltip apunta con una flecha (11 × 16 en Figma) al centro del avatar
const TIP_OFFSET  = 4 + 11; // hueco hasta el avatar + largo de la flecha
const TIP_ARROW_Y = 30;     // altura de la punta dentro del tooltip

function PlayerTooltip({ player, x, y, chartWidth, onEnter, onLeave }) {
  const fmt = useScoreFmt();
  const status = getStatus(player.average);
  const flip = x + AVATAR / 2 + 200 > chartWidth;
  return (
    <div
      className={`${styles.playerTip} ${flip ? styles.playerTipLeft : ''}`}
      style={flip
        ? { right: chartWidth - x + AVATAR / 2 + TIP_OFFSET, top: y - TIP_ARROW_Y }
        : { left: x + AVATAR / 2 + TIP_OFFSET, top: y - TIP_ARROW_Y }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <p className={styles.tipName}>{player.name}</p>
      <p className={styles.tipLabel}>Average</p>
      <div className={`${styles.tipGroup} ${styles.tipGroupDivided}`}>
        <p className={styles.tipRow}><Dot color={status.color} />{fmt(player.average)}&nbsp; - &nbsp;{status.label}</p>
      </div>
      <p className={styles.tipLabel}>Last samples</p>
      <div className={styles.tipGroup}>
        {player.samples.slice(0, 5).map((s, i) => (
          <p key={i} className={styles.tipRow}><Dot color={getStatus(s.score).color} />{fmt(s.score)}&nbsp; - &nbsp;{s.label}</p>
        ))}
      </div>
      <div className={styles.tipFooter}>
        <button type="button" className={styles.tipLink}>View analytics</button>
      </div>
    </div>
  );
}

// mode 'last': cada jugador en su última muestra; las muestras sin identificar no tienen dueño y no salen.
function ScoreChart({ players, unknownSamples, mode = 'average', show = SHOW_ALL }) {
  const fmt = useScoreFmt();
  const chartRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [hovered, setHovered] = useState(null);
  const leaveTimer = useRef(null);

  useLayoutEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const points = useMemo(() => {
    if (!width) return [];
    const recorded = (show.identified ? players : []).filter(p => p.average !== null)
      .map(p => ({ kind: 'player', id: p.id, score: mode === 'last' ? p.samples[0].score : p.average, player: p }))
      .filter(p => inRange(show, p.score));
    const unknown = mode === 'last' || !show.unknown ? [] : unknownSamples.map((s, i) => ({ kind: 'unknown', id: `unk${i}`, score: s.score }))
      .filter(p => inRange(show, p.score));
    return layoutSwarm([...recorded, ...unknown], width);
  }, [players, unknownSamples, width, mode, show]);

  function enter(point) { clearTimeout(leaveTimer.current); setHovered(point); }
  function leave() { leaveTimer.current = setTimeout(() => setHovered(null), 120); }

  return (
    <div className={styles.chartWrap}>
      <div className={styles.chart} ref={chartRef}>
        {HYDRATION_STATUSES.map(band => (
          <div key={band.key} className={styles.band} style={{ flex: band.flex, '--band-color': band.color }} />
        ))}

        {points.map(p => p.kind === 'player' ? (
          <span
            key={p.id}
            className={`${styles.avatar} ${hovered?.id === p.id ? styles.avatarActive : ''}`}
            style={{ left: p.x - AVATAR / 2, top: p.y - AVATAR / 2 }}
            onMouseEnter={() => enter(p)}
            onMouseLeave={leave}
          >
            {face(p.player)}
          </span>
        ) : (
          <span
            key={p.id}
            className={styles.unknown}
            style={{ left: p.x - AVATAR / 2, top: p.y - AVATAR / 2 }}
            title={`Unknown sample: ${fmt(p.score)}`}
          >
            <IconDrop />
          </span>
        ))}

        {hovered && (
          <PlayerTooltip
            player={hovered.player}
            x={hovered.x}
            y={hovered.y}
            chartWidth={width}
            onEnter={() => clearTimeout(leaveTimer.current)}
            onLeave={leave}
          />
        )}
      </div>

      <div className={styles.legend}>
        {HYDRATION_STATUSES.map(band => (
          <div key={band.key} className={styles.legendItem} style={{ flex: band.flex }}>
            <span className={styles.legendRange}>{band.min} - {fmt(band.max)}</span>
            <span className={styles.legendLabel}>{band.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SampleDots({ samples }) {
  const fmt = useScoreFmt();
  return (
    <span className={styles.sampleDots}>
      {samples.slice(0, 5).reverse().map((s, i) => {
        const status = getStatus(s.score);
        return (
          <span key={i} className={styles.sampleDot} style={{ background: status.color }}>
            <span className={styles.sampleTip} role="tooltip">
              <Dot color={status.color} />{fmt(s.score)} - {status.label}
            </span>
          </span>
        );
      })}
    </span>
  );
}

// ─── Exploración KPIs + Needs attention (27/10) ─────────────────────────────
// Solo con ?explore=1. Sin el parámetro la pantalla queda como estaba. Decisiones y pendientes
// en docs/features/analytics-team-admin.md ("KPIs sobre el beeswarm").

const EXPLORE = new URLSearchParams(window.location.search).get('explore') === '1';
const DAY_MS = 86400000;
const ATTENTION = ['severe', 'dehydrated'];

function shiftDays(range, days) {
  return { start: new Date(range.start.getTime() + days * DAY_MS), end: new Date(range.end.getTime() + days * DAY_MS) };
}

// Valor de cada jugador según el modo de la página: su media o su última muestra
function playerScore(p, mode) {
  return mode === 'last' ? p.samples[0].score : p.average;
}

// Filtro de muestras (reunión 2/11): sin nada marcado se ven todas; Identified = las de un jugador;
// Unknown = las que no se pudieron asociar. Afecta a la gráfica y a los KPIs de muestras; la tabla y
// Needs attention son de jugadores (solo identificadas) y no cambian.
// Selector de rango de History (versiones 3/11): A el de siempre · B primero la lista · C lado a lado
const DATE_PICKER_LAYOUT = { a: 'dropdown', b: 'list', c: 'side' };

// Hydration range (12/11): segunda sección de Filters. Opción 1A: los jugadores van por la franja de lo que
// enseña cada bloque (su media, o su última muestra en Last sample); las muestras sueltas (cards, unknown),
// por la suya. Sin nada marcado en una sección, cuenta como todo.
const SHOW_ALL = { identified: true, unknown: true, ranges: null };
const showFrom = f => {
  const s = f.samples, r = f.ranges;
  return {
    identified: !s?.size || s.has('identified'),
    unknown: !s?.size || s.has('unknown'),
    ranges: r?.size ? r : null,
  };
};
const inRange = (show, score) => !show.ranges || (score !== null && show.ranges.has(getStatus(score).key));
const NO_FILTERS = { samples: new Set(), ranges: new Set() };

// KPIs de business (stickies 336:64077 y 336:64086): se calculan sobre muestras, no jugadores.
// En Average entran todas las muestras del periodo, también las sin identificar. En Last sample,
// la última de cada jugador; las sin identificar no tienen dueño y quedan fuera.
// `show` = filtro de muestras de Filters (Identified / Unknown, reunión 2/11).
function sampleStats(data, mode, show = SHOW_ALL) {
  const recorded = show.identified ? data.players.filter(p => p.average !== null) : [];
  const unknown = show.unknown ? data.unknownSamples : [];
  const scores = (mode === 'last'
    ? recorded.map(p => p.samples[0].score)
    : [...recorded.flatMap(p => p.samples.map(s => s.score)), ...unknown.map(s => s.score)]
  ).filter(sc => inRange(show, sc)); // las cards son de muestras: cada una por su franja
  return { score: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null };
}

// Dos KPIs (27/10): cómo está el equipo y si usa el sistema. Quiénes necesitan atención lo dice la sección de cromos.
// Tag de franja junto al score (Figma ".tag team score", Daniel 27/10)
const RANGE_TAG = { severe: 'Sev dehydrated', dehydrated: 'Dehydrated', hydrated: 'Hydrated', over: 'Over hydrated' };

// KPIs compactos (Daniel, 1/11): los mismos que History, la mitad de alto que los frames de Figma
// 352:90112 / 352:90124 (pendiente de pasar a Figma). Una fila: valor + tag o barra a la izquierda,
// comparación o faltantes a la derecha; sin pie con línea.
function ExploreKpis({ stats, prev, prevLabel, compliance, data, show = SHOW_ALL }) {
  const [seg, setSeg] = useState(null);
  const identified = (show.identified ? data.players.flatMap(p => p.samples.map(sm => sm.score)) : []).filter(sc => inRange(show, sc));
  const unknownCount = show.unknown ? data.unknownSamples.filter(sm => inRange(show, sm.score)).length : 0;
  const samples = {
    items: [
      ...HYDRATION_STATUSES.map(b => ({ key: b.key, color: b.color, word: b.key === 'severe' ? 'sev. dehydrated' : b.short.toLowerCase(), count: identified.filter(sc => getStatus(sc).key === b.key).length })),
      { key: 'unknown', color: 'var(--color-grey-65)', word: 'unknown', count: unknownCount },
    ],
    unknown: unknownCount,
    total: identified.length + unknownCount,
  };
  const status = stats.score !== null ? getStatus(stats.score) : null;
  return (
    <div className={`${styles.kpiRow} ${styles.kpiRow3}`}>
      <div className={`${styles.kpiCard} ${styles.kpiCompact}`}>
        <span className={`${styles.kpiLabel} ${styles.kpiLabelCaps}`}>Team hydration score</span>
        <div className={styles.kpiLine}>
          <span className={styles.kpiMain}>
            <span className={styles.kpiValue}>{stats.score ?? '—'}{stats.score !== null && '%'}</span>
            {status && <span className={`${styles.rangeTag} ${styles['rangeTag_' + status.key]} ${styles.kpiTag}`}>{RANGE_TAG[status.key]}</span>}
          </span>
          {stats.score !== null && prev.score !== null && (
            <span className={styles.kpiCompare}>
              {/* Solo el dato de ayer, sin flecha ni color (Daniel, 2/11): bajar dentro de Hydrated no es
                  estar mal, y subir puede acabar en over hydrated */}
              {prev.score}% {prevLabel}
            </span>
          )}
        </div>
      </div>

      <div className={`${styles.kpiCard} ${styles.kpiCompact}`}>
        <span className={`${styles.kpiLabel} ${styles.kpiLabelCaps}`}>Team compliance</span>
        <div className={styles.kpiLine}>
          <span className={`${styles.kpiMain} ${styles.kpiMainFill}`}>
            <span className={styles.kpiValue}>{compliance.recorded}/{compliance.total}</span>
            <span className={`${styles.progress} ${styles.kpiProgress}`}>
              <span style={{ width: `${compliance.total ? compliance.recorded / compliance.total * 100 : 0}%` }} />
            </span>
          </span>
          <span className={styles.kpiCompare}>
            {compliance.total - compliance.recorded} missing{' '}
            {/* Abre el modal de quienes no registraron muestra — diseño pendiente (Daniel) */}
            <button type="button" className={styles.kpiLink}>View</button>
          </span>
        </div>
      </div>

      {/* Sustituye a la caja de recuentos bajo la gráfica (Daniel, 1/11: no se entendía; contaba muestras
          junto a una gráfica de jugadores). El reparto va en una barra; el número exacto, al pasar el
          ratón por cada tramo, en el sitio de "unknown". */}
      <div className={`${styles.kpiCard} ${styles.kpiCompact}`}>
        <span className={`${styles.kpiLabel} ${styles.kpiLabelCaps}`}>Samples</span>
        <div className={styles.kpiLine}>
          <span className={`${styles.kpiMain} ${styles.kpiMainFill}`}>
            <span className={styles.kpiValue}>{samples.total}</span>
            <span className={styles.distBar} onMouseLeave={() => setSeg(null)}>
              {samples.items.filter(it => it.count > 0).map(it => (
                <span key={it.key} className={styles.distSeg} onMouseEnter={() => setSeg(it)}
                  style={{ flexGrow: it.count, background: it.color, opacity: seg && seg.key !== it.key ? 0.35 : 1 }} />
              ))}
            </span>
          </span>
          <span className={styles.kpiCompare}>
            {seg ? <><b className={styles.kpiStrong}>{seg.count}</b> {seg.word} ({Math.round(seg.count / samples.total * 100)}%)</>
              : <>{samples.unknown} unknown</>}
          </span>
        </div>
      </div>
    </div>
  );
}


// Exploración 1 · Briefing: los jugadores en Severely o Dehydrated, siempre visibles como cromos
// Con muchos jugadores (Daniel, 3/11): 2 filas y "Show N more" despliega el resto; "Show less" las
// vuelve a esconder. Se ve primero a los peores (orden por score).
const ATTENTION_ROWS = 2;

// Breakpoints de Day (3/11): tablet = cromos a 3 columnas; mobile = la gráfica y Needs attention
// pasan a una lista por franja (como el analytics antiguo, Web App 2.0 4874:88164). Tablet hasta 1032
// desde el 6/11 (iPad Pro 13"), igual que el CSS
const TABLET_Q = '(max-width: 1032px)';
const MOBILE_Q = '(max-width: 480px)';
function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = e => setMatch(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

// ?attention=many | open | none (solo para capturas del handoff, 3/11): el mock nunca pasa de 8
// jugadores en rojo ni se queda en 0. many = todo el equipo en rojo (sale "Show N more"); open =
// lo mismo ya desplegado; none = nadie (estado vacío).
const ATTENTION_DEMO = new URLSearchParams(window.location.search).get('attention');

function NeedsAttention({ players, mode, dayText, show = SHOW_ALL }) {
  const fmt = useScoreFmt();
  const [expanded, setExpanded] = useState(ATTENTION_DEMO === 'open');
  const ATTENTION_COLS = useMedia(TABLET_Q) ? 3 : 4; // = columnas de .cromos
  const list = players
    .filter(p => p.average !== null)
    .map(p => ({ p, score: playerScore(p, mode) }))
    .map((x, i) => ATTENTION_DEMO === 'many' || ATTENTION_DEMO === 'open' ? { ...x, score: 18 + (i * 7) % 46 } : x)
    .filter(x => ATTENTION_DEMO !== 'none' && ATTENTION.includes(getStatus(x.score).key))
    .filter(x => show.identified && inRange(show, x.score))
    .sort((a, b) => a.score - b.score);
  const filtered = !!show.ranges || !show.identified;
  return (
    <section className={`${styles.section} ${styles.sectionAttention}`}>
      <div className={styles.sectionText}>
        <h2 className={styles.sectionTitle}>Needs attention</h2>
        <p className={styles.sectionSubtitle}>
          {list.length ? `Players severely dehydrated or dehydrated ${dayText}.` : filtered ? 'No players match the filters.' : `Nobody is dehydrated ${dayText}.`}
        </p>
      </div>
      {list.length > 0 && (
        <div className={styles.cromos}>
          {(expanded ? list : list.slice(0, ATTENTION_ROWS * ATTENTION_COLS)).map(({ p, score }) => (
            <div key={p.id} className={styles.cromo}>
              {/* Anillo de 2px del color del estado, a 2 del avatar (Figma Explorations 721:40371, 10/11) */}
              <span className={styles.cromoRing} style={{ borderColor: score !== null ? getStatus(score).color : 'transparent' }}>
                <span className={styles.cromoAvatar}>{face(p)}</span>
              </span>
              <span className={styles.cromoText}>
                <span className={styles.cromoName}>{p.name}</span>
                <span className={styles.cromoScore}><Dot color={getStatus(score).color} />{fmt(score)}</span>
              </span>
            </div>
          ))}
        </div>
      )}
      {list.length > ATTENTION_ROWS * ATTENTION_COLS && (
        <div className={styles.attentionMore}>
          {/* Sin chevron: el Button del DS solo lleva icono a la izquierda */}
          <Button variant="tertiary" size="s" onClick={() => setExpanded(v => !v)}>
            {expanded ? 'Show less' : `Show ${list.length - ATTENTION_ROWS * ATTENTION_COLS} more`}
          </Button>
        </div>
      )}
    </section>
  );
}

// Mobile (3/11): una sola lista por franja sustituye a Needs attention y a la gráfica de jugadores
// (los dos primeros grupos son los de Needs attention: así no salen dos veces). Severe y Dehydrated
// arriba; Hydrated, el grupo más grande y el que menos pide, empieza plegado. Cada grupo se pliega.
function RangeList({ players, unknownSamples, mode, show }) {
  const fmt = useScoreFmt();
  const [sheet, setSheet] = useState(null); // { player } | { sample }
  const recorded = show.identified
    ? players.filter(p => p.average !== null).map(p => ({ p, score: playerScore(p, mode) })).filter(x => inRange(show, x.score))
    : [];
  // Hydrated plegada al entrar, salvo que no haya nadie fuera de rango: entonces no queda otra cosa que
  // mirar y la lista serían solo cabeceras plegadas (Daniel, 3/11)
  const [open, setOpen] = useState(() => ({
    severe: true, dehydrated: true, over: true, unknown: true,
    hydrated: !recorded.some(x => getStatus(x.score).key !== 'hydrated'),
  }));
  const groups = HYDRATION_STATUSES.map(s => ({
    key: s.key, label: s.label, color: s.color,
    rows: recorded.filter(x => getStatus(x.score).key === s.key).sort((a, b) => a.score - b.score)
      .map(({ p, score }) => ({ id: p.id, name: p.name, avatar: face(p), score, color: s.color, open: { player: p } })),
  }));
  // Las unknown solo en All samples (en Last sample no tienen jugador: lo dice la nota)
  if (mode !== 'last' && show.unknown && unknownSamples.length) {
    groups.push({
      key: 'unknown', label: 'Unknown samples', color: 'var(--color-grey-65)',
      rows: unknownSamples.filter(sm => inRange(show, sm.score)).map((sm, i) => ({ id: `u${i}`, name: 'Unknown sample', avatar: null, score: sm.score, color: getStatus(sm.score).color, open: { sample: sm } })),
    });
  }
  return (
    <div className={styles.rangeList}>
      {groups.filter(g => g.rows.length).map(g => (
        <div key={g.key} className={styles.rangeGroup}>
          {/* Cabecera como el diseño antiguo (overline + línea del color de la franja), con el número y
              plegable (Daniel, 3/11) */}
          <button type="button" className={styles.rangeGroupHead} style={{ borderBottomColor: g.color }} aria-expanded={open[g.key]}
            onClick={() => setOpen(o => ({ ...o, [g.key]: !o[g.key] }))}>
            <span className={styles.rangeGroupTitle}>{g.label} <span className={styles.rangeGroupCount}>({g.rows.length})</span></span>
            <span className={open[g.key] ? styles.chevronOpen : styles.chevronClosed}><IconChevronDown size={16} /></span>
          </button>
          {open[g.key] && (
            <div className={styles.rangeRows}>
              {g.rows.map(r => (
                // Tocar una fila abre su detalle en un bottom sheet (como el analytics antiguo, 12520:377963)
                <button key={r.id} type="button" className={styles.rangeRow} onClick={() => setSheet(r.open)}>
                  <span className={`${styles.rangeAvatar} ${r.avatar ? '' : styles.rangeAvatarUnknown}`}>{r.avatar}</span>
                  <span className={styles.rangeName}>{r.name}</span>
                  <span className={`${styles.cromoScore} ${styles.rangeScore}`}><Dot color={r.color} />{fmt(r.score)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
      <BottomSheet open={!!sheet} handle={false} onClose={() => setSheet(null)} label={sheet?.player ? sheet.player.name : 'Unknown sample'}>
        {sheet?.player && <PlayerSheet player={sheet.player} mode={mode} onClose={() => setSheet(null)} />}
        {sheet?.sample && <SampleSheet sample={sheet.sample} onClose={() => setSheet(null)} />}
      </BottomSheet>
    </div>
  );
}

// Sheets de la lista en mobile (Daniel, 3/11). Lo que tocas es lo que se abre: una persona abre
// la persona (el mismo sheet en los dos modos), una muestra abre la muestra. Un solo nivel, sin
// navegar dentro del sheet. Cabecera como el "Sample details" antiguo (Web App 2.0 12520:378207):
// sin manija, título H3 + ✕ (Icon Button 32) y línea debajo. Sin "Read the science behind it" (ya
// está el ? de la sección) ni Trend (sin definir). "View analytics" solo si hay un perfil al que ir.
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad2 = n => String(n).padStart(2, '0');
const sheetDate = d => `${pad2(d.getDate())}/${MONTHS_SHORT[d.getMonth()]}/${d.getFullYear()}`;
const sheetTime = d => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

function SheetHead({ title, onClose }) {
  return (
    <div className={styles.sheetHead}>
      <span className={styles.sheetTitle}>{title}</span>
      <IconButton aria-label="Close" onClick={onClose}><IconClose size={16} /></IconButton>
    </div>
  );
}

// Score + USG, Electrolytes, Urine color y Volume: las columnas de la tabla de desktop
function SheetMetrics({ label, score, m }) {
  const fmt = useScoreFmt();
  return (
    <div className={styles.sheetRows}>
      <div className={styles.sheetRow}>
        <span className={styles.sheetLabel}>{label}</span>
        <span className={styles.sheetPill}><Dot color={getStatus(score).color} />{fmt(score)}</span>
      </div>
      <div className={styles.sheetRow}><span className={styles.sheetLabel}>USG</span><span className={styles.sheetValue}>{formatUsg(m.usg)}</span></div>
      <div className={styles.sheetRow}><span className={styles.sheetLabel}>Electrolytes</span><span className={styles.sheetValue}>{m.electrolytes} mS/cm</span></div>
      <div className={styles.sheetRow}>
        <span className={styles.sheetLabel}>Urine color</span>
        <span className={styles.sheetUrine} style={urineStyle(m.color)}>{m.color}</span>
      </div>
      <div className={styles.sheetRow}><span className={styles.sheetLabel}>Volume</span><span className={styles.sheetValue}>{m.volume} mL</span></div>
    </div>
  );
}

// Jugador: arriba lo mismo que decía su fila (la media o la última muestra) con sus métricas, y
// debajo sus muestras del día para ver, no para tocar (en Last sample, la última marcada)
function PlayerSheet({ player, mode, onClose }) {
  const fmt = useScoreFmt();
  const last = mode === 'last';
  return (
    <div className={styles.sheetBody}>
      <SheetHead title={player.name} onClose={onClose} />
      <SheetMetrics label={last ? 'Last sample' : 'Average'} score={playerScore(player, mode)} m={last ? player.samples[0] : player} />
      <div className={styles.sheetSamples}>
        <span className={styles.sheetOverline}>Samples ({player.samples.length})</span>
        {player.samples.map((sm, i) => (
          <div key={i} className={styles.sheetSample}>
            <span>{sheetTime(sm.date)}{last && i === 0 && <span className={styles.sheetMuted}> · Last</span>}</span>
            <span className={styles.sheetSampleScore}><Dot color={getStatus(sm.score).color} />{fmt(sm.score)}</span>
          </div>
        ))}
      </div>
      <div className={styles.sheetFooter}>
        <Button variant="primary" size="m" onClick={onClose}>View analytics</Button>
      </div>
    </div>
  );
}

// Unknown: es una muestra, así que el sheet es su detalle (fecha y hora, más sus métricas)
function SampleSheet({ sample, onClose }) {
  return (
    <div className={styles.sheetBody}>
      <SheetHead title="Unknown sample" onClose={onClose} />
      <div className={styles.sheetWhen}>
        <span className={styles.sheetWhenCol}><b>Date:</b>{sheetDate(sample.date)}</span>
        <span className={styles.sheetWhenCol}><b>Time:</b>{sheetTime(sample.date)}</span>
      </div>
      <SheetMetrics label="Score" score={sample.score} m={sample} />
    </div>
  );
}

// La columna Score va siempre resaltada (es la métrica principal), ordenes por lo que ordenes.
// Kamleon staff (10/11, Figma Explorations 707:35281): la org va en una fila propia encima de la barra de la
// tarjeta (16 medium, padding 12, con buscador porque hay muchos clientes); debajo, la misma barra de Org Admin.
// Así la org se ve también en la barra fija al bajar. (Antes, junto al título: no funcionaba en los breakpoints)
export default function HydrationAnalytics({ assignedTeams, org = null, orgs = null, initialOrgId = null }) {
  if (!orgs) return <HydrationAnalyticsView assignedTeams={assignedTeams} org={org} />;
  return <StaffHydrationAnalytics orgs={orgs} initialOrgId={initialOrgId} />;
}

function StaffHydrationAnalytics({ orgs, initialOrgId }) {
  const clients = useMemo(() => orgs.filter(o => o.centers?.some(c => c.teams?.length)), [orgs]);
  const [orgId, setOrgId] = useState(() => clients.find(o => o.id === initialOrgId)?.id ?? clients[0]?.id);
  const current = clients.find(o => o.id === orgId) ?? clients[0];
  return (
    <HydrationAnalyticsView
      assignedTeams={[]}
      org={current}
      orgPicker={<OrgPicker orgs={clients} value={current} onChange={setOrgId} />}
    />
  );
}

// All samples | Last sample como desplegable compacto (10/11, versión "Sample mode" B): el valor siempre a la
// vista (Daniel: el estado tiene que verse siempre), en ~130px en vez de los ~230 del segmented
const SAMPLE_MODES = [{ label: 'All samples', value: 'average' }, { label: 'Last sample', value: 'last' }];
function SampleModeMenu({ value, onChange, alignRight = false, small = false }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, setOpen);
  const current = SAMPLE_MODES.find(m => m.value === value) ?? SAMPLE_MODES[0];
  return (
    <div className={styles.menuWrap} ref={ref}>
      <button type="button" className={`${styles.inputPill} ${styles.modePill} ${small ? styles.pillSmallChevron : ''}`} onClick={() => setOpen(v => !v)}>
        <span className={styles.inputPillText}>{current.label}</span>
        <IconChevronDown size={small ? 16 : 20} />
      </button>
      {open && (
        <div className={`${styles.menu} ${styles.groupMenu} ${alignRight ? styles.menuRight : ''}`} role="menu">
          {SAMPLE_MODES.map(m => (
            <button key={m.value} type="button" role="menuitem" className={styles.groupItem}
              onClick={() => { onChange(m.value); setOpen(false); }}>
              <span>{m.label}</span>
              {m.value === value && <span className={styles.menuCheck}><IconCheckCircle size={16} /></span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function OrgPicker({ orgs, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useOutsideClose(open, setOpen);
  const q = query.trim().toLowerCase();
  const list = q ? orgs.filter(o => o.name.toLowerCase().includes(q)) : orgs;
  function close() { setOpen(false); setQuery(''); }
  return (
    <div className={styles.menuWrap} ref={ref}>
      <button type="button" className={styles.orgPicker} onClick={() => (open ? close() : setOpen(true))}>
        <span className={styles.teamName}>{value.name}</span>
        <IconChevronDown size={20} />
      </button>
      {open && (
        <div className={`${styles.menu} ${styles.groupMenu} ${styles.orgMenu}`} role="menu" onKeyDown={e => e.key === 'Escape' && close()}>
          {/* El buscador de los desplegables de la webapp (Assign teams en EditUnitDrawer), no el SearchBar */}
          <div className={styles.menuSearch}>
            <IconSearch size={16} />
            <input className={styles.menuSearchInput} placeholder="Search organization" value={query} onChange={e => setQuery(e.target.value)} autoFocus />
          </div>
          <div className={styles.orgList}>
            {list.length === 0 && <span className={styles.orgEmpty}>No organizations found</span>}
            {list.map(o => (
              <button key={o.id} type="button" role="menuitem" className={styles.groupItem}
                onClick={() => { onChange(o.id); close(); }}>
                <span className={styles.inputPillText}>{o.name}</span>
                {o.id === value.id && <span className={styles.menuCheck}><IconCheckCircle size={16} /></span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HydrationAnalyticsView({ assignedTeams, org = null, orgPicker = null }) {
  // Org Admin (10/11): el título es la org y el equipo se elige con dos selectores (Center y Team) en la barra.
  // Prueba de ancho: ¿caben en desktop y tablet? ?orgname=... cambia el nombre de la org para probar uno largo
  // Selector de equipo, un componente para todos los roles (10/11, versión "Team scope"):
  // a = Org Admin: org como título + Center y Team en la barra (Team Admin: el selector de siempre);
  // b = un solo selector "Equipo  Centro ▾" con la lista agrupada por centro;
  // c = como b, pero el centro va debajo del equipo (Daniel, 10/11; sustituye a "centro encima, dos selectores");
  // e2 = "Equipo · Centro ▾" en una caja de una línea con el aspecto del campo de fecha (36px, hug); la barra se queda sin título
  // F (10/11, Figma Explorations 713:37605, solución con la compañera): en desktop, una fila: la org de título a la
  // izquierda y a la derecha, a 8, [Equipo (Centro) ▾] [fecha 160] [All samples ▾] [Filters]. Solo está
  // diseñada para desktop y tablet (720:40334: org arriba y la fila de controles a todo el ancho, el equipo
  // ocupa lo que sobra, a 12) y móvil (713:38906: igual, con fecha en hug, filtro solo icono y All samples
  // como desplegable a todo el ancho en su fila, en vez del segmented)
  const scopeRaw = useVersion('teamScope');
  // Tablet (≤1032, Figma 720:40334) y móvil (≤480, Figma 713:38906) tienen su diseño
  const scopeV = scopeRaw;
  const sampleV = useVersion('sampleMode'); // a = segmented; b = desplegable compacto junto a Filters
  const groups = useMemo(() => {
    if (org) return (org.centers ?? []).filter(c => c.teams?.length).map(c => ({ center: c, teams: c.teams }));
    const byCenter = new Map();
    for (const { team, center } of assignedTeams) {
      if (!byCenter.has(center.id)) byCenter.set(center.id, { center, teams: [] });
      byCenter.get(center.id).teams.push(team);
    }
    return [...byCenter.values()];
  }, [org, assignedTeams]);
  const orgCenters = groups.map(g => g.center);
  const [centerId, setCenterId] = useState(groups[0]?.center.id);
  const center = orgCenters.find(c => c.id === centerId) ?? orgCenters[0];
  const centerTeams = groups.find(g => g.center.id === center?.id)?.teams ?? [];
  // Team Admin sigue con su selector de siempre, sin centro (Daniel, 10/11): el problema de espacio es solo de Org Admin
  // Org Admin, Center Admin y staff: centro y lista agrupada solo si sus equipos están en más de un centro (10/11)
  // Staff (orgPicker) siempre con centro: salta entre clientes y la barra cambiaba de forma con los de un solo
  // centro (Arsenal, 10/11). Org Admin y Center Admin no cambian de lista, ahí sí vale la regla
  const grouped = !!org && (groups.length > 1 || !!orgPicker) && (scopeV === 'b' || scopeV === 'c' || scopeV === 'e2' || scopeV === 'f');
  const teams = grouped ? groups.flatMap(g => g.teams)
    : org ? centerTeams
    : assignedTeams.map(a => a.team);
  const [teamId, setTeamId]   = useState(teams[0]?.id);
  const teamCenter = groups.find(g => g.teams.some(t => t.id === teamId))?.center ?? center;
  // Staff: al cambiar de cliente, primer centro y primer equipo (sin remontar: se conservan tab y fechas)
  const orgKey = org?.id;
  const firstOrg = useRef(orgKey);
  useEffect(() => {
    if (firstOrg.current === orgKey) return;
    firstOrg.current = orgKey;
    setCenterId(groups[0]?.center.id);
    setTeamId(groups[0]?.teams[0]?.id);
  }, [orgKey, groups]);
  const [centerMenu, setCenterMenu] = useState(false);
  const [orgTeamMenu, setOrgTeamMenu] = useState(false);
  const [range, setRange]    = useState(() => presetRange('today', TODAY));
  const [teamMenu, setTeamMenu]   = useState(false);
  const [rangeMenu, setRangeMenu] = useState(false);
  const [sortCol, setSortCol] = useState('score');
  const [sortDir, setSortDir] = useState('asc');
  const datePickerVersion = useVersion('datePicker');
  const [sampleFilter, setSampleFilter] = useState(NO_FILTERS);
  const show = useMemo(() => showFrom(sampleFilter), [sampleFilter]);
  const [mode, setMode] = useState('average'); // exploración: All samples | Last sample
  const [view, setView] = useState(() => new URLSearchParams(window.location.search).get('view') ?? 'day');       // exploración: Day | Team History | Users Analytics
  // ?range=lastQuarter (un preset) o ?range=2026-09-15:2026-10-04 (Custom range): el rango de entrada de
  // Team History, solo para capturar los flujos a Figma (6/11). Sin el parámetro, Last 30 days.
  const [histRange, setHistRange] = useState(() => {
    const raw = new URLSearchParams(window.location.search).get('range');
    const m = raw && /^(\d{4})-(\d{2})-(\d{2}):(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
    if (m) return { preset: 'custom', start: new Date(+m[1], m[2] - 1, +m[3]), end: new Date(+m[4], m[5] - 1, +m[6]) };
    return presetRange(CALENDAR_PRESETS.some(p => p.key === raw) ? raw : 'lastMonth', TODAY);
  });
  const [userSlot, setUserSlot] = useState(null);
  // Jugador elegido en la tabla de Team History: abre Users Analytics con él y el mismo periodo (12/11)
  const [openPlayer, setOpenPlayer] = useState(null);
  const users = EXPLORE && view === 'users';                   // Users Analytics (reunión 2/11): mismo rango que History
  const history = EXPLORE && (view === 'history' || users);
  // Móvil (6/11), Team History y Daily: equipo y fecha en una fila y la barra fija siempre (no se esconde
  // al bajar: está para cambiar de equipo o de fecha desde cualquier punto). La fecha queda en el mismo
  // sitio en los dos tabs; en Daily el filtro (solo icono) va entre el equipo y la fecha, y All samples |
  // Last sample sale de la barra a una fila propia. Users Analytics (11/11, opción C): la misma fila; al bajar,
  // el jugador ocupa el sitio del equipo (el equipo se cambia arriba del todo)
  const rowBar = EXPLORE && (view === 'history' || view === 'day' || view === 'users');
  const scrollRef = useRef(null);
  const mobile = useMedia(MOBILE_Q) && EXPLORE;
  // Tablet (10/11): el segmented All | Last también sale de la barra a su fila, como en móvil
  const tablet = useMedia('(min-width: 481px) and (max-width: 1032px)') && EXPLORE;
  const sticky = useStickyBar(scrollRef);
  const teamRef  = useOutsideClose(teamMenu, setTeamMenu);
  const rangeRef = useOutsideClose(rangeMenu, setRangeMenu);
  const centerRef  = useOutsideClose(centerMenu, setCenterMenu);
  const orgTeamRef = useOutsideClose(orgTeamMenu, setOrgTeamMenu);

  const team  = teams.find(t => t.id === teamId) ?? teams[0];
  const data  = useMemo(() => team ? getTeamHydration(team, range) : null, [team, range]);
  const prevData = useMemo(() => team && EXPLORE ? getTeamHydration(team, shiftDays(range, -1)) : null, [team, range]);

  const rows = useMemo(() => {
    if (!data) return [];
    const dir = sortDir === 'asc' ? 1 : -1;
    // Hydration range (12/11): por la franja de la media, que es lo que enseña la tabla. Identified / Unknown
    // no la toca (es de jugadores)
    const list = show.ranges ? data.players.filter(p => inRange(show, p.average)) : data.players;
    return [...list].sort((a, b) => {
      const va = sortValue(a, sortCol);
      const vb = sortValue(b, sortCol);
      // Sin muestras en el rango: siempre al final, ordenes como ordenes
      if (va === null && vb === null) return 0;
      if (va === null) return 1;
      if (vb === null) return -1;
      return va < vb ? -dir : va > vb ? dir : 0;
    });
  }, [data, sortCol, sortDir, show]);

  function handleSort(col) {
    if (sortCol !== col) { setSortCol(col); setSortDir('asc'); }
    else setSortDir(d => d === 'asc' ? 'desc' : 'asc');
  }

  if (!team) return null;
  // Sample mode B fuera de móvil: Filters + All samples ▾ al final de la barra (Daniel, 10/11)
  const fBar = scopeV === 'f';
  const fTeamTitle = fBar && grouped && !!org?.hideName && !orgPicker; // Org/Center Admin: el equipo de título (11/11)
  // F en tablet y móvil (10/11): con la barra fija, al bajar la fila de la org se pliega hacia arriba y queda
  // solo equipo + fecha + filtro; vuelve al subir un poco. En desktop la org va en la misma fila: no se toca
  const groupedTeamMenu = (teamMenu && (
                <div className={`${styles.menu} ${styles.groupMenu}`} role="menu">
                  {groups.map(g => (
                    <div key={g.center.id} className={styles.group}>
                      <span className={styles.groupLabel}>{g.center.name}</span>
                      {g.teams.map(t => (
                        <button key={t.id} type="button" role="menuitem" className={styles.groupItem}
                          onClick={() => { setTeamId(t.id); setCenterId(g.center.id); setTeamMenu(false); }}>
                          <span>{t.name}</span>
                          {t.id === team.id && <span className={styles.menuCheck}><IconCheckCircle size={16} /></span>}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              ));
  const modeAtEnd = EXPLORE && !history && !mobile && sampleV === 'b' && !fBar;
  // Staff en tablet, Daily con F (Daniel, 11/11, opción A): org + equipo + fecha + All samples + Filters no caben a 768;
  // All samples sale a su fila debajo (como en móvil) y Filters se queda solo con el icono. Una fila de 69
  const staffTabletRow = EXPLORE && fBar && !!orgPicker && tablet && !history;
  const filterPanel = (
    <FilterPanel
        sections={[
          { key: 'samples', label: 'Samples', options: [{ value: 'identified', label: 'Identified' }, { value: 'unknown', label: 'Unknown' }] },
          { key: 'ranges', label: 'Hydration range', options: HYDRATION_STATUSES.map(b => ({ value: b.key, label: b.label })) },
        ]}
        values={sampleFilter}
        onChange={(key, value) => setSampleFilter(f => {
          const next = new Set(f[key]);
          next.has(value) ? next.delete(value) : next.add(value);
          return { ...f, [key]: next };
        })}
        onClear={() => setSampleFilter(NO_FILTERS)}
      />
  );
  const teamStatus = data.teamScore !== null ? getStatus(data.teamScore) : null;
  const isToday = range.preset === 'today';

  return (
    <div ref={scrollRef} className={styles.container}>

      <div className={styles.heading}>
        <h1 className={styles.pageTitle}>Hydration analytics</h1>
        {/* Mobile: solo el icono, en la fila del título (diseño antiguo; Daniel, 3/11): 56×48, icono de 24 */}
        {mobile
          ? <span className={styles.downloadIcon}><Button variant="primary" size="s" aria-label="Download data" leftIcon={<IconDownload size={24} />} /></span>
          : <Button variant="primary" size="s" leftIcon={<IconDownload size={16} />}>Download data</Button>}
      </div>

      {EXPLORE && (
        <div className={styles.pageTabs}>
          {/* Figma Explorations 369:101657 (Daniel, 1/11): el TabBar del DS tal cual, sin tocarlo; el
              contenedor de 320px hace que reparta 160 por tab */}
          <TabBar
            tabs={[{ id: 'day', label: 'Daily' }, { id: 'history', label: 'Team History' }, { id: 'users', label: 'Users Analytics' }]}
            activeTab={view}
            onChange={setView}
          />
        </div>
      )}

      <div className={`${styles.card} ${EXPLORE ? styles.cardExplore : ''}`}>

        {/* Marca sin tamaño (absoluta: no suma gap a la tarjeta) para saber cuándo la barra ya está fija */}
        <div ref={sticky.sentinelRef} aria-hidden="true" style={{ position: 'absolute', width: 1, height: 1 }} />
        <div className={`${styles.cardHeader} ${styles.cardHeaderSticky} ${sticky.stuck ? styles.cardHeaderStuck : ''} ${sticky.hidden && !teamMenu && !rangeMenu && !centerMenu && !orgTeamMenu && !rowBar ? styles.cardHeaderHidden : ''} ${rowBar ? styles.cardHeaderRow : ''} ${grouped && scopeV === 'c' ? styles.cardHeaderTwoLine : ''} ${orgPicker && scopeV === 'c' ? styles.cardHeaderWithOrg : ''} ${orgPicker && scopeV === 'e2' && grouped ? styles.cardHeaderOrgInline : ''} ${staffTabletRow ? styles.filterIconOnly : ''} ${fBar && grouped && mobile && !users /* Users Analytics: la org se va con el avatar (CSS) */ && sticky.stuck && sticky.down && !teamMenu && !rangeMenu ? styles.orgFolded : ''}`}>
          {/* Degradado blanco bajo la barra fija: el contenido se desvanece al pasar por debajo (Daniel, 1/11) */}
          {sticky.stuck && <span aria-hidden="true" className={styles.stuckFade} />}
          {/* Staff: la fila de la org solo en la versión C (Daniel, 10/11); A usa la org de título como selector;
              B y E2, sin resolver todavía */}
          {orgPicker && scopeV === 'c' && <div className={styles.orgRow}>{orgPicker}</div>}
          <div className={EXPLORE ? `${styles.scope} ${grouped && scopeV === 'e2' ? styles.scopeE2 : ''} ${fBar ? styles.scopeF : ''}` : styles.scopeFlat}>
          {org && scopeV === 'a' ? (
            orgPicker ?? (org.hideName ? null : 
            <div className={styles.menuWrap}>
              <span className={styles.teamPicker}><span className={styles.teamName}>{new URLSearchParams(window.location.search).get('orgname') ?? org.name}</span></span>
            </div>
            )
          ) : grouped && fBar ? (
            fTeamTitle ? (
            /* Org Admin y Center Admin con F (Daniel, 11/11, opción B): sin org, el equipo es el título a la
               izquierda como en Team Admin, con el centro en gris al lado; la lista, agrupada por centro */
            <div className={styles.menuWrap} ref={teamRef}>
              <button type="button" className={styles.teamPicker} onClick={() => setTeamMenu(v => !v)}>
                <span className={styles.teamName}>{team.name}</span>
                <span className={styles.centerHint}>{teamCenter?.name}</span>
                <IconChevronDown size={20} />
              </button>
              {groupedTeamMenu}
            </div>
            ) :
            <div className={styles.orgTitle}>
              {orgPicker ?? <span className={styles.teamPicker}><span className={styles.teamName}>{org.name}</span></span>}
            </div>
          ) : grouped ? (
            <>
            {/* E2 para staff (10/11): la org al inicio, como en las primeras versiones; centro y equipo ya van juntos */}
            {orgPicker && scopeV === 'e2' && <div className={styles.orgInline}>{orgPicker}</div>}
            <div className={styles.menuWrap} ref={teamRef}>
              <button type="button" className={scopeV === 'e2' ? `${styles.inputPill} ${styles.scopePill}` : `${styles.teamPicker} ${scopeV === 'c' ? styles.teamPickerBelow : ''}`} onClick={() => setTeamMenu(v => !v)} disabled={teams.length < 2 /* un solo equipo: sin flecha ni menú (Daniel, 10/11) */}>
                {scopeV === 'e2' ? (
                  <span className={styles.inputPillText}>
                    <span className={styles.scopePillTeam}>{team.name}</span>
                    <span className={styles.scopePillCenter}> · {teamCenter?.name}</span>
                  </span>
                ) : scopeV === 'c' ? (
                  <span className={styles.teamLines}>
                    <span className={styles.teamName}>{team.name}</span>
                    <span className={styles.centerBelow}>{teamCenter?.name}</span>
                  </span>
                ) : <>
                  <span className={styles.teamName}>{team.name}</span>
                  <span className={styles.centerHint}>{teamCenter?.name}</span>
                </>}
                {teams.length > 1 && <IconChevronDown size={20} />}
              </button>
              {groupedTeamMenu}
            </div>
            </>
          ) : (
          <div className={styles.menuWrap} ref={teamRef}>
            <button type="button" className={styles.teamPicker} onClick={() => setTeamMenu(v => !v)} disabled={teams.length < 2}>
              <span className={styles.teamName}>{team.name}</span>
              {teams.length > 1 && <IconChevronDown size={20} />}
            </button>
            {teamMenu && (
              <div className={styles.menu}>
                <ContextMenu
                  onClose={() => setTeamMenu(false)}
                  items={teams.map(t => ({ label: t.name, onClick: () => { setTeamId(t.id); setTeamMenu(false); } }))}
                />
              </div>
            )}
          </div>
          )}
          {/* Users Analytics: al bajar, el jugador entra aquí, al lado del equipo (Daniel, 4/11) */}
          {users && <span ref={setUserSlot} className={styles.userSlot} />}

          <div className={`${styles.toolbar} ${fBar ? styles.toolbarF : ''}`}>
            {grouped && fBar && !fTeamTitle && (
              <div className={`${styles.menuWrap} ${styles.fTeamWrap}`} ref={teamRef}>
                <button type="button" className={`${styles.inputPill} ${styles.fTeamPill}`} onClick={() => setTeamMenu(v => !v)} disabled={teams.length < 2}>
                  <span className={styles.inputPillText}>
                    <span>{team.name} </span>
                    <span className={styles.scopePillCenter}>({teamCenter?.name})</span>
                  </span>
                  {teams.length > 1 && <IconChevronDown size={16} />}
                </button>
                {groupedTeamMenu}
              </div>
            )}
            {org && scopeV === 'a' && (
              <>
                <div className={styles.menuWrap} ref={centerRef}>
                  <button type="button" className={styles.inputPill} onClick={() => setCenterMenu(v => !v)}>
                    <span className={styles.inputPillText}>{center?.name ?? 'Center'}</span>
                    <IconChevronDown size={20} />
                  </button>
                  {centerMenu && (
                    <div className={styles.menu}>
                      <ContextMenu
                        onClose={() => setCenterMenu(false)}
                        items={orgCenters.map(c => ({ label: c.name, onClick: () => { setCenterId(c.id); setTeamId(c.teams[0]?.id); setCenterMenu(false); } }))}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.menuWrap} ref={orgTeamRef}>
                  <button type="button" className={styles.inputPill} onClick={() => setOrgTeamMenu(v => !v)}>
                    <span className={styles.inputPillText}>{team?.name ?? 'Team'}</span>
                    <IconChevronDown size={20} />
                  </button>
                  {orgTeamMenu && (
                    <div className={styles.menu}>
                      <ContextMenu
                        onClose={() => setOrgTeamMenu(false)}
                        items={teams.map(t => ({ label: t.name, onClick: () => { setTeamId(t.id); setOrgTeamMenu(false); } }))}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
            <div className={styles.menuWrap} ref={rangeRef}>
              <button type="button" className={`${styles.inputPill} ${fBar ? styles.fDatePill : ''}`} onClick={() => setRangeMenu(v => !v)}>
                <span className={styles.inputPillText}>{history ? (mobile ? rangeLabelShort(histRange) : rangeLabel(histRange)) : dayLabel(range)}</span>
                <IconCalendar />
              </button>
              {rangeMenu && (
                <div className={`${styles.menu} ${styles.menuRight}`}>
                  {history ? (
                    <Calendar
                      layout={DATE_PICKER_LAYOUT[datePickerVersion]}
                      value={histRange}
                      today={TODAY}
                      onApply={r => { setHistRange(r); setRangeMenu(false); }}
                      onCancel={() => setRangeMenu(false)}
                    />
                  ) : (
                    <Calendar
                      mode="single"
                      value={range}
                      today={TODAY}
                      onApply={r => { setRange(r); setRangeMenu(false); }}
                      onCancel={() => setRangeMenu(false)}
                    />
                  )}
                </div>
              )}
            </div>
            {/* Team History vuelve a tener Filters (12/11, pedido de business): Samples y Hydration range, como Daily.
                Users Analytics sigue sin él (un jugador; las unknown no tienen dueño) */}
            {/* Sample mode B (desktop y tablet): Filters y el desplegable se van al final, donde estaba el segmented (10/11) */}
            {fBar && !history && !mobile && !staffTabletRow && <SampleModeMenu value={mode} onChange={setMode} small />}
            {(!history || (view === 'history' && EXPLORE)) && !modeAtEnd && filterPanel}
          </div>
          </div>
          {modeAtEnd && (
            <div className={styles.toolbar}>
              {filterPanel}
              <SampleModeMenu value={mode} onChange={setMode} alignRight /* al final de la barra: si no, se sale por la derecha */ />
            </div>
          )}
          {EXPLORE && !history && !mobile && !tablet && sampleV === 'a' && !fBar && (
            <SegmentedControl
              size="s"
              value={mode}
              onChange={setMode}
              options={[{ label: 'All samples', value: 'average' }, { label: 'Last sample', value: 'last' }]} /* 'All samples' antes 'Average' (Daniel, 3/11) */
            />
          )}
        </div>
        {/* Móvil: el modo de la tabla no es alcance (equipo, fecha) y no acompaña al bajar (6/11) */}
        {EXPLORE && !history && (mobile || (tablet && sampleV === 'a' && !fBar) || staffTabletRow) && (
          <div className={styles.modeRow}>
            {sampleV === 'b' || fBar ? <SampleModeMenu value={mode} onChange={setMode} small={fBar} /> : (
            <SegmentedControl
              size="s"
              value={mode}
              onChange={setMode}
              options={[{ label: 'All samples', value: 'average' }, { label: 'Last sample', value: 'last' }]} /* 'All samples' antes 'Average' (Daniel, 3/11) */
            />
            )}
          </div>
        )}

        {users ? (
          <UsersAnalytics team={team} range={histRange} stickySlot={userSlot} initialPlayer={openPlayer} />
        ) : history ? (
          <HydrationHistory team={team} range={histRange} show={show} onOpenPlayer={id => { setOpenPlayer(id); setView('users'); scrollRef.current?.scrollTo(0, 0); }} />
        ) : <>
        {EXPLORE ? (
          <>
            <ExploreKpis
              stats={sampleStats(data, mode, show)}
              prev={sampleStats(prevData, mode, show)}
              show={show}
              prevLabel={isToday ? 'yesterday' : 'previous day'}
              compliance={data.compliance}
              data={data}
            />
            {/* key: al cambiar de equipo o de día la lista vuelve plegada (Daniel, 3/11) */}
            {!mobile && <NeedsAttention key={`${teamId}-${range.start.getTime()}`} players={data.players} mode={mode} show={show} dayText={isToday ? 'today' : `on ${dayLabel(range)}`} />}
          </>
        ) : (
        <div className={styles.kpis}>
          <div className={styles.kpi}>
            <span className={styles.kpiValue}>
              {teamStatus && <Dot color={teamStatus.color} />}
              {data.teamScore !== null ? `${data.teamScore}%` : '—'}
            </span>
            <span className={styles.kpiLabel}>Team hydration score</span>
          </div>
          <div className={styles.kpi}>
            <span className={styles.kpiValue}>{data.unknownSamples.length}</span>
            <span className={styles.kpiLabel}>Unknown samples</span>
          </div>
          <div className={styles.kpi}>
            <span className={styles.kpiValue}>{data.compliance.recorded}/{data.compliance.total}</span>
            <span className={styles.kpiLabel}>
              Team compliance
              {/* Abre el modal de quienes no registraron muestra — diseño pendiente (Daniel) */}
              <button type="button" className={styles.kpiLink}>View</button>
            </span>
          </div>
        </div>
        )}

        <section className={`${styles.section} ${styles.sectionChart}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionText}>
              <h2 className={styles.sectionTitle}>{mobile ? 'Players by range' : EXPLORE ? 'Players by score' : 'Team hydration score'}</h2>
              <p className={styles.sectionSubtitle}>
                {!EXPLORE ? 'Users grouped by average hydration score.'
                  : mode === 'last' ? 'Players placed by their last sample.' : 'Players placed by their average score.'}
              </p>
            </div>
            {/* Mobile: solo el icono, junto al título para no partirlo (Daniel, 3/11) */}
            {mobile
              ? <IconButton aria-label="How the score works"><IconQuestion size={20} /></IconButton>
              : <Button variant="secondary" size="s" leftIcon={<IconQuestion />}>How the score works</Button>}
          </div>
          {mobile
            ? <RangeList key={`${teamId}-${range.start.getTime()}-${mode}`} players={data.players} unknownSamples={data.unknownSamples} mode={mode} show={show} />
            : <ScoreChart players={data.players} unknownSamples={data.unknownSamples} mode={EXPLORE ? mode : 'average'} show={show} />}
          {/* En Last sample las unknown quedan fuera (no tienen jugador, no se sabe si son la última de
              alguien): se dice cuántas para no esconderlas (Daniel, 2/11; pregunta a business 13) */}
          {EXPLORE && mode === 'last' && show.unknown && data.unknownSamples.length > 0 && (
            <p className={styles.chartNote}>
              {/* Le habla al admin: qué hacer, no por qué no salen (Daniel, 3/11) */}
              {data.unknownSamples.length} unknown {data.unknownSamples.length === 1 ? 'sample' : 'samples'}. Remind your team to identify themselves.
            </p>
          )}
        </section>

        {/* Mobile sin tabla (Daniel, 3/11): la lista + el sheet ya dan el dato por jugador, y "View
            analytics" lleva a su perfil en Users Analytics */}
        {!mobile && (
        <section className={`${styles.section} ${styles.sectionTable}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionText}>
              <h2 className={styles.sectionTitle}>Score &amp; metrics by user</h2>
              <p className={styles.sectionSubtitle}>Each user's average hydration score, plus the metrics behind it.</p>
            </div>
            <Button variant="secondary" size="s" leftIcon={<IconQuestion />}>How it works</Button>
          </div>

          <TableScroll>
            <table className={styles.table}>
              <thead>
                <tr>
                  {COLUMNS.map(col => (
                    <th key={col.key} className={`${styles[col.className]} ${col.key === 'score' ? styles.highlight : ''}`}>
                      {col.sortable === false ? col.label : (
                        <button type="button" className={styles.sortBtn} onClick={() => handleSort(col.key)}>
                          {col.label}
                          <IconSort
                            size={16}
                            upColor={sortCol === col.key && sortDir === 'desc' ? 'var(--color-text-disabled)' : undefined}
                            downColor={sortCol === col.key && sortDir === 'asc' ? 'var(--color-text-disabled)' : undefined}
                          />
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr><td colSpan={COLUMNS.length} className={styles.empty}>No players match the filters.</td></tr>
                )}
                {rows.map(p => {
                  const has = p.average !== null;
                  const cell = key => `${styles[COLUMNS.find(c => c.key === key).className]} ${key === 'score' ? styles.highlight : ''}`;
                  return (
                    <tr key={p.id}>
                      <td className={cell('name')}>
                        <span className={styles.userCell}>
                          <span className={styles.rowAvatar}>{face(p)}</span>
                          <span className={styles.userText}>
                            <span className={styles.userName}>{p.name}</span>
                            <span className={styles.userTeam}>{team.name}</span>
                          </span>
                        </span>
                      </td>
                      <td className={cell('score')}>
                        {has
                          ? <span className={styles.scoreTag}><Dot color={getStatus(p.average).color} />{p.average}%</span>
                          : <span className={styles.empty}>—</span>}
                      </td>
                      <td className={cell('usg')}>{has ? formatUsg(p.usg) : <span className={styles.empty}>—</span>}</td>
                      <td className={cell('electrolytes')}>{has ? `${p.electrolytes} mS/cm` : <span className={styles.empty}>—</span>}</td>
                      <td className={cell('color')}>
                        {has
                          ? <span className={styles.urine} style={urineStyle(p.color)}>{p.color}</span>
                          : <span className={styles.empty}>—</span>}
                      </td>
                      <td className={cell('volume')}>{has ? `${p.volume} mL` : <span className={styles.empty}>—</span>}</td>
                      <td className={cell('total')}>{p.samples.length}</td>
                      <td className={cell('last')}>
                        {has ? <SampleDots samples={p.samples} /> : <span className={styles.empty}>No samples</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableScroll>
        </section>
        )}
        </>}

      </div>
    </div>
  );
}
