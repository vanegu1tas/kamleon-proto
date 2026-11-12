import { useState } from 'react';
import Calendar, { presetRange } from './Calendar';

const TODAY = new Date(2026, 9, 26);

export default {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: { layout: 'centered' },
};

function Controlled({ initial, mode }) {
  const [value, setValue] = useState(initial);
  return <Calendar mode={mode} value={value} today={TODAY} onApply={setValue} onCancel={() => setValue(initial)} />;
}

export const Default = {
  render: () => <Controlled initial={presetRange('today', TODAY)} />,
};

export const CustomRange = {
  render: () => <Controlled initial={{ preset: 'custom', start: new Date(2026, 9, 12), end: new Date(2026, 9, 18) }} />,
};

export const SingleDay = {
  render: () => <Controlled mode="single" initial={presetRange('today', TODAY)} />,
};
