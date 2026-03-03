import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import Tag from '../../../design-system/components/Tag/Tag';
import styles from './OrgDetail.module.css';

// ─── Icons ──────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 13.5c0-3 2.5-4.5 5.5-4.5s5.5 1.5 5.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 6l6 4 6-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5.5 2.5h-1a2 2 0 00-2 2c0 5.523 4.477 10 10 10a2 2 0 002-2v-1a1 1 0 00-.684-.948l-2-1a1 1 0 00-1.032.22l-.86.86a7.5 7.5 0 01-3.056-3.056l.86-.86a1 1 0 00.22-1.032l-1-2A1 1 0 005.5 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6C12.5 3.515 10.485 1.5 8 1.5z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 5h10M6 5V3.5h4V5M5.5 5l.5 7.5h4l.5-7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="4"  cy="8" r="1.5" fill="currentColor" />
      <circle cx="8"  cy="8" r="1.5" fill="currentColor" />
      <circle cx="12" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

// ─── Tabs ────────────────────────────────────────────────

const TABS = [
  { id: 'centers',        label: 'Centers' },
  { id: 'administrators', label: 'Administrators' },
  { id: 'monitoring',     label: 'Monitoring' },
];

// ─── Mock data ───────────────────────────────────────────

const MOCK_DETAIL = {
  contact:  'Daniel Vanegas',
  email:    'contact@organization.com',
  phone:    '+34 93 123 45 67',
  fiscal:   'Carrer de Provença, 292, Barcelona',
  shipping: 'Carrer de Provença, 292, Barcelona',
};

const DEFAULT_CENTERS = [
  { id: 1, name: 'Sede Guarne',   teams: 2, professionals: 2, users: 2, status: 'active',
    teamsList: ['Team Alpha', 'Team Beta'] },
  { id: 2, name: 'Sede Medellín', teams: 1, professionals: 2, users: 2, status: 'active',
    teamsList: ['Team Gamma'] },
];

// Por org ID — orgs sin entrada usan DEFAULT_CENTERS
const CENTERS_BY_ORG = {
  1: [], // AnyósPark — sin centros
};

// ─── Empty state ─────────────────────────────────────────

function EmptyState({ title, subtitle, action }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyInfo}>
        <div className={styles.emptyCircle} />
        <div className={styles.emptyText}>
          <p className={styles.emptyTitle}>{title}</p>
          <p className={styles.emptySubtitle}>{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── Centers content ─────────────────────────────────────

function CentersContent({ org, onNavigate }) {
  const [expandedCenters, setExpandedCenters] = useState(new Set());
  const centers = Object.hasOwn(CENTERS_BY_ORG, org.id) ? CENTERS_BY_ORG[org.id] : DEFAULT_CENTERS;
  const hasCenters = centers.length > 0;

  function toggleCenter(id) {
    setExpandedCenters(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (!hasCenters) {
    return (
      <div className={styles.contentSection}>
        <h2 className={styles.contentTitle}>Centers</h2>
        <EmptyState
          title="No centers yet..."
          subtitle="Your centers will be displayed here, let's create your first center"
          action={
            <Button variant="primary" size="s" leftIcon={<PlusIcon />}>
              New Center
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      {/* Top: título + botón + search */}
      <div className={styles.centersTop}>
        <div className={styles.centersTopRow}>
          <h2 className={styles.contentTitle}>Centers</h2>
          <Button variant="primary" size="s" leftIcon={<PlusIcon />}>
            New Center
          </Button>
        </div>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}><SearchIcon /></span>
          <input className={styles.searchInput} placeholder="Search by name..." />
        </div>
      </div>

      {/* Tabla */}
      <div className={styles.tableWrap}>
        {/* Header */}
        <div className={styles.tableHeader}>
          <div className={`${styles.colHead} ${styles.colCenter}`}>Center</div>
          <div className={`${styles.colHead} ${styles.colNum}`}>Active Teams</div>
          <div className={`${styles.colHead} ${styles.colNum}`}>Professionals</div>
          <div className={`${styles.colHead} ${styles.colNum}`}>Users</div>
          <div className={`${styles.colHead} ${styles.colNum}`}>Status</div>
          <div className={`${styles.colHead} ${styles.colActions}`} />
        </div>

        {/* Rows */}
        {centers.map((center, i) => {
          const isExpanded = expandedCenters.has(center.id);
          const hasTeams  = center.teamsList?.length > 0;
          return (
            <div key={center.id}>
              <div
                className={`${styles.tableRow} ${!isExpanded && i < centers.length - 1 ? styles.rowBorder : ''}`}
                onClick={() => onNavigate('center-detail', { center, org })}
              >
                <div className={`${styles.centerNameCell} ${styles.colCenter}`}>
                  <button
                    className={`${styles.rowChevron} ${isExpanded ? styles.rowChevronExpanded : ''} ${!hasTeams ? styles.rowChevronDisabled : ''}`}
                    onClick={e => { e.stopPropagation(); if (hasTeams) toggleCenter(center.id); }}
                    aria-label={isExpanded ? 'Colapsar equipos' : 'Ver equipos'}
                  >
                    <ChevronIcon />
                  </button>
                  <div className={styles.centerAvatar}>{center.name.charAt(0)}</div>
                  <span className={styles.centerName}>{center.name}</span>
                </div>
                <div className={`${styles.numCell} ${styles.colNum}`}>{center.teams}</div>
                <div className={`${styles.numCell} ${styles.colNum}`}>{center.professionals}</div>
                <div className={`${styles.numCell} ${styles.colNum}`}>{center.users}</div>
                <div className={`${styles.numCell} ${styles.colNum}`}>
                  <Tag status={center.status} />
                </div>
                <div className={`${styles.actionsCell} ${styles.colActions}`}>
                  <button className={styles.dotsBtn} aria-label="Más opciones" onClick={e => e.stopPropagation()}>
                    <DotsIcon />
                  </button>
                </div>
              </div>

              {isExpanded && center.teamsList && (
                <div className={`${styles.teamRows} ${i < centers.length - 1 ? styles.rowBorder : ''}`}>
                  {center.teamsList.map((team, j) => (
                    <div key={j} className={styles.teamRow}>
                      <div className={styles.teamCell}>{team}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Paginación */}
      <div className={styles.tablePagination}>
        <span className={styles.pageInfo}>
          Showing <strong>{centers.length}</strong> of <strong>{centers.length}</strong> centers
        </span>
        <div className={styles.pageButtons}>
          <button className={styles.pageBtn} disabled>Previous</button>
          <button className={styles.pageBtn}>Next</button>
        </div>
      </div>
    </>
  );
}

// ─── Component ───────────────────────────────────────────

export default function OrgDetail({ org, onBack, onNavigate }) {
  const [activeTab, setActiveTab] = useState('centers');

  return (
    <div className={styles.container}>

      {/* ── Header card ───────────────────────────────── */}
      <div className={styles.headerCard}>

        <button className={styles.backBtn} onClick={onBack}>
          <ArrowLeftIcon />
          <span>Back</span>
        </button>

        <div className={styles.orgInfo}>
          <div className={styles.orgInfoLeft}>
            <div className={styles.orgAvatar}>
              {org.name.charAt(0)}
            </div>
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
            <button className={styles.actionBtn} aria-label="Editar organización">
              <EditIcon />
            </button>
            <button className={styles.actionBtn} aria-label="Eliminar organización">
              <TrashIcon />
            </button>
          </div>
        </div>

        <div className={styles.metadata}>
          <div className={styles.metaRow}>
            <div className={styles.metaItem}><PersonIcon /><span>{MOCK_DETAIL.contact}</span></div>
            <div className={styles.metaItem}><MailIcon /><span>{MOCK_DETAIL.email}</span></div>
            <div className={styles.metaItem}><PhoneIcon /><span>{MOCK_DETAIL.phone}</span></div>
          </div>
          <div className={styles.metaRow}>
            <div className={styles.metaItem}><PinIcon /><span><em>Fiscal:</em> {MOCK_DETAIL.fiscal}</span></div>
            <div className={styles.metaItem}><PinIcon /><span><em>Shipping:</em> {MOCK_DETAIL.shipping}</span></div>
          </div>
        </div>

        <div className={styles.tabBar}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* ── Content card ──────────────────────────────── */}
      <div className={styles.contentCard}>

        {activeTab === 'centers' && <CentersContent org={org} onNavigate={onNavigate} />}

        {activeTab === 'administrators' && (
          <div className={styles.contentSection}>
            <h2 className={styles.contentTitle}>Administrators</h2>
            <EmptyState
              title="No administrators yet..."
              subtitle="Administrators for this organization will appear here"
            />
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className={styles.contentSection}>
            <h2 className={styles.contentTitle}>Monitoring</h2>
            <EmptyState
              title="No data yet..."
              subtitle="Monitoring data will be displayed here"
            />
          </div>
        )}

      </div>
    </div>
  );
}
