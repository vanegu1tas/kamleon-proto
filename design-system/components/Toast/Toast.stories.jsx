import { useState } from 'react';
import Toast from './Toast';

export default {
  title: 'Components/Toast',
  component: Toast,
  parameters: { layout: 'centered' },
  argTypes: {
    message:  { control: 'text' },
    duration: { control: 'number' },
    mode:     { control: 'radio', options: ['success', 'critic'] },
  },
};

function ToastDemo({ message, duration, mode, showUndo }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, minHeight: 120 }}>
      <button
        onClick={() => setVisible(true)}
        style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ccc', cursor: 'pointer', fontFamily: 'inherit' }}
      >
        Show toast
      </button>
      {visible && (
        <Toast
          message={message}
          duration={duration}
          mode={mode}
          onClose={() => setVisible(false)}
          onUndo={showUndo ? () => setVisible(false) : undefined}
        />
      )}
    </div>
  );
}

export const Default = {
  name: 'Success',
  render: (args) => <ToastDemo {...args} />,
  args: { message: 'New organization created', duration: 4000, mode: 'success' },
};

export const Critic = {
  render: (args) => <ToastDemo {...args} />,
  args: { message: 'Something went wrong', duration: 4000, mode: 'critic' },
};

export const WithUndo = {
  name: 'With Undo',
  render: (args) => <ToastDemo {...args} showUndo />,
  args: { message: 'Organization deleted', duration: 4000, mode: 'success' },
};

export const CriticWithUndo = {
  name: 'Critic with Undo',
  render: (args) => <ToastDemo {...args} showUndo />,
  args: { message: 'Changes could not be saved', duration: 4000, mode: 'critic' },
};

export const AllStates = {
  name: 'All states',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Toast message="New organization created"    mode="success" duration={0} onClose={() => {}} />
      <Toast message="Organization deleted"         mode="success" duration={0} onClose={() => {}} onUndo={() => {}} />
      <Toast message="Something went wrong"         mode="critic"  duration={0} onClose={() => {}} />
      <Toast message="Changes could not be saved"   mode="critic"  duration={0} onClose={() => {}} onUndo={() => {}} />
    </div>
  ),
};
