import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import { IconClose, IconPlus, IconInfoCircle } from '../../../design-system/icons/outline';
import styles from './NewCenterDrawer.module.css';

export default function AddOrgAdminDrawer({ org, onClose, onSave }) {
  const [adminEmails, setAdminEmails] = useState(['']);

  function addRow()            { setAdminEmails(prev => [...prev, '']); }
  function updateRow(i, val)   { setAdminEmails(prev => prev.map((e, idx) => idx === i ? val : e)); }
  function removeRow(i)        { setAdminEmails(prev => prev.filter((_, idx) => idx !== i)); }

  const validEmails = adminEmails.map(e => e.trim()).filter(Boolean);
  const hasValidEmail = validEmails.length > 0;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>Add Org administrator</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          <p className={styles.contextLine}>
            An Org Admin manages this organization and all of its centers. They can invite and remove organization and center admins, see every user across centers, and view the organization's data and reports. They'll receive an email to accept the role and access this organization.
          </p>

          <div className={styles.permissionsCard}>
            <div className={styles.permissionsCardHeader}>
              <span className={styles.permissionsCardIcon}>
                <IconInfoCircle size={16} />
              </span>
              <p className={styles.permissionsCardTitle}>Org admin permissions</p>
            </div>
            <p className={styles.permissionsCardBody}>
              Manages administrators and integrations for the whole organization, and sees the users of every center. Center data and settings are managed by Kamleon.
            </p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionInfo}>
              <p className={styles.sectionLabel}>Invite administrators</p>
              <p className={styles.sectionSubtitle}>Send email invitations to your organization administrators.</p>
            </div>

            {adminEmails.map((email, i) => (
              <div key={i} className={styles.addItemRow}>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={e => updateRow(i, e.target.value)}
                />
                <button className={styles.removeItemBtn} type="button" onClick={() => removeRow(i)} aria-label="Remove">
                  <IconClose size={14} />
                </button>
              </div>
            ))}

            <button className={styles.addBtn} type="button" onClick={addRow}>
              <IconPlus size={16} />
              Add administrator
            </button>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="tertiary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="m" disabled={!hasValidEmail} onClick={() => { onSave?.(validEmails); onClose(); }}>Save</Button>
        </div>

      </div>
    </div>
  );
}
