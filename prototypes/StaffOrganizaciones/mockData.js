// ─── Single source of truth for the StaffOrganizaciones prototype ────────────
//
// Hierarchy: Org → Center → Team → User
// Users are referenced by id from USERS_POOL so a single user object
// is shared across every place it appears.

// ─── Users pool ──────────────────────────────────────────────────────────────

// ids 1–12:  Astonia FC users
// ids 13–18: professionals (shared across orgs)
// ids 19–31: Arsenal FC players
// ids 32–52: Baskonia-Alavés Group users
// ids 53–63: CAR Sant Cugat users
// ids 64–70: CAR Sierra Nevada users
// ids 71–74: CEAR La Cartuja users
// ids 75–87: CEM Joan Miró users
// ids 88–90: CNEA Font-Romeu users
// ids 91–94: Dynatech users
export const USERS_POOL = [

  // ── Astonia FC (ids 1–12) ───────────────────────────────────────────────────
  { id: 1,  name: 'Carlos García',    email: 'c.garcia@astoniafc.com',    phone: '+44 712 100 001', birthday: '15/06/1990', gender: 'Male',   height: '178 cm', weight: '75 kg', rfid: true,  pin: false, dateAdded: '12 Jan 2024', status: 'active'   },
  { id: 2,  name: 'Tom Whitfield',    email: 't.whitfield@astoniafc.com', phone: '+44 712 100 002', birthday: '22/03/1995', gender: 'Male',   height: '181 cm', weight: '79 kg', rfid: true,  pin: true,  dateAdded: '03 Feb 2024', status: 'active'   },
  { id: 3,  name: 'Jordan Hobbs',     email: 'j.hobbs@astoniafc.com',     phone: '+44 712 100 003', birthday: '07/11/1992', gender: 'Male',   height: '182 cm', weight: '82 kg', rfid: false, pin: false, dateAdded: '15 Mar 2024', status: 'inactive' },
  { id: 4,  name: 'Ryan Patel',       email: 'r.patel@astoniafc.com',     phone: '+44 712 100 004', birthday: '30/09/1997', gender: 'Male',   height: '176 cm', weight: '74 kg', rfid: true,  pin: false, dateAdded: '28 Apr 2024', status: 'active'   },
  { id: 5,  name: 'Kwame Asante',     email: 'k.asante@astoniafc.com',    phone: '+44 712 100 005', birthday: '12/04/1993', gender: 'Male',   height: '185 cm', weight: '84 kg', rfid: true,  pin: true,  dateAdded: '05 Jan 2024', status: 'active'   },
  { id: 6,  name: 'Sophie Clarke',    email: 's.clarke@astoniafc.com',    phone: '+44 712 100 006', birthday: '03/08/1998', gender: 'Female', height: '165 cm', weight: '60 kg', rfid: true,  pin: false, dateAdded: '20 Feb 2024', status: 'active'   },
  { id: 7,  name: 'Emma Davies',      email: 'e.davies@astoniafc.com',    phone: '+44 712 100 007', birthday: '19/12/1997', gender: 'Female', height: '162 cm', weight: '57 kg', rfid: false, pin: true,  dateAdded: '11 Mar 2024', status: 'active'   },
  { id: 8,  name: 'Priya Singh',      email: 'p.singh@astoniafc.com',     phone: '+44 712 100 008', birthday: '08/07/1994', gender: 'Female', height: '168 cm', weight: '63 kg', rfid: true,  pin: true,  dateAdded: '02 Apr 2024', status: 'active'   },
  { id: 9,  name: 'Chloe Brennan',    email: 'c.brennan@astoniafc.com',   phone: '+44 712 100 009', birthday: '25/01/1999', gender: 'Female', height: '170 cm', weight: '65 kg', rfid: false, pin: false, dateAdded: '17 May 2024', status: 'active'   },
  { id: 10, name: 'Nia Williams',     email: 'n.williams@astoniafc.com',  phone: '+44 712 100 010', birthday: '14/09/1996', gender: 'Female', height: '163 cm', weight: '58 kg', rfid: true,  pin: false, dateAdded: '29 Jun 2024', status: 'inactive' },
  { id: 11, name: 'Amara Diallo',     email: 'a.diallo@astoniafc.com',    phone: '+44 712 100 011', birthday: '31/05/2000', gender: 'Female', height: '167 cm', weight: '61 kg', rfid: true,  pin: true,  dateAdded: '08 Jul 2024', status: 'active'   },
  { id: 12, name: 'Layla Hassan',     email: 'l.hassan@astoniafc.com',    phone: '+44 712 100 012', birthday: '20/02/1995', gender: 'Female', height: '161 cm', weight: '55 kg', rfid: false, pin: false, dateAdded: '14 Aug 2024', status: 'active'   },

  // ── Arsenal FC (ids 19–31) ─────────────────────────────────────────────────
  { id: 19, name: 'Ben White',              email: 'b.white@arsenal.com',       phone: '+44 771 100 001', birthday: '08/10/1997', gender: 'Male', height: '186 cm', weight: '80 kg', rfid: true,  pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 20, name: 'Bukayo Saka',            email: 'b.saka@arsenal.com',        phone: '+44 771 100 002', birthday: '05/09/2001', gender: 'Male', height: '178 cm', weight: '73 kg', rfid: true,  pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 21, name: 'Martin Ødegaard',        email: 'm.odegaard@arsenal.com',    phone: '+47 912 345 678', birthday: '17/12/1998', gender: 'Male', height: '178 cm', weight: '68 kg', rfid: true,  pin: false, dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 22, name: 'Declan Rice',            email: 'd.rice@arsenal.com',        phone: '+44 771 100 004', birthday: '14/01/1999', gender: 'Male', height: '185 cm', weight: '83 kg', rfid: true,  pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 23, name: 'Gabriel Magalhães',      email: 'g.magalhaes@arsenal.com',   phone: '+55 11 91234 5678', birthday: '19/12/1997', gender: 'Male', height: '190 cm', weight: '84 kg', rfid: true,  pin: false, dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 24, name: 'William Saliba',         email: 'w.saliba@arsenal.com',      phone: '+33 6 12 34 56 78', birthday: '24/03/2001', gender: 'Male', height: '192 cm', weight: '85 kg', rfid: true,  pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 25, name: 'Kai Havertz',            email: 'k.havertz@arsenal.com',     phone: '+49 151 12345678',  birthday: '11/06/1999', gender: 'Male', height: '189 cm', weight: '83 kg', rfid: false, pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 26, name: 'Leandro Trossard',       email: 'l.trossard@arsenal.com',    phone: '+32 471 123 456',   birthday: '04/12/1994', gender: 'Male', height: '173 cm', weight: '68 kg', rfid: true,  pin: false, dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 27, name: 'Jurriën Timber',         email: 'j.timber@arsenal.com',      phone: '+31 6 12345678',    birthday: '17/06/2001', gender: 'Male', height: '180 cm', weight: '75 kg', rfid: true,  pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 28, name: 'Thomas Partey',          email: 't.partey@arsenal.com',      phone: '+233 24 123 4567',  birthday: '13/06/1993', gender: 'Male', height: '185 cm', weight: '77 kg', rfid: false, pin: false, dateAdded: '01 Sep 2024', status: 'inactive' },
  { id: 29, name: 'Gabriel Martinelli',     email: 'g.martinelli@arsenal.com',  phone: '+55 11 98765 4321', birthday: '18/06/2001', gender: 'Male', height: '181 cm', weight: '75 kg', rfid: true,  pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 30, name: 'Oleksandr Zinchenko',    email: 'o.zinchenko@arsenal.com',   phone: '+380 67 123 4567',  birthday: '15/12/1996', gender: 'Male', height: '175 cm', weight: '64 kg', rfid: true,  pin: false, dateAdded: '01 Sep 2024', status: 'active'   },
  { id: 31, name: 'David Raya',             email: 'd.raya@arsenal.com',        phone: '+34 655 100 031',   birthday: '15/09/1995', gender: 'Male', height: '183 cm', weight: '80 kg', rfid: true,  pin: true,  dateAdded: '01 Sep 2024', status: 'active'   },

  // ── Baskonia-Alavés Group (ids 32–52) ─────────────────────────────────────
  // Basketball A
  { id: 32, name: 'Aitor Etxeberria',  email: 'a.etxeberria@baskonia.com', phone: '+34 945 200 032', birthday: '10/03/1994', gender: 'Male',   height: '198 cm', weight: '95 kg', rfid: true,  pin: true,  dateAdded: '15 Jan 2024', status: 'active'   },
  { id: 33, name: 'Unai Aramburu',     email: 'u.aramburu@baskonia.com',   phone: '+34 945 200 033', birthday: '22/07/1996', gender: 'Male',   height: '192 cm', weight: '88 kg', rfid: true,  pin: false, dateAdded: '15 Jan 2024', status: 'active'   },
  { id: 34, name: 'Mikel Zubicaray',   email: 'm.zubicaray@baskonia.com',  phone: '+34 945 200 034', birthday: '05/11/1991', gender: 'Male',   height: '195 cm', weight: '90 kg', rfid: false, pin: true,  dateAdded: '15 Jan 2024', status: 'active'   },
  { id: 35, name: 'Jon Iturriaga',     email: 'j.iturriaga@baskonia.com',  phone: '+34 945 200 035', birthday: '18/04/1998', gender: 'Male',   height: '201 cm', weight: '98 kg', rfid: true,  pin: true,  dateAdded: '15 Jan 2024', status: 'active'   },
  { id: 36, name: 'Beñat Goikoetxea', email: 'b.goikoetxea@baskonia.com', phone: '+34 945 200 036', birthday: '30/01/1993', gender: 'Male',   height: '188 cm', weight: '85 kg', rfid: true,  pin: false, dateAdded: '15 Jan 2024', status: 'inactive' },
  // Basketball B
  { id: 37, name: 'Gorka Mendez',      email: 'g.mendez@baskonia.com',     phone: '+34 945 200 037', birthday: '14/09/1999', gender: 'Male',   height: '190 cm', weight: '87 kg', rfid: true,  pin: true,  dateAdded: '20 Jan 2024', status: 'active'   },
  { id: 38, name: 'Asier Urquiola',    email: 'a.urquiola@baskonia.com',   phone: '+34 945 200 038', birthday: '07/06/2000', gender: 'Male',   height: '193 cm', weight: '89 kg', rfid: false, pin: false, dateAdded: '20 Jan 2024', status: 'active'   },
  { id: 39, name: 'Iker Galdos',       email: 'i.galdos@baskonia.com',     phone: '+34 945 200 039', birthday: '25/12/1997', gender: 'Male',   height: '186 cm', weight: '82 kg', rfid: true,  pin: false, dateAdded: '20 Jan 2024', status: 'active'   },
  { id: 40, name: 'Xabier Intxausti',  email: 'x.intxausti@baskonia.com',  phone: '+34 945 200 040', birthday: '11/02/1995', gender: 'Male',   height: '196 cm', weight: '93 kg', rfid: true,  pin: true,  dateAdded: '20 Jan 2024', status: 'inactive' },
  // Football First
  { id: 41, name: 'Jon Aizpurua',      email: 'j.aizpurua@baskonia.com',   phone: '+34 945 200 041', birthday: '03/05/1996', gender: 'Male',   height: '180 cm', weight: '77 kg', rfid: true,  pin: true,  dateAdded: '01 Feb 2024', status: 'active'   },
  { id: 42, name: 'Ander Arrieta',     email: 'a.arrieta@baskonia.com',    phone: '+34 945 200 042', birthday: '19/08/1994', gender: 'Male',   height: '177 cm', weight: '73 kg', rfid: true,  pin: false, dateAdded: '01 Feb 2024', status: 'active'   },
  { id: 43, name: 'Ibai Larrañaga',    email: 'i.larranaga@baskonia.com',  phone: '+34 945 200 043', birthday: '28/10/1992', gender: 'Male',   height: '183 cm', weight: '79 kg', rfid: false, pin: false, dateAdded: '01 Feb 2024', status: 'active'   },
  { id: 44, name: 'Oier Sanjurjo',     email: 'o.sanjurjo@baskonia.com',   phone: '+34 945 200 044', birthday: '15/03/1993', gender: 'Male',   height: '179 cm', weight: '76 kg', rfid: true,  pin: true,  dateAdded: '01 Feb 2024', status: 'active'   },
  { id: 45, name: 'Gaizka Toquero',    email: 'g.toquero@baskonia.com',    phone: '+34 945 200 045', birthday: '06/07/1989', gender: 'Male',   height: '174 cm', weight: '70 kg', rfid: false, pin: true,  dateAdded: '01 Feb 2024', status: 'inactive' },
  // Strength & Conditioning
  { id: 46, name: 'Amaia Garmendia',   email: 'a.garmendia@baskonia.com',  phone: '+34 945 200 046', birthday: '12/01/1997', gender: 'Female', height: '169 cm', weight: '64 kg', rfid: true,  pin: false, dateAdded: '05 Feb 2024', status: 'active'   },
  { id: 47, name: 'Leire Aguirre',     email: 'l.aguirre@baskonia.com',    phone: '+34 945 200 047', birthday: '24/06/1995', gender: 'Female', height: '165 cm', weight: '60 kg', rfid: true,  pin: true,  dateAdded: '05 Feb 2024', status: 'active'   },
  { id: 48, name: 'Edurne Olaskoaga',  email: 'e.olaskoaga@baskonia.com',  phone: '+34 945 200 048', birthday: '09/11/1998', gender: 'Female', height: '172 cm', weight: '67 kg', rfid: false, pin: false, dateAdded: '05 Feb 2024', status: 'active'   },
  // Youth Squad
  { id: 49, name: 'Alaitz Azpeitia',   email: 'a.azpeitia@baskonia.com',   phone: '+34 945 200 049', birthday: '17/04/2003', gender: 'Female', height: '163 cm', weight: '56 kg', rfid: true,  pin: false, dateAdded: '10 Feb 2024', status: 'active'   },
  { id: 50, name: 'Maialen Kortabarria',email:'m.kortabarria@baskonia.com', phone: '+34 945 200 050', birthday: '29/08/2004', gender: 'Female', height: '160 cm', weight: '54 kg', rfid: true,  pin: true,  dateAdded: '10 Feb 2024', status: 'active'   },
  { id: 51, name: 'Nerea Altuna',       email: 'n.altuna@baskonia.com',     phone: '+34 945 200 051', birthday: '03/02/2003', gender: 'Female', height: '166 cm', weight: '58 kg', rfid: false, pin: false, dateAdded: '10 Feb 2024', status: 'active'   },
  { id: 52, name: 'Itziar Larrea',      email: 'i.larrea@baskonia.com',     phone: '+34 945 200 052', birthday: '21/11/2002', gender: 'Female', height: '168 cm', weight: '61 kg', rfid: true,  pin: true,  dateAdded: '10 Feb 2024', status: 'inactive' },

  // ── CAR Sant Cugat (ids 53–63) ─────────────────────────────────────────────
  // Atletisme
  { id: 53, name: 'Bernat Soler',      email: 'b.soler@carsantcugat.cat',  phone: '+34 93 100 0053', birthday: '14/05/1995', gender: 'Male',   height: '178 cm', weight: '68 kg', rfid: true,  pin: true,  dateAdded: '01 Mar 2024', status: 'active'   },
  { id: 54, name: 'Arnau Casanova',    email: 'a.casanova@carsantcugat.cat',phone: '+34 93 100 0054', birthday: '27/09/1997', gender: 'Male',   height: '182 cm', weight: '72 kg', rfid: true,  pin: false, dateAdded: '01 Mar 2024', status: 'active'   },
  { id: 55, name: 'Mireia Badia',      email: 'm.badia@carsantcugat.cat',  phone: '+34 93 100 0055', birthday: '08/02/1998', gender: 'Female', height: '164 cm', weight: '55 kg', rfid: false, pin: true,  dateAdded: '01 Mar 2024', status: 'active'   },
  { id: 56, name: 'Núria Segura',      email: 'n.segura@carsantcugat.cat', phone: '+34 93 100 0056', birthday: '19/07/1993', gender: 'Female', height: '167 cm', weight: '58 kg', rfid: true,  pin: false, dateAdded: '01 Mar 2024', status: 'inactive' },
  // Natació
  { id: 57, name: 'Oriol Figueras',    email: 'o.figueras@carsantcugat.cat',phone: '+34 93 100 0057', birthday: '31/12/1996', gender: 'Male',   height: '186 cm', weight: '80 kg', rfid: true,  pin: true,  dateAdded: '05 Mar 2024', status: 'active'   },
  { id: 58, name: 'Gemma Pla',         email: 'g.pla@carsantcugat.cat',    phone: '+34 93 100 0058', birthday: '13/04/1999', gender: 'Female', height: '170 cm', weight: '62 kg', rfid: true,  pin: false, dateAdded: '05 Mar 2024', status: 'active'   },
  { id: 59, name: 'Anna Nogués',       email: 'a.nogues@carsantcugat.cat', phone: '+34 93 100 0059', birthday: '06/10/2000', gender: 'Female', height: '172 cm', weight: '64 kg', rfid: false, pin: true,  dateAdded: '05 Mar 2024', status: 'active'   },
  // Ciclisme
  { id: 60, name: 'Pol Climent',       email: 'p.climent@carsantcugat.cat',phone: '+34 93 100 0060', birthday: '22/06/1994', gender: 'Male',   height: '175 cm', weight: '67 kg', rfid: true,  pin: false, dateAdded: '10 Mar 2024', status: 'active'   },
  { id: 61, name: 'Toni Viladomat',    email: 't.viladomat@carsantcugat.cat',phone:'+34 93 100 0061', birthday: '11/01/1991', gender: 'Male',  height: '179 cm', weight: '71 kg', rfid: true,  pin: true,  dateAdded: '10 Mar 2024', status: 'active'   },
  { id: 62, name: 'Gerard Camps',      email: 'g.camps@carsantcugat.cat',  phone: '+34 93 100 0062', birthday: '04/08/1992', gender: 'Male',   height: '177 cm', weight: '69 kg', rfid: false, pin: false, dateAdded: '10 Mar 2024', status: 'inactive' },
  { id: 63, name: 'Laia Bonell',       email: 'l.bonell@carsantcugat.cat', phone: '+34 93 100 0063', birthday: '16/03/1996', gender: 'Female', height: '162 cm', weight: '54 kg', rfid: true,  pin: true,  dateAdded: '10 Mar 2024', status: 'active'   },

  // ── CAR Sierra Nevada (ids 64–70) ──────────────────────────────────────────
  // Ski Team
  { id: 64, name: 'Alejandro Ruiz',    email: 'a.ruiz@carsnev.es',         phone: '+34 958 100 064', birthday: '05/01/1994', gender: 'Male',   height: '180 cm', weight: '76 kg', rfid: true,  pin: true,  dateAdded: '01 Oct 2023', status: 'active'   },
  { id: 65, name: 'Sergio Moreno',     email: 's.moreno@carsnev.es',       phone: '+34 958 100 065', birthday: '17/07/1996', gender: 'Male',   height: '177 cm', weight: '73 kg', rfid: true,  pin: false, dateAdded: '01 Oct 2023', status: 'active'   },
  { id: 66, name: 'Carmen Herrera',    email: 'c.herrera@carsnev.es',      phone: '+34 958 100 066', birthday: '29/03/1998', gender: 'Female', height: '166 cm', weight: '59 kg', rfid: false, pin: true,  dateAdded: '01 Oct 2023', status: 'active'   },
  { id: 67, name: 'Lucía Romero',      email: 'l.romero@carsnev.es',       phone: '+34 958 100 067', birthday: '12/11/1993', gender: 'Female', height: '163 cm', weight: '56 kg', rfid: true,  pin: false, dateAdded: '01 Oct 2023', status: 'inactive' },
  // Cross Team
  { id: 68, name: 'Pablo Jiménez',     email: 'p.jimenez@carsnev.es',      phone: '+34 958 100 068', birthday: '23/05/1995', gender: 'Male',   height: '174 cm', weight: '68 kg', rfid: true,  pin: true,  dateAdded: '05 Oct 2023', status: 'active'   },
  { id: 69, name: 'Adrián Navarro',    email: 'a.navarro@carsnev.es',      phone: '+34 958 100 069', birthday: '08/09/1997', gender: 'Male',   height: '171 cm', weight: '65 kg', rfid: false, pin: false, dateAdded: '05 Oct 2023', status: 'active'   },
  { id: 70, name: 'María Fernández',   email: 'm.fernandez@carsnev.es',    phone: '+34 958 100 070', birthday: '01/02/1999', gender: 'Female', height: '169 cm', weight: '62 kg', rfid: true,  pin: true,  dateAdded: '05 Oct 2023', status: 'active'   },

  // ── CEAR La Cartuja (ids 71–74) ────────────────────────────────────────────
  { id: 71, name: 'Antonio Vargas',    email: 'a.vargas@cearlacartuja.es', phone: '+34 954 100 071', birthday: '16/04/1992', gender: 'Male',   height: '183 cm', weight: '81 kg', rfid: true,  pin: false, dateAdded: '01 Nov 2023', status: 'inactive' },
  { id: 72, name: 'Rocío Delgado',     email: 'r.delgado@cearlacartuja.es',phone: '+34 954 100 072', birthday: '30/08/1995', gender: 'Female', height: '168 cm', weight: '62 kg', rfid: false, pin: true,  dateAdded: '01 Nov 2023', status: 'inactive' },
  { id: 73, name: 'Manuel Reyes',      email: 'm.reyes@cearlacartuja.es',  phone: '+34 954 100 073', birthday: '11/12/1990', gender: 'Male',   height: '178 cm', weight: '77 kg', rfid: true,  pin: true,  dateAdded: '01 Nov 2023', status: 'inactive' },
  { id: 74, name: 'Isabel Molina',     email: 'i.molina@cearlacartuja.es', phone: '+34 954 100 074', birthday: '24/06/1997', gender: 'Female', height: '165 cm', weight: '58 kg', rfid: true,  pin: false, dateAdded: '01 Nov 2023', status: 'inactive' },

  // ── CEM Joan Miró (ids 75–87) ──────────────────────────────────────────────
  // Equip Natació
  { id: 75, name: 'Luca Romano',       email: 'l.romano@cemjoanmiro.cat',  phone: '+34 93 200 0075', birthday: '07/03/1996', gender: 'Male',   height: '184 cm', weight: '79 kg', rfid: true,  pin: true,  dateAdded: '15 Sep 2023', status: 'active'   },
  { id: 76, name: 'Bruno Torres',      email: 'b.torres@cemjoanmiro.cat',  phone: '+34 93 200 0076', birthday: '19/09/1994', gender: 'Male',   height: '181 cm', weight: '76 kg', rfid: true,  pin: false, dateAdded: '15 Sep 2023', status: 'active'   },
  { id: 77, name: 'Valentina Cruz',    email: 'v.cruz@cemjoanmiro.cat',    phone: '+34 93 200 0077', birthday: '03/06/1998', gender: 'Female', height: '171 cm', weight: '63 kg', rfid: false, pin: true,  dateAdded: '15 Sep 2023', status: 'active'   },
  { id: 78, name: 'Sofia Martín',      email: 's.martin@cemjoanmiro.cat',  phone: '+34 93 200 0078', birthday: '28/01/1997', gender: 'Female', height: '167 cm', weight: '60 kg', rfid: true,  pin: false, dateAdded: '15 Sep 2023', status: 'inactive' },
  // Equip Fitness
  { id: 79, name: 'Diego Ramos',       email: 'd.ramos@cemjoanmiro.cat',   phone: '+34 93 200 0079', birthday: '15/11/1993', gender: 'Male',   height: '176 cm', weight: '74 kg', rfid: true,  pin: true,  dateAdded: '20 Sep 2023', status: 'active'   },
  { id: 80, name: 'Patricia Sanz',     email: 'p.sanz@cemjoanmiro.cat',    phone: '+34 93 200 0080', birthday: '22/04/1995', gender: 'Female', height: '164 cm', weight: '57 kg', rfid: true,  pin: false, dateAdded: '20 Sep 2023', status: 'active'   },
  { id: 81, name: 'Javier Morales',    email: 'j.morales@cemjoanmiro.cat', phone: '+34 93 200 0081', birthday: '09/07/1992', gender: 'Male',   height: '179 cm', weight: '78 kg', rfid: false, pin: false, dateAdded: '20 Sep 2023', status: 'active'   },
  // Equip Atletisme
  { id: 82, name: 'Alejandro Pérez',   email: 'al.perez@cemjoanmiro.cat',  phone: '+34 93 200 0082', birthday: '14/02/1997', gender: 'Male',   height: '175 cm', weight: '69 kg', rfid: true,  pin: true,  dateAdded: '25 Sep 2023', status: 'active'   },
  { id: 83, name: 'Claudia Vega',      email: 'c.vega@cemjoanmiro.cat',    phone: '+34 93 200 0083', birthday: '26/08/1999', gender: 'Female', height: '166 cm', weight: '58 kg', rfid: true,  pin: false, dateAdded: '25 Sep 2023', status: 'active'   },
  { id: 84, name: 'Roberto Aguilar',   email: 'r.aguilar@cemjoanmiro.cat', phone: '+34 93 200 0084', birthday: '31/10/1994', gender: 'Male',   height: '182 cm', weight: '77 kg', rfid: false, pin: true,  dateAdded: '25 Sep 2023', status: 'active'   },
  { id: 85, name: 'Raquel Ortega',     email: 'r.ortega@cemjoanmiro.cat',  phone: '+34 93 200 0085', birthday: '05/05/1996', gender: 'Female', height: '162 cm', weight: '55 kg', rfid: true,  pin: true,  dateAdded: '25 Sep 2023', status: 'inactive' },
  // Equip Multisport
  { id: 86, name: 'Nadia Castillo',    email: 'n.castillo@cemjoanmiro.cat',phone: '+34 93 200 0086', birthday: '18/12/1998', gender: 'Female', height: '169 cm', weight: '61 kg', rfid: true,  pin: false, dateAdded: '01 Oct 2023', status: 'active'   },
  { id: 87, name: 'Tomás Rubio',       email: 't.rubio@cemjoanmiro.cat',   phone: '+34 93 200 0087', birthday: '07/06/1991', gender: 'Male',   height: '177 cm', weight: '75 kg', rfid: false, pin: true,  dateAdded: '01 Oct 2023', status: 'active'   },

  // ── CNEA Font-Romeu (ids 88–90) ────────────────────────────────────────────
  { id: 88, name: 'Lucas Dupont',      email: 'l.dupont@cneafontromeu.fr', phone: '+33 4 68 100 088', birthday: '12/07/1995', gender: 'Male',   height: '178 cm', weight: '70 kg', rfid: true,  pin: true,  dateAdded: '01 Dec 2023', status: 'active' },
  { id: 89, name: 'Camille Martin',    email: 'c.martin@cneafontromeu.fr', phone: '+33 4 68 100 089', birthday: '25/02/1997', gender: 'Female', height: '166 cm', weight: '57 kg', rfid: true,  pin: false, dateAdded: '01 Dec 2023', status: 'active' },
  { id: 90, name: 'Antoine Bernard',   email: 'a.bernard@cneafontromeu.fr',phone: '+33 4 68 100 090', birthday: '08/10/1993', gender: 'Male',   height: '181 cm', weight: '74 kg', rfid: false, pin: true,  dateAdded: '01 Dec 2023', status: 'active' },

  // ── Dynatech (ids 91–94) ───────────────────────────────────────────────────
  { id: 91, name: 'Tobias Becker',     email: 't.becker@dynatech.io',      phone: '+49 30 100 0091', birthday: '03/04/1988', gender: 'Male',   height: '180 cm', weight: '78 kg', rfid: false, pin: false, dateAdded: '01 Jan 2023', status: 'inactive' },
  { id: 92, name: 'Julia Hoffmann',    email: 'j.hoffmann@dynatech.io',    phone: '+49 30 100 0092', birthday: '16/09/1991', gender: 'Female', height: '170 cm', weight: '64 kg', rfid: true,  pin: true,  dateAdded: '01 Jan 2023', status: 'inactive' },
  { id: 93, name: 'Stefan Koch',       email: 's.koch@dynatech.io',        phone: '+49 30 100 0093', birthday: '29/06/1986', gender: 'Male',   height: '185 cm', weight: '83 kg', rfid: true,  pin: false, dateAdded: '01 Jan 2023', status: 'inactive' },
  { id: 94, name: 'Anna Weber',        email: 'a.weber@dynatech.io',       phone: '+49 30 100 0094', birthday: '11/03/1994', gender: 'Female', height: '163 cm', weight: '56 kg', rfid: false, pin: true,  dateAdded: '01 Jan 2023', status: 'inactive' },

  // ── Professionals (ids 13–18, shared across orgs) ─────────────────────────
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
        contact: 'James Wright',
        email: 'training@arsenal.com', phone: '+44 1727 730 000', address: 'Shenley Road, London Colney, St. Albans AL2 1DR',
        contacts: [
          { name: 'James Wright', cargo: 'Director', email: 'j.wright@arsenal.com', phone: '+44 1727 730 001' },
          { name: 'Sarah Collins', cargo: 'Coordinator', email: 's.collins@arsenal.com', phone: '+44 1727 730 002' },
        ],
        admins: [
          { name: 'Michael Porter', email: 'm.porter@arsenal.com', phone: '+44 1727 730 010' },
        ],
        teams: [
          {
            id: 2011, name: 'Arsenal First Team', status: 'active',
            professionalIds: [13],
            email: 'squad@arsenal.com', phone: '+44 1727 730 001', address: 'Shenley Road, London Colney, St. Albans AL2 1DR',
            users: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
          },
        ],
        units: [
          { id: 2001, description: 'Urinal 1 — Main Entrance',  status: 'active',   display: { id: 760101, status: 'active' },   kpod: { id: 2801, status: 'active' } },
          { id: 2002, description: 'Urinal 2 — Locker Room A',  status: 'active',   display: { id: 760102, status: 'active' },   kpod: { id: 2802, status: 'needs-replacement' } },
          { id: 2003, description: 'Urinal 3 — Locker Room B',  status: 'inactive', display: { id: 760103, status: 'inactive' }, kpod: { id: 2803, status: 'active' } },
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
        contact: 'Robert Keane',
        email: 'training@astoniafc.com', phone: '+44 121 554 1235', address: '100 Trinity Rd, Birmingham',
        teams: [
          { id: 3011, name: 'First Team', status: 'active', professionalIds: [13, 15], email: 'firstteam@astoniafc.com', phone: '+44 121 554 1236', address: '100 Trinity Rd, Birmingham', users: [1, 2, 3, 4, 5] },
          { id: 3012, name: 'Academy',    status: 'active', professionalIds: [17],     email: 'academy@astoniafc.com',   phone: '+44 121 554 1237', address: '100 Trinity Rd, Birmingham', users: [6, 7, 8] },
        ],
        units: [
          { id: 3001, description: 'Urinal 1 — Main Entrance',  status: 'active',   display: { id: 767401, status: 'active' },   kpod: { id: 2941, status: 'active' } },
          { id: 3002, description: 'Urinal 2 — Locker Room A',  status: 'active',   display: { id: 767402, status: 'active' },   kpod: { id: 2942, status: 'needs-replacement' } },
          { id: 3003, description: 'Urinal 3 — Locker Room B',  status: 'inactive', display: { id: 767403, status: 'inactive' }, kpod: { id: 2943, status: 'active' } },
        ],
      },
      {
        id: 302, name: 'City Campus', status: 'active',
        contact: 'Sarah Connelly',
        email: 'campus@astoniafc.com', phone: '+44 121 554 2000', address: '45 Broad St, Birmingham B1 2HP',
        teams: [
          { id: 3021, name: 'Women\'s Team', status: 'active', professionalIds: [18], email: 'womens@astoniafc.com', phone: '+44 121 554 2001', address: '45 Broad St, Birmingham', users: [9, 10, 11, 12] },
        ],
        units: [
          { id: 3021, description: 'Urinal 1 — Gym Floor',    status: 'active', display: { id: 767501, status: 'active' }, kpod: { id: 2951, status: 'active' } },
          { id: 3022, description: 'Urinal 2 — Changing Room', status: 'active', display: { id: 767502, status: 'active' }, kpod: { id: 2952, status: 'active' } },
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
        contact: 'Joseba Txapartegi',
        email: 'buesa@baskonia.com', phone: '+34 945 123 457', address: 'Portal de Gamarra, 65, Vitoria-Gasteiz',
        teams: [
          { id: 4011, name: 'Basketball A', status: 'active', professionalIds: [14, 16], email: 'bball@baskonia.com', phone: '+34 945 123 458', address: 'Portal de Gamarra, 65', users: [32, 33, 34, 35, 36] },
          { id: 4012, name: 'Basketball B', status: 'active', professionalIds: [17],     email: 'bballb@baskonia.com', phone: '+34 945 123 459', address: 'Portal de Gamarra, 65', users: [37, 38, 39, 40] },
        ],
      },
      {
        id: 402, name: 'Mendizorroza', status: 'active',
        contact: 'Ander Arrizabalaga',
        email: 'mendizorroza@baskonia.com', phone: '+34 945 234 567', address: 'C/ Olaguíbel, 3, Vitoria-Gasteiz',
        teams: [
          { id: 4021, name: 'Football First', status: 'active', professionalIds: [13, 15], email: 'football@baskonia.com', phone: '+34 945 234 568', address: 'C/ Olaguíbel, 3', users: [41, 42, 43, 44, 45] },
        ],
      },
      {
        id: 403, name: 'Centro Fitness Norte', status: 'active',
        email: 'fitness@baskonia.com', phone: '+34 945 345 678', address: 'Av. Gasteiz, 45, Vitoria-Gasteiz',
        teams: [
          { id: 4031, name: 'Strength & Cond.', status: 'active', professionalIds: [18], email: 'sc@baskonia.com', phone: '+34 945 345 679', address: 'Av. Gasteiz, 45', users: [46, 47, 48] },
        ],
      },
      {
        id: 404, name: 'Alavés Youth Academy', status: 'inactive',
        email: 'youth@baskonia.com', phone: '+34 945 456 789', address: 'C/ Florida, 12, Vitoria-Gasteiz',
        teams: [
          { id: 4041, name: 'Youth Squad', status: 'inactive', professionalIds: [14], email: 'youth1@baskonia.com', phone: '+34 945 456 790', address: 'C/ Florida, 12', users: [49, 50, 51, 52] },
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
          { id: 5011, name: 'Atletisme', status: 'active', professionalIds: [15, 16], email: 'atletisme@carsantcugat.cat', phone: '+34 93 589 23 02', address: 'C/ de Vallparadís, 8', users: [53, 54, 55, 56] },
          { id: 5012, name: 'Natació',   status: 'active', professionalIds: [17],     email: 'natacio@carsantcugat.cat',   phone: '+34 93 589 23 03', address: 'C/ de Vallparadís, 8', users: [57, 58, 59] },
        ],
      },
      {
        id: 502, name: 'Pista Exterior', status: 'active',
        email: 'exterior@carsantcugat.cat', phone: '+34 93 589 24 00', address: 'Av. dels Brugarols, 1, Sant Cugat',
        teams: [
          { id: 5021, name: 'Ciclisme', status: 'active', professionalIds: [13], email: 'ciclisme@carsantcugat.cat', phone: '+34 93 589 24 01', address: 'Av. dels Brugarols, 1', users: [60, 61, 62, 63] },
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
          { id: 6011, name: 'Ski Team',    status: 'active', professionalIds: [14, 18], email: 'ski@carsnev.es',    phone: '+34 958 480 063', address: 'Ctra. Sierra Nevada, km 31', users: [64, 65, 66, 67] },
          { id: 6012, name: 'Cross Team',  status: 'active', professionalIds: [15],     email: 'cross@carsnev.es',  phone: '+34 958 480 064', address: 'Ctra. Sierra Nevada, km 31', users: [68, 69, 70] },
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
          { id: 7011, name: 'Rowing Team', status: 'inactive', professionalIds: [16], email: 'rowing@cearlacartuja.es', phone: '+34 954 467 702', address: 'Isla de la Cartuja, s/n', users: [71, 72, 73, 74] },
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
        contact: 'Marta Gil',
        email: 'centre@cemjoanmiro.cat', phone: '+34 93 425 00 01', address: 'Carrer del Consell de Cent, 54, Barcelona',
        teams: [
          { id: 8011, name: 'Equip Natació',  status: 'active', professionalIds: [13, 17], email: 'natacio@cemjoanmiro.cat',  phone: '+34 93 425 00 02', address: 'Consell de Cent, 54, Barcelona', users: [75, 76, 77, 78] },
          { id: 8012, name: 'Equip Fitness',  status: 'active', professionalIds: [18],     email: 'fitness@cemjoanmiro.cat',  phone: '+34 93 425 00 03', address: 'Consell de Cent, 54, Barcelona', users: [79, 80, 81] },
        ],
      },
      {
        id: 802, name: 'Nou Barris', status: 'active',
        contact: 'Ferran Puigdomènech',
        email: 'noubarris@cemjoanmiro.cat', phone: '+34 93 425 10 00', address: 'Passeig de Valldaura, 277, Barcelona',
        teams: [
          { id: 8021, name: 'Equip Atletisme',  status: 'active',   professionalIds: [14, 15], email: 'atletisme@cemjoanmiro.cat',  phone: '+34 93 425 10 01', address: 'Passeig de Valldaura, 277', users: [82, 83, 84, 85] },
          { id: 8022, name: 'Equip Multisport', status: 'inactive', professionalIds: [16],     email: 'multisport@cemjoanmiro.cat', phone: '+34 93 425 10 02', address: 'Passeig de Valldaura, 277', users: [86, 87] },
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
          { id: 9011, name: 'Altitude Training', status: 'active', professionalIds: [13, 17], email: 'altitude@cneafontromeu.fr', phone: '+33 4 68 30 04 95', address: 'Rue des Pyrénées, 2', users: [88, 89, 90] },
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
          { id: 10011, name: 'R&D Team', status: 'inactive', professionalIds: [18], email: 'rd@dynatech.io', phone: '+49 30 12345 680', address: 'Unter den Linden, 10', users: [91, 92, 93, 94] },
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
