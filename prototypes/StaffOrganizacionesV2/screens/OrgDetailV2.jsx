import { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react';
import Tag from '../../../design-system/components/Tag/Tag';
import TabBar from '../../../design-system/components/TabBar/TabBar';
import SearchBar from '../../../design-system/components/SearchBar/SearchBar';
import { IconEdit, IconPlus, IconTrash, IconSettings } from '../../../design-system/icons/outline';
import { IconUserFilled, IconMailFilled, IconPhoneFilled, IconLocationFilled } from '../../../design-system/icons/filled';
import { getUserCountForCenter, getProfessionalCountForCenter, getActiveTeamCount, USERS_POOL } from '../../StaffOrganizaciones/mockData';
import ContextMenu      from '../../../design-system/components/ContextMenu/ContextMenu';
import EditOrgDrawer    from '../../StaffOrganizaciones/screens/EditOrgDrawer';
import IconButton       from '../../../design-system/components/IconButton/IconButton';
import EditCenterDrawer from '../../StaffOrganizaciones/screens/EditCenterDrawer';
import NewCenterModal   from '../../StaffOrganizaciones/screens/NewCenterModal';
import NewTeamDrawer    from '../../StaffOrganizaciones/screens/NewTeamDrawer';
import NewUserDrawer    from '../../StaffOrganizaciones/screens/NewUserDrawer';
import EditUserDrawer   from '../../StaffOrganizaciones/screens/EditUserDrawer';
import styles from './OrgDetailV2.module.css';

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

function EmptyState({ title, subtitle }) {
  return (
    <div className={styles.emptyFill}>
      <div className={styles.emptyState}>
        <div className={styles.emptyCircle} />
        <div className={styles.emptyText}>
          <p className={styles.emptyTitle}>{title}</p>
          <p className={styles.emptySubtitle}>{subtitle}</p>
        </div>
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

function CentersContent({ org, initialCenter, initialTeam, initialUser }) {
  const centers = org.centers;
  const [showNewCenter, setShowNewCenter]           = useState(false);
  const [selectedId, setSelectedId]                 = useState(initialCenter?.id ?? centers[0]?.id ?? null);
  const [selectedTeam, setSelectedTeam]             = useState(initialTeam ?? null);
  const [selectedTeamCenter, setSelectedTeamCenter] = useState(initialTeam ? initialCenter : null);
  const [selectedUser, setSelectedUser]             = useState(initialUser ?? null);
  const [selectedUserTeam, setSelectedUserTeam]     = useState(null); // set when navigating from Users tab
  const [editCenterTarget, setEditCenterTarget]     = useState(null);
  const [newTeamCenter, setNewTeamCenter]           = useState(null);
  const [newUserContext, setNewUserContext]          = useState(null); // { center, team? }
  const [centerSearch, setCenterSearch]             = useState('');

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
  }

  if (centers.length === 0) {
    return (
      <EmptyState
        title="No centers yet..."
        subtitle="Use + New Center in the header to create the first one."
      />
    );
  }

  return (
    <>
      <div className={styles.masterDetail}>

        {/* ── Left: center list ── */}
        <div className={styles.listPanel}>
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
            <SearchBar
              placeholder="Search..."
              value={centerSearch}
              onChange={e => setCenterSearch(e.target.value)}
              onClear={() => setCenterSearch('')}
            />
          </div>
          <div className={styles.listItems}>
            {filteredCenters.map(center => (
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
            ))}
          </div>
        </div>

        {/* ── Right: user / team / center detail ── */}
        <div className={styles.detailPanel}>
          {selectedUser ? (
            <UserCard
              user={selectedUser}
              team={selectedTeam ?? selectedUserTeam}
              backLabel={selectedTeam ? selectedTeam.name : selected?.name}
              onBack={() => { setSelectedUser(null); setSelectedUserTeam(null); }}
            />
          ) : selectedTeam ? (
            <TeamCard
              team={selectedTeam}
              center={selectedTeamCenter}
              org={org}
              onBack={() => { setSelectedTeam(null); setSelectedUser(null); setSelectedUserTeam(null); }}
              onSelectUser={(user) => setSelectedUser(user)}
              onNewUser={() => setNewUserContext({ center: selectedTeamCenter, team: selectedTeam })}
            />
          ) : selected ? (
            <CenterCard
              center={selected}
              org={org}
              onEdit={() => setEditCenterTarget(selected)}
              onNewTeam={() => setNewTeamCenter(selected)}
              onNewUser={() => setNewUserContext({ center: selected })}
              onSelectTeam={(team) => {
                setSelectedTeam(team);
                setSelectedTeamCenter(selected);
              }}
              onSelectUser={(user, team) => {
                setSelectedUser(user);
                setSelectedUserTeam(team);
              }}
            />
          ) : (
            <div className={styles.detailEmpty}>
              <span className={styles.detailEmptyText}>Select a center to view its details</span>
            </div>
          )}
        </div>

      </div>

      {showNewCenter    && <NewCenterModal org={org} onClose={() => setShowNewCenter(false)} />}
      {editCenterTarget && <EditCenterDrawer center={editCenterTarget} org={org} onClose={() => setEditCenterTarget(null)} />}
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

function TeamsTab({ center, onSelectTeam }) {
  const teams = center.teams ?? [];
  if (teams.length === 0) {
    return (
      <InnerEmptyState
        title="No teams yet..."
        subtitle="Teams for this center will appear here"
      />
    );
  }
  return (
    <div className={styles.innerList}>
      {teams.map(team => {
        const userCount = (team.users ?? []).length;
        const profCount = (team.professionalIds ?? []).length;
        return (
          <button
            key={team.id}
            className={styles.innerRow}
            onClick={() => onSelectTeam(team)}
          >
            <div className={styles.innerRowAvatar}>{team.name.charAt(0)}</div>
            <div className={styles.innerRowMeta}>
              <span className={styles.innerRowName}>{team.name}</span>
              <span className={styles.innerRowSub}>
                {userCount} {userCount === 1 ? 'user' : 'users'} · {profCount} {profCount === 1 ? 'professional' : 'professionals'}
              </span>
            </div>
            <Tag status={team.status} />
          </button>
        );
      })}
    </div>
  );
}

// ─── Details tab ─────────────────────────────────────────

function DetailsTab({ center, org }) {
  const teams = getActiveTeamCount(center);
  const users = getUserCountForCenter(center);
  const profs = getProfessionalCountForCenter(center);

  return (
    <div className={styles.detailsTab}>

      <div className={styles.detailsSection}>
        <span className={styles.sectionLabel}>Overview</span>
        <div className={styles.statsGrid}>
          <div className={styles.statBlock}>
            <span className={styles.statNum}>{teams}</span>
            <span className={styles.statName}>Teams</span>
          </div>
          <div className={styles.statDividerV} />
          <div className={styles.statBlock}>
            <span className={styles.statNum}>{users}</span>
            <span className={styles.statName}>Users</span>
          </div>
          <div className={styles.statDividerV} />
          <div className={styles.statBlock}>
            <span className={styles.statNum}>{profs}</span>
            <span className={styles.statName}>Professionals</span>
          </div>
        </div>
      </div>

      <div className={styles.detailsSection}>
        <span className={styles.sectionLabel}>Administrator</span>
        <div className={styles.infoList}>
          <div className={styles.infoRow}>
            <IconUserFilled size={14} />
            <span>{center.contact ?? org.contact}</span>
          </div>
          <div className={styles.infoRow}>
            <IconMailFilled size={14} />
            <span>{center.email}</span>
          </div>
        </div>
      </div>

      <div className={styles.detailsSection}>
        <span className={styles.sectionLabel}>Contact</span>
        <div className={styles.infoList}>
          <div className={styles.infoRow}>
            <IconUserFilled size={14} />
            <span>{center.contact ?? org.contact}</span>
          </div>
          <div className={styles.infoRow}>
            <IconMailFilled size={14} />
            <span>{center.email}</span>
          </div>
          <div className={styles.infoRow}>
            <IconPhoneFilled size={14} />
            <span>{center.phone}</span>
          </div>
          <div className={styles.infoRow}>
            <IconLocationFilled size={14} />
            <span>{center.address}</span>
          </div>
        </div>
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

function CenterCard({ center, org, onEdit, onNewTeam, onNewUser, onSelectTeam, onSelectUser }) {
  const [innerTab, setInnerTab]         = useState('details');
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
                <span>{org.name}</span>
                <span className={styles.separator}>|</span>
                <div className={styles.statusBadgeSmall}>
                  <div className={`${styles.statusDot} ${styles[center.status]}`} />
                  <span>{center.status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.cardActions}>
            <div className={styles.createMenuAnchor} ref={createMenuRef}>
              <IconButton
                aria-label="Create"
                tooltip="Create"
                onClick={() => setCreateMenuOpen(v => !v)}
              >
                <IconPlus size={16} />
              </IconButton>
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
        <TabBar tabs={CENTER_TABS} activeTab={innerTab} onChange={handleTabChange} />
      </div>

      {/* ── Scrollable tab content ── */}
      <div ref={tabContentRef} className={styles.innerTabContent}>
        {innerTab === 'details' && (
          <DetailsTab center={center} org={org} />
        )}
        {innerTab === 'teams' && (
          <TeamsTab center={center} onSelectTeam={onSelectTeam} />
        )}
        {innerTab === 'users' && (
          <UsersTab center={center} onSelectUser={onSelectUser} />
        )}
        {innerTab === 'units' && (
          <InnerEmptyState
            title="No units yet..."
            subtitle="Hardware units assigned to this center will appear here"
          />
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

function TeamCard({ team, center, org, onBack, onSelectUser, onNewUser }) {
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);

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

  function handleSearch(val) {
    setSearch(val);
    setPage(1);
  }

  return (
    <div className={styles.centerCard}>

      {/* ── Fixed header ── */}
      <div className={styles.innerHeader}>

        <button className={styles.teamBackBtn} onClick={onBack}>
          <ArrowLeftIcon />
          <span>Back to {center.name}</span>
        </button>

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
      <div className={styles.teamContent}>

        <div className={styles.teamToolbar}>
          <SearchBar
            placeholder="Search members..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            onClear={() => handleSearch('')}
          />
          <span className={styles.teamCount}>
            {filtered.length} {filtered.length === 1 ? 'member' : 'members'}
          </span>
        </div>

        {pageMembers.length > 0 ? (
          <div className={styles.teamTable}>
            <div className={styles.teamTableHead}>
              <span className={`${styles.teamCol} ${styles.teamColName}`}>Name</span>
              <span className={`${styles.teamCol} ${styles.teamColStatus}`}>Status</span>
              <span className={`${styles.teamCol} ${styles.teamColDate}`}>Date Added</span>
              <span className={`${styles.teamCol} ${styles.teamColActions}`} />
            </div>
            {pageMembers.map(member => (
              <button
                key={member.id}
                className={styles.teamTableRow}
                onClick={() => onSelectUser(member)}
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
                <div className={`${styles.teamCol} ${styles.teamColDate}`}>
                  <span className={styles.dateText}>{member.dateAdded}</span>
                </div>
                <div className={`${styles.teamCol} ${styles.teamColActions}`}>
                  <span className={styles.moreBtn} aria-hidden="true">···</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <InnerEmptyState
            title={search ? 'No results' : 'No members yet...'}
            subtitle={search ? `No members match "${search}"` : 'Add users to this team to see them here'}
          />
        )}

        {filtered.length > TEAM_PAGE_SIZE && (
          <div className={styles.teamPagination}>
            <span className={styles.paginationInfo}>
              Showing {(safePage - 1) * TEAM_PAGE_SIZE + 1}–{Math.min(safePage * TEAM_PAGE_SIZE, filtered.length)} of {filtered.length} members
            </span>
            <div className={styles.paginationBtns}>
              <button
                className={styles.paginationBtn}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
              >
                Previous
              </button>
              <button
                className={styles.paginationBtn}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

// ─── User detail card ─────────────────────────────────────

function UserCard({ user, team, backLabel, onBack }) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className={styles.centerCard}>

      {/* ── Fixed header ── */}
      <div className={styles.innerHeader}>

        <button className={styles.teamBackBtn} onClick={onBack}>
          <ArrowLeftIcon />
          <span>Back to {backLabel ?? team?.name}</span>
        </button>

        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <div className={styles.cardAvatar}>{user.name.charAt(0)}</div>
            <div className={styles.cardTitleGroup}>
              <h2 className={styles.cardTitle}>{user.name}</h2>
              <div className={styles.cardSubtitle}>
                <span>{team.name}</span>
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
              <span>RFID: <strong>{user.rfid ? 'On' : 'Off'}</strong></span>
            </div>
            <div className={styles.permItem}>
              <IconPin />
              <span>PIN: <strong>{user.pin ? 'On' : 'Off'}</strong></span>
            </div>
          </div>
        </div>

      </div>

      {showEdit && <EditUserDrawer user={user} team={team} onClose={() => setShowEdit(false)} />}

    </div>
  );
}

// ─── Main component ───────────────────────────────────────

export default function OrgDetailV2({ org, onBack, initialCenter, initialTeam, initialUser }) {
  const [showEditDrawer, setShowEditDrawer] = useState(false);

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
              <IconButton aria-label="Eliminar organización" tooltip="Delete" variant="danger">
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
        />
      </div>

      {showEditDrawer && <EditOrgDrawer org={org} onClose={() => setShowEditDrawer(false)} />}
    </div>
  );
}
