import { useState } from 'react';
import SegmentedControl from './SegmentedControl';

export default {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  parameters: { layout: 'centered' },
};

function Controlled({ options, initialValue }) {
  const [value, setValue] = useState(initialValue ?? options[0].value);
  return <SegmentedControl options={options} value={value} onChange={setValue} />;
}

export const TwoOptions = {
  name: 'Two options',
  render: () => (
    <Controlled
      options={[
        { label: 'By invite', value: 'invite' },
        { label: 'Manually',  value: 'manual' },
      ]}
    />
  ),
};

export const ThreeOptions = {
  name: 'Three options',
  render: () => (
    <Controlled
      options={[
        { label: 'Day',   value: 'day' },
        { label: 'Week',  value: 'week' },
        { label: 'Month', value: 'month' },
      ]}
    />
  ),
};

export const SecondActive = {
  name: 'Second option active',
  render: () => (
    <Controlled
      initialValue="manual"
      options={[
        { label: 'By invite', value: 'invite' },
        { label: 'Manually',  value: 'manual' },
      ]}
    />
  ),
};
