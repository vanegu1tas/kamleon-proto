import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './RosterScreen.module.css';
import QrPlaceholder from '../../../../components/QrPlaceholder';
import { paginate } from '../data/rosters';
import Avatar from './Avatar';

const PAGE_SIZE = 20;
const COLS      = 7;   // siempre 7: cada rango se llena como una grilla fija, igual que el primero

/**
 * Fast Track · Dorsal grande · plantilla con pestañas de rangos + "Staff" arriba a la derecha.
 * Copia de la pulida (mismo tema y transiciones) con la celda de la exploración de Daniel en Figma
 * (Scrapp explorations 2029:2815, 17/10): el apellido en arco arriba, como en la espalda de la
 * camiseta; el dorsal enorme y la foto pequeña en su esquina. 20 por página en 7 columnas.
 *
 * Transiciones (solo posición, escala y opacidad; nada pasa de 400 ms):
 *   T1  al entrar, las caras aparecen en cascada                         (phase="enter")
 *   T2  al cambiar de rango, el resaltado se desliza y la cuadrícula entra de lado
 *   T3  al tocar una cara, todo se apaga menos ella (el vuelo lo hace Ready) (phase="leaving")
 *   T4  al volver de Ready, la plantilla reaparece                        (phase="returning")
 *   T5  Staff: el QR entra creciendo; las pestañas se apagan y "Staff" pasa a "‹ Players"
 */
// Staff (17/10, tras la critique): si nadie escanea, la plantilla vuelve sola para el siguiente
const STAFF_IDLE_MS = 20000;

export default function RosterScreen({
  players, tab, onTab, phase = 'idle', selectedId,
  onSelect, onScanQr,
}) {
  const pages = paginate(players, PAGE_SIZE);
  const showStaff = tab === 'staff';
  const pageIndex = typeof tab === 'number' ? Math.min(tab, pages.length - 1) : 0;
  const page = pages[pageIndex];
  const hasRanges = pages.length > 1;

  // T2: solo al tocar otro rango la cuadrícula entra de lado (por el lado del cambio). Las demás
  // transiciones no la deslizan.
  const [slide, setSlide] = useState(null);
  function goTo(next) {
    if (typeof next === 'number' && !showStaff && next !== pageIndex) setSlide(next > pageIndex ? 'fromRight' : 'fromLeft');
    else if (showStaff) setSlide(null);
    onTab(next);
  }

  // Al salir de Staff se vuelve al rango en el que estaba, no al primero
  const lastPage = useRef(pageIndex);
  if (!showStaff) lastPage.current = pageIndex;
  const backToPlayers = () => goTo(lastPage.current);

  useEffect(() => {
    if (!showStaff) return;
    const t = setTimeout(backToPlayers, STAFF_IDLE_MS);
    return () => clearTimeout(t);
  }, [showStaff]);

  // T2: el resaltado de la pestaña activa es una sola pieza que se desliza
  const tabRefs = useRef([]);
  const [pill, setPill] = useState(null);
  useLayoutEffect(() => {
    const el = tabRefs.current[pageIndex];
    if (!hasRanges || showStaff || !el) { setPill(null); return; }
    setPill({ x: el.offsetLeft, w: el.offsetWidth });
  }, [pageIndex, hasRanges, showStaff, pages.length]);

  const gridStyle = { gridTemplateColumns: `repeat(${COLS}, 142px)` };

  const rootRef = useRef(null);

  function select(p, photoEl) {
    // posición de la foto en coordenadas de la pantalla (1280 × 800), sin el scale() del marco
    const root = rootRef.current.getBoundingClientRect();
    const r = photoEl.getBoundingClientRect();
    const k = 1280 / root.width;
    onSelect(p, { x: (r.left - root.left) * k, y: (r.top - root.top) * k, size: r.width * k });
  }

  return (
    <div ref={rootRef} className={`${styles.screen} ${styles[phase] ?? ''}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Choose your profile</h1>
        <button
          className={`${styles.pressable} ${styles.staffButton}`}
          onClick={() => (showStaff ? backToPlayers() : goTo('staff'))}
        >
          {showStaff ? '‹ Players' : 'Staff'}
        </button>
      </header>

      {hasRanges && (
        <nav className={`${styles.tabs} ${showStaff ? styles.tabsHidden : ''}`} aria-label="Roster" aria-hidden={showStaff}>
          <div className={styles.tabGroup}>
            {pill && <span className={styles.pill} style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} />}
            {pages.map((p, i) => (
              <button
                key={p.label}
                ref={el => { tabRefs.current[i] = el; }}
                className={`${styles.pressable} ${styles.tab} ${!showStaff && i === pageIndex ? styles.tabActive : ''}`}
                onClick={() => goTo(i)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      <main className={styles.body}>
        {showStaff ? (
          <div className={styles.staffPanel}>
            <button className={`${styles.pressable} ${styles.staffQr}`} onClick={onScanQr} aria-label="Scan QR">
              <QrPlaceholder size={260} color="#ffffff" />
            </button>
            <p className={styles.staffText}>Scan with your phone to sign in</p>
          </div>
        ) : (
          <div
            key={pageIndex}
            className={`${styles.grid} ${slide ? styles[slide] : ''}`}
            style={gridStyle}
          >
            {page.players.map((p, i) => (
              <button
                key={p.id}
                className={`${styles.player} ${p.id === selectedId ? styles.selected : ''}`}
                style={{ '--i': i }}
                onClick={e => select(p, e.currentTarget.querySelector('[data-photo]'))}
              >
                <JerseyName id={p.id} name={p.short} />
                <span className={styles.face}>
                  <span className={styles.bigNumber}>{p.number}</span>
                  <Avatar data-photo person={p} className={styles.photo} initialsClassName={styles.initials} />
                </span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// El apellido sobre el arco superior de una elipse de 138 × 26, como en Figma: el bloque mide 25 px
// de alto, la cima del arco queda a 12 px y las letras van centradas sobre la línea (no apoyadas).
// Tamaño por medición, no por número de letras (una W ocupa el triple que una i): 20 si cabe, si no
// 16, y si ni a 16 cabe, se juntan las letras hasta que quepa (sin bajar de 16, que es token).
const ARC_MAX = 140;   // el arco mide 144; 2 px de margen por lado

function JerseyName({ id, name }) {
  const textRef = useRef(null);
  const [fit, setFit] = useState({ size: 20, squeeze: false });
  useLayoutEffect(() => {
    const el = textRef.current;
    el.setAttribute('font-size', 20);
    if (el.getComputedTextLength() <= ARC_MAX) return setFit({ size: 20, squeeze: false });
    el.setAttribute('font-size', 16);
    setFit({ size: 16, squeeze: el.getComputedTextLength() > ARC_MAX });
  }, [name]);

  return (
    <svg className={styles.jerseyName} viewBox="0 0 138 25" aria-label={name}>
      <path id={`arc-${id}`} d="M 0 25 A 69 13 0 0 1 138 25" fill="none" />
      <text textAnchor="middle" dominantBaseline="central" fontSize={fit.size}>
        <textPath
          ref={textRef}
          href={`#arc-${id}`}
          startOffset="50%"
          {...(fit.squeeze ? { textLength: ARC_MAX, lengthAdjust: 'spacing' } : {})}
        >
          {name}
        </textPath>
      </text>
    </svg>
  );
}
