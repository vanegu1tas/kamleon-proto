import styles from './ChooseTeamScreen.module.css';
import { TEAMS } from '../../data/mockFlowData';

export default function ChooseTeamScreen({ onSelect, onClose }) {
  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h1 className={styles.title}>Choose your team</h1>
      </div>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {TEAMS.map(team => (
            <button key={team.id} className={styles.team} onClick={() => onSelect(team)}>
              <span className={styles.avatar} />
              <span className={styles.name}>{team.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
