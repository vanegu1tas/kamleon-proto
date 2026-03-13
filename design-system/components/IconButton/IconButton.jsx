import styles from './IconButton.module.css';

/**
 * IconButton — botón cuadrado de 32×32 que contiene un único icono.
 *
 * @param {React.ReactNode} children        - El icono a renderizar
 * @param {string}          aria-label      - Requerido para accesibilidad
 * @param {string}          [tooltip]       - Texto del tooltip visual (data-tooltip)
 * @param {'top'|'bottom'|'left'|'right'} [tooltipPosition='bottom']
 * @param {'default'|'danger'} [variant='default']
 * @param {boolean}         [disabled=false]
 * @param {function}        [onClick]
 */
export default function IconButton({
  children,
  'aria-label': ariaLabel,
  tooltip,
  tooltipPosition = 'bottom',
  variant = 'default',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const classes = [
    styles.btn,
    styles[variant],
    tooltip ? styles[`tooltip-${tooltipPosition}`] : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      aria-label={ariaLabel}
      data-tooltip={tooltip}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
