import { useState, useRef, useEffect } from 'react';
import Tag from '../../../design-system/components/Tag/Tag';
import TabBar from '../../../design-system/components/TabBar/TabBar';
import SearchBar from '../../../design-system/components/SearchBar/SearchBar';
import ToolbarButton from '../../../design-system/components/ToolbarButton/ToolbarButton';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import ContextMenu from '../../../design-system/components/ContextMenu/ContextMenu';
import Toast from '../../../design-system/components/Toast/Toast';
import { IconPlus, IconFilter, IconEdit, IconTrash, IconPower, IconMore, IconInfoCircle, IconEye, IconEyeClosed, IconSettings, IconMenu, IconResend } from '../../../design-system/icons/outline';
import { getMembersForTeam } from '../../StaffOrganizaciones/mockData';
import NewUserDrawer from '../../StaffOrganizaciones/screens/NewUserDrawer';
import EditUserDrawer from '../../StaffOrganizaciones/screens/EditUserDrawer';
import EditTeamDrawer from '../../StaffOrganizaciones/screens/EditTeamDrawer';
import TruncatedText from './TruncatedText';
import shell from './OrgDetailV2.module.css';
import tstyles from '../../StaffOrganizaciones/screens/TeamDetail.module.css';
import dstyles from '../../StaffOrganizaciones/screens/DeleteOrgModal.module.css';

function RemoveUserModal({ user, team, onClose, onConfirm }) {
  return (
    <div className={dstyles.overlay} onMouseDown={onClose}>
      <div className={dstyles.modal} onMouseDown={e => e.stopPropagation()}>
        <div className={dstyles.content}>
          <h2 className={dstyles.title}>Remove from team</h2>
          <p className={dstyles.body}>
            Are you sure you want to remove <strong className={dstyles.orgName}>{user.name}</strong> from {team.name}?
            They'll keep their Kamleon account — they just won't be part of this team anymore.
          </p>
        </div>
        <div className={dstyles.actions}>
          <button className={dstyles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={dstyles.deleteBtn} onClick={() => { onConfirm?.(); onClose(); }}>Remove</button>
        </div>
      </div>
    </div>
  );
}

const BULK_PIN_COPY = {
  on:         { title: 'Turn PIN on for all users?',  confirmLabel: 'Turn on',   danger: false },
  off:        { title: 'Turn PIN off for all users?', confirmLabel: 'Turn off',  danger: false },
};

function ConfirmBulkPinModal({ action, team, count, onClose, onConfirm }) {
  const copy = BULK_PIN_COPY[action];
  const body = action === 'on'
    ? `This will turn PIN on for all ${count} users in ${team.name}.`
    : `This will turn PIN off for all ${count} users in ${team.name}. They won't be able to log in with a PIN until it's turned back on.`;
  return (
    <div className={dstyles.overlay} onMouseDown={onClose}>
      <div className={dstyles.modal} onMouseDown={e => e.stopPropagation()}>
        <div className={dstyles.content}>
          <h2 className={dstyles.title}>{copy.title}</h2>
          <p className={dstyles.body}>{body}</p>
        </div>
        <div className={dstyles.actions}>
          <button className={dstyles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={copy.danger ? dstyles.deleteBtn : dstyles.confirmBtn} onClick={() => { onConfirm?.(); onClose(); }}>{copy.confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

const TEAM_TABS = [{ id: 'users', label: 'Users' }];

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Users list (dentro del panel de un equipo) ────────────

function UserProfileDetail({ user, team, onBack, onEdit }) {
  return (
    <div className={tstyles.userProfileBody}>

      <button className={shell.backBtn} onClick={onBack}>
        <span className={shell.backIcon}><ArrowLeftIcon /></span>
        <span className={shell.backLabel}>Back to {team.name}</span>
      </button>

      <div className={tstyles.userProfileHeader}>
        <h2 className={tstyles.userProfileTitle}>User Profile</h2>
        <IconButton aria-label="Edit user" tooltip="Edit user" tooltipPosition="left" onClick={onEdit}>
          <IconEdit size={16} />
        </IconButton>
      </div>

      <div className={tstyles.userProfileTop}>
        <div className={tstyles.userProfileAvatar}>{user.name.charAt(0)}</div>
        <div>
          <p className={tstyles.userProfileName}>{user.name}</p>
          <div className={tstyles.userProfileMetaRow}>
            <span className={tstyles.userProfileMetaDot} style={{ background: user.status === 'active' ? 'var(--color-turquoise-51)' : 'var(--color-status-inactive)' }} />
            <span>{user.status === 'active' ? 'Active' : 'Inactive'}</span>
            {user.jerseyNumber && (<><span>|</span><span>#{user.jerseyNumber}</span></>)}
            {user.dateAdded && (<><span>|</span><span>Joined: {user.dateAdded}</span></>)}
          </div>
        </div>
      </div>

      <div>
        <p className={tstyles.userSectionLabel}>Account</p>
        <div className={tstyles.userAccountGrid}>
          <div className={tstyles.userAccountField}>
            <span className={tstyles.userAccountFieldLabel}>Email</span>
            <span className={tstyles.userAccountFieldValue}>{user.email ?? '—'}</span>
          </div>
          <div className={tstyles.userAccountField}>
            <span className={tstyles.userAccountFieldLabel}>Phone number</span>
            <span className={tstyles.userAccountFieldValue}>{user.phone ?? '—'}</span>
          </div>
          <div className={tstyles.userAccountField}>
            <span className={tstyles.userAccountFieldLabel}>Date of birth</span>
            <span className={tstyles.userAccountFieldValue}>{user.birthday ?? '—'}</span>
          </div>
          <div className={tstyles.userAccountField}>
            <span className={tstyles.userAccountFieldLabel}>Gender</span>
            <span className={tstyles.userAccountFieldValue}>{user.gender ?? '—'}</span>
          </div>
          <div className={tstyles.userAccountField}>
            <span className={tstyles.userAccountFieldLabel}>Height</span>
            <span className={tstyles.userAccountFieldValue}>{user.height ?? '—'}</span>
          </div>
          <div className={tstyles.userAccountField}>
            <span className={tstyles.userAccountFieldLabel}>Weight</span>
            <span className={tstyles.userAccountFieldValue}>{user.weight ?? '—'}</span>
          </div>
        </div>
      </div>

      <div className={tstyles.userProfileDivider} />

      <div style={{ width: '100%' }}>
        <div className={tstyles.userProfileHeader}>
          <h3 className={tstyles.userProfileTitle}>Permissions</h3>
          <IconButton aria-label="Edit permissions" tooltip="Edit permissions" tooltipPosition="left" onClick={onEdit}>
            <IconEdit size={16} />
          </IconButton>
        </div>
        <div className={tstyles.userPermSimpleGrid}>
          <div className={tstyles.userPermSimpleField}>
            <span className={tstyles.userAccountFieldLabel}>Show this user on the screen</span>
            <span className={tstyles.userPermPill}>Screen: {(user.visibleOnScreen ?? true) ? 'On' : 'Off'}</span>
          </div>
          <div className={tstyles.userPermSimpleField}>
            <span className={tstyles.userAccountFieldLabel}>Allow this user to log in with PIN</span>
            <span className={tstyles.userPermPill}>PIN: {user.pin ? 'On' : 'Off'}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

function TeamUsersList({ team, assignedTeams, onSelectUser, pendingInvites, setPendingInvites, currentUserEmail }) {
  const [allUsers, setAllUsers] = useState(() => getMembersForTeam(team));
  const [roleFilter, setRoleFilter] = useState(new Set());
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch]         = useState('');
  const [editUserTarget, setEditUserTarget] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [actionToast, setActionToast] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState(null);
  const filterRef = useRef(null);
  const bulkRef   = useRef(null);
  const menuRefs  = useRef({});

  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

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
    if (!bulkOpen) return;
    function handleClick(e) {
      if (bulkRef.current && !bulkRef.current.contains(e.target)) setBulkOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [bulkOpen]);

  function toggleRole(v) {
    setRoleFilter(prev => {
      const next = new Set(prev);
      next.has(v) ? next.delete(v) : next.add(v);
      return next;
    });
  }

  function togglePin(user) {
    setAllUsers(prev => prev.map(u => (u.id === user.id && u.role === user.role) ? { ...u, pin: !u.pin } : u));
    setActionToast(`PIN turned ${user.pin ? 'off' : 'on'} for ${user.name}`);
  }

  function toggleVisibleOnScreen(user) {
    const wasVisible = user.visibleOnScreen ?? true;
    setAllUsers(prev => prev.map(u => (u.id === user.id && u.role === user.role) ? { ...u, visibleOnScreen: !wasVisible } : u));
    setActionToast(`${user.name} ${wasVisible ? 'hidden from' : 'shown on'} screen`);
  }

  function bulkSetPin(value) {
    setAllUsers(prev => prev.map(u => ({ ...u, pin: value })));
    setActionToast(`PIN turned ${value ? 'on' : 'off'} for all users`);
  }

  function handleRemove(user) {
    setAllUsers(prev => prev.filter(u => !(u.id === user.id && u.role === user.role)));
    setActionToast(`${user.name} removed from ${team.name}`);
  }

  function handleResendInvite(invite) {
    setActionToast(`Invitation resent to ${invite.email}`);
  }

  function handleCancelInvite(invite) {
    setActionToast(`Invitation to ${invite.email} cancelled`);
    setPendingInvites(prev => prev.filter(i => i.email !== invite.email));
  }

  const users = allUsers.filter(u => {
    if (roleFilter.size > 0 && !roleFilter.has(u.role)) return false;
    if (search.trim() && !u.name.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  // Invitaciones pendientes — se muestran como filas "Pending" en esta misma tabla
  // (no hay tab de Invitations aparte). Sin rol/PIN/Screen todavía, así que si hay un
  // filtro de Role activo no tiene sentido mostrarlas (no pueden cumplirlo).
  const pendingRows = roleFilter.size > 0 ? [] : pendingInvites
    .map((invite, i) => ({ ...invite, key: invite.key ?? `pending-${i}` }))
    .filter(invite => !search.trim() || invite.email.toLowerCase().includes(search.trim().toLowerCase()));

  if (allUsers.length === 0 && pendingInvites.length === 0) {
    return (
      <div className={tstyles.emptyState}>
        <div className={tstyles.emptyInfo}>
          <div className={tstyles.emptyCircle} />
          <div className={tstyles.emptyText}>
            <p className={tstyles.emptyTitle}>No users yet...</p>
            <p className={tstyles.emptySubtitle}>Users for this team will be displayed here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <SearchBar
          placeholder="Search by name..."
          className={tstyles.searchBar}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
        <div className={tstyles.filterWrap} ref={filterRef}>
          <ToolbarButton
            icon={<IconFilter size={16} />}
            selected={roleFilter.size > 0}
            onClick={() => setFilterOpen(prev => !prev)}
          >
            Filters
            {roleFilter.size > 0 && <span className={tstyles.filterBadge}>{roleFilter.size}</span>}
          </ToolbarButton>
          {filterOpen && (
            <div className={tstyles.filterDropdown}>
              <div className={tstyles.filterSection}>
                <p className={tstyles.filterSectionLabel}>Role</p>
                {[{ v: 'professional', label: 'Team admin' }, { v: 'user', label: 'User' }].map(({ v, label }) => (
                  <label key={v} className={`${tstyles.filterOption} ${roleFilter.has(v) ? tstyles.filterOptionChecked : ''}`}>
                    <input
                      type="checkbox"
                      className={tstyles.nativeCheck}
                      checked={roleFilter.has(v)}
                      onChange={() => toggleRole(v)}
                    />
                    <span className={tstyles.checkBox}>
                      <svg className={tstyles.checkMark} viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {label}
                  </label>
                ))}
              </div>
              {roleFilter.size > 0 && (
                <button className={tstyles.clearFilters} onClick={() => setRoleFilter(new Set())}>
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
        <div className={`${tstyles.filterWrap} ${tstyles.bulkActionsWrap}`} ref={bulkRef}>
          <ToolbarButton icon={<IconMenu size={16} />} onClick={() => setBulkOpen(prev => !prev)}>
            <span className={tstyles.bulkActionsLabel}>Bulk actions</span>
          </ToolbarButton>
          {bulkOpen && (
            <div className={tstyles.bulkActionsMenu}>
              <ContextMenu
                items={[
                  { label: 'Turn PIN on for all users', onClick: () => { setBulkOpen(false); setBulkConfirm('on'); } },
                  { label: 'Turn PIN off for all users', onClick: () => { setBulkOpen(false); setBulkConfirm('off'); } },
                ]}
              />
            </div>
          )}
        </div>
      </div>

      <div className={tstyles.tableWrap} style={{ padding: 0 }}>
        <div className={tstyles.tableHeader}>
          <div className={`${tstyles.colHead} ${tstyles.colName}`}>Name</div>
          {/* Sin columna Role — el subtítulo del nombre ya muestra Team admin/User */}
          {/* Sin columna Date Added — no le importa a Team Admin; PIN y Screen sí son cosas que controla */}
          <div className={`${tstyles.colHead} ${tstyles.colPin}`}>
            <span className={tstyles.colHeadLabel}>
              PIN
              <span className={tstyles.infoIconWrap} data-tooltip="Allow members to log in with a PIN.">
                <IconInfoCircle size={14} />
              </span>
            </span>
          </div>
          <div className={`${tstyles.colHead} ${tstyles.colScreen}`}>
            <span className={tstyles.colHeadLabel}>
              Screen
              <span className={tstyles.infoIconWrap} data-tooltip="Shows this member on the device's roster screen.">
                <IconInfoCircle size={14} />
              </span>
            </span>
          </div>
          <div className={`${tstyles.colHead} ${tstyles.colStatus}`}>
            <span className={tstyles.colHeadLabel}>
              Status
              <span className={tstyles.infoIconWrap} data-tooltip="Whether they've joined this team or the invite is still pending.">
                <IconInfoCircle size={14} />
              </span>
            </span>
          </div>
          <div className={`${tstyles.colHead} ${tstyles.colActions}`} />
        </div>

        {pendingRows.map(invite => (
          <div key={invite.key} className={`${tstyles.tableRow} ${(users.length > 0 || pendingRows.indexOf(invite) < pendingRows.length - 1) ? tstyles.rowBorder : ''}`}>
            <div className={`${tstyles.userNameCell} ${tstyles.colName}`}>
              <div className={tstyles.userAvatar}>{invite.email.charAt(0).toUpperCase()}</div>
              <div className={tstyles.userNameInfo}>
                <TruncatedText text={invite.email} textClassName={tstyles.userName} />
                <span className={tstyles.userSubtitle}>Invited {invite.sentAgo ?? ''}</span>
              </div>
            </div>
            <div className={`${tstyles.pinCell} ${tstyles.colPin}`}>
              <span className={tstyles.toggleText}>—</span>
            </div>
            <div className={`${tstyles.screenCell} ${tstyles.colScreen}`}>
              <span className={tstyles.toggleText}>—</span>
            </div>
            <div className={`${tstyles.statusCell} ${tstyles.colStatus}`}>
              <Tag status="pending" />
            </div>
            <div className={`${tstyles.actionsCell} ${tstyles.colActions}`}>
              <IconButton aria-label="Resend invitation" tooltip="Resend" tooltipPosition="top" onClick={() => handleResendInvite(invite)}>
                <IconResend size={16} />
              </IconButton>
              <IconButton aria-label="Cancel invitation" tooltip="Cancel" tooltipPosition="top" onClick={() => handleCancelInvite(invite)}>
                <IconTrash size={14} />
              </IconButton>
            </div>
          </div>
        ))}

        {users.map((user, i) => {
          const isSelf = currentUserEmail != null && user.email === currentUserEmail;
          return (
          <div
            key={`${user.role}-${user.id}`}
            className={`${tstyles.tableRow} ${tstyles.tableRowClickable} ${i < users.length - 1 ? tstyles.rowBorder : ''} ${openMenuId === `${user.role}-${user.id}` ? tstyles.menuOpen : ''}`}
            onClick={() => onSelectUser(user)}
          >
            <div className={`${tstyles.userNameCell} ${tstyles.colName}`}>
              <div className={tstyles.userAvatar}>{user.name.charAt(0)}</div>
              <div className={tstyles.userNameInfo}>
                <TruncatedText text={user.name} textClassName={tstyles.userName} />
                <span className={tstyles.userSubtitle}>
                  {user.jerseyNumber ? `#${user.jerseyNumber} | ${user.role === 'professional' ? 'Team admin' : 'User'}` : (user.role === 'professional' ? 'Team admin' : 'User')}
                </span>
              </div>
            </div>
            <div className={`${tstyles.pinCell} ${tstyles.colPin}`}>
              <span className={`${tstyles.toggleText} ${user.pin ? tstyles.toggleTextOn : ''}`}>
                {user.pin ? 'On' : 'Off'}
              </span>
            </div>
            <div className={`${tstyles.screenCell} ${tstyles.colScreen}`}>
              <span className={`${tstyles.toggleText} ${(user.visibleOnScreen ?? true) ? tstyles.toggleTextOn : ''}`}>
                {(user.visibleOnScreen ?? true) ? 'On' : 'Off'}
              </span>
            </div>
            <div className={`${tstyles.statusCell} ${tstyles.colStatus}`}>
              <Tag status="active" />
            </div>
            <div
              className={`${tstyles.actionsCell} ${tstyles.colActions}`}
              ref={el => { menuRefs.current[`${user.role}-${user.id}`] = el; }}
              onClick={e => e.stopPropagation()}
            >
              <span className={shell.actionPlaceholder} aria-hidden="true" />
              <div className={shell.teamRowMenuAnchor}>
                <IconButton
                  aria-label="Más opciones"
                  tooltip="More"
                  tooltipPosition="top"
                  onClick={() => setOpenMenuId(openMenuId === `${user.role}-${user.id}` ? null : `${user.role}-${user.id}`)}
                >
                  <IconMore size={16} />
                </IconButton>
                {openMenuId === `${user.role}-${user.id}` && (
                  <div className={shell.teamRowMenu}>
                    <ContextMenu
                      items={[
                        { label: 'Edit User', icon: <IconEdit size={16} />, onClick: () => { setOpenMenuId(null); setEditUserTarget(user); } },
                        { label: user.pin ? 'Turn off PIN' : 'Turn on PIN', icon: <IconPower size={16} />, onClick: () => { setOpenMenuId(null); togglePin(user); } },
                        { label: (user.visibleOnScreen ?? true) ? 'Hide from screen' : 'Show on screen', icon: (user.visibleOnScreen ?? true) ? <IconEyeClosed size={16} /> : <IconEye size={16} />, onClick: () => { setOpenMenuId(null); toggleVisibleOnScreen(user); } },
                        {
                          label: 'Remove from team', icon: <IconTrash size={16} />, variant: 'danger', disabled: isSelf,
                          tooltip: isSelf ? "You can't remove yourself" : undefined,
                          onClick: () => { setOpenMenuId(null); setRemoveTarget(user); },
                        },
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

      {editUserTarget && (
        // TeamUsersList solo se usa dentro del flujo de Team Admin — role fijo, no hace falta pasarlo desde arriba.
        <EditUserDrawer
          user={editUserTarget}
          team={team}
          onClose={() => setEditUserTarget(null)}
          role="teamAdmin"
          onRemove={() => { setEditUserTarget(null); setRemoveTarget(editUserTarget); }}
        />
      )}

      {removeTarget && (
        <RemoveUserModal
          user={removeTarget}
          team={team}
          onClose={() => setRemoveTarget(null)}
          onConfirm={() => handleRemove(removeTarget)}
        />
      )}

      {bulkConfirm && (
        <ConfirmBulkPinModal
          action={bulkConfirm}
          team={team}
          count={allUsers.length}
          onClose={() => setBulkConfirm(null)}
          onConfirm={() => bulkSetPin(bulkConfirm === 'on')}
        />
      )}

      {actionToast && (
        <Toast message={actionToast} mode="success" onClose={() => setActionToast(null)} />
      )}
    </>
  );
}

// ─── Component ───────────────────────────────────────────
// Home de Team Admin: header de la org (solo lectura, sin back/gear/trash — no tiene
// acceso a nivel de org) + master-detail de sus equipos asignados (puede tener más de
// uno, incluso en distintos centros). Solo un tab, "Users" — la sección de administradores
// de equipo va en otro lado (pendiente, ver docs/design-polish-backlog.md).

export default function TeamAdminHome({ org, assignedTeams, isMobile = false, currentUserEmail }) {
  const [selectedId, setSelectedId] = useState(assignedTeams[0]?.team.id ?? null);
  const [teamSearch, setTeamSearch] = useState('');
  const [newUserContext, setNewUserContext] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileEditTarget, setProfileEditTarget] = useState(null);
  const [profileRemoveTarget, setProfileRemoveTarget] = useState(null);
  const [profileToast, setProfileToast] = useState(null);
  const [teamPatches, setTeamPatches] = useState({});
  const [editTeamTarget, setEditTeamTarget] = useState(null);
  const [teamSaveToast, setTeamSaveToast] = useState(false);
  const [teamInviteOverrides, setTeamInviteOverrides] = useState({});
  const [teamTab, setTeamTab] = useState('users');

  function selectTeam(id) {
    setSelectedId(id);
    setSelectedUser(null);
    setTeamTab('users');
  }

  function handleSaveTeam(teamId, patch) {
    setTeamPatches(prev => ({ ...prev, [teamId]: { ...(prev[teamId] ?? {}), ...patch } }));
    setTeamSaveToast(true);
  }

  function getTeamPendingInvites(team) {
    return teamInviteOverrides[team.id] ?? team.pendingInvites ?? [];
  }

  function setTeamPendingInvites(team, updater) {
    setTeamInviteOverrides(prev => {
      const current = prev[team.id] ?? team.pendingInvites ?? [];
      const next = typeof updater === 'function' ? updater(current) : updater;
      return { ...prev, [team.id]: next };
    });
  }

  const patchedTeams = assignedTeams.map(entry => ({
    ...entry,
    team: { ...entry.team, ...(teamPatches[entry.team.id] ?? {}) },
  }));

  const filteredTeams = teamSearch.trim()
    ? patchedTeams.filter(({ team }) => team.name.toLowerCase().includes(teamSearch.trim().toLowerCase()))
    : patchedTeams;

  const selectedEntry = patchedTeams.find(({ team }) => team.id === selectedId) ?? null;
  const teamTabs = selectedEntry
    ? [{ ...TEAM_TABS[0], hasDot: getTeamPendingInvites(selectedEntry.team).length > 0 }]
    : TEAM_TABS;

  return (
    <div className={shell.container}>

      {/* ── Header: chip de la org, solo lectura ── */}
      <div className={shell.headerCard}>
        <div className={shell.headerInner}>
          <div className={shell.orgLeft}>
            <div className={shell.orgAvatar}>{org.name.charAt(0)}</div>
            <div className={shell.orgMeta}>
              <h1 className={shell.orgName}>{org.name}</h1>
              <div className={shell.orgSubtitle}>
                {/* El status de la org no le sirve a Team Admin (no lo controla ningún rol
                    cliente) — más útil confirmarle su propio alcance dentro de la org.
                    Sin clase propia: hereda tamaño/color de .orgSubtitle (14px), igual que
                    el badge "Active" que reemplazó. */}
                <span>Managing {assignedTeams.length} {assignedTeams.length === 1 ? 'team' : 'teams'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Master-detail: equipos asignados ── */}
      <div className={shell.contentCard}>
      <div className={shell.masterDetail}>

        <div className={`${shell.listPanel} ${isMobile && detailVisible ? shell.listPanelHidden : ''}`} data-tour-id="team-list">
          <div className={shell.listPanelTop}>
            <div className={shell.listPanelHeader}>
              <span className={shell.listPanelLabel}>Teams</span>
              {/* Sin botón "+": teams.create es exclusivo de Center Admin */}
            </div>
            {assignedTeams.length > 0 && (
              <SearchBar
                placeholder="Search..."
                value={teamSearch}
                onChange={e => setTeamSearch(e.target.value)}
                onClear={() => setTeamSearch('')}
              />
            )}
          </div>
          <div className={shell.listItems}>
            {filteredTeams.length === 0 ? (
              <div className={shell.listEmpty}>
                <span className={shell.listEmptyText}>No teams yet</span>
              </div>
            ) : (
              filteredTeams.map(({ team, center }) => (
                <button
                  key={team.id}
                  className={`${shell.listItem} ${selectedId === team.id ? shell.listItemSelected : ''}`}
                  onClick={() => { selectTeam(team.id); if (isMobile) setDetailVisible(true); }}
                >
                  <div className={shell.listItemAvatar}>{team.name.charAt(0)}</div>
                  <div className={shell.listItemMeta}>
                    <span className={shell.listItemName}>{team.name}</span>
                    {/* Centro en vez de Active/Inactive — más útil acá; el status del equipo
                        sigue visible en el detalle (a la derecha), no se tocó ese. */}
                    <span className={shell.listItemStatus}>{center?.name}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className={`${shell.detailPanel} ${!isMobile || detailVisible ? shell.detailPanelVisible : ''}`}>
          {isMobile && (
            <button className={shell.mobilePanelBack} onClick={() => setDetailVisible(false)}>
              <span className={shell.mobilePanelBackIcon}><ArrowLeftIcon /></span>
              <span>Teams</span>
            </button>
          )}
          {selectedEntry ? (
            selectedUser ? (
              <div className={shell.centerCard}>
                <UserProfileDetail
                  user={selectedUser}
                  team={selectedEntry.team}
                  assignedTeams={patchedTeams}
                  onBack={() => setSelectedUser(null)}
                  onEdit={() => setProfileEditTarget(selectedUser)}
                />
                {profileEditTarget && (
                  <EditUserDrawer
                    user={profileEditTarget}
                    team={selectedEntry.team}
                    onClose={() => setProfileEditTarget(null)}
                    role="teamAdmin"
                    onRemove={() => { setProfileEditTarget(null); setProfileRemoveTarget(profileEditTarget); }}
                  />
                )}
                {profileRemoveTarget && (
                  <RemoveUserModal
                    user={profileRemoveTarget}
                    team={selectedEntry.team}
                    onClose={() => setProfileRemoveTarget(null)}
                    onConfirm={() => {
                      setProfileToast(`${profileRemoveTarget.name} removed from ${selectedEntry.team.name}`);
                      setSelectedUser(null);
                    }}
                  />
                )}
                {profileToast && (
                  <Toast message={profileToast} mode="success" onClose={() => setProfileToast(null)} />
                )}
              </div>
            ) : (
              <div className={shell.centerCard}>
                <div className={shell.innerHeader}>
                  <div className={shell.cardHeader}>
                    <div className={shell.cardHeaderLeft}>
                      <div className={shell.cardAvatar}>{selectedEntry.team.name.charAt(0)}</div>
                      <div className={shell.cardTitleGroup}>
                        <h2 className={shell.cardTitle}>{selectedEntry.team.name}</h2>
                        <div className={shell.cardSubtitle}>
                          <span>{selectedEntry.center.name}</span>
                          <span className={shell.separator}>·</span>
                          <span>
                            {(selectedEntry.team.users?.length ?? 0) + (selectedEntry.team.professionalIds?.length ?? 0)} users
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={shell.cardActions}>
                      <IconButton
                        aria-label="New User"
                        tooltip="New User"
                        onClick={() => setNewUserContext({ center: selectedEntry.center, team: selectedEntry.team })}
                        data-tour-id="team-new-user"
                      >
                        <IconPlus size={16} />
                      </IconButton>
                      <IconButton
                        aria-label="Team settings"
                        tooltip="Settings"
                        onClick={() => setEditTeamTarget({ team: selectedEntry.team, center: selectedEntry.center })}
                      >
                        <IconSettings size={16} />
                      </IconButton>
                    </div>
                  </div>
                </div>

                <div className={shell.innerTabBarWrap}>
                  <div className={shell.innerTabBarInner}>
                    <TabBar tabs={teamTabs} activeTab={teamTab} onChange={setTeamTab} size="s" />
                  </div>
                </div>

                <div className={shell.innerTabContent}>
                  {teamTab === 'users' && (
                    <TeamUsersList
                      key={selectedEntry.team.id}
                      team={selectedEntry.team}
                      assignedTeams={patchedTeams}
                      onSelectUser={setSelectedUser}
                      pendingInvites={getTeamPendingInvites(selectedEntry.team)}
                      setPendingInvites={(updater) => setTeamPendingInvites(selectedEntry.team, updater)}
                      currentUserEmail={currentUserEmail}
                    />
                  )}
                </div>
              </div>
            )
          ) : (
            <div className={shell.detailEmpty}>
              <span className={shell.detailEmptyText}>Select a team to view its details</span>
            </div>
          )}
        </div>

      </div>
      </div>

      {newUserContext && (
        <NewUserDrawer
          center={newUserContext.center}
          team={newUserContext.team}
          teams={newUserContext.center?.teams ?? []}
          onClose={() => setNewUserContext(null)}
        />
      )}

      {editTeamTarget && (
        <EditTeamDrawer
          team={editTeamTarget.team}
          center={editTeamTarget.center}
          onClose={() => setEditTeamTarget(null)}
          onSave={(patch) => handleSaveTeam(editTeamTarget.team.id, patch)}
          role="teamAdmin"
        />
      )}

      {teamSaveToast && (
        <Toast message="Team updated" mode="success" onClose={() => setTeamSaveToast(false)} />
      )}

    </div>
  );
}
