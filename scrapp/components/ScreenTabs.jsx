import styles from './ScreenTabs.module.css';

/**
 * Pestañas de pantallas debajo del dispositivo (andamiaje del microsite, no producto). 17/11.
 * Para exploraciones con varias pantallas (Look & feel): se elige la pantalla aquí y el engranaje
 * solo enseña las opciones de esa pantalla.
 *
 *   <ScreenTabs value={screen} onChange={setScreen} options={[{ value: 'score', label: 'Score' }, …]} />
 * Con onCompare, al final va el botón "Comparar con hoy" (CompareToday), separado de las pestañas.
 */
export default function ScreenTabs({ value, onChange, options, comparing = false, onCompare }) {
  return (
    <nav className={styles.tabs} aria-label="Pantallas">
      {options.map(o => (
        <button
          key={o.value}
          className={`${styles.tab} ${o.value === value ? styles.active : ''}`}
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
      {onCompare && (
        <>
          <span className={styles.sep} aria-hidden="true" />
          <button className={`${styles.tab} ${comparing ? styles.compareOn : ''}`} aria-pressed={comparing} onClick={onCompare}>
            {comparing ? 'Cerrar comparación' : 'Comparar con hoy'}
          </button>
        </>
      )}
    </nav>
  );
}
