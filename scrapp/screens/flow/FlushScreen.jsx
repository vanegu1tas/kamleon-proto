import styles from './FlushScreen.module.css';
import RingLoader from '../../components/RingLoader';

export default function FlushScreen() {
  return (
    <div className={styles.screen}>
      <RingLoader size={280} />
      <h1 className={styles.heading}>Please wait…</h1>
      <p className={styles.subtitle}>The smart urinal will be ready to use in a minute.</p>
    </div>
  );
}
