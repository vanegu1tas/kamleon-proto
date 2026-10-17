import { useState, useRef, useLayoutEffect } from 'react';
import KeyButton from './KeyButton';
import styles from './Morph.module.css';

/**
 * Tecla que se convierte en panel (17/10). La usan el menú ☰ del visor (izquierda) y el panel de
 * ajustes (derecha, con el engranaje).
 *
 * Una sola superficie que cerrada tiene la forma y el material de la base de la tecla (48 × 48,
 * esquinas de 7) y abierta crece hasta el tamaño del contenido (mismas esquinas, material del panel).
 * El icono se queda en su esquina como botón de cerrar, con el LED encendido; el título va en su
 * misma fila. El contenido entra cuando la superficie casi ha terminado de crecer y sale primero al
 * cerrar.
 *
 *   side       'left' (crece hacia la derecha) | 'right' (crece hacia la izquierda)
 *   title      lo que va en la fila de la tecla (cada uno le da su estilo)
 *   iconOpen   icono para cuando está abierto (p. ej. una X): cambia con un fundido con desenfoque
 *   contentClassName  ancho, alto máximo, etc. del contenido
 */
export default function Morph({ side = 'left', open, onToggle, icon, iconOpen, label, title, contentClassName = '', children }) {
  const contentRef = useRef(null);
  const [size, setSize] = useState({ width: 48, height: 48 });

  // el tamaño abierto es el del contenido (siempre montado; invisible cuando está cerrado). Se
  // vuelve a medir si cambia (p. ej. al plegar una carpeta del panel).
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setSize({ width: el.offsetWidth, height: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`${styles.root} ${styles[side]} ${open ? styles.open : ''}`}>
      <div className={styles.surface} style={open ? size : undefined} />

      <div ref={contentRef} className={`${styles.content} ${contentClassName}`} aria-hidden={!open} inert={!open ? '' : undefined}>
        <div className={styles.head}>{title}</div>
        {children}
      </div>

      {/* la base la pone la superficie: la tecla aquí es solo el círculo con el icono y su LED */}
      <KeyButton className={styles.key} on={open} onClick={onToggle} aria-label={label} aria-expanded={open}>
        {iconOpen ? (
          <span className={styles.iconSwap}>
            <span className={styles.iconClosed}>{icon}</span>
            <span className={styles.iconOpen}>{iconOpen}</span>
          </span>
        ) : icon}
      </KeyButton>
    </div>
  );
}
