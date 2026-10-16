import { useLayoutEffect, useRef, useState } from 'react';
import styles from './RosterScreen.module.css';
import QrPlaceholder from '../../../../components/QrPlaceholder';
import { initialsFor, paginate } from '../data/rosters';

/**
 * Fast Track pulida · plantilla con pestañas de rangos + "Staff" arriba a la derecha.
 * Copia de la exploración 4 (screens/RosterScreen con qrMode="button"), con el tema del equipo y
 * las transiciones. Sin fondo propio: el fondo del equipo lo pone FlowRunner, detrás de todo.
 *
 * Transiciones (solo posición, escala y opacidad; nada pasa de 400 ms):
 *   T1  al entrar, las caras aparecen en cascada                         (phase="enter")
 *   T2  al cambiar de rango, el resaltado se desliza y la cuadrícula entra de lado
 *   T3  al tocar una cara, todo se apaga menos ella (el vuelo lo hace Ready) (phase="leaving")
 *   T4  al volver de Ready, la plantilla reaparece                        (phase="returning")
 *   T5  Staff: el QR entra creciendo
 */
export default function RosterScreen({
  players, pageSize = 20, denseCols = 8, tab, onTab, phase = 'idle', selectedId,
  onSelect, onScanQr,
}) {
  const pages = paginate(players, pageSize);
  const showStaff = tab === 'staff';
  const pageIndex = typeof tab === 'number' ? Math.min(tab, pages.length - 1) : 0;
  const page = pages[pageIndex];
  const hasRanges = pages.length > 1;

  // T2: solo al tocar otro rango la cuadrícula entra de lado (por el lado del cambio). Las demás
  // transiciones no la deslizan.
  const [slide, setSlide] = useState(null);
  function goTo(next) {
    if (typeof next === 'number' && next !== pageIndex) setSlide(next > pageIndex ? 'fromRight' : 'fromLeft');
    onTab(next);
  }

  // T2: el resaltado de la pestaña activa es una sola pieza que se desliza
  const tabRefs = useRef([]);
  const [pill, setPill] = useState(null);
  useLayoutEffect(() => {
    const el = tabRefs.current[pageIndex];
    if (!hasRanges || showStaff || !el) { setPill(null); return; }
    setPill({ x: el.offsetLeft, w: el.offsetWidth });
  }, [pageIndex, hasRanges, showStaff, pages.length]);

  const dense   = pageSize > 20;
  const wide    = dense && denseCols === 8;
  const maxCols = dense ? denseCols : 5;
  const count   = page?.players.length ?? 0;
  const rows    = Math.max(1, Math.ceil(count / maxCols));
  const cols    = Math.ceil(count / rows);
  const rowH    = !dense ? 136 : wide ? 128 : 108;
  const free    = 800 - 88 - (hasRanges ? 80 : 0) - 24 - rows * rowH;
  const rowGap  = Math.round(Math.min(56, Math.max(dense ? 12 : 16, free / rows)));
  const gridStyle = {
    gridTemplateColumns: `repeat(${cols}, ${!dense ? 200 : wide ? 140 : 176}px)`,
    rowGap,
  };

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
          className={`${styles.pressable} ${styles.staffButton} ${showStaff ? styles.staffActive : ''}`}
          onClick={() => goTo(showStaff ? pageIndex : 'staff')}
        >
          Staff
        </button>
      </header>

      {hasRanges && (
        <nav className={styles.tabs} aria-label="Roster">
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
            className={`${styles.grid} ${dense ? styles.dense : ''} ${wide ? styles.wide : ''} ${slide ? styles[slide] : ''}`}
            style={gridStyle}
          >
            {page.players.map((p, i) => (
              <button
                key={p.id}
                className={`${styles.player} ${p.id === selectedId ? styles.selected : ''}`}
                style={{ '--i': i }}
                onClick={e => select(p, e.currentTarget.firstChild)}
              >
                {p.photo
                  ? <img className={styles.photo} src={p.photo} alt="" />
                  : <span className={`${styles.photo} ${styles.initials}`}>{initialsFor(p.name)}</span>}
                <span className={styles.label}>
                  <span className={styles.number}>{p.number}</span>
                  <span className={styles.name}>{p.short}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
