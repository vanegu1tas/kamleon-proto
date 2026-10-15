import styles from './ChooseAvatarScreen.module.css';
import { AVATARS, initialsFor } from '../../../../data/mockFlowData';

export default function ChooseAvatarScreen({ onSelect, onClose }) {
  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h1 className={styles.title}>Choose your profile</h1>
      </div>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div className={styles.body}>
        <button className={styles.arrow} aria-label="Previous page">
          <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
            <path d="M12 2L2 12L12 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={styles.grid}>
          {AVATARS.map(avatar => (
            <button key={avatar.id} className={styles.avatarButton} onClick={() => onSelect(avatar)}>
              {avatar.photo
                ? <img className={styles.avatar} src={avatar.photo} alt="" />
                : <span className={styles.fallback}>{avatar.initials ?? initialsFor(avatar.name)}</span>}
              <span className={styles.name}>{avatar.name}</span>
            </button>
          ))}
        </div>

        <button className={styles.arrow} aria-label="Next page">
          <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
            <path d="M2 2L12 12L2 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className={styles.dots}>
        <span className={`${styles.dot} ${styles.dotActive}`} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>

      <div className={styles.logo}>KAMLEON®</div>
    </div>
  );
}
