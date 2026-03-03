import { useState, useEffect } from 'react';
import Sidebar from '../../design-system/components/Sidebar/Sidebar';
import LogoKamleon from '../../design-system/icons/LogoKamleon';
import Button from '../../design-system/components/Button/Button';
import Tag from '../../design-system/components/Tag/Tag';
import {
  IconSbCenter,
  IconSbTeams,
  IconSbDrop,
  IconSbChart,
  IconSbUnit,
} from '../../design-system/icons';
import OrgDetail from './screens/OrgDetail';
import CenterDetail from './screens/CenterDetail';
import styles from './StaffOrganizaciones.module.css';

// ─── Mock data ──────────────────────────────────────────

const ORGS = [
  { id: 1, name: 'AnyósPark',             status: 'active',   centers: 3, users: 45,  units: 12, segments: 'Fitness'       },
  { id: 2, name: 'Arsenal Football Club', status: 'active',   centers: 5, users: 120, units: 30, segments: 'Sport',
    centersList: [
      { id: 1, name: 'Sede Guarne',   status: 'active' },
      { id: 2, name: 'Sede Medellín', status: 'active' },
    ] },
  { id: 3, name: 'Astonia FC',            status: 'active',   centers: 2, users: 34,  units: 8,  segments: 'Sport'         },
  { id: 4, name: 'Baskonia-Alavés Group', status: 'active',   centers: 4, users: 87,  units: 22, segments: 'Sport'         },
  { id: 5, name: 'CAR Sant Cugat',        status: 'active',   centers: 2, users: 41,  units: 10, segments: 'Fitness'       },
  { id: 6, name: 'CAR Sierra Nevada',     status: 'active',   centers: 1, users: 28,  units: 6,  segments: 'Sport'         },
  { id: 7, name: 'CEAR La Cartuja',       status: 'inactive', centers: 1, users: 19,  units: 4,  segments: 'Fitness'       },
  { id: 8, name: 'CEM Joan Miró',         status: 'active',   centers: 2, users: 56,  units: 14, segments: 'Sport',
    centersList: [
      { id: 1, name: 'Joan Miró Centre', status: 'active' },
      { id: 2, name: 'Nou Barris',       status: 'active' },
    ] },
  { id: 9, name: 'CNEA Font-Romeu',       status: 'active',   centers: 1, users: 22,  units: 5,  segments: 'Sport'         },
  { id: 10, name: 'Dynatech',             status: 'inactive', centers: 1, users: 15,  units: 3,  segments: 'Fitness'       },
];

const NAV_SECTIONS = [
  {
    id: 'management',
    label: 'Management',
    items: [
      { id: 'center', label: 'Center control', icon: <IconSbCenter />, active: true  },
      { id: 'teams',  label: 'Teams',           icon: <IconSbTeams />,  active: false },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    items: [
      { id: 'hydration', label: 'Hydration',     icon: <IconSbDrop />,  active: false },
      { id: 'uro',       label: 'Uroflowmetry',  icon: <IconSbChart />, active: false },
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

// ─── Icons ──────────────────────────────────────────────

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

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Component ──────────────────────────────────────────

export default function StaffOrganizaciones() {
  const [navStack, setNavStack] = useState([{ screen: 'orgs' }]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  const [expandedOrgs, setExpandedOrgs] = useState(new Set());

  const currentScreen = navStack[navStack.length - 1];

  function navigate(screen, params = {}) {
    setNavStack(prev => [...prev, { screen, params }]);
  }

  function goBack() {
    setNavStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  }

  const SCREEN_LABELS = {
    'orgs':          'Center Control',
    'org-detail':    (params) => params?.org?.name ?? '',
    'center-detail': (params) => params?.center?.name ?? '',
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
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsTablet(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  function handleSidebarToggle() {
    if (isTablet) {
      setDrawerOpen(false);
    } else {
      setSidebarCollapsed(c => !c);
    }
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
          sections={NAV_SECTIONS}
          drawerOpen={isTablet ? drawerOpen : undefined}
        />
      </div>

      {/* Backdrop (tablet drawer) */}
      {isTablet && drawerOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={styles.main}>
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

          {/* Breadcrumb — desktop only, visible cuando hay más de un nivel */}
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
            <button className={styles.notifBtn}>
              <BellIcon />
              <span className={styles.notifDot} />
            </button>
            <div className={styles.avatar}>D</div>
          </div>
        </div>

        {/* Page content */}
        {currentScreen.screen === 'org-detail' && (
          <OrgDetail
            org={currentScreen.params.org}
            onBack={goBack}
            onNavigate={navigate}
          />
        )}

        {currentScreen.screen === 'center-detail' && (
          <CenterDetail
            center={currentScreen.params.center}
            org={currentScreen.params.org}
            onBack={goBack}
          />
        )}

        {currentScreen.screen === 'orgs' && <div className={styles.content}>

          {/* Heading */}
          <div className={styles.heading}>
            <h1 className={styles.pageTitle}>Welcome, Daniel</h1>
            <Button variant="primary" size="s" leftIcon={<PlusIcon />}>
              Create
            </Button>
          </div>

          {/* KPI cards */}
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}>
              <span className={styles.kpiValue}>12</span>
              <span className={styles.kpiLabel}>Total Orgs</span>
            </div>
            <div className={styles.kpiCard}>
              <span className={styles.kpiValue}>14</span>
              <span className={styles.kpiLabel}>Total Centers</span>
            </div>
            <div className={styles.kpiCard}>
              <span className={styles.kpiValue}>364</span>
              <span className={styles.kpiLabel}>Total Users</span>
            </div>
            <div className={styles.kpiCard}>
              <span className={styles.kpiValue}>22/30</span>
              <span className={styles.kpiLabel}>Active Units</span>
            </div>
            <div className={`${styles.kpiCard} ${styles.alert}`}>
              <span className={styles.kpiValue}>3</span>
              <span className={styles.kpiLabel}>Sensor alerts</span>
            </div>
          </div>

          {/* Organizations table */}
          <div className={styles.tableCard}>
            <div className={styles.tableTop}>
              <h2 className={styles.tableTitle}>Organizations</h2>
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}><SearchIcon /></span>
                <input
                  className={styles.searchInput}
                  placeholder="Search by name..."
                />
              </div>
            </div>

            <div className={styles.tableBody}>
              {/* Column headers */}
              <div className={styles.colHeaders}>
                <div className={`${styles.colHead} ${styles.colName}`}>Name</div>
                <div className={`${styles.colHead} ${styles.colStatus} ${styles.cellCenter}`}>Status</div>
                <div className={`${styles.colHead} ${styles.colPlan} ${styles.cellCenter}`}>Centers</div>
                <div className={`${styles.colHead} ${styles.colCenters} ${styles.cellCenter}`}>Users</div>
                <div className={`${styles.colHead} ${styles.colTeams} ${styles.cellCenter}`}>Units</div>
                <div className={`${styles.colHead} ${styles.colUsers} ${styles.cellCenter}`}>Segments</div>
                <div className={`${styles.colHead} ${styles.colActions}`} />
              </div>

              {/* Rows */}
              {ORGS.map(org => {
                const isExpanded = expandedOrgs.has(org.id);
                return (
                  <div key={org.id}>
                    <div
                      className={`${styles.orgRow} ${isExpanded ? styles.orgRowExpanded : ''}`}
                      onClick={() => navigate('org-detail', { org })}
                    >
                      {/* Name cell */}
                      <div className={`${styles.cellName} ${styles.colName}`}>
                        <button
                          className={`${styles.expandBtn} ${isExpanded ? styles.expanded : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleOrg(org.id); }}
                          aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
                        >
                          <ChevronIcon />
                        </button>
                        <div className={styles.orgLogo}>
                          {org.name.charAt(0)}
                        </div>
                        <span className={styles.orgName}>{org.name}</span>
                      </div>

                      {/* Status */}
                      <div className={`${styles.cell} ${styles.colStatus} ${styles.cellCenter}`}>
                        <Tag status={org.status} />
                      </div>

                      {/* Centers */}
                      <div className={`${styles.cell} ${styles.colPlan} ${styles.cellCenter}`}>
                        {org.centers}
                      </div>

                      {/* Users */}
                      <div className={`${styles.cell} ${styles.colCenters} ${styles.cellCenter}`}>
                        {org.users}
                      </div>

                      {/* Units */}
                      <div className={`${styles.cell} ${styles.colTeams} ${styles.cellCenter}`}>
                        {org.units}
                      </div>

                      {/* Segments */}
                      <div className={`${styles.cell} ${styles.colUsers} ${styles.cellCenter}`}>
                        {org.segments}
                      </div>

                      {/* Actions */}
                      <div className={styles.cellActions}>
                        <button className={styles.actionBtn}>
                          <DotsIcon />
                        </button>
                      </div>
                    </div>

                    {/* Expanded center rows */}
                    {isExpanded && org.centersList && (
                      <div className={styles.centerRows}>
                        {org.centersList.map((center, i) => (
                          <div
                            key={i}
                            className={styles.centerRow}
                            onClick={e => { e.stopPropagation(); navigate('center-detail', { center, org }); }}
                          >
                            <div className={styles.centerCell}>{center.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
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

        </div>}

      </div>
    </div>
  );
}
