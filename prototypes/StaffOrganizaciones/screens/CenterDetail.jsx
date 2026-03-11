import { useState, useRef, useEffect } from 'react';
import Button from '../../../design-system/components/Button/Button';
import Tag from '../../../design-system/components/Tag/Tag';
import SearchBar from '../../../design-system/components/SearchBar/SearchBar';
import TabBar from '../../../design-system/components/TabBar/TabBar';
import ContextMenu from '../../../design-system/components/ContextMenu/ContextMenu';
import { IconEdit, IconPlus, IconTrash, IconSettings } from '../../../design-system/icons/outline';
import { IconMailFilled, IconPhoneFilled, IconLocationFilled } from '../../../design-system/icons/filled';
import { getUsersForTeam, getProfessionalsForTeam } from '../mockData';
import EditCenterDrawer from './EditCenterDrawer';
import NewTeamDrawer from './NewTeamDrawer';
import styles from './CenterDetail.module.css';

// ─── Icons ──────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
  { id: 'teams',          label: 'Teams' },
  { id: 'administrators', label: 'Administrators' },
  { id: 'users',          label: 'Users' },
  { id: 'monitoring',     label: 'Monitoring' },
];

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

// ─── Teams content ───────────────────────────────────────

function TeamsContent({ center, org, onNavigate }) {
  const [openMenuTeamId, setOpenMenuTeamId] = useState(null);
  const [showNewTeamDrawer, setShowNewTeamDrawer] = useState(false);
  const menuRef = useRef(null);
  const teams = center.teams;
  const hasTeams = teams.length > 0;

  useEffect(() => {
    if (!openMenuTeamId) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuTeamId(null);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenuTeamId]);

  if (!hasTeams) {
    return (
      <div className={styles.contentSection}>
        <h2 className={styles.contentTitle}>Teams</h2>
        <EmptyState
          title="No teams yet..."
          subtitle="Teams for this center will be displayed here"
          action={
            <Button variant="primary" size="s" leftIcon={<PlusIcon />} onClick={() => setShowNewTeamDrawer(true)}>
              New Team
            </Button>
          }
        />
        {showNewTeamDrawer && <NewTeamDrawer center={center} onClose={() => setShowNewTeamDrawer(false)} />}
      </div>
    );
  }

  return (
    <>
      {/* Top: título + botón + search */}
      <div className={styles.teamsTop}>
        <div className={styles.teamsTopRow}>
          <h2 className={styles.contentTitle}>Teams</h2>
          <Button variant="primary" size="s" leftIcon={<PlusIcon />} onClick={() => setShowNewTeamDrawer(true)}>
            New Team
          </Button>
        </div>
        <SearchBar placeholder="Search by name..." className={styles.searchBar} />
      </div>

      {/* Tabla */}
      <div className={styles.tableWrap}>
        <div className={styles.tableHeader}>
          <div className={`${styles.colHead} ${styles.colTeam}`}>Team</div>
          <div className={`${styles.colHead} ${styles.colNum}`}>Status</div>
          <div className={`${styles.colHead} ${styles.colNum}`}>Professionals</div>
          <div className={`${styles.colHead} ${styles.colNum}`}>Users</div>
          <div className={`${styles.colHead} ${styles.colActions}`} />
        </div>

        {teams.map((team, i) => (
          <div
            key={team.id}
            className={`${styles.tableRow} ${styles.tableRowClickable} ${i < teams.length - 1 ? styles.rowBorder : ''}`}
            onClick={() => onNavigate('team-detail', { team, center, org })}
            style={openMenuTeamId === team.id ? { position: 'relative', zIndex: 10 } : undefined}
          >
            <div className={`${styles.teamNameCell} ${styles.colTeam}`}>
              <div className={styles.teamAvatar}>{team.name.charAt(0)}</div>
              <span className={styles.teamName}>{team.name}</span>
            </div>
            <div className={`${styles.numCell} ${styles.colNum}`}>
              <Tag status={team.status} />
            </div>
            <div className={`${styles.numCell} ${styles.colNum}`}>{getProfessionalsForTeam(team).length}</div>
            <div className={`${styles.numCell} ${styles.colNum}`}>{getUsersForTeam(team).length}</div>
            <div className={`${styles.actionsCell} ${styles.colActions}`}>
              <div
                className={styles.moreMenuAnchor}
                ref={openMenuTeamId === team.id ? menuRef : null}
              >
                <button
                  className={styles.dotsBtn}
                  aria-label="Más opciones"
                  onClick={e => { e.stopPropagation(); setOpenMenuTeamId(prev => prev === team.id ? null : team.id); }}
                >
                  <DotsIcon />
                </button>
                {openMenuTeamId === team.id && (
                  <div className={styles.contextMenuWrap}>
                    <ContextMenu
                      items={[
                        { label: 'Edit',     icon: <IconEdit size={16} />,  onClick: () => setOpenMenuTeamId(null) },
                        { label: 'New User', icon: <IconPlus size={16} />,  onClick: () => setOpenMenuTeamId(null) },
                        { label: 'Delete',   icon: <IconTrash size={16} />, variant: 'danger', onClick: () => setOpenMenuTeamId(null) },
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className={styles.tablePagination}>
        <span className={styles.pageInfo}>
          Showing <strong>{teams.length}</strong> of <strong>{teams.length}</strong> teams
        </span>
        <div className={styles.pageButtons}>
          <button className={styles.pageBtn} disabled>Previous</button>
          <button className={styles.pageBtn}>Next</button>
        </div>
      </div>

      {showNewTeamDrawer && (
        <NewTeamDrawer center={center} onClose={() => setShowNewTeamDrawer(false)} />
      )}
    </>
  );
}

// ─── Component ───────────────────────────────────────────

export default function CenterDetail({ center, org, onBack, onNavigate }) {
  const [activeTab, setActiveTab] = useState('teams');
  const [showEditDrawer, setShowEditDrawer] = useState(false);

  return (
    <div className={styles.container}>

      {/* ── Header card ───────────────────────────────── */}
      <div className={styles.headerCard}>

        <button className={styles.backBtn} onClick={onBack}>
          <span className={styles.backIcon}><ArrowLeftIcon /></span>
          <span className={styles.backLabel}>Back</span>
        </button>

        <div className={styles.centerInfo}>
          <div className={styles.centerInfoLeft}>
            <div className={styles.centerAvatarWrap}>
              <div className={styles.centerAvatar}>
                {center.name.charAt(0)}
              </div>
              <div className={styles.orgBadge}>
                {org.name.charAt(0)}
              </div>
            </div>
            <div className={styles.centerMeta}>
              <h1 className={styles.centerName}>{center.name}</h1>
              <div className={styles.centerSubtitle}>
                <span>{org.name}</span>
                <span className={styles.separator}>|</span>
                <div className={styles.statusBadge}>
                  <div className={`${styles.statusDot} ${styles[center.status]}`} />
                  <span>{center.status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.centerActions}>
            <button className={`${styles.actionBtn} ${styles.actionBtnTooltip}`} aria-label="Configuración de centro" data-tooltip="Settings" onClick={() => setShowEditDrawer(true)}>
              <IconSettings size={16} />
            </button>
            <button className={`${styles.actionBtn} ${styles.actionBtnTooltip}`} aria-label="Eliminar centro" data-tooltip="Delete">
              <IconTrash size={16} />
            </button>
          </div>
        </div>

        <div className={styles.metadata}>
          <div className={styles.metaRow}>
            <div className={styles.metaItem}><IconMailFilled size={16} /><span>{center.email}</span></div>
            <div className={styles.metaItem}><IconPhoneFilled size={16} /><span>{center.phone}</span></div>
            <div className={styles.metaItem}><IconLocationFilled size={16} /><span>{center.address}</span></div>
          </div>
        </div>

        <div className={styles.tabBarWrap}>
          <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>

      </div>

      {/* ── Content card ──────────────────────────────── */}
      <div className={styles.contentCard}>

        {activeTab === 'teams' && <TeamsContent center={center} org={org} onNavigate={onNavigate} />}

        {activeTab === 'administrators' && (
          <div className={styles.contentSection}>
            <h2 className={styles.contentTitle}>Administrators</h2>
            <EmptyState
              title="No administrators yet..."
              subtitle="Administrators for this center will appear here"
              action={
                <Button variant="primary" size="s" leftIcon={<IconPlus size={16} />}>
                  New Administrator
                </Button>
              }
            />
          </div>
        )}

        {activeTab === 'users' && (
          <div className={styles.contentSection}>
            <h2 className={styles.contentTitle}>Users</h2>
            <EmptyState
              title="No users yet..."
              subtitle="Users belonging to this center will appear here"
              action={
                <Button variant="primary" size="s" leftIcon={<IconPlus size={16} />}>
                  New User
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
        <EditCenterDrawer
          center={center}
          org={org}
          onClose={() => setShowEditDrawer(false)}
        />
      )}

    </div>
  );
}
