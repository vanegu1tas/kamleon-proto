import { useState } from 'react';
import TabBar from './TabBar';

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

const TABS_2 = [
  { id: 'users',          label: 'Users' },
  { id: 'administrators', label: 'Administrators' },
];

function Controlled({ tabs, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0].id);
  return (
    <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-m)', border: '1px solid var(--color-border-default)', overflow: 'hidden' }}>
      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default {
  title: 'Design System/TabBar',
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

export const ThreeTabs = {
  name: '3 tabs',
  render: () => <Controlled tabs={TABS_3} />,
};

export const FourTabs = {
  name: '4 tabs',
  render: () => <Controlled tabs={TABS_4} />,
};

export const TwoTabs = {
  name: '2 tabs',
  render: () => <Controlled tabs={TABS_2} />,
};

export const SecondTabActive = {
  name: 'Second tab active',
  render: () => <Controlled tabs={TABS_3} defaultTab="administrators" />,
};

export const AllVariants = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Controlled tabs={TABS_2} />
      <Controlled tabs={TABS_3} />
      <Controlled tabs={TABS_4} />
    </div>
  ),
};
