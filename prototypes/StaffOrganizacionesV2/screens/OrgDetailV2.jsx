import { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react';
import Tag from '../../../design-system/components/Tag/Tag';
import TabBar from '../../../design-system/components/TabBar/TabBar';
import SearchBar from '../../../design-system/components/SearchBar/SearchBar';
import { IconEdit, IconPlus, IconTrash, IconSettings, IconFilter, IconSort, IconPower, IconRefresh, IconEye, IconEyeClosed, IconMenu, IconClose, IconResend, IconInfoCircle, IconMore } from '../../../design-system/icons/outline';
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
  const [selectedUnit, setSelectedUnit]             = useState(null);
  const [selectedUnitCenter, setSelectedUnitCenter] = useState(null);
  const [selectedUser, setSelectedUser]             = useState(initialUser ?? null);
  const [selectedUserTeam, setSelectedUserTeam]     = useState(null); // set when navigating from Users tab
  const [editCenterTarget, setEditCenterTarget]     = useState(null);
  const [editTeamTarget, setEditTeamTarget]         = useState(null);
  const [teamPatches, setTeamPatches]               = useState({});  // { [teamId]: patch }
  const [teamSaveToast, setTeamSaveToast]           = useState(false);
  const [newTeamCenter, setNewTeamCenter]           = useState(null);
  const [newUserContext, setNewUserContext]          = useState(null); // { center, team? }
  const [inviteCenterAdminFor, setInviteCenterAdminFor] = useState(null); // center — Org Admin invitando desde dentro de un centro
  const [returnTab, setReturnTab]                   = useState('details');
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
    setSelectedUnit(null);
    setSelectedUnitCenter(null);
    setReturnTab('details');
    if (isMobile) setDetailVisible(true);
  }

  function handleBackToCenters() {
    setDetailVisible(false);
    setSelectedTeam(null);
    setSelectedUser(null);
    setSelectedUserTeam(null);
    setSelectedUnit(null);
    setSelectedUnitCenter(null);
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
    : selectedUnit?.id
      ? `unit-${selectedUnit.id}`
      : selectedTeam?.id
        ? `team-${selectedTeam.id}`
        : `center-${selectedId}`;

  const subSlideClass = isMobile
    ? (subSlideDir === 'forward' ? styles.detailSlideIn : styles.detailSlideBack)
    : undefined;

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
                : selectedUnit
                  ? () => { setSubSlideDir('back'); setSelectedUnit(null); setSelectedUnitCenter(null); }
                  : selectedTeam
                    ? () => { setSubSlideDir('back'); setReturnTab('details'); setSelectedTeam(null); setSelectedUser(null); setSelectedUserTeam(null); }
                    : handleBackToCenters
              }
            >
              <span className={styles.mobilePanelBackIcon}><ArrowLeftIcon size={16} /></span>
              <span>
                {selectedUser
                  ? `Back to ${(selectedTeam ?? selectedUserTeam)?.name ?? 'Team'}`
                  : selectedUnit
                    ? 'Back to Units'
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
            />
          ) : selectedUnit ? (
            <UnitCard
              unit={selectedUnit}
              center={selectedUnitCenter}
              onBack={() => { setSubSlideDir('back'); setSelectedUnit(null); setSelectedUnitCenter(null); }}
              isMobile={isMobile}
            />
          ) : selectedTeam ? (
            <TeamCard
              team={selectedTeam}
              center={selectedTeamCenter}
              org={org}
              onBack={() => { setSubSlideDir('back'); setReturnTab('details'); setSelectedTeam(null); setSelectedUser(null); setSelectedUserTeam(null); }}
              onSelectUser={(user) => { setSubSlideDir('forward'); setSelectedUser(user); }}
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
              }}
              onSelectUnit={(unit) => {
                setSubSlideDir('forward');
                setSelectedUnit(unit);
                setSelectedUnitCenter(selected);
                setReturnTab('units');
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

function OrgUsersTab({ org }) {
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

  const allUsers = useMemo(() => {
    const map = new Map();
    (org.centers ?? []).forEach(center => {
      (center.teams ?? []).forEach(team => {
        const userIds = new Set(team.users ?? []);
        const profIds = new Set(team.professionalIds ?? []);
        USERS_POOL.forEach(u => {
          if (!userIds.has(u.id) || map.has(u.id)) return;
          map.set(u.id, { user: u, center, team, role: profIds.has(u.id) ? 'Professional' : 'User' });
        });
      });
    });
    return Array.from(map.values());
  }, [org]);

  const centerOptions = useMemo(
    () => (org.centers ?? []).map(c => ({ v: String(c.id), label: c.name })),
    [org]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allUsers.filter(({ user, center, role }) => {
      if (filters.role.size   > 0 && !filters.role.has(role))                return false;
      if (filters.status.size > 0 && !filters.status.has(user.status))       return false;
      if (filters.center.size > 0 && !filters.center.has(String(center.id))) return false;
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
                {[{ v: 'Professional', label: 'Professional' }, { v: 'User', label: 'User' }].map(({ v, label }) => (
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
          {pageItems.map(({ user, center, team }) => (
            <div
              key={user.id}
              className={styles.teamTableRow}
              role="button"
              tabIndex={0}
              onClick={() => { setSelectedUser(user); setSelectedUserMeta({ center, team }); }}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setSelectedUser(user); setSelectedUserMeta({ center, team }); } }}
            >
              <div className={`${styles.teamCol} ${styles.teamColName}`}>
                <div className={styles.memberAvatar}>{user.name.charAt(0)}</div>
                <div className={styles.memberMeta}>
                  <span className={styles.memberName}>{user.name}</span>
                  <span className={styles.memberSub}>{user.email}</span>
                </div>
              </div>
              <div className={`${styles.teamCol} ${styles.orgColCenter}`}>
                <span className={styles.teamNamePill}>{center.name}</span>
              </div>
              <div className={`${styles.teamCol} ${styles.teamColTeam}`}>
                <span className={styles.teamNamePill}>{team.name}</span>
              </div>
              <div className={`${styles.teamCol} ${styles.teamColStatus}`}>
                <Tag status={user.status} />
              </div>
              <div className={`${styles.teamCol} ${styles.teamColSpacer}`} />
              <div
                className={`${styles.teamCol} ${styles.teamColActions}`}
                onClick={e => e.stopPropagation()}
              >
                <IconButton aria-label="More options" tooltip="More">
                  <IconMore size={16} />
                </IconButton>
              </div>
            </div>
          ))}
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

function TeamsTab({ center, onSelectTeam, onEditTeam, onNewUserForTeam, canManageTeams = true }) {
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

  const allTeams = center.teams ?? [];
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
          placeholder="Search by name..."
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
              {activeFilterCount > 0 && (
                <button className={styles.clearFilters} onClick={clearFilters}>Clear filters</button>
              )}
            </div>
          )}
        </div>
      </div>

      {teams.length > 0 ? (
        <div className={styles.teamTable}>
          <div className={styles.teamTableHead}>
            <span className={`${styles.teamCol} ${styles.teamColName}`}>Team Name</span>
            <span className={`${styles.teamCol} ${styles.teamColStatus}`}>Status</span>
            <span className={`${styles.teamCol} ${styles.teamColActions}`} />
          </div>
          {teams.map(team => {
            const userCount = (team.users ?? []).length;
            const profCount = (team.professionalIds ?? []).length;
            const isOpen = openMenuId === team.id;
            return (
              <div
                key={team.id}
                className={styles.teamTableRow}
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
                      {userCount} {userCount === 1 ? 'user' : 'users'} · {profCount} {profCount === 1 ? 'professional' : 'professionals'}
                    </span>
                  </div>
                </div>
                <div className={`${styles.teamCol} ${styles.teamColStatus}`}>
                  <Tag status={team.status} />
                </div>
                <div
                  className={`${styles.teamCol} ${styles.teamColActions}`}
                  ref={el => { menuRefs.current[team.id] = el; }}
                  onClick={e => e.stopPropagation()}
                >
                  {canManageTeams && (
                    <div className={styles.teamRowMenuAnchor}>
                      <IconButton
                        aria-label="Team options"
                        tooltip="More"
                        onClick={() => setOpenMenuId(isOpen ? null : team.id)}
                      >
                        <IconMore size={16} />
                      </IconButton>
                      {isOpen && (
                        <div className={styles.teamRowMenu}>
                          <ContextMenu
                            items={[
                              { label: 'Edit Team',   icon: <IconEdit  size={16} />, onClick: () => { setOpenMenuId(null); onEditTeam(team); } },
                              { label: 'New User',    icon: <IconPlus  size={16} />, onClick: () => { setOpenMenuId(null); onNewUserForTeam(team); } },
                              { label: 'Delete Team', icon: <IconTrash size={16} />, variant: 'danger', onClick: () => setOpenMenuId(null) },
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
  const profs = getProfessionalCountForCenter(center);
  const units = center.units?.length ?? 0;

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
            <span className={styles.statNum}>{profs}</span>
            <span className={styles.statName}>Professionals</span>
          </div>
        </div>
      </div>

      {(() => {
        const people = [
          ...(center.admins  ?? []).map(a => ({ role: 'Center Admin', name: a.name, email: a.email, phone: a.phone })),
          ...(center.contacts ?? []).map(c => ({ role: c.cargo, name: c.name, email: c.email, phone: c.phone })),
        ];
        const hasCenterInfo = center.email || center.phone || center.address;
        if (!hasCenterInfo && people.length === 0) return null;
        return (
          <div className={styles.detailsSection}>
            <h3 className={styles.peopleSectionTitle}>Contact</h3>
            <div className={styles.peopleList}>

              {hasCenterInfo && (
                <div className={`${styles.personEntry} ${people.length === 0 ? styles.personEntryLast : ''}`}>
                  <span className={styles.contactEntryTitle}>Center info</span>
                  <div className={styles.infoList}>
                    {center.email && <div className={styles.infoRow}><IconMailFilled size={14} /><span>{center.email}</span></div>}
                    {center.phone && <div className={styles.infoRow}><IconPhoneFilled size={14} /><span>{center.phone}</span></div>}
                    {center.address && <div className={styles.infoRow}><IconLocationFilled size={14} /><span>{center.address}</span></div>}
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

function OrgInvitationsTab({ pendingInvites, setPendingInvites, centerAdminInvites, setCenterAdminInvites, orgAdmins, setOrgAdmins, currentUserEmail, role }) {
  // Owner/Admin tienen bypass total; Org Admin puede quitar Org Admins
  // (`organizations.admins.remove`) y Center Admins (`centers.admins.remove`), pero NO
  // Team Admins: no tiene ningún permiso `teams.*` (docs/permissions.md).
  const hasBypass = role === 'owner' || role === 'admin';
  // `users.editData`: Center Admin y Team Admin (y Owner/Admin por bypass) — Org Admin no.
  const canEditUsers = hasBypass;
  const [editUserRow, setEditUserRow] = useState(null);
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
      deliveryIssue: invite.deliveryIssue ?? false,
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

  return (
    <>
      <InvitationsTable
        title="Admins"
        description={'Invite and manage administrators for this organization and its centers. To invite someone new, use the "+" button above.'}
        rows={rows}
        typeOptions={['Organization Admin', 'Center admin', 'Team admin']}
        scopeLabel="Center"
        showTeam
        searchPlaceholder="Search..."
        showSent={false}
        emptyTitle="No administrators yet"
        emptySubtitle="Administrators you invite will appear here."
        onResend={handleResend}
        onCancel={handleCancel}
        onRemove={handleRemove}
        onDeliveryIssue={row => setInviteToast(`Email history for ${row.email} isn't part of this prototype yet`)}
        canEditUsers={canEditUsers}
        onEditUser={row => setEditUserRow(row)}
        responsiveTable
      />
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

function UnitsTab({ center, org }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: new Set(), type: new Set() });
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [detailTab, setDetailTab] = useState('details');
  const [editUnitTarget, setEditUnitTarget] = useState(null);
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
      <div className={`${styles.teamsTab} ${styles.unitsCenterTab}`}>

        <button className={styles.backBtn} onClick={() => setSelectedUnit(null)}>
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
            onClose={() => setEditUnitTarget(null)}
          />
        )}

      </div>
    );
  }

  return (
    <div className={`${styles.teamsTab} ${styles.unitsCenterTab}`}>

      <div className={styles.teamToolbar}>
        <SearchBar
          placeholder="Search by name or ID..."
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
                  <p className={styles.filterSectionLabel}>Type</p>
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
                    upColor={sortCol === 'id' && sortDir === 'asc' ? 'var(--color-turquoise-30)' : 'var(--color-text-disabled)'}
                    downColor={sortCol === 'id' && sortDir === 'desc' ? 'var(--color-turquoise-30)' : 'var(--color-text-disabled)'}
                  />
                </span>
              </button>
            </span>
            <span className={`${styles.teamCol} ${styles.unitColType}`}>Type</span>
            <span className={`${styles.teamCol} ${styles.unitColUse}`}>Date added</span>
            <span className={`${styles.teamCol} ${styles.unitColUse}`}>
              <button className={`${styles.sortBtn} ${sortCol === 'sensorUsage' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('sensorUsage')}>
                Sensor usage
                <span className={styles.infoIconWrap} data-tooltip="How many times the K-POD sensor has registered use.">
                  <IconInfoCircle size={14} />
                </span>
                <span className={styles.sortIcon}>
                  <IconSort
                    size={14}
                    upColor={sortCol === 'sensorUsage' && sortDir === 'asc' ? 'var(--color-turquoise-30)' : 'var(--color-text-disabled)'}
                    downColor={sortCol === 'sensorUsage' && sortDir === 'desc' ? 'var(--color-turquoise-30)' : 'var(--color-text-disabled)'}
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
                    upColor={sortCol === 'totalUse' && sortDir === 'asc' ? 'var(--color-turquoise-30)' : 'var(--color-text-disabled)'}
                    downColor={sortCol === 'totalUse' && sortDir === 'desc' ? 'var(--color-turquoise-30)' : 'var(--color-text-disabled)'}
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
                onClick={() => setSelectedUnit(unit)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedUnit(unit); }}
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
                  <span className={styles.dateText}>{unit.dateAdded || '-'}</span>
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
                  <IconButton
                    aria-label="Edit unit"
                    tooltip="Edit"
                    onClick={() => setSelectedUnit(unit)}
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

function UnitCard({ unit, center, onBack, isMobile = false }) {
  const [activeTab, setActiveTab] = useState('detail');

  return (
    <div className={styles.centerCard}>

      {/* ── Header ── */}
      <div className={styles.innerHeader}>

        {!isMobile && (
          <button className={styles.teamBackBtn} onClick={onBack}>
            <ArrowLeftIcon />
            <span>Back to Units</span>
          </button>
        )}

        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <div className={styles.cardAvatar}>{unit.id}</div>
            <div className={styles.cardTitleGroup}>
              <h2 className={styles.cardTitle}>{unit.description}</h2>
              <div className={styles.cardSubtitle}>
                <span>{center.name}</span>
                <span className={styles.separator}>|</span>
                <div className={styles.statusBadgeSmall}>
                  <div className={`${styles.statusDot} ${styles[unit.status]}`} />
                  <span>{unit.status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.cardActions}>
            <IconButton aria-label="Unit settings" tooltip="Settings">
              <IconSettings size={16} />
            </IconButton>
            <IconButton aria-label="Delete unit" tooltip="Delete" variant="danger">
              <IconTrash size={16} />
            </IconButton>
          </div>
        </div>

        <div className={styles.innerTabBarWrap}>
          <div className={`${styles.innerTabBarInner} ${styles.innerTabBarInnerWide}`}>
            <TabBar tabs={UNIT_TABS} activeTab={activeTab} onChange={setActiveTab} size="s" />
          </div>
        </div>

      </div>

      {/* ── Tab content ── */}
      <div className={styles.innerTabContent}>

        {activeTab === 'detail' && (
          <div className={styles.drawerFields}>
            <Input label="ID" value={String(unit.id)} disabled />
            <Input label="Description" value={unit.description} disabled />
            <Input label="Center" value={center.name} disabled />
            <div className={styles.drawerFieldStatus}>
              <span className={styles.drawerFieldStatusLabel}>Status</span>
              <Tag status={unit.status} />
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className={styles.drawerFields}>
            <p className={styles.drawerSectionLabel}>Display</p>
            <Input label="Display ID" value={String(unit.display.id)} disabled />
            <div className={styles.drawerFieldStatus}>
              <span className={styles.drawerFieldStatusLabel}>Status</span>
              <Tag status={unit.display.status} />
            </div>
            <p className={styles.drawerSectionLabel}>K-POD</p>
            <Input label="K-POD ID" value={String(unit.kpod.id)} disabled />
            <div className={styles.drawerFieldStatus}>
              <span className={styles.drawerFieldStatusLabel}>Status</span>
              <Tag status={unit.kpod.status === 'needs-replacement' ? 'inactive' : unit.kpod.status} label={unit.kpod.status === 'needs-replacement' ? 'Needs replacement' : undefined} />
            </div>
            {unit.kpod.status === 'needs-replacement' && (
              <div className={styles.unitReplaceAlert}>
                <span>This K-POD needs to be replaced.</span>
                <button className={styles.unitReplaceBtn}>Replace K-POD</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'appearance' && (
          <InnerEmptyState title="Appearance" subtitle="Appearance settings will appear here" />
        )}

        {activeTab === 'parameters' && (
          <InnerEmptyState title="Parameters" subtitle="Unit parameters will appear here" />
        )}

      </div>

    </div>
  );
}

// ─── Center detail card ───────────────────────────────────

function getScrollParent(el) {
  while (el && el !== document.body) {
    const { overflowY } = window.getComputedStyle(el);
    if (overflowY === 'auto' || overflowY === 'scroll') return el;
    el = el.parentElement;
  }
  return null;
}

function CenterCard({ center, org, onEdit, onDelete, onNewTeam, onNewUser, onInviteCenterAdmin, onEditTeam, onNewUserForTeam, onSelectTeam, onSelectUser, onSelectUnit, initialTab = 'details', role, currentUserEmail }) {
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
  const canCreateUnit   = role === 'owner' || role === 'admin' || role === 'editor'; // units.create: exclusivo de Kamleon Editor (y Owner/Admin por bypass)
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
  // Centro; una vez aceptadas pasan a ser fila "Professional" en el roster del equipo (con PIN/Screen).
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
  const centerTabs = [
    ...CENTER_TABS.map(t =>
      t.id === 'users' ? { ...t, hasDot: teamInvites.length > 0 } : t
    ),
    ...(showAdminsTab ? [{ id: 'admins', label: 'Admins', hasDot: pendingInvites.length > 0 || teamAdminInvites.length > 0 }] : []),
  ];
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
            canManageTeams={canManageTeams}
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
          <UnitsTab center={center} org={org} />
        )}
        {innerTab === 'admins' && showAdminsTab && (
          <AdministratorsSection
            center={center}
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
        const role = profIds.has(u.id) ? 'Professional' : 'User';
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
                {[{ v: 'Professional', label: 'Professional' }, { v: 'User', label: 'User' }].map(({ v, label }) => (
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
              className={styles.teamTableRow}
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
                      <IconButton
                        aria-label="More options"
                        tooltip="More"
                        onClick={() => setOpenMenuId(isOpen ? null : user.id)}
                      >
                        <IconMore size={16} />
                      </IconButton>
                      {isOpen && (
                        <div className={styles.teamRowMenu}>
                          <ContextMenu
                            items={[
                              { label: 'Edit User', icon: <IconEdit size={16} />, onClick: () => { setOpenMenuId(null); setEditUserTarget({ user, team: teams[0] }); } },
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

function AdministratorsSection({ center, pendingInvites, setPendingInvites, teamAdminInvites, setTeamAdminInvites, centerAdmins, setCenterAdmins, currentUserEmail }) {
  const [removeTarget, setRemoveTarget] = useState(null);
  const [actionToast, setActionToast] = useState(null);

  const rows = [
    ...pendingInvites.map((invite, i) => ({
      key: `center-admin-pending-${i}`, index: i, kind: 'centerAdminPending',
      email: invite.email, type: 'Center Admin', scope: 'Center-wide', status: 'pending',
      sentAgo: invite.sentAgo ?? '—', sentMinutesAgo: invite.sentMinutesAgo ?? 0,
    })),
    ...teamAdminInvites.map(invite => ({
      key: `team-admin-pending-${invite.key}`, sourceKey: invite.key, kind: 'teamAdminPending',
      email: invite.email, type: 'Team Admin', scope: invite.teamName, status: 'pending',
      sentAgo: invite.sentAgo ?? '—', sentMinutesAgo: invite.sentMinutesAgo ?? 0,
    })),
    ...centerAdmins.map(admin => ({
      key: `center-admin-active-${admin.key}`, adminKey: admin.key, kind: 'centerAdminActive',
      email: admin.email, name: admin.name, type: 'Center Admin', scope: 'Center-wide', status: 'active',
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
    setActionToast(`${removeTarget.email} removed as Center Admin`);
    setCenterAdmins(prev => prev.filter(a => a.key !== removeTarget.adminKey));
  }

  return (
    <>
      <InvitationsTable
        description={'Manage administrators for this center and its teams. Use the "+" button above to invite one.'}
        rows={rows}
        typeOptions={['Center Admin', 'Team Admin']}
        scopeLabel="Team"
        showSent={false}
        emptyTitle="No admins yet"
        emptySubtitle="Admins you invite will appear here."
        onResend={handleResend}
        onCancel={handleCancel}
        onRemove={handleRemove}
        responsiveTable
        bleed
      />

      {removeTarget && (
        <RemoveAdminModal
          row={{ ...removeTarget, type: 'Center Admin', scope: center.name }}
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
  regenerate: { title: 'Regenerate PIN for all users?', confirmLabel: 'Regenerate' },
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
    : action === 'off'
    ? `This will turn PIN off for all ${count} users in ${team.name}. They won't be able to log in with a PIN until it's turned back on.`
    : `This will generate a new PIN code for all ${count} users in ${team.name}. Current PINs will stop working immediately.`;
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

function TeamCard({ team, center, org, onBack, onSelectUser, onNewUser, onEdit, isMobile = false, role }) {
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

  const [allMembers, setAllMembers] = useState(() => {
    const userIds = new Set(team.users ?? []);
    const profIds = new Set(team.professionalIds ?? []);
    return USERS_POOL
      .filter(u => userIds.has(u.id) || profIds.has(u.id))
      .map(u => ({ ...u, role: profIds.has(u.id) ? 'Professional' : 'User' }));
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

  function regeneratePin(member) {
    setActionToast(`PIN regenerated for ${member.name}`);
  }

  function removeMember(member) {
    setAllMembers(prev => prev.filter(m => m.id !== member.id));
    setActionToast(`${member.name} removed from ${team.name}`);
  }

  function bulkSetPin(value) {
    setAllMembers(prev => prev.map(m => ({ ...m, pin: value })));
    setActionToast(`PIN turned ${value ? 'on' : 'off'} for all users`);
  }

  function bulkRegeneratePin() {
    setActionToast('PIN regenerated for all users');
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
      if (q && !m.name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) return false;
      if (filters.role.size   > 0 && !filters.role.has(m.role))     return false;
      if (filters.status.size > 0 && !filters.status.has(m.status)) return false;
      return true;
    });
  }, [allMembers, search, filters]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / TEAM_PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const pageMembers = filtered.slice((safePage - 1) * TEAM_PAGE_SIZE, safePage * TEAM_PAGE_SIZE);

  function handleSearch(val) { setSearch(val); setPage(1); }

  return (
    <div className={`${styles.centerCard} ${styles.teamCard}`}>

      {/* ── Fixed header ── */}
      <div className={styles.innerHeader}>

        {!isMobile && (
          <button className={styles.teamBackBtn} onClick={onBack}>
            <ArrowLeftIcon />
            <span>Back to Teams</span>
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
              <IconButton aria-label="Delete team" tooltip="Delete" variant="danger">
                <IconTrash size={16} />
              </IconButton>
            )}
          </div>
        </div>

      </div>

      {/* ── Scrollable content ── */}
      <div className={`${styles.teamContent} ${styles.membersTab}`}>

        <div className={styles.teamToolbar}>
          <SearchBar
            placeholder="Search by name..."
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
                  {[{ v: 'Professional', label: 'Professional' }, { v: 'User', label: 'User' }].map(({ v, label }) => (
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
              <ToolbarButton icon={<IconMenu size={16} />} onClick={() => setBulkOpen(v => !v)}>
                Bulk actions
              </ToolbarButton>
              {bulkOpen && (
                <div className={styles.bulkActionsMenu}>
                  <ContextMenu
                    items={[
                      { label: 'Turn PIN on for all users', onClick: () => { setBulkOpen(false); setBulkConfirm('on'); } },
                      { label: 'Turn PIN off for all users', onClick: () => { setBulkOpen(false); setBulkConfirm('off'); } },
                      { label: 'Regenerate PIN for all users', onClick: () => { setBulkOpen(false); setBulkConfirm('regenerate'); } },
                    ]}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {(allMembers.length === 0 && pendingInvites.length === 0 && teamAdminInvites.length === 0) ? (
          <InnerEmptyState
            title="No members yet..."
            subtitle="Add users to this team to see them here"
          />
        ) : (pageMembers.length > 0 || pendingInvites.length > 0 || teamAdminInvites.length > 0) ? (
          <div className={styles.teamTable}>
            <div className={styles.teamTableHead}>
              <span className={`${styles.teamCol} ${styles.teamColName}`}>Member</span>
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
            {teamAdminInvites.map(invite => (
              <div key={`team-admin-${invite.email}`} className={styles.teamTableRow}>
                <div className={`${styles.teamCol} ${styles.teamColName}`}>
                  <div className={styles.memberAvatar}>{invite.email.charAt(0).toUpperCase()}</div>
                  <div className={styles.memberMeta}>
                    <TruncatedText text={invite.email} textClassName={styles.memberName} />
                    <span className={styles.memberSub}>Team Admin</span>
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
                      <IconButton aria-label="Resend invitation" tooltip="Resend" onClick={() => handleResendTeamAdminInvite(invite)}>
                        <IconResend size={16} />
                      </IconButton>
                      <IconButton aria-label="Cancel invitation" tooltip="Cancel" onClick={() => handleCancelTeamAdminInvite(invite)}>
                        <IconTrash size={14} />
                      </IconButton>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
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
                    {/* teams.users.edit/remove/togglePin/regeneratePin: exclusivo de Center Admin
                        (y Owner/Admin) — Org Admin y Editor son solo-lectura acá (docs/permissions.md,
                        Bloque: Teams), así que ni siquiera ven el botón "···". */}
                    {canManageTeam && (
                    <div className={styles.teamRowMenuAnchor}>
                      <IconButton
                        aria-label="Member options"
                        tooltip="More"
                        onClick={() => setOpenMenuId(isOpen ? null : member.id)}
                      >
                        <IconMore size={16} />
                      </IconButton>
                      {isOpen && (
                        <div className={styles.teamRowMenu}>
                          <ContextMenu
                            items={[
                              { label: 'Edit User', icon: <IconEdit size={16} />, onClick: () => { setOpenMenuId(null); setEditUserTarget(member); } },
                              { label: member.pin ? 'Turn off PIN' : 'Turn on PIN', icon: <IconPower size={16} />, onClick: () => { setOpenMenuId(null); togglePin(member); } },
                              ...(member.pin ? [{ label: 'Regenerate PIN', icon: <IconRefresh size={16} />, onClick: () => { setOpenMenuId(null); regeneratePin(member); } }] : []),
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
          onConfirm={() => (bulkConfirm === 'regenerate' ? bulkRegeneratePin() : bulkSetPin(bulkConfirm === 'on'))}
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

function UserCard({ user, team, backLabel, onBack, isMobile = false }) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className={styles.centerCard}>

      {/* ── Fixed header ── */}
      <div className={styles.innerHeader}>

        {!isMobile && (
          <button className={styles.teamBackBtn} onClick={onBack}>
            <ArrowLeftIcon />
            <span>Back to {backLabel ?? team?.name}</span>
          </button>
        )}

        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <div className={styles.cardAvatar}>{user.name.charAt(0)}</div>
            <div className={styles.cardTitleGroup}>
              <h2 className={styles.cardTitle}>{user.name}</h2>
              <div className={styles.cardSubtitle}>
                <span>{user.role ?? team?.name}</span>
                <span className={styles.separator}>|</span>
                <div className={styles.statusBadgeSmall}>
                  <div className={`${styles.statusDot} ${styles[user.status]}`} />
                  <span>{user.status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.cardActions}>
            <IconButton aria-label="User settings" tooltip="Settings" onClick={() => setShowEdit(true)}>
              <IconSettings size={16} />
            </IconButton>
            <IconButton aria-label="Delete user" tooltip="Delete" variant="danger">
              <IconTrash size={16} />
            </IconButton>
          </div>
        </div>

      </div>

      {/* ── Scrollable content ── */}
      <div className={styles.userContent}>

        {/* Personal Information */}
        <div className={styles.userSection}>
          <span className={styles.sectionLabel}>Personal Information</span>
          <div className={styles.userInfoGrid}>

            <div className={styles.userInfoCol}>
              <div className={styles.userInfoItem}>
                <IconMailFilled size={16} />
                <span>{user.email}</span>
              </div>
              <div className={styles.userInfoItem}>
                <IconPhoneFilled size={16} />
                <span>{user.phone}</span>
              </div>
            </div>

            <div className={styles.userInfoCol}>
              <div className={styles.userInfoItem}>
                <IconCalendar />
                <span>{user.birthday}</span>
              </div>
              <div className={styles.userInfoItem}>
                <IconGender />
                <span>{user.gender}</span>
              </div>
            </div>

            <div className={styles.userInfoCol}>
              <div className={styles.userInfoItem}>
                <IconHeight />
                <span>{user.height}</span>
              </div>
              <div className={styles.userInfoItem}>
                <IconWeight />
                <span>{user.weight}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Login Permissions */}
        <div className={styles.userSection}>
          <span className={styles.sectionLabel}>Login Permissions</span>
          <div className={styles.userPermissions}>
            <div className={styles.permItem}>
              <IconRfid />
              <span>RFID: {user.rfid ? 'On' : 'Off'}</span>
            </div>
            <div className={styles.permItem}>
              <IconPin />
              <span>PIN: {user.pin ? 'On' : 'Off'}</span>
            </div>
          </div>
        </div>

      </div>

      {showEdit && <EditUserDrawer user={user} team={team} onClose={() => setShowEdit(false)} />}

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
        {orgTab === 'users'   && <OrgUsersTab org={org} />}
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
      {showDeleteModal && <DeleteOrgModal org={org} onClose={() => setShowDeleteModal(false)} onConfirm={onBack} />}
      {adminInviteToast && (
        <Toast message={adminInviteToast} mode="success" onClose={() => setAdminInviteToast(null)} />
      )}
    </div>
  );
}
