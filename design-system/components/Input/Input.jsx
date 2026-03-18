import { useRef } from 'react';
import styles from './Input.module.css';

/**
 * Input
 *
 * Campo de texto base del Design System.
 *
 * @param {string}   label        - Texto del label
 * @param {boolean}  required     - Muestra asterisco rojo
 * @param {string}   description  - Texto de ayuda debajo del label
 * @param {string}   placeholder
 * @param {string}   value
 * @param {function} onChange
 * @param {string}   error        - Mensaje de error (activa estado error)
 * @param {boolean}  disabled
 */
export default function Input({
  label,
  required = false,
  description,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  type = 'text',
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

      <input
        type={type}
        className={`${styles.input} ${error ? styles.inputError : ''} ${disabled ? styles.inputDisabled : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={e => {
          let val = e.target.value;
          if (type === 'tel') val = val.replace(/[^\d+\-()\s]/g, '');
          onChange?.(val);
        }}
        disabled={disabled}
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
