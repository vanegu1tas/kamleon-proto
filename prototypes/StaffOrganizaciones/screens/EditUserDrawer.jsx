import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import styles from './EditUserDrawer.module.css';

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

export default function EditUserDrawer({ user, team, onClose }) {
  const [name,     setName]     = useState(user.name     ?? '');
  const [email,    setEmail]    = useState(user.email    ?? '');
  const [phone,    setPhone]    = useState(user.phone    ?? '');
  const [birthday, setBirthday] = useState(user.birthday ?? '');
  const [gender,   setGender]   = useState(user.gender   ?? '');
  const [height,   setHeight]   = useState(user.height   ?? '');
  const [weight,   setWeight]   = useState(user.weight   ?? '');
  const [status,   setStatus]   = useState(user.status === 'active');
  const [rfid,     setRfid]     = useState(user.rfid     ?? false);
  const [pin,      setPin]      = useState(user.pin      ?? false);

  const hasChanges =
    name     !== (user.name     ?? '') ||
    email    !== (user.email    ?? '') ||
    phone    !== (user.phone    ?? '') ||
    birthday !== (user.birthday ?? '') ||
    gender   !== (user.gender   ?? '') ||
    height   !== (user.height   ?? '') ||
    weight   !== (user.weight   ?? '') ||
    status   !== (user.status === 'active') ||
    rfid     !== (user.rfid     ?? false) ||
    pin      !== (user.pin      ?? false);

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.drawer} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>Edit User</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* Context subtitle */}
          {team && (
            <p className={styles.contextSubtitle}>
              Editing user for <strong>{team.name}</strong>
            </p>
          )}

          {/* Avatar row */}
          <div className={styles.avatarRow}>
            <div className={styles.avatar}>{name.trim().charAt(0).toUpperCase()}</div>
            <div className={styles.avatarText}>
              <button className={styles.changePictureBtn} type="button">Add picture</button>
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

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Email</label>
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

          {/* Settings */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Settings</h3>
            <div className={styles.settingsList}>
              <SettingRow
                label="Status"
                description="Once deactivated, the user won't be accessible until you enable it again."
                checked={status}
                onChange={setStatus}
              />
              <SettingRow
                label="RFID"
                description="Allow this user to log in via proximity card."
                checked={rfid}
                onChange={setRfid}
              />
              <div className={styles.settingWithAction}>
                <SettingRow
                  label="Set PIN"
                  description="Require this user to enter a personal PIN to log in."
                  checked={pin}
                  onChange={setPin}
                />
                {pin && (
                  <button className={styles.resetPinBtn} type="button">
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
