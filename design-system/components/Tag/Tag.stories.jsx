import Tag from './Tag';

const STATUSES = ['active', 'inactive', 'pending', 'expired', 'delay', 'delivered'];

export default {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: {
    status: 'active',
  },
  argTypes: {
    status: { control: 'select', options: STATUSES },
    label: { control: 'text' },
  },
};

function Row({ title, description, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontFamily: 'var(--font-family-primary)', fontSize: 12, fontWeight: 500, letterSpacing: '0.6px', textTransform: 'uppercase', color: 'var(--color-text-subtle)' }}>
        {title}
      </span>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
      {description && (
        <span style={{ fontFamily: 'var(--font-family-primary)', fontSize: 12, color: 'var(--color-text-subtle)', maxWidth: 520 }}>
          {description}
        </span>
      )}
    </div>
  );
}

export const Playground = {};

export const AllStatuses = {
  name: 'Todos los estados',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Row
        title="Estado de la entidad"
        description="Una organización, un centro, un equipo o una persona: solo activo o inactivo, no hay más estados en el sistema."
      >
        <Tag status="active" />
        <Tag status="inactive" />
      </Row>

      <Row
        title="Ciclo de vida de una invitación"
        description="Pending mientras no se acepta, Expired cuando caduca. Al aceptarse, la fila pasa a Active."
      >
        <Tag status="pending" />
        <Tag status="expired" />
      </Row>

      <Row
        title="Envío del correo"
        description="Solo dentro del historial de correo (Kamleon staff). No es el estado de la invitación, sino el del mensaje."
      >
        <Tag status="delay" />
        <Tag status="delivered" />
      </Row>
    </div>
  ),
};

export const CustomLabel = {
  name: 'Texto propio',
  args: { status: 'active', label: 'Connected' },
};
