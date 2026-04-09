import { useState } from 'react';
import styles from './ResetPassword.module.css';
import Input from '../../../design-system/components/Input/Input';
import Button from '../../../design-system/components/Button/Button';

export default function ResetPassword({ onNavigate, email = '' }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');

  const passwordsMatch = !confirm || password === confirm;
  const canSubmit = password.length >= 8 && confirm && passwordsMatch;

  function handleSubmit() {
    onNavigate('signin', { toast: 'Password updated successfully' });
  }

  return (
    <div className={styles.page}>

      <div className={styles.formArea}>
        <div className={styles.form}>

          <div className={styles.header}>
            <h1 className={styles.title}>Reset your password</h1>
            <p className={styles.subtitle}>
              Choose a new password for <strong>{email}</strong>
            </p>
          </div>

          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={setPassword}
          />

          <Input
            label="Confirm new Password"
            type="password"
            placeholder="Enter new password"
            value={confirm}
            onChange={setConfirm}
            error={!passwordsMatch ? "Passwords don't match" : undefined}
          />

          <Button
            size="s"
            style={{ width: '100%' }}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Set new password
          </Button>

        </div>
      </div>

    </div>
  );
}
