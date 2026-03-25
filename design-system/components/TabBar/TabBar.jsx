import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import styles from './TabBar.module.css';

/**
 * TabBar
 *
 * @param {Array}    tabs       - Array de { id, label }
 * @param {string}   activeTab  - id del tab activo
 * @param {function} onChange   - callback(id) al cambiar tab
 * @param {'m'|'s'}  size       - Tamaño del tab bar. 'm' = 56px / 16px. 's' = 36px / 14px. Default: 'm'
 */
export default function TabBar({ tabs = [], activeTab, onChange, size = 'm' }) {
  const tabRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [glowStyle, setGlowStyle] = useState({ left: 0, width: 0 });
  const [glowVisible, setGlowVisible] = useState(false);

  const INDICATOR_W = size === 's' ? 48 : 56;
  const INDICATOR_DURATION = 280;

  useLayoutEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      setIndicatorStyle({
        left: el.offsetLeft + (el.offsetWidth - INDICATOR_W) / 2,
        width: INDICATOR_W,
      });
    }
  }, [activeTab]);

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
    <div className={`${styles.tabBar} ${size === 's' ? styles.tabBarS : ''}`}>
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
          className={`${styles.tab} ${size === 's' ? styles.tabS : ''} ${activeTab === tab.id ? styles.tabActive : ''}`}
          onClick={() => onChange?.(tab.id)}
        >
          <span className={styles.tabLabel}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
