import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Tag from '../../../design-system/components/Tag/Tag';
import SearchBar from '../../../design-system/components/SearchBar/SearchBar';
import Button from '../../../design-system/components/Button/Button';
import ContextMenu from '../../../design-system/components/ContextMenu/ContextMenu';
import FilterPanel from '../../../design-system/components/FilterPanel/FilterPanel';
import { IconEdit, IconTrash, IconPlus } from '../../../design-system/icons/outline';
import { ORGS } from '../../StaffOrganizaciones/mockData';
import styles from './UnitsGlobalView.module.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDailyUse(unitId) { return (unitId % 12) + 1; }
function getTotalUse(unitId) { return ((unitId * 17) % 280) + 40; }

function buildFlatUnits(orgs) {
  return orgs.flatMap(org =>
    org.centers.flatMap(center =>
      (center.units || []).map(unit => ({
        ...unit,
        orgId:      org.id,
        orgName:    org.name,
        centerId:   center.id,
        centerName: center.name,
        dailyUse:   getDailyUse(unit.id),
        totalUse:   getTotalUse(unit.id),
      }))
    )
  );
}

const ALL_UNITS = buildFlatUnits(ORGS);

// ─── Icons ────────────────────────────────────────────────────────────────────

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="4"  cy="8" r="1.25" fill="currentColor"/>
      <circle cx="8"  cy="8" r="1.25" fill="currentColor"/>
      <circle cx="12" cy="8" r="1.25" fill="currentColor"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ─── PillSelect ───────────────────────────────────────────────────────────────

function PillSelect({ placeholder, value, onClear, open, onToggle, children, disabled }) {
  return (
    <div className={`${styles.pillSelect} ${open ? styles.pillOpen : ''} ${disabled ? styles.pillDisabled : ''}`}>
      <button className={styles.pillTrigger} onClick={onToggle} disabled={disabled}>
        <span className={value ? styles.pillValue : styles.pillPlaceholder}>
          {value || placeholder}
        </span>
        <span className={styles.pillIcons}>
          {value && (
            <span
              className={styles.pillClear}
              role="button"
              tabIndex={0}
              onClick={e => { e.stopPropagation(); onClear(); }}
              onKeyDown={e => e.key === 'Enter' && onClear()}
            >
              <CloseIcon />
            </span>
          )}
          <span className={`${styles.pillChevron} ${open ? styles.pillChevronOpen : ''}`}>
            <ChevronDownIcon />
          </span>
        </span>
      </button>
      {open && (
        <div className={styles.pillMenu}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function UnitsGlobalView() {
  const [search,       setSearch]       = useState('');
  const [orgOpen,      setOrgOpen]      = useState(false);
  const [centerOpen,   setCenterOpen]   = useState(false);
  const [orgSearch,    setOrgSearch]    = useState('');
  const [centerSearch, setCenterSearch] = useState('');
  const [filters, setFilters] = useState({
    org:    null,
    center: null,
    status: new Set(),
    kpod:   new Set(),
  });
  const [expandedUnits, setExpandedUnits] = useState(new Set());
  const [openMenuId,    setOpenMenuId]    = useState(null);
  const [menuPos,       setMenuPos]       = useState({ top: 0, right: 0 });

  const orgRef    = useRef(null);
  const centerRef = useRef(null);
  const menuRef   = useRef(null);

  // Close org/center dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (orgRef.current    && !orgRef.current.contains(e.target))    setOrgOpen(false);
      if (centerRef.current && !centerRef.current.contains(e.target)) setCenterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!openMenuId) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenuId]);

  // ── Filter handlers ───────────────────────────────────────────────────────

  function handleSelectOrg(orgId) {
    setFilters(prev => ({
      ...prev,
      org:    prev.org === orgId ? null : orgId,
      center: null,
    }));
    setCenterSearch('');
    setOrgOpen(false);
  }

  function handleSelectCenter(centerId, orgId) {
    setFilters(prev => ({
      ...prev,
      center: prev.center === centerId ? null : centerId,
      org:    prev.org || orgId,
    }));
    setCenterOpen(false);
  }

  function toggleMultiFilter(group, value) {
    setFilters(prev => {
      const next = new Set(prev[group]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [group]: next };
    });
  }

  function clearFilters() {
    setFilters({ org: null, center: null, status: new Set(), kpod: new Set() });
    setOrgSearch('');
    setCenterSearch('');
  }

  // ── Center options ────────────────────────────────────────────────────────

  const allCenterOptions = useMemo(() => {
    if (filters.org) {
      const org = ORGS.find(o => String(o.id) === filters.org);
      return org ? org.centers.map(c => ({ id: String(c.id), label: c.name, orgId: filters.org })) : [];
    }
    return ORGS.flatMap(org =>
      org.centers.map(c => ({
        id: String(c.id), label: c.name,
        sublabel: org.name, orgId: String(org.id),
      }))
    );
  }, [filters.org]);

  const filteredOrgList = useMemo(() =>
    orgSearch.trim()
      ? ORGS.filter(o => o.name.toLowerCase().includes(orgSearch.toLowerCase()))
      : ORGS,
    [orgSearch]
  );

  const filteredCenterList = useMemo(() =>
    centerSearch.trim()
      ? allCenterOptions.filter(c =>
          c.label.toLowerCase().includes(centerSearch.toLowerCase()) ||
          (c.sublabel || '').toLowerCase().includes(centerSearch.toLowerCase())
        )
      : allCenterOptions,
    [centerSearch, allCenterOptions]
  );


  const selectedOrgName    = filters.org    ? ORGS.find(o => String(o.id) === filters.org)?.name : null;
  const selectedCenterName = filters.center ? allCenterOptions.find(c => c.id === filters.center)?.label : null;

  // ── Displayed units ───────────────────────────────────────────────────────

  const displayedUnits = useMemo(() => {
    let result = ALL_UNITS;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(u =>
        String(u.id).includes(q) ||
        u.description.toLowerCase().includes(q) ||
        u.orgName.toLowerCase().includes(q) ||
        u.centerName.toLowerCase().includes(q)
      );
    }
    if (filters.org)    result = result.filter(u => String(u.orgId)    === filters.org);
    if (filters.center) result = result.filter(u => String(u.centerId) === filters.center);
    if (filters.status.size > 0) result = result.filter(u => filters.status.has(u.status));
    if (filters.kpod.size   > 0) result = result.filter(u => filters.kpod.has(u.kpod.status));
    return result;
  }, [search, filters]);

  function toggleUnit(id) {
    setExpandedUnits(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const totalUnits    = ALL_UNITS.length;
  const activeUnits   = ALL_UNITS.filter(u => u.status === 'active').length;
  const disabledUnits = ALL_UNITS.filter(u => u.status === 'inactive').length;

  return (
    <div className={styles.content}>

      {/* Heading */}
      <div className={styles.heading}>
        <h1 className={styles.pageTitle}>Units</h1>
        <Button variant="primary" size="s" leftIcon={<IconPlus size={16} />}>Create</Button>
      </div>

      {/* KPI cards */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiValue}>{totalUnits}</span>
          <span className={styles.kpiLabel}>Total units</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiValue}>{activeUnits}</span>
          <span className={styles.kpiLabel}>Active</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiValue}>{disabledUnits}</span>
          <span className={styles.kpiLabel}>Disabled</span>
        </div>
      </div>

      {/* Table card */}
      <div className={styles.tableCard}>

        {/* Toolbar */}
        <div className={styles.tableTop}>
          <SearchBar
            placeholder="Search units..."
            className={styles.searchBar}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />

          <div className={styles.tableTopRight}>

            {/* Org PillSelect */}
            <div ref={orgRef}>
              <PillSelect
                placeholder="Organization"
                value={selectedOrgName}
                onClear={() => { setFilters(p => ({ ...p, org: null, center: null })); setOrgSearch(''); }}
                open={orgOpen}
                onToggle={() => { setOrgOpen(v => !v); setCenterOpen(false); setFilterOpen(false); }}
              >
                <div className={styles.pillMenuSearch}>
                  <span className={styles.pillMenuSearchIcon}><SearchIcon /></span>
                  <input
                    className={styles.pillMenuSearchInput}
                    placeholder="Search..."
                    value={orgSearch}
                    onChange={e => setOrgSearch(e.target.value)}
                    autoFocus
                  />
                  {orgSearch && (
                    <button className={styles.pillMenuSearchClear} onClick={() => setOrgSearch('')}>
                      <CloseIcon />
                    </button>
                  )}
                </div>
                <div className={styles.pillMenuList}>
                  {filteredOrgList.length === 0 ? (
                    <p className={styles.pillMenuEmpty}>No results</p>
                  ) : filteredOrgList.map(org => (
                    <button
                      key={org.id}
                      className={`${styles.pillOption} ${filters.org === String(org.id) ? styles.pillOptionActive : ''}`}
                      onClick={() => handleSelectOrg(String(org.id))}
                    >
                      <span className={styles.pillOptionLabel}>{org.name}</span>
                    </button>
                  ))}
                </div>
              </PillSelect>
            </div>

            {/* Center PillSelect */}
            <div ref={centerRef}>
              <PillSelect
                placeholder="Center"
                value={selectedCenterName}
                onClear={() => setFilters(p => ({ ...p, center: null }))}
                open={centerOpen}
                onToggle={() => { setCenterOpen(v => !v); setOrgOpen(false); setFilterOpen(false); }}
              >
                <div className={styles.pillMenuSearch}>
                  <span className={styles.pillMenuSearchIcon}><SearchIcon /></span>
                  <input
                    className={styles.pillMenuSearchInput}
                    placeholder="Search..."
                    value={centerSearch}
                    onChange={e => setCenterSearch(e.target.value)}
                    autoFocus
                  />
                  {centerSearch && (
                    <button className={styles.pillMenuSearchClear} onClick={() => setCenterSearch('')}>
                      <CloseIcon />
                    </button>
                  )}
                </div>
                <div className={styles.pillMenuList}>
                  {filteredCenterList.length === 0 ? (
                    <p className={styles.pillMenuEmpty}>No results</p>
                  ) : filteredCenterList.map(c => (
                    <button
                      key={c.id}
                      className={`${styles.pillOption} ${filters.center === c.id ? styles.pillOptionActive : ''}`}
                      onClick={() => handleSelectCenter(c.id, c.orgId)}
                    >
                      <span className={styles.pillOptionLabel}>{c.label}</span>
                      {c.sublabel && <span className={styles.pillOptionSublabel}>{c.sublabel}</span>}
                    </button>
                  ))}
                </div>
              </PillSelect>
            </div>

            <FilterPanel
              sections={[
                { key: 'status', label: 'Status', options: [
                  { value: 'active',   label: 'Active'   },
                  { value: 'inactive', label: 'Inactive' },
                ]},
                { key: 'kpod', label: 'K-POD', options: [
                  { value: 'active',            label: 'OK'               },
                  { value: 'needs-replacement', label: 'Needs replacement' },
                ]},
              ]}
              values={{ status: filters.status, kpod: filters.kpod }}
              onChange={toggleMultiFilter}
              onClear={() => setFilters(p => ({ ...p, status: new Set(), kpod: new Set() }))}
            />

          </div>
        </div>

        {/* Table */}
        <div className={styles.tableBody}>

          <div className={styles.colHeaders}>
            <div className={`${styles.colHead} ${styles.colUnitId}`}>Unit ID</div>
            <div className={`${styles.colHead} ${styles.colOrg}    ${styles.cellCenter}`}>Organization</div>
            <div className={`${styles.colHead} ${styles.colCenter} ${styles.cellCenter}`}>Center</div>
            <div className={`${styles.colHead} ${styles.colNum}    ${styles.cellCenter}`}>Daily use</div>
            <div className={`${styles.colHead} ${styles.colNum}    ${styles.cellCenter}`}>Total use</div>
            <div className={`${styles.colHead} ${styles.colStatus} ${styles.cellCenter}`}>Status</div>
            <div className={`${styles.colHead} ${styles.colActions}`} />
          </div>

          {displayedUnits.length === 0 ? (
            <div className={styles.emptyState}>No units match the current filters.</div>
          ) : (
            displayedUnits.map(unit => {
              const isExpanded = expandedUnits.has(unit.id);
              return (
                <div key={unit.id}>
                  <div className={`${styles.unitRow} ${isExpanded ? styles.unitRowExpanded : ''}`}>

                    <div className={`${styles.cell} ${styles.colUnitId} ${styles.cellUnitId}`}>
                      <button
                        className={`${styles.expandBtn} ${isExpanded ? styles.expandBtnOpen : ''}`}
                        onClick={() => toggleUnit(unit.id)}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <div className={styles.unitIdStack}>
                        <span className={styles.unitId}>{String(unit.id).padStart(4, '0')}</span>
                        <span className={styles.unitDesc}>{unit.description}</span>
                      </div>
                    </div>

                    <div className={`${styles.cell} ${styles.colOrg}    ${styles.cellCenter}`}>{unit.orgName}</div>
                    <div className={`${styles.cell} ${styles.colCenter} ${styles.cellCenter}`}>{unit.centerName}</div>
                    <div className={`${styles.cell} ${styles.colNum}    ${styles.cellCenter}`}>{unit.dailyUse}</div>
                    <div className={`${styles.cell} ${styles.colNum}    ${styles.cellCenter}`}>{unit.totalUse}</div>
                    <div className={`${styles.cell} ${styles.colStatus} ${styles.cellCenter}`}>
                      <Tag status={unit.status} />
                    </div>
                    <div className={`${styles.cell} ${styles.colActions} ${styles.cellCenter}`}>
                      <div className={styles.moreMenuAnchor}>
                        <button
                          className={styles.actionBtn}
                          onClick={e => {
                            e.stopPropagation();
                            if (openMenuId === unit.id) {
                              setOpenMenuId(null);
                            } else {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                              setOpenMenuId(unit.id);
                            }
                          }}
                          aria-label="More options"
                        >
                          <DotsIcon />
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className={styles.deviceRows}>
                      <div className={styles.deviceRow}>
                        <div className={`${styles.deviceCell} ${styles.colUnitId}`}>
                          <span className={styles.deviceIndent} />
                          <span className={`${styles.deviceTypeBadge} ${styles.deviceTypeBadgeDisplay}`}>Display</span>
                          <span className={styles.deviceId}>{unit.display.id}</span>
                        </div>
                        <div className={`${styles.deviceCell} ${styles.colOrg}`} />
                        <div className={`${styles.deviceCell} ${styles.colCenter}`} />
                        <div className={`${styles.deviceCell} ${styles.colNum}`} />
                        <div className={`${styles.deviceCell} ${styles.colNum}`} />
                        <div className={`${styles.deviceCell} ${styles.colStatus} ${styles.cellCenter}`}>
                          <Tag status={unit.display.status} />
                        </div>
                        <div className={`${styles.deviceCell} ${styles.colActions}`} />
                      </div>
                      <div className={styles.deviceRow}>
                        <div className={`${styles.deviceCell} ${styles.colUnitId}`}>
                          <span className={styles.deviceIndent} />
                          <span className={`${styles.deviceTypeBadge} ${styles.deviceTypeBadgeKpod}`}>K-POD</span>
                          <span className={styles.deviceId}>{unit.kpod.id}</span>
                        </div>
                        <div className={`${styles.deviceCell} ${styles.colOrg}`} />
                        <div className={`${styles.deviceCell} ${styles.colCenter}`} />
                        <div className={`${styles.deviceCell} ${styles.colNum}`} />
                        <div className={`${styles.deviceCell} ${styles.colNum}`} />
                        <div className={`${styles.deviceCell} ${styles.colStatus} ${styles.cellCenter}`}>
                          <Tag
                            status={unit.kpod.status === 'needs-replacement' ? 'inactive' : unit.kpod.status}
                            label={unit.kpod.status === 'needs-replacement' ? 'Replace' : undefined}
                          />
                        </div>
                        <div className={`${styles.deviceCell} ${styles.colActions}`} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Showing <strong>1–{displayedUnits.length}</strong> of <strong>{displayedUnits.length}</strong> units
          </span>
          <div className={styles.pageButtons}>
            <button className={styles.pageBtn} disabled>Previous</button>
            <button className={styles.pageBtn}>Next</button>
          </div>
        </div>

      </div>

      {openMenuId && createPortal(
        <div className={styles.contextMenuWrap} style={{ top: menuPos.top, right: menuPos.right }} ref={menuRef}>
          <ContextMenu
            items={[
              { label: 'Edit',   icon: <IconEdit  size={16} />, onClick: () => setOpenMenuId(null) },
              { label: 'Delete', icon: <IconTrash size={16} />, variant: 'danger', onClick: () => setOpenMenuId(null) },
            ]}
          />
        </div>,
        document.body
      )}

    </div>
  );
}
