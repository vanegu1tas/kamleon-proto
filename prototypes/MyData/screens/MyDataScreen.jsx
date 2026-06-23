import { useState } from 'react';
import styles from './MyDataScreen.module.css';
import { LAST_SAMPLE, THIS_WEEK, DISTRIBUTION, SAMPLES, URINE_COLORS } from '../mockData';

const STATUS_COLORS = {
  'Hydrated':            'var(--color-green-62)',
  'Dehydrated':          'var(--color-yellow-57)',
  'Over hydrated':       '#60a5fa',
  'Severely dehydrated': 'var(--color-red-65)',
};

const COLOR_LABELS = ['', 'Very pale', 'Pale straw', 'Amber', 'Golden', 'Honey', 'Orange', 'Brown', 'Dark brown'];

/* ─── Score ring ──────────────────────────────────────────── */

function ScoreRing({ score, status }) {
  const r    = 64;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color  = STATUS_COLORS[status] || 'var(--color-green-62)';

  return (
    <div className={styles.ringWrap}>
      <svg width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
        <circle cx="80" cy="80" r={r} fill="none"
          stroke="var(--color-border-default)" strokeWidth="14" />
        <circle cx="80" cy="80" r={r} fill="none"
          stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 80 80)"
        />
      </svg>
      <div className={styles.ringCenter}>
        <span className={styles.ringScore}>{score}%</span>
        <span className={styles.ringStatus}>
          <span className={styles.ringDot} style={{ background: color }} />
          {status}
        </span>
      </div>
    </div>
  );
}

/* ─── Urine color swatch ──────────────────────────────────── */

function ColorSwatch({ level, size = 'normal' }) {
  return (
    <span className={styles.colorSwatch}>
      <span
        className={size === 'small' ? styles.colorBoxSmall : styles.colorBox}
        style={{ background: URINE_COLORS[level] }}
      />
      {size !== 'small' && (
        <span className={styles.colorLabel}>{COLOR_LABELS[level]} · {level}/8</span>
      )}
      {size === 'small' && (
        <span className={styles.colorLabel}>{level}</span>
      )}
    </span>
  );
}

/* ─── Hero card ───────────────────────────────────────────── */

function HeroCard() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Last sample</span>
        <span className={styles.cardTime}>{LAST_SAMPLE.date} · {LAST_SAMPLE.time}</span>
      </div>

      <ScoreRing score={LAST_SAMPLE.score} status={LAST_SAMPLE.status} />

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Electrolytes</span>
          <span className={styles.metricValue}>{LAST_SAMPLE.electrolytes}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Volume</span>
          <span className={styles.metricValue}>{LAST_SAMPLE.volume}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Urine color</span>
          <ColorSwatch level={LAST_SAMPLE.colorLevel} />
        </div>
      </div>
    </div>
  );
}

/* ─── This week ───────────────────────────────────────────── */

function ThisWeekCard() {
  return (
    <div className={styles.card}>
      <div className={styles.weekTop}>
        <span className={styles.cardTitle}>This week</span>
        <div className={styles.weekStats}>
          <span className={styles.streak}>🔥 {THIS_WEEK.streak}-day streak</span>
          <span className={styles.weekSep}>·</span>
          <span className={styles.weekCount}>
            {THIS_WEEK.hydratedDays} of {THIS_WEEK.totalDays} days hydrated
          </span>
        </div>
      </div>

      <div className={styles.weekDays}>
        {THIS_WEEK.days.map(d => (
          <div key={d.day} className={styles.dayCol}>
            <span className={styles.dayLabel}>{d.day}</span>
            <span className={`${styles.dayDot} ${d.sampled ? styles.dayDotSampled : styles.dayDotEmpty}`} />
            <span className={styles.dayScore}>{d.score !== null ? `${d.score}%` : '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── History ─────────────────────────────────────────────── */

const PERIODS = [
  { id: 'today', label: 'Today' },
  { id: 'week',  label: 'Week'  },
  { id: 'month', label: 'Month' },
  { id: 'custom', label: '📅 Custom' },
];

const METRICS = [
  { id: 'score',        label: 'Score %'      },
  { id: 'electrolytes', label: 'Electrolytes' },
  { id: 'volume',       label: 'Volume'       },
];

function History() {
  const [period,  setPeriod]  = useState('week');
  const [selected, setSelected] = useState(['score']);

  function toggleMetric(id) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.length > 1 ? prev.filter(m => m !== id) : prev;
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  }

  return (
    <section className={styles.historySection}>

      {/* Section title */}
      <div className={styles.sectionDivider}>
        <span className={styles.sectionTitle}>History</span>
        <span className={styles.dividerLine} />
      </div>

      {/* Period pills */}
      <div className={styles.periodPills}>
        {PERIODS.map(p => (
          <button
            key={p.id}
            className={`${styles.periodPill} ${period === p.id ? styles.periodPillActive : ''}`}
            onClick={() => setPeriod(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Distribution */}
      <div className={styles.distSection}>
        <span className={styles.distLabel}>Sample distribution</span>
        <div className={styles.distBar}>
          <span className={styles.distHydrated}   style={{ width: `${DISTRIBUTION.hydrated}%`   }} />
          <span className={styles.distDehydrated} style={{ width: `${DISTRIBUTION.dehydrated}%` }} />
          <span className={styles.distOver}       style={{ width: `${DISTRIBUTION.over}%`       }} />
          <span className={styles.distSevere}     style={{ width: `${DISTRIBUTION.severe}%`     }} />
        </div>
        <div className={styles.distLegend}>
          <span className={styles.distItem}><span className={`${styles.distDot} ${styles.distDotHydrated}`}   />Hydrated {DISTRIBUTION.hydrated}%</span>
          <span className={styles.distItem}><span className={`${styles.distDot} ${styles.distDotDehydrated}`} />Dehydrated {DISTRIBUTION.dehydrated}%</span>
          <span className={styles.distItem}><span className={`${styles.distDot} ${styles.distDotOver}`}       />Over hydrated {DISTRIBUTION.over}%</span>
          <span className={styles.distItem}><span className={`${styles.distDot} ${styles.distDotSevere}`}     />Severely {DISTRIBUTION.severe}%</span>
        </div>
      </div>

      {/* Metric selectors */}
      <div className={styles.metricRow}>
        {METRICS.map(m => (
          <button
            key={m.id}
            className={`${styles.metricPill} ${selected.includes(m.id) ? styles.metricPillActive : ''}`}
            onClick={() => toggleMetric(m.id)}
          >
            <span className={`${styles.metricDot} ${selected.includes(m.id) ? styles.metricDotActive : ''}`} />
            {m.label}
          </button>
        ))}
        <span className={styles.metricHint}>max 2</span>
      </div>

      {/* Chart placeholder */}
      <div className={styles.chartPlaceholder} />

      {/* Samples table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Date</th>
            <th className={styles.th}>Electrolytes</th>
            <th className={styles.th}>Volume</th>
            <th className={styles.th}>Color</th>
            <th className={styles.th}>Score</th>
          </tr>
        </thead>
        <tbody>
          {SAMPLES.map(s => (
            <tr key={s.id} className={styles.tr}>
              <td className={styles.td}>{s.date}</td>
              <td className={styles.td}>{s.electrolytes}</td>
              <td className={styles.td}>{s.volume}</td>
              <td className={styles.td}><ColorSwatch level={s.colorLevel} size="small" /></td>
              <td className={styles.td}>{s.score}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.exportRow}>
        <button className={styles.exportBtn}>+ Export data</button>
      </div>

    </section>
  );
}

/* ─── Screen ──────────────────────────────────────────────── */

export default function MyDataScreen() {
  return (
    <div className={styles.page}>
      <HeroCard />
      <ThisWeekCard />
      <History />
    </div>
  );
}
