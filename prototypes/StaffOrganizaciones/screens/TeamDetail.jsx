import { useState, useRef, useEffect } from 'react';
import Button from '../../../design-system/components/Button/Button';
import Tag from '../../../design-system/components/Tag/Tag';
import SearchBar from '../../../design-system/components/SearchBar/SearchBar';
import TabBar from '../../../design-system/components/TabBar/TabBar';
import ToolbarButton from '../../../design-system/components/ToolbarButton/ToolbarButton';
import { getMembersForTeam } from '../mockData';
import { IconSettings, IconTrash, IconFilter, IconPlus } from '../../../design-system/icons/outline';
import { IconMailFilled, IconPhoneFilled, IconLocationFilled } from '../../../design-system/icons/filled';
import styles from './TeamDetail.module.css';

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
  { id: 'users',          label: 'Users' },
  { id: 'administrators', label: 'Administrators' },
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

// ─── Users content ───────────────────────────────────────

function UsersContent({ team, center, onNavigate }) {
  const allUsers = getMembersForTeam(team);
  const [roleFilter, setRoleFilter] = useState(new Set());
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

  function toggleRole(v) {
    setRoleFilter(prev => {
      const next = new Set(prev);
      next.has(v) ? next.delete(v) : next.add(v);
      return next;
    });
  }

  const users = roleFilter.size > 0
    ? allUsers.filter(u => roleFilter.has(u.role))
    : allUsers;

  const hasUsers = allUsers.length > 0;

  if (!hasUsers) {
    return (
      <div className={styles.contentSection}>
        <h2 className={styles.contentTitle}>Users</h2>
        <EmptyState
          title="No users yet..."
          subtitle="Users for this team will be displayed here"
          action={
            <Button variant="primary" size="s" leftIcon={<PlusIcon />}>
              New User
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      {/* Top: título + botón + search */}
      <div className={styles.usersTop}>
        <div className={styles.usersTopRow}>
          <h2 className={styles.contentTitle}>Users</h2>
          <Button variant="primary" size="s" leftIcon={<PlusIcon />}>
            New User
          </Button>
        </div>
        <div className={styles.toolbarRow}>
          <SearchBar placeholder="Search by name..." className={styles.searchBar} />
          <div className={styles.filterWrap} ref={filterRef}>
            <ToolbarButton
              icon={<IconFilter size={16} />}
              selected={roleFilter.size > 0}
              onClick={() => setFilterOpen(prev => !prev)}
            >
              Filters
              {roleFilter.size > 0 && (
                <span className={styles.filterBadge}>{roleFilter.size}</span>
              )}
            </ToolbarButton>
            {filterOpen && (
              <div className={styles.filterDropdown}>
                <div className={styles.filterSection}>
                  <p className={styles.filterSectionLabel}>Role</p>
                  {[{ v: 'professional', label: 'Professional' }, { v: 'user', label: 'User' }].map(({ v, label }) => (
                    <label key={v} className={`${styles.filterOption} ${roleFilter.has(v) ? styles.filterOptionChecked : ''}`}>
                      <input
                        type="checkbox"
                        className={styles.nativeCheck}
                        checked={roleFilter.has(v)}
                        onChange={() => toggleRole(v)}
                      />
                      <span className={styles.checkBox}>
                        <svg className={styles.checkMark} viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {label}
                    </label>
                  ))}
                </div>
                {roleFilter.size > 0 && (
                  <button className={styles.clearFilters} onClick={() => setRoleFilter(new Set())}>
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className={styles.tableWrap}>
        <div className={styles.tableHeader}>
          <div className={`${styles.colHead} ${styles.colName}`}>Name</div>
          <div className={`${styles.colHead} ${styles.colNum}`}>Status</div>
          <div className={`${styles.colHead} ${styles.colRole}`}>Role</div>
          <div className={`${styles.colHead} ${styles.colDate}`}>Date Added</div>
          <div className={`${styles.colHead} ${styles.colActions}`} />
        </div>

        {users.map((user, i) => (
          <div
            key={`${user.role}-${user.id}`}
            className={`${styles.tableRow} ${styles.tableRowClickable} ${i < users.length - 1 ? styles.rowBorder : ''}`}
            onClick={() => onNavigate('user-detail', { user, team, center })}
          >
            <div className={`${styles.userNameCell} ${styles.colName}`}>
              <div className={styles.userAvatar}>{user.name.charAt(0)}</div>
              <span className={styles.userName}>{user.name}</span>
            </div>
            <div className={`${styles.numCell} ${styles.colNum}`}>
              <Tag status={user.status} />
            </div>
            <div className={`${styles.roleCell} ${styles.colRole}`}>
              <Tag status={user.role} />
            </div>
            <div className={`${styles.dateCell} ${styles.colDate}`}>{user.dateAdded}</div>
            <div className={`${styles.actionsCell} ${styles.colActions}`}>
              <button className={styles.dotsBtn} aria-label="Más opciones">
                <DotsIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className={styles.tablePagination}>
        <span className={styles.pageInfo}>
          Showing <strong>{users.length}</strong> of <strong>{users.length}</strong> users
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

export default function TeamDetail({ team, center, onBack, onNavigate }) {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className={styles.container}>

      {/* ── Header card ───────────────────────────────── */}
      <div className={styles.headerCard}>

        <button className={styles.backBtn} onClick={onBack}>
          <span className={styles.backIcon}><ArrowLeftIcon /></span>
          <span className={styles.backLabel}>Back</span>
        </button>

        <div className={styles.teamInfo}>
          <div className={styles.teamInfoLeft}>
            <div className={styles.teamAvatarWrap}>
              <div className={styles.teamAvatar}>
                {team.name.charAt(0)}
              </div>
              <div className={styles.centerBadge}>
                {center.name.charAt(0)}
              </div>
            </div>
            <div className={styles.teamMeta}>
              <h1 className={styles.teamName}>{team.name}</h1>
              <div className={styles.teamSubtitle}>
                <span>{center.name}</span>
                <span className={styles.separator}>|</span>
                <div className={styles.statusBadge}>
                  <div className={`${styles.statusDot} ${styles[team.status]}`} />
                  <span>{team.status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.teamActions}>
            <button className={`${styles.actionBtn} ${styles.actionBtnTooltip}`} aria-label="Configuración de equipo" data-tooltip="Settings">
              <IconSettings size={16} />
            </button>
            <button className={`${styles.actionBtn} ${styles.actionBtnTooltip}`} aria-label="Eliminar equipo" data-tooltip="Delete">
              <IconTrash size={16} />
            </button>
          </div>
        </div>

        <div className={styles.metadata}>
          <div className={styles.metaRow}>
            <div className={styles.metaItem}><IconMailFilled size={16} /><span>{team.email}</span></div>
            <div className={styles.metaItem}><IconPhoneFilled size={16} /><span>{team.phone}</span></div>
            <div className={styles.metaItem}><IconLocationFilled size={16} /><span>{team.address}</span></div>
          </div>
        </div>

        <div className={styles.tabBarWrap}>
          <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>

      </div>

      {/* ── Content card ──────────────────────────────── */}
      <div className={styles.contentCard}>

        {activeTab === 'users' && <UsersContent team={team} center={center} onNavigate={onNavigate} />}

        {activeTab === 'administrators' && (
          <div className={styles.contentSection}>
            <h2 className={styles.contentTitle}>Administrators</h2>
            <EmptyState
              title="No administrators yet..."
              subtitle="Administrators for this team will appear here"
              action={
                <Button variant="primary" size="s" leftIcon={<IconPlus size={16} />}>
                  New Administrator
                </Button>
              }
            />
          </div>
        )}

      </div>
    </div>
  );
}
