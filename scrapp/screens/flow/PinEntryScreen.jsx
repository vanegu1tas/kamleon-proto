import { useState, useEffect } from 'react';
import styles from './PinEntryScreen.module.css';
import { initialsFor } from '../../data/mockFlowData';

const PIN_LENGTH = 6;

export default function PinEntryScreen({ avatar, onComplete, onBack, onClose }) {
  const [pin, setPin] = useState([]);
  const firstName = avatar.name.split(' ')[0];

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      const t = setTimeout(() => onComplete(pin.join('')), 300);
      return () => clearTimeout(t);
    }
  }, [pin, onComplete]);

  function pressDigit(d) {
    if (pin.length >= PIN_LENGTH) return;
    setPin(prev => [...prev, d]);
  }

  function pressBackspace() {
    setPin(prev => prev.slice(0, -1));
  }

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h1 className={styles.title}>Enter your pin</h1>
      </div>
      {onBack && (
        <button className={styles.backButton} onClick={onBack} aria-label="Back">
          <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
            <path d="M12 2L2 12L12 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <button className={styles.closeButton} onClick={onClose} aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div className={styles.divider} />

      <div className={styles.left}>
        <p className={styles.welcome}>Welcome back<br />{firstName}</p>
        {avatar.photo
          ? <img className={styles.avatar} src={avatar.photo} alt="" />
          : <span className={styles.fallback}>{avatar.initials ?? initialsFor(avatar.name)}</span>}
      </div>

      <div className={styles.right}>
        <div className={styles.dots}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <span key={i} className={`${styles.dot} ${i < pin.length ? styles.dotFilled : ''}`} />
          ))}
        </div>

        <div className={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} className={styles.key} onClick={() => pressDigit(n)}>{n}</button>
          ))}
          <button className={styles.key} onClick={() => pressDigit(0)}>0</button>
          <button className={styles.key} onClick={pressBackspace} aria-label="Delete">
            <svg width="30" height="22" viewBox="0 0 30 22" fill="none">
              <path d="M10 1H27a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H10L1 11l9-10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M14 7l8 8M22 7l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
