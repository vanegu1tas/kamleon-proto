import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import Button from '../../../design-system/components/Button/Button';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Input from '../../../design-system/components/Input/Input';
import Dropdown from '../../../design-system/components/Dropdown/Dropdown';
import Textarea from '../../../design-system/components/Textarea/Textarea';
import Checkbox from '../../../design-system/components/Checkbox/Checkbox';
import { IconClose, IconChevronDown, IconInfoCircle, IconSearch, IconCheckCircle } from '../../../design-system/icons/outline';
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

export default function EditUnitDrawer({ unit, center, onClose, onSave, role }) {
  // Los datos técnicos de la unit (modelo, tipo de instalación, estado) solo los cambia
  // Kamleon staff: `units.editAllFields`, `units.changeStatus` y `units.editParameters` son
  // exclusivos de Owner/Admin (docs/permissions.md). Center Admin y Org Admin abren el panel
  // (`units.edit`) pero ahí solo tocan idioma, descripción y los modos de login.
  const canEditTechnical = role === 'owner' || role === 'admin';
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
    [...rosterTeams].sort().join(',') !== initial.rosterTeams;

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
              onChange={e => setModel(e.target.value)}
              disabled={!canEditTechnical}
            />
          </div>

          <div className={shellStyles.formRow}>
            <Dropdown
              label="Unit language"
              options={LANGUAGE_OPTIONS}
              value={language}
              onChange={e => setLanguage(e.target.value)}
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
            onChange={e => setInstallation(e.target.value)}
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

        </div>

        {/* ── Footer ── */}
        <div className={`${shellStyles.footer} ${styles.footerNoBorder}`}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="m"
            disabled={!isDirty}
            onClick={() => { onSave?.(unit); onClose(); }}
          >
            Save
          </Button>
        </div>

      </div>
    </div>
  );
}
