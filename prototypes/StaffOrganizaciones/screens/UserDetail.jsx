import { useState } from 'react';
import { IconSettings, IconTrash } from '../../../design-system/icons/outline';
import { IconMailFilled, IconPhoneFilled } from '../../../design-system/icons/filled';
import styles from './UserDetail.module.css';

// ─── Icons ──────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 5h10M6 5V3.5h4V5M5.5 5l.5 7.5h4l.5-7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 6l6 4 6-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5.5 2.5h-1a2 2 0 00-2 2c0 5.523 4.477 10 10 10a2 2 0 002-2v-1a1 1 0 00-.684-.948l-2-1a1 1 0 00-1.032.22l-.86.86a7.5 7.5 0 01-3.056-3.056l.86-.86a1 1 0 00.22-1.032l-1-2A1 1 0 005.5 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 7.5h12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GenderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="9.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 6l3-3m0 0h-2.5m2.5 0v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 4.5L8 2l3 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 11.5L8 14l3-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WeightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2.5 8h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M1 6v4M15 6v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3.5 4.5v7M12.5 4.5v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RFIDIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="4.5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12.5 6.5c.83.83.83 2.17 0 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14.5 4.5c1.93 1.93 1.93 5.07 0 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PINIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5.5" cy="6.5" r="0.9" fill="currentColor" />
      <circle cx="8"   cy="6.5" r="0.9" fill="currentColor" />
      <circle cx="10.5" cy="6.5" r="0.9" fill="currentColor" />
      <circle cx="5.5" cy="9.5" r="0.9" fill="currentColor" />
      <circle cx="8"   cy="9.5" r="0.9" fill="currentColor" />
      <circle cx="10.5" cy="9.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function AddImageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3.5" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5.5" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 11l3.5-3 3 3 2-2 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

// ─── Field group ─────────────────────────────────────────

function Field({ label, required, children }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>
        {label}{required && <span className={styles.required}> *</span>}
      </span>
      {children}
    </div>
  );
}

// ─── Setting row (toggle) ─────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────

function initForm(u) {
  const parts = u.name.split(' ');
  return {
    firstName:   parts[0] ?? '',
    surname:     parts.slice(1).join(' '),
    email:       u.email,
    phone:       u.phone,
    height:      u.height.replace(' cm', ''),
    weight:      u.weight.replace(' kg', ''),
    gender:      u.gender,
    birthdayDD:  u.birthday.split('/')[0] ?? '',
    birthdayMM:  u.birthday.split('/')[1] ?? '',
    birthdayYYYY: u.birthday.split('/')[2] ?? '',
    status:      u.status === 'active',
    rfid:        u.rfid,
    pin:         u.pin,
  };
}

// ─── Component ───────────────────────────────────────────

export default function UserDetail({ user: initialUser, team, onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(initialUser);
  const [form, setForm] = useState(() => initForm(initialUser));
  const [originalForm, setOriginalForm] = useState(() => initForm(initialUser));

  const isDirty = Object.keys(form).some(k => form[k] !== originalForm[k]);

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleEdit() {
    const snapshot = initForm(userData);
    setForm(snapshot);
    setOriginalForm(snapshot);
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  function handleSave() {
    setUserData({
      ...userData,
      name:     `${form.firstName} ${form.surname}`.trim(),
      email:    form.email,
      phone:    form.phone,
      height:   `${form.height} cm`,
      weight:   `${form.weight} kg`,
      gender:   form.gender,
      birthday: `${form.birthdayDD}/${form.birthdayMM}/${form.birthdayYYYY}`,
      status:   form.status ? 'active' : 'inactive',
      rfid:     form.rfid,
      pin:      form.pin,
    });
    setIsEditing(false);
  }

  const u = userData;

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        {/* ── Back button ──────────────────────────────── */}
        <button className={styles.backBtn} onClick={onBack}>
          <span className={styles.backIcon}><ArrowLeftIcon /></span>
          <span className={styles.backLabel}>Back</span>
        </button>

        {isEditing ? (
          /* ══════════════ EDIT MODE ══════════════════════ */
          <>
            {/* Avatar + add picture */}
            <div className={styles.editAvatarRow}>
              <div className={styles.avatar}>{u.name.charAt(0)}</div>
              <div className={styles.addPictureGroup}>
                <button className={styles.addPictureBtn} type="button">
                  <AddImageIcon />
                  <span>Add another picture</span>
                </button>
                <span className={styles.addPictureSep}>-</span>
                <span className={styles.addPictureOptional}>Optional</span>
              </div>
            </div>

            {/* User info */}
            <div className={styles.editSection}>
              <p className={styles.editSectionHeading}>User info</p>

              <div className={styles.formRow}>
                <Field label="Name" required>
                  <input className={styles.input} value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="First name" />
                </Field>
                <Field label="Surname">
                  <input className={styles.input} value={form.surname} onChange={e => set('surname', e.target.value)} placeholder="Surname" />
                </Field>
              </div>

              <div className={styles.formRow}>
                <Field label="Email">
                  <input className={styles.input} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                </Field>
                <Field label="Phone number">
                  <input className={styles.input} type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+00 000 000 00 00" />
                </Field>
              </div>

              <div className={styles.formRow}>
                <Field label="Height (CM)">
                  <input className={styles.input} type="number" value={form.height} onChange={e => set('height', e.target.value)} placeholder="175" />
                </Field>
                <Field label="Weight">
                  <input className={styles.input} type="number" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="70" />
                </Field>
              </div>

              <div className={styles.formRow}>
                <Field label="Gender">
                  <input className={styles.input} value={form.gender} onChange={e => set('gender', e.target.value)} placeholder="Male / Female" />
                </Field>
                <Field label="Date of birth">
                  <div className={styles.dateRow}>
                    <input className={`${styles.input} ${styles.inputDate}`} value={form.birthdayDD} onChange={e => set('birthdayDD', e.target.value)} placeholder="DD" maxLength={2} />
                    <input className={`${styles.input} ${styles.inputDate}`} value={form.birthdayMM} onChange={e => set('birthdayMM', e.target.value)} placeholder="MM" maxLength={2} />
                    <input className={`${styles.input} ${styles.inputDate}`} value={form.birthdayYYYY} onChange={e => set('birthdayYYYY', e.target.value)} placeholder="YYYY" maxLength={4} />
                  </div>
                </Field>
              </div>
            </div>

            {/* Account settings */}
            <div className={styles.editSection}>
              <p className={styles.editSectionHeading}>Account settings</p>
              <div className={styles.settingsGroup}>
                <SettingRow
                  label="Status"
                  description="Once deactivated, the user won't be able to log in until you enable it again."
                  checked={form.status}
                  onChange={v => set('status', v)}
                />
                <SettingRow
                  label="RFID"
                  description="Enable proximity device access for this user."
                  checked={form.rfid}
                  onChange={v => set('rfid', v)}
                />
                <SettingRow
                  label="Set PIN"
                  description="Enabling this requires the user to enter a personal PIN to log in."
                  checked={form.pin}
                  onChange={v => set('pin', v)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className={styles.formFooter}>
              <button className={styles.cancelBtn} type="button" onClick={handleCancel}>Cancel</button>
              <button className={styles.saveBtn} type="button" onClick={handleSave} disabled={!isDirty}>Save changes</button>
            </div>
          </>

        ) : (
          /* ══════════════ VIEW MODE ══════════════════════ */
          <>
            {/* User header */}
            <div className={styles.userHeader}>
              <div className={styles.userHeaderLeft}>
                <div className={styles.avatar}>{u.name.charAt(0)}</div>
                <div className={styles.userMeta}>
                  <h1 className={styles.userName}>{u.name}</h1>
                  <div className={styles.userSubtitle}>
                    <span>{team.name}</span>
                    <span className={styles.sep}>|</span>
                    <div className={styles.statusBadge}>
                      <div className={`${styles.statusDot} ${styles[u.status]}`} />
                      <span>{u.status === 'active' ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.actions}>
                <button className={`${styles.actionBtn} ${styles.actionBtnTooltip}`} aria-label="Configuración de usuario" data-tooltip="Settings" onClick={handleEdit}>
                  <IconSettings size={16} />
                </button>
                <button className={`${styles.actionBtn} ${styles.actionBtnTooltip}`} aria-label="Eliminar usuario" data-tooltip="Delete">
                  <IconTrash size={16} />
                </button>
              </div>
            </div>

            <div className={styles.sections}>
              {/* Personal Information */}
              <div className={styles.section}>
                <p className={styles.sectionLabel}>Personal Information</p>
                <div className={styles.infoGrid}>
                  <div className={styles.infoCol}>
                    <div className={styles.infoItem}><IconMailFilled size={16} /><span>{u.email}</span></div>
                    <div className={styles.infoItem}><IconPhoneFilled size={16} /><span>{u.phone}</span></div>
                  </div>
                  <div className={styles.infoCol}>
                    <div className={styles.infoItem}><CalendarIcon /><span>{u.birthday}</span></div>
                    <div className={styles.infoItem}><GenderIcon /><span>{u.gender}</span></div>
                  </div>
                  <div className={styles.infoCol}>
                    <div className={styles.infoItem}><HeightIcon /><span>{u.height}</span></div>
                    <div className={styles.infoItem}><WeightIcon /><span>{u.weight}</span></div>
                  </div>
                </div>
              </div>

              {/* Login Permissions */}
              <div className={styles.section}>
                <p className={styles.sectionLabel}>Login Permissions</p>
                <div className={styles.permissionsRow}>
                  <div className={styles.infoItem}><RFIDIcon /><span>RFID: {u.rfid ? 'On' : 'Off'}</span></div>
                  <div className={styles.infoItem}><PINIcon /><span>PIN: {u.pin ? 'On' : 'Off'}</span></div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
