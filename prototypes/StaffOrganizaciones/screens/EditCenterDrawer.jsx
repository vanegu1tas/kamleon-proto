import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconPlus } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Input from '../../../design-system/components/Input/Input';
import styles from './NewCenterDrawer.module.css';

export default function EditCenterDrawer({ center, org, onClose, role }) {
  const isClientRole = role === 'orgAdmin' || role === 'centerAdmin';
  // centers.editData (nombre, email, tel, dirección + contactos + Link a Unit): nadie del lado
  // cliente lo tiene, NI Editor (docs/permissions.md) — exclusivo de Owner/Admin.
  const readOnly = role !== 'owner' && role !== 'admin';
  // centers.editImage: Org Admin y Center Admin sí lo tienen — Editor y Team Admin no.
  const canEditImage = role === 'owner' || role === 'admin' || role === 'orgAdmin' || role === 'centerAdmin';
  const [name, setName]     = useState(center.name    ?? '');
  const [email, setEmail]   = useState(center.email   ?? '');
  const [phone, setPhone]   = useState(center.phone   ?? '');
  const [addresses, setAddresses] = useState(
    center.address ? [center.address] : []
  );
  const [contacts, setContacts] = useState(
    center.contacts ? center.contacts.map(c => ({ ...c })) : []
  );
  // center.units son objetos completos de unit (id, description, status, etc.) — este campo
  // solo necesita mostrar/editar el nombre, así que se convierten a string acá.
  const [units, setUnits] = useState(
    (center.units ?? []).map(u => typeof u === 'string' ? u : (u.description || String(u.id ?? '')))
  );

  // addresses
  function addAddress()          { setAddresses(prev => [...prev, '']); }
  function updateAddress(i, val) { setAddresses(prev => prev.map((a, idx) => idx === i ? val : a)); }
  function removeAddress(i)      { setAddresses(prev => prev.filter((_, idx) => idx !== i)); }

  // contacts
  function addContact() { setContacts(prev => [...prev, { name: '', cargo: '', email: '', phone: '' }]); }
  function updateContact(i, field, val) {
    setContacts(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  }
  function removeContact(i) { setContacts(prev => prev.filter((_, idx) => idx !== i)); }

  // units
  function addUnit()          { setUnits(prev => [...prev, '']); }
  function updateUnit(i, val) { setUnits(prev => prev.map((u, idx) => idx === i ? val : u)); }
  function removeUnit(i)      { setUnits(prev => prev.filter((_, idx) => idx !== i)); }

  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Center</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* Context line — solo tiene sentido para staff de Kamleon; un rol cliente ya sabe a qué org pertenece */}
          {org && !isClientRole && (
            <p className={styles.contextLine}>
              Editing center for <span className={styles.contextOrg}>{org.name}</span>
            </p>
          )}

          {/* Avatar row */}
          <div className={styles.avatarRow}>
            <div className={styles.avatar}>
              <span className={styles.avatarLetter}>{initial || '?'}</span>
            </div>
            {canEditImage && (
              <div className={styles.avatarText}>
                <button className={styles.addPictureBtn} type="button">Change picture</button>
              </div>
            )}
          </div>

          {/* Fields */}
          <div className={styles.fields}>

            <Input
              label="Center name"
              required
              placeholder="Write here..."
              value={name}
              onChange={setName}
              autoFocus={!readOnly}
              disabled={readOnly}
            />

            <div className={styles.formRow}>
              <Input
                label="Email"
                type="email"
                placeholder="Write here..."
                value={email}
                onChange={setEmail}
                disabled={readOnly}
              />
              <Input
                label="Phone number"
                type="tel"
                placeholder="Write here..."
                value={phone}
                onChange={setPhone}
                disabled={readOnly}
              />
            </div>

            {addresses.map((addr, i) => (
              <div key={i} className={`${styles.field} ${i === 0 ? '' : ''}`}>
                <label className={styles.fieldLabel}>
                  {i === 0 ? 'Address' : `Address ${i + 1}`}
                </label>
                <div className={styles.addItemRow}>
                  <input
                    className={styles.input}
                    placeholder="Write your address here..."
                    value={addr}
                    onChange={e => updateAddress(i, e.target.value)}
                    disabled={readOnly}
                  />
                  {addresses.length > 1 && !readOnly && (
                    <button className={styles.removeItemBtn} type="button" onClick={() => removeAddress(i)} aria-label="Remove">
                      <IconClose size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {!readOnly && (
              <button className={styles.addBtn} type="button" onClick={addAddress}>
                <IconPlus size={16} />
                Add new address
              </button>
            )}

          </div>

          {/* Add contact information */}
          {!readOnly && (
          <div className={styles.section}>
            <div className={styles.sectionInfo}>
              <p className={styles.sectionLabel}>Contact information</p>
              <p className={styles.sectionSubtitle}>People to contact for this center.</p>
            </div>
            {contacts.map((contact, i) => (
              <div key={i} className={styles.contactCard}>
                <div className={styles.contactCardHeader}>
                  <span className={styles.contactCardTitle}>Contact {i + 1}</span>
                  <button className={styles.removeItemBtn} type="button" onClick={() => removeContact(i)} aria-label="Remove contact">
                    <IconClose size={14} />
                  </button>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Name</label>
                    <input
                      className={styles.input}
                      placeholder="Write here..."
                      value={contact.name}
                      onChange={e => updateContact(i, 'name', e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Position</label>
                    <input
                      className={styles.input}
                      placeholder="Write here..."
                      value={contact.cargo}
                      onChange={e => updateContact(i, 'cargo', e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Email</label>
                    <input
                      className={styles.input}
                      type="email"
                      placeholder="Write here..."
                      value={contact.email}
                      onChange={e => updateContact(i, 'email', e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Phone</label>
                    <input
                      className={styles.input}
                      type="tel"
                      placeholder="Write here..."
                      value={contact.phone}
                      onChange={e => updateContact(i, 'phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button className={styles.addBtn} type="button" onClick={addContact}>
              <IconPlus size={16} />
              Add Contact
            </button>
          </div>
          )}

          {/* Link a Unit */}
          {!readOnly && (
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
                <button className={styles.removeItemBtn} type="button" onClick={() => removeUnit(i)} aria-label="Remove">
                  <IconClose size={14} />
                </button>
              </div>
            ))}
            <button className={styles.addBtn} type="button" onClick={addUnit}>
              <IconPlus size={16} />
              Add new unit
            </button>
          </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="tertiary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="m" disabled={readOnly || !name.trim()} onClick={onClose}>Save</Button>
        </div>

      </div>
    </div>
  );
}
