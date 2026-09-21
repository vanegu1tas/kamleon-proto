import { useState } from 'react';
import { IconClose } from '../../../design-system/icons/outline';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import Button from '../../../design-system/components/Button/Button';
import Toast from '../../../design-system/components/Toast/Toast';
import styles from './NotificationsDrawer.module.css';

const AVATAR_GRADIENT = 'linear-gradient(45deg, #00c9a7 0%, #60a5fa 100%)';

// Las invitaciones llegan de fuera (rolePersonas → StaffOrganizacionesV2): son las mismas
// que cuenta el badge del sidebar. Acá solo se agrupan por el momento en que llegaron.
function groupInvites(invites) {
  const order = [];
  const byGroup = new Map();
  invites.forEach(invite => {
    const label = invite.group ?? 'Earlier';
    if (!byGroup.has(label)) { byGroup.set(label, []); order.push(label); }
    byGroup.get(label).push(invite);
  });
  return order.map(label => ({ label, notifications: byGroup.get(label) }));
}

function NotifItem({ notif, onAccept, onDecline }) {
  const [agreed, setAgreed]       = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [shaking, setShaking]     = useState(false);

  const hasError = attempted && !agreed;

  function handleToggle() {
    const next = !agreed;
    setAgreed(next);
    if (next) setAttempted(false);
  }

  function handleAccept() {
    if (!agreed) {
      setAttempted(true);
      setShaking(true);
      return;
    }
    onAccept(notif.id);
  }

  return (
    <div className={styles.notif}>
      <div className={styles.notifRow}>
        <div className={styles.avatar} style={{ background: AVATAR_GRADIENT }}>
          {notif.initials}
        </div>
        <div className={styles.dotWrap}>
          <span className={`${styles.dot} ${notif.unread ? styles.dotUnread : styles.dotRead}`} />
        </div>
        <div className={styles.content}>
          <p className={styles.message}>
            <span className={styles.msgName}>{notif.name} </span>
            <span className={styles.msgAction}>{notif.action} </span>
            <span className={styles.msgTarget}>{notif.target}</span>
          </p>
          <label
            className={`${styles.checkRow} ${shaking ? styles.shake : ''}`}
            onAnimationEnd={() => setShaking(false)}
          >
            <input
              type="checkbox"
              className={styles.nativeCheck}
              checked={agreed}
              onChange={handleToggle}
            />
            <span className={`${styles.checkBox} ${hasError ? styles.checkBoxError : ''}`}>
              {agreed && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                  <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className={`${styles.checkLabel} ${hasError ? styles.checkLabelError : ''}`}>
              I agree to the{' '}
              <span className={styles.checkLink}>Privacy Policy</span>
            </span>
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.declineBtn} onClick={() => onDecline(notif.id)}>Decline</button>
        <Button size="s" style={{ flex: 1 }} onClick={handleAccept}>
          Accept
        </Button>
      </div>
    </div>
  );
}

export default function NotificationsDrawer({ invites = [], onResolve, onClose }) {
  const [toast, setToast] = useState(false);

  function handleAccept(id) {
    onResolve?.(id);
    setToast(true);
  }

  function handleDecline(id) {
    onResolve?.(id);
  }

  const visibleGroups = groupInvites(invites);

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.drawer} onMouseDown={e => e.stopPropagation()}>

        <div className={styles.header}>
          <h2 className={styles.title}>Notifications</h2>
          <IconButton onClick={onClose} aria-label="Close">
            <IconClose size={16} />
          </IconButton>
        </div>

        <div className={styles.body}>
          {visibleGroups.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>You're all caught up</p>
            </div>
          ) : (
            visibleGroups.map(group => (
              <div key={group.label} className={styles.group}>
                <span className={styles.groupLabel}>{group.label}</span>
                <div className={styles.groupNotifications}>
                  {group.notifications.map(notif => (
                    <NotifItem key={notif.id} notif={notif} onAccept={handleAccept} onDecline={handleDecline} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {toast && (
        <Toast
          mode="success"
          message="Invitation accepted"
          duration={4000}
          onClose={() => setToast(false)}
        />
      )}
    </div>
  );
}
