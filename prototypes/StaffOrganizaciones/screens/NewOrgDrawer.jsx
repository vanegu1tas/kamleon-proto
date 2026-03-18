import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconAddImage, IconPlus } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Input from '../../../design-system/components/Input/Input';
import Dropdown from '../../../design-system/components/Dropdown/Dropdown';
import styles from './NewOrgDrawer.module.css';

const SEGMENTS = ['Sport', 'Fitness'];

export default function NewOrgDrawer({ onClose }) {
  const [name, setName]               = useState('');
  const [segment, setSegment]         = useState('');
  const [contactName, setContactName] = useState('');
  const [position, setPosition]       = useState('');
  const [email, setEmail]             = useState('');
  const [phone, setPhone]             = useState('');
  const [addresses, setAddresses]     = useState(['']);

  function addAddress() {
    setAddresses(prev => [...prev, '']);
  }

  function updateAddress(i, val) {
    setAddresses(prev => prev.map((a, idx) => idx === i ? val : a));
  }

  function removeAddress(i) {
    setAddresses(prev => prev.filter((_, idx) => idx !== i));
  }

  const canCreate = name.trim() && segment;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.drawer} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>New Organization</h2>
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

            {/* Row 1: Organization Name + Segment */}
            <div className={styles.formRow}>
              <Input
                label="Organization Name"
                required
                placeholder="Write here..."
                value={name}
                onChange={setName}
                autoFocus
              />
              <Dropdown
                label="Segment"
                required
                placeholder="Select segment"
                options={SEGMENTS}
                value={segment}
                onChange={setSegment}
              />
            </div>

            {/* Contact information section */}
            <span className={styles.sectionLabel}>Contact information</span>

            {/* Row 2: Contact Name + Position */}
            <div className={styles.formRow}>
              <Input
                label="Name"
                placeholder="Write here..."
                value={contactName}
                onChange={setContactName}
              />
              <Input
                label="Position"
                placeholder="Write here..."
                value={position}
                onChange={setPosition}
              />
            </div>

            {/* Row 3: Email + Phone */}
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

            {/* Row 3: Address(es) */}
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

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="m" disabled={!canCreate} onClick={() => onClose(true)}>Create</Button>
        </div>

      </div>
    </div>
  );
}
