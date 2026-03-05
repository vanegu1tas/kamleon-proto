import SearchBar from './SearchBar';

export default {
  title: 'Design System/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  args: {
    placeholder: 'Search',
    error: false,
    disabled: false,
  },
  argTypes: {
    error:    { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '280px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Default = {};

export const WithValue = {
  args: { value: 'Barcelona' },
};

export const Error = {
  args: { error: true },
};

export const Disabled = {
  args: { disabled: true },
};

export const AllStates = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '280px' }}>
      <SearchBar placeholder="Default" />
      <SearchBar placeholder="With value" value="Barcelona" />
      <SearchBar placeholder="Error" error />
      <SearchBar placeholder="Disabled" disabled />
    </div>
  ),
};
