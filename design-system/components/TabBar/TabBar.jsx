import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import styles from './TabBar.module.css';

export default function TabBar({ tabs = [], activeTab, onChange }) {
  const tabRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [glowStyle, setGlowStyle] = useState({ left: 0, width: 0 });
  const [glowVisible, setGlowVisible] = useState(false);

  const INDICATOR_W = 56;
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
    <div className={styles.tabBar}>
      <span
        className={`${styles.tabGlow} ${glowVisible ? styles.tabGlowVisible : ''}`}
        style={glowStyle}
      />
      <span
        className={styles.tabIndicator}
        style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
      />
      {tabs.map(tab => (
        <button
          key={tab.id}
          ref={el => { tabRefs.current[tab.id] = el; }}
          className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
          onClick={() => onChange?.(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
