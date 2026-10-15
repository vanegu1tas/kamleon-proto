import { useState } from 'react';
import styles from './RosterScreen.module.css';
import QrPlaceholder from '../../../../components/QrPlaceholder';
import SimulateButton from '../../../../components/SimulateButton';
import { initialsFor, paginate } from '../data/rosters';

/**
 * Fast Track · pantalla de inicio con la plantilla.
 *
 * qrMode
 *   'corner' → el QR fijo arriba a la derecha (lo que pide la propuesta, algo más grande)
 *   'tab'    → "Staff" es una pestaña más: al tocarla, el QR grande ocupa el sitio de la cuadrícula
 *
 * Con más de 20 jugadores, pestañas por rango de dorsales. Con 20 o menos no hay rangos; en modo
 * 'tab' la barra queda en "Players · Staff".
 */
export default function RosterScreen({ players, qrMode, onSelect, onSimulateQr, onSimulateRfid, onSimulateGuest }) {
  const pages = paginate(players);
  const [tab, setTab] = useState(0);          // índice de página, o 'staff'
  const showStaff = qrMode === 'tab' && tab === 'staff';
  const page = pages[typeof tab === 'number' ? tab : 0];

  const hasRanges = pages.length > 1;
  const showBar = hasRanges || qrMode === 'tab';

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <span className={styles.logo}>KAMLEON®</span>
        <h1 className={styles.title}>Choose your profile</h1>
        {qrMode === 'corner' && (
          <div className={styles.cornerQr}>
            <QrPlaceholder size={96} color="#ffffff" />
            <span className={styles.cornerQrText}>Staff</span>
          </div>
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
            <div className={styles.staffQr}><QrPlaceholder size={260} color="#ffffff" /></div>
            <p className={styles.staffText}>Scan with your phone to sign in</p>
            <SimulateButton label="Simulate QR scan" onClick={onSimulateQr} />
          </div>
        ) : (
          <div className={styles.grid}>
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

      <footer className={styles.footer}>
        <span className={styles.footerText}>
          <svg className={styles.chevron} width="20" height="12" viewBox="0 0 24 14" fill="none" aria-hidden="true">
            <path d="M2 2L12 12L22 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Tap your card below the screen · or just start to pee as a guest
        </span>
        <span className={styles.sims}>
          <SimulateButton label="Simulate RFID tap" onClick={onSimulateRfid} />
          {qrMode === 'corner' && <SimulateButton label="Simulate QR scan" onClick={onSimulateQr} />}
          <SimulateButton label="Simulate urination (guest)" onClick={onSimulateGuest} />
        </span>
      </footer>
    </div>
  );
}
