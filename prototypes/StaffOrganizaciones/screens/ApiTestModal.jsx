import { useState, useMemo } from 'react';
import { ORGS, USERS_POOL } from '../mockData';
import Button from '../../../design-system/components/Button/Button';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Toggle from '../../../design-system/components/Toggle/Toggle';
import Dropdown from '../../../design-system/components/Dropdown/Dropdown';
import { IconClose } from '../../../design-system/icons/outline';
import styles from './ApiTestModal.module.css';

function IconCopy() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-7A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H4" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M1.5 6.5h13" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function ApiTestModal({ org, onClose, noOverlay = false }) {
  const [selectedOrgId, setSelectedOrgId] = useState(String(org?.id ?? ''));
  const [enableApi,     setEnableApi]     = useState(true);
  const [apiToken]                        = useState('••••••••••••••••••••••••••••••••');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [average,       setAverage]       = useState(true);
  const [startDate,     setStartDate]     = useState('26/04/2026');
  const [endDate,       setEndDate]       = useState('26/04/2026');
  const [copied,        setCopied]        = useState(false);

  const selectedOrg = useMemo(() => ORGS.find(o => String(o.id) === selectedOrgId), [selectedOrgId]);

  const teams = useMemo(() => {
    if (!selectedOrg) return [];
    return selectedOrg.centers.flatMap(c => c.teams ?? []);
  }, [selectedOrg]);

  const selectedTeam = useMemo(() => teams.find(t => String(t.id) === selectedTeamId), [teams, selectedTeamId]);

  const users = useMemo(() => {
    if (!selectedTeam) return [];
    return (selectedTeam.users ?? []).map(uid => USERS_POOL.find(u => u.id === uid)).filter(Boolean);
  }, [selectedTeam]);

  const orgOptions  = ORGS.map(o => ({ label: o.name,  value: String(o.id) }));
  const teamOptions = teams.map(t => ({ label: t.name,  value: String(t.id) }));
  const userOptions = users.map(u => ({ label: u.name,  value: String(u.id) }));

  function handleOrgChange(val)  { setSelectedOrgId(val); setSelectedTeamId(''); setSelectedUserId(''); }
  function handleTeamChange(val) { setSelectedTeamId(val); setSelectedUserId(''); }

  function handleCopy() {
    navigator.clipboard?.writeText(apiToken).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const modal = (
      <div className={styles.modal} onMouseDown={e => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>API Test</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* Body */}
        <div className={styles.body}>

          <Dropdown
            label="Select organization"
            placeholder="Select..."
            options={orgOptions}
            value={selectedOrgId}
            onChange={handleOrgChange}
          />

          <span className={styles.overline}>API Settings</span>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Enable API</span>
              <span className={styles.settingDesc}>Short Description</span>
            </div>
            <Toggle checked={enableApi} onChange={setEnableApi} label={false} />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>API Token</label>
            <div className={styles.inputWithBtn}>
              <input
                className={styles.input}
                type="password"
                value={apiToken}
                readOnly
              />
              <button
                className={styles.iconBtn}
                type="button"
                onClick={handleCopy}
                title={copied ? 'Copied!' : 'Copy'}
              >
                <IconCopy />
              </button>
            </div>
          </div>

          <div className={styles.formRow}>
            <Dropdown
              label="Select team"
              placeholder="Select..."
              options={teamOptions}
              value={selectedTeamId}
              onChange={handleTeamChange}
              disabled={!selectedOrg || teams.length === 0}
            />
            <Dropdown
              label="Select user"
              placeholder="Select..."
              options={userOptions}
              value={selectedUserId}
              onChange={setSelectedUserId}
              disabled={!selectedTeamId}
            />
          </div>

          <span className={styles.overline}>Measures Settings</span>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Average</span>
              <span className={styles.settingDesc}>Short Description</span>
            </div>
            <Toggle checked={average} onChange={setAverage} label={false} />
          </div>

          <div className={styles.dateRow}>
            <div className={styles.dateFields}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Start date</label>
                <div className={styles.dateInputWrap}>
                  <input
                    className={styles.input}
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                  <span className={styles.calendarIcon}><IconCalendar /></span>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>End date</label>
                <div className={styles.dateInputWrap}>
                  <input
                    className={styles.input}
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                  <span className={styles.calendarIcon}><IconCalendar /></span>
                </div>
              </div>
            </div>
            <Button variant="primary" size="m">Get measures</Button>
          </div>

        </div>
      </div>
  );

  if (noOverlay) return modal;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      {modal}
    </div>
  );
}
