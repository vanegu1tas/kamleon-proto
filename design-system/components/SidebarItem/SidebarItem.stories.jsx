import SidebarItem from './SidebarItem';
import { IconSbCenter, IconSbTeams } from '../../icons';

export default {
  title: 'Components/SidebarItem',
  component: SidebarItem,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--bg-sidebar)', padding: '8px', width: '220px', borderRadius: '8px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Centros',
    state: 'default',
    collapsed: false,
  },
  argTypes: {
    state:     { control: 'radio', options: ['default', 'selected'] },
    collapsed: { control: 'boolean' },
    label:     { control: 'text' },
  },
};

export const Default = {
  args: { icon: <IconSbCenter /> },
};

export const Selected = {
  args: { icon: <IconSbCenter />, state: 'selected' },
};

export const Collapsed = {
  args: { icon: <IconSbCenter />, collapsed: true },
};

export const CollapsedSelected = {
  args: { icon: <IconSbCenter />, state: 'selected', collapsed: true },
};

export const AllStates = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <SidebarItem icon={<IconSbCenter />} label="Centros"  state="default"  collapsed={false} />
      <SidebarItem icon={<IconSbTeams />}  label="Equipos"  state="selected" collapsed={false} />
    </div>
  ),
};
