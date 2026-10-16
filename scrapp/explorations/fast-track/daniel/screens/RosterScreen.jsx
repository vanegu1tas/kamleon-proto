import { useState } from 'react';
import styles from './RosterScreen.module.css';
import QrPlaceholder from '../../../../components/QrPlaceholder';
import { initialsFor, paginate } from '../data/rosters';

/**
 * Fast Track · pantalla de inicio con la plantilla.
 *
 * qrMode
 *   'corner' → el QR fijo arriba a la derecha (lo que pide la propuesta, algo más grande)
 *   'tab'    → "Staff" es una pestaña más: al tocarla, el QR grande ocupa el sitio de la cuadrícula
 *
 * nav
 *   'tabs'   → pestañas por rango de dorsales (y Staff, según qrMode)
 *   'arrows' → sin pestañas: flechas ‹ › a los lados para pasar de rango, el rango actual con
 *              puntos bajo el título, y "Staff" como botón suelto arriba a la derecha que abre
 *              el QR grande (qrMode no aplica)
 *
 * pageSize: 20 (5 × 4) o 30 (denseCols: 6 × 5 u 8 × 4). Si la plantilla no cabe en una página,
 * pestañas por rango de dorsales; si cabe, no hay rangos y en modo
 * 'tab' la barra queda en "Players · Staff".
 *
 * Sin pie (15/10): ni RFID ni invitado se anuncian. Orinar sin elegir perfil arranca como
 * invitado; ese espacio se lo lleva la cuadrícula.
 *
 * En el prototipo, tocar el QR cuenta como haberlo escaneado (onScanQr).
 */
export default function RosterScreen({ players, pageSize = 20, denseCols = 8, qrMode, nav = 'tabs', onSelect, onScanQr }) {
  // Con flechas y 30 × 8 columnas, la página se llena entera (8 × 4 = 32) en vez de dejar 2 huecos
  // al final: la que queda corta es la última página. Solo en esta exploración (nav="arrows").
  const fillGrid = nav === 'arrows' && pageSize > 20 && denseCols === 8;
  const pages = paginate(players, fillGrid ? 32 : pageSize);
  const [tab, setTab] = useState(0);          // índice de página, o 'staff'
  const arrows = nav === 'arrows';
  const showStaff = (arrows || qrMode === 'tab') && tab === 'staff';
  const pageIndex = typeof tab === 'number' ? tab : 0;
  const page = pages[pageIndex];

  const hasRanges = pages.length > 1;
  const showBar = !arrows && (hasRanges || qrMode === 'tab');
  const showIndicator = arrows && hasRanges && !showStaff;
  const barH = showBar ? 80 : arrows && hasRanges ? 48 : 0;

  // Con menos jugadores que el máximo de la página (equipo pequeño, o la última página), la
  // cuadrícula se reparte: columnas equilibradas (16 → 4 × 4, no 5-5-5-1) y más aire entre filas.
  const dense   = pageSize > 20;
  const wide    = dense && denseCols === 8;
  const maxCols = dense ? denseCols : 5;
  const maxRows = dense && !wide ? 5 : 4;
  const count   = page?.players.length ?? 0;
  const rows    = Math.max(1, Math.ceil(count / maxCols));
  const cols    = Math.ceil(count / rows);
  // Alto libre para la cuadrícula: pantalla − cabecera (88) − barra (80, si la hay) − margen (24).
  // El sobrante se reparte entre filas, entre el mínimo de siempre y 56 px.
  const rowH    = !dense ? 136 : wide ? 128 : 108;
  const free    = 800 - 88 - barH - 24 - rows * rowH;
  const rowGap  = Math.round(Math.min(56, Math.max(dense ? 12 : 16, free / rows)));
  const gridStyle = {
    // con flechas, las 8 columnas se estrechan (140 → 132) para dejarles sitio a los lados
    gridTemplateColumns: `repeat(${cols}, ${!dense ? 200 : wide ? (arrows ? 132 : 140) : 176}px)`,
    rowGap,
  };

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <span className={styles.logo}>KAMLEON®</span>
        <h1 className={styles.title}>Choose your profile</h1>
        {arrows && (
          <button
            className={`${styles.tab} ${styles.staffTab} ${styles.staffButton} ${showStaff ? styles.tabActive : ''}`}
            onClick={() => setTab(showStaff ? pageIndex : 'staff')}
          >
            Staff
          </button>
        )}
        {!arrows && qrMode === 'corner' && (
          <button className={styles.cornerQr} onClick={onScanQr} aria-label="Staff: scan QR">
            <QrPlaceholder size={96} color="#ffffff" />
            <span className={styles.cornerQrText}>Staff</span>
          </button>
        )}
      </header>

      {showBar && (
        <nav className={styles.tabs} aria-label="Roster">
          <div className={styles.tabGroup}>
            {hasRanges
              ? pages.map((p, i) => (
                  <button
                    key={p.label}
                    className={`${styles.tab} ${tab === i ? styles.tabActive : ''}`}
                    onClick={() => setTab(i)}
                  >
                    {p.label}
                  </button>
                ))
              : (
                <button className={`${styles.tab} ${tab !== 'staff' ? styles.tabActive : ''}`} onClick={() => setTab(0)}>
                  Players
                </button>
              )}
          </div>
          {qrMode === 'tab' && (
            <button
              className={`${styles.tab} ${styles.staffTab} ${showStaff ? styles.tabActive : ''}`}
              onClick={() => setTab('staff')}
            >
              Staff
            </button>
          )}
        </nav>
      )}

      {showIndicator && (
        <div className={styles.indicator} aria-live="polite">
          <span className={styles.indicatorLabel}>{page.label}</span>
          <span className={styles.dots} aria-hidden="true">
            {pages.map((p, i) => <span key={p.label} className={`${styles.dot} ${i === pageIndex ? styles.dotActive : ''}`} />)}
          </span>
        </div>
      )}

      <main className={`${styles.body} ${showBar || showIndicator ? '' : styles.bodyNoBar}`}>
        {showIndicator && pageIndex > 0 && (
          <button className={`${styles.arrow} ${styles.arrowPrev}`} onClick={() => setTab(pageIndex - 1)} aria-label={`Previous: ${pages[pageIndex - 1].label}`}>
            <svg width="16" height="28" viewBox="0 0 14 24" fill="none" aria-hidden="true"><path d="M12 2L2 12L12 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        {showIndicator && pageIndex < pages.length - 1 && (
          <button className={`${styles.arrow} ${styles.arrowNext}`} onClick={() => setTab(pageIndex + 1)} aria-label={`Next: ${pages[pageIndex + 1].label}`}>
            <svg width="16" height="28" viewBox="0 0 14 24" fill="none" aria-hidden="true"><path d="M2 2L12 12L2 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        {showStaff ? (
          <div className={styles.staffPanel}>
            <button className={styles.staffQr} onClick={onScanQr} aria-label="Scan QR">
              <QrPlaceholder size={260} color="#ffffff" />
            </button>
            <p className={styles.staffText}>Scan with your phone to sign in</p>
          </div>
        ) : (
          <div className={`${styles.grid} ${dense ? styles.dense : ''} ${wide ? styles.wide : ''}`} style={gridStyle}>
            {page.players.map(p => (
              <button key={p.id} className={styles.player} onClick={() => onSelect(p)}>
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
