import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconPlus } from '../../../design-system/icons/outline';
import styles from './EditCenterDrawer.module.css';

export default function EditCenterDrawer({ center, org, onClose }) {
  const [name,    setName]    = useState(center.name    ?? '');
  const [email,   setEmail]   = useState(center.email   ?? '');
  const [phone,   setPhone]   = useState(center.phone   ?? '');
  const [address, setAddress] = useState(center.address ?? '');
  const [address2, setAddress2] = useState('');
  const [showAddress2, setShowAddress2] = useState(false);

  const initial = name.trim().charAt(0).toUpperCase();

  const hasChanges =
    name    !== (center.name    ?? '') ||
    email   !== (center.email   ?? '') ||
    phone   !== (center.phone   ?? '') ||
    address !== (center.address ?? '') ||
    address2 !== '';

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.drawer} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Center</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IconClose size={16} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* Subtitle */}
          {org && (
            <p className={styles.subtitle}>
              Editing Center for <span className={styles.subtitleOrg}>{org.name}</span>
            </p>
          )}

          {/* Avatar row */}
          <div className={styles.avatarRow}>
            <div className={styles.avatar}>
              {initial || '?'}
            </div>
            <button className={styles.changePictureBtn} type="button">
              Change picture
            </button>
          </div>

          {/* Fields */}
          <div className={styles.fields}>

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

            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Email</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="Write here..."
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Phone number</label>
                <input
                  className={styles.input}
                  type="tel"
                  placeholder="Write here..."
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Address</label>
              <input
                className={styles.input}
                placeholder="Write your address here..."
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

            {showAddress2 ? (
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  <span>Address line 2</span>
                </label>
                <div className={styles.inputWithAction}>
                  <input
                    className={styles.input}
                    placeholder="Apt, suite, floor..."
                    value={address2}
                    onChange={e => setAddress2(e.target.value)}
                    autoFocus
                  />
                  <button
                    className={styles.removeFieldBtn}
                    type="button"
                    onClick={() => { setShowAddress2(false); setAddress2(''); }}
                    aria-label="Remove address line 2"
                    data-tooltip="Remove"
                  >
                    <IconClose size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className={styles.addAddressBtn}
                type="button"
                onClick={() => setShowAddress2(true)}
              >
                <IconPlus size={16} />
                Add address line
              </button>
            )}

          </div>
        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary"   size="m" disabled={!hasChanges || !name.trim()} onClick={onClose}>Save</Button>
        </div>

      </div>
    </div>
  );
}
