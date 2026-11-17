import { useEffect, useState } from 'react';
import LogoKamleon from '../../../../../design-system/icons/LogoKamleon';
import Stage from './Stage';
import base from './E.module.css';
import styles from './ScoreE.module.css';

/**
 * (Dirección C, 17/11: copia de la A con los estilos de C.module.css; los comentarios de abajo vienen de la A.)
 * Score · dirección A (17/11). Misma geometría que el score actual (screens/Exploration5 → copia del vídeo),
 * con dos gauges:
 *   · 'actual' → el de hoy tal cual (zonas gruesas redondeadas con degradado, puntero redondo, número con degradado)
 *   · 'fino'   → versión más fina y limpia: arcos de 10 px, sin brillo interior, puntero = punto blanco,
 *                número blanco plano con interletrado cerrado, estado en minúscula, mensaje en gris
 * Secuencia (curva de la A): el gauge se llena y el número cuenta → estado → mensaje → comparación (opcional).
 * Tocar la pantalla vuelve a empezar.
 */
const CX = 640, CY = 388, R = 272;
const GAUGE_START = 240, GAUGE_SWEEP = 240, GAP = 4;
const COUNT_MS = 2200;   // como la scrapp actual (FlowRunner): 2,2 s
const SCORE = 75;
const RESULT_S = 15;

const ZONE_BOUNDS = [{ start: 0, end: 37.5 }, { start: 37.5, end: 59.5 }, { start: 59.5, end: 90.5 }, { start: 90.5, end: 100 }];
const ZONES = [
  { key: 'severely',   label: 'Severely dehydrated', arc: 0.26, glow: '#FB7B4A' },
  { key: 'dehydrated', label: 'Dehydrated',          arc: 0.27, glow: '#FF9500' },
  { key: 'hydrated',   label: 'Hydrated',            arc: 0.35, glow: '#2FD5CB', healthy: true },
  { key: 'over',       label: 'Over hydrated',       arc: 0.12, glow: '#FF3B30' },
];
const GRADS = [
  { x1: 390, y1: 555, x2: 390, y2: 266, stops: [[0, '#E04F4A'], [1, '#FAC63E']] },
  { x1: 662, y1: 117, x2: 412, y2: 239, stops: [[0, '#96D68F'], [0.45, '#FFF170'], [1, '#FAC63E']] },
  { x1: 912, y1: 382, x2: 682, y2: 119, stops: [[0, '#96D68F'], [0.11, '#2FD5CB'], [0.75, '#2FD5CB'], [1, '#96D68F']] },
  { x1: 912, y1: 401, x2: 876, y2: 524, stops: [[0, '#96D68F'], [0.23, '#FAC63E'], [1, '#E04F4A']] },
];
const MESSAGES = [
  [37, 'You are far from the optimal range.'], [54, 'You are below the optimal range.'],
  [59, 'You are close to the optimal range.'], [90, 'Well done! You are on the optimal range.'],
  [95, 'You are close to the optimal range.'], [100, 'You are above the optimal range.'],
];

const polar = (r, deg) => { const a = (deg - 90) * Math.PI / 180; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; };
const arcPath = (r, a1, a2) => {
  const [x1, y1] = polar(r, a1), [x2, y2] = polar(r, a2);
  return `M ${x1} ${y1} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${x2} ${y2}`;
};
function zonePath(sw, a1, a2, capR) {
  const Ro = R + sw / 2, Ri = R - sw / 2;
  const dao = Math.atan2(capR, Ro - capR) * 180 / Math.PI, dai = Math.atan2(capR, Ri + capR) * 180 / Math.PI;
  const p = (r, a) => polar(r, a).map(v => v.toFixed(2)).join(' ');
  const lo = a2 - a1 - 2 * dao > 180 ? 1 : 0, li = a2 - a1 - 2 * dai > 180 ? 1 : 0;
  return `M ${p(Ro - capR, a1)} A ${capR} ${capR} 0 0 1 ${p(Ro, a1 + dao)} A ${Ro} ${Ro} 0 ${lo} 1 ${p(Ro, a2 - dao)}
    A ${capR} ${capR} 0 0 1 ${p(Ro - capR, a2)} L ${p(Ri + capR, a2)} A ${capR} ${capR} 0 0 1 ${p(Ri, a2 - dai)}
    A ${Ri} ${Ri} 0 ${li} 0 ${p(Ri, a1 + dai)} A ${capR} ${capR} 0 0 1 ${p(Ri + capR, a1)} Z`;
}
const ANGLES = (() => {
  const avail = GAUGE_SWEEP - (ZONES.length - 1) * GAP;
  let c = GAUGE_START;
  return ZONES.map((z, i) => { const a1 = c, a2 = c + z.arc * avail; c = a2 + (i < ZONES.length - 1 ? GAP : 0); return { a1, a2 }; });
})();
const zoneIndex = s => { const i = ZONE_BOUNDS.findIndex(b => s <= b.end); return i === -1 ? ZONES.length - 1 : i; };
const scoreToAngle = s => {
  const i = zoneIndex(s), { start, end } = ZONE_BOUNDS[i], { a1, a2 } = ANGLES[i];
  return a1 + (end === start ? 0 : (s - start) / (end - start)) * (a2 - a1);
};
function colorAt(i, x, y) {
  const g = GRADS[i], dx = g.x2 - g.x1, dy = g.y2 - g.y1;
  const t = Math.max(0, Math.min(1, ((x - g.x1) * dx + (y - g.y1) * dy) / (dx * dx + dy * dy)));
  let k = 0; while (k < g.stops.length - 2 && t > g.stops[k + 1][0]) k++;
  const [o1, c1] = g.stops[k], [o2, c2] = g.stops[k + 1], f = (t - o1) / (o2 - o1 || 1);
  const rgb = c => [1, 3, 5].map(j => parseInt(c.slice(j, j + 2), 16));
  const a = rgb(c1), b = rgb(c2);
  return `rgb(${a.map((v, j) => Math.round(v + f * (b[j] - v))).join(',')})`;
}
// ease de la scrapp actual (seno, Daniel 17/11). Antes: cúbica en 1,4 s
const easeOut = t => Math.sin(t * Math.PI / 2);
const GLOW_OPACITY = { gradient: 1, soft: 0.3, water: 0 };

export default function ScoreE({ panels = 'none', water, motion = 'slow', club, gauge = 'actual', layout = 'center', behind = 'water', compare = true }) {
  const [run, setRun] = useState(0);
  const [value, setValue] = useState(0);
  const [stage, setStage] = useState(0);   // 0 contando · 1 estado · 2 mensaje · 3 comparación
  const [countdown, setCountdown] = useState(RESULT_S);

  useEffect(() => {
    setValue(0); setStage(0); setCountdown(RESULT_S);
    let raf, t0;
    const timers = [];
    const tick = now => {
      t0 ??= now;
      const p = Math.min((now - t0) / COUNT_MS, 1);
      setValue(easeOut(p) * SCORE);   // continuo: redondeado a 0,1 el puntero iba a saltitos al final (17/11)
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        timers.push(setTimeout(() => setStage(1), 150));
        timers.push(setTimeout(() => setStage(2), 450));
        timers.push(setTimeout(() => setStage(3), 900));
        let left = RESULT_S;
        timers.push(setInterval(() => { left = Math.max(left - 1, 0); setCountdown(left); }, 1000));
      }
    };
    timers.push(setTimeout(() => { raf = requestAnimationFrame(tick); }, 300));   // 300 ms de pausa, como la actual
    return () => { cancelAnimationFrame(raf); timers.forEach(t => { clearTimeout(t); clearInterval(t); }); };
  }, [run]);

  const fino = gauge === 'fino';
  const shown = Math.round(value);
  const zi = zoneIndex(value);
  const done = stage >= 1;
  // el puntero anima el ÁNGULO, como la scrapp actual (FlowRunner): con el score pasado a ángulo por zonas, saltaba el
  // hueco entre zonas y cambiaba de velocidad en cada una (Daniel, 17/11: "no se ve bien")
  const ang = GAUGE_START + (value / SCORE) * (scoreToAngle(SCORE) - GAUGE_START);
  const [px, py] = polar(R, ang);
  const ptrZone = (() => { for (let i = 0; i < ANGLES.length; i++) if (ang <= ANGLES[i].a2 + GAP) return i; return 3; })();
  const ptrColor = colorAt(ptrZone, px, py);
  const SW = fino ? 10 : 32;
  const z3 = ANGLES[2];
  const message = MESSAGES.find(([end]) => SCORE <= end)[1];

  return (
    <div className={`${base.screen} ${fino ? styles.fino : ''}`} data-panels={panels} onClick={() => setRun(r => r + 1)}>
      {/* el Score va siempre con el escenario neutro (gris y más oscuro): nada compite con las zonas */}
      {/* Detrás del número (Daniel, 17/11): 'water' = la esfera de agua que se esparce, en el color de la zona, sustituye
          al degradado · 'soft' = el degradado muy transparente · 'gradient' = el de siempre. Con la esfera, el resto
          del fondo queda negro (nada más compite); con las otras dos, el agua neutra de siempre. */}
      {behind === 'water'
        ? <Stage water={{ ...water, shape: 'sphere', height: 'mid', center: layout === 'stage' ? [0.24, 0.6] : [0.5, 0.515], tint: ZONES[zoneIndex(SCORE)].glow }} motion={motion} />
        : <Stage water={water} neutral motion={motion} />}
      <header className={base.header}>
        <img className={base.clubLogo} src={club.logo} alt={club.label} />
        <LogoKamleon width={120} height={22} color="#9A9A9A" />
      </header>

      {layout === 'stage' ? <StageLayout value={value} stage={stage} zi={zi} color={ptrColor} message={message} compare={compare} countdown={countdown} /> : (
      <svg className={styles.svg} width="1280" height="800" viewBox="0 0 1280 800">
        <defs>
          {GRADS.map((g, i) => (
            <linearGradient key={i} id={`aZ${i}`} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} gradientUnits="userSpaceOnUse">
              {g.stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
            </linearGradient>
          ))}
          {ZONES.map(z => (
            <radialGradient key={z.key} id={`aGlow-${z.key}`} cx={CX} cy={CY} r="260" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={z.glow} stopOpacity={fino ? 0.32 : 0.55} />
              <stop offset="100%" stopColor={z.glow} stopOpacity="0" />
            </radialGradient>
          ))}
          <linearGradient id="aNum" x1="0" y1="0" x2="0" y2="1">
            <stop offset="25%" stopColor="#fff" /><stop offset="100%" stopColor="#fff" stopOpacity="0.65" />
          </linearGradient>
          <path id="aOptimal" d={arcPath(R + SW / 2 + (fino ? 22 : 26), z3.a1, z3.a2)} fill="none" />
        </defs>

        {/* halo de la zona: aparece cuando el número termina de contar */}
        {ZONES.map((z, i) => (
          <circle key={z.key} cx={CX} cy={CY} r="260" fill={`url(#aGlow-${z.key})`}
            className={`${styles.glow} ${done && zi === i ? styles.breathe : ''}`}
            style={{ opacity: done && zi === i ? GLOW_OPACITY[behind] : 0 }} />
        ))}

        {/* zonas */}
        {ZONES.map((z, i) => (
          <g key={z.key} className={styles.zone} style={{ opacity: done && zi !== i ? (fino ? 0.25 : 0.3) : 1 }}>
            <path d={zonePath(SW, ANGLES[i].a1, ANGLES[i].a2, SW / 2)} fill={`url(#aZ${i})`} />
            {!fino && z.healthy && <path d={zonePath(12, ANGLES[i].a1 + 3, ANGLES[i].a2 - 3, 4)} fill="#C7F1EF" />}
          </g>
        ))}

        <text className={styles.optimal}>
          <textPath href="#aOptimal" startOffset="50%" textAnchor="middle">OPTIMAL RANGE</textPath>
        </text>

        {/* puntero */}
        {fino
          ? <circle cx={px} cy={py} r="11" fill="#fff" className={styles.dotShadow} />
          : <circle cx={px} cy={py} r="16" fill={ptrColor} stroke="#fff" strokeWidth="8" className={styles.dotShadow} />}

        {/* número */}
        {fino ? (
          <text x={CX} y="378" textAnchor="middle" dominantBaseline="middle" className={styles.numFino}>
            {shown}<tspan className={styles.pctFino} dx="6">%</tspan>
          </text>
        ) : (
          <>
            <text x={shown < 10 ? 640 : 606} y="375" textAnchor="middle" dominantBaseline="middle" fill="url(#aNum)" className={styles.numActual}>{shown}</text>
            <text x="772" y="395" textAnchor="middle" dominantBaseline="middle" fill="url(#aNum)" className={styles.pctActual}>%</text>
          </>
        )}

        {/* estado: solo en color cuando es Hydrated sale turquesa (el color de su zona en el gauge) */}
        <text x={CX} y={fino ? 600 : 615} textAnchor="middle" dominantBaseline="middle"
          className={`${styles.fade} ${fino ? styles.statusFino : styles.statusActual} ${stage >= 1 ? styles.in : ''}`}
          fill={ptrColor}>
          {fino ? ZONES[zi].label : ZONES[zi].label.toUpperCase()}
        </text>

        <text x={CX} y={fino ? 652 : 678} textAnchor="middle" dominantBaseline="middle"
          className={`${styles.fade} ${styles.message} ${stage >= 2 ? styles.in : ''}`}>
          {message}
        </text>

        {/* comparación con el historial (opcional; pendiente de si el RE tiene el dato) */}
        {compare && (
          <g className={`${styles.fade} ${stage >= 3 ? styles.in : ''}`}>
            <line x1="460" x2="820" y1="712" y2="712" className={styles.rule} />
            <text x="560" y="748" textAnchor="middle" dominantBaseline="middle">
              <tspan className={styles.cmpLabel}>Your average</tspan><tspan className={styles.cmpValue} dx="12">68%</tspan>
            </text>
            <text x="740" y="748" textAnchor="middle" dominantBaseline="middle">
              <tspan className={styles.cmpLabel}>Best</tspan><tspan className={styles.cmpValue} dx="12">81%</tspan>
            </text>
          </g>
        )}

        {/* contador con anillo blanco fino */}
        {(() => {
          const r = 24, c = 2 * Math.PI * r, cx = 80, cy = 736;
          return (
            <g className={`${styles.fade} ${stage >= 1 ? styles.in : ''}`}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--e-border)" strokeWidth="2" />
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={c * (1 - countdown / RESULT_S)}
                transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: 'stroke-dashoffset 1s linear' }} />
              <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" className={styles.countdown}>{countdown}</text>
            </g>
          );
        })()}
      </svg>
      )}
    </div>
  );
}

/* E · "Escenario": el número grande y fino sin caja, flotando sobre el fondo; a su derecha el estado y el mensaje;
   debajo una barra fina con las 4 zonas y un punto; abajo una banda negra translúcida con AVG / BEST y el
   contador (las métricas de Peloton). */
function StageLayout({ value, stage, zi, color, message, compare, countdown }) {
  const shown = Math.round(value);
  const total = ZONE_BOUNDS[ZONE_BOUNDS.length - 1].end;
  const r = 20, c = 2 * Math.PI * r;
  return (
    <>
      <section className={styles.stageMain}>
        <div className={styles.bigNum}>{shown}<span>%</span></div>
        <div className={styles.stageSide}>
          <span className={`${base.label} ${styles.fadeE} ${stage >= 1 ? styles.in : ''}`}>Hydration</span>
          <h2 className={`${styles.stageStatus} ${styles.fadeE} ${stage >= 1 ? styles.in : ''}`} style={{ color }}>{ZONES[zi].label}</h2>
          <p className={`${styles.stageMessage} ${styles.fadeE} ${stage >= 2 ? styles.in : ''}`}>{message}</p>
        </div>
      </section>

      <div className={styles.zoneBar}>
        {ZONES.map((z, i) => (
          <i key={z.key} style={{ flexGrow: ZONE_BOUNDS[i].end - ZONE_BOUNDS[i].start, background: z.glow, opacity: stage >= 1 && zi !== i ? 0.3 : 1 }} />
        ))}
        <b style={{ left: `${(value / total) * 100}%` }} />
      </div>

      <footer className={`${styles.band} ${base.panel} ${stage >= 1 ? styles.bandIn : ''}`}>
        {compare && (
          <>
            <div className={styles.metric}><span className={base.label}>Avg</span><strong>68<small>%</small></strong></div>
            <div className={styles.metric}><span className={base.label}>Best</span><strong>81<small>%</small></strong></div>
          </>
        )}
        <div className={styles.timer}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r={r} fill="none" stroke="var(--e-border)" strokeWidth="2" />
            <circle cx="24" cy="24" r={r} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeDasharray={c}
              strokeDashoffset={c * (1 - countdown / RESULT_S)} transform="rotate(-90 24 24)" style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <span>{countdown}</span>
        </div>
      </footer>
    </>
  );
}
