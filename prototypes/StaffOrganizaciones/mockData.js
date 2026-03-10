// ─── Single source of truth for the StaffOrganizaciones prototype ────────────
//
// Hierarchy: Org → Center → Team → User
// Users are referenced by id from USERS_POOL so a single user object
// is shared across every place it appears.

// ─── Users pool ──────────────────────────────────────────────────────────────

// ids 1–12: regular users · ids 13–18: professionals (coaches, physicians, etc.)
export const USERS_POOL = [
  // ── Regular users ──────────────────────────────────────────────────────────
  { id: 1,  name: 'Carlos García',    email: 'carlos.garcia@kamleon.com',    phone: '+34 612 345 678', birthday: '15/06/1990', gender: 'Male',   height: '178 cm', weight: '75 kg', rfid: true,  pin: false, dateAdded: '12 Jan 2024', status: 'active'   },
  { id: 2,  name: 'María López',      email: 'maria.lopez@kamleon.com',      phone: '+34 623 456 789', birthday: '22/03/1985', gender: 'Female', height: '162 cm', weight: '58 kg', rfid: true,  pin: true,  dateAdded: '03 Feb 2024', status: 'active'   },
  { id: 3,  name: 'Jordi Puig',       email: 'jordi.puig@kamleon.com',       phone: '+34 634 567 890', birthday: '07/11/1992', gender: 'Male',   height: '182 cm', weight: '82 kg', rfid: false, pin: false, dateAdded: '15 Mar 2024', status: 'inactive' },
  { id: 4,  name: 'Laia Ferrer',      email: 'laia.ferrer@kamleon.com',      phone: '+34 645 678 901', birthday: '30/09/1995', gender: 'Female', height: '165 cm', weight: '61 kg', rfid: true,  pin: false, dateAdded: '28 Apr 2024', status: 'active'   },
  { id: 5,  name: 'Ana Martínez',     email: 'ana.martinez@kamleon.com',     phone: '+34 611 222 333', birthday: '12/04/1993', gender: 'Female', height: '168 cm', weight: '63 kg', rfid: true,  pin: true,  dateAdded: '05 Jan 2024', status: 'active'   },
  { id: 6,  name: 'Pau Roca',         email: 'pau.roca@kamleon.com',         phone: '+34 622 333 444', birthday: '03/08/1988', gender: 'Male',   height: '175 cm', weight: '72 kg', rfid: true,  pin: false, dateAdded: '20 Feb 2024', status: 'active'   },
  { id: 7,  name: 'Sara Vidal',       email: 'sara.vidal@kamleon.com',       phone: '+34 633 444 555', birthday: '19/12/1997', gender: 'Female', height: '160 cm', weight: '55 kg', rfid: false, pin: true,  dateAdded: '11 Mar 2024', status: 'active'   },
  { id: 8,  name: 'Marc Soler',       email: 'marc.soler@kamleon.com',       phone: '+34 644 555 666', birthday: '08/07/1991', gender: 'Male',   height: '180 cm', weight: '78 kg', rfid: true,  pin: true,  dateAdded: '02 Apr 2024', status: 'active'   },
  { id: 9,  name: 'Elena Castro',     email: 'elena.castro@kamleon.com',     phone: '+34 655 666 777', birthday: '25/01/1994', gender: 'Female', height: '170 cm', weight: '65 kg', rfid: false, pin: false, dateAdded: '17 May 2024', status: 'active'   },
  { id: 10, name: 'David Torres',     email: 'david.torres@kamleon.com',     phone: '+34 666 777 888', birthday: '14/09/1989', gender: 'Male',   height: '176 cm', weight: '80 kg', rfid: true,  pin: false, dateAdded: '29 Jun 2024', status: 'inactive' },
  { id: 11, name: 'Nuria Ros',        email: 'nuria.ros@kamleon.com',        phone: '+34 677 888 999', birthday: '31/05/1996', gender: 'Female', height: '163 cm', weight: '57 kg', rfid: true,  pin: true,  dateAdded: '08 Jul 2024', status: 'active'   },
  { id: 12, name: 'Iñaki Etxeberria', email: 'inaki.etxeberria@kamleon.com', phone: '+34 688 999 000', birthday: '20/02/1987', gender: 'Male',   height: '185 cm', weight: '88 kg', rfid: false, pin: false, dateAdded: '14 Aug 2024', status: 'active'   },
  { id: 19, name: 'Ben White',         email: 'b.white@arsenal.com',        phone: '+44 771 100 001', birthday: '08/10/1997', gender: 'Male',   height: '186 cm', weight: '80 kg', rfid: true,  pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 20, name: 'Bukayo Saka',       email: 'b.saka@arsenal.com',         phone: '+44 771 100 002', birthday: '05/09/2001', gender: 'Male',   height: '178 cm', weight: '73 kg', rfid: true,  pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 21, name: 'Martin Ødegaard',   email: 'm.odegaard@arsenal.com',     phone: '+47 912 345 678', birthday: '17/12/1998', gender: 'Male',   height: '178 cm', weight: '68 kg', rfid: true,  pin: false, dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 22, name: 'Declan Rice',       email: 'd.rice@arsenal.com',         phone: '+44 771 100 004', birthday: '14/01/1999', gender: 'Male',   height: '185 cm', weight: '83 kg', rfid: true,  pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 23, name: 'Gabriel Magalhães', email: 'g.magalhaes@arsenal.com',    phone: '+55 11 91234 5678', birthday: '19/12/1997', gender: 'Male', height: '190 cm', weight: '84 kg', rfid: true,  pin: false, dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 24, name: 'William Saliba',    email: 'w.saliba@arsenal.com',       phone: '+33 6 12 34 56 78', birthday: '24/03/2001', gender: 'Male', height: '192 cm', weight: '85 kg', rfid: true,  pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 25, name: 'Kai Havertz',       email: 'k.havertz@arsenal.com',      phone: '+49 151 12345678', birthday: '11/06/1999', gender: 'Male',  height: '189 cm', weight: '83 kg', rfid: false, pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 26, name: 'Leandro Trossard',  email: 'l.trossard@arsenal.com',     phone: '+32 471 123 456', birthday: '04/12/1994', gender: 'Male',   height: '173 cm', weight: '68 kg', rfid: true,  pin: false, dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 27, name: 'Jurriën Timber',    email: 'j.timber@arsenal.com',       phone: '+31 6 12345678',  birthday: '17/06/2001', gender: 'Male',   height: '180 cm', weight: '75 kg', rfid: true,  pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 28, name: 'Thomas Partey',     email: 't.partey@arsenal.com',       phone: '+233 24 123 4567', birthday: '13/06/1993', gender: 'Male',  height: '185 cm', weight: '77 kg', rfid: false, pin: false, dateAdded: '01 Sep 2024', status: 'inactive' },
  { id: 29, name: 'Gabriel Martinelli',email: 'g.martinelli@arsenal.com',   phone: '+55 11 98765 4321', birthday: '18/06/2001', gender: 'Male', height: '181 cm', weight: '75 kg', rfid: true,  pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 30, name: 'Oleksandr Zinchenko',email:'o.zinchenko@arsenal.com',    phone: '+380 67 123 4567', birthday: '15/12/1996', gender: 'Male',  height: '175 cm', weight: '64 kg', rfid: true,  pin: false, dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 31, name: 'David Raya',        email: 'd.raya@arsenal.com',         phone: '+34 655 100 031', birthday: '15/09/1995', gender: 'Male',   height: '183 cm', weight: '80 kg', rfid: true,  pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },
  // ── Professionals (coaches, physicians, analysts) ──────────────────────────
  { id: 13, name: 'Dr. Elena Navarro',  email: 'e.navarro@kamleon.com',   phone: '+34 610 100 001', birthday: '04/03/1982', gender: 'Female', height: '167 cm', weight: '62 kg', rfid: true,  pin: true,  dateAdded: '01 Jan 2024', status: 'active' },
  { id: 14, name: 'Marc Dalmau',        email: 'm.dalmau@kamleon.com',    phone: '+34 610 100 002', birthday: '18/07/1979', gender: 'Male',   height: '181 cm', weight: '79 kg', rfid: true,  pin: false, dateAdded: '01 Jan 2024', status: 'active' },
  { id: 15, name: 'Dra. Sarah Mitchell',email: 's.mitchell@kamleon.com',  phone: '+44 780 200 001', birthday: '22/11/1985', gender: 'Female', height: '170 cm', weight: '64 kg', rfid: true,  pin: true,  dateAdded: '01 Jan 2024', status: 'active' },
  { id: 16, name: 'Coach James Briggs', email: 'j.briggs@kamleon.com',    phone: '+44 780 200 002', birthday: '09/05/1977', gender: 'Male',   height: '183 cm', weight: '85 kg', rfid: false, pin: true,  dateAdded: '01 Jan 2024', status: 'active' },
  { id: 17, name: 'Dr. Jordi Mas',      email: 'j.mas@kamleon.com',       phone: '+34 610 100 003', birthday: '30/09/1980', gender: 'Male',   height: '175 cm', weight: '73 kg', rfid: true,  pin: false, dateAdded: '01 Jan 2024', status: 'active' },
  { id: 18, name: 'Dra. Aina Puig',     email: 'a.puig@kamleon.com',      phone: '+34 610 100 004', birthday: '14/06/1988', gender: 'Female', height: '161 cm', weight: '59 kg', rfid: false, pin: true,  dateAdded: '01 Jan 2024', status: 'active' },
];

// ─── Organisations ────────────────────────────────────────────────────────────
//
// Each org contains its centers inline.
// Each center contains its teams inline.
// Each team has a `users` array of ids referencing USERS_POOL.
// units: number of hardware devices (not derivable from team structure).

export const ORGS = [

  // ── 1 · AnyósPark ────────────────────────────────────────────────────────
  {
    id: 1, name: 'AnyósPark', status: 'active', segments: 'Fitness', units: 12,
    contact: 'Laura Mas', email: 'contact@anyospark.ad', phone: '+376 803 400', fiscal: 'Av. Rocafort, s/n, Andorra la Vella',
    centers: [], // ← empty state shown in OrgDetail
  },

  // ── 2 · Arsenal Football Club ─────────────────────────────────────────────
  {
    id: 2, name: 'Arsenal Football Club', status: 'active', segments: 'Sport', units: 30,
    contact: 'James Wright', email: 'contact@arsenal.com', phone: '+44 20 7704 4000', fiscal: 'Highbury House, 75 Drayton Park, London N5 1BU',
    centers: [
      {
        id: 201, name: 'Sobha Realty Training Centre', status: 'active',
        email: 'training@arsenal.com', phone: '+44 1727 730 000', address: 'Shenley Road, London Colney, St. Albans AL2 1DR',
        teams: [
          {
            id: 2011, name: 'Arsenal First Team', status: 'active',
            professionalIds: [13],
            email: 'squad@arsenal.com', phone: '+44 1727 730 001', address: 'Shenley Road, London Colney, St. Albans AL2 1DR',
            users: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
          },
        ],
      },
    ],
  },

  // ── 3 · Astonia FC ────────────────────────────────────────────────────────
  {
    id: 3, name: 'Astonia FC', status: 'active', segments: 'Sport', units: 8,
    contact: 'Robert Keane', email: 'contact@astoniafc.com', phone: '+44 121 554 1234', fiscal: '100 Trinity Rd, Birmingham B6 6HH',
    centers: [
      {
        id: 301, name: 'Training Ground', status: 'active',
        email: 'training@astoniafc.com', phone: '+44 121 554 1235', address: '100 Trinity Rd, Birmingham',
        teams: [
          { id: 3011, name: 'First Team', status: 'active', professionalIds: [13, 15], email: 'firstteam@astoniafc.com', phone: '+44 121 554 1236', address: '100 Trinity Rd, Birmingham', users: [1, 3, 5, 7] },
          { id: 3012, name: 'Academy',    status: 'active', professionalIds: [17],     email: 'academy@astoniafc.com',   phone: '+44 121 554 1237', address: '100 Trinity Rd, Birmingham', users: [9, 11] },
        ],
      },
      {
        id: 302, name: 'City Campus', status: 'active',
        email: 'campus@astoniafc.com', phone: '+44 121 554 2000', address: '45 Broad St, Birmingham B1 2HP',
        teams: [
          { id: 3021, name: 'Women\'s Team', status: 'active', professionalIds: [18], email: 'womens@astoniafc.com', phone: '+44 121 554 2001', address: '45 Broad St, Birmingham', users: [2, 4, 6] },
        ],
      },
    ],
  },

  // ── 4 · Baskonia-Alavés Group ─────────────────────────────────────────────
  {
    id: 4, name: 'Baskonia-Alavés Group', status: 'active', segments: 'Sport', units: 22,
    contact: 'Joseba Txapartegi', email: 'contact@baskonia.com', phone: '+34 945 123 456', fiscal: 'Portal de Gamarra, 65, Vitoria-Gasteiz',
    centers: [
      {
        id: 401, name: 'Buesa Arena', status: 'active',
        email: 'buesa@baskonia.com', phone: '+34 945 123 457', address: 'Portal de Gamarra, 65, Vitoria-Gasteiz',
        teams: [
          { id: 4011, name: 'Basketball A', status: 'active', professionalIds: [14, 16], email: 'bball@baskonia.com', phone: '+34 945 123 458', address: 'Portal de Gamarra, 65', users: [1, 2, 5, 8] },
          { id: 4012, name: 'Basketball B', status: 'active', professionalIds: [17],     email: 'bballb@baskonia.com', phone: '+34 945 123 459', address: 'Portal de Gamarra, 65', users: [3, 6, 9] },
        ],
      },
      {
        id: 402, name: 'Mendizorroza', status: 'active',
        email: 'mendizorroza@baskonia.com', phone: '+34 945 234 567', address: 'C/ Olaguíbel, 3, Vitoria-Gasteiz',
        teams: [
          { id: 4021, name: 'Football First', status: 'active', professionalIds: [13, 15], email: 'football@baskonia.com', phone: '+34 945 234 568', address: 'C/ Olaguíbel, 3', users: [4, 7, 10, 12] },
        ],
      },
      {
        id: 403, name: 'Centro Fitness Norte', status: 'active',
        email: 'fitness@baskonia.com', phone: '+34 945 345 678', address: 'Av. Gasteiz, 45, Vitoria-Gasteiz',
        teams: [
          { id: 4031, name: 'Strength & Cond.', status: 'active', professionalIds: [18], email: 'sc@baskonia.com', phone: '+34 945 345 679', address: 'Av. Gasteiz, 45', users: [11] },
        ],
      },
      {
        id: 404, name: 'Alavés Youth Academy', status: 'inactive',
        email: 'youth@baskonia.com', phone: '+34 945 456 789', address: 'C/ Florida, 12, Vitoria-Gasteiz',
        teams: [
          { id: 4041, name: 'Youth Squad', status: 'inactive', professionalIds: [14], email: 'youth1@baskonia.com', phone: '+34 945 456 790', address: 'C/ Florida, 12', users: [2, 4] },
        ],
      },
    ],
  },

  // ── 5 · CAR Sant Cugat ────────────────────────────────────────────────────
  {
    id: 5, name: 'CAR Sant Cugat', status: 'active', segments: 'Fitness', units: 10,
    contact: 'Montserrat Puig', email: 'contact@carsantcugat.cat', phone: '+34 93 589 23 00', fiscal: 'C/ de Vallparadís, 8, Sant Cugat del Vallès',
    centers: [
      {
        id: 501, name: 'Pabellón Principal', status: 'active',
        email: 'pavelló@carsantcugat.cat', phone: '+34 93 589 23 01', address: 'C/ de Vallparadís, 8, Sant Cugat',
        teams: [
          { id: 5011, name: 'Atletisme', status: 'active', professionalIds: [15, 16], email: 'atletisme@carsantcugat.cat', phone: '+34 93 589 23 02', address: 'C/ de Vallparadís, 8', users: [1, 4, 7, 10] },
          { id: 5012, name: 'Natació',   status: 'active', professionalIds: [17],     email: 'natacio@carsantcugat.cat',   phone: '+34 93 589 23 03', address: 'C/ de Vallparadís, 8', users: [2, 5] },
        ],
      },
      {
        id: 502, name: 'Pista Exterior', status: 'active',
        email: 'exterior@carsantcugat.cat', phone: '+34 93 589 24 00', address: 'Av. dels Brugarols, 1, Sant Cugat',
        teams: [
          { id: 5021, name: 'Ciclisme', status: 'active', professionalIds: [13], email: 'ciclisme@carsantcugat.cat', phone: '+34 93 589 24 01', address: 'Av. dels Brugarols, 1', users: [3, 6, 8] },
        ],
      },
    ],
  },

  // ── 6 · CAR Sierra Nevada ─────────────────────────────────────────────────
  {
    id: 6, name: 'CAR Sierra Nevada', status: 'active', segments: 'Sport', units: 6,
    contact: 'Antonio Ruiz', email: 'contact@carsnev.es', phone: '+34 958 480 061', fiscal: 'Ctra. de Sierra Nevada, km 31, Granada',
    centers: [
      {
        id: 601, name: 'Centro Alto Rendimiento', status: 'active',
        email: 'info@carsnev.es', phone: '+34 958 480 062', address: 'Ctra. de Sierra Nevada, km 31, Granada',
        teams: [
          { id: 6011, name: 'Ski Team',    status: 'active', professionalIds: [14, 18], email: 'ski@carsnev.es',    phone: '+34 958 480 063', address: 'Ctra. Sierra Nevada, km 31', users: [1, 3, 8] },
          { id: 6012, name: 'Cross Team',  status: 'active', professionalIds: [15],     email: 'cross@carsnev.es',  phone: '+34 958 480 064', address: 'Ctra. Sierra Nevada, km 31', users: [5, 9] },
        ],
      },
    ],
  },

  // ── 7 · CEAR La Cartuja ───────────────────────────────────────────────────
  {
    id: 7, name: 'CEAR La Cartuja', status: 'inactive', segments: 'Fitness', units: 4,
    contact: 'Isabel Romero', email: 'contact@cearlacartuja.es', phone: '+34 954 467 700', fiscal: 'Isla de la Cartuja, s/n, Sevilla',
    centers: [
      {
        id: 701, name: 'Complejo Deportivo', status: 'inactive',
        email: 'info@cearlacartuja.es', phone: '+34 954 467 701', address: 'Isla de la Cartuja, s/n, Sevilla',
        teams: [
          { id: 7011, name: 'Rowing Team', status: 'inactive', professionalIds: [16], email: 'rowing@cearlacartuja.es', phone: '+34 954 467 702', address: 'Isla de la Cartuja, s/n', users: [2, 6, 10, 12] },
        ],
      },
    ],
  },

  // ── 8 · CEM Joan Miró ─────────────────────────────────────────────────────
  {
    id: 8, name: 'CEM Joan Miró', status: 'active', segments: 'Sport', units: 14,
    contact: 'Marta Gil', email: 'contact@cemjoanmiro.cat', phone: '+34 93 425 00 00', fiscal: 'Carrer del Consell de Cent, 54, Barcelona',
    centers: [
      {
        id: 801, name: 'Joan Miró Centre', status: 'active',
        email: 'centre@cemjoanmiro.cat', phone: '+34 93 425 00 01', address: 'Carrer del Consell de Cent, 54, Barcelona',
        teams: [
          { id: 8011, name: 'Equip Natació',  status: 'active', professionalIds: [13, 17], email: 'natacio@cemjoanmiro.cat',  phone: '+34 93 425 00 02', address: 'Consell de Cent, 54, Barcelona', users: [1, 3, 5, 11] },
          { id: 8012, name: 'Equip Fitness',  status: 'active', professionalIds: [18],     email: 'fitness@cemjoanmiro.cat',  phone: '+34 93 425 00 03', address: 'Consell de Cent, 54, Barcelona', users: [2, 4, 12] },
        ],
      },
      {
        id: 802, name: 'Nou Barris', status: 'active',
        email: 'noubarris@cemjoanmiro.cat', phone: '+34 93 425 10 00', address: 'Passeig de Valldaura, 277, Barcelona',
        teams: [
          { id: 8021, name: 'Equip Atletisme',  status: 'active',   professionalIds: [14, 15], email: 'atletisme@cemjoanmiro.cat',  phone: '+34 93 425 10 01', address: 'Passeig de Valldaura, 277', users: [6, 7, 8, 9] },
          { id: 8022, name: 'Equip Multisport', status: 'inactive', professionalIds: [16],     email: 'multisport@cemjoanmiro.cat', phone: '+34 93 425 10 02', address: 'Passeig de Valldaura, 277', users: [10] },
        ],
      },
    ],
  },

  // ── 9 · CNEA Font-Romeu ───────────────────────────────────────────────────
  {
    id: 9, name: 'CNEA Font-Romeu', status: 'active', segments: 'Sport', units: 5,
    contact: 'Pierre Dupont', email: 'contact@cneafontromeu.fr', phone: '+33 4 68 30 04 93', fiscal: 'Rue des Pyrénées, 2, Font-Romeu',
    centers: [
      {
        id: 901, name: 'Centre National', status: 'active',
        email: 'info@cneafontromeu.fr', phone: '+33 4 68 30 04 94', address: 'Rue des Pyrénées, 2, Font-Romeu',
        teams: [
          { id: 9011, name: 'Altitude Training', status: 'active', professionalIds: [13, 17], email: 'altitude@cneafontromeu.fr', phone: '+33 4 68 30 04 95', address: 'Rue des Pyrénées, 2', users: [4, 7, 11] },
        ],
      },
    ],
  },

  // ── 10 · Dynatech ─────────────────────────────────────────────────────────
  {
    id: 10, name: 'Dynatech', status: 'inactive', segments: 'Fitness', units: 3,
    contact: 'Sophie Wagner', email: 'contact@dynatech.io', phone: '+49 30 12345 678', fiscal: 'Unter den Linden, 10, Berlin',
    centers: [
      {
        id: 1001, name: 'Berlin HQ', status: 'inactive',
        email: 'berlin@dynatech.io', phone: '+49 30 12345 679', address: 'Unter den Linden, 10, Berlin',
        teams: [
          { id: 10011, name: 'R&D Team', status: 'inactive', professionalIds: [18], email: 'rd@dynatech.io', phone: '+49 30 12345 680', address: 'Unter den Linden, 10', users: [3, 6, 9, 12] },
        ],
      },
    ],
  },

];

// ─── Helper functions ─────────────────────────────────────────────────────────

/** Regular users (role: 'user') for a team */
export function getUsersForTeam(team) {
  return team.users.map(uid => USERS_POOL.find(u => u.id === uid)).filter(Boolean);
}

/** Professionals (role: 'professional') for a team */
export function getProfessionalsForTeam(team) {
  return (team.professionalIds || []).map(uid => USERS_POOL.find(u => u.id === uid)).filter(Boolean);
}

/**
 * All members of a team (professionals first, then users), each augmented with
 * a `role` field: 'professional' | 'user'.
 */
export function getMembersForTeam(team) {
  const professionals = getProfessionalsForTeam(team).map(u => ({ ...u, role: 'professional' }));
  const users         = getUsersForTeam(team).map(u => ({ ...u, role: 'user' }));
  return [...professionals, ...users];
}

/** Total user count for a center (sum across all teams, excludes professionals) */
export function getUserCountForCenter(center) {
  return center.teams.reduce((acc, t) => acc + t.users.length, 0);
}

/** Total professional count for a center */
export function getProfessionalCountForCenter(center) {
  return center.teams.reduce((acc, t) => acc + (t.professionalIds?.length || 0), 0);
}

/** Total user count for an org */
export function getUserCountForOrg(org) {
  return org.centers.reduce((acc, c) => acc + getUserCountForCenter(c), 0);
}

/** Number of active teams in a center */
export function getActiveTeamCount(center) {
  return center.teams.filter(t => t.status === 'active').length;
}
