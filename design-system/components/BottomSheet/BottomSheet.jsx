import { cloneElement, isValidElement, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './BottomSheet.module.css';

/**
 * BottomSheet — lista de acciones que sube desde abajo (mobile).
 * Figma: Web App 2.0 → "Bottom Sheet" (nodo 12847:128367).
 *
 * Equivalente touch del menú "⋯" de desktop: mismas opciones, cada una con icono y texto,
 * separadas por una línea. Las opciones `variant: 'danger'` se pintan en rojo.
 *
 * Se cierra tocando fuera, con Escape o arrastrando la manija hacia abajo. Al elegir una
 * opción se cierra y después ejecuta la acción.
 *
 * @param {boolean}  open
 * @param {Array}    items  - { label, icon?, variant?: 'default'|'danger', disabled?, tooltip?, onClick }
 * @param {function} onClose
 * @param {string}   [label] - Nombre accesible del diálogo (no se muestra).
 */
export default function BottomSheet({ open, items = [], onClose, label = 'Actions' }) {
  const sheetRef = useRef(null);
  const drag = useRef(null);
  const [dragY, setDragY] = useState(0);

  useEffect(() => {
    if (!open) { setDragY(0); return; }
    function onKey(e) { if (e.key === 'Escape') onClose?.(); }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sheetRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  // Los toques DENTRO del panel no llegan al `document`. Las pantallas cierran sus menús
  // escuchando toques "afuera" en el document, y el sheet vive en un portal fuera de su
  // contenedor: sin esto, tocar una opción cerraba el menú antes de que llegara el click.
  // Los toques en el fondo oscuro sí llegan, así que tocar afuera sigue cerrando.
  useEffect(() => {
    const el = sheetRef.current;
    if (!open || !el) return;
    const stop = e => e.stopPropagation();
    const events = ['mousedown', 'pointerdown', 'touchstart'];
    events.forEach(type => el.addEventListener(type, stop));
    return () => events.forEach(type => el.removeEventListener(type, stop));
  }, [open]);

  if (!open) return null;

  function onPointerDown(e) {
    drag.current = { startY: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e) {
    if (!drag.current) return;
    setDragY(Math.max(0, e.clientY - drag.current.startY));
  }
  function onPointerUp() {
    if (!drag.current) return;
    drag.current = null;
    if (dragY > 80) onClose?.();
    else setDragY(0);
  }

  // Los iconos del sheet van a 24px (Figma), aunque vengan a 16 desde un menú de desktop.
  function sheetIcon(icon) {
    return isValidElement(icon) ? cloneElement(icon, { size: 24 }) : icon;
  }

  return createPortal(
    // stopPropagation también en el fondo: en React los eventos de un portal suben por el
    // árbol de componentes, así que cerrar tocando afuera podía llegar a una fila clickeable
    // de la tabla que abrió el menú y abrir su detalle.
    <div className={styles.overlay} onClick={e => { e.stopPropagation(); onClose?.(); }}>
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        style={dragY ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
        onClick={e => e.stopPropagation()}
      >
        <div
          className={styles.handleArea}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <span className={styles.handle} />
        </div>

        <ul className={styles.list}>
          {items.map(item => (
            <li key={item.label} className={styles.listItem}>
              <button
                type="button"
                className={`${styles.item} ${item.variant === 'danger' ? styles.itemDanger : ''}`}
                disabled={item.disabled}
                title={item.disabled ? item.tooltip : undefined}
                onClick={() => { onClose?.(); item.onClick?.(); }}
              >
                {item.icon && <span className={styles.itemIcon}>{sheetIcon(item.icon)}</span>}
                <span className={styles.itemLabel}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
