import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Sidebar.module.css';
import SidebarItem from '../SidebarItem/SidebarItem';
import LogoKamleon from '../../icons/LogoKamleon';
import { IconCollapse, IconExpand, IconChevronDown, IconRefresh, IconCheckCircle } from '../../icons/outline';

const USER_TOOLTIP_DELAY = 350; // ms — deliberado (patrón Slack), no aparece con el hover inmediato
const SUBMENU_CLOSE_DELAY = 150; // ms — margen para que el mouse cruce en diagonal hacia el submenú

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'ca', label: 'Catalan' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'id', label: 'Indonesian' },
  { code: 'it', label: 'Italian' },
];

function getDefaultLanguageCode() {
  const nav = (typeof navigator !== 'undefined' && navigator.language) || 'en';
  const short = nav.slice(0, 2).toLowerCase();
  return LANGUAGES.some(l => l.code === short) ? short : 'en';
}

// Submenú flotante que se abre con hover desde una fila del menú de cuenta (Switch role, Language).
// Se centra respecto a la fila que lo abre y se clampea dentro del viewport (16px de margen) — mismo
// patrón que SpotlightCard en OnboardingTour.jsx — así nunca queda cortado por el borde de la ventana.
function useHoverSubmenu() {
  const rowRef = useRef(null);
  const panelRef = useRef(null);
  const closeTimerRef = useRef(null);
  const [anchor, setAnchor] = useState(null);
  const [pos, setPos] = useState(null);

  function open() {
    clearTimeout(closeTimerRef.current);
    const rect = rowRef.current.getBoundingClientRect();
    setAnchor({ top: rect.top, bottom: rect.bottom, left: rect.right + 8 });
  }

  function scheduleClose() {
    closeTimerRef.current = setTimeout(() => { setAnchor(null); setPos(null); }, SUBMENU_CLOSE_DELAY);
  }

  function cancelClose() {
    clearTimeout(closeTimerRef.current);
  }

  function close() {
    clearTimeout(closeTimerRef.current);
    setAnchor(null);
    setPos(null);
  }

  useLayoutEffect(() => {
    if (!anchor) { setPos(null); return; }
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const vh = window.innerHeight;
    const rowCenter = (anchor.top + anchor.bottom) / 2;
    let top = rowCenter - rect.height / 2;
    top = Math.max(16, Math.min(top, vh - rect.height - 16));
    setPos({ top, left: anchor.left });
  }, [anchor]);

  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  return { rowRef, panelRef, anchor, pos, open, scheduleClose, cancelClose, close };
}

/**
 * Sidebar
 *
 * Shell de navegación lateral. Acepta secciones con ítems configurables.
 *
 * @param {boolean}        collapsed   - Si el sidebar está colapsado (desktop)
 * @param {function}       onToggle    - Callback para colapsar/expandir o cerrar drawer
 * @param {Array}          sections    - Grupos de navegación
 * @param {boolean|undefined} drawerOpen - undefined = desktop; true/false = modo drawer (tablet)
 *   sections: [{ id, label, items: [{ id, label, icon, active, onClick }] }]
 * @param {Object}         user        - { initials, name, surname, role, scope, pendingInvites } — footer del
 *                                        sidebar. scope = a qué está limitado (org/centro/equipo), opcional.
 * @param {function}       onPendingInvitesClick - Click en "Pending invites" (y en el badge del
 *                                         carril colapsado): abre el drawer de notificaciones.
 * @param {Object}         personalItem - { id, label, icon, active, onClick } — ítem "My data", se muestra
 *                                         pegado al footer (arriba de pending invites / tarjeta de usuario).
 * @param {Array}          roleOptions - [{ key, label, scope, initials }] — opciones del submenú "Switch role".
 * @param {string}         currentRoleKey - key del rol activo (para el check ✓ en roleOptions).
 * @param {function}       onRoleChange   - (key) => void
 * @param {function}       onAccountDetails - callback del ítem "Account details"
 */
export default function Sidebar({
  collapsed = false, onToggle, sections = [], drawerOpen, user, personalItem, onPendingInvitesClick,
  roleOptions = [], currentRoleKey, onRoleChange, onAccountDetails,
}) {
  const inDrawerMode = drawerOpen !== undefined;
  const showExpanded = inDrawerMode || !collapsed;

  const userCardRef = useRef(null);
  const hoverTimerRef = useRef(null);
  const [userTooltipPos, setUserTooltipPos] = useState(null);

  function handleUserCardEnter() {
    hoverTimerRef.current = setTimeout(() => {
      const rect = userCardRef.current.getBoundingClientRect();
      // Colapsado: el tooltip sale por fuera del sidebar, a la derecha y centrado, igual que
      // el del resto de ítems del carril. Expandido sigue saliendo encima de la tarjeta.
      if (!showExpanded) {
        const sidebar = userCardRef.current.closest('aside');
        const sidebarRight = sidebar ? sidebar.getBoundingClientRect().right : rect.right;
        setUserTooltipPos({
          top: rect.top + rect.height / 2,
          left: sidebarRight + 8,
          placement: 'right',
        });
        return;
      }
      setUserTooltipPos({ top: rect.top, left: rect.left + rect.width / 2, width: rect.width });
    }, USER_TOOLTIP_DELAY);
  }

  function handleUserCardLeave() {
    clearTimeout(hoverTimerRef.current);
    setUserTooltipPos(null);
  }

  useEffect(() => () => clearTimeout(hoverTimerRef.current), []);

  // ─── Menú de cuenta (click en la tarjeta de usuario) ──────────
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState(null);
  const menuPanelRef = useRef(null);
  const roleSubmenu = useHoverSubmenu();
  const languageSubmenu = useHoverSubmenu();
  const [languageCode, setLanguageCode] = useState(getDefaultLanguageCode);

  function handleUserCardClick() {
    clearTimeout(hoverTimerRef.current);
    setUserTooltipPos(null);
    if (menuOpen) { setMenuOpen(false); roleSubmenu.close(); languageSubmenu.close(); return; }
    const rect = userCardRef.current.getBoundingClientRect();
    setMenuPos({ bottom: window.innerHeight - rect.bottom, left: rect.left, width: rect.width });
    setMenuOpen(true);
  }

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (menuPanelRef.current?.contains(e.target)) return;
      if (userCardRef.current?.contains(e.target)) return;
      if (roleSubmenu.panelRef.current?.contains(e.target)) return;
      if (languageSubmenu.panelRef.current?.contains(e.target)) return;
      setMenuOpen(false);
      roleSubmenu.close();
      languageSubmenu.close();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const classNames = [
    styles.sidebar,
    showExpanded ? styles.expanded : styles.collapsed,
    inDrawerMode && drawerOpen ? styles.drawerVisible : '',
  ].filter(Boolean).join(' ');

  return (
    <aside className={classNames}>

      {/* Header */}
      <div className={styles.header}>
        {/* Igual que los labels: el logo se encoge y se desvanece en vez de desmontarse. */}
        <span className={`${styles.logoWrap} ${showExpanded ? '' : styles.logoWrapHidden}`}>
          <LogoKamleon />
        </span>
        <button
          className={styles.toggleBtn}
          onClick={onToggle}
          aria-label={inDrawerMode ? 'Cerrar menú' : (collapsed ? 'Expandir sidebar' : 'Colapsar sidebar')}
        >
          {showExpanded ? <IconCollapse size={16} /> : <IconExpand size={16} />}
        </button>
      </div>

      {/* Separador visible solo en modo colapsado (desktop) */}
      {!showExpanded && <div className={styles.divider} />}

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.sections}>
          {sections.map(section => (
            <div key={section.id} className={styles.section}>
              {section.label && (
                <span className={`${styles.sectionLabel} ${showExpanded ? '' : styles.sectionLabelHidden}`}>
                  {section.label}
                </span>
              )}
              {section.items.map(item => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  state={item.active ? 'selected' : 'default'}
                  collapsed={!showExpanded}
                  onClick={item.onClick}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Carril colapsado (Figma 2593:3751): abajo van "My data", el badge de pendientes y
            el avatar, cada uno en su banda. Sin esto, al colapsar desaparecía todo el pie. */}
        {!showExpanded && user && (
          <div className={styles.collapsedFooter}>
            {personalItem && (
              <div className={styles.personalBandCollapsed}>
                <SidebarItem
                  icon={personalItem.icon}
                  label={personalItem.label}
                  state={personalItem.active ? 'selected' : 'default'}
                  collapsed
                  onClick={personalItem.onClick}
                />
              </div>
            )}
            {user.pendingInvites > 0 && (
              <button
                type="button"
                className={styles.pendingRail}
                onClick={onPendingInvitesClick}
                aria-label={`${user.pendingInvites} pending invites`}
              >
                <span className={styles.pendingBadge}>{user.pendingInvites}</span>
              </button>
            )}
            <div className={styles.userRailBand}>
              <button
                ref={userCardRef}
                type="button"
                className={`${styles.userRail} ${menuOpen ? styles.userCardActive : ''}`}
                onClick={handleUserCardClick}
                onMouseEnter={handleUserCardEnter}
                onMouseLeave={handleUserCardLeave}
                aria-label={`${user.name} ${user.surname}`}
              >
                <span className={styles.userCardAvatar}>{user.initials}</span>
              </button>
            </div>
          </div>
        )}

        {showExpanded && user && (
          <div className={styles.footer}>
            {personalItem && (
              <div className={styles.personalBand}>
                <SidebarItem
                  icon={personalItem.icon}
                  label={personalItem.label}
                  state={personalItem.active ? 'selected' : 'default'}
                  collapsed={false}
                  onClick={personalItem.onClick}
                />
              </div>
            )}
            <div className={styles.bottomBlock}>
            <div className={styles.bottomCard}>
              {user.pendingInvites > 0 && (
                <button type="button" className={styles.pendingPill} onClick={onPendingInvitesClick}>
                  <span className={styles.pendingBadge}>{user.pendingInvites}</span>
                  <span className={styles.pendingLabel}>Pending invites</span>
                </button>
              )}
              <button
                ref={userCardRef}
                type="button"
                className={`${styles.userCard} ${menuOpen ? styles.userCardActive : ''}`}
                onClick={handleUserCardClick}
                onMouseEnter={handleUserCardEnter}
                onMouseLeave={handleUserCardLeave}
              >
                <span className={styles.userCardAvatar}>{user.initials}</span>
                <span className={styles.userCardInfo}>
                  <span className={styles.userCardName}>{user.name} {user.surname}</span>
                  {/* Figma: "Center admin - Center name" — el rol solo no dice a qué está
                      scopeado, y es justo lo que distingue a dos cuentas del mismo rol. */}
                  <span className={styles.userCardRole}>
                    {user.scope ? `${user.role} - ${user.scope}` : user.role}
                  </span>
                </span>
                <span className={styles.userCardChevron}>
                  <IconChevronDown size={16} />
                </span>
              </button>
            </div>
            </div>
          </div>
        )}
      </nav>

      {userTooltipPos && createPortal(
        <div
          className={`${styles.userTooltip} ${userTooltipPos.placement === 'right' ? styles.userTooltipRight : ''}`}
          style={{ top: userTooltipPos.top, left: userTooltipPos.left }}
        >
          <div className={styles.userTooltipBox} style={{ width: userTooltipPos.width }}>
            <span className={styles.userTooltipRole}>{user.name} {user.surname}</span>
            {(user.role || user.scope) && (
              <span className={styles.userTooltipScope}>
                {user.scope ? `${user.role} - ${user.scope}` : user.role}
              </span>
            )}
          </div>
          <span className={styles.userTooltipArrow} />
        </div>,
        document.body
      )}

      {menuOpen && menuPos && user && createPortal(
        <div ref={menuPanelRef} className={styles.accountMenu} style={{ bottom: menuPos.bottom, left: menuPos.left, width: menuPos.width }}>
          <div className={styles.accountMenuHeader}>
            <span className={styles.accountMenuAvatar}>{user.initials}</span>
            <span className={styles.accountMenuHeaderInfo}>
              <span className={styles.accountMenuName}>{user.name} {user.surname}</span>
              <span className={styles.accountMenuRole}>{user.role}{user.scope ? ` - ${user.scope}` : ''}</span>
            </span>
          </div>

          {roleOptions.length > 0 && (
            <>
              <div className={styles.accountMenuDivider} />
              <div className={styles.accountMenuGroup}>
                <div
                  ref={roleSubmenu.rowRef}
                  className={`${styles.accountMenuItem} ${styles.accountMenuItemRow} ${roleSubmenu.anchor ? styles.accountMenuItemActive : ''}`}
                  onMouseEnter={roleSubmenu.open}
                  onMouseLeave={roleSubmenu.scheduleClose}
                >
                  <span className={styles.accountMenuItemLeft}>
                    <IconRefresh size={16} />
                    <span>Switch role</span>
                  </span>
                  <span className={styles.chevronRight}>
                    <IconChevronDown size={16} />
                  </span>
                </div>
              </div>
            </>
          )}

          <div className={styles.accountMenuDivider} />
          <div className={styles.accountMenuGroup}>
            <button type="button" className={styles.accountMenuItem} onClick={() => { setMenuOpen(false); onAccountDetails?.(); }}>
              Account details
            </button>
            <button type="button" className={styles.accountMenuItem}>
              Privacy &amp; terms
            </button>
            <div
              ref={languageSubmenu.rowRef}
              className={`${styles.accountMenuItem} ${styles.accountMenuItemRow} ${languageSubmenu.anchor ? styles.accountMenuItemActive : ''}`}
              onMouseEnter={languageSubmenu.open}
              onMouseLeave={languageSubmenu.scheduleClose}
            >
              <span>Language</span>
              <span className={styles.chevronRight}>
                <IconChevronDown size={16} />
              </span>
            </div>
          </div>

          <div className={styles.accountMenuDivider} />
          <div className={styles.accountMenuGroup}>
            <button type="button" className={`${styles.accountMenuItem} ${styles.accountMenuItemLogout}`}>
              Log out
            </button>
          </div>
        </div>,
        document.body
      )}

      {roleSubmenu.anchor && createPortal(
        <div
          ref={roleSubmenu.panelRef}
          className={styles.roleSubmenu}
          style={roleSubmenu.pos ? { top: roleSubmenu.pos.top, left: roleSubmenu.pos.left, opacity: 1 } : { top: -9999, left: -9999, opacity: 0 }}
          onMouseEnter={roleSubmenu.cancelClose}
          onMouseLeave={roleSubmenu.scheduleClose}
        >
          {roleOptions.map((opt, i) => {
            const isCurrent = opt.key === currentRoleKey;
            const prevSameLabel = i > 0 && roleOptions[i - 1].label === opt.label;
            return (
              <div key={opt.key} className={styles.roleSubmenuItemWrap}>
                {!prevSameLabel && i > 0 && <div className={styles.roleSubmenuDivider} />}
                <button
                  type="button"
                  className={`${styles.roleSubmenuItem} ${isCurrent ? styles.roleSubmenuItemCurrent : ''}`}
                  onClick={() => { setMenuOpen(false); roleSubmenu.close(); onRoleChange?.(opt.key); }}
                >
                  <span className={styles.roleSubmenuAvatar}>{opt.initials}</span>
                  <span className={styles.roleSubmenuInfo}>
                    <span className={styles.roleSubmenuLabel}>{opt.label}</span>
                    {opt.scope && <span className={styles.roleSubmenuScope}>{opt.scope}</span>}
                  </span>
                  {isCurrent && (
                    <span className={styles.roleSubmenuCheck}>
                      <IconCheckCircle size={16} />
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>,
        document.body
      )}

      {languageSubmenu.anchor && createPortal(
        <div
          ref={languageSubmenu.panelRef}
          className={styles.roleSubmenu}
          style={languageSubmenu.pos ? { top: languageSubmenu.pos.top, left: languageSubmenu.pos.left, opacity: 1 } : { top: -9999, left: -9999, opacity: 0 }}
          onMouseEnter={languageSubmenu.cancelClose}
          onMouseLeave={languageSubmenu.scheduleClose}
        >
          {LANGUAGES.map(lang => {
            const isCurrent = lang.code === languageCode;
            return (
              <button
                key={lang.code}
                type="button"
                className={`${styles.roleSubmenuItem} ${styles.languageSubmenuItem} ${isCurrent ? styles.roleSubmenuItemCurrent : ''}`}
                onClick={() => { setLanguageCode(lang.code); languageSubmenu.close(); }}
              >
                <span className={styles.roleSubmenuLabel}>{lang.label}</span>
                {isCurrent && (
                  <span className={styles.roleSubmenuCheck}>
                    <IconCheckCircle size={16} />
                  </span>
                )}
              </button>
            );
          })}
        </div>,
        document.body
      )}

    </aside>
  );
}
