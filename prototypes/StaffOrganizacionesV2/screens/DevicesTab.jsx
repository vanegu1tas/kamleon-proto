import { useState, useMemo, useRef, useEffect, useSyncExternalStore } from 'react';
import SearchBar from '../../../design-system/components/SearchBar/SearchBar';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Button from '../../../design-system/components/Button/Button';
import Tag from '../../../design-system/components/Tag/Tag';
import FilterPanel from '../../../design-system/components/FilterPanel/FilterPanel';
import ContextMenu from '../../../design-system/components/ContextMenu/ContextMenu';
import Toast from '../../../design-system/components/Toast/Toast';
import { IconEdit, IconSort, IconMore, IconTrash, IconPlus, IconClose } from '../../../design-system/icons/outline';
import DeleteOrgModal from '../../StaffOrganizaciones/screens/DeleteOrgModal';
import DeviceDrawer from './DeviceDrawer';
import { DEVICE_TYPES, getDevices, subscribeDevices, unassignDevice, deleteDevice } from './devicesStore';
import styles from './UnitsTab.module.css';

const PAGE_SIZE = 10;

// Inventario de devices (Display / Sensor) para Kamleon staff — requisito de última hora,
// 29/10. Misma estructura que Units: tabla, filtros en la barra, menú ⋯ por fila.
// Filtros (Daniel, 29/10): buscador + botón Filters con Type y Unit (Assigned / Unassigned).
//
// Permisos (docs/permissions.md): `units.devices.access` → Owner, Admin, Editor ven la lista.
// `units.devices.edit` / `.delete` → solo Owner y Admin; Editor la ve en solo lectura.

let snapshot = 0;
subscribeDevices(() => { snapshot += 1; });
const getSnapshot = () => snapshot;

function sortValue(d, col) {
  switch (col) {
    case 'type':   return DEVICE_TYPES[d.type].label;
    case 'dailyUse': return d.unit?.dailyUse ?? -1;
    case 'totalUse': return d.unit?.totalUse ?? -1;
    case 'unit':   return d.unit?.id ?? 0;
    default:       return d[col];
  }
}

const FILTER_SECTIONS = [
  { key: 'type',   label: 'Type',   options: Object.entries(DEVICE_TYPES).map(([value, { label }]) => ({ value, label })) },
  { key: 'unit',   label: 'Unit',   options: [{ value: 'assigned', label: 'Assigned' }, { value: 'unassigned', label: 'Unassigned' }] },
];

export default function DevicesTab({ role }) {
  const version = useSyncExternalStore(subscribeDevices, getSnapshot);
  const canManage = role === 'owner' || role === 'admin';

  const [search, setSearch]     = useState('');
  const [filters, setFilters]   = useState({ type: new Set(), unit: new Set() });
  const [sortCol, setSortCol]   = useState(null);
  const [sortDir, setSortDir]   = useState('asc');
  const [page, setPage]         = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [drawer, setDrawer]     = useState(null); // { device } | { device: null } para New
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]       = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const all = useMemo(() => getDevices(), [version]);
  const counts = {
    all:       all.length,
    unassigned: all.filter(d => !d.unit).length,
    assigned:  all.filter(d => d.unit).length,
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = all.filter(d => {
      if (filters.type.size > 0 && !filters.type.has(d.type)) return false;
      if (filters.unit.size > 0 && !filters.unit.has(d.unit ? 'assigned' : 'unassigned')) return false;
      if (q && ![d.id, d.unit?.id].some(v => v != null && String(v).toLowerCase().includes(q))) return false;
      return true;
    });
    if (sortCol) {
      rows = [...rows].sort((a, b) => {
        const va = sortValue(a, sortCol), vb = sortValue(b, sortCol);
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ?  1 : -1;
        return 0;
      });
    }
    return rows;
  }, [all, search, filters, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageRows   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleSort(col) {
    if (sortCol !== col) { setSortCol(col); setSortDir('asc'); }
    else if (sortDir === 'asc') setSortDir('desc');
    else { setSortCol(null); setSortDir('asc'); }
  }

  function toggleFilter(key, v) {
    setFilters(prev => {
      const next = new Set(prev[key]);
      next.has(v) ? next.delete(v) : next.add(v);
      return { ...prev, [key]: next };
    });
    setPage(1);
  }

  function SortHead({ col, className, children }) {
    return (
      <span className={`${styles.colHead} ${className}`}>
        <button className={`${styles.sortBtn} ${sortCol === col ? styles.sortBtnActive : ''}`} onClick={() => handleSort(col)}>
          {children} <span className={styles.sortIcon}>
            <IconSort size={14} upColor={sortCol === col && sortDir === 'asc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'} downColor={sortCol === col && sortDir === 'desc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'} />
          </span>
        </button>
      </span>
    );
  }

  function menuItems(d) {
    const close = () => setOpenMenuId(null);
    const label = DEVICE_TYPES[d.type].label;
    return d.unit
      ? [
          { label: 'Edit', icon: <IconEdit size={16} />, onClick: () => { close(); setDrawer({ device: d }); } },
          // Confirmación escribiendo el ID (revisión 30/10)
          { label: 'Remove from unit', icon: <IconClose size={16} />, variant: 'danger', onClick: () => { close(); setRemoveTarget(d); } },
        ]
      : [
          // Edit hacía lo mismo que Assign (abre el mismo drawer): solo Assign (Daniel, 29/10)
          { label: 'Assign to unit', icon: <IconPlus size={16} />, onClick: () => { close(); setDrawer({ device: d }); } },
          { label: 'Delete', icon: <IconTrash size={16} />, variant: 'danger', onClick: () => { close(); setDeleteTarget(d); } },
        ];
  }

  return (
    <div className={styles.container}>
      {/* Misma estructura que Units (Figma 12533:25374) */}
      <div className={styles.pageHeading}>
        <h1 className={styles.pageHeadingTitle}>Devices</h1>
        {canManage && (
          <Button variant="primary" leftIcon={<IconPlus size={16} />} onClick={() => setDrawer({ device: null })}>
            New device
          </Button>
        )}
      </div>
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <span className={styles.statValue}>{counts.all}</span>
          <span className={styles.statLabel}>Total devices</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.statValue}>{counts.unassigned}</span>
          <span className={styles.statLabel}>Unassigned</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.statValue}>{counts.assigned}</span>
          <span className={styles.statLabel}>Assigned</span>
        </div>
      </div>

      <div className={styles.card}>

        <div className={styles.cardToolbar}>
          <div className={styles.toolbar}>
            <SearchBar
              className={styles.searchBar}
              placeholder="Search..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              onClear={() => { setSearch(''); setPage(1); }}
            />
            <FilterPanel
              sections={FILTER_SECTIONS}
              values={filters}
              onChange={toggleFilter}
              onClear={() => { setFilters({ type: new Set(), unit: new Set() }); setPage(1); }}
            />
          </div>
        </div>

        {pageRows.length > 0 ? (
          <div className={styles.tableWrap}>
            <div className={styles.tableHeader}>
              <SortHead col="id"     className={styles.colUnit}>Device ID</SortHead>
              <SortHead col="type"   className={styles.colUse}>Type</SortHead>
              <SortHead col="unit"   className={styles.colUse}>Unit</SortHead>
              <SortHead col="dailyUse" className={styles.colUse}>Daily use</SortHead>
              <SortHead col="totalUse" className={styles.colUse}>Total use</SortHead>
              {canManage && <span className={`${styles.colHead} ${styles.colActions}`} />}
            </div>

            {pageRows.map(d => {
              const key = `${d.type}-${d.id}`;
              const isOpen = openMenuId === key;
              return (
                <div key={key} className={styles.tableRow}>
                  <div className={`${styles.cell} ${styles.colUnit}`}>
                    <div className={styles.unitMeta}>
                      <span className={styles.unitId}>{d.id}</span>
                      <span className={styles.unitCenter}>Added {d.dateAdded}</span>
                    </div>
                  </div>
                  <div className={`${styles.cell} ${styles.colUse}`}>
                    <span className={styles.useValue}>{DEVICE_TYPES[d.type].label}</span>
                  </div>
                  {/* Sin columna Status (Arnau: el Status de devices no se usa). La unit dice si está
                      puesto; sin unit, tag gris "Unassigned" para que se vea al escanear la lista. */}
                  <div className={`${styles.cell} ${styles.colUse}`}>
                    {d.unit
                      ? <span className={styles.useValue}>{d.unit.id}</span>
                      : <Tag status="mixed" label="Unassigned" />}
                  </div>
                  {/* Uso de la unit donde está puesto; sin unit no hay uso */}
                  <div className={`${styles.cell} ${styles.colUse}`}>
                    <span className={styles.useValue}>{d.unit?.dailyUse ?? '—'}</span>
                  </div>
                  <div className={`${styles.cell} ${styles.colUse}`}>
                    <span className={styles.useValue}>{d.unit?.totalUse ?? '—'}</span>
                  </div>
                  {canManage && (
                    <div className={`${styles.cell} ${styles.colActions}`} ref={el => { menuRefs.current[key] = el; }}>
                      <div className={styles.rowMenuAnchor}>
                        <IconButton aria-label="Device options" tooltip="More" onClick={() => setOpenMenuId(isOpen ? null : key)}>
                          <IconMore size={16} />
                        </IconButton>
                        {isOpen && (
                          <div className={styles.rowMenu}>
                            <ContextMenu items={menuItems(d)} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No devices found</p>
            <p className={styles.emptySubtitle}>{search ? `No devices match "${search}"` : 'No devices match the selected filters'}</p>
          </div>
        )}

        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            Showing <strong>{filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong> devices
          </span>
          <div className={styles.paginationBtns}>
            <button className={styles.paginationBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>Previous</button>
            <button className={styles.paginationBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>Next</button>
          </div>
        </div>

      </div>

      {drawer && (
        <DeviceDrawer device={drawer.device} onClose={() => setDrawer(null)} onSave={setToast} />
      )}

      {deleteTarget && (
        <DeleteOrgModal
          org={{ name: `${DEVICE_TYPES[deleteTarget.type].label} ${deleteTarget.id}` }}
          label={DEVICE_TYPES[deleteTarget.type].label.toLowerCase()}
          // Borrar escribe DELETE como en el resto de la plataforma; el ID es solo para Remove (Daniel, 30/10)
          requireTyping
          message={<>Are you sure to delete <strong>{DEVICE_TYPES[deleteTarget.type].label.toLowerCase()} {deleteTarget.id}</strong>? It will be permanently removed from the inventory.</>}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => { deleteDevice(deleteTarget.id); setToast(`Device ${deleteTarget.id} deleted`); }}
        />
      )}

      {removeTarget && (() => {
        const noun = DEVICE_TYPES[removeTarget.type].label;
        return (
          <DeleteOrgModal
            org={{ name: `${noun} ${removeTarget.id}` }}
            label={`${noun.toLowerCase()} from unit`}
            verb="Remove"
            requireTyping
            confirmWord={String(removeTarget.id)}
            message={<>Are you sure to remove <strong>{noun.toLowerCase()} {removeTarget.id}</strong> from unit {removeTarget.unit.id}? It will go back to the inventory as Unassigned.</>}
            onClose={() => setRemoveTarget(null)}
            onConfirm={() => {
              unassignDevice(removeTarget.type, removeTarget.unit);
              setToast(`${noun} ${removeTarget.id} removed from unit ${removeTarget.unit.id}`);
            }}
          />
        );
      })()}

      {toast && <Toast message={toast} mode="success" onClose={() => setToast(null)} />}
    </div>
  );
}
