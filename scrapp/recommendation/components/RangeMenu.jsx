import { useEffect, useRef, useState } from 'react';
import { ZONES } from '../gauge';
import styles from './RangeMenu.module.css';

// Mismo patrón que el menú de las exploraciones, pero reducido a lo único que hace falta
// enseñar en la demo: en qué rango cae el score. Vive fuera de la pantalla de la unidad.
export default function RangeMenu({ value, onChange, onRestart }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const current = ZONES.find(z => z.key === value);

  return (
    <div className={styles.wrap} ref={ref}>
      <button className={styles.trigger} onClick={() => setOpen(o => !o)}>
        <span className={styles.dot} style={{ background: current?.color }} />
        {current?.short ?? 'Range'}
      </button>

      {open && (
        <div className={styles.menu}>
          {ZONES.map(z => (
            <button
              key={z.key}
              className={`${styles.item} ${z.key === value ? styles.itemActive : ''}`}
              onClick={() => { onChange(z.key); setOpen(false); }}
            >
              <span className={styles.dot} style={{ background: z.color }} />
              {z.short}
              <span className={styles.sample}>{z.sample}%</span>
            </button>
          ))}
          <button className={styles.replay} onClick={() => { onRestart?.(); setOpen(false); }}>
            Back to start screen
          </button>
        </div>
      )}
    </div>
  );
}
