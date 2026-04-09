import { useState } from 'react';
import styles from './SignIn.module.css';
import Input from '../../../design-system/components/Input/Input';
import Button from '../../../design-system/components/Button/Button';
import Toast from '../../../design-system/components/Toast/Toast';

export default function SignIn({ onNavigate, animPhase = '', toast = '', onDismissToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={styles.page}>

      {toast && (
        <Toast
          mode="success"
          message={toast}
          onClose={onDismissToast}
          duration={6000}
          delay={300}
        />
      )}

      {/* Form — left half, vertically centered */}
      <div className={styles.formArea}>
        <div className={animPhase ? styles[animPhase] : styles.form}>
          <h1 className={styles.title}>Log in</h1>

          <Input
            label="Email"
            type="email"
            placeholder="user@company.com"
            value={email}
            onChange={setEmail}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
          />

          <button className={styles.forgotLink} onClick={() => onNavigate('forgot')}>
            Forgot password?
          </button>

          <Button size="s" style={{ width: '100%' }} onClick={() => onNavigate('workspace-selector')}>
            Log in
          </Button>

          <p className={styles.signupRow}>
            Don't have an account?{' '}
            <button className={styles.signupLink} onClick={() => onNavigate('signup')}>
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Image placeholder — right side */}
      <div className={styles.imageBox} />

    </div>
  );
}
