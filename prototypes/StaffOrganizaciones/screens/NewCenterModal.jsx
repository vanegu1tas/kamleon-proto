import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconAddImage, IconPlus } from '../../../design-system/icons/outline';
import { ORGS } from '../mockData';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Input from '../../../design-system/components/Input/Input';
import Dropdown from '../../../design-system/components/Dropdown/Dropdown';
import styles from './NewCenterModal.module.css';

export default function NewCenterModal({ org, onClose }) {
  const [selectedOrg, setSelectedOrg] = useState(org || null);
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [phone, setPhone]             = useState('');
  const [addresses, setAddresses]     = useState([]);
  const [contacts, setContacts]       = useState([]);
  const [units, setUnits]             = useState([]);
  const [adminEmails, setAdminEmails] = useState([]);

  // addresses
  function addAddress()          { setAddresses(prev => [...prev, '']); }
  function updateAddress(i, val) { setAddresses(prev => prev.map((a, idx) => idx === i ? val : a)); }
  function removeAddress(i)      { setAddresses(prev => prev.filter((_, idx) => idx !== i)); }

  // contacts
  function addContact()          { setContacts(prev => [...prev, '']); }
  function updateContact(i, val) { setContacts(prev => prev.map((c, idx) => idx === i ? val : c)); }
  function removeContact(i)      { setContacts(prev => prev.filter((_, idx) => idx !== i)); }

  // units
  function addUnit()          { setUnits(prev => [...prev, '']); }
  function updateUnit(i, val) { setUnits(prev => prev.map((u, idx) => idx === i ? val : u)); }
  function removeUnit(i)      { setUnits(prev => prev.filter((_, idx) => idx !== i)); }

  // admin emails
  function addAdmin()          { setAdminEmails(prev => [...prev, '']); }
  function updateAdmin(i, val) { setAdminEmails(prev => prev.map((e, idx) => idx === i ? val : e)); }
  function removeAdmin(i)      { setAdminEmails(prev => prev.filter((_, idx) => idx !== i)); }

  const canCreate = name.trim() && selectedOrg;

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

            {/* Organization — siempre visible */}
            <Dropdown
              label="Organization"
              required
              placeholder="Select organization"
              options={ORGS.map(o => ({ label: o.name, value: String(o.id) }))}
              value={selectedOrg ? String(selectedOrg.id) : ''}
              onChange={v => setSelectedOrg(ORGS.find(o => String(o.id) === v) || null)}
            />

            {/* Name */}
            <Input
              label="Name"
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
                <button
                  className={styles.removeItemBtn}
                  type="button"
                  onClick={() => removeAddress(i)}
                  aria-label="Remove"
                >
                  <IconClose size={14} />
                </button>
              </div>
            ))}

            <button className={styles.addBtn} type="button" onClick={addAddress}>
              <IconPlus size={16} />
              Add new address
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
                <button
                  className={styles.removeItemBtn}
                  type="button"
                  onClick={() => removeContact(i)}
                  aria-label="Remove"
                >
                  <IconClose size={14} />
                </button>
              </div>
            ))}

            <button className={styles.addBtn} type="button" onClick={addContact}>
              <IconPlus size={16} />
              Add Contact
            </button>
          </div>

          {/* Link a Unit */}
          <div className={styles.section}>
            <div className={styles.sectionInfo}>
              <p className={styles.sectionLabel}>Link a Unit</p>
              <p className={styles.sectionSubtitle}>Assign the unit that this center will use.</p>
            </div>

            {units.map((unit, i) => (
              <div key={i} className={styles.addItemRow}>
                <input
                  className={styles.input}
                  placeholder="Unit ID or name"
                  value={unit}
                  onChange={e => updateUnit(i, e.target.value)}
                />
                <button
                  className={styles.removeItemBtn}
                  type="button"
                  onClick={() => removeUnit(i)}
                  aria-label="Remove"
                >
                  <IconClose size={14} />
                </button>
              </div>
            ))}

            <button className={styles.addBtn} type="button" onClick={addUnit}>
              <IconPlus size={16} />
              Add new unit
            </button>
          </div>

          {/* Invite administrators */}
          <div className={styles.section}>
            <div className={styles.sectionInfo}>
              <p className={styles.sectionLabel}>Invite administrators</p>
              <p className={styles.sectionSubtitle}>
                Send email invitations to your center administrators
              </p>
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
                <button
                  className={styles.removeItemBtn}
                  type="button"
                  onClick={() => removeAdmin(i)}
                  aria-label="Remove"
                >
                  <IconClose size={14} />
                </button>
              </div>
            ))}

            <button className={styles.addBtn} type="button" onClick={addAdmin}>
              <IconPlus size={16} />
              Add administrator
            </button>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="m" disabled={!canCreate}>Create</Button>
        </div>

      </div>
    </div>
  );
}
