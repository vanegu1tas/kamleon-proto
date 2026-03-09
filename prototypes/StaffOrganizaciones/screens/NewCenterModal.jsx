import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconAddImage, IconPlus } from '../../../design-system/icons/outline';
import styles from './NewCenterModal.module.css';

export default function NewCenterModal({ onClose }) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [phone, setPhone]     = useState('');
  const [address, setAddress] = useState('');
  const [adminEmails, setAdminEmails] = useState([]);

  function addAdmin() {
    setAdminEmails(prev => [...prev, '']);
  }

  function updateAdmin(i, val) {
    setAdminEmails(prev => prev.map((e, idx) => idx === i ? val : e));
  }

  function removeAdmin(i) {
    setAdminEmails(prev => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>New Center</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IconClose size={16} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

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

          {/* Fields */}
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                Name <span className={styles.required}>*</span>
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
          </div>

          {/* Invite administrators */}
          <div className={styles.inviteSection}>
            <div className={styles.inviteInfo}>
              <p className={styles.inviteLabel}>Invite administrators</p>
              <p className={styles.inviteSubtitle}>
                Send email invitations to your center administrators
              </p>
            </div>

            {adminEmails.map((adminEmail, i) => (
              <div key={i} className={styles.adminEmailRow}>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="admin@example.com"
                  value={adminEmail}
                  onChange={e => updateAdmin(i, e.target.value)}
                />
                <button
                  className={styles.removeAdminBtn}
                  type="button"
                  onClick={() => removeAdmin(i)}
                  aria-label="Remove"
                >
                  <IconClose size={14} />
                </button>
              </div>
            ))}

            <button className={styles.addAdminBtn} type="button" onClick={addAdmin}>
              <IconPlus size={16} />
              Add administrator
            </button>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary"   size="m" disabled={!name.trim()}>Create</Button>
        </div>

      </div>
    </div>
  );
}
