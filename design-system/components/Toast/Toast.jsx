import { useEffect } from 'react';
import { IconClose, IconCheckCircle, IconWarning2 } from '../../icons/outline';
import styles from './Toast.module.css';

/**
 * Toast
 *
 * @param {string}   message   - Texto a mostrar
 * @param {function} onClose   - Callback al cerrar (manual o automático)
 * @param {function} onUndo    - Si se pasa, muestra el enlace "Undo"
 * @param {number}   duration  - Ms antes de auto-cerrar. 0 = sin auto-cierre. Default: 4000
 * @param {'success'|'critic'} mode - Variante visual. Default: 'success'
 */
export default function Toast({ message, onClose, onUndo, duration = 4000, delay = 0, mode = 'success' }) {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(onClose, duration + delay);
    return () => clearTimeout(timer);
  }, [duration, delay, onClose]);

  return (
    <div
      className={styles.toast}
      role="status"
      aria-live="polite"
      style={delay ? { animationDelay: `${delay}ms`, animationFillMode: 'both' } : undefined}
    >

      <div className={`${styles.iconWrap} ${mode === 'success' ? styles.iconWrapSuccess : styles.iconWrapCritic}`}>
        {mode === 'critic'
          ? <IconWarning2 size={24} />
          : <IconCheckCircle size={24} />}
      </div>

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
