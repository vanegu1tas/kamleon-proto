import styles from './RingLoader.module.css';

const DOT_COUNT = 14;
const R = 140;
const DOT_R = 13;
const CX = 150, CY = 150;

export default function RingLoader({ size = 300 }) {
  const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
    const angle = (i / DOT_COUNT) * 2 * Math.PI - Math.PI / 2;
    return {
      cx: CX + R * Math.cos(angle),
      cy: CY + R * Math.sin(angle),
    };
  });

  return (
    <svg width={size} height={size} viewBox="0 0 300 300" fill="none">
      <g className={styles.ring} style={{ transformOrigin: `${CX}px ${CY}px` }}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={DOT_R} fill="var(--color-turquoise-51)" />
        ))}
      </g>
    </svg>
  );
}
