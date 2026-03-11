import { useState, useRef, useEffect } from 'react';
import Button from '../../../design-system/components/Button/Button';
import Tag from '../../../design-system/components/Tag/Tag';
import SearchBar from '../../../design-system/components/SearchBar/SearchBar';
import TabBar from '../../../design-system/components/TabBar/TabBar';
import ContextMenu from '../../../design-system/components/ContextMenu/ContextMenu';
import { IconEdit, IconPlus, IconTrash, IconSettings } from '../../../design-system/icons/outline';
import { IconUserFilled, IconMailFilled, IconPhoneFilled, IconLocationFilled } from '../../../design-system/icons/filled';
import { getUserCountForCenter, getProfessionalCountForCenter, getActiveTeamCount } from '../mockData';
import NewCenterModal from './NewCenterModal';
import EditOrgDrawer from './EditOrgDrawer';
import EditCenterDrawer from './EditCenterDrawer';
import NewTeamDrawer from './NewTeamDrawer';
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

// ─── Illustrations ───────────────────────────────────────

function CentersIllustration() {
  return (
    <svg width="120" height="96" viewBox="0 0 120 96" fill="none" aria-hidden="true">
      {/* Ground */}
      <line x1="8" y1="88" x2="112" y2="88" stroke="var(--color-border-default)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Left small building */}
      <rect x="8" y="54" width="22" height="34" rx="1.5" fill="var(--color-bg-surface)" stroke="var(--color-border-default)" strokeWidth="1.5" />
      <rect x="13" y="60" width="6" height="5" rx="1" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1" />
      <rect x="21" y="60" width="6" height="5" rx="1" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1" />
      <rect x="13" y="70" width="6" height="5" rx="1" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1" />
      <rect x="21" y="70" width="6" height="5" rx="1" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1" />
      <rect x="15" y="79" width="8" height="9" rx="1" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1" />
      {/* Main building */}
      <rect x="34" y="28" width="52" height="60" rx="2" fill="var(--color-bg-surface)" stroke="var(--color-border-default)" strokeWidth="1.5" />
      {/* Roof band */}
      <rect x="30" y="20" width="60" height="14" rx="2" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1.5" />
      {/* Windows row 1 */}
      <rect x="41" y="37" width="10" height="8" rx="1" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1" />
      <rect x="55" y="37" width="10" height="8" rx="1" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1" />
      <rect x="69" y="37" width="10" height="8" rx="1" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1" />
      {/* Windows row 2 */}
      <rect x="41" y="51" width="10" height="8" rx="1" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1" />
      <rect x="55" y="51" width="10" height="8" rx="1" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1" />
      <rect x="69" y="51" width="10" height="8" rx="1" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1" />
      {/* Door */}
      <rect x="52" y="68" width="16" height="20" rx="1.5" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1.5" />
      <circle cx="65" cy="78" r="1.5" fill="var(--color-border-default)" />
      {/* Right small building */}
      <rect x="90" y="62" width="22" height="26" rx="1.5" fill="var(--color-bg-surface)" stroke="var(--color-border-default)" strokeWidth="1.5" />
      <rect x="95" y="67" width="5" height="5" rx="1" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1" />
      <rect x="102" y="67" width="5" height="5" rx="1" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1" />
      <rect x="97" y="77" width="8" height="11" rx="1" fill="var(--color-bg-surface-subtle)" stroke="var(--color-border-default)" strokeWidth="1" />
      {/* Flagpole */}
      <line x1="60" y1="6" x2="60" y2="20" stroke="var(--color-border-default)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 7l8 3.5-8 3.5V7z" fill="var(--color-border-default)" />
    </svg>
  );
}

// ─── Empty state ─────────────────────────────────────────

function EmptyState({ illustration, title, subtitle, action }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyInfo}>
        {illustration ?? <div className={styles.emptyCircle} />}
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
  const [openMenuCenterId, setOpenMenuCenterId] = useState(null);
  const [showNewCenterModal, setShowNewCenterModal] = useState(false);
  const [editCenterTarget, setEditCenterTarget] = useState(null);
  const [newTeamCenter,    setNewTeamCenter]    = useState(null);
  const menuRef = useRef(null);
  const centers = org.centers;
  const hasCenters = centers.length > 0;

  useEffect(() => {
    if (!openMenuCenterId) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuCenterId(null);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenuCenterId]);

  function toggleCenter(id) {
    setExpandedCenters(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (!hasCenters) {
    return (
      <>
        <div className={styles.contentSection}>
          <h3 className={styles.contentTitle}>Centers</h3>
          <EmptyState
            illustration={<CentersIllustration />}
            title="No centers yet..."
            subtitle="Your centers will be displayed here, let's create your first center"
            action={
              <Button variant="primary" size="s" leftIcon={<PlusIcon />} onClick={() => setShowNewCenterModal(true)}>
                New Center
              </Button>
            }
          />
        </div>
        {showNewCenterModal && <NewCenterModal onClose={() => setShowNewCenterModal(false)} />}
      </>
    );
  }

  return (
    <>
      {/* Top: título + botón + search */}
      <div className={styles.centersTop}>
        <div className={styles.centersTopRow}>
          <h2 className={styles.contentTitle}>Centers</h2>
          <Button variant="primary" size="s" leftIcon={<PlusIcon />} onClick={() => setShowNewCenterModal(true)}>
            New Center
          </Button>
        </div>
        <SearchBar placeholder="Search by name..." className={styles.searchBar} />
      </div>

      {/* Tabla */}
      <div className={styles.tableWrap}>
        {/* Header */}
        <div className={styles.tableHeader}>
          <div className={`${styles.colHead} ${styles.colCenter}`}>Center</div>
          <div className={`${styles.colHead} ${styles.colNum}`}>Status</div>
          <div className={`${styles.colHead} ${styles.colNum}`}>Active Teams</div>
          <div className={`${styles.colHead} ${styles.colNum}`}>Professionals</div>
          <div className={`${styles.colHead} ${styles.colNum}`}>Users</div>
          <div className={`${styles.colHead} ${styles.colActions}`} />
        </div>

        {/* Rows */}
        {centers.map((center, i) => {
          const isExpanded = expandedCenters.has(center.id);
          const hasTeams   = center.teams.length > 0;
          return (
            <div key={center.id} style={openMenuCenterId === center.id ? { position: 'relative', zIndex: 10 } : undefined}>
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
                <div className={`${styles.numCell} ${styles.colNum}`}>
                  <Tag status={center.status} />
                </div>
                <div className={`${styles.numCell} ${styles.colNum}`}>{getActiveTeamCount(center)}</div>
                <div className={`${styles.numCell} ${styles.colNum}`}>{getProfessionalCountForCenter(center)}</div>
                <div className={`${styles.numCell} ${styles.colNum}`}>{getUserCountForCenter(center)}</div>
                <div className={`${styles.actionsCell} ${styles.colActions}`}>
                  <div
                    className={styles.moreMenuAnchor}
                    ref={openMenuCenterId === center.id ? menuRef : null}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      className={styles.dotsBtn}
                      aria-label="Más opciones"
                      onClick={e => { e.stopPropagation(); setOpenMenuCenterId(prev => prev === center.id ? null : center.id); }}
                    >
                      <DotsIcon />
                    </button>
                    {openMenuCenterId === center.id && (
                      <div className={styles.contextMenuWrap}>
                        <ContextMenu
                          items={[
                            { label: 'Edit',     icon: <IconEdit size={16} />,  onClick: () => { setEditCenterTarget(center); setOpenMenuCenterId(null); } },
                            { label: 'New Team', icon: <IconPlus size={16} />,  onClick: () => { setNewTeamCenter(center); setOpenMenuCenterId(null); } },
                            { label: 'Delete',   icon: <IconTrash size={16} />, variant: 'danger', onClick: () => setOpenMenuCenterId(null) },
                          ]}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && hasTeams && (
                <div className={`${styles.teamRows} ${i < centers.length - 1 ? styles.rowBorder : ''}`}>
                  {center.teams.map((team) => (
                    <div
                      key={team.id}
                      className={styles.teamRow}
                      onClick={e => { e.stopPropagation(); onNavigate('team-detail', { team, center, org }); }}
                    >
                      <div className={styles.teamCell}>{team.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showNewCenterModal && <NewCenterModal onClose={() => setShowNewCenterModal(false)} />}
      {editCenterTarget && (
        <EditCenterDrawer
          center={editCenterTarget}
          org={org}
          onClose={() => setEditCenterTarget(null)}
        />
      )}
      {newTeamCenter && (
        <NewTeamDrawer
          center={newTeamCenter}
          onClose={() => setNewTeamCenter(null)}
        />
      )}

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
  const [showEditDrawer, setShowEditDrawer] = useState(false);

  return (
    <div className={styles.container}>

      {/* ── Header card ───────────────────────────────── */}
      <div className={styles.headerCard}>

        <button className={styles.backBtn} onClick={onBack}>
          <span className={styles.backIcon}><ArrowLeftIcon /></span>
          <span className={styles.backLabel}>Back</span>
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
            <button className={`${styles.actionBtn} ${styles.actionBtnTooltip}`} aria-label="Configuración de organización" data-tooltip="Settings" onClick={() => setShowEditDrawer(true)}>
              <IconSettings size={16} />
            </button>
            <button className={`${styles.actionBtn} ${styles.actionBtnTooltip}`} aria-label="Eliminar organización" data-tooltip="Delete">
              <IconTrash size={16} />
            </button>
          </div>
        </div>

        <div className={styles.metadata}>
          <div className={styles.metaRow}>
            <div className={`${styles.metaItem} ${styles.metaItemTooltip}`} data-tooltip="Primary contact">
              <IconUserFilled size={16} /><span>{org.contact}</span>
            </div>
            <div className={styles.metaItem}><IconMailFilled size={16} /><span>{org.email}</span></div>
            <div className={styles.metaItem}><IconPhoneFilled size={16} /><span>{org.phone}</span></div>
          </div>
          <div className={styles.metaRow}>
            <div className={styles.metaItem}><IconLocationFilled size={16} /><span><em>Fiscal:</em> {org.fiscal}</span></div>
          </div>
        </div>

        <div className={styles.tabBarWrap}>
          <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
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
              action={
                <Button variant="primary" size="s" leftIcon={<IconPlus size={16} />}>
                  New Administrator
                </Button>
              }
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

      {showEditDrawer && (
        <EditOrgDrawer
          org={org}
          onClose={() => setShowEditDrawer(false)}
        />
      )}

    </div>
  );
}
