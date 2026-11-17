import { useMemo, useState } from 'react';
import { ROSTERS, teamRoster, paginate } from '../../../fast-track/daniel/data/rosters';
import ScreenA from './ScreenA';
import base from './A.module.css';
import styles from './RosterA.module.css';

/**
 * Elegir jugador · A (17/11). La plantilla de Fast Track (fútbol, 28, páginas de 20 por dorsal) con el estilo de la
 * A: tarjetas (borde fino o relleno, opción común) con foto redonda, nombre y dorsal en gris; rangos de dorsales en
 * chips (el elegido en blanco). Aston Villa no tiene fotos: sale con iniciales.
 */
const TEAM_FOR = { arsenal: 'arsenal', dallas: 'dallas', villa: null };

export default function RosterA(props) {
  const { clubKey } = props;
  const pages = useMemo(() => {
    const players = ROSTERS.football.players;
    const team = TEAM_FOR[clubKey];
    const roster = team ? teamRoster(players, team) : players.map(p => ({ ...p, photo: null }));
    return paginate(roster, 20);
  }, [clubKey]);
  const [page, setPage] = useState(0);
  const [picked, setPicked] = useState(null);
  const current = pages[Math.min(page, pages.length - 1)].players;

  return (
    <ScreenA {...props} back>
      <div className={styles.top}>
        <h1 className={base.title}>Choose your profile</h1>
        <div className={styles.ranges}>
          {pages.map((p, i) => (
            <button key={i} className={`${base.chip} ${i === page ? base.chipOn : ''}`} onClick={() => { setPage(i); setPicked(null); }}>
              {p.label}
            </button>
          ))}
          <button className={`${base.link} ${styles.staff}`}>Staff</button>
        </div>
      </div>

      <div className={styles.grid} key={page}>
        {current.map((pl, i) => (
          <button key={pl.id ?? pl.number} className={`${styles.player} ${base.card} ${picked === pl.number ? styles.picked : ''}`}
            style={{ animationDelay: `${i * 0.015}s` }} onClick={() => setPicked(pl.number)}>
            {pl.photo
              ? <img className={styles.photo} src={pl.photo} alt="" />
              : <span className={styles.photo}>{initials(pl.short ?? pl.name)}</span>}
            <span className={styles.name}>{pl.short ?? pl.name}</span>
            <span className={styles.number}>{pl.number}</span>
          </button>
        ))}
      </div>
    </ScreenA>
  );
}

const initials = name => name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
