import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import styles from './TabBar.module.css';
import { IconChevronMiniRight } from '../../icons/outline';

/**
 * TabBar
 *
 * @param {Array}    tabs       - Array de { id, label, hasDot? } — hasDot muestra un punto rojo a la izquierda del label
 * @param {string}   activeTab  - id del tab activo
 * @param {function} onChange   - callback(id) al cambiar tab
 * @param {'m'|'s'}  size       - Tamaño del tab bar. 'm' = 48px / 16px. 's' = 36px / 14px. Default: 'm'
 * @param {boolean}  [scrollable=false] - En vez de repartir el ancho en partes iguales (y recortar
 *   el último tab si no entran), cada tab ocupa su ancho natural y el conjunto scrollea horizontal
 *   si no cabe. Solo tiene efecto en mobile/tablet (max-width: 768px) — en desktop no cambia nada.
 */
// Regla de touch (≤768px), aplicada por el componente sin que cada pantalla la pida:
//   1. Tamaño M siempre, aunque se pida S: 36px de alto queda por debajo del mínimo táctil.
//   2. Scroll horizontal si las pestañas no entran, con flecha + degradado en el borde.
// `inset`: margen lateral (px) DENTRO del área de scroll. No es automático porque cada
// pantalla envuelve los tabs en su propio contenedor con padding — aplicarlo siempre lo
// duplicaría. Se usa cuando el contenedor no tiene padding lateral: así las pestañas
// arrancan alineadas con el contenido, pero al desplazarse pasan por debajo del borde de la
// tarjeta en vez de cortarse contra una franja blanca fija.
// `scrollable` queda por compatibilidad: en touch el scroll ya está siempre activo.
export default function TabBar({ tabs = [], activeTab, onChange, size: sizeProp = 'm', scrollable: scrollableProp = false, inset = 0 }) {
  const [isTouch, setIsTouch] = useState(() => window.matchMedia('(max-width: 768px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const onMqChange = e => setIsTouch(e.matches);
    mq.addEventListener('change', onMqChange);
    return () => mq.removeEventListener('change', onMqChange);
  }, []);

  const size = isTouch ? 'm' : sizeProp;
  const scrollable = isTouch || scrollableProp;

  const tabRefs = useRef({});
  const barRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [glowStyle, setGlowStyle] = useState({ left: 0, width: 0 });
  const [glowVisible, setGlowVisible] = useState(false);
  // Hay tabs fuera de pantalla a izquierda/derecha: se difumina ese borde para que se note
  // que la fila sigue. Sin esto, un tab como "Admins" queda invisible en mobile y para el
  // usuario directamente no existe.
  const [overflow, setOverflow] = useState({ start: false, end: false });

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

    // La medición al montar puede quedar desactualizada: la fuente custom carga async y
    // cambia el ancho de los labels. Se observan TODAS las pestañas y la barra, no solo la
    // activa — si se ensancha una pestaña anterior, la activa se corre de lugar sin cambiar
    // de tamaño, y observándola solo a ella el indicador quedaba desalineado.
    const observer = new ResizeObserver(measure);
    Object.values(tabRefs.current).forEach(tabEl => tabEl && observer.observe(tabEl));
    if (barRef.current) observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [activeTab, INDICATOR_W, tabs.length]);

  useEffect(() => {
    const el = barRef.current;
    // Al salir de touch (agrandar la ventana) se limpia: si no, quedaba "hay pestañas
    // ocultas" de la medición anterior y la flecha aparecía sin estilos en desktop.
    if (!el || !scrollable) { setOverflow({ start: false, end: false }); return; }

    function measure() {
      const max = el.scrollWidth - el.clientWidth;
      setOverflow({ start: el.scrollLeft > 1, end: max > 1 && el.scrollLeft < max - 1 });

    }

    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      observer.disconnect();
    };
  }, [scrollable, tabs.length]);

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (!el) return;
    setGlowVisible(false);
    const timer = setTimeout(() => {
      setGlowStyle({ left: el.offsetLeft, width: el.offsetWidth });
      setGlowVisible(true);
    }, INDICATOR_DURATION);
    // Mismo motivo que el indicador: si las pestañas cambian de ancho después, el glow se
    // reposiciona en vez de quedar en la medición vieja.
    const observer = new ResizeObserver(() => {
      setGlowStyle({ left: el.offsetLeft, width: el.offsetWidth });
    });
    if (barRef.current) observer.observe(barRef.current);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [activeTab]);

  function scrollByPage(dir) {
    const el = barRef.current;
    if (el) el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.6), behavior: 'smooth' });
  }

  return (
    <div className={`${styles.tabBarWrap} ${isTouch && overflow.end ? styles.wrapFadeEnd : ''} ${isTouch && overflow.start ? styles.wrapFadeStart : ''}`}>
    <div
      ref={barRef}
      className={[
        styles.tabBar,
        size === 's' ? styles.tabBarS : '',
        scrollable ? styles.tabBarScrollable : '',
        tabs.length === 1 ? styles.tabBarSingle : '',
        overflow.start ? styles.fadeStart : '',
        overflow.end ? styles.fadeEnd : '',
      ].join(' ')}
      style={inset ? { '--tabbar-inset': `${inset}px` } : undefined}
    >
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

    {/* Flecha discreta sobre un degradado blanco cuando quedan pestañas fuera de pantalla.
        No se puede confiar en que una pestaña quede cortada a la mitad: el ancho de los
        labels cambia con el idioma y la cantidad de pestañas con el rol. */}
    {isTouch && overflow.start && (
      <button
        type="button"
        className={`${styles.scrollHint} ${styles.scrollHintStart}`}
        aria-label="Previous tabs"
        onClick={() => scrollByPage(-1)}
      >
        <IconChevronMiniRight size={20} />
      </button>
    )}
    {isTouch && overflow.end && (
      <button
        type="button"
        className={`${styles.scrollHint} ${styles.scrollHintEnd}`}
        aria-label="More tabs"
        onClick={() => scrollByPage(1)}
      >
        <IconChevronMiniRight size={20} />
      </button>
    )}
    </div>
  );
}
