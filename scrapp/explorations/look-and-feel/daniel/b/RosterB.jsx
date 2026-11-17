import { useEffect, useMemo, useState } from 'react';
import { ROSTERS, teamRoster, paginate } from '../../../fast-track/daniel/data/rosters';
import ScreenB from './ScreenB';
import base from './B.module.css';
import styles from './RosterB.module.css';

/**
 * Elegir jugador · B (17/11). La plantilla de Fast Track con las tarjetas de la B (dorsal protagonista), 30 en 6×5
 * o 20 en 5×4 con rangos. Sin modo dorsal (Daniel, 17/11: en la B no hace falta) y, en vez de "Staff", un botón
 * con icono de QR que es una tarjeta más, al final de cada página (Daniel, 17/11): el staff entra escaneando su
 * QR. Por eso cada página lleva un jugador menos (29 + QR, o 19 + QR).
 */
const TEAM_FOR = { arsenal: 'arsenal', dallas: 'dallas', villa: null };

export default function RosterB({ perPage = '20', ...props }) {
  const { clubKey } = props;
  const roster = useMemo(() => {
    const players = ROSTERS.football.players;
    const team = TEAM_FOR[clubKey];
    return team ? teamRoster(players, team) : players.map(p => ({ ...p, photo: null }));
  }, [clubKey]);

  return (
    <ScreenB {...props} back>
      <Grid roster={roster} size={Number(perPage)} />
    </ScreenB>
  );
}

/* size 20 → título + rangos en chips, 5×4. size 30 → 6×5 en una sola pantalla, el título en la línea del escudo,
   sin rangos salvo que haya más de 30. El botón de QR va siempre abajo a la derecha. */
function Grid({ roster, size }) {
  const pages = useMemo(() => paginate(roster, size - 1), [roster, size]); // un hueco para la tarjeta de QR
  const [page, setPage] = useState(0);
  const [picked, setPicked] = useState(null);
  useEffect(() => { setPage(0); setPicked(null); }, [size]);
  const current = pages[Math.min(page, pages.length - 1)].players;
  const dense = size === 30;
  const ranges = (dense ? pages.length > 1 : true) && pages.map((p, i) => (
    <button key={i} className={`${base.chip} ${i === page ? base.chipOn : ''}`} onClick={() => { setPage(i); setPicked(null); }}>
      {p.label}
    </button>
  ));
  return (
    <>
      <div className={dense ? styles.topDense : styles.top}>
        <h1 className={`${base.title} ${dense ? styles.titleDense : ''}`}>Choose your profile</h1>
        <div className={styles.ranges}>
          {ranges}
        </div>
      </div>

      <div className={`${styles.grid} ${dense ? styles.gridDense : ''}`} key={`${size}-${page}`}>
        {current.map((pl, i) => (
          <button key={pl.id ?? `${pl.number}-${pl.name}`} className={`${styles.player} ${base.card} ${base.enter} ${picked === pl ? styles.picked : ''}`}
            style={{ animationDelay: `${i * 0.015}s` }} onClick={() => setPicked(pl)}>
            <Photo player={pl} className={styles.photo} />
            <span className={styles.name}>{pl.short ?? pl.name}</span>
            <span className={styles.number}>{pl.number}</span>
          </button>
        ))}
        {/* tarjeta de QR para el staff: misma forma que un jugador; icono donde va el dorsal */}
        <button className={`${styles.player} ${styles.qrCard} ${base.card} ${base.enter}`} style={{ animationDelay: `${current.length * 0.015}s` }}>
          <span className={styles.number}><QrIcon /></span>
          <span className={styles.name}>Staff · Scan QR</span>
        </button>
      </div>

    </>
  );
}

function Photo({ player, className }) {
  return player.photo
    ? <img className={className} src={player.photo} alt="" />
    : <span className={className}>{initials(player.short ?? player.name)}</span>;
}
const initials = name => name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

function QrIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="2" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M13 13h3v3h-3zM17 17h3v3h-3zM17 13h3M13 17v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
