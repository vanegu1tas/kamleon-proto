import { useState } from 'react';
import styles from './DeleteOrgModal.module.css';

// `requireTyping`: para lo que se lleva por delante a otras cosas (una organización, un centro,
// un equipo) hay que escribir DELETE antes de poder confirmar — Figma 13073:137156.
const DELETE_WORD = 'DELETE';

// Devices (Daniel, 30/10): misma mecánica, pero lo que se escribe es el ID del device y la
// acción puede ser "Remove" (quitarlo de su unit) en vez de "Delete". `confirmWord`, `verb` y
// `message` son opcionales: sin ellos el modal es el de siempre.
export default function DeleteOrgModal({
  org, onClose, onConfirm, label = 'organization', requireTyping = false,
  confirmWord = DELETE_WORD, verb = 'Delete', title, message, children,
}) {
  const [confirmText, setConfirmText] = useState('');
  const canDelete = !requireTyping || confirmText.trim().toUpperCase() === String(confirmWord).toUpperCase();
  const inputId = `delete-confirm-${label}`;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={e => e.stopPropagation()}>

        <div className={styles.content}>
          <h2 className={styles.title}>{title ?? `${verb} ${label}`}</h2>
          <p className={styles.body}>
            {message ?? <>Are you sure to {verb.toLowerCase()} <strong className={styles.orgName}>{org.name}</strong>?</>}
          </p>
          {children}
        </div>

        {requireTyping && (
          <div className={styles.confirmField}>
            <label className={styles.confirmLabel} htmlFor={inputId}>Type {confirmWord} to confirm</label>
            <input
              id={inputId}
              className={styles.confirmInput}
              placeholder="Write here"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              autoComplete="off"
              autoFocus
            />
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            className={styles.deleteBtn}
            disabled={!canDelete}
            onClick={() => { onConfirm?.(); onClose(); }}
          >
            {verb}
          </button>
        </div>

      </div>
    </div>
  );
}
