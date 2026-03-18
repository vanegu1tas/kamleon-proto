import { useState } from 'react';
import Textarea from './Textarea';

export default {
  title: 'Components/Textarea',
  component: Textarea,
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
  return <Textarea {...args} value={value} onChange={setValue} />;
}

export const Default = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Notes',
    placeholder: 'Write something...',
    required: false,
  },
};

export const Required = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Notes',
    placeholder: 'Write something...',
    required: true,
  },
};

export const WithDescription = {
  name: 'With description',
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Description',
    description: 'Briefly describe the purpose of this organization.',
    placeholder: 'Write something...',
    required: true,
  },
};

export const WithValue = {
  name: 'With value',
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Notes',
    value: 'This organization manages all sport centers in the northern region.',
  },
};

export const WithError = {
  name: 'With error',
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Notes',
    placeholder: 'Write something...',
    required: true,
    error: 'This field is required.',
  },
};

export const Disabled = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Notes',
    placeholder: 'Write something...',
    disabled: true,
  },
};

export const AllStates = {
  name: 'All states',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>
      <Textarea label="Default"     placeholder="Write something..."  value=""       onChange={() => {}} />
      <Textarea label="With value"  value="Some content here."        onChange={() => {}} />
      <Textarea label="Error"       placeholder="Write something..."  value=""       onChange={() => {}} error="This field is required." />
      <Textarea label="Disabled"    placeholder="Write something..."  value=""       onChange={() => {}} disabled />
    </div>
  ),
};
