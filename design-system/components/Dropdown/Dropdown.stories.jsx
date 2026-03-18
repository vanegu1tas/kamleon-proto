import { useState } from 'react';
import Dropdown from './Dropdown';

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: { layout: 'centered' },
  decorators: [Story => <div style={{ width: 320 }}><Story /></div>],
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    error:    { control: 'text' },
  },
};

const SEGMENTS = [
  { label: 'Sport',   value: 'sport' },
  { label: 'Fitness', value: 'fitness' },
];

const STATUS = [
  { label: 'Active',   value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

function Controlled(args) {
  const [value, setValue] = useState(args.value ?? '');
  return <Dropdown {...args} value={value} onChange={setValue} />;
}

export const Default = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Segment',
    placeholder: 'Select segment',
    options: SEGMENTS,
    required: false,
  },
};

export const Required = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Segment',
    placeholder: 'Select segment',
    options: SEGMENTS,
    required: true,
  },
};

export const WithDescription = {
  name: 'With description',
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Status',
    description: 'Sets the visibility of this organization.',
    placeholder: 'Select status',
    options: STATUS,
    required: true,
  },
};

export const WithValue = {
  name: 'With value selected',
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Segment',
    options: SEGMENTS,
    value: 'sport',
  },
};

export const WithError = {
  name: 'With error',
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Segment',
    placeholder: 'Select segment',
    options: SEGMENTS,
    required: true,
    error: 'Please select a segment.',
  },
};

export const Disabled = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Segment',
    placeholder: 'Select segment',
    options: SEGMENTS,
    disabled: true,
  },
};

export const AllStates = {
  name: 'All states',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>
      <Dropdown label="Default"       placeholder="Select..."  options={SEGMENTS} value=""       onChange={() => {}} />
      <Dropdown label="With value"    options={SEGMENTS}       value="sport"      onChange={() => {}} />
      <Dropdown label="Error"         placeholder="Select..."  options={SEGMENTS} value=""       onChange={() => {}} error="This field is required." />
      <Dropdown label="Disabled"      placeholder="Select..."  options={SEGMENTS} value=""       onChange={() => {}} disabled />
    </div>
  ),
};
