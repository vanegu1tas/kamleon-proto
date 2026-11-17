import { useEffect, useMemo, useState } from 'react';
import { ROSTERS, teamRoster, paginate } from '../../../fast-track/daniel/data/rosters';
import ScreenC from './ScreenC';
import base from './C.module.css';
import styles from './RosterC.module.css';
import QrPlaceholder from '../../../../components/QrPlaceholder';

/**
 * Elegir jugador · C (17/11). Dos modos para comparar (Daniel: business quiere ver a los jugadores en pantalla para
 * escoger rápido, como en Fast Track; el dorsal va como alternativa):
 *   · 'grid'   → la plantilla de Fast Track (20 por página, rangos de dorsal en chips) en tarjetas de
  *                vidrio: foto, nombre y dorsal como etiqueta. Enlace "Type your number" al otro modo.
 *   · 'number' → "What's your number?": el jugador teclea su dorsal (máx. 2 cifras), aparece su foto y confirma.
 *                Si dos comparten dorsal, salen los dos. "Browse all players" vuelve a la plantilla.
 * El modo del engranaje es el de entrada; los enlaces cambian de uno a otro dentro de la pantalla.
 * Con 30 (Daniel, 17/11): Staff es un botón con QR arriba a la derecha (como en Fast Track) que cambia la plantilla
 * por el QR. Buscar por número (find): 'bar' = botón ancho abajo que abre "What's your number?" · 'search' =
 * buscador en la línea del título; al tocarlo sale un teclado y la plantilla se filtra por dorsal.
 */
const TEAM_FOR = { arsenal: 'arsenal', dallas: 'dallas', villa: null };
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export default function RosterC({ mode: initialMode = 'grid', perPage = '20', find = 'bar', ...props }) {
  const { clubKey } = props;
  const roster = useMemo(() => {
    const players = ROSTERS.football.players;
    const team = TEAM_FOR[clubKey];
    return team ? teamRoster(players, team) : players.map(p => ({ ...p, photo: null }));
  }, [clubKey]);
  const [mode, setMode] = useState(initialMode);
  const [staff, setStaff] = useState(false);
  useEffect(() => { setMode(initialMode); setStaff(false); }, [initialMode, perPage, find]);
  const dense = perPage === '30';
  const staffBtn = dense && mode === 'grid' && (
    <button className={`${base.chip} ${styles.staffBtn} ${staff ? styles.staffOn : ''}`} onClick={() => setStaff(v => !v)}>
      <QrIcon /> Staff
    </button>
  );

  return (
    <ScreenC {...props} back headerRight={staffBtn}>
      {mode === 'grid'
        ? (staff
          ? <StaffQr onBack={() => setStaff(false)} />
          : <Grid roster={roster} size={Number(perPage)} find={find} onNumber={() => setMode('number')} />)
        : <ByNumber roster={roster} onBrowse={() => setMode('grid')} />}
    </ScreenC>
  );
}

/* size 20 → como Fast Track: título + rangos en chips, 5×4. size 30 (Daniel, 17/11) → 6×5 en una sola pantalla: el
   título sube a la línea del escudo, sin chips de rangos (solo si hay más de 30), Staff y "Type your number" en chips
   abajo a la derecha. */
function Grid({ roster: all, size, find, onNumber }) {
  const [query, setQuery] = useState('');
  const [typing, setTyping] = useState(false);
  const search = size === 30 && find === 'search';
  const roster = useMemo(() => (search && query ? all.filter(p => String(p.number).startsWith(query)) : all), [all, search, query]);
  const pages = useMemo(() => paginate(roster.length ? roster : all, size), [roster, all, size]);
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
        {search && <NumberSearch value={query} open={typing} onOpen={setTyping} onChange={v => { setQuery(v); setPage(0); setPicked(null); }} />}
        <div className={styles.ranges}>
          {ranges}
          {!dense && <button className={base.chip}>Staff</button>}
        </div>
      </div>

      {search && query && roster.length === 0 && <p className={`${base.body} ${styles.noMatch}`}>No player with number {query}</p>}
      <div className={`${styles.grid} ${dense ? styles.gridDense : ''}`} key={`${size}-${page}-${query}`} onClick={() => setTyping(false)}
        style={search && query && roster.length === 0 ? { visibility: 'hidden' } : undefined}>
        {current.map((pl, i) => (
          <button key={pl.id ?? `${pl.number}-${pl.name}`} className={`${styles.player} ${base.card} ${base.enter} ${picked === pl ? styles.picked : ''}`}
            style={{ animationDelay: `${i * 0.015}s` }} onClick={() => setPicked(pl)}>
            <Photo player={pl} className={styles.photo} />
            <span className={styles.name}>{pl.short ?? pl.name}</span>
            <span className={styles.number}>{pl.number}</span>
          </button>
        ))}
      </div>

      {dense
        ? (find === 'bar' && (
          <button className={`${styles.findBar} ${base.card}`} onClick={onNumber}>
            <span className={styles.hash}>#</span> Can't find yourself? <strong>Find me by number</strong>
          </button>
        ))
        : <button className={`${base.link} ${styles.switch}`} onClick={onNumber}>Type your number instead</button>}
    </>
  );
}

// Buscador por dorsal en la línea del título: al tocarlo sale un teclado debajo; la plantilla se filtra al teclear
const PAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'del'];
function NumberSearch({ value, open, onOpen, onChange }) {
  const press = k => {
    if (k === 'del') onChange(value.slice(0, -1));
    else if (k === 'clear') { onChange(''); onOpen(false); }
    else if (value.length < 2 && !(value === '' && k === '0')) onChange(value + k);
  };
  return (
    <div className={styles.search}>
      <button className={`${styles.searchField} ${open ? styles.searchOpen : ''}`} onClick={() => onOpen(!open)}>
        <span className={styles.hash}>#</span>
        {value ? <span className={styles.searchValue}>{value}</span> : <span className={styles.searchPlaceholder}>Your number</span>}
      </button>
      {open && (
        <div className={`${styles.pad} ${base.enter}`}>
          {PAD.map(k => (
            <button key={k} className={`${styles.padKey} ${base.card}`} onClick={() => press(k)} aria-label={k}>
              {k === 'del' ? '⌫' : k === 'clear' ? 'Clear' : k}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Staff: la plantilla se cambia por el QR (los del staff no están en la lista; entran con la app)
function StaffQr({ onBack }) {
  return (
    <main className={`${styles.staffPanel} ${base.enter}`}>
      <div className={`${styles.staffQr} ${base.card}`}><QrPlaceholder size={240} color="var(--c-text)" /></div>
      <h1 className={base.title}>Staff</h1>
      <p className={base.body}>Scan with the Kamleon app to sign in.</p>
      <button className={base.link} onClick={onBack}>Back to players</button>
    </main>
  );
}

function QrIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3" strokeLinecap="round" />
    </svg>
  );
}

function ByNumber({ roster, onBrowse }) {
  const [value, setValue] = useState('');
  const [picked, setPicked] = useState(null);
  const matches = value ? roster.filter(p => String(p.number) === value) : [];
  useEffect(() => setPicked(matches.length === 1 ? matches[0] : null), [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const press = k => {
    if (k === 'del') { setValue(v => v.slice(0, -1)); return; }
    setValue(v => (v.length >= 2 ? v : (v === '' && k === '0' ? v : v + k)));
  };

  return (
    <main className={styles.byNumber}>
      <section className={styles.left}>
        <h1 className={base.title}>What's your number?</h1>
        <div className={styles.bigNumber}>
          {value || <span className={styles.placeholder}>00</span>}
          <span className={styles.caret} />
        </div>
        <div className={styles.matches}>
          {value && matches.length === 0 && <p className={base.body}>No player with number {value}</p>}
          {matches.map(pl => (
            <button key={pl.id ?? pl.name} className={`${styles.match} ${base.card} ${base.enter} ${picked === pl ? styles.picked : ''}`} onClick={() => setPicked(pl)}>
              <Photo player={pl} className={styles.matchPhoto} />
              <span className={styles.matchName}>{pl.name}</span>
            </button>
          ))}
        </div>
        <button className={base.link} onClick={onBrowse}>Browse all players</button>
      </section>

      <section className={styles.right}>
        <div className={styles.keypad}>
          {KEYS.map((k, i) => k === ''
            ? <span key={i} />
            : <button key={i} className={`${styles.key} ${base.card}`} onClick={() => press(k)} aria-label={k === 'del' ? 'Delete' : k}>{k === 'del' ? '⌫' : k}</button>)}
        </div>
        <button className={base.primary} disabled={!picked}>{picked ? `I'm ${picked.short ?? picked.name}` : "That's me"}</button>
      </section>
    </main>
  );
}

function Photo({ player, className }) {
  return player.photo
    ? <img className={className} src={player.photo} alt="" />
    : <span className={className}>{initials(player.short ?? player.name)}</span>;
}
const initials = name => name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
