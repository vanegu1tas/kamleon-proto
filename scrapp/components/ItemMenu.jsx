import { useState, useRef, useEffect } from 'react';
import Morph from './Morph';
import styles from './ItemMenu.module.css';

/**
 * Menú ☰ del visor (17/10): elegir la exploración de la tarea. La tecla se convierte en el menú
 * (Morph).
 *
 * Cada fila lleva un LED que hace de radio button: todos tienen su punto y solo se enciende el de
 * la exploración que se está viendo (el mismo LED de las teclas).
 */
export default function ItemMenu({ entry, item }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const outside = e => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const esc = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', outside);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', outside); document.removeEventListener('keydown', esc); };
  }, [open]);

  return (
    <div ref={rootRef}>
      <Morph
        side="left"
        open={open}
        onToggle={() => setOpen(o => !o)}
        label="Menu"
        icon={
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
            <rect y="0" width="14" height="1.6" rx="0.8" fill="currentColor" />
            <rect y="4.2" width="14" height="1.6" rx="0.8" fill="currentColor" />
            <rect y="8.4" width="14" height="1.6" rx="0.8" fill="currentColor" />
          </svg>
        }
        title={<span className={styles.title}>{entry.title}</span>}
        contentClassName={styles.content}
      >
        <nav aria-label={entry.title}>
          {entry.items.map((i, n) => {
            const active = i.id === item.id;
            return (
              <a
                key={i.id}
                href={`#/${entry.id}/${i.id}`}
                onClick={() => setOpen(false)}
                className={`${styles.row} ${active ? styles.rowActive : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <span className={styles.led} />
                <span className={styles.number}>{String(n + 1).padStart(2, '0')}</span>
                <span className={styles.label}>{i.label}</span>
                {i.author && <span className={styles.author}>{i.author}</span>}
              </a>
            );
          })}
        </nav>
      </Morph>
    </div>
  );
}
