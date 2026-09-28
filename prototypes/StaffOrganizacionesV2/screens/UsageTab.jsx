import { useState, useMemo, useRef, useEffect } from 'react';
import SearchBar from '../../../design-system/components/SearchBar/SearchBar';
import ToolbarButton from '../../../design-system/components/ToolbarButton/ToolbarButton';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Button from '../../../design-system/components/Button/Button';
import Toast from '../../../design-system/components/Toast/Toast';
import { IconFilter, IconEye, IconDownload, IconSort } from '../../../design-system/icons/outline';
import ExportReportModal from './ExportReportModal';
import { getAssignedCenters } from '../rolePersonas';
import styles from './UsageTab.module.css';

const PAGE_SIZE = 12;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function buildReportHistory() {
  const now = new Date();
  const reports = [];
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    reports.push({ id: i, month: MONTHS[d.getMonth()], year: d.getFullYear() });
  }
  return reports;
}

const REPORTS = buildReportHistory();

const YEAR_OPTIONS = [...new Set(REPORTS.map(r => r.year))].sort((a, b) => b - a);

function formatCenterList(names) {
  if (names.length <= 1) return names[0] ?? '';
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

export default function UsageTab({ role, user }) {
  const scopeCenters = role === 'centerAdmin' ? getAssignedCenters(role) : null;
  const scopeLabel = scopeCenters ? formatCenterList(scopeCenters.map(c => c.name)) : null;

  const [search, setSearch]         = useState('');
  const [filters, setFilters]       = useState({ year: new Set() });
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortCol, setSortCol]       = useState(null);
  const [sortDir, setSortDir]       = useState('asc');
  const [page, setPage]             = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const [toast, setToast] = useState(null);
  const filterRef = useRef(null);

  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

  function handleSort(col) {
    if (sortCol !== col) { setSortCol(col); setSortDir('asc'); }
    else if (sortDir === 'asc') setSortDir('desc');
    else { setSortCol(null); setSortDir('asc'); }
  }

  function toggleFilter(value) {
    setFilters(prev => {
      const next = new Set(prev.year);
      next.has(value) ? next.delete(value) : next.add(value);
      return { year: next };
    });
    setPage(1);
  }

  function clearFilters() { setFilters({ year: new Set() }); setPage(1); }
  const activeFilterCount = filters.year.size;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = REPORTS.filter(r => {
      if (filters.year.size > 0 && !filters.year.has(r.year)) return false;
      if (q && !r.month.toLowerCase().includes(q) && !String(r.year).includes(q)) return false;
      return true;
    });
    if (sortCol) {
      rows = [...rows].sort((a, b) => {
        const va = a[sortCol];
        const vb = b[sortCol];
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ?  1 : -1;
        return 0;
      });
    }
    return rows;
  }, [search, filters, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageReports = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleSearch(val) { setSearch(val); setPage(1); }

  function handleExport({ month, year }) {
    setToast({ message: `${month} ${year} report is being generated.` });
  }

  function handleView(report) {
    setToast({ message: `Opening ${report.month} ${report.year} report...` });
  }

  function handleDownload(report) {
    setToast({ message: `${report.month} ${report.year} report downloaded.` });
  }

  return (
    <div className={styles.container}>

      <div className={styles.heading}>
        <h1 className={styles.pageTitle}>Usage analytics</h1>
        <Button variant="primary" size="m" leftIcon={<IconDownload size={20} />} onClick={() => setShowExportModal(true)}>
          Export report
        </Button>
      </div>

      <div className={styles.card}>

        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Monthly report history</h2>
          <p className={styles.cardSubtitle}>
            Download your monthly reports at any time. Your full report history is available below.
            {scopeLabel && ` Reports include data from ${scopeLabel} only.`}
          </p>
        </div>

        <div className={styles.toolbar}>
          <SearchBar
            className={styles.searchBar}
            placeholder="Search..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            onClear={() => handleSearch('')}
          />
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
                  <p className={styles.filterSectionLabel}>Year</p>
                  {YEAR_OPTIONS.map(y => (
                    <label key={y} className={`${styles.filterOption} ${filters.year.has(y) ? styles.filterOptionChecked : ''}`}>
                      <input type="checkbox" className={styles.nativeCheck} checked={filters.year.has(y)} onChange={() => toggleFilter(y)} />
                      <span className={styles.checkBox}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className={styles.checkMark} aria-hidden="true">
                          <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className={styles.optionLabel}>{y}</span>
                    </label>
                  ))}
                </div>
                {activeFilterCount > 0 && (
                  <button className={styles.clearFilters} onClick={clearFilters}>Clear filters</button>
                )}
              </div>
            )}
          </div>
        </div>

        {pageReports.length > 0 ? (
          <div className={styles.tableWrap}>
            <div className={styles.tableHeader}>
              <span className={`${styles.colHead} ${styles.colMonth}`}>Month</span>
              <span className={`${styles.colHead} ${styles.colYear}`}>
                <button className={`${styles.sortBtn} ${sortCol === 'year' ? styles.sortBtnActive : ''}`} onClick={() => handleSort('year')}>
                  Year <span className={styles.sortIcon}>
                    <IconSort
                      size={14}
                      upColor={sortCol === 'year' && sortDir === 'asc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'}
                      downColor={sortCol === 'year' && sortDir === 'desc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'}
                    />
                  </span>
                </button>
              </span>
              <span className={`${styles.colHead} ${styles.colSpacer}`} />
              <span className={`${styles.colHead} ${styles.colActions}`} />
            </div>

            {pageReports.map(report => (
              <div key={report.id} className={styles.tableRow}>
                <div className={`${styles.cell} ${styles.colMonth}`}>{report.month}</div>
                <div className={`${styles.cell} ${styles.colYear}`}>{report.year}</div>
                <div className={`${styles.cell} ${styles.colSpacer}`} />
                <div className={`${styles.cell} ${styles.colActions}`}>
                  <IconButton aria-label="View report" tooltip="View" tooltipPosition="top" onClick={() => handleView(report)}>
                    <IconEye size={16} />
                  </IconButton>
                  <IconButton aria-label="Download report" tooltip="Download" tooltipPosition="top" onClick={() => handleDownload(report)}>
                    <IconDownload size={16} />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No reports found</p>
            <p className={styles.emptySubtitle}>{search ? `No reports match "${search}"` : 'No reports available'}</p>
          </div>
        )}

        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            Showing <strong>{filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong> reports
          </span>
          <div className={styles.paginationBtns}>
            <button className={styles.paginationBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>Previous</button>
            <button className={styles.paginationBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>Next</button>
          </div>
        </div>

      </div>

      {showExportModal && (
        <ExportReportModal onClose={() => setShowExportModal(false)} onExport={handleExport} scopeLabel={scopeLabel} />
      )}

      {toast && (
        <Toast message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
