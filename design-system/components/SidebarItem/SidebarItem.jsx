import styles from './SidebarItem.module.css';

/**
 * SidebarItem
 *
 * Ítem de navegación lateral. Usado dentro del componente Sidebar.
 *
 * @param {React.ReactNode}          icon      - Componente de icono
 * @param {string}                   label     - Texto del ítem
 * @param {('default'|'selected')}   state     - Estado visual
 * @param {boolean}                  collapsed - Modo colapsado (solo icono)
 * @param {function}                 onClick
 */
export default function SidebarItem({
  icon,
  label,
  state = 'default',
  collapsed = false,
  onClick,
}) {
  return (
    <button
      className={[
        styles.item,
        styles[state],
        collapsed ? styles.collapsed : styles.expanded,
      ].join(' ')}
      onClick={onClick}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {!collapsed && <span className={styles.label}>{label}</span>}
    </button>
  );
}
