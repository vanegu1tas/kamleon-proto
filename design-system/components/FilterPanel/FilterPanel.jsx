import { useState, useRef, useEffect } from 'react';
import ToolbarButton from '../ToolbarButton/ToolbarButton';
import { IconFilter } from '../../icons/outline';
import styles from './FilterPanel.module.css';

/**
 * FilterPanel
 *
 * Encapsula el ToolbarButton de "Filters" + el dropdown de secciones con checkboxes.
 *
 * Props:
 *   sections  – array de { key: string, label: string, options: { value, label }[] }
 *   values    – { [key]: Set<string> }  — estado actual de cada sección
 *   onChange  – (key: string, value: string) => void  — toggle de un valor
 *   onClear   – () => void  — limpia todos los filtros
 */
export default function FilterPanel({ sections = [], values = {}, onChange, onClear }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const activeCount = Object.values(values).reduce((sum, set) => sum + (set?.size ?? 0), 0);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <ToolbarButton
        icon={<IconFilter size={16} />}
        selected={activeCount > 0}
        onClick={() => setOpen(v => !v)}
      >
        Filters
        {activeCount > 0 && <span className={styles.badge}>{activeCount}</span>}
      </ToolbarButton>

      {open && (
        <div className={styles.dropdown}>
          {sections.map(section => {
            const selected = values[section.key] ?? new Set();
            return (
              <div key={section.key} className={styles.section}>
                <p className={styles.sectionLabel}>{section.label}</p>
                {section.options.map(opt => {
                  const checked = selected.has(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className={`${styles.option} ${checked ? styles.optionChecked : ''}`}
                    >
                      <input
                        type="checkbox"
                        className={styles.nativeCheck}
                        checked={checked}
                        onChange={() => onChange?.(section.key, opt.value)}
                      />
                      <span className={styles.checkBox}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                          <path
                            className={styles.checkMark}
                            d="M1 3.5L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className={styles.optionLabel}>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            );
          })}

          {activeCount > 0 && (
            <button className={styles.clearBtn} onClick={() => { onClear?.(); }}>
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
