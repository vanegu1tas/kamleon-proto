import { USERS_POOL } from '../../StaffOrganizaciones/mockData';

// Datos de hidratación para Analytics > Hydration (Team Admin). Mock determinista: mismo
// equipo + mismo rango de fechas dan siempre los mismos números.
//
// Los equipos del mock de organizaciones tienen 4–6 personas; la gráfica de franjas necesita
// más gente para verse como en Figma, así que cada equipo se completa hasta ROSTER_SIZE con
// jugadores que solo existen acá.

export const ROSTER_SIZE = 16;

// Franjas del score (Figma, Explorations / Web App 3.0, nodo 329:14820). `flex` es el ancho
// de cada franja en Figma (122/302/432/122), que no es proporcional al rango.
export const HYDRATION_STATUSES = [
  { key: 'severe',     label: 'Severely dehydrated', short: 'Severely',   min: 0,  max: 43, flex: 122, color: 'var(--color-red-65)' },
  { key: 'dehydrated', label: 'Dehydrated',          short: 'Dehydrated', min: 44, max: 64, flex: 302, color: 'var(--color-yellow-66)' },
  { key: 'hydrated',   label: 'Hydrated',            short: 'Hydrated',   min: 65, max: 93, flex: 432, color: 'var(--color-turquoise-51)' },
  { key: 'over',       label: 'Over hydrated',       short: 'Over',       min: 94, max: 99, flex: 122, color: 'var(--color-orange-65)' },
];


export function getStatus(score) {
  return HYDRATION_STATUSES.find(s => score <= s.max) ?? HYDRATION_STATUSES[HYDRATION_STATUSES.length - 1];
}

const EXTRA_NAMES = [
  'Gabriel Jesus', 'Leon Marsh', 'Ivo Santos', 'Mateo Ruiz', 'Owen Blake', 'Theo Hart',
  'Luca Bianchi', 'Sam Okafor', 'Felix Braun', 'Hugo Lambert', 'Aaron Reid', 'Nico Varga',
  'Jamie Cole', 'Kai Morgan', 'Elliot Shaw', 'Rafa Moreno',
];

// "Hoy" del proto, fijo para que el mock no cambie de un día a otro
export const TODAY = new Date(2026, 9, 26, 18, 0);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const next = () => (s = (s * 16807) % 2147483647) / 2147483647;
  // Con semillas pequeñas los primeros valores salen casi iguales: se descartan
  for (let i = 0; i < 8; i++) next();
  return next;
}

function formatSampleDate(d) {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${hh}:${mm}`;
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// Fotos del First Team (Daniel, 4/11: para enseñar a business cómo se verá con fotos; nombres sin
// cambiar). Son las del Villarreal de la scrapp (Fast Track), copiadas aquí para no depender de ella.
const FIRST_TEAM_ID = 3011;
const PHOTOS = Object.values(import.meta.glob('../assets/players/*.jpg', { eager: true, query: '?url', import: 'default' }));

function getRoster(team) {
  const real = (team.users ?? [])
    .filter(id => !(team.inactiveUsers ?? []).includes(id))
    .map(id => USERS_POOL.find(u => u.id === id))
    .filter(Boolean)
    .map(u => ({ id: `u${u.id}`, name: u.name }));
  const extras = EXTRA_NAMES
    .filter(name => !real.some(r => r.name === name))
    .slice(0, Math.max(0, ROSTER_SIZE - real.length))
    .map((name, i) => ({ id: `x${team.id}-${i}`, name }));
  // Dorsal (4/11, Users Analytics: la lista de jugadores va por número). Únicos dentro del equipo y
  // estables: barajados con una semilla del equipo.
  const rand = seeded(team.id * 211 + 5);
  const pool = Array.from({ length: 40 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  return [...real, ...extras].map((p, i) => ({ ...p, number: pool[i], photo: team.id === FIRST_TEAM_ID ? PHOTOS[i % PHOTOS.length] : undefined }));
}

function buildSamples(rand, base, count, range) {
  const samples = [];
  for (let i = 0; i < count; i++) {
    const dayBack = (range.offset ?? 0) + Math.floor(rand() * range.days);
    const d = new Date(TODAY);
    d.setDate(d.getDate() - dayBack);
    d.setHours(7 + Math.floor(rand() * 11), Math.floor(rand() * 60));
    const score = clamp(Math.round(base + (rand() - 0.5) * 24), 5, 99);
    samples.push({ score, date: d, label: formatSampleDate(d) });
  }
  return samples.sort((a, b) => b.date - a.date);
}

const DAY_MS = 86400000;

// Devuelve { players, unknownSamples, teamScore, compliance } para un equipo y un rango de
// fechas { start, end }. `players` incluye a quienes no registraron muestras (average = null).
export function getTeamHydration(team, { start, end }) {
  const todayDay = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
  const range = {
    days: Math.round((end - start) / DAY_MS) + 1,
    offset: Math.round((todayDay - end) / DAY_MS),
  };
  const rangeSeed = range.offset * 7 + range.days;

  const players = getRoster(team).map((p, i) => {
    const rand = seeded(team.id * 97 + i * 31 + rangeSeed * 7919);
    // Hidratación "habitual" de cada jugador, estable entre rangos. Como en Figma, la mayoría
    // queda en Hydrated y unos pocos en las otras franjas.
    const baseRand = seeded(team.id * 13 + i * 101);
    const pick = baseRand();
    const base = pick < 0.1 ? 25 + baseRand() * 18
      : pick < 0.3 ? 46 + baseRand() * 18
      : pick < 0.92 ? 68 + baseRand() * 22
      : 95 + baseRand() * 4;
    const perDay = rand() < 0.12 ? 0 : 1 + Math.floor(rand() * 3);
    // Rangos de más de un día (Users Analytics, 4/11): cada jugador con su ritmo de registro, estable
    // entre rangos (antes el tope de 40 dejaba a medio equipo empatado en el ranking de engagement).
    // Un día sigue igual que siempre (Daily).
    const rate = 0.25 + seeded(team.id * 23 + i * 67)() * 1.5;
    const count = range.days === 1 ? Math.min(perDay, 4) : perDay === 0 ? 0 : Math.round(range.days * rate);
    const samples = buildSamples(rand, base, count, range);
    // Detalle de cada muestra para el "Sample details" del sheet en mobile (3/11). Otra semilla:
    // los scores de arriba no cambian.
    const sampleRand = seeded(team.id * 41 + i * 59 + rangeSeed * 3);
    samples.forEach(sm => Object.assign(sm, {
      usg: Math.round(1035 - sm.score * 0.3 + sampleRand() * 4),
      electrolytes: Math.round(4 + sampleRand() * 20),
      color: clamp(Math.round(8 - sm.score / 13 + sampleRand()), 1, 8),
      volume: Math.round((150 + sampleRand() * 300) / 5) * 5,
    }));
    if (samples.length === 0) return { ...p, samples, average: null };
    const average = Math.round(samples.reduce((s, x) => s + x.score, 0) / samples.length);
    return {
      ...p,
      samples,
      average,
      usg: Math.round(1035 - average * 0.3 + rand() * 4),
      electrolytes: Math.round(4 + rand() * 20),
      color: clamp(Math.round(8 - average / 13 + rand()), 1, 8),
      volume: Math.round((150 + rand() * 300) / 5) * 5,
    };
  });

  const recorded = players.filter(p => p.average !== null);
  const unknownRand = seeded(team.id * 7 + rangeSeed * 131);
  const unknownCount = Math.round((range.days === 1 ? 3 : 8) + unknownRand() * 4);
  const unknownSamples = Array.from({ length: unknownCount }, () => ({ score: Math.round(10 + unknownRand() * 85) }));
  // Detalle de cada muestra unknown para su bottom sheet en mobile (3/11). Otra semilla: los scores
  // de arriba no cambian.
  const detailRand = seeded(team.id * 11 + rangeSeed * 17);
  unknownSamples.forEach(sm => {
    const d = new Date(end);
    d.setHours(7 + Math.floor(detailRand() * 11), Math.floor(detailRand() * 60));
    Object.assign(sm, {
      date: d, label: formatSampleDate(d),
      usg: Math.round(1035 - sm.score * 0.3 + detailRand() * 4),
      electrolytes: Math.round(4 + detailRand() * 20),
      color: clamp(Math.round(8 - sm.score / 13 + detailRand()), 1, 8),
      volume: Math.round((150 + detailRand() * 300) / 5) * 5,
    });
  });

  return {
    players,
    unknownSamples,
    teamScore: recorded.length
      ? Math.round(recorded.reduce((s, p) => s + p.average, 0) / recorded.length)
      : null,
    compliance: { recorded: recorded.length, total: players.length },
  };
}

// USG como lo escribe business, "1.012" (Daniel, 6/11): los valores del mock van ×1000. El mismo formato en
// gráficas, tablas y sheets.
export const formatUsg = v => (Math.round(v) / 1000).toFixed(3);

// Escala de color de orina 1–8, del componente "Urine color" del DS (Figma 2325:926, 11/11): cada nivel con su
// relleno y un borde interior de 1px del amarillo del nivel siguiente (Yellow/95 y Yellow/41 añadidos a los
// tokens el 11/11). Antes el 1 era grey-98 sin borde y se veía transparente.
export const URINE_COLORS = [
  'var(--color-yellow-95)', 'var(--color-yellow-90)', 'var(--color-yellow-82)', 'var(--color-yellow-74)',
  'var(--color-yellow-66)', 'var(--color-yellow-61)', 'var(--color-yellow-57)', 'var(--color-yellow-47)',
];
export const URINE_BORDERS = [
  'var(--color-yellow-90)', 'var(--color-yellow-82)', 'var(--color-yellow-74)', 'var(--color-yellow-66)',
  'var(--color-yellow-61)', 'var(--color-yellow-57)', 'var(--color-yellow-47)', 'var(--color-yellow-41)',
];
// El círculo con el número (tablas y sheet de Daily)
export const urineStyle = level => ({ background: URINE_COLORS[level - 1], boxShadow: `inset 0 0 0 1px ${URINE_BORDERS[level - 1]}` });
