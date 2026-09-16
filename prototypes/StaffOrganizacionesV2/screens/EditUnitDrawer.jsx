import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import Button from '../../../design-system/components/Button/Button';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Input from '../../../design-system/components/Input/Input';
import Dropdown from '../../../design-system/components/Dropdown/Dropdown';
import Textarea from '../../../design-system/components/Textarea/Textarea';
import Checkbox from '../../../design-system/components/Checkbox/Checkbox';
import { IconClose, IconChevronDown } from '../../../design-system/icons/outline';
import shellStyles from '../../StaffOrganizaciones/screens/NewCenterDrawer.module.css';
import styles from './EditUnitDrawer.module.css';

const LANGUAGE_OPTIONS = ['English', 'Español', 'Français'];
const LOGIN_MODES = ['Public', 'Roster', 'QR', 'RFID'];

export default function EditUnitDrawer({ unit, center, onClose }) {
  const [language, setLanguage]       = useState('English');
  const [description, setDescription] = useState(unit?.description ?? '');
  const [loginModes, setLoginModes]   = useState(new Set(['Public']));
  const [rosterTeams, setRosterTeams] = useState(new Set());
  const [rosterOpen, setRosterOpen]   = useState(false);
  const [rosterDropUp, setRosterDropUp] = useState(false);
  const rosterRef = useRef(null);

  useEffect(() => {
    if (!rosterOpen) return;
    function handleClick(e) {
      if (rosterRef.current && !rosterRef.current.contains(e.target)) setRosterOpen(false);
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
    description: unit?.description ?? '',
    loginModes: 'Public',
    rosterTeams: '',
  }), [unit]);

  const isDirty =
    language !== initial.language ||
    description !== initial.description ||
    [...loginModes].sort().join(',') !== initial.loginModes ||
    [...rosterTeams].sort().join(',') !== initial.rosterTeams;

  function toggleLoginMode(mode) {
    setLoginModes(prev => {
      const next = new Set(prev);
      next.has(mode) ? next.delete(mode) : next.add(mode);
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

  return (
    <div className={shellStyles.overlay} onMouseDown={onClose}>
      <div className={shellStyles.modal} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={shellStyles.header}>
          <h2 className={shellStyles.title}>Edit Unit</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* ── Body ── */}
        <div className={shellStyles.body}>

          <p className={styles.editingLine}>
            Editing <span className={styles.editingUnit}>Unit {String(unit?.id ?? '')}</span>
          </p>

          <h3 className={styles.sectionHeading}>Unit Settings</h3>

          <div className={shellStyles.formRow}>
            <Input
              label="Unit ID"
              required
              value={String(unit?.id ?? '')}
              disabled
            />
            <Dropdown
              label="Urinal model"
              options={[{ label: 'Stand', value: 'Stand' }]}
              value="Stand"
              disabled
            />
          </div>

          <div className={shellStyles.formRow}>
            <Dropdown
              label="Language"
              options={LANGUAGE_OPTIONS}
              value={language}
              onChange={e => setLanguage(e.target.value)}
            />
            <div className={styles.field}>
              <div className={styles.labelRow}>
                <span className={styles.fieldLabel}>Status</span>
                <span className={styles.required}>*</span>
              </div>
              <div className={styles.statusField}>
                <span className={`${styles.statusDot} ${unit?.status !== 'active' ? styles.statusDotInactive : ''}`} />
                <span className={styles.statusValue}>{unit?.status === 'active' ? 'Active' : 'Disabled'}</span>
                <span className={styles.statusChevron}><IconChevronDown size={16} /></span>
              </div>
            </div>
          </div>

          <Textarea
            label="Description"
            placeholder="Write here..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Login mode</span>
            <div className={styles.checkboxRow}>
              {LOGIN_MODES.map(mode => (
                <Checkbox
                  key={mode}
                  label={mode}
                  checked={loginModes.has(mode)}
                  onChange={() => toggleLoginMode(mode)}
                />
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Screen roster</span>
            <div className={styles.rosterWrap} ref={rosterRef}>
              <button type="button" className={styles.rosterTrigger} onClick={() => setRosterOpen(v => !v)}>
                <span className={styles.rosterPlaceholder}>
                  {selectedTeams.length === 0 ? 'Select an option' : `${selectedTeams.length} team${selectedTeams.length > 1 ? 's' : ''} selected`}
                </span>
                <span className={styles.rosterChevron}><IconChevronDown size={16} /></span>
              </button>
              {rosterOpen && (
                <div className={`${styles.rosterDropdown} ${rosterDropUp ? styles.rosterDropdownUp : ''}`}>
                  {teams.length === 0 ? (
                    <p className={styles.rosterEmptyOption}>No teams in this center</p>
                  ) : teams.map(team => (
                    <Checkbox
                      key={team.id}
                      label={team.name}
                      checked={rosterTeams.has(team.id)}
                      onChange={() => toggleRosterTeam(team.id)}
                    />
                  ))}
                </div>
              )}
            </div>
            {selectedTeams.length > 0 && (
              <div className={styles.chipsRow}>
                {selectedTeams.map(team => (
                  <span key={team.id} className={styles.chip}>
                    {team.name}
                    <button type="button" className={styles.chipRemove} onClick={() => toggleRosterTeam(team.id)} aria-label={`Remove ${team.name}`}>
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
          <Button variant="primary" size="m" disabled={!isDirty} onClick={onClose}>Save</Button>
        </div>

      </div>
    </div>
  );
}
