import LogoKamleon from '../../design-system/icons/LogoKamleon';
import ShaderBackground from '../recommendation/ShaderBackground';
import { SECTIONS, STATUS_LABEL } from './entries';
import { JOURNEY_ROW } from './journeys';
import styles from './Hub.module.css';

// Dos niveles:
//   Hub      → mismo lenguaje que la landing del proyecto (landing.html): una fila por sección.
//   Section  → las entradas de esa sección en cards, con su estado.

export function Shell({ children, wide = false, full = false }) {
  return (
    <div className={styles.page}>
      <ShaderBackground className={styles.shader} />
      <main className={`${styles.container} ${wide ? styles.wide : ''} ${full ? styles.full : ''}`}>{children}</main>
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
          {[...SECTIONS, JOURNEY_ROW].map((section, i) => (
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
  if (entry.href) return null;
  const n = entry.items.length;
  if (n === 0) return 'Sin exploraciones';
  const authors = [...new Set(entry.items.map(i => i.author).filter(Boolean))];
  const count = n === 1 ? '1 flujo' : `${n} exploraciones`;
  return authors.length ? `${count} · ${authors.join(', ')}` : count;
}

function entryCta(entry) {
  if (entry.href) return 'Abrir la demo ↗';
  if (!entry.items.length) return null;
  return 'Ver ›';
}

export function Section({ section }) {
  return (
    <Shell wide>
      <a className={styles.back} href="#/">‹ Scrapp</a>

      <header className={styles.sectionHeader}>
        <h1 className={styles.sectionHeading}>{section.title}</h1>
        <p className={styles.sectionLede}>{section.description}</p>
      </header>

      <ul className={styles.grid}>
        {section.entries.map((entry, i) => {
          const href = entryHref(entry);
          const meta = entryMeta(entry);
          const cta = entryCta(entry);
          const content = (
            <>
              <span className={`${styles.eyebrow} ${styles[entry.status]}`}>
                {STATUS_LABEL[entry.status]}
              </span>
              <span className={styles.cardTitle}>{entry.title}</span>
              <p className={styles.cardDesc}>{entry.description}</p>
              <div className={styles.cardFoot}>
                {meta && <span className={styles.cardMeta}>{meta}</span>}
                {cta && <span className={styles.cardCta}>{cta}</span>}
              </div>
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
