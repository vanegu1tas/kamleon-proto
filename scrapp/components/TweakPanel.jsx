import { useState } from 'react';
import KeyButton from './KeyButton';
import Morph from './Morph';
import styles from './TweakPanel.module.css';

/**
 * Panel de ajustes de las exploraciones (andamiaje del proto, no producto). 17/10.
 *
 * Mecánicas de DialKit, aspecto neo-skeuomórfico con referencias de Teenage Engineering:
 *   · el panel sale de una tecla con engranaje arriba a la derecha y vuelve a ella (Morph)
 *   · cada grupo es una carpeta plegable; plegada sigue mostrando el valor elegido
 *   · se construye solo desde la configuración: con 2 opciones, interruptor segmentado;
 *     con 3 o más, teclas en rejilla
 *   · control: 'keycaps' → teclas OP-1 (KeyButton) sueltas, sin pozo; cada opción puede llevar
 *     un punto de color (dot) o un texto corto (cap) en el círculo. columns: 2 (rectangulares,
 *     por defecto) o más (cuadradas); una opción con wide ocupa la fila entera, rectangular.
 *
 * Uso:
 *   <TweakPanel title="Dorsal grande" groups={[
 *     { id: 'team', label: 'Equipo', value, onChange,
 *       options: [{ value: 'dallas', label: 'Dallas', swatch: '#003594' }, …] },
 *   ]} />
 *
 * Lo plegado se recuerda por exploración en este navegador (solo comodidad).
 */
export default function TweakPanel({ title, groups }) {
  const [state, setState] = useState(() => load(title));
  const update = next => { setState(next); save(title, next); };
  const toggleFolder = id => update({ ...state, closed: { ...state.closed, [id]: !state.closed[id] } });

  // arriba a la derecha, a la altura del ☰: la tecla del engranaje se convierte en el panel (Morph)
  return (
    <div className={styles.dock}>
      <Morph
        side="right"
        open={!state.collapsed}
        onToggle={() => update({ ...state, collapsed: !state.collapsed })}
        label="Ajustes"
        icon={<GearIcon />}
        iconOpen={<CloseIcon />}
        title={<span className={styles.title}>{title}</span>}
        contentClassName={styles.panel}
      >
      {groups.map(g => {
        const open = !state.closed[g.id];
        const current = g.options.find(o => o.value === g.value);
        return (
          <section key={g.id} className={styles.folder}>
            <button className={styles.folderHead} onClick={() => toggleFolder(g.id)} aria-expanded={open}>
              <span className={`${styles.caret} ${open ? styles.caretOpen : ''}`} aria-hidden="true">▸</span>
              <span className={styles.folderLabel}>{g.label}</span>
              <span className={styles.folderValue}>{current?.label}</span>
            </button>
            {open && g.control === 'keycaps' && <Keycaps group={g} />}
            {open && g.control !== 'keycaps' && (
              <div className={styles.well}>
                {g.options.length === 2
                  ? <Segmented group={g} />
                  : <Keys group={g} />}
              </div>
            )}
          </section>
        );
      })}
      </Morph>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function Keys({ group }) {
  return (
    <div className={styles.keys}>
      {group.options.map(o => {
        const active = o.value === group.value;
        return (
          <button
            key={o.value}
            className={`${styles.key} ${active ? styles.keyActive : ''}`}
            onClick={() => group.onChange(o.value)}
            aria-pressed={active}
          >
            {o.swatch && <span className={styles.swatch} style={{ background: o.swatch }} />}
            <span className={styles.keyLabel}>{o.label}</span>
            <span className={`${styles.keyLed} ${active ? styles.keyLedOn : ''}`} />
          </button>
        );
      })}
    </div>
  );
}

// Teclas OP-1 con su nombre serigrafiado debajo; la elegida la marca el LED.
//   columns 2 (por defecto): rectangulares, sueltas, a media fila cada una (wide: fila entera)
//   labelInCap: el nombre va escrito en la tecla, junto al punto, en vez de debajo
//   led: color del LED de esa opción al encenderse (p. ej. el color del equipo)
//   slot (con 2 columnas): las wide sueltas arriba y el resto juntas en un hueco oscuro
//   flat: teclas lisas, sin el relieve del centro · keyHeight: alto de las teclas (48 por defecto)
//   columns 3+: cuadradas, seguidas en un mismo hueco (como un banco de teclas); las opciones con
//   wide van al lado, aparte, rectangulares, llenando el resto de la fila
function Keycaps({ group }) {
  const columns = group.columns ?? 2;
  const key = o => {
    const active = o.value === group.value;
    return (
      <KeyButton key={o.value} momentary flat={group.flat} wide={columns === 2 || o.wide} on={active}
        style={group.keyHeight ? { height: group.keyHeight } : undefined}
        ledColor={o.led}
        onClick={() => group.onChange(o.value)} aria-pressed={active} aria-label={o.label}>
        {o.dot && <span className={`${styles.dot} ${o.dotOutline ? styles.dotOutline : ''}`} style={{ background: o.dot }} />}
        {o.cap != null && <span className={styles.capText}>{o.cap}</span>}
        {group.labelInCap && <span className={styles.capText}>{o.label}</span>}
      </KeyButton>
    );
  };
  const label = o => (
    <span key={o.value} className={`${styles.keycapLabel} ${o.value === group.value ? styles.keycapLabelOn : ''}`}>{o.label}</span>
  );

  // slot: las de fila entera (wide) van sueltas arriba; el resto, 2 por fila, en un mismo hueco oscuro
  if (columns === 2 && group.slot) {
    const loose = group.options.filter(o => o.wide);
    const inSlot = group.options.filter(o => !o.wide);
    return (
      <div className={styles.keycapsColumn}>
        {loose.map(key)}
        <div className={styles.slot} style={{ gridTemplateColumns: '1fr 1fr' }}>{inSlot.map(key)}</div>
      </div>
    );
  }

  if (columns === 2) {
    return (
      <div className={styles.keycaps}>
        {group.options.map(o => (
          <div key={o.value} className={`${styles.keycap} ${o.wide ? styles.keycapWide : ''}`}>
            {key(o)}{!group.labelInCap && label(o)}
          </div>
        ))}
      </div>
    );
  }

  const bank = group.options.filter(o => !o.wide);
  const rest = group.options.filter(o => o.wide);
  return (
    <div className={styles.keycapsStack}>
      <div className={styles.bank} style={{ '--keys': bank.length }}>
        <div className={styles.slot}>{bank.map(key)}</div>
        <div className={styles.bankLabels}>{bank.map(label)}</div>
      </div>
      {rest.map(o => <div key={o.value} className={styles.keycap}>{key(o)}{label(o)}</div>)}
    </div>
  );
}

// Dos opciones: una pieza en relieve que se desliza entre las dos, como un interruptor
function Segmented({ group }) {
  const index = Math.max(0, group.options.findIndex(o => o.value === group.value));
  return (
    <div className={styles.segmented}>
      <span className={styles.thumb} style={{ transform: `translateX(${index * 100}%)` }} />
      {group.options.map((o, i) => (
        <button
          key={o.value}
          className={`${styles.segment} ${i === index ? styles.segmentActive : ''}`}
          onClick={() => group.onChange(o.value)}
          aria-pressed={i === index}
        >
          {o.label}
          {i === index && <span className={`${styles.keyLed} ${styles.keyLedOn}`} />}
        </button>
      ))}
    </div>
  );
}

const KEY = title => `tweakpanel:${title}`;
function load(title) {
  try {
    const v = JSON.parse(localStorage.getItem(KEY(title)));
    if (v && typeof v === 'object') return { collapsed: !!v.collapsed, closed: v.closed ?? {} };
  } catch {}
  return { collapsed: false, closed: {} };
}
function save(title, v) {
  try { localStorage.setItem(KEY(title), JSON.stringify(v)); } catch {}
}
