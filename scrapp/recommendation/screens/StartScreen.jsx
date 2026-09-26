import LogoKamleon from '../../../design-system/icons/LogoKamleon';
import ShaderBackground from '../ShaderBackground';
import CowboysLogo from '../components/CowboysLogo';
import styles from './StartScreen.module.css';

// Pantalla de inicio de la demo del recommendation engine. Como el piloto es para un club
// concreto, arriba conviven las dos marcas: Kamleon y el equipo, separadas por un divider.
export default function StartScreen({ onStart }) {
  return (
    <div className={styles.screen} onClick={onStart}>
      <ShaderBackground className={styles.shader} />

      <div className={styles.content}>
        <div className={styles.logos}>
          <LogoKamleon width={260} height={48} />
          <span className={styles.divider} aria-hidden="true" />
          <CowboysLogo height={86} />
        </div>

        <p className={styles.tagline}>Recommendation engine</p>
      </div>
    </div>
  );
}
