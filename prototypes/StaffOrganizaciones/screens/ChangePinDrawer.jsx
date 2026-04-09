import { useState, useRef } from 'react';
import Button     from '../../../design-system/components/Button/Button';
import { IconClose, IconEye, IconEyeClosed } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Toast      from '../../../design-system/components/Toast/Toast';
import shared     from './EditAccountDrawer.module.css';
import styles     from './ChangePinDrawer.module.css';

const PIN_LENGTH = 4;
const MOCK_CURRENT_PIN = '1234';

function PinInput({ label, value, onChange, hasError, autoFocus }) {
  const refs      = useRef([]);
  const [show, setShow] = useState(false);

  function handleChange(i, e) {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const arr  = value.split('');
    arr[i]     = char;
    onChange(arr.join(''));
    if (char && i < PIN_LENGTH - 1) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const text   = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH);
    const padded = text.padEnd(PIN_LENGTH, ' ').slice(0, PIN_LENGTH);
    onChange(padded.trimEnd());
    refs.current[Math.min(text.length, PIN_LENGTH - 1)]?.focus();
  }

  return (
    <div className={styles.pinField}>
      <span className={styles.pinLabel}>{label}</span>
      <div className={styles.pinRow}>
        <div className={styles.pinBoxes} onPaste={handlePaste}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <input
              key={i}
              ref={el => (refs.current[i] = el)}
              className={`${styles.pinBox}${hasError ? ` ${styles.pinBoxError}` : ''}`}
              type={show ? 'text' : 'password'}
              inputMode="numeric"
              maxLength={1}
              value={value[i] ?? ''}
              onChange={e => handleChange(i, e)}
              onKeyDown={e => handleKeyDown(i, e)}
              autoFocus={autoFocus && i === 0 ? true : undefined}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.eyeBtn}
          aria-label={show ? 'Hide PIN' : 'Show PIN'}
          onClick={() => setShow(s => !s)}
        >
          {show ? <IconEye size={16} /> : <IconEyeClosed size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePinDrawer({ hasPIN = false, onClose, onSuccess }) {
  const [current,      setCurrent]      = useState('');
  const [next,         setNext]         = useState('');
  const [confirm,      setConfirm]      = useState('');
  const [errorCurrent, setErrorCurrent] = useState('');
  const [errorConfirm, setErrorConfirm] = useState('');
  const [toast,        setToast]        = useState(false);

  const canSave =
    current.length === PIN_LENGTH &&
    next.length    === PIN_LENGTH &&
    confirm.length === PIN_LENGTH;

  function handleSave() {
    setErrorCurrent('');
    setErrorConfirm('');

    if (current !== MOCK_CURRENT_PIN) {
      setErrorCurrent('Incorrect PIN');
      return;
    }
    if (next !== confirm) {
      setErrorConfirm("PINs don't match");
      return;
    }

    setToast(true);
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 1800);
  }

  return (
    <>
      {toast && (
        <Toast mode="success" duration={1500} onClose={() => setToast(false)}>
          PIN updated
        </Toast>
      )}

      <div className={shared.overlay} onMouseDown={onClose}>
        <div className={`${shared.drawer} ${styles.drawerNarrow}`} onMouseDown={e => e.stopPropagation()}>

          {/* ── Header ── */}
          <div className={shared.header}>
            <h2 className={shared.title}>{hasPIN ? 'Change PIN' : 'Set new PIN'}</h2>
            <IconButton aria-label="Close" onClick={onClose}>
              <IconClose size={16} />
            </IconButton>
          </div>

          {/* ── Body ── */}
          <div className={shared.body}>
            <div className={shared.section}>

              <div className={styles.pinGroup}>
                <PinInput
                  label="Current PIN"
                  value={current}
                  onChange={v => { setCurrent(v); setErrorCurrent(''); }}
                  hasError={!!errorCurrent}
                  autoFocus
                />
                {errorCurrent && <span className={styles.error}>{errorCurrent}</span>}
              </div>

              <PinInput
                label="New PIN"
                value={next}
                onChange={v => { setNext(v); setErrorConfirm(''); }}
              />

              <div className={styles.pinGroup}>
                <PinInput
                  label="Confirm new PIN"
                  value={confirm}
                  onChange={v => { setConfirm(v); setErrorConfirm(''); }}
                  hasError={!!errorConfirm}
                />
                {errorConfirm && <span className={styles.error}>{errorConfirm}</span>}
              </div>

            </div>
          </div>

          {/* ── Footer ── */}
          <div className={shared.footer}>
            <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
            <Button
              variant="primary"
              size="m"
              disabled={!canSave}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>

        </div>
      </div>
    </>
  );
}
