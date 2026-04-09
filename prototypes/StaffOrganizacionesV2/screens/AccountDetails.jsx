import { useState } from 'react';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import { IconEdit, IconClose } from '../../../design-system/icons/outline';
import EditAccountDrawer from '../../StaffOrganizaciones/screens/EditAccountDrawer';
import ChangePasswordDrawer from '../../StaffOrganizaciones/screens/ChangePasswordDrawer';
import ChangePinDrawer from '../../StaffOrganizaciones/screens/ChangePinDrawer';
import DeleteOrgModal from '../../StaffOrganizaciones/screens/DeleteOrgModal';
import Toast from '../../../design-system/components/Toast/Toast';
import styles from './AccountDetails.module.css';

// Mock — logged-in staff user
const CURRENT_USER = {
  initials: 'DV',
  name:     'Daniel',
  surname:  'Vanegas',
  email:    'daniel.vanegas@dna.inc',
  phone:    '+34 600 000 000',
  dob:      '15/11/1990',
  gender:   'Male',
  height:   '175',
  weight:   '80',
  role:     'Admin',
  hasPIN:   false,
};

function QuestionMark({ tooltip }) {
  return (
    <span className={styles.questionWrap} data-tooltip={tooltip}>
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <circle cx="6.5" cy="6.5" r="6" stroke="currentColor" />
        <path d="M6.5 8.5V7.3C7.4 7 8.1 6.2 8.1 5.2C8.1 4.1 7.2 3.2 6.1 3.2C5 3.2 4.1 4.1 4.1 5.2"
              stroke="currentColor" strokeLinecap="round" />
        <circle cx="6.5" cy="10" r="0.65" fill="currentColor" />
      </svg>
    </span>
  );
}

export default function AccountDetails({ onClose }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangePin, setShowChangePin] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userData, setUserData] = useState(CURRENT_USER);
  const u = userData;

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.content}>

        {/* ── Header ───────────────────────────────────────── */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Account details</h1>
          <div className={styles.pageActions}>
            <IconButton aria-label="Edit account" tooltip="Edit" onClick={() => setShowEdit(true)}>
              <IconEdit size={16} />
            </IconButton>
            <IconButton aria-label="Close" tooltip="Close" onClick={onClose}>
              <IconClose size={16} />
            </IconButton>
          </div>
        </div>

        {/* ── Fields ───────────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.avatarCircle}>{u.initials}</div>
          <div className={styles.fieldsGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Name</span>
              <span className={styles.fieldValue}>{u.name}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Surname</span>
              <span className={styles.fieldValue}>{u.surname}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Email</span>
              <span className={styles.fieldValue}>{u.email}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Phone number</span>
              <span className={styles.fieldValue}>{u.phone || '—'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Date of birth</span>
              <span className={styles.fieldValue}>{u.dob || '—'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Gender</span>
              <span className={styles.fieldValue}>{u.gender || '—'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Height</span>
              <span className={styles.fieldValue}>{u.height ? `${u.height} cm` : '—'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Weight</span>
              <span className={styles.fieldValue}>{u.weight ? `${u.weight} kg` : '—'}</span>
            </div>
          </div>
        </section>

        <div className={styles.divider} />

        {/* ── SECURITY ─────────────────────────────────────── */}
        <section className={styles.section}>
          <span className={styles.sectionLabel}>Security</span>
          <button className={styles.securityAction} onClick={() => setShowChangePassword(true)}>Change password</button>
          <button className={styles.securityAction} onClick={() => setShowChangePin(true)}>
            {userData.hasPIN ? 'Change PIN' : 'Set new PIN'}
          </button>
        </section>

        </div>
      </div>

      {showEdit && (
        <EditAccountDrawer
          user={userData}
          onClose={() => setShowEdit(false)}
          onSave={patch => setUserData(prev => ({ ...prev, ...patch }))}
          onDeleteAccount={() => { setShowEdit(false); setShowDeleteConfirm(true); }}
        />
      )}

      {showDeleteConfirm && (
        <DeleteOrgModal
          label="account"
          org={{ name: `${userData.name} ${userData.surname}` }}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={onClose}
        />
      )}

      {showChangePassword && (
        <ChangePasswordDrawer onClose={() => setShowChangePassword(false)} />
      )}

      {showChangePin && (
        <ChangePinDrawer
          hasPIN={userData.hasPIN}
          onClose={() => setShowChangePin(false)}
          onSuccess={() => setUserData(prev => ({ ...prev, hasPIN: true }))}
        />
      )}

    </div>
  );
}
