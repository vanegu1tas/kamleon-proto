import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconAddImage } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Toggle from '../../../design-system/components/Toggle/Toggle';
import Input from '../../../design-system/components/Input/Input';
import styles from './NewTeamDrawer.module.css';

export default function NewTeamDrawer({ center, onClose }) {
  const [name,    setName]    = useState('');
  const [setPin,  setSetPin]  = useState(false);

  const canCreate = name.trim().length > 0;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.drawer} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>New Team</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* Subtitle */}
          {center && (
            <p className={styles.subtitle}>
              New Team for <span className={styles.subtitleCenter}>{center.name}</span>
            </p>
          )}

          {/* Avatar row */}
          <div className={styles.avatarRow}>
            <div className={styles.avatar}>
              <IconAddImage size={24} />
            </div>
            <div className={styles.avatarText}>
              <button className={styles.addPictureBtn} type="button">Add picture</button>
              <span className={styles.avatarSep}>-</span>
              <span className={styles.avatarOptional}>Optional</span>
            </div>
          </div>

          {/* Team name */}
          <Input
            label="Team name"
            required
            placeholder="Write here..."
            value={name}
            onChange={setName}
            autoFocus
          />

          {/* Settings */}
          <div className={styles.settingsList}>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Set PIN</span>
                <span className={styles.settingDesc}>Enabling this requires the user to enter a personal PIN to log in.</span>
              </div>
              <Toggle checked={setPin} onChange={setSetPin} />
            </div>

          </div>

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="m" disabled={!canCreate}>Create</Button>
        </div>

      </div>
    </div>
  );
}
