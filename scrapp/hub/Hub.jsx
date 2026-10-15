import { SECTIONS, STATUS_LABEL } from './entries';
import styles from './Hub.module.css';

function entryHref(entry) {
  if (entry.href) return entry.href;
  if (!entry.items.length) return null;
  return `#/${entry.id}/${entry.items[0].id}`;
}

export default function Hub() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>Kamleon</span>
        <h1 className={styles.title}>Scrapp</h1>
        <p className={styles.lede}>Pantalla del urinal · 1280×800 táctil</p>
      </header>

      {SECTIONS.map(section => (
        <section key={section.id} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          <ul className={styles.grid}>
            {section.entries.map(entry => {
              const href = entryHref(entry);
              const count = entry.items?.length ?? 0;
              const content = (
                <>
                  <div className={styles.cardTop}>
                    <span className={styles.cardTitle}>{entry.title}</span>
                    <span className={`${styles.status} ${styles[entry.status]}`}>
                      {STATUS_LABEL[entry.status]}
                    </span>
                  </div>
                  <p className={styles.cardDesc}>{entry.description}</p>
                  <span className={styles.cardMeta}>
                    {entry.href
                      ? 'Abre en otra página'
                      : count === 0
                        ? 'Todavía sin exploraciones'
                        : section.id === 'tasks'
                          ? `${count} ${count === 1 ? 'exploración' : 'exploraciones'}`
                          : null}
                  </span>
                </>
              );
              return (
                <li key={entry.id}>
                  {href
                    ? <a className={styles.card} href={href}>{content}</a>
                    : <div className={`${styles.card} ${styles.empty}`}>{content}</div>}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
