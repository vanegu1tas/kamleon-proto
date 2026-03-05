import { useState } from 'react';
import styles from './SearchBar.module.css';
import IconSearch from '../../icons/outline/IconSearch';
import IconClose from '../../icons/outline/IconClose';

/**
 * SearchBar
 *
 * Input de búsqueda con icono, placeholder y botón de limpiar.
 *
 * @param {string}   placeholder - Texto del placeholder
 * @param {string}   value       - Valor controlado (opcional)
 * @param {function} onChange    - Callback al cambiar el valor
 * @param {function} onClear     - Callback al limpiar
 * @param {boolean}  error       - Estado de error
 * @param {boolean}  disabled    - Estado deshabilitado
 * @param {string}   className   - Clase adicional
 */
export default function SearchBar({
  placeholder = 'Search',
  value,
  onChange,
  onClear,
  error = false,
  disabled = false,
  className,
}) {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue('');
    onClear?.();
  };

  const wrapperClass = [
    styles.wrapper,
    error ? styles.error : '',
    disabled ? styles.disabled : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      <span className={styles.searchIcon}>
        <IconSearch size={16} />
      </span>
      <input
        className={styles.input}
        type="text"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
      />
      {currentValue && !disabled && (
        <button
          className={styles.clearBtn}
          onClick={handleClear}
          type="button"
          aria-label="Clear search"
        >
          <IconClose size={16} />
        </button>
      )}
    </div>
  );
}
