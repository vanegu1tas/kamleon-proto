import { useState } from 'react';
import Input from './Input';

export default {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
  decorators: [Story => <div style={{ width: 320 }}><Story /></div>],
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    error:    { control: 'text' },
  },
};

function Controlled(args) {
  const [value, setValue] = useState(args.value ?? '');
  return <Input {...args} value={value} onChange={e => setValue(e.target.value)} />;
}

export const Default = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    required: false,
  },
};

export const Required = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Name',
    placeholder: 'Enter name',
    required: true,
  },
};

export const WithDescription = {
  name: 'With description',
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Email',
    description: 'We will send the invite to this address.',
    placeholder: 'name@example.com',
    required: true,
  },
};

export const WithError = {
  name: 'With error',
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Email',
    placeholder: 'name@example.com',
    required: true,
    value: 'not-an-email',
    error: 'Enter a valid email address.',
  },
};

export const Disabled = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Name',
    placeholder: 'Placeholder',
    disabled: true,
  },
};

export const AllStates = {
  name: 'All states',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>
      <Input label="Default"  placeholder="Placeholder" value="" onChange={() => {}} />
      <Input label="With value" placeholder="Placeholder" value="John Smith" onChange={() => {}} />
      <Input label="Error"   placeholder="Placeholder" value="bad-value" onChange={() => {}} error="This field is required." />
      <Input label="Disabled" placeholder="Placeholder" value="" onChange={() => {}} disabled />
    </div>
  ),
};
