import { IconChevronDown } from '../../icons/outline';
import styles from './Dropdown.module.css';

/**
 * Dropdown
 *
 * Select nativo estilizado del Design System.
 *
 * @param {string}   label        - Texto del label
 * @param {boolean}  required     - Muestra asterisco rojo
 * @param {string}   description  - Texto de ayuda debajo del label
 * @param {string}   placeholder  - Opción vacía inicial (valor '')
 * @param {Array}    options      - Array de { label, value } o strings
 * @param {string}   value
 * @param {function} onChange
 * @param {string}   error        - Mensaje de error (activa estado error)
 * @param {boolean}  disabled
 */
export default function Dropdown({
  label,
  required = false,
  description,
  placeholder,
  options = [],
  value,
  onChange,
  error,
  disabled = false,
  ...props
}) {
  const normalized = options.map(opt =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  return (
    <div className={styles.wrap}>

      {label && (
        <div className={styles.labelRow}>
          <span className={styles.label}>{label}</span>
          {required && <span className={styles.required}>*</span>}
        </div>
      )}

      {description && (
        <span className={styles.description}>{description}</span>
      )}

      <div className={styles.selectWrap}>
        <select
          className={`${styles.select} ${error ? styles.selectError : ''} ${disabled ? styles.selectDisabled : ''}`}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          disabled={disabled}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {normalized.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className={styles.icon}>
          <IconChevronDown size={16} />
        </span>
      </div>

      {error && (
        <span className={styles.errorMsg}>{error}</span>
      )}

    </div>
  );
}
