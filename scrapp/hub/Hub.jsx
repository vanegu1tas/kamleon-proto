import LogoKamleon from '../../design-system/icons/LogoKamleon';
import ShaderBackground from '../recommendation/ShaderBackground';
import { SECTIONS, STATUS_LABEL } from './entries';
import styles from './Hub.module.css';

// Dos niveles:
//   Hub      → mismo lenguaje que la landing del proyecto (landing.html): una fila por sección.
//   Section  → las entradas de esa sección en cards, con su estado.

function Shell({ children, wide = false }) {
  return (
    <div className={styles.page}>
      <ShaderBackground className={styles.shader} />
      <main className={`${styles.container} ${wide ? styles.wide : ''}`}>{children}</main>
    </div>
  );
}

export default function Hub() {
  return (
    <Shell>
      <div className={styles.brand}>
        <LogoKamleon width={119} height={22} color="var(--hub-text-strong)" />
      </div>
      <p className={styles.tagline}>Scrapp · pantalla del urinal · flujos y exploraciones</p>

      <nav aria-label="Secciones">
        <ul className={styles.navList}>
          {SECTIONS.map((section, i) => (
            <li key={section.id} className={styles.navItem} style={{ '--i': i + 1 }}>
              <a className={styles.navLink} href={`#/${section.id}`}>
                <span className={styles.navIndex}>{String(i + 1).padStart(2, '0')}</span>
                <div className={styles.navContent}>
                  <div className={styles.navTitle}>{section.title}</div>
                  <div className={styles.navDesc}>{section.description}</div>
                </div>
                <span className={styles.navArrow} aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Shell>
  );
}

function entryHref(entry) {
  if (entry.href) return entry.href;
  if (!entry.items.length) return null;
  return `#/${entry.id}/${entry.items[0].id}`;
}

function entryMeta(entry) {
  if (entry.href) return 'Abre en otra página ↗';
  const n = entry.items.length;
  if (n === 0) return 'Todavía sin exploraciones';
  if (n === 1) return null;
  return `${n} exploraciones`;
}

export function Section({ section }) {
  return (
    <Shell wide>
      <a className={styles.back} href="#/">← Scrapp</a>
      <h1 className={styles.sectionHeading}>{section.title}</h1>
      <p className={styles.tagline}>{section.description}</p>

      <ul className={styles.grid}>
        {section.entries.map((entry, i) => {
          const href = entryHref(entry);
          const meta = entryMeta(entry);
          const content = (
            <>
              <div className={styles.cardTop}>
                <span className={styles.cardTitle}>{entry.title}</span>
                <span className={`${styles.status} ${styles[entry.status]}`}>
                  {STATUS_LABEL[entry.status]}
                </span>
              </div>
              <p className={styles.cardDesc}>{entry.description}</p>
              {meta && <span className={styles.cardMeta}>{meta}</span>}
            </>
          );
          return (
            <li key={entry.id} style={{ '--i': i + 1 }} className={styles.cardItem}>
              {href
                ? <a className={styles.card} href={href}>{content}</a>
                : <div className={`${styles.card} ${styles.empty}`}>{content}</div>}
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}
