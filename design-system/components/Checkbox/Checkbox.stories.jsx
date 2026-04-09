import { useState } from 'react';
import Checkbox from './Checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  argTypes: {
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    label:    { control: 'text' },
  },
};

function Controlled(args) {
  const [checked, setChecked] = useState(args.checked ?? false);
  return <Checkbox {...args} checked={checked} onChange={setChecked} />;
}

export const Unchecked = {
  render: (args) => <Controlled {...args} />,
  args: { label: 'Label', checked: false },
};

export const Checked = {
  render: (args) => <Controlled {...args} />,
  args: { label: 'Label', checked: true },
};

export const WithoutLabel = {
  name: 'Without label',
  render: (args) => <Controlled {...args} />,
  args: { checked: false },
};

export const Disabled = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox label="Disabled unchecked" checked={false} disabled />
      <Checkbox label="Disabled checked"   checked={true}  disabled />
    </div>
  ),
};

export const AllStates = {
  name: 'All states',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox label="Unchecked" checked={false} onChange={() => {}} />
      <Checkbox label="Checked"   checked={true}  onChange={() => {}} />
      <Checkbox label="Disabled unchecked" checked={false} disabled />
      <Checkbox label="Disabled checked"   checked={true}  disabled />
    </div>
  ),
};
