import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconChevronDown, IconPlus } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import styles from './EditOrgDrawer.module.css';

const SEGMENTS = ['Sport', 'Fitness'];

// ─── Select ──────────────────────────────────────────────

function SelectField({ value, onChange, options, renderOption }) {
  return (
    <div className={styles.selectWrap}>
      <select
        className={styles.select}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{renderOption ? renderOption(opt) : opt}</option>
        ))}
      </select>
      <span className={styles.selectIcon}><IconChevronDown size={16} /></span>
    </div>
  );
}

// ─── Kamleon API expanded content ────────────────────────

function KamleonContent() {
  const [enabled,   setEnabled]   = useState(true);
  const [maxTokens, setMaxTokens] = useState('0');
  const [apiToken,  setApiToken]  = useState('••••••••••••••••••••••••••••••••');

  return (
    <div className={styles.integrationContent}>

      {/* Enable API toggle */}
      <div className={styles.integrationSettingRow}>
        <div className={styles.integrationSettingInfo}>
          <span className={styles.integrationSettingLabel}>Enable API</span>
          <span className={styles.integrationSettingDesc}>Short Description</span>
        </div>
        <button
          role="switch"
          aria-checked={enabled}
          className={`${styles.toggle} ${enabled ? styles.toggleOn : ''}`}
          onClick={() => setEnabled(v => !v)}
          type="button"
        />
      </div>

      {/* Max tokens + API Token — stacked verticalmente */}
      <div className={styles.integrationFields}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Max tokens per month</label>
          <div className={styles.inputWithBtn}>
            <input
              className={styles.input}
              value={maxTokens}
              onChange={e => setMaxTokens(e.target.value)}
            />
            <IconButton aria-label="Save" tooltip="Save">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2h9l3 3v9H2V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <rect x="5" y="9" width="6" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="4" y="2" width="5" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </IconButton>
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>API Token</label>
          <div className={styles.inputWithBtn}>
            <input
              className={styles.input}
              type="password"
              value={apiToken}
              onChange={e => setApiToken(e.target.value)}
            />
            <IconButton aria-label="Copy" tooltip="Copy">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-7A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H4" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </IconButton>
          </div>
        </div>
      </div>

      {/* Test API */}
      <div className={styles.integrationSettingRow}>
        <div className={styles.integrationSettingInfo}>
          <span className={styles.integrationSettingLabel}>Test API</span>
          <span className={styles.integrationSettingDesc}>Short Description</span>
        </div>
        <button className={styles.runTestBtn} type="button">Run Test</button>
      </div>

      {/* Tokens Consume */}
      <div className={styles.tokensSection}>
        <span className={styles.integrationSettingLabel}>Tokens Consume</span>
        <div className={styles.tokensTable}>
          <div className={styles.tokensTableHeader}>
            <span className={styles.tokensTableCell}>Year</span>
            <span className={styles.tokensTableCell}>Month</span>
            <span className={styles.tokensTableCell}>Tokens</span>
          </div>
          <div className={styles.tokensTableRow}>
            <span className={styles.tokensTableCell}>2026</span>
            <span className={styles.tokensTableCell}>March</span>
            <span className={styles.tokensTableCell}>0</span>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Integration row ─────────────────────────────────────

function IntegrationRow({ logo, name, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.integrationRow}>
      <button className={styles.integrationBtn} type="button" onClick={() => setOpen(v => !v)}>
        <div className={styles.integrationLeft}>
          <div className={styles.integrationLogo}>{logo}</div>
          <div className={styles.integrationInfo}>
            <span className={styles.integrationName}>{name}</span>
            <span className={styles.integrationStatus}>Enable</span>
          </div>
        </div>
        <span className={`${styles.integrationChevron} ${open ? styles.integrationChevronOpen : ''}`}>
          <IconChevronDown size={24} />
        </span>
      </button>
      {open && children}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────

export default function EditOrgDrawer({ org, onClose }) {
  const [name,      setName]      = useState(org.name     ?? '');
  const [segment,   setSegment]   = useState(org.segments ?? SEGMENTS[0]);
  const [email,     setEmail]     = useState(org.email    ?? '');
  const [phone,     setPhone]     = useState(org.phone    ?? '');
  const [addresses, setAddresses] = useState([org.fiscal  ?? org.address ?? '']);
  const [status,    setStatus]    = useState(org.status   ?? 'active');

  const initial = name.trim().charAt(0).toUpperCase();

  function addAddress() { setAddresses(prev => [...prev, '']); }
  function updateAddress(i, val) { setAddresses(prev => prev.map((a, idx) => idx === i ? val : a)); }
  function removeAddress(i) { setAddresses(prev => prev.filter((_, idx) => idx !== i)); }

  const hasChanges =
    name    !== (org.name     ?? '')         ||
    segment !== (org.segments ?? SEGMENTS[0])||
    email   !== (org.email    ?? '')         ||
    phone   !== (org.phone    ?? '')         ||
    status  !== (org.status   ?? 'active')   ||
    addresses[0] !== (org.fiscal ?? org.address ?? '');

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.drawer} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Organization</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* Avatar row */}
          <div className={styles.avatarRow}>
            <div className={styles.avatar}>{initial || '?'}</div>
            <div className={styles.avatarText}>
              <button className={styles.changePictureBtn} type="button">{org.picture ? 'Change picture' : 'Add picture'}</button>
              <span className={styles.avatarSep}>-</span>
              <span className={styles.avatarOptional}>Optional</span>
            </div>
          </div>

          {/* Organization info */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Organization info</h3>
            <div className={styles.fields}>

              {/* Name + Segment */}
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>
                    <span>Name <span className={styles.required}>*</span></span>
                  </label>
                  <input
                    className={styles.input}
                    placeholder="Write here..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>
                    <span>Segment <span className={styles.required}>*</span></span>
                  </label>
                  <SelectField
                    value={segment}
                    onChange={setSegment}
                    options={SEGMENTS}
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Email</label>
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="Write here..."
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Phone number</label>
                  <input
                    className={styles.input}
                    type="tel"
                    placeholder="Write here..."
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Address(es) */}
              <div className={styles.addressSection}>
                {addresses.map((addr, i) => (
                  <div key={i} className={styles.field}>
                    <label className={styles.fieldLabel}>
                      {i === 0 ? 'Address' : `Address ${i + 1}`}
                    </label>
                    {i === 0 ? (
                      <input
                        className={styles.input}
                        placeholder="Write your address here..."
                        value={addr}
                        onChange={e => updateAddress(i, e.target.value)}
                      />
                    ) : (
                      <div className={styles.addressRow}>
                        <input
                          className={styles.input}
                          placeholder="Write your address here..."
                          value={addr}
                          onChange={e => updateAddress(i, e.target.value)}
                        />
                        <button
                          className={styles.removeBtn}
                          type="button"
                          onClick={() => removeAddress(i)}
                          aria-label="Remove address"
                        >
                          <IconClose size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button className={styles.addAddressBtn} type="button" onClick={addAddress}>
                  <IconPlus size={16} />
                  Add new address
                </button>
              </div>

            </div>
          </div>

          {/* Settings */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Settings</h3>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Status</label>
              <div className={styles.selectWrap}>
                <span className={`${styles.statusDot} ${styles[status]}`} />
                <select
                  className={`${styles.select} ${styles.selectWithDot}`}
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <span className={styles.selectIcon}><IconChevronDown size={16} /></span>
              </div>
            </div>

            <div className={styles.subsectionLabel}>Integrations</div>
            <div className={styles.integrationsList}>
              <IntegrationRow
                name="Kamleon API"
                logo={
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="1.5"/>
                    <path d="M6 10h8M10 6v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                }
              >
                <KamleonContent />
              </IntegrationRow>
              <IntegrationRow
                name="Teamworks"
                logo={
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                }
              />
            </div>

          </div>

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="m" disabled={!hasChanges || !name.trim()} onClick={onClose}>Save</Button>
        </div>

      </div>
    </div>
  );
}
