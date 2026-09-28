import { useState, useMemo, useRef, useEffect, useLayoutEffect, Fragment } from 'react';
import Tag from '../../../design-system/components/Tag/Tag';
import TabBar from '../../../design-system/components/TabBar/TabBar';
import SearchBar from '../../../design-system/components/SearchBar/SearchBar';
import { IconEdit, IconPlus, IconTrash, IconSettings, IconFilter, IconSort, IconPower, IconEye, IconEyeClosed, IconClose, IconResend, IconInfoCircle, IconMore, IconChevronMiniRight } from '../../../design-system/icons/outline';
import Button from '../../../design-system/components/Button/Button';
import Input from '../../../design-system/components/Input/Input';
import { IconUserFilled, IconMailFilled, IconPhoneFilled, IconLocationFilled } from '../../../design-system/icons/filled';
import { getUserCountForCenter, getProfessionalCountForCenter, getActiveTeamCount, getUserCountForOrg, USERS_POOL } from '../../StaffOrganizaciones/mockData';
import ContextMenu      from '../../../design-system/components/ContextMenu/ContextMenu';
import ToolbarButton    from '../../../design-system/components/ToolbarButton/ToolbarButton';
import EditOrgDrawer    from '../../StaffOrganizaciones/screens/EditOrgDrawer';
import AddOrgAdminDrawer from '../../StaffOrganizaciones/screens/AddOrgAdminDrawer';
import InviteCenterAdminDrawer from '../../StaffOrganizaciones/screens/InviteCenterAdminDrawer';
import InviteTeamAdminDrawer from '../../StaffOrganizaciones/screens/InviteTeamAdminDrawer';
import DeleteOrgModal   from '../../StaffOrganizaciones/screens/DeleteOrgModal';
import Toast            from '../../../design-system/components/Toast/Toast';
import IconButton       from '../../../design-system/components/IconButton/IconButton';
import EditCenterDrawer from '../../StaffOrganizaciones/screens/EditCenterDrawer';
import EditTeamDrawer   from '../../StaffOrganizaciones/screens/EditTeamDrawer';
import NewCenterDrawer  from '../../StaffOrganizaciones/screens/NewCenterDrawer';
import NewTeamDrawer    from '../../StaffOrganizaciones/screens/NewTeamDrawer';
import NewUserDrawer    from '../../StaffOrganizaciones/screens/NewUserDrawer';
import EditUserDrawer   from '../../StaffOrganizaciones/screens/EditUserDrawer';
import EditUnitDrawer   from './EditUnitDrawer';
import GlobalUnitsTab   from './UnitsTab';
import InvitationsTable from './InvitationsTable';
import EmailHistoryDrawer from './EmailHistoryDrawer';
import TruncatedText from './TruncatedText';
import styles from './OrgDetailV2.module.css';
import dstyles from '../../StaffOrganizaciones/screens/DeleteOrgModal.module.css';

function pluralize(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

const SENT_DATE_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// Formato "DD/Mon/YY" (ej. "13/Aug/26") — usado en las columnas Sent/joined de
// invitaciones y administradores (Org/Center/Team), en vez de tiempo relativo.
function formatSentDate(date = new Date()) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = SENT_DATE_MONTHS[date.getMonth()];
  const y = String(date.getFullYear()).slice(-2);
  return `${d}/${m}/${y}`;
}

// ─── Icons ───────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 2v2M11 2v2M2 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconGender() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="9.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 6V2M6 4l2-2 2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconHeight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M5 4.5l3-2.5 3 2.5M5 11.5l3 2.5 3-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconWeight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 13h9l-1.5-7h-6L3.5 13z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="8" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconRfid() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2.5 8c0-3.04 2.46-5.5 5.5-5.5S13.5 4.96 13.5 8 11.04 13.5 8 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4.5 8c0-1.93 1.57-3.5 3.5-3.5S11.5 6.07 11.5 8s-1.57 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="8" r="1.25" fill="currentColor" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7.5" width="10" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 7.5V5.5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="10.5" r="1" fill="currentColor" />
    </svg>
  );
}

// ─── Empty state ──────────────────────────────────────────

function EmptyState({ title, subtitle, action }) {
  return (
    <div className={styles.emptyFill}>
      <div className={styles.emptyState}>
        <div className={styles.emptyCircle} />
        <div className={styles.emptyText}>
          <p className={styles.emptyTitle}>{title}</p>
          <p className={styles.emptySubtitle}>{subtitle}</p>
        </div>
        {action}
      </div>
    </div>
  );
}

// ─── Inner empty state ────────────────────────────────────

function InnerEmptyState({ title, subtitle }) {
  return (
    <div className={styles.innerEmpty}>
      <div className={styles.emptyCircle} />
      <div className={styles.emptyText}>
        <p className={styles.emptyTitle}>{title}</p>
        <p className={styles.emptySubtitle}>{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Centers master-detail ────────────────────────────────

function CentersContent({ org, initialCenter, initialTeam, initialUser, isMobile = false, canCreateCenter = true, role, onSaveCenterAdminInvite, currentUserEmail }) {
  const centers = org.centers;
  const [showNewCenter, setShowNewCenter]           = useState(false);
  const [selectedId, setSelectedId]                 = useState(isMobile ? (initialCenter?.id ?? null) : (initialCenter?.id ?? centers[0]?.id ?? null));
  const [selectedTeam, setSelectedTeam]             = useState(initialTeam ?? null);
  const [selectedTeamCenter, setSelectedTeamCenter] = useState(initialTeam ? initialCenter : null);
  const [selectedUser, setSelectedUser]             = useState(initialUser ?? null);
  const [selectedUserTeam, setSelectedUserTeam]     = useState(null); // set when navigating from Users tab
  const [editCenterTarget, setEditCenterTarget]     = useState(null);
  const [editTeamTarget, setEditTeamTarget]         = useState(null);
  const [teamPatches, setTeamPatches]               = useState({});  // { [teamId]: patch }
  const [teamSaveToast, setTeamSaveToast]           = useState(false);
  const [newTeamCenter, setNewTeamCenter]           = useState(null);
  const [newUserContext, setNewUserContext]          = useState(null); // { center, team? }
  const [inviteCenterAdminFor, setInviteCenterAdminFor] = useState(null); // center — Org Admin invitando desde dentro de un centro
  // Tab del centro al que se vuelve tras entrar a un equipo/unit/usuario: se fija al entrar
  // (teams/units/users) y NO se resetea al volver, si no el back siempre caía en Details.
  const [returnTab, setReturnTab]                   = useState('details');
  // Quitar a alguien de un equipo se puede hacer desde su perfil, que vive un nivel por encima
  // de la tabla de miembros: se guardan acá los ids quitados y la tabla los filtra.
  const [removedMemberIds, setRemovedMemberIds]     = useState(() => new Set());
  // Equipos borrados: la lista vive en el tab y el borrado se puede lanzar desde el panel del
  // equipo (un nivel más abajo), así que el estado se guarda acá y el tab los filtra.
  const [deletedTeamIds, setDeletedTeamIds]         = useState(() => new Set());
  const [teamDeleteToast, setTeamDeleteToast]       = useState(null);
  const [deleteTeamTarget, setDeleteTeamTarget]     = useState(null);
  const [centerSearch, setCenterSearch]             = useState('');

  // ── Mobile slide state ──
  const [detailVisible,  setDetailVisible]  = useState(!!initialCenter);
  const [subSlideDir,    setSubSlideDir]    = useState('forward'); // 'forward' | 'back'

  const filteredCenters = centerSearch.trim()
    ? centers.filter(c => c.name.toLowerCase().includes(centerSearch.trim().toLowerCase()))
    : centers;

  const selected = centers.find(c => c.id === selectedId) ?? null;

  function handleSelectCenter(id) {
    setSelectedId(id);
    setSelectedTeam(null);
    setSelectedTeamCenter(null);
    setSelectedUser(null);
    setSelectedUserTeam(null);
    setReturnTab('details');
    setSubSlideDir('none'); // cambiar de centro es el mismo nivel: fade, sin desplazamiento
    if (isMobile) setDetailVisible(true);
  }

  function handleBackToCenters() {
    setDetailVisible(false);
    setSelectedTeam(null);
    setSelectedUser(null);
    setSelectedUserTeam(null);
  }

  function handleSaveTeam(teamId, patch) {
    setTeamPatches(prev => ({ ...prev, [teamId]: { ...(prev[teamId] ?? {}), ...patch } }));
    if (selectedTeam?.id === teamId) {
      setSelectedTeam(prev => ({ ...prev, ...patch }));
    }
    setTeamSaveToast(true);
  }

  // Clave para animar sub-niveles al cambiar de vista dentro del detailPanel
  const subKey = selectedUser?.id
    ? `user-${selectedUser.id}`
      : selectedTeam?.id
        ? `team-${selectedTeam.id}`
        : `center-${selectedId}`;

  // Mobile: slide completo (la pantalla entera se reemplaza). Desktop: desplazamiento corto
  // y direccional al bajar/subir de nivel, y fade a secas al cambiar de centro (mismo nivel).
  const subSlideClass = isMobile
    ? (subSlideDir === 'back' ? styles.detailSlideBack : styles.detailSlideIn)
    : subSlideDir === 'forward' ? styles.subFadeIn
    : subSlideDir === 'back'    ? styles.subFadeBack
    : styles.subFade;

  return (
    <>
      <div className={styles.masterDetail}>

        {/* ── Left: center list ── */}
        <div className={`${styles.listPanel} ${isMobile && detailVisible ? styles.listPanelHidden : ''}`} data-tour-id="centers-list">
          <div className={styles.listPanelTop}>
            <div className={styles.listPanelHeader}>
              <span className={styles.listPanelLabel}>Centers</span>
              {canCreateCenter && (
                <button
                  className={`${styles.listPanelAddBtn} ${styles.listPanelAddBtnTooltip}`}
                  data-tooltip="New Center"
                  aria-label="New Center"
                  onClick={() => setShowNewCenter(true)}
                >
                  <IconPlus size={16} />
                </button>
              )}
            </div>
            {centers.length > 0 && (
              <SearchBar
                placeholder="Search..."
                value={centerSearch}
                onChange={e => setCenterSearch(e.target.value)}
                onClear={() => setCenterSearch('')}
              />
            )}
          </div>
          <div className={styles.listItems}>
            {centers.length === 0 ? (
              <div className={styles.listEmpty}>
                <span className={styles.listEmptyText}>No centers yet</span>
              </div>
            ) : (
              filteredCenters.map(center => (
                <button
                  key={center.id}
                  className={`${styles.listItem} ${selectedId === center.id ? styles.listItemSelected : ''}`}
                  onClick={() => handleSelectCenter(center.id)}
                >
                  <div className={styles.listItemAvatar}>{center.name.charAt(0)}</div>
                  <div className={styles.listItemMeta}>
                    <span className={styles.listItemName}>{center.name}</span>
                    {role === 'orgAdmin' ? (
                      // Org Admin administra varios centros a la vez — comparar escala (units/users)
                      // ayuda más a escanear la lista que un status casi siempre igual (Active).
                      // El status sigue viendo en el detalle, que es el único lugar donde no se repite.
                      <span className={styles.listItemStatus}>
                        {pluralize(center.units?.length ?? 0, 'unit')} · {pluralize(getUserCountForCenter(center), 'user')}
                      </span>
                    ) : role === 'centerAdmin' ? (
                      // Mismo criterio que Org Admin: el status no lo controla y no es
                      // autoexplicativo para un rol cliente — mejor mostrar escala (teams/units).
                      <span className={styles.listItemStatus}>
                        {pluralize(getActiveTeamCount(center), 'team')} · {pluralize(center.units?.length ?? 0, 'unit')}
                      </span>
                    ) : (
                      <div className={styles.listItemStatusRow}>
                        <div className={`${styles.listItemDot} ${styles[center.status]}`} />
                        <span className={styles.listItemStatus}>
                          {center.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Right: user / team / center detail ── */}
        <div className={`${styles.detailPanel} ${!isMobile || detailVisible ? styles.detailPanelVisible : ''}`}>

          {/* Back button — solo en mobile, context-aware */}
          {isMobile && (
            <button
              className={styles.mobilePanelBack}
              onClick={selectedUser
                ? () => { setSubSlideDir('back'); setSelectedUser(null); setSelectedUserTeam(null); }
                : selectedTeam
                    ? () => { setSubSlideDir('back'); setSelectedTeam(null); setSelectedUser(null); setSelectedUserTeam(null); }
                    : handleBackToCenters
              }
            >
              <span className={styles.mobilePanelBackIcon}><ArrowLeftIcon size={16} /></span>
              <span>
                {selectedUser
                  ? `Back to ${(selectedTeam ?? selectedUserTeam)?.name ?? 'Team'}`
                  : selectedTeam
                      ? 'Back to Teams'
                      : 'Centers'
                }
              </span>
            </button>
          )}

          <div key={subKey} className={subSlideClass} style={{ flex: 1, overflow: 'hidden', overflowY: (selectedTeam && !selectedUser) ? 'auto' : 'hidden', display: 'flex', flexDirection: 'column' }}>
          {selectedUser ? (
            <UserCard
              user={selectedUser}
              team={selectedTeam ?? selectedUserTeam}
              backLabel={selectedTeam ? selectedTeam.name : selected?.name}
              onBack={() => { setSubSlideDir('back'); setSelectedUser(null); setSelectedUserTeam(null); }}
              isMobile={isMobile}
              role={role}
              onRemoveFromTeam={member => setRemovedMemberIds(prev => new Set(prev).add(member.id))}
            />

          ) : selectedTeam ? (
            <TeamCard
              team={selectedTeam}
              center={selectedTeamCenter}
              org={org}
              onBack={() => { setSubSlideDir('back'); setSelectedTeam(null); setSelectedUser(null); setSelectedUserTeam(null); }}
              onSelectUser={(user) => { setSubSlideDir('forward'); setSelectedUser(user); }}
              removedMemberIds={removedMemberIds}
              onDelete={() => setDeleteTeamTarget({ team: selectedTeam, center: selectedTeamCenter })}
              onNewUser={() => setNewUserContext({ center: selectedTeamCenter, team: selectedTeam })}
              onEdit={() => setEditTeamTarget({ team: selectedTeam, center: selectedTeamCenter })}
              isMobile={isMobile}
              role={role}
            />
          ) : selected ? (
            <CenterCard
              key={selected.id}
              center={selected}
              org={org}
              onEdit={() => setEditCenterTarget(selected)}
              onDelete={() => setSelected(null)}
              onNewTeam={() => setNewTeamCenter(selected)}
              onNewUser={() => setNewUserContext({ center: selected })}
              onInviteCenterAdmin={() => setInviteCenterAdminFor(selected)}
              currentUserEmail={currentUserEmail}
              onEditTeam={(team) => setEditTeamTarget({ team, center: selected })}
              onDeleteTeam={(team) => setDeleteTeamTarget({ team, center: selected })}
              deletedTeamIds={deletedTeamIds}
              onNewUserForTeam={(team) => setNewUserContext({ center: selected, team })}
              initialTab={returnTab}
              onSelectTeam={(team) => {
                setSubSlideDir('forward');
                setSelectedTeam(team);
                setSelectedTeamCenter(selected);
                setReturnTab('teams');
              }}
              onSelectUser={(user, team) => {
                setSubSlideDir('forward');
                setSelectedUser(user);
                setSelectedUserTeam(team);
                setReturnTab('users');
              }}
              role={role}
            />
          ) : centers.length === 0 ? (
            <EmptyState
              title="No centers yet"
              subtitle="Create the first center for this organization."
              action={
                canCreateCenter ? (
                  <Button
                    variant="primary"
                    size="s"
                    leftIcon={<IconPlus size={16} />}
                    onClick={() => setShowNewCenter(true)}
                  >
                    New center
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className={styles.detailEmpty}>
              <span className={styles.detailEmptyText}>Select a center to view its details</span>
            </div>
          )}
          </div>
        </div>

      </div>

      {showNewCenter    && <NewCenterDrawer org={org} onClose={() => setShowNewCenter(false)} />}
      {editCenterTarget && <EditCenterDrawer center={editCenterTarget} org={org} onClose={() => setEditCenterTarget(null)} role={role} />}
      {editTeamTarget   && <EditTeamDrawer team={editTeamTarget.team} center={editTeamTarget.center} onClose={() => setEditTeamTarget(null)} onSave={(patch) => handleSaveTeam(editTeamTarget.team.id, patch)} role={role} />}
      {teamSaveToast && (
        <Toast
          mode="success"
          message="Changes saved"
          onClose={() => setTeamSaveToast(false)}
        />
      )}
      {deleteTeamTarget && (
        <DeleteOrgModal
          org={deleteTeamTarget.team}
          label="team"
          requireTyping
          onClose={() => setDeleteTeamTarget(null)}
          onConfirm={() => {
            setDeletedTeamIds(prev => new Set(prev).add(deleteTeamTarget.team.id));
            setTeamDeleteToast(`${deleteTeamTarget.team.name} deleted`);
            // Si estabas dentro del equipo que acabas de borrar, vuelves a la lista.
            if (selectedTeam?.id === deleteTeamTarget.team.id) {
              setSubSlideDir('back');
              setSelectedTeam(null);
            }
          }}
        />
      )}
      {teamDeleteToast && (
        <Toast mode="success" message={teamDeleteToast} onClose={() => setTeamDeleteToast(null)} />
      )}
      {newTeamCenter    && <NewTeamDrawer center={newTeamCenter} onClose={() => setNewTeamCenter(null)} />}
      {newUserContext   && (
        <NewUserDrawer
          center={newUserContext.center}
          team={newUserContext.team}
          teams={newUserContext.center?.teams ?? []}
          onClose={() => setNewUserContext(null)}
        />
      )}
      {inviteCenterAdminFor && (
        <InviteCenterAdminDrawer
          org={org}
          presetCenter={inviteCenterAdminFor}
          onClose={() => setInviteCenterAdminFor(null)}
          onSave={onSaveCenterAdminInvite}
        />
      )}
    </>
  );
}

// ─── Org-level tabs ──────────────────────────────────────

const ORG_TABS = [
  { id: 'centers', label: 'Centers' },
  { id: 'users',   label: 'Users'   },
  { id: 'details', label: 'Details' },
];

// ─── Org users tab ────────────────────────────────────────

const ORG_PAGE_SIZE = 15;

function OrgUsersTab({ org, role }) {
  const [search, setSearch]         = useState('');
  const [filters, setFilters]       = useState({ role: new Set(), status: new Set(), center: new Set() });
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage]             = useState(1);
  const [selectedUser, setSelectedUser]   = useState(null);
  const [selectedUserMeta, setSelectedUserMeta] = useState(null);
  const filterRef = useRef(null);

  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

  // Una fila por PERSONA, no por pertenencia: si alguien está en tres equipos
  // no debe aparecer tres veces. Cada entrada se lleva todas sus pertenencias,
  // porque el equipo, el centro y el estado son de la pertenencia y no de la
  // persona — alguien puede estar activo en un equipo y de baja en otro.
  const allUsers = useMemo(() => {
    const map = new Map();
    (org.centers ?? []).forEach(center => {
      (center.teams ?? []).forEach(team => {
        const userIds   = new Set(team.users ?? []);
        const profIds   = new Set(team.professionalIds ?? []);
        const inactivos = new Set(team.inactiveUsers ?? []);
        USERS_POOL.forEach(u => {
          if (!userIds.has(u.id)) return;
          const entrada = map.get(u.id) ?? { user: u, memberships: [] };
          entrada.memberships.push({
            center, team,
            role:   profIds.has(u.id) ? 'Team admin' : 'User',
            status: inactivos.has(u.id) ? 'inactive' : u.status,
          });
          map.set(u.id, entrada);
        });
      });
    });
    return Array.from(map.values());
  }, [org]);

  // Cuando las pertenencias no coinciden no se puede mostrar una sola: "Mixed"
  // dice que hay varias sin dar por buena ninguna. Es neutro a propósito —
  // estar inactivo en un equipo puede ser lo correcto, no un problema.
  const estadoDe = ms => {
    const s = new Set(ms.map(m => m.status));
    return s.size === 1 ? [...s][0] : 'mixed';
  };
  const [expandidos, setExpandidos] = useState(() => new Set());
  const alternar = id => setExpandidos(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  const centerOptions = useMemo(
    () => (org.centers ?? []).map(c => ({ v: String(c.id), label: c.name })),
    [org]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allUsers.filter(({ user, memberships }) => {
      const roles    = new Set(memberships.map(m => m.role));
      const estados  = new Set(memberships.map(m => m.status));
      const centros  = new Set(memberships.map(m => m.center.id));
      if (filters.role.size   > 0 && ![...filters.role].some(r => roles.has(r)))       return false;
      if (filters.status.size > 0 && ![...filters.status].some(e => estados.has(e)))   return false;
      if (filters.center.size > 0 && ![...centros].some(c => filters.center.has(String(c)))) return false;
      if (q && !user.name.toLowerCase().includes(q) && !user.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allUsers, search, filters]);

  const activeFilterCount = filters.role.size + filters.status.size + filters.center.size;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ORG_PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * ORG_PAGE_SIZE, safePage * ORG_PAGE_SIZE);

  function handleSearch(val) { setSearch(val); setPage(1); }

  function toggleFilter(group, value) {
    setFilters(prev => {
      const next = new Set(prev[group]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [group]: next };
    });
    setPage(1);
  }

  function clearFilters() { setFilters({ role: new Set(), status: new Set(), center: new Set() }); setPage(1); }

  if (selectedUser) {
    return (
      <UserCard
        user={selectedUser}
        team={selectedUserMeta?.team}
        backLabel="Users"
        onBack={() => { setSelectedUser(null); setSelectedUserMeta(null); }}
        role={role}
      />
    );
  }

  if (allUsers.length === 0) {
    return (
      <InnerEmptyState
        title="No users yet..."
        subtitle="Add teams with users to the centers of this organization"
      />
    );
  }

  return (
    <div className={styles.orgUsersTab}>

      <div className={styles.orgUsersHeading}>
        <h1 className={styles.pageTitle}>Users</h1>
        <p className={styles.pageDescription}>All users across every center in this organization.</p>
      </div>

      <div className={styles.teamToolbar}>
        <SearchBar
          className={styles.orgUsersSearch}
          placeholder="Search by name or email..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          onClear={() => handleSearch('')}
        />
        <div className={styles.filterWrap} ref={filterRef}>
          <ToolbarButton
            icon={<IconFilter size={16} />}
            selected={activeFilterCount > 0}
            onClick={() => setFilterOpen(v => !v)}
          >
            Filters
            {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
          </ToolbarButton>
          {filterOpen && (
            <div className={styles.filterDropdown}>
              <div className={styles.filterSection}>
                <p className={styles.filterSectionLabel}>Role</p>
                {[{ v: 'Team admin', label: 'Team admin' }, { v: 'User', label: 'User' }].map(({ v, label }) => (
                  <label key={v} className={`${styles.filterOption} ${filters.role.has(v) ? styles.filterOptionChecked : ''}`}>
                    <input type="checkbox" className={styles.nativeCheck} checked={filters.role.has(v)} onChange={() => toggleFilter('role', v)} />
                    <span className={styles.checkBox}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className={styles.checkMark} aria-hidden="true">
                        <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className={styles.optionLabel}>{label}</span>
                  </label>
                ))}
              </div>
              <div className={styles.filterSection}>
                <p className={styles.filterSectionLabel}>Status</p>
                {[{ v: 'active', label: 'Active' }, { v: 'inactive', label: 'Inactive' }].map(({ v, label }) => (
                  <label key={v} className={`${styles.filterOption} ${filters.status.has(v) ? styles.filterOptionChecked : ''}`}>
                    <input type="checkbox" className={styles.nativeCheck} checked={filters.status.has(v)} onChange={() => toggleFilter('status', v)} />
                    <span className={styles.checkBox}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className={styles.checkMark} aria-hidden="true">
                        <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className={styles.optionLabel}>{label}</span>
                  </label>
                ))}
              </div>
              <div className={styles.filterSection}>
                <p className={styles.filterSectionLabel}>Center</p>
                {centerOptions.map(({ v, label }) => (
                  <label key={v} className={`${styles.filterOption} ${filters.center.has(v) ? styles.filterOptionChecked : ''}`}>
                    <input type="checkbox" className={styles.nativeCheck} checked={filters.center.has(v)} onChange={() => toggleFilter('center', v)} />
                    <span className={styles.checkBox}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className={styles.checkMark} aria-hidden="true">
                        <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className={styles.optionLabel}>{label}</span>
                  </label>
                ))}
              </div>
              {activeFilterCount > 0 && (
                <button className={styles.clearFilters} onClick={clearFilters}>Clear filters</button>
              )}
            </div>
          )}
        </div>
      </div>

      {pageItems.length > 0 ? (
        <div className={styles.teamTable}>
          <div className={styles.teamTableHead}>
            <span className={`${styles.teamCol} ${styles.teamColName}`}>Name</span>
            <span className={`${styles.teamCol} ${styles.orgColCenter}`}>Center</span>
            <span className={`${styles.teamCol} ${styles.teamColTeam}`}>Team</span>
            <span className={`${styles.teamCol} ${styles.teamColStatus}`}>Status</span>
            <span className={`${styles.teamCol} ${styles.teamColSpacer}`} />
            <span className={`${styles.teamCol} ${styles.teamColActions}`} />
          </div>
          {pageItems.map(({ user, memberships }) => {
            const varias   = memberships.length > 1;
            const abierta  = expandidos.has(user.id);
            const centros  = new Set(memberships.map(m => m.center.id));
            const primera  = memberships[0];
            return (
              <Fragment key={user.id}>
                <div
                  className={`${styles.teamTableRow} ${abierta ? styles.rowExpanded : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    // Con varias pertenencias el clic despliega: entrar al perfil
                    // sin saber cuál se eligió sería adivinar por el usuario.
                    if (varias) { alternar(user.id); return; }
                    setSelectedUser(user);
                    setSelectedUserMeta({ center: primera.center, team: primera.team });
                  }}
                  onKeyDown={e => {
                    if (e.key !== 'Enter' && e.key !== ' ') return;
                    if (varias) { alternar(user.id); return; }
                    setSelectedUser(user);
                    setSelectedUserMeta({ center: primera.center, team: primera.team });
                  }}
                >
                  <div className={`${styles.teamCol} ${styles.teamColName}`}>
                    {varias ? (
                      <button
                        type="button"
                        className={`${styles.rowChevron} ${abierta ? styles.rowChevronOpen : ''}`}
                        onClick={e => { e.stopPropagation(); alternar(user.id); }}
                        aria-label={abierta ? 'Colapsar' : 'Expandir'}
                        aria-expanded={abierta}
                      >
                        <IconChevronMiniRight size={24} />
                      </button>
                    ) : <span className={styles.rowChevronSpacer} />}
                    <div className={styles.memberAvatar}>{user.name.charAt(0)}</div>
                    <div className={styles.memberMeta}>
                      <span className={styles.memberName}>{user.name}</span>
                      <span className={styles.memberSub}>{user.email}</span>
                    </div>
                  </div>
                  <div className={`${styles.teamCol} ${styles.orgColCenter}`}>
                    {varias
                      ? <span className={styles.groupSummary}>{centros.size} {centros.size === 1 ? 'center' : 'centers'}</span>
                      : <span className={styles.teamNamePill}>{primera.center.name}</span>}
                  </div>
                  <div className={`${styles.teamCol} ${styles.teamColTeam}`}>
                    {varias
                      ? <span className={styles.groupSummary}>{memberships.length} teams</span>
                      : <span className={styles.teamNamePill}>{primera.team.name}</span>}
                  </div>
                  <div className={`${styles.teamCol} ${styles.teamColStatus}`}>
                    <Tag status={estadoDe(memberships)} />
                  </div>
                  <div className={`${styles.teamCol} ${styles.teamColSpacer}`} />
                  <div className={`${styles.teamCol} ${styles.teamColActions}`} onClick={e => e.stopPropagation()}>
                    <IconButton aria-label="More options" tooltip="More">
                      <IconMore size={16} />
                    </IconButton>
                  </div>
                </div>

                {varias && abierta && (
                  <div className={styles.membershipRows}>
                  {memberships.map(m => (
                  <div
                    key={`${user.id}-${m.team.id}`}
                    className={`${styles.teamTableRow} ${styles.membershipRow}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => { setSelectedUser(user); setSelectedUserMeta({ center: m.center, team: m.team }); }}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setSelectedUser(user); setSelectedUserMeta({ center: m.center, team: m.team }); } }}
                  >
                    <div className={`${styles.teamCol} ${styles.teamColName}`}>
                      <span className={styles.membershipGuide} aria-hidden="true" />
                    </div>
                    <div className={`${styles.teamCol} ${styles.orgColCenter}`}>
                      <span className={styles.teamNamePill}>{m.center.name}</span>
                    </div>
                    <div className={`${styles.teamCol} ${styles.teamColTeam}`}>
                      <span className={styles.teamNamePill}>{m.team.name}</span>
                    </div>
                    <div className={`${styles.teamCol} ${styles.teamColStatus}`}>
                      <Tag status={m.status} />
                    </div>
                    <div className={`${styles.teamCol} ${styles.teamColSpacer}`} />
                    <div className={`${styles.teamCol} ${styles.teamColActions}`} onClick={e => e.stopPropagation()}>
                      <IconButton aria-label="More options" tooltip="More">
                        <IconMore size={16} />
                      </IconButton>
                    </div>
                  </div>
                  ))}
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      ) : (
        <InnerEmptyState
          title="No results"
          subtitle={search ? `No users match "${search}"` : 'No users match the selected filters'}
        />
      )}

      {filtered.length > ORG_PAGE_SIZE && (
        <div className={styles.teamPagination}>
          <span className={styles.paginationInfo}>
            Showing <strong>{(safePage - 1) * ORG_PAGE_SIZE + 1}–{Math.min(safePage * ORG_PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong> users
          </span>
          <div className={styles.paginationBtns}>
            <button className={styles.paginationBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>Previous</button>
            <button className={styles.paginationBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>Next</button>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── Inner tabs ───────────────────────────────────────────

const CENTER_TABS = [
  { id: 'details', label: 'Details' },
  { id: 'teams',   label: 'Teams'   },
  { id: 'users',   label: 'Users'   },
  { id: 'units',   label: 'Units'   },
];

// ─── Teams tab ────────────────────────────────────────────

// El estado de un equipo (activo/inactivo) lo administra Kamleon: para los roles de cliente
// no aporta nada saber si un equipo está inactivo, así que ni la columna ni su filtro se les
// muestran (decisión de Daniel, 23/9). Sin filtros que ofrecer, el botón "Filters" tampoco
// aparece: abriría un desplegable vacío.
function TeamsTab({ center, onSelectTeam, onEditTeam, onNewUserForTeam, onDeleteTeam, canManageTeams = true, deletedTeamIds, role }) {
  const showStatus = role !== 'orgAdmin' && role !== 'centerAdmin';
  const [search, setSearch]         = useState('');
  const [filters, setFilters]       = useState({ status: new Set() });
  const [filterOpen, setFilterOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const filterRef = useRef(null);
  const menuRefs  = useRef({});

  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

  useEffect(() => {
    if (!openMenuId) return;
    function handleClick(e) {
      const ref = menuRefs.current[openMenuId];
      if (ref && !ref.contains(e.target)) setOpenMenuId(null);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenuId]);

  function toggleFilter(group, value) {
    setFilters(prev => {
      const next = new Set(prev[group]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [group]: next };
    });
  }

  function clearFilters() { setFilters({ status: new Set() }); }

  const activeFilterCount = filters.status.size;

  const allTeams = (center.teams ?? []).filter(t => !deletedTeamIds?.has(t.id));
  const teams = allTeams.filter(t => {
    if (filters.status.size > 0 && !filters.status.has(t.status)) return false;
    if (search.trim() && !t.name.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  if (allTeams.length === 0) {
    return (
      <InnerEmptyState
        title="No teams yet..."
        subtitle="Teams for this center will appear here"
      />
    );
  }

  return (
    <div className={styles.teamsTab}>

      <div className={styles.teamToolbar}>
        <SearchBar
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
        {showStatus && (
        <div className={styles.filterWrap} ref={filterRef}>
          <ToolbarButton
            icon={<IconFilter size={16} />}
            selected={activeFilterCount > 0}
            onClick={() => setFilterOpen(v => !v)}
          >
            Filters
            {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
          </ToolbarButton>
          {filterOpen && (
            <div className={styles.filterDropdown}>
              <div className={styles.filterSection}>
                <p className={styles.filterSectionLabel}>Status</p>
                {[{ v: 'active', label: 'Active' }, { v: 'inactive', label: 'Inactive' }].map(({ v, label }) => (
                  <label key={v} className={`${styles.filterOption} ${filters.status.has(v) ? styles.filterOptionChecked : ''}`}>
                    <input type="checkbox" className={styles.nativeCheck} checked={filters.status.has(v)} onChange={() => toggleFilter('status', v)} />
                    <span className={styles.checkBox}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className={styles.checkMark} aria-hidden="true">
                        <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className={styles.optionLabel}>{label}</span>
                  </label>
                ))}
              </div>
              {activeFilterCount > 0 && (
                <button className={styles.clearFilters} onClick={clearFilters}>Clear filters</button>
              )}
            </div>
          )}
        </div>
        )}
      </div>

      {teams.length > 0 ? (
        <div className={styles.teamTable}>
          <div className={styles.teamTableHead}>
            <span className={`${styles.teamCol} ${styles.teamColName}`}>Team Name</span>
            {showStatus && <span className={`${styles.teamCol} ${styles.teamColStatus}`}>Status</span>}
            <span className={`${styles.teamCol} ${styles.teamColActions}`} />
          </div>
          {teams.map(team => {
            const userCount = (team.users ?? []).length;
            const profCount = (team.professionalIds ?? []).length;
            const isOpen = openMenuId === team.id;
            return (
              <div
                key={team.id}
                className={`${styles.teamTableRow} ${isOpen ? styles.menuOpen : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => onSelectTeam(team)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelectTeam(team); }}
              >
                <div className={`${styles.teamCol} ${styles.teamColName}`}>
                  <div className={styles.memberAvatar}>{team.name.charAt(0)}</div>
                  <div className={styles.memberMeta}>
                    <span className={styles.memberName}>{team.name}</span>
                    <span className={styles.memberSub}>
                      {userCount} {userCount === 1 ? 'user' : 'users'} · {profCount} {profCount === 1 ? 'team admin' : 'team admins'}
                    </span>
                  </div>
                </div>
                {showStatus && (
                  <div className={`${styles.teamCol} ${styles.teamColStatus}`}>
                    <Tag status={team.status} />
                  </div>
                )}
                <div
                  className={`${styles.teamCol} ${styles.teamColActions}`}
                  ref={el => { menuRefs.current[team.id] = el; }}
                  onClick={e => e.stopPropagation()}
                >
                  {canManageTeams && (
                    <div className={styles.teamRowMenuAnchor}>
                      <span className={isOpen ? styles.createTriggerHidden : ''}>
  <IconButton
                          aria-label="Team options"
                          tooltip="More"
                          onClick={() => setOpenMenuId(isOpen ? null : team.id)}
                        >
                          <IconMore size={16} />
                        </IconButton>
                      </span>
                      {isOpen && (
                        <div className={styles.teamRowMenu}>
                          <ContextMenu
                            items={[
                              { label: 'Edit Team',   icon: <IconEdit  size={16} />, onClick: () => { setOpenMenuId(null); onEditTeam(team); } },
                              { label: 'New User',    icon: <IconPlus  size={16} />, onClick: () => { setOpenMenuId(null); onNewUserForTeam(team); } },
                              { label: 'Delete Team', icon: <IconTrash size={16} />, variant: 'danger', onClick: () => { setOpenMenuId(null); onDeleteTeam?.(team); } },
                            ]}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <InnerEmptyState
          title="No results"
          subtitle={`No teams match "${search}"`}
        />
      )}

    </div>
  );
}

// ─── Details tab ─────────────────────────────────────────

function DetailsTab({ center, org, onTabChange }) {
  const teams = getActiveTeamCount(center);
  const users = getUserCountForCenter(center);
  const teamAdmins = getProfessionalCountForCenter(center);
  const units = center.units?.length ?? 0;

  // Figma 13023:127858: los stats arriba (sin título), después "Center details" (datos del
  // centro + su admin) y "Staff directory" (las personas de contacto que se cargan al crear
  // o editar el centro, cada una con su cargo como subtítulo).
  const admins = center.admins ?? [];
  const contacts = center.contacts ?? [];
  const hasCenterInfo = center.email || center.phone || center.address;

  function PersonRows({ name, email, phone }) {
    return (
      <div className={styles.infoList}>
        {name && <div className={styles.infoRow}><IconUserFilled size={14} /><span>{name}</span></div>}
        {email && <div className={styles.infoRow}><IconMailFilled size={14} /><span>{email}</span></div>}
        {phone && <div className={styles.infoRow}><IconPhoneFilled size={14} /><span>{phone}</span></div>}
      </div>
    );
  }

  return (
    <div className={styles.detailsTab}>

      <div className={styles.detailsSection}>
        <h3 className={styles.peopleSectionTitle}>Overview</h3>
        <div className={styles.statsGrid}>
        <div className={styles.statBlock}>
          <span className={styles.statNum}>{teams}</span>
          <span className={styles.statName}>Teams</span>
        </div>
        <div className={styles.statBlock}>
          <span className={styles.statNum}>{units}</span>
          <span className={styles.statName}>Units</span>
        </div>
        <div className={styles.statBlock}>
          <span className={styles.statNum}>{users}</span>
          <span className={styles.statName}>Users</span>
        </div>
        <div className={styles.statBlock}>
          <span className={styles.statNum}>{teamAdmins}</span>
          <span className={styles.statName}>{teamAdmins === 1 ? 'Team admin' : 'Team admins'}</span>
        </div>
        </div>
      </div>

      {(hasCenterInfo || admins.length > 0) && (
        <div className={styles.detailsSection}>
          <h3 className={styles.peopleSectionTitle}>Center details</h3>
          <div className={styles.peopleList}>

            {hasCenterInfo && (
              <div className={`${styles.personEntry} ${admins.length === 0 ? styles.personEntryLast : ''}`}>
                <span className={styles.contactEntryTitle}>Center info</span>
                <div className={styles.infoList}>
                  {center.email && <div className={styles.infoRow}><IconMailFilled size={14} /><span>{center.email}</span></div>}
                  {center.phone && <div className={styles.infoRow}><IconPhoneFilled size={14} /><span>{center.phone}</span></div>}
                  {center.address && <div className={styles.infoRow}><IconLocationFilled size={14} /><span>{center.address}</span></div>}
                </div>
              </div>
            )}

            {admins.length > 0 && (
              // Un solo bloque para todos los admins del centro: la etiqueta nombra la
              // categoría, no a cada persona. Repetirla por admin se lee como un error.
              <div className={`${styles.personEntry} ${styles.personEntryLast}`}>
                <span className={styles.contactEntryTitle}>{admins.length === 1 ? 'Center admin' : 'Center admins'}</span>
                <div className={styles.peopleGroup}>
                  {admins.map((a, i) => (
                    <PersonRows key={`admin-${i}`} name={a.name} email={a.email} phone={a.phone} />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {contacts.length > 0 && (
        <div className={styles.detailsSection}>
          <h3 className={styles.peopleSectionTitle}>Staff directory</h3>
          <div className={styles.peopleList}>
            {contacts.map((c, i) => (
              <div key={`contact-${i}`} className={`${styles.personEntry} ${i === contacts.length - 1 ? styles.personEntryLast : ''}`}>
                <span className={styles.contactEntryTitle}>{c.cargo}</span>
                <PersonRows name={c.name} email={c.email} phone={c.phone} />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// ─── Org-level details tab ─────────────────────────────────

function OrgDetailsTab({ org }) {
  const centers = org.centers?.length ?? 0;
  const teams   = (org.centers ?? []).reduce((sum, c) => sum + (c.teams?.length ?? 0), 0);
  const units   = (org.centers ?? []).reduce((sum, c) => sum + (c.units?.length ?? 0), 0);
  const users   = getUserCountForOrg(org);

  return (
    <div className={styles.detailsTab}>

      <div className={styles.detailsSection}>
        <h3 className={styles.peopleSectionTitle}>Overview</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statBlock}>
            <span className={styles.statNum}>{centers}</span>
            <span className={styles.statName}>Centers</span>
          </div>
          <div className={styles.statBlock}>
            <span className={styles.statNum}>{teams}</span>
            <span className={styles.statName}>Teams</span>
          </div>
          <div className={styles.statBlock}>
            <span className={styles.statNum}>{users}</span>
            <span className={styles.statName}>Users</span>
          </div>
          <div className={styles.statBlock}>
            <span className={styles.statNum}>{units}</span>
            <span className={styles.statName}>Units</span>
          </div>
        </div>
      </div>

      {(() => {
        const people = (org.admins ?? []).map(a => ({ role: a.role ?? 'Org Admin', name: a.name, email: a.email, phone: a.phone }));
        const hasOrgInfo = org.email || org.phone || org.fiscal;
        if (!hasOrgInfo && people.length === 0) return null;
        return (
          <div className={styles.detailsSection}>
            <h3 className={styles.peopleSectionTitle}>Contact</h3>
            <div className={styles.peopleList}>

              {hasOrgInfo && (
                <div className={`${styles.personEntry} ${people.length === 0 ? styles.personEntryLast : ''}`}>
                  <span className={styles.contactEntryTitle}>Organization info</span>
                  <div className={styles.infoList}>
                    {org.contact && <div className={styles.infoRow}><IconUserFilled size={14} /><span>{org.contact}</span></div>}
                    {org.email   && <div className={styles.infoRow}><IconMailFilled size={14} /><span>{org.email}</span></div>}
                    {org.phone   && <div className={styles.infoRow}><IconPhoneFilled size={14} /><span>{org.phone}</span></div>}
                    {org.fiscal  && <div className={styles.infoRow}><IconLocationFilled size={14} /><span>{org.fiscal}</span></div>}
                  </div>
                </div>
              )}

              {people.map((p, i) => (
                <div key={i} className={`${styles.personEntry} ${i === people.length - 1 ? styles.personEntryLast : ''}`}>
                  <span className={styles.contactEntryTitle}>{p.role}</span>
                  <div className={styles.infoList}>
                    <div className={styles.infoRow}><IconUserFilled size={14} /><span>{p.name}</span></div>
                    <div className={styles.infoRow}><IconMailFilled size={14} /><span>{p.email}</span></div>
                    {p.phone && <div className={styles.infoRow}><IconPhoneFilled size={14} /><span>{p.phone}</span></div>}
                  </div>
                </div>
              ))}

            </div>
          </div>
        );
      })()}

    </div>
  );
}

// ─── Org-level invitations tab ─────────────────────────────

function RemoveAdminModal({ row, onClose, onConfirm }) {
  const [confirmText, setConfirmText] = useState('');
  const canConfirm = confirmText.trim() === 'DELETE';

  return (
    <div className={dstyles.overlay} onMouseDown={onClose}>
      <div className={dstyles.modal} onMouseDown={e => e.stopPropagation()}>
        <div className={dstyles.content}>
          <h2 className={dstyles.title}>Remove administrator</h2>
          <p className={dstyles.body}>
            Are you sure you want to remove <strong className={dstyles.orgName}>{row.name ?? row.email}</strong> as {row.type}?
            They'll lose access to manage {row.type === 'Org Admin' ? 'this organization' : row.scope} immediately.
          </p>
        </div>
        <div className={dstyles.confirmField}>
          <label className={dstyles.confirmLabel} htmlFor="removeAdminConfirm">Write DELETE to confirm</label>
          <input
            id="removeAdminConfirm"
            className={dstyles.confirmInput}
            type="text"
            placeholder="Write here"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className={dstyles.actions}>
          <button className={dstyles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={dstyles.deleteBtn} disabled={!canConfirm} onClick={() => { onConfirm?.(); onClose(); }}>Remove</button>
        </div>
      </div>
    </div>
  );
}

// Una fila de la tabla de Admins no es un usuario completo: lleva email, nombre y poco más.
// Si esa persona existe en el pool se abre su ficha real; si no (un admin invitado que aún no
// tiene datos personales), se arma lo mínimo y el perfil muestra "—" en lo que falte.
function adminRowToUser(row) {
  const known = USERS_POOL.find(u => u.email === row.email);
  if (known) return known;
  return { id: row.key, name: row.name ?? row.email, email: row.email, status: 'active' };
}

function OrgInvitationsTab({ pendingInvites, setPendingInvites, centerAdminInvites, setCenterAdminInvites, orgAdmins, setOrgAdmins, currentUserEmail, role }) {
  const [profileUser, setProfileUser] = useState(null);
  // Owner/Admin tienen bypass total; Org Admin puede quitar Org Admins
  // (`organizations.admins.remove`) y Center Admins (`centers.admins.remove`), pero NO
  // Team Admins: no tiene ningún permiso `teams.*` (docs/permissions.md).
  const hasBypass = role === 'owner' || role === 'admin';
  // `users.editData`: Center Admin y Team Admin (y Owner/Admin por bypass) — Org Admin no.
  const canEditUsers = hasBypass;
  const [editUserRow, setEditUserRow] = useState(null);
  // Email history (y la incidencia de envío): feature del programador, solo Kamleon staff.
  const canViewEmailHistory = hasBypass;
  const [emailHistoryRow, setEmailHistoryRow] = useState(null);
  function canRemoveRow(admin) {
    if (hasBypass) return true;
    return (admin.role ?? 'Organization Admin') !== 'Team admin';
  }

  const [inviteToast, setInviteToast] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

  const rows = [
    // Center/Team van con guion cuando no aplican (Figma 12818:85146): un Organization Admin
    // no pertenece a ningún centro ni equipo, y a este nivel no se invita a Team Admins.
    ...pendingInvites.map((invite, i) => ({
      key: `org-${i}`, kind: 'org', index: i,
      email: invite.email, type: 'Organization Admin', scope: '-', team: '-', status: 'pending',
      sentAgo: invite.sentAgo ?? '—', sentMinutesAgo: invite.sentMinutesAgo ?? 0,
      deliveryIssue: invite.deliveryIssue ?? null,
    })),
    ...centerAdminInvites.map(invite => ({
      key: `center-${invite.key}`, kind: 'center', centerKey: invite.key,
      email: invite.email, type: 'Center admin', scope: invite.centerName, team: '-', status: 'pending',
      sentAgo: invite.sentAgo ?? '—', sentMinutesAgo: invite.sentMinutesAgo ?? 0,
    })),
    ...orgAdmins.map(admin => ({
      key: `active-org-${admin.key}`, kind: 'activeOrgAdmin', adminKey: admin.key,
      email: admin.email, name: admin.name,
      type: admin.role ?? 'Organization Admin',
      scope: admin.centerName ?? '-',
      team: admin.teamName ?? '-',
      status: 'active',
      canRemove: canRemoveRow(admin),
      sentAgo: admin.joinedAgo ?? '—', sentMinutesAgo: 999999,
      isSelf: currentUserEmail != null && admin.email === currentUserEmail,
    })),
  ];

  function handleResend(row) {
    setInviteToast(`Invitation resent to ${row.email}`);
  }

  function handleCancel(row) {
    setInviteToast(`Invitation to ${row.email} cancelled`);
    if (row.kind === 'org') setPendingInvites(prev => prev.filter((_, idx) => idx !== row.index));
    else setCenterAdminInvites(prev => prev.filter(c => c.key !== row.centerKey));
  }

  function handleRemove(row) {
    setRemoveTarget(row);
  }

  function confirmRemove() {
    setInviteToast(`${removeTarget.email} removed as ${removeTarget.type}`);
    setOrgAdmins(prev => prev.filter(a => a.key !== removeTarget.adminKey));
  }

  // Una fila activa lleva al perfil de esa persona, igual que en la tabla de un equipo.
  if (profileUser) {
    return (
      <div className={styles.subFadeIn}>
        <UserCard
          user={profileUser}
          backLabel="Admins"
          onBack={() => setProfileUser(null)}
          role={role}
        />
      </div>
    );
  }

  return (
    <>
      <InvitationsTable
        title="Admins"
        description={'Invite and manage administrators for this organization and its centers. To invite someone new, use the "+" button above.'}
        rows={rows}
        typeOptions={['Organization Admin', 'Center admin', 'Team admin']}
        onOpenProfile={row => setProfileUser(adminRowToUser(row))}
        scopeLabel="Center"
        showTeam
        searchPlaceholder="Search..."
        showSent={false}
        emptyTitle="No administrators yet"
        emptySubtitle="Administrators you invite will appear here."
        onResend={handleResend}
        onCancel={handleCancel}
        onRemove={handleRemove}
        onDeliveryIssue={row => setEmailHistoryRow(row)}
        canViewEmailHistory={canViewEmailHistory}
        canEditUsers={canEditUsers}
        onEditUser={row => setEditUserRow(row)}
        responsiveTable
      />
      {emailHistoryRow && (
        <EmailHistoryDrawer
          row={emailHistoryRow}
          onClose={() => setEmailHistoryRow(null)}
          onResend={handleResend}
          onCancel={handleCancel}
        />
      )}
      {editUserRow && (
        <EditUserDrawer
          user={{ name: editUserRow.name ?? '', email: editUserRow.email, status: 'active' }}
          onClose={() => setEditUserRow(null)}
          role={role}
        />
      )}
      {removeTarget && (
        <RemoveAdminModal
          row={removeTarget}
          onClose={() => setRemoveTarget(null)}
          onConfirm={confirmRemove}
        />
      )}
      {inviteToast && (
        <Toast message={inviteToast} mode="success" onClose={() => setInviteToast(null)} />
      )}
    </>
  );
}

// ─── Units tab ────────────────────────────────────────────


const UNIT_DETAIL_TABS = [
  { id: 'details', label: 'Details' },
];

function UnitDetailInfoRow({ label, value }) {
  return (
    <div className={styles.unitInfoItem}>
      <span className={styles.unitInfoLabel}>{label}</span>
      <span className={styles.unitInfoValue}>{value}</span>
    </div>
  );
}

function UnitsTab({ center, org, role }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: new Set(), type: new Set() });
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [selectedUnit, setSelectedUnit] = useState(null);
  // Misma animación que al entrar a un jugador: bajar de nivel entra desde la derecha,
  // el back entra desde la izquierda y dura menos. 'none' = primera carga del tab.
  const [unitNav, setUnitNav] = useState('none');
  const [detailTab, setDetailTab] = useState('details');
  const [editUnitTarget, setEditUnitTarget] = useState(null);
  const [unitToast, setUnitToast] = useState(null);
  const filterRef = useRef(null);

  function handleSort(col) {
    if (sortCol !== col) { setSortCol(col); setSortDir('asc'); }
    else if (sortDir === 'asc') setSortDir('desc');
    else { setSortCol(null); setSortDir('asc'); }
  }

  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

  function toggleFilter(group, value) {
    setFilters(prev => {
      const next = new Set(prev[group]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [group]: next };
    });
  }

  function clearFilters() { setFilters({ status: new Set(), type: new Set() }); }

  const activeFilterCount = filters.status.size + filters.type.size;

  const allUnits = center.units ?? [];
  const typeOptions = Array.from(new Set(allUnits.map(u => u.type).filter(Boolean)));

  const units = allUnits.filter(u => {
    if (filters.status.size > 0 && !filters.status.has(u.status)) return false;
    if (filters.type.size   > 0 && !filters.type.has(u.type))     return false;
    const q = search.trim().toLowerCase();
    if (q && !(u.description ?? '').toLowerCase().includes(q) && !String(u.id).includes(q)) return false;
    return true;
  });

  if (sortCol) {
    units.sort((a, b) => {
      const diff = (a[sortCol] ?? 0) - (b[sortCol] ?? 0);
      return sortDir === 'asc' ? diff : -diff;
    });
  }

  if (allUnits.length === 0) {
    return (
      <InnerEmptyState
        title="No units yet..."
        subtitle="Hardware units assigned to this center will appear here"
      />
    );
  }

  if (selectedUnit) {
    return (
      <div className={`${styles.teamsTab} ${styles.unitsCenterTab} ${styles.subFadeIn}`}>

        <button className={`${styles.backBtn} ${styles.unitDetailBack}`} onClick={() => { setUnitNav('back'); setSelectedUnit(null); }}>
          <span className={styles.backIcon}><ArrowLeftIcon /></span>
          <span className={styles.backLabel}>Back to Units</span>
        </button>

        <div className={styles.unitDetailHeader}>
          <div className={styles.unitDetailHeading}>
            <h2 className={styles.unitDetailTitle}>{String(selectedUnit.id)} — Unit</h2>
            <div className={styles.unitDetailStatus}>
              <span className={`${styles.statusDot} ${styles[selectedUnit.status]}`} />
              <span className={styles.unitStatusLabel}>{selectedUnit.status === 'active' ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
          <IconButton
            aria-label="Unit settings"
            tooltip="Unit settings"
            tooltipPosition="left"
            onClick={() => setEditUnitTarget(selectedUnit)}
          >
            <IconSettings size={16} />
          </IconButton>
        </div>

        <div className={styles.unitDetailTabsOuter}>
          <div className={styles.unitDetailTabs}>
            <div className={styles.unitDetailTabsInner}>
              <TabBar tabs={UNIT_DETAIL_TABS} activeTab={detailTab} onChange={setDetailTab} size="s" />
            </div>
          </div>
        </div>

        <div className={styles.unitDetailBody}>
          {detailTab === 'details' && (
            <>
              <div className={styles.unitInfoSection}>
                <p className={styles.unitInfoSectionLabel}>Assigned to</p>
                <div className={styles.unitInfoRow}>
                  <UnitDetailInfoRow label="Organization" value={org?.name ?? '—'} />
                  <UnitDetailInfoRow label="Center" value={center.name} />
                </div>
              </div>

              <div className={styles.unitInfoSection}>
                <p className={styles.unitInfoSectionLabel}>Description</p>
                <div className={styles.unitInfoRowFull}>
                  <span className={styles.unitInfoDescription}>{selectedUnit.description || '—'}</span>
                </div>
              </div>

              <div className={styles.unitInfoSection}>
                <p className={styles.unitInfoSectionLabel}>Specifications</p>
                <div className={styles.unitInfoRow}>
                  <UnitDetailInfoRow label="Unit number" value={String(selectedUnit.id)} />
                  <UnitDetailInfoRow label="Model" value={selectedUnit.type || '—'} />
                </div>
                <div className={styles.unitInfoRowHalf}>
                  <UnitDetailInfoRow label="Language" value="EN" />
                </div>
              </div>

              <div className={styles.unitInfoSection}>
                <p className={styles.unitInfoSectionLabel}>Login</p>
                <div className={styles.unitInfoRowHalf}>
                  <UnitDetailInfoRow label="Type" value="Public" />
                </div>
              </div>

              <div className={styles.unitInfoSection}>
                <p className={styles.unitInfoSectionLabel}>Screen roster</p>
                <p className={styles.unitRosterEmpty}>No teams configured</p>
              </div>
            </>
          )}
        </div>

        {editUnitTarget && (
          <EditUnitDrawer
            unit={editUnitTarget}
            center={center}
            role={role}
            onClose={() => setEditUnitTarget(null)}
            onSave={u => setUnitToast(`Unit ${u?.id ?? ''} updated`)}
          />
        )}

        {unitToast && (
          <Toast message={unitToast} mode="success" onClose={() => setUnitToast(null)} />
        )}

      </div>
    );
  }

  return (
    <div className={`${styles.teamsTab} ${styles.unitsCenterTab} ${unitNav === 'back' ? styles.subFadeBack : ''}`}>

      <div className={styles.teamToolbar}>
        <SearchBar
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
        <div className={styles.filterWrap} ref={filterRef}>
          <ToolbarButton
            icon={<IconFilter size={16} />}
            selected={activeFilterCount > 0}
            onClick={() => setFilterOpen(v => !v)}
          >
            Filters
            {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
          </ToolbarButton>
          {filterOpen && (
            <div className={styles.filterDropdown}>
              <div className={styles.filterSection}>
                <p className={styles.filterSectionLabel}>Status</p>
                {[{ v: 'active', label: 'Active' }, { v: 'inactive', label: 'Inactive' }].map(({ v, label }) => (
                  <label key={v} className={`${styles.filterOption} ${filters.status.has(v) ? styles.filterOptionChecked : ''}`}>
                    <input type="checkbox" className={styles.nativeCheck} checked={filters.status.has(v)} onChange={() => toggleFilter('status', v)} />
                    <span className={styles.checkBox}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className={styles.checkMark} aria-hidden="true">
                        <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className={styles.optionLabel}>{label}</span>
                  </label>
                ))}
              </div>
              {typeOptions.length > 0 && (
                <div className={styles.filterSection}>
                  {/* "Model" = Stand/Seat (campo `type` en los datos). El tipo de instalación
                      —Neolith/Embedded— es otro campo y vive en el drawer de editar. */}
                  <p className={styles.filterSectionLabel}>Model</p>
                  {typeOptions.map(t => (
                    <label key={t} className={`${styles.filterOption} ${filters.type.has(t) ? styles.filterOptionChecked : ''}`}>
                      <input type="checkbox" className={styles.nativeCheck} checked={filters.type.has(t)} onChange={() => toggleFilter('type', t)} />
                      <span className={styles.checkBox}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className={styles.checkMark} aria-hidden="true">
                          <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className={styles.optionLabel}>{t}</span>
                    </label>
                  ))}
                </div>
              )}
              {activeFilterCount > 0 && (
                <button className={styles.clearFilters} onClick={clearFilters}>Clear filters</button>
              )}
            </div>
          )}
        </div>
      </div>

      {units.length > 0 ? (
        <div className={styles.teamTable}>
          <div className={styles.teamTableHead}>
            <span className={`${styles.teamCol} ${styles.unitColId}`}>
              <button className={`${styles.sortBtn} ${sortCol === 'id' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('id')}>
                Unit ID
                <span className={styles.sortIcon}>
                  <IconSort
                    size={14}
                    upColor={sortCol === 'id' && sortDir === 'asc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'}
                    downColor={sortCol === 'id' && sortDir === 'desc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'}
                  />
                </span>
              </button>
            </span>
            <span className={`${styles.teamCol} ${styles.unitColType}`}>Model</span>
            <span className={`${styles.teamCol} ${styles.unitColUse}`}>
              <button className={`${styles.sortBtn} ${sortCol === 'sensorUsage' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('sensorUsage')}>
                Sensor usage
                <span className={styles.infoIconWrap} data-tooltip="How many times the K-POD sensor has registered use.">
                  <IconInfoCircle size={14} />
                </span>
                <span className={styles.sortIcon}>
                  <IconSort
                    size={14}
                    upColor={sortCol === 'sensorUsage' && sortDir === 'asc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'}
                    downColor={sortCol === 'sensorUsage' && sortDir === 'desc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'}
                  />
                </span>
              </button>
            </span>
            <span className={`${styles.teamCol} ${styles.unitColUse}`}>
              <button className={`${styles.sortBtn} ${sortCol === 'totalUse' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('totalUse')}>
                Total usage
                <span className={styles.infoIconWrap} data-tooltip="Total number of times this unit has been used.">
                  <IconInfoCircle size={14} />
                </span>
                <span className={styles.sortIcon}>
                  <IconSort
                    size={14}
                    upColor={sortCol === 'totalUse' && sortDir === 'asc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'}
                    downColor={sortCol === 'totalUse' && sortDir === 'desc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'}
                  />
                </span>
              </button>
            </span>
            <span className={`${styles.teamCol} ${styles.teamColActions}`} />
          </div>
          {units.map(unit => {
            return (
              <div
                key={unit.id}
                className={styles.teamTableRow}
                role="button"
                tabIndex={0}
                onClick={() => { setUnitNav('forward'); setSelectedUnit(unit); }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setUnitNav('forward'); setSelectedUnit(unit); } }}
              >
                <div className={`${styles.teamCol} ${styles.unitColId}`}>
                  <div className={styles.memberMeta}>
                    <span className={styles.memberName}>{unit.id}</span>
                    <span className={styles.memberSub}>{unit.description || '-'}</span>
                  </div>
                </div>
                <div className={`${styles.teamCol} ${styles.unitColType}`}>
                  <span className={styles.dateText}>{unit.type || '-'}</span>
                </div>
                <div className={`${styles.teamCol} ${styles.unitColUse}`}>
                  <span className={styles.dateText}>{unit.sensorUsage ?? 0}</span>
                </div>
                <div className={`${styles.teamCol} ${styles.unitColUse}`}>
                  <span className={styles.dateText}>{unit.totalUse ?? 0}</span>
                </div>
                <div
                  className={`${styles.teamCol} ${styles.teamColActions}`}
                  onClick={e => e.stopPropagation()}
                >
                  {/* El lápiz edita; el click en la fila lleva al detalle de la unit. */}
                  <IconButton
                    aria-label="Edit unit"
                    tooltip="Edit"
                    onClick={() => setEditUnitTarget(unit)}
                  >
                    <IconEdit size={16} />
                  </IconButton>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <InnerEmptyState
          title="No results"
          subtitle={search ? `No units match "${search}"` : 'No units match the selected filters'}
        />
      )}

      {editUnitTarget && (
        <EditUnitDrawer
          unit={editUnitTarget}
          center={center}
          role={role}
          onClose={() => setEditUnitTarget(null)}
          onSave={u => setUnitToast(`Unit ${u?.id ?? ''} updated`)}
        />
      )}

      {unitToast && (
        <Toast message={unitToast} mode="success" onClose={() => setUnitToast(null)} />
      )}

    </div>
  );
}

// ─── Unit card ─────────────────────────────────────────────

const UNIT_TABS = [
  { id: 'detail',     label: 'Detail'     },
  { id: 'devices',    label: 'Devices'    },
  { id: 'appearance', label: 'Appearance' },
  { id: 'parameters', label: 'Parameters' },
];

function getScrollParent(el) {
  while (el && el !== document.body) {
    const { overflowY } = window.getComputedStyle(el);
    if (overflowY === 'auto' || overflowY === 'scroll') return el;
    el = el.parentElement;
  }
  return null;
}

function CenterCard({ center, org, onEdit, onDelete, onNewTeam, onNewUser, onInviteCenterAdmin, onEditTeam, onNewUserForTeam, onDeleteTeam, deletedTeamIds, onSelectTeam, onSelectUser, initialTab = 'details', role, currentUserEmail }) {
  const canDeleteCenter = role === 'owner' || role === 'admin'; // centers.delete: exclusivo de Owner/Admin (ni Editor lo tiene)
  // teams.create / teams.edit / users.invite: exclusivos de Center Admin (y Owner/Admin por bypass) —
  // Editor y Org Admin son solo-lectura en Teams, y users.invite tampoco lo tienen (docs/permissions.md).
  const canManageTeams  = role === 'owner' || role === 'admin' || role === 'centerAdmin';
  const canCreateTeam   = canManageTeams;
  const canInviteUser   = canManageTeams;
  // New Team Admin (ítem propio del menú "+", separado de New User/Member desde el rediseño
  // del Figma) — mismo gate que crear equipos/invitar usuarios, no hay un permiso distinto
  // documentado todavía para esto específicamente.
  const canInviteTeamAdmin = canManageTeams;
  // units.create es de Kamleon Editor (y Owner/Admin por bypass), pero el formulario de crear
  // unit todavía no está diseñado (pendiente: Daniel pasa los campos). Hasta entonces el ítem
  // no se muestra: un "New Unit" que solo cierra el menú es peor que no tenerlo.
  const canCreateUnit   = false;
  // Org Admin no tiene el segmento "Administrators" dentro del tab Users de este centro (ve todo
  // consolidado a nivel Org), así que el "+" de acá es su único atajo para invitar un Center Admin
  // sin salir del centro. Editor y Center Admin ya tienen ese flujo cubierto por su propio segmento.
  const canInviteCenterAdminHere = role === 'orgAdmin';
  // Center Admin también invita Center Admins desde el "+" de su propio centro, igual que
  // New Team/New User — abre un drawer, no redirige a otro tab.
  const canInviteCenterAdminFromPlus = role === 'centerAdmin';
  const [innerTab, setInnerTab]         = useState(initialTab);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showInviteCenterAdminDrawer, setShowInviteCenterAdminDrawer] = useState(false);
  const [showInviteTeamAdminDrawer, setShowInviteTeamAdminDrawer] = useState(false);
  const [adminInviteToast, setAdminInviteToast] = useState(null);
  // Admins de este centro ya confirmados (invitación aceptada) — se muestran en el tab
  // "Admins", junto a los pendientes, con acción "Remove" (mismo patrón que Org Admin).
  const [centerAdmins, setCenterAdmins] = useState(() =>
    (center.admins ?? []).map((a, i) => ({ ...a, key: `center-admin-${i}` }))
  );
  const [pendingInvites, setPendingInvites] = useState(center.pendingInvites ?? []);
  const [teamInvites, setTeamInvites] = useState(() =>
    (center.teams ?? []).flatMap(team =>
      (team.pendingInvites ?? []).map((invite, i) => ({ ...invite, teamId: team.id, teamName: team.name, key: `${team.id}-${i}` }))
    )
  );
  // Invitaciones de Team Admin pendientes (fuente separada de teamInvites, igual que Organización
  // separa pendingInvites de centerAdminInvites — sin campo `role` compartido, cada tipo vive en
  // su propio array desde el origen). Mientras están pendientes viven acá, en el tab Admins del
  // Centro; una vez aceptadas pasan a ser fila "Team admin" en el roster del equipo (con PIN/Screen).
  const [teamAdminInvites, setTeamAdminInvites] = useState(() =>
    (center.teams ?? []).flatMap(team =>
      (team.pendingProfessionalInvites ?? []).map((invite, i) => ({ ...invite, teamId: team.id, teamName: team.name, key: `${team.id}-prof-${i}` }))
    )
  );
  // centers.admins.invite/resend/delete: Editor, Org Admin y Center Admin (y Owner/Admin por bypass) —
  // Org Admin gestiona los admins de este centro desde su propio tab a nivel Organización
  // (consolidado con los de todos sus centros), así que acá no se le repite el tab.
  const canManageCenterAdmins = role === 'owner' || role === 'admin' || role === 'editor' || role === 'orgAdmin' || role === 'centerAdmin';
  const showAdminsTab = canManageCenterAdmins && role !== 'orgAdmin';
  // Orden: Details · Teams · Users · Admins · Units — Admins va justo después de Users
  // (las dos tratan de personas) y Units queda al final.
  const centerTabs = CENTER_TABS.flatMap(t => {
    const tab = t.id === 'users' ? { ...t, hasDot: teamInvites.length > 0 } : t;
    if (t.id === 'units' && showAdminsTab) {
      return [
        { id: 'admins', label: 'Admins', hasDot: pendingInvites.length > 0 || teamAdminInvites.length > 0 },
        tab,
      ];
    }
    return [tab];
  });
  const createMenuRef  = useRef(null);
  const tabBarRef      = useRef(null);
  const tabContentRef  = useRef(null);
  const savedScrollRef = useRef(null);

  useEffect(() => {
    if (!createMenuOpen) return;
    function handleClick(e) {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target)) setCreateMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [createMenuOpen]);

  function handleTabChange(tab) {
    const scrollEl = getScrollParent(tabBarRef.current);
    savedScrollRef.current = scrollEl ? { el: scrollEl, top: scrollEl.scrollTop } : null;
    setInnerTab(tab);
  }

  useLayoutEffect(() => {
    if (savedScrollRef.current) {
      const { el, top } = savedScrollRef.current;
      el.scrollTop = top;
      savedScrollRef.current = null;
    }
    tabContentRef.current?.scrollTo({ top: 0 });
  }, [innerTab]);

  return (
    <div className={styles.centerCard}>

      {/* ── Fixed header ── */}
      <div className={styles.innerHeader}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <div className={styles.cardAvatar}>{center.name.charAt(0)}</div>
            <div className={styles.cardTitleGroup}>
              <h2 className={styles.cardTitle}>{center.name}</h2>
              <div className={styles.cardSubtitle}>
                <div className={styles.statusBadgeSmall}>
                  <div className={`${styles.statusDot} ${styles[center.status]}`} />
                  <span>{center.status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.cardActions}>
            {(canCreateTeam || canInviteTeamAdmin || canInviteUser || canCreateUnit || canInviteCenterAdminHere || canInviteCenterAdminFromPlus) && (
              <div className={styles.createMenuAnchor} ref={createMenuRef} data-tour-id="center-create-menu">
                <span className={createMenuOpen ? styles.createTriggerHidden : ''}>
                  <IconButton
                    aria-label="Create"
                    tooltip="Create"
                    onClick={() => setCreateMenuOpen(v => !v)}
                  >
                    <IconPlus size={16} />
                  </IconButton>
                </span>
                {createMenuOpen && (
                  <div className={styles.cardCreateMenu}>
                    <ContextMenu
                      items={[
                        ...(canCreateTeam ? [{ label: 'New Team', icon: <IconPlus size={16} />, onClick: () => { setCreateMenuOpen(false); onNewTeam(); } }] : []),
                        ...(canInviteTeamAdmin ? [{ label: 'New Team Admin', icon: <IconPlus size={16} />, onClick: () => { setCreateMenuOpen(false); setShowInviteTeamAdminDrawer(true); } }] : []),
                        ...(canInviteUser ? [{ label: 'New User/Member', icon: <IconPlus size={16} />, onClick: () => { setCreateMenuOpen(false); onNewUser(); } }] : []),
                        ...(canCreateUnit ? [{ label: 'New Unit', icon: <IconPlus size={16} />, onClick: () => setCreateMenuOpen(false) }] : []),
                        ...(canInviteCenterAdminHere ? [{ label: 'Center Admin', icon: <IconPlus size={16} />, onClick: () => { setCreateMenuOpen(false); onInviteCenterAdmin(); } }] : []),
                        ...(canInviteCenterAdminFromPlus ? [{ label: 'New Center Admin', icon: <IconPlus size={16} />, onClick: () => { setCreateMenuOpen(false); setShowInviteCenterAdminDrawer(true); } }] : []),
                      ]}
                    />
                  </div>
                )}
              </div>
            )}
            <IconButton aria-label="Center settings" tooltip="Center Settings" tooltipPosition="left" onClick={onEdit}>
              <IconSettings size={16} />
            </IconButton>
            {canDeleteCenter && (
              <IconButton aria-label="Delete center" tooltip="Delete" variant="danger" onClick={() => setShowDeleteModal(true)}>
                <IconTrash size={16} />
              </IconButton>
            )}
          </div>
        </div>
      </div>

      {/* ── Inner TabBar ── */}
      <div ref={tabBarRef} className={styles.innerTabBarWrap} data-tour-id="center-tabs">
        <div className={`${styles.innerTabBarInner} ${centerTabs.length > 4 ? styles.innerTabBarInnerWide : ''}`}>
          <TabBar tabs={centerTabs} activeTab={innerTab} onChange={handleTabChange} size="s" />
        </div>
      </div>

      {/* ── Scrollable tab content ── */}
      <div ref={tabContentRef} className={styles.innerTabContent}>
        {innerTab === 'details' && (
          <DetailsTab center={center} org={org} onTabChange={handleTabChange} />
        )}
        {innerTab === 'teams' && (
          <TeamsTab
            center={center}
            onSelectTeam={onSelectTeam}
            onEditTeam={onEditTeam}
            onNewUserForTeam={onNewUserForTeam}
            onDeleteTeam={onDeleteTeam}
            deletedTeamIds={deletedTeamIds}
            canManageTeams={canManageTeams}
            role={role}
          />
        )}
        {innerTab === 'users' && (
          <UsersTab
            center={center}
            onSelectUser={onSelectUser}
            role={role}
            teamInvites={teamInvites}
            setTeamInvites={setTeamInvites}
          />
        )}
        {innerTab === 'units' && (
          <UnitsTab center={center} org={org} role={role} />
        )}
        {innerTab === 'admins' && showAdminsTab && (
          <AdministratorsSection
            center={center}
            role={role}
            pendingInvites={pendingInvites}
            setPendingInvites={setPendingInvites}
            teamAdminInvites={teamAdminInvites}
            setTeamAdminInvites={setTeamAdminInvites}
            centerAdmins={centerAdmins}
            setCenterAdmins={setCenterAdmins}
            currentUserEmail={currentUserEmail}
          />
        )}
      </div>

      {showDeleteModal && (
        <DeleteOrgModal
          org={center}
          label="center"
          requireTyping
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => { setShowDeleteModal(false); setShowToast(true); }}
        />
      )}

      {showToast && (
        <Toast
          message={`${center.name} deleted`}
          mode="success"
          onUndo={() => setShowToast(false)}
          onClose={() => setShowToast(false)}
        />
      )}

      {showInviteCenterAdminDrawer && (
        <InviteCenterAdminDrawer
          org={org}
          presetCenter={center}
          onClose={() => setShowInviteCenterAdminDrawer(false)}
          onSave={(_selectedCenter, emails) => {
            setPendingInvites(prev => [...prev, ...emails.map(email => ({ email, sentAgo: formatSentDate(), sentMinutesAgo: 0 }))]);
            setAdminInviteToast(emails.length === 1 ? 'Invitation sent' : `${emails.length} invitations sent`);
          }}
        />
      )}

      {showInviteTeamAdminDrawer && (
        <InviteTeamAdminDrawer
          center={center}
          onClose={() => setShowInviteTeamAdminDrawer(false)}
          onSave={(team, emails) => {
            setTeamAdminInvites(prev => [
              ...prev,
              ...emails.map((email, i) => ({
                email, teamId: team.id, teamName: team.name,
                key: `${team.id}-prof-new-${Date.now()}-${i}`,
                sentAgo: formatSentDate(), sentMinutesAgo: 0,
              })),
            ]);
            setAdminInviteToast(emails.length === 1 ? 'Invitation sent' : `${emails.length} invitations sent`);
          }}
        />
      )}

      {adminInviteToast && (
        <Toast message={adminInviteToast} mode="success" onClose={() => setAdminInviteToast(null)} />
      )}
    </div>
  );
}

// ─── Users tab ────────────────────────────────────────────

const CENTER_USERS_PAGE_SIZE = 10;

function UsersTab({ center, onSelectUser, role, teamInvites, setTeamInvites }) {
  const canManageUsers = role === 'owner' || role === 'admin' || role === 'centerAdmin';

  return (
    <div className={styles.usersTab}>
      <TeamUsersSection
        center={center}
        onSelectUser={onSelectUser}
        role={role}
        canManageUsers={canManageUsers}
        teamInvites={teamInvites}
        setTeamInvites={setTeamInvites}
      />
    </div>
  );
}

function TeamUsersSection({ center, onSelectUser, role, canManageUsers, teamInvites, setTeamInvites }) {
  // users.editData/delete: exclusivo de Center Admin (y Owner/Admin) — docs/permissions.md, Bloque: Users.
  // Status no tiene acción propia acá: users.changeStatus se resuelve dentro de Edit User (ya trae el campo).
  const [search, setSearch]       = useState('');
  const [filters, setFilters]     = useState({ role: new Set(), status: new Set(), team: new Set() });
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage]           = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editUserTarget, setEditUserTarget] = useState(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);
  const [removedUserIds, setRemovedUserIds] = useState(() => new Set());
  const [actionToast, setActionToast] = useState(null);
  const filterRef = useRef(null);
  const menuRefs  = useRef({});

  const teams = center.teams ?? [];

  useEffect(() => {
    if (!openMenuId) return;
    function handleClick(e) {
      const ref = menuRefs.current[openMenuId];
      if (ref && !ref.contains(e.target)) setOpenMenuId(null);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenuId]);

  function removeUser(user) {
    setRemovedUserIds(prev => new Set(prev).add(user.id));
    setActionToast(`${user.name} deleted`);
  }

  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

  const allUsers = useMemo(() => {
    const map = new Map();
    teams.forEach(team => {
      const userIds = new Set(team.users ?? []);
      const profIds = new Set(team.professionalIds ?? []);
      USERS_POOL.forEach(u => {
        if (!userIds.has(u.id)) return;
        const role = profIds.has(u.id) ? 'Team admin' : 'User';
        if (!map.has(u.id)) {
          map.set(u.id, { user: u, teams: [team], role });
        } else {
          map.get(u.id).teams.push(team);
        }
      });
    });
    return Array.from(map.values());
  }, [teams]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allUsers.filter(({ user, role: userRole, teams: userTeams }) => {
      if (removedUserIds.has(user.id)) return false;
      if (filters.role.size   > 0 && !filters.role.has(userRole))    return false;
      if (filters.status.size > 0 && !filters.status.has(user.status)) return false;
      if (filters.team.size   > 0 && !userTeams.some(t => filters.team.has(t.id))) return false;
      if (q && !user.name.toLowerCase().includes(q) && !user.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allUsers, search, filters, removedUserIds]);

  // Invitaciones de usuario de equipo pendientes — se muestran como filas "Pending" acá mismo
  // (no hay tab de Invitations aparte). Si no puede actuar sobre ellas (Editor/Org Admin),
  // tampoco tiene sentido mostrarlas.
  const pendingTeamRows = useMemo(() => {
    if (!canManageUsers) return [];
    if (filters.role.size > 0) return []; // no tienen rol todavía
    if (filters.status.size > 0 && !filters.status.has('pending')) return []; // filtro de status activo sin incluir Pending
    const q = search.trim().toLowerCase();
    return teamInvites.filter(invite => {
      if (filters.team.size > 0 && !filters.team.has(invite.teamId)) return false;
      if (q && !invite.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [canManageUsers, teamInvites, search, filters]);

  const activeFilterCount = filters.role.size + filters.status.size + filters.team.size;
  const totalPages = Math.max(1, Math.ceil(filtered.length / CENTER_USERS_PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageUsers  = filtered.slice((safePage - 1) * CENTER_USERS_PAGE_SIZE, safePage * CENTER_USERS_PAGE_SIZE);

  function handleSearch(val) { setSearch(val); setPage(1); }

  function toggleFilter(group, value) {
    setFilters(prev => {
      const next = new Set(prev[group]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [group]: next };
    });
    setPage(1);
  }

  function clearFilters() {
    setFilters({ role: new Set(), status: new Set(), team: new Set() });
    setPage(1);
  }

  function handleResendTeamInvite(invite) {
    setActionToast(`Invitation resent to ${invite.email}`);
  }

  function handleCancelTeamInvite(invite) {
    setActionToast(`Invitation to ${invite.email} cancelled`);
    setTeamInvites(prev => prev.filter(t => t.key !== invite.key));
  }

  if (allUsers.length === 0 && teamInvites.length === 0) {
    return (
      <InnerEmptyState
        title="No users yet..."
        subtitle="Add teams with users to this center to see them here"
      />
    );
  }

  return (
    <>

      <div className={styles.teamToolbar}>
        <SearchBar
          placeholder="Search..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          onClear={() => handleSearch('')}
        />
        <div className={styles.filterWrap} ref={filterRef}>
          <ToolbarButton
            icon={<IconFilter size={16} />}
            selected={activeFilterCount > 0}
            onClick={() => setFilterOpen(v => !v)}
          >
            Filters
            {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
          </ToolbarButton>
          {filterOpen && (
            <div className={styles.filterDropdown}>
              <div className={styles.filterSection}>
                <p className={styles.filterSectionLabel}>Role</p>
                {[{ v: 'Team admin', label: 'Team admin' }, { v: 'User', label: 'User' }].map(({ v, label }) => (
                  <label key={v} className={`${styles.filterOption} ${filters.role.has(v) ? styles.filterOptionChecked : ''}`}>
                    <input type="checkbox" className={styles.nativeCheck} checked={filters.role.has(v)} onChange={() => toggleFilter('role', v)} />
                    <span className={styles.checkBox}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className={styles.checkMark} aria-hidden="true">
                        <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className={styles.optionLabel}>{label}</span>
                  </label>
                ))}
              </div>
              <div className={styles.filterSection}>
                <p className={styles.filterSectionLabel}>Status</p>
                {[{ v: 'active', label: 'Active' }, { v: 'inactive', label: 'Inactive' }, { v: 'pending', label: 'Pending' }].map(({ v, label }) => (
                  <label key={v} className={`${styles.filterOption} ${filters.status.has(v) ? styles.filterOptionChecked : ''}`}>
                    <input type="checkbox" className={styles.nativeCheck} checked={filters.status.has(v)} onChange={() => toggleFilter('status', v)} />
                    <span className={styles.checkBox}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className={styles.checkMark} aria-hidden="true">
                        <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className={styles.optionLabel}>{label}</span>
                  </label>
                ))}
              </div>
              {teams.length > 1 && (
                <div className={styles.filterSection}>
                  <p className={styles.filterSectionLabel}>Team</p>
                  {teams.map(t => (
                    <label key={t.id} className={`${styles.filterOption} ${filters.team.has(t.id) ? styles.filterOptionChecked : ''}`}>
                      <input type="checkbox" className={styles.nativeCheck} checked={filters.team.has(t.id)} onChange={() => toggleFilter('team', t.id)} />
                      <span className={styles.checkBox}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className={styles.checkMark} aria-hidden="true">
                          <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className={styles.optionLabel}>{t.name}</span>
                    </label>
                  ))}
                </div>
              )}
              {activeFilterCount > 0 && (
                <button className={styles.clearFilters} onClick={clearFilters}>Clear filters</button>
              )}
            </div>
          )}
        </div>
      </div>

      {(pageUsers.length > 0 || pendingTeamRows.length > 0) ? (
        <div className={styles.teamTable}>
          <div className={styles.teamTableHead}>
            <span className={`${styles.teamCol} ${styles.teamColName}`}>Name</span>
            <span className={`${styles.teamCol} ${styles.teamColTeamWide}`}>Team</span>
            <span className={`${styles.teamCol} ${styles.teamColStatus}`}>Status</span>
            <span className={`${styles.teamCol} ${styles.inviteColActions}`} />
          </div>
          {pendingTeamRows.map(invite => (
            <div key={invite.key} className={styles.teamTableRow}>
              <div className={`${styles.teamCol} ${styles.teamColName}`}>
                <div className={styles.memberAvatar}>{invite.email.charAt(0).toUpperCase()}</div>
                <div className={styles.memberMeta}>
                  <TruncatedText text={invite.email} textClassName={styles.memberName} />
                  <span className={styles.memberSub}>Invited {invite.sentAgo ?? ''}</span>
                </div>
              </div>
              <div className={`${styles.teamCol} ${styles.teamColTeamWide}`}>
                <span className={styles.teamNamePill}>{invite.teamName}</span>
              </div>
              <div className={`${styles.teamCol} ${styles.teamColStatus}`}>
                <Tag status="pending" />
              </div>
              <div className={`${styles.teamCol} ${styles.inviteColActions}`} onClick={e => e.stopPropagation()}>
                <IconButton aria-label="Resend invitation" tooltip="Resend" onClick={() => handleResendTeamInvite(invite)}>
                  <IconResend size={16} />
                </IconButton>
                <IconButton aria-label="Cancel invitation" tooltip="Cancel" onClick={() => handleCancelTeamInvite(invite)}>
                  <IconTrash size={14} />
                </IconButton>
              </div>
            </div>
          ))}
          {pageUsers.map(({ user, teams, role: userRole }) => {
            const isOpen = openMenuId === user.id;
            return (
            <div
              key={user.id}
              className={`${styles.teamTableRow} ${isOpen ? styles.menuOpen : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => onSelectUser(user, teams[0])}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelectUser(user, teams[0]); }}
            >
              <div className={`${styles.teamCol} ${styles.teamColName}`}>
                <div className={styles.memberAvatar}>{user.name.charAt(0)}</div>
                <div className={styles.memberMeta}>
                  <TruncatedText text={user.name} textClassName={styles.memberName} />
                  <span className={styles.memberSub}>{user.jerseyNumber ? `#${user.jerseyNumber} | ${userRole}` : userRole}</span>
                </div>
              </div>
              <div className={`${styles.teamCol} ${styles.teamColTeamWide}`}>
                {teams.length > 1
                  ? <span className={styles.teamNamePill}>{teams.length} teams</span>
                  : <span className={styles.teamNamePill}>{teams[0]?.name ?? '—'}</span>}
              </div>
              <div className={`${styles.teamCol} ${styles.teamColStatus}`}>
                <Tag status={user.status} />
              </div>
              <div
                className={`${styles.teamCol} ${styles.inviteColActions}`}
                ref={el => { menuRefs.current[user.id] = el; }}
                onClick={e => e.stopPropagation()}
              >
                {canManageUsers && (
                  <>
                    {/* Placeholder invisible: alinea el botón "···" bajo la misma columna
                        que "Cancel" en las filas pendientes (2 slots siempre). */}
                    <span className={styles.actionPlaceholder} aria-hidden="true" />
                    <div className={styles.teamRowMenuAnchor}>
                      <span className={isOpen ? styles.createTriggerHidden : ''}>
  <IconButton
                          aria-label="More options"
                          tooltip="More"
                          onClick={() => setOpenMenuId(isOpen ? null : user.id)}
                        >
                          <IconMore size={16} />
                        </IconButton>
                      </span>
                      {isOpen && (
                        <div className={styles.teamRowMenu}>
                          <ContextMenu
                            items={[
                              { label: 'Edit user', icon: <IconEdit size={16} />, onClick: () => { setOpenMenuId(null); setEditUserTarget({ user, team: teams[0] }); } },
                              { label: 'Delete user', icon: <IconTrash size={16} />, variant: 'danger', onClick: () => { setOpenMenuId(null); setDeleteUserTarget(user); } },
                            ]}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        <InnerEmptyState
          title="No results"
          subtitle={search ? `No users match "${search}"` : 'No users in this team'}
        />
      )}

      {filtered.length > CENTER_USERS_PAGE_SIZE && (
        <div className={styles.teamPagination}>
          <span className={styles.paginationInfo}>
            Showing <strong>{(safePage - 1) * CENTER_USERS_PAGE_SIZE + 1}–{Math.min(safePage * CENTER_USERS_PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong> users
          </span>
          <div className={styles.paginationBtns}>
            <button className={styles.paginationBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>Previous</button>
            <button className={styles.paginationBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>Next</button>
          </div>
        </div>
      )}

      {editUserTarget && (
        <EditUserDrawer user={editUserTarget.user} team={editUserTarget.team} onClose={() => setEditUserTarget(null)} role="centerAdmin" />
      )}

      {deleteUserTarget && (
        <DeleteOrgModal
          org={deleteUserTarget}
          label="user"
          onClose={() => setDeleteUserTarget(null)}
          onConfirm={() => removeUser(deleteUserTarget)}
        />
      )}

      {actionToast && (
        <Toast message={actionToast} mode="success" onClose={() => setActionToast(null)} />
      )}

    </>
  );
}

function AdministratorsSection({ center, pendingInvites, setPendingInvites, teamAdminInvites, setTeamAdminInvites, centerAdmins, setCenterAdmins, currentUserEmail, role }) {
  const [removeTarget, setRemoveTarget] = useState(null);
  const [actionToast, setActionToast] = useState(null);
  // Historial de correo e incidencias: feature del programador, solo para staff de Kamleon.
  // Center Admin no los ve, aunque sí pueda editar usuarios.
  const canViewEmailHistory = role === 'owner' || role === 'admin' || role === 'editor';
  // `users.editData`: Center Admin y Team Admin (y Owner/Admin por bypass); Editor no.
  const canEditUsers = role === 'owner' || role === 'admin' || role === 'centerAdmin';
  const [emailHistoryRow, setEmailHistoryRow] = useState(null);
  const [editUserRow, setEditUserRow] = useState(null);
  const [profileUser, setProfileUser] = useState(null);

  const rows = [
    ...pendingInvites.map((invite, i) => ({
      key: `center-admin-pending-${i}`, index: i, kind: 'centerAdminPending',
      email: invite.email, type: 'Center admin', scope: '-', status: 'pending',
      sentAgo: invite.sentAgo ?? '—', sentMinutesAgo: invite.sentMinutesAgo ?? 0,
      deliveryIssue: invite.deliveryIssue ?? null,
    })),
    ...teamAdminInvites.map(invite => ({
      key: `team-admin-pending-${invite.key}`, sourceKey: invite.key, kind: 'teamAdminPending',
      email: invite.email, type: 'Team admin', scope: invite.teamName, status: 'pending',
      sentAgo: invite.sentAgo ?? '—', sentMinutesAgo: invite.sentMinutesAgo ?? 0,
      deliveryIssue: invite.deliveryIssue ?? null,
    })),
    ...centerAdmins.map(admin => ({
      key: `center-admin-active-${admin.key}`, adminKey: admin.key, kind: 'centerAdminActive',
      email: admin.email, name: admin.name, type: 'Center admin', scope: '-', status: 'active',
      isSelf: currentUserEmail != null && admin.email === currentUserEmail,
    })),
  ];

  function handleResend(row) {
    setActionToast(`Invitation resent to ${row.email}`);
  }

  function handleCancel(row) {
    setActionToast(`Invitation to ${row.email} cancelled`);
    if (row.kind === 'centerAdminPending') setPendingInvites(prev => prev.filter((_, idx) => idx !== row.index));
    else setTeamAdminInvites(prev => prev.filter(i => i.key !== row.sourceKey));
  }

  function handleRemove(row) {
    setRemoveTarget(row);
  }

  function confirmRemove() {
    setActionToast(`${removeTarget.email} removed as ${removeTarget.type}`);
    setCenterAdmins(prev => prev.filter(a => a.key !== removeTarget.adminKey));
  }

  if (profileUser) {
    return (
      <div className={styles.subFadeIn}>
        <UserCard
          user={profileUser}
          backLabel="Admins"
          onBack={() => setProfileUser(null)}
          role={role}
        />
      </div>
    );
  }

  return (
    <>
      <InvitationsTable
        description={'Manage administrators for this center and its teams. Use the "+" button above to invite one.'}
        rows={rows}
        typeOptions={['Center admin', 'Team admin']}
        onOpenProfile={row => setProfileUser(adminRowToUser(row))}
        scopeLabel="Team"
        searchPlaceholder="Search..."
        showSent={false}
        emptyTitle="No admins yet"
        emptySubtitle="Admins you invite will appear here."
        onResend={handleResend}
        onCancel={handleCancel}
        onRemove={handleRemove}
        onDeliveryIssue={row => setEmailHistoryRow(row)}
        canViewEmailHistory={canViewEmailHistory}
        canEditUsers={canEditUsers}
        onEditUser={row => setEditUserRow(row)}
        responsiveTable
        bleed
      />
      {emailHistoryRow && (
        <EmailHistoryDrawer
          row={emailHistoryRow}
          onClose={() => setEmailHistoryRow(null)}
          onResend={handleResend}
          onCancel={handleCancel}
        />
      )}
      {editUserRow && (
        <EditUserDrawer
          user={{ name: editUserRow.name ?? '', email: editUserRow.email, status: 'active' }}
          onClose={() => setEditUserRow(null)}
          role={role}
        />
      )}

      {removeTarget && (
        <RemoveAdminModal
          row={{ ...removeTarget, scope: center.name }}
          onClose={() => setRemoveTarget(null)}
          onConfirm={confirmRemove}
        />
      )}

      {actionToast && (
        <Toast message={actionToast} mode="success" onClose={() => setActionToast(null)} />
      )}
    </>
  );
}

// ─── Team detail card ─────────────────────────────────────

const TEAM_PAGE_SIZE = 10;

const BULK_PIN_COPY = {
  on:         { title: 'Turn PIN on for all users?',   confirmLabel: 'Turn on' },
  off:        { title: 'Turn PIN off for all users?',  confirmLabel: 'Turn off' },
};

function RemoveTeamMemberModal({ member, team, onClose, onConfirm }) {
  return (
    <div className={dstyles.overlay} onMouseDown={onClose}>
      <div className={dstyles.modal} onMouseDown={e => e.stopPropagation()}>
        <div className={dstyles.content}>
          <h2 className={dstyles.title}>Remove from team</h2>
          <p className={dstyles.body}>
            Are you sure you want to remove <strong className={dstyles.orgName}>{member.name}</strong> from {team.name}?
            They'll keep their Kamleon account — they just won't be part of this team anymore.
          </p>
        </div>
        <div className={dstyles.actions}>
          <button className={dstyles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={dstyles.deleteBtn} onClick={() => { onConfirm?.(); onClose(); }}>Remove</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmBulkPinModal({ action, team, count, onClose, onConfirm }) {
  const copy = BULK_PIN_COPY[action];
  const body = action === 'on'
    ? `This will turn PIN on for all ${count} users in ${team.name}.`
    : `This will turn PIN off for all ${count} users in ${team.name}. They won't be able to log in with a PIN until it's turned back on.`;
  return (
    <div className={dstyles.overlay} onMouseDown={onClose}>
      <div className={dstyles.modal} onMouseDown={e => e.stopPropagation()}>
        <div className={dstyles.content}>
          <h2 className={dstyles.title}>{copy.title}</h2>
          <p className={dstyles.body}>{body}</p>
        </div>
        <div className={dstyles.actions}>
          <button className={dstyles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={dstyles.confirmBtn} onClick={() => { onConfirm?.(); onClose(); }}>{copy.confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function TeamCard({ team, center, org, onBack, onSelectUser, onNewUser, onEdit, onDelete, isMobile = false, role, removedMemberIds }) {
  // teams.edit / teams.delete / users.invite: exclusivos de Center Admin (y Owner/Admin por bypass) —
  // Editor y Org Admin son solo-lectura en este bloque (docs/permissions.md, Bloque: Teams / Users).
  const canManageTeam = role === 'owner' || role === 'admin' || role === 'centerAdmin';
  const [search, setSearch]         = useState('');
  const [filters, setFilters]       = useState({ role: new Set(), status: new Set() });
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage]             = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editUserTarget, setEditUserTarget] = useState(null);
  const [removeUserTarget, setRemoveUserTarget] = useState(null);
  const [bulkOpen, setBulkOpen]     = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState(null);
  const [actionToast, setActionToast] = useState(null);
  const menuRefs   = useRef({});
  const filterRef  = useRef(null);
  const bulkRef    = useRef(null);

  useEffect(() => {
    if (!openMenuId) return;
    function handleClick(e) {
      const ref = menuRefs.current[openMenuId];
      if (ref && !ref.contains(e.target)) setOpenMenuId(null);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenuId]);

  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

  useEffect(() => {
    if (!bulkOpen) return;
    function handleClick(e) {
      if (bulkRef.current && !bulkRef.current.contains(e.target)) setBulkOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [bulkOpen]);

  // El equipo tiene dos tabs, como el centro: los jugadores por un lado y quien administra el
  // equipo por otro. Antes los team admins salían mezclados en la tabla de miembros, con
  // columnas de PIN y Screen que no les aplican, y sus invitaciones pendientes aparecían como
  // filas de miembro con guiones.
  const [teamTab, setTeamTab] = useState('users');

  const [allMembers, setAllMembers] = useState(() => {
    const userIds = new Set(team.users ?? []);
    const profIds = new Set(team.professionalIds ?? []);
    return USERS_POOL
      .filter(u => userIds.has(u.id) || profIds.has(u.id))
      .map(u => ({ ...u, role: profIds.has(u.id) ? 'Team admin' : 'User' }));
  });
  // Invitaciones pendientes para este equipo (User y Team Admin) — estado local, mismo
  // criterio que allMembers: esta pantalla maneja sus propios datos sin sincronizar con el
  // tab Admins del Centro (decisión a propósito: gestionar la misma invitación desde acá o
  // desde Admins es redundante pero no rompe nada, evita saltar de tab en tab).
  const [pendingInvites, setPendingInvites] = useState(() => team.pendingInvites ?? []);
  const [teamAdminInvites, setTeamAdminInvites] = useState(() => team.pendingProfessionalInvites ?? []);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [showInviteTeamAdminDrawer, setShowInviteTeamAdminDrawer] = useState(false);
  const createMenuRef = useRef(null);

  useEffect(() => {
    if (!createMenuOpen) return;
    function handleClick(e) {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target)) setCreateMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [createMenuOpen]);

  function handleResendInvite(invite) {
    setActionToast(`Invitation resent to ${invite.email}`);
  }

  function handleResendTeamAdminInvite(invite) {
    setActionToast(`Invitation resent to ${invite.email}`);
  }

  function handleCancelTeamAdminInvite(invite) {
    setActionToast(`Invitation to ${invite.email} cancelled`);
    setTeamAdminInvites(prev => prev.filter(i => i.email !== invite.email));
  }

  function handleCancelInvite(invite) {
    setActionToast(`Invitation to ${invite.email} cancelled`);
    setPendingInvites(prev => prev.filter(i => i.email !== invite.email));
  }

  function togglePin(member) {
    setAllMembers(prev => prev.map(m => m.id === member.id ? { ...m, pin: !m.pin } : m));
    setActionToast(`PIN turned ${member.pin ? 'off' : 'on'} for ${member.name}`);
  }

  function toggleVisibleOnScreen(member) {
    const wasVisible = member.visibleOnScreen ?? true;
    setAllMembers(prev => prev.map(m => m.id === member.id ? { ...m, visibleOnScreen: !wasVisible } : m));
    setActionToast(`${member.name} ${wasVisible ? 'hidden from' : 'shown on'} screen`);
  }

  function removeMember(member) {
    setAllMembers(prev => prev.filter(m => m.id !== member.id));
    setActionToast(`${member.name} removed from ${team.name}`);
  }

  function bulkSetPin(value) {
    setAllMembers(prev => prev.map(m => ({ ...m, pin: value })));
    setActionToast(`PIN turned ${value ? 'on' : 'off'} for all users`);
  }

  function toggleFilter(group, value) {
    setFilters(prev => {
      const next = new Set(prev[group]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [group]: next };
    });
    setPage(1);
  }

  function clearFilters() { setFilters({ role: new Set(), status: new Set() }); setPage(1); }

  const activeFilterCount = filters.role.size + filters.status.size;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allMembers.filter(m => {
      if (m.role === 'Team admin') return false;     // viven en el tab Admins
      if (removedMemberIds?.has(m.id)) return false; // quitado desde su perfil
      if (q && !m.name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) return false;
      if (filters.role.size   > 0 && !filters.role.has(m.role))     return false;
      if (filters.status.size > 0 && !filters.status.has(m.status)) return false;
      return true;
    });
  }, [allMembers, search, filters, removedMemberIds]);

  const adminRows = [
    ...teamAdminInvites.map((invite, i) => ({
      key: `team-admin-pending-${invite.email}-${i}`, sourceKey: invite.key, kind: 'pending',
      email: invite.email, type: 'Team admin', status: 'pending',
      sentAgo: invite.sentAgo ?? '—',
    })),
    ...allMembers
      .filter(m => m.role === 'Team admin' && !removedMemberIds?.has(m.id))
      .map(m => ({
        key: `team-admin-active-${m.id}`, memberId: m.id, kind: 'active',
        email: m.email, name: m.name, type: 'Team admin', status: 'active',
      })),
  ];

  const totalPages  = Math.max(1, Math.ceil(filtered.length / TEAM_PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const pageMembers = filtered.slice((safePage - 1) * TEAM_PAGE_SIZE, safePage * TEAM_PAGE_SIZE);

  function handleSearch(val) { setSearch(val); setPage(1); }

  return (
    <div className={`${styles.centerCard} ${styles.teamCard}`}>

      {/* ── Fixed header ── */}
      <div className={styles.innerHeader}>

        {!isMobile && (
          <button className={`${styles.backBtn} ${styles.teamBackBtn}`} onClick={onBack}>
            <span className={styles.backIcon}><ArrowLeftIcon /></span>
            <span className={styles.backLabel}>Back to Teams</span>
          </button>
        )}

        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <div className={styles.cardAvatar}>{team.name.charAt(0)}</div>
            <div className={styles.cardTitleGroup}>
              <h2 className={styles.cardTitle}>{team.name}</h2>
              <div className={styles.cardSubtitle}>
                <span>{center.name}</span>
                <span className={styles.separator}>|</span>
                <div className={styles.statusBadgeSmall}>
                  <div className={`${styles.statusDot} ${styles[team.status]}`} />
                  <span>{team.status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.cardActions}>
            {canManageTeam && (
              <div className={styles.createMenuAnchor} ref={createMenuRef}>
                <span className={createMenuOpen ? styles.createTriggerHidden : ''}>
                  <IconButton aria-label="Create" tooltip="Create" onClick={() => setCreateMenuOpen(v => !v)}>
                    <IconPlus size={16} />
                  </IconButton>
                </span>
                {createMenuOpen && (
                  <div className={styles.cardCreateMenu}>
                    <ContextMenu
                      items={[
                        { label: 'New Team Admin', icon: <IconPlus size={16} />, onClick: () => { setCreateMenuOpen(false); setShowInviteTeamAdminDrawer(true); } },
                        { label: 'New User/Member', icon: <IconPlus size={16} />, onClick: () => { setCreateMenuOpen(false); onNewUser(); } },
                      ]}
                    />
                  </div>
                )}
              </div>
            )}
            {canManageTeam && (
              <IconButton aria-label="Team settings" tooltip="Settings" onClick={onEdit}>
                <IconSettings size={16} />
              </IconButton>
            )}
            {canManageTeam && (
              <IconButton aria-label="Delete team" tooltip="Delete" variant="danger" onClick={onDelete}>
                <IconTrash size={16} />
              </IconButton>
            )}
          </div>
        </div>

      </div>

      {/* ── Tabs: jugadores y administradores del equipo ── */}
      <div className={styles.innerTabBarWrap}>
        <div className={`${styles.innerTabBarInner} ${styles.innerTabBarInnerTwo}`}>
          <TabBar
            tabs={[
              { id: 'users',  label: 'Users' },
              { id: 'admins', label: 'Admins', hasDot: teamAdminInvites.length > 0 },
            ]}
            activeTab={teamTab}
            onChange={setTeamTab}
            size="s"
          />
        </div>
      </div>

      {teamTab === 'admins' ? (
        <div className={styles.teamContent}>
          <InvitationsTable
            description={'Manage the administrators of this team. Use the "+" button above to invite one.'}
            rows={adminRows}
            showType={false}
            showScope={false}
            showSent={false}
            searchPlaceholder="Search..."
            emptyTitle="No team admins yet"
            emptySubtitle="Admins you invite will appear here."
            canEditUsers={canManageTeam}
            onResend={row => setActionToast(`Invitation resent to ${row.email}`)}
            onCancel={row => {
              setActionToast(`Invitation to ${row.email} cancelled`);
              setTeamAdminInvites(prev => prev.filter(i => i.key !== row.sourceKey));
            }}
            onRemove={row => setActionToast(`${row.email} removed as Team admin`)}
            onEditUser={row => {
              const member = allMembers.find(m => m.id === row.memberId);
              if (member) setEditUserTarget(member);
            }}
          />
        </div>
      ) : (
      <div className={`${styles.teamContent} ${styles.membersTab}`}>

        <div className={styles.teamToolbar}>
          <SearchBar
            placeholder="Search..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            onClear={() => handleSearch('')}
          />
          <div className={styles.filterWrap} ref={filterRef}>
            <ToolbarButton
              icon={<IconFilter size={16} />}
              selected={activeFilterCount > 0}
              onClick={() => setFilterOpen(v => !v)}
            >
              Filters
              {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
            </ToolbarButton>
            {filterOpen && (
              <div className={styles.filterDropdown}>
                <div className={styles.filterSection}>
                  <p className={styles.filterSectionLabel}>Role</p>
                  {[{ v: 'Team admin', label: 'Team admin' }, { v: 'User', label: 'User' }].map(({ v, label }) => (
                    <label key={v} className={`${styles.filterOption} ${filters.role.has(v) ? styles.filterOptionChecked : ''}`}>
                      <input type="checkbox" className={styles.nativeCheck} checked={filters.role.has(v)} onChange={() => toggleFilter('role', v)} />
                      <span className={styles.checkBox}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className={styles.checkMark} aria-hidden="true">
                          <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className={styles.optionLabel}>{label}</span>
                    </label>
                  ))}
                </div>
                {role !== 'centerAdmin' && (
                  <div className={styles.filterSection}>
                    <p className={styles.filterSectionLabel}>Status</p>
                    {[{ v: 'active', label: 'Active' }, { v: 'inactive', label: 'Inactive' }].map(({ v, label }) => (
                      <label key={v} className={`${styles.filterOption} ${filters.status.has(v) ? styles.filterOptionChecked : ''}`}>
                        <input type="checkbox" className={styles.nativeCheck} checked={filters.status.has(v)} onChange={() => toggleFilter('status', v)} />
                        <span className={styles.checkBox}>
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className={styles.checkMark} aria-hidden="true">
                            <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className={styles.optionLabel}>{label}</span>
                      </label>
                    ))}
                  </div>
                )}
                {activeFilterCount > 0 && (
                  <button className={styles.clearFilters} onClick={clearFilters}>Clear filters</button>
                )}
              </div>
            )}
          </div>
          {canManageTeam && (
            <div className={`${styles.filterWrap} ${styles.bulkActionsWrap}`} ref={bulkRef}>
              <ToolbarButton onClick={() => setBulkOpen(v => !v)}>
                Bulk actions
              </ToolbarButton>
              {bulkOpen && (
                <div className={styles.bulkActionsMenu}>
                  <ContextMenu
                    items={[
                      { label: 'Turn PIN on for all users', onClick: () => { setBulkOpen(false); setBulkConfirm('on'); } },
                      { label: 'Turn PIN off for all users', onClick: () => { setBulkOpen(false); setBulkConfirm('off'); } },
                    ]}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {(filtered.length === 0 && pendingInvites.length === 0 && search === '') ? (
          <InnerEmptyState
            title="No members yet..."
            subtitle="Add users to this team to see them here"
          />
        ) : (pageMembers.length > 0 || pendingInvites.length > 0) ? (
          <div className={styles.teamTable}>
            <div className={styles.teamTableHead}>
              <span className={`${styles.teamCol} ${styles.teamColName}`}>Name</span>
              {/* La columna en sí ahora siempre se muestra (la necesitan las filas pendientes,
                  con status "dentro del equipo", no el status real de cuenta). Para Center Admin
                  el status real de los miembros confirmados sigue oculto por fila — mismo criterio
                  que Team Admin (docs/permissions-deviations.md #6): riesgo de cuenta multi-equipo
                  a futuro. */}
              <span className={`${styles.teamCol} ${styles.teamColStatus}`}>
                Status
                {role === 'centerAdmin' && (
                  <span className={styles.infoIconWrap} data-tooltip="Whether they've accepted the invitation to join this team.">
                    <IconInfoCircle size={14} />
                  </span>
                )}
              </span>
              <span className={`${styles.teamCol} ${styles.teamColPin}`}>
                PIN
                <span className={styles.infoIconWrap} data-tooltip="Allow members to log in with a PIN.">
                  <IconInfoCircle size={14} />
                </span>
              </span>
              <span className={`${styles.teamCol} ${styles.teamColScreen}`}>
                Screen
                <span className={styles.infoIconWrap} data-tooltip="Shows this member on the device's roster screen.">
                  <IconInfoCircle size={14} />
                </span>
              </span>
              <span className={`${styles.teamCol} ${styles.teamColActions}`} />
            </div>
            {pendingInvites.map(invite => (
              <div key={`pending-${invite.email}`} className={styles.teamTableRow}>
                <div className={`${styles.teamCol} ${styles.teamColName}`}>
                  <div className={styles.memberAvatar}>{invite.email.charAt(0).toUpperCase()}</div>
                  <div className={styles.memberMeta}>
                    <TruncatedText text={invite.email} textClassName={styles.memberName} />
                    <span className={styles.memberSub}>Invited {invite.sentAgo ?? ''}</span>
                  </div>
                </div>
                <div className={`${styles.teamCol} ${styles.teamColStatus}`}>
                  <Tag status="pending" />
                </div>
                <div className={`${styles.teamCol} ${styles.teamColPin}`}>
                  <span className={styles.pinBadge}>—</span>
                </div>
                <div className={`${styles.teamCol} ${styles.teamColScreen}`}>
                  <span className={styles.pinBadge}>—</span>
                </div>
                <div className={`${styles.teamCol} ${styles.teamColActions}`}>
                  {canManageTeam ? (
                    <>
                      <IconButton aria-label="Resend invitation" tooltip="Resend" onClick={() => handleResendInvite(invite)}>
                        <IconResend size={16} />
                      </IconButton>
                      <IconButton aria-label="Cancel invitation" tooltip="Cancel" onClick={() => handleCancelInvite(invite)}>
                        <IconTrash size={14} />
                      </IconButton>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
            {pageMembers.map(member => {
              const isOpen = openMenuId === member.id;
              return (
                <div
                  key={member.id}
                  className={`${styles.teamTableRow}${isOpen ? ` ${styles.menuOpen}` : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectUser(member)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelectUser(member); }}
                >
                  <div className={`${styles.teamCol} ${styles.teamColName}`}>
                    <div className={styles.memberAvatar}>{member.name.charAt(0)}</div>
                    <div className={styles.memberMeta}>
                      <span className={styles.memberName}>{member.name}</span>
                      <span className={styles.memberSub}>{member.jerseyNumber ? `#${member.jerseyNumber} | ${member.role}` : member.role}</span>
                    </div>
                  </div>
                  <div className={`${styles.teamCol} ${styles.teamColStatus}`}>
                    {/* Para Center Admin esto es status DENTRO DEL EQUIPO (si ya es miembro
                        confirmado), no el status real de la cuenta Kamleon — ese sigue oculto
                        (docs/permissions-deviations.md #6). Para el resto de los roles sí es
                        el status real de cuenta. */}
                    <Tag status={role !== 'centerAdmin' ? member.status : 'active'} />
                  </div>
                  <div className={`${styles.teamCol} ${styles.teamColPin}`}>
                    <span className={`${styles.pinBadge} ${member.pin ? styles.pinBadgeOn : ''}`}>{member.pin ? 'On' : 'Off'}</span>
                  </div>
                  <div className={`${styles.teamCol} ${styles.teamColScreen}`}>
                    <span className={`${styles.pinBadge} ${(member.visibleOnScreen ?? true) ? styles.pinBadgeOn : ''}`}>{(member.visibleOnScreen ?? true) ? 'On' : 'Off'}</span>
                  </div>
                  <div
                    className={`${styles.teamCol} ${styles.teamColActions}`}
                    ref={el => { menuRefs.current[member.id] = el; }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* teams.users.edit/remove/togglePin: exclusivo de Center Admin
                        (y Owner/Admin) — Org Admin y Editor son solo-lectura acá (docs/permissions.md,
                        Bloque: Teams), así que ni siquiera ven el botón "···". */}
                    {canManageTeam && (
                    <div className={styles.teamRowMenuAnchor}>
                      <span className={isOpen ? styles.createTriggerHidden : ''}>
  <IconButton
                          aria-label="Member options"
                          tooltip="More"
                          onClick={() => setOpenMenuId(isOpen ? null : member.id)}
                        >
                          <IconMore size={16} />
                        </IconButton>
                      </span>
                      {isOpen && (
                        <div className={styles.teamRowMenu}>
                          <ContextMenu
                            items={[
                              { label: 'Edit user', icon: <IconEdit size={16} />, onClick: () => { setOpenMenuId(null); setEditUserTarget(member); } },
                              { label: member.pin ? 'Turn off PIN' : 'Turn on PIN', icon: <IconPower size={16} />, onClick: () => { setOpenMenuId(null); togglePin(member); } },
                              { label: (member.visibleOnScreen ?? true) ? 'Hide from screen' : 'Show on screen', icon: (member.visibleOnScreen ?? true) ? <IconEyeClosed size={16} /> : <IconEye size={16} />, onClick: () => { setOpenMenuId(null); toggleVisibleOnScreen(member); } },
                              { label: 'Remove from team', icon: <IconTrash size={16} />, variant: 'danger', onClick: () => { setOpenMenuId(null); setRemoveUserTarget(member); } },
                            ]}
                          />
                        </div>
                      )}
                    </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <InnerEmptyState
            title="No results"
            subtitle={`No members match "${search}"`}
          />
        )}

        {filtered.length > TEAM_PAGE_SIZE && (
          <div className={styles.teamPagination}>
            <span className={styles.paginationInfo}>
              Showing <strong>{(safePage - 1) * TEAM_PAGE_SIZE + 1}–{Math.min(safePage * TEAM_PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong> members
            </span>
            <div className={styles.paginationBtns}>
              <button className={styles.paginationBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>Previous</button>
              <button className={styles.paginationBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>Next</button>
            </div>
          </div>
        )}

      </div>
      )}

      {editUserTarget && (
        <EditUserDrawer user={editUserTarget} team={team} onClose={() => setEditUserTarget(null)} role="centerAdmin" />
      )}

      {removeUserTarget && (
        <RemoveTeamMemberModal
          member={removeUserTarget}
          team={team}
          onClose={() => setRemoveUserTarget(null)}
          onConfirm={() => removeMember(removeUserTarget)}
        />
      )}

      {bulkConfirm && (
        <ConfirmBulkPinModal
          action={bulkConfirm}
          team={team}
          count={allMembers.length}
          onClose={() => setBulkConfirm(null)}
          onConfirm={() => bulkSetPin(bulkConfirm === 'on')}
        />
      )}

      {showInviteTeamAdminDrawer && (
        <InviteTeamAdminDrawer
          center={center}
          presetTeam={team}
          onClose={() => setShowInviteTeamAdminDrawer(false)}
          onSave={(_selectedTeam, emails) => {
            setTeamAdminInvites(prev => [...prev, ...emails.map(email => ({ email }))]);
            setActionToast(emails.length === 1 ? 'Invitation sent' : `${emails.length} invitations sent`);
          }}
        />
      )}

      {actionToast && (
        <Toast message={actionToast} mode="success" onClose={() => setActionToast(null)} />
      )}

    </div>
  );
}

// ─── User detail card ─────────────────────────────────────

// Figma: Web App 2.0 → "User profile" (nodo 12579:275097). Es el perfil agnóstico: el mismo
// que ve Kamleon staff y el propio usuario en Account details, ahora también al entrar a una
// persona desde un equipo. En el Figma el contenedor es un modal con X; acá vive como panel
// del master-detail, así que la X se reemplaza por el "back" de siempre (decisión de Daniel).
function UserCard({ user, team, backLabel, onBack, isMobile = false, role, onRemoveFromTeam }) {
  const [showEdit, setShowEdit] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [actionToast, setActionToast] = useState(null);

  // users.editData / teams.users.remove: Center Admin (y Owner/Admin por bypass). Org Admin y
  // Editor entran en solo-lectura (docs/permissions.md).
  const canManageUser = role === 'owner' || role === 'admin' || role === 'centerAdmin';

  // El modelo guarda un solo "name"; Name/Surname se parten solo para mostrarlos, igual que
  // hace EditUserDrawer.
  const [firstName, ...restName] = (user.name ?? '').split(' ');
  const initials = `${firstName?.charAt(0) ?? ''}${(restName[restName.length - 1] ?? '').charAt(0)}`.toUpperCase() || (user.name ?? '?').charAt(0);
  const screenOn = user.visibleOnScreen ?? true;

  const fields = [
    ['Email', user.email],
    ['Phone number', user.phone],
    ['Date of birth', user.birthday],
    ['Gender', user.gender],
    ['Height', user.height],
    ['Weight', user.weight],
  ];

  return (
    <div className={styles.centerCard}>

      {/* ── Fixed header ── */}
      <div className={styles.innerHeader}>

        {!isMobile && (
          <button className={`${styles.backBtn} ${styles.teamBackBtn}`} onClick={onBack}>
            <span className={styles.backIcon}><ArrowLeftIcon /></span>
            <span className={styles.backLabel}>Back to {backLabel ?? team?.name}</span>
          </button>
        )}

        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>User profile</h2>
          {canManageUser && (
            <div className={styles.cardActions}>
              <IconButton aria-label="Edit user" tooltip="Edit" onClick={() => setShowEdit(true)}>
                <IconEdit size={16} />
              </IconButton>
            </div>
          )}
        </div>

      </div>

      {/* ── Scrollable content ── */}
      <div className={styles.userContent}>

        <div className={styles.profileHero}>
          <div className={styles.profileAvatar}>{initials}</div>
          <div className={styles.profileIdentity}>
            <span className={styles.profileName}>{user.name}</span>
            {/* El correo no va acá: vive como campo dentro de Account (Figma 12394:487494). */}
            <div className={styles.profileMeta}>
              <span className={styles.profileStatus}>
                <span className={`${styles.statusDot} ${styles[user.status]}`} />
                {user.status === 'active' ? 'Active' : 'Inactive'}
              </span>
              {user.jerseyNumber != null && (
                <>
                  <span className={styles.profileMetaSep}>|</span>
                  <span>#{user.jerseyNumber}</span>
                </>
              )}
              <span className={styles.profileMetaSep}>|</span>
              <span>Joined: {user.dateAdded ?? '—'}</span>
            </div>
          </div>
        </div>

        <section className={styles.profileSection}>
          {/* En Figma "Account" es una etiqueta pequeña en mayúsculas, no un título como
              Permissions o Security. */}
          <p className={styles.profileSectionLabel}>Account</p>
          <div className={styles.profileGrid}>
            {fields.map(([label, value]) => (
              <div key={label} className={styles.profileField}>
                <span className={styles.profileFieldLabel}>{label}</span>
                <span className={styles.profileFieldValue}>{value || '—'}</span>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.profileDivider} />

        <section className={styles.profileSection}>
          <div className={styles.profileSectionHeader}>
            <h3 className={styles.profileSectionTitle}>Permissions</h3>
            {canManageUser && (
              <IconButton aria-label="Edit permissions" tooltip="Edit" onClick={() => setShowEdit(true)}>
                <IconEdit size={16} />
              </IconButton>
            )}
          </div>
          <div className={styles.profileGrid}>
            <div className={styles.profileField}>
              <span className={styles.profileFieldLabel}>Show this user on the screen</span>
              <span className={styles.profilePill}>Screen: {screenOn ? 'On' : 'Off'}</span>
            </div>
            <div className={styles.profileField}>
              <span className={styles.profileFieldLabel}>Allow this user to log in with PIN</span>
              <span className={styles.profilePill}>PIN: {user.pin ? 'On' : 'Off'}</span>
            </div>
          </div>
        </section>

        {canManageUser && (
          <>
            <div className={styles.profileDivider} />

            <section className={styles.profileSection}>
              <h3 className={styles.profileSectionTitle}>Security</h3>
              <button
                className={styles.profileLink}
                onClick={() => setActionToast(`Password reset sent to ${user.name}`)}
              >
                Change password
              </button>
              <div className={styles.profileLinkRow}>
                <button
                  className={styles.profileLink}
                  onClick={() => setActionToast(`New PIN sent to ${user.name}`)}
                >
                  Set New Pin
                </button>
                <span className={styles.profileLinkSep}>|</span>
                <button
                  className={styles.profileLink}
                  onClick={() => setActionToast(`PIN sheet downloaded for ${user.name}`)}
                >
                  Download PIN sheet
                </button>
              </div>
            </section>

            {team && (
              <>
                <div className={styles.profileDivider} />
                <button className={styles.profileDangerLink} onClick={() => setRemoveOpen(true)}>
                  Remove from team
                </button>
              </>
            )}
          </>
        )}

      </div>

      {showEdit && <EditUserDrawer user={user} team={team} onClose={() => setShowEdit(false)} />}

      {removeOpen && (
        <RemoveTeamMemberModal
          member={user}
          team={team}
          onClose={() => setRemoveOpen(false)}
          onConfirm={() => { onRemoveFromTeam?.(user); onBack?.(); }}
        />
      )}

      {actionToast && (
        <Toast message={actionToast} mode="success" onClose={() => setActionToast(null)} />
      )}

    </div>
  );
}

// ─── Main component ───────────────────────────────────────

export default function OrgDetailV2({ org, onBack, initialCenter, initialTeam, initialUser, isMobile = false, isCenterAdmin = false, role, currentUserEmail }) {
  const canDeleteOrg = role === 'owner' || role === 'admin'; // organizations.delete: exclusivo de Owner/Admin (ni Editor lo tiene)
  const canCreateCenter = role !== 'orgAdmin' && role !== 'centerAdmin'; // organizations.centers.create: nadie del lado cliente lo tiene
  const canGoBackToList = role !== 'orgAdmin'; // Org Admin no tiene lista de orgs a la que volver
  // organizations.admins.invite/resend/delete: exclusivo de Org Admin (docs/permissions.md, Bloque: Organizations).
  const canManageOrgAdmins = role === 'owner' || role === 'admin' || role === 'orgAdmin';
  // Tab "Units" a nivel de org: exclusivo de Org Admin (y Owner/Admin por bypass) — reemplaza el
  // ítem "Units" del sidebar para este rol, que quedaba redundante con Center control (mismo contenido,
  // ver HIDDEN_NAV_ITEMS en rolePersonas.js).
  const canViewOrgUnits = role === 'owner' || role === 'admin' || role === 'orgAdmin';
  const [showEditDrawer, setShowEditDrawer]   = useState(false);
  const [showAddAdminDrawer, setShowAddAdminDrawer] = useState(false);
  const [showInviteCenterAdmin, setShowInviteCenterAdmin] = useState(false);
  const [createMenuOpen, setCreateMenuOpen]   = useState(false);
  const createMenuRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // En 390 la cabecera deja a la vista solo el "+" y manda Settings/Delete a un menú "⋯":
  // acción principal visible, secundarias y destructivas en desbordamiento (así el botón de
  // borrar deja de estar a un dedo del de crear). En tablet hay lugar para los tres.
  const [isPhone, setIsPhone] = useState(() => window.matchMedia('(max-width: 390px)').matches);
  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const orgMenuRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 390px)');
    const onChange = e => setIsPhone(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!orgMenuOpen) return;
    function handleClick(e) {
      if (orgMenuRef.current && !orgMenuRef.current.contains(e.target)) setOrgMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [orgMenuOpen]);

  // Acciones de la cabecera que se van al "⋯" en 390.
  const orgOverflowItems = [
    { label: 'Org settings', icon: <IconSettings size={16} />, onClick: () => { setOrgMenuOpen(false); setShowEditDrawer(true); } },
    ...(canDeleteOrg ? [{ label: 'Delete organization', icon: <IconTrash size={16} />, variant: 'danger', onClick: () => { setOrgMenuOpen(false); setShowDeleteModal(true); } }] : []),
  ];

  const orgOverflowMenu = (
    <div className={styles.createMenuAnchor} ref={orgMenuRef}>
      <IconButton aria-label="More actions" tooltip="More" tooltipPosition="left" onClick={() => setOrgMenuOpen(v => !v)}>
        <IconMore size={16} />
      </IconButton>
      {orgMenuOpen && (
        <div className={styles.cardCreateMenu}>
          <ContextMenu items={orgOverflowItems} />
        </div>
      )}
    </div>
  );
  const [orgTab, setOrgTab]                   = useState('centers');
  const [pendingInvites, setPendingInvites]   = useState(org.pendingInvites ?? []);
  const [centerAdminInvites, setCenterAdminInvites] = useState(() =>
    (org.centers ?? []).flatMap(center =>
      (center.pendingInvites ?? []).map((invite, i) => ({ ...invite, centerId: center.id, centerName: center.name, key: `${center.id}-${i}` }))
    )
  );
  // Admins de organización ya confirmados (invitación aceptada) — se muestran en el
  // tab Invitations junto a los pendientes, con acción "Remove" en vez de Resend/Cancel.
  const [orgAdmins, setOrgAdmins] = useState(() =>
    (org.admins ?? []).map((a, i) => ({ ...a, key: `org-admin-${i}` }))
  );
  const [adminInviteToast, setAdminInviteToast] = useState(null);
  const orgTabs = [
    ...ORG_TABS,
    ...(canViewOrgUnits ? [{ id: 'units', label: 'Units' }] : []),
    ...(canManageOrgAdmins ? [{ id: 'invitations', label: 'Admins', hasDot: pendingInvites.length > 0 || centerAdminInvites.length > 0 }] : []),
  ];

  useEffect(() => {
    if (!createMenuOpen) return;
    function handleClick(e) {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target)) setCreateMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [createMenuOpen]);

  function handleSaveOrgAdminInvite(emails) {
    setPendingInvites(prev => [...prev, ...emails.map(email => ({ email, sentAgo: formatSentDate(), sentMinutesAgo: 0 }))]);
    setAdminInviteToast(emails.length === 1 ? 'Invitation sent' : `${emails.length} invitations sent`);
  }

  function handleSaveCenterAdminInvite(center, emails) {
    setCenterAdminInvites(prev => [
      ...prev,
      ...emails.map((email, i) => ({ email, sentAgo: formatSentDate(), sentMinutesAgo: 0, centerId: center.id, centerName: center.name, key: `${center.id}-new-${prev.length + i}` })),
    ]);
    setAdminInviteToast(emails.length === 1 ? 'Invitation sent' : `${emails.length} invitations sent`);
  }

  return (
    <div className={styles.container}>

      {/* ── Header card ── */}
      {isCenterAdmin ? (
        // Header propio de Center Admin (sin status de la org — no le aporta nada a
        // un rol cliente que ni siquiera administra la org, solo sus centros dentro
        // de ella; mismo criterio que el header de Org Admin más abajo).
        <div className={styles.headerCard}>
          <div className={styles.headerInner}>
            <div className={styles.orgLeft}>
              <div className={styles.orgAvatar}>{org.name.charAt(0)}</div>
              <div className={styles.orgMeta}>
                <span className={styles.orgEyebrow}>Your organization:</span>
                <h1 className={styles.orgName}>{org.name}</h1>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.headerCard}>
          <div className={styles.headerInner}>

            {canGoBackToList && (
              <button className={styles.backBtn} onClick={onBack}>
                <span className={styles.backIcon}><ArrowLeftIcon /></span>
                <span className={styles.backLabel}>Back</span>
              </button>
            )}

            {role === 'orgAdmin' ? (
              // Header propio de Org Admin (sin segmento ni status de la org — no le aportan
              // nada a un rol cliente, eran resabios de la vista pensada para Kamleon staff).
              <div className={styles.orgRow}>
                <div className={styles.orgLeft}>
                  <div className={styles.orgAvatar}>{org.name.charAt(0)}</div>
                  <div className={styles.orgMeta}>
                    <span className={styles.orgEyebrow}>Your organization:</span>
                    <h1 className={styles.orgName}>{org.name}</h1>
                  </div>
                </div>
                <div className={styles.orgActions}>
                  <div className={styles.createMenuAnchor} ref={createMenuRef}>
                    <span className={createMenuOpen ? styles.createTriggerHidden : ''}>
                      <IconButton
                        aria-label="Create"
                        tooltip="Create"
                        tooltipPosition="left"
                        onClick={() => setCreateMenuOpen(v => !v)}
                      >
                        <IconPlus size={16} />
                      </IconButton>
                    </span>
                    {createMenuOpen && (
                      <div className={styles.cardCreateMenu}>
                        <ContextMenu
                          items={[
                            { label: 'Org Admin', icon: <IconPlus size={16} />, onClick: () => { setCreateMenuOpen(false); setShowAddAdminDrawer(true); } },
                            { label: 'Center Admin', icon: <IconPlus size={16} />, onClick: () => { setCreateMenuOpen(false); setShowInviteCenterAdmin(true); } },
                          ]}
                        />
                      </div>
                    )}
                  </div>
                  {isPhone ? orgOverflowMenu : (
                    <IconButton aria-label="Org settings" tooltip="Org settings" tooltipPosition="left" onClick={() => setShowEditDrawer(true)} data-tour-id="org-settings">
                      <IconSettings size={16} />
                    </IconButton>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.orgRow}>
                <div className={styles.orgLeft}>
                  <div className={styles.orgAvatar}>{org.name.charAt(0)}</div>
                  <div className={styles.orgMeta}>
                    <h1 className={styles.orgName}>{org.name}</h1>
                    <div className={styles.orgSubtitle}>
                      <span>{org.segments}</span>
                      <span className={styles.separator}>|</span>
                      <div className={styles.statusBadge}>
                        <div className={`${styles.statusDot} ${styles[org.status]}`} />
                        <span>{org.status === 'active' ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.orgActions}>
                  {/* Owner/Admin tienen bypass total (docs/permissions.md), así que también
                      invitan admins — faltaba el "+" en la cabecera de staff: veían el tab
                      Admins y podían reenviar/cancelar/quitar, pero no crear. */}
                  {canManageOrgAdmins && (
                    <div className={styles.createMenuAnchor} ref={createMenuRef}>
                      <span className={createMenuOpen ? styles.createTriggerHidden : ''}>
                        <IconButton
                          aria-label="Create"
                          tooltip="Create"
                          tooltipPosition="left"
                          onClick={() => setCreateMenuOpen(v => !v)}
                        >
                          <IconPlus size={16} />
                        </IconButton>
                      </span>
                      {createMenuOpen && (
                        <div className={styles.cardCreateMenu}>
                          <ContextMenu
                            items={[
                              { label: 'Org Admin', icon: <IconPlus size={16} />, onClick: () => { setCreateMenuOpen(false); setShowAddAdminDrawer(true); } },
                              { label: 'Center Admin', icon: <IconPlus size={16} />, onClick: () => { setCreateMenuOpen(false); setShowInviteCenterAdmin(true); } },
                            ]}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {isPhone ? orgOverflowMenu : (
                    <>
                      <IconButton aria-label="Org settings" tooltip="Org settings" tooltipPosition="left" onClick={() => setShowEditDrawer(true)} data-tour-id="org-settings">
                        <IconSettings size={16} />
                      </IconButton>
                      {canDeleteOrg && (
                        <IconButton aria-label="Eliminar organización" tooltip="Delete" tooltipPosition="left" variant="danger" onClick={() => setShowDeleteModal(true)}>
                          <IconTrash size={16} />
                        </IconButton>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

          </div>

          <div className={`${styles.headerTabBarWrap} ${orgTabs.length > 3 ? styles.headerTabBarWrapWide : ''}`} data-tour-id="org-tabs">
            {/* En touch el TabBar pasa solo a M y a scroll (regla del componente). Figma
                12818:85822 → 610px de ancho en tablet. inset: este contenedor no tiene padding. */}
            <TabBar tabs={orgTabs} activeTab={orgTab} onChange={setOrgTab} size="s" inset={16} />
          </div>

        </div>
      )}

      {/* ── Content card ── */}
      <div className={styles.contentCard}>
        {orgTab === 'centers' && (
          <CentersContent
            org={org}
            initialCenter={initialCenter}
            initialTeam={initialTeam}
            initialUser={initialUser}
            isMobile={isMobile}
            canCreateCenter={canCreateCenter}
            role={role}
            onSaveCenterAdminInvite={handleSaveCenterAdminInvite}
            currentUserEmail={currentUserEmail}
          />
        )}
        {orgTab === 'users'   && <OrgUsersTab org={org} role={role} />}
        {orgTab === 'details' && <OrgDetailsTab org={org} />}
        {orgTab === 'invitations' && canManageOrgAdmins && (
          <OrgInvitationsTab
            pendingInvites={pendingInvites}
            setPendingInvites={setPendingInvites}
            centerAdminInvites={centerAdminInvites}
            setCenterAdminInvites={setCenterAdminInvites}
            orgAdmins={orgAdmins}
            setOrgAdmins={setOrgAdmins}
            currentUserEmail={currentUserEmail}
            role={role}
          />
        )}
        {orgTab === 'units' && canViewOrgUnits && (
          <GlobalUnitsTab role={role} org={org} embedded />
        )}
      </div>

      {showEditDrawer  && <EditOrgDrawer  org={org} onClose={() => setShowEditDrawer(false)} role={role} />}
      {showAddAdminDrawer && (
        <AddOrgAdminDrawer org={org} onClose={() => setShowAddAdminDrawer(false)} onSave={handleSaveOrgAdminInvite} />
      )}
      {showInviteCenterAdmin && (
        <InviteCenterAdminDrawer org={org} onClose={() => setShowInviteCenterAdmin(false)} onSave={handleSaveCenterAdminInvite} />
      )}
      {showDeleteModal && <DeleteOrgModal org={org} requireTyping onClose={() => setShowDeleteModal(false)} onConfirm={onBack} />}
      {adminInviteToast && (
        <Toast message={adminInviteToast} mode="success" onClose={() => setAdminInviteToast(null)} />
      )}
    </div>
  );
}
