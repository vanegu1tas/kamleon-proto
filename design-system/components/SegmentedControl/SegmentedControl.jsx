import styles from './SegmentedControl.module.css';

/**
 * SegmentedControl
 *
 * Control de selección exclusiva tipo pill. Activo = pill negro.
 *
 * @param {Array}    options  - Array de { label, value }
 * @param {string}   value    - Valor actualmente seleccionado
 * @param {function} onChange - Callback con el nuevo value
 */
export default function SegmentedControl({ options = [], value, onChange }) {
  return (
    <div className={styles.container}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={`${styles.option} ${value === opt.value ? styles.active : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
