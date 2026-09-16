import styles from './SimulateButton.module.css';

// Affordance de desarrollo: dispara eventos que en el dispositivo real
// vienen del hardware (sensor RFID, cámara QR, sensor de flujo).
// Se distingue visualmente de la UI real del end user (naranja + borde punteado).
export default function SimulateButton({ label, onClick }) {
  return (
    <button className={styles.button} onClick={onClick}>
      <span className={styles.tag}>SIM</span>
      {label}
    </button>
  );
}
