import { useState, useRef } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconAddImage, IconPlus, IconChevronMiniDown } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Toggle from '../../../design-system/components/Toggle/Toggle';
import SegmentedControl from '../../../design-system/components/SegmentedControl/SegmentedControl';
import Input from '../../../design-system/components/Input/Input';
import Dropdown from '../../../design-system/components/Dropdown/Dropdown';
import styles from './NewUserDrawer.module.css';

function QuestionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.5 6.25C6.5 5.42 7.17 4.75 8 4.75s1.5.67 1.5 1.5c0 .7-.48 1.28-1.13 1.44C7.94 7.84 7.75 8.17 7.75 8.5v.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7.75" cy="10.75" r="0.6" fill="currentColor" />
    </svg>
  );
}

// ─── Email parsing helpers ────────────────────────────────

function parseEmails(text) {
  return text
    .split(/[\s,;]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Component ───────────────────────────────────────────

/**
 * NewUserDrawer — creates or invites a new user.
 *
 * Props:
 *   center           — the center the user will belong to (for context label)
 *   team             — if provided, the team is pre-selected (no selector shown)
 *   teams            — list of all teams in the center (used when team is not pre-selected)
 *   onClose          — called when the drawer should be dismissed
 */
function defaultManualUser(preselectedTeamId) {
  return {
    id: Math.random(),
    name: '', role: '', email: '', phone: '',
    birthDay: '', birthMonth: '', birthYear: '',
    gender: '', height: '', weight: '',
    displayedOnScreen: false, rfid: false, pin: false,
    selectedTeamId: preselectedTeamId ? String(preselectedTeamId) : '',
    moreInfoOpen: false,
  };
}

export default function NewUserDrawer({ center, team: preselectedTeam, teams = [], onClose }) {
  const [mode, setMode] = useState('invite'); // 'invite' | 'manual'

  // ── Invite state ──
  const [inviteMode, setInviteMode] = useState('single'); // 'single' | 'bulk'
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole]   = useState('');
  const [bulkText,   setBulkText]     = useState('');
  const [bulkRole,   setBulkRole]     = useState('');
  const fileInputRef = useRef(null);

  // ── Manual state ──
  const [manualUsers, setManualUsers] = useState([defaultManualUser(preselectedTeam?.id)]);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [inviteSelectedTeamId, setInviteSelectedTeamId] = useState(preselectedTeam?.id ?? '');

  function addManualUser() {
    setManualUsers(prev => [...prev, defaultManualUser(preselectedTeam?.id)]);
  }
  function removeManualUser(id) {
    setManualUsers(prev => prev.filter(u => u.id !== id));
  }
  function updateManualUser(id, field, value) {
    setManualUsers(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
  }

  // ── Derived ──
  const bulkEmails        = parseEmails(bulkText);
  const validBulkEmails   = bulkEmails.filter(isValidEmail);
  const invalidBulkEmails = bulkEmails.filter(e => !isValidEmail(e));

  // ── Footer button ──
  let primaryLabel    = 'Create';
  let primaryDisabled = true;

  if (mode === 'invite') {
    if (inviteMode === 'single') {
      primaryLabel    = 'Send';
      primaryDisabled = !inviteEmail.trim() || !inviteRole || (!preselectedTeam && !inviteSelectedTeamId);
    } else {
      const n = validBulkEmails.length;
      primaryLabel    = n > 0 ? `Send ${n}` : 'Send';
      primaryDisabled = n === 0 || !bulkRole || (!preselectedTeam && !inviteSelectedTeamId);
    }
  } else {
    primaryLabel    = 'Create';
    primaryDisabled = !privacyAccepted || manualUsers.some(u => !u.name.trim() || !u.role || (!preselectedTeam && !u.selectedTeamId));
  }

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.drawer} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>New User</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* Segmented control */}
          <SegmentedControl
            options={[
              { label: 'By invite', value: 'invite' },
              { label: 'Manually', value: 'manual' },
            ]}
            value={mode}
            onChange={v => { setMode(v); setInviteMode('single'); }}
          />

          {/* ══ INVITE MODE ══════════════════════════════════ */}
          {mode === 'invite' && (

            <div className={styles.section}>

              {inviteMode === 'single' ? (<>

                <p className={styles.inviteDesc}>Send email invitations to your Team's users.</p>

                <Input
                  label="Add User's email"
                  required
                  placeholder="example@gmail.com"
                  value={inviteEmail}
                  onChange={setInviteEmail}
                  autoFocus
                />

                <Dropdown
                  label="User role"
                  required
                  description="Select the type of user that you want to add."
                  placeholder="Select a role…"
                  options={[
                    { label: 'User', value: 'user' },
                    { label: 'Professional', value: 'professional' },
                  ]}
                  value={inviteRole}
                  onChange={setInviteRole}
                />

                {!preselectedTeam && (
                  <Dropdown
                    label="Team"
                    required
                    description="Select the team this user will join."
                    placeholder="Select a team…"
                    options={teams.map(t => ({ label: t.name, value: String(t.id) }))}
                    value={String(inviteSelectedTeamId)}
                    onChange={setInviteSelectedTeamId}
                  />
                )}

                <button
                  type="button"
                  className={styles.addMoreLink}
                  onClick={() => setInviteMode('bulk')}
                >
                  + Invite multiple users
                </button>

              </>) : (<>

                <p className={styles.inviteDesc}>Send email invitations to your Team's users.</p>

                <button
                  type="button"
                  className={styles.backLink}
                  onClick={() => setInviteMode('single')}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back to single invite
                </button>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Emails <span className={styles.required}>*</span></label>
                  <span className={styles.fieldSubDesc}>Paste emails separated by commas or spaces.</span>
                  <textarea
                    className={styles.bulkTextarea}
                    placeholder="Paste mails here..."
                    value={bulkText}
                    onChange={e => setBulkText(e.target.value)}
                    autoFocus
                  />
                  {bulkEmails.length > 0 && (
                    <div className={styles.bulkFeedback}>
                      {validBulkEmails.length > 0 && (
                        <span className={styles.bulkValid}>{validBulkEmails.length} valid</span>
                      )}
                      {invalidBulkEmails.length > 0 && (
                        <span className={styles.bulkInvalid}>{invalidBulkEmails.length} invalid</span>
                      )}
                    </div>
                  )}
                </div>

                <Dropdown
                  label="User role"
                  required
                  description="Assign a user role to these emails."
                  placeholder="Select a role…"
                  options={[
                    { label: 'User', value: 'user' },
                    { label: 'Professional', value: 'professional' },
                  ]}
                  value={bulkRole}
                  onChange={setBulkRole}
                />

                {!preselectedTeam && (
                  <Dropdown
                    label="Team"
                    required
                    description="Select the team these users will join."
                    placeholder="Select a team…"
                    options={teams.map(t => ({ label: t.name, value: String(t.id) }))}
                    value={String(inviteSelectedTeamId)}
                    onChange={setInviteSelectedTeamId}
                  />
                )}

                <div className={styles.bulkOr}>
                  <span className={styles.bulkOrLine} />
                  <span className={styles.bulkOrText}>OR</span>
                  <span className={styles.bulkOrLine} />
                </div>

                <button
                  type="button"
                  className={styles.csvUploadBtn}
                  onClick={() => fileInputRef.current?.click()}
                >
                  + Upload CSV or Excel
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className={styles.hiddenFileInput}
                />

                <p className={styles.csvHelperText}>
                  The file must have two columns: email and user role. The accepted values for user role are User and Professional. Download our a{' '}
                  <button type="button" className={styles.csvTemplateLink}>template here.</button>
                </p>

              </>)}
            </div>
          )}

          {/* ══ MANUAL MODE ══════════════════════════════════ */}
          {mode === 'manual' && (<>

            <p className={styles.manualDesc}>
              These users will be added immediately, without sending an invitation email or waiting for them to accept it.
            </p>

            <div className={styles.cardsSection}>
            {/* User cards */}
            <div className={styles.userCardsList}>
              {manualUsers.map((user, index) => (
                <div key={user.id} className={styles.userCard}>

                  {/* Card header */}
                  <div className={styles.userCardHeader}>
                    <span className={styles.userCardLabel}>New User {index + 1}</span>
                    {manualUsers.length > 1 && (
                      <button
                        type="button"
                        className={styles.userCardRemove}
                        onClick={() => removeManualUser(user.id)}
                        aria-label="Remove user"
                      >
                        <IconClose size={16} />
                      </button>
                    )}
                  </div>

                  {/* Avatar row */}
                  <div className={styles.avatarRow}>
                    <div className={styles.avatar}>
                      {user.name.trim()
                        ? <span className={styles.avatarInitial}>{user.name.trim().charAt(0).toUpperCase()}</span>
                        : <IconAddImage size={24} />
                      }
                    </div>
                    <div className={styles.avatarText}>
                      <button className={styles.addPictureBtn} type="button">Add picture</button>
                      <span className={styles.avatarSep}>-</span>
                      <span className={styles.avatarOptional}>Optional</span>
                    </div>
                  </div>

                  {/* Team — only when not pre-selected */}
                  {!preselectedTeam && (
                    <Dropdown
                      label="Team"
                      required
                      description="Select the team for your new user"
                      placeholder="Select team"
                      options={teams.map(t => ({ label: t.name, value: String(t.id) }))}
                      value={user.selectedTeamId}
                      onChange={v => updateManualUser(user.id, 'selectedTeamId', v)}
                      onSubtle
                    />
                  )}

                  {/* Name + Role */}
                  <div className={styles.fieldRow}>
                    <Input
                      label="Name"
                      required
                      placeholder="Full name"
                      value={user.name}
                      onChange={v => updateManualUser(user.id, 'name', v)}
                      autoFocus={index === 0}
                      onSubtle
                    />
                    <Dropdown
                      label="Role"
                      required
                      placeholder="Select role"
                      options={[
                        { label: 'User', value: 'user' },
                        { label: 'Professional', value: 'professional' },
                      ]}
                      value={user.role}
                      onChange={v => updateManualUser(user.id, 'role', v)}
                      onSubtle
                    />
                  </div>

                  {/* Toggles */}
                  <div className={styles.togglesList}>
                    {[
                      { field: 'displayedOnScreen', label: 'Displayed on Screen', tooltip: "The player accepts that their image will appear on the unit's display" },
                      { field: 'rfid',              label: 'Enable RFID',          tooltip: 'Enable proximity device access for this user.'                       },
                      { field: 'pin',               label: 'Set PIN',              tooltip: 'Enabling this requires the user to enter a personal PIN to log in.'  },
                    ].map(({ field, label, tooltip }) => (
                      <div key={field} className={styles.toggleRow}>
                        <div className={styles.toggleRowLabel}>
                          <span className={styles.toggleLabelText}>{label}</span>
                          <span className={styles.questionIcon} data-tooltip={tooltip}>
                            <QuestionIcon />
                          </span>
                        </div>
                        <Toggle
                          checked={user[field]}
                          onChange={v => updateManualUser(user.id, field, v)}
                          size="s"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className={styles.cardDivider} />

                  {/* Add more info toggle */}
                  <button
                    type="button"
                    className={styles.moreInfoToggle}
                    onClick={() => updateManualUser(user.id, 'moreInfoOpen', !user.moreInfoOpen)}
                  >
                    <span>Add More Info</span>
                    <span style={{ display: 'flex', transform: user.moreInfoOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>
                      <IconChevronMiniDown size={16} />
                    </span>
                  </button>

                  {/* More info fields */}
                  {user.moreInfoOpen && (
                    <div className={styles.moreInfoSection}>
                      <div className={styles.fieldRow}>
                        <div className={styles.field}>
                          <label className={styles.fieldLabel}>Date of birth</label>
                          <div className={styles.dateInputs}>
                            <input className={`${styles.input} ${styles.inputOnSubtle}`} placeholder="Day"   value={user.birthDay}   onChange={e => updateManualUser(user.id, 'birthDay', e.target.value)}   style={{ textAlign: 'center' }} />
                            <input className={`${styles.input} ${styles.inputOnSubtle}`} placeholder="Month" value={user.birthMonth} onChange={e => updateManualUser(user.id, 'birthMonth', e.target.value)} style={{ textAlign: 'center' }} />
                            <input className={`${styles.input} ${styles.inputOnSubtle}`} placeholder="Year"  value={user.birthYear}  onChange={e => updateManualUser(user.id, 'birthYear', e.target.value)}  style={{ textAlign: 'center' }} />
                          </div>
                        </div>
                        <Dropdown
                          label="Gender"
                          placeholder="Select gender"
                          options={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                            { label: 'Other', value: 'other' },
                          ]}
                          value={user.gender}
                          onChange={v => updateManualUser(user.id, 'gender', v)}
                          onSubtle
                        />
                      </div>
                      <div className={styles.fieldRow}>
                        <Input label="Height" placeholder="e.g. 178 cm" value={user.height} onChange={v => updateManualUser(user.id, 'height', v)} onSubtle />
                        <Input label="Weight" placeholder="e.g. 75 kg" value={user.weight} onChange={v => updateManualUser(user.id, 'weight', v)} onSubtle />
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>

            {/* Add new user */}
            <button type="button" className={styles.addUserBtn} onClick={addManualUser}>
              <IconPlus size={16} />
              Add new user
            </button>
            {/* Privacy policy */}
            <label className={styles.privacyRow}>
              <input
                type="checkbox"
                className={styles.privacyCheckbox}
                checked={privacyAccepted}
                onChange={e => setPrivacyAccepted(e.target.checked)}
              />
              <span className={styles.privacyText}>
                The user accepts Kamleon's{' '}
                <button type="button" className={styles.privacyLink} onClick={e => e.preventDefault()}>privacy policy</button>.
              </span>
            </label>
            </div>{/* end cardsSection */}

          </>)}

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="m" disabled={primaryDisabled} onClick={onClose}>
            {primaryLabel}
          </Button>
        </div>

      </div>
    </div>
  );
}
