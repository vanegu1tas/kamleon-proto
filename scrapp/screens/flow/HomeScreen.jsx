import styles from './HomeScreen.module.css';
import QrPlaceholder from '../../components/QrPlaceholder';
import SimulateButton from '../../components/SimulateButton';

export default function HomeScreen({ onLogin, onSimulateQr, onSimulateRfid, onGuest }) {
  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <h1 className={styles.title}>KAMLEON®</h1>
        <p className={styles.subtitle}>Track your hydration</p>
        <button className={styles.loginButton} onClick={onLogin}>Log in</button>
        <button className={styles.guestText} onClick={onGuest}>Urinate to start</button>
      </div>

      <div className={styles.rfidZone}>
        <span className={styles.rfidText}>Contactless log in under the display</span>
        <svg className={styles.chevron} width="24" height="14" viewBox="0 0 24 14" fill="none">
          <path d="M2 2L12 12L22 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <SimulateButton label="Simulate RFID tap" onClick={onSimulateRfid} />
      </div>

      <div className={styles.qrZone}>
        <QrPlaceholder size={120} />
        <SimulateButton label="Simulate QR scan" onClick={onSimulateQr} />
      </div>
    </div>
  );
}
