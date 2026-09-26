import styles from './Tag.module.css';

const LABELS = {
  active:    'Active',
  inactive:  'Inactive',
  pending:   'Pending',
  expired:   'Expired',
  delay:     'Delay',
  delivered: 'Delivered',
};

/**
 * Tag de estado. Dos familias, y no deben mezclarse:
 *   ciclo de vida    active · inactive · pending · expired
 *   envio de correo  delay · delivered
 *
 * La familia de rol (user / professional) se elimino el 26/9: solo la usaba V1,
 * que esta congelada. En V2 el rol se muestra como texto plano.
 *
 * @param {('active'|'inactive'|'pending'|'expired'|'delay'|'delivered')} status
 * @param {string} [label] - Override the default label text
 */
export default function Tag({ status = 'active', label }) {
  return (
    <span className={`${styles.tag} ${styles[status]}`}>
      <span className={styles.dot} />
      <span className={styles.label}>
        {label ?? LABELS[status] ?? status}
      </span>
    </span>
  );
}
