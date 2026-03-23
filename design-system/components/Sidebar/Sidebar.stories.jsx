import { useState } from 'react';
import Sidebar from './Sidebar';
import {
  IconSbCenter,
  IconSbTeams,
  IconSbDrop,
  IconSbChart,
  IconSbUnit,
} from '../../icons';

const SECTIONS = [
  {
    id: 'main',
    label: 'GESTIÓN',
    items: [
      { id: 'centros',  label: 'Centros',       icon: <IconSbCenter />, active: true  },
      { id: 'equipos',  label: 'Equipos',        icon: <IconSbTeams />,  active: false },
    ],
  },
  {
    id: 'clinical',
    label: 'CLÍNICA',
    items: [
      { id: 'hidra',    label: 'Hidratación',    icon: <IconSbDrop />,   active: false },
      { id: 'uro',      label: 'Uroflujometría', icon: <IconSbChart />,  active: false },
      { id: 'devices',  label: 'Dispositivos',   icon: <IconSbUnit />,   active: false },
    ],
  },
];

function SidebarWithState({ startCollapsed = false }) {
  const [collapsed, setCollapsed] = useState(startCollapsed);
  return (
    <Sidebar
      collapsed={collapsed}
      onToggle={() => setCollapsed(c => !c)}
      sections={SECTIONS}
    />
  );
}

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'page' },
  },
};

export const Expanded = {
  render: () => <SidebarWithState startCollapsed={false} />,
};

export const Collapsed = {
  render: () => <SidebarWithState startCollapsed={true} />,
};
