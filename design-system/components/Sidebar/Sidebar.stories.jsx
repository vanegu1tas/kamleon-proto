import { useState } from 'react';
import Sidebar from './Sidebar';
import {
  IconSbCenter,
  IconSbTeams,
  IconSbDrop,
  IconSbChart,
  IconSbUnit,
} from '../../icons';

const SECTIONS = [
  {
    id: 'main',
    label: 'GESTIÓN',
    items: [
      { id: 'centros',  label: 'Centros',       icon: <IconSbCenter />, active: true  },
      { id: 'equipos',  label: 'Equipos',        icon: <IconSbTeams />,  active: false },
    ],
  },
  {
    id: 'clinical',
    label: 'CLÍNICA',
    items: [
      { id: 'hidra',    label: 'Hidratación',    icon: <IconSbDrop />,   active: false },
      { id: 'uro',      label: 'Uroflujometría', icon: <IconSbChart />,  active: false },
      { id: 'devices',  label: 'Dispositivos',   icon: <IconSbUnit />,   active: false },
    ],
  },
];

// Mock de personas por rol — mismo shape que prototypes/StaffOrganizacionesV2/rolePersonas.js,
// duplicado acá a propósito para que esta story no dependa de un prototipo específico.
const PERSONAS = {
  owner:       { key: 'owner',       initials: 'KO', name: 'Kamleon', surname: 'Owner',   role: 'Kamleon Owner',  scope: 'All organizations', pendingInvites: 0 },
  admin:       { key: 'admin',       initials: 'DV', name: 'Daniel',  surname: 'Vanegas', role: 'Kamleon Admin',  scope: 'All organizations', pendingInvites: 0 },
  editor:      { key: 'editor',      initials: 'KE', name: 'Kamleon', surname: 'Editor',  role: 'Kamleon Editor', scope: 'All organizations', pendingInvites: 0 },
  orgAdmin:    { key: 'orgAdmin',    initials: 'JH', name: 'Jordan',  surname: 'Hobbs',   role: 'Org Admin',      scope: 'Astonia FC',         pendingInvites: 0 },
  centerAdmin: { key: 'centerAdmin', initials: 'CR', name: 'Casey',   surname: 'Reeve',   role: 'Center Admin',   scope: 'Training Ground',    pendingInvites: 2 },
  teamAdmin:   { key: 'teamAdmin',   initials: 'SA', name: 'Sam',     surname: 'Alcaraz', role: 'Team Admin',     scope: '3 teams · 2 centers', pendingInvites: 0 },
  endUser:     { key: 'endUser',     initials: 'AR', name: 'Alex',    surname: 'Rivera',  role: 'End User',       scope: undefined,            pendingInvites: 0 },
};

const ROLE_OPTIONS = Object.values(PERSONAS).map(p => ({
  key: p.key, label: p.role, scope: p.scope, initials: p.initials,
}));

function SidebarWithState({ startCollapsed = false, initialRoleKey = 'centerAdmin', withFooter = true }) {
  const [collapsed, setCollapsed] = useState(startCollapsed);
  const [roleKey, setRoleKey] = useState(initialRoleKey);
  const user = PERSONAS[roleKey];

  return (
    <Sidebar
      collapsed={collapsed}
      onToggle={() => setCollapsed(c => !c)}
      sections={SECTIONS}
      user={withFooter ? user : undefined}
      roleOptions={withFooter ? ROLE_OPTIONS : []}
      currentRoleKey={roleKey}
      onRoleChange={setRoleKey}
      onAccountDetails={() => console.log('Account details clicked')}
    />
  );
}

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'page' },
    docs: {
      description: {
        component: 'Shell de navegación lateral. El footer (tarjeta de usuario + "Pending invites") es '
          + 'opcional vía la prop `user` — sin ella, el sidebar queda solo con la navegación. Con `user`, '
          + 'se habilita: tooltip con delay al hover de la tarjeta (rol + a qué está limitado, para cuando '
          + 'el texto se corta), y un menú de cuenta al hacer click, con un submenú "Switch role" (hover) '
          + 'que lista `roleOptions` y un submenú "Language" fijo. Ambos submenús se centran respecto a la '
          + 'fila que los abre y se recortan (clamp) para nunca salirse del viewport.',
      },
    },
  },
};

export const Expanded = {
  render: () => <SidebarWithState startCollapsed={false} />,
};

export const Collapsed = {
  render: () => <SidebarWithState startCollapsed={true} />,
};

export const WithoutFooter = {
  render: () => <SidebarWithState startCollapsed={false} withFooter={false} />,
};

export const PendingInvites = {
  render: () => <SidebarWithState startCollapsed={false} initialRoleKey="centerAdmin" />,
};

export const NoScope = {
  name: 'Sin scope (staff global)',
  render: () => <SidebarWithState startCollapsed={false} initialRoleKey="admin" />,
};
