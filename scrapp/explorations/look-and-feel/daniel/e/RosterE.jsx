import { useMemo, useState } from 'react';
import { ROSTERS, teamRoster } from '../../../fast-track/daniel/data/rosters';
import ScreenE from './ScreenE';
import base from './E.module.css';
import styles from './RosterE.module.css';

/**
 * Elegir jugador · E (17/11). La plantilla entera (sin páginas) dentro de un panel negro sobre el escenario:
 *   · 'side' → panel lateral a la derecha (como el leaderboard de Peloton), 4 columnas, con scroll si no caben;
 *              el mandala queda a la izquierda, a la vista
 *   · 'full' → panel a toda la pantalla con 6×5, como la B y la C
 * Volver arriba a la izquierda y la tarjeta de QR del staff al final (de la B).
 * Sin panel (Daniel, 17/11: el lateral desperdicia espacio), con el título en la línea del escudo:
 *   · 'float'   → cada tarjeta es su propio panel negro translúcido, 6 columnas a todo lo ancho; el agua se ve entre ellas
 *   · 'circles' → fotos grandes en círculo sin tarjeta, 8 columnas, nombre y dorsal debajo (como Avatars círculo de Fast Track)
 */
const TEAM_FOR = { arsenal: 'arsenal', dallas: 'dallas', villa: null };

export default function RosterE({ panel = 'float', ...props }) {
  const { clubKey } = props;
  const roster = useMemo(() => {
    const players = ROSTERS.football.players;
    const team = TEAM_FOR[clubKey];
    return team ? teamRoster(players, team) : players.map(p => ({ ...p, photo: null }));
  }, [clubKey]);
  const [picked, setPicked] = useState(null);
  const side = panel === 'side';

  if (panel === 'float' || panel === 'circles') {
    const circles = panel === 'circles';
    return (
      <ScreenE {...props} back>
        <h1 className={`${base.title} ${styles.topTitle} ${base.enter}`}>Choose your profile</h1>
        <div className={circles ? styles.circleGrid : styles.floatGrid} key={panel}>
          {roster.map((pl, i) => (
            <button key={pl.id ?? `${pl.number}-${pl.name}`}
              className={`${circles ? styles.circle : `${styles.player} ${styles.floatCard}`} ${base.enter} ${picked === pl ? styles.picked : ''}`}
              style={{ animationDelay: `${0.1 + Math.min(i, 30) * 0.015}s` }} onClick={() => setPicked(pl)}>
              {pl.photo ? <img className={styles.photo} src={pl.photo} alt="" /> : <span className={styles.photo}>{initials(pl.short ?? pl.name)}</span>}
              <span className={styles.name}>{pl.short ?? pl.name}</span>
              <span className={styles.number}>{pl.number}</span>
            </button>
          ))}
          <button className={`${circles ? styles.circle : `${styles.player} ${styles.floatCard}`} ${styles.qrCard} ${base.enter}`}
            style={{ animationDelay: `${0.1 + Math.min(roster.length, 30) * 0.015}s` }}>
            <span className={styles.photo}><QrIcon /></span>
            <span className={styles.name}>Staff</span>
            <span className={styles.number}>QR</span>
          </button>
        </div>
      </ScreenE>
    );
  }

  return (
    <ScreenE {...props} panels="on" back logoBottom={side} stagePosition={side ? 'left' : 'center'}>
      {/* panel completo: el título sube a la línea del escudo, como en Tarjetas flotando y Círculos (Daniel, 17/11) */}
      {!side && <h1 className={`${base.title} ${styles.topTitle} ${base.enter}`}>Choose your profile</h1>}
      <section className={`${styles.panel} ${side ? styles.side : styles.full} ${base.panel} ${base.slideR}`} key={panel}>
        {side && <h1 className={`${base.title} ${styles.title}`}>Choose your profile</h1>}
        <div className={styles.grid}>
          {roster.map((pl, i) => (
            <button key={pl.id ?? `${pl.number}-${pl.name}`} className={`${styles.player} ${base.card} ${base.enter} ${picked === pl ? styles.picked : ''}`}
              style={{ animationDelay: `${0.2 + Math.min(i, 24) * 0.012}s` }} onClick={() => setPicked(pl)}>
              {pl.photo ? <img className={styles.photo} src={pl.photo} alt="" /> : <span className={styles.photo}>{initials(pl.short ?? pl.name)}</span>}
              <span className={styles.name}>{pl.short ?? pl.name}</span>
              <span className={styles.number}>{pl.number}</span>
            </button>
          ))}
          <button className={`${styles.player} ${styles.qrCard} ${base.card}`}>
            <span className={styles.photo}><QrIcon /></span>
            <span className={styles.name}>Staff</span>
            <span className={styles.number}>QR</span>
          </button>
        </div>
      </section>
    </ScreenE>
  );
}

const initials = name => name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
function QrIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="2" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M13 13h3v3h-3zM17 17h3v3h-3zM17 13h3M13 17v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
