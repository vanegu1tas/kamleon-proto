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
        <button className={styles.guestText} onClick={onGuest}>
          Or just go — no account needed, nothing saved
        </button>
      </div>

      {/* Pasivo: no requiere tap real, funciona con solo estar frente al lector */}
      <div className={styles.rfidZone}>
        <svg className={styles.rfidIcon} width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 2a10 10 0 0 1 7.07 17.07M12 6a8 8 0 0 1 5.66 13.66M12 10a4 4 0 0 1 2.83 6.83M12 14v0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className={styles.rfidText}>Tap your card</span>
        <svg className={styles.chevron} width="20" height="12" viewBox="0 0 24 14" fill="none">
          <path d="M2 2L12 12L22 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <SimulateButton label="Simulate RFID tap" onClick={onSimulateRfid} />
      </div>

      {/* Pasivo: no requiere tap real, funciona con solo escanear */}
      <div className={styles.qrZone}>
        <QrPlaceholder size={92} color="rgba(255,255,255,0.6)" />
        <span className={styles.qrText}>Scan to sign in</span>
        <SimulateButton label="Simulate QR scan" onClick={onSimulateQr} />
      </div>
    </div>
  );
}
