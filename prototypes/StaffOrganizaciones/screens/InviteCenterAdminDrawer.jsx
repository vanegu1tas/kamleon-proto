import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Dropdown from '../../../design-system/components/Dropdown/Dropdown';
import { IconClose, IconPlus, IconInfoCircle } from '../../../design-system/icons/outline';
import styles from './NewCenterDrawer.module.css';

export default function InviteCenterAdminDrawer({ org, presetCenter = null, onClose, onSave }) {
  const centers = org?.centers ?? [];
  const [centerId, setCenterId] = useState('');
  const [adminEmails, setAdminEmails] = useState(['']);

  function addRow()            { setAdminEmails(prev => [...prev, '']); }
  function updateRow(i, val)   { setAdminEmails(prev => prev.map((e, idx) => idx === i ? val : e)); }
  function removeRow(i)        { setAdminEmails(prev => prev.filter((_, idx) => idx !== i)); }

  const validEmails = adminEmails.map(e => e.trim()).filter(Boolean);
  const selectedCenter = presetCenter ?? centers.find(c => String(c.id) === centerId);
  const canSave = !!selectedCenter && validEmails.length > 0;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>Add Center administrator</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          <p className={styles.contextLine}>
            A Center Admin manages this center day-to-day. They can create teams, invite users and team admins, set up PIN and screen access, and view the center's data and reports. They'll receive an email to accept the role and access {presetCenter ? presetCenter.name : 'this center'}.
          </p>

          <div className={styles.permissionsCard}>
            <div className={styles.permissionsCardHeader}>
              <span className={styles.permissionsCardIcon}>
                <IconInfoCircle size={16} />
              </span>
              <p className={styles.permissionsCardTitle}>Center admin permissions</p>
            </div>
            <p className={styles.permissionsCardBody}>
              Creates and manages the teams of this center, its users and its administrators. Center data and unit settings are managed by Kamleon.
            </p>
          </div>

          {!presetCenter && (
            <Dropdown
              label="Center"
              required
              placeholder="Select a center"
              options={centers.map(c => ({ label: c.name, value: String(c.id) }))}
              value={centerId}
              onChange={setCenterId}
            />
          )}

          <div className={styles.section}>
            <div className={styles.sectionInfo}>
              <p className={styles.sectionLabel}>Invite administrators</p>
              <p className={styles.sectionSubtitle}>Send email invitations to this center's administrators.</p>
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
          <Button
            variant="primary"
            size="m"
            disabled={!canSave}
            onClick={() => { onSave?.(selectedCenter, validEmails); onClose(); }}
          >Save</Button>
        </div>

      </div>
    </div>
  );
}
