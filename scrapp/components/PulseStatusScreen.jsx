import styles from './PulseStatusScreen.module.css';
import PulseLoader from './PulseLoader';

// Layout compartido por Start y Tracking (mismo mandala animado + heading + subtítulo).
export default function PulseStatusScreen({ heading, subtitle, onClose, children }) {
  return (
    <div className={styles.screen}>
      {onClose && (
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
      <PulseLoader size={300} />
      <h1 className={styles.heading}>{heading}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
      {children && <div className={styles.simulate}>{children}</div>}
    </div>
  );
}
