import { useState } from 'react';
import Button   from '../../../design-system/components/Button/Button';
import Input    from '../../../design-system/components/Input/Input';
import Toggle   from '../../../design-system/components/Toggle/Toggle';
import { IconClose, IconAddImage, IconChevronDown } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import styles from './EditTeamDrawer.module.css';

function IconRegenerate() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M10.5 2.5H13.5V5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function StatusSelect({ value, onChange }) {
  return (
    <div className={styles.statusField}>
      <div className={styles.statusLabelRow}>
        <span className={styles.statusLabel}>Status</span>
      </div>
      <div className={styles.statusSelectWrap}>
        <span className={`${styles.statusDot} ${styles[value]}`} />
        <select
          className={styles.statusSelect}
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <span className={styles.statusSelectChevron}><IconChevronDown size={16} /></span>
      </div>
    </div>
  );
}

export default function EditTeamDrawer({ team, center, onClose, onSave }) {
  const [name,          setName]         = useState(team.name ?? '');
  const [status,        setStatus]       = useState(team.status ?? 'active');
  const [pinEnabled,    setPinEnabled]   = useState(team.pin ?? false);
  const [confirmRegen,  setConfirmRegen] = useState(false);

  const initial = name.trim().charAt(0).toUpperCase();

  const hasChanges =
    name       !== (team.name ?? '') ||
    status     !== (team.status ?? 'active') ||
    pinEnabled !== (team.pin ?? false);

  function handleRegenerate() {
    setConfirmRegen(false);
    // simulate PDF download
  }

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.drawer} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Team</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* ── Subtitle ── */}
        {center && (
          <div className={styles.subtitleRow}>
            <p className={styles.subtitle}>
              Editing Team for <strong>{center.name}</strong>
            </p>
          </div>
        )}

        {/* ── Avatar row ── */}
        <div className={styles.avatarRow}>
          <div className={styles.avatar}>
            <IconAddImage size={24} />
          </div>
          <div className={styles.avatarText}>
            <button className={styles.changePictureBtn} type="button">Add picture</button>
            <span className={styles.avatarSep}>-</span>
            <span className={styles.avatarOptional}>Optional</span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* Fields */}
          <div className={styles.fields}>
            <Input
              label="Team name"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Write here..."
            />
            <StatusSelect value={status} onChange={setStatus} />
          </div>

          {/* Settings */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Settings</h3>
            <div className={styles.settingsList}>

              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <span className={styles.settingLabel}>Set PIN</span>
                  <span className={styles.settingDesc}>Enabling this requires the users to enter a personal PIN to log in.</span>
                </div>
                <Toggle checked={pinEnabled} onChange={setPinEnabled} />
              </div>

              {!confirmRegen ? (
                <div className={styles.settingRow}>
                  <div className={styles.settingInfo}>
                    <span className={styles.settingLabel}>Regenerate PIN</span>
                    <span className={styles.settingDesc}>Regenerate PIN for all users on your team.</span>
                  </div>
                  <button className={styles.regenBtn} type="button" onClick={() => setConfirmRegen(true)}>
                    <IconRegenerate />
                    Regenerate
                  </button>
                </div>
              ) : (
                <div className={styles.regenConfirm}>
                  <p className={styles.regenConfirmText}>All current PINs will be invalidated. A PDF will download automatically for you to distribute to each member.</p>
                  <div className={styles.regenConfirmActions}>
                    <button className={styles.regenCancelBtn} type="button" onClick={() => setConfirmRegen(false)}>Cancel</button>
                    <button className={styles.regenConfirmBtn} type="button" onClick={handleRegenerate}>Confirm</button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="m"
            disabled={!hasChanges || !name.trim()}
            onClick={() => { onSave({ name: name.trim(), status, pin: pinEnabled }); onClose(); }}
          >Save</Button>
        </div>

      </div>
    </div>
  );
}
