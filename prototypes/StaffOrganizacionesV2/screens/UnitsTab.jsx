import { useState, useMemo, useRef, useEffect } from 'react';
import SearchBar from '../../../design-system/components/SearchBar/SearchBar';
import ToolbarButton from '../../../design-system/components/ToolbarButton/ToolbarButton';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Button from '../../../design-system/components/Button/Button';
import Tag from '../../../design-system/components/Tag/Tag';
import TabBar from '../../../design-system/components/TabBar/TabBar';
import { IconFilter, IconEdit, IconSort, IconSettings, IconMore, IconTrash, IconPlus, IconChevronDown } from '../../../design-system/icons/outline';
import ContextMenu from '../../../design-system/components/ContextMenu/ContextMenu';
import Toast from '../../../design-system/components/Toast/Toast';
import DeleteOrgModal from '../../StaffOrganizaciones/screens/DeleteOrgModal';
import { ORGS } from '../../StaffOrganizaciones/mockData';
import { getAssignedCenters } from '../rolePersonas';
import EditUnitDrawer from './EditUnitDrawer';
import styles from './UnitsTab.module.css';

const PAGE_SIZE = 15;

// Devices y Sensor History quedan para más adelante — por ahora solo Details.
const DETAIL_TABS = [
  { id: 'details', label: 'Details' },
];

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className={styles.infoItem}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  );
}

// Organization/Center/Display/Sensor no son campos directos de `unit` — viven en
// filas hermanas del row ({ unit, center, org }) o anidados (display.id/kpod.id).
function getSortValue(row, col) {
  switch (col) {
    case 'orgName':    return row.org?.name ?? '';
    case 'centerName': return row.center?.name ?? '';
    case 'displayId':  return row.unit.display?.id ?? 0;
    case 'sensorId':   return row.unit.kpod?.id ?? 0;
    default:           return row.unit[col];
  }
}

export default function UnitsTab({ role, user, org: orgProp, embedded = false }) {
  const [search, setSearch]         = useState('');
  const [filters, setFilters]       = useState({ status: new Set(), organization: new Set(), center: new Set() });
  const [filterOpen, setFilterOpen] = useState(false);
  const [orgFilterOpen, setOrgFilterOpen] = useState(false);
  const [centerFilterOpen, setCenterFilterOpen] = useState(false);
  const [sortCol, setSortCol]       = useState(null);
  const [sortDir, setSortDir]       = useState('asc');
  const [page, setPage]             = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [detailTab, setDetailTab]   = useState('details');
  const [editUnitTarget, setEditUnitTarget] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteToast, setDeleteToast] = useState(null);
  const [saveToast, setSaveToast]     = useState(null);
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  // units.delete: exclusivo de Owner/Admin — ni Kamleon Editor lo tiene (docs/permissions.md).
  const canDeleteUnit = role === 'owner' || role === 'admin';
  // units.create: exclusivo de Editor (+ Owner/Admin bypass) — mismo criterio que OrgDetailV2.
  const canCreateUnit = role === 'owner' || role === 'admin' || role === 'editor';
  // units.filter.byOrganization / byCenter / advanced (docs/permissions.md)
  const canFilterByOrg    = role === 'owner' || role === 'admin' || role === 'editor';
  const canFilterByCenter = role === 'owner' || role === 'admin' || role === 'editor' || role === 'orgAdmin';
  const canFilterAdvanced = role === 'owner' || role === 'admin' || role === 'editor';
  const filterRef = useRef(null);
  const orgFilterRef = useRef(null);
  const centerFilterRef = useRef(null);
  const newMenuRef = useRef(null);
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

  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

  useEffect(() => {
    if (!orgFilterOpen) return;
    function handleClick(e) {
      if (orgFilterRef.current && !orgFilterRef.current.contains(e.target)) setOrgFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [orgFilterOpen]);

  useEffect(() => {
    if (!centerFilterOpen) return;
    function handleClick(e) {
      if (centerFilterRef.current && !centerFilterRef.current.contains(e.target)) setCenterFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [centerFilterOpen]);

  useEffect(() => {
    if (!newMenuOpen) return;
    function handleClick(e) {
      if (newMenuRef.current && !newMenuRef.current.contains(e.target)) setNewMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [newMenuOpen]);

  const allRows = useMemo(() => {
    const centersInScope = [];
    if (role === 'centerAdmin') {
      const org = ORGS.find(o => o.id === user?.orgId);
      getAssignedCenters(role).forEach(center => centersInScope.push({ center, org }));
    } else if (role === 'orgAdmin') {
      const org = orgProp ?? ORGS.find(o => o.id === user?.orgId);
      (org?.centers ?? []).forEach(center => centersInScope.push({ center, org }));
    } else {
      ORGS.forEach(org => org.centers.forEach(center => centersInScope.push({ center, org })));
    }
    const rows = [];
    centersInScope.forEach(({ center, org }) => {
      (center.units ?? []).forEach(unit => rows.push({ unit, center, org }));
    });
    return rows;
  }, [role, user, orgProp]);

  const totalUnits    = allRows.length;
  const activeUnits    = allRows.filter(r => r.unit.status === 'active').length;
  const disabledUnits = allRows.filter(r => r.unit.status !== 'active').length;

  // Organization/Centers dropdown options — se derivan de allRows, así ya vienen
  // pre-escopados por rol (un orgAdmin solo va a ver su propia org, etc.)
  const orgOptions = useMemo(() => {
    const map = new Map();
    allRows.forEach(r => { if (r.org) map.set(r.org.id, r.org.name); });
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [allRows]);

  const centerOptions = useMemo(() => {
    const map = new Map();
    allRows.forEach(r => map.set(r.center.id, r.center.name));
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [allRows]);

  function handleSort(col) {
    if (sortCol !== col) { setSortCol(col); setSortDir('asc'); }
    else if (sortDir === 'asc') setSortDir('desc');
    else { setSortCol(null); setSortDir('asc'); }
  }

  function toggleFilter(value) {
    setFilters(prev => {
      const next = new Set(prev.status);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, status: next };
    });
    setPage(1);
  }

  function toggleOrgFilter(id) {
    setFilters(prev => {
      const next = new Set(prev.organization);
      next.has(id) ? next.delete(id) : next.add(id);
      return { ...prev, organization: next };
    });
    setPage(1);
  }

  function toggleCenterFilter(id) {
    setFilters(prev => {
      const next = new Set(prev.center);
      next.has(id) ? next.delete(id) : next.add(id);
      return { ...prev, center: next };
    });
    setPage(1);
  }

  function clearFilters() { setFilters({ status: new Set(), organization: new Set(), center: new Set() }); setPage(1); }
  const activeFilterCount = filters.status.size;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = allRows.filter(({ unit, center, org }) => {
      if (filters.status.size > 0 && !filters.status.has(unit.status)) return false;
      if (filters.organization.size > 0 && !filters.organization.has(org?.id)) return false;
      if (filters.center.size > 0 && !filters.center.has(center.id)) return false;
      if (q && !String(unit.id).toLowerCase().includes(q) && !center.name.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sortCol) {
      rows = [...rows].sort((a, b) => {
        const va = getSortValue(a, sortCol);
        const vb = getSortValue(b, sortCol);
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ?  1 : -1;
        return 0;
      });
    }
    return rows;
  }, [allRows, search, filters, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageRows   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleSearch(val) { setSearch(val); setPage(1); }

  return (
    <div className={embedded ? styles.embeddedContainer : styles.container}>

      {selectedUnit ? (
      <div className={embedded ? styles.embeddedCard : styles.card}>

        <button className={styles.backBtn} onClick={() => setSelectedUnit(null)}>
          <span className={styles.backIcon}><ArrowLeftIcon /></span>
          <span className={styles.backLabel}>Back to Units</span>
        </button>

        <div className={styles.detailHeader}>
          <div className={styles.detailHeading}>
            <h2 className={styles.detailTitle}>{String(selectedUnit.unit.id)} — Unit</h2>
            <div className={styles.detailStatus}>
              <span className={`${styles.statusDot} ${selectedUnit.unit.status !== 'active' ? styles.statusDotInactive : ''}`} />
              <span className={styles.statusLabel}>{selectedUnit.unit.status === 'active' ? 'Active' : 'Disabled'}</span>
            </div>
          </div>
          <IconButton
            aria-label="Unit settings"
            tooltip="Unit settings"
            tooltipPosition="left"
            onClick={() => setEditUnitTarget(selectedUnit)}
          >
            <IconSettings size={16} />
          </IconButton>
        </div>

        <div className={styles.detailTabsOuter}>
          <div className={styles.detailTabs}>
            <div className={styles.detailTabsInner}>
              <TabBar tabs={DETAIL_TABS} activeTab={detailTab} onChange={setDetailTab} size="s" />
            </div>
          </div>
        </div>

        <div className={styles.detailBody}>
          {detailTab === 'details' && (
            <>
              <div className={styles.infoSection}>
                <p className={styles.infoSectionLabel}>Assigned to</p>
                <div className={styles.infoRow}>
                  <InfoRow label="Organization" value={selectedUnit.org?.name ?? '—'} />
                  <InfoRow label="Center" value={selectedUnit.center.name} />
                </div>
              </div>

              <div className={styles.infoSection}>
                <p className={styles.infoSectionLabel}>Description</p>
                <div className={styles.infoRowFull}>
                  <span className={styles.infoDescription}>{selectedUnit.unit.description ?? '—'}</span>
                </div>
              </div>

              <div className={styles.infoSection}>
                <p className={styles.infoSectionLabel}>Specifications</p>
                <div className={styles.infoRow}>
                  <InfoRow label="Unit number" value={String(selectedUnit.unit.id)} />
                  <InfoRow label="Model" value="Stand" />
                </div>
                <div className={styles.infoRowHalf}>
                  <InfoRow label="Language" value="EN" />
                </div>
              </div>

              <div className={styles.infoSection}>
                <p className={styles.infoSectionLabel}>Login</p>
                <div className={styles.infoRowHalf}>
                  <InfoRow label="Type" value="Public" />
                </div>
              </div>

              <div className={styles.infoSection}>
                <p className={styles.infoSectionLabel}>Screen roster</p>
                <p className={styles.rosterEmpty}>No teams configured</p>
              </div>
            </>
          )}
        </div>

      </div>
      ) : (
      <div className={embedded ? styles.embeddedCard : styles.card}>

        <div className={styles.cardTop}>
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>Units</h1>
            {canCreateUnit && (
              <div className={styles.newMenuAnchor} ref={newMenuRef}>
                <Button
                  variant="primary"
                  leftIcon={<IconPlus size={16} />}
                  onClick={() => setNewMenuOpen(v => !v)}
                >
                  New
                </Button>
                {newMenuOpen && (
                  <div className={styles.newMenu}>
                    <ContextMenu
                      items={[
                        { label: 'New unit',   icon: <IconPlus size={16} />, onClick: () => setNewMenuOpen(false) },
                        { label: 'New device', icon: <IconPlus size={16} />, onClick: () => setNewMenuOpen(false) },
                      ]}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <p className={styles.pageDescription}>
            {role === 'orgAdmin'
              ? "All units installed across every center in this organization."
              : role === 'centerAdmin'
              ? 'All units installed across the centers you manage.'
              : 'All units installed across every organization.'}
          </p>

          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{totalUnits}</span>
              <span className={styles.statLabel}>Total units</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{activeUnits}</span>
              <span className={styles.statLabel}>Active</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{disabledUnits}</span>
              <span className={styles.statLabel}>Disabled</span>
            </div>
          </div>

        <div className={styles.toolbar}>
          <SearchBar
            className={styles.searchBar}
            placeholder="Search..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            onClear={() => handleSearch('')}
          />
          {canFilterByOrg && orgOptions.length > 1 && (
            <div className={styles.filterWrap} ref={orgFilterRef}>
              <ToolbarButton selected={filters.organization.size > 0} onClick={() => setOrgFilterOpen(v => !v)}>
                Organization
                {filters.organization.size > 0 && <span className={styles.filterBadge}>{filters.organization.size}</span>}
                <span className={styles.dropdownChevron}><IconChevronDown size={16} /></span>
              </ToolbarButton>
              {orgFilterOpen && (
                <div className={styles.filterDropdown}>
                  <div className={styles.filterSection}>
                    {orgOptions.map(({ id, name }) => (
                      <label key={id} className={`${styles.filterOption} ${filters.organization.has(id) ? styles.filterOptionChecked : ''}`}>
                        <input type="checkbox" className={styles.nativeCheck} checked={filters.organization.has(id)} onChange={() => toggleOrgFilter(id)} />
                        <span className={styles.checkBox}>
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className={styles.checkMark} aria-hidden="true">
                            <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className={styles.optionLabel}>{name}</span>
                      </label>
                    ))}
                  </div>
                  {filters.organization.size > 0 && (
                    <button className={styles.clearFilters} onClick={() => { setFilters(prev => ({ ...prev, organization: new Set() })); setPage(1); }}>Clear</button>
                  )}
                </div>
              )}
            </div>
          )}
          {canFilterByCenter && centerOptions.length > 1 && (
            <div className={styles.filterWrap} ref={centerFilterRef}>
              <ToolbarButton selected={filters.center.size > 0} onClick={() => setCenterFilterOpen(v => !v)}>
                Centers
                {filters.center.size > 0 && <span className={styles.filterBadge}>{filters.center.size}</span>}
                <span className={styles.dropdownChevron}><IconChevronDown size={16} /></span>
              </ToolbarButton>
              {centerFilterOpen && (
                <div className={styles.filterDropdown}>
                  <div className={styles.filterSection}>
                    {centerOptions.map(({ id, name }) => (
                      <label key={id} className={`${styles.filterOption} ${filters.center.has(id) ? styles.filterOptionChecked : ''}`}>
                        <input type="checkbox" className={styles.nativeCheck} checked={filters.center.has(id)} onChange={() => toggleCenterFilter(id)} />
                        <span className={styles.checkBox}>
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className={styles.checkMark} aria-hidden="true">
                            <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className={styles.optionLabel}>{name}</span>
                      </label>
                    ))}
                  </div>
                  {filters.center.size > 0 && (
                    <button className={styles.clearFilters} onClick={() => { setFilters(prev => ({ ...prev, center: new Set() })); setPage(1); }}>Clear</button>
                  )}
                </div>
              )}
            </div>
          )}
          {canFilterAdvanced && (
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
                  <p className={styles.filterSectionLabel}>Status</p>
                  {[{ v: 'active', label: 'Active' }, { v: 'inactive', label: 'Disabled' }].map(({ v, label }) => (
                    <label key={v} className={`${styles.filterOption} ${filters.status.has(v) ? styles.filterOptionChecked : ''}`}>
                      <input type="checkbox" className={styles.nativeCheck} checked={filters.status.has(v)} onChange={() => toggleFilter(v)} />
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
                  <button className={styles.clearFilters} onClick={clearFilters}>Clear filters</button>
                )}
              </div>
            )}
          </div>
          )}
        </div>
        </div>

        {pageRows.length > 0 ? (
          <div className={styles.tableWrap}>
            <div className={styles.tableHeader}>
              <span className={`${styles.colHead} ${styles.colUnit}`}>
                <button className={`${styles.sortBtn} ${sortCol === 'id' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('id')}>
                  Unit ID <span className={styles.sortIcon}>
                    <IconSort size={14} upColor={sortCol === 'id' && sortDir === 'asc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'} downColor={sortCol === 'id' && sortDir === 'desc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'} />
                  </span>
                </button>
              </span>
              <span className={`${styles.colHead} ${styles.colOrg}`}>
                <button className={`${styles.sortBtn} ${sortCol === 'orgName' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('orgName')}>
                  Organization <span className={styles.sortIcon}>
                    <IconSort size={14} upColor={sortCol === 'orgName' && sortDir === 'asc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'} downColor={sortCol === 'orgName' && sortDir === 'desc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'} />
                  </span>
                </button>
              </span>
              <span className={`${styles.colHead} ${styles.colCenter}`}>
                <button className={`${styles.sortBtn} ${sortCol === 'centerName' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('centerName')}>
                  Center <span className={styles.sortIcon}>
                    <IconSort size={14} upColor={sortCol === 'centerName' && sortDir === 'asc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'} downColor={sortCol === 'centerName' && sortDir === 'desc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'} />
                  </span>
                </button>
              </span>
              <span className={`${styles.colHead} ${styles.colUse}`}>
                <button className={`${styles.sortBtn} ${sortCol === 'displayId' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('displayId')}>
                  Display <span className={styles.sortIcon}>
                    <IconSort size={14} upColor={sortCol === 'displayId' && sortDir === 'asc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'} downColor={sortCol === 'displayId' && sortDir === 'desc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'} />
                  </span>
                </button>
              </span>
              <span className={`${styles.colHead} ${styles.colUse}`}>
                <button className={`${styles.sortBtn} ${sortCol === 'sensorId' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('sensorId')}>
                  Sensor <span className={styles.sortIcon}>
                    <IconSort size={14} upColor={sortCol === 'sensorId' && sortDir === 'asc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'} downColor={sortCol === 'sensorId' && sortDir === 'desc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'} />
                  </span>
                </button>
              </span>
              <span className={`${styles.colHead} ${styles.colUse}`}>
                <button className={`${styles.sortBtn} ${sortCol === 'dailyUse' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('dailyUse')}>
                  Daily use <span className={styles.sortIcon}>
                    <IconSort
                      size={14}
                      upColor={sortCol === 'dailyUse' && sortDir === 'asc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'}
                      downColor={sortCol === 'dailyUse' && sortDir === 'desc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'}
                    />
                  </span>
                </button>
              </span>
              <span className={`${styles.colHead} ${styles.colUse}`}>
                <button className={`${styles.sortBtn} ${sortCol === 'totalUse' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('totalUse')}>
                  Total use <span className={styles.sortIcon}>
                    <IconSort
                      size={14}
                      upColor={sortCol === 'totalUse' && sortDir === 'asc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'}
                      downColor={sortCol === 'totalUse' && sortDir === 'desc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'}
                    />
                  </span>
                </button>
              </span>
              <span className={`${styles.colHead} ${styles.colStatus}`}>
                <button className={`${styles.sortBtn} ${sortCol === 'status' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('status')}>
                  Status <span className={styles.sortIcon}>
                    <IconSort size={14} upColor={sortCol === 'status' && sortDir === 'asc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'} downColor={sortCol === 'status' && sortDir === 'desc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'} />
                  </span>
                </button>
              </span>
              <span className={`${styles.colHead} ${styles.colActions}`} />
            </div>

            {pageRows.map(({ unit, center, org }) => {
              const isOpen = openMenuId === unit.id;
              return (
              <div
                key={unit.id}
                className={`${styles.tableRow} ${styles.tableRowClickable}`}
                onClick={() => { setSelectedUnit({ unit, center, org }); setDetailTab('details'); }}
              >
                <div className={`${styles.cell} ${styles.colUnit}`}>
                  <div className={styles.unitMeta}>
                    <span className={styles.unitId}>{String(unit.id)}</span>
                    <span className={styles.unitCenter}>{[unit.type, unit.model].filter(Boolean).join('  |  ') || '-'}</span>
                  </div>
                </div>
                <div className={`${styles.cell} ${styles.colOrg}`}>
                  <span className={styles.useValue}>{org?.name ?? '-'}</span>
                </div>
                <div className={`${styles.cell} ${styles.colCenter}`}>
                  <span className={styles.useValue}>{center?.name ?? '-'}</span>
                </div>
                <div className={`${styles.cell} ${styles.colUse}`}>
                  <span className={styles.useValue}>{unit.display?.id ?? '—'}</span>
                </div>
                <div className={`${styles.cell} ${styles.colUse}`}>
                  <span className={styles.useValue}>{unit.kpod?.id ?? '—'}</span>
                </div>
                <div className={`${styles.cell} ${styles.colUse}`}>
                  <span className={styles.useValue}>{unit.dailyUse ?? '—'}</span>
                </div>
                <div className={`${styles.cell} ${styles.colUse}`}>
                  <span className={styles.useValue}>{unit.totalUse ?? '—'}</span>
                </div>
                <div className={`${styles.cell} ${styles.colStatus}`}>
                  <Tag status={unit.status} label={unit.status === 'active' ? 'Active' : 'Disabled'} />
                </div>
                <div
                  className={`${styles.cell} ${styles.colActions}`}
                  ref={el => { menuRefs.current[unit.id] = el; }}
                  onClick={e => e.stopPropagation()}
                >
                  <div className={styles.rowMenuAnchor}>
                    <IconButton
                      aria-label="Unit options"
                      tooltip="More"
                      onClick={() => setOpenMenuId(isOpen ? null : unit.id)}
                    >
                      <IconMore size={16} />
                    </IconButton>
                    {isOpen && (
                      <div className={styles.rowMenu}>
                        <ContextMenu
                          items={[
                            { label: 'Edit Unit', icon: <IconEdit size={16} />, onClick: () => { setOpenMenuId(null); setEditUnitTarget({ unit, center, org }); } },
                            ...(canDeleteUnit ? [{ label: 'Delete Unit', icon: <IconTrash size={16} />, variant: 'danger', onClick: () => { setOpenMenuId(null); setDeleteTarget({ unit, center, org }); } }] : []),
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
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No units found</p>
            <p className={styles.emptySubtitle}>{search ? `No units match "${search}"` : 'No units match the selected filters'}</p>
          </div>
        )}

        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            Showing <strong>{filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong>
          </span>
          <div className={styles.paginationBtns}>
            <button className={styles.paginationBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>Previous</button>
            <button className={styles.paginationBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>Next</button>
          </div>
        </div>

      </div>
      )}

      {editUnitTarget && (
        <EditUnitDrawer
          unit={editUnitTarget.unit}
          center={editUnitTarget.center}
          role={role}
          onClose={() => setEditUnitTarget(null)}
          onSave={u => setSaveToast(`Unit ${u?.id ?? ''} updated`)}
        />
      )}

      {deleteTarget && (
        <DeleteOrgModal
          org={{ name: String(deleteTarget.unit.id) }}
          label="unit"
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => setDeleteToast(`Unit ${deleteTarget.unit.id} deleted`)}
        />
      )}

      {saveToast && (
        <Toast message={saveToast} mode="success" onClose={() => setSaveToast(null)} />
      )}

      {deleteToast && (
        <Toast message={deleteToast} mode="success" onUndo={() => setDeleteToast(null)} onClose={() => setDeleteToast(null)} />
      )}
    </div>
  );
}
