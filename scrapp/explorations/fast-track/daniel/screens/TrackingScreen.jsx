import styles from './TrackingScreen.module.css';
import { DOT_PATHS } from '../../../../components/LogoDots';

/**
 * Tracking de Fast Track (22/10, la usan todas las exploraciones). Copia propia de PulseStatusScreen
 * (la compartida no se toca) con la animación del vídeo de la máquina real: el mandala no gira ni crece entero; ondea como una bandera.
 * Cada punto se abre y se cierra (se aleja del centro en línea recta y vuelve), pero no todos a la
 * vez: se abre de arriba abajo, se cierra pasándose hacia dentro y vuelve, también de arriba abajo.
 * Los puntos no cambian de tamaño. Curva y medidas sacadas del vídeo (ciclo de 2,23 s).
 *
 * El símbolo queda donde estaba en la compartida (300 px, centro en 640 × 329): ahí aterriza el logo
 * que viaja desde Ready.
 */
const CENTER = { x: 300, y: 299.5 };
const MAX_R = 268;   // distancia del punto más alejado, para normalizar

// Centro de cada punto, leído del propio trazo: empieza arriba del círculo (M cx, cy−r) y la
// primera curva acaba a la derecha (cx+r, cy)
const DOTS = DOT_PATHS.map(d => {
  const n = d.match(/-?\d+(\.\d+)?/g).map(Number);
  const [sx, sy] = n;
  const [ex] = n.slice(6, 8);
  const r = ex - sx;
  const dx = sx - CENTER.x;
  const dy = sy + r - CENTER.y;
  const dist = Math.hypot(dx, dy);
  // Cuánto se aleja con todo abierto (medido en el vídeo, 22/10): los de fuera ~64 unidades, los de
  // dentro ~29; los de dentro se mueven proporcionalmente más (el hueco del centro crece casi un 50 %)
  const move = 11.7 + 0.195 * dist;
  // Retraso (vídeo): arriba arranca primero, los lados ~0,17 s después y abajo 0,3 s después
  const v = (dy / MAX_R + 1) / 2;   // 0 arriba – 1 abajo
  return { d, mx: (dx / dist) * move, my: (dy / dist) * move, phase: v * 0.3 };
});

export default function TrackingScreen() {
  return (
    <div className={styles.screen}>
      <svg className={styles.bloom} width="300" height="300" viewBox="0 0 600 599" aria-hidden="true">
        {DOTS.map(({ d, mx, my, phase }, i) => (
          <path key={i} d={d} style={{ '--mx': mx, '--my': my, '--phase': `${phase}s` }} />
        ))}
      </svg>
      <h1 className={styles.heading}>Tracking…</h1>
      <p className={styles.subtitle}>We're analysing your sample.</p>
    </div>
  );
}
