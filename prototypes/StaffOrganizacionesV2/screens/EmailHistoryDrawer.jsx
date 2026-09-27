import { useEffect, useState } from 'react';
import Tag from '../../../design-system/components/Tag/Tag';
import Button from '../../../design-system/components/Button/Button';
import IconButton from '../../../design-system/components/IconButton/IconButton';
import ToolbarButton from '../../../design-system/components/ToolbarButton/ToolbarButton';
import { IconClose, IconMail, IconChevronDown, IconResend, IconTrash } from '../../../design-system/icons/outline';
import { getEmailHistory } from './emailHistoryMock';
import styles from './EmailHistoryDrawer.module.css';

// Figma: Web App 2.0 → "Email history Drawer" (nodo 12800:135260), caso delay.
// Feature del programador y solo para Kamleon staff (Owner/Admin). El historial es emulado:
// ver emailHistoryMock.js.

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'invitation', label: 'Invitations' },
  { id: 'other', label: 'Other mails' },
];

const DELAY_RESEND_NOTE = 'The invitation cannot be resent because the previous one has not yet been received.';

function EmailCard({ email, expanded, onToggle, onResend, onCancel }) {
  return (
    <div className={styles.card}>
      <button
        type="button"
        className={styles.cardHeader}
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <div className={styles.cardSummary}>
          <div className={styles.cardTitleRow}>
            <span className={styles.cardType}>{email.type}</span>
            <Tag status={email.status} />
          </div>
          {expanded && (
            <>
              <p className={styles.metaLine}>
                <span className={styles.metaLabel}>Last update:</span> {email.lastUpdate}
              </p>
              <p className={styles.metaLine}>
                <span className={styles.metaLabel}>Mail ID:</span> {email.mailId}
              </p>
            </>
          )}
        </div>
        <span className={`${styles.chevron} ${expanded ? styles.chevronUp : ''}`}>
          <IconChevronDown size={24} />
        </span>
      </button>

      {expanded && (
        <>
          <div className={styles.history}>
            <h3 className={styles.historyTitle}>History</h3>
            <ol className={styles.timeline}>
              {email.events.map((event, i) => (
                <li key={event.label} className={styles.event}>
                  <span className={styles.eventRail} aria-hidden="true">
                    <span className={`${styles.dot} ${event.status === 'warning' ? styles.dotWarning : ''}`} />
                    {i < email.events.length - 1 && <span className={styles.connector} />}
                  </span>
                  <div className={styles.eventBody}>
                    <div className={styles.eventRow}>
                      <span className={styles.eventLabel}>{event.label}</span>
                      <span className={styles.eventDate}>{event.at}</span>
                    </div>
                    {event.description && <p className={styles.eventDescription}>{event.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {email.pendingInvitation && (
            <div className={styles.cardFooter}>
              {!email.canResend && <p className={styles.footerNote}>{DELAY_RESEND_NOTE}</p>}
              <div className={styles.footerActions}>
                <Button
                  variant="subtle"
                  size="s"
                  leftIcon={<IconResend size={16} />}
                  disabled={!email.canResend}
                  onClick={onResend}
                >
                  Resend invitation
                </Button>
                <Button
                  variant="subtleDanger"
                  size="s"
                  leftIcon={<IconTrash size={16} />}
                  onClick={onCancel}
                >
                  Cancel invitation
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function EmailHistoryDrawer({ row, onClose, onResend, onCancel }) {
  const [filter, setFilter] = useState('all');
  const emails = getEmailHistory(row);
  // La primera card (la invitación, que es la que motivó abrir el drawer) arranca abierta.
  const [expanded, setExpanded] = useState(() => new Set(emails[0] ? [emails[0].id] : []));

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose?.(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const visible = emails.filter(e => filter === 'all' || e.category === filter);

  function toggle(id) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-history-title"
        onMouseDown={e => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id="email-history-title" className={styles.title}>Email history</h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <IconClose size={16} />
          </IconButton>
        </header>

        <div className={styles.body}>
          <div className={styles.recipient}>
            <IconMail size={24} />
            <span className={styles.recipientEmail}>{row.email}</span>
          </div>

          <div className={styles.filters} role="group" aria-label="Filter emails">
            {FILTERS.map(f => (
              <ToolbarButton key={f.id} selected={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
              </ToolbarButton>
            ))}
          </div>

          <div className={styles.cards}>
            {visible.length === 0 && (
              <p className={styles.empty}>
                {filter === 'other' ? 'No other emails sent to this address.' : 'No emails in this category.'}
              </p>
            )}
            {visible.map(email => (
              <EmailCard
                key={email.id}
                email={email}
                expanded={expanded.has(email.id)}
                onToggle={() => toggle(email.id)}
                onResend={() => { onResend?.(row); onClose?.(); }}
                onCancel={() => { onCancel?.(row); onClose?.(); }}
              />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
