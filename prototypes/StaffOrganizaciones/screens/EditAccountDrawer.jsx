import { useState } from 'react';
import Button    from '../../../design-system/components/Button/Button';
import Input     from '../../../design-system/components/Input/Input';
import Dropdown  from '../../../design-system/components/Dropdown/Dropdown';
import { IconClose, IconAddImage } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Toast     from '../../../design-system/components/Toast/Toast';
import styles from './EditAccountDrawer.module.css';

const GENDER_OPTIONS = [
  { value: '',       label: 'Select...' },
  { value: 'Male',   label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other',  label: 'Other' },
];

export default function EditAccountDrawer({ user, onClose, onSave, onDeleteAccount }) {
  const [name,     setName]     = useState(user.name    ?? '');
  const [surname,  setSurname]  = useState(user.surname ?? '');
  const [phone,    setPhone]    = useState(user.phone   ?? '');
  const [dobDay,   setDobDay]   = useState(() => (user.dob ?? '').split('/')[0] ?? '');
  const [dobMonth, setDobMonth] = useState(() => (user.dob ?? '').split('/')[1] ?? '');
  const [dobYear,  setDobYear]  = useState(() => (user.dob ?? '').split('/')[2] ?? '');
  const [gender,   setGender]   = useState(user.gender  ?? '');
  const [height,   setHeight]   = useState(user.height  ?? '');
  const [weight,   setWeight]   = useState(user.weight  ?? '');
  const [toast,    setToast]    = useState(false);

  const dob = [dobDay, dobMonth, dobYear].filter(Boolean).join('/');
  const origDob = user.dob ?? '';

  const hasChanges =
    name    !== (user.name    ?? '') ||
    surname !== (user.surname ?? '') ||
    phone   !== (user.phone   ?? '') ||
    dob     !== origDob              ||
    gender  !== (user.gender  ?? '') ||
    height  !== (user.height  ?? '') ||
    weight  !== (user.weight  ?? '');

  function handleSave() {
    onSave?.({ name, surname, phone, dob, gender, height, weight });
    setToast(true);
    setTimeout(onClose, 1800);
  }

  return (
    <>
      {toast && (
        <Toast mode="success" duration={1500} onClose={() => setToast(false)}>
          Changes saved
        </Toast>
      )}

      <div className={styles.overlay} onMouseDown={onClose}>
        <div className={styles.drawer} onMouseDown={e => e.stopPropagation()}>

          {/* ── Header ── */}
          <div className={styles.header}>
            <h2 className={styles.title}>Edit account</h2>
            <IconButton aria-label="Close" onClick={onClose}>
              <IconClose size={16} />
            </IconButton>
          </div>

          {/* ── Body ── */}
          <div className={styles.body}>

            {/* Avatar */}
            <div className={styles.avatarRow}>
              <button className={styles.avatarBtn} type="button" aria-label="Change photo">
                <div className={styles.avatar}>
                  {name.trim().charAt(0).toUpperCase() || user.initials?.[0] || '?'}
                </div>
                <div className={styles.avatarOverlay}>
                  <IconAddImage size={20} />
                </div>
              </button>
              <span className={styles.avatarHintAction}>Add picture</span>
            </div>

            {/* Account info */}
            <div className={styles.section}>

              <Input
                label="Email"
                value={user.email ?? ''}
                disabled
                description="Email cannot be changed"
              />

              <div className={styles.fieldRow}>
                <Input
                  label="Name"
                  value={name}
                  onChange={setName}
                  placeholder="Name"
                  autoFocus
                />
                <Input
                  label="Surname"
                  value={surname}
                  onChange={setSurname}
                  placeholder="Surname"
                />
              </div>

              <div className={styles.fieldRow}>
                <Input
                  label="Phone number"
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  placeholder="+34 600 000 000"
                />
                <Dropdown
                  label="Gender"
                  value={gender}
                  onChange={setGender}
                  options={GENDER_OPTIONS}
                />
              </div>

              <div className={styles.field}>
                <span className={styles.dateLabel}>Date of birth</span>
                <div className={styles.dateInputs}>
                    <input
                      className={styles.dateInput}
                      placeholder="DD"
                      value={dobDay}
                      onChange={e => setDobDay(e.target.value)}
                      maxLength={2}
                    />
                    <input
                      className={styles.dateInput}
                      placeholder="MM"
                      value={dobMonth}
                      onChange={e => setDobMonth(e.target.value)}
                      maxLength={2}
                    />
                    <input
                      className={styles.dateInput}
                      placeholder="YYYY"
                      value={dobYear}
                      onChange={e => setDobYear(e.target.value)}
                      maxLength={4}
                    />
                  </div>
                </div>

              <div className={styles.fieldRow}>
                <Input
                  label="Height"
                  value={height}
                  onChange={setHeight}
                  placeholder="0"
                  suffix="cm"
                />
                <Input
                  label="Weight"
                  value={weight}
                  onChange={setWeight}
                  placeholder="0"
                  suffix="kg"
                />
              </div>
            </div>

            <button type="button" className={styles.deleteLink} onClick={onDeleteAccount}>
              Delete account
            </button>

          </div>

          {/* ── Footer ── */}
          <div className={styles.footer}>
            <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
            <Button
              variant="primary"
              size="m"
              disabled={!hasChanges || !name.trim()}
              onClick={handleSave}
            >
              Save changes
            </Button>
          </div>

        </div>
      </div>
    </>
  );
}
