import { useRef } from 'react';
import styles from './Textarea.module.css';

/**
 * Textarea
 *
 * Campo de texto multilínea del Design System.
 *
 * @param {string}   label        - Texto del label
 * @param {boolean}  required     - Muestra asterisco rojo
 * @param {string}   description  - Texto de ayuda debajo del label
 * @param {string}   placeholder
 * @param {string}   value
 * @param {function} onChange
 * @param {string}   error        - Mensaje de error (activa estado error)
 * @param {boolean}  disabled
 * @param {number}   rows         - Filas visibles (por defecto 5)
 */
export default function Textarea({
  label,
  required = false,
  description,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  rows = 5,
  ...props
}) {
  const mouseDown = useRef(false);

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

      <textarea
        className={`${styles.textarea} ${error ? styles.textareaError : ''} ${disabled ? styles.textareaDisabled : ''}`}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        onMouseDown={() => { mouseDown.current = true; }}
        onFocus={e => {
          if (mouseDown.current) e.currentTarget.dataset.mouseFocus = 'true';
          mouseDown.current = false;
        }}
        onBlur={e => { delete e.currentTarget.dataset.mouseFocus; }}
        {...props}
      />

      {error && (
        <span className={styles.errorMsg}>{error}</span>
      )}

    </div>
  );
}
