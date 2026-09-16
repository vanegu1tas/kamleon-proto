import { useLayoutEffect, useRef, useState } from 'react';
import styles from './OrgDetailV2.module.css';

// Envuelve un texto que puede truncarse con ellipsis (nombre/correo en una tabla).
// Mide si realmente se corta (scrollWidth > clientWidth) y solo en ese caso
// habilita el tooltip blanco al hacer hover — si el texto entra completo, no hace nada.
export default function TruncatedText({ text, textClassName }) {
  const ref = useRef(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) setTruncated(el.scrollWidth > el.clientWidth);
  }, [text]);

  return (
    <span className={styles.nameTooltipWrap} data-tooltip={truncated ? text : undefined}>
      <span ref={ref} className={textClassName}>{text}</span>
    </span>
  );
}
