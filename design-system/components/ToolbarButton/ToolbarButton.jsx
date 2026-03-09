import styles from './ToolbarButton.module.css';

/**
 * ToolbarButton
 *
 * Botón pill para barras de herramientas de tabla (filtros, exportar, etc.).
 *
 * @param {React.ReactNode} icon     - Icono a la izquierda del label
 * @param {React.ReactNode} children - Texto del botón
 * @param {boolean}         selected - Estado activo (filtros aplicados, etc.)
 * @param {boolean}         disabled - Estado deshabilitado
 * @param {function}        onClick
 */
export default function ToolbarButton({
  icon,
  children,
  selected = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      className={[
        styles.button,
        selected ? styles.selected : '',
      ].join(' ')}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
}
