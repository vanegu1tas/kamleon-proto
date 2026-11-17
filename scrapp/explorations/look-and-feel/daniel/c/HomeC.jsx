import ScreenC from './ScreenC';
import base from './C.module.css';
import styles from './HomeC.module.css';

/**
 * Home / reposo · C (17/11). Mismo contenido que la Home de la A; en la C el halo respira detrás del titular y el
 * Log in es la píldora blanco cálido (sin la luz del borde: eso es de la A).
 */
export default function HomeC(props) {
  return (
    <ScreenC {...props}>
      <main className={styles.main}>
        <h1 className={`${styles.hero} ${base.enter}`}>Track your hydration</h1>
        <p className={`${base.body} ${base.enter}`} style={{ animationDelay: '0.08s' }}>
          Log in to save your results and get your recommendation.
        </p>
        <div className={`${styles.actions} ${base.enter}`} style={{ animationDelay: '0.16s' }}>
          <button className={`${base.primary} ${styles.login}`}>Log in</button>
          <button className={base.link}>Or just urinate and see your score</button>
        </div>
      </main>

      <div className={styles.qr}>
        <div className={`${styles.qrBox} ${base.card}`}><QrMark /></div>
        <span className={styles.hint}>Scan to sign in</span>
      </div>

      <div className={styles.rfid}>
        <span className={styles.hint}>Tap your card below</span>
        <svg className={styles.chevron} width="24" height="14" viewBox="0 0 24 14" fill="none" aria-hidden="true">
          <path d="M2 2L12 12L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </ScreenC>
  );
}

// QR de muestra (no escaneable): solo para ver el sitio y el tamaño
function QrMark() {
  const cells = [
    '1111111010111', '1000001011001', '1011101001011', '1011101110101', '1011101010001', '1000001001101',
    '1111111010101', '0000000011100', '1101011100111', '0110100101001', '1011011011101', '0100110100011', '1110101011011',
  ];
  return (
    <svg width="92" height="92" viewBox="0 0 13 13" shapeRendering="crispEdges" aria-hidden="true">
      {cells.flatMap((row, y) => [...row].map((c, x) => c === '1' && <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#A39E97" />))}
    </svg>
  );
}
