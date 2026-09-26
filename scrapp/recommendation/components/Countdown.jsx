import { useEffect, useRef, useState } from 'react';
import styles from './Countdown.module.css';

// Cuenta atrás de la pantalla (Figma Explorations Web App 3.0, 111:24036): círculo de 44px
// abajo a la izquierda, con un anillo que se va vaciando y los segundos dentro.
const SIZE = 44;
const STROKE = 2.5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

export default function Countdown({ seconds = 15, running = true, onFinish, onTick }) {
  const [left, setLeft] = useState(seconds);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!running) { setLeft(seconds); return; }

    const t0 = performance.now();
    // El anillo se mueve con rAF y no por segundos: con un paso de 1s se ve a saltos.
    function frame(now) {
      const elapsed = (now - t0) / 1000;
      const remaining = Math.max(0, seconds - elapsed);
      setLeft(remaining);
      onTick?.(remaining);
      if (remaining > 0) rafRef.current = requestAnimationFrame(frame);
      else onFinish?.();
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, seconds, onFinish, onTick]);

  const progress = left / seconds;

  return (
    <div className={styles.wrap}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} className={styles.track} strokeWidth={STROKE} />
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          className={styles.ring}
          strokeWidth={STROKE}
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - progress)}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </svg>
      <span className={styles.value}>{Math.ceil(left)}</span>
    </div>
  );
}
