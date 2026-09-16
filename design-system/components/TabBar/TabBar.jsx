import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import styles from './TabBar.module.css';

/**
 * TabBar
 *
 * @param {Array}    tabs       - Array de { id, label, hasDot? } — hasDot muestra un punto rojo a la izquierda del label
 * @param {string}   activeTab  - id del tab activo
 * @param {function} onChange   - callback(id) al cambiar tab
 * @param {'m'|'s'}  size       - Tamaño del tab bar. 'm' = 56px / 16px. 's' = 36px / 14px. Default: 'm'
 * @param {boolean}  [scrollable=false] - En vez de repartir el ancho en partes iguales (y recortar
 *   el último tab si no entran), cada tab ocupa su ancho natural y el conjunto scrollea horizontal
 *   si no cabe. Solo tiene efecto en mobile/tablet (max-width: 768px) — en desktop no cambia nada.
 */
export default function TabBar({ tabs = [], activeTab, onChange, size = 'm', scrollable = false }) {
  const tabRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [glowStyle, setGlowStyle] = useState({ left: 0, width: 0 });
  const [glowVisible, setGlowVisible] = useState(false);

  const INDICATOR_W = size === 's' ? 48 : 56;
  const INDICATOR_DURATION = 280;

  useLayoutEffect(() => {
    const el = tabRefs.current[activeTab];
    if (!el) return;

    function measure() {
      setIndicatorStyle({
        left: el.offsetLeft + (el.offsetWidth - INDICATOR_W) / 2,
        width: INDICATOR_W,
      });
    }

    measure();

    // El offsetWidth medido al montar puede quedar desactualizado si el tab
    // cambia de tamaño después (la fuente custom carga async y el label mide
    // distinto con la fuente real vs. la de fallback) — sin este observer, el
    // indicador queda pegado a la medición vieja para siempre, porque el
    // effect solo vuelve a correr si cambia activeTab, no por un resize.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeTab, INDICATOR_W]);

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (!el) return;
    setGlowVisible(false);
    const timer = setTimeout(() => {
      setGlowStyle({ left: el.offsetLeft, width: el.offsetWidth });
      setGlowVisible(true);
    }, INDICATOR_DURATION);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className={`${styles.tabBar} ${size === 's' ? styles.tabBarS : ''} ${scrollable ? styles.tabBarScrollable : ''} ${tabs.length === 1 ? styles.tabBarSingle : ''}`}>
      <span
        className={`${styles.tabGlow} ${glowVisible ? styles.tabGlowVisible : ''}`}
        style={glowStyle}
      />
      <span
        className={`${styles.tabIndicator} ${size === 's' ? styles.tabIndicatorS : ''}`}
        style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
      />
      {tabs.map(tab => (
        <button
          key={tab.id}
          ref={el => { tabRefs.current[tab.id] = el; }}
          className={`${styles.tab} ${size === 's' ? styles.tabS : ''} ${scrollable ? styles.tabScrollable : ''} ${activeTab === tab.id ? styles.tabActive : ''}`}
          onClick={() => onChange?.(tab.id)}
        >
          <span className={styles.tabLabel}>
            {tab.hasDot && <span className={styles.tabDot} />}
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}
