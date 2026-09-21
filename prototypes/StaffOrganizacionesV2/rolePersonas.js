import { ORGS } from '../StaffOrganizaciones/mockData';

// Org/centro/equipo de referencia para los roles de cliente — reutiliza mock data
// ya existente (Astonia FC) en vez de inventar ids nuevos.
const ORG_ID     = 3;   // Astonia FC
const CENTER_IDS = [301, 302]; // Training Ground, City Campus
const TEAM_IDS   = [3011, 3012, 3021]; // First Team + Academy (Training Ground), Women's Team (City Campus)

function findOrg(id) {
  return ORGS.find(o => o.id === id);
}
function findCenter(org, id) {
  return org?.centers.find(c => c.id === id);
}

export const ROLES = {
  owner:       { key: 'owner',       label: 'Kamleon Owner',  entry: 'org-list' },
  admin:       { key: 'admin',       label: 'Kamleon Admin',  entry: 'org-list' },
  editor:      { key: 'editor',      label: 'Kamleon Editor', entry: 'org-list' },
  orgAdmin:    { key: 'orgAdmin',    label: 'Org Admin',      entry: 'own-org' },
  centerAdmin: { key: 'centerAdmin', label: 'Center Admin',   entry: 'own-center' },
  teamAdmin:   { key: 'teamAdmin',   label: 'Team Admin',     entry: 'own-teams' },
  endUser:     { key: 'endUser',     label: 'End User',       entry: 'personal' },
};

export const ROLE_ORDER = ['owner', 'admin', 'editor', 'orgAdmin', 'centerAdmin', 'teamAdmin', 'endUser'];

// Nav items del sidebar que cada rol NO ve (ids reales de NAV_SECTIONS: center/units/hydration/usage).
export const HIDDEN_NAV_ITEMS = {
  teamAdmin: new Set(['units', 'usage']),
  // Org Admin ya puede ver todas las units de su org desde el tab "Units" en el header de
  // la organización (mismo contenido) — el ítem del sidebar quedaba redundante con Center control.
  orgAdmin: new Set(['units']),
  // Mismo criterio para Center Admin: ve las units de su centro en el tab "Units" del centro.
  // Además la vista global muestra columnas Display/Sensor que no le corresponden
  // (`units.viewColumn.display` y `.sensor` son de Editor y staff, docs/permissions.md).
  centerAdmin: new Set(['units']),
};

// pendingInvites: invitaciones que ESTE usuario tiene pendientes de aceptar (ej. lo invitaron
// como admin de otra organización) — no confundir con las invitaciones que él mismo mandó a otros.
// Mock por ahora; el badge del sidebar solo se muestra cuando el número es > 0.
const PERSONAS = {
  owner:       { initials: 'KO', name: 'Kamleon', surname: 'Owner',   email: 'owner@kamleon.io',         role: 'Kamleon Owner',  pendingInvites: 0 },
  admin:       { initials: 'DV', name: 'Daniel',  surname: 'Vanegas', email: 'daniel.vanegas@dna.inc',   role: 'Kamleon Admin',  pendingInvites: 0 },
  editor:      { initials: 'KE', name: 'Kamleon', surname: 'Editor',  email: 'editor@kamleon.io',        role: 'Kamleon Editor', pendingInvites: 0 },
  orgAdmin:    { initials: 'JH', name: 'Jordan',  surname: 'Hobbs',   email: 'j.hobbs@astoniafc.com',    role: 'Org Admin',    orgId: ORG_ID,                       pendingInvites: 0 },
  centerAdmin: { initials: 'CR', name: 'Casey',   surname: 'Reeve',   email: 'c.reeve@astoniafc.com',    role: 'Center Admin', orgId: ORG_ID, centerIds: CENTER_IDS },
  teamAdmin:   { initials: 'SA', name: 'Sam',     surname: 'Alcaraz', email: 's.alcaraz@astoniafc.com',  role: 'Team Admin',   orgId: ORG_ID, teamIds: TEAM_IDS,    pendingInvites: 0 },
  endUser:     { initials: 'AR', name: 'Alex',    surname: 'Rivera',  email: 'a.rivera@astoniafc.com',   role: 'End User',                                          pendingInvites: 0 },
};

// Invitaciones que ESTA persona tiene pendientes de aceptar. Una sola fuente: de acá sale
// el número del badge del sidebar y el contenido del drawer de notificaciones — antes el
// badge decía 2 y el drawer enseñaba cuatro cosas distintas.
export const PENDING_INVITES = {
  centerAdmin: [
    { id: 'inv-ca-1', initials: 'XB', name: 'Xavier B.', action: 'has invited you to become an admin of', target: 'City Campus.', group: 'Today',      unread: true },
    { id: 'inv-ca-2', initials: 'XB', name: 'Xavier B.', action: 'has invited you to become member of',   target: 'Team Alpha.',  group: '2 days ago', unread: true },
  ],
};

export function getPendingInvites(roleKey) {
  return PENDING_INVITES[roleKey] ?? [];
}

export function getRolePersona(roleKey) {
  return PERSONAS[roleKey] ?? PERSONAS.admin;
}

// Segunda línea del tooltip de la tarjeta de usuario del sidebar (rol + a qué está
// scopeado) — se muestra completa ahí porque en la tarjeta se corta con ellipsis.
export function getRolePersonaScope(roleKey) {
  const persona = getRolePersona(roleKey);
  // Owner/Admin/Editor son staff de Kamleon sin org/centro específico — acceso global.
  if (roleKey === 'owner' || roleKey === 'admin' || roleKey === 'editor') return 'All organizations';
  if (roleKey === 'orgAdmin') return findOrg(persona.orgId)?.name;
  if (roleKey === 'centerAdmin') return getAssignedCenters(roleKey)[0]?.name;
  if (roleKey === 'teamAdmin') {
    const assigned = getAssignedTeams(roleKey);
    if (assigned.length === 0) return undefined;
    const count = assigned.length;
    const teamsLabel = `${count} ${count === 1 ? 'team' : 'teams'}`;
    // Nombrar un solo centro cuando en realidad tiene equipos en varios sería engañoso
    // (sugeriría que ese es "el" centro) — en ese caso mostramos la cantidad en vez de elegir uno.
    const centerIds = new Set(assigned.map(a => a.center?.id));
    if (centerIds.size === 1) {
      return `${teamsLabel} · ${assigned[0].center?.name}`;
    }
    return `${teamsLabel} · ${centerIds.size} centers`;
  }
  return undefined;
}

export function getAssignedCenters(roleKey) {
  const persona = getRolePersona(roleKey);
  if (!persona.centerIds) return [];
  const org = findOrg(persona.orgId);
  return persona.centerIds.map(id => findCenter(org, id)).filter(Boolean);
}

// Devuelve [{ team, center }] — un Team Admin puede estar asignado a equipos de distintos centros.
export function getAssignedTeams(roleKey) {
  const persona = getRolePersona(roleKey);
  if (!persona.teamIds) return [];
  const org = findOrg(persona.orgId);
  const result = [];
  for (const center of org?.centers ?? []) {
    for (const team of center.teams ?? []) {
      if (persona.teamIds.includes(team.id)) result.push({ team, center });
    }
  }
  return result;
}

// Arma el navStack inicial para un rol — reutiliza las pantallas existentes
// (org-detail, center-admin-detail, team-admin-home) en vez de crear pantallas nuevas.
export function getEntryStack(roleKey) {
  const persona = getRolePersona(roleKey);
  const entry = ROLES[roleKey]?.entry ?? 'org-list';

  if (entry === 'own-org') {
    const org = findOrg(persona.orgId);
    if (org) return [{ screen: 'org-detail', key: org.id, params: { org } }];
  }

  if (entry === 'own-center') {
    return [{ screen: 'center-admin-detail', key: 'ca', params: {} }];
  }

  if (entry === 'own-teams') {
    return [{ screen: 'team-admin-home', key: 'ta', params: {} }];
  }

  // 'org-list' y 'personal' usan el default (lista de orgs / placeholder de cuenta personal).
  return [{ screen: 'orgs' }];
}
