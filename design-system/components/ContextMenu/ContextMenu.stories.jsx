import ContextMenu from './ContextMenu';
import { IconEdit, IconPlus, IconTrash, IconSettings, IconUser } from '../../icons/outline';

export default {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  parameters: { layout: 'centered' },
};

const orgItems = [
  { label: 'Edit',       icon: <IconEdit  size={16} />, onClick: () => {} },
  { label: 'New Center', icon: <IconPlus  size={16} />, onClick: () => {} },
  { label: 'Delete',     icon: <IconTrash size={16} />, onClick: () => {}, variant: 'danger' },
];

const centerItems = [
  { label: 'Edit',     icon: <IconEdit     size={16} />, onClick: () => {} },
  { label: 'New Team', icon: <IconPlus     size={16} />, onClick: () => {} },
  { label: 'New User', icon: <IconUser     size={16} />, onClick: () => {} },
  { label: 'Delete',   icon: <IconTrash    size={16} />, onClick: () => {}, variant: 'danger' },
];

export const Default = {
  args: { items: orgItems },
};

export const WithDanger = {
  name: 'With danger item',
  render: () => <ContextMenu items={orgItems} />,
};

export const FourItems = {
  name: 'Four items',
  render: () => <ContextMenu items={centerItems} />,
};

export const NoDanger = {
  name: 'No danger item',
  render: () => (
    <ContextMenu items={[
      { label: 'Edit',     icon: <IconEdit     size={16} />, onClick: () => {} },
      { label: 'Settings', icon: <IconSettings size={16} />, onClick: () => {} },
    ]} />
  ),
};

export const AllVariants = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <ContextMenu items={orgItems} />
      <ContextMenu items={centerItems} />
    </div>
  ),
};
