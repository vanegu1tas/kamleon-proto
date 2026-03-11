import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconAddImage } from '../../../design-system/icons/outline';
import styles from './NewTeamDrawer.module.css';

export default function NewTeamDrawer({ center, onClose }) {
  const [name,    setName]    = useState('');
  const [rfid,    setRfid]    = useState(false);
  const [setPin,  setSetPin]  = useState(false);

  const canCreate = name.trim().length > 0;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.drawer} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>New Team</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IconClose size={16} />
          </button>
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
          <div className={styles.field}>
            <label className={styles.fieldLabel}>
              Team name <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              placeholder="Write here..."
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Settings */}
          <div className={styles.settingsList}>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>RFID</span>
                <span className={styles.settingDesc}>Enable proximity device access for this user.</span>
              </div>
              <div className={styles.settingControl}>
                <span className={styles.toggleLabel}>{rfid ? 'ON' : 'OFF'}</span>
                <button
                  role="switch"
                  aria-checked={rfid}
                  className={`${styles.toggle} ${rfid ? styles.toggleOn : ''}`}
                  onClick={() => setRfid(v => !v)}
                  type="button"
                />
              </div>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Set PIN</span>
                <span className={styles.settingDesc}>Enabling this requires the user to enter a personal PIN to log in.</span>
              </div>
              <div className={styles.settingControl}>
                <span className={styles.toggleLabel}>{setPin ? 'ON' : 'OFF'}</span>
                <button
                  role="switch"
                  aria-checked={setPin}
                  className={`${styles.toggle} ${setPin ? styles.toggleOn : ''}`}
                  onClick={() => setSetPin(v => !v)}
                  type="button"
                />
              </div>
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
