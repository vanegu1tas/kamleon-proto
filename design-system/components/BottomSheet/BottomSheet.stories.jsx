import { useState } from 'react';
import BottomSheet from './BottomSheet';
import Button from '../Button/Button';
import { IconEdit, IconTrash, IconResend, IconMailHistory, IconPower, IconEye } from '../../icons/outline';

export default {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'fullscreen',
    // Es el equivalente touch del menú "⋯": en pantallas de 390px o menos, el ContextMenu
    // se muestra como bottom sheet. El viewport del preview se fija para verlo en contexto.
    viewport: { defaultViewport: 'mobile1' },
  },
};

const inviteItems = [
  { label: 'View email history', icon: <IconMailHistory size={24} />, onClick: () => {} },
  { label: 'Resend invite',      icon: <IconResend size={24} />,      onClick: () => {} },
  { label: 'Cancel invitation',  icon: <IconTrash size={24} />,       onClick: () => {}, variant: 'danger' },
];

const memberItems = [
  { label: 'Edit user',        icon: <IconEdit size={24} />,  onClick: () => {} },
  { label: 'Turn off PIN',     icon: <IconPower size={24} />, onClick: () => {} },
  { label: 'Hide from screen', icon: <IconEye size={24} />,   onClick: () => {} },
  { label: 'Remove from team', icon: <IconTrash size={24} />, onClick: () => {}, variant: 'danger' },
];

// El sheet se monta en un portal y solo existe cuando `open` es true, así que las historias
// lo abren desde un botón en vez de renderizarlo suelto.
function Demo({ items, label }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 24, minHeight: '100vh', boxSizing: 'border-box' }}>
      <Button variant="tertiary" size="m" onClick={() => setOpen(true)}>Abrir bottom sheet</Button>
      <BottomSheet open={open} items={items} label={label} onClose={() => setOpen(false)} />
    </div>
  );
}

export const Default = {
  name: 'Invitación pendiente',
  render: () => <Demo items={inviteItems} label="Manage invitation" />,
};

export const Member = {
  name: 'Miembro de un equipo',
  render: () => <Demo items={memberItems} label="Member options" />,
};

export const WithDisabledItem = {
  name: 'Con una opción deshabilitada',
  render: () => (
    <Demo
      label="Manage invitation"
      items={[
        { label: 'View email history', icon: <IconMailHistory size={24} />, onClick: () => {} },
        { label: 'Resend invite', icon: <IconResend size={24} />, onClick: () => {}, disabled: true },
        { label: 'Cancel invitation', icon: <IconTrash size={24} />, onClick: () => {}, variant: 'danger' },
      ]}
    />
  ),
};

export const SingleAction = {
  name: 'Una sola acción',
  render: () => (
    <Demo
      label="Member options"
      items={[{ label: 'Remove from team', icon: <IconTrash size={24} />, onClick: () => {}, variant: 'danger' }]}
    />
  ),
};
