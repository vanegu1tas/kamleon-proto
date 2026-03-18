import { useState, useRef } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconAddImage } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Toggle from '../../../design-system/components/Toggle/Toggle';
import SegmentedControl from '../../../design-system/components/SegmentedControl/SegmentedControl';
import Input from '../../../design-system/components/Input/Input';
import Dropdown from '../../../design-system/components/Dropdown/Dropdown';
import styles from './NewUserDrawer.module.css';

function SettingRow({ label, description, checked, onChange }) {
  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <span className={styles.settingLabel}>{label}</span>
        <span className={styles.settingDesc}>{description}</span>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
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
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [phone,      setPhone]      = useState('');
  const [birthDay,   setBirthDay]   = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear,  setBirthYear]  = useState('');
  const [gender,     setGender]     = useState('');
  const [height,     setHeight]     = useState('');
  const [weight,     setWeight]     = useState('');
  const [role,       setRole]       = useState('');
  const [rfid,       setRfid]       = useState(false);
  const [pin,        setPin]        = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(preselectedTeam?.id ?? '');

  // ── Derived ──
  const bulkEmails        = parseEmails(bulkText);
  const validBulkEmails   = bulkEmails.filter(isValidEmail);
  const invalidBulkEmails = bulkEmails.filter(e => !isValidEmail(e));

  const contextTeam = preselectedTeam ?? teams.find(t => t.id === Number(selectedTeamId));

  // ── Footer button ──
  let primaryLabel    = 'Create';
  let primaryDisabled = true;

  if (mode === 'invite') {
    if (inviteMode === 'single') {
      primaryLabel    = 'Send';
      primaryDisabled = !inviteEmail.trim() || !inviteRole || (!preselectedTeam && !selectedTeamId);
    } else {
      const n = validBulkEmails.length;
      primaryLabel    = n > 0 ? `Send ${n}` : 'Send';
      primaryDisabled = n === 0 || !bulkRole || (!preselectedTeam && !selectedTeamId);
    }
  } else {
    primaryLabel    = 'Create user';
    primaryDisabled = !name.trim() || !role || (!preselectedTeam && !selectedTeamId);
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
                    value={String(selectedTeamId)}
                    onChange={setSelectedTeamId}
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
                    value={String(selectedTeamId)}
                    onChange={setSelectedTeamId}
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

            {/* Description */}
            <p className={styles.manualDesc}>
              These users will be added for{' '}
              <strong>{contextTeam?.name ?? center?.name ?? 'this team'}</strong>{' '}
              immediately, without sending an invitation email or waiting for them to accept it.
            </p>

            {/* Avatar row */}
            <div className={styles.avatarRow}>
              <div className={styles.avatar}>
                {name.trim()
                  ? <span className={styles.avatarInitial}>{name.trim().charAt(0).toUpperCase()}</span>
                  : <IconAddImage size={24} />
                }
              </div>
              <div className={styles.avatarText}>
                <button className={styles.addPictureBtn} type="button">Add picture</button>
                <span className={styles.avatarSep}>-</span>
                <span className={styles.avatarOptional}>Optional</span>
              </div>
            </div>

            {/* Fields */}
            <div className={styles.section}>

              <Input
                label="Name"
                required
                placeholder="Full name"
                value={name}
                onChange={setName}
                autoFocus
              />

              <Dropdown
                label="User role"
                required
                placeholder="Select role"
                options={[
                  { label: 'User', value: 'user' },
                  { label: 'Professional', value: 'professional' },
                ]}
                value={role}
                onChange={setRole}
              />

              <div className={styles.fieldRow}>
                <Input label="Email" placeholder="email@example.com" value={email} onChange={setEmail} />
                <Input label="Phone" placeholder="+1 000 000 0000" value={phone} onChange={setPhone} />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Date of birth</label>
                  <div className={styles.dateInputs}>
                    <input className={styles.input} placeholder="Day"   value={birthDay}   onChange={e => setBirthDay(e.target.value)}   style={{ textAlign: 'center' }} />
                    <input className={styles.input} placeholder="Month" value={birthMonth} onChange={e => setBirthMonth(e.target.value)} style={{ textAlign: 'center' }} />
                    <input className={styles.input} placeholder="Year"  value={birthYear}  onChange={e => setBirthYear(e.target.value)}  style={{ textAlign: 'center' }} />
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
                  value={gender}
                  onChange={setGender}
                />
              </div>

              <div className={styles.fieldRow}>
                <Input label="Height" placeholder="e.g. 178 cm" value={height} onChange={setHeight} />
                <Input label="Weight" placeholder="e.g. 75 kg" value={weight} onChange={setWeight} />
              </div>

            </div>

            {/* Team assignment — only when not pre-selected */}
            {!preselectedTeam && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Assignment</h3>
                <Dropdown
                  label="Team"
                  required
                  placeholder="Select a team…"
                  options={teams.map(t => ({ label: t.name, value: String(t.id) }))}
                  value={String(selectedTeamId)}
                  onChange={setSelectedTeamId}
                />
              </div>
            )}

            {/* Settings */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Settings</h3>
              <div className={styles.settingsList}>
                <SettingRow
                  label="RFID"
                  description="Allow this user to log in via proximity card."
                  checked={rfid}
                  onChange={setRfid}
                />
                <SettingRow
                  label="Set PIN"
                  description="Require this user to enter a personal PIN to log in."
                  checked={pin}
                  onChange={setPin}
                />
              </div>
            </div>

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
