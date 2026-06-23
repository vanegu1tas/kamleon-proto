import { useState, useEffect } from 'react';
import styles from './Exploration4.module.css';
import LogoKamleon from '../../design-system/icons/LogoKamleon';
import LogoDots from '../components/LogoDots';

const CX = 643;
const CY = 629;

// Ranges container geometry (from Figma: left=102, top=91, width=1076, height=538)
const R_OUTER = 538;
const R_INNER = 474; // R_OUTER - 64px channel width
const R_ARC   = 506; // centerline of strokes = (R_OUTER + R_INNER) / 2
const R_PTR   = 490; // pointer radius (same as E3)
const R_TXT   = 554; // radius for HEALTHY ZONE text (outside container)

export const ROTATION_START = -90;
const ROTATION_SWEEP        = 180;

const ZONE_BOUNDS = [
  { start: 0,  end: 40  },
  { start: 41, end: 60  },
  { start: 61, end: 90  },
  { start: 91, end: 100 },
];

const ZONES = [
  { key: 'severely',   statusLabel: 'SEVERELY DEHYDRATED', arc: 0.20, glowColor: '#FF3B30', glowRgb: '255,59,48',   bgOpacity: 0.50 },
  { key: 'dehydrated', statusLabel: 'DEHYDRATED',          arc: 0.30, glowColor: '#FF9500', glowRgb: '255,149,0',   bgOpacity: 0.40 },
  { key: 'hydrated',   statusLabel: 'HYDRATED',            arc: 0.30, glowColor: '#2FD5CB', glowRgb: '47,213,203',  bgOpacity: 0.30 },
  { key: 'over',       statusLabel: 'OVER HYDRATED',       arc: 0.20, glowColor: '#FF3B30', glowRgb: '255,59,48',   bgOpacity: 0.50 },
];

const GAP_DEG    = (32 / R_ARC) * (180 / Math.PI);
const ZONE_SWEEP = ROTATION_SWEEP - (ZONES.length - 1) * GAP_DEG;

function buildRotations() {
  let cursor = ROTATION_START;
  return ZONES.map((z, i) => {
    const r1 = cursor;
    const r2 = cursor + z.arc * ZONE_SWEEP;
    cursor = r2 + (i < ZONES.length - 1 ? GAP_DEG : 0);
    return { r1, r2 };
  });
}

const ZONE_ROTS = buildRotations();

export function getZoneIndex4(score) {
  const idx = ZONE_BOUNDS.findIndex(b => score <= b.end);
  return idx === -1 ? ZONES.length - 1 : idx;
}

export function scoreToRotation4(score) {
  const idx = getZoneIndex4(score);
  const { start, end } = ZONE_BOUNDS[idx];
  const t = end === start ? 0 : (score - start) / (end - start);
  const { r1, r2 } = ZONE_ROTS[idx];
  return r1 + t * (r2 - r1);
}

function rotToXY(deg, R) {
  const rad = deg * Math.PI / 180;
  return [CX + R * Math.sin(rad), CY - R * Math.cos(rad)];
}

function arcPath(r1, r2, R) {
  const [x1, y1] = rotToXY(r1, R);
  const [x2, y2] = rotToXY(r2, R);
  const large = (r2 - r1) > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)},${y1.toFixed(2)} A ${R},${R} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
}

function arcRingPath(R_outer, R_inner, r1, r2) {
  const [ox1, oy1] = rotToXY(r1, R_outer);
  const [ox2, oy2] = rotToXY(r2, R_outer);
  const [ix2, iy2] = rotToXY(r2, R_inner);
  const [ix1, iy1] = rotToXY(r1, R_inner);
  const large = (r2 - r1) > 180 ? 1 : 0;
  return [
    `M ${ox1.toFixed(2)},${oy1.toFixed(2)}`,
    `A ${R_outer},${R_outer} 0 ${large},1 ${ox2.toFixed(2)},${oy2.toFixed(2)}`,
    `L ${ix2.toFixed(2)},${iy2.toFixed(2)}`,
    `A ${R_inner},${R_inner} 0 ${large},0 ${ix1.toFixed(2)},${iy1.toFixed(2)}`,
    `Z`,
  ].join(' ');
}

const CONTAINER_PATH = arcRingPath(R_OUTER, R_INNER, ROTATION_START, ROTATION_START + ROTATION_SWEEP);

const FADE_ANG = 15;
const [fadeStartX1, fadeStartY1] = (() => { const r = (ROTATION_START) * Math.PI / 180; return [CX + R_ARC * Math.sin(r), CY - R_ARC * Math.cos(r)]; })();
const [fadeStartX2, fadeStartY2] = (() => { const r = (ROTATION_START + FADE_ANG) * Math.PI / 180; return [CX + R_ARC * Math.sin(r), CY - R_ARC * Math.cos(r)]; })();
const [fadeEndX1, fadeEndY1]     = (() => { const r = (ROTATION_START + ROTATION_SWEEP - FADE_ANG) * Math.PI / 180; return [CX + R_ARC * Math.sin(r), CY - R_ARC * Math.cos(r)]; })();
const [fadeEndX2, fadeEndY2]     = (() => { const r = (ROTATION_START + ROTATION_SWEEP) * Math.PI / 180; return [CX + R_ARC * Math.sin(r), CY - R_ARC * Math.cos(r)]; })();

const scoreGradStyle = {
  background: 'linear-gradient(to bottom, white 25%, rgba(255,255,255,0.65) 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export default function Exploration4({ score = 75, animRot, glowZoneIdx = null, textStage = null, pointerStyle = 'puck' }) {
  const [countdown, setCountdown] = useState(15);

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

  const rot            = animRot ?? scoreToRotation4(score);
  const [ptrX, ptrY]  = rotToXY(rot, R_ARC);
  const [triX, triY]  = rotToXY(rot, R_PTR);
  const zoneIdx      = getZoneIndex4(score);
  const zone         = ZONES[zoneIdx];
  const oneDigit     = score < 10;
  const font         = 'var(--font-family-primary)';

  return (
    <div className={styles.screen}>

      {/* Logo dot pattern — visible only on hydrated zone */}
      <LogoDots
        width={480} height={479}
        gradId="e4LogoDots"
        style={{
          position: 'absolute', left: '50%', top: 210,
          transform: glowZoneIdx === 2
            ? 'translateX(-50%) scale(1)'
            : 'translateX(-50%) scale(0.6)',
          opacity:    glowZoneIdx === 2 ? 1 : 0,
          transition: 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: 'none',
        }}
      />

      {/* Radial background glow */}
      <div style={{
        position: 'absolute', left: 233, top: 14,
        width: 814, height: 814,
        transform: glowZoneIdx !== null ? 'scale(1.35)' : 'scale(1)',
        transformOrigin: '407px 407px',
        transition: 'transform 0.8s ease-out',
        pointerEvents: 'none',
        borderRadius: 814,
        opacity: 0.5,
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 814,
          background: 'radial-gradient(42.53% 42.53% at 50% 45.95%, rgba(255,255,255,0.24) 0%, rgba(11,15,18,0.00) 100%)',
          opacity:    glowZoneIdx === null ? 1 : 0,
          transition: 'opacity 0.8s ease-out',
        }} />
        {ZONES.map((z, i) => (
          <div key={z.key} style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: `radial-gradient(42.53% 42.53% at 50% 45.95%, rgba(${z.glowRgb},${z.bgOpacity}) 0%, rgba(11,15,18,0) 100%)`,
            opacity:    glowZoneIdx === i ? 1 : 0,
            transition: 'opacity 0.8s ease-out',
          }} />
        ))}
      </div>

      <svg width="1280" height="800" viewBox="0 0 1280 800"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <defs>
          <clipPath id="e4ContainerClip">
            <path d={CONTAINER_PATH} />
          </clipPath>
          <path id="e4HealthyZoneArc" fill="none"
            d={arcPath(ZONE_ROTS[2].r1, ZONE_ROTS[2].r2, R_TXT)} />

          {/* Fill gradient — Figma: translate(538.5,538.5) in its 1077×539 space → (102+538.5, 91+538.5) = (640.5,629.5) ≈ (643,629) in screen space */}
          <radialGradient id="e4ContainerFill"
            cx="0" cy="0" r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(643,629) rotate(-90) scale(552.5,559.108)">
            <stop stopColor="white" stopOpacity="0.2"/>
            <stop offset="1" stopColor="#0B0F12"/>
          </radialGradient>

          {/* Stroke gradient — Figma: translate(538.5,-53) → (102+538.5, 91-53) = (640.5,38) ≈ (643,38) */}
          <radialGradient id="e4ContainerStroke"
            cx="0" cy="0" r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(643,38) rotate(90) scale(483.5,2452.19)">
            <stop stopColor="white" stopOpacity="0.3"/>
            <stop offset="1" stopOpacity="0.5"/>
          </radialGradient>

          {/* Arc gradient — dark red at bottom → orange → yellow at top (same as E1) */}
          <linearGradient id="e4ArcGrad"
            x1={CX} y1={CY + R_ARC + 30} x2={CX} y2={CY - R_ARC - 30}
            gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#7A0E00"/>
            <stop offset="40%"  stopColor="#FF4D00"/>
            <stop offset="100%" stopColor="#FFCC00"/>
          </linearGradient>

          {/* Edge fade gradients */}
          <linearGradient id="e4FadeStart"
            x1={fadeStartX1.toFixed(2)} y1={fadeStartY1.toFixed(2)}
            x2={fadeStartX2.toFixed(2)} y2={fadeStartY2.toFixed(2)}
            gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#000000" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="e4FadeEnd"
            x1={fadeEndX1.toFixed(2)} y1={fadeEndY1.toFixed(2)}
            x2={fadeEndX2.toFixed(2)} y2={fadeEndY2.toFixed(2)}
            gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#000000" stopOpacity="0"/>
            <stop offset="100%" stopColor="#000000" stopOpacity="0.5"/>
          </linearGradient>

          <filter id="e4TriShadow" x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="-2" stdDeviation="4" floodColor="black" floodOpacity="0.40"/>
          </filter>

          {/* Inset shadow — exact Figma filter, coords adjusted to screen space */}
          <filter id="e4InsetShadow" x="95" y="80" width="1092" height="560" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="-1"/>
            <feGaussianBlur stdDeviation="4.5"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
          </filter>
        </defs>

        {/* Ranges container */}
        <path d={CONTAINER_PATH}
          fill="url(#e4ContainerFill)"
          stroke="url(#e4ContainerStroke)"
          strokeOpacity={0.7}
          strokeWidth={1}
          filter="url(#e4InsetShadow)"
        />

        {/* Zone glows — rendered first so they sit below all range strokes */}
        {ZONES.map((z, i) => (
          <path key={`glow-${z.key}`}
            d={arcPath(ZONE_ROTS[i].r1, ZONE_ROTS[i].r2, R_ARC)}
            fill="none" stroke={z.glowColor} strokeWidth={24} strokeLinecap="butt"
            style={{
              filter: i === 2
                ? `drop-shadow(0 0 16px ${z.glowColor}) drop-shadow(0 0 32px ${z.glowColor})`
                : `drop-shadow(0 0 16px ${z.glowColor}) drop-shadow(0 0 24px ${z.glowColor})`,
              opacity: glowZoneIdx === i ? 1 : 0,
              transition: 'opacity 0.8s ease-out',
            }}
          />
        ))}

        {/* Zone arcs — grouped so opacity dims non-selected zones together */}
        {ZONES.map((z, i) => (
          <g key={`arc-${z.key}`} style={{
            opacity:    glowZoneIdx !== null && glowZoneIdx !== i ? 0.3 : 1,
            transition: 'opacity 0.8s ease-out',
          }}>
            <path d={arcPath(ZONE_ROTS[i].r1, ZONE_ROTS[i].r2, R_ARC)}
              fill="none"
              stroke={i === 2 ? '#00D8CC' : 'url(#e4ArcGrad)'}
              strokeWidth={24} strokeLinecap="butt" />
            {i === 2 && (
              <path d={arcPath(ZONE_ROTS[2].r1, ZONE_ROTS[2].r2, R_ARC)}
                fill="none" stroke="#C7F1EF" strokeWidth={16} strokeLinecap="butt" />
            )}
          </g>
        ))}

        {/* Edge shadows — on top of all zone arcs */}
        <path d={arcPath(ROTATION_START, ROTATION_START + FADE_ANG, R_ARC)}
          fill="none" stroke="url(#e4FadeStart)" strokeWidth={64} strokeLinecap="butt" />
        <path d={arcPath(ROTATION_START + ROTATION_SWEEP - FADE_ANG, ROTATION_START + ROTATION_SWEEP, R_ARC)}
          fill="none" stroke="url(#e4FadeEnd)" strokeWidth={64} strokeLinecap="butt" />

        {/* HEALTHY ZONE text along zone 3 arc */}
        <text fill="#94e8e3"
          style={{ fontFamily: 'var(--font-family-primary)', fontSize: 24, fontWeight: 500, letterSpacing: 3 }}>
          <textPath href="#e4HealthyZoneArc" startOffset="50%" textAnchor="middle">
            HEALTHY ZONE
          </textPath>
        </text>

        {/* Pointer — clipped to container groove */}
        <g clipPath="url(#e4ContainerClip)">
          {pointerStyle === 'puck' && (
            <g transform={`translate(${ptrX.toFixed(2)}, ${ptrY.toFixed(2)}) rotate(${rot})`}>
              <rect x="-20" y="-30" width="40" height="60" rx="10" fill="white" />
            </g>
          )}
          {pointerStyle === 'triangle' && (
            <g transform={`translate(${triX.toFixed(2)}, ${triY.toFixed(2)}) rotate(${rot})`}>
              <path d="M -0.83,-16.75 Q 0,-18 0.83,-16.75 L 20,12 L -20,12 Z" fill="white" filter="url(#e4TriShadow)" />
            </g>
          )}
        </g>

      </svg>


      {/* Large score — exits upward on textStage */}
      <div style={{
        position: 'absolute', top: 303, left: 0, right: 0, height: 0,
        pointerEvents: 'none',
        opacity:    textStage !== null ? 0 : 1,
        transform:  textStage !== null ? 'translateY(-120px) scale(0.7)' : 'translateY(0) scale(1)',
        transition: 'opacity 0.3s ease-out, transform 0.4s ease-out',
      }}>
        <div style={{
          position: 'absolute', top: 0,
          left: oneDigit ? CX : CX - 27,
          transform: 'translateX(-50%)',
          transition: 'left 0.3s ease-out',
          fontFamily: font, fontSize: 200, fontWeight: 500, lineHeight: 1,
          ...scoreGradStyle,
        }}>{score}</div>
        <div style={{
          position: 'absolute', top: 87, left: 760,
          transform: `translateX(-50%) scale(${oneDigit ? 0.93 : 1})`,
          transformOrigin: 'center top',
          opacity:    oneDigit ? 0 : 1,
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
          fontFamily: font, fontSize: 91, fontWeight: 500, lineHeight: 1,
          ...scoreGradStyle,
        }}>%</div>
      </div>

      {/* YOU ARE + zone label */}
      <div style={{
        position: 'absolute', top: 310, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        fontFamily: font, color: 'white', textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontSize: 37, fontWeight: 400, lineHeight: 'normal',
          opacity:         textStage === 'full' ? 1 : 0,
          transform:       textStage === 'full' ? 'translateY(0)' : 'translateY(160px)',
          transition:      'opacity 0.4s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transitionDelay: '0.1s',
        }}>YOU ARE</div>
        <div style={{
          fontSize: zone.key === 'severely' || zone.key === 'over' ? 88 : 111, fontWeight: 500, lineHeight: 'normal',
          opacity:         textStage === 'full' ? 1 : 0,
          transform:       textStage === 'full' ? 'translateY(0)' : 'translateY(160px)',
          transition:      'opacity 0.4s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transitionDelay: '0.15s',
        }}>
          {textStage === 'full'
            ? zone.key === 'severely'
              ? <><span>SEVERELY</span><br /><span>DEHYDRATED</span></>
              : zone.statusLabel
            : ''}
        </div>
      </div>

      {/* Result countdown */}
      <div style={{
        position: 'absolute', left: 72, bottom: 38,
        fontFamily: font, fontSize: 22, color: '#6b7280',
        pointerEvents: 'none',
      }}>
        Result visible for {countdown} seconds.
      </div>

      <div className={styles.logo}>
        <LogoKamleon width={150} height={28} color="white" />
      </div>
    </div>
  );
}
