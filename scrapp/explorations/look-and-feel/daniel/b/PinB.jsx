import { useEffect, useState } from 'react';
import LogoKamleon from '../../../../../design-system/icons/LogoKamleon';
import base from './B.module.css';
import styles from './PinB.module.css';

/**
 * (Dirección B, 17/11: copia de la C → A con los estilos de B.module.css; los comentarios de abajo vienen de la A.)
 * PIN · dirección A (17/11). Saludo con foto a la izquierda, teclado a la derecha (teclas con fondo, de Peloton).
 *   · En la B va siempre en 'auto' (Daniel, 17/11): al meter el cuarto número se envía solo, sin botón.
 *   · continueMode 'button' → el botón Continue se activa al meter los 4 números
 *   · continueMode 'auto'   → al meter el cuarto número se envía solo (sin botón)
 *   · result 'ok' | 'wrong' → para probar las dos respuestas: si es incorrecto, las casillas tiemblan y se vacían
 */
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export default function PinB({ light, strength, club, continueMode = 'button', result = 'ok' }) {
  const [pin, setPin] = useState('');
  const [state, setState] = useState('idle'); // idle · wrong · ok

  useEffect(() => { setPin(''); setState('idle'); }, [continueMode, result, club]);

  const submit = value => {
    if (result === 'wrong') {
      setState('wrong');
      setTimeout(() => { setPin(''); setState('idle'); }, 450);
    } else {
      setState('ok');
      setTimeout(() => { setPin(''); setState('idle'); }, 1200);
    }
  };

  const press = k => {
    if (state !== 'idle') return;
    if (k === 'del') { setPin(p => p.slice(0, -1)); return; }
    if (pin.length >= 4) return;
    const next = pin + k;
    setPin(next);
    if (continueMode === 'auto' && next.length === 4) setTimeout(() => submit(next), 180);
  };

  const { player } = club;
  return (
    <div className={`${base.screen} ${base[light] ?? ''} ${strength === 'more' ? base.more : ''}`}>
      <header className={base.header}>
        <img className={base.clubLogo} src={club.logo} alt={club.label} />
        <LogoKamleon width={120} height={22} color="#8A97A0" />
      </header>

      <main className={`${styles.main} ${state === 'ok' ? styles.leaving : ''}`}>
        <div className={styles.intro}>
          {player.photo
            ? <img className={styles.photo} src={player.photo} alt="" />
            : <span className={styles.photo}>{player.name.slice(0, 2).toUpperCase()}</span>}
          <h1 className={styles.title}>Hi, {player.name}</h1>
          <p className={styles.body}>Enter your PIN to continue</p>
          <div className={`${styles.slots} ${state === 'wrong' ? styles.shake : ''}`}>
            {[0, 1, 2, 3].map(i => (
              <span key={i} className={`${styles.slot} ${i < pin.length ? styles.filled : ''} ${i === pin.length && state === 'idle' ? styles.active : ''}`} />
            ))}
          </div>
          <button className={styles.link}>Not you?</button>
        </div>

        <div className={styles.right}>
          <div className={styles.keypad}>
            {KEYS.map((k, i) => k === ''
              ? <span key={i} />
              : (
                <button key={i} className={styles.key} onClick={() => press(k)} aria-label={k === 'del' ? 'Delete' : k}>
                  {k === 'del' ? <DeleteIcon /> : k}
                </button>
              ))}
          </div>
          {continueMode === 'button' && (
            <RingButton filled={pin.length} disabled={pin.length < 4 || state !== 'idle'} onClick={() => submit(pin)} />
          )}
        </div>
      </main>

      {state === 'ok' && <p className={styles.welcome}>Welcome, {player.name}</p>}
    </div>
  );
}

function DeleteIcon() {
  return (
    <svg width="34" height="26" viewBox="0 0 34 26" fill="none" aria-hidden="true">
      <path d="M11 2h19a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H11L2 13z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 8.5l9 9M25 8.5l-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* B · botón redondo con anillo de 4 tramos: cada número encendido llena un tramo (turquesa); con los 4, la flecha
   se enciende en blanco y se puede tocar */
function RingButton({ filled, disabled, onClick }) {
  const r = 52, c = 2 * Math.PI * r, seg = c / 4, gap = 10;
  return (
    <button className={styles.ring} disabled={disabled} onClick={onClick} aria-label="Continue">
      <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
        {[0, 1, 2, 3].map(i => (
          <circle key={i} cx="60" cy="60" r={r} fill="none" strokeWidth="4" strokeLinecap="round"
            stroke={i < filled ? 'var(--b-hydrated)' : 'var(--b-border)'}
            strokeDasharray={`${seg - gap} ${c - seg + gap}`} strokeDashoffset={-i * seg - gap / 2}
            transform="rotate(-90 60 60)" style={{ transition: 'stroke var(--b-dur) var(--b-ease)' }} />
        ))}
      </svg>
      <span className={styles.ringCore}>
        <svg width="28" height="24" viewBox="0 0 28 24" fill="none"><path d="M2 12h22M15 3l9 9-9 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </button>
  );
}
