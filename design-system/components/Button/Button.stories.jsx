import Button from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Guardar',
    variant: 'primary',
    size: 'm',
    disabled: false,
  },
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary'] },
    size:    { control: 'radio', options: ['s', 'm'] },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
};

export const Primary = {};

export const Secondary = {
  args: { variant: 'secondary' },
};

export const Small = {
  args: { size: 's' },
};

export const Disabled = {
  args: { disabled: true },
};

export const SecondaryHover = {
  name: 'Secondary (hover)',
  render: () => (
    <Button
      variant="secondary"
      size="m"
      style={{ backgroundColor: 'var(--color-bg-surface-subtle)' }}
    >
      Secondary hover
    </Button>
  ),
};

export const FullWidth = {
  name: 'Full width',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '320px' }}>
      <Button variant="primary"   size="m" style={{ width: '100%' }}>Primary full width</Button>
      <Button variant="secondary" size="m" style={{ width: '100%' }}>Secondary full width</Button>
    </div>
  ),
};

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="primary"  size="m">Primary M</Button>
      <Button variant="primary"  size="s">Primary S</Button>
      <Button variant="secondary" size="m">Secondary M</Button>
      <Button variant="secondary" size="s">Secondary S</Button>
      <Button variant="primary"  size="m" disabled>Disabled</Button>
    </div>
  ),
};
