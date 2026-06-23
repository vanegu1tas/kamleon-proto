// arc: visual fraction of the gauge sweep — matches score proportions
const ZONES = [
  { key: 'severely',   label: 'Severely dehydrated', end: 40,  arc: 0.40, color: '#FF3B30' },
  { key: 'dehydrated', label: 'Dehydrated',          end: 60,  arc: 0.20, color: '#FF9500' },
  { key: 'hydrated',   label: 'Hydrated',            end: 90,  arc: 0.30, color: '#30D158' },
  { key: 'over',       label: 'Over hydrated',       end: 100, arc: 0.10, color: '#FF3B30' },
];

const CX = 300;
const CY = 268;
const R  = 205;
const STROKE_W  = 30;
const GAP_DEG   = 3;
const GAUGE_START = 210;
const GAUGE_SWEEP = 300;

function polar(cx, cy, r, deg) {
  const rad = (deg - 90) * (Math.PI / 180);
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arcPath(cx, cy, r, a1, a2) {
  const [x1, y1] = polar(cx, cy, r, a1);
  const [x2, y2] = polar(cx, cy, r, a2);
  const large = (a2 - a1) > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

// Compute zone drawing angles from arc fractions (accounts for gaps)
function buildZoneAngles() {
  const arcAvailable = GAUGE_SWEEP - (ZONES.length - 1) * GAP_DEG;
  let cursor = GAUGE_START;
  return ZONES.map((z, i) => {
    const sweep = z.arc * arcAvailable;
    const a1 = cursor;
    const a2 = cursor + sweep;
    cursor = a2 + (i < ZONES.length - 1 ? GAP_DEG : 0);
    return { a1, a2 };
  });
}

const ZONE_ANGLES = buildZoneAngles();

export function getZone(score) {
  return ZONES.find(z => score <= z.end) ?? ZONES[ZONES.length - 1];
}

export default function GaugeChart({ score = 56 }) {
  const indicatorAngle = GAUGE_START + (score / 100) * GAUGE_SWEEP;
  const zone = getZone(score);

  return (
    <svg viewBox="0 0 600 515" style={{ height: 580, width: 'auto', display: 'block' }}>
      {/* Track */}
      <path
        d={arcPath(CX, CY, R, GAUGE_START, GAUGE_START + GAUGE_SWEEP)}
        fill="none"
        stroke="#1c1c1c"
        strokeWidth={STROKE_W + 8}
        strokeLinecap="round"
      />

      {/* Zone segments — active zone grows outward only */}
      {ZONES.map((z, i) => {
        const active = z.key === zone.key;
        const extra  = 14;
        const sw     = active ? STROKE_W + extra : STROKE_W;
        const r      = active ? R + extra / 2    : R;
        return (
          <path
            key={z.key}
            d={arcPath(CX, CY, r, ZONE_ANGLES[i].a1, ZONE_ANGLES[i].a2)}
            fill="none"
            stroke={z.color}
            strokeWidth={sw}
            strokeLinecap="butt"
          />
        );
      })}

      {/* Rounded cap — gauge start */}
      {(() => { const [x, y] = polar(CX, CY, R, GAUGE_START);               return <circle cx={x} cy={y} r={STROKE_W / 2} fill={ZONES[0].color} />; })()}
      {/* Rounded cap — gauge end */}
      {(() => { const [x, y] = polar(CX, CY, R, GAUGE_START + GAUGE_SWEEP); return <circle cx={x} cy={y} r={STROKE_W / 2} fill={ZONES[ZONES.length - 1].color} />; })()}

      {/* Indicator — white radial stripe with black border */}
      {(() => {
        const extra = 14;
        const inner = R - STROKE_W / 2 - 4;
        const outer = R + extra / 2 + (STROKE_W + extra) / 2 + 4;
        const [x1, y1] = polar(CX, CY, inner, indicatorAngle);
        const [x2, y2] = polar(CX, CY, outer, indicatorAngle);
        const coords = { x1: x1.toFixed(2), y1: y1.toFixed(2), x2: x2.toFixed(2), y2: y2.toFixed(2) };
        return (
          <>
            <line {...coords} stroke="#0d0d0d" strokeWidth={18} strokeLinecap="round" />
            <line {...coords} stroke="white"   strokeWidth={10} strokeLinecap="round" />
          </>
        );
      })()}

      {/* Score number */}
      <text
        x={CX}
        y={CY - 18}
        textAnchor="middle"
        fill="white"
        style={{
          fontFamily: 'var(--font-family-primary)',
          fontSize: 112,
          fontWeight: 'var(--font-weight-bold)',
        }}
      >
        {score}
        <tspan dy="-40" style={{ fontSize: 44, fontWeight: 'var(--font-weight-medium)' }}>%</tspan>
      </text>

      {/* Zone label */}
      <text
        x={CX}
        y={CY + 34}
        textAnchor="middle"
        fill={zone.color}
        style={{
          fontFamily: 'var(--font-family-primary)',
          fontSize: 22,
          fontWeight: 'var(--font-weight-medium)',
        }}
      >
        {zone.label}
      </text>
    </svg>
  );
}
