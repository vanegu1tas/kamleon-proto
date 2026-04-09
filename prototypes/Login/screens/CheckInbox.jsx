import { useState, useEffect } from 'react';
import styles from './CheckInbox.module.css';
import Button from '../../../design-system/components/Button/Button';

const RESEND_SECONDS = 60;

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
}

export default function CheckInbox({ onNavigate, animPhase = '', email = '' }) {
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  function handleResend() {
    setSeconds(RESEND_SECONDS);
  }

  return (
    <div className={styles.page}>

      <div className={styles.formArea}>
        <div className={animPhase ? styles[animPhase] : styles.form}>

          <h1 className={styles.title}>Check your inbox</h1>

          <p className={styles.description}>
            We sent a link to <strong>{email}</strong>.{' '}
            It expires in 30 minutes.
          </p>

          <p className={styles.resendRow}>
            <span className={styles.resendLabel}>Didn't receive it?</span>
            {seconds > 0 ? (
              <span className={styles.resendCountdown}>Resend in {formatTime(seconds)}</span>
            ) : (
              <button className={styles.resendButton} onClick={handleResend}>
                Resend email
              </button>
            )}
          </p>

          <Button
            size="s"
            style={{ width: '100%' }}
            onClick={() => onNavigate('signin')}
          >
            Back to login
          </Button>

          <div className={styles.protoHint}>
            <span className={styles.protoLabel}>Prototype only</span>
            <Button
              variant="secondary"
              size="s"
              style={{ width: '100%' }}
              onClick={() => onNavigate('reset-password')}
            >
              Open reset link
            </Button>
          </div>

        </div>
      </div>

      <div className={styles.imageBox} />

    </div>
  );
}
