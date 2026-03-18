import { useEffect } from 'react';
import { IconClose } from '../../icons/outline';
import styles from './Toast.module.css';

function IconSuccess() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="var(--color-green-62)" />
      <path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCritic() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="var(--color-red-65)" />
      <path d="M12 8V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 16H12.01" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Toast
 *
 * Notificación temporal tipo pill.
 *
 * @param {string}   message   - Texto a mostrar
 * @param {function} onClose   - Callback al cerrar (manual o automático)
 * @param {function} onUndo    - Si se pasa, muestra el enlace "Undo"
 * @param {number}   duration  - Ms antes de auto-cerrar. 0 = sin auto-cierre. Default: 4000
 * @param {'success'|'critic'} mode - Variante visual. Default: 'success'
 */
export default function Toast({ message, onClose, onUndo, duration = 4000, mode = 'success' }) {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <span className={styles.iconWrap}>
        {mode === 'critic' ? <IconCritic /> : <IconSuccess />}
      </span>
      <span className={styles.message}>{message}</span>
      {onUndo && (
        <button className={styles.undoBtn} onClick={onUndo}>Undo</button>
      )}
      <span className={styles.divider} />
      <button className={styles.closeBtn} onClick={onClose} aria-label="Dismiss">
        <IconClose size={16} />
      </button>
    </div>
  );
}
