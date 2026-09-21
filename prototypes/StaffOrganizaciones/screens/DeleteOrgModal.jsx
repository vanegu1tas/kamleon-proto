import { useState } from 'react';
import styles from './DeleteOrgModal.module.css';

// `requireTyping`: para lo que se lleva por delante a otras cosas (una organización, un centro,
// un equipo) hay que escribir DELETE antes de poder confirmar — Figma 13073:137156.
const DELETE_WORD = 'DELETE';

export default function DeleteOrgModal({ org, onClose, onConfirm, label = 'organization', requireTyping = false, children }) {
  const [confirmText, setConfirmText] = useState('');
  const canDelete = !requireTyping || confirmText.trim().toUpperCase() === DELETE_WORD;
  const inputId = `delete-confirm-${label}`;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={e => e.stopPropagation()}>

        <div className={styles.content}>
          <h2 className={styles.title}>Delete {label}</h2>
          <p className={styles.body}>
            Are you sure to delete <strong className={styles.orgName}>{org.name}</strong>?
          </p>
          {children}
        </div>

        {requireTyping && (
          <div className={styles.confirmField}>
            <label className={styles.confirmLabel} htmlFor={inputId}>Type {DELETE_WORD} to confirm</label>
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
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}
