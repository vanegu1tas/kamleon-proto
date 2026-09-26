// Geometría y rangos del score. Sale de scrapp/screens/Exploration5.jsx, que es la
// exploración elegida: mismo centro, mismo radio y el mismo arco de 240° partido en cuatro
// zonas. Lo que cambia en la demo es la piel, no el cálculo, así que esto se mantiene igual
// para que el score caiga exactamente donde caía antes.

export const CX = 640;
export const CY = 441;
export const R  = 272;
export const SW = 32;

export const GAUGE_START = 240;
export const GAUGE_SWEEP = 240;
const GAP = 4;

// Umbrales reales de cada rango (no se tocan: son los que define la ciencia).
export const ZONE_BOUNDS = [
  { start: 0,    end: 37.5 },
  { start: 37.5, end: 59.5 },
  { start: 59.5, end: 90.5 },
  { start: 90.5, end: 100  },
];

// `arc` es cuánto ocupa cada zona en el dibujo: las dos de los extremos se igualan y las del
// medio van proporcionales a su rango, si no el tramo "hydrated" se comería el arco.
// Cuánto debería tomar en cada rango. Provisional: la fórmula real depende del peso y del
// clima, y está pendiente de definir con el PM (ver el PRD). Acá sirve para ver la pantalla.
// El envase de referencia es el de 20 fl oz (591 ml) del boceto.
export const BOTTLE_ML = 591;

export const ZONES = [
  { key: 'severely',   label: 'SEVERELY DEHYDRATED', short: 'Severely dehydrated', arc: 0.26, color: '#E04F4A', sample: 22, drinkMl: 590 },
  { key: 'dehydrated', label: 'DEHYDRATED',          short: 'Dehydrated',          arc: 0.27, color: '#FAC63E', sample: 48, drinkMl: 300 },
  { key: 'hydrated',   label: 'HYDRATED',            short: 'Hydrated',            arc: 0.35, color: '#2FD5CB', sample: 82, drinkMl: 150 },
  { key: 'over',       label: 'OVER HYDRATED',       short: 'Over hydrated',       arc: 0.12, color: '#E04F4A', sample: 95, drinkMl: 0 },
];

const MESSAGE_ZONES = [
  { end: 37,  text: 'You are far from the optimal range.'      },
  { end: 54,  text: 'You are below the optimal range.'         },
  { end: 59,  text: 'You are close to the optimal range.'      },
  { end: 90,  text: 'Well done! You are in the optimal range.' },
  { end: 95,  text: 'You are close to the optimal range.'      },
  { end: 100, text: 'You are above the optimal range.'         },
];

export function getMessageText(score) {
  return (MESSAGE_ZONES.find(z => score <= z.end) ?? MESSAGE_ZONES.at(-1)).text;
}

export function polar(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

export function arcPath(cx, cy, r, a1, a2) {
  const [x1, y1] = polar(cx, cy, r, a1);
  const [x2, y2] = polar(cx, cy, r, a2);
  const large = (a2 - a1) > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

// Tramo con las puntas redondeadas por fuera y por dentro (no basta un stroke con linecap:
// el radio de la punta tiene que ser menor que el grosor).
export function roundedZonePath(cx, cy, r, sw, a1, a2, capR = 8) {
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

export const ANGLES = buildAngles();

export function getZoneIndex(score) {
  const idx = ZONE_BOUNDS.findIndex(b => score <= b.end);
  return idx === -1 ? ZONES.length - 1 : idx;
}

export function scoreToAngle(score) {
  const idx = getZoneIndex(score);
  const { start, end } = ZONE_BOUNDS[idx];
  const t = end === start ? 0 : (score - start) / (end - start);
  const { a1, a2 } = ANGLES[idx];
  return a1 + t * (a2 - a1);
}

export function mlToOz(ml) {
  return Math.round(ml / 29.5735);
}
