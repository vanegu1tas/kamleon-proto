import { useEffect, useRef, useState } from 'react';
import { IconClose, IconCheckCircle, IconWarning2 } from '../../icons/outline';
import styles from './Toast.module.css';

// Igual que la duración de toastOut en el CSS: la salida es más rápida que la entrada.
const EXIT_MS = 180;

/**
 * Toast
 *
 * @param {string}   message   - Texto a mostrar
 * @param {function} onClose   - Callback al cerrar (manual o automático)
 * @param {function} onUndo    - Si se pasa, muestra el enlace "Undo"
 * @param {number}   duration  - Ms antes de auto-cerrar. 0 = sin auto-cierre. Default: 4000
 * @param {'success'|'critic'} mode - Variante visual. Default: 'success'
 */
export default function Toast(props) {
  // Un mensaje nuevo con el toast todavía en pantalla cuenta como toast nuevo: se vuelve a
  // montar, repite la entrada y su temporizador arranca de cero. (Si el mensaje es idéntico al
  // anterior, React ni re-renderiza: para eso haría falta un id desde quien lo llama.)
  return <ToastInner key={props.message} {...props} />;
}

function ToastInner({ message, onClose, onUndo, duration = 4000, delay = 0, mode = 'success' }) {
  const [leaving, setLeaving] = useState(false);

  // onClose suele llegar como función nueva en cada render del padre; guardarla en un ref evita
  // que cada re-render reinicie el temporizador de cierre.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => onCloseRef.current?.(), EXIT_MS);
    return () => clearTimeout(timer);
  }, [leaving]);

  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => setLeaving(true), duration + delay);
    return () => clearTimeout(timer);
  }, [duration, delay]);

  return (
    <div
      className={`${styles.toast} ${leaving ? styles.leaving : ''}`}
      role="status"
      aria-live="polite"
      style={delay && !leaving ? { animationDelay: `${delay}ms`, animationFillMode: 'both' } : undefined}
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

      <button className={styles.closeBtn} onClick={() => setLeaving(true)} aria-label="Dismiss">
        <IconClose size={16} />
      </button>

    </div>
  );
}
