import styles from './Tag.module.css';

/**
 * Tag de estado
 *
 * Muestra el estado activo/inactivo de una entidad (organización, centro, equipo, usuario).
 *
 * @param {('active'|'inactive')} status - Estado de la entidad
 */
export default function Tag({ status = 'active' }) {
  return (
    <span className={`${styles.tag} ${styles[status]}`}>
      <span className={styles.dot} />
      <span className={styles.label}>
        {status === 'active' ? 'Active' : 'Inactive'}
      </span>
    </span>
  );
}
