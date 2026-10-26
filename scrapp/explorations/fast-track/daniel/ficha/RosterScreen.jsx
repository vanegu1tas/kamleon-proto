import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './RosterScreen.module.css';
import QrPlaceholder from '../../../../components/QrPlaceholder';
import { paginate } from '../data/rosters';
import Avatar from './Avatar';

/**
 * Fast Track · Ficha (22/10). Copia del primer release (07) con la celda de la referencia:
 * una ficha con la foto arriba y, debajo, una franja con el dorsal en un bloque de color y el
 * apellido en mayúsculas. Sin duotono, en Circular y sobre nuestro fondo (Daniel, 22/10).
 * Lo demás es igual que en la 07:
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
 */
// Staff (17/10, tras la critique): si nadie escanea, la plantilla vuelve sola para el siguiente
const STAFF_IDLE_MS = 20000;

// Medidas de la pantalla (1280 × 800): el mismo hueco que en la 07 (entre las flechas y bajo la
// cabecera, 40 px de aire a los lados y abajo). Aquí la ficha llena su celda entera: la foto toma
// todo el ancho y el alto que deja la franja, así que con más filas la foto sale más baja.
const AREA_W = 1280 - 2 * (16 + 56 + 40);   // margen + flecha + aire = 1056
const AREA_H = 800 - 88 - 24 - 40;          // cabecera, aire bajo el título y abajo = 648
const GAP_X = 16;
const GAP_Y = 16;
// Franja del dorsal y el apellido (22/10), dos formas para comparar:
//   side   la de la referencia: el dorsal en un bloque a la izquierda y el apellido al lado
//   stack  el dorsal pequeño encima y el apellido debajo, a todo el ancho de la ficha: con 8
//          columnas al lado solo le quedaban ~58 px y se cortaba casi siempre
//   badge  el dorsal sobre la foto (esquina de arriba) y abajo solo el apellido: la foto gana alto
//   overlay dorsal y apellido sobre la foto (el apellido sobre un degradado): la foto ocupa la
//          ficha entera y queda vertical
//   plate  la del Figma de Daniel (23/10, Scrapp explorations 2062:3599): el dorsal en una placa con
//          el color del club en degradado sobre la foto, y una franja oscura con el apellido
//          centrado (al tamaño de "Dorsal en foto")
const STRIP_H = { side: 40, stack: 52, badge: 32, overlay: 0, plate: 27 };
const NUMBER_ON_PHOTO = new Set(['badge', 'overlay', 'plate']);

export default function RosterScreen({
  players, cols = 6, rows = 5, strip = 'badge', upper = false, darkInk = false, tab, onTab, phase = 'idle', selectedId, onSelect, onScanQr,
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
  const gridStyle = {
    gridTemplateColumns: `repeat(${cols}, ${colW}px)`,
    gridAutoRows: `${rowH}px`,
    columnGap: GAP_X,
    rowGap: GAP_Y,
    '--strip': `${STRIP_H[strip]}px`,
  };

  const rootRef = useRef(null);

  function select(p, photoEl) {
    // posición de la foto en coordenadas de la pantalla (1280 × 800), sin el scale() del marco
    const root = rootRef.current.getBoundingClientRect();
    // la foto de Ready tiene la misma forma que la de la ficha: el vuelo sale de la foto entera
    const r = photoEl.getBoundingClientRect();
    const k = 1280 / root.width;
    onSelect(p, { x: (r.left - root.left) * k, y: (r.top - root.top) * k, w: r.width * k, h: r.height * k });
  }

  const showNav = hasPages && !showStaff;

  return (
    <div ref={rootRef} className={`${styles.screen} ${styles[phase] ?? ''} ${upper ? styles.upper : ''} ${strip === 'plate' ? styles.plateLook : ''} ${darkInk ? styles.inkDark : ''}`}>
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
                <Avatar data-photo person={p} className={styles.photo} initialsClassName={styles.initials} />
                {NUMBER_ON_PHOTO.has(strip) && <span className={`${styles.number} ${styles.onPhoto}`}>{p.number}</span>}
                <span className={`${styles.strip} ${styles[strip] ?? ''}`}>
                  {!NUMBER_ON_PHOTO.has(strip) && <span className={styles.number}>{p.number}</span>}
                  <FitName className={styles.name}>{p.short}</FitName>
                </span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Apellidos largos (22/10): si no cabe, baja la letra de 16 a 13 px de uno en uno; solo si aun así
// no cabe, puntos suspensivos. Se mide en cada render: cambia con la rejilla, la franja y las
// mayúsculas de Dallas.
const NAME_MAX = 16;
const NAME_MIN = 13;

function FitName({ className, max = NAME_MAX, children }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    let size = max;
    el.style.fontSize = `${size}px`;
    while (el.scrollWidth > el.clientWidth && size > NAME_MIN) {
      size -= 1;
      el.style.fontSize = `${size}px`;
    }
  });
  return <span ref={ref} className={className}>{children}</span>;
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
