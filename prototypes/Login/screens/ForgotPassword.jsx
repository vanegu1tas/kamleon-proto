import { useState } from 'react';
import styles from './ForgotPassword.module.css';
import Input from '../../../design-system/components/Input/Input';
import Button from '../../../design-system/components/Button/Button';

export default function ForgotPassword({ onNavigate, animPhase = '' }) {
  const [email, setEmail] = useState('');

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className={styles.page}>

      <div className={styles.formArea}>
        <div className={animPhase ? styles[animPhase] : styles.form}>

          <div className={styles.header}>
            <h1 className={styles.title}>Forgot password?</h1>
            <p className={styles.subtitle}>
              Enter your email and we will send you a link to reset your password.
            </p>
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="user@company.com"
            value={email}
            onChange={setEmail}
          />

          <Button
            size="s"
            style={{ width: '100%' }}
            disabled={!isValidEmail}
            onClick={() => onNavigate('check-inbox', { email })}
          >
            Send link
          </Button>

          <button className={styles.backLink} onClick={() => onNavigate('signin')}>
            Back to login
          </button>

        </div>
      </div>

      <div className={styles.imageBox} />

    </div>
  );
}
