import { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react';
import Tag from '../../../design-system/components/Tag/Tag';
import TabBar from '../../../design-system/components/TabBar/TabBar';
import SearchBar from '../../../design-system/components/SearchBar/SearchBar';
import { IconEdit, IconPlus, IconTrash, IconSettings, IconFilter } from '../../../design-system/icons/outline';
import Button from '../../../design-system/components/Button/Button';
import Input from '../../../design-system/components/Input/Input';
import { IconUserFilled, IconMailFilled, IconPhoneFilled, IconLocationFilled } from '../../../design-system/icons/filled';
import { getUserCountForCenter, getProfessionalCountForCenter, getActiveTeamCount, USERS_POOL } from '../../StaffOrganizaciones/mockData';
import ContextMenu      from '../../../design-system/components/ContextMenu/ContextMenu';
import ToolbarButton    from '../../../design-system/components/ToolbarButton/ToolbarButton';
import EditOrgDrawer    from '../../StaffOrganizaciones/screens/EditOrgDrawer';
import DeleteOrgModal   from '../../StaffOrganizaciones/screens/DeleteOrgModal';
import IconButton       from '../../../design-system/components/IconButton/IconButton';
import EditCenterDrawer from '../../StaffOrganizaciones/screens/EditCenterDrawer';
import EditTeamDrawer   from '../../StaffOrganizaciones/screens/EditTeamDrawer';
import NewCenterDrawer  from '../../StaffOrganizaciones/screens/NewCenterDrawer';
import NewTeamDrawer    from '../../StaffOrganizaciones/screens/NewTeamDrawer';
import NewUserDrawer    from '../../StaffOrganizaciones/screens/NewUserDrawer';
import EditUserDrawer   from '../../StaffOrganizaciones/screens/EditUserDrawer';
import styles from './OrgDetailV2.module.css';

// ─── Icons ───────────────────────────────────────────────

function IconMore() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="3.5" cy="8" r="1.25" fill="currentColor" />
      <circle cx="8"   cy="8" r="1.25" fill="currentColor" />
      <circle cx="12.5" cy="8" r="1.25" fill="currentColor" />
    </svg>
  );
}

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

function CentersContent({ org, initialCenter, initialTeam, initialUser, isMobile = false }) {
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
  const [newTeamCenter, setNewTeamCenter]           = useState(null);
  const [newUserContext, setNewUserContext]          = useState(null); // { center, team? }
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
        <div className={`${styles.listPanel} ${isMobile && detailVisible ? styles.listPanelHidden : ''}`}>
          <div className={styles.listPanelTop}>
            <div className={styles.listPanelHeader}>
              <span className={styles.listPanelLabel}>Centers</span>
              <button
                className={`${styles.listPanelAddBtn} ${styles.listPanelAddBtnTooltip}`}
                data-tooltip="New Center"
                aria-label="New Center"
                onClick={() => setShowNewCenter(true)}
              >
                <IconPlus size={14} />
              </button>
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
                    <div className={styles.listItemStatusRow}>
                      <div className={`${styles.listItemDot} ${styles[center.status]}`} />
                      <span className={styles.listItemStatus}>
                        {center.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
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
                    ? () => { setSubSlideDir('back'); setSelectedTeam(null); setSelectedUser(null); setSelectedUserTeam(null); }
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

          <div key={subKey} className={subSlideClass} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
              onBack={() => { setSubSlideDir('back'); setSelectedTeam(null); setSelectedUser(null); setSelectedUserTeam(null); }}
              onSelectUser={(user) => { setSubSlideDir('forward'); setSelectedUser(user); }}
              onNewUser={() => setNewUserContext({ center: selectedTeamCenter, team: selectedTeam })}
              isMobile={isMobile}
            />
          ) : selected ? (
            <CenterCard
              center={selected}
              org={org}
              onEdit={() => setEditCenterTarget(selected)}
              onNewTeam={() => setNewTeamCenter(selected)}
              onNewUser={() => setNewUserContext({ center: selected })}
              onEditTeam={(team) => setEditTeamTarget(team)}
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
            />
          ) : centers.length === 0 ? (
            <EmptyState
              title="No centers yet"
              subtitle="Create the first center for this organization."
              action={
                <Button
                  variant="primary"
                  size="s"
                  leftIcon={<IconPlus size={14} />}
                  onClick={() => setShowNewCenter(true)}
                >
                  New center
                </Button>
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
      {editCenterTarget && <EditCenterDrawer center={editCenterTarget} org={org} onClose={() => setEditCenterTarget(null)} />}
      {editTeamTarget   && <EditTeamDrawer team={editTeamTarget} onClose={() => setEditTeamTarget(null)} />}
      {newTeamCenter    && <NewTeamDrawer center={newTeamCenter} onClose={() => setNewTeamCenter(null)} />}
      {newUserContext   && (
        <NewUserDrawer
          center={newUserContext.center}
          team={newUserContext.team}
          teams={newUserContext.center?.teams ?? []}
          onClose={() => setNewUserContext(null)}
        />
      )}
    </>
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

function TeamsTab({ center, onSelectTeam, onEditTeam, onNewUserForTeam }) {
  const [search, setSearch]       = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    if (!openMenuId) return;
    function handleClick(e) {
      const ref = menuRefs.current[openMenuId];
      if (ref && !ref.contains(e.target)) setOpenMenuId(null);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenuId]);

  const allTeams = center.teams ?? [];
  const teams = search.trim()
    ? allTeams.filter(t => t.name.toLowerCase().includes(search.trim().toLowerCase()))
    : allTeams;

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
        <ToolbarButton icon={<IconFilter size={16} />}>Filters</ToolbarButton>
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
                  <div className={styles.teamRowMenuAnchor}>
                    <IconButton
                      aria-label="Team options"
                      tooltip="More"
                      onClick={() => setOpenMenuId(isOpen ? null : team.id)}
                    >
                      <IconMore />
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

  return (
    <div className={styles.detailsTab}>

      <div className={styles.detailsSection}>
        <h3 className={styles.peopleSectionTitle}>Overview</h3>
        <div className={styles.statsGrid}>
          <button className={`${styles.statBlock} ${styles.statBlockClickable}`} onClick={() => onTabChange('teams')}>
            <span className={styles.statNum}>{teams}</span>
            <span className={styles.statName}>Teams</span>
          </button>
          <div className={styles.statDividerV} />
          <button className={`${styles.statBlock} ${styles.statBlockClickable}`} onClick={() => onTabChange('users')}>
            <span className={styles.statNum}>{users}</span>
            <span className={styles.statName}>Users</span>
          </button>
          <div className={styles.statDividerV} />
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
                <div className={`${styles.personEntry} ${styles.personEntryFirst}`}>
                  <span className={styles.contactEntryTitle}>Center info</span>
                  <div className={styles.infoList}>
                    {center.email && <div className={styles.infoRow}><IconMailFilled size={14} /><span>{center.email}</span></div>}
                    {center.phone && <div className={styles.infoRow}><IconPhoneFilled size={14} /><span>{center.phone}</span></div>}
                    {center.address && <div className={styles.infoRow}><IconLocationFilled size={14} /><span>{center.address}</span></div>}
                  </div>
                </div>
              )}

              {people.map((p, i) => (
                <div key={i} className={`${styles.personEntry} ${!hasCenterInfo && i === 0 ? styles.personEntryFirst : ''}`}>
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

// ─── Units tab ────────────────────────────────────────────


function UnitsTab({ center, onSelectUnit }) {
  const [search, setSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    if (!openMenuId) return;
    function handleClick(e) {
      const ref = menuRefs.current[openMenuId];
      if (ref && !ref.contains(e.target)) setOpenMenuId(null);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenuId]);

  const allUnits = center.units ?? [];
  const units = search.trim()
    ? allUnits.filter(u => u.description.toLowerCase().includes(search.trim().toLowerCase()) || String(u.id).includes(search.trim()))
    : allUnits;

  if (allUnits.length === 0) {
    return (
      <InnerEmptyState
        title="No units yet..."
        subtitle="Hardware units assigned to this center will appear here"
      />
    );
  }

  return (
    <div className={styles.teamsTab}>

      <div className={styles.teamToolbar}>
        <SearchBar
          placeholder="Search by name or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
      </div>

      {units.length > 0 ? (
        <div className={styles.teamTable}>
          <div className={styles.teamTableHead}>
            <span className={`${styles.teamCol} ${styles.teamColName}`}>Unit</span>
            <span className={`${styles.teamCol} ${styles.teamColStatus}`}>Display</span>
            <span className={`${styles.teamCol} ${styles.teamColStatus}`}>K-POD</span>
            <span className={`${styles.teamCol} ${styles.teamColActions}`} />
          </div>
          {units.map(unit => {
            const isOpen = openMenuId === unit.id;
            return (
              <div
                key={unit.id}
                className={styles.teamTableRow}
                role="button"
                tabIndex={0}
                onClick={() => onSelectUnit(unit)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelectUnit(unit); }}
              >
                <div className={`${styles.teamCol} ${styles.teamColName}`}>
                  <div className={styles.memberAvatar}>{unit.id}</div>
                  <div className={styles.memberMeta}>
                    <span className={styles.memberName}>{unit.description}</span>
                    <span className={styles.memberSub}>
                      <div className={`${styles.statusDot} ${styles[unit.status]}`} style={{ display: 'inline-block', marginRight: 4 }} />
                      {unit.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className={`${styles.teamCol} ${styles.teamColStatus}`}>
                  <Tag status={unit.display.status} />
                </div>
                <div className={`${styles.teamCol} ${styles.teamColStatus}`}>
                  <Tag
                    status={unit.kpod.status === 'needs-replacement' ? 'inactive' : unit.kpod.status}
                    label={unit.kpod.status === 'needs-replacement' ? 'Replace' : undefined}
                  />
                </div>
                <div
                  className={`${styles.teamCol} ${styles.teamColActions}`}
                  ref={el => { menuRefs.current[unit.id] = el; }}
                  onClick={e => e.stopPropagation()}
                >
                  <div className={styles.teamRowMenuAnchor}>
                    <IconButton
                      aria-label="Unit options"
                      tooltip="More"
                      onClick={() => setOpenMenuId(isOpen ? null : unit.id)}
                    >
                      <IconMore />
                    </IconButton>
                    {isOpen && (
                      <div className={styles.teamRowMenu}>
                        <ContextMenu
                          items={[
                            { label: 'Edit Unit',   icon: <IconEdit  size={16} />, onClick: () => { setOpenMenuId(null); onSelectUnit(unit); } },
                            { label: 'Delete Unit', icon: <IconTrash size={16} />, variant: 'danger', onClick: () => setOpenMenuId(null) },
                          ]}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <InnerEmptyState
          title="No results"
          subtitle={`No units match "${search}"`}
        />
      )}

    </div>
  );
}

// ─── Unit card ─────────────────────────────────────────────

const UNIT_TABS = [
  { id: 'info',    label: 'Unit Info' },
  { id: 'display', label: 'Display'   },
  { id: 'kpod',    label: 'K-POD'     },
];

function UnitCard({ unit, center, onBack, isMobile = false }) {
  const [activeTab, setActiveTab] = useState('info');

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
          <TabBar tabs={UNIT_TABS} activeTab={activeTab} onChange={setActiveTab} size="s" />
        </div>

      </div>

      {/* ── Tab content ── */}
      <div className={styles.innerTabContent}>

        {activeTab === 'info' && (
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

        {activeTab === 'display' && (
          <div className={styles.drawerFields}>
            <Input label="Display ID" value={String(unit.display.id)} disabled />
            <div className={styles.drawerFieldStatus}>
              <span className={styles.drawerFieldStatusLabel}>Status</span>
              <Tag status={unit.display.status} />
            </div>
          </div>
        )}

        {activeTab === 'kpod' && (
          <div className={styles.drawerFields}>
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

function CenterCard({ center, org, onEdit, onNewTeam, onNewUser, onEditTeam, onNewUserForTeam, onSelectTeam, onSelectUser, onSelectUnit, initialTab = 'details' }) {
  const [innerTab, setInnerTab]         = useState(initialTab);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
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
            <div className={styles.createMenuAnchor} ref={createMenuRef}>
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
                      { label: 'New Team', icon: <IconPlus size={16} />, onClick: () => { setCreateMenuOpen(false); onNewTeam(); } },
                      { label: 'New User', icon: <IconPlus size={16} />, onClick: () => { setCreateMenuOpen(false); onNewUser(); } },
                      { label: 'New Unit', icon: <IconPlus size={16} />, onClick: () => setCreateMenuOpen(false) },
                    ]}
                  />
                </div>
              )}
            </div>
            <IconButton aria-label="Edit center" tooltip="Edit" onClick={onEdit}>
              <IconEdit size={16} />
            </IconButton>
            <IconButton aria-label="Delete center" tooltip="Delete" variant="danger">
              <IconTrash size={16} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* ── Inner TabBar ── */}
      <div ref={tabBarRef} className={styles.innerTabBarWrap}>
        <TabBar tabs={CENTER_TABS} activeTab={innerTab} onChange={handleTabChange} size="s" />
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
          />
        )}
        {innerTab === 'users' && (
          <UsersTab center={center} onSelectUser={onSelectUser} />
        )}
        {innerTab === 'units' && (
          <UnitsTab center={center} onSelectUnit={onSelectUnit} />
        )}
      </div>

    </div>
  );
}

// ─── Users tab ────────────────────────────────────────────

const CENTER_USERS_PAGE_SIZE = 10;

function UsersTab({ center, onSelectUser }) {
  const [search, setSearch]         = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [page, setPage]             = useState(1);

  const teams = center.teams ?? [];

  const allUsers = useMemo(() => {
    const result = [];
    teams.forEach(team => {
      const userIds = new Set(team.users ?? []);
      USERS_POOL.forEach(u => {
        if (userIds.has(u.id)) result.push({ user: u, team });
      });
    });
    return result;
  }, [teams]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allUsers.filter(({ user, team: t }) => {
      if (teamFilter !== 'all' && t.id !== teamFilter) return false;
      if (q && !user.name.toLowerCase().includes(q) && !user.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allUsers, search, teamFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / CENTER_USERS_PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageUsers  = filtered.slice((safePage - 1) * CENTER_USERS_PAGE_SIZE, safePage * CENTER_USERS_PAGE_SIZE);

  function handleSearch(val) { setSearch(val); setPage(1); }
  function handleTeamFilter(id) { setTeamFilter(id); setPage(1); }

  if (allUsers.length === 0) {
    return (
      <InnerEmptyState
        title="No users yet..."
        subtitle="Add teams with users to this center to see them here"
      />
    );
  }

  return (
    <div className={styles.usersTab}>

      <div className={styles.teamToolbar}>
        <SearchBar
          placeholder="Search users..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          onClear={() => handleSearch('')}
        />
        <span className={styles.teamCount}>
          {filtered.length} {filtered.length === 1 ? 'user' : 'users'}
        </span>
      </div>

      {teams.length > 1 && (
        <div className={styles.teamFilterPills}>
          <button
            className={`${styles.filterPill} ${teamFilter === 'all' ? styles.filterPillActive : ''}`}
            onClick={() => handleTeamFilter('all')}
          >
            All teams
          </button>
          {teams.map(team => (
            <button
              key={team.id}
              className={`${styles.filterPill} ${teamFilter === team.id ? styles.filterPillActive : ''}`}
              onClick={() => handleTeamFilter(team.id)}
            >
              {team.name}
            </button>
          ))}
        </div>
      )}

      {pageUsers.length > 0 ? (
        <div className={styles.teamTable}>
          <div className={styles.teamTableHead}>
            <span className={`${styles.teamCol} ${styles.teamColName}`}>Name</span>
            <span className={`${styles.teamCol} ${styles.teamColTeam}`}>Team</span>
            <span className={`${styles.teamCol} ${styles.teamColStatus}`}>Status</span>
            <span className={`${styles.teamCol} ${styles.teamColActions}`} />
          </div>
          {pageUsers.map(({ user, team }) => (
            <button
              key={user.id}
              className={styles.teamTableRow}
              onClick={() => onSelectUser(user, team)}
            >
              <div className={`${styles.teamCol} ${styles.teamColName}`}>
                <div className={styles.memberAvatar}>{user.name.charAt(0)}</div>
                <div className={styles.memberMeta}>
                  <span className={styles.memberName}>{user.name}</span>
                  <span className={styles.memberSub}>{user.email}</span>
                </div>
              </div>
              <div className={`${styles.teamCol} ${styles.teamColTeam}`}>
                <span className={styles.teamNamePill}>{team.name}</span>
              </div>
              <div className={`${styles.teamCol} ${styles.teamColStatus}`}>
                <Tag status={user.status} />
              </div>
              <div className={`${styles.teamCol} ${styles.teamColActions}`}>
                <span className={styles.moreBtn} aria-hidden="true">···</span>
              </div>
            </button>
          ))}
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
            Showing {(safePage - 1) * CENTER_USERS_PAGE_SIZE + 1}–{Math.min(safePage * CENTER_USERS_PAGE_SIZE, filtered.length)} of {filtered.length} users
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

// ─── Team detail card ─────────────────────────────────────

const TEAM_PAGE_SIZE = 10;

function TeamCard({ team, center, org, onBack, onSelectUser, onNewUser, isMobile = false }) {
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editUserTarget, setEditUserTarget] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    if (!openMenuId) return;
    function handleClick(e) {
      const ref = menuRefs.current[openMenuId];
      if (ref && !ref.contains(e.target)) setOpenMenuId(null);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenuId]);

  const allMembers = useMemo(() => {
    const userIds = new Set(team.users ?? []);
    const profIds = new Set(team.professionalIds ?? []);
    return USERS_POOL
      .filter(u => userIds.has(u.id) || profIds.has(u.id))
      .map(u => ({ ...u, role: profIds.has(u.id) ? 'Professional' : 'User' }));
  }, [team]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allMembers;
    return allMembers.filter(m =>
      m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [allMembers, search]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / TEAM_PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const pageMembers = filtered.slice((safePage - 1) * TEAM_PAGE_SIZE, safePage * TEAM_PAGE_SIZE);

  function handleSearch(val) { setSearch(val); setPage(1); }

  return (
    <div className={styles.centerCard}>

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
            <IconButton aria-label="New User" tooltip="New User" onClick={onNewUser}>
              <IconPlus size={16} />
            </IconButton>
            <IconButton aria-label="Team settings" tooltip="Settings">
              <IconSettings size={16} />
            </IconButton>
            <IconButton aria-label="Delete team" tooltip="Delete" variant="danger">
              <IconTrash size={16} />
            </IconButton>
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
          <ToolbarButton icon={<IconFilter size={16} />}>Filters</ToolbarButton>
        </div>

        {allMembers.length === 0 ? (
          <InnerEmptyState
            title="No members yet..."
            subtitle="Add users to this team to see them here"
          />
        ) : pageMembers.length > 0 ? (
          <div className={styles.teamTable}>
            <div className={styles.teamTableHead}>
              <span className={`${styles.teamCol} ${styles.teamColName}`}>Member</span>
              <span className={`${styles.teamCol} ${styles.teamColStatus}`}>Status</span>
              <span className={`${styles.teamCol} ${styles.teamColActions}`} />
            </div>
            {pageMembers.map(member => {
              const isOpen = openMenuId === member.id;
              return (
                <div
                  key={member.id}
                  className={styles.teamTableRow}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectUser(member)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelectUser(member); }}
                >
                  <div className={`${styles.teamCol} ${styles.teamColName}`}>
                    <div className={styles.memberAvatar}>{member.name.charAt(0)}</div>
                    <div className={styles.memberMeta}>
                      <span className={styles.memberName}>{member.name}</span>
                      <span className={styles.memberSub}>{member.role}</span>
                    </div>
                  </div>
                  <div className={`${styles.teamCol} ${styles.teamColStatus}`}>
                    <Tag status={member.status} />
                  </div>
                  <div
                    className={`${styles.teamCol} ${styles.teamColActions}`}
                    ref={el => { menuRefs.current[member.id] = el; }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className={styles.teamRowMenuAnchor}>
                      <IconButton
                        aria-label="Member options"
                        tooltip="More"
                        onClick={() => setOpenMenuId(isOpen ? null : member.id)}
                      >
                        <IconMore />
                      </IconButton>
                      {isOpen && (
                        <div className={styles.teamRowMenu}>
                          <ContextMenu
                            items={[
                              { label: 'Edit User',   icon: <IconEdit  size={16} />, onClick: () => { setOpenMenuId(null); setEditUserTarget(member); } },
                              { label: 'Delete User', icon: <IconTrash size={16} />, variant: 'danger', onClick: () => setOpenMenuId(null) },
                            ]}
                          />
                        </div>
                      )}
                    </div>
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
              Showing {(safePage - 1) * TEAM_PAGE_SIZE + 1}–{Math.min(safePage * TEAM_PAGE_SIZE, filtered.length)} of {filtered.length} members
            </span>
            <div className={styles.paginationBtns}>
              <button className={styles.paginationBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>Previous</button>
              <button className={styles.paginationBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>Next</button>
            </div>
          </div>
        )}

      </div>

      {editUserTarget && (
        <EditUserDrawer user={editUserTarget} team={team} onClose={() => setEditUserTarget(null)} />
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

export default function OrgDetailV2({ org, onBack, initialCenter, initialTeam, initialUser, isMobile = false }) {
  const [showEditDrawer, setShowEditDrawer]   = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className={styles.container}>

      {/* ── Header card ── */}
      <div className={styles.headerCard}>

        <div className={styles.headerInner}>

          <button className={styles.backBtn} onClick={onBack}>
            <span className={styles.backIcon}><ArrowLeftIcon /></span>
            <span className={styles.backLabel}>Back</span>
          </button>

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
              <IconButton aria-label="Configuración" tooltip="Settings" onClick={() => setShowEditDrawer(true)}>
                <IconSettings size={16} />
              </IconButton>
              <IconButton aria-label="Eliminar organización" tooltip="Delete" variant="danger" onClick={() => setShowDeleteModal(true)}>
                <IconTrash size={16} />
              </IconButton>
            </div>
          </div>

          <div className={styles.metadata}>
            <div className={`${styles.metaItem} ${styles.metaItemTooltip}`} data-tooltip="Primary contact">
              <IconUserFilled size={14} /><span>{org.contact}</span>
            </div>
            <div className={styles.metaItem}><IconMailFilled size={14} /><span>{org.email}</span></div>
            <div className={styles.metaItem}><IconPhoneFilled size={14} /><span>{org.phone}</span></div>
            <div className={styles.metaItem}><IconLocationFilled size={14} /><span>{org.fiscal}</span></div>
          </div>

        </div>

      </div>

      {/* ── Content card ── */}
      <div className={styles.contentCard}>
        <CentersContent
          org={org}
          initialCenter={initialCenter}
          initialTeam={initialTeam}
          initialUser={initialUser}
          isMobile={isMobile}
        />
      </div>

      {showEditDrawer  && <EditOrgDrawer  org={org} onClose={() => setShowEditDrawer(false)} />}
      {showDeleteModal && <DeleteOrgModal org={org} onClose={() => setShowDeleteModal(false)} onConfirm={onBack} />}
    </div>
  );
}
