import { useState } from 'react';
import Sidebar from './Sidebar';
import {
  IconSbCenter,
  IconSbDrop,
  IconSbChart,
  IconSbUnit,
  IconSbMyData,
} from '../../icons';

// Mismas secciones que la app (Figma DS "Sidebar-v2", 2155:1987). "Units" no lo ven ni
// Org Admin ni Center Admin: tienen ese contenido en el tab de su organización/centro.
const SECTIONS = [
  {
    id: 'management',
    label: 'Management',
    items: [
      { id: 'center', label: 'Control panel', icon: <IconSbCenter />, active: true  },
      { id: 'units',  label: 'Units',         icon: <IconSbUnit />,   active: false },
      { id: 'usage',  label: 'Unit usage',    icon: <IconSbChart />,  active: false },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    items: [
      { id: 'hydration', label: 'Hydration', icon: <IconSbDrop />, active: false },
    ],
  },
];

const SECTIONS_CLIENT = SECTIONS.map(section => ({
  ...section,
  items: section.items.filter(item => item.id !== 'units'),
}));

const PERSONAL_ITEM = { id: 'mydata', label: 'My data', icon: <IconSbMyData />, active: false, onClick: () => {} };

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

function SidebarWithState({ startCollapsed = false, initialRoleKey = 'centerAdmin', withFooter = true, sections = SECTIONS_CLIENT, personalItem = PERSONAL_ITEM }) {
  const [collapsed, setCollapsed] = useState(startCollapsed);
  const [roleKey, setRoleKey] = useState(initialRoleKey);
  const user = PERSONAS[roleKey];

  return (
    <Sidebar
      collapsed={collapsed}
      onToggle={() => setCollapsed(c => !c)}
      sections={sections}
      personalItem={personalItem}
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
        component: 'Shell de navegación lateral. El pie (ítem "My data" vía `personalItem`, "Pending '
          + 'invites" y la tarjeta de usuario) es opcional vía la prop `user`. Con `user` se habilita: '
          + 'tooltip con delay al hover de la tarjeta, y un menú de cuenta al hacer click, con submenús '
          + '"Switch role" y "Language" que se centran en su fila y se recortan para no salirse del '
          + 'viewport.\n\n**Colapsado**: el ancho se anima (240ms) y los textos se encogen y desvanecen '
          + 'en lugar de desaparecer de golpe. El carril mantiene el pie completo — "My data", el badge '
          + 'de pendientes y el avatar — y ahí los tooltips (incluido el del avatar) salen por fuera, a '
          + 'la derecha. Todo se desactiva con `prefers-reduced-motion`.',
      },
    },
  },
};

export const Expanded = {
  render: () => <SidebarWithState startCollapsed={false} />,
};

export const Collapsed = {
  name: 'Colapsado',
  render: () => <SidebarWithState startCollapsed={true} />,
};

export const CollapseAnimation = {
  name: 'Animación de colapsar',
  parameters: {
    docs: { description: { story: 'Usa el botón « / » de la cabecera para ver la transición de ancho y cómo los textos se encogen dentro del icono.' } },
  },
  render: () => <SidebarWithState startCollapsed={false} />,
};

export const StaffFullNav = {
  name: 'Kamleon staff (con Units)',
  render: () => <SidebarWithState startCollapsed={false} initialRoleKey="admin" sections={SECTIONS} />,
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
