import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconChevronDown, IconInfoCircle } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Toggle from '../../../design-system/components/Toggle/Toggle';
import SegmentedControl from '../../../design-system/components/SegmentedControl/SegmentedControl';
import styles from './EditUserDrawer.module.css';

function SettingRow({ label, description, checked, onChange, disabled }) {
  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <span className={styles.settingLabel}>{label}</span>
        <span className={styles.settingDesc}>{description}</span>
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

// "On/Off" para PIN/Visible on screen (toggles de feature) — "Active/Inactive" queda
// reservado solo para Status (estado de la cuenta), para no mezclar los dos conceptos.
const ON_OFF_OPTIONS = [{ label: 'On', value: true }, { label: 'Off', value: false }];

function PermissionRow({ label, tooltip, value, onChange }) {
  return (
    <div className={styles.permissionRow}>
      <span className={styles.permissionLabelRow}>
        {label}
        {tooltip && (
          <span className={styles.infoIconWrap} data-tooltip={tooltip}>
            <IconInfoCircle size={14} />
          </span>
        )}
      </span>
      <SegmentedControl options={ON_OFF_OPTIONS} value={value} onChange={onChange} size="s" />
    </div>
  );
}

function StatusField({ value, onChange }) {
  const statusValue = value ? 'active' : 'inactive';
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>Status</label>
      <div className={styles.statusSelectWrapFull}>
        <span className={`${styles.statusDot} ${styles[statusValue]}`} />
        <select
          className={styles.statusSelectFull}
          value={statusValue}
          onChange={e => onChange(e.target.value === 'active')}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <span className={styles.statusSelectChevron}><IconChevronDown size={16} /></span>
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────

export default function EditUserDrawer({ user, team, onClose, role, onRemove }) {
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
  const [status,   setStatus]   = useState(user.status === 'active');
  const [rfid,     setRfid]     = useState(user.rfid     ?? false);
  // Team Admin: users.editData (docs/permissions.md) trata RFID como un dato más del
  // usuario (el código de la tarjeta), no como un switch de encendido/apagado — coincide
  // con la referencia del programador (input "Enter RFID"). El resto de roles sigue con
  // el Toggle de antes, no se tocó esa parte.
  const [rfidCode, setRfidCode] = useState(user.rfid ? `RFID-${String(user.id).padStart(6, '0')}` : '');
  const [jerseyNumber, setJerseyNumber] = useState(user.jerseyNumber != null ? String(user.jerseyNumber) : '');
  const [pin,      setPin]      = useState(user.pin      ?? false);
  const [visibleOnScreen, setVisibleOnScreen] = useState(user.visibleOnScreen ?? true);

  const hasChanges =
    name     !== (user.name     ?? '') ||
    email    !== (user.email    ?? '') ||
    phone    !== (user.phone    ?? '') ||
    birthday !== (user.birthday ?? '') ||
    gender   !== (user.gender   ?? '') ||
    height   !== (user.height   ?? '') ||
    weight   !== (user.weight   ?? '') ||
    status   !== (user.status === 'active') ||
    rfid     !== (user.rfid     ?? false) ||
    rfidCode !== (user.rfid ? `RFID-${String(user.id).padStart(6, '0')}` : '') ||
    jerseyNumber !== (user.jerseyNumber != null ? String(user.jerseyNumber) : '') ||
    pin      !== (user.pin      ?? false) ||
    visibleOnScreen !== (user.visibleOnScreen ?? true);

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
                <label className={styles.fieldLabel}>Gender</label>
                <input
                  className={styles.input}
                  placeholder="Male / Female / Other"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
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

            {role === 'teamAdmin' && (
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>RFID</label>
                  <input
                    className={styles.input}
                    placeholder="Enter RFID"
                    value={rfidCode}
                    onChange={e => setRfidCode(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Jersey Number</label>
                  <input
                    className={styles.input}
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 9"
                    value={jerseyNumber}
                    onChange={e => setJerseyNumber(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
            )}

            {role !== 'teamAdmin' && (
              <SettingRow
                label="RFID"
                description="Allow this user to log in via proximity card."
                checked={rfid}
                onChange={setRfid}
              />
            )}

            <StatusField value={status} onChange={setStatus} />

          </div>

          {/* Permissions */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Permissions</h3>
            <div className={styles.permissionsGroup}>
              <PermissionRow
                label="Visible on screen"
                tooltip="Show members on the device's roster screen."
                value={visibleOnScreen}
                onChange={setVisibleOnScreen}
              />
              <PermissionRow
                label="PIN"
                tooltip="Allow members to log in with a PIN."
                value={pin}
                onChange={setPin}
              />
            </div>
          </div>

          {/* Actions — "Regenerate PIN" se quitó (21/9): la acción ya no existe en el producto,
              ni acá ni en el menú "⋯" de la fila ni en Bulk actions. */}
          {onRemove && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Actions</h3>
              <div className={styles.actionsList}>
                <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} type="button" onClick={onRemove}>
                  Remove from team
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="m" disabled={!hasChanges || !firstName.trim() || !lastName.trim() || yearInvalid} onClick={onClose}>Save</Button>
        </div>

      </div>
    </div>
  );
}
