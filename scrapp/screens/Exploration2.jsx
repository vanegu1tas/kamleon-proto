import { useState, useEffect } from 'react';
import styles from './Exploration2.module.css';
import LogoKamleon from '../../design-system/icons/LogoKamleon';

const BAR_Y1  = 510;
const BAR_Y2  = 557;
export const BAR_X = 72;
const BAR_W   = 1136;
const SKEW    = 30;
const GAP     = 12;

const ZONE_BOUNDS = [
  { start: 0,  end: 40  },
  { start: 41, end: 60  },
  { start: 61, end: 90  },
  { start: 91, end: 100 },
];

const ZONES = [
  { key: 'severely',   statusLabel: 'SEVERELY DEHYDRATED', arc: 0.20, healthy: false, glowColor: '#FF3B30', bgOpacity: 0.50, zoneFill: 'url(#e2GradLeft)'  },
  { key: 'dehydrated', statusLabel: 'DEHYDRATED',          arc: 0.24, healthy: false, glowColor: '#FF9500', bgOpacity: 0.40, zoneFill: 'url(#e2GradLeft)'  },
  { key: 'hydrated',   statusLabel: 'HYDRATED',            arc: 0.36, healthy: true,  glowColor: '#00D8CC', bgOpacity: 0.30, zoneFill: '#00D8CC'            },
  { key: 'over',       statusLabel: 'OVER HYDRATED',       arc: 0.20, healthy: false, glowColor: '#FF3B30', bgOpacity: 0.50, zoneFill: 'url(#e2GradRight)' },
];

function buildZoneX() {
  const avail = BAR_W - (ZONES.length - 1) * GAP;
  let cursor = BAR_X;
  return ZONES.map((z, i) => {
    const x1 = cursor;
    const x2 = cursor + z.arc * avail;
    cursor = x2 + (i < ZONES.length - 1 ? GAP : 0);
    return { x1, x2 };
  });
}

const ZONE_X = buildZoneX();

export function getZoneIndex(score) {
  const idx = ZONE_BOUNDS.findIndex(b => score <= b.end);
  return idx === -1 ? ZONES.length - 1 : idx;
}

export function scoreToX(score) {
  const idx = getZoneIndex(score);
  const { start, end } = ZONE_BOUNDS[idx];
  const t = end === start ? 0 : (score - start) / (end - start);
  const { x1, x2 } = ZONE_X[idx];
  return x1 + t * (x2 - x1);
}

function pts(x1, x2) {
  return `${x1.toFixed(1)},${BAR_Y2} ${(x1 + SKEW).toFixed(1)},${BAR_Y1} ${(x2 + SKEW).toFixed(1)},${BAR_Y1} ${x2.toFixed(1)},${BAR_Y2}`;
}

const scoreGradStyle = {
  background: 'linear-gradient(to bottom, white 25%, rgba(255,255,255,0.65) 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export default function Exploration2({ score = 75, animX, glowZoneIdx = null, textStage = null }) {
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
  const indBotX    = animX ?? scoreToX(score);
  const indCenterX = indBotX + SKEW;
  const zoneIdx    = getZoneIndex(score);
  const zone       = ZONES[zoneIdx];
  const z3         = ZONE_X[2];
  const z3CenterX  = (z3.x1 + z3.x2) / 2 + SKEW / 2;
  const oneDigit   = score < 10;
  const font       = 'var(--font-family-primary)';

  return (
    <div className={styles.screen}>

      {/* ── SVG: shapes only (glows, bar, indicator) ── */}
      <svg width="1280" height="800" viewBox="0 0 1280 800" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <radialGradient id="e2BgGlow" cx="640" cy="285" r="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.20"/>
            <stop offset="100%" stopColor="#0b0f12" stopOpacity="0"  />
          </radialGradient>
          {ZONES.map(z => (
            <radialGradient key={z.key} id={`e2BgGlow-${z.key}`} cx="640" cy="285" r="487" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor={z.glowColor} stopOpacity={z.bgOpacity}/>
              <stop offset="100%" stopColor="#0b0f12"      stopOpacity="0"          />
            </radialGradient>
          ))}

          <linearGradient id="e2GradLeft"
            x1={BAR_X} y1="0" x2={(ZONE_X[1].x2 + SKEW).toFixed(1)} y2="0"
            gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#7A0E00"/>
            <stop offset="45%"  stopColor="#FF4D00"/>
            <stop offset="100%" stopColor="#FFCC00"/>
          </linearGradient>

          <linearGradient id="e2GradRight"
            x1={ZONE_X[3].x1.toFixed(1)} y1="0" x2={(ZONE_X[3].x2 + SKEW).toFixed(1)} y2="0"
            gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#FFCC00"/>
            <stop offset="55%"  stopColor="#FF4D00"/>
            <stop offset="100%" stopColor="#7A0E00"/>
          </linearGradient>

          <filter id="e2Glow" x="-50%" y="-500%" width="200%" height="1100%">
            <feGaussianBlur stdDeviation="16" result="blur"/>
            <feComponentTransfer in="blur" result="blurFaded">
              <feFuncA type="linear" slope="0.9"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="blurFaded"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="e2IndShadow" x="-100%" y="-100%" width="300%" height="300%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="black" floodOpacity="0.40"/>
          </filter>
        </defs>

        {/* Background glow */}
        <g style={{
          transform: glowZoneIdx !== null ? 'scale(1.35)' : 'scale(1)',
          transformOrigin: '640px 285px',
          transition: 'transform 0.8s ease-out',
        }}>
          <circle cx={640} cy={285} r={487} fill="url(#e2BgGlow)"
            style={{ opacity: glowZoneIdx === null ? 1 : 0, transition: 'opacity 0.8s ease-out' }} />
          {ZONES.map((z, i) => (
            <circle key={`bgGlow-${z.key}`} cx={640} cy={285} r={487} fill={`url(#e2BgGlow-${z.key})`}
              style={{ opacity: glowZoneIdx === i ? 1 : 0, transition: 'opacity 0.8s ease-out' }} />
          ))}
        </g>

        {/* Zone polygons */}
        {ZONES.map((z, i) => {
          const inactive = glowZoneIdx !== null && glowZoneIdx !== i;
          return (
            <g key={z.key}>
              <polygon points={pts(ZONE_X[i].x1, ZONE_X[i].x2)} fill={z.glowColor}
                filter="url(#e2Glow)"
                style={{ opacity: glowZoneIdx === i ? 1 : 0, transition: 'opacity 0.8s ease-out' }} />
              <polygon points={pts(ZONE_X[i].x1, ZONE_X[i].x2)} fill={z.zoneFill}
                style={{ opacity: inactive ? 0 : 1, transition: 'opacity 0.8s ease-out' }} />
              {z.healthy && (
                <polygon points={pts(ZONE_X[i].x1, ZONE_X[i].x2)} fill="#C7F1EF"
                  style={{ opacity: inactive ? 0 : 0.25, transition: 'opacity 0.8s ease-out' }} />
              )}
              <polygon points={pts(ZONE_X[i].x1, ZONE_X[i].x2)} fill="white"
                style={{ opacity: inactive ? 0.30 : 0, transition: 'opacity 0.8s ease-out' }} />
            </g>
          );
        })}

        {/* Indicator */}
        <polygon
          points={`${(indCenterX - 20).toFixed(1)},${BAR_Y1 - 16} ${(indCenterX + 20).toFixed(1)},${BAR_Y1 - 16} ${indCenterX.toFixed(1)},${BAR_Y1 + 16}`}
          fill="white"
          filter="url(#e2IndShadow)"
        />
      </svg>

      {/* ── HTML text layer ── */}

      {/* Large score — exits upward */}
      <div style={{
        position: 'absolute', top: 148, left: 0, right: 0, height: 0,
        pointerEvents: 'none',
        opacity:    textStage !== null ? 0 : 1,
        transform:  textStage !== null ? 'translateY(-120px) scale(0.85)' : 'translateY(0) scale(1)',
        transition: 'opacity 0.3s ease-out, transform 0.4s ease-out',
      }}>
        {/* Number — shifts left when 2 digits */}
        <div style={{
          position: 'absolute', top: 0,
          left: oneDigit ? 640 : 598,
          transform: 'translateX(-50%)',
          transition: 'left 0.3s ease-out',
          fontFamily: font, fontSize: 236, fontWeight: 500, lineHeight: 1,
          ...scoreGradStyle,
        }}>
          {score}
        </div>
        {/* % — fixed position, animates in at 2 digits */}
        <div style={{
          position: 'absolute', top: 107, left: 772,
          transform: `translateX(-50%) scale(${oneDigit ? 0.93 : 1})`,
          transformOrigin: 'center top',
          opacity:    oneDigit ? 0 : 1,
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
          fontFamily: font, fontSize: 112, fontWeight: 500, lineHeight: 1,
          ...scoreGradStyle,
        }}>
          %
        </div>
      </div>

      {/* YOU ARE + zone label — enter from below after score exits */}
      <div style={{
        position: 'absolute', top: 164, left: 0, right: 0,
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
        }}>
          YOU ARE
        </div>
        <div style={{
          fontSize: zone.key === 'severely' ? 88 : 111, fontWeight: 500, lineHeight: 'normal',
          opacity:         textStage === 'full' ? 1 : 0,
          transform:       textStage === 'full' ? 'translateY(0)' : 'translateY(160px)',
          transition:      'opacity 0.4s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transitionDelay: '0.15s',
        }}>
          {textStage === 'full' ? zone.statusLabel : ''}
        </div>
      </div>

      {/* Small score near indicator */}
      <div style={{
        position: 'absolute',
        left: indCenterX,
        top: 432,
        transform: textStage !== null
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(60px)',
        display: 'flex', alignItems: 'flex-start',
        fontFamily: font, pointerEvents: 'none',
        opacity:         textStage !== null ? 1 : 0,
        transition:      'opacity 0.4s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transitionDelay: '0.1s',
      }}>
        <span style={{ fontSize: 47, fontWeight: 500, lineHeight: 1, ...scoreGradStyle }}>{score}</span>
        <span style={{ fontSize: 20, fontWeight: 500, lineHeight: 1, marginTop: 21, ...scoreGradStyle }}>%</span>
      </div>

      {/* HEALTHY ZONE label */}
      <div style={{
        position: 'absolute',
        left: z3CenterX,
        top: 586,
        transform: 'translateX(-50%) translateY(-50%)',
        fontFamily: font, fontSize: 20, color: '#C7F1EF',
        letterSpacing: 3, whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}>
        HEALTHY ZONE
      </div>

      {/* Result visible */}
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
