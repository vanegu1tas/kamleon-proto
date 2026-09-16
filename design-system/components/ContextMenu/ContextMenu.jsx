import styles from './ContextMenu.module.css';

/**
 * ContextMenu
 *
 * Menú desplegable de acciones contextuales (botón de tres puntos).
 *
 * @param {Array} items - Array de { label, icon, onClick, variant?, disabled?, tooltip? }
 *   variant: 'default' (por defecto) | 'danger' (texto rojo)
 *   disabled: si es true, el item no se puede clickear (ej. "no podés removerte a vos mismo")
 *   tooltip: texto nativo (title) que explica por qué está deshabilitado
 */
export default function ContextMenu({ items = [] }) {
  return (
    <div className={styles.menu} role="menu">
      {items.map((item, i) => (
        <button
          key={i}
          className={[styles.item, item.variant === 'danger' ? styles.danger : '', item.disabled ? styles.itemDisabled : ''].join(' ')}
          onClick={item.disabled ? undefined : item.onClick}
          disabled={item.disabled}
          title={item.disabled ? item.tooltip : undefined}
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
