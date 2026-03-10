import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const btnRef = useRef(null);
  const [tooltipPos, setTooltipPos] = useState(null);

  function handleMouseEnter() {
    if (!collapsed) return;
    const rect = btnRef.current.getBoundingClientRect();
    const sidebar = btnRef.current.closest('aside');
    const sidebarRight = sidebar ? sidebar.getBoundingClientRect().right : rect.right;
    setTooltipPos({
      top: rect.top + rect.height / 2,
      left: sidebarRight + 8,
    });
  }

  function handleMouseLeave() {
    setTooltipPos(null);
  }

  return (
    <>
      <button
        ref={btnRef}
        className={[
          styles.item,
          styles[state],
          collapsed ? styles.collapsed : styles.expanded,
        ].join(' ')}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        {!collapsed && <span className={styles.label}>{label}</span>}
      </button>

      {tooltipPos && createPortal(
        <div
          className={styles.tooltip}
          style={{ top: tooltipPos.top, left: tooltipPos.left }}
        >
          <span className={styles.tooltipArrow} />
          {label}
        </div>,
        document.body
      )}
    </>
  );
}
