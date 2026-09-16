import styles from './PulseLoader.module.css';
import { DOT_PATHS } from './LogoDots';

export default function PulseLoader({ size = 300 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 600 599" fill="none">
      <g className={styles.spin}>
        <g className={styles.pulse}>
          {DOT_PATHS.map((d, i) => (
            <path key={i} d={d} fill="var(--color-turquoise-51)" />
          ))}
        </g>
      </g>
    </svg>
  );
}
