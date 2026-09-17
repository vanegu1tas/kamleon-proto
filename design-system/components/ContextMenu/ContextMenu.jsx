import { useEffect, useState } from 'react';
import BottomSheet from '../BottomSheet/BottomSheet';
import styles from './ContextMenu.module.css';

const PHONE_QUERY = '(max-width: 390px)';

// "Tocar afuera" para las pantallas que no pasan `onClose`: todas cierran su menú
// escuchando un mousedown fuera de su contenedor, así que simularlo sobre el body las
// cierra sin tener que modificar cada una.
function dismissFromOutside() {
  document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
}

/**
 * ContextMenu
 *
 * Menú desplegable de acciones contextuales (botón de tres puntos, botón "+").
 *
 * Regla de teléfono (≤390px), aplicada por el componente: el menú se muestra como
 * BottomSheet en vez de flotante. Opciones de 56px en lugar de ~36, mismo patrón que las
 * acciones de las cards, y la acción destructiva con su propia fila. Ninguna pantalla lo
 * tiene que pedir.
 *
 * @param {Array} items - Array de { label, icon, onClick, variant?, disabled?, tooltip? }
 *   variant: 'default' (por defecto) | 'danger' (texto rojo)
 *   disabled: si es true, el item no se puede clickear (ej. "no podés removerte a vos mismo")
 *   tooltip: texto nativo (title) que explica por qué está deshabilitado
 * @param {function} [onClose] - Solo se usa en teléfono (cerrar el sheet con Escape o
 *   arrastrando). Si no se pasa, se simula un toque afuera, que es como las pantallas
 *   ya cierran sus menús.
 */
export default function ContextMenu({ items = [], onClose }) {
  const [isPhone, setIsPhone] = useState(() => window.matchMedia(PHONE_QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    const onChange = e => setIsPhone(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (isPhone) {
    return (
      <BottomSheet
        open
        items={items}
        onClose={onClose ?? dismissFromOutside}
      />
    );
  }

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
