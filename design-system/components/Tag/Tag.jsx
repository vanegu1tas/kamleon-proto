import styles from './Tag.module.css';

const LABELS = {
  active:       'Active',
  inactive:     'Inactive',
  professional: 'Professional',
  user:         'User',
};

// Role variants don't use a dot indicator
const NO_DOT = new Set(['professional', 'user']);

/**
 * Tag de estado o rol.
 *
 * @param {('active'|'inactive'|'professional'|'user')} status
 * @param {string} [label] - Override the default label text
 */
export default function Tag({ status = 'active', label }) {
  return (
    <span className={`${styles.tag} ${styles[status]}`}>
      {!NO_DOT.has(status) && <span className={styles.dot} />}
      <span className={styles.label}>
        {label ?? LABELS[status] ?? status}
      </span>
    </span>
  );
}
