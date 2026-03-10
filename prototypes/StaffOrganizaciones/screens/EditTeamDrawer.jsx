import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconAddImage } from '../../../design-system/icons/outline';
import styles from './EditTeamDrawer.module.css';

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

// ─── Setting row ─────────────────────────────────────────

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

export default function EditTeamDrawer({ team, onClose }) {
  const [name,   setName]   = useState(team.name ?? '');
  const [status, setStatus] = useState(team.status === 'active');
  const [rfid,   setRfid]   = useState(false);
  const [setPin, setSetPin] = useState(false);

  const initial = name.trim().charAt(0).toUpperCase();

  const hasChanges =
    name   !== (team.name ?? '') ||
    status !== (team.status === 'active') ||
    rfid   !== false ||
    setPin !== false;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.drawer} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Team</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IconClose size={16} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* Avatar row */}
          <div className={styles.avatarRow}>
            <div className={styles.avatar}>
              {initial || <IconAddImage size={24} />}
            </div>
            <div className={styles.avatarText}>
              <button className={styles.changePictureBtn} type="button">
                Add picture
              </button>
              <span className={styles.avatarSep}>-</span>
              <span className={styles.avatarOptional}>Optional</span>
            </div>
          </div>

          {/* Team info */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Team info</h3>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                <span>Name <span className={styles.required}>*</span></span>
              </label>
              <input
                className={styles.input}
                placeholder="Write here..."
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Settings */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Settings</h3>
            <div className={styles.settingsList}>
              <SettingRow
                label="Status"
                description="Once deactivated, the team won't be accessible until you enable it again."
                checked={status}
                onChange={setStatus}
              />
              <SettingRow
                label="RFID"
                description="Enable proximity device access for this team."
                checked={rfid}
                onChange={setRfid}
              />
              <div className={styles.settingWithAction}>
                <SettingRow
                  label="Set PIN"
                  description="Enabling this requires members to enter a personal PIN to log in."
                  checked={setPin}
                  onChange={setSetPin}
                />
                {setPin && (
                  <button className={styles.resetPinBtn} type="button">
                    {/* loader icon — placeholder until icon is provided */}
                    <span className={styles.resetPinIcon}>↺</span>
                    Reset PIN
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="m" disabled={!hasChanges || !name.trim()} onClick={onClose}>Save</Button>
        </div>

      </div>
    </div>
  );
}
