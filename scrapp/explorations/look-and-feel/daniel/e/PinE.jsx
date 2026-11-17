import { useEffect, useState } from 'react';
import LogoKamleon from '../../../../../design-system/icons/LogoKamleon';
import Stage from './Stage';
import base from './E.module.css';
import styles from './PinE.module.css';

/**
 * (Dirección E, 17/11: copia de la C → A; en la E el PIN va en un panel negro centrado sobre el escenario, como el
 * de la Tread de Peloton. Los comentarios de abajo vienen de la A.)
 * PIN · dirección A (17/11). Saludo con foto a la izquierda, teclado a la derecha (teclas con fondo, de Peloton).
 *   · continueMode 'button' → el botón Continue se activa al meter los 4 números
 *   · continueMode 'auto'   → al meter el cuarto número se envía solo (sin botón)
 *   · result 'ok' | 'wrong' → para probar las dos respuestas: si es incorrecto, las casillas tiemblan y se vacían
 */
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export default function PinE({ panels = 'none', water, motion = 'slow', club, continueMode = 'button', result = 'ok' }) {
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
    <div className={base.screen} data-panels={panels}>
      <Stage water={water} dim motion={motion} />
      <header className={base.header}>
        <img className={base.clubLogo} src={club.logo} alt={club.label} />
        <LogoKamleon width={120} height={22} color="#9A9A9A" />
      </header>

      <main className={`${styles.main} ${base.panel} ${state === 'ok' ? styles.leaving : base.slideUp}`}>
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
            <button className={styles.primary} disabled={pin.length < 4 || state !== 'idle'} onClick={() => submit(pin)}>
              Continue
            </button>
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
