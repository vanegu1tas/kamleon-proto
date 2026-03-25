import styles from './DeleteOrgModal.module.css';

export default function DeleteOrgModal({ org, onClose, onConfirm, label = 'organization' }) {
  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={e => e.stopPropagation()}>

        <div className={styles.content}>
          <h2 className={styles.title}>Delete {label}</h2>
          <p className={styles.body}>
            Are you sure to delete <strong className={styles.orgName}>{org.name}</strong>?
          </p>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.deleteBtn} onClick={() => { onConfirm?.(); onClose(); }}>Delete</button>
        </div>

      </div>
    </div>
  );
}
