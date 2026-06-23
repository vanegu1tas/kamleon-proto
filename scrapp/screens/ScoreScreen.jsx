import styles from './ScoreScreen.module.css';
import GaugeChart, { getZone } from '../components/GaugeChart';
import LogoKamleon from '../../design-system/icons/LogoKamleon';

const SCORE = 56;

export default function ScoreScreen() {
  const zone = getZone(SCORE);

  return (
    <div className={styles.screen}>
      <GaugeChart score={SCORE} />

      <div className={styles.status}>
        <p className={styles.statusLabel} style={{ color: zone.color }}>
          You are {zone.label.toLowerCase()}
        </p>
        <p className={styles.statusSub}>Result visible for 15 seconds.</p>
      </div>

      <div className={styles.logo}>
        <LogoKamleon width={110} height={20} color="white" />
      </div>
    </div>
  );
}
