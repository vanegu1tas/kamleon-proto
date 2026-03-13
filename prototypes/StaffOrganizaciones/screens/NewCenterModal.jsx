import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import { IconClose, IconAddImage, IconPlus, IconChevronDown } from '../../../design-system/icons/outline';
import { ORGS } from '../mockData';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import styles from './NewCenterModal.module.css';

export default function NewCenterModal({ org, onClose }) {
  const [selectedOrg, setSelectedOrg] = useState(org || null);
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [phone, setPhone]             = useState('');
  const [address, setAddress]         = useState('');
  const [adminEmails, setAdminEmails] = useState([]);
  const [units, setUnits]             = useState([]);

  function addUnit() {
    setUnits(prev => [...prev, '']);
  }

  function updateUnit(i, val) {
    setUnits(prev => prev.map((u, idx) => idx === i ? val : u));
  }

  function removeUnit(i) {
    setUnits(prev => prev.filter((_, idx) => idx !== i));
  }

  const activeOrg = selectedOrg;

  function addAdmin() {
    setAdminEmails(prev => [...prev, '']);
  }

  function updateAdmin(i, val) {
    setAdminEmails(prev => prev.map((e, idx) => idx === i ? val : e));
  }

  function removeAdmin(i) {
    setAdminEmails(prev => prev.filter((_, idx) => idx !== i));
  }

  const canCreate = name.trim() && activeOrg;

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

          {/* Subtitle dinámica */}
          <p className={styles.subtitle}>
            {activeOrg
              ? <>New Center for <span className={styles.subtitleOrg}>{activeOrg.name}</span></>
              : 'New Center for…'}
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

            {/* Organization selector — solo cuando no viene con org pre-seleccionada */}
            {!org && (
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  Organization <span className={styles.required}>*</span>
                </label>
                <div className={styles.selectWrap}>
                  <select
                    className={styles.select}
                    value={selectedOrg?.id ?? ''}
                    onChange={e => {
                      const found = ORGS.find(o => String(o.id) === e.target.value);
                      setSelectedOrg(found || null);
                    }}
                  >
                    <option value="" disabled>Select organization</option>
                    {ORGS.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                  <IconChevronDown size={16} className={styles.selectIcon} />
                </div>
              </div>
            )}

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

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Address</label>
              <input
                className={styles.input}
                placeholder="Write your address here..."
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

          </div>

          {/* Invite administrators */}
          <div className={styles.inviteSection}>
            <div className={styles.inviteInfo}>
              <p className={styles.inviteLabel}>Invite administrators</p>
              <p className={styles.inviteSubtitle}>
                Send email invitations to your center administrators
              </p>
            </div>

            {adminEmails.map((adminEmail, i) => (
              <div key={i} className={styles.adminEmailRow}>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="admin@example.com"
                  value={adminEmail}
                  onChange={e => updateAdmin(i, e.target.value)}
                />
                <button
                  className={styles.removeAdminBtn}
                  type="button"
                  onClick={() => removeAdmin(i)}
                  aria-label="Remove"
                >
                  <IconClose size={14} />
                </button>
              </div>
            ))}

            <button className={styles.addAdminBtn} type="button" onClick={addAdmin}>
              <IconPlus size={16} />
              Add administrator
            </button>
          </div>

          {/* Link units */}
          <div className={styles.inviteSection}>
            <div className={styles.inviteInfo}>
              <p className={styles.inviteLabel}>Link unit</p>
              <p className={styles.inviteSubtitle}>description</p>
            </div>

            {units.map((unit, i) => (
              <div key={i} className={styles.adminEmailRow}>
                <input
                  className={styles.input}
                  placeholder="Unit ID or name"
                  value={unit}
                  onChange={e => updateUnit(i, e.target.value)}
                />
                <button
                  className={styles.removeAdminBtn}
                  type="button"
                  onClick={() => removeUnit(i)}
                  aria-label="Remove"
                >
                  <IconClose size={14} />
                </button>
              </div>
            ))}

            <button className={styles.addAdminBtn} type="button" onClick={addUnit}>
              <IconPlus size={16} />
              Add new unit
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
