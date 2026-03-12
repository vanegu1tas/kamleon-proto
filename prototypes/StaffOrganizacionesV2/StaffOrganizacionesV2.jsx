import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Sidebar from '../../design-system/components/Sidebar/Sidebar';
import LogoKamleon from '../../design-system/icons/LogoKamleon';
import Button from '../../design-system/components/Button/Button';
import Tag from '../../design-system/components/Tag/Tag';
import SearchBar from '../../design-system/components/SearchBar/SearchBar';
import {
  IconSbCenter,
  IconSbTeams,
  IconSbDrop,
  IconSbChart,
  IconSbUnit,
} from '../../design-system/icons';
// V2-specific screen — master-detail
import OrgDetailV2 from './screens/OrgDetailV2';
// Shared screens from V1 (unchanged)
import CenterDetail from '../StaffOrganizaciones/screens/CenterDetail';
import TeamDetail   from '../StaffOrganizaciones/screens/TeamDetail';
import UserDetail   from '../StaffOrganizaciones/screens/UserDetail';
// Shared drawers from V1
import NewCenterModal from '../StaffOrganizaciones/screens/NewCenterModal';
import NewOrgDrawer   from '../StaffOrganizaciones/screens/NewOrgDrawer';
import EditOrgDrawer  from '../StaffOrganizaciones/screens/EditOrgDrawer';
// Shared mock data and helpers from V1
import { ORGS, getUserCountForOrg, getUserCountForCenter, getProfessionalCountForCenter, getActiveTeamCount } from '../StaffOrganizaciones/mockData';
import { IconFilter, IconEdit, IconPlus, IconTrash, IconSearch } from '../../design-system/icons/outline';
import SearchPalette from './components/SearchPalette';
import ToolbarButton from '../../design-system/components/ToolbarButton/ToolbarButton';
import ContextMenu from '../../design-system/components/ContextMenu/ContextMenu';
// Shared styles from V1 (OrgList is the same)
import styles from '../StaffOrganizaciones/StaffOrganizaciones.module.css';

const NAV_SECTIONS = [
  {
    id: 'management',
    label: 'Management',
    items: [
      { id: 'center', label: 'Center control', icon: <IconSbCenter />, active: true  },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    items: [
      { id: 'hydration', label: 'Hydration',    icon: <IconSbDrop />,  active: false },
      { id: 'uro',       label: 'Uroflowmetry', icon: <IconSbChart />, active: false },
    ],
  },
  {
    id: 'units',
    label: 'Units',
    items: [
      { id: 'devices', label: 'Devices', icon: <IconSbUnit />, active: false },
    ],
  },
];

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="4"  cy="8" r="1.5" fill="currentColor" />
      <circle cx="8"  cy="8" r="1.5" fill="currentColor" />
      <circle cx="12" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 16.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SortIcon({ col, activeCol, dir }) {
  const isActive = col === activeCol;
  const showUp   = !isActive || dir === 'asc';
  const showDown = !isActive || dir === 'desc';
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className={styles.sortIcon}>
      {showUp   && <path d="M5 1L8.5 5H1.5L5 1Z"   fill="currentColor" />}
      {showDown && <path d="M5 11L1.5 7H8.5L5 11Z" fill="currentColor" />}
    </svg>
  );
}

export default function StaffOrganizacionesV2() {
  const [navStack, setNavStack] = useState([{ screen: 'orgs' }]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  const [expandedOrgs, setExpandedOrgs] = useState(new Set());
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [filters, setFilters] = useState({ status: new Set(), segment: new Set() });
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [openMenuOrg, setOpenMenuOrg] = useState(null);
  const openMenuOrgId = openMenuOrg?.id ?? null;
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const menuRef = useRef(null);
  const mainRef = useRef(null);
  const [showNewCenterModal, setShowNewCenterModal] = useState(false);
  const [newCenterOrg, setNewCenterOrg] = useState(null);
  const [showNewOrgDrawer, setShowNewOrgDrawer]   = useState(false);
  const [editOrgTarget,   setEditOrgTarget]       = useState(null);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const createMenuRef = useRef(null);
  const [showPalette, setShowPalette] = useState(false);
  const [tableSearch, setTableSearch] = useState('');

  const currentScreen = navStack[navStack.length - 1];

  function navigate(screen, params = {}) {
    setNavStack(prev => [...prev, { screen, params, key: Date.now() }]);
  }

  function goBack() {
    setNavStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  }

  const SCREEN_LABELS = {
    'orgs':          'Center Control',
    'org-detail':    (params) => params?.org?.name ?? '',
    'center-detail': (params) => params?.center?.name ?? '',
    'team-detail':   (params) => params?.team?.name ?? '',
    'user-detail':   (params) => params?.user?.name ?? '',
  };

  const breadcrumbs = navStack.map((item, i) => ({
    label: typeof SCREEN_LABELS[item.screen] === 'function'
      ? SCREEN_LABELS[item.screen](item.params)
      : SCREEN_LABELS[item.screen] ?? item.screen,
    onClick: i < navStack.length - 1
      ? () => setNavStack(prev => prev.slice(0, i + 1))
      : null,
  }));

  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

  useEffect(() => {
    if (!openMenuOrgId) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuOrg(null);
    }
    function handleScroll() { setOpenMenuOrg(null); }
    document.addEventListener('mousedown', handleClick);
    mainRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      mainRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [openMenuOrgId]);

  useEffect(() => {
    if (!createMenuOpen) return;
    function handleClick(e) {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target)) setCreateMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [createMenuOpen]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsTablet(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowPalette(v => !v);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  function handleSidebarToggle() {
    if (isTablet) {
      setDrawerOpen(false);
    } else {
      setSidebarCollapsed(c => !c);
    }
  }

  function handleSort(col) {
    if (sortCol !== col) { setSortCol(col); setSortDir('asc'); }
    else if (sortDir === 'asc') setSortDir('desc');
    else { setSortCol(null); setSortDir('asc'); }
  }

  function toggleFilter(group, value) {
    setFilters(prev => {
      const next = new Set(prev[group]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [group]: next };
    });
  }

  function clearFilters() {
    setFilters({ status: new Set(), segment: new Set() });
  }

  const activeFilterCount = filters.status.size + filters.segment.size;

  function getSortValue(org, col) {
    if (col === 'centers') return org.centers.length;
    if (col === 'users')   return getUserCountForOrg(org);
    const v = org[col];
    return typeof v === 'string' ? v.toLowerCase() : v;
  }

  let displayedOrgs = [...ORGS];
  if (tableSearch.trim()) displayedOrgs = displayedOrgs.filter(o => o.name.toLowerCase().includes(tableSearch.toLowerCase()));
  if (filters.status.size > 0)  displayedOrgs = displayedOrgs.filter(o => filters.status.has(o.status));
  if (filters.segment.size > 0) displayedOrgs = displayedOrgs.filter(o => filters.segment.has(o.segments.toLowerCase()));
  if (sortCol) {
    displayedOrgs.sort((a, b) => {
      const va = getSortValue(a, sortCol);
      const vb = getSortValue(b, sortCol);
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });
  }

  function toggleOrg(id) {
    setExpandedOrgs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className={styles.page}>
      <div className={styles.sidebarWrap}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
          drawerOpen={isTablet ? drawerOpen : undefined}
          sections={NAV_SECTIONS.map(section => ({
            ...section,
            items: section.items.map(item => ({
              ...item,
              onClick: item.id === 'center'
                ? () => setNavStack([{ screen: 'orgs' }])
                : item.onClick,
            })),
          }))}
        />
      </div>

      {isTablet && drawerOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={styles.main} ref={mainRef}>
        {/* Topbar */}
        <div className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </button>
          <div className={styles.topbarLogo}>
            <LogoKamleon />
          </div>

          {navStack.length > 1 && (
            <nav className={styles.breadcrumb} aria-label="Navegación">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className={styles.breadcrumbItem}>
                  {i > 0 && <span className={styles.breadcrumbSep}>/</span>}
                  {crumb.onClick ? (
                    <button className={styles.breadcrumbLink} onClick={crumb.onClick}>
                      {crumb.label}
                    </button>
                  ) : (
                    <span className={styles.breadcrumbCurrent}>{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          <div className={styles.topbarRight}>
            <button
              className={styles.searchTrigger}
              onClick={() => setShowPalette(true)}
              aria-label="Search (⌘K)"
            >
              <IconSearch size={16} />
              <span className={styles.searchTriggerText}>Search</span>
              <span className={styles.searchTriggerKbd}>⌘K</span>
            </button>
            <button className={styles.notifBtn}>
              <BellIcon />
              <span className={styles.notifDot} />
            </button>
            <div className={styles.avatar}>D</div>
          </div>
        </div>

        {/* ── Screens ── */}

        {currentScreen.screen === 'org-detail' && (
          <OrgDetailV2
            key={currentScreen.key}
            org={currentScreen.params.org}
            onBack={goBack}
            initialCenter={currentScreen.params.initialCenter}
            initialTeam={currentScreen.params.initialTeam}
            initialUser={currentScreen.params.initialUser}
          />
        )}

        {currentScreen.screen === 'center-detail' && (
          <CenterDetail
            center={currentScreen.params.center}
            org={currentScreen.params.org}
            onBack={goBack}
            onNavigate={navigate}
          />
        )}

        {currentScreen.screen === 'team-detail' && (
          <TeamDetail
            team={currentScreen.params.team}
            center={currentScreen.params.center}
            onBack={goBack}
            onNavigate={navigate}
          />
        )}

        {currentScreen.screen === 'user-detail' && (
          <UserDetail
            user={currentScreen.params.user}
            team={currentScreen.params.team}
            center={currentScreen.params.center}
            onBack={goBack}
          />
        )}

        {currentScreen.screen === 'orgs' && (
          <div className={styles.content}>

            <div className={styles.heading}>
              <h1 className={styles.pageTitle}>Welcome, Daniel</h1>
              <div className={styles.createWrap} ref={createMenuRef}>
                <Button
                  variant="primary"
                  size="s"
                  leftIcon={<PlusIcon />}
                  onClick={() => setCreateMenuOpen(prev => !prev)}
                >
                  Create
                </Button>
                {createMenuOpen && (
                  <div className={styles.createMenuWrap}>
                    <ContextMenu
                      items={[
                        { label: 'New Organization', icon: <IconPlus size={16} />, onClick: () => { setCreateMenuOpen(false); setShowNewOrgDrawer(true); } },
                        { label: 'New Center',       icon: <IconPlus size={16} />, onClick: () => { setCreateMenuOpen(false); setNewCenterOrg(null); setShowNewCenterModal(true); } },
                        { label: 'New Team',         icon: <IconPlus size={16} />, onClick: () => setCreateMenuOpen(false) },
                        { label: 'New User',         icon: <IconPlus size={16} />, onClick: () => setCreateMenuOpen(false) },
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* KPI cards */}
            {(() => {
              const totalOrgs    = ORGS.length;
              const totalCenters = ORGS.reduce((acc, o) => acc + o.centers.length, 0);
              const totalUsers   = ORGS.reduce((acc, o) => acc + getUserCountForOrg(o), 0);
              const totalUnits   = ORGS.reduce((acc, o) => acc + o.units, 0);
              return (
                <div className={styles.kpiRow}>
                  <div className={styles.kpiCard}>
                    <span className={styles.kpiValue}>{totalOrgs}</span>
                    <span className={styles.kpiLabel}>Total Orgs</span>
                  </div>
                  <div className={styles.kpiCard}>
                    <span className={styles.kpiValue}>{totalCenters}</span>
                    <span className={styles.kpiLabel}>Total Centers</span>
                  </div>
                  <div className={styles.kpiCard}>
                    <span className={styles.kpiValue}>{totalUsers}</span>
                    <span className={styles.kpiLabel}>Total Users</span>
                  </div>
                  <div className={styles.kpiCard}>
                    <span className={styles.kpiValue}>{totalUnits}</span>
                    <span className={styles.kpiLabel}>Total Units</span>
                  </div>
                  <div className={`${styles.kpiCard} ${styles.alert}`}>
                    <span className={styles.kpiValue}>3</span>
                    <span className={styles.kpiLabel}>Sensor alerts</span>
                  </div>
                </div>
              );
            })()}

            {/* Organizations table */}
            <div className={styles.tableCard}>
              <div className={styles.tableTop}>
                <div className={styles.tableTopRow}>
                  <h2 className={styles.tableTitle}>Organizations</h2>
                </div>
                <div className={styles.tableControls}>
                  <SearchBar
                    placeholder="Search by name..."
                    className={styles.searchBar}
                    value={tableSearch}
                    onChange={e => setTableSearch(e.target.value)}
                    onClear={() => setTableSearch('')}
                  />
                  <div className={styles.filterWrap} ref={filterRef}>
                    <ToolbarButton
                      icon={<IconFilter size={16} />}
                      selected={activeFilterCount > 0}
                      onClick={() => setFilterOpen(v => !v)}
                      aria-label="Filter"
                    >
                      Filters
                      {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
                    </ToolbarButton>
                    {filterOpen && (
                      <div className={styles.filterDropdown}>
                        <div className={styles.filterSection}>
                          <p className={styles.filterSectionLabel}>Segment</p>
                          {[{ v: 'sport', label: 'Sport' }, { v: 'fitness', label: 'Fitness' }].map(({ v, label }) => (
                            <label
                              key={v}
                              className={`${styles.filterOption} ${filters.segment.has(v) ? styles.filterOptionChecked : ''}`}
                            >
                              <input
                                type="checkbox"
                                className={styles.nativeCheck}
                                checked={filters.segment.has(v)}
                                onChange={() => toggleFilter('segment', v)}
                              />
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
                            <label
                              key={v}
                              className={`${styles.filterOption} ${filters.status.has(v) ? styles.filterOptionChecked : ''}`}
                            >
                              <input
                                type="checkbox"
                                className={styles.nativeCheck}
                                checked={filters.status.has(v)}
                                onChange={() => toggleFilter('status', v)}
                              />
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
                          <button className={styles.clearFilters} onClick={clearFilters}>
                            Clear filters
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.tableBody}>
                {/* Column headers */}
                <div className={styles.colHeaders}>
                  <div className={`${styles.colHead} ${styles.colName}`}>
                    <button className={`${styles.sortBtn} ${sortCol === 'name' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('name')}>
                      Name <SortIcon col="name" activeCol={sortCol} dir={sortDir} />
                    </button>
                  </div>
                  <div className={`${styles.colHead} ${styles.colStatus} ${styles.cellCenter}`}>Status</div>
                  <div className={`${styles.colHead} ${styles.colPlan} ${styles.cellCenter}`}>
                    <button className={`${styles.sortBtn} ${sortCol === 'centers' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('centers')}>
                      Centers <SortIcon col="centers" activeCol={sortCol} dir={sortDir} />
                    </button>
                  </div>
                  <div className={`${styles.colHead} ${styles.colCenters} ${styles.cellCenter}`}>
                    <button className={`${styles.sortBtn} ${sortCol === 'users' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('users')}>
                      Users <SortIcon col="users" activeCol={sortCol} dir={sortDir} />
                    </button>
                  </div>
                  <div className={`${styles.colHead} ${styles.colTeams} ${styles.cellCenter}`}>
                    <button className={`${styles.sortBtn} ${sortCol === 'units' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('units')}>
                      Units <SortIcon col="units" activeCol={sortCol} dir={sortDir} />
                    </button>
                  </div>
                  <div className={`${styles.colHead} ${styles.colUsers} ${styles.cellCenter}`}>Segments</div>
                  <div className={`${styles.colHead} ${styles.colActions}`} />
                </div>

                {/* Rows */}
                {displayedOrgs.map(org => {
                  const isExpanded = expandedOrgs.has(org.id);
                  return (
                    <div key={org.id}>
                      <div
                        className={`${styles.orgRow} ${isExpanded ? styles.orgRowExpanded : ''}`}
                        onClick={() => navigate('org-detail', { org })}
                      >
                        <div className={`${styles.cellName} ${styles.colName}`}>
                          <button
                            className={`${styles.expandBtn} ${isExpanded ? styles.expanded : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleOrg(org.id); }}
                            aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
                          >
                            <ChevronIcon />
                          </button>
                          <div className={styles.orgLogo}>{org.name.charAt(0)}</div>
                          <span className={styles.orgName}>{org.name}</span>
                        </div>
                        <div className={`${styles.cell} ${styles.colStatus} ${styles.cellCenter}`}>
                          <Tag status={org.status} />
                        </div>
                        <div className={`${styles.cell} ${styles.colPlan} ${styles.cellCenter}`}>{org.centers.length}</div>
                        <div className={`${styles.cell} ${styles.colCenters} ${styles.cellCenter}`}>{getUserCountForOrg(org)}</div>
                        <div className={`${styles.cell} ${styles.colTeams} ${styles.cellCenter}`}>{org.units}</div>
                        <div className={`${styles.cell} ${styles.colUsers} ${styles.cellCenter}`}>{org.segments}</div>
                        <div className={styles.cellActions}>
                          <div className={styles.moreMenuAnchor} onClick={e => e.stopPropagation()}>
                            <button
                              className={styles.actionBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (openMenuOrgId === org.id) {
                                  setOpenMenuOrg(null);
                                } else {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                                  setOpenMenuOrg(org);
                                }
                              }}
                            >
                              <DotsIcon />
                            </button>
                          </div>
                        </div>
                      </div>

                      {isExpanded && org.centers.length > 0 && (
                        <div className={styles.centerRows}>
                          {org.centers.map((center) => {
                            const teams = getActiveTeamCount(center);
                            const users = getUserCountForCenter(center);
                            const profs = getProfessionalCountForCenter(center);
                            return (
                              <div
                                key={center.id}
                                className={styles.centerRow}
                                onClick={e => { e.stopPropagation(); navigate('org-detail', { org, initialCenter: center }); }}
                              >
                                <div className={styles.centerAvatar}>{center.name.charAt(0)}</div>
                                <span className={styles.centerName}>{center.name}</span>
                                <div className={styles.centerStats}>
                                  <span>{teams} {teams === 1 ? 'team' : 'teams'}</span>
                                  <span className={styles.statDot}>·</span>
                                  <span>{users} {users === 1 ? 'user' : 'users'}</span>
                                  <span className={styles.statDot}>·</span>
                                  <span>{profs} {profs === 1 ? 'professional' : 'professionals'}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className={styles.pagination}>
                <span className={styles.pageInfo}>
                  Showing <strong>1–10</strong> of <strong>14</strong> organizations
                </span>
                <div className={styles.pageButtons}>
                  <button className={styles.pageBtn} disabled>Previous</button>
                  <button className={`${styles.pageBtn} ${styles.active}`}>Next</button>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {showNewCenterModal && <NewCenterModal org={newCenterOrg} onClose={() => { setShowNewCenterModal(false); setNewCenterOrg(null); }} />}
      {showNewOrgDrawer   && <NewOrgDrawer   onClose={() => setShowNewOrgDrawer(false)} />}
      {editOrgTarget      && <EditOrgDrawer  org={editOrgTarget} onClose={() => setEditOrgTarget(null)} />}
      {showPalette && <SearchPalette onClose={() => setShowPalette(false)} onNavigate={navigate} />}

      {openMenuOrgId && createPortal(
        <div className={styles.contextMenuWrap} style={{ top: menuPos.top, right: menuPos.right }} ref={menuRef}>
          <ContextMenu
            items={[
              { label: 'Edit',       icon: <IconEdit  size={16} />, onClick: () => { setEditOrgTarget(openMenuOrg); setOpenMenuOrg(null); } },
              { label: 'New Center', icon: <IconPlus  size={16} />, onClick: () => { setNewCenterOrg(openMenuOrg); setOpenMenuOrg(null); setShowNewCenterModal(true); } },
              { label: 'Delete',     icon: <IconTrash size={16} />, variant: 'danger', onClick: () => setOpenMenuOrg(null) },
            ]}
          />
        </div>,
        document.body
      )}

    </div>
  );
}
