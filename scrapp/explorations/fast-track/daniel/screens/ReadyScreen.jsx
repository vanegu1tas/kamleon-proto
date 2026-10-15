import { useEffect, useState } from 'react';
import styles from './ReadyScreen.module.css';
import SimulateButton from '../../../../components/SimulateButton';
import { initialsFor } from '../data/rosters';

const TIMEOUT_S = 15;

// "Ready": confirma a quién se eligió (lo pide la propuesta, para no registrar a otro por error).
// Sin PIN. Si nadie empieza en 15 s, vuelve sola a la plantilla para que el siguiente no se
// encuentre el perfil de otro.
export default function ReadyScreen({ person, onNotYou, onSimulateFlow }) {
  const [left, setLeft] = useState(TIMEOUT_S);

  useEffect(() => {
    if (left <= 0) { onNotYou(); return; }
    const t = setTimeout(() => setLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left, onNotYou]);

  return (
    <div className={styles.screen}>
      <span className={styles.logo}>KAMLEON®</span>

      <div className={styles.content}>
        {person.photo
          ? <img className={styles.photo} src={person.photo} alt="" />
          : <span className={`${styles.photo} ${styles.initials}`}>{initialsFor(person.name)}</span>}
        <h1 className={styles.greeting}>Hi, {person.short}</h1>
        {person.number != null && <span className={styles.number}>#{person.number}</span>}
        <p className={styles.instruction}>Start to pee whenever you're ready</p>
        <SimulateButton label="Simulate flow detected" onClick={onSimulateFlow} />
        <button className={styles.notYou} onClick={onNotYou}>‹ Not you?</button>
      </div>

      <p className={styles.timeout}>Back to the roster in {left} s if nothing happens</p>
    </div>
  );
}
