import { useState, useMemo, useRef, useLayoutEffect, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import SegmentedControl from '../../../design-system/components/SegmentedControl/SegmentedControl';
import ToolbarButton from '../../../design-system/components/ToolbarButton/ToolbarButton';
import { IconEye, IconEyeClosed, IconInfoCircle, IconClose, IconSort } from '../../../design-system/icons/outline';
import { HYDRATION_STATUSES, getStatus, getTeamHydration, formatUsg, URINE_COLORS, urineStyle } from './hydrationMock';
import TableScroll from './TableScroll';
import base from './HydrationAnalytics.module.css';
import styles from './HydrationHistory.module.css';
import { useVersion } from './exploreVersions';

// History (exploración 28/10, solo con explore=1). Las gráficas siguen el estilo de las de jugador
// de la compañera (Figma 402:35332 · 402:35479 · 402:35626) llevadas al equipo: cada punto es un
// día (o semana / mes) del equipo, no una muestra. Las 4 comparten el mismo eje del tiempo, real
// (los días sin muestras quedan como hueco) y un hover sincronizado.

const DAY_MS = 86400000;
const RANGE_TAG = { severe: 'Sev dehydrated', dehydrated: 'Dehydrated', hydrated: 'Hydrated', over: 'Over hydrated' };
// Días por calendario, no por milisegundos: el 25/10/2026 (cambio de hora) dura 25 h y sumar
// 24 h por día lo duplicaba en el eje (Daniel, 1/11).
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const IDENTIFIED = 'var(--color-grey-25)';
const UNIDENTIFIED = 'var(--color-grey-65)'; // el mismo gris que las gotas de Day

// USG: el eje va invertido (más bajo = mejor arriba), como en la gráfica de la compañera.
// USG: Optimal range 1.003–1.016 (dato confirmado, Daniel 6/11; el 990–1010 de antes era provisional, sin
// base). Los valores van ×1000 (1.003 = 1003) y se escriben como business, "1.010", en el eje y en el
// hover (Daniel, 6/11). Electrolytes: Normotonic 5–25 mS/cm (dato de Daniel, 2/11).
const usgText = formatUsg;
const METRICS = {
  usg:          { label: 'USG', unit: '', domain: [990, 1040], invert: true, optimal: [1003, 1016], fmt: usgText, axis: usgText },
  electrolytes: { label: 'Electrolytes', unit: ' mS/cm', domain: [0, 30], optimal: [5, 25], tickStep: 5, fmt: v => v.toFixed(1) },
};

const fmtDay = d => `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;
const mean = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
function quantile(xs, q) {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const i = (s.length - 1) * q;
  return s[Math.floor(i)] + (s[Math.ceil(i)] - s[Math.floor(i)]) * (i - Math.floor(i));
}
function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const next = () => (s = s * 16807 % 2147483647) / 2147483647;
  // Con semillas pequeñas los primeros valores salen casi iguales (y bajos): se descartan, como en el mock
  for (let i = 0; i < 8; i++) next();
  return next;
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Un día del equipo a partir del mock de Day. ~1 de cada 5 días no hay entrenamiento: sin muestras.
// El mock de Day da días casi iguales; para que la gráfica se parezca a una temporada se suma una
// tendencia del equipo (semanas mejores y peores) y algún día malo suelto (partido con calor).
function teamDay(team, day) {
  const dayIdx = Math.round(day / DAY_MS);
  const rand = seeded(team.id * 977 + dayIdx * 13);
  if (rand() < 0.2) return null;
  const badDay = rand() < 0.08;
  const shift = 9 * Math.sin(dayIdx / 9 + team.id) + 5 * Math.sin(dayIdx / 31) + (rand() - 0.5) * 8 - (badDay ? 18 : 0);
  const data = getTeamHydration(team, { start: day, end: day });
  const withData = data.players.filter(p => p.average !== null);
  const engagement = 0.5 + 0.5 * clamp(0.6 + dayIdx % 120 / 300 + (rand() - 0.5) * 0.3, 0, 1); // el registro mejora con el tiempo
  const day0 = {
    scores: withData.flatMap(p => p.samples.map(s => clamp(Math.round(s.score + shift), 5, 99))),
    playerAvgs: withData.map(p => clamp(p.average + shift, 5, 99)),
    unknown: Math.round(data.unknownSamples.length * (2.2 - engagement * 2) + rand() * 3),
    usg: withData.map(p => p.usg - shift * 0.9 + (rand() - 0.5) * 3),
    electrolytes: withData.map(p => clamp(p.electrolytes + shift * 0.3 + (rand() - 0.5) * 4, 1, 29)),
    volume: withData.map(p => clamp(p.volume + shift * 6 + (rand() - 0.5) * 60, 80, 600)),
    color: withData.map(p => clamp(Math.round(p.color - shift / 7), 1, 8)),
    // Users Analytics (4/11): lo de cada jugador ese día, con la misma tendencia del equipo, para sus gráficas
    roster: data.players.length,
    byPlayer: Object.fromEntries(withData.map(p => [p.id, {
      scores: p.samples.map(s => clamp(Math.round(s.score + shift), 5, 99)),
      usg: p.usg - shift * 0.9,
      electrolytes: clamp(p.electrolytes + shift * 0.3, 1, 29),
      volume: clamp(p.volume + shift * 6, 80, 600),
      color: clamp(Math.round(p.color - shift / 7), 1, 8),
    }])),
  };
  // Filtros en Team History (12/11): cada muestra suelta, también las unknown, con score y métricas, para
  // poder filtrar por Identified / Unknown y por franja como en Daily. Las unknown con otra semilla (lo de
  // arriba no cambia) y un score parecido al del equipo ese día.
  const ids = withData.flatMap(p => {
    const x = day0.byPlayer[p.id];
    return x.scores.map(score => ({ player: p.id, score, usg: x.usg, electrolytes: x.electrolytes, volume: x.volume, color: x.color }));
  });
  const ur = seeded(team.id * 389 + dayIdx * 29);
  const unknowns = Array.from({ length: day0.unknown }, () => {
    const ref = ids.length ? ids[Math.floor(ur() * ids.length)].score : 45 + ur() * 40;
    const score = clamp(Math.round(ref + (ur() - 0.5) * 24), 5, 99);
    return {
      player: null, score,
      usg: 1035 - score * 0.3 + ur() * 4,
      electrolytes: clamp(4 + ur() * 20, 1, 29),
      volume: clamp(150 + ur() * 300, 80, 600),
      color: clamp(Math.round(8 - score / 13 + ur()), 1, 8),
    };
  });
  day0.samples = [...ids, ...unknowns];
  return day0;
}

// Por día hasta un mes; por semana hasta un año (Last 12 months = 52 puntos: 12 meses escondían las
// semanas malas); por mes solo en rangos custom de más de un año (Daniel, 30/10).
// Y por ancho (Daniel, 3/11), la misma regla en todas las gráficas: si por semanas cada periodo
// tendría menos de 10px (barras de menos de 6px), se agrupa por mes. En móvil, Last 12 months va
// por meses; en desktop y tablet sigue por semanas. Por día no cambia: hasta 30 días siempre por día.
const MIN_WEEK_SLOT = 10;
function grainFor(days, plotW) {
  if (days <= 31) return 'day';
  if (days > 400) return 'month';
  return plotW && plotW / (days / 7) < MIN_WEEK_SLOT ? 'month' : 'week';
}

// Las semanas empiezan en lunes, como el eje: un punto semanal cae siempre sobre su fecha.
const mondayOf = d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() + 6) % 7);

// ?emptydays=4 (demo, 3/11: business pidió ver 3–4 días seguidos sin datos): vacía N días seguidos en
// el centro del rango. Quitando el parámetro vuelve a los datos de siempre.
const EMPTY_DAYS = Number(new URLSearchParams(window.location.search).get('emptydays')) || 0;

// Filtro de Filters (12/11), el mismo que Daily: Identified / Unknown y franja de hidratación. Sin nada
// marcado en una sección, cuenta como todo.
export const SHOW_ALL = { identified: true, unknown: true, ranges: null };
export const passes = (show, sm) => (sm.player ? show.identified : show.unknown) && (!show.ranges || show.ranges.has(getStatus(sm.score).key));

function buildHistory(team, start, end, plotW, show = SHOW_ALL) {
  const totalDays = Math.round((end - start) / DAY_MS) + 1;
  const grain = grainFor(totalDays, plotW);
  const emptyFrom = Math.floor((totalDays - EMPTY_DAYS) / 2);
  const buckets = [];
  for (let i = 0; i < totalDays; i++) {
    const day = addDays(start, i);
    const key = grain === 'day' ? i : grain === 'week' ? mondayOf(day).getTime() : `${day.getFullYear()}-${day.getMonth()}`;
    let b = buckets[buckets.length - 1];
    if (!b || b.key !== key) {
      b = { key, start: day, end: day, days: [] };
      buckets.push(b);
    }
    b.end = day;
    const d = EMPTY_DAYS && grain === 'day' && i >= emptyFrom && i < emptyFrom + EMPTY_DAYS ? null : teamDay(team, day);
    if (d) b.days.push(d);
  }
  // Una fila por periodo
  const rowOf = b => {
    // Score y métricas con todas las muestras, también las unknown (12/11, como el score de Daily)
    const smp = b.days.flatMap(d => d.samples).filter(sm => passes(show, sm));
    const ids = smp.filter(sm => sm.player);
    const unknown = smp.length - ids.length;
    const val = k => smp.map(sm => sm[k]);
    // Sample distribution: todas las muestras, también las unknown, cada una en su franja (Daniel, 12/11, opción B:
    // como el score). Cuántas son unknown lo dice Team engagement
    const counts = Object.fromEntries(HYDRATION_STATUSES.map(s => [s.key, smp.filter(x => getStatus(x.score).key === s.key).length]));
    const avgs = b.days.flatMap(d => d.playerAvgs);
    return {
      start: b.start, end: b.end,
      empty: smp.length === 0,
      score: smp.length ? Math.round(mean(val('score'))) : null,
      q1: quantile(avgs, 0.25), q3: quantile(avgs, 0.75),
      counts, identified: ids.length, unknown, total: smp.length,
      usg: mean(val('usg')), electrolytes: mean(val('electrolytes')),
      volume: mean(val('volume')),
      color: smp.length ? Math.round(quantile(val('color'), 0.5)) : null, // ordinal: mediana, no media
    };
  };
  const rows = buckets.map(rowOf);
  const allScores = buckets.flatMap(b => b.days.flatMap(d => d.samples)).filter(sm => passes(show, sm)).map(sm => sm.score);
  return {
    grain, rows, start, end, totalDays,
    score: allScores.length ? Math.round(mean(allScores)) : null,
    identified: rows.reduce((s, r) => s + r.identified, 0),
    total: allScores.length,
  };
}

function useWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

const M_BASE = { top: 8, right: 16, bottom: 52, left: 48 }; // abajo, dos filas de fechas (52 por la versión B: 12px día–línea, como en Figma)
const M = { ...M_BASE, gridLeft: M_BASE.left, inside: false };

// Ejes en móvil (exploración 6/11, Versions → Mobile axis): en 390 el margen fijo de 48 para los números
// y el padding de 24 dejaban la gráfica a ~72px del borde.
//   a = como en desktop · b = números encima de cada línea de la rejilla, a la izquierda (Daniel, 6/11: a la derecha
//   tapaban los días más recientes); rejilla desde el borde y datos desde 32; la
//   gráfica va de borde a borde y empieza en la misma x que el título · c = números fuera con un margen
//   de 36, igual en todas (así las gráficas siguen alineadas entre sí). b y c con padding de 16.
// M es de todo el módulo: lo fija la raíz (HydrationHistory o PlayerCharts) antes que sus gráficas.
function useAxisLayout() {
  const mobile = useMedia('(max-width: 480px)');
  const version = useVersion('mobileAxis');
  const mode = mobile ? version : 'a';
  Object.assign(M, M_BASE, { inside: mode === 'b', tight: mode !== 'a' },
    mode === 'b' ? { top: 20, left: 32, right: 0 } : mode === 'c' ? { left: 36, right: 8 } : {});
  // b: rejilla, franja y números desde el borde (alineados con el título); los datos empiezan 32px
  // después para no quedar debajo de los números (Daniel, 6/11)
  M.gridLeft = mode === 'b' ? 0 : M.left;
  return mode;
}

// Eje del tiempo compartido, igual en todas las gráficas. Por días, proporcional a los días. Por semanas
// o meses, cada periodo ocupa el mismo hueco aunque el rango lo corte (Daniel, 9/11: el primer mes de
// Last 12 months, 5 días, salía como una barrita de 2px); dentro de su hueco, las fechas van en proporción.
function timeScale(h, width) {
  const plotW = Math.max(0, width - M.left - M.right);
  if (h.grain !== 'day' && h.rows.length) {
    const band = plotW / h.rows.length;
    const index = new Map(h.rows.map((r, i) => [r, i]));
    const x = d => {
      const t = d.getTime();
      const i = h.rows.findIndex(r => t <= r.end.getTime());
      if (i < 0) return M.left + plotW;
      const r = h.rows[i];
      const f = Math.max(0, (t - r.start.getTime()) / (r.end.getTime() - r.start.getTime() + DAY_MS));
      return M.left + (i + f) * band;
    };
    // Una fila copiada (no la misma referencia) se busca por su fecha de inicio
    const mid = r => M.left + ((index.get(r) ?? h.rows.findIndex(o => o.start.getTime() === r.start.getTime())) + 0.5) * band;
    return { x, mid, slot: () => band, plotW, ticks: axisTicks(h) };
  }
  const t0 = h.start.getTime();
  const span = h.totalDays * DAY_MS;
  const x = d => M.left + (d.getTime() - t0) / span * plotW;
  const mid = r => x(new Date((r.start.getTime() + r.end.getTime() + DAY_MS) / 2));
  const slot = r => (r.end.getTime() - r.start.getTime() + DAY_MS) / span * plotW;
  return { x, mid, slot, plotW, ticks: axisTicks(h) };
}

// Fechas del eje siempre en días con sentido (Daniel, 30/10). Por días, "6 Oct" en una fila; por
// semanas o meses, dos filas: arriba el mes y abajo el año cuando cambia. Una semana → todos los días; un mes → cada
// lunes + la fecha final del rango (Daniel, 1/11: dice hasta cuándo llega); si un lunes cae a menos
// de 3 días del final se quita para que no se pisen. Más → el día 1 de cada mes (cada trimestre si
// pasan de 14).
function axisTicks(h) {
  const days = Array.from({ length: h.totalDays }, (_, i) => addDays(h.start, i));
  if (h.grain === 'day') {
    const last = days[days.length - 1];
    const picked = h.totalDays <= 7 ? days : [
      ...days.filter(d => d.getDay() === 1 && (last - d) / DAY_MS >= 3),
      last,
    ];
    // Con el mes en cada fecha (Daniel, 1/11): "6 Oct", sin segunda fila
    return picked.map(d => ({ d, label: fmtDay(d), sub: null }));
  }
  let firsts = days.filter(d => d.getDate() === 1);
  if (firsts.length > 14) firsts = firsts.filter(d => d.getMonth() % 3 === 0);
  return firsts.map((d, i) => ({
    d, label: SHORT_MONTHS[d.getMonth()],
    sub: i === 0 || d.getFullYear() !== firsts[i - 1].getFullYear() ? String(d.getFullYear()) : null,
  }));
}

function XAxis({ ts, h, height }) {
  if (useVersion('dates') === 'b') return <><XAxisStacked ts={ts} h={h} height={height} /><g data-ylabels="" /></>;
  return (
    <g className={styles.axis}>
      <line x1={M.gridLeft} x2={M.left + ts.plotW} y1={height - M.bottom} y2={height - M.bottom} className={styles.baseline} />
      {ts.ticks.map(({ d, label, sub }, i) => {
        // Un día ocupa una franja: la fecha va centrada en su día, no en su borde
        const x = h.grain === 'day' ? ts.x(d) + ts.slot({ start: d, end: d }) / 2 : ts.x(d);
        // Siempre centrada bajo su punto (también la última): el margen derecho tiene sitio
        const anchor = 'middle';
        return (
          <g key={i}>
            <text x={x} y={height - M.bottom + 18} textAnchor={anchor}>{label}</text>
            {sub && <text x={x} y={height - M.bottom + 34} textAnchor={anchor}>{sub}</text>}
          </g>
        );
      })}
    </g>
  );
}

// Fechas versión B (forma de la compañera, Explorations 501:90421; Daniel 3/11): arriba solo el
// número del día (o el mes, si se agrupa por meses); abajo la unidad mayor una vez, con una línea que
// abarca sus días. Números en todos los periodos si caben (≥ 20px cada uno); si no, uno de cada k
// (por días, los lunes).
const MIN_TICK_SLOT = 20;
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function XAxisStacked({ ts, h, height }) {
  const base = height - M.bottom;
  const days = Array.from({ length: h.totalDays }, (_, i) => addDays(h.start, i));
  // Fila 1
  let top;
  if (h.grain === 'day') {
    const slot = ts.plotW / h.totalDays;
    const picked = slot >= MIN_TICK_SLOT ? days : days.filter(d => d.getDay() === 1);
    top = picked.map(d => ({ x: ts.x(d) + slot / 2, label: String(d.getDate()) }));
  } else {
    // Los meses ("May") piden más sitio que un número: con menos de 28px, uno sí y otro no (Daniel, 9/11)
    const minSlot = h.grain === 'month' ? 28 : MIN_TICK_SLOT;
    const k = Math.max(1, Math.ceil(minSlot / (ts.plotW / h.rows.length)));
    top = h.rows.filter((_, i) => i % k === 0).map(r => ({
      x: ts.mid(r),
      label: h.grain === 'week' ? String(r.start.getDate()) : SHORT_MONTHS[r.start.getMonth()],
    }));
    // Un primer periodo cortado (unos días de un mes) deja su etiqueta encima de la siguiente
    // (Daniel, 9/11: "OcNov" en móvil con Last 12 months): de derecha a izquierda, la que no quepa se quita
    top = top.reduceRight((kept, t) => (!kept.length || kept[0].x - t.x >= minSlot ? [t, ...kept] : kept), []);
  }
  // Fila 2: tramos de mes (por días y semanas) o de año (por meses)
  const spans = [];
  days.forEach(d => {
    const key = h.grain === 'month' ? d.getFullYear() : `${d.getFullYear()}-${d.getMonth()}`;
    const last = spans[spans.length - 1];
    if (last && last.key === key) last.end = d;
    else spans.push({ key, start: d, end: d });
  });
  return (
    <g className={styles.axis}>
      <line x1={M.gridLeft} x2={M.left + ts.plotW} y1={base} y2={base} className={styles.baseline} />
      {top.map((t, i) => <text key={i} x={t.x} y={base + 18} textAnchor="middle">{t.label}</text>)}
      {spans.map((sp, i) => {
        const x1 = ts.x(sp.start) + 2, x2 = ts.x(addDays(sp.end, 1)) - 2;
        const w = x2 - x1;
        // El nombre entero si cabe; si no, corto; si tampoco, solo la línea
        const label = h.grain === 'month' ? (w >= 32 ? String(sp.start.getFullYear()) : null)
          : w >= 72 ? MONTHS_LONG[sp.start.getMonth()] : w >= 32 ? SHORT_MONTHS[sp.start.getMonth()] : null;
        return (
          <g key={i}>
            {/* Como en Figma 501:90421: 12px de la caja del día (línea de 16) a la línea, y 2px de la
                línea a la caja del mes; el mes centrado en su tramo */}
            <line x1={x1} x2={x2} y1={base + 34} y2={base + 34} className={styles.axisSpan} />
            {label && <text x={(x1 + x2) / 2} y={base + 48} textAnchor="middle">{label}</text>}
          </g>
        );
      })}
    </g>
  );
}

// Lo que representa un punto: el día, la semana o el mes (así el agrupado no engaña)
const periodLabel = (h, r) => h.grain === 'day' ? fmtDay(r.start)
  // Sin "Week" (Daniel, 1/11): solo inicio y fin, "6–12 Oct" o "29 Sep – 5 Oct"
  : h.grain === 'week' ? (r.start.getMonth() !== r.end.getMonth() ? `${fmtDay(r.start)} – ${fmtDay(r.end)}` : `${r.start.getDate()}–${fmtDay(r.end)}`)
  : `${SHORT_MONTHS[r.start.getMonth()]} ${r.start.getFullYear()}`;

// Puntos solo si caben con 16px entre uno y otro (el doble del punto); si no, solo la línea y el
// punto sale al pasar el ratón. Por espacio y no por número para que valga en tablet y móvil
// (Daniel, 1/11): Last month en móvil queda sin puntos, Last year en un monitor grande los tiene.
const showDots = (h, ts) => ts.plotW / h.rows.length >= 16;

// KPIs de History (Daniel, 1/11): se probó el resumen dentro de cada gráfica (estilo Stripe) y se
// volvió a las cards compactas (las mismas que Day) para dejar las gráficas limpias. La comparación
// dice el valor anterior, sin diferencia ni color (Daniel, 2–3/11).
const idPct = t => t.total ? Math.round(t.identified / t.total * 100) : 0;

// Subtítulo de cada gráfica: dice qué es un punto, y cambia con el rango elegido arriba (Daniel, 1/11)
const perGrain = h => `per ${h.grain}`;

// Punto del periodo con el cursor encima, con su halo (solo en la gráfica del cursor). Con `status`,
// el punto crece y lleva dentro un círculo con el color de su franja (Daniel, 1/11).
function HoverDot({ h, ts, hover, chartId, value, y, status }) {
  const r = hover && hover.chartId === chartId ? h.rows[hover.i] : null;
  const v = r ? value(r) : null;
  if (v === null || v === undefined) return null;
  const cx = ts.mid(r), cy = y(v);
  return <g pointerEvents="none">
    <circle cx={cx} cy={cy} r={10} className={styles.dotHalo} />
    <circle cx={cx} cy={cy} r={status ? 6 : 4} className={styles.metricDot} />
    {status && <circle cx={cx} cy={cy} r={3} className={styles.dotStatus} style={{ fill: status(v) }} />}
  </g>;
}

function YAxis({ ticks, y, width }) {
  // Mobile axis b: los números van en la capa del final del SVG (la deja XAxis), encima de barras y
  // líneas; si no, las primeras barras los tapaban
  const ref = useRef(null);
  const [top, setTop] = useState(null);
  useLayoutEffect(() => {
    setTop(M.inside ? ref.current?.ownerSVGElement?.querySelector('[data-ylabels]') ?? null : null);
  }, [M.inside]);
  const inside = M.inside && top && createPortal(
    <g className={styles.axis}>
      {ticks.map(t => <text key={t.v} x={M.gridLeft} y={y(t.v) - 6} textAnchor="start" className={styles.tickInside}>{t.label ?? t.v}</text>)}
    </g>,
    top,
  );
  return (
    <g ref={ref} className={styles.axis}>
      {ticks.map(t => (
        <g key={t.v}>
          <line x1={M.gridLeft} x2={width - M.right} y1={y(t.v)} y2={y(t.v)} className={styles.grid} />
          {!M.inside && <text x={M.left - 8} y={y(t.v) + 4} textAnchor="end">{t.label ?? t.v}</text>}
        </g>
      ))}
      {inside}
    </g>
  );
}

function useMedia(query) {
  return useSyncExternalStore(
    l => { const m = window.matchMedia(query); m.addEventListener('change', l); return () => m.removeEventListener('change', l); },
    () => window.matchMedia(query).matches,
  );
}

// Táctil (6/11): en tablet y móvil no hay hover. Tocar o arrastrar en horizontal elige un periodo y la
// elección se queda al soltar; un gesto vertical mueve la página (touch-action: pan-y). Tocar fuera
// de la gráfica la quita. Dónde se lee el dato:
//   móvil (≤480): en una franja que ocupa la fila del título, solo con un periodo elegido (el card de
//     208px tapaba media gráfica; Daniel, 6/11: en reposo, nada).
//   tablet: el card flotante de desktop, que sigue al dedo (decidido por Daniel, 6/11: en tablet hay
//     sitio para el card; la franja quedó como versión A en exploreVersions).
// Con ratón no cambia nada.
function useReadout() {
  const coarse = useMedia('(pointer: coarse)');
  const mobile = useMedia('(max-width: 480px)');
  const touchTablet = useVersion('touchTablet');
  return coarse && (mobile || touchTablet === 'a');
}

// Capa de hover: una sola zona que cubre toda la gráfica y se engancha al periodo más cercano al
// cursor (Daniel, 30/10: atinarle a la bolita era difícil). Cada gráfica tiene su propio hover
// (Daniel, 30/10): la línea vertical y el punto solo salen donde está el cursor. El tooltip no recibe el ratón: si lo recibe, tapa la zona y parpadea.
function HoverLayer({ h, ts, height, hover, setHover, chartId, tooltip, marker, anchorY, crosshair = true, readoutFoot }) {
  const r = hover && hover.chartId === chartId ? h.rows[hover.i] : null;
  const readout = useReadout();
  const zoneRef = useRef(null);
  const dragRef = useRef(null);
  // La franja vive fuera del SVG, en el hueco que deja ChartSection
  const [slot, setSlot] = useState(null);
  useLayoutEffect(() => {
    setSlot(readout ? zoneRef.current?.closest('section')?.querySelector('[data-readout]') ?? null : null);
  }, [readout]);
  // Elegido con el dedo: tocar fuera de esta gráfica lo quita
  const touched = r && hover.touch;
  useEffect(() => {
    if (!touched) return;
    const off = e => { if (!zoneRef.current?.contains(e.target)) setHover(null); };
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, [touched, setHover]);
  // El card se centra en la altura del punto (o de lo alto de la barra), sin salirse de la gráfica
  // (Daniel, 1/11: pegado arriba quedaba lejos del punto cuando el valor era bajo)
  const tipRef = useRef(null);
  const [tipH, setTipH] = useState(0);
  useLayoutEffect(() => { if (tipRef.current) setTipH(tipRef.current.offsetHeight); });
  const anchor = r && anchorY ? anchorY(r) : null;
  const tipY = anchor === null || anchor === undefined ? M.top
    : Math.max(M.top, Math.min(anchor - tipH / 2, height - M.bottom - tipH));
  function onMove(e) {
    const px = e.clientX - e.currentTarget.getBoundingClientRect().left + M.left;
    let best = 0;
    h.rows.forEach((row, i) => { if (Math.abs(ts.mid(row) - px) < Math.abs(ts.mid(h.rows[best]) - px)) best = i; });
    const touch = e.pointerType !== 'mouse';
    if (!hover || hover.i !== best || hover.chartId !== chartId || !!hover.touch !== touch) setHover({ i: best, chartId, touch });
  }
  // A la derecha del punto; si no cabe, a la izquierda (nunca encima del cursor)
  const tipW = 208;
  const tipRight = r && ts.mid(r) + 12 + tipW <= M.left + ts.plotW;
  const tipX = r && (tipRight ? ts.mid(r) + 12 : ts.mid(r) - 12 - tipW);
  const body = row => row.empty ? <span className={styles.tooltipMuted}>No samples</span> : tooltip(row);
  return (
    <>
      {r && crosshair && <line x1={ts.mid(r)} x2={ts.mid(r)} y1={M.top} y2={height - M.bottom} className={styles.crosshair} pointerEvents="none" />}
      {/* El punto va encima de la línea vertical (Daniel, 1/11) */}
      {marker}
      <rect
        ref={zoneRef}
        x={M.left} width={ts.plotW} y={0} height={height}
        fill="transparent"
        className={styles.hoverZone}
        // Con el dedo elige un toque (soltar sin que la página se haya movido) o un arrastre en
        // horizontal; si el gesto es de scroll, el navegador lo cancela y no se elige nada
        onPointerDown={e => { if (e.pointerType !== 'mouse') dragRef.current = { x: e.clientX, y: e.clientY, on: false }; }}
        onPointerMove={e => {
          if (e.pointerType === 'mouse') return onMove(e);
          const d = dragRef.current;
          if (!d) return;
          if (!d.on && Math.abs(e.clientX - d.x) > 6 && Math.abs(e.clientX - d.x) > Math.abs(e.clientY - d.y)) d.on = true;
          if (d.on) onMove(e);
        }}
        onPointerUp={e => { if (e.pointerType !== 'mouse' && dragRef.current) onMove(e); dragRef.current = null; }}
        onPointerCancel={() => { dragRef.current = null; }}
        // Con el dedo, soltar no quita la elección
        onPointerLeave={e => { if (e.pointerType === 'mouse') setHover(null); }}
      />
      {r && !readout && (
        <foreignObject x={tipX} y={0} width={tipW} height={height} pointerEvents="none" style={{ pointerEvents: 'none' }}>
          {/* A la izquierda, el card se pega al punto (no al borde de la caja de 208px) */}
          <div className={styles.tooltipBox} style={{ justifyContent: tipRight ? 'flex-start' : 'flex-end', paddingTop: tipY }}>
            <div ref={tipRef} className={styles.tooltip}>
              <span className={styles.tooltipDate}>{periodLabel(h, r)}</span>
              <div className={styles.tooltipBody}>{body(r)}</div>
            </div>
          </div>
        </foreignObject>
      )}
      {/* Solo con un periodo elegido (Daniel, 6/11): en reposo la gráfica va limpia, sin resumen ni
          "Tap the chart…"; al tocar, el dato ocupa la fila del título y mide lo mismo (la gráfica no salta) */}
      {slot && r && createPortal(
        // El toque en la franja no llega al "tocar fuera": si llegaba, la franja se quitaba al bajar el dedo
        // y el click caía en lo de debajo (el botón Optimal range se encendía o apagaba con la ✕; 6/11)
        <div className={styles.readout} aria-live="polite" onPointerDown={e => e.stopPropagation()}>
          <div className={styles.readoutText}>
            <span className={styles.readoutDate}>{periodLabel(h, r)}</span>
            <div className={styles.readoutBody}>{body(r)}</div>
            {/* Gráficas del jugador (Users Analytics): media del equipo y muestras en una tercera línea; en una
                no cabían a 390 (Daniel, 11/11, opción B1: la franja reserva el alto de 3 líneas, la gráfica no salta) */}
            {readoutFoot?.(r) && <span className={styles.readoutFoot}>{readoutFoot(r)}</span>}
          </div>
          <button type="button" className={styles.readoutClose} aria-label="Close" onClick={() => setHover(null)}>
            <IconClose size={16} />
          </button>
        </div>,
        slot,
      )}
    </>
  );
}

// Tramos de periodos seguidos con datos: la línea se corta en los huecos en vez de unirlos.
function runs(rows, has) {
  const out = [];
  let cur = [];
  rows.forEach(r => {
    if (has(r)) cur.push(r);
    else if (cur.length) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out;
}

// Versión B de los huecos (reunión 2/11, todas las gráficas de línea): del último punto de un tramo al
// primero del siguiente, punteada. Va debajo de la línea y los puntos.
function GapLines({ segs, x, y }) {
  return segs.slice(1).map((seg, i) => {
    const a = segs[i][segs[i].length - 1], b = seg[0];
    return <path key={i} className={styles.lineGap} d={`M${x(a)},${y(a)}L${x(b)},${y(b)}`} />;
  });
}
const hasGaps = (h, value) => runs(h.rows, r => value(r) !== null).length > 1;

// Con `info`, la descripción sale del encabezado y pasa a un tooltip en una "i" junto al título
// (Daniel, 1/11: exploración, empezando por la ①). Se abre con hover y con foco (teclado y tap).
export function InfoTip({ label, children }) {
  return (
    <span className={styles.infoTip}>
      <button type="button" className={styles.infoBtn} aria-label={label}><IconInfoCircle size={16} /></button>
      <span role="tooltip" className={styles.infoTipBox}>{children}</span>
    </span>
  );
}

function ChartSection({ title, subtitle, info, action, legend, children, tallReadout = false }) {
  const readout = useReadout();
  return (
    <section className={`${styles.chartSection} ${M.tight ? styles.chartSectionTight : ''}`}>
      <div className={`${base.sectionHeader} ${readout ? styles.headerTouch : ''} ${readout && tallReadout ? styles.headerTouchTall : ''}`}>
        {/* Hueco de la franja táctil, encima de la fila del título (la rellena el HoverLayer) */}
        {readout && <div data-readout="" className={styles.readoutSlot} />}
        <div className={base.sectionText}>
          <h2 className={`${base.sectionTitle} ${styles.titleRow}`}>
            {title}
            {info && <InfoTip label={`About ${title}`}>{info}</InfoTip>}
          </h2>
          {!info && <p className={base.sectionSubtitle}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
      {/* Alineada con el área de la gráfica, también en Mobile axis */}
      {legend && <div className={styles.legend} style={{ paddingLeft: M.gridLeft }}>{legend}</div>}
    </section>
  );
}

const Swatch = ({ color, label, line, band, dashed }) => (
  <span className={styles.legendItem}>
    {dashed
      ? <svg className={styles.swatchDashed} width="16" height="2" aria-hidden="true"><line x1="0" x2="16" y1="1" y2="1" className={styles.lineGap} /></svg>
      : <span className={band ? styles.swatchBand : line ? styles.swatchLine : styles.swatch} style={{ background: color }} />}
    {label}
  </span>
);

// ① Score: línea (es un nivel, no una cantidad), con el estilo de la gráfica de la compañera.
// Sin arcoíris (Daniel, 30/10): solo se pinta la franja Hydrated, con su botón para ocultarla; el
// estado de cada periodo y el 50% central de jugadores van en el tooltip. Eje de 20 en 20: el
// borde de la franja ya marca 65 y 94 (sin línea punteada, Daniel 30/10: menos ruido).
function ScoreOverTime({ h, hover, setHover }) {
  // Versión B (reunión 2/11): los días sin samples se unen con línea punteada para seguir la tendencia
  // (también en USG y Electrolytes)
  const dashedGaps = useVersion('gaps') === 'b';
  const [showRange, setShowRange] = useState(true);
  const [ref, width] = useWidth();
  const height = 276;
  const ts = timeScale(h, width);
  const y = v => M.top + (1 - v / 100) * (height - M.top - M.bottom);
  const segs = runs(h.rows, r => r.score !== null);
  const hydrated = HYDRATION_STATUSES.find(s => s.key === 'hydrated');
  const top = y(hydrated.max + 1), bottom = y(hydrated.min);
  return (
    <ChartSection
      title="Hydration score"
      info={<>The team's average hydration score, identified and unknown samples. Each point is one {h.grain}.</>}
      action={
        <div className={styles.metricActions}>
          <ToolbarButton icon={showRange ? <IconEye size={16} /> : <IconEyeClosed size={16} />} onClick={() => setShowRange(v => !v)}>
            Optimal range
          </ToolbarButton>
        </div>
      }
      legend={<>
        <Swatch line color="var(--chart-line)" label="Team average" />
        {dashedGaps && segs.length > 1 && <Swatch dashed label="No samples" />}
        {showRange && <Swatch band label={`Optimal range (${hydrated.min}–${hydrated.max})`} />}
      </>}
    >
      <div ref={ref} className={styles.plot}>
        {width > 0 && (
          <svg width={width} height={height}>
            {/* Con % en cada marca, como GA / Amplitude (Daniel, 1/11): se entiende sin leer el título */}
            <YAxis ticks={[0, 20, 40, 60, 80, 100].map(v => ({ v, label: `${v}%` }))} y={y} width={width} />
            {showRange && <>
              <rect x={M.gridLeft} width={ts.plotW + M.left - M.gridLeft} y={top} height={bottom - top} className={styles.optimal} />
            </>}
            {dashedGaps && <GapLines segs={segs} x={ts.mid} y={r => y(r.score)} />}
            {segs.map((seg, i) => (
              <path key={i} className={styles.line} d={`M${seg.map(r => `${ts.mid(r)},${y(r.score)}`).join('L')}`} />
            ))}
            {showDots(h, ts) && h.rows.filter(r => r.score !== null).map((r, i) => (
              <circle key={i} cx={ts.mid(r)} cy={y(r.score)} r={4} className={styles.metricDot} />
            ))}
            <XAxis ts={ts} h={h} height={height} />
            <HoverLayer h={h} ts={ts} height={height} hover={hover} setHover={setHover} chartId="score"
              anchorY={r => r.score === null ? null : y(r.score)}
              marker={<HoverDot h={h} ts={ts} hover={hover} chartId="score" value={r => r.score} y={y} status={v => getStatus(v).color} />} tooltip={r => r.score === null
              ? <span className={styles.tooltipMuted}>Only unknown samples</span>
              : <>
                {/* Sin "Middle 50%" (30/10) ni "Team average" (1/11: ya lo dicen el KPI, la leyenda y la "i").
                    Las muestras sustituyen a "N days with samples": dicen cuánto fiarse de la media, en cualquier rango */}
                <span className={styles.tooltipValueRow}>
                  <span className={styles.tooltipValue}>{r.score}%</span>
                  <span className={styles.tooltipStatus}>
                    <span className={styles.statusDot} style={{ background: getStatus(r.score).color }} />
                    {getStatus(r.score).label}
                  </span>
                </span>
                <span className={styles.tooltipMuted}>{r.total.toLocaleString('en')} {r.total === 1 ? 'sample' : 'samples'}</span>
              </>} />
          </svg>
        )}
      </div>
    </ChartSection>
  );
}

// Ancho de barra: el 60% de su periodo, con tope de 72px como la compañera (Daniel, 3/11: con 24,
// Last 7 days eran siete palitos en mucho vacío). Cada barra centrada en su día, repartidas a todo el
// ancho (no agrupadas en el centro: el eje es el mismo que el de las líneas). Desde Last 30 days no
// cambia: ahí la barra ya es más estrecha.
const barWidth = (ts, r) => Math.max(2, Math.min(72, ts.slot(r) * 0.6));

// Barras apiladas con 2px de separación entre segmentos; lo más grave pegado a la base.
function StackedBars({ h, hover, setHover, chartId, height, series, total, yMax, yTicks, tooltip, yLabel }) {
  const [ref, width] = useWidth();
  const ts = timeScale(h, width);
  const y = v => M.top + (1 - v / yMax) * (height - M.top - M.bottom);
  // Hover por columna (Daniel, 1/11): la del cursor se queda entera y las demás bajan al 40%;
  // sustituye a la línea vertical. Se probó una franja gris detrás y gustó menos.
  const active = hover && hover.chartId === chartId ? hover.i : null;
  return (
    <div ref={ref} className={styles.plot}>
      {/* Con selector (Absolute | Relative) el hueco se guarda aunque no haya unidad: la gráfica no salta */}
      {yLabel !== undefined && <span className={styles.yLabel}>{yLabel ?? '\u00a0'}</span>}
      {width > 0 && (
        <svg width={width} height={height} className={active !== null ? styles.barsHovering : undefined}>
          <YAxis ticks={yTicks} y={y} width={width} />
          {h.rows.map((r, i) => {
            const t = total(r);
            if (!t) return null;
            const bw = barWidth(ts, r);
            let acc = 0;
            return (
              <g key={i} className={`${styles.barCol} ${i === active ? styles.barActive : ''}`}>
                {series.map(s => {
                  const v = s.value(r);
                  if (!v) return null;
                  const y0 = y(acc), y1 = y(acc + v);
                  acc += v;
                  return <rect key={s.key} x={ts.mid(r) - bw / 2} width={bw} y={y1} height={Math.max(1, y0 - y1 - 2)} rx={2} style={{ fill: s.color }} />;
                })}
              </g>
            );
          })}
          <XAxis ts={ts} h={h} height={height} />
          <HoverLayer h={h} ts={ts} height={height} hover={hover} setHover={setHover} chartId={chartId} tooltip={tooltip} crosshair={false}
            anchorY={r => total(r) ? y(series.reduce((sum, s) => sum + (s.value(r) || 0), 0)) : null} />
        </svg>
      )}
    </div>
  );
}

// Eje de barras con saltos redondos (1, 2, 5, 10, 20, 25, 50…) y como mucho 5 tramos (Daniel, 9/11:
// partir el máximo en 4 daba 13 · 25 · 38 con un máximo de 50). El más pequeño que quepa en 5 tramos.
function niceStep(v) {
  for (let k = 1; ; k *= 10) {
    for (const m of k === 1 ? [1, 2, 5] : [1, 2, 2.5, 5]) if (Math.ceil(v / (m * k)) <= 5) return m * k;
  }
}
function niceMax(v) {
  const step = niceStep(v);
  return Math.max(step, Math.ceil(v / step) * step);
}
const ticksFor = max => {
  const step = niceStep(max);
  return Array.from({ length: Math.round(max / step) + 1 }, (_, i) => ({ v: i * step }));
};

// ② Reparto por franja: arranca en Absolute (Daniel, 1/11: en % un día de 2 muestras pesaba como uno de
// 40); Relative queda en el selector.
// Cada franja con su color de estado definido, también Hydrated (Daniel, 1/11: se probó suavizarlo y
// se descartó; es el color de Hydrated en toda la plataforma).
function SamplesByRange({ h, hover, setHover }) {
  const [unit, setUnit] = useState('count');
  const pct = unit === 'pct';
  const max = pct ? 100 : niceMax(Math.max(1, ...h.rows.map(r => r.total)));
  const series = HYDRATION_STATUSES.map(s => ({
    key: s.key, color: s.color,
    value: r => pct ? (r.total ? r.counts[s.key] / r.total * 100 : 0) : r.counts[s.key],
  }));
  return (
    <ChartSection
      title="Sample distribution"
      info={<>All samples (identified and unknown) by hydration range, one bar per {h.grain}. In Relative, each bar adds up to 100%.</>}
      action={<SegmentedControl size="s" value={unit} onChange={setUnit} options={[{ label: 'Absolute', value: 'count' }, { label: 'Relative', value: 'pct' }]} />}
      legend={HYDRATION_STATUSES.map(s => <Swatch key={s.key} color={s.color} label={s.label} />)}
    >
      <StackedBars
        h={h} hover={hover} setHover={setHover} chartId="range" height={220}
        series={series} total={r => r.total} yMax={max} yLabel={pct ? null : 'Samples'}
        yTicks={ticksFor(max).map(t => ({ ...t, label: pct ? `${t.v}%` : t.v }))}
        tooltip={r => [...HYDRATION_STATUSES].reverse().map(s => (
            <span key={s.key} className={styles.tooltipRow}>
              <span className={styles.swatch} style={{ background: s.color }} />
              <span className={styles.rowLabel}>{s.label}</span> <b>{r.counts[s.key]}</b> <span className={`${styles.tooltipMuted} ${styles.rowLabel}`}>({Math.round(r.counts[s.key] / r.total * 100)}%)</span>
            </span>
          ))}
      />
    </ChartSection>
  );
}

// ③ Engagement: muestras identificadas (abajo, la base común) + sin identificar (arriba, gris).
function Engagement({ h, hover, setHover }) {
  const max = niceMax(Math.max(1, ...h.rows.map(r => r.identified + r.unknown)));
  return (
    <ChartSection
      title="Team engagement"
      info={<>How many of the team's samples were identified (linked to a player) and how many weren't. Each bar is one {h.grain}.</>}
      legend={<>
        <Swatch color={IDENTIFIED} label="Identified samples" />
        <Swatch color={UNIDENTIFIED} label="Unknown samples" />
      </>}
    >
      <StackedBars
        h={h} hover={hover} setHover={setHover} chartId="engagement" height={200}
        series={[
          { key: 'id', color: IDENTIFIED, value: r => r.identified },
          { key: 'unk', color: UNIDENTIFIED, value: r => r.unknown },
        ]}
        total={r => r.identified + r.unknown} yMax={max} yTicks={ticksFor(max)} yLabel="Samples"
        tooltip={r => <>
          <span className={styles.tooltipRow}><span className={styles.swatch} style={{ background: IDENTIFIED }} /><span className={styles.rowLabel}>Identified</span> <b>{r.identified}</b></span>
          <span className={styles.tooltipRow}><span className={styles.swatch} style={{ background: UNIDENTIFIED }} /><span className={styles.rowLabel}>Unknown</span> <b>{r.unknown}</b></span>
          {r.identified + r.unknown > 0 && <span className={styles.tooltipMuted}>{Math.round(r.identified / (r.identified + r.unknown) * 100)}% identified</span>}
        </>}
      />
    </ChartSection>
  );
}

// ④ Métricas: una a la vez (cada una con su unidad: nunca dos ejes Y en la misma gráfica).
// Gráfica de una métrica (la comparten A y B). USG y Electrolytes en línea; 'colorVolume' en barras
// con el color de orina (versión A); 'volume' en barras neutras, el color solo en el card (versión B).
function MetricPlot({ h, hover, setHover, metric, showOptimal, chartId, height = 240 }) {
  const dashedGaps = useVersion('gaps') === 'b';
  const [ref, width] = useWidth();
  const ts = timeScale(h, width);
  const isBars = metric === 'colorVolume' || metric === 'volume';
  const colored = metric === 'colorVolume';
  const m = METRICS[metric];
  const activeBar = isBars && hover && hover.chartId === chartId ? hover.i : null;

  let content = null;
  let marker = null;
  let anchorY = null;
  if (width > 0 && isBars) {
    const max = niceMax(Math.max(1, ...h.rows.map(r => r.volume ?? 0)));
    const y = v => M.top + (1 - v / max) * (height - M.top - M.bottom);
    anchorY = r => r.volume === null || r.color === null ? null : y(r.volume);
    content = <>
      <YAxis ticks={ticksFor(max).map(t => ({ ...t, label: `${t.v}` }))} y={y} width={width} />
      {h.rows.map((r, i) => {
        if (r.volume === null || r.color === null) return null;
        const bw = barWidth(ts, r);
        // Mismo hover que las barras apiladas (4/11): la columna del cursor entera, el resto al 40%
        return <g key={i} className={`${styles.barCol} ${i === activeBar ? styles.barActive : ''}`}>
          <rect x={ts.mid(r) - bw / 2} width={bw} y={y(r.volume)} height={y(0) - y(r.volume)} rx={2}
            className={colored ? styles.urineBar : styles.volumeBar} style={colored ? { fill: URINE_COLORS[r.color - 1] } : undefined} />
        </g>;
      })}
    </>;
  } else if (width > 0) {
    const [d0, d1] = m.domain;
    const y = v => {
      const t = (v - d0) / (d1 - d0);
      return M.top + (m.invert ? t : 1 - t) * (height - M.top - M.bottom);
    };
    const segs = runs(h.rows, r => r[metric] !== null);
    anchorY = r => r[metric] === null ? null : y(r[metric]);
    marker = <HoverDot h={h} ts={ts} hover={hover} chartId={chartId} value={r => r[metric]} y={y} />;
    // Paso del eje elegido para que los bordes del Optimal range caigan en una raya (Daniel, 4/11:
    // Electrolytes de 5 en 5, con 6 en 6 la franja 5–25 quedaba entre rayas)
    const step = m.tickStep ?? (d1 - d0) / 5;
    content = <>
      <YAxis ticks={Array.from({ length: Math.round((d1 - d0) / step) + 1 }, (_, i) => ({ v: d0 + step * i, label: m.axis?.(d0 + step * i) }))} y={y} width={width} />
      {showOptimal && m.optimal && <>
        <rect x={M.gridLeft} width={ts.plotW + M.left - M.gridLeft} y={Math.min(y(m.optimal[0]), y(m.optimal[1]))}
          height={Math.abs(y(m.optimal[1]) - y(m.optimal[0]))} className={styles.optimal} />
      </>}
      {dashedGaps && <GapLines segs={segs} x={ts.mid} y={r => y(r[metric])} />}
      {segs.map((seg, i) => <path key={i} className={styles.metricLine} d={`M${seg.map(r => `${ts.mid(r)},${y(r[metric])}`).join('L')}`} />)}
      {showDots(h, ts) && h.rows.filter(r => r[metric] !== null).map((r, i) => <circle key={i} cx={ts.mid(r)} cy={y(r[metric])} r={4} className={styles.metricDot} />)}
    </>;
  }

  const unidentifiedOnly = <span className={styles.tooltipMuted}>Only unknown samples</span>;
  const samplesLine = r => <span className={styles.tooltipMuted}>{r.total.toLocaleString('en')} {r.total === 1 ? 'sample' : 'samples'}</span>;
  // Unidad encima del eje Y, en horizontal (Daniel, 3/11), solo donde los números no la dicen
  const yLabel = isBars ? 'mL' : m.unit.trim() || null;
  return (
    <div ref={ref} className={styles.plot}>
      {/* Siempre con su hueco: en la versión A el selector cambia de métrica y la gráfica no salta */}
      <span className={styles.yLabel}>{yLabel ?? '\u00a0'}</span>
      {width > 0 && (
        <svg width={width} height={height} className={activeBar !== null ? styles.barsHovering : undefined}>
          {content}
          <XAxis ts={ts} h={h} height={height} />
          <HoverLayer h={h} ts={ts} height={height} hover={hover} setHover={setHover} chartId={chartId} marker={marker} anchorY={anchorY} crosshair={!isBars} tooltip={r => isBars
            ? (r.volume === null ? unidentifiedOnly : <>
              {/* Mismo card que el score (4/11): valor grande arriba, detalle y muestras debajo */}
              <span className={styles.tooltipValue}>{Math.round(r.volume)} mL</span>
              <span className={styles.tooltipRow}><span className={`${styles.swatch} ${styles.swatchBorder}`} style={{ background: URINE_COLORS[r.color - 1] }} />Urine color <b>{r.color}</b></span>
              {samplesLine(r)}
            </>)
            : (r[metric] === null ? unidentifiedOnly : <>
              <span className={styles.tooltipValue}>{m.fmt(r[metric])}{m.unit}</span>
              {samplesLine(r)}
            </>)} />
        </svg>
      )}
    </div>
  );
}

const OptimalToggle = ({ m, show, setShow }) => (
  <ToolbarButton icon={show ? <IconEye size={16} /> : <IconEyeClosed size={16} />} onClick={() => setShow(v => !v)} disabled={!m.optimal}>
    {m.optimal ? 'Optimal range' : 'Optimal range not defined'}
  </ToolbarButton>
);

// ④ Versión A (la de hasta ahora): una gráfica y un selector USG | Electrolytes | Color & Volume.
function SampleMetrics({ h, hover, setHover }) {
  const dashedGaps = useVersion('gaps') === 'b';
  const [metric, setMetric] = useState('usg');
  const [showOptimal, setShowOptimal] = useState(true);
  const isBars = metric === 'colorVolume';
  const m = METRICS[metric];

  return (
    <ChartSection
      title="Sample metrics"
      subtitle={isBars ? `Average volume ${perGrain(h)} (mL). Bar color is the median urine color` : `Average ${perGrain(h)}${m.unit ? ` (${m.unit.trim()})` : ''}`}
      action={
        <div className={styles.metricActions}>
          {!isBars && <OptimalToggle m={m} show={showOptimal} setShow={setShowOptimal} />}
          <SegmentedControl size="s" value={metric} onChange={setMetric}
            options={[{ label: 'USG', value: 'usg' }, { label: 'Electrolytes', value: 'electrolytes' }, { label: 'Color & Volume', value: 'colorVolume' }]} />
        </div>
      }
      legend={isBars
        ? URINE_COLORS.map((c, i) => <Swatch key={i} color={c} label={i + 1} />)
        : <>
          <Swatch line color="var(--chart-line)" label={`Team average ${m.label}`} />
          {dashedGaps && hasGaps(h, r => r[metric]) && <Swatch dashed label="No samples" />}
          {m.optimal && showOptimal && <Swatch band label="Optimal range" />}
        </>}
    >
      <MetricPlot h={h} hover={hover} setHover={setHover} metric={metric} showOptimal={showOptimal} chartId="metrics" />
    </ChartSection>
  );
}

// ④ Versión B (reunión 2/11): las tres métricas separadas, una gráfica cada una, sin selector.
// El volumen en barras neutras: el color de orina sale solo en el card (no como color de barra).
// Pasada del 4/11, igual que ①②③: descripción en la "i", unidad sobre el eje Y, card del score.
function SampleMetricsSeparate({ h, hover, setHover }) {
  const dashedGaps = useVersion('gaps') === 'b';
  const [showUsg, setShowUsg] = useState(true);
  const [showEl, setShowEl] = useState(true);
  return <>
    <ChartSection
      title="USG"
      info={<>The team's average urine specific gravity. Each point is one {h.grain}. Optimal range: 1.003–1.016.</>}
      action={METRICS.usg.optimal && <OptimalToggle m={METRICS.usg} show={showUsg} setShow={setShowUsg} />}
      legend={<>
        <Swatch line color="var(--chart-line)" label="Team average USG" />
        {dashedGaps && hasGaps(h, r => r.usg) && <Swatch dashed label="No samples" />}
        {METRICS.usg.optimal && showUsg && <Swatch band label="Optimal range" />}
      </>}
    >
      <MetricPlot h={h} hover={hover} setHover={setHover} metric="usg" showOptimal={showUsg} chartId="usg" />
    </ChartSection>
    <ChartSection
      title="Electrolytes"
      info={<>The team's average electrolyte concentration in urine. Each point is one {h.grain}.</>}
      action={<OptimalToggle m={METRICS.electrolytes} show={showEl} setShow={setShowEl} />}
      legend={<>
        <Swatch line color="var(--chart-line)" label="Team average Electrolytes" />
        {dashedGaps && hasGaps(h, r => r.electrolytes) && <Swatch dashed label="No samples" />}
        {showEl && <Swatch band label="Optimal range" />}
      </>}
    >
      <MetricPlot h={h} hover={hover} setHover={setHover} metric="electrolytes" showOptimal={showEl} chartId="electrolytes" />
    </ChartSection>
    <ChartSection title="Urine volume & color" info={<>Average volume per sample, one bar per {h.grain}. Hover a bar to see its median urine color.</>}>
      <MetricPlot h={h} hover={hover} setHover={setHover} metric="volume" chartId="volume" />
    </ChartSection>
  </>;
}

// ─── Users Analytics: las gráficas del jugador (4/11) ─────────────────────────
// Las mismas de Team History con los datos de un jugador, cada una separada (Daniel, 4/11), y la media
// del equipo como línea gris continua (la punteada ya es "sin muestras"). Sin Sample distribution:
// con 0–2 muestras al día no dice nada (el reparto va en la card). "Samples per day" es su engagement.
function buildPlayerHistory(team, playerId, start, end, plotW) {
  const totalDays = Math.round((end - start) / DAY_MS) + 1;
  const grain = grainFor(totalDays, plotW);
  const buckets = [];
  for (let i = 0; i < totalDays; i++) {
    const day = addDays(start, i);
    const key = grain === 'day' ? i : grain === 'week' ? mondayOf(day).getTime() : `${day.getFullYear()}-${day.getMonth()}`;
    let b = buckets[buckets.length - 1];
    if (!b || b.key !== key) { b = { key, start: day, end: day, days: [] }; buckets.push(b); }
    b.end = day;
    const d = teamDay(team, day);
    if (d) b.days.push(d);
  }
  const rows = buckets.map(b => {
    const mine = b.days.map(d => d.byPlayer[playerId]).filter(Boolean);
    const scores = mine.flatMap(x => x.scores);
    const all = k => b.days.flatMap(d => d[k]);
    const teamScores = all('scores');
    const has = scores.length > 0;
    return {
      start: b.start, end: b.end,
      empty: !has,
      identified: scores.length,
      score: has ? Math.round(mean(scores)) : null,
      usg: has ? mean(mine.map(x => x.usg)) : null,
      electrolytes: has ? mean(mine.map(x => x.electrolytes)) : null,
      volume: has ? mean(mine.map(x => x.volume)) : null,
      color: has ? Math.round(quantile(mine.map(x => x.color), 0.5)) : null,
      samples: b.days.length ? scores.length : null, // sin entrenamiento ese periodo: hueco, no 0
      team: {
        score: teamScores.length ? mean(teamScores) : null,
        usg: mean(all('usg')), electrolytes: mean(all('electrolytes')), volume: mean(all('volume')),
        // Muestras por jugador del equipo en ese periodo
        samples: b.days.length ? teamScores.length / b.days[0].roster : null,
      },
    };
  });
  return { grain, rows, start, end, totalDays };
}

// Los datos de un periodo para las cards y el ranking de Users Analytics, sacados de los mismos días
// que las gráficas (4/11: con el mock de rango las cards decían 23 muestras y la gráfica sumaba otras).
// Mismo formato que getTeamHydration en lo que usa Users Analytics: players con samples y average, y teamScore.
export function periodHydration(team, { start, end }) {
  const roster = getTeamHydration(team, { start, end }).players;
  const byId = Object.fromEntries(roster.map(p => [p.id, []]));
  const teamScores = [];
  const totalDays = Math.round((end - start) / DAY_MS) + 1;
  for (let i = 0; i < totalDays; i++) {
    const day = addDays(start, i);
    const d = teamDay(team, day);
    if (!d) continue;
    teamScores.push(...d.scores);
    // Con las métricas del día del jugador (las de sus gráficas), para la tabla "Detailed samples in selected
    // period" (11/11); la 2ª y 3ª muestra del día varían un poco para no ser copias
    Object.entries(d.byPlayer).forEach(([id, x]) => x.scores.forEach((score, k) =>
      byId[id]?.push({
        date: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 9 + k * 3), score,
        usg: x.usg + k * 0.6,
        electrolytes: Math.round(clamp(x.electrolytes + k, 1, 29)),
        volume: Math.round(clamp(x.volume - k * 25, 80, 600)),
        color: x.color,
      })));
  }
  return {
    players: roster.map(p => {
      const samples = byId[p.id].sort((a, b) => b.date - a.date);
      return { ...p, samples, average: samples.length ? Math.round(mean(samples.map(x => x.score))) : null };
    }),
    teamScore: teamScores.length ? Math.round(mean(teamScores)) : null,
  };
}

const hydratedBand = HYDRATION_STATUSES.find(s => s.key === 'hydrated');
const PLAYER_LINES = {
  score: { title: 'Hydration score', domain: [0, 100], ticks: [0, 20, 40, 60, 80, 100], unit: '%', fmt: v => Math.round(v),
    optimal: [hydratedBand.min, hydratedBand.max + 1], status: true,
    info: g => <>The player's average hydration score. Each point is one {g}; the turquoise line is the team average.</> },
  usg: { ...METRICS.usg, title: 'USG', ticks: null,
    info: g => <>The player's average urine specific gravity. Each point is one {g}. Optimal range: 1.003–1.016.</> },
  electrolytes: { ...METRICS.electrolytes, title: 'Electrolytes', ticks: null,
    info: g => <>The player's average electrolyte concentration in urine. Each point is one {g}.</> },
};

// Media del equipo (Daniel, 4/11): línea entera, sin cortes (los huecos son del jugador, no del equipo), y en
// color para no confundirse con la punteada gris de "sin muestras". Versión "Team line" (para enseñarla a business
// el 5/11): a = turquesa de la marca (Turquoise/40, "Data Colors/Hydration" en Figma; la elegida por Daniel, 4/11),
// b = azul (Blue/50), c = naranja (orange-65, es Over hydrated). Turquoise/40 y Blue/50 aún no están en los
// tokens de código, de ahí el hex. Se probaron green-41 y turquoise-30.
const TEAM_LINE = { a: '#22aaa2', b: '#2ba4d4', c: 'var(--color-orange-65)' };
const useTeamLine = () => TEAM_LINE[useVersion('teamLine')];
// Versión "Team average toggle" (5/11, pedido de business): a = la media del equipo siempre y el botón de cada
// gráfica apaga el Optimal range; b = el botón de cada gráfica apaga la media del equipo (Optimal range siempre).
// Mismo sitio y mismo espacio que hoy: un botón por gráfica (se probó un título "Trends" con un botón para
// todas y no gustó).
function useChartToggle() {
  const swap = useVersion('teamToggle') === 'b';
  const [on, setOn] = useState(true);
  return { swap, on, setOn, team: !swap || on, optimal: swap || on };
}

const TeamToggle = ({ show, setShow }) => (
  <ToolbarButton icon={show ? <IconEye size={16} /> : <IconEyeClosed size={16} />} onClick={() => setShow(v => !v)}>
    Team average
  </ToolbarButton>
);

function TeamLine({ h, ts, y, metric, shown = true }) {
  const color = useTeamLine();
  if (!shown) return null;
  const pts = h.rows.filter(r => r.team[metric] !== null);
  if (!pts.length) return null;
  return <path className={styles.teamLine} style={{ stroke: color }} d={`M${pts.map(r => `${ts.mid(r)},${y(r.team[metric])}`).join('L')}`} />;
}

function TeamSwatch({ shown = true }) {
  const color = useTeamLine();
  if (!shown) return null;
  return <span className={styles.legendItem}><span className={styles.swatchTeam} style={{ background: color }} />Team average</span>;
}

function PlayerLine({ h, hover, setHover, metric, playerName }) {
  const c = PLAYER_LINES[metric];
  const tg = useChartToggle();
  const showTeam = tg.team, showOptimal = tg.optimal;
  const [ref, width] = useWidth();
  const height = metric === 'score' ? 276 : 240;
  const ts = timeScale(h, width);
  const [d0, d1] = c.domain;
  const y = v => { const t = (v - d0) / (d1 - d0); return M.top + (c.invert ? t : 1 - t) * (height - M.top - M.bottom); };
  const step = c.tickStep ?? (d1 - d0) / 5;
  const ticks = (c.ticks ?? Array.from({ length: Math.round((d1 - d0) / step) + 1 }, (_, i) => d0 + step * i))
    .map(v => ({ v, label: metric === 'score' ? `${v}%` : c.axis?.(v) }));
  const segs = runs(h.rows, r => r[metric] !== null);
  const val = v => `${c.fmt(v)}${c.unit}`;
  const yLabel = metric === 'score' ? null : c.unit.trim() || null;
  return (
    <ChartSection
      tallReadout
      title={c.title}
      info={c.info(h.grain)}
      action={tg.swap ? <TeamToggle show={tg.on} setShow={tg.setOn} /> : c.optimal && <OptimalToggle m={c} show={tg.on} setShow={tg.setOn} />}
      legend={<>
        <Swatch line color="var(--chart-line)" label={playerName} />
        <TeamSwatch shown={showTeam} />
        {segs.length > 1 && <Swatch dashed label="No samples" />}
        {c.optimal && showOptimal && <Swatch band label={metric === 'score' ? `Optimal range (${hydratedBand.min}–${hydratedBand.max})` : 'Optimal range'} />}
      </>}
    >
      <div ref={ref} className={styles.plot}>
        {metric !== 'score' && <span className={styles.yLabel}>{yLabel ?? ' '}</span>}
        {width > 0 && (
          <svg width={width} height={height}>
            <YAxis ticks={ticks} y={y} width={width} />
            {c.optimal && showOptimal && <rect x={M.gridLeft} width={ts.plotW + M.left - M.gridLeft} y={Math.min(y(c.optimal[0]), y(c.optimal[1]))}
              height={Math.abs(y(c.optimal[1]) - y(c.optimal[0]))} className={styles.optimal} />}
            <TeamLine h={h} ts={ts} y={y} metric={metric} shown={showTeam} />
            <GapLines segs={segs} x={ts.mid} y={r => y(r[metric])} />
            {segs.map((seg, i) => <path key={i} className={styles.metricLine} d={`M${seg.map(r => `${ts.mid(r)},${y(r[metric])}`).join('L')}`} />)}
            {showDots(h, ts) && h.rows.filter(r => r[metric] !== null).map((r, i) => <circle key={i} cx={ts.mid(r)} cy={y(r[metric])} r={4} className={styles.metricDot} />)}
            <XAxis ts={ts} h={h} height={height} />
            <HoverLayer h={h} ts={ts} height={height} hover={hover} setHover={setHover} chartId={metric}
              anchorY={r => r[metric] === null ? null : y(r[metric])}
              marker={<HoverDot h={h} ts={ts} hover={hover} chartId={metric} value={r => r[metric]} y={y} status={c.status ? v => getStatus(v).color : undefined} />}
              readoutFoot={r => r.empty ? null : [showTeam && r.team[metric] !== null && `Team average ${val(r.team[metric])}`, `${r.identified} ${r.identified === 1 ? 'sample' : 'samples'}`].filter(Boolean).join(' · ')}
              tooltip={r => <>
                <span className={styles.tooltipValueRow}>
                  <span className={styles.tooltipValue}>{val(r[metric])}</span>
                  {c.status && <span className={styles.tooltipStatus}>
                    <span className={styles.statusDot} style={{ background: getStatus(r[metric]).color }} />
                    {getStatus(r[metric]).label}
                  </span>}
                </span>
                {showTeam && r.team[metric] !== null && <span className={`${styles.tooltipMuted} ${styles.tooltipTeam}`}>Team average {val(r.team[metric])}</span>}
                <span className={`${styles.tooltipMuted} ${styles.tooltipFoot}`}>{r.identified} {r.identified === 1 ? 'sample' : 'samples'}</span>
              </>} />
          </svg>
        )}
      </div>
    </ChartSection>
  );
}

// Barras del jugador con la media del equipo encima en línea gris: Urine volume y Samples per day
function PlayerBars({ h, hover, setHover, metric, title, info, playerName }) {
  const tg = useChartToggle();
  const showTeam = tg.team;
  const [ref, width] = useWidth();
  const height = 200;
  const ts = timeScale(h, width);
  const isSamples = metric === 'samples';
  const top = Math.max(1, ...h.rows.flatMap(r => [r[metric] ?? 0, r.team[metric] ?? 0]));
  // Muestras: de uno en uno mientras quepan (con 0–3 al día, las marcas de 1,25 salían redondeadas a 1 y 3)
  const unitTicks = isSamples && top <= 6;
  const max = unitTicks ? Math.max(3, Math.ceil(top)) : niceMax(top);
  const yTicks = unitTicks ? Array.from({ length: max + 1 }, (_, v) => ({ v })) : ticksFor(max);
  const y = v => M.top + (1 - v / max) * (height - M.top - M.bottom);
  const activeBar = hover && hover.chartId === metric ? hover.i : null;
  const fmt = v => isSamples ? (Number.isInteger(v) ? v : v.toFixed(1)) : `${Math.round(v)} mL`;
  return (
    <ChartSection tallReadout title={title} info={info} action={tg.swap && <TeamToggle show={tg.on} setShow={tg.setOn} />}
      legend={<><Swatch color="var(--chart-line)" label={playerName} /><TeamSwatch shown={showTeam} /></>}>
      <div ref={ref} className={styles.plot}>
        <span className={styles.yLabel}>{isSamples ? 'Samples' : 'mL'}</span>
        {width > 0 && (
          <svg width={width} height={height} className={activeBar !== null ? styles.barsHovering : undefined}>
            <YAxis ticks={yTicks} y={y} width={width} />
            {h.rows.map((r, i) => {
              if (!r[metric]) return null;
              const bw = barWidth(ts, r);
              return <g key={i} className={`${styles.barCol} ${i === activeBar ? styles.barActive : ''}`}>
                <rect x={ts.mid(r) - bw / 2} width={bw} y={y(r[metric])} height={y(0) - y(r[metric])} rx={2} className={styles.volumeBar} />
              </g>;
            })}
            <TeamLine h={h} ts={ts} y={y} metric={metric} shown={showTeam} />
            <XAxis ts={ts} h={h} height={height} />
            <HoverLayer h={h} ts={ts} height={height} hover={hover} setHover={setHover} chartId={metric} crosshair={false}
              anchorY={r => r[metric] ? y(r[metric]) : null}
              readoutFoot={r => r.empty ? null : [showTeam && r.team[metric] !== null && `Team average ${fmt(r.team[metric])}`, !isSamples && `${r.identified} ${r.identified === 1 ? 'sample' : 'samples'}`].filter(Boolean).join(' · ') || null}
              tooltip={r => <>
                <span className={styles.tooltipValue}>{fmt(r[metric] ?? 0)}{isSamples ? ` ${r[metric] === 1 ? 'sample' : 'samples'}` : ''}</span>
                {!isSamples && r.color !== null && <span className={styles.tooltipRow}><span className={`${styles.swatch} ${styles.swatchBorder}`} style={{ background: URINE_COLORS[r.color - 1] }} />Urine color <b>{r.color}</b></span>}
                {showTeam && r.team[metric] !== null && <span className={`${styles.tooltipMuted} ${styles.tooltipTeam}`}>Team average {fmt(r.team[metric])}</span>}
                {!isSamples && <span className={`${styles.tooltipMuted} ${styles.tooltipFoot}`}>{r.identified} {r.identified === 1 ? 'sample' : 'samples'}</span>}
              </>} />
          </svg>
        )}
      </div>
    </ChartSection>
  );
}

// Nombres de business (reunión 5/11): "Engagement" (antes "Samples per day") y "Urine volume & color"
export function PlayerCharts({ team, player, range }) {
  const [hover, setHover] = useState(null);
  useAxisLayout();
  const [widthRef, width] = useWidth();
  const plotW = width ? width - M.left - M.right : 0;
  const h = useMemo(() => buildPlayerHistory(team, player.id, range.start, range.end, plotW), [team, player.id, range, plotW]);
  const props = { h, hover, setHover, playerName: player.name };
  return (
    <div ref={widthRef}>
      <PlayerLine {...props} metric="score" />
      <PlayerLine {...props} metric="usg" />
      <PlayerLine {...props} metric="electrolytes" />
      <PlayerBars {...props} metric="volume" title="Urine volume & color"
        info={<>The player's average volume per sample, one bar per {h.grain}. Hover a bar to see its median urine color.</>} />
      <PlayerBars {...props} metric="samples" title="Engagement"
        info={<>How many samples the player recorded each {h.grain}. The line is the team's average per player.</>} />
    </div>
  );
}

// Tabla "Score & metrics by user" con la media del periodo (pregunta 21, Daniel 12/11): al final, después de
// las gráficas; las columnas de Daily sin "Last samples" (en un periodo no dice nada y así hay más sitio).
// Score, USG, Electrolytes y Volume: media de las muestras del periodo; Color: la media redondeada al nivel
// de la escala; Total usage: muestras del periodo. Mismo orden por defecto que Daily (Score, de peor a
// mejor) y sin muestras siempre al final. Anchos de columna de Daily (sus clases col*), no iguales: con
// columnas iguales todas pedían los 136 de Electrolytes y no cabía (Daniel, 12/11). En móvil, scroll
// horizontal con Name fija (M1, Daniel 12/11)
const USER_COLUMNS = [
  ['name', 'Name', 'colName'], ['score', 'Score', 'colScore'], ['usg', 'USG', 'colUsg'],
  ['electrolytes', 'Electrolytes', 'colElectrolytes'], ['color', 'Color', 'colColor'],
  ['volume', 'Volume', 'colVolume'], ['total', 'Total usage', 'colTotal'],
];
const avg = (list, k) => list.reduce((a, s) => a + s[k], 0) / list.length;

// Cada fila abre al jugador en Users Analytics con el mismo periodo (Daniel, 12/11; solo en el proto, no va a Figma)
function UsersTable({ team, range, onOpenPlayer, show = SHOW_ALL }) {
  const data = useMemo(() => periodHydration(team, range), [team, range]);
  const [sortCol, setSortCol] = useState('score');
  const [sortDir, setSortDir] = useState('asc');
  const players = useMemo(() => data.players.map(p => {
    const n = p.samples.length;
    return {
      id: p.id, name: p.name, photo: p.photo, average: p.average, total: n,
      usg: n ? avg(p.samples, 'usg') : null,
      electrolytes: n ? Math.round(avg(p.samples, 'electrolytes')) : null,
      color: n ? Math.round(avg(p.samples, 'color')) : null,
      volume: n ? Math.round(avg(p.samples, 'volume')) : null,
    };
  }), [data]);
  const rows = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    const val = (p, k) => k === 'name' ? p.name.toLowerCase() : k === 'score' ? p.average : p[k];
    // Hydration range (12/11, opción 1A): por la franja de la media del periodo de cada jugador; sin muestras,
    // fuera. Identified / Unknown no la toca (como en Daily: la tabla es de jugadores)
    const list = show.ranges ? players.filter(p => p.average !== null && show.ranges.has(getStatus(p.average).key)) : players;
    return [...list].sort((a, b) => {
      if (sortCol !== 'name' && sortCol !== 'total') {
        if (a.average === null && b.average === null) return 0;
        if (a.average === null) return 1;
        if (b.average === null) return -1;
      }
      const va = val(a, sortCol), vb = val(b, sortCol);
      return va < vb ? -dir : va > vb ? dir : 0;
    });
  }, [players, sortCol, sortDir, show]);
  const handleSort = col => {
    if (sortCol !== col) { setSortCol(col); setSortDir('asc'); }
    else setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
  };
  const empty = <span className={base.empty}>—</span>;
  return (
    <section id="users-table" className={`${styles.chartSection} ${M.tight ? styles.chartSectionTight : ''}`}>
      <div className={base.sectionHeader}>
        <div className={base.sectionText}>
          <h2 className={`${base.sectionTitle} ${styles.titleRow}`}>
            Score &amp; metrics by user
            <InfoTip label="About score and metrics by user">Each player's averages over the selected period, per sample, and how many samples they recorded.</InfoTip>
          </h2>
        </div>
      </div>
      <TableScroll>
        <table className={base.table}>
          <thead>
            <tr>
              {USER_COLUMNS.map(([key, label, col]) => (
                <th key={key} className={`${base[col]} ${key === 'score' ? base.highlight : ''}`}>
                  <button type="button" className={base.sortBtn} onClick={() => handleSort(key)}>
                    {label}
                    <IconSort
                      size={16}
                      upColor={sortCol === key && sortDir === 'desc' ? 'var(--color-text-disabled)' : undefined}
                      downColor={sortCol === key && sortDir === 'asc' ? 'var(--color-text-disabled)' : undefined}
                    />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={USER_COLUMNS.length} className={base.empty}>No players match the filters.</td></tr>
            )}
            {rows.map(p => {
              const has = p.average !== null;
              return (
                <tr key={p.id} className={onOpenPlayer ? styles.rowLink : undefined} onClick={onOpenPlayer && (() => onOpenPlayer(p.id))}>
                  <td>
                    <span className={base.userCell}>
                      <span className={base.rowAvatar}>
                        {p.photo ? <img className={base.avatarPhoto} src={p.photo} alt="" /> : p.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                      </span>
                      <span className={base.userText}>
                        <span className={base.userName}>{p.name}</span>
                        <span className={base.userTeam}>{team.name}</span>
                      </span>
                    </span>
                  </td>
                  <td className={base.highlight}>
                    {has ? <span className={base.scoreTag}><span className={base.dot} style={{ background: getStatus(p.average).color }} />{p.average}%</span> : empty}
                  </td>
                  <td>{has ? formatUsg(p.usg) : empty}</td>
                  <td>{has ? `${p.electrolytes} mS/cm` : empty}</td>
                  <td>{has ? <span className={base.urine} style={urineStyle(p.color)}>{p.color}</span> : empty}</td>
                  <td>{has ? `${p.volume} mL` : empty}</td>
                  <td>{p.total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableScroll>
    </section>
  );
}

export default function HydrationHistory({ team, range, onOpenPlayer, show = SHOW_ALL }) {
  // ?hover=score:16 abre con el hover fijo en ese periodo de esa gráfica (para capturar el estado a Figma)
  const [hover, setHover] = useState(() => {
    const m = /^(\w+):(\d+)$/.exec(new URLSearchParams(window.location.search).get('hover') || '');
    return m ? { chartId: m[1], i: Number(m[2]) } : null;
  });
  const metricsVersion = useVersion('metrics');
  useAxisLayout();
  // Ancho de la gráfica (el de la fila de KPIs, igual al de las secciones) para el agrupado
  const [widthRef, width] = useWidth();
  const plotW = width ? width - M.left - M.right : 0;
  const h = useMemo(() => buildHistory(team, range.start, range.end, plotW, show), [team, range, plotW, show]);
  // Con qué se compara, dicho con la misma medida que el rango (Daniel, 3/11: "previous period" no
  // decía cuál): "previous 30 days", "previous 12 months"; Today → "yesterday"
  const prevLabel = range.preset === 'today' ? 'yesterday'
    : range.preset === 'lastYear' ? 'previous 12 months'
    : `previous ${h.totalDays} ${h.totalDays === 1 ? 'day' : 'days'}`;
  const prev = useMemo(() => {
    return buildHistory(team, addDays(range.start, -h.totalDays), addDays(range.start, -1), plotW, show);
  }, [team, range, h.totalDays, plotW, show]);

  return (
    <>
      <div ref={widthRef} className={`${base.kpiRow} ${base.kpiRowCompact}`}>
        <div className={`${base.kpiCard} ${base.kpiCompact}`}>
          <span className={`${base.kpiLabel} ${base.kpiLabelCaps}`}>Team average score</span>
          <div className={base.kpiLine}>
            <span className={base.kpiMain}>
              <span className={base.kpiValue}>{h.score ?? '—'}{h.score !== null && '%'}</span>
              {/* El mismo tag que en Day (Daniel, 1/11) */}
              {h.score !== null && <span className={`${base.rangeTag} ${base['rangeTag_' + getStatus(h.score).key]} ${base.kpiTag}`}>{RANGE_TAG[getStatus(h.score).key]}</span>}
            </span>
            {h.score !== null && prev.score !== null && <span className={base.kpiCompare}>
              {/* Solo el dato del periodo anterior, sin color (Daniel, 2/11; mismo motivo que en Day) */}
              {prev.score}% {prevLabel}
            </span>}
          </div>
        </div>
        <div className={`${base.kpiCard} ${base.kpiCompact}`}>
          <span className={`${base.kpiLabel} ${base.kpiLabelCaps}`}>Samples</span>
          <div className={base.kpiLine}>
            <span className={base.kpiMain}>
              <span className={base.kpiValue}>{h.total.toLocaleString('en')}</span>
              <span className={base.kpiCompare}>{idPct(h)}% identified</span>
            </span>
            {/* Sin diferencia ni color, como el score (Daniel, 3/11) */}
            <span className={base.kpiCompare}>{prev.total.toLocaleString('en')} {prevLabel}</span>
          </div>
        </div>
      </div>

      <ScoreOverTime h={h} hover={hover} setHover={setHover} />
      <SamplesByRange h={h} hover={hover} setHover={setHover} />
      <Engagement h={h} hover={hover} setHover={setHover} />
      {metricsVersion === 'b'
        ? <SampleMetricsSeparate h={h} hover={hover} setHover={setHover} />
        : <SampleMetrics h={h} hover={hover} setHover={setHover} />}
      <UsersTable team={team} range={range} onOpenPlayer={onOpenPlayer} show={show} />
    </>
  );
}
