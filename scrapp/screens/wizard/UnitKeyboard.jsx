import styles from './UnitKeyboard.module.css';

/**
 * Teclado de la pantalla Unit ID en producción (foto del brief Wizard v2): panel blanco
 * centrado, fila de números, sin mayúsculas, "Space", "Delete" y "Close".
 * Las teclas de la fila 3 y 4 que no se leen bien en la foto se han rellenado con "." y ",".
 */
const ROWS = [
  '1234567890'.split(''),
  'qwertyuiop'.split(''),
  [...'asdfghjkl'.split(''), '.'],
  [...'zxcvbnm'.split(''), ',', { id: 'delete', label: 'Delete', grow: 2 }],
  [{ id: 'space', label: 'Space', grow: 5 }, { grow: 3, spacer: true }, { id: 'close', label: 'Close', grow: 2 }],
];

export default function UnitKeyboard({ onKey, onDelete, onClose }) {
  function press(key) {
    if (typeof key === 'string') onKey(key);
    else if (key.id === 'space') onKey(' ');
    else if (key.id === 'delete') onDelete();
    else if (key.id === 'close') onClose();
  }

  return (
    <div className={styles.keyboard}>
      {ROWS.map((row, r) => (
        <div key={r} className={styles.row}>
          {row.map((key, i) => key.spacer
            ? <span key={i} style={{ flexGrow: key.grow }} className={styles.spacer} />
            : (
              <button key={i} className={styles.key}
                style={{ flexGrow: typeof key === 'string' ? 1 : key.grow }}
                onClick={() => press(key)}>
                {typeof key === 'string' ? key : key.label}
              </button>
            ))}
        </div>
      ))}
    </div>
  );
}
