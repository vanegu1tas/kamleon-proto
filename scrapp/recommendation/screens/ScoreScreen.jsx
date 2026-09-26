import { useEffect, useRef, useState } from 'react';
import {
  CX, CY, R, SW, ANGLES, ZONES,
  arcPath, getMessageText, getZoneIndex, polar, roundedZonePath, scoreToAngle,
} from '../gauge';
import styles from './ScoreScreen.module.css';

// Score con los estilos nuevos (Figma "Score Exploration" 1184:2913). La geometría y los
// rangos vienen de la Exploration 5 sin tocar: lo que cambia es cómo se pinta.
//
// Diferencias con la exploración: solo la zona donde cae el score se ve encendida (las otras
// quedan atenuadas), el marcador es un punto en el arco y el número vive sobre un halo del
// color de la zona.

const ANIM_MS = 2200;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function ScoreScreen({ score = 48, exiting = false }) {
  const [display, setDisplay] = useState(0);   // número que va subiendo
  const [angle, setAngle]     = useState(ANGLES[0].a1);
  const [revealed, setRevealed] = useState(false); // etiquetas de abajo y halo
  const rafRef = useRef(null);

  // Cada vez que cambia el score objetivo, la aguja arranca de cero otra vez: es la misma
  // lectura que haría la unidad al terminar la muestra.
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    setRevealed(false);
    setDisplay(0);
    setAngle(ANGLES[0].a1);

    const from = ANGLES[0].a1;
    const to   = scoreToAngle(score);
    const t0   = performance.now();

    function frame(now) {
      const p = Math.min(1, (now - t0) / ANIM_MS);
      const e = easeOutCubic(p);
      setAngle(from + (to - from) * e);
      setDisplay(Math.round(score * e));
      if (p < 1) rafRef.current = requestAnimationFrame(frame);
      else setRevealed(true);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [score]);

  const zoneIdx = getZoneIndex(display || score);
  const zone    = ZONES[zoneIdx];
  const [mx, my] = polar(CX, CY, R, angle);
  const optimal = ANGLES[2];

  return (
    <div className={`${styles.screen} ${exiting ? styles.screenExiting : ''}`}>
      {/* Arco, número y textos viven en el mismo contenedor: al salir se encogen y se apagan
          como una sola pieza, no cada uno por su lado. */}
      <div className={styles.stage}>
      <svg className={styles.gauge} width="1280" height="800" viewBox="0 0 1280 800">
        <defs>
          <linearGradient id="rcZone1" x1="390" y1="555" x2="390" y2="266" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#E04F4A" />
            <stop offset="100%" stopColor="#FAC63E" />
          </linearGradient>
          <linearGradient id="rcZone2" x1="662" y1="117" x2="412" y2="239" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#96D68F" />
            <stop offset="45%"  stopColor="#FFF170" />
            <stop offset="100%" stopColor="#FAC63E" />
          </linearGradient>
          <linearGradient id="rcZone3" x1="912" y1="382" x2="682" y2="119" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#96D68F" />
            <stop offset="11%"  stopColor="#2FD5CB" />
            <stop offset="75%"  stopColor="#2FD5CB" />
            <stop offset="100%" stopColor="#96D68F" />
          </linearGradient>
          <linearGradient id="rcZone4" x1="912" y1="401" x2="876" y2="524" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#96D68F" />
            <stop offset="23%"  stopColor="#FAC63E" />
            <stop offset="100%" stopColor="#E04F4A" />
          </linearGradient>

          {/* Halo detrás del número, del color de la zona donde cayó el score */}
          {ZONES.map(z => (
            <radialGradient key={z.key} id={`rcGlow-${z.key}`} cx={CX} cy={CY} r="250" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor={z.color} stopOpacity="0.55" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          ))}

          <path id="rcOptimalPath" d={arcPath(CX, CY, R + SW / 2 + 28, optimal.a1, optimal.a2)} fill="none" />
        </defs>

        {ZONES.map(z => (
          <circle
            key={`glow-${z.key}`}
            cx={CX} cy={CY} r={250}
            fill={`url(#rcGlow-${z.key})`}
            className={styles.glow}
            style={{ opacity: revealed && zone.key === z.key ? 1 : 0 }}
          />
        ))}

        {/* Tramos: el de la zona alcanzada se queda encendido, el resto se apaga */}
        {ZONES.map((z, i) => {
          const active = zoneIdx === i;
          return (
            <g key={z.key} style={{ opacity: active ? 1 : 0.32, transition: 'opacity 0.6s ease-out' }}>
              <path
                d={roundedZonePath(CX, CY, R, SW, ANGLES[i].a1, ANGLES[i].a2, 8)}
                fill={`url(#rcZone${i + 1})`}
                style={{ filter: active ? `drop-shadow(0 0 18px ${z.color}66)` : 'none' }}
              />
              {/* Línea interior blanca: marca cuál es el tramo en el que estás */}
              {active && (
                <path
                  d={roundedZonePath(CX, CY, R, 12, ANGLES[i].a1 + 3, ANGLES[i].a2 - 3, 4)}
                  fill="#ffffff"
                  opacity="0.92"
                />
              )}
            </g>
          );
        })}

        {/* "OPTIMAL RANGE" sigue la curva del tramo bueno */}
        <text className={styles.optimalLabel}>
          <textPath href="#rcOptimalPath" startOffset="50%" textAnchor="middle">
            OPTIMAL RANGE
          </textPath>
        </text>

        {/* Marcador sobre el arco, en la posición exacta del score */}
        <circle cx={mx} cy={my} r={13} fill="#ffffff" />
        <circle cx={mx} cy={my} r={20} fill="none" stroke={zone.color} strokeWidth="5" opacity="0.9" />
      </svg>

      <div className={styles.center}>
        <span className={styles.number}>{display}</span>
        <span className={styles.percent}>%</span>
      </div>

      <div className={`${styles.result} ${revealed ? styles.resultVisible : ''}`}>
        <p className={styles.status} style={{ color: zone.color }}>{zone.label}</p>
        <p className={styles.message}>{getMessageText(score)}</p>
      </div>
      </div>
    </div>
  );
}
