import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconChevronDown, IconInfoCircle, IconWarning2 } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import SegmentedControl from '../../../design-system/components/SegmentedControl/SegmentedControl';
import Dropdown from '../../../design-system/components/Dropdown/Dropdown';
import Checkbox from '../../../design-system/components/Checkbox/Checkbox';
import styles from './EditUserDrawer.module.css';
import { ORGS } from '../mockData';

// Busca en el mock el equipo y su centro (para "Team · Center" y el estado de la pertenencia)
function findTeam(teamId) {
  for (const org of ORGS) for (const center of org.centers ?? []) for (const team of center.teams ?? []) {
    if (team.id === teamId) return { org, center, team };
  }
  return null;
}

// Pertenencias que ve quien edita (10/11). Staff y Org Admin: todos los equipos de la persona en la org.
// Center Admin: los del centro desde el que abrió. Team Admin las recibe ya filtradas (memberships).
// El equipo desde el que se abrió va primero.
function membershipsFor(user, team, role) {
  const found = team?.id != null ? findTeam(team.id) : null;
  if (!found) return null;
  const centers = role === 'centerAdmin' ? [found.center] : (found.org.centers ?? []);
  const list = [];
  centers.forEach(c => (c.teams ?? []).forEach(t => {
    const isUser = (t.users ?? []).includes(user.id), isAdmin = (t.professionalIds ?? []).includes(user.id);
    if (!isUser && !isAdmin && t.id !== team.id) return;
    list.push({ teamId: t.id, teamName: t.name, role: isAdmin ? 'Team admin' : 'User' });
  }));
  return list.sort((a, b) => (a.teamId === team.id ? -1 : b.teamId === team.id ? 1 : 0));
}

const POSITION_OPTIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

// "On/Off" para PIN/Visible on screen (toggles de feature) — "Active/Inactive" queda
// reservado solo para Status (estado de la cuenta), para no mezclar los dos conceptos.
const ON_OFF_OPTIONS = [{ label: 'On', value: true }, { label: 'Off', value: false }];

function PermissionRow({ label, tooltip, value, onChange, disabled = false }) {
  return (
    <div className={`${styles.permissionRow} ${disabled ? styles.permissionRowDisabled : ''}`}>
      <span className={styles.permissionLabelRow}>
        {label}
        {tooltip && (
          <span className={styles.infoIconWrap} data-tooltip={tooltip}>
            <IconInfoCircle size={14} />
          </span>
        )}
      </span>
      <span className={styles.segWide}>
        <SegmentedControl options={ON_OFF_OPTIONS} value={value} onChange={onChange} size="s" disabled={disabled} />
      </span>
    </div>
  );
}

// Status por equipo (10/11). Inactive en un equipo: oculto del roster y de analytics de ese equipo, y PIN y
// Visible on screen se apagan (el sistema no recuerda cómo estaban: al reactivar quedan en Off). Por eso, al
// pasar a Inactive, confirmación en el sitio (dentro de la tarjeta, no un modal encima del drawer) que dice
// qué se apaga y cómo estaba. Volver a Active no pide nada.
const STATUS_OPTIONS = [{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }];

function MembershipStatus({ state, confirming, onAskInactive, onConfirm, onKeep, onActivate }) {
  const turnsOff = [state.pin && 'PIN', state.visible && 'Visible on screen'].filter(Boolean);
  return (
    <div className={`${styles.permissionRow} ${styles.statusRow}`}>
      <div className={styles.statusRowTop}>
        <span className={styles.permissionLabelRow}>
          Status
          <span className={styles.infoIconWrap} data-tooltip="Controls whether the user takes part in this team. Inactive users keep access to their own data.">
            <IconInfoCircle size={14} />
          </span>
        </span>
        <span className={styles.segWide}>
          <SegmentedControl
            options={STATUS_OPTIONS}
            value={state.active ? 'active' : 'inactive'}
            onChange={v => (v === 'inactive' ? onAskInactive() : onActivate())}
            size="s"
          />
        </span>
      </div>
      {confirming && (
        <div className={styles.statusConfirm} role="alertdialog" aria-label="Set as inactive in this team?">
          <span className={styles.statusConfirmTitle}><IconWarning2 size={16} />Set as inactive in this team?</span>
          <p className={styles.statusConfirmText}>
            Hidden from the roster and analytics.
            {turnsOff.length > 0 && ' These will be turned off and won\'t come back on automatically:'}
          </p>
          {turnsOff.length > 0 && (
            <ul className={styles.statusConfirmList}>
              {turnsOff.map(t => <li key={t}>{t} (currently on)</li>)}
            </ul>
          )}
          <div className={styles.statusConfirmActions}>
            <Button variant="tertiary" size="s" onClick={onKeep}>Keep active</Button>
            <Button variant="primary" size="s" onClick={onConfirm}>Set inactive</Button>
          </div>
        </div>
      )}
      {!state.active && !confirming && (
        <p className={styles.statusHint}><IconInfoCircle size={16} />Hidden from this team's roster and analytics.</p>
      )}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────

export default function EditUserDrawer({ user, team, onClose, role, onRemove, memberships: membershipsProp }) {
  // Pertenencias que quien está mirando puede ver. Si no se pasan, se asume la única que
  // conoce la pantalla: el equipo desde el que se abrió el drawer.
  const memberships = (membershipsProp?.length
    ? membershipsProp
    : membershipsFor(user, team, role) ?? [{ teamId: team?.id, teamName: team?.name, role: user.role === 'professional' ? 'Team admin' : 'User',
        status: (team?.inactiveUsers ?? []).includes(user.id) || user.status === 'inactive' ? 'inactive' : 'active' }]
  ).map(m => {
    // Completa centro y estado desde el mock cuando quien llama no los trae
    const f = findTeam(m.teamId);
    return {
      ...m,
      teamName: m.teamName ?? f?.team.name,
      centerName: m.centerName ?? f?.center.name,
      orgName: m.orgName ?? f?.org.name,
      status: m.status ?? ((f?.team.inactiveUsers ?? []).includes(user.id) ? 'inactive' : 'active'),
    };
  });
  // El excel da users.viewStatus Y users.changeStatus a Team Admin (docs/permissions.md) —
  // antes lo ocultábamos del todo por confusión en testing con el switch viejo; ahora que
  // Status usa el mismo dropdown establecido en el resto de la app (EditOrgDrawer/EditTeamDrawer),
  // se lo mostramos igual que a los demás roles.
  // El modelo de datos solo guarda un "name" completo (no first/last separados) — lo
  // partimos acá solo para la UI y lo recomponemos al guardar, sin tocar el resto de la
  // app (que sigue usando user.name como string único en todos lados).
  const [firstName, setFirstName] = useState((user.name ?? '').split(' ')[0] ?? '');
  const [lastName,  setLastName]  = useState((user.name ?? '').split(' ').slice(1).join(' '));
  const name = `${firstName} ${lastName}`.trim();
  const [email,    setEmail]    = useState(user.email    ?? '');
  const [phone,    setPhone]    = useState(user.phone    ?? '');
  // Birthday: mismo trato que Name/Surname — se parte en 3 inputs solo para la UI
  // (día/mes/año, como en la referencia) y se recompone en un solo string DD/MM/YYYY.
  const [birthDay,   setBirthDay]   = useState((user.birthday ?? '').split('/')[0] ?? '');
  const [birthMonth, setBirthMonth] = useState((user.birthday ?? '').split('/')[1] ?? '');
  const [birthYear,  setBirthYear]  = useState((user.birthday ?? '').split('/')[2] ?? '');
  const yearInvalid = birthYear.length > 0 && birthYear.length !== 4;
  const birthday = (birthDay && birthMonth && birthYear) ? `${birthDay}/${birthMonth}/${birthYear}` : '';
  const [gender,   setGender]   = useState(user.gender   ?? '');
  const [height,   setHeight]   = useState(user.height   ?? '');
  const [weight,   setWeight]   = useState(user.weight   ?? '');
  // Terms & consents y Delete account: solo Kamleon staff (10/11)
  const isStaff = ['owner', 'admin', 'editor'].includes(role);
  const [consents, setConsents] = useState({ health: true, web: true, app: true });
  // Team Admin: users.editData (docs/permissions.md) trata RFID como un dato más del
  // usuario (el código de la tarjeta), no como un switch de encendido/apagado — coincide
  // con la referencia del programador (input "Enter RFID"). El resto de roles sigue con
  // el Toggle de antes, no se tocó esa parte.
  const [rfidCode, setRfidCode] = useState(user.rfid ? `RFID-${String(user.id).padStart(6, '0')}` : '');
  const [pin,      setPin]      = useState(user.pin      ?? false);
  const [visibleOnScreen, setVisibleOnScreen] = useState(user.visibleOnScreen ?? true);
  // Status, PIN y Visible on screen por pertenencia (cada tarjeta, los suyos)
  const mKey = (m, i) => m.teamId ?? i;
  const [mState, setMState] = useState(() => Object.fromEntries(memberships.map((m, i) => [mKey(m, i), {
    active: m.status !== 'inactive',
    // Inactivo en ese equipo: PIN y Visible apagados (se apagan al desactivar)
    pin: m.status !== 'inactive' && (user.pin ?? false), visible: m.status !== 'inactive' && (user.visibleOnScreen ?? true),
    jersey: i === 0 && user.jerseyNumber != null ? String(user.jerseyNumber) : '', position: user.position ?? '',
  }])));
  const [confirmingKey, setConfirmingKey] = useState(null);
  const [membershipsDirty, setMembershipsDirty] = useState(false);
  const patchM = (k, patch) => { setMState(st => ({ ...st, [k]: { ...st[k], ...patch } })); setMembershipsDirty(true); };

  const hasChanges =
    name     !== (user.name     ?? '') ||
    email    !== (user.email    ?? '') ||
    phone    !== (user.phone    ?? '') ||
    birthday !== (user.birthday ?? '') ||
    gender   !== (user.gender   ?? '') ||
    height   !== (user.height   ?? '') ||
    weight   !== (user.weight   ?? '') ||
    !consents.health || !consents.web || !consents.app ||
    rfidCode !== (user.rfid ? `RFID-${String(user.id).padStart(6, '0')}` : '') ||
    pin      !== (user.pin      ?? false) ||
    visibleOnScreen !== (user.visibleOnScreen ?? true) ||
    membershipsDirty;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.drawer} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>Edit user</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* Context subtitle — solo tiene sentido para staff de Kamleon; un
              Team Admin ya sabe a qué equipo pertenece (entró desde ahí). */}
          {team && role !== 'teamAdmin' && (
            <p className={styles.contextSubtitle}>
              Editing user for <strong>{team.name}</strong>
            </p>
          )}

          {/* Avatar row */}
          <div className={styles.avatarRow}>
            <div className={styles.avatar}>{name.trim().charAt(0).toUpperCase()}</div>
            <div className={styles.avatarText}>
              <button className={styles.changePictureBtn} type="button">Add picture</button>
              <span className={styles.avatarSep}>-</span>
              <span className={styles.avatarOptional}>Optional</span>
            </div>
          </div>

          {/* User info */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>User info</h3>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Email</label>
              <span className={styles.fieldDesc}>Email cannot be changed</span>
              <input
                className={styles.input}
                value={email}
                disabled
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  Name <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  placeholder="First name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  Surname <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  placeholder="Last name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Phone</label>
                <input
                  className={styles.input}
                  placeholder="+1 000 000 0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <Dropdown
                  label="Gender"
                  placeholder="Select"
                  options={['Male', 'Female', 'Other']}
                  value={gender}
                  onChange={setGender}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Date of birth</label>
              <div className={styles.dobRow}>
                <input
                  className={styles.dobInput}
                  type="text"
                  inputMode="numeric"
                  placeholder="DD"
                  maxLength={2}
                  value={birthDay}
                  onChange={e => setBirthDay(e.target.value.replace(/\D/g, ''))}
                />
                <input
                  className={styles.dobInput}
                  type="text"
                  inputMode="numeric"
                  placeholder="MM"
                  maxLength={2}
                  value={birthMonth}
                  onChange={e => setBirthMonth(e.target.value.replace(/\D/g, ''))}
                />
                <input
                  className={`${styles.dobInput} ${yearInvalid ? styles.dobInputError : ''}`}
                  type="text"
                  inputMode="numeric"
                  placeholder="YYYY"
                  maxLength={4}
                  value={birthYear}
                  onChange={e => setBirthYear(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              {yearInvalid && (
                <span className={styles.dobError}>Year must be 4 digits</span>
              )}
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Height</label>
                <input
                  className={styles.input}
                  placeholder="e.g. 178 cm"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Weight</label>
                <input
                  className={styles.input}
                  placeholder="e.g. 75 kg"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>RFID scan code</label>
              <input
                className={styles.input}
                placeholder="Enter RFID"
                value={rfidCode}
                onChange={e => setRfidCode(e.target.value)}
              />
            </div>

          </div>

          {/* Permissions — una tarjeta por pertenencia.
              El PIN y la visibilidad en pantalla no son de la persona: son de su pertenencia a
              un equipo. Por eso cada tarjeta lleva sus propios ajustes y su propio "Remove from
              team" (lo que quitás es esa pertenencia, no la cuenta).
              La cabecera con rol y equipo aparece solo cuando se dibuja más de una tarjeta: con
              una sola no hay nada que distinguir. Quien mira ve únicamente las pertenencias sobre
              las que tiene competencia — un Team Admin, las de sus equipos.
              "Regenerate PIN" se quitó el 21/9: la acción ya no existe en el producto. */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{memberships.length > 1 ? 'Roles' : 'Role'}</h3>

            {memberships.map((membership, i) => (
              <div key={membership.teamId ?? i} className={styles.membershipBlock}>
              {membership.orgName && membership.orgName !== memberships[i - 1]?.orgName && (
                <span className={styles.membershipOrg}>
                  <span className={styles.membershipOrgAvatar} aria-hidden="true">{membership.orgName.charAt(0).toUpperCase()}</span>
                  {membership.orgName}
                </span>
              )}
              <div className={styles.permissionsCard}>
                <div className={styles.permissionsCardHeader}>
                  <span className={styles.permissionsCardRole}>{membership.role}</span>
                  <span className={styles.permissionsCardTeam}>
                    {[membership.teamName, membership.centerName].filter(Boolean).join(' · ')}
                  </span>
                </div>

                {(() => {
                  const k = mKey(membership, i);
                  const st = mState[k];
                  const off = !st.active;
                  return (
                    <div className={styles.permissionsGroup}>
                      <div className={styles.permissionRow}>
                        <span className={styles.permissionLabelRow}>
                          Jersey Number
                          <span className={styles.infoIconWrap} data-tooltip="The user's number in this team.">
                            <IconInfoCircle size={14} />
                          </span>
                        </span>
                        <input
                          className={`${styles.input} ${styles.cardInput} ${styles.jerseyInput}`}
                          type="text"
                          inputMode="numeric"
                          placeholder="—"
                          value={st.jersey}
                          onChange={e => patchM(k, { jersey: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                        />
                      </div>
                      <div className={styles.permissionRow}>
                        <span className={styles.permissionLabelRow}>
                          Position
                          <span className={styles.infoIconWrap} data-tooltip="The user's position in this team.">
                            <IconInfoCircle size={14} />
                          </span>
                        </span>
                        <span className={styles.positionWrap}>
                          <select
                            className={`${styles.input} ${styles.cardInput} ${styles.positionSelect}`}
                            value={st.position}
                            onChange={e => patchM(k, { position: e.target.value })}
                          >
                            <option value="">Select</option>
                            {POSITION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                          <span className={styles.positionChevron}><IconChevronDown size={16} /></span>
                        </span>
                      </div>
                      <MembershipStatus
                        state={st}
                        confirming={confirmingKey === k}
                        onAskInactive={() => setConfirmingKey(k)}
                        onKeep={() => setConfirmingKey(null)}
                        onConfirm={() => { patchM(k, { active: false, pin: false, visible: false }); setConfirmingKey(null); }}
                        onActivate={() => { patchM(k, { active: true }); setConfirmingKey(null); }}
                      />
                      <PermissionRow
                        label="Visible on screen"
                        tooltip={off ? 'Turned off while the user is inactive.' : "Show members on the device's roster screen."}
                        value={st.visible}
                        onChange={v => patchM(k, { visible: v })}
                        disabled={off}
                      />
                      <PermissionRow
                        label="PIN"
                        tooltip={off ? 'Turned off while the user is inactive.' : 'Allow members to log in with a PIN.'}
                        value={st.pin}
                        onChange={v => patchM(k, { pin: v })}
                        disabled={off}
                      />
                    </div>
                  );
                })()}

                <div className={styles.cardActions}>
                  <button
                    className={styles.actionBtn}
                    type="button"
                    disabled={!mState[mKey(membership, i)].active}
                    title={!mState[mKey(membership, i)].active ? 'Turned off while the user is inactive.' : undefined}
                  >
                    Set new PIN
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                    type="button"
                    onClick={() => onRemove?.(membership)}
                  >
                    Remove from team
                  </button>
                </div>
              </div>
              </div>
            ))}
          </div>

          {isStaff && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Terms &amp; consents</h3>
              <div className={styles.consents}>
                {[['health', 'Health consent'], ['web', 'Web Privacy Policy'], ['app', 'APP Privacy Policy']].map(([k, label]) => (
                  <label key={k} className={styles.consentRow}>
                    <span>{label}</span>
                    <Checkbox checked={consents[k]} onChange={v => setConsents(c => ({ ...c, [k]: v }))} />
                  </label>
                ))}
              </div>
            </div>
          )}

          {isStaff && (
            <button type="button" className={styles.deleteAccount}>Delete account</button>
          )}

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="tertiary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="m" disabled={!hasChanges || !firstName.trim() || !lastName.trim() || yearInvalid} onClick={onClose}>Save</Button>
        </div>

      </div>
    </div>
  );
}
