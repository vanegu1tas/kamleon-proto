import { useState, useRef, useEffect } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconAddImage, IconPlus, IconChevronMiniDown, IconChevronMiniRight } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Input from '../../../design-system/components/Input/Input';
import styles from './NewCenterDrawer.module.css';

// ─── Mock pool of unassigned units ────────────────────────

const AVAILABLE_UNITS = [
  { id: 'KML-0441', model: 'K-Series 3' },
  { id: 'KML-0442', model: 'K-Series 3' },
  { id: 'KML-0855', model: 'K-Series 4' },
  { id: 'KML-1102', model: 'K-Series 4' },
  { id: 'KML-1103', model: 'K-Series 4' },
  { id: 'KML-1210', model: 'K-Series 5' },
];

// ─── Unit dropdown with inline-create ─────────────────────

function UnitDropdown({ selected, onSelect, exclude = [] }) {
  const [open, setPanelOpen]   = useState(false);
  const [mode, setMode]         = useState('list'); // 'list' | 'create'
  const [search, setSearch]     = useState('');
  const [newId, setNewId]       = useState('');
  const [newModel, setNewModel] = useState('Stand');
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close();
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  function open_() { setPanelOpen(true); setMode('list'); setSearch(''); }
  function close()  { setPanelOpen(false); setMode('list'); setSearch(''); setNewId(''); setNewModel(''); }

  function handleSelect(unit) { onSelect(unit); close(); }

  function handleCreate() {
    if (!newId.trim() || !newModel.trim()) return;
    onSelect({ id: newId.trim(), model: newModel.trim() });
    close();
  }

  const pool     = AVAILABLE_UNITS.filter(u => !exclude.includes(u.id));
  const filtered = search.trim()
    ? pool.filter(u => u.id.toLowerCase().includes(search.toLowerCase()) || u.model.toLowerCase().includes(search.toLowerCase()))
    : pool;

  return (
    <div className={styles.unitWrap} ref={wrapRef}>

      {/* ── Trigger ── */}
      <button
        type="button"
        className={`${styles.unitTrigger} ${open ? styles.unitTriggerOpen : ''}`}
        onClick={() => open ? close() : open_()}
      >
        {selected
          ? <span className={styles.unitTriggerValue}>{selected.id} — {selected.model}</span>
          : <span className={styles.unitTriggerPlaceholder}>Select a unit...</span>
        }
        <IconChevronMiniDown size={16} className={`${styles.unitChevron} ${open ? styles.unitChevronOpen : ''}`} />
      </button>

      {/* ── Panel ── */}
      {open && (
        <div className={styles.unitPanel}>

          {mode === 'list' ? (
            <>
              <div className={styles.unitSearch}>
                <input
                  autoFocus
                  className={styles.unitSearchInput}
                  placeholder="Search units..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className={styles.unitList}>
                <button
                  type="button"
                  className={`${styles.unitOption} ${styles.unitOptionNew}`}
                  onClick={() => setMode('create')}
                >
                  <IconPlus size={14} />
                  <span>New unit</span>
                  <IconChevronMiniRight size={16} className={styles.unitOptionArrow} />
                </button>
                {filtered.length > 0 && <div className={styles.unitDivider} />}
                {filtered.map(u => (
                  <button key={u.id} type="button" className={styles.unitOption} onClick={() => handleSelect(u)}>
                    <span className={styles.unitOptionId}>{u.id}</span>
                    <span className={styles.unitOptionModel}>{u.model}</span>
                  </button>
                ))}
                {filtered.length === 0 && search.trim() && (
                  <p className={styles.unitEmpty}>No units match "{search}"</p>
                )}
                {filtered.length === 0 && !search.trim() && pool.length === 0 && (
                  <p className={styles.unitEmpty}>No available units</p>
                )}
              </div>
            </>
          ) : (
            <>
              <button type="button" className={styles.unitBackBtn} onClick={() => setMode('list')}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>New unit</span>
              </button>
              <div className={styles.unitCreateForm}>
                <div className={styles.unitCreateField}>
                  <label className={styles.unitCreateLabel}>ID</label>
                  <input
                    autoFocus
                    className={styles.unitCreateInput}
                    placeholder="e.g. KML-0441"
                    value={newId}
                    onChange={e => setNewId(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && newId.trim() && newModel.trim()) handleCreate(); }}
                  />
                </div>
                <div className={styles.unitCreateField}>
                  <label className={styles.unitCreateLabel}>Model</label>
                  <div className={styles.unitModelRadios}>
                    {['Stand', 'Seat'].map(opt => (
                      <label key={opt} className={styles.unitModelOption}>
                        <input
                          type="radio"
                          name="unit-model"
                          value={opt}
                          checked={newModel === opt}
                          onChange={() => setNewModel(opt)}
                          className={styles.unitModelRadioNative}
                        />
                        <span className={`${styles.unitModelCircle} ${newModel === opt ? styles.unitModelCircleChecked : ''}`} />
                        <span className={styles.unitModelOptionLabel}>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.unitCreateBtn}
                  disabled={!newId.trim() || !newModel.trim()}
                  onClick={handleCreate}
                >
                  Create
                </button>
              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
}

export default function NewCenterDrawer({ org, onClose }) {
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [addresses, setAddresses] = useState([]);
  const [contacts, setContacts]   = useState([]);
  const [units, setUnits]         = useState([]);
  const [adminEmails, setAdminEmails] = useState([]);

  // addresses
  function addAddress()          { setAddresses(prev => [...prev, '']); }
  function updateAddress(i, val) { setAddresses(prev => prev.map((a, idx) => idx === i ? val : a)); }
  function removeAddress(i)      { setAddresses(prev => prev.filter((_, idx) => idx !== i)); }

  // contacts
  function addContact()          { setContacts(prev => [...prev, '']); }
  function updateContact(i, val) { setContacts(prev => prev.map((c, idx) => idx === i ? val : c)); }
  function removeContact(i)      { setContacts(prev => prev.filter((_, idx) => idx !== i)); }

  // units — each entry is { id, model } | null
  function addUnit()          { setUnits(prev => [...prev, null]); }
  function updateUnit(i, val) { setUnits(prev => prev.map((u, idx) => idx === i ? val : u)); }
  function removeUnit(i)      { setUnits(prev => prev.filter((_, idx) => idx !== i)); }

  // admin emails
  function addAdmin()          { setAdminEmails(prev => [...prev, '']); }
  function updateAdmin(i, val) { setAdminEmails(prev => prev.map((e, idx) => idx === i ? val : e)); }
  function removeAdmin(i)      { setAdminEmails(prev => prev.filter((_, idx) => idx !== i)); }

  const canCreate = name.trim();

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>New Center</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* Context line */}
          <p className={styles.contextLine}>
            Creating center for <span className={styles.contextOrg}>{org.name}</span>
          </p>

          {/* Avatar row */}
          <div className={styles.avatarRow}>
            <div className={styles.avatar}>
              <IconAddImage size={24} />
            </div>
            <div className={styles.avatarText}>
              <button className={styles.addPictureBtn} type="button">Add picture</button>
              <span className={styles.avatarSep}>-</span>
              <span className={styles.avatarOptional}>Optional</span>
            </div>
          </div>

          {/* Fields */}
          <div className={styles.fields}>

            {/* Center name */}
            <Input
              label="Center name"
              required
              placeholder="Write here..."
              value={name}
              onChange={setName}
              autoFocus
            />

            {/* Email + Phone */}
            <div className={styles.formRow}>
              <Input
                label="Email"
                type="email"
                placeholder="Write here..."
                value={email}
                onChange={setEmail}
              />
              <Input
                label="Phone number"
                type="tel"
                placeholder="Write here..."
                value={phone}
                onChange={setPhone}
              />
            </div>

            {/* Address (múltiple) */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Address</label>
              <input
                className={styles.input}
                placeholder="Write your address here..."
              />
            </div>

            {addresses.map((addr, i) => (
              <div key={i} className={styles.addItemRow}>
                <input
                  className={styles.input}
                  placeholder="Write your address here..."
                  value={addr}
                  onChange={e => updateAddress(i, e.target.value)}
                />
                <button className={styles.removeItemBtn} type="button" onClick={() => removeAddress(i)} aria-label="Remove">
                  <IconClose size={14} />
                </button>
              </div>
            ))}

            <button className={styles.addBtn} type="button" onClick={addAddress}>
              <IconPlus size={16} />
              Add new address
            </button>

          </div>

          {/* Invite administrators */}
          <div className={styles.section}>
            <div className={styles.sectionInfo}>
              <p className={styles.sectionLabel}>Invite administrators</p>
              <p className={styles.sectionSubtitle}>Send email invitations to your center administrators</p>
            </div>

            {adminEmails.map((adminEmail, i) => (
              <div key={i} className={styles.addItemRow}>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="admin@example.com"
                  value={adminEmail}
                  onChange={e => updateAdmin(i, e.target.value)}
                />
                <button className={styles.removeItemBtn} type="button" onClick={() => removeAdmin(i)} aria-label="Remove">
                  <IconClose size={14} />
                </button>
              </div>
            ))}

            <button className={styles.addBtn} type="button" onClick={addAdmin}>
              <IconPlus size={16} />
              Add administrator
            </button>
          </div>

          {/* Link a Unit */}
          <div className={styles.section}>
            <div className={styles.sectionInfo}>
              <p className={styles.sectionLabel}>Link a unit</p>
              <p className={styles.sectionSubtitle}>Assign the unit that this center will use.</p>
            </div>

            {units.map((unit, i) => (
              <div key={i} className={styles.addItemRow}>
                <UnitDropdown
                  selected={unit}
                  onSelect={val => updateUnit(i, val)}
                  exclude={units.filter((u, idx) => idx !== i && u !== null).map(u => u.id)}
                />
                <button className={styles.removeItemBtn} type="button" onClick={() => removeUnit(i)} aria-label="Remove">
                  <IconClose size={14} />
                </button>
              </div>
            ))}

            <button className={styles.addBtn} type="button" onClick={addUnit}>
              <IconPlus size={16} />
              Link unit
            </button>
          </div>

          {/* Add contact information */}
          <div className={styles.section}>
            <div className={styles.sectionInfo}>
              <p className={styles.sectionLabel}>Add contact information</p>
              <p className={styles.sectionSubtitle}>Add the people to contact for this center.</p>
            </div>

            {contacts.map((contact, i) => (
              <div key={i} className={styles.addItemRow}>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="contact@example.com"
                  value={contact}
                  onChange={e => updateContact(i, e.target.value)}
                />
                <button className={styles.removeItemBtn} type="button" onClick={() => removeContact(i)} aria-label="Remove">
                  <IconClose size={14} />
                </button>
              </div>
            ))}

            <button className={styles.addBtn} type="button" onClick={addContact}>
              <IconPlus size={16} />
              Add Contact
            </button>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="tertiary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="m" disabled={!canCreate}>Create</Button>
        </div>

      </div>
    </div>
  );
}
