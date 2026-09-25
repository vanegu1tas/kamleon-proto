import { useState } from 'react';
import Button from '../../../design-system/components/Button/Button';
import Dropdown from '../../../design-system/components/Dropdown/Dropdown';
import shellStyles from '../../StaffOrganizaciones/screens/DeleteOrgModal.module.css';
import styles from './ExportReportModal.module.css';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function ExportReportModal({ onClose, onExport, scopeLabel }) {
  const now = new Date();
  const [month, setMonth] = useState(MONTHS[now.getMonth()]);
  const [year, setYear] = useState(String(now.getFullYear()));

  const years = Array.from({ length: 6 }, (_, i) => String(now.getFullYear() - i));

  return (
    <div className={shellStyles.overlay} onMouseDown={onClose}>
      <div className={shellStyles.modal} onMouseDown={e => e.stopPropagation()}>

        <div className={styles.contentWrap}>
          <h2 className={shellStyles.title}>Export report</h2>

          <div className={styles.group}>
            <p className={shellStyles.body}>Select a month and year to export your report.</p>

            <div className={styles.row}>
              <Dropdown
                label="Month"
                options={MONTHS}
                value={month}
                onChange={setMonth}
              />
              <Dropdown
                label="Year"
                options={years}
                value={year}
                onChange={setYear}
              />
            </div>

            {scopeLabel && (
              <p className={styles.note}>
                <span className={styles.noteLabel}>Scope:</span> This report only includes data from {scopeLabel}.
              </p>
            )}

            <p className={styles.note}>
              <span className={styles.noteLabel}>Note:</span> If the current month is selected, the report will cover from the 1st through today's date.
            </p>
          </div>
        </div>

        <div className={shellStyles.actions}>
          <Button variant="secondary" size="m" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="m" onClick={() => { onExport?.({ month, year }); onClose(); }}>Download report</Button>
        </div>

      </div>
    </div>
  );
}
