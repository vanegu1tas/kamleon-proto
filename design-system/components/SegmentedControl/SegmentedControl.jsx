import { useRef, useState, useLayoutEffect } from 'react';
import styles from './SegmentedControl.module.css';

/**
 * SegmentedControl
 *
 * Control de selección exclusiva tipo pill. Activo = pill negro.
 *
 * @param {Array}    options  - Array de { label, value }
 * @param {string}   value    - Valor actualmente seleccionado
 * @param {function} onChange - Callback con el nuevo value
 * @param {'m'|'s'|'xs'} [size='m'] - M 44px · S 36px (Button S) · XS 29px
 * @param {boolean}  [disabled=false] - Deshabilitado: elegida con fondo Action/Disabled y borde Border/Default,
 *                                      texto en Content/Disabled, sin hover ni clic (10/11)
 */
const SIZE_CLASS = { s: styles.sm, xs: styles.xs };

// El negro es una sola pieza que se desliza hasta la opción elegida (1/11, como el indicador del
// TabBar). Se mide la opción activa; la primera medición no anima para que no entre desde 0.
export default function SegmentedControl({ options = [], value, onChange, size = 'm', disabled = false }) {
  const btnRefs = useRef({});
  const containerRef = useRef(null);
  const [thumb, setThumb] = useState(null);
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const el = btnRefs.current[value];
    if (!el) { setThumb(null); return; }
    const measure = () => setThumb({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight });
    measure();
    // La fuente carga async y cambia el ancho de las opciones: se vuelve a medir
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    Object.values(btnRefs.current).forEach(b => b && ro.observe(b));
    return () => ro.disconnect();
  }, [value, options.length, size]);

  useLayoutEffect(() => {
    if (thumb && !animate) requestAnimationFrame(() => setAnimate(true));
  }, [thumb, animate]);

  return (
    <div ref={containerRef} className={`${styles.container} ${SIZE_CLASS[size] ?? ''} ${disabled ? styles.disabled : ''}`} aria-disabled={disabled || undefined}>
      {thumb && <span aria-hidden="true" className={`${styles.thumb} ${animate ? styles.thumbAnimate : ''}`} style={thumb} />}
      {options.map(opt => (
        <button
          key={opt.value}
          ref={el => { btnRefs.current[opt.value] = el; }}
          type="button"
          className={`${styles.option} ${value === opt.value ? styles.active : ''}`}
          disabled={disabled}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
