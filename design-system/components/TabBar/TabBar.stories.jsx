import { useState } from 'react';
import TabBar from './TabBar';
import styles from './TabBar.module.css';

const TABS_2 = [
  { id: 'users',          label: 'Users' },
  { id: 'administrators', label: 'Administrators' },
];

const TABS_3 = [
  { id: 'centers',        label: 'Centers' },
  { id: 'administrators', label: 'Administrators' },
  { id: 'monitoring',     label: 'Monitoring' },
];

const TABS_4 = [
  { id: 'teams',          label: 'Teams' },
  { id: 'administrators', label: 'Administrators' },
  { id: 'users',          label: 'Users' },
  { id: 'monitoring',     label: 'Monitoring' },
];

function Controlled({ tabs, defaultTab, size }) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0].id);
  return (
    <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-m)', border: '1px solid var(--color-border-default)', overflow: 'hidden' }}>
      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} size={size} />
    </div>
  );
}

export default {
  title: 'Components/TabBar',
  component: TabBar,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'page' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '32px', maxWidth: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

// ─── Size M (default) ─────────────────────────────────────────────────────────

export const SizeM_2tabs = {
  name: 'M — 2 tabs',
  render: () => <Controlled tabs={TABS_2} />,
};

export const SizeM_3tabs = {
  name: 'M — 3 tabs',
  render: () => <Controlled tabs={TABS_3} />,
};

export const SizeM_4tabs = {
  name: 'M — 4 tabs',
  render: () => <Controlled tabs={TABS_4} />,
};

// ─── Size S ───────────────────────────────────────────────────────────────────

export const SizeS_2tabs = {
  name: 'S — 2 tabs',
  render: () => <Controlled tabs={TABS_2} size="s" />,
};

export const SizeS_3tabs = {
  name: 'S — 3 tabs',
  render: () => <Controlled tabs={TABS_3} size="s" />,
};

export const SizeS_4tabs = {
  name: 'S — 4 tabs',
  render: () => <Controlled tabs={TABS_4} size="s" />,
};

// ─── Estados del tab ──────────────────────────────────────────────────────────

const STATE_LABEL = { fontFamily: 'var(--font-family-primary)', fontSize: '11px', fontWeight: 500, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' };
const STATE_WRAP  = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' };

function TabStateDemo({ size }) {
  const s = size === 's';
  const tabStyle = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', position: 'relative',
    height: s ? 'auto' : '56px', minWidth: '122px',
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border-default)',
    borderRadius: 'var(--radius-s)',
    overflow: 'hidden',
  };
  const fontSize = s ? 'var(--font-size-14)' : 'var(--font-size-16)';
  const idlePill   = { padding: s ? '4px 0'    : '4px 8px',   borderRadius: '24px', fontFamily: 'var(--font-family-primary)', fontSize, fontWeight: 400, color: 'var(--color-text-subtle)' };
  const hoverPill  = { padding: s ? '4px 12px' : '8px 12px',  borderRadius: '24px', fontFamily: 'var(--font-family-primary)', fontSize, fontWeight: 400, color: 'var(--color-text-strong)', background: 'var(--color-bg-surface-raised)' };
  const activePill = { padding: s ? '4px 0'    : '4px 8px',   borderRadius: '24px', fontFamily: 'var(--font-family-primary)', fontSize, fontWeight: 500, color: 'var(--color-text-strong)' };
  const selectorH  = s ? '2px' : '4px';
  const selectorW  = s ? '48px' : '56px';
  const selector   = { height: selectorH, width: selectorW, background: 'var(--color-status-active)', borderRadius: '12px 12px 0 0', flexShrink: 0 };

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div style={STATE_WRAP}>
        <span style={STATE_LABEL}>Idle</span>
        <div style={{ ...tabStyle, padding: s ? '9px 4px' : '8px 4px 4px' }}>
          <span style={idlePill}>Label</span>
          <div style={{ ...selector, background: 'transparent' }} />
        </div>
      </div>
      <div style={STATE_WRAP}>
        <span style={STATE_LABEL}>Hover</span>
        <div style={{ ...tabStyle, padding: s ? '9px 4px' : '8px 4px 4px' }}>
          <span style={hoverPill}>Label</span>
          <div style={{ ...selector, background: 'transparent' }} />
        </div>
      </div>
      <div style={STATE_WRAP}>
        <span style={STATE_LABEL}>Selected</span>
        <div style={{ ...tabStyle, padding: s ? '9px 4px' : '8px 4px 4px' }}>
          <span style={activePill}>Label</span>
          <div style={selector} />
        </div>
      </div>
    </div>
  );
}

export const TabStatesM = {
  name: 'States — Size M',
  render: () => <TabStateDemo size="m" />,
};

export const TabStatesS = {
  name: 'States — Size S',
  render: () => <TabStateDemo size="s" />,
};

// ─── Comparativa ──────────────────────────────────────────────────────────────

export const SizeComparison = {
  name: 'M vs S',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-12)', color: 'var(--color-text-subtle)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Size M — usado en panel principal</p>
        <Controlled tabs={TABS_3} />
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-12)', color: 'var(--color-text-subtle)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Size S — usado en master-detail V2</p>
        <Controlled tabs={TABS_4} size="s" />
      </div>
    </div>
  ),
};
