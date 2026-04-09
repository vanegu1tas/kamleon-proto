import { useState } from 'react';
import Button    from '../../../design-system/components/Button/Button';
import Input     from '../../../design-system/components/Input/Input';
import { IconClose } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Toast     from '../../../design-system/components/Toast/Toast';
import styles from './EditAccountDrawer.module.css';

// Mock — contraseña actual del usuario
const MOCK_CURRENT_PASSWORD = 'password123';

export default function ChangePasswordDrawer({ onClose }) {
  const [current,  setCurrent]  = useState('');
  const [next,     setNext]     = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [errorCurrent, setErrorCurrent] = useState('');
  const [errorConfirm, setErrorConfirm] = useState('');
  const [toast,    setToast]    = useState(false);

  const canSave = current.trim() && next.trim() && confirm.trim();

  function handleSave() {
    setErrorCurrent('');
    setErrorConfirm('');

    if (current !== MOCK_CURRENT_PASSWORD) {
      setErrorCurrent('Incorrect password');
      return;
    }
    if (next !== confirm) {
      setErrorConfirm("Passwords don't match");
      return;
    }

    setToast(true);
    setTimeout(onClose, 1800);
  }

  return (
    <>
      {toast && (
        <Toast mode="success" duration={1500} onClose={() => setToast(false)}>
          Password updated
        </Toast>
      )}

      <div className={styles.overlay} onMouseDown={onClose}>
        <div className={styles.drawer} onMouseDown={e => e.stopPropagation()}>

          {/* ── Header ── */}
          <div className={styles.header}>
            <h2 className={styles.title}>Change password</h2>
            <IconButton aria-label="Close" onClick={onClose}>
              <IconClose size={16} />
            </IconButton>
          </div>

          {/* ── Body ── */}
          <div className={styles.body}>
            <div className={styles.section}>
              <Input
                label="Current password"
                type="password"
                value={current}
                onChange={v => { setCurrent(v); setErrorCurrent(''); }}
                placeholder="Enter current password"
                error={errorCurrent}
                autoFocus
              />
              <Input
                label="New password"
                type="password"
                value={next}
                onChange={v => { setNext(v); setErrorConfirm(''); }}
                placeholder="Enter new password"
              />
              <Input
                label="Confirm new password"
                type="password"
                value={confirm}
                onChange={v => { setConfirm(v); setErrorConfirm(''); }}
                placeholder="Confirm new password"
                error={errorConfirm}
              />
            </div>
          </div>

          {/* ── Footer ── */}
          <div className={styles.footer}>
            <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
            <Button
              variant="primary"
              size="m"
              disabled={!canSave}
              onClick={handleSave}
            >
              Save password
            </Button>
          </div>

        </div>
      </div>
    </>
  );
}
