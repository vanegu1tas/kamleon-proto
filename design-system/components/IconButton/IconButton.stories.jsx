import IconButton from './IconButton';
import { IconClose, IconSettings, IconEdit, IconTrash, IconPlus, IconFilter } from '../../icons/outline';

export default {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant:         { control: 'select', options: ['default', 'danger'] },
    tooltipPosition: { control: 'select', options: ['bottom', 'top', 'left', 'right'] },
    disabled:        { control: 'boolean' },
  },
};

export const Default = {
  args: {
    'aria-label': 'Settings',
    tooltip: 'Settings',
    children: <IconSettings size={16} />,
  },
};

export const Danger = {
  args: {
    'aria-label': 'Delete',
    tooltip: 'Delete',
    variant: 'danger',
    children: <IconTrash size={16} />,
  },
};

export const Disabled = {
  args: {
    'aria-label': 'Edit',
    tooltip: 'Edit',
    disabled: true,
    children: <IconEdit size={16} />,
  },
};

export const TooltipPositions = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, padding: 48, alignItems: 'center' }}>
      <IconButton aria-label="Top" tooltip="Top" tooltipPosition="top">
        <IconPlus size={16} />
      </IconButton>
      <IconButton aria-label="Bottom" tooltip="Bottom" tooltipPosition="bottom">
        <IconPlus size={16} />
      </IconButton>
      <IconButton aria-label="Left" tooltip="Left" tooltipPosition="left">
        <IconPlus size={16} />
      </IconButton>
      <IconButton aria-label="Right" tooltip="Right" tooltipPosition="right">
        <IconPlus size={16} />
      </IconButton>
    </div>
  ),
};

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <IconButton aria-label="Close"    tooltip="Close">    <IconClose    size={16} /></IconButton>
      <IconButton aria-label="Settings" tooltip="Settings"> <IconSettings size={16} /></IconButton>
      <IconButton aria-label="Edit"     tooltip="Edit">     <IconEdit     size={16} /></IconButton>
      <IconButton aria-label="Filter"   tooltip="Filter">   <IconFilter   size={16} /></IconButton>
      <IconButton aria-label="Add"      tooltip="Add">      <IconPlus     size={16} /></IconButton>
      <IconButton aria-label="Delete"   tooltip="Delete" variant="danger"><IconTrash size={16} /></IconButton>
    </div>
  ),
};
