import ScreenE from './ScreenE';
import base from './E.module.css';
import styles from './HomeE.module.css';

/**
 * Home / reposo · E (17/11). El escenario es el protagonista: el agua ocupa la pantalla y la
 * interfaz va en un panel negro centrado (título, Log in, entrar sin cuenta). El QR en otro panel
 * pequeño abajo a la derecha y "Tap your card" en el centro de abajo, como en la A.
 */
export default function HomeE(props) {
  return (
    <ScreenE {...props}>
      <section className={`${styles.hero} ${base.panel} ${base.slideUp}`}>
        <h1 className={styles.title}>Track your hydration</h1>
        <p className={base.body}>Log in to save your results and get your recommendation.</p>
        <div className={styles.actions}>
          <button className={base.primary}>Log in</button>
          <button className={base.link}>Or just urinate and see your score</button>
        </div>
      </section>

      <div className={`${styles.qr} ${base.panel} ${base.keepPanel} ${base.slideUp}`} style={{ animationDelay: '0.1s' }}>
        <QrMark />
        <span className={styles.hint}>Scan to sign in</span>
      </div>

      <div className={styles.rfid}>
        <span className={styles.hint}>Tap your card below</span>
        <svg className={styles.chevron} width="24" height="14" viewBox="0 0 24 14" fill="none" aria-hidden="true">
          <path d="M2 2L12 12L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </ScreenE>
  );
}

function QrMark() {
  const cells = [
    '1111111010111', '1000001011001', '1011101001011', '1011101110101', '1011101010001', '1000001001101',
    '1111111010101', '0000000011100', '1101011100111', '0110100101001', '1011011011101', '0100110100011', '1110101011011',
  ];
  return (
    <svg width="96" height="96" viewBox="0 0 13 13" shapeRendering="crispEdges" aria-hidden="true">
      {cells.flatMap((row, y) => [...row].map((c, x) => c === '1' && <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#FFFFFF" />))}
    </svg>
  );
}
