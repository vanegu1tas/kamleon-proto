import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Input from '../../../design-system/components/Input/Input';
import Dropdown from '../../../design-system/components/Dropdown/Dropdown';
import { IconClose, IconPlus } from '../../../design-system/icons/outline';
import styles from './NewCenterDrawer.module.css';
import nstyles from './NewUserDrawer.module.css';

function parseEmails(text) {
  return text
    .split(/[\s,;]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// InviteTeamAdminDrawer — invita un Team Admin por email a un equipo del centro.
// Figma: node 10481:73668. Estado "bulk" (invitar varios) reusa el patrón ya
// existente en NewUserDrawer (textarea + feedback de válidos/inválidos) — no
// hay Figma dedicado para ese estado todavía, se reutiliza el mismo patrón.
export default function InviteTeamAdminDrawer({ center, presetTeam = null, onClose, onSave }) {
  const teams = center?.teams ?? [];
  const [teamId, setTeamId]     = useState(presetTeam ? String(presetTeam.id) : '');
  const [inviteMode, setInviteMode] = useState('single'); // 'single' | 'bulk'
  const [email, setEmail]       = useState('');
  const [bulkText, setBulkText] = useState('');

  const selectedTeam = presetTeam ?? teams.find(t => String(t.id) === teamId);
  const bulkEmails      = parseEmails(bulkText);
  const validBulkEmails = bulkEmails.filter(isValidEmail);

  const canSave = inviteMode === 'single'
    ? !!selectedTeam && isValidEmail(email.trim())
    : !!selectedTeam && validBulkEmails.length > 0;

  function handleSend() {
    const emails = inviteMode === 'single' ? [email.trim()] : validBulkEmails;
    onSave?.(selectedTeam, emails);
    onClose();
  }

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>New Team admin</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          <p className={styles.contextLine}>
            A Team Admin manages this team day-to-day. They can invite and remove users, set up PIN and screen access, and view the team's data and reports. They'll receive an email to accept the role and access this team.
          </p>

          {!presetTeam && (
            <Dropdown
              label="Team"
              required
              description="Select the team for your new Team admin."
              placeholder="Select team…"
              options={teams.map(t => ({ label: t.name, value: String(t.id) }))}
              value={teamId}
              onChange={setTeamId}
            />
          )}

          {inviteMode === 'single' ? (<>
            <Input
              label="Add Team admin's email"
              required
              description="We will send an email to this email and then the Team admin should accept it."
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={setEmail}
              autoFocus
            />

            <button
              type="button"
              className={nstyles.addMoreLink}
              onClick={() => setInviteMode('bulk')}
            >
              <IconPlus size={14} /> Invite multiple Team admins
            </button>
          </>) : (<>
            <button
              type="button"
              className={nstyles.backLink}
              onClick={() => setInviteMode('single')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to single invite
            </button>

            <div className={nstyles.field}>
              <label className={nstyles.fieldLabel}>Emails <span className={nstyles.required}>*</span></label>
              <span className={nstyles.fieldSubDesc}>Paste emails separated by commas or spaces.</span>
              <textarea
                className={nstyles.bulkTextarea}
                placeholder="Paste mails here..."
                value={bulkText}
                onChange={e => setBulkText(e.target.value)}
                autoFocus
              />
              {bulkEmails.length > 0 && (
                <div className={nstyles.bulkFeedback}>
                  {validBulkEmails.length > 0 && (
                    <span className={nstyles.bulkValid}>{validBulkEmails.length} valid</span>
                  )}
                  {bulkEmails.length - validBulkEmails.length > 0 && (
                    <span className={nstyles.bulkInvalid}>{bulkEmails.length - validBulkEmails.length} invalid</span>
                  )}
                </div>
              )}
            </div>
          </>)}

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="m" disabled={!canSave} onClick={handleSend}>Send</Button>
        </div>

      </div>
    </div>
  );
}
