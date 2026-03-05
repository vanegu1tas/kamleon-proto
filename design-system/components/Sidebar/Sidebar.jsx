import styles from './Sidebar.module.css';
import SidebarItem from '../SidebarItem/SidebarItem';
import LogoKamleon from '../../icons/LogoKamleon';
import { IconCollapse, IconExpand } from '../../icons/outline';

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
 */
export default function Sidebar({ collapsed = false, onToggle, sections = [], drawerOpen }) {
  const inDrawerMode = drawerOpen !== undefined;
  const showExpanded = inDrawerMode || !collapsed;

  const classNames = [
    styles.sidebar,
    showExpanded ? styles.expanded : styles.collapsed,
    inDrawerMode && drawerOpen ? styles.drawerVisible : '',
  ].filter(Boolean).join(' ');

  return (
    <aside className={classNames}>

      {/* Header */}
      <div className={styles.header}>
        {showExpanded && <LogoKamleon />}
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
        {sections.map(section => (
          <div key={section.id} className={styles.section}>
            {showExpanded && (
              <span className={styles.sectionLabel}>{section.label}</span>
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
      </nav>

    </aside>
  );
}
