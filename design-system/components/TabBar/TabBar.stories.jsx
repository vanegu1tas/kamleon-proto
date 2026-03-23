import { useState } from 'react';
import TabBar from './TabBar';

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
