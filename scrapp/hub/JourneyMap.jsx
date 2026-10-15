import { useState } from 'react';
import { Shell } from './Hub';
import { JOURNEY_ROW, JOURNEYS, SOURCE_LABEL } from './journeys';
import hubStyles from './Hub.module.css';
import styles from './JourneyMap.module.css';

// Plantilla de journey map, con la estructura del ejemplo que nos gustó (dna-microsite): una tabla más
// ancha que la página, que se desplaza de lado; una columna por etapa y tres filas — qué pasa, cómo se
// siente (una línea que sube y baja) y la evidencia, plegada hasta que se pide.

const COL = 220;          // ancho de cada etapa
const LINE_TOP = 56;      // hueco arriba de la línea, para el emoji
const LINE_HEIGHT = 140;  // recorrido vertical de la línea (mood 1 arriba, 0 abajo)
const TONE_COLOR = { high: '#3ecf8e', mid: '#e2b94a', low: '#ef6461' };

// [+bien+] en verde, [-mal-] en rojo
function Marked({ text }) {
  const parts = text.split(/(\[\+.*?\+\]|\[-.*?-\])/g);
  return parts.map((p, i) => {
    if (p.startsWith('[+')) return <span key={i} className={styles.good}>{p.slice(2, -2)}</span>;
    if (p.startsWith('[-')) return <span key={i} className={styles.bad}>{p.slice(2, -2)}</span>;
    return p;
  });
}

// **negrita**; la fuente entre paréntesis al final se queda, más tenue
function Evidence({ text }) {
  const m = text.match(/^(.*?)(\s*\([^)]*\))?$/);
  const body = m[1].split(/(\*\*.*?\*\*)/g).map((p, i) =>
    p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p);
  return <>{body}{m[2] && <span className={styles.source}>{m[2]}</span>}</>;
}

function MoodLine({ stages }) {
  const width = stages.length * COL;
  const height = LINE_TOP + LINE_HEIGHT + 24;
  const pts = stages.map((s, i) => ({
    x: i * COL + COL / 2,
    y: LINE_TOP + (1 - s.mood) * LINE_HEIGHT,
    color: TONE_COLOR[s.tone] ?? TONE_COLOR.mid,
  }));

  return (
    <svg className={styles.moodSvg} width={width} height={height} aria-hidden="true">
      <defs>
        {pts.slice(1).map((p, i) => (
          <linearGradient key={i} id={`seg${i}`} gradientUnits="userSpaceOnUse"
            x1={pts[i].x} y1={pts[i].y} x2={p.x} y2={p.y}>
            <stop offset="0" stopColor={pts[i].color} />
            <stop offset="1" stopColor={p.color} />
          </linearGradient>
        ))}
      </defs>
      {pts.slice(1).map((p, i) => (
        <line key={i} x1={pts[i].x} y1={pts[i].y} x2={p.x} y2={p.y}
          stroke={`url(#seg${i})`} strokeWidth="2.5" strokeLinecap="round" />
      ))}
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="5" fill={p.color} />)}
    </svg>
  );
}

export default function JourneyMap({ journeyId }) {
  const journey = JOURNEYS.find(j => j.id === journeyId) ?? JOURNEYS[0];
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const { stages } = journey;
  const cols = { gridTemplateColumns: `var(--label-col) repeat(${stages.length}, ${COL}px)` };

  return (
    <Shell full>
      <a className={hubStyles.back} href="#/">‹ Scrapp</a>

      <header className={hubStyles.sectionHeader}>
        <h1 className={hubStyles.sectionHeading}>{JOURNEY_ROW.title}</h1>
        <p className={hubStyles.sectionLede}>{JOURNEY_ROW.description}</p>
      </header>

      <div className={styles.controls}>
        {JOURNEYS.length > 1 ? (
          <select
            className={styles.select}
            value={journey.id}
            onChange={e => { window.location.hash = `#/journey/${e.target.value}`; }}
            aria-label="Journey"
          >
            {JOURNEYS.map(j => <option key={j.id} value={j.id}>{j.name}</option>)}
          </select>
        ) : (
          <span className={styles.journeyName}>{journey.name}</span>
        )}
        <p className={`${styles.sourceNote} ${styles[journey.source]}`}>{SOURCE_LABEL[journey.source]}</p>
      </div>

      <div className={styles.scroller}>
        <div className={styles.table} style={cols}>
          {/* Fila 0: etapas */}
          <div className={`${styles.label} ${styles.headLabel}`} />
          {stages.map((s, i) => (
            <div key={i} className={styles.stageHead}>
              <span className={styles.stageNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.stageTitle}>{s.title}</span>
            </div>
          ))}

          {/* Fila 1: qué pasa */}
          <div className={styles.label}><span aria-hidden="true">📍</span> Qué pasa</div>
          {stages.map((s, i) => (
            <div key={i} className={styles.cell}><p className={styles.what}><Marked text={s.text} /></p></div>
          ))}

          {/* Fila 2: cómo se siente — la línea va por debajo de toda la fila */}
          <div className={styles.label}><span aria-hidden="true">📈</span> Cómo se siente</div>
          <div className={styles.moodRow} style={{ gridColumn: `2 / span ${stages.length}` }}>
            <MoodLine stages={stages} />
            {stages.map((s, i) => (
              <div
                key={i}
                className={styles.moodPoint}
                style={{ left: i * COL + COL / 2, top: LINE_TOP + (1 - s.mood) * LINE_HEIGHT }}
              >
                <span className={styles.emoji}>{s.emoji}</span>
                <span className={styles.feel} style={{ color: TONE_COLOR[s.tone] }}>{s.feel}</span>
              </div>
            ))}
            <div className={styles.quotes} style={{ gridTemplateColumns: `repeat(${stages.length}, ${COL}px)` }}>
              {stages.map((s, i) => (
                <div key={i} className={styles.quoteCell}>
                  {s.quote && <p className={styles.quote}>{s.quote}</p>}
                  {s.link && <a className={styles.stageLink} href={s.link}>Ver en el prototipo ›</a>}
                </div>
              ))}
            </div>
          </div>

          {/* Fila 3: evidencia, plegada */}
          <div className={styles.label}><span aria-hidden="true">🔍</span> Evidencia</div>
          {evidenceOpen
            ? stages.map((s, i) => (
                <div key={i} className={styles.cell}>
                  <ul className={styles.evidence}>
                    {(s.evidence ?? []).map((e, j) => <li key={j}><Evidence text={e} /></li>)}
                  </ul>
                </div>
              ))
            : (
              <div className={styles.cell} style={{ gridColumn: `2 / span ${stages.length}` }}>
                <button className={styles.foldBtn} onClick={() => setEvidenceOpen(true)}>Ver evidencia ▾</button>
              </div>
            )}
          {evidenceOpen && (
            <>
              <div className={styles.label} />
              <div className={styles.cell} style={{ gridColumn: `2 / span ${stages.length}` }}>
                <button className={styles.foldBtn} onClick={() => setEvidenceOpen(false)}>Ocultar evidencia ▴</button>
              </div>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}
