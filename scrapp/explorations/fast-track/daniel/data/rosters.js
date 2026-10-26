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

// ─── Fotos por equipo (22/10) ───
// Las de pravatar se veían "muy random" (cliente). Según el equipo elegido en el panel:
//   dallas   los jugadores reales con su nombre, su dorsal y su foto (dallascowboys.com). Lo que falte
//            hasta el tamaño de la plantilla se rellena con inventados con los 16 retratos de IA
//            (Figma, "Scrapp · Fotos IA (Fast Track)"): caras ficticias, camiseta blanca sin logos
//   arsenal  los jugadores reales, con su nombre, su dorsal y su foto (las de Daniel). Lo que falte
//            hasta el tamaño de la plantilla se rellena con inventados sin foto
//   kamleon  (neutro, 23/10) jugadores reales del Villarreal con su dorsal y su foto (las de Daniel,
//            recortadas a cabeza y hombros). Lo que falte se rellena con inventados que reutilizan
//            esas mismas fotos, como el relleno de Dallas
//   resto    como antes, hasta que haya fotos de fútbol
const PHOTOS = import.meta.glob('./photos/*/*.jpg', { eager: true, import: 'default' });
const photo = (team, file) => PHOTOS[`./photos/${team}/${file}.jpg`];
const DALLAS_PHOTOS = Array.from({ length: 16 }, (_, i) => photo('dallas', String(i + 1).padStart(2, '0')));

// Dallas Cowboys 2026: los jugadores reales con su dorsal y su foto, de dallascowboys.com (22/10).
// Kyle Trask no tiene dorsal en la web y no va; el 25 lo tienen dos (Abanikanda y Porter Jr.) y la
// webapp no deja repetir, así que solo va Porter Jr.
const DALLAS = [
  [0, 'DeMarvion Overshown', 'Overshown', 'demarvion-overshown'],
  [1, 'P.J. Locke', 'Locke', 'p-j-locke'],
  [2, 'Cobie Durant', 'Durant', 'cobie-durant'],
  [3, 'George Pickens', 'Pickens', 'george-pickens'],
  [4, 'Dak Prescott', 'Prescott', 'dak-prescott'],
  [5, 'Bryan Anger', 'Anger', 'bryan-anger'],
  [6, 'Donovan Ezeiruaku', 'Ezeiruaku', 'donovan-ezeiruaku'],
  [7, 'Rashan Gary', 'Gary', 'rashan-gary'],
  [9, 'KaVontae Turpin', 'Turpin', 'kavontae-turpin'],
  [11, 'Alijah Clark', 'Clark', 'alijah-clark'],
  [13, 'Caleb Downs', 'Downs', 'caleb-downs'],
  [14, 'Markquese Bell', 'Bell', 'markquese-bell'],
  [15, 'Derion Kendrick', 'Kendrick', 'derion-kendrick'],
  [16, 'Sam Howell', 'Howell', 'sam-howell'],
  [17, 'Brandon Aubrey', 'Aubrey', 'brandon-aubrey'],
  [18, 'Jonathan Mingo', 'Mingo', 'jonathan-mingo'],
  [19, 'Ryan Flournoy', 'Flournoy', 'ryan-flournoy'],
  [20, 'Malik Davis', 'Davis', 'malik-davis'],
  [23, 'Ameer Speed', 'Speed', 'ameer-speed'],
  [24, 'Malik Hooker', 'Hooker', 'malik-hooker'],
  [25, 'Joey Porter Jr.', 'Porter Jr.', 'joey-porter-jr'],
  [26, 'DaRon Bland', 'Bland', 'daron-bland'],
  [27, 'Reddy Steward', 'Steward', 'reddy-steward'],
  [28, 'Shavon Revel Jr.', 'Revel Jr.', 'shavon-revel-jr'],
  [29, 'Devin Moore', 'Moore', 'devin-moore'],
  [30, 'Hunter Luepke', 'Luepke', 'hunter-luepke'],
  [31, 'Emari Demercado', 'Demercado', 'emari-demercado'],
  [32, 'Tyler Goodson', 'Goodson', 'tyler-goodson'],
  [33, 'Javonte Williams', 'Williams', 'javonte-williams'],
  [34, 'Jalen Thompson', 'Thompson', 'jalen-thompson'],
  [35, 'Marist Liufau', 'Liufau', 'marist-liufau'],
  [39, 'Tyrek Funderburk', 'Funderburk', 'tyrek-funderburk'],
  [40, 'Von Miller', 'Miller', 'von-miller'],
  [41, 'James Houston', 'Houston', 'james-houston'],
  [42, 'Curtis Robinson', 'Robinson', 'curtis-robinson'],
  [43, 'Juanyeh Thomas', 'Thomas', 'juanyeh-thomas'],
  [44, 'Trent Sieg', 'Sieg', 'trent-sieg'],
  [45, 'Justin Barron', 'Barron', 'justin-barron'],
  [46, 'Michael Trigg', 'Trigg', 'michael-trigg'],
  [49, 'DJ Rogers', 'Rogers', 'dj-rogers'],
  [50, 'Shemar James', 'James', 'shemar-james'],
  [51, 'Nick Leverett', 'Leverett', 'nick-leverett'],
  [52, 'Tyler Booker', 'Booker', 'tyler-booker'],
  [53, 'Dee Winters', 'Winters', 'dee-winters'],
  [55, 'Jaishawn Barham', 'Barham', 'jaishawn-barham'],
  [56, 'Cooper Beebe', 'Beebe', 'cooper-beebe'],
  [57, 'Malachi Lawrence', 'Lawrence', 'malachi-lawrence'],
  [58, 'Isaiah Land', 'Land', 'isaiah-land'],
  [59, 'Tyrus Wheat', 'Wheat', 'tyrus-wheat'],
  [60, 'Tyler Guyton', 'Guyton', 'tyler-guyton'],
  [64, 'Wanya Morris', 'Morris', 'wanya-morris'],
  [65, 'Ajani Cornelius', 'Cornelius', 'ajani-cornelius'],
  [66, 'T.J. Bass', 'Bass', 't-j-bass'],
  [67, 'Drew Shelton', 'Shelton', 'drew-shelton'],
  [72, 'Matt Hennessy', 'Hennessy', 'matt-hennessy'],
  [73, 'Tyler Smith', 'Smith', 'tyler-smith'],
  [77, 'Broderick Jones', 'Jones', 'broderick-jones'],
  [78, 'Terence Steele', 'Steele', 'terence-steele'],
  [79, 'Marcellus Johnson', 'Johnson', 'marcellus-johnson'],
  [80, 'Camden Brown', 'Brown', 'camden-brown'],
  [81, 'Jordan Hudson', 'Hudson', 'jordan-hudson'],
  [83, 'Anthony Smith', 'Smith', 'anthony-smith-2'],
  [84, 'James Mitchell', 'Mitchell', 'james-mitchell'],
  [85, 'Princeton Fant', 'Fant', 'princeton-fant'],
  [86, 'Luke Schoonmaker', 'Schoonmaker', 'luke-schoonmaker'],
  [87, 'Jake Ferguson', 'Ferguson', 'jake-ferguson'],
  [88, 'CeeDee Lamb', 'Lamb', 'ceedee-lamb'],
  [89, 'Brevyn Spann-Ford', 'Spann-Ford', 'brevyn-spann-ford'],
  [90, 'Jonathan Bullard', 'Bullard', 'jonathan-bullard'],
  [91, 'Otito Ogbonnia', 'Ogbonnia', 'otito-ogbonnia'],
  [92, 'Quinnen Williams', 'Williams', 'quinnen-williams'],
  [93, 'Elijah Garcia', 'Garcia', 'elijah-garcia'],
  [94, 'Kelvin Gilliam', 'Gilliam', 'kelvin-gilliam'],
  [95, 'Tommy Dunn', 'Dunn', 'tommy-dunn'],
  [96, 'Adedayo Odeleye', 'Odeleye', 'adedayo-odeleye'],
  [97, 'Kenny Clark', 'Clark', 'kenny-clark-x7989'],
  [99, 'LT Overton', 'Overton', 'lt-overton'],
].map(([number, name, short, file]) => ({ id: `dal${number}`, number, name, short, photo: photo('dallas-real', file) }));

// Dorsales de la temporada 2025/26 puestos de memoria: revisar antes de enseñarlo al club
const ARSENAL = [
  [1,  'David Raya',          'Raya',         'raya'],
  [2,  'William Saliba',      'Saliba',       'saliba'],
  [3,  'Cristhian Mosquera',  'Mosquera',     'mosquera'],
  [4,  'Ben White',           'White',        'white'],
  [5,  'Piero Hincapié',      'Hincapié',     'hincapie'],
  [6,  'Gabriel Magalhães',   'Gabriel',      'magalhaes'],
  [7,  'Bukayo Saka',         'Saka',         'saka'],
  [8,  'Martin Ødegaard',     'Ødegaard',     'odegard'],
  [9,  'Gabriel Jesus',       'Jesus',        'gabriel-jesus'],
  [10, 'Eberechi Eze',        'Eze',          'eze'],
  [11, 'Gabriel Martinelli',  'Martinelli',   'martinelli'],
  [12, 'Jurriën Timber',      'Timber',       'timber'],
  [13, 'Kepa Arrizabalaga',   'Kepa',         'kepa'],
  [14, 'Viktor Gyökeres',     'Gyökeres',     'gyokeres'],
  [16, 'Christian Nørgaard',  'Nørgaard',     'norgaard'],
  [19, 'Leandro Trossard',    'Trossard',     'trossard'],
  [20, 'Noni Madueke',        'Madueke',      'madueke'],
  [22, 'Ethan Nwaneri',       'Nwaneri',      'nwaneri'],
  [23, 'Mikel Merino',        'Merino',       'merino'],
  [29, 'Kai Havertz',         'Havertz',      'havertz'],
  [33, 'Riccardo Calafiori',  'Calafiori',    'calafiori'],
  [35, 'Tommy Setford',       'Setford',      'setford'],
  [36, 'Martín Zubimendi',    'Zubimendi',    'zubimendi'],
  [41, 'Declan Rice',         'Rice',         'rice'],
  [49, 'Myles Lewis-Skelly',  'Lewis-Skelly', 'myles'],
].map(([number, name, short, file]) => ({ id: `ars${number}`, number, name, short, photo: photo('arsenal', file) }));

// Villarreal 2025/26: los dorsales vienen en el nombre de cada foto de Daniel (23/10)
const VILLARREAL = [
  [1,  'Junior Luiz',        'Luiz',       'junior-luiz'],
  [2,  'Logan Costa',        'Costa',      'logan-costa'],
  [3,  'Álex Freeman',       'Freeman',    'alex-freeman'],
  [4,  'Carlos Romero',      'Romero',     'carlos-romero'],
  [5,  'Willy Kambwala',     'Kambwala',   'willy-kambwala'],
  [6,  'Pau Navarro',        'Navarro',    'pau-navarro'],
  [7,  'Gerard Moreno',      'Moreno',     'gerard-moreno'],
  [8,  'Juan Foyth',         'Foyth',      'juan-foyth'],
  [9,  'Georges Mikautadze', 'Mikautadze', 'georges-mikautadze'],
  [10, 'Thiago Fernández',   'Fernández',  'thiago-fernandez'],
  [11, 'Ilias Akhomach',     'Akhomach',   'ilias-akhomach'],
  [12, 'Renato Veiga',       'Veiga',      'renato-veiga'],
  [13, 'Diego Conde',        'Conde',      'diego-conde'],
  [14, 'Santi Comesaña',     'Comesaña',   'santi-comesana'],
  [15, 'Santiago Mouriño',   'Mouriño',    'santiago-mourino'],
  [16, 'Ramón Terrats',      'Terrats',    'ramon-terrats'],
  [17, 'Tajon Buchanan',     'Buchanan',   'tajon-buchanan'],
  [18, 'Pape Gueye',         'Gueye',      'pape-gueye'],
  [19, 'Nicolas Pépé',       'Pépé',       'nicolas-pepe'],
  [20, 'Alberto Moleiro',    'Moleiro',    'alberto-moleiro'],
  [21, 'Tani Oluwaseyi',     'Oluwaseyi',  'tani-oluwaseyi'],
  [22, 'Ayoze Pérez',        'Pérez',      'ayoze-perez'],
  [23, 'Sergi Cardona',      'Cardona',    'sergi-cardona'],
  [24, 'Pau Cabanes',        'Cabanes',    'pau-cabanes'],
  [25, 'Arnau Tenas',        'Tenas',      'arnau-tenas'],
  [27, 'Dani Requena',       'Requena',    'dani-requena'],
  [28, 'Daniel Budesca',     'Budesca',    'daniel-budesca'],
  [29, 'Jean Ives Valou',    'Valou',      'jean-ives-valou'],
  [30, 'Carlos Macià',       'Macià',      'carlos-macia'],
  [31, 'Rubén Gómez',        'Gómez',      'ruben-gomez'],
  [38, 'Alassane Diatta',    'Diatta',     'alassane-diatta'],
].map(([number, name, short, file]) => ({ id: `vil${number}`, number, name, short, photo: photo('villarreal', file) }));

// Los reales primero (por dorsal, hasta el tamaño de la plantilla elegida); si la plantilla es más
// grande que el equipo, el resto se rellena con los inventados en los dorsales libres
function withReal(real, players) {
  const picked = real.slice(0, players.length);
  const taken = new Set(picked.map(p => p.number));
  const fill = players.filter(p => !taken.has(p.number)).slice(0, players.length - picked.length);
  return [...picked, ...fill].sort((a, b) => a.number - b.number);
}

export function teamRoster(players, team) {
  if (team === 'dallas') {
    // los inventados del relleno llevan una cara de IA (uno de cada nueve sin foto, para ver las
    // iniciales, que pasa en la vida real)
    const fill = players.map((p, i) => ({ ...p, photo: i % 9 === 4 ? null : DALLAS_PHOTOS[i % DALLAS_PHOTOS.length] }));
    return withReal(DALLAS, fill);
  }
  if (team === 'kamleon') {
    // el relleno reutiliza las fotos del Villarreal (uno de cada nueve sin foto, para las iniciales)
    const fill = players.map((p, i) => ({ ...p, photo: i % 9 === 4 ? null : VILLARREAL[i % VILLARREAL.length].photo }));
    return withReal(VILLARREAL, fill);
  }
  if (team === 'arsenal') {
    return withReal(ARSENAL, players.map(p => ({ ...p, photo: null })));
  }
  return players;
}

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
