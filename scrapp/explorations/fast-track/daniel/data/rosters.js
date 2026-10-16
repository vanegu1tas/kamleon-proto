export { initialsFor } from '../../../../data/mockFlowData';

// Plantillas de prueba para Fast Track. Nombres inventados (no son jugadores reales).
// Tres casos para ver cómo se comporta la pantalla:
//   football  → 28 jugadores: 2 pestañas de rangos
//   nfl       → 90 jugadores con saltos en la numeración (sin repetidos: la webapp no los permite)
//   small     → 16 jugadores: sin rangos, cabe en una sola página

const FIRST = ['Álex', 'Bruno', 'Carlos', 'Dani', 'Elías', 'Fede', 'Gabi', 'Hugo', 'Iker', 'Javi',
  'Kevin', 'Leo', 'Marco', 'Nico', 'Óscar', 'Pau', 'Quique', 'Rubén', 'Sergio', 'Tomás',
  'Unai', 'Víctor', 'Willy', 'Xavi', 'Yago', 'Zack', 'Adrián', 'Borja', 'César', 'Diego'];
const LAST = ['Arenas', 'Benítez', 'Cortés', 'Delgado', 'Escobar', 'Fuentes', 'Gallardo', 'Herrera',
  'Ibáñez', 'Jiménez', 'Lozano', 'Molina', 'Navarro', 'Ortega', 'Pastor', 'Quintana', 'Ramos',
  'Santana', 'Toledo', 'Urrutia', 'Valverde', 'Zamora', 'Aguirre', 'Bravo', 'Campos', 'Domínguez',
  'Estévez', 'Ferrer', 'Guerrero', 'Hidalgo'];

// Algunos sin foto, para ver las iniciales (pasa en la vida real)
function player(i, number) {
  const first = FIRST[i % FIRST.length];
  const last = LAST[(i * 7) % LAST.length];
  return {
    id: `p${i}`,
    number,
    name: `${first} ${last}`,
    short: last,                       // lo que se muestra bajo la foto, como en su prueba
    photo: i % 9 === 4 ? null : `https://i.pravatar.cc/240?img=${(i % 70) + 1}`,
  };
}

function build(numbers) {
  return numbers.map((n, i) => player(i, n)).sort((a, b) => a.number - b.number);
}

// Fútbol: 1–25 más algunos dorsales altos
const FOOTBALL = build([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 27, 30, 33]);

// NFL: 90 jugadores sobre 0–99, todos distintos, con 10 huecos en la numeración
const NFL_NUMBERS = [];
for (let n = 0; n <= 99; n++) if (n % 10 !== 9) NFL_NUMBERS.push(n);
const NFL = build(NFL_NUMBERS);

const SMALL = build([1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 14, 17, 19, 21, 23, 30]);

export const ROSTERS = {
  football: { label: 'Fútbol · 28', players: FOOTBALL },
  nfl:      { label: 'NFL · 90',    players: NFL },
  small:    { label: 'Pequeña · 16', players: SMALL },
};

// Quien entra por QR: staff que no está en la plantilla
export const STAFF_MEMBER = { id: 'staff', name: 'Alex Rivera', short: 'Alex Rivera', number: null, photo: null };

// Páginas de máximo 20 (o 30, según el selector de la demo), por dorsal. La webapp no deja repetir
// dorsales (Daniel, 16/10), pero por si acaso: un mismo dorsal nunca se parte entre dos páginas: si un
// repetido cae justo en el corte, el grupo entero pasa a la siguiente (la página queda con menos
// de 20, nunca con más). La etiqueta es el rango real de dorsales de la página.
export const PAGE_SIZES = [20, 30];

export function paginate(players, size = 20) {
  const pages = [];
  let current = [];
  for (const p of players) {
    if (current.length >= size) {
      const carry = [];
      while (current.length && current[current.length - 1].number === p.number) carry.unshift(current.pop());
      pages.push(current);
      current = carry;
    }
    current.push(p);
  }
  if (current.length) pages.push(current);
  return pages.map(list => ({
    players: list,
    label: `${list[0].number}–${list[list.length - 1].number}`,
  }));
}
