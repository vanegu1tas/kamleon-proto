import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './TouchIndicator.module.css';

// Toque visible para el vídeo (Daniel, 13/11): un círculo con borde donde se toca, que se hunde un poco y se
// desvanece. Va en un portal al body con position fixed, así cae en su sitio con o sin el marco del dispositivo.
export default function TouchIndicator() {
  const [touches, setTouches] = useState([]);
  useEffect(() => {
    let id = 0;
    const onDown = e => {
      const t = { id: id++, x: e.clientX, y: e.clientY };
      setTouches(list => [...list, t]);
      setTimeout(() => setTouches(list => list.filter(x => x.id !== t.id)), 900);
    };
    window.addEventListener('pointerdown', onDown, true);
    return () => window.removeEventListener('pointerdown', onDown, true);
  }, []);
  return createPortal(
    touches.map(t => <span key={t.id} className={styles.touch} style={{ left: t.x, top: t.y }} aria-hidden="true" />),
    document.body,
  );
}
