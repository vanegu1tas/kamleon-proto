import { useState, useRef, useEffect } from 'react';
import Tag from '../../../design-system/components/Tag/Tag';
import SearchBar from '../../../design-system/components/SearchBar/SearchBar';
import ToolbarButton from '../../../design-system/components/ToolbarButton/ToolbarButton';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Button from '../../../design-system/components/Button/Button';
import Toast from '../../../design-system/components/Toast/Toast';
import BottomSheet from '../../../design-system/components/BottomSheet/BottomSheet';
import { IconFilter, IconSort, IconResend, IconTrash, IconMore, IconEdit, IconMailWarning, IconMailHistory } from '../../../design-system/icons/outline';
import ContextMenu from '../../../design-system/components/ContextMenu/ContextMenu';
import styles from './OrgDetailV2.module.css';
import TruncatedText from './TruncatedText';

// "-", "—" o vacío = ese nivel no aplica a la fila (un Organization Admin no pertenece a
// ningún centro ni equipo).
function isEmptyValue(v) {
  return v == null || v === '-' || v === '—' || v === '';
}

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
  onDeliveryIssue,
  onViewMailHistory,
  onEditUser,
  canEditUsers = false,
  // Abrir el perfil de un admin activo. Solo las filas activas navegan: una invitación
  // pendiente todavía no tiene persona detrás a la que llevar.
  onOpenProfile,
  // Email history y la incidencia de envío: feature del programador, solo para Kamleon staff.
  canViewEmailHistory = false,
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
  // En 390 la tabla se vuelve lista y las acciones pasan a botones con texto: sin hover
  // no hay tooltip, y un sobre con flecha no dice "reenviar" por sí solo.
  const [isPhone, setIsPhone] = useState(() => window.matchMedia('(max-width: 390px)').matches);

  // Vistas de mobile (390). Por defecto "compact" (decidido con el programador el 17/9):
  // en este tab lo que importa es gestionar las invitaciones, así que solo se ve quién, su
  // estado y las acciones; tablet y desktop tienen lugar para la tabla completa.
  // Easter egg (tres toques seguidos sobre el título, solo en 390) para alternar con la
  // propuesta anterior y recordar cómo era: "list" = cards con valores etiquetados. Se
  // recuerda en el navegador.
  const LAYOUTS = ['compact', 'list'];
  const LAYOUT_LABELS = { compact: 'Mobile view: compact', list: 'Mobile view: cards' };
  // Clave nueva (v2): con la anterior quedaba guardada "list" y no se vería la vista por defecto.
  const LAYOUT_KEY = 'kamleon-invitations-mobile-layout-v2';
  const [mobileLayout, setMobileLayout] = useState(() => {
    try {
      const saved = localStorage.getItem(LAYOUT_KEY);
      return LAYOUTS.includes(saved) ? saved : 'compact';
    } catch { return 'compact'; }
  });
  const [layoutToast, setLayoutToast] = useState(null);
  const titleTaps = useRef({ count: 0, last: 0 });

  function handleTitleTap() {
    if (!isPhone) return;
    const now = Date.now();
    const taps = titleTaps.current;
    taps.count = now - taps.last < 500 ? taps.count + 1 : 1;
    taps.last = now;
    if (taps.count < 3) return;
    taps.count = 0;
    const next = LAYOUTS[(LAYOUTS.indexOf(mobileLayout) + 1) % LAYOUTS.length];
    setMobileLayout(next);
    try { localStorage.setItem(LAYOUT_KEY, next); } catch { /* sin storage: solo esta sesión */ }
    setLayoutToast(LAYOUT_LABELS[next]);
  }

  const listMode = isPhone && mobileLayout === 'list';
  const compactMode = isPhone && mobileLayout === 'compact';
  // Historial del correo: mismo destino que "Delivery issue", pero disponible en todas las
  // filas (para revisar invitaciones sin incidencia).
  const openMailHistory = onViewMailHistory ?? onDeliveryIssue;
  // Fila cuyas acciones están abiertas en el bottom sheet (vista lista de 390).
  const [sheetRow, setSheetRow] = useState(null);

  // Acciones de una fila. Una sola lista para las dos vistas: el menú "⋯" de desktop/tablet
  // y el bottom sheet de mobile — así no pueden desincronizarse.
  //   Pendiente: View email history (solo staff) · Resend invite · Cancel invitation
  //   Activo:    View email history (solo staff) · Edit user (si el rol puede) · Remove permission (si puede)
  function rowActions(row, iconSize) {
    if (!row) return [];
    const history = canViewEmailHistory
      ? [{ label: 'View email history', icon: <IconMailHistory size={iconSize} />, onClick: () => openMailHistory?.(row) }]
      : [];
    if (row.status === 'active') {
      // "Edit user" solo si el rol tiene `users.editData` (lo decide quien usa la tabla vía
      // `canEditUsers`). "Remove permission" quita el rol de admin, no borra la cuenta, y
      // sigue el permiso por fila (`canRemove`); nadie puede quitarse a sí mismo.
      const canRemove = row.canRemove !== false && !row.isSelf;
      return [
        ...history,
        ...(canEditUsers ? [{ label: 'Edit user', icon: <IconEdit size={iconSize} />, onClick: () => onEditUser?.(row) }] : []),
        ...(canRemove ? [{ label: 'Remove permission', icon: <IconTrash size={iconSize} />, variant: 'danger', onClick: () => onRemove?.(row) }] : []),
      ];
    }
    return [
      ...history,
      { label: 'Resend invite', icon: <IconResend size={iconSize} />, onClick: () => onResend?.(row) },
      { label: 'Cancel invitation', icon: <IconTrash size={iconSize} />, variant: 'danger', onClick: () => onCancel?.(row) },
    ];
  }
  // Fila con el menú "⋯" abierto (solo aparece cuando hay incidencia: el icono de
  // incidencia ocupa un lugar y el resto de acciones se agrupan, para no pasar nunca de
  // dos botones de icono por fila).
  const [openRowMenu, setOpenRowMenu] = useState(null);
  const rowMenuRef = useRef(null);

  useEffect(() => {
    if (!openRowMenu) return;
    function handleClick(e) {
      if (rowMenuRef.current && !rowMenuRef.current.contains(e.target)) setOpenRowMenu(null);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openRowMenu]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 390px)');
    const onChange = e => setIsPhone(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

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
    <div className={`${styles.invitationsTab} ${bleed ? styles.invitationsBleed : ''} ${compact ? styles.invitationsCompact : ''} ${responsiveTable ? styles.invitationsResponsive : ''} ${responsiveTable ? (mobileLayout === 'list' ? styles.invitationsMobileList : styles.invitationsMobileCompact) : ''} ${!title && description ? styles.invitationsNoTitle : ''}`}>

      {(title || description) && (
        <div className={styles.orgUsersHeading}>
          {title && <h1 className={styles.pageTitle} onClick={handleTitleTap}>{title}</h1>}
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
                        upColor={sortDir === 'asc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'}
                        downColor={sortDir === 'desc' ? 'var(--color-text-accent)' : 'var(--color-text-disabled)'}
                      />
                    </span>
                  </button>
                </span>
              )}
              <span className={`${styles.teamCol} ${styles.inviteColStatus}`}>Status</span>
              <span className={`${styles.teamCol} ${styles.inviteColActions}`} />
            </div>
            {filtered.map(row => {
              const canOpenProfile = Boolean(onOpenProfile) && row.status === 'active';
              return (
              <div
                key={row.key}
                className={`${styles.teamTableRow} ${openRowMenu === row.key ? styles.menuOpen : ''} ${canOpenProfile ? styles.rowClickable : ''}`}
                role={canOpenProfile ? 'button' : undefined}
                tabIndex={canOpenProfile ? 0 : undefined}
                onClick={canOpenProfile ? () => onOpenProfile(row) : undefined}
                onKeyDown={canOpenProfile ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenProfile(row); } } : undefined}
              >
                <div className={`${styles.teamCol} ${styles.teamColName}`}>
                  {compactMode ? (
                    // Mobile compact: el estado va en la segunda línea, delante del dato
                    // secundario, así es lo primero que se lee debajo de quién es.
                    <div className={styles.memberMeta}>
                      <TruncatedText text={row.name ?? row.email} textClassName={styles.memberName} />
                      <div className={styles.compactSub}>
                        <Tag status={row.status ?? 'pending'} />
                        <span className={styles.compactSep} aria-hidden="true">·</span>
                        <TruncatedText
                          text={row.name ? row.email : `Invited ${row.sentAgo ?? ''}`}
                          textClassName={styles.memberSub}
                        />
                      </div>
                    </div>
                  ) : row.name ? (
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
                {/* Role/Center/Team: nombres propios, así que se cortan a 2 líneas (nunca a
                    una: dos centros pueden empezar igual) y el valor completo se ve en el
                    tooltip. Las filas de esta tabla no navegan a ningún detalle, así que el
                    toque queda libre para abrirlo en touch. */}
                {showType && (
                  <div className={`${styles.teamCol} ${styles.inviteColType}`} data-label={typeLabel}>
                    <TruncatedText text={row.type} textClassName={styles.dateText} lines={2} tapToReveal />
                  </div>
                )}
                {/* data-label/data-empty los usa la vista de 390, donde la tabla se vuelve
                    lista: sin header de columnas hace falta la etiqueta, y las líneas sin
                    valor ("-") no se dibujan. */}
                {showScope && (
                  <div
                    className={`${styles.teamCol} ${styles.inviteColScope}`}
                    data-label={scopeLabel}
                    data-empty={isEmptyValue(row.scope) ? 'true' : undefined}
                  >
                    <TruncatedText text={row.scope ?? '—'} textClassName={styles.dateText} lines={2} tapToReveal />
                  </div>
                )}
                {showTeam && (
                  <div
                    className={`${styles.teamCol} ${styles.inviteColTeam}`}
                    data-label={teamLabel}
                    data-empty={isEmptyValue(row.team) ? 'true' : undefined}
                  >
                    <TruncatedText text={row.team ?? '-'} textClassName={styles.dateText} lines={2} tapToReveal />
                  </div>
                )}
                {showSent && (
                  <div className={`${styles.teamCol} ${styles.inviteColSent}`}>
                    <span className={styles.dateText}>{row.sentAgo}</span>
                  </div>
                )}
                {/* Incidencia del correo: en 390 es una línea etiquetada y subrayada (el
                    icono suelto no se entiende sin tooltip); en desktop/tablet vive como
                    icono en la columna de acciones. */}
                {row.deliveryIssue && canViewEmailHistory && listMode && (
                  <div className={`${styles.teamCol} ${styles.inviteColIssue}`} data-label="Email">
                    <button className={styles.deliveryIssueLink} onClick={() => onDeliveryIssue?.(row)}>
                      Delivery issue
                    </button>
                  </div>
                )}
                <div className={`${styles.teamCol} ${styles.inviteColStatus}`}>
                  <Tag status={row.status ?? 'pending'} />
                </div>
                {/* Los botones de la fila hacen lo suyo y no abren el perfil. */}
                <div className={`${styles.teamCol} ${styles.inviteColActions}`} onClick={e => e.stopPropagation()}>
                  {rowActions(row, 16).length === 0 ? (
                    // Sin ninguna acción permitida (ej. Org Admin en la fila de un Team Admin):
                    // ni "⋯" ni "Manage", que abrirían un menú vacío.
                    !listMode && <span className={styles.actionPlaceholder} aria-hidden="true" />
                  ) : listMode ? (
                    // Mobile: botón al pie de la fila que abre el bottom sheet. El texto anticipa
                    // qué hay adentro: gestionar una invitación (pendiente) o a un admin (activo).
                    <Button
                      variant="subtle"
                      size="s"
                      aria-label={`${row.status === 'active' ? 'Manage admin' : 'Manage invitation'}: ${row.email}`}
                      onClick={() => setSheetRow(row)}
                    >
                      {row.status === 'active' ? 'Manage admin' : 'Manage invitation'}
                    </Button>
                  ) : (
                    // Desktop/tablet: siempre el "⋯" con todas las acciones. Solo con incidencia
                    // se suma un segundo botón, el de la incidencia — nunca más de dos. Sin
                    // incidencia, un hueco invisible mantiene el "⋯" en la misma columna.
                    <>
                      {row.deliveryIssue && canViewEmailHistory && row.status !== 'active' ? (
                        <IconButton
                          aria-label="Email delivery issue — open email history"
                          tooltip="Delivery issue"
                          variant="critical"
                          onClick={() => onDeliveryIssue?.(row)}
                        >
                          <IconMailWarning size={16} />
                        </IconButton>
                      ) : (
                        <span className={styles.actionPlaceholder} aria-hidden="true" />
                      )}
                      <div className={styles.createMenuAnchor} ref={openRowMenu === row.key ? rowMenuRef : undefined}>
                        <IconButton
                          aria-label={`Actions for ${row.email}`}
                          tooltip="More"
                          onClick={() => setOpenRowMenu(prev => (prev === row.key ? null : row.key))}
                        >
                          <IconMore size={16} />
                        </IconButton>
                        {openRowMenu === row.key && (
                          <div className={styles.cardCreateMenu}>
                            <ContextMenu
                              items={rowActions(row, 16).map(item => ({
                                ...item,
                                onClick: () => { setOpenRowMenu(null); item.onClick(); },
                              }))}
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              );
            })}
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

      <BottomSheet
        open={sheetRow != null}
        label={sheetRow ? `Actions for ${sheetRow.email}` : undefined}
        items={rowActions(sheetRow, 24)}
        onClose={() => setSheetRow(null)}
      />

      {layoutToast && (
        <Toast message={layoutToast} mode="success" onClose={() => setLayoutToast(null)} />
      )}

    </div>
  );
}
