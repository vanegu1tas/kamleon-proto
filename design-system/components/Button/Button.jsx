import styles from './Button.module.css';

/**
 * Button
 *
 * @param {('primary'|'secondary')} variant - Variante visual del botón
 * @param {('s'|'m')}               size    - Tamaño del botón
 * @param {boolean}                 disabled - Estado deshabilitado
 * @param {React.ReactNode}         leftIcon - Ícono a la izquierda del texto
 * @param {React.ReactNode}         children - Texto o contenido del botón
 */
export default function Button({
  variant = 'primary',
  size = 's',
  disabled = false,
  leftIcon,
  children,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      className={[
        styles.button,
        styles[variant],
        styles[size],
      ].join(' ')}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {leftIcon && (
        <span className={styles.icon}>{leftIcon}</span>
      )}
      {children}
    </button>
  );
}
