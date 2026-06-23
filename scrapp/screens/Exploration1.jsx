import { useState, useEffect } from 'react';
import styles from './Exploration1.module.css';
import LogoKamleon from '../../design-system/icons/LogoKamleon';

// Geometry derived from Figma gauge 586×440:
//   H/W = 440/586 = 0.751 = (1+cos60°)/2  →  sweep 240°, gap 120° at bottom
//   R + SW/2 = 586/2 = 293  →  R = 293 − 21 = 272
const CX = 640, CY = 388, R = 272, SW = 24, TRACK_W = 40;
export const GAUGE_START = 240;
const GAUGE_SWEEP = 240, GAP = 3, FADE_ANG = 15;

// Zone score boundaries
const ZONE_BOUNDS = [
  { start: 0,  end: 40  },
  { start: 41, end: 60  },
  { start: 61, end: 90  },
  { start: 91, end: 100 },
];

// Visual arc fractions: zones 1 & 4 equal, zones 2 & 3 proportional to their range
const ZONES = [
  { key: 'severely',   statusLabel: 'SEVERELY DEHYDRATED', arc: 0.20, healthy: false, glowColor: '#FF3B30', bgOpacity: 0.50 },
  { key: 'dehydrated', statusLabel: 'DEHYDRATED',          arc: 0.24, healthy: false, glowColor: '#FF9500', bgOpacity: 0.40 },
  { key: 'hydrated',   statusLabel: 'HYDRATED',            arc: 0.36, healthy: true,  glowColor: '#00D8CC', bgOpacity: 0.60 },
  { key: 'over',       statusLabel: 'OVER HYDRATED',       arc: 0.20, healthy: false, glowColor: '#FF3B30', bgOpacity: 0.50 },
];

const TEAL = '#00D8CC';

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

export function getZoneIndex(score) {
  const idx = ZONE_BOUNDS.findIndex(b => score <= b.end);
  return idx === -1 ? ZONES.length - 1 : idx;
}

// Maps score to angle within its visual zone arc (non-linear)
export function scoreToAngle(score) {
  const idx = getZoneIndex(score);
  const { start, end } = ZONE_BOUNDS[idx];
  const t = (score - start) / (end - start);
  const { a1, a2 } = ANGLES[idx];
  return a1 + t * (a2 - a1);
}

export default function Exploration1({ score = 75, animAngle, glowZoneIdx = null, textStage = null }) {
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

  const indAngle  = animAngle ?? scoreToAngle(score);
  const zoneIdx   = getZoneIndex(score);
  const zone      = ZONES[zoneIdx];
  const [indX, indY] = polar(CX, CY, R - 12.8, indAngle);
  const oneDigit  = score < 10;
  const scoreX    = oneDigit ? 640 : 606;
  const z3       = ANGLES[2]; // healthy zone

  return (
    <div className={styles.screen}>
      <svg width="1280" height="800" viewBox="0 0 1280 800">
        <defs>
          {/* Arc gradient: dark red at bottom → orange → yellow at top */}
          <linearGradient id="e1ArcGrad"
            x1={CX} y1={CY + R + 30} x2={CX} y2={CY - R - 30}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#7A0E00" />
            <stop offset="40%"  stopColor="#FF4D00" />
            <stop offset="100%" stopColor="#FFCC00" />
          </linearGradient>

          {/* Score text gradient */}
          <linearGradient id="e1ScoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="25%"  stopColor="white" stopOpacity="1"    />
            <stop offset="100%" stopColor="white" stopOpacity="0.65" />
          </linearGradient>

          {/* Background glow behind gauge — base teal + per-zone variants */}
          <radialGradient id="e1BgGlow" cx="640" cy="368.5" r="205" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#0b0f12" stopOpacity="0"    />
          </radialGradient>
          {ZONES.map(z => (
            <radialGradient key={z.key} id={`e1BgGlow-${z.key}`} cx="640" cy="368.5" r="205" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor={z.glowColor} stopOpacity={z.bgOpacity} />
              <stop offset="100%" stopColor="#0b0f12"      stopOpacity="0"           />
            </radialGradient>
          ))}

          {/* Glow filter for healthy zone — blur 16px, opacity 80% */}
          <filter id="e1Glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComponentTransfer in="blur" result="blurFaded">
              <feFuncA type="linear" slope="0.9" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="blurFaded" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Path for curved "HEALTHY ZONE" text */}
          <path id="e1Z3Text" d={arcPath(CX, CY, R + SW / 2 + 26, z3.a1, z3.a2)} fill="none" />

          {/* Indicator fill gradient — center far below so top reads white */}
          <radialGradient id="e1IndGrad" cx="0.5053" cy="1.4672" r="0.895" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#0b0f12" stopOpacity="0.40" />
            <stop offset="100%" stopColor="white" />
          </radialGradient>

          {/* Indicator drop shadow */}
          <filter id="e1IndShadow" x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="-2" stdDeviation="4" floodColor="black" floodOpacity="0.40" />
          </filter>

          {/* Fade gradient — range 1 start (dark → transparent along arc) */}
          {(() => {
            const [x1, y1] = polar(CX, CY, R, GAUGE_START);
            const [x2, y2] = polar(CX, CY, R, GAUGE_START + FADE_ANG);
            return (
              <linearGradient id="e1FadeStart" x1={x1.toFixed(2)} y1={y1.toFixed(2)} x2={x2.toFixed(2)} y2={y2.toFixed(2)} gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#000000" stopOpacity="1" />
                <stop offset="100%" stopColor="#666666" stopOpacity="0" />
              </linearGradient>
            );
          })()}

          {/* Fade gradient — range 4 end (transparent → dark along arc) */}
          {(() => {
            const [x1, y1] = polar(CX, CY, R, GAUGE_START + GAUGE_SWEEP - FADE_ANG);
            const [x2, y2] = polar(CX, CY, R, GAUGE_START + GAUGE_SWEEP);
            return (
              <linearGradient id="e1FadeEnd" x1={x1.toFixed(2)} y1={y1.toFixed(2)} x2={x2.toFixed(2)} y2={y2.toFixed(2)} gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#666666" stopOpacity="0" />
                <stop offset="100%" stopColor="#000000" stopOpacity="1" />
              </linearGradient>
            );
          })()}

          {/* Track mask — clips indicator to arc bounds */}
          <mask id="e1TrackMask">
            <path
              d={arcPath(CX, CY, R, GAUGE_START, GAUGE_START + GAUGE_SWEEP)}
              fill="none" stroke="white" strokeWidth={TRACK_W} strokeLinecap="butt"
            />
          </mask>
        </defs>

        {/* Background glow — base teal fades out, zone color fades in */}
        <circle cx={640} cy={388} r={241} fill="url(#e1BgGlow)"
          style={{ opacity: glowZoneIdx === null ? 1 : 0, transition: 'opacity 0.8s ease-out' }} />
        {ZONES.map((z, i) => (
          <circle key={`bgGlow-${z.key}`} cx={640} cy={388} r={241} fill={`url(#e1BgGlow-${z.key})`}
            style={{ opacity: glowZoneIdx === i ? 1 : 0, transition: 'opacity 0.8s ease-out' }} />
        ))}

        {/* Dark container track */}
        <path
          d={arcPath(CX, CY, R, GAUGE_START, GAUGE_START + GAUGE_SWEEP)}
          fill="none" stroke="#0e1520" strokeWidth={TRACK_W} strokeLinecap="butt"
        />

        {/* Non-healthy gradient segments */}
        {ZONES.map((z, i) => z.healthy ? null : (
          <path
            key={z.key}
            d={arcPath(CX, CY, R, ANGLES[i].a1, ANGLES[i].a2)}
            fill="none" stroke="url(#e1ArcGrad)" strokeWidth={SW} strokeLinecap="butt"
          />
        ))}

        {/* Healthy zone — base teal */}
        <path
          d={arcPath(CX, CY, R, z3.a1, z3.a2)}
          fill="none"
          stroke={TEAL}
          strokeWidth={SW}
          strokeLinecap="butt"
        />

        {/* Per-zone glow overlays — grow in when indicator lands on that zone */}
        {ZONES.map((z, i) => (
          <path
            key={`glow-${z.key}`}
            d={arcPath(CX, CY, R, ANGLES[i].a1, ANGLES[i].a2)}
            fill="none"
            stroke={z.glowColor}
            strokeWidth={SW}
            strokeLinecap="butt"
            filter="url(#e1Glow)"
            style={{ opacity: glowZoneIdx === i ? 1 : 0, transition: 'opacity 0.8s ease-out' }}
          />
        ))}

        {/* Extra glow for hydrated zone */}
        <path
          d={arcPath(CX, CY, R, ANGLES[2].a1, ANGLES[2].a2)}
          fill="none"
          stroke={ZONES[2].glowColor}
          strokeWidth={SW}
          strokeLinecap="butt"
          style={{
            filter: `drop-shadow(0 0 5px ${ZONES[2].glowColor}) drop-shadow(0 0 10px ${ZONES[2].glowColor})`,
            opacity:    glowZoneIdx === 2 ? 0.7 : 0,
            transition: 'opacity 0.8s ease-out',
          }}
        />

        {/* Healthy zone highlight overlay — active state */}
        <path
          d={arcPath(CX, CY, R, z3.a1, z3.a2)}
          fill="none"
          stroke="#C7F1EF"
          strokeWidth={16}
          strokeLinecap="butt"
        />


        {/* Shadow fade at range 1 start */}
        <path
          d={arcPath(CX, CY, R, GAUGE_START, GAUGE_START + FADE_ANG)}
          fill="none" stroke="url(#e1FadeStart)" strokeWidth={TRACK_W} strokeLinecap="butt"
          opacity="0.40"
        />
        {/* Shadow fade at range 4 end */}
        <path
          d={arcPath(CX, CY, R, GAUGE_START + GAUGE_SWEEP - FADE_ANG, GAUGE_START + GAUGE_SWEEP)}
          fill="none" stroke="url(#e1FadeEnd)" strokeWidth={TRACK_W} strokeLinecap="butt"
          opacity="0.40"
        />

        {/* "HEALTHY ZONE" curved text */}
        <text
          fill="#C7F1EF" opacity="0.85"
          style={{ fontFamily: 'var(--font-family-primary)', fontSize: 17, letterSpacing: 3 }}
        >
          <textPath href="#e1Z3Text" startOffset="50%" textAnchor="middle">
            HEALTHY ZONE
          </textPath>
        </text>

        {/* Indicator — triangle masked to track */}
        <g mask="url(#e1TrackMask)">
          <path
            d="M 1.53,-10.36 A 1.8,1.8 0 0,0 -1.53,-10.36 L -16,12.8 L 16,12.8 Z"
            fill="url(#e1IndGrad)"
            filter="url(#e1IndShadow)"
            transform={`translate(${indX.toFixed(2)},${indY.toFixed(2)}) rotate(${indAngle})`}
          />
        </g>

        {/* Score number */}
        <text x={scoreX} y="365"
          textAnchor="middle" dominantBaseline="middle"
          fill="url(#e1ScoreGrad)"
          style={{ fontFamily: 'var(--font-family-primary)', fontSize: 220, fontWeight: 500 }}
        >
          {score}
        </text>

        {/* % superscript — fades + grows in at two digits */}
        <g style={{
          opacity:         oneDigit ? 0 : 1,
          transform:       oneDigit ? 'scale(0.93)' : 'scale(1)',
          transformOrigin: '772px 395px',
          transition:      'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}>
          <text x="772" y="395"
            textAnchor="middle" dominantBaseline="middle"
            fill="url(#e1ScoreGrad)"
            style={{ fontFamily: 'var(--font-family-primary)', fontSize: 104, fontWeight: 500 }}
          >
            %
          </text>
        </g>

        {/* YOU ARE */}
        <g style={{
          opacity:         textStage !== null ? 1 : 0,
          transform:       textStage !== null ? 'translateY(0)' : 'translateY(16px)',
          transition:      'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}>
          <text x="644.5" y="511"
            textAnchor="middle" dominantBaseline="middle"
            fill="white"
            style={{ fontFamily: 'var(--font-family-primary)', fontSize: 24, fontWeight: 400 }}
          >
            YOU ARE
          </text>
        </g>

        {/* Zone label */}
        <g style={{
          opacity:         textStage === 'full' ? 1 : 0,
          transform:       textStage === 'full' ? 'translateY(0)' : 'translateY(16px)',
          transition:      'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}>
          <text x="644.5" y="587"
            textAnchor="middle" dominantBaseline="middle"
            fill="white"
            style={{ fontFamily: 'var(--font-family-primary)', fontSize: 68, fontWeight: 500 }}
          >
            {textStage === 'full' ? zone.statusLabel : ''}
          </text>
        </g>

        {/* Result visible */}
        <text x="48" y="762"
          fill="#6b7280"
          style={{ fontFamily: 'var(--font-family-primary)', fontSize: 22, fontWeight: 400 }}
        >
          {`Result visible for ${countdown} seconds.`}
        </text>
      </svg>

      <div className={styles.logo}>
        <LogoKamleon width={150} height={28} color="white" />
      </div>
    </div>
  );
}
