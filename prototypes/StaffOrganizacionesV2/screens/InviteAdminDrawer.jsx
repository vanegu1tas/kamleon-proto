import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Dropdown from '../../../design-system/components/Dropdown/Dropdown';
import { IconClose, IconPlus } from '../../../design-system/icons/outline';
import { ORGS } from '../../StaffOrganizaciones/mockData';
import styles from '../../StaffOrganizaciones/screens/NewCenterDrawer.module.css';
import own from './InviteAdminDrawer.module.css';

// Rama "Invite an admin" del botón Create de la lista de organizaciones.
//
// Un admin SIEMPRE entra por correo: necesita cuenta para entrar y la cuenta nace al aceptar
// la invitación. Por eso acá no existe la pregunta "con o sin invitación" — esa vive solo en
// la rama de usuarios, que son los únicos que se pueden crear a mano.
//
// El tipo de admin se elige explícito (no se deduce de dónde lo metas) y de él dependen los
// selectores que hacen falta: organización · + centro · + equipo(s).

const ADMIN_TYPES = [
  { value: 'org',    label: 'Organization admin', needs: ['org'] },
  { value: 'center', label: 'Center admin',       needs: ['org', 'center'] },
  { value: 'team',   label: 'Team admin',         needs: ['org', 'center', 'teams'] },
];

const STAFF_TYPES = [
  { value: 'admin',  label: 'Kamleon Admin',  needs: [] },
  { value: 'editor', label: 'Kamleon Editor', needs: [] },
];

const DESCRIPTIONS = {
  org:    "An Org Admin manages this organization and all of its centers. They can invite and remove organization and center admins, see every user across centers, and view the organization's data and reports.",
  center: "A Center Admin manages this center day-to-day. They can create teams, invite users and team admins, set up PIN and screen access, and view the center's data and reports.",
  team:   "A Team Admin manages this team day-to-day. They can invite and remove users, set up PIN and screen access, and view the team's data and reports.",
  admin:  'A Kamleon Admin has full access to every organization.',
  editor: 'A Kamleon Editor manages units across organizations and can invite center admins.',
};

export default function InviteAdminDrawer({ staff = false, onClose, onSave }) {
  const types = staff ? STAFF_TYPES : ADMIN_TYPES;
  const [type, setType]         = useState(types[0].value);
  const [orgId, setOrgId]       = useState('');
  const [centerId, setCenterId] = useState('');
  const [teamIds, setTeamIds]   = useState([]);
  const [emails, setEmails]     = useState(['']);

  const needs = types.find(t => t.value === type)?.needs ?? [];
  const org    = ORGS.find(o => String(o.id) === orgId) ?? null;
  const center = (org?.centers ?? []).find(c => String(c.id) === centerId) ?? null;
  const teams  = center?.teams ?? [];

  function changeType(next) {
    setType(next);
    // Lo que deja de aplicar se limpia: si pasás de Team admin a Org admin, el equipo elegido
    // ya no tiene sentido y dejarlo guardado en silencio genera invitaciones raras.
    const nextNeeds = types.find(t => t.value === next)?.needs ?? [];
    if (!nextNeeds.includes('center')) setCenterId('');
    if (!nextNeeds.includes('teams'))  setTeamIds([]);
    if (!nextNeeds.includes('org'))    setOrgId('');
  }

  function toggleTeam(id) {
    setTeamIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  }

  const validEmails = emails.map(e => e.trim()).filter(Boolean);
  const hasScope =
    (!needs.includes('org')    || !!org) &&
    (!needs.includes('center') || !!center) &&
    (!needs.includes('teams')  || teamIds.length > 0);
  const canSend = hasScope && validEmails.length > 0;

  const selectedTeams = teams.filter(t => teamIds.includes(t.id));

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={e => e.stopPropagation()}>

        <div className={styles.header}>
          <h2 className={styles.title}>{staff ? 'Invite Kamleon team' : 'Invite an admin'}</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        <div className={styles.body}>

          <Dropdown
            label={staff ? 'Role' : 'Admin type'}
            required
            options={types.map(t => ({ label: t.label, value: t.value }))}
            value={type}
            onChange={changeType}
          />

          {needs.includes('org') && (
            <Dropdown
              label="Organization"
              required
              placeholder="Select an organization"
              options={ORGS.map(o => ({ label: o.name, value: String(o.id) }))}
              value={orgId}
              onChange={value => { setOrgId(value); setCenterId(''); setTeamIds([]); }}
            />
          )}

          {needs.includes('center') && (
            <Dropdown
              label="Center"
              required
              placeholder={org ? 'Select a center' : 'Select an organization first'}
              options={(org?.centers ?? []).map(c => ({ label: c.name, value: String(c.id) }))}
              value={centerId}
              onChange={value => { setCenterId(value); setTeamIds([]); }}
              disabled={!org}
            />
          )}

          {/* Un Team Admin puede llevar más de un equipo, así que acá se eligen varios. */}
          {needs.includes('teams') && (
            <div className={own.field}>
              <span className={own.label}>Teams <span className={own.required}>*</span></span>
              {!center ? (
                <p className={own.hint}>Select a center first.</p>
              ) : teams.length === 0 ? (
                <p className={own.hint}>This center has no teams yet.</p>
              ) : (
                <div className={own.teamList}>
                  {teams.map(team => (
                    <button
                      key={team.id}
                      type="button"
                      className={`${own.teamOption} ${teamIds.includes(team.id) ? own.teamOptionSelected : ''}`}
                      onClick={() => toggleTeam(team.id)}
                    >
                      <span className={own.checkbox}>
                        {teamIds.includes(team.id) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                            <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      {team.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionInfo}>
              <p className={styles.sectionLabel}>Email</p>
              <p className={styles.sectionSubtitle}>
                {DESCRIPTIONS[type]} They'll receive an email to accept the role.
              </p>
            </div>

            {emails.map((email, i) => (
              <div key={i} className={styles.addItemRow}>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={e => setEmails(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                />
                <button
                  className={styles.removeItemBtn}
                  type="button"
                  onClick={() => setEmails(prev => prev.filter((_, idx) => idx !== i))}
                  aria-label="Remove"
                >
                  <IconClose size={14} />
                </button>
              </div>
            ))}

            <button className={styles.addBtn} type="button" onClick={() => setEmails(prev => [...prev, ''])}>
              <IconPlus size={16} />
              Add another
            </button>
          </div>

        </div>

        <div className={styles.footer}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="m"
            disabled={!canSend}
            onClick={() => {
              onSave?.({
                type,
                org,
                center,
                teams: selectedTeams,
                emails: validEmails,
              });
              onClose();
            }}
          >
            Send invite
          </Button>
        </div>

      </div>
    </div>
  );
}
