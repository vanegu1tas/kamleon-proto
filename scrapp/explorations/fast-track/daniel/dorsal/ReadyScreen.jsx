import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import styles from './ReadyScreen.module.css';
import SimulateButton from '../../../../components/SimulateButton';
import Avatar from './Avatar';

const TIMEOUT_S = 15;
const FLY_MS = 400;
const BACK_MS = 350;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Ready pulida. Sin fondo propio (el del equipo va detrás).
 *
 * T3: la foto vuela desde su sitio en la plantilla (`from`, en coordenadas de la pantalla) hasta el
 *     centro y crece; después aparecen el saludo, el dorsal y "Not you?".
 * T4: ref.leave() hace el camino contrario y avisa al terminar (para "Not you?" y el timeout).
 * Con "reducir movimiento" no vuela: aparece con un fundido.
 */
const ReadyScreen = forwardRef(function ReadyScreen({ person, from, onNotYou, onSimulateFlow }, ref) {
  const photoRef = useRef(null);
  const [leaving, setLeaving] = useState(false);
  const [left, setLeft] = useState(TIMEOUT_S);

  // Delta entre el sitio final de la foto y el de la plantilla, para animar con transform (FLIP)
  function deltaFromRoster() {
    const el = photoRef.current;
    if (!el || !from) return null;
    const size = el.offsetWidth;
    const x = el.offsetLeft + el.offsetParent.offsetLeft;
    const y = el.offsetTop + el.offsetParent.offsetTop;
    const s = from.size / size;
    return `translate(${from.x - x}px, ${from.y - y}px) scale(${s})`;
  }

  useLayoutEffect(() => {
    const d = deltaFromRoster();
    if (!d || REDUCED) return;
    photoRef.current.animate(
      [{ transform: d }, { transform: 'none' }],
      { duration: FLY_MS, easing: EASE, fill: 'backwards' },
    );
  }, []);

  useImperativeHandle(ref, () => ({
    leave(done) {
      setLeaving(true);
      const d = deltaFromRoster();
      if (!d || REDUCED) { setTimeout(done, 200); return; }
      photoRef.current
        .animate([{ transform: 'none' }, { transform: d }], { duration: BACK_MS, easing: EASE, fill: 'forwards' })
        .finished.then(done, done);
    },
  }));

  useEffect(() => {
    if (leaving) return;
    if (left <= 0) { onNotYou(); return; }
    const t = setTimeout(() => setLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left, leaving, onNotYou]);

  return (
    <div className={`${styles.screen} ${leaving ? styles.leaving : ''}`}>
      <div className={styles.content}>
        <Avatar ref={photoRef} person={person} className={styles.photo} initialsClassName={styles.initials} />
        <div className={styles.texts}>
          <h1 className={styles.greeting}>Hi, {person.short}</h1>
          {person.number != null && <span className={styles.number}>#{person.number}</span>}
          <p className={styles.instruction}>Start to pee whenever you're ready</p>
          <SimulateButton label="Simulate flow detected" onClick={onSimulateFlow} />
          <button className={styles.notYou} onClick={onNotYou}>‹ Not you?</button>
        </div>
      </div>

      <p className={styles.timeout}>Back to the roster in {left} s if nothing happens</p>
    </div>
  );
});

export default ReadyScreen;
