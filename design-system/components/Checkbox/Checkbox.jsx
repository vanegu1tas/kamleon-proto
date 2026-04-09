import styles from './Checkbox.module.css';

function CheckIcon() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
      <path className={styles.checkPath} d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Checkbox({ checked = false, onChange, label, disabled = false, id }) {
  return (
    <label className={`${styles.wrap} ${disabled ? styles.disabled : ''}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={e => onChange?.(e.target.checked)}
        disabled={disabled}
        className={styles.input}
      />
      <span className={styles.boxWrap}>
      <span className={`${styles.box} ${checked ? styles.checked : ''}`}>
        {checked && <CheckIcon />}
      </span>
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
