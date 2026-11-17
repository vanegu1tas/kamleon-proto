import { useEffect, useRef, useState } from 'react';
import ScreenA from './ScreenA';
import base from './A.module.css';
import styles from './WizardA.module.css';

/**
 * Wizard · A (17/11). Dos pasos del wizard actual (screens/wizard/WizardRunner): "Select the WIFI network" (lista
 * de redes, las tres últimas con candado) y "Introduce the password" (formulario y teclado). Tocar una red con
 * candado lleva a la contraseña; una abierta enseña "Connecting…" y vuelve. Back en la contraseña vuelve a la lista. El teclado se rediseña (el de hoy es el del iPad): solo las teclas que hacen
 * falta, grandes, en #1D1D1D sin borde; mayúsculas y números en una tecla cada uno. Pantalla de instalación: no
 * lleva escudo del club (la ve el instalador, no el jugador).
 */
// Las 6 del wizard actual (Figma), con su candado; la señal (1–3) es inventada para ordenar.
// Con "Redes: 20" se suman 14 más, como en un estadio o un gimnasio (Daniel, 17/11).
const NETWORKS = [
  { name: 'MOVISTAR_PLUS_5G', signal: 3 }, { name: 'MIWIFI_5G_REFp', signal: 2 },
  { name: 'DIRECT-31-HP OfficeJet Pro 7740', signal: 1 }, { name: 'MiFibra-09F3', locked: true, signal: 3 },
  { name: 'MOVISTAR_1978', locked: true, signal: 2 }, { name: 'MOVISTAR_87B0', locked: true, signal: 1 },
];
const MORE_NETWORKS = [
  { name: 'Stadium-Staff', locked: true, signal: 3 }, { name: 'Stadium-Guest', signal: 3 }, { name: 'Press_5G', locked: true, signal: 2 },
  { name: 'Vodafone-A3F1', locked: true, signal: 2 }, { name: 'Orange-7C22', locked: true, signal: 1 }, { name: 'Club_Medical', locked: true, signal: 2 },
  { name: 'Kitchen_AP', locked: true, signal: 1 }, { name: 'DIGI_5G_9921', locked: true, signal: 1 }, { name: 'Gym-Floor-2', locked: true, signal: 2 },
  { name: 'Security_CCTV', locked: true, signal: 1 }, { name: 'Broadcast-OB-Van', locked: true, signal: 3 }, { name: 'iPhone de Laura', locked: true, signal: 1 },
  { name: 'Lowi_4E1B', locked: true, signal: 1 }, { name: 'Maintenance', locked: true, signal: 2 },
];
const LETTERS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const NUMBERS = ['1234567890', '-/:;()&@"', '.,?!\'#%'];

export default function WizardA({ networks: count = '12', scroll = 'fade', ...props }) {
  const [step, setStep] = useState('wifi');
  // 12 redes fijas (Daniel, 17/11): las 6 de Figma + 6 más; con eso ya se ve el scroll
  const list = [...NETWORKS, ...MORE_NETWORKS].slice(0, Number(count)).sort((a, b) => b.signal - a.signal);
  const [network, setNetwork] = useState('MiFibra-09F3');
  const [connecting, setConnecting] = useState(null);

  const pick = n => {
    if (connecting) return;
    if (n.locked) { setNetwork(n.name); setStep('password'); return; }
    setConnecting(n.name);
    setTimeout(() => setConnecting(null), 1500);
  };

  if (step === 'wifi') {
    return (
      <ScreenA {...props} header={false}>
        <div className={styles.head}>
          <button className={`${base.link} ${styles.back}`}>‹ Back</button>
          <span className={styles.step}>Network · step 2 of 6</span>
        </div>
        <div className={styles.form}>
          <h1 className={base.title}>Select the WIFI network</h1>
          <ScrollList mode={scroll}>
            {list.map((n, i) => (
              <button key={n.name} className={`${styles.net} ${base.card} ${base.enter}`} style={{ animationDelay: `${Math.min(i, 6) * 0.03}s` }} onClick={() => pick(n)}>
                <WifiIcon level={n.signal} />
                <span className={styles.netName}>{n.name}</span>
                {connecting === n.name
                  ? <span className={styles.netState}>Connecting…</span>
                  : <span className={styles.netIcons}>{n.locked && <LockIcon />}<Chevron /></span>}
              </button>
            ))}
          </ScrollList>
          {/* fija debajo de la lista: para una red oculta o que no aparece */}
          <button className={`${styles.net} ${styles.other}`}>
            <PlusIcon />
            <span className={styles.netName}>Other network…</span>
            <span className={styles.netIcons}><Chevron /></span>
          </button>
        </div>
      </ScreenA>
    );
  }
  return <PasswordStep {...props} network={network} onBack={() => setStep('wifi')} />;
}

function PasswordStep({ network, onBack, ...props }) {
  const [value, setValue] = useState('');
  const [shift, setShift] = useState(false);
  const [nums, setNums] = useState(false);
  const [visible, setVisible] = useState(false);
  const rows = nums ? NUMBERS : LETTERS;

  const type = ch => { setValue(v => v + (shift && !nums ? ch.toUpperCase() : ch)); setShift(false); };
  const del = () => setValue(v => v.slice(0, -1));

  return (
    <ScreenA {...props} header={false}>
      <div className={styles.head}>
        <button className={`${base.link} ${styles.back}`} onClick={onBack}>‹ Back</button>
        <span className={styles.step}>Network · step 3 of 6</span>
      </div>

      <div className={styles.form}>
        <div>
          <h1 className={base.title}>Introduce the password</h1>
          <p className={`${base.body} ${styles.sub}`}>{network}</p>
        </div>
        <div className={styles.row}>
          <div className={`${styles.field} ${base.card}`}>
            <span className={styles.value}>{visible ? value : '•'.repeat(value.length)}<span className={styles.caret} /></span>
            <button className={styles.eye} onClick={() => setVisible(v => !v)} aria-label={visible ? 'Hide password' : 'Show password'}>
              {visible ? 'Hide' : 'Show'}
            </button>
          </div>
          <button className={base.primary} disabled={value.length < 8}>Connect</button>
        </div>
      </div>

      <div className={styles.keyboard}>
        {rows.map((row, r) => (
          <div key={r} className={styles.keyRow}>
            {r === 2 && (
              <button className={`${styles.key} ${styles.fn} ${shift ? styles.on : ''}`} onClick={() => setShift(s => !s)} disabled={nums} aria-label="Shift">⇧</button>
            )}
            {[...row].map(ch => (
              <button key={ch} className={styles.key} onClick={() => type(ch)}>{shift && !nums ? ch.toUpperCase() : ch}</button>
            ))}
            {r === 2 && <button className={`${styles.key} ${styles.fn}`} onClick={del} aria-label="Delete">⌫</button>}
          </div>
        ))}
        <div className={styles.keyRow}>
          <button className={`${styles.key} ${styles.fn} ${styles.wide}`} onClick={() => setNums(n => !n)}>{nums ? 'ABC' : '123'}</button>
          <button className={`${styles.key} ${styles.space}`} onClick={() => type(' ')} aria-label="Space">space</button>
          <button className={`${styles.key} ${styles.fn} ${styles.wide}`} onClick={() => type('.')}>.</button>
        </div>
      </div>
    </ScreenA>
  );
}

// Señal: arcos encendidos según el nivel (1–3); los apagados en el gris terciario
function WifiIcon({ level = 3 }) {
  const arc = (d, n) => <path d={d} stroke={level >= n ? 'var(--a-text)' : 'var(--a-text-3)'} strokeWidth="2" strokeLinecap="round" />;
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-label={`Signal ${level} of 3`}>
      {arc('M2 7.5a17 17 0 0 1 24 0', 3)}
      {arc('M6 11.5a11.5 11.5 0 0 1 16 0', 2)}
      {arc('M10 15.5a6 6 0 0 1 8 0', 1)}
      <circle cx="14" cy="19" r="1.8" fill="var(--a-text)" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden="true">
      <path d="M14 4v14M7 11h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Lista con scroll para una pantalla táctil: se arrastra con el dedo (y con el ratón en el proto, sin que el
 * arrastre cuente como toque). Dos maneras de avisar de que hay más (Daniel, 17/11, para comparar):
 *   · 'fade' → sin barra; la última fila cortada y difuminada mientras quede lista por ver
 *   · 'bar'  → barra de scroll fina siempre visible a la derecha (pista #2E2E2E, guía gris); su tamaño dice
 *              cuánta lista hay y su posición, dónde estás
 */
function ScrollList({ mode = 'fade', children }) {
  const ref = useRef(null);
  const drag = useRef(null);
  const [pos, setPos] = useState({ atEnd: false, thumbH: 0, thumbTop: 0, scrollable: false });
  const measure = () => {
    const el = ref.current; if (!el) return;
    const { scrollTop, clientHeight, scrollHeight } = el;
    const track = clientHeight;
    const thumbH = Math.max(48, track * clientHeight / scrollHeight);
    const max = scrollHeight - clientHeight;
    setPos({
      atEnd: scrollTop >= max - 2,
      scrollable: max > 2,
      thumbH,
      thumbTop: max > 0 ? (scrollTop / max) * (track - thumbH) : 0,
    });
  };
  useEffect(measure, [children, mode]);
  return (
    <div className={styles.listWrap}>
      <div
        ref={ref}
        className={`${styles.list} ${mode === 'bar' ? styles.withBar : ''} ${mode === 'fade' && pos.atEnd ? styles.atEnd : ''}`}
        onScroll={measure}
        onPointerDown={e => { if (e.pointerType === 'mouse') drag.current = { y: e.clientY, top: ref.current.scrollTop, moved: false }; }}
        onPointerMove={e => {
          const d = drag.current; if (!d) return;
          const dy = e.clientY - d.y;
          if (Math.abs(dy) > 5) d.moved = true;
          if (d.moved) ref.current.scrollTop = d.top - dy;
        }}
        onPointerUp={() => { setTimeout(() => { drag.current = null; }, 0); }}
        onPointerLeave={() => { drag.current = null; }}
        onClickCapture={e => { if (drag.current?.moved) { e.stopPropagation(); e.preventDefault(); } }}
      >
        {children}
      </div>
      {mode === 'bar' && pos.scrollable && (
        <div className={styles.track} aria-hidden="true">
          <div className={styles.thumb} style={{ height: pos.thumbH, transform: `translateY(${pos.thumbTop}px)` }} />
        </div>
      )}
    </div>
  );
}
function LockIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" aria-label="Locked">
      <rect x="1.5" y="8.5" width="13" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function Chevron() {
  return (
    <svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true">
      <path d="M1.5 1.5L8.5 9l-7 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
