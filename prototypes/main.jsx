import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../design-system/tokens/fonts.css';
import '../design-system/tokens/colors.css';
import '../design-system/tokens/semantic-colors.css';
import '../design-system/tokens/typography.css';
import '../design-system/tokens/text-styles.css';
import '../design-system/tokens/tokens.css';
import StaffOrganizaciones from './StaffOrganizaciones/StaffOrganizaciones';
import StaffOrganizacionesV2 from './StaffOrganizacionesV2/StaffOrganizacionesV2';

function PrototypeSelector() {
  const [active, setActive] = useState(null);

  if (active === 'v1') return <StaffOrganizaciones />;
  if (active === 'v2') return <StaffOrganizacionesV2 />;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '40px',
      background: 'var(--color-bg-page)',
      fontFamily: 'var(--font-family-primary)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: 'var(--font-size-12)', fontWeight: 'var(--font-weight-medium)', letterSpacing: '0.6px', textTransform: 'uppercase', color: 'var(--color-text-subtle)' }}>
          Kamleon Prototypes
        </span>
        <span style={{ fontSize: 'var(--font-size-24)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-strong)' }}>
          Selecciona un prototipo
        </span>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button onClick={() => setActive('v1')} style={cardStyle}>
          <span style={cardTitle}>Staff — List View</span>
          <span style={cardDesc}>Navegación por capas. Drill-down org → centro → equipo → usuario.</span>
          <span style={cardTag}>V1</span>
        </button>

        <button onClick={() => setActive('v2')} style={cardStyle}>
          <span style={cardTitle}>Staff — Master Detail</span>
          <span style={cardDesc}>Vista de ficha completa. Pensado para gestores con flujo tipo Excel.</span>
          <span style={cardTag}>V2</span>
        </button>
      </div>
    </div>
  );
}

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px',
  width: '260px',
  padding: '24px',
  background: 'var(--color-bg-surface)',
  border: '1px solid var(--color-border-default)',
  borderRadius: 'var(--radius-s)',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'border-color 150ms, box-shadow 150ms',
};

const cardTitle = {
  fontSize: 'var(--font-size-16)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-text-strong)',
};

const cardDesc = {
  fontSize: 'var(--font-size-14)',
  fontWeight: 'var(--font-weight-book)',
  color: 'var(--color-text-subtle)',
  lineHeight: '1.4',
};

const cardTag = {
  marginTop: '4px',
  fontSize: 'var(--font-size-12)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-text-subtle)',
  background: 'var(--color-bg-surface-subtle)',
  padding: '2px 8px',
  borderRadius: 'var(--radius-xs)',
};

createRoot(document.getElementById('root')).render(<PrototypeSelector />);
