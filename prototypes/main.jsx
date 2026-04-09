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
import Login from './Login/Login';
import AccountDetails from './StaffOrganizacionesV2/screens/AccountDetails';
import { ORGS, CENTER_ADMIN_USER } from './StaffOrganizaciones/mockData';

// URL param deep-linking: ?proto=v2&org=3&center=301
const urlParams = new URLSearchParams(window.location.search);
const paramProto  = urlParams.get('proto');
const paramOrgId  = urlParams.get('org')    ? Number(urlParams.get('org'))    : null;
const paramCenter = urlParams.get('center') ? Number(urlParams.get('center')) : null;

function PrototypeSelector() {
  const [active, setActive] = useState(null);
  const [centerAdminCenters, setCenterAdminCenters] = useState(2);

  // Deep-link: skip selector and load the specified prototype/state
  if (paramProto === 'login') return <Login />;
  if (paramProto === 'account') return (
    <div style={{ background: 'var(--color-bg-page)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AccountDetails onClose={() => {}} />
    </div>
  );
  if (paramProto === 'v1') return <StaffOrganizaciones />;
  if (paramProto === 'v2') {
    const org = paramOrgId ? ORGS.find(o => o.id === paramOrgId) : null;
    const center = org && paramCenter ? org.centers.find(c => c.id === paramCenter) : null;
    return <StaffOrganizacionesV2 initialOrgId={paramOrgId} initialCenterId={center} />;
  }
  if (paramProto === 'center-admin') {
    const centersParam = urlParams.get('centers') ? Number(urlParams.get('centers')) : 2;
    const org = ORGS.find(o => o.id === CENTER_ADMIN_USER.orgId);
    const assignedCenters = org.centers.filter(c => CENTER_ADMIN_USER.centerIds.slice(0, centersParam).includes(c.id));
    return <StaffOrganizacionesV2 role="center-admin" currentUser={CENTER_ADMIN_USER} assignedCenters={assignedCenters} />;
  }

  if (active === 'login') return <Login />;
  if (active === 'v1') return <StaffOrganizaciones />;
  if (active === 'v2') return <StaffOrganizacionesV2 />;
  if (active === 'center-admin') {
    const org = ORGS.find(o => o.id === CENTER_ADMIN_USER.orgId);
    const assignedCenters = org.centers.filter(c => CENTER_ADMIN_USER.centerIds.slice(0, centerAdminCenters).includes(c.id));
    return <StaffOrganizacionesV2 role="center-admin" currentUser={CENTER_ADMIN_USER} assignedCenters={assignedCenters} />;
  }

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

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => setActive('login')} style={cardStyle}>
          <span style={cardTitle}>Login</span>
          <span style={cardDesc}>Flujo de autenticación. Sign in, sign up, forgot password.</span>
          <span style={cardTag}>Login</span>
        </button>

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

        <div style={cardStyle}>
          <span style={cardTitle}>Center Admin</span>
          <span style={cardDesc}>Panel del administrador de centro. Scoped a sus centros asignados.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ ...cardTag, marginTop: 0 }}>CAdmin</span>
            <select
              value={centerAdminCenters}
              onChange={e => setCenterAdminCenters(Number(e.target.value))}
              onClick={e => e.stopPropagation()}
              style={{
                fontSize: 'var(--font-size-12)',
                fontFamily: 'var(--font-family-primary)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-subtle)',
                background: 'var(--color-bg-surface-subtle)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-xs)',
                padding: '2px 6px',
                cursor: 'pointer',
              }}
            >
              <option value={1}>1 centro</option>
              <option value={2}>2 centros</option>
            </select>
          </div>
          <button
            onClick={() => setActive('center-admin')}
            style={{
              all: 'unset',
              marginTop: '8px',
              fontSize: 'var(--font-size-13)',
              fontFamily: 'var(--font-family-primary)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-strong)',
              background: 'var(--color-bg-page)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-xs)',
              padding: '6px 14px',
              cursor: 'pointer',
            }}
          >
            Abrir →
          </button>
        </div>
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
