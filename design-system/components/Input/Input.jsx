import { useRef, useState } from 'react';
import styles from './Input.module.css';
import { IconEye, IconEyeClosed } from '../../icons/outline/index.js';

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
  suffix,
  onSubtle = false,
  ...props
}) {
  const mouseDown = useRef(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === 'password';
  const hasSuffix  = !!suffix && !isPassword;
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const sharedHandlers = {
    onMouseDown: () => { mouseDown.current = true; },
    onFocus: e => {
      setFocused(true);
      if (mouseDown.current) e.currentTarget.dataset.mouseFocus = 'true';
      mouseDown.current = false;
    },
    onBlur: e => {
      setFocused(false);
      delete e.currentTarget.dataset.mouseFocus;
    },
  };

  const inputEl = (
    <input
      type={resolvedType}
      className={`${hasSuffix ? styles.inputBare : styles.input} ${isPassword ? styles.inputWithToggle : ''} ${onSubtle && !hasSuffix ? styles.inputOnSubtle : ''} ${error && !hasSuffix ? styles.inputError : ''} ${disabled && !hasSuffix ? styles.inputDisabled : ''}`}
      size={hasSuffix ? Math.max(2, (value?.length || 0) + 1) : undefined}
      placeholder={placeholder}
      value={value}
      onChange={e => {
        let val = e.target.value;
        if (type === 'tel') val = val.replace(/[^\d+\-()\s]/g, '');
        onChange?.(val);
      }}
      disabled={disabled}
      {...sharedHandlers}
      {...props}
    />
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

      {isPassword ? (
        <div className={styles.inputWrap}>
          {inputEl}
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowPassword(v => !v)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <IconEye size={20} /> : <IconEyeClosed size={20} />}
          </button>
        </div>
      ) : hasSuffix ? (
        <div className={`${styles.suffixWrap} ${onSubtle ? styles.suffixOnSubtle : ''} ${error ? styles.suffixError : ''} ${disabled ? styles.suffixDisabled : ''} ${focused ? styles.suffixFocused : ''}`}>
          {inputEl}
          <span className={styles.suffixText}>{suffix}</span>
        </div>
      ) : inputEl}

      {error && (
        <span className={styles.errorMsg}>{error}</span>
      )}

    </div>
  );
}
