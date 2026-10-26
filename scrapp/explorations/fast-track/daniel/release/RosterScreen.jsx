import { useEffect, useRef, useState } from 'react';
import styles from './RosterScreen.module.css';
import QrPlaceholder from '../../../../components/QrPlaceholder';
import { paginate } from '../data/rosters';
import Avatar from './Avatar';

/**
 * Fast Track · primer release (22/10). Copia de la Pulida con los comentarios del cliente:
 *   · 30 jugadores por pantalla. Para probar, la rejilla es columnas × filas (`cols`, `rows`) y la
 *     página lleva las que quepan: 6×5 = 30, 7×4 = 28, 7×5 = 35, 8×4 = 32
 *   · fotos grandes; dorsal (en azul, `--number`) y apellido debajo de la foto
 *   · Staff arriba a la derecha → el QR (mismo tamaño y sitio que en Dorsal grande)
 *   · sin pestañas: con más de 30 jugadores, flechas ‹ › a los lados para pasar de página. Sin
 *     rango escrito (22/10): la cuadrícula ordenada ya dice del cuál al cuál va la página
 *
 * Transiciones (las de la Pulida):
 *   T1  al entrar, las caras aparecen en cascada                         (phase="enter")
 *   T2  al pasar de página, la cuadrícula entra por el lado de la flecha
 *   T3  al tocar una cara, todo se apaga menos ella (el vuelo lo hace Ready) (phase="leaving")
 *   T4  al volver de Ready, la plantilla reaparece                        (phase="returning")
 *   T5  Staff: el QR entra creciendo; las flechas se van y "Staff" pasa a "‹ Players"
 *
 * Celda (`cell`, 23/10):
 *   actual  dorsal + apellido debajo de la foto
 *   parche    el de la Pulida: el dorsal en un parche pegado a la foto, abajo a la derecha; debajo
 *              solo el apellido
 *   parcheBL   abajo a la izquierda: igual de cerca del apellido y se lee "10 · Havertz"
 *   parcheTL   arriba a la izquierda: lo primero que se ve, como en Avatars cards
 */
const PATCH = { parche: 'br', parcheBL: 'bl', parcheTL: 'tl' };
// Staff (17/10, tras la critique): si nadie escanea, la plantilla vuelve sola para el siguiente
const STAFF_IDLE_MS = 20000;

// Medidas de la pantalla (1280 × 800). La cuadrícula llena el hueco entre las flechas y bajo la
// cabecera, con aire: 40 px entre la última columna y la flecha, 40 abajo, y al menos 32 entre una
// foto y la de al lado (22/10: con 7 columnas quedaban pegadas al borde y entre sí).
const AREA_W = 1280 - 2 * (16 + 56 + 40);   // margen + flecha + aire = 1056
const AREA_H = 800 - 88 - 24 - 40;          // cabecera, aire bajo el título y abajo = 648
const GAP_X = 12;
const GAP_Y = 12;
const PHOTO_AIR = 32;         // mínimo entre fotos vecinas (lo que no ocupa la foto en su columna)
const LABEL_H = 24 + 8;       // línea del dorsal y el apellido + separación con la foto

export default function RosterScreen({
  players, cols = 6, rows = 5, cell = 'actual', tab, onTab, phase = 'idle', selectedId, onSelect, onScanQr,
}) {
  const pages = paginate(players, cols * rows);
  const showStaff = tab === 'staff';
  const pageIndex = typeof tab === 'number' ? Math.min(tab, pages.length - 1) : 0;
  const page = pages[pageIndex];
  const hasPages = pages.length > 1;

  // T2: al pasar de página la cuadrícula entra por el lado de la flecha
  const [slide, setSlide] = useState(null);
  function goTo(next) {
    if (typeof next === 'number' && !showStaff && next !== pageIndex) setSlide(next > pageIndex ? 'fromRight' : 'fromLeft');
    else if (showStaff) setSlide(null);
    onTab(next);
  }

  // Al salir de Staff se vuelve a la página en la que estaba, no a la primera
  const lastPage = useRef(pageIndex);
  if (!showStaff) lastPage.current = pageIndex;
  const backToPlayers = () => goTo(lastPage.current);

  useEffect(() => {
    if (!showStaff) return;
    const t = setTimeout(backToPlayers, STAFF_IDLE_MS);
    return () => clearTimeout(t);
  }, [showStaff]);

  // Tamaños: siempre los de una página llena, así la última página no cambia de tamaño
  const colW  = Math.floor((AREA_W - (cols - 1) * GAP_X) / cols);
  const rowH  = Math.floor((AREA_H - (rows - 1) * GAP_Y) / rows);
  const photo = Math.min(colW + GAP_X - PHOTO_AIR, rowH - LABEL_H);
  const gridStyle = {
    gridTemplateColumns: `repeat(${cols}, ${colW}px)`,
    gridAutoRows: `${rowH}px`,
    columnGap: GAP_X,
    rowGap: GAP_Y,
    '--photo': `${photo}px`,
  };

  const rootRef = useRef(null);

  function select(p, photoEl) {
    // posición de la foto en coordenadas de la pantalla (1280 × 800), sin el scale() del marco
    const root = rootRef.current.getBoundingClientRect();
    const r = photoEl.getBoundingClientRect();
    const k = 1280 / root.width;
    onSelect(p, { x: (r.left - root.left) * k, y: (r.top - root.top) * k, size: r.width * k });
  }

  const showNav = hasPages && !showStaff;

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

      <main className={styles.body}>
        {showNav && pageIndex > 0 && (
          <button
            className={`${styles.pressable} ${styles.arrow} ${styles.arrowPrev}`}
            onClick={() => goTo(pageIndex - 1)}
            aria-label={`Previous: ${pages[pageIndex - 1].label}`}
          >
            <Chevron dir="left" />
          </button>
        )}
        {showNav && pageIndex < pages.length - 1 && (
          <button
            className={`${styles.pressable} ${styles.arrow} ${styles.arrowNext}`}
            onClick={() => goTo(pageIndex + 1)}
            aria-label={`Next: ${pages[pageIndex + 1].label}`}
          >
            <Chevron dir="right" />
          </button>
        )}

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
                <span className={styles.face}>
                  <Avatar data-photo person={p} className={styles.photo} initialsClassName={styles.initials} />
                  {PATCH[cell] && <span className={`${styles.badge} ${styles[PATCH[cell]]}`}>{p.number}</span>}
                </span>
                <span className={styles.label}>
                  {cell === 'actual' && <span className={styles.number}>{p.number}</span>}
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

function Chevron({ dir }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
