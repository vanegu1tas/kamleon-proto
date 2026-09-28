import styles from './Button.module.css';

/**
 * Button
 *
 * @param {('primary'|'secondary'|'tertiary'|'subtle'|'subtleAccent'|'subtleDanger'|'danger')} variant
 *   primary:  negro, la acción que la pantalla pide.
 *   secondary: blanco con borde, la acompaña sin competir.
 *   tertiary: transparente, el "Cancel" que acompaña a una destructiva.
 *   subtle:   relleno gris suave, sin borde — para una acción secundaria
 *             dentro de una tarjeta o el pie de un drawer.
 *   subtleAccent: igual que subtle, con el texto en el turquesa de acento —
 *             la acción principal dentro de una tarjeta.
 *   subtleDanger: igual que subtle, con el texto en rojo.
 *   danger:   relleno rojo, confirmar un borrado.
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
