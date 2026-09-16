// Mock data para el flujo end user — nombres tomados de las capturas del flujo actual.
export const TEAMS = [
  { id: 'atletico-a',  name: 'Atletico A'  },
  { id: 'barca-b',     name: 'Barça B'     },
  { id: 'cycling-pro', name: 'Cycling Pro' },
  { id: 'delta-squad', name: 'Delta Squad' },
  { id: 'eagles-fc',   name: 'Eagles FC'   },
  { id: 'falcons',     name: 'Falcons'     },
  { id: 'grizzlies',   name: 'Grizzlies'   },
  { id: 'hawks',       name: 'Hawks'       },
];

// "Pablo Martinez" usa iniciales "PS" (no "PM") — así aparece en la captura original,
// se replica tal cual para el audit, no se corrige acá.
export const AVATARS = [
  { id: 'david-mella',     name: 'David Mella',     photo: 'https://i.pravatar.cc/300?img=12' },
  { id: 'pablo-vazquez',   name: 'Pablo Vázquez',   photo: 'https://i.pravatar.cc/300?img=13' },
  { id: 'lucas-perez-1',   name: 'Lucas Pérez',     photo: 'https://i.pravatar.cc/300?img=14' },
  { id: 'german-parreno',  name: 'Germán Parreño',  photo: 'https://i.pravatar.cc/300?img=15' },
  { id: 'salva-sevilla',   name: 'Salva Sevilla',   photo: 'https://i.pravatar.cc/300?img=17' },
  { id: 'pablo-martinez',  name: 'Pablo Martinez',  photo: null, initials: 'PS' },
  { id: 'pablo-valcarce',  name: 'Pablo Valcarce',  photo: 'https://i.pravatar.cc/300?img=18' },
  { id: 'jose-angel',      name: 'Jose Ángel',      photo: 'https://i.pravatar.cc/300?img=33' },
  { id: 'lucas-perez-2',   name: 'Lucas Pérez',     photo: 'https://i.pravatar.cc/300?img=52' },
  { id: 'pablo-torres',    name: 'Pablo Torres',    photo: 'https://i.pravatar.cc/300?img=53' },
];

export function initialsFor(name) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}
