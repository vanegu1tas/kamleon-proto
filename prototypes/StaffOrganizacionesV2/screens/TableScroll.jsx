import { useEffect, useRef, useState } from 'react';
import styles from './TableScroll.module.css';

// Contenedor de tabla con scroll horizontal (Daniel, 11/11). La primera columna (Time, Name) se queda
// fija para saber de qué fila es cada dato; al deslizar, el resto pasa por debajo y un degradado blanco
// pegado a su borde derecho lo desvanece. Solo ese degradado, a la izquierda: ni en el borde derecho ni
// flecha (la flecha es del TabBar). Si la tabla cabe no se desliza, así que no aparece nada.
export default function TableScroll({ children }) {
  const ref = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => setScrolled(el.scrollLeft > 1);
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    return () => el.removeEventListener('scroll', measure);
  }, []);

  return (
    <div ref={ref} className={`${styles.scroll} ${scrolled ? styles.scrolled : ''}`}>{children}</div>
  );
}
