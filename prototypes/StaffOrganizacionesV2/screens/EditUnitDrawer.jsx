import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import Button from '../../../design-system/components/Button/Button';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Input from '../../../design-system/components/Input/Input';
import Dropdown from '../../../design-system/components/Dropdown/Dropdown';
import Textarea from '../../../design-system/components/Textarea/Textarea';
import Checkbox from '../../../design-system/components/Checkbox/Checkbox';
import { IconClose, IconChevronDown, IconInfoCircle, IconSearch, IconCheckCircle, IconPlus } from '../../../design-system/icons/outline';
import { getAvailable, deviceExists, assignDevice, unassignDevice, createDevice } from './devicesStore';
import shellStyles from '../../StaffOrganizaciones/screens/NewCenterDrawer.module.css';
import styles from './EditUnitDrawer.module.css';

const LANGUAGE_OPTIONS = ['English', 'Español', 'Français'];

const INSTALLATION_OPTIONS = ['Neolith', 'Embedded'];

// Figma 13056:136728: tres modos, cada uno con su ⓘ. "Public" ya no está en el diseño y
// "Roster" pasó a llamarse "On-screen" (copys de Daniel, 21/9).
const LOGIN_MODES = [
  { id: 'On-screen', tooltip: "Users choose their name from a list of the team's members." },
  { id: 'QR',        tooltip: 'Users scan a QR code to identify themselves.' },
  { id: 'RFID',      tooltip: 'Users tap an RFID badge to identify themselves.' },
];

const UPLOAD_FIELDS = [
  { label: 'Custom background', hint: 'For best results, use a 1920×1200px image in JPG or PNG.' },
  { label: 'Logo',              hint: 'For best results, use a 568×568px image in PNG' },
];

const MESSAGE_FIELDS = [
  { label: 'Hydration message Severely dehydrated', value: 'Estás severamente deshidratado' },
  { label: 'Hydration message Dehydrated',          value: 'Estás deshidratado' },
  { label: 'Hydration message hydrated',            value: 'Estás hidratado' },
  { label: 'Hydration message very well hydrated',  value: 'Estás perfectamente hidratado' },
  { label: 'Unavailable result message',            value: 'Resultado no disponible. Datos insuficientes' },
];

// Orden del Figma: [0] va junto a Status; luego de dos en dos.
const SCREEN_FIELDS = [
  { key: 'screenTimeouts',  label: 'Screen Timeouts',              value: '120' },
  { key: 'scoreScreen',     label: 'Score Screen',                 value: '10' },
  { key: 'waterflush',      label: 'Waterflush duration',          value: '70' },
  { key: 'analysing',       label: 'Analysing screen timeout',     value: '180', suffix: 'seconds' },
  { key: 'ota',             label: 'Ota screen timeout',           value: '300', suffix: 'seconds' },
  { key: 'ready',           label: 'Ready screen timeout',         value: '180', suffix: 'seconds' },
  { key: 'recalibration',   label: 'Recalibration screen timeout', value: '300', suffix: 'seconds' },
];

// Usage y Software: en el Figma solo llevan placeholder (0, XXXX, XX).
const READONLY_GROUPS = [
  { title: 'Usage',    fields: [['Total usage', '0'], ['Total Low volume usage', '0'], ['Total users', '0']] },
  { title: 'Software', fields: [['Software version', 'XXXX'], ['Firmware version', 'XXXX'], ['Hardware version', 'XX']] },
];

// Display / Sensor: mismo menú con buscador que On-Screen (Figma 13060:137076), en versión de
// una sola opción. Solo lista los devices disponibles en el inventario.
// Regla (Daniel, 29/10): el device ya guardado en la unit queda fijo y se quita con la ✕, que va
// fuera del campo como en New center. Lo elegido en esta edición (sin guardar) se puede cambiar
// con el chevron por si te equivocaste: la ✕ solo aparece una vez guardado.
// Crear: mismo flujo que "Link a unit" de New center (Figma 15002:105408 → 105599 → 105795).
// "+ Create new …" es la primera opción; al pulsarla el desplegable pasa a un panel con
// "‹ Create new …", el campo ID y un botón Create que se activa al escribir un ID libre.
function DeviceSelect({ label, placeholder, options, value, onChange, saved }) {
  const [open, setOpen]     = useState(false);
  const [mode, setMode]     = useState('list');
  const [search, setSearch] = useState('');
  const [newId, setNewId]   = useState('');
  const [confirmId, setConfirmId] = useState('');
  const ref = useRef(null);
  const noun = label.toLowerCase();

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) close();
    }
    // capture phase: el modal del drawer hace stopPropagation en su mousedown (ver On-Screen)
    document.addEventListener('mousedown', handleClick, true);
    return () => document.removeEventListener('mousedown', handleClick, true);
  }, [open]);

  const visible = options.filter(id => id.includes(search.trim()));
  const idTaken = newId.trim() !== '' && deviceExists(newId.trim());
  const isNew = value && !deviceExists(value);
  const locked = !!value && value === saved;

  function close() {
    setOpen(false);
    setMode('list');
    setSearch('');
    setNewId('');
    setConfirmId('');
  }

  function pick(id) {
    onChange(id);
    close();
  }

  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.rosterWrap} ref={ref}>
        {locked ? (
          <div className={`${styles.rosterTrigger} ${styles.deviceFilled}`}>
            <span className={styles.rosterValue}>{value}</span>
            <button
              type="button"
              className={styles.deviceClear}
              onClick={() => { setMode('remove'); setOpen(true); }}
              aria-label={`Remove ${noun} ${value} from unit`}
              data-tooltip={`Remove ${noun}`}
            >
              <IconClose size={16} />
            </button>
          </div>
        ) : (
          <button type="button" className={styles.rosterTrigger} onClick={() => (open ? close() : setOpen(true))}>
            <span className={value ? styles.rosterValue : styles.rosterPlaceholder}>{value || placeholder}</span>
            <span className={styles.rosterChevron}><IconChevronDown size={16} /></span>
          </button>
        )}
        {open && mode === 'list' && (
          <div className={styles.rosterDropdown}>
            <div className={styles.rosterSearchRow}>
              <IconSearch size={16} />
              <input
                className={styles.rosterSearchInput}
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <button
              type="button"
              className={`${styles.rosterOption} ${styles.deviceCreate}`}
              onClick={() => { setNewId(search.trim()); setMode('create'); }}
            >
              <IconPlus size={16} />
              <span className={styles.rosterOptionLabel}>Create new {noun}</span>
            </button>
            {options.length === 0 ? (
              <p className={styles.rosterEmptyOption}>No unassigned {noun}s</p>
            ) : visible.length === 0 ? (
              <p className={styles.rosterEmptyOption}>No {noun}s match "{search}"</p>
            ) : visible.map(id => (
              <button key={id} type="button" className={styles.rosterOption} onClick={() => pick(id)}>
                <span className={styles.rosterOptionLabel}>{id}</span>
              </button>
            ))}
          </div>
        )}
        {open && mode === 'create' && (
          <div className={`${styles.rosterDropdown} ${styles.devicePanel}`}>
            <button type="button" className={styles.devicePanelBack} onClick={() => setMode('list')}>
              <span className={styles.devicePanelBackIcon}><IconChevronDown size={16} /></span>
              Create new {noun}
            </button>
            <Input
              label="ID"
              required
              placeholder="Write here..."
              value={newId}
              onChange={setNewId}
              error={idTaken ? 'This ID already exists' : undefined}
              autoFocus
            />
            <div className={styles.devicePanelFooter}>
              <Button variant="primary" size="s" disabled={newId.trim() === '' || idTaken} onClick={() => pick(newId.trim())}>
                Create
              </Button>
            </div>
          </div>
        )}
        {/* Quitar pide escribir el ID, con la mecánica del modal de eliminar, pero dentro del
            campo como "Create new" (revisión 30/10). Solo lo marca: se aplica al pulsar Save. */}
        {open && mode === 'remove' && (
          <div className={`${styles.rosterDropdown} ${styles.devicePanel}`}>
            <button type="button" className={styles.devicePanelBack} onClick={close}>
              <span className={styles.devicePanelBackIcon}><IconChevronDown size={16} /></span>
              Remove {noun}
            </button>
            <Input
              label={`Type ${value} to confirm`}
              placeholder="Write here"
              value={confirmId}
              onChange={setConfirmId}
              autoFocus
            />
            <div className={styles.devicePanelFooter}>
              <Button variant="danger" size="s" disabled={confirmId.trim() !== value} onClick={() => pick('')}>
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Sin aviso al quitar el guardado (Daniel, 29/10): el campo vacío ya lo dice, y como
          cualquier otro campo del drawer no se aplica hasta Save. El de "nuevo" sí: si no, un
          ID recién inventado se ve igual que uno elegido del inventario. */}
      {isNew && (
        <span className={styles.fieldDescription}>New {noun}. It will be created when you save.</span>
      )}
    </div>
  );
}

function ParamInput({ field, params, setParams, disabled }) {
  return (
    <Input
      label={field.label}
      value={params[field.key]}
      suffix={field.suffix}
      onChange={v => setParams(prev => ({ ...prev, [field.key]: v }))}
      disabled={disabled}
    />
  );
}

export default function EditUnitDrawer({ unit, center, onClose, onSave, role }) {
  // Los datos técnicos de la unit (modelo, tipo de instalación, estado) solo los cambia
  // Kamleon staff: `units.editAllFields`, `units.changeStatus` y `units.editParameters` son
  // exclusivos de Owner/Admin (docs/permissions.md). Center Admin y Org Admin abren el panel
  // (`units.edit`) pero ahí solo tocan idioma, descripción y los modos de login.
  const canEditTechnical = role === 'owner' || role === 'admin';
  // Figma 12500:413631 (Edit unit siendo Kamleon staff): Appearance, Messages y Parameters solo
  // los ve staff. Parameters se edita con `units.editParameters` (Owner/Admin); Editor lo ve.
  const isStaff = role === 'owner' || role === 'admin' || role === 'editor';
  const [messages, setMessages] = useState(() => MESSAGE_FIELDS.map(m => m.value));
  const [params, setParams]     = useState(() => Object.fromEntries(SCREEN_FIELDS.map(f => [f.key, f.value])));
  const [screenStatus, setScreenStatus] = useState('Active');
  // Devices (Figma 12500:413631, grupo Devices). Quitar uno lo deja sin unit al guardar.
  const [displayId, setDisplayId] = useState(unit?.display ? String(unit.display.id) : '');
  const [sensorId, setSensorId]   = useState(unit?.kpod ? String(unit.kpod.id) : '');
  const [language, setLanguage]       = useState('English');
  const [description, setDescription] = useState(unit?.description ?? '');
  // El mock guarda esto en `model` (con el typo "Embeded" en algunos centros).
  const [status, setStatus] = useState(unit?.status ?? 'active');
  const [model, setModel]   = useState(unit?.type ?? 'Stand');
  const [installation, setInstallation] = useState(() =>
    unit?.model === 'Embeded' ? 'Embedded' : (unit?.model ?? '')
  );
  const [loginModes, setLoginModes]   = useState(new Set(['On-screen', 'QR', 'RFID']));
  const [rosterTeams, setRosterTeams] = useState(new Set());
  const [rosterOpen, setRosterOpen]   = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterDropUp, setRosterDropUp] = useState(false);
  const rosterRef = useRef(null);

  useEffect(() => {
    if (!rosterOpen) return;
    function handleClick(e) {
      if (rosterRef.current && !rosterRef.current.contains(e.target)) { setRosterOpen(false); setRosterSearch(''); }
    }
    // capture phase: el modal del drawer hace stopPropagation en su propio
    // mousedown, así que un listener en fase de burbuja nunca vería el click.
    document.addEventListener('mousedown', handleClick, true);
    return () => document.removeEventListener('mousedown', handleClick, true);
  }, [rosterOpen]);

  const teams = center?.teams ?? [];

  useLayoutEffect(() => {
    if (!rosterOpen || !rosterRef.current) return;
    const triggerRect = rosterRef.current.getBoundingClientRect();
    const estimatedHeight = Math.min(teams.length * 40 + 24, 220);
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    setRosterDropUp(spaceBelow < estimatedHeight + 16 && triggerRect.top > estimatedHeight + 16);
  }, [rosterOpen, teams.length]);

  const initial = useMemo(() => ({
    language: 'English',
    status: unit?.status ?? 'active',
    model: unit?.type ?? 'Stand',
    installation: unit?.model === 'Embeded' ? 'Embedded' : (unit?.model ?? ''),
    description: unit?.description ?? '',
    loginModes: 'On-screen,QR,RFID',
    rosterTeams: '',
  }), [unit]);

  const isDirty =
    language !== initial.language ||
    status !== initial.status ||
    model !== initial.model ||
    installation !== initial.installation ||
    description !== initial.description ||
    [...loginModes].sort().join(',') !== initial.loginModes ||
    [...rosterTeams].sort().join(',') !== initial.rosterTeams ||
    messages.some((m, i) => m !== MESSAGE_FIELDS[i].value) ||
    SCREEN_FIELDS.some(f => params[f.key] !== f.value) ||
    screenStatus !== 'Active' ||
    displayId !== (unit?.display ? String(unit.display.id) : '') ||
    sensorId !== (unit?.kpod ? String(unit.kpod.id) : '');

  function deviceOptions(type, current) {
    return [...(current ? [String(current.id)] : []), ...getAvailable(type).map(d => String(d.id))];
  }

  function saveDevices() {
    [['display', displayId, unit?.display], ['sensor', sensorId, unit?.kpod]].forEach(([type, next, prev]) => {
      if (next === (prev ? String(prev.id) : '')) return;
      if (next === '') unassignDevice(type, unit);
      else if (!deviceExists(next)) createDevice(type, Number(next), unit);
      else assignDevice(type, Number(next), unit);
    });
  }

  function toggleLoginMode(mode) {
    setLoginModes(prev => {
      const next = new Set(prev);
      next.has(mode) ? next.delete(mode) : next.add(mode);
      if (mode === 'On-screen' && !next.has('On-screen')) setRosterOpen(false);
      return next;
    });
  }

  function toggleRosterTeam(teamId) {
    setRosterTeams(prev => {
      const next = new Set(prev);
      next.has(teamId) ? next.delete(teamId) : next.add(teamId);
      return next;
    });
  }

  const selectedTeams = teams.filter(t => rosterTeams.has(t.id));
  const onScreenEnabled = loginModes.has('On-screen');
  const visibleTeams = teams.filter(t =>
    t.name.toLowerCase().includes(rosterSearch.trim().toLowerCase())
  );

  return (
    <div className={shellStyles.overlay} onMouseDown={onClose}>
      <div className={shellStyles.modal} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={shellStyles.header}>
          <h2 className={shellStyles.title}>Edit unit</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* ── Body ── */}
        <div className={shellStyles.body}>

          <p className={styles.editingLine}>
            Editing <span className={styles.editingUnit}>Unit {String(unit?.id ?? '')}</span>
          </p>

          <h3 className={styles.sectionHeading}>Unit settings</h3>

          <div className={shellStyles.formRow}>
            <Input
              label="Unit ID"
              required
              value={String(unit?.id ?? '')}
              disabled
            />
            <Dropdown
              label="Urinal model"
              required
              options={['Stand', 'Seat']}
              value={model}
              onChange={setModel}
              disabled={!canEditTechnical}
            />
          </div>

          <div className={shellStyles.formRow}>
            <Dropdown
              label="Unit language"
              options={LANGUAGE_OPTIONS}
              value={language}
              onChange={setLanguage}
            />
            {/* Status conserva el punto de color (decisión de Daniel) y va sin asterisco: para
                Center Admin no es un campo obligatorio, es información que no puede tocar.
                Mismo patrón de dot + select que EditUserDrawer. */}
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Status</span>
              <div className={`${styles.statusField} ${canEditTechnical ? styles.statusFieldEditable : ''}`}>
                <span className={`${styles.statusDot} ${status !== 'active' ? styles.statusDotInactive : ''}`} />
                <select
                  className={styles.statusSelect}
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  disabled={!canEditTechnical}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <span className={styles.statusChevron}><IconChevronDown size={16} /></span>
              </div>
            </div>
          </div>

          <Dropdown
            label="Installation type"
            required
            placeholder="Select installation"
            options={INSTALLATION_OPTIONS}
            value={installation}
            onChange={setInstallation}
            disabled={!canEditTechnical}
          />

          <Textarea
            label="Description"
            placeholder="Write here..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Login mode</span>
            <span className={styles.fieldDescription}>How users can identify themselves at this unit.</span>
            <div className={styles.checkboxRow}>
              {LOGIN_MODES.map(({ id, tooltip }) => (
                <div key={id} className={styles.checkboxItem}>
                  <Checkbox
                    label={id}
                    checked={loginModes.has(id)}
                    onChange={() => toggleLoginMode(id)}
                  />
                  <span className={styles.infoIconWrap} data-tooltip={tooltip}>
                    <IconInfoCircle size={16} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Depende del modo de login "On-screen": si no está marcado, nadie va a ver esa lista,
              así que el campo se deshabilita — pero queda visible y con los equipos elegidos a la
              vista, porque la selección se guarda igual y esconderla sería perderla de vista. */}
          <div className={`${styles.field} ${!onScreenEnabled ? styles.fieldDisabled : ''}`}>
            <span className={styles.fieldLabel}>On-screen</span>
            <span className={styles.fieldDescription}>
              {onScreenEnabled
                ? 'Members of the selected teams will be displayed on the unit screen.'
                : 'Turn on the On-screen login mode above to choose which teams appear.'}
            </span>
            <div className={styles.rosterWrap} ref={rosterRef}>
              <button
                type="button"
                className={styles.rosterTrigger}
                onClick={() => setRosterOpen(v => !v)}
                disabled={!onScreenEnabled}
              >
                <span className={selectedTeams.length === 0 ? styles.rosterPlaceholder : styles.rosterValue}>
                  {selectedTeams.length === 0 ? 'Select an option' : `${selectedTeams.length} team${selectedTeams.length > 1 ? 's' : ''} selected`}
                </span>
                <span className={styles.rosterChevron}><IconChevronDown size={16} /></span>
              </button>
              {/* Figma 13060:137076: lista simple con buscador arriba, sin checkboxes.
                  Lo elegido se ve abajo en chips; acá se marca con un check a la derecha
                  para poder quitarlo desde la propia lista. */}
              {rosterOpen && (
                <div className={`${styles.rosterDropdown} ${rosterDropUp ? styles.rosterDropdownUp : ''}`}>
                  <div className={styles.rosterSearchRow}>
                    <IconSearch size={16} />
                    <input
                      className={styles.rosterSearchInput}
                      placeholder="Search..."
                      value={rosterSearch}
                      onChange={e => setRosterSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  {teams.length === 0 ? (
                    <p className={styles.rosterEmptyOption}>No teams in this center</p>
                  ) : visibleTeams.length === 0 ? (
                    <p className={styles.rosterEmptyOption}>No teams match "{rosterSearch}"</p>
                  ) : visibleTeams.map(team => (
                    <button
                      key={team.id}
                      type="button"
                      className={`${styles.rosterOption} ${rosterTeams.has(team.id) ? styles.rosterOptionSelected : ''}`}
                      onClick={() => toggleRosterTeam(team.id)}
                    >
                      <span className={styles.rosterOptionLabel}>{team.name}</span>
                      {rosterTeams.has(team.id) && (
                        <span className={styles.rosterCheck}><IconCheckCircle size={16} /></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedTeams.length > 0 && (
              <div className={styles.chipsRow}>
                {selectedTeams.map(team => (
                  <span key={team.id} className={styles.chip}>
                    {team.name}
                    <button type="button" className={styles.chipRemove} onClick={() => toggleRosterTeam(team.id)} disabled={!onScreenEnabled} aria-label={`Remove ${team.name}`}>
                      <IconClose size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {isStaff && (
            <>
              <div className={styles.group}>
                <p className={styles.overline}>Devices</p>
                <div className={shellStyles.formRow}>
                  <DeviceSelect
                    label="Display"
                    placeholder="Select a display"
                    options={deviceOptions('display', unit?.display)}
                    value={displayId}
                    onChange={setDisplayId}
                    saved={unit?.display ? String(unit.display.id) : null}
                  />
                  <DeviceSelect
                    label="Sensor"
                    placeholder="Select a sensor"
                    options={deviceOptions('sensor', unit?.kpod)}
                    value={sensorId}
                    onChange={setSensorId}
                    saved={unit?.kpod ? String(unit.kpod.id) : null}
                  />
                </div>
              </div>

              <div className={styles.group}>
                <p className={styles.overline}>Appearance</p>
                {UPLOAD_FIELDS.map(({ label, hint }) => (
                  <div key={label} className={styles.uploadField}>
                    <div className={styles.uploadText}>
                      <span className={styles.fieldLabel}>{label}</span>
                      <span className={styles.fieldDescription}>{hint}</span>
                    </div>
                    <button type="button" className={shellStyles.addBtn}>
                      <IconPlus size={16} /> Upload image
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.group}>
                <p className={styles.overline}>Messages</p>
                {MESSAGE_FIELDS.map(({ label }, i) => (
                  <Input
                    key={label}
                    label={label}
                    value={messages[i]}
                    onChange={v => setMessages(prev => prev.map((m, j) => (j === i ? v : m)))}
                  />
                ))}
              </div>

              <hr className={styles.divider} />
              <h3 className={styles.sectionHeading}>Parameters</h3>

              <div className={styles.groupTight}>
                <p className={styles.overline}>Screen</p>
                <div className={shellStyles.formRow}>
                  <Dropdown
                    label="Status"
                    options={['Active', 'Inactive']}
                    value={screenStatus}
                    onChange={setScreenStatus}
                    disabled={!canEditTechnical}
                  />
                  <ParamInput field={SCREEN_FIELDS[0]} params={params} setParams={setParams} disabled={!canEditTechnical} />
                </div>
                {[[1, 2], [3, 4], [5, 6]].map(([a, b]) => (
                  <div key={a} className={shellStyles.formRow}>
                    <ParamInput field={SCREEN_FIELDS[a]} params={params} setParams={setParams} disabled={!canEditTechnical} />
                    <ParamInput field={SCREEN_FIELDS[b]} params={params} setParams={setParams} disabled={!canEditTechnical} />
                  </div>
                ))}
              </div>

              {READONLY_GROUPS.map(({ title, fields }) => (
                <div key={title} className={styles.group}>
                  <p className={styles.overline}>{title}</p>
                  <div className={shellStyles.formRow}>
                    <Input label={fields[0][0]} placeholder={fields[0][1]} value="" onChange={() => {}} />
                    <Input label={fields[1][0]} placeholder={fields[1][1]} value="" onChange={() => {}} />
                  </div>
                  <div className={shellStyles.formRow}>
                    <Input label={fields[2][0]} placeholder={fields[2][1]} value="" onChange={() => {}} />
                    <div className={styles.formRowSpacer} />
                  </div>
                </div>
              ))}
            </>
          )}

        </div>

        {/* ── Footer ── */}
        <div className={`${shellStyles.footer} ${styles.footerNoBorder}`}>
          <Button variant="tertiary" size="m" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="m"
            disabled={!isDirty}
            onClick={() => { saveDevices(); onSave?.(unit); onClose(); }}
          >
            Save
          </Button>
        </div>

      </div>
    </div>
  );
}
