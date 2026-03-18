import styles from './Toggle.module.css';

export default function Toggle({ checked = false, onChange, size = 's', label = true, disabled = false }) {
  return (
    <div className={styles.wrap}>
      {label && (
        <span className={styles.label}>{checked ? 'ON' : 'OFF'}</span>
      )}
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`${styles.track} ${styles[size]} ${checked ? styles.on : ''} ${disabled ? styles.disabled : ''}`}
        onClick={() => onChange?.(!checked)}
      >
        <span className={styles.thumb} />
      </button>
    </div>
  );
}
