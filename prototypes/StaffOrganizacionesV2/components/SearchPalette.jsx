import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { IconSearch, IconClose, IconBuilding, IconTeams, IconUser } from '../../../design-system/icons/outline';
import { ORGS, USERS_POOL } from '../../StaffOrganizaciones/mockData';
import styles from './SearchPalette.module.css';

function OrgIcon({ name }) {
  return <div className={styles.orgAvatar}>{name.charAt(0)}</div>;
}

export default function SearchPalette({ onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const orgs = [];
    const centers = [];
    const teams = [];
    const users = [];

    // Build user → first context map
    const userContextMap = new Map(); // userId → { team, center, org }
    ORGS.forEach(org => {
      org.centers.forEach(center => {
        (center.teams ?? []).forEach(team => {
          (team.users ?? []).forEach(uid => {
            if (!userContextMap.has(uid)) userContextMap.set(uid, { team, center, org });
          });
        });
      });
    });

    ORGS.forEach(org => {
      if (org.name.toLowerCase().includes(q)) orgs.push({ org });
      org.centers.forEach(center => {
        if (center.name.toLowerCase().includes(q)) centers.push({ center, org });
        (center.teams ?? []).forEach(team => {
          if (team.name.toLowerCase().includes(q)) teams.push({ team, center, org });
        });
      });
    });

    USERS_POOL.forEach(user => {
      if (user.name.toLowerCase().includes(q)) {
        const ctx = userContextMap.get(user.id);
        if (ctx) users.push({ user, ...ctx });
      }
    });

    return { orgs, centers, teams, users };
  }, [query]);

  const hasResults = results && (
    results.orgs.length + results.centers.length + results.teams.length + results.users.length > 0
  );

  function handleNavigate(screen, params) {
    onNavigate(screen, params);
    onClose();
  }

  return createPortal(
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.palette} onMouseDown={e => e.stopPropagation()}>

        {/* Input */}
        <div className={styles.inputRow}>
          <IconSearch size={16} />
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Search organizations, centers, teams..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')} aria-label="Clear">
              <IconClose size={14} />
            </button>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className={styles.results}>
            {!hasResults && (
              <p className={styles.empty}>No results for "{query}"</p>
            )}

            {results.orgs.length > 0 && (
              <div className={styles.group}>
                <span className={styles.groupLabel}>Organizations</span>
                {results.orgs.map(({ org }) => (
                  <button
                    key={org.id}
                    className={styles.item}
                    onClick={() => handleNavigate('org-detail', { org })}
                  >
                    <OrgIcon name={org.name} />
                    <div className={styles.itemMeta}>
                      <span className={styles.itemName}>{org.name}</span>
                      <span className={styles.itemSub}>{org.segments}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {results.centers.length > 0 && (
              <div className={styles.group}>
                <span className={styles.groupLabel}>Centers</span>
                {results.centers.map(({ center, org }) => (
                  <button
                    key={center.id}
                    className={styles.item}
                    onClick={() => handleNavigate('org-detail', { org, initialCenter: center })}
                  >
                    <div className={styles.itemIcon}><IconBuilding size={16} /></div>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemName}>{center.name}</span>
                      <span className={styles.itemSub}>{org.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {results.teams.length > 0 && (
              <div className={styles.group}>
                <span className={styles.groupLabel}>Teams</span>
                {results.teams.map(({ team, center, org }) => (
                  <button
                    key={team.id}
                    className={styles.item}
                    onClick={() => handleNavigate('org-detail', { org, initialCenter: center, initialTeam: team })}
                  >
                    <div className={styles.itemIcon}><IconTeams size={16} /></div>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemName}>{team.name}</span>
                      <span className={styles.itemSub}>{org.name} › {center.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {results.users.length > 0 && (
              <div className={styles.group}>
                <span className={styles.groupLabel}>Users</span>
                {results.users.map(({ user, team, center, org }) => (
                  <button
                    key={user.id}
                    className={styles.item}
                    onClick={() => handleNavigate('org-detail', { org, initialCenter: center, initialTeam: team, initialUser: user })}
                  >
                    <div className={styles.itemIcon}><IconUser size={16} /></div>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemName}>{user.name}</span>
                      <span className={styles.itemSub}>{org.name} › {center.name} › {team.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty state — no query */}
        {!results && (
          <p className={styles.hint}>Type to search across all organizations, centers and teams</p>
        )}

      </div>
    </div>,
    document.body
  );
}
