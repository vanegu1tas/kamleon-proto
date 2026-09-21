// Historial de correos EMULADO para el drawer "Email history".
//
// En el sistema real lo arma el programador desde el gestor de correos, que nunca se va a
// conectar a este prototipo: acá solo generamos un historial verosímil a partir de la fila
// de la tabla de Admins, para poder mostrar cómo se ve cada caso. Por ahora: entregado y
// delay (la incidencia de sara.diaz en mockData.js). El rebote queda para después.

const DELAY_DESCRIPTION =
  "The recipient's mail server is temporarily not accepting messages. Kamleon will keep retrying automatically.";

// Mail ID con pinta de identificador del gestor, estable por email + tipo.
function mailId(email, kind) {
  let h = 0;
  for (const ch of `${email}:${kind}`) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h.toString(36).padStart(7, '0') + (h * 7).toString(36).slice(0, 7);
}

// "11/Aug/26" + hora → "11/Aug/26 · 13:59", el formato de fecha del resto del prototipo.
function at(date, time) {
  return `${date ?? '—'} · ${time}`;
}

/**
 * @param {object} row - Fila de InvitationsTable ({ email, status, sentAgo, deliveryIssue, kind })
 * @returns {Array<{ id, category: 'invitation'|'other', type, status: 'delay'|'delivered',
 *   lastUpdate, mailId, events: Array<{ label, at, status, description? }>, canResend }>}
 */
export function getEmailHistory(row) {
  if (!row) return [];
  const date = row.status === 'active' ? '02/Jul/26' : row.sentAgo;
  const isDelay = row.deliveryIssue === 'delay';

  const invitation = {
    id: 'invitation',
    category: 'invitation',
    type: 'Admin invitation',
    status: isDelay ? 'delay' : 'delivered',
    lastUpdate: at(date, isDelay ? '14:00' : '13:59'),
    mailId: mailId(row.email, 'invitation'),
    events: [
      { label: 'Sent', at: at(date, '13:59'), status: 'ok' },
      { label: 'Injection', at: at(date, '13:59'), status: 'ok' },
      isDelay
        ? { label: 'Delay', at: at(date, '14:00'), status: 'warning', description: DELAY_DESCRIPTION }
        : { label: 'Delivered', at: at(date, '13:59'), status: 'ok' },
    ],
    // Solo tiene sentido reenviar una invitación que sigue pendiente, y no mientras la anterior
    // todavía está en camino (delay).
    pendingInvitation: row.status !== 'active',
    canResend: row.status !== 'active' && !isDelay,
  };

  // "Other mails" = correos transaccionales de la cuenta (ej. restablecer contraseña). La
  // lista exacta la define el programador. Solo para admins activos: alguien con la
  // invitación pendiente todavía no tiene acceso, así que no pudo pedir una contraseña nueva.
  const passwordReset = {
    id: 'password-reset',
    category: 'other',
    type: 'Password reset',
    status: 'delivered',
    lastUpdate: at('03/Sep/26', '18:42'),
    mailId: mailId(row.email, 'password-reset'),
    events: [
      { label: 'Sent', at: at('03/Sep/26', '18:42'), status: 'ok' },
      { label: 'Injection', at: at('03/Sep/26', '18:42'), status: 'ok' },
      { label: 'Delivered', at: at('03/Sep/26', '18:42'), status: 'ok' },
    ],
    pendingInvitation: false,
    canResend: false,
  };

  return row.status === 'active' ? [invitation, passwordReset] : [invitation];
}
