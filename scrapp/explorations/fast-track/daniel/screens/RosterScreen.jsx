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
 * pageSize: 20 (5 × 4) o 30 (denseCols: 6 × 5 u 8 × 4). Si la plantilla no cabe en una página,
 * pestañas por rango de dorsales; si cabe, no hay rangos y en modo
 * 'tab' la barra queda en "Players · Staff".
 *
 * Sin pie (15/10): ni RFID ni invitado se anuncian. Orinar sin elegir perfil arranca como
 * invitado; ese espacio se lo lleva la cuadrícula.
 *
 * En el prototipo, tocar el QR cuenta como haberlo escaneado (onScanQr).
 */
export default function RosterScreen({ players, pageSize = 20, denseCols = 8, qrMode, onSelect, onScanQr }) {
  const pages = paginate(players, pageSize);
  const [tab, setTab] = useState(0);          // índice de página, o 'staff'
  const showStaff = qrMode === 'tab' && tab === 'staff';
  const page = pages[typeof tab === 'number' ? tab : 0];

  const hasRanges = pages.length > 1;
  const showBar = hasRanges || qrMode === 'tab';

  // Con menos jugadores que el máximo de la página (equipo pequeño, o la última página), la
  // cuadrícula se reparte: columnas equilibradas (16 → 4 × 4, no 5-5-5-1) y más aire entre filas.
  const dense   = pageSize > 20;
  const wide    = dense && denseCols === 8;
  const maxCols = dense ? denseCols : 5;
  const maxRows = dense && !wide ? 5 : 4;
  const count   = page?.players.length ?? 0;
  const rows    = Math.max(1, Math.ceil(count / maxCols));
  const cols    = Math.ceil(count / rows);
  // Alto libre para la cuadrícula: pantalla − cabecera (88) − barra (64, si la hay) − margen (24).
  // El sobrante se reparte entre filas, entre el mínimo de siempre y 56 px.
  const rowH    = !dense ? 136 : wide ? 128 : 112;
  const free    = 800 - 88 - (showBar ? 64 : 0) - 24 - rows * rowH;
  const rowGap  = Math.round(Math.min(56, Math.max(dense ? 12 : 16, free / rows)));
  const gridStyle = {
    gridTemplateColumns: `repeat(${cols}, ${!dense ? 200 : wide ? 140 : 176}px)`,
    rowGap,
  };

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <span className={styles.logo}>KAMLEON®</span>
        <h1 className={styles.title}>Choose your profile</h1>
        {qrMode === 'corner' && (
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

      <main className={`${styles.body} ${showBar ? '' : styles.bodyNoBar}`}>
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
