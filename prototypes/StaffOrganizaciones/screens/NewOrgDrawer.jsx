import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconAddImage, IconPlus, IconChevronDown } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import styles from './NewOrgDrawer.module.css';

const SEGMENTS = ['Sport', 'Fitness'];

export default function NewOrgDrawer({ onClose }) {
  const [name, setName]         = useState('');
  const [segment, setSegment]   = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [addresses, setAddresses] = useState(['']);

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

            {/* Row 1: Name + Segment */}
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  Name <span className={styles.required}>*</span>
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
                  Segment <span className={styles.required}>*</span>
                </label>
                <div className={styles.selectWrap}>
                  <select
                    className={styles.select}
                    value={segment}
                    onChange={e => setSegment(e.target.value)}
                  >
                    <option value="" disabled>Select segment</option>
                    {SEGMENTS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <IconChevronDown size={16} className={styles.selectIcon} />
                </div>
              </div>
            </div>

            {/* Row 2: Email + Phone */}
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
          <Button variant="primary" size="m" disabled={!canCreate}>Create</Button>
        </div>

      </div>
    </div>
  );
}
