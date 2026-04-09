import { useState } from 'react';
import FilterPanel from './FilterPanel';

export default {
  title: 'Components/FilterPanel',
  component: FilterPanel,
  parameters: { layout: 'centered' },
};

const STATUS_SECTION = {
  key: 'status',
  label: 'Status',
  options: [
    { value: 'active',   label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ],
};

const ROLE_SECTION = {
  key: 'role',
  label: 'Role',
  options: [
    { value: 'professional', label: 'Professional' },
    { value: 'user',         label: 'User' },
  ],
};

const KPOD_SECTION = {
  key: 'kpod',
  label: 'K-POD',
  options: [
    { value: 'active',            label: 'Active' },
    { value: 'needs-replacement', label: 'Needs replacement' },
    { value: 'inactive',          label: 'Inactive' },
  ],
};

function Controlled({ sections }) {
  const [values, setValues] = useState(
    Object.fromEntries(sections.map(s => [s.key, new Set()]))
  );

  function handleChange(key, value) {
    setValues(prev => {
      const next = new Set(prev[key]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [key]: next };
    });
  }

  function handleClear() {
    setValues(Object.fromEntries(sections.map(s => [s.key, new Set()])));
  }

  return (
    <div style={{ padding: 48 }}>
      <FilterPanel
        sections={sections}
        values={values}
        onChange={handleChange}
        onClear={handleClear}
      />
    </div>
  );
}

export const SingleSection = {
  name: 'Single section (Status)',
  render: () => <Controlled sections={[STATUS_SECTION]} />,
};

export const TwoSections = {
  name: 'Two sections (Role + Status)',
  render: () => <Controlled sections={[ROLE_SECTION, STATUS_SECTION]} />,
};

export const ThreeSections = {
  name: 'Three sections (Status + K-POD)',
  render: () => <Controlled sections={[STATUS_SECTION, KPOD_SECTION]} />,
};
