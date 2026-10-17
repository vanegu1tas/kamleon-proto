import styles from './KeyButton.module.css';

/**
 * Tecla tipo OP-1 (Teenage Engineering), 17/10: base cuadrada y plana con un círculo en relieve en
 * el centro y el icono dentro. Encendida (`on`), el círculo se hunde y se enciende un LED.
 * Primera prueba: el botón del menú (☰) del visor de exploraciones.
 *   wide       rectangular: ocupa el ancho que le den y el círculo se alarga en píldora
 *   momentary  se hunde entera al presionarla y vuelve sola; encendida solo la marca el LED
 *              (las teclas del panel de ajustes)
 *   ledColor   color del LED encendido (turquesa por defecto)
 *   flat       lisa: sin el círculo/píldora en relieve, el contenido va directo sobre la base
 */
export default function KeyButton({ on = false, wide = false, momentary = false, flat = false, ledColor, children, className = '', style, ...rest }) {
  return (
    <button className={`${styles.key} ${on ? styles.on : ''} ${wide ? styles.wide : ''} ${momentary ? styles.momentary : ''} ${flat ? styles.flat : ''} ${className}`}
      style={ledColor ? { ...style, '--led-color': ledColor } : style} {...rest}>
      <span className={styles.cap}>{children}</span>
      <span className={styles.led} />
    </button>
  );
}
