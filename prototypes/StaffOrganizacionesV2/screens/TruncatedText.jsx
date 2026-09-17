import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import styles from './OrgDetailV2.module.css';

// Envuelve un texto que puede truncarse con ellipsis (nombre/correo en una tabla).
// Mide si realmente se corta y solo en ese caso habilita el tooltip blanco — si el texto
// entra completo, no hace nada.
//
// `lines`: 1 (default) corta a una línea y mide por ancho. 2+ corta a esa cantidad de
// líneas (line-clamp) y mide por alto. Se usa en las columnas Role/Center/Team de la tabla
// de invitaciones, donde el valor es un nombre propio y cortarlo a una línea lo vuelve
// ambiguo (dos centros pueden empezar igual).
//
// Touch: sin hover no hay tooltip, así que el texto cortado también responde al toque.
// Solo se habilita en filas NO clickeables — si la fila navega a un detalle, el toque ya
// tiene dueño y el detalle es la salida para ver el dato completo.
export default function TruncatedText({ text, textClassName, lines = 1, tapToReveal = false }) {
  const ref = useRef(null);
  const wrapRef = useRef(null);
  const [truncated, setTruncated] = useState(false);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setTruncated(lines > 1 ? el.scrollHeight > el.clientHeight + 1 : el.scrollWidth > el.clientWidth);
  }, [text, lines]);

  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', handle);
    return () => document.removeEventListener('pointerdown', handle);
  }, [open]);

  const canReveal = tapToReveal && truncated;

  return (
    <span
      ref={wrapRef}
      className={`${styles.nameTooltipWrap} ${open ? styles.nameTooltipOpen : ''}`}
      data-tooltip={truncated ? text : undefined}
      onClick={canReveal ? () => setOpen(v => !v) : undefined}
      role={canReveal ? 'button' : undefined}
      tabIndex={canReveal ? 0 : undefined}
      onKeyDown={canReveal ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(v => !v); } } : undefined}
    >
      <span
        ref={ref}
        className={`${textClassName ?? ''} ${lines > 1 ? styles.clampLines : ''}`}
        // Vía variable CSS (no `WebkitLineClamp` inline) para que una media query pueda
        // soltar el corte: en 390 la tabla se vuelve lista y el valor se escribe entero.
        style={lines > 1 ? { '--clamp-lines': lines } : undefined}
      >
        {text}
      </span>
    </span>
  );
}
