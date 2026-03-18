import { useState } from 'react';
import Toggle from './Toggle';

export default {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  argTypes: {
    size:     { control: 'radio', options: ['s', 'm'] },
    checked:  { control: 'boolean' },
    label:    { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

function Controlled(args) {
  const [checked, setChecked] = useState(args.checked ?? false);
  return <Toggle {...args} checked={checked} onChange={setChecked} />;
}

export const Default = {
  render: (args) => <Controlled {...args} />,
  args: { size: 's', checked: false, label: true, disabled: false },
};

export const On = {
  render: (args) => <Controlled {...args} />,
  args: { size: 's', checked: true, label: true, disabled: false },
};

export const SizeM = {
  render: (args) => <Controlled {...args} />,
  args: { size: 'm', checked: false, label: true, disabled: false },
};

export const SizeMOn = {
  name: 'Size M — On',
  render: (args) => <Controlled {...args} />,
  args: { size: 'm', checked: true, label: true, disabled: false },
};

export const NoLabel = {
  render: (args) => <Controlled {...args} />,
  args: { size: 's', checked: false, label: false, disabled: false },
};

export const Disabled = {
  render: (args) => <Controlled {...args} />,
  args: { size: 's', checked: false, label: true, disabled: true },
};

export const AllVariants = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        <Controlled size="s" checked={false} label={true} />
        <Controlled size="s" checked={true}  label={true} />
        <Controlled size="s" checked={false} label={false} />
        <Controlled size="s" checked={true}  label={false} />
        <Controlled size="s" checked={false} label={true} disabled />
      </div>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        <Controlled size="m" checked={false} label={true} />
        <Controlled size="m" checked={true}  label={true} />
        <Controlled size="m" checked={false} label={false} />
        <Controlled size="m" checked={true}  label={false} />
        <Controlled size="m" checked={false} label={true} disabled />
      </div>
    </div>
  ),
};
