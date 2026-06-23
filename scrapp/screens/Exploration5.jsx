import { useState, useEffect } from 'react';
import styles from './Exploration5.module.css';
import LogoKamleon from '../../design-system/icons/LogoKamleon';

const CX = 640, CY = 388, R = 272, SW = 32;
export const GAUGE_START = 240;
const GAUGE_SWEEP = 240;
const GAP = 4;

const ZONE_BOUNDS = [
  { start: 0,    end: 37.5  },
  { start: 37.5, end: 59.5  },
  { start: 59.5, end: 90.5  },
  { start: 90.5, end: 100   },
];

const ZONES = [
  { key: 'severely',   statusLabel: 'SEVERELY DEHYDRATED', arc: 0.26, healthy: false, glowColor: '#FF3B30', glowRgb: '255,59,48',  bgOpacity: 0.60 },
  { key: 'dehydrated', statusLabel: 'DEHYDRATED',          arc: 0.27, healthy: false, glowColor: '#FF9500', glowRgb: '255,149,0',  bgOpacity: 0.60 },
  { key: 'hydrated',   statusLabel: 'HYDRATED',            arc: 0.35, healthy: true,  glowColor: '#2FD5CB', glowRgb: '47,213,203', bgOpacity: 0.60 },
  { key: 'over',       statusLabel: 'OVER HYDRATED',       arc: 0.12, healthy: false, glowColor: '#FF3B30', glowRgb: '255,59,48',  bgOpacity: 0.50 },
];

const MESSAGE_ZONES = [
  { end: 37,  text: 'You are far from the optimal range.'      },
  { end: 54,  text: 'You are below the optimal range.'         },
  { end: 59,  text: 'You are close to the optimal range.'      },
  { end: 90,  text: 'Well done! You are on the optimal range.' },
  { end: 95,  text: 'You are close to the optimal range.'      },
  { end: 100, text: 'You are above the optimal range.'         },
];

function getMessageText(score) {
  return (MESSAGE_ZONES.find(z => score <= z.end) ?? MESSAGE_ZONES.at(-1)).text;
}

const TEAL = '#2FD5CB';
const TEAL_LIGHT = '#C7F1EF';

function hexToRgb(hex) {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
}
function rgbToHex(r,g,b) {
  return '#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
}
function interpolateStops(stops, t) {
  t = Math.max(0, Math.min(1, t));
  let lo = stops[0], hi = stops[stops.length-1];
  for (let i = 0; i < stops.length-1; i++) {
    if (t >= stops[i].o && t <= stops[i+1].o) { lo = stops[i]; hi = stops[i+1]; break; }
  }
  if (lo === hi) return lo.c;
  const f = (t - lo.o) / (hi.o - lo.o);
  const [r1,g1,b1] = hexToRgb(lo.c), [r2,g2,b2] = hexToRgb(hi.c);
  return rgbToHex(r1+f*(r2-r1), g1+f*(g2-g1), b1+f*(b2-b1));
}
function sampleGrad(x1,y1,x2,y2,stops,px,py) {
  const dx=x2-x1, dy=y2-y1, len2=dx*dx+dy*dy;
  const t = len2===0 ? 0 : ((px-x1)*dx+(py-y1)*dy)/len2;
  return interpolateStops(stops, t);
}

const ZONE_GRADIENTS = [
  { x1:390, y1:555, x2:390,  y2:266, stops:[{o:0,c:'#E04F4A'},{o:1,c:'#FAC63E'}] },
  { x1:662, y1:117, x2:412,  y2:239, stops:[{o:0,c:'#96D68F'},{o:.45,c:'#FFF170'},{o:1,c:'#FAC63E'}] },
  { x1:912, y1:382, x2:682,  y2:119, stops:[{o:0,c:'#96D68F'},{o:.11,c:'#2FD5CB'},{o:.75,c:'#2FD5CB'},{o:1,c:'#96D68F'}] },
  { x1:912, y1:401, x2:876,  y2:524, stops:[{o:0,c:'#96D68F'},{o:.23,c:'#FAC63E'},{o:1,c:'#E04F4A'}] },
];

function polar(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arcPath(cx, cy, r, a1, a2) {
  const [x1, y1] = polar(cx, cy, r, a1);
  const [x2, y2] = polar(cx, cy, r, a2);
  const large = (a2 - a1) > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

function roundedZonePath(cx, cy, r, sw, a1, a2, capR = 8) {
  const Ro = r + sw / 2;
  const Ri = r - sw / 2;
  const dao = Math.atan2(capR, Ro - capR) * 180 / Math.PI;
  const dai = Math.atan2(capR, Ri + capR) * 180 / Math.PI;
  const fp = ([x, y]) => `${x.toFixed(3)} ${y.toFixed(3)}`;
  const lo = (a2 - a1 - 2 * dao) > 180 ? 1 : 0;
  const li = (a2 - a1 - 2 * dai) > 180 ? 1 : 0;
  return [
    `M ${fp(polar(cx, cy, Ro - capR, a1))}`,
    `A ${capR} ${capR} 0 0 1 ${fp(polar(cx, cy, Ro, a1 + dao))}`,
    `A ${Ro.toFixed(3)} ${Ro.toFixed(3)} 0 ${lo} 1 ${fp(polar(cx, cy, Ro, a2 - dao))}`,
    `A ${capR} ${capR} 0 0 1 ${fp(polar(cx, cy, Ro - capR, a2))}`,
    `L ${fp(polar(cx, cy, Ri + capR, a2))}`,
    `A ${capR} ${capR} 0 0 1 ${fp(polar(cx, cy, Ri, a2 - dai))}`,
    `A ${Ri.toFixed(3)} ${Ri.toFixed(3)} 0 ${li} 0 ${fp(polar(cx, cy, Ri, a1 + dai))}`,
    `A ${capR} ${capR} 0 0 1 ${fp(polar(cx, cy, Ri + capR, a1))}`,
    `Z`,
  ].join(' ');
}

function buildAngles() {
  const avail = GAUGE_SWEEP - (ZONES.length - 1) * GAP;
  let cursor = GAUGE_START;
  return ZONES.map((z, i) => {
    const a1 = cursor;
    const a2 = cursor + z.arc * avail;
    cursor = a2 + (i < ZONES.length - 1 ? GAP : 0);
    return { a1, a2 };
  });
}

const ANGLES = buildAngles();

function getZoneIdxFromAngle(ang) {
  for (let i = 0; i < ANGLES.length; i++) {
    const boundary = i < ANGLES.length - 1 ? ANGLES[i].a2 + GAP : ANGLES[i].a2;
    if (ang <= boundary) return i;
  }
  return ANGLES.length - 1;
}

export function getZoneIndex5(score) {
  const idx = ZONE_BOUNDS.findIndex(b => score <= b.end);
  return idx === -1 ? ZONES.length - 1 : idx;
}

export function scoreToAngle5(score) {
  const idx = getZoneIndex5(score);
  const { start, end } = ZONE_BOUNDS[idx];
  const t = end === start ? 0 : (score - start) / (end - start);
  const { a1, a2 } = ANGLES[idx];
  return a1 + t * (a2 - a1);
}

const scoreGradStyle = {
  background: 'linear-gradient(to bottom, white 25%, rgba(255,255,255,0.65) 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export default function Exploration5({ score = 0, animAngle, glowZoneIdx = null, textStage = null, coloredText = true, textLayout = 'sequential', zoneShape = 'default', timerStyle = 'default', breathe = true }) {
  const [countdown, setCountdown] = useState(15);
  const [msgStage, setMsgStage]   = useState(null);

  useEffect(() => {
    if (textStage === 'full') {
      setCountdown(15);
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [textStage]);

  useEffect(() => {
    if (textStage === 'full') {
      const t = setTimeout(() => setMsgStage('message'), 2500);
      return () => clearTimeout(t);
    } else {
      setMsgStage(null);
    }
  }, [textStage]);

  const indAngle      = animAngle ?? scoreToAngle5(score);
  const zoneIdx       = getZoneIndex5(score);
  const zone          = ZONES[zoneIdx];
  const [indX, indY]  = polar(CX, CY, R - SW / 2 - 6, indAngle);
  const capR              = zoneShape === 'round' ? SW / 2 : 8;
  const [cpX, cpY]        = polar(CX, CY, R, indAngle);
  const cpZoneIdx         = getZoneIdxFromAngle(indAngle);
  const cpGrad            = ZONE_GRADIENTS[cpZoneIdx];
  const cpColor           = sampleGrad(cpGrad.x1, cpGrad.y1, cpGrad.x2, cpGrad.y2, cpGrad.stops, cpX, cpY);
  const zoneTextColor     = coloredText ? cpColor : 'white';
  const oneDigit          = score < 10;
  const scoreX       = oneDigit ? 640 : 606;
  const z3           = ANGLES[2];
  const font         = 'var(--font-family-primary)';

  return (
    <div className={styles.screen}>

      <svg width="1280" height="800" viewBox="0 0 1280 800">
        <defs>
          {/* Zone 3 gradient */}
          <linearGradient id="e5Zone3Grad" x1="912" y1="382" x2="682" y2="119" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#96D68F"/>
            <stop offset="11%"  stopColor="#2FD5CB"/>
            <stop offset="75%"  stopColor="#2FD5CB"/>
            <stop offset="100%" stopColor="#96D68F"/>
          </linearGradient>

          {/* Zone 2 gradient */}
          <linearGradient id="e5Zone2Grad" x1="662" y1="117" x2="412" y2="239" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#96D68F"/>
            <stop offset="45%"  stopColor="#FFF170"/>
            <stop offset="100%" stopColor="#FAC63E"/>
          </linearGradient>

          {/* Zone 1 gradient */}
          <linearGradient id="e5Zone1Grad" x1="390" y1="555" x2="390" y2="266" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#E04F4A"/>
            <stop offset="100%" stopColor="#FAC63E"/>
          </linearGradient>

          {/* Zone 4 gradient */}
          <linearGradient id="e5Zone4Grad" x1="912" y1="401" x2="876" y2="524" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#96D68F"/>
            <stop offset="23%"  stopColor="#FAC63E"/>
            <stop offset="100%" stopColor="#E04F4A"/>
          </linearGradient>

          <linearGradient id="e5ScoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="25%"  stopColor="white" stopOpacity="1"    />
            <stop offset="100%" stopColor="white" stopOpacity="0.65" />
          </linearGradient>

          {/* Background glow gradients */}
          <radialGradient id="e5BgGlow" cx={CX} cy={CY} r="241" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#000000" stopOpacity="0"  />
          </radialGradient>
          {ZONES.map(z => (
            <radialGradient key={z.key} id={`e5BgGlow-${z.key}`} cx={CX} cy={CY} r="241" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor={z.key === 'severely' ? '#FB7B4A' : z.glowColor} stopOpacity={z.bgOpacity}/>
              <stop offset="100%" stopColor="#000000"      stopOpacity="0"          />
            </radialGradient>
          ))}

          {/* Path for "OPTIMAL RANGE" curved text */}
          <path id="e5Z3Text" d={arcPath(CX, CY, R + SW / 2 + 26, z3.a1, z3.a2)} fill="none"/>

          {/* Paths for per-zone curved labels */}
          {ANGLES.map((ang, i) => (
            <path key={i} id={`e5ZoneLabel-${i}`}
              d={arcPath(CX, CY, R + SW / 2 + 26, ang.a1, ang.a2)} fill="none"/>
          ))}

          <filter id="e5IndShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="-3" stdDeviation="6" floodColor="black" floodOpacity="0.20"/>
          </filter>
        </defs>

        {/* Background glow */}
        <circle cx={CX} cy={CY} r={241} fill="url(#e5BgGlow)"
style={{ opacity: glowZoneIdx === null ? 1 : 0, transition: 'opacity 0.8s ease-out' }}/>
        {ZONES.map((z, i) => (
          <circle key={`bgGlow-${z.key}`} cx={CX} cy={CY} r={241} fill={`url(#e5BgGlow-${z.key})`}
            className={glowZoneIdx === i && breathe ? styles.breathe : undefined}
            style={{ opacity: glowZoneIdx === i ? 1 : 0, transition: 'opacity 0.8s ease-out' }}/>
        ))}

        {/* Zone arcs */}
        {ZONES.map((z, i) => {
          const inactive = glowZoneIdx !== null && glowZoneIdx !== i;
          return (
            <g key={z.key} style={{ opacity: inactive ? 0.3 : 1, transition: 'opacity 0.8s ease-out' }}>
              <path
                d={roundedZonePath(CX, CY, R, SW, ANGLES[i].a1, ANGLES[i].a2, capR)}
                fill={i === 0 ? 'url(#e5Zone1Grad)' : i === 1 ? 'url(#e5Zone2Grad)' : i === 2 ? 'url(#e5Zone3Grad)' : 'url(#e5Zone4Grad)'}
              />
              {z.healthy && (
                <path
                  d={roundedZonePath(CX, CY, R, 12, ANGLES[i].a1 + 3, ANGLES[i].a2 - 3, 4)}
                  fill={TEAL_LIGHT}
                />
              )}
            </g>
          );
        })}

        {/* "OPTIMAL RANGE" curved text — desaparece al revelar resultado */}
        <text fill={TEAL_LIGHT}
          style={{
            fontFamily: font, fontSize: 17, letterSpacing: 3,
            opacity: textStage !== null ? 0 : 0.85,
            transition: 'opacity 0.35s ease-out',
          }}>
          <textPath href="#e5Z3Text" startOffset="50%" textAnchor="middle">
            OPTIMAL RANGE
          </textPath>
        </text>

        {/* Zone arc labels — aparecen al revelar resultado, escalan desde el centro */}
        <g style={{
          transform:       textStage !== null ? 'scale(1)' : 'scale(0.88)',
          transformOrigin: `${CX}px ${CY}px`,
          transition:      textStage !== null ? 'transform 0.5s ease-out 0.2s' : 'none',
        }}>
          {ZONES.map((z, i) => {
            const inactive = glowZoneIdx !== null && glowZoneIdx !== i;
            return (
              <text key={z.key}
                style={{
                  fontFamily: font, fontSize: 16, letterSpacing: 2,
                  fill: (textStage === null || inactive) ? 'white' : (i === 0 || i === 3 ? 'var(--color-red-65)' : z.glowColor),
                  opacity: textStage !== null ? (inactive ? 0.3 : 0.85) : 0,
                  transition: textStage !== null ? 'opacity 0.5s ease-out 0.2s' : 'none',
                }}>
                <textPath href={`#e5ZoneLabel-${i}`} startOffset="50%" textAnchor="middle">
                  {z.statusLabel}
                </textPath>
              </text>
            );
          })}
        </g>

        {/* Pointer — triángulo (opción A) */}
        {zoneShape === 'default' && (
          <g transform={`translate(${indX.toFixed(2)},${indY.toFixed(2)}) rotate(${indAngle}) scale(1.215,1.032) translate(-30.3,-32.65)`}
            filter="url(#e5IndShadow)">
            <path d="M17.2263 47.6826C12.8302 47.1049 10.5577 42.1227 13.0034 38.4242L26.7145 17.69C29.3139 13.7592 35.2224 14.2219 37.1781 18.5096L48.1128 42.4826C50.0685 46.7703 46.5445 51.5354 41.8721 50.9214L17.2263 47.6826Z" fill="white"/>
          </g>
        )}

        {/* Pointer — círculo (opción B) */}
        {zoneShape === 'round' && (
          <circle cx={cpX.toFixed(2)} cy={cpY.toFixed(2)} r={16}
            fill={cpColor}
            stroke="white" strokeWidth={8}
            style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))' }}
          />
        )}

        {/* Score number */}
        <text x={scoreX} y="375"
          textAnchor="middle" dominantBaseline="middle"
          fill="url(#e5ScoreGrad)"
          style={{ fontFamily: font, fontSize: 220, fontWeight: 500 }}>
          {score}
        </text>

        {/* % superscript */}
        <g style={{
          opacity:         oneDigit ? 0 : 1,
          transform:       oneDigit ? 'scale(0.93)' : 'scale(1)',
          transformOrigin: '772px 395px',
          transition:      'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}>
          <text x="772" y="395"
            textAnchor="middle" dominantBaseline="middle"
            fill="url(#e5ScoreGrad)"
            style={{ fontFamily: font, fontSize: 104, fontWeight: 500 }}>
            %
          </text>
        </g>

        {/* YOU ARE */}
        {/* <g style={{
          opacity:    textStage !== null ? 1 : 0,
          transform:  textStage !== null ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}>
          <text x="644.5" y="511" textAnchor="middle" dominantBaseline="middle"
            fill="white"
            style={{ fontFamily: font, fontSize: 24, fontWeight: 400 }}>
            YOU ARE
          </text>
        </g> */}

        {/* Zone label */}
        <g style={{
          opacity:   textStage === 'full' && (textLayout === 'stacked' || msgStage !== 'message') ? 1 : 0,
          transform: textLayout === 'sequential' && msgStage === 'message'
            ? 'translateY(-36px)'
            : textStage === 'full' ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
        }}>
          {/* original position: x="644.5" y="587" */}
          <text x="644.5" y="615" textAnchor="middle" dominantBaseline="middle"
            fill={zoneTextColor}
            style={{ fontFamily: font, fontSize: 68, fontWeight: 500 }}>
            {textStage === 'full' ? zone.statusLabel : ''}
          </text>
        </g>

        {/* Mensaje — sequential: entra tras el label / stacked: aparece junto al label como subtítulo */}
        <g style={{
          opacity:   textLayout === 'stacked'
            ? (textStage === 'full' ? 1 : 0)
            : (msgStage === 'message' ? 1 : 0),
          transform: textLayout === 'stacked'
            ? (textStage === 'full' ? 'translateY(0)' : 'translateY(16px)')
            : (msgStage === 'message' ? 'translateY(0)' : 'translateY(48px)'),
          transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
        }}>
          <text x="644.5" y={textLayout === 'stacked' ? 678 : 615}
            textAnchor="middle" dominantBaseline="middle"
            fill="white"
            style={{ fontFamily: font, fontSize: textLayout === 'stacked' ? 32 : 40, fontWeight: 400 }}>
            {getMessageText(score)}
          </text>
        </g>

        {/* Result countdown — Timer A */}
        {timerStyle === 'default' && (
          <text x="48" y="762" fill="#6b7280"
            style={{ fontFamily: font, fontSize: 22, fontWeight: 400 }}>
            {`Result visible for ${countdown} seconds.`}
          </text>
        )}

        {/* Result countdown — Timer B (círculo) */}
        {timerStyle === 'alt' && (() => {
          const r = 24;
          const circ = 2 * Math.PI * r;
          const offset = circ * (1 - countdown / 15);
          const cx = 56, cy = 744;
          return (
            <g style={{
              opacity:    textStage === 'full' ? 1 : 0,
              transition: 'opacity 0.5s ease-out',
            }}>
              {/* Track */}
              <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.20)"
                stroke="rgba(255,255,255,0.12)" strokeWidth={3}/>
              {/* Progress */}
              <circle cx={cx} cy={cy} r={r} fill="none"
                stroke="rgba(255,255,255,0.55)" strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ transition: 'stroke-dashoffset 1s linear' }}/>
              {/* Número */}
              <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle"
                fill="white"
                style={{ fontFamily: font, fontSize: 24, fontWeight: 400 }}>
                {countdown}
              </text>
            </g>
          );
        })()}
      </svg>

      <div className={styles.logo}>
        <LogoKamleon width={150} height={28} color="white"/>
      </div>
    </div>
  );
}
