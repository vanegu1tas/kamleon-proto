import { useState } from 'react';
import styles from './WorkspaceSelector.module.css';
import SearchBar from '../../../design-system/components/SearchBar/SearchBar';
import { IconChevronMiniRight } from '../../../design-system/icons/outline';

const WORKSPACES = [
  {
    org: 'Kamleon',
    color: 'var(--color-turquoise-51)',
    roles: [
      { role: 'Admin',            scope: 'General admin' },
      { role: 'Editor',           scope: 'All centers' },
      { role: 'Personal Account', scope: 'My workspace' },
    ],
  },
  {
    org: 'AnyósPark',
    color: 'var(--color-grey-70)',
    roles: [
      { role: 'Center Admin', scope: 'Main Center' },
    ],
  },
  {
    org: 'Arsenal Football Club',
    color: 'var(--color-grey-70)',
    roles: [
      { role: 'Admin',      scope: 'General admin' },
      { role: 'Team Admin', scope: 'Arsenal First Team' },
    ],
  },
  {
    org: 'Astonia FC',
    color: 'var(--color-grey-70)',
    roles: [
      { role: 'Editor',     scope: 'Training Ground' },
      { role: 'Team Admin', scope: 'First Team' },
    ],
  },
  {
    org: 'Baskonia-Alavés Group',
    color: 'var(--color-grey-70)',
    roles: [
      { role: 'Admin',        scope: 'General admin' },
      { role: 'Center Admin', scope: 'Baskonia Arena' },
    ],
  },
  {
    org: 'CAR Sant Cugat',
    color: 'var(--color-grey-70)',
    roles: [
      { role: 'Center Admin', scope: 'Sant Cugat Center' },
    ],
  },
  {
    org: 'CAR Sierra Nevada',
    color: 'var(--color-grey-70)',
    roles: [
      { role: 'Team Admin', scope: 'Athletics Team' },
    ],
  },
  {
    org: 'CEAR La Cartuja',
    color: 'var(--color-grey-70)',
    roles: [
      { role: 'Viewer', scope: 'All centers' },
    ],
  },
  {
    org: 'CEM Joan Miró',
    color: 'var(--color-grey-70)',
    roles: [
      { role: 'Center Admin', scope: 'Joan Miró Center' },
      { role: 'Team Admin',   scope: 'Seniors A' },
    ],
  },
  {
    org: 'CNEA Font-Romeu',
    color: 'var(--color-grey-70)',
    roles: [
      { role: 'Editor', scope: 'Font-Romeu Center' },
    ],
  },
  {
    org: 'Dynatech',
    color: 'var(--color-grey-70)',
    roles: [
      { role: 'Viewer', scope: 'All centers' },
    ],
  },
];

function OrgAvatar({ org, color, size = 32 }) {
  return (
    <div
      className={styles.orgAvatar}
      style={{ width: size, height: size, background: color }}
    >
      {org[0]}
    </div>
  );
}

function UserAvatar({ name }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <div className={styles.userAvatar}>
      {initials}
    </div>
  );
}

export default function WorkspaceSelector({ onNavigate, userName = 'Laia Alentorn', userEmail = 'Laia.alentorn@kamleon.com' }) {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? WORKSPACES.filter(w => w.org.toLowerCase().includes(search.toLowerCase()))
    : WORKSPACES;

  return (
    <div className={styles.page}>

      <div className={styles.content}>

        {/* User info */}
        <div className={styles.userInfo}>
          <UserAvatar name={userName} />
          <div className={styles.userText}>
            <span className={styles.userName}>{userName}</span>
            <span className={styles.userEmail}>{userEmail}</span>
          </div>
        </div>

        <p className={styles.subtitle}>Select a workspace to continue</p>

        <SearchBar
          placeholder="Search by organization name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />

        {/* Org list */}
        <div className={styles.orgList}>
          {filtered.length === 0 && (
            <p className={styles.empty}>No organizations found</p>
          )}
          {filtered.map(({ org, color, roles }) => (
            <div key={org} className={styles.orgGroup}>
              <p className={styles.orgName}>{org}</p>
              <div className={styles.rolesCard}>
                {roles.map(({ role, scope }, i) => (
                  <button
                    key={role}
                    className={`${styles.roleRow} ${i < roles.length - 1 ? styles.roleRowBorder : ''}`}
                    onClick={() => onNavigate('app')}
                  >
                    <div className={styles.roleLeft}>
                      <OrgAvatar org={org} color={color} size={32} />
                      <div className={styles.roleText}>
                        <span className={styles.roleName}>{role}</span>
                        <span className={styles.roleScope}>{scope}</span>
                      </div>
                    </div>
                    <IconChevronMiniRight size={24} className={styles.chevron} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>


      </div>

    </div>
  );
}
