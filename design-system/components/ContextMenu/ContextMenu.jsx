import styles from './ContextMenu.module.css';

/**
 * ContextMenu
 *
 * Menú desplegable de acciones contextuales (botón de tres puntos).
 *
 * @param {Array} items - Array de { label, icon, onClick, variant? }
 *   variant: 'default' (por defecto) | 'danger' (texto rojo)
 */
export default function ContextMenu({ items = [] }) {
  return (
    <div className={styles.menu} role="menu">
      {items.map((item, i) => (
        <button
          key={i}
          className={[styles.item, item.variant === 'danger' ? styles.danger : ''].join(' ')}
          onClick={item.onClick}
          role="menuitem"
          type="button"
        >
          {item.icon && <span className={styles.icon}>{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
