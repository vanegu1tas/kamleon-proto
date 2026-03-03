import Tag from './Tag';

export default {
  title: 'Design System/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: {
    status: 'active',
  },
  argTypes: {
    status: { control: 'radio', options: ['active', 'inactive'] },
  },
};

export const Active = {};

export const Inactive = {
  args: { status: 'inactive' },
};

export const Both = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px' }}>
      <Tag status="active" />
      <Tag status="inactive" />
    </div>
  ),
};
