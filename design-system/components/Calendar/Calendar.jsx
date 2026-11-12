import { useState, useRef, useEffect } from 'react';
import Button from '../Button/Button';
import Input from '../Input/Input';
import { IconChevronDown, IconChevronMiniDown, IconCheckCircle } from '../../icons/outline';
import styles from './Calendar.module.css';

/**
 * Calendar
 *
 * Selector de fecha o rango (Figma Design System, component set "Calendar", nodo 2389:2479).
 * Dos estados: Default (preset + calendario) y Custom range (suma los campos Start/End date).
 * Con `mode="single"` solo se elige un día: sin presets ni rangos (Hydration analytics).
 *
 * Un preset del desplegable se aplica al elegirlo; los días elegidos en el calendario y Custom range
 * esperan a Apply. Cancel descarta.
 *
 * @param {('range'|'single')} mode - 'range' por defecto
 * @param {object}   value    - { preset, start, end } (start/end son Date; en single, start = end)
 * @param {Date}     today    - "Hoy" (en el proto es fijo); los días posteriores no se eligen
 * @param {function} onApply  - Recibe el nuevo { preset, start, end }
 * @param {function} onCancel
 * @param {('dropdown'|'list'|'side')} [layout='dropdown'] - Cómo se ofrecen los presets (exploración
 *   3/11, Hydration analytics). dropdown: el desplegable "Date range" encima del calendario (el de
 *   siempre) · list: primero solo la lista; un preset se aplica al tocarlo y Custom range abre el
 *   calendario · side: la lista a la izquierda y el calendario a la derecha, con Apply.
 */

// Nombres literales, como Google Analytics / Stripe (Daniel, 3/11): "Last week" se leía como la
// semana calendario anterior y "Last month" como el mes anterior completo, y son días hasta hoy.
// Las keys no cambian.
export const CALENDAR_PRESETS = [
  { key: 'today',       label: 'Today',          days: 1   },
  { key: 'lastWeek',    label: 'Last 7 days',    days: 7   },
  { key: 'lastMonth',   label: 'Last 30 days',   days: 30  },
  { key: 'lastQuarter', label: 'Last 90 days',   days: 90  },
  { key: 'lastYear',    label: 'Last 12 months', days: 365 },
  { key: 'custom',      label: 'Custom range' },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const YEARS_BACK = 6;

export function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function sameDay(a, b) { return !!a && !!b && a.getTime() === b.getTime(); }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }

export function presetRange(key, today) {
  const preset = CALENDAR_PRESETS.find(p => p.key === key);
  const end = startOfDay(today);
  return { preset: key, start: addDays(end, -(preset.days - 1)), end };
}

function toInput(d) {
  if (!d) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function fromInput(text) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!m) return null;
  const d = new Date(+m[3], +m[2] - 1, +m[1]);
  return d.getMonth() === +m[2] - 1 ? d : null;
}

function useOutside(open, close) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    function onDown(e) { if (ref.current && !ref.current.contains(e.target)) close(); }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, close]);
  return ref;
}

function Menu({ items, selected, onSelect, className }) {
  return (
    <div className={`${styles.list} ${className ?? ''}`} role="menu">
      {items.map((item, i) => item.separator ? (
        <span key={i} className={styles.listSeparator} />
      ) : (
        <button
          key={item.value}
          type="button"
          role="menuitem"
          className={styles.listItem}
          disabled={item.disabled}
          onClick={() => onSelect(item.value)}
        >
          {item.label}
          {item.value === selected && <span className={styles.check}><IconCheckCircle size={16} /></span>}
        </button>
      ))}
    </div>
  );
}

const PRESET_ITEMS = [
  ...CALENDAR_PRESETS.filter(p => p.key !== 'custom').map(p => ({ value: p.key, label: p.label })),
  { separator: true },
  { value: 'custom', label: 'Custom range' },
];

export default function Calendar({ mode = 'range', value, today = new Date(), onApply, onCancel, layout = 'dropdown' }) {
  const single = mode === 'single';
  const todayDay = startOfDay(today);
  const [draft, setDraft] = useState(value);
  const [view, setView]   = useState(() => new Date((value.end ?? todayDay).getFullYear(), (value.end ?? todayDay).getMonth(), 1));
  const [menu, setMenu]   = useState(null); // 'range' | 'month' | 'year'
  const [step, setStep]   = useState(layout === 'list' ? 'list' : 'calendar'); // layout list: lista → calendario
  const [startText, setStartText] = useState(toInput(value.start));
  const [endText, setEndText]     = useState(toInput(value.end));
  const closeMenu = () => setMenu(null);
  const rangeRef = useOutside(menu === 'range', closeMenu);
  const monthRef = useOutside(menu === 'month', closeMenu);
  const yearRef  = useOutside(menu === 'year', closeMenu);

  const isCustom = draft.preset === 'custom';
  const presetLabel = CALENDAR_PRESETS.find(p => p.key === draft.preset)?.label;

  function setRange(next) {
    setDraft(next);
    setStartText(toInput(next.start));
    setEndText(toInput(next.end));
  }

  function choosePreset(key) {
    setMenu(null);
    if (key === 'custom') { setRange({ ...draft, preset: 'custom' }); return; }
    const next = presetRange(key, todayDay);
    // En el desplegable, un preset se aplica al elegirlo (Daniel, 3/11); Apply queda para los días
    // elegidos en el calendario y para Custom range
    if (layout === 'dropdown') { onApply(next); return; }
    setRange(next);
    setView(new Date(next.end.getFullYear(), next.end.getMonth(), 1));
  }

  // Un clic fija el inicio; el segundo, el final. Elegir un día pasa siempre a Custom range.
  // En single, el clic elige ese día y listo.
  function pickDay(day) {
    if (single) {
      setDraft({ preset: sameDay(day, todayDay) ? 'today' : 'custom', start: day, end: day });
    } else if (!isCustom || !draft.start || draft.end) {
      setRange({ preset: 'custom', start: day, end: null });
    } else if (day < draft.start) {
      setRange({ preset: 'custom', start: day, end: draft.start });
    } else {
      setRange({ preset: 'custom', start: draft.start, end: day });
    }
  }

  // Arrastrar (Daniel, 3/11): apretar en un día y deslizar marca el rango hasta donde se suelte, con
  // ratón o con el dedo (tablet). Sin arrastrar sigue el clic + clic. Se busca el día bajo el puntero
  // con elementFromPoint porque en táctil el dedo no dispara enter en los otros días.
  const drag = useRef(null);
  // Vista previa (Daniel, 3/11): con el inicio elegido y sin fin, pasar el ratón por un día marca en
  // estado hover los días entre el inicio y ese día, hasta el clic
  const [hoverDay, setHoverDay] = useState(null);
  useEffect(() => {
    const end = () => { drag.current = null; };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    return () => { window.removeEventListener('pointerup', end); window.removeEventListener('pointercancel', end); };
  }, []);

  function pressDay(day) {
    if (single || (isCustom && draft.start && !draft.end)) { pickDay(day); return; }
    setRange({ preset: 'custom', start: day, end: null });
    drag.current = { anchor: day, moved: false };
  }

  function dragOver(e) {
    if (!drag.current) return;
    const btn = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-day]');
    if (!btn || btn.disabled) return;
    const day = new Date(Number(btn.dataset.day));
    const { anchor } = drag.current;
    if (sameDay(day, anchor) && !drag.current.moved) return;
    drag.current.moved = true;
    setRange(day < anchor ? { preset: 'custom', start: day, end: anchor } : { preset: 'custom', start: anchor, end: day });
  }

  function typeDate(which, text) {
    which === 'start' ? setStartText(text) : setEndText(text);
    const d = fromInput(text);
    if (!d || d > todayDay) return;
    const next = { ...draft, preset: 'custom', [which]: d };
    if (next.start && next.end && next.end < next.start) return;
    setDraft(next);
    setView(new Date(d.getFullYear(), d.getMonth(), 1));
  }

  function shiftMonth(n) {
    const next = new Date(view.getFullYear(), view.getMonth() + n, 1);
    if (next > todayDay) return;
    setView(next);
  }

  const first = view.getDay();
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((first + daysInMonth) / 7) * 7 }, (_, i) => {
    const n = i - first + 1;
    return n >= 1 && n <= daysInMonth ? new Date(view.getFullYear(), view.getMonth(), n) : null;
  });
  const weeks = Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
  // Un solo día tocado también vale: Apply lo aplica como rango de un día (Daniel, 4/11; antes había que tocarlo dos veces)
  const canApply = !!draft.start;
  const nextMonthDisabled = new Date(view.getFullYear(), view.getMonth() + 1, 1) > todayDay;

  // layout list, primer paso: solo los presets. Uno se aplica al tocarlo; Custom range abre el calendario.
  if (layout === 'list' && step === 'list' && !single) {
    return (
      <div className={`${styles.calendar} ${styles.presetPanel}`}>
        <Menu
          className={styles.listStatic}
          items={PRESET_ITEMS}
          selected={value.preset}
          onSelect={key => {
            if (key === 'custom') { setRange({ ...draft, preset: 'custom' }); setStep('calendar'); return; }
            onApply(presetRange(key, todayDay));
          }}
        />
      </div>
    );
  }

  const panel = (
    <div className={`${styles.calendar} ${layout === 'side' ? styles.calendarFlat : ''}`}>

      {!single && layout !== 'side' && <div className={styles.rangeHeader}>
        <span className={styles.rangeLabel}>Date range</span>
        <div className={styles.anchor} ref={rangeRef}>
          <button type="button" className={styles.rangePill} onClick={() => setMenu(m => m === 'range' ? null : 'range')}>
            {presetLabel}
            <IconChevronMiniDown size={24} />
          </button>
          {menu === 'range' && (
            <Menu
              items={[
                ...CALENDAR_PRESETS.filter(p => p.key !== 'custom').map(p => ({ value: p.key, label: p.label })),
                { separator: true },
                { value: 'custom', label: 'Custom range' },
              ]}
              selected={draft.preset}
              onSelect={choosePreset}
            />
          )}
        </div>
      </div>}

      {isCustom && !single && (
        <div className={styles.inputs}>
          <Input label="Start date" placeholder="dd/mm/yyyy" value={startText} onChange={t => typeDate('start', t)} />
          <Input label="End date"   placeholder="dd/mm/yyyy" value={endText}   onChange={t => typeDate('end', t)} />
        </div>
      )}

      <div className={styles.monthHeader}>
        <button type="button" className={styles.navBtn} onClick={() => shiftMonth(-1)} aria-label="Previous month">
          <span className={styles.chevronLeft}><IconChevronDown size={24} /></span>
        </button>
        <div className={styles.monthPickers}>
          <div className={styles.anchor} ref={monthRef}>
            <button type="button" className={styles.picker} onClick={() => setMenu(m => m === 'month' ? null : 'month')}>
              {MONTHS[view.getMonth()]}
              <IconChevronMiniDown size={16} />
            </button>
            {menu === 'month' && (
              <Menu
                className={styles.listScroll}
                items={MONTHS.map((m, i) => ({ value: i, label: m, disabled: new Date(view.getFullYear(), i, 1) > todayDay }))}
                selected={view.getMonth()}
                onSelect={i => { setView(new Date(view.getFullYear(), i, 1)); setMenu(null); }}
              />
            )}
          </div>
          <div className={styles.anchor} ref={yearRef}>
            <button type="button" className={styles.picker} onClick={() => setMenu(m => m === 'year' ? null : 'year')}>
              {view.getFullYear()}
              <IconChevronMiniDown size={16} />
            </button>
            {menu === 'year' && (
              <Menu
                items={Array.from({ length: YEARS_BACK }, (_, i) => ({ value: todayDay.getFullYear() - i, label: String(todayDay.getFullYear() - i) }))}
                selected={view.getFullYear()}
                onSelect={y => {
                  const month = new Date(y, view.getMonth(), 1) > todayDay ? todayDay.getMonth() : view.getMonth();
                  setView(new Date(y, month, 1));
                  setMenu(null);
                }}
              />
            )}
          </div>
        </div>
        <button type="button" className={styles.navBtn} onClick={() => shiftMonth(1)} disabled={nextMonthDisabled} aria-label="Next month">
          <span className={styles.chevronRight}><IconChevronDown size={24} /></span>
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.weekdays}>
          {WEEKDAYS.map(d => <span key={d}>{d}</span>)}
        </div>
        <div className={styles.days} onPointerMove={dragOver} onPointerLeave={() => setHoverDay(null)}>
          {weeks.map((week, w) => (
            <div key={w} className={styles.week}>
              {week.map((day, i) => {
                if (!day) return <span key={i} className={styles.day} />;
                const isEdge = sameDay(day, draft.start) || sameDay(day, draft.end);
                const inRange = draft.start && draft.end && day > draft.start && day < draft.end;
                const oneDay = sameDay(draft.start, draft.end);
                const previewing = !single && isCustom && draft.start && !draft.end && hoverDay && !sameDay(hoverDay, draft.start);
                const forward = previewing && hoverDay > draft.start;
                const lo = previewing && (forward ? draft.start : hoverDay), hi = previewing && (forward ? hoverDay : draft.start);
                const inPreview = previewing && day > lo && day < hi;
                const previewEnd = previewing && sameDay(day, hoverDay);
                const previewStart = previewing && sameDay(day, draft.start);
                return (
                  <span
                    key={i}
                    className={[
                      styles.dayWrap,
                      inRange ? styles.inRange : '',
                      // La banda se corta en el borde de cada semana: domingo y sábado la redondean
                      inRange && i === 0 ? styles.bandRoundLeft : '',
                      inRange && i === 6 ? styles.bandRoundRight : '',
                      !oneDay && sameDay(day, draft.start) && draft.end && i !== 6 ? styles.rangeStart : '',
                      !oneDay && sameDay(day, draft.end) && i !== 0 ? styles.rangeEnd : '',
                      inPreview ? styles.preview : '',
                      inPreview && i === 0 ? styles.bandRoundLeft : '',
                      inPreview && i === 6 ? styles.bandRoundRight : '',
                      previewEnd ? `${styles.preview} ${forward ? styles.bandRoundRight : styles.bandRoundLeft}` : '',
                      previewStart && (forward ? i !== 6 : i !== 0) ? (forward ? styles.previewFromStart : styles.previewToStart) : '',
                    ].join(' ')}
                  >
                    <button
                      type="button"
                      className={`${styles.day} ${isEdge || inRange ? styles.daySelected : ''}`}
                      disabled={day > todayDay}
                      data-day={day.getTime()}
                      onPointerEnter={() => setHoverDay(day)}
                      onPointerDown={e => { if (e.button === 0) pressDay(day); }}
                      // Solo teclado (detail 0): con ratón o dedo ya lo hizo onPointerDown
                      onClick={e => { if (e.detail === 0) pickDay(day); }}
                    >
                      {day.getDate()}
                    </button>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.buttons}>
        <Button variant="tertiary" size="s" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" size="s" onClick={() => onApply(draft.end ? draft : { ...draft, end: draft.start })} disabled={!canApply}>Apply</Button>
      </div>
    </div>
  );

  // layout side: la lista siempre a la vista, a la izquierda; elegir marca los días y Apply confirma
  if (layout === 'side' && !single) {
    return (
      <div className={styles.sideWrap}>
        <Menu className={`${styles.listStatic} ${styles.sideList}`} items={PRESET_ITEMS} selected={draft.preset} onSelect={choosePreset} />
        {panel}
      </div>
    );
  }
  return panel;
}
