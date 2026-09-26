import { BOTTLE_ML, getZoneIndex, mlToOz, ZONES } from '../gauge';
import { useEffect, useRef, useState } from 'react';
import bottle from '../assets/gatorlyte.png';
import styles from './RecommendationScreen.module.css';

// Primer boceto de la recomendación (Figma Explorations Web App 3.0, 111:24021). Es el paso
// siguiente al score: el número se encoge hasta una esquina y deja el sitio al producto.
//
// Todavía es un boceto: el producto está fijo y el volumen ("cuánto tomar") no aparece.
// Las dos cosas llegan cuando estén definidas.
export default function RecommendationScreen({ score = 48, playerName = 'Carlos', product = 'Gatorlyte' }) {
  const zone = ZONES[getZoneIndex(score)];
  const drinkMl = zone.drinkMl ?? 0;

  // La línea se mueve dentro del líquido de la botella, no de la caja de la imagen: la foto
  // tiene tapa arriba y un margen abajo, así que el recorrido útil va entre estos dos topes.
  const LIQUID_TOP = 150;     // px desde arriba de la imagen
  const LIQUID_BOTTOM = 636;  // px desde arriba de la imagen
  const ratio = Math.min(1, drinkMl / BOTTLE_ML);
  const rise = (LIQUID_BOTTOM - LIQUID_TOP) * ratio;

  // El número sube junto con la línea: mismos tiempos y misma curva que la animación del
  // CSS, para que la cifra y el nivel lleguen arriba a la vez.
  const LEVEL_DELAY_MS = 1600;
  const LEVEL_MS       = 2800;
  const [shownMl, setShownMl] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (drinkMl <= 0) return;
    setShownMl(0);
    let start = null;
    const timer = setTimeout(() => {
      function frame(now) {
        if (start === null) start = now;
        const p = Math.min(1, (now - start) / LEVEL_MS);
        // Aproximación de la curva del CSS (0.16, 1, 0.3, 1): sale rápido y frena al final.
        const e = 1 - Math.pow(1 - p, 5);
        setShownMl(drinkMl * e);
        if (p < 1) rafRef.current = requestAnimationFrame(frame);
      }
      rafRef.current = requestAnimationFrame(frame);
    }, LEVEL_DELAY_MS);

    return () => { clearTimeout(timer); cancelAnimationFrame(rafRef.current); };
  }, [drinkMl]);

  return (
    <div className={styles.screen}>
      <div className={styles.left}>
        {/* El score no desaparece del todo: se queda de referencia, en el color de su rango */}
        <div className={styles.scoreChip} style={{ color: zone.color }}>
          <span className={styles.scoreNumber}>{score}</span>
          <span className={styles.scorePercent}>%</span>
          <span className={styles.scoreLabel}>{zone.label}</span>
        </div>

        <h1 className={styles.headline}>
          {playerName}, you need to drink {product}
        </h1>
      </div>

      {/* La botella y la marca de cuánto tomar van juntas: la línea sube sobre la imagen
          hasta la altura que corresponde a la cantidad recomendada. */}
      <div className={styles.product}>
        <img className={styles.bottle} src={bottle} alt={product} draggable={false} />

        {drinkMl > 0 && (
          <div className={styles.level} style={{ '--rise': `${rise}px`, '--level-color': zone.color }}>
            <span className={styles.levelLine} />
            <span className={styles.levelAmount}>
              {mlToOz(shownMl)} <span className={styles.levelUnit}>oz</span>
            </span>
            <span className={styles.levelMl}>{Math.round(shownMl)} ml</span>
          </div>
        )}
      </div>
    </div>
  );
}
