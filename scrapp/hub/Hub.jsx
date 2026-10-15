import LogoKamleon from '../../design-system/icons/LogoKamleon';
import ShaderBackground from '../recommendation/ShaderBackground';
import { SECTIONS, STATUS_LABEL } from './entries';
import styles from './Hub.module.css';

// Mismo lenguaje que la landing del proyecto (landing.html): fondo con el shader, logo,
// lista numerada con flecha. Aquí la lista va agrupada en Producción / Tareas.

function entryHref(entry) {
  if (entry.href) return entry.href;
  if (!entry.items.length) return null;
  return `#/${entry.id}/${entry.items[0].id}`;
}

export default function Hub() {
  let index = 0;

  return (
    <div className={styles.page}>
      <ShaderBackground className={styles.shader} />

      <main className={styles.container}>
        <div className={styles.brand}>
          <LogoKamleon width={119} height={22} color="var(--hub-text-strong)" />
        </div>
        <p className={styles.tagline}>Scrapp · pantalla del urinal · flujos y exploraciones</p>

        {SECTIONS.map(section => (
          <section key={section.id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <ul className={styles.navList}>
              {section.entries.map(entry => {
                index += 1;
                const href = entryHref(entry);
                const content = (
                  <>
                    <span className={styles.navIndex}>{String(index).padStart(2, '0')}</span>
                    <div className={styles.navContent}>
                      <div className={styles.navTitleRow}>
                        <span className={styles.navTitle}>{entry.title}</span>
                        <span className={`${styles.status} ${styles[entry.status]}`}>
                          {STATUS_LABEL[entry.status]}
                        </span>
                      </div>
                      <div className={styles.navDesc}>
                        {entry.description}
                        {!href && ' Todavía sin exploraciones.'}
                      </div>
                    </div>
                    {href && <span className={styles.navArrow} aria-hidden="true">{entry.href ? '↗' : '→'}</span>}
                  </>
                );
                return (
                  <li key={entry.id} className={styles.navItem} style={{ '--i': index }}>
                    {href
                      ? <a className={styles.navLink} href={href}>{content}</a>
                      : <div className={`${styles.navLink} ${styles.disabled}`}>{content}</div>}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
