import ToolbarButton from './ToolbarButton';
import { IconFilter } from '../../icons/outline';

export default {
  title: 'Components/ToolbarButton',
  component: ToolbarButton,
  tags: ['autodocs'],
  args: {
    children:  'Filters',
    selected:  false,
    disabled:  false,
  },
  argTypes: {
    selected:  { control: 'boolean' },
    disabled:  { control: 'boolean' },
    children:  { control: 'text' },
  },
};

export const Default = {
  args: { icon: <IconFilter size={16} /> },
};

export const Selected = {
  args: { icon: <IconFilter size={16} />, selected: true },
};

export const Disabled = {
  args: { icon: <IconFilter size={16} />, disabled: true },
};

export const NoIcon = {
  args: { children: 'Export' },
};

export const AllStates = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <ToolbarButton icon={<IconFilter size={16} />}>Filters</ToolbarButton>
      <ToolbarButton icon={<IconFilter size={16} />} selected>Filters</ToolbarButton>
      <ToolbarButton icon={<IconFilter size={16} />} disabled>Filters</ToolbarButton>
    </div>
  ),
};
