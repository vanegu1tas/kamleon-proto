import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconAddImage } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import styles from './NewUserDrawer.module.css';

// ─── Toggle ──────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
      onClick={() => onChange(!checked)}
      type="button"
    />
  );
}

function SettingRow({ label, description, checked, onChange }) {
  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <span className={styles.settingLabel}>{label}</span>
        <span className={styles.settingDesc}>{description}</span>
      </div>
      <div className={styles.settingControl}>
        <span className={styles.toggleLabel}>{checked ? 'ON' : 'OFF'}</span>
        <Toggle checked={checked} onChange={onChange} />
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────

/**
 * NewUserDrawer — creates a new user.
 *
 * Props:
 *   center  — the center the user will belong to (for context label)
 *   team    — if provided, the team is pre-selected (no selector shown)
 *   teams   — list of all teams in the center (used when team is not pre-selected)
 *   onClose — called when the drawer should be dismissed
 */
export default function NewUserDrawer({ center, team: preselectedTeam, teams = [], onClose }) {
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [phone,      setPhone]      = useState('');
  const [birthday,   setBirthday]   = useState('');
  const [gender,     setGender]     = useState('');
  const [height,     setHeight]     = useState('');
  const [weight,     setWeight]     = useState('');
  const [role,       setRole]       = useState('');
  const [rfid,       setRfid]       = useState(false);
  const [pin,        setPin]        = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(preselectedTeam?.id ?? '');

  const canCreate = name.trim().length > 0 && email.trim().length > 0 && role !== '' && (preselectedTeam || selectedTeamId !== '');

  const contextTeam = preselectedTeam ?? teams.find(t => t.id === Number(selectedTeamId));

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.drawer} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>New User</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* Context subtitle */}
          <p className={styles.contextSubtitle}>
            {contextTeam
              ? <>New user for <strong>{contextTeam.name}</strong></>
              : center
                ? <>New user in <strong>{center.name}</strong></>
                : 'New user'
            }
          </p>

          {/* Avatar row */}
          <div className={styles.avatarRow}>
            <div className={styles.avatar}>
              {name.trim()
                ? <span className={styles.avatarInitial}>{name.trim().charAt(0).toUpperCase()}</span>
                : <IconAddImage size={24} />
              }
            </div>
            <div className={styles.avatarText}>
              <button className={styles.addPictureBtn} type="button">Add picture</button>
              <span className={styles.avatarSep}>-</span>
              <span className={styles.avatarOptional}>Optional</span>
            </div>
          </div>

          {/* User info */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>User info</h3>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                Name <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                Role <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="">Select a role…</option>
                <option value="user">User</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Email <span className={styles.required}>*</span></label>
                <input
                  className={styles.input}
                  placeholder="email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Phone</label>
                <input
                  className={styles.input}
                  placeholder="+1 000 000 0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Birthday</label>
                <input
                  className={styles.input}
                  placeholder="DD/MM/YYYY"
                  value={birthday}
                  onChange={e => setBirthday(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Gender</label>
                <input
                  className={styles.input}
                  placeholder="Male / Female / Other"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Height</label>
                <input
                  className={styles.input}
                  placeholder="e.g. 178 cm"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Weight</label>
                <input
                  className={styles.input}
                  placeholder="e.g. 75 kg"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                />
              </div>
            </div>

          </div>

          {/* Team assignment — only shown when team is not pre-selected */}
          {!preselectedTeam && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Assignment</h3>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  Team <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.select}
                  value={selectedTeamId}
                  onChange={e => setSelectedTeamId(e.target.value)}
                >
                  <option value="">Select a team…</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Settings */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Settings</h3>
            <div className={styles.settingsList}>
              <SettingRow
                label="RFID"
                description="Allow this user to log in via proximity card."
                checked={rfid}
                onChange={setRfid}
              />
              <SettingRow
                label="Set PIN"
                description="Require this user to enter a personal PIN to log in."
                checked={pin}
                onChange={setPin}
              />
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="m" disabled={!canCreate} onClick={onClose}>Create</Button>
        </div>

      </div>
    </div>
  );
}
