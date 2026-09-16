import { useState, useRef, useEffect } from 'react';
import Tag from '../../../design-system/components/Tag/Tag';
import SearchBar from '../../../design-system/components/SearchBar/SearchBar';
import ToolbarButton from '../../../design-system/components/ToolbarButton/ToolbarButton';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import { IconFilter, IconSort, IconResend, IconTrash } from '../../../design-system/icons/outline';
import styles from './OrgDetailV2.module.css';
import TruncatedText from './TruncatedText';

// Tabla compartida de invitaciones pendientes, usada a nivel Org / Centro / Equipo.
// `showType`/`showScope` se apagan a nivel Equipo (siempre el mismo tipo y alcance).
export default function InvitationsTable({
  title,
  description,
  rows,
  showType = true,
  showScope = true,
  showTeam = false,
  showSent = true,
  typeOptions = [],
  typeLabel = 'Role',
  scopeLabel = 'Scope',
  teamLabel = 'Team',
  searchPlaceholder = 'Search by email...',
  emptyTitle = 'No invitations yet',
  emptySubtitle = 'Invitations you send will appear here.',
  onResend,
  onCancel,
  onRemove,
  toolbarExtra = null,
  composePanel = null,
  responsiveTable = false,
  bleed = false,
}) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: new Set() });
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortDir, setSortDir] = useState(null); // null | 'asc' | 'desc'
  const filterRef = useRef(null);

  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

  function toggleFilter(value) {
    setFilters(prev => {
      const next = new Set(prev.type);
      next.has(value) ? next.delete(value) : next.add(value);
      return { type: next };
    });
  }
  function clearFilters() { setFilters({ type: new Set() }); }

  function handleSort() {
    setSortDir(prev => prev === null ? 'asc' : prev === 'asc' ? 'desc' : null);
  }

  const activeFilterCount = filters.type.size;
  const showTypeFilter = showType && typeOptions.length > 1;

  let filtered = rows.filter(r => {
    if (showTypeFilter && filters.type.size > 0 && !filters.type.has(r.type)) return false;
    const q = search.trim().toLowerCase();
    if (q && !r.email.toLowerCase().includes(q) && !(r.name ?? '').toLowerCase().includes(q)) return false;
    return true;
  });

  if (sortDir) {
    filtered = [...filtered].sort((a, b) => {
      const diff = (a.sentMinutesAgo ?? 0) - (b.sentMinutesAgo ?? 0);
      return sortDir === 'asc' ? diff : -diff;
    });
  }

  const compact = !showType && !showScope;

  return (
    <div className={`${styles.invitationsTab} ${bleed ? styles.invitationsBleed : ''} ${compact ? styles.invitationsCompact : ''} ${responsiveTable ? styles.invitationsResponsive : ''} ${!title && description ? styles.invitationsNoTitle : ''}`}>

      {(title || description) && (
        <div className={styles.orgUsersHeading}>
          {title && <h1 className={styles.pageTitle}>{title}</h1>}
          {description && <p className={styles.pageDescription}>{description}</p>}
        </div>
      )}

      <div className={styles.invitationsBody}>

        <div className={styles.teamToolbar}>
          <SearchBar
            className={styles.invitationsSearch}
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
          {showTypeFilter && (
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
                    <p className={styles.filterSectionLabel}>{typeLabel}</p>
                    {typeOptions.map(t => (
                      <label key={t} className={`${styles.filterOption} ${filters.type.has(t) ? styles.filterOptionChecked : ''}`}>
                        <input type="checkbox" className={styles.nativeCheck} checked={filters.type.has(t)} onChange={() => toggleFilter(t)} />
                        <span className={styles.checkBox}>
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className={styles.checkMark} aria-hidden="true">
                            <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className={styles.optionLabel}>{t}</span>
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
          {toolbarExtra}
        </div>

        {composePanel}

        {rows.length === 0 ? (
          <div className={styles.innerEmpty}>
            <div className={styles.emptyCircle} />
            <div className={styles.emptyText}>
              <p className={styles.emptyTitle}>{emptyTitle}</p>
              <p className={styles.emptySubtitle}>{emptySubtitle}</p>
            </div>
          </div>
        ) : filtered.length > 0 ? (
          <div className={styles.teamTable}>
            <div className={styles.teamTableHead}>
              <span className={`${styles.teamCol} ${styles.teamColName}`}>Recipient</span>
              {showType && <span className={`${styles.teamCol} ${styles.inviteColType}`}>{typeLabel}</span>}
              {showScope && <span className={`${styles.teamCol} ${styles.inviteColScope}`}>{scopeLabel}</span>}
              {showTeam && <span className={`${styles.teamCol} ${styles.inviteColTeam}`}>{teamLabel}</span>}
              {showSent && (
                <span className={`${styles.teamCol} ${styles.inviteColSent}`}>
                  <button className={`${styles.sortBtn} ${sortDir ? styles.sortBtnActive : ''}`} onClick={handleSort}>
                    Sent
                    <span className={styles.sortIcon}>
                      <IconSort
                        size={14}
                        upColor={sortDir === 'asc' ? 'var(--color-turquoise-30)' : 'var(--color-text-disabled)'}
                        downColor={sortDir === 'desc' ? 'var(--color-turquoise-30)' : 'var(--color-text-disabled)'}
                      />
                    </span>
                  </button>
                </span>
              )}
              <span className={`${styles.teamCol} ${styles.inviteColStatus}`}>Status</span>
              <span className={`${styles.teamCol} ${styles.inviteColActions}`} />
            </div>
            {filtered.map(row => (
              <div key={row.key} className={styles.teamTableRow}>
                <div className={`${styles.teamCol} ${styles.teamColName}`}>
                  {row.name ? (
                    <div className={styles.memberMeta}>
                      <TruncatedText text={row.name} textClassName={styles.memberName} />
                      <span className={styles.memberSub}>{row.email}</span>
                    </div>
                  ) : showSent ? (
                    <TruncatedText text={row.email} textClassName={styles.memberName} />
                  ) : (
                    <div className={styles.memberMeta}>
                      <TruncatedText text={row.email} textClassName={styles.memberName} />
                      <span className={styles.memberSub}>Invited {row.sentAgo ?? ''}</span>
                    </div>
                  )}
                </div>
                {showType && (
                  <div className={`${styles.teamCol} ${styles.inviteColType}`}>
                    <span className={styles.dateText}>{row.type}</span>
                  </div>
                )}
                {showScope && (
                  <div className={`${styles.teamCol} ${styles.inviteColScope}`}>
                    <span className={styles.dateText}>{row.scope ?? '—'}</span>
                  </div>
                )}
                {showTeam && (
                  <div className={`${styles.teamCol} ${styles.inviteColTeam}`}>
                    <span className={styles.dateText}>{row.team ?? '-'}</span>
                  </div>
                )}
                {showSent && (
                  <div className={`${styles.teamCol} ${styles.inviteColSent}`}>
                    <span className={styles.dateText}>{row.sentAgo}</span>
                  </div>
                )}
                <div className={`${styles.teamCol} ${styles.inviteColStatus}`}>
                  <Tag status={row.status ?? 'pending'} />
                </div>
                <div className={`${styles.teamCol} ${styles.inviteColActions}`}>
                  {row.status === 'active' ? (
                    <>
                      {/* Placeholder invisible: alinea el botón Remove bajo la misma
                          columna que "Cancel" en las filas pendientes (2 slots siempre). */}
                      <span className={styles.actionPlaceholder} aria-hidden="true" />
                      {row.isSelf ? (
                        <IconButton aria-label="Remove" tooltip="You can't remove yourself" disabled>
                          <IconTrash size={14} />
                        </IconButton>
                      ) : (
                        <IconButton aria-label="Remove" tooltip="Remove" variant="danger" onClick={() => onRemove?.(row)}>
                          <IconTrash size={14} />
                        </IconButton>
                      )}
                    </>
                  ) : (
                    <>
                      <IconButton aria-label="Resend invitation" tooltip="Resend" onClick={() => onResend?.(row)}>
                        <IconResend size={16} />
                      </IconButton>
                      <IconButton aria-label="Cancel invitation" tooltip="Cancel" onClick={() => onCancel?.(row)}>
                        <IconTrash size={14} />
                      </IconButton>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.innerEmpty}>
            <div className={styles.emptyCircle} />
            <div className={styles.emptyText}>
              <p className={styles.emptyTitle}>No results</p>
              <p className={styles.emptySubtitle}>{search ? `No invitations match "${search}"` : 'No invitations match the selected filters'}</p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
