import { useState } from 'react';
import Button   from '../../../design-system/components/Button/Button';
import Input    from '../../../design-system/components/Input/Input';
import { IconClose, IconAddImage, IconChevronDown } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import styles from './EditTeamDrawer.module.css';

function StatusSelect({ value, onChange }) {
  return (
    <div className={styles.statusField}>
      <div className={styles.statusLabelRow}>
        <span className={styles.statusLabel}>Status</span>
      </div>
      <div className={styles.statusSelectWrap}>
        <span className={`${styles.statusDot} ${styles[value]}`} />
        <select
          className={styles.statusSelect}
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <span className={styles.statusSelectChevron}><IconChevronDown size={16} /></span>
      </div>
    </div>
  );
}

export default function EditTeamDrawer({ team, center, onClose, onSave, role }) {
  const isClientRole = role === 'orgAdmin' || role === 'centerAdmin' || role === 'teamAdmin';
  const [name,        setName]        = useState(team.name ?? '');
  const [description, setDescription] = useState(team.description ?? '');
  const [status,      setStatus]      = useState(team.status ?? 'active');

  const initial = name.trim().charAt(0).toUpperCase();

  const hasChanges =
    name        !== (team.name ?? '') ||
    description !== (team.description ?? '') ||
    status      !== (team.status ?? 'active');

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.drawer} onMouseDown={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>Edit team</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </div>

        {/* ── Subtitle — solo tiene sentido para staff de Kamleon; un rol cliente ya sabe en qué centro está ── */}
        {center && !isClientRole && (
          <div className={styles.subtitleRow}>
            <p className={styles.subtitle}>
              Editing Team for <strong>{center.name}</strong>
            </p>
          </div>
        )}

        {/* ── Avatar row ── */}
        <div className={styles.avatarRow}>
          <div className={styles.avatar}>
            <IconAddImage size={24} />
          </div>
          <div className={styles.avatarText}>
            <button className={styles.changePictureBtn} type="button">Add picture</button>
            <span className={styles.avatarSep}>-</span>
            <span className={styles.avatarOptional}>Optional</span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* Fields */}
          <div className={styles.fields}>
            <Input
              label="Team name"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Write here..."
            />
            <Input
              label="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Write here..."
            />
            <StatusSelect value={status} onChange={setStatus} />
          </div>

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="m"
            disabled={!hasChanges || !name.trim()}
            onClick={() => { onSave({ name: name.trim(), description: description.trim(), status }); onClose(); }}
          >Save</Button>
        </div>

      </div>
    </div>
  );
}
