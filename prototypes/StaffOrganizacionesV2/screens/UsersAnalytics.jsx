import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import SegmentedControl from '../../../design-system/components/SegmentedControl/SegmentedControl';
import { IconChevronDown, IconChevronMiniRight, IconCheckCircle, IconSearch, IconClose, IconSort } from '../../../design-system/icons/outline';
import { CALENDAR_PRESETS } from '../../../design-system/components/Calendar/Calendar';
import shell from '../../StaffOrganizaciones/screens/DeleteOrgModal.module.css';
import { HYDRATION_STATUSES, getStatus, getTeamHydration, TODAY, formatUsg, urineStyle } from './hydrationMock';
import { useVersion } from './exploreVersions';
// La "i" de History tal cual (Daniel, 4/11: aquí el icono quedaba más pegado al título)
import { InfoTip, PlayerCharts, periodHydration } from './HydrationHistory';
import base from './HydrationAnalytics.module.css';
import styles from './UsersAnalytics.module.css';
import TableScroll from './TableScroll';

// Users Analytics (exploración 4/11): el perfil de un jugador del equipo elegido arriba. Cabecera de
// perfil (foto, nombre que despliega la lista, última muestra, flechas con contador), dos cards (score y
// samples) y el bloque Team ranking debajo. Today: cards + muestras del día, sin ranking ni
// gráficas. Las gráficas del periodo (jugador + media del equipo) van en el siguiente paso.

const DAY_MS = 86400000;
const NEIGHBOURS = 1; // solo el de arriba y el de abajo (Daniel, 4/11: con dos por lado sobraba)

const RANGE_TAG = { severe: 'Sev dehydrated', dehydrated: 'Dehydrated', hydrated: 'Hydrated', over: 'Over hydrated' };
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const initials = name => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
const mean = xs => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
const pad = n => String(n).padStart(2, '0');
const fmtTime = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const fmtDate = d => `${pad(d.getDate())} ${SHORT_MONTHS[d.getMonth()]}`;
// Tabla de muestras: el año solo si no es el actual, para no confundir dos "15 Oct" de años distintos en
// Last 12 months o un Custom range que cruce de año (Daniel, 11/11; como el Custom range corto en móvil)
const fmtSampleDate = d => d.getFullYear() === TODAY.getFullYear() ? fmtDate(d) : `${fmtDate(d)} ${d.getFullYear()}`;
const dayKey = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

// Days hydrated: de los días con muestras, en cuántos la media del día cae en Hydrated. Por días y no
// por muestras: medirse 5 veces en un mal día no pesa más que medirse una (Daniel, 4/11).
function playerStats(p) {
  const byDay = new Map();
  p.samples.forEach(s => {
    const k = dayKey(s.date);
    byDay.set(k, [...(byDay.get(k) ?? []), s.score]);
  });
  const dayAvgs = [...byDay.values()].map(mean);
  const hydratedDays = dayAvgs.filter(v => getStatus(v).key === 'hydrated').length;
  return {
    ...p,
    count: p.samples.length,
    days: dayAvgs.length,
    hydratedDays,
    counts: Object.fromEntries(HYDRATION_STATUSES.map(s => [s.key, p.samples.filter(x => getStatus(x.score).key === s.key).length])),
  };
}

// Card Samples (versión B, decidida 4/11): el reparto por franjas en texto, que es lo que cuenta la card
// (Daniel: "la intención del sample distribution es mostrar cuántas hay en cada rango"). Lo de debajo de
// Hydrated junto ("below hydrated", la palabra de la card de Daily) para que quepa en una línea; solo
// las franjas con muestras. El detalle de cada franja, al pasar el ratón por la barra.
function samplesSummary(p, isDay, when) {
  if (!p.count) return isDay ? `No samples ${when}` : 'No samples in this period';
  const below = p.counts.severe + p.counts.dehydrated;
  return [[below, 'below hydrated'], [p.counts.hydrated, 'hydrated'], [p.counts.over, 'over hydrated']]
    .filter(([n]) => n > 0).map(([n, w]) => `${n} ${w}`).join(' · ');
}

// Posición compartida en los empates (1, 2, 2, 4)
function withRanks(list, value) {
  let prev = null, rank = 0;
  return list.map((p, i) => {
    const v = value(p);
    if (v !== prev) { rank = i + 1; prev = v; }
    return { ...p, rank };
  });
}

// Days hydrated = cuántos días del periodo estuvo hidratado (su media del día en Hydrated). Por número de
// días y no por porcentaje (Daniel, 5/11): "19 of 23 days" se leía como 19 de los 23 días del periodo, y
// el % se confundía con el score. Sin mínimo de días: quien se midió poco tiene pocos días y queda abajo.
function buildRankings(players) {
  const by = key => withRanks([...players].sort((a, b) => b[key] - a[key]), p => p[key]);
  return { engagement: by('count'), hydrated: by('hydratedDays') };
}

function shift(range, days) {
  const add = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  return { start: add(range.start, days), end: add(range.end, days) };
}

function useOutsideClose(open, setOpen) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, setOpen]);
  return ref;
}

const Dot = ({ color }) => <span className={base.dot} style={{ background: color }} />;
const Avatar = ({ name, photo, size = 32 }) => (
  <span className={styles.avatar} style={{ width: size, height: size, fontSize: size >= 40 ? 'var(--font-size-14)' : 'var(--font-size-12)' }}>
    {photo ? <img className={styles.avatarPhoto} src={photo} alt="" /> : initials(name)}
  </span>
);

// Sin tildes ni mayúsculas: "garcia" encuentra a García
const fold = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Busca por nombre o por dorsal, lo que se escriba (Daniel, 4/11: si busco "carlos" y sé que es el 7,
// tiene que salir aunque no escriba el 7). Números: el dorsal que empieza por lo escrito; texto: el
// nombre o el apellido que lo contiene.
function matches(p, q) {
  const t = fold(q.trim());
  if (!t) return true;
  return fold(p.name).includes(t) || String(p.number).startsWith(t.replace(/^#/, ''));
}

// Lista de jugadores del equipo elegido, por dorsal, con buscador (Daniel, 4/11: la del ContextMenu
// era muy grande y sin buscador). Mismo desplegable con buscador que el de equipos de EditUnitDrawer.
function PlayerMenu({ players, player, onChange, children, className }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useOutsideClose(open, setOpen);
  const listRef = useRef(null);
  const shown = players.filter(p => matches(p, q));
  const close = () => { setOpen(false); setQ(''); };
  const pick = id => { onChange(id); close(); };
  useEffect(() => {
    if (!open) return;
    ref.current?.querySelector('input')?.focus();
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [open]);
  return (
    <div className={styles.menuWrap} ref={ref}>
      <button type="button" className={className} onClick={() => open ? close() : setOpen(true)} aria-expanded={open} aria-label={`Change player, ${player.name}`}>
        {children}
        <IconChevronDown size={20} />
      </button>
      {open && (
        <div className={styles.playerMenu}
          onKeyDown={e => {
            if (e.key === 'Escape') close();
            if (e.key === 'Enter' && shown[0]) pick(shown[0].id);
          }}>
          {/* El buscador de los desplegables de la webapp (el de Assign teams en EditUnitDrawer), no el SearchBar */}
          <div className={styles.playerSearch}>
            <IconSearch size={16} />
            <input className={styles.playerSearchInput} placeholder="Search name or number" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <ul ref={listRef} className={styles.playerList} role="listbox" aria-label="Players">
            {shown.map(p => (
              <li key={p.id} role="option" aria-selected={p.id === player.id}>
                <button type="button" className={styles.playerOption} onClick={() => pick(p.id)}>
                  {/* Foto y nombre a la izquierda, dorsal al final (Daniel, 4/11): delante, los de una cifra
                      dejaban un hueco y la fila no arrancaba siempre en el mismo sitio */}
                  <Avatar name={p.name} photo={p.photo} size={24} />
                  <span className={styles.playerOptionName}>{p.name}</span>
                  <span className={styles.playerNumber}>#{p.number}</span>
                  <span className={styles.playerCheck}>{p.id === player.id && <IconCheckCircle size={16} />}</span>
                </button>
              </li>
            ))}
            {shown.length === 0 && <li className={styles.playerEmpty}>No players match "{q}"</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

// Cabecera de perfil (Daniel, 4/11): el equipo manda el contexto (la barra de arriba, como en los otros
// tabs) y el jugador el contenido. Foto y nombre, que despliega la lista; nada más
// (ni el equipo, que ya está arriba, ni el estado, que está en la card). Al salir de la vista, el
// jugador entra en la barra fija al lado del equipo: solo foto y nombre con su lista, sin "›" delante
// ni flechas (Daniel, 4/11).
function ProfileHeader({ players, player, onChange, stickySlot }) {
  const ref = useRef(null);
  const [out, setOut] = useState(false);
  // Entra en la barra en cuanto la foto ha pasado por debajo de la barra fija (Daniel, 4/11: antes
  // esperaba a que saliera toda la cabecera de la vista y llegaba tarde)
  useEffect(() => {
    const avatar = ref.current?.firstElementChild;
    const bar = stickySlot?.closest('[class*=cardHeaderSticky]');
    const scroller = bar?.parentElement.closest('[class*=container]');
    if (!avatar || !bar || !scroller) return;
    const check = () => setOut(avatar.getBoundingClientRect().bottom < bar.getBoundingClientRect().bottom);
    check();
    scroller.addEventListener('scroll', check, { passive: true });
    return () => scroller.removeEventListener('scroll', check);
  }, [stickySlot]);
  const i = players.findIndex(p => p.id === player.id);
  const prev = players[(i - 1 + players.length) % players.length];
  const next = players[(i + 1) % players.length];

  return (
    <>
      <div ref={ref} className={styles.profile}>
        {/* Solo el nombre (Daniel, 4/11): el dorsal y "Last sample" no convencían (la última muestra confundía
            al cambiar las fechas). Sin segunda línea la foto baja a 56 (48 se veía pequeña). La posición iría aquí cuando exista el campo. */}
        <Avatar name={player.name} photo={player.photo} size={56} />
        <div className={styles.profileText}>
          <PlayerMenu players={players} player={player} onChange={onChange} className={styles.profileName}>{player.name}</PlayerMenu>
        </div>
        {/* Flechas con contador a la derecha (prueba 4/11): sin los nombres, que no cabían en móvil */}
        {players.length > 1 && (
          <div className={styles.stepper}>
            <span className={styles.flip}><IconButton aria-label={`Previous player, ${prev.name}`} tooltip={prev.name} onClick={() => onChange(prev.id)}><IconChevronMiniRight size={24} /></IconButton></span>
            <span className={styles.counter}>{i + 1} / {players.length}</span>
            <IconButton aria-label={`Next player, ${next.name}`} tooltip={next.name} onClick={() => onChange(next.id)}><IconChevronMiniRight size={24} /></IconButton>
          </div>
        )}
      </div>
      {out && stickySlot && createPortal(
        <span className={styles.compact}>
          <PlayerMenu players={players} player={player} onChange={onChange} className={styles.compactName}>
            <Avatar name={player.name} photo={player.photo} size={32} /><span className={styles.compactText}>{player.name}</span>
          </PlayerMenu>
        </span>,
        stickySlot,
      )}
    </>
  );
}



// Team ranking, forma compacta (versión "vecinos", 4/11): el jugador y los dos de arriba y abajo;
// "View full ranking" despliega el resto dentro del bloque. Las filas no navegan (Daniel, 4/11).
const RANK_INFO = {
  engagement: 'Players ordered by how many samples they recorded in this period.',
  // En días y no en % (Daniel, 4/11): "83%" se leía como un hydration score
  hydrated: 'Players ordered by how many days they were hydrated in this period.',
};

// Lo de dentro de un ranking: la posición (lo que manda, Daniel 4/11; sin la media del equipo), el jugador
// con el de arriba y el de abajo, y "View full ranking". Lista limpia, sin barras: puesto, jugador y su dato.
function RankBody({ kind, rankings, player, onOpenFull }) {
  const [full, setFull] = useState(false);
  const ranked = rankings[kind];
  const isEng = kind === 'engagement';
  const value = p => isEng ? p.count : p.hydratedDays;
  const idx = ranked.findIndex(p => p.id === player.id);
  const me = ranked[idx];
  const from = Math.max(0, Math.min(idx - NEIGHBOURS, ranked.length - (NEIGHBOURS * 2 + 1)));
  const rows = full ? ranked : idx === -1 ? [] : ranked.slice(from, from + NEIGHBOURS * 2 + 1);
  // Versión "Ranking focus" B (5/11): el jugador más grande y por encima; el de arriba se desvanece hacia
  // arriba y el de abajo hacia abajo (como el degradado de la barra fija). Menos alto y él manda.
  // C (5/11): solo el jugador y su puesto, sin vecinos ni titular aparte: lo más bajo
  const focusVersion = useVersion('rankFocus');
  const focus = focusVersion === 'b' && !full;
  const solo = focusVersion === 'c' && !full;
  const focusRows = [ranked[idx - 1], me, ranked[idx + 1]].filter(Boolean);
  const valueText = p => isEng ? `${value(p)} ${value(p) === 1 ? 'sample' : 'samples'}` : `${value(p)} ${value(p) === 1 ? 'day' : 'days'}`;
  return <>
    {!solo && <p className={styles.rankHeadline}>
      <b>#{me.rank}</b> of {ranked.length}
    </p>}

    {solo ? (
      <div className={styles.rankSolo}>
        {/* Solo el puesto, sin "of 16" (Daniel, 5/11) */}
        <span className={styles.rankHeadline}><b>#{me.rank}</b></span>
        <span className={styles.rankName}><Avatar name={me.name} photo={me.photo} size={32} /><span className={styles.compactText}>{me.name}</span></span>
        <span className={styles.rankValue}>{valueText(me)}</span>
      </div>
    ) : focus ? (
      <ol className={styles.rankFocus}>
        {focusRows.map(p => {
          const mine = p.id === player.id;
          const cls = mine ? styles.rankFocusMe : p === ranked[idx - 1] ? styles.rankFocusAbove : styles.rankFocusBelow;
          return (
            <li key={p.id} className={cls}>
              <div className={styles.rankRow}>
                <span className={styles.rankPos}>{p.rank}</span>
                <span className={styles.rankName}><Avatar name={p.name} photo={p.photo} size={mine ? 32 : 24} />{p.name}</span>
                <span className={styles.rankValue}>{valueText(p)}</span>
              </div>
            </li>
          );
        })}
      </ol>
    ) : (
    <ol className={styles.rankList}>
      {rows.map(p => (
        <li key={p.id}>
          <div className={`${styles.rankRow} ${p.id === player.id ? styles.rankRowMe : ''}`}>
            <span className={styles.rankPos}>{p.rank}</span>
            <span className={styles.rankName}><Avatar name={p.name} photo={p.photo} size={24} />{p.name}</span>
            <span className={styles.rankValue}>{valueText(p)}</span>
          </div>
        </li>
      ))}
    </ol>
    )}


    <button type="button" className={styles.rankMore} onClick={() => onOpenFull ? onOpenFull(kind) : setFull(v => !v)}>
      {full ? 'Show less' : `View full ranking (${ranked.length})`}
    </button>
  </>;
}

// Versión "Rankings" (4/11). A, la principal de Daniel: un bloque a todo el ancho con selector
// Engagement | Days hydrated y el título según el selector. B: los dos rankings a la vez, en dos cards
// lado a lado (como las de arriba), sin selector.
// Ranking completo en un modal (versión B de "Full ranking", 5/11): solo el ranking que se abrió, sin selector
// (Daniel, 5/11: ya se eligió al tocar), en la fila del jugador. Dice el periodo: el ranking depende de él.
function RankingModal({ rankings, player, initialKind: kind, period, onClose }) {
  const listRef = useRef(null);
  const ranked = rankings[kind];
  const isEng = kind === 'engagement';
  const value = p => isEng ? p.count : p.hydratedDays;
  useEffect(() => {
    listRef.current?.querySelector('[data-me]')?.scrollIntoView({ block: 'center' });
  }, [kind]);
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return createPortal(
    <div className={shell.overlay} onMouseDown={onClose}>
      <div className={`${shell.modal} ${styles.rankModal}`} onMouseDown={e => e.stopPropagation()} role="dialog" aria-label={`${isEng ? 'Engagement' : 'Days hydrated'} ranking`}>
        <div className={styles.rankModalHead}>
          <div className={styles.rankModalTitle}>
            <h2 className={base.sectionTitle}>{isEng ? 'Engagement' : 'Days hydrated'} ranking</h2>
            <span className={styles.muted}>{period}</span>
          </div>
          <IconButton aria-label="Close" onClick={onClose}><IconClose size={16} /></IconButton>
        </div>
        <ol ref={listRef} className={`${styles.rankList} ${styles.rankModalList}`}>
          {ranked.map(p => (
            <li key={p.id} data-me={p.id === player.id ? '' : undefined}>
              <div className={`${styles.rankRow} ${p.id === player.id ? styles.rankRowMe : ''}`}>
                <span className={styles.rankPos}>{p.rank}</span>
                <span className={styles.rankName}><Avatar name={p.name} photo={p.photo} size={24} />{p.name}</span>
                <span className={styles.rankValue}>{value(p)} {isEng ? (value(p) === 1 ? 'sample' : 'samples') : (value(p) === 1 ? 'day' : 'days')}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>,
    document.body,
  );
}

function TeamRanking({ rankings, player, period }) {
  // Versión "Full ranking" (5/11): a = "View full ranking" despliega la lista en su sitio; b = la abre en un
  // modal (no alarga una sola card, y aguanta equipos de 90)
  const [modalKind, setModalKind] = useState(null);
  const openFull = useVersion('rankMore') === 'b' ? setModalKind : undefined;
  const modal = modalKind && <RankingModal rankings={rankings} player={player} initialKind={modalKind} period={period} onClose={() => setModalKind(null)} />;
  const cards = useVersion('rankingCards') === 'b';
  // Título (5/11): el bloque A siempre con título; las cards B siempre sin él, como una fila más de KPIs
  // (Daniel: la versión "Ranking title" sobraba)
  const titled = !cards;
  // Days hydrated primero y por defecto (Daniel, 4/11), Engagement a la derecha; igual en las cards
  const [kind, setKind] = useState('hydrated');
  const isEng = kind === 'engagement';

  if (cards) return (
    // Sin título, las cards van como una segunda fila de KPIs: 24 arriba y entre ellas (Daniel, 5/11)
    <section className={`${styles.section} ${titled ? '' : styles.rankAsKpis}`}>
      {titled && <div className={base.sectionHeader}>
        <div className={base.sectionText}>
          <h2 className={base.sectionTitle}>Team ranking</h2>
        </div>
      </div>}
      <div className={styles.rankCards}>
        {[['hydrated', 'Days hydrated'], ['engagement', 'Engagement']].map(([k, label]) => (
          <div key={k} className={`${base.kpiCard} ${styles.rankCard}`}>
            {/* La "i" fuera de la etiqueta en mayúsculas: si no, el tooltip también salía en mayúsculas */}
            <span className={styles.titleRow}>
              <span className={`${base.kpiLabel} ${base.kpiLabelCaps}`}>{label}</span>
              <InfoTip label={`About ${label} ranking`}>{RANK_INFO[k]}</InfoTip>
            </span>
            <RankBody kind={k} rankings={rankings} player={player} onOpenFull={openFull} />
          </div>
        ))}
      </div>
      {modal}
    </section>
  );

  return (
    <section className={styles.section}>
      <div className={base.sectionHeader}>
        <div className={base.sectionText}>
          {/* El título dice qué ranking es, según el selector (Daniel, 4/11) */}
          {titled && <h2 className={`${base.sectionTitle} ${styles.titleRow}`}>
            {isEng ? 'Engagement ranking' : 'Hydration ranking'}
            <InfoTip label={`About ${isEng ? 'Engagement' : 'Hydration'} ranking`}>{RANK_INFO[kind]}</InfoTip>
          </h2>}
        </div>
        <SegmentedControl size="s" value={kind} onChange={setKind}
          options={[{ label: 'Days hydrated', value: 'hydrated' }, { label: 'Engagement', value: 'engagement' }]} />
      </div>
      <RankBody key={kind} kind={kind} rankings={rankings} player={player} onOpenFull={openFull} />
      {modal}
    </section>
  );
}

const TABLE_ROWS = 10; // en periodos largos son cientos de muestras: las 10 últimas y "Show all"

// Columnas ordenables, como la tabla de Daily (pedido de business, 11/11: Figma 779:59249).
// Por defecto, la más reciente arriba
const SAMPLE_SORT = {
  date: s => s.date.getTime(), score: s => s.score, usg: s => s.usg,
  electrolytes: s => s.electrolytes, color: s => s.color, volume: s => s.volume,
};

function SamplesTable({ samples, isDay, isToday, when }) {
  const [all, setAll] = useState(false);
  const [sortCol, setSortCol] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...samples].sort((a, b) => (SAMPLE_SORT[sortCol](a) - SAMPLE_SORT[sortCol](b)) * dir);
  }, [samples, sortCol, sortDir]);
  const shown = all ? sorted : sorted.slice(0, TABLE_ROWS);
  const handleSort = col => {
    if (sortCol !== col) { setSortCol(col); setSortDir(col === 'date' ? 'desc' : 'asc'); }
    else setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
  };
  const head = (col, label) => (
    <button type="button" className={base.sortBtn} onClick={() => handleSort(col)}>
      {label}
      <IconSort
        size={16}
        upColor={sortCol === col && sortDir === 'desc' ? 'var(--color-text-disabled)' : undefined}
        downColor={sortCol === col && sortDir === 'asc' ? 'var(--color-text-disabled)' : undefined}
      />
    </button>
  );
  // La "Last" de hoy marca la última muestra: solo tiene sentido con la más reciente arriba
  const lastFirst = sortCol === 'date' && sortDir === 'desc';
  return (
    <section className={styles.section}>
      <div className={base.sectionHeader}>
        <div className={base.sectionText}>
          {isDay
            ? <h2 className={base.sectionTitle}>{isToday ? "Today's samples" : `Samples ${when}`} ({samples.length})</h2>
            : (
              // Periodo (business, 11/11): título y "i" de Figma 779:59249, con el número como en un día (Daniel, 11/11)
              <h2 className={`${base.sectionTitle} ${styles.titleRow}`}>
                Detailed samples in selected period ({samples.length})
                <InfoTip label="About detailed samples">Every sample this player recorded in the selected period, one per row.</InfoTip>
              </h2>
            )}
        </div>
      </div>
      {samples.length === 0 ? <p className={styles.muted}>No samples {isDay ? when : 'in this period'}.</p> : (
        <TableScroll>
          <table className={`${base.table} ${styles.samplesTable}`}>
            <thead>
              {/* Alineación: Time a la izquierda y el resto centradas (regla de .table). En móvil, scroll
                  horizontal (Daniel, 11/11) */}
              <tr>
                <th>{head('date', isDay ? 'Time' : 'Date')}</th>
                <th className={base.highlight}>{head('score', 'Score')}</th>
                <th>{head('usg', 'USG')}</th>
                <th>{head('electrolytes', 'Electrolytes')}</th>
                <th>{head('color', 'Color')}</th>
                <th>{head('volume', 'Volume')}</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((s, i) => (
                <tr key={i}>
                  <td>
                    {isDay ? fmtTime(s.date) : <span className={styles.dateCell}>{fmtSampleDate(s.date)}<span className={styles.muted}>{fmtTime(s.date)}</span></span>}
                    {isToday && lastFirst && i === 0 && <span className={styles.muted}> · Last</span>}
                  </td>
                  <td className={base.highlight}><span className={base.scoreTag}><Dot color={getStatus(s.score).color} />{s.score}%</span></td>
                  <td>{formatUsg(s.usg)}</td>
                  <td>{s.electrolytes} mS/cm</td>
                  <td><span className={base.urine} style={urineStyle(s.color)}>{s.color}</span></td>
                  <td>{s.volume} mL</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>
      )}
      {samples.length > TABLE_ROWS && (
        <button type="button" className={styles.rankMore} onClick={() => setAll(v => !v)}>
          {all ? 'Show less' : `Show all ${samples.length} samples`}
        </button>
      )}
    </section>
  );
}

export default function UsersAnalytics({ team, range, stickySlot, initialPlayer = null }) {
  const isDay = range.preset === 'today' || Math.round((range.end - range.start) / DAY_MS) === 0;
  // Un día que no es hoy (4/11): se lee como un día cerrado, con su media; "last sample" es solo de hoy
  const isToday = isDay && range.end.toDateString() === TODAY.toDateString();
  const when = isToday ? 'today' : `on ${fmtDate(range.end)}`;
  const totalDays = Math.round((range.end - range.start) / DAY_MS) + 1;
  const prevLabel = range.preset === 'today' ? 'yesterday'
    : range.preset === 'lastYear' ? 'previous 12 months'
    : isDay ? 'previous day' : `previous ${totalDays} days`;

  // Un día: el mock de Daily (la tabla necesita el detalle de cada muestra). Periodo: los mismos días que
  // las gráficas, para que cards, ranking y gráficas cuadren
  const source = isDay ? getTeamHydration : periodHydration;
  const data = useMemo(() => source(team, range), [team, range, source]);
  const prevData = useMemo(() => source(team, shift(range, -totalDays)), [team, range, totalDays, source]);
  // Por dorsal (Daniel, 4/11): la lista, las flechas y el contador siguen este orden
  const players = useMemo(() => data.players.map(playerStats).sort((a, b) => a.number - b.number), [data]);
  const rankings = useMemo(() => buildRankings(players), [players]);

  // ?player=<id> abre con ese jugador (lo usará "View analytics" desde Daily)
  const [playerId, setPlayerId] = useState(() => initialPlayer ?? new URLSearchParams(window.location.search).get('player'));
  const player = players.find(p => p.id === playerId) ?? players.find(p => p.count > 0) ?? players[0];
  const prev = prevData.players.find(p => p.id === player.id);

  const last = player.samples[0];
  const score = isToday ? last?.score ?? null : player.average;
  const status = score !== null && score !== undefined ? getStatus(score) : null;
  const prevScore = prev?.average ?? null;
  const legend = useVersion('samplesLegend') === 'b';
  const [seg, setSeg] = useState(null);
  // En el orden de las franjas (de Severely a Over), como la barra de Daily
  const segs = HYDRATION_STATUSES.map(s => ({ ...s, count: player.counts[s.key] })).filter(s => s.count > 0);
  // Al pasar el ratón: "Dehydrated (21%)". En la B el número ya está junto al punto y no se repite
  // (Daniel, 5/11); en la A no hay número por franja, así que va delante del %
  const segText = sg => `${sg.label}${legend ? '' : ` · ${sg.count}`} (${Math.round(sg.count / player.count * 100)}%)`;

  return (
    <>
      <div className={styles.head}>
        <ProfileHeader players={players} player={player} onChange={setPlayerId} stickySlot={stickySlot} />
      </div>

      <div className={`${base.kpiRow} ${base.kpiRowCompact}`}>
        <div className={`${base.kpiCard} ${base.kpiCompact}`}>
          {/* Etiqueta = qué es el número; 2ª línea, siempre del jugador; 3ª, siempre del equipo (Daniel, 4/11).
              La hora de la última muestra queda en la tabla. "Team average" es propuesta nuestra (no venía
              de business) y puede salir más adelante. */}
          <span className={`${base.kpiLabel} ${base.kpiLabelCaps}`}>{isToday ? 'Last sample score' : 'Hydration score'}</span>
          <div className={base.kpiLine}>
            <span className={base.kpiMain}>
              <span className={base.kpiValue}>{status ? `${score}%` : '—'}</span>
              {status && <span className={`${base.rangeTag} ${base['rangeTag_' + status.key]} ${base.kpiTag}`}>{RANGE_TAG[status.key]}</span>}
            </span>
            <span className={base.kpiCompare}>
              {isToday
                ? (prevScore !== null ? `${prevScore}% yesterday` : 'No samples yesterday')
                : (prevScore !== null ? `${prevScore}% ${prevLabel}` : `No samples ${prevLabel}`)}
            </span>
            <span className={base.kpiCompare}>
              {data.teamScore !== null ? `${data.teamScore}% team average${isDay ? ` ${when}` : ''}` : ' '}
            </span>
          </div>
        </div>

        <div className={`${base.kpiCard} ${base.kpiCompact}`}>
          <span className={`${base.kpiLabel} ${base.kpiLabelCaps}`}>{isToday ? 'Samples today' : 'Samples'}</span>
          <div className={base.kpiLine}>
            <span className={`${base.kpiMain} ${base.kpiMainFill}`}>
              <span className={base.kpiValue}>{player.count}</span>
              {player.count > 0 && (
                <span className={base.distBar} onMouseLeave={() => setSeg(null)}>
                  {segs.map(s => (
                    <span key={s.key} className={base.distSeg} onMouseEnter={() => setSeg(s)}
                      style={{ flexGrow: s.count, background: s.color, opacity: seg && seg.key !== s.key ? 0.35 : 1 }} />
                  ))}
                </span>
              )}
            </span>
            {legend && player.count > 0 ? (
              /* Versión B (4/11): cada franja con su color y su número, sin nombre (el de la barra al pasar el
                 ratón, siempre a la vista). Solo las franjas con muestras, en el orden de la barra. El nombre
                 sale al pasar el ratón por el número o por su tramo, en la línea de abajo. */
              <span className={styles.legend} onMouseLeave={() => setSeg(null)}>
                {segs.map(s => (
                  <span key={s.key} className={styles.legendItem} onMouseEnter={() => setSeg(s)}
                    style={{ opacity: seg && seg.key !== s.key ? 0.35 : 1 }} aria-label={`${s.label}: ${s.count}`}>
                    <Dot color={s.color} />{s.count}
                  </span>
                ))}
              </span>
            ) : (
              <span className={base.kpiCompare}>
                {seg ? segText(seg) : samplesSummary(player, isDay, when)}
              </span>
            )}
            {/* En un día la 3ª línea va vacía para que las dos cards midan lo mismo lado a lado; en móvil,
                apiladas, se quita (Daniel, 11/11: solo dejaba aire) */}
            <span className={`${base.kpiCompare} ${isDay && !(legend && seg) ? styles.dayEmptyLine : ''}`}>
              {legend && seg ? segText(seg) : isDay ? '\u00a0' : `${player.days} of ${totalDays} days with samples`}
            </span>
          </div>
        </div>
      </div>

      {/* En un día no hay ranking (Daniel, 4/11): con 0-3 muestras por jugador medio equipo empata. La card ya
          compara con el equipo. Ranking de temporada: pregunta para business. */}
      {!isDay && <TeamRanking rankings={rankings} player={player} period={range.preset !== 'custom' ? CALENDAR_PRESETS.find(p => p.key === range.preset).label : `${fmtDate(range.start)} – ${fmtDate(range.end)}`} />}

      {/* Periodo: las gráficas del jugador, cada una separada, con la media del equipo (Daniel, 4/11).
          Debajo del ranking (Daniel, 4/11): el puesto va con las cards; las gráficas son largas y lo enterraban */}
      {!isDay && <PlayerCharts team={team} player={player} range={range} />}

      {/* Tabla de muestras: en un día, sola; en un periodo, debajo de las gráficas (business, 11/11:
          sustituye al "en un periodo, sin tabla" del 4/11) */}
      <SamplesTable samples={player.samples} isDay={isDay} isToday={isToday} when={when} />
    </>
  );
}
